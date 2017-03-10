var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","LAST_HZT_NUM","HZT_NUM","LAST_ZYD_NUM","ZYD_NUM","LAST_DLD_NUM","DLD_NUM","THIS_NUM","QDZB","LJ_NUM","LJ_JZ_NUM"];
var report;
var title;
var downSql="";
$(function() {
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var month=getMonth(dealDate);
	title=[["账期","州市","合作厅","","专营店/专区","","代理点","","本月新增","新增渠道占比","累计新增","累计净增"],
	           ["","","截至"+month+"月数量","本月累计新增","截至"+month+"月数量","本月累计新增","截至"+month+"月数量","本月累计新增","","","",""]];
	report=null;
	$("#exportPageBtn:last").parent().remove();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	
	var sql=getSql();
	downSql=sql;
	var cdata = query("select count(*) total from(" + sql+")");
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
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
var pageSize = 15;
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	showtext = '渠道拓展日报表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function getSql(){
	var dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var where=" WHERE 1=1";
	if(orgLevel==1){
	}else if(orgLevel==2){
		where+=" AND T1.GROUP_ID_1="+code;
	}else{
		where+=" AND 1=2";
	}
	return "SELECT "+dealDate+" DEAL_DATE                                                                      "+
	"      ,NVL(T1.REGION_NAME_ABBR,'全省')GROUP_ID_1_NAME                                                      "+
	"      ,SUM(NVL(T3.HZT_NUM,0)) LAST_HZT_NUM                                                                "+
	"      ,SUM(NVL(T2.HZT_NUM,0)) HZT_NUM                                                                     "+
	"      ,SUM(NVL(T3.ZYD_NUM,0))LAST_ZYD_NUM                                                                 "+
	"      ,SUM(NVL(T2.ZYD_NUM,0)) ZYD_NUM                                                                     "+
	"      ,SUM(NVL(T3.DLD_NUM,0)) LAST_DLD_NUM                                                                "+
	"      ,SUM(NVL(T2.DLD_NUM,0)) DLD_NUM                                                                     "+
	"      ,SUM(NVL(T2.HZT_NUM,0)+NVL(T2.ZYD_NUM,0)+NVL(T2.DLD_NUM,0)) THIS_NUM                                "+
	"      ,TRIM('.'FROM TO_CHAR(CASE WHEN SUM(NVL(T3.LAST_ALL_NUM,0))=0 THEN 0                                "+
	"                                 ELSE SUM(NVL(T2.HZT_NUM,0)+NVL(T2.ZYD_NUM,0)+NVL(T2.DLD_NUM,0))*100      "+
	"                                   /SUM(NVL(T3.LAST_ALL_NUM,0)) END                                       "+
	"                                    ,'FM999990.9'))||'%' QDZB                                                 "+
	"      ,SUM(NVL(T4.LJ_NUM,0)) LJ_NUM                                                                       "+
	"      ,SUM(NVL(T4.LJ_NUM,0))-SUM(NVL(T5.QS_NUM,0))LJ_JZ_NUM                                               "+
	"FROM PCDE.TB_CDE_REGION_CODE T1                                                                           "+
	"LEFT JOIN (SELECT T2.GROUP_ID_1                                                                           "+
	"                 ,SUM(NVL(T2.HZT_NUM,0)) HZT_NUM                                                          "+
	"                 ,SUM(NVL(T2.ZYD_NUM,0)) ZYD_NUM                                                          "+
	"                 ,SUM(NVL(T2.DLD_NUM,0)) DLD_NUM                                                          "+
	"           FROM  PMRT.VIEW_CHNL_CODE_DAY T2                                                               "+
	"           WHERE T2.DEAL_DATE BETWEEN SUBSTR('"+dealDate+"',1,6)||'01'                                    "+
	"           AND   "+dealDate+"                                                                             "+
	"           GROUP BY T2.GROUP_ID_1 )T2                                                                     "+
	"ON   (T1.GROUP_ID_1=T2.GROUP_ID_1)                                                                        "+
	"LEFT JOIN (SELECT T2.GROUP_ID_1                                                                           "+
	"                 ,SUM(NVL(T2.HZT_NUM,0)) HZT_NUM                                                          "+
	"                 ,SUM(NVL(T2.ZYD_NUM,0)) ZYD_NUM                                                          "+
	"                 ,SUM(NVL(T2.DLD_NUM,0)) DLD_NUM                                                          "+
	"                 ,SUM(NVL(T2.HZT_NUM,0)+NVL(T2.ZYD_NUM,0)+NVL(T2.DLD_NUM,0)) LAST_ALL_NUM                 "+
	"           FROM  PMRT.VIEW_CHNL_CODE_DAY T2                                                               "+
	"           WHERE T2.DEAL_DATE NOT LIKE '"+getPreMonth(dealDate)+"%'                                       "+
	"           GROUP BY T2.GROUP_ID_1)  T3                                                                    "+
	"ON   (T1.GROUP_ID_1=T3.GROUP_ID_1 )                                                                       "+
	"LEFT JOIN (SELECT T2.GROUP_ID_1                                                                           "+
	"                 ,SUM(NVL(T2.HZT_NUM,0)+NVL(T2.DLD_NUM,0)+NVL(T2.ZYD_NUM,0)) LJ_NUM                       "+
	"           FROM  PMRT.VIEW_CHNL_CODE_DAY T2                                                               "+
	"           WHERE T2.DEAL_DATE BETWEEN 20170101 AND "+dealDate+"                                           "+
	"           GROUP BY T2.GROUP_ID_1                                                                         "+
	"           )  T4                                                                                          "+
	"ON   (T1.GROUP_ID_1=T4.GROUP_ID_1 )                                                                       "+
	"LEFT JOIN (SELECT T2.GROUP_ID_1                                                                           "+
	"                 ,COUNT(T2.HQ_CHAN_CODE) QS_NUM                                                           "+
	"           FROM  PCDE.TB_CDE_CHANL_HQ_CODE T2                                                             "+
	"           WHERE TO_CHAR(T2.CREATE_TIME,'YYYYMMDD') BETWEEN 20170101 AND "+dealDate+"                     "+
	"           AND( T2.CHN_CDE_3_NAME LIKE '%合作营业厅%'                                                        "+
	"           OR T2.CHN_CDE_3_NAME LIKE '%专营店/专区%'                                                         "+
	"           OR T2.CHN_CDE_3_NAME LIKE '%代理点%') AND T2.STATUS IN(11,12)                                    "+
	"           GROUP BY T2.GROUP_ID_1                                                                         "+
	"           )  T5                                                                                          "+
	"ON   (T1.GROUP_ID_1=T5.GROUP_ID_1 )                                                                       "+
	                     where+
	" GROUP BY GROUPING SETS(T1.REGION_LVL_CODE,(T1.REGION_LVL_CODE,T1.GROUP_ID_1,T1.REGION_NAME_ABBR))         ";
}
function getMonth(){
	var dealDate=$("#dealDate").val();
	var yearMon=dealDate.substring(0,6)-1+"";
	var month=yearMon.substring(4,6);
	if(month=="00"){
		month="12";
	}
	return month;	
}
function getPreMonth(dealDate){
	var year=dealDate.substring(0,4);
	var month=dealDate.substring(4,6);
	if(month=="01"){
		return (year-1)+"12";
	}
	return dealDate.substring(0,6)-1;	
}