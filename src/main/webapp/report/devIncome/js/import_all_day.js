var field=["CODE_TYPE","ALL_DEV_NUM","ALL_DEV_NUM1","LAST_DEV_NUM1","LAST_THIS_OCC","CODE_OCC","DEV_4G_NUM","DEV_4G_NUM1","LAST_4G_DEV","LAST_THIS_4G","DEV_3G_NUM","DEV_3G_NUM1","LAST_3G_DEV","LAST_THIS_3G","DEV_2G_NUM","DEV_2G_NUM1","LAST_2G_DEV","LAST_THIS_2G"];
var title=[["渠道名称","移动网整体","","","","","4G","","","","3G","","","","2G","","",""],
           ["","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","各渠道发展用户数占比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比"]];
var time="";
var sql="";

var nowData = [];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
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
	search();
	$("#searchBtn").click(function(){
		search();
	});
});

//列表信息
function search() {
	time=$("#time").val();
	sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IMPORT_ALL_DAY WHERE DEAL_DATE='"+time+"' ORDER BY ID";
	var d = query(sql);
	nowData = d;
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width()).hide();

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '重点渠道发展日通报-'+time;
	downloadExcel(sql,title,showtext);
}
