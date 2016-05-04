var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","RANKING","TASK_DEV","DEV_COUNT","DEV_COMPLETE","DEV_KPI_VALUE","DEV_KPI_WEIGHT","TASK_INCOME","TOTAL_FEE","INCOME_COMPLETE","IN_KPI_VALUE","IN_KPI_WEIGHT","OWEFEE","AMOUNT_MONTH","OWEFEE_RATE","OWE_KPI_VALUE","OWE_KPI_WEIGHT","AMOUNT_12","AMOUNT_ALL","STOCK_RATE","STOCK_KPI_VALUE","STOCK_KPI_WEIGHT","BUDGET_TASK","BUDGET_ML","ML_COMPLETE","ML_KPI_VALUE","ML_KPI_WEIGHT","KHDF_WEIGHT","KHDF_VALUE","PROV_KPI_WEIGHT","PROV_KPI_SCORE","CUSTOM_KPI","KPI_RESULT"];
var title=[["账期","地市名称","营服名称","排名标识","积分（发展）任务","积分（发展）完成","积分（发展）任务完成率","积分（发展）KPI得分","积分（发展）KPI权重","收入任务","收入完成","收入任务完成率","收入KPI得分","收入KPI权重","欠费","本月累计达到收入","欠费率","欠费KPI得分","欠费KPI权重","上年12月收入","存量收入","存量收入保有率","存量KPI得分","存量KPI权重","毛利预算","毛利完成","毛利任务完成率","毛利KPI得分","毛利KPI权重","本厅收入完成率权重","本厅收入完成率得分","省级KPI权重","省级KPI得分","自设KPI得分","汇总KPI得分"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:2,css:LchReport.RIGHT_ALIGN}],
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
	//营服中心编码
	var unitCode=$("#unitCode").val();
	//标识编码
	var ranking=$("#ranking").val();
	
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID = '"+ unitCode+"'";
	}
	if(ranking!=""){
		sql+=" AND T.RANKING ="+ranking;
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 =" + region +" T.UNIT_ID = "+code;
	}else{
		sql+=" and 1=2";
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
	var s="SELECT T.DEAL_DATE,                                        "+
		"       T.GROUP_ID_1_NAME,                                  "+
		"       T.UNIT_NAME,                                        "+
		"       T.TASK_DEV,                                         "+
		"       T.DEV_COUNT,                                        "+
		"       T.DEV_COMPLETE,                                     "+
		"       T.DEV_KPI_VALUE,                                    "+
		"       T.DEV_KPI_WEIGHT,                                   "+
		"       T.TASK_INCOME,                                      "+
		"       T.TOTAL_FEE,                                        "+
		"       T.INCOME_COMPLETE,                                  "+
		"       T.IN_KPI_VALUE,                                     "+
		"       T.IN_KPI_WEIGHT,                                    "+
		"       T.OWEFEE,                                           "+
		"       T.AMOUNT_MONTH,                                     "+
		"       T.OWEFEE_RATE,                                      "+
		"       T.OWE_KPI_VALUE,                                    "+
		"       T.OWE_KPI_WEIGHT,                                   "+
		"       T.AMOUNT_12,                                        "+
		"       T.AMOUNT_ALL,                                       "+
		"       T.STOCK_RATE,                                       "+
		"       T.STOCK_KPI_VALUE,                                  "+
		"       T.STOCK_KPI_WEIGHT,                                 "+
		"       T.BUDGET_TASK,                                      "+
		"       T.BUDGET_ML,                                        "+
		"       T.ML_COMPLETE,                                      "+
		"       T.ML_KPI_VALUE,                                     "+
		"       T.ML_KPI_WEIGHT,                                    "+
		"       T.KHDF_WEIGHT,                                      "+
		"       T.KHDF_VALUE,                                       "+
		"       T.PROV_KPI_WEIGHT,                                  "+
		"       T.PROV_KPI_SCORE,                                   "+
		"       T.CUSTOM_KPI,                                       "+
		"       T.KPI_RESULT,                                       "+
		"       DECODE(T.RANKING,'1','前20','2','后20') AS RANKING  "+
		"  FROM PMRT.TB_MRT_JF_ZB_COUNT_KPI T                       ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code =$("#code").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode=$("#unitCode").val();
	//标识编码
	var ranking=$("#ranking").val();
	
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID = '"+ unitCode+"'";
	}
	if(ranking!=""){
		sql+=" AND T.RANKING ="+ranking;
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='" + code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 =" + region +" T.UNIT_ID = '"+code+"'";
	}else{
		sql+=" and 1=2";
	}
	showtext = 'kpi前后20-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql=" SELECT DISTINCT(T.GROUP_ID_1),T.GROUP_ID_1_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_KPI T WHERE T.GROUP_ID_1 IS NOT NULL ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var region =$("#region").val();
	if(orgLevel==1){
		sql+="";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 ='"+region+"'";
	}else{
		sql+=" and T.GROUP_ID_1='"+region+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

/************查询营服中心***************/
function listUnits(region){
	var $unit=$("#unitCode");
	var sql = "SELECT DISTINCT(T.UNIT_ID),T.UNIT_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_KPI T WHERE T.UNIT_ID IS NOT NULL ";
	if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else if(orgLevel==4){
			sql+=" AND 1=2";
		}else{
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	
	sql+=" ORDER BY T.UNIT_ID"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}