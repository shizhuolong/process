var nowData = [];
var field=["DEAL_DATE","REGION_NAME_ABBR","HZT_NUM","ZY_NUM","DL_NUM","ALL_NUM"];
var title=[["账期","州市","合作厅","专营店/专区","代理点","本月累计"]];
var report;
var title;
var downSql="";
$(function() {
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
	showtext = '销量≧15户渠道统计日报-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function getSql(){
	var dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var where=" WHERE T1.GROUP_ID_1 <>16099";
	if(orgLevel==1){
	}else if(orgLevel==2){
		where+=" AND T1.GROUP_ID_1="+code;
	}else{
		where+=" AND 1=2";
	}
	return "SELECT "+dealDate+" DEAL_DATE                                                              "+
	"               ,NVL(T1.REGION_NAME_ABBR,'全省')REGION_NAME_ABBR                                    "+
	"               ,SUM(NVL(T2.HZT_NUM,0))HZT_NUM                                                     "+
	"               ,SUM(NVL(T2.ZY_NUM,0))ZY_NUM                                                       "+
	"               ,SUM(NVL(T2.DL_NUM,0))DL_NUM                                                       "+
	"               ,SUM(NVL(T2.HZT_NUM,0)+NVL(T2.ZY_NUM,0)+NVL(T2.DL_NUM,0))ALL_NUM                   "+
	"FROM PCDE.TB_CDE_REGION_CODE T1                                                                   "+
	"LEFT JOIN (SELECT *                                                                               "+
	"          FROM  PMRT.VIEW_CHNL_DEV_15_DAY T0                                                      "+
	"          WHERE T0.DEAL_DATE="+dealDate+"                                                         "+
	"          )T2                                                                                     "+
	"ON (T1.GROUP_ID_1=T2.GROUP_ID_1)                                                                  "+
                       where+
   "GROUP BY GROUPING SETS(T1.REGION_LVL_CODE,(T1.REGION_LVL_CODE,T1.REGION_NAME_ABBR,T1.GROUP_ID_1)) ";

}
