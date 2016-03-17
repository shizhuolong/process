var field=["CODE_TYPE","ALL_DEV_NUM","ALL_DEV_NUM1","LAST_DEV_NUM1","LAST_THIS_OCC","CODE_OCC","DEV_4G_NUM","DEV_4G_NUM1","LAST_4G_DEV","LAST_THIS_4G","DEV_3G_NUM","DEV_3G_NUM1","LAST_3G_DEV","LAST_THIS_3G","DEV_2G_NUM","DEV_2G_NUM1","LAST_2G_DEV","LAST_THIS_2G"];
var title=[["渠道名称","移动网整体","","","","","CBSS套餐","","","","3G套餐","","","","2G套餐","","",""],
           ["","当日发展数","累计发展数","累计发展数<br>较上月同期","累计发展数较<br>上月同期比","各渠道发展<br>用户数占比","当日发展数","累计发展数","累计发展数<br>较上月同期","累计发展数<br>较上月同期比","当日发展数","累计发展数","累计发展数<br>较上月同期","累计发展数<br>较上月同期比","当日发展数","累计发展数","累计发展数<br>较上月同期","累计发展数较<br>上月同期比"]];
var time="";
var sql="";

var nowData = [];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		tableCss : {
			leftWidth : 140
		},
		rowParams : ["CODE_TYPE"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
		},
		getSubRowsCallBack : function($tr) {
			var orgLevel=1;
			time=$("#time").val();
			if($tr){
				var code_type=$tr.attr("code_type");
				orgLevel=parseInt($tr.attr("orgLevel"));
				field=["GROUP_ID_4_NAME CODE_TYPE","ALL_DEV_NUM","ALL_DEV_NUM1","LAST_DEV_NUM1","'--' LAST_THIS_OCC","'--' CODE_OCC","DEV_4G_NUM","DEV_4G_NUM1","LAST_4G_DEV","'--' LAST_THIS_4G","DEV_3G_NUM","DEV_3G_NUM1","LAST_3G_DEV","'--' LAST_THIS_3G","DEV_2G_NUM","DEV_2G_NUM1","LAST_2G_DEV","'--' LAST_THIS_2G"];
				sql="select "+field.join(",")+" from PMRT.TAB_MRT_IMPORT_DEV_DAY WHERE DEAL_DATE='"+time+"' AND CODE_TYPE='"+code_type+"' ORDER BY ID";
				if(orgLevel==2){
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}else{
				sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IMPORT_ALL_DAY WHERE DEAL_DATE='"+time+"' ORDER BY ID";
				orgLevel++;
			}	
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    $("#lch_DataHead").find("TH").unbind();
    $("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
    $("#searchBtn").click(function(){
    report.showSubRow();
    $("#lch_DataHead").find("TH").unbind();
    $("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
    });
});

function downsAll(){
	field=["GROUP_ID_4_NAME CODE_TYPE","ALL_DEV_NUM","ALL_DEV_NUM1","LAST_DEV_NUM1","'--' LAST_THIS_OCC","'--' CODE_OCC","DEV_4G_NUM","DEV_4G_NUM1","LAST_4G_DEV","'--' LAST_THIS_4G","DEV_3G_NUM","DEV_3G_NUM1","LAST_3G_DEV","'--' LAST_THIS_3G","DEV_2G_NUM","DEV_2G_NUM1","LAST_2G_DEV","'--' LAST_THIS_2G"];
	sql="select "+field.join(",")+" from PMRT.TAB_MRT_IMPORT_DEV_DAY WHERE DEAL_DATE='"+time+"' ORDER BY ID";
	title=[["渠道名称","移动网整体","","","","","CBSS套餐","","","","3G套餐","","","","2G套餐","","",""],
           ["","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","各渠道发展用户数占比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比","当日发展数","累计发展数","累计发展数较上月同期","累计发展数较上月同期比"]];
	var showtext = '重点渠道发展日通报-'+time;
	downloadExcel(sql,title,showtext);
}
