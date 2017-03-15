var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","LAST_HZT_NUM","HZT_NUM","LAST_ZYD_NUM","ZYD_NUM","LAST_DLD_NUM","DLD_NUM","THIS_NUM","NEW_CODE_ZB","LJ_NUM","LJ_JZ_NUM"];
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
	var where=" WHERE DEAL_DATE="+dealDate;
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		where+=" AND GROUP_ID_1="+code;
	}else{
		where+=" AND 1=2";
	}
	return "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_CHNL_EXPAND_DAY "+where;
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