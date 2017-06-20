var nowData = [];
var title=null;
var field=["GROUP_ID_1_NAME","SR_ALL","SR_ALL1","SR_TB","SR_RATE","DEV_ALL","DEV_ALL1","DEV_TB","DEV_RATE"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_DEV_MON"));
	
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
	title=[["州市","收入","","","","销量","","",""],
           ["","2016年01-"+end+"月","2017年01-"+end+"月","收入同比","时序收入完成率","2016年01-"+end+"月","2017年1-"+end+"月","销量同比","时序销量完成率"]];
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
	var showtext = '月累计收入、发展预算完成情况 -'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT T.GROUP_ID_1_NAME                                                                                        "+
	"      ,T2.SR_ALL                                                                                                       "+
	"      ,T1.SR_ALL SR_ALL1                                                                                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T2.SR_ALL<>0                                                                     "+
	"                                 THEN T1.SR_ALL/T2.SR_ALL*100                                                          "+
	"                                 ELSE 0 END ||'%'                                                                      "+
	"                            ,0)  SR_TB                                                                                 "+
	"      ,T3.SR_RATE                                                                                                      "+
	"      ,T5.DEV_ALL                                                                                                      "+
	"      ,T4.DEV_ALL DEV_ALL1                                                                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T5.DEV_ALL<>0                                                                    "+
	"                                 THEN T4.DEV_ALL/T5.DEV_ALL*100                                                        "+
	"                                 ELSE 0 END ||'%'                                                                      "+
	"                            ,0)  DEV_TB                                                                                "+
	"      ,T6.DEV_RATE                                                                                                     "+
	"FROM  PCDE.TB_CDE_BUS_HALL_TARGET T                                                                                    "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT GROUP_ID_1_NAME                                                                                                 "+
	"      ,SUM(ZY_ALL) SR_ALL                                                                                              "+
	"FROM PMRT.VIEW_MRT_INCOME_MON                                                                                          "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                                             "+
	" GROUP BY GROUP_ID_1_NAME                                                                                              "+
	")T1 ON (T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                          "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT GROUP_ID_1_NAME                                                                                                 "+
	"      ,SUM(ZY_ALL) SR_ALL                                                                                              "+
	"FROM PMRT.VIEW_MRT_INCOME_MON                                                                                          "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+                          
	" GROUP BY GROUP_ID_1_NAME                                                                                              "+
	")T2 ON (T.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                                                          "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT GROUP_ID_1_NAME                                                                                                 "+
	"      ,SXWC_RATE   SR_RATE                                                                                             "+
	"FROM PMRT.VIEW_MRT_ZY_SR_REPORT                                                                                        "+
	"WHERE DEAL_DATE=TO_CHAR(LAST_DAY(TO_DATE('"+dealDate+"','YYYYMM')),'YYYYMMDD')                                         "+
	")T3 ON (T.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                          "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                      "+
	"      ,NVL(SUM(ALL_NUM),0) DEV_ALL                                                                                     "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                      "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+" AND OPERATE_TYPE='自营'                      "+
	" GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                      "+
	")T4 ON (T.GROUP_ID_1_NAME=T4.GROUP_ID_1_NAME)                                                                          "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                                                      "+
	"      ,NVL(SUM(ALL_NUM),0) DEV_ALL                                                                                     "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                                                      "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)+ " AND OPERATE_TYPE='自营'" +
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                       "+
	")T5 ON (T.GROUP_ID_1_NAME=T5.GROUP_ID_1_NAME)                                                                          "+
	"LEFT JOIN (                                                                                                            "+
	"SELECT GROUP_ID_1_NAME                                                                                                 "+
	"      ,SXWC_RATE   DEV_RATE                                                                                            "+
	"FROM PMRT.VIEW_MRT_ZY_DEV_REPORT                                                                                       "+
	"WHERE DEAL_DATE=TO_CHAR(LAST_DAY(TO_DATE('"+dealDate+"','YYYYMM')),'YYYYMMDD')                                         "+
	")T6 ON (T.GROUP_ID_1_NAME=T6.GROUP_ID_1_NAME)                                                                          "+
	"  ORDER BY PAIXU_FLAG DESC ，CASE WHEN T2.SR_ALL<>0           "+
	"                                 THEN T1.SR_ALL/T2.SR_ALL*100"+
	"                                 ELSE 0 END DESC             ";
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