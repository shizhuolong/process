var nowData = [];
var title=[["分公司","移动网有销量的渠道数","","","","","","宽带有销量渠道数","","","","","","固网有销量的渠道数","","","","",""],
           ["","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];

var field=["GROUP_ID_1_NAME","ZY_MOB","JK_MOB","DZ_MOB","SH_MOB","WB_MOB","ALL_MOB","ZY_KD","JK_KD","DZ_KD","SH_KD","WB_KD","ALL_KD","ZY_GW","JK_GW","DZ_GW","SH_GW","WB_GW","ALL_GW"];
var report = null;
var downSql="";

$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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

var pageSize = 20;
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
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var table="PMRT.VIEW_MRT_CHNL_NUM_MON";
	var sql="SELECT "+field.join(",")+" FROM "+table+" WHERE DEAL_DATE='"+dealDate+"'";
	var regionCode=$("#regionCode").val();
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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

 function exportData(){
	var dealDate=$("#dealDate").val();
	var showtext = '分渠道有销量的渠道数-'+dealDate;
	downloadExcel(downSql,title,showtext);
 }