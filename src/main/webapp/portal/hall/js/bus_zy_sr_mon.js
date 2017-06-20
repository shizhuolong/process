var nowData = [];
var title=[["州市","厅数","用户发展","单厅发展","环比","低销厅占比(10户以下）","0销厅占比","收入","单厅收入","环比","低收厅占比（1万元以下）"]];
var field=["GROUP_ID_1_NAME","BUS_COUNT","THIS_ALL_MON_DEV","DT_ALL_DEV","LJ_ALL_DEV_RATE","ZB_DXT","ZB_0XT","THIS_ALL_MON_SR","DT_ALL_SR","LJ_ALL_SR_RATE","ZD_DST"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.VIEW_MRT_ZY_DEV_REPORT"));
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
	dealDate=$("#dealDate").val();
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
	var showtext = '月经营简要情况 -'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT T.GROUP_ID_1_NAME                                                     "+
	"      ,T1.BUS_COUNT                                                                 "+
	"      ,T1.THIS_ALL_MON_DEV                                                          "+
	"      ,T1.DT_ALL_DEV                                                                "+
	"      ,T1.LJ_ALL_DEV_RATE                                                           "+
	"      ,PODS.  GET_RADIX_POINT(CASE WHEN T1.BUS_COUNT<>0                             "+
	"                                   THEN T2.LESS_10_NUM/T1.BUS_COUNT*100             "+
	"                                   ELSE 0 END || '%',0)      ZB_DXT                 "+
	"      ,PODS.  GET_RADIX_POINT(CASE WHEN T1.BUS_COUNT<>0                             "+
	"                                   THEN T2.EQU_0_NUM/T1.BUS_COUNT*100               "+
	"                                   ELSE 0 END || '%',0)      ZB_0XT                 "+
	"      ,T3.THIS_ALL_MON_SR                                                           "+
	"      ,T3.DT_ALL_SR                                                                 "+
	"      ,T3.LJ_ALL_SR_RATE                                                            "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN T1.BUS_COUNT<>0                               "+
	"                                   THEN T4.LESS_10_NUM/T1.BUS_COUNT*100             "+
	"                                   ELSE 0 END || '%',0)        ZD_DST               "+                                           
	"FROM  PCDE.TB_CDE_BUS_HALL_TARGET T                                                 "+
	"LEFT JOIN (                                                                         "+
	"      SELECT GROUP_ID_1_NAME                                                        "+
	"            ,BUS_COUNT                                                              "+
	"            ,THIS_ALL_MON_DEV                                                       "+
	"            ,DT_ALL_DEV                                                             "+
	"            ,LJ_ALL_DEV_RATE                                                        "+
	"      FROM PMRT.VIEW_MRT_ZY_DEV_REPORT                                              "+
	"          WHERE DEAL_DATE="+dealDate+"                                              "+
	") T1 ON(T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                       "+
	"LEFT JOIN (                                                                         "+
	"          SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                         "+
	"                ,COUNT(CASE WHEN NVL(ALL_NUM1,0)<10 AND  NVL(ALL_NUM1,0)>=0         "+
	"                            THEN HQ_CHAN_CODE                                       "+
	"                            END) LESS_10_NUM                                        "+
	"                 ,COUNT(CASE WHEN NVL(ALL_NUM1,0)<=0                                "+
	"                            THEN HQ_CHAN_CODE                                       "+
	"                            END)  EQU_0_NUM                                         "+
	"          FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY                                         "+
	"          WHERE DEAL_DATE="+dealDate+"                                              "+
	"            AND OPERATE_TYPE='自营'                                                  "+
	"          GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))          "+
	") T2 ON(T.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                       "+
	"LEFT JOIN (                                                                         "+
	"      SELECT GROUP_ID_1_NAME                                                        "+
	"            ,BUS_COUNT                                                              "+
	"            ,THIS_ALL_MON_SR                                                        "+
	"            ,DT_ALL_SR                                                              "+
	"            ,LJ_ALL_SR_RATE                                                         "+
	"      FROM PMRT.VIEW_MRT_ZY_SR_REPORT                                               "+
	"          WHERE DEAL_DATE="+dealDate+"                                              "+
	") T3 ON(T.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                       "+
	"LEFT JOIN (                                                                         "+
	"          SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                         "+
	"                ,COUNT(CASE WHEN NVL(ALL_SR1,0)<1                                   "+
	"                            THEN HQ_CHAN_CODE                                       "+
	"                            END)  LESS_10_NUM                                       "+
	"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY                                      "+
	"          WHERE DEAL_DATE="+dealDate+"                                              "+
	"            AND OPERATE_TYPE='自营'                                                  "+
	"          GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))          "+
	") T4 ON(T.GROUP_ID_1_NAME=T4.GROUP_ID_1_NAME)                                       ";
}
