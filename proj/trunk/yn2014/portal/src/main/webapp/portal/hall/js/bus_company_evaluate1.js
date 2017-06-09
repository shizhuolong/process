var nowData = [];
var title=null;
var field=["NAME","DEV_NUM","DEV_NUM1","ZZ_RATE","ZB"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_DEV_MON"));
	$("#regionCode").val("16001");
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
	dealDate=$("#dealDate").val();
	var end=dealDate.substr(4,6);
	title=[["项目","2016年01-"+end+"月","2017年01-"+end+"月","增长率","占比"]];
	if($("#searchTr").find("td:last").find("a").text()=="导出页面"){
		$("#searchTr").find("td:last").remove();
	}
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
	
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var sql=getSql(dealDate);
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
	var showtext = '分公司点评2-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var regionCode=$("#regionCode").val();
	var where=" AND OPERATE_TYPE='自营'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT '原有厅销量' NAME                                                                                                           "+
	"      ,TO_CHAR(T2.DEV_NUM) DEV_NUM                                                                                                     "+
	"      ,T1.DEV_NUM DEV_NUM1                                                                                                             "+
	"      ,PMRT.LINK_RATIO(T1.DEV_NUM,T2.DEV_NUM,0)  ZZ_RATE                                                                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T3.DEV_NUM<>0                                                                                    "+
	"                                 THEN T1.DEV_NUM/T3.DEV_NUM*100                                                                        "+
	"                                 ELSE 0 END || '%' ,1)         ZB                                                                      "+
	"FROM (                                                                                                                                 "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_NUM) DEV_NUM                                                                                                        "+
	"    FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                                  "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	        where+
	"         AND HQ_CHAN_CODE IN (SELECT DISTINCT HQ_CHAN_CODE FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                           "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"                                AND OPERATE_TYPE='自营')                                                                                "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T1                                                                                                                                    "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_NUM) DEV_NUM                                                                                                        "+
	"    FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                                  "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"      AND OPERATE_TYPE='自营'                                                                                                           "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T2 ON (T1.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                                                                         "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_NUM) DEV_NUM                                                                                                        "+
	"    FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                                  "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                               "+
	"      AND OPERATE_TYPE='自营'                                                                                                           "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T3 ON (T1.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                                         "+
	"UNION ALL                                                                                                                              "+
	"SELECT '原有厅收入'                                                                                                                       "+
	"      ,TO_CHAR(T2.SR_NUM)                                                                                                              "+
	"      ,T1.SR_NUM                                                                                                                       "+
	"      ,PMRT.LINK_RATIO(T1.SR_NUM,T2.SR_NUM,0)                                                                                          "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T3.SR_NUM<>0                                                                                     "+
	"                                 THEN T1.SR_NUM/T3.SR_NUM*100                                                                          "+
	"                                 ELSE 0 END || '%' ,1)                                                                                 "+
	"FROM (                                                                                                                                 "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_SR) SR_NUM                                                                                                          "+
	"    FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                               "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	         where+
	"         AND HQ_CHAN_CODE IN (SELECT DISTINCT HQ_CHAN_CODE FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                        "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"                                AND OPERATE_TYPE='自营')                                                                                "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T1                                                                                                                                    "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_SR) SR_NUM                                                                                                          "+
	"    FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                               "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"      AND OPERATE_TYPE='自营'                                                                                                            "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T2 ON (T1.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                                                                         "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_SR) SR_NUM                                                                                                          "+
	"    FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                               "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	"      AND OPERATE_TYPE='自营'                                                                                                            "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T3 ON (T1.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                                         "+
	"UNION ALL                                                                                                                              "+
	"SELECT '新增厅销量'                                                                                                                       "+
	"      ,'--'                                                                                                                            "+
	"      ,T3.DEV_NUM-T1.DEV_NUM                                                                                                           "+
	"      ,'--'                                                                                                                            "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T3.DEV_NUM<>0                                                                                    "+
	"                                 THEN (T3.DEV_NUM-T1.DEV_NUM)*100/T3.DEV_NUM                                                           "+
	"                                 ELSE 0                                                                                                "+
	"                                 END || '%',1)                                                                                         "+
	"FROM (                                                                                                                                 "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_NUM) DEV_NUM                                                                                                        "+
	"    FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                                  "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	       where+
	"         AND HQ_CHAN_CODE IN (SELECT DISTINCT HQ_CHAN_CODE FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                           "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"                                AND OPERATE_TYPE='自营')                                                                                "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T1                                                                                                                                    "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_NUM) DEV_NUM                                                                                                        "+
	"    FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                                  "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	"      AND OPERATE_TYPE='自营'                                                                                                           "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T3 ON (T1.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                                         "+
	"UNION ALL                                                                                                                              "+
	"SELECT '新增厅收入'                                                                                                                       "+
	"      ,'--'                                                                                                                            "+
	"      ,T3.SR_NUM-T1.SR_NUM                                                                                                             "+
	"      ,'--'                                                                                                                            "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T3.SR_NUM<>0                                                                                     "+
	"                                 THEN (T3.SR_NUM-T1.SR_NUM)*100/T3.SR_NUM                                                              "+
	"                                 ELSE 0                                                                                                "+
	"                                 END || '%',1)                                                                                         "+
	"FROM (                                                                                                                                 "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_SR) SR_NUM                                                                                                          "+
	"    FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                               "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                             "+
	            where+
	"         AND HQ_CHAN_CODE IN (SELECT DISTINCT HQ_CHAN_CODE FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                        "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+
	"                                AND OPERATE_TYPE='自营')                                                                                "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T1                                                                                                                                    "+
	"LEFT JOIN (                                                                                                                            "+
	"    SELECT GROUP_ID_1_NAME                                                                                                             "+
	"          ,SUM(ALL_SR) SR_NUM                                                                                                          "+
	"    FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                               "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                                               "+
	"      AND OPERATE_TYPE='自营'                                                                                                           "+
	"    GROUP BY GROUP_ID_1_NAME                                                                                                           "+
	")T3 ON (T1.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                                         ";
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