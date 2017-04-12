var nowData = [];
var title=[["分公司主营业务收入","主营业务收入","","","","","","","",""],
           ["分公司主营业务收入","总体","移动网","4G","3G","2G","固网","固网不含ICT、计列省本部IDC及云计算","ICT","IDC和云计算"],
           ["指标序号","B1","B2","B3","B4","B5","B6","B7","B8","B9"]];
var field=["GROUP_ID_1_NAME","ALL_INCOME_NUM","MOB_INCOME_NUM","INCOME_4G_NUM","INCOME_3G_NUM","INCOME_2G_NUM","INCOME_NET_NUM","NOT_ICT_NUM","INCOME_ICT_NUM","INCOME_IDT_NUM"];
var report = null;

var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[
		      {gt:0,css:LchReport.RIGHT_ALIGN}
		    ],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

var pageSize = 26;

//列表信息
function search() {
	var dealDate=$("#dealDate").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_MAIN_INCOME_MON_TEMP WHERE DEAL_DATE='"+dealDate+"'";
	downSql=sql;
	nowData = query(sql);
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

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_main_income.jsp";
 }
 
 function inStorage(){
	 if(confirm('确认入库 ?')){
		 var dealDate=$("#dealDate").val();
		 window.location.href=$("#ctx").val()+"/mainIncome/import-main-income!inStorage.action?dealDate="+dealDate;
	 }
 }
 
 function exportData(){
	var dealDate=$("#dealDate").val();
	var showtext = '预览数据-'+dealDate;
	downloadExcel(downSql,title,showtext);
 }