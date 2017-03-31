var title="";
var field="";
var startDate="";
var endDate="";
$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_CHNL_INCOME_DAY");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	$("#searchBtn").click(function(){
		startDate=$("#startDate").val();
		endDate=$("#endDate").val();
		$("#exportPageBtn").parent().remove();
		var ge;
		if(startDate==endDate){
			title=[["账期","州市","旗舰类厅","","","标准类厅","","","小型类厅","","","小计","",""],
			       ["","","日收入","本月累计","较上月环比","日收入","本月累计","较上月环比","日收入","本月累计","较上月环比","日收入","本月累计","较上月环比"]];
			field=["DEAL_DATE","GROUP_ID_1_NAME","QJT_ALL_SR","QJT_ALL_SR1","QJT_HB1_ALL","BZ_ALL_SR","BZ_ALL_SR1","BZ_HB1_ALL","XX_ALL_SR","XX_ALL_SR1","XX_HB1_ALL","ALL_SR","ALL_SR1","HB_SR1"];
			//css=[{gt:1,css:LchReport.RIGHT_ALIGN}];
			ge=1;
		}else{
			title=[["州市","旗舰类厅","","标准类厅","","小型类厅","","小计",""],
			       ["","累计","环比","累计","环比","累计","环比","累计","环比"]];
			field=["GROUP_ID_1_NAME","QJT_ALL_SR1","QJT_HB1_ALL","BZ_ALL_SR1","BZ_HB1_ALL","XX_ALL_SR1","XX_HB1_ALL","ALL_SR1","HB_SR1"];
			//css=[{gt:1,css:LchReport.RIGHT_ALIGN}];
			ge=0;
		}
		report = new LchReport({
			title : title,
			field : field,
			css:[{gt:ge,css:LchReport.RIGHT_ALIGN}],
			rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
			content : "lchcontent",
			orderCallBack : function(index, type) {
				orderBy = " order by " + field[index] + " " + type + " ";
				search(0);
			},
			getSubRowsCallBack : function($tr) {
				return {
					data : nowData,
					extra : {}
				};
			}
		});
		search(0);
	});
	
	
	$("#searchBtn").trigger("click");
});
var pageSize = 25;
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
	
	var regionCode=$("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#region").val();
	var sql ="";
	var orderBy = "";
	var groupBy = "";
	if(startDate==endDate){
		sql=getSameDateSql();
		orderBy = " ORDER BY T.GROUP_ID_1 ";
	}else{
		sql=getDifferentDateSql();
		groupBy = " GROUP BY T.GROUP_ID_1_NAME, T.GROUP_ID_1 ";
		orderBy = " ORDER BY T.GROUP_ID_1 ";
	}
	//条件
	if(""!=regionCode && null!=regionCode){
		sql+=" AND T.GROUP_ID_1  ='"+regionCode+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND T.GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	/*var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}*/
	
	
	if(groupBy!=""&&groupBy!=null){
		sql+=groupBy;
	}
	
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}


	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	/*if (pageNumber == 1) {
		initPagination(total);
	}*/
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



function getSameDateSql() {
    var s=
    	" SELECT T.DEAL_DATE,                        "+
    	"        T.GROUP_ID_1_NAME,                  "+
    	"        T.QJT_ALL_SR,                       "+
    	"        T.QJT_ALL_SR1,                      "+
    	"        T.QJT_HB1_ALL,                      "+
    	"        T.BZ_ALL_SR,                        "+
    	"        T.BZ_ALL_SR1,                       "+
    	"        T.BZ_HB1_ALL,                       "+
    	"        T.XX_ALL_SR,                        "+
    	"        T.XX_ALL_SR1,                       "+
    	"        T.XX_HB1_ALL,                       "+
    	"        T.ALL_SR,                           "+
    	"        T.ALL_SR1,                          "+
    	"        T.HB_SR1                            "+
    	"   FROM PMRT.TB_MRT_BUS_CHNL_INCOME_DAY T   "+
    	"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
	return s;
}

