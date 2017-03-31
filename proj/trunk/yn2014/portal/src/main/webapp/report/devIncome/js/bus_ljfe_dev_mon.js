var nowData = [];
var field=["GROUP_ID_1_NAME","ZY_DEV","GT_DEV","TTY_DEV","ALL_DEV","ZY_ZB","GT_ZB","TY_ZB","ALL_DEV_ZB","ZY_LAST_12DEV","ALL_LAST_12DEV","ZY_LAST_12ZB","ZY_HB","GT_LAST_12DEV","ALL_LAST_12DEV2","GT_LAST_12ZB","GT_HB","TY_LAST_12DEV","ALL_LAST_12DEV3","TY_LAST_12ZB","TY_HB","ALL_HB","ZY_LAST_MNDEV","ALL_LAST_MNDEV","ZY_LAST_MNZB","ZY_TB","GT_LAST_MNDEV","ALL_LAST_MNDEV2","GT_LAST_MNZB","GT_TB","TY_LAST_MNDEV","ALL_LAST_MNDEV3","TY_LAST_MNZB","TY_TB","ALL_TB"];
var title=[["州市","发展量","","","","占全渠道份额比","","","","环比","","","","","","","","","","","","","同比","","","","","","","","","","","",""],
           ["","自营厅","柜台外包厅","他营厅","全业务发展量","自营厅","柜台外包厅","他营厅","小计占比","去年12月自营发展量","去年12月全业务发展量","去年12月自营份额占比","自营厅环比","去年12月柜台发展量","去年12月全业务发展量","去年12月柜台份额占比","柜台外包厅环比","去年12月他营发展量","去年12月全业务发展量","去年12月他营份额占比","他营厅环比","小计环比","去年同期自营累计发展量","去年同期全业务累计发展量","去年同期自营份额占比","自营厅累计同比","去年同期柜台累计发展量","去年同期全业务累计发展量","去年同期柜台份额占比","柜台外包厅累计同比","去年同期他营累计发展量","去年同期全业务累计发展量","去年同期他营份额占比","他营厅累计同比","小计同期累计同比"]];
var report = null;
var sql="";
var downsql="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_LJFE_DEV_MON"));
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

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	sql =getSql();
	downsql=sql;
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
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
		
	var sql ="SELECT DEAL_DATE                                 "+
	"    ,GROUP_ID_1_NAME                                      "+
	"    ,ZY_DEV                                               "+
	"    ,GT_DEV                                               "+
	"    ,TTY_DEV                                              "+
	"    ,ALL_DEV                                              "+
	"    ,ZY_ZB                                                "+
	"    ,GT_ZB                                                "+
	"    ,TY_ZB                                                "+
	"    ,ALL_DEV_ZB                                           "+
	"    ,ZY_LAST_12DEV                                        "+
	"    ,ALL_LAST_12DEV                                       "+
	"    ,ZY_LAST_12ZB                                         "+
	"    ,ZY_HB                                                "+
	"    ,GT_LAST_12DEV                                        "+
	"    ,ALL_LAST_12DEV  ALL_LAST_12DEV2                      "+
	"    ,GT_LAST_12ZB                                         "+
	"    ,GT_HB                                                "+
	"    ,TY_LAST_12DEV                                        "+
	"    ,ALL_LAST_12DEV   ALL_LAST_12DEV3                     "+
	"    ,TY_LAST_12ZB                                         "+
	"    ,TY_HB                                                "+
	"    ,ALL_HB                                               "+
	"    ,ZY_LAST_MNDEV                                        "+
	"    ,ALL_LAST_MNDEV                                       "+
	"    ,ZY_LAST_MNZB                                         "+
	"    ,ZY_TB                                                "+
	"    ,GT_LAST_MNDEV                                        "+
	"    ,ALL_LAST_MNDEV    ALL_LAST_MNDEV2                    "+
	"    ,GT_LAST_MNZB                                         "+
	"    ,GT_TB                                                "+
	"    ,TY_LAST_MNDEV                                        "+
	"    ,ALL_LAST_MNDEV    ALL_LAST_MNDEV3                    "+
	"    ,TY_LAST_MNZB                                         "+
	"    ,TY_TB                                                "+
	"    ,ALL_TB                                               "+
	"FROM PMRT.TB_MRT_BUS_LJFE_DEV_MON WHERE DEAL_DATE='"+dealDate+"'";

	// 权限
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else if(orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	sql+=" ORDER BY GROUP_ID_1";
	return sql;
}
 
function downsAll(){
	var dealDate=$("#dealDate").val();
	var title=[["账期","州市","发展量","","","","占全渠道份额比","","","","环比","","","","","","","","","","","","","同比","","","","","","","","","","","",""],
	           ["","","自营厅","柜台外包厅","他营厅","全业务发展量","自营厅","柜台外包厅","他营厅","小计占比","去年12月自营发展量","去年12月全业务发展量","去年12月自营份额占比","自营厅环比","去年12月柜台发展量","去年12月全业务发展量","去年12月柜台份额占比","柜台外包厅环比","去年12月他营发展量","去年12月全业务发展量","去年12月他营份额占比","他营厅环比","小计环比","去年同期自营累计发展量","去年同期全业务累计发展量","去年同期自营份额占比","自营厅累计同比","去年同期柜台累计发展量","去年同期全业务累计发展量","去年同期柜台份额占比","柜台外包厅累计同比","去年同期他营累计发展量","去年同期全业务累计发展量","去年同期他营份额占比","他营厅累计同比","小计同期累计同比"]];
	showtext = '营业厅累计发展份额占比-'+dealDate;
	downloadExcel(downsql,title,showtext);
}
