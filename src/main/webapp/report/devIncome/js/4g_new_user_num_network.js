var nowData = [];
var orderBy='';	
var report = null;
$(function() {
	var field=["DEAL_DATE","GROUP_ID_1_NAME","GROUP_AREA_NAME1","NEW_ALL","NEW_ALL_CZ","NEW_ALL_HB","IS_NEW","IS_MON_NEW","IS_CL_NEW","PRODUCT_FEE_96","PRODUCT_FEE_96_ZB"];
	var title=[["账期","地市","分公司","当月新增","当月新增<br/>同期增减量","当月新增<br/>同期增减比","当日发展数","其中当月发展数","其中存量用户数","新增中96及以上<br/>套餐用户数","新增中96及以上<br/>套餐用户数占比"]];
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
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 18;
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
	var code =$("#code").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//条件
	var sql = getSql()+" AND T.DEAL_DATE ="+dealDate ;
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	var orgLevel=$("#orgLevel").val();
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 =" + region;
	}else{
		sql+=" AND T.GROUP_ID_1 =" + region;
	}
	
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



function getSql(){
	var dealDate=$("#dealDate").val();
	var s="SELECT T.DEAL_DATE,                                          "+
			"       T.GROUP_ID_1_NAME,                                    "+
			"       T.GROUP_AREA_NAME1,                                   "+
			"       T.NEW_ALL,                                            "+
			"       T.NEW_ALL_CZ,                                         "+
			"       T.NEW_ALL_HB * 100 || '%' AS NEW_ALL_HB,              "+
			"       T.IS_NEW,                                             "+
			"       T.IS_MON_NEW,                                         "+
			"       T.IS_CL_NEW,                                          "+
			"       T.PRODUCT_FEE_96,                                     "+
			"       T.PRODUCT_FEE_96_ZB * 100 || '%' AS PRODUCT_FEE_96_ZB "+
			"  FROM PMRT.TAB_MRT_NET_4G_NEW_USER PARTITION(P"+dealDate+") T   "+
			" WHERE T.GROUP_ID_1 <> '16000'                               ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var field=["DEAL_DATE","GROUP_ID_1_NAME","GROUP_AREA_NAME1","NEW_ALL","NEW_ALL_CZ","NEW_ALL_HB","IS_NEW","IS_MON_NEW","IS_CL_NEW","PRODUCT_FEE_96","PRODUCT_FEE_96_ZB"];
	var title=[["账期","地市","分公司","当月新增","当月新增同期增减量","当月新增同期增减比","当日发展数","其中当月发展数","其中存量用户数","新增中96及以上套餐用户数","新增中96及以上套餐用户数占比"]];
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//条件
	var sql = getSql()+" AND T.DEAL_DATE ="+dealDate ;
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	var orgLevel=$("#orgLevel").val();
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 =" + region;
	}else{
		sql+=" AND T.GROUP_ID_1 =" + region;
	}
	showtext = '4G网络新增用户数日报-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
