var nowData = [];
var title=[/*["分公司主营业务收入","主营业务收入","","","","","","","",""],*/
           ["分公司主营业务收入","总体","移动网","4G","3G","2G","固网","固网不含ICT、计列省本部IDC及云计算","ICT","IDC和云计算","其中包含在4G主营收入中的后向流量净收入","计列在3G的手工冲收","计列在昆明过境电路原值","过境电路省内分摊金额","移动网","4G","3G","2G","固网","固网通服(不含计列省本部ICT和云计算成本)"],
           ["指标序号","B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","D1","D2","D3","D4","D5","D6"]];
var field=["ALL_INCOME_NUM","MOB_INCOME_NUM","INCOME_4G_NUM","INCOME_3G_NUM","INCOME_2G_NUM","INCOME_NET_NUM","NOT_ICT_NUM","INCOME_ICT_NUM","INCOME_IDT_NUM","HX_FLOW","HAND_3G","KM_ELE_FOMER","KM_ELE_APPOR","ZHL_MOB","ZHL_4G","ZHL_3G","ZHL_2G","ZHL_GW","ZHL_ICT"];
var report = null;

var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : ["GROUP_ID_1_NAME"].concat(field),
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

var pageSize = 20;

//列表信息
function search() {
	var dealDate=$("#dealDate").val();
	var sql=getSql();
	sql+="WHERE DEAL_DATE='"+dealDate+"'"+"ORDER BY RANK ";
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
 
 function exportData(){
	var dealDate=$("#dealDate").val();
	var showtext = '分渠道换算基表-'+dealDate;
	downloadExcel(downSql,title,showtext);
 }
 
 function getSql(){
	 var sql="SELECT GROUP_ID_1_NAME               "+
	 ",ALL_INCOME_NUM                      "+
	 ",MOB_INCOME_NUM                      "+
	 ",INCOME_4G_NUM                       "+
	 ",INCOME_3G_NUM                       "+
	 ",INCOME_2G_NUM                       "+
	 ",INCOME_NET_NUM                      "+
	 ",NOT_ICT_NUM                         "+
	 ",INCOME_ICT_NUM                      "+
	 ",INCOME_IDT_NUM                      "+
	 ",HX_FLOW                             "+
	 ",HAND_3G                             "+
	 ",KM_ELE_FOMER                        "+
	 ",KM_ELE_APPOR                        "+
	 ",ZHL_MOB                             "+
	 ",ZHL_4G                              "+
	 ",ZHL_3G                              "+
	 ",ZHL_2G                              "+
	 ",ZHL_GW                              "+
	 ",ZHL_ICT                             "+
	 "FROM PMRT.VIEW_MRT_MAIN_INCOME_MON ";
	 return sql;
 }