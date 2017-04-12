var nowData = [];
var title=[["分公司","2G发展用户数","","","","","","3G发展用户数","","","","","","4G发展用户数","","","","","","宽带发展用户数","","","","","","固话发展用户数","","","","","","专租线发展用户数（不含ICT）","","","","",""],
           ["","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];

var field=["GROUP_ID_1_NAME","ZY_2G","JK_2G","DZ_2G","SH_2G","WB_2G","ALL_2G","ZY_3G","JK_3G","DZ_3G","SH_3G","WB_3G","ALL_3G","ZY_4G","JK_4G","DZ_4G","SH_4G","WB_4G","ALL_4G","ZY_KD","JK_KD","DZ_KD","SH_KD","WB_KD","ALL_KD","ZY_NET","JK_NET","DZ_NET","SH_NET","WB_NET","ALL_NET","ZY_ZZX","JK_ZZX","DZ_ZZX","SH_ZZX","WB_ZZX","ALL_ZZX"];
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
	var table="PMRT.VIEW_MRT_CHNL_DEV_ALL_MON";
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
	var showtext = '分渠道发展用户数-'+dealDate;
	downloadExcel(downSql,title,showtext);
 }