function getDifferentDateSql() {
    var s=
    	" SELECT T.GROUP_ID_1_NAME,                                                          "+
    	"        SUM(NVL(T.QJT_ALL_SR, 0)) QJT_ALL_SR1,                                      "+
    	"        PMRT.LINK_RATIO(SUM(NVL(T.QJT_ALL_SR, 0)),                                  "+
    	"                        SUM(NVL(T.QJT_LAST_ALL, 0)),                                "+
    	"                        2) QJT_HB1_ALL,                                             "+
    	"        SUM(NVL(T.BZ_ALL_SR, 0)) BZ_ALL_SR1,                                        "+
    	"        PMRT.LINK_RATIO(SUM(NVL(T.BZ_ALL_SR, 0)),                                   "+
    	"                        SUM(NVL(T.BZ_LAST_ALL, 0)),                                 "+
    	"                        2) BZ_HB1_ALL,                                              "+
    	"        SUM(NVL(T.XX_ALL_SR, 0)) XX_ALL_SR1,                                        "+
    	"        PMRT.LINK_RATIO(SUM(NVL(T.XX_ALL_SR, 0)),                                   "+
    	"                        SUM(NVL(T.XX_LAST_ALL, 0)),                                 "+
    	"                        2) XX_HB1_ALL,                                              "+
    	"        SUM(NVL(T.ALL_SR, 0)) ALL_SR1,                                              "+
    	"        PMRT.LINK_RATIO(SUM(NVL(T.ALL_SR, 0)), SUM(NVL(T.LAST_AR, 0)), 2) HB_SR1    "+
    	"   FROM PMRT.TB_MRT_BUS_CHNL_INCOME_DAY T                                           "+
    	"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                       ";
	return s;
}
function downsAll() {
	
	var regionCode=$("#regionCode").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#region").val();
	var sql ="";
	var orderBy = "";
	var groupBy = "";
	var showtext = "";
	if(startDate==endDate){
		showtext ='营业厅收入日通报('+startDate+")";
		title=[["账期","地市","营业厅编码","营业厅名称","当日收入","当日环比","本月累计","环比","自营厅类型"]];
		sql = 	" SELECT T.DEAL_DATE,                                          "+
				"        T.GROUP_ID_1_NAME,                                    "+
				"        T.HQ_CHAN_CODE,                                       "+
				"        T.BUS_HALL_NAME,                                      "+
				"        T.ALL_SR,                                             "+
				"        T.HB_ALL,                                             "+
				"        T.ALL_SR1,                                            "+
				"        T.HB1_ALL,                                            "+
				"        T.CHNL_TYPE                                           "+
				"   FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY T                     "+
				"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' "+
				"    AND T.OPERATE_TYPE = '自营'                               "+
				"    AND T.CHNL_TYPE IS NOT NULL                               ";
		orderBy = " ORDER BY T.GROUP_ID_1 ";

	}else{
		showtext ='营业厅收入日通报(' + startDate+"~"+endDate+")";
		title=[["地市","营业厅编码","营业厅名称","累计","累计环比"]];
		sql =	" SELECT T.GROUP_ID_1_NAME,                                                     "+
				"        T.HQ_CHAN_CODE,                                                        "+
				"        T.BUS_HALL_NAME,                                                       "+
				"        SUM(NVL(T.ALL_SR, 0)) ALL_SR,                                          "+
				"        PMRT.LINK_RATIO(SUM(NVL(T.ALL_SR, 0)), SUM(NVL(T.LAST_ALL, 0)), 2) HB  "+
				"   FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY T                                      "+
				"  WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                  "+
				"    AND T.OPERATE_TYPE = '自营'                                                "+
				"    AND T.CHNL_TYPE IS NOT NULL                                                ";
		groupBy = " GROUP BY T.GROUP_ID_1_NAME, T.HQ_CHAN_CODE, T.BUS_HALL_NAME ";
	}
	//条件
	if(""!=regionCode && null!=regionCode){
		sql+=" AND T.GROUP_ID_1  ='"+regionCode+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND T.GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	if(groupBy!=""&&groupBy!=null){
		sql+=groupBy;
	}
	
	//排序
	if (orderBy != "" && orderBy!=null) {
		sql += orderBy;
	}
	downloadExcel(sql,title,showtext);
}
