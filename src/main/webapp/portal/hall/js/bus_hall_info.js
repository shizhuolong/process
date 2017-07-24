var nowData = [];
var field=["GROUP_ID_1_NAME","HALL_NUM","HALL_NUM_OLD","HALL_NUM_NEW","ML_ALL","ML_OLD","ML_NEW","QX_NUM","QX_NUM1","QX_NUM2"];
var title=[["州市","厅规模（个）","其中原有厅（个）","其中新增厅（个）","总毛利","原有厅毛利（万元）","新增厅毛利（万元）","覆盖区县数（个）","未覆盖区县数（个）","覆盖率"]];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_EFF_ANA_MON"));
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 25;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var sql=getSql();
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	report.showSubRow();
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '自营厅建设月建厅效能分析-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(){
	dealDate=$("#dealDate").val();
	return "SELECT T.GROUP_ID_1_NAME                                                                                           "+
	"      ,T.HALL_NUM                                                                                                         "+
	"      ,T1.HALL_NUM    HALL_NUM_OLD                                                                                        "+
	"      ,T.HALL_NUM-T1.HALL_NUM    HALL_NUM_NEW                                                                             "+
	"      ,NVL(T2.THIS_ML_NUM,0)     ML_ALL                                                                                   "+
	"      ,NVL(T2.THIS_ML_NUM,0)-NVL(T3.THIS_ML_NUM,0)  ML_OLD                                                                "+
	"      ,NVL(T3.THIS_ML_NUM,0)             ML_NEW                                                                           "+
	"      ,NVL(T4.QX_NUM,0)              QX_NUM                                                                               "+
	"      ,NVL(T5.QX_NUM,0)-NVL(T4.QX_NUM,0)  QX_NUM1                                                                         "+
	"      ,PODS.GET_RADIX_POINT(NVL(T4.QX_NUM,0)/NVL(T5.QX_NUM,0)*100 || '%',0) QX_NUM2                                       "+
	"FROM (                                                                                                                    "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                         "+
	"      ,COUNT(DISTINCT HALL_ID)  HALL_NUM                                                                                  "+
	"      ,ROUND(SUM(ML_SR_ACC)/10000,2                               )  THIS_ML_NUM                                          "+
	"      ,COUNT(DISTINCT GROUP_ID_2) GROUP_ID_2_NUM                                                                          "+
	"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                                          "+
	"WHERE DEAL_DATE  ="+dealDate+"                                                                                            "+
	"      AND OPERATE_TYPE='自营'                                                                                              "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                          "+
	") T                                                                                                                       "+
	"LEFT JOIN (                                                                                                               "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                         "+
	"      ,COUNT(HALL_ID) HALL_NUM                                                                                            "+
	"       ,ROUND(SUM(ML_SR_ACC)/10000,2)  THIS_ML_NUM                                                                        "+
	"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                                          "+
	"WHERE DEAL_DATE="+getLastYearEndMon(dealDate)+"                                                                           "+
	"  AND OPERATE_TYPE='自营'                                                                                                  "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                          "+
	")T1 ON (T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                             "+
	"LEFT JOIN (                                                                                                               "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                         "+
	"      ,COUNT(HALL_ID) HALL_NUM                                                                                            "+
	"       ,ROUND(SUM(ML_SR_ACC)/10000,2)  THIS_ML_NUM                                                                        "+
	"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                                          "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                "+
	"      AND OPERATE_TYPE='自营'                                                                                              "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                          "+
	")T2 ON (T.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                                                             "+
	"LEFT JOIN (                                                                                                               "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                         "+
	"      ,COUNT(HALL_ID)  HALL_NUM                                                                                           "+
	"      ,ROUND(SUM(ML_SR_ACC)/10000,2)  THIS_ML_NUM                                                                         "+
	"      ,COUNT(DISTINCT GROUP_ID_2) GROUP_ID_2_NUM                                                                          "+
	"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                                          "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+" AND OPERATE_TYPE='自营'                         "+
	"  AND HALL_ID  NOT IN (SELECT HALL_ID                                                                                     "+
	"                       FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                   "+
	"                       WHERE DEAL_DATE= "+getLastYearEndMon(dealDate)+"                                                   "+
	"                         AND OPERATE_TYPE='自营' )                                                                         "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                          "+
	") T3 ON (T.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                            "+
	"LEFT JOIN (                                                                                                               "+
	"          SELECT T1.REGION_NAME_ABBR GROUP_ID_1_NAME                                                                      "+
	"                ,COUNT(DISTINCT CASE WHEN GROUP_ID_2_NAME IS NOT NULL THEN GROUP_ID_2_NAME END)  QX_NUM                   "+
	"          FROM PTEMP.TB_TEMP_BUS_HALL_INFO T                                                                              "+
	"          JOIN PCDE.TB_CDE_REGION_CODE T1                                                                                 "+
	"          ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                                  "+
	"          WHERE DEAL_DATE="+dealDate+"                                                                                    "+
	"            AND IS_BALL=1 AND OPERATE_TYPE='自营'                                                                          "+
	"          GROUP BY T1.REGION_NAME_ABBR                                                                                    "+
	"          UNION ALL                                                                                                       "+
	"          SELECT '全省'                                                                                                    "+
	"                ,COUNT(DISTINCT CASE WHEN GROUP_ID_2_NAME IS NOT NULL THEN GROUP_ID_2_NAME END)  QX_NUM                   "+
	"          FROM PTEMP.TB_TEMP_BUS_HALL_INFO T                                                                              "+
	"          JOIN PCDE.TB_CDE_REGION_CODE T1                                                                                 "+
	"          ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                                  "+
	"          WHERE DEAL_DATE="+dealDate+"                                                                                    "+
	"            AND IS_BALL=1 AND OPERATE_TYPE='自营'                                                                          "+
	") T4                                                                                                                      "+
	"ON(T.GROUP_ID_1_NAME=T4.GROUP_ID_1_NAME)                                                                                  "+
	"LEFT JOIN PCDE.TB_CDE_BUS_HALL_TARGET T5                                                                                  "+
	"ON(T.GROUP_ID_1_NAME=T5.GROUP_ID_1_NAME)                                                                                  "+
	"ORDER BY T5.PAIXU_FLAG DESC ,NVL(T4.QX_NUM,0)/NVL(T5.QX_NUM,0) DESC                                                       ";
}

function getSameYearFristMon(dealDate){
	var year=dealDate.substr(0,4);
	return year+'01';
}

function getLastYearSameMon(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    return (year-1)+month;
}

function getLastYearFristMon(dealDate){
	var year=dealDate.substr(0,4);
	return (year-1)+'01';
}

function getLastYearEndMon(dealDate){
	var year=dealDate.substr(0,4);
	return (year-1)+'12';
}