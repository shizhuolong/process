var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","UNIT_TYPE","TASK_INCOME","TOTAL_FEE","INCOME_COMPLETE","TASK_DEV","DEV_COUNT","DEV_COMPLETE","STOCK_RATE","BUDEGET_TASK","BUDGET_ML","ML_COMPLETE","OWEFEE_RATE","AVG_TOTAL_FEE","AVG_SL_CRE","AVG_ZZX_FEE","GW_SELF_RATE","AVG_MOVE_FEE"];
var title=[["账期 ","地市名称 ","营服名称 ","营服类型 ","收入任务<br/>（年累计）","实际收入<br/>（年累计）","收入完成率 ","积分任务<br/>（年累计）","实际积分<br/>（年累计）","积分完成率 ","存量保有率 ","毛利预算 ","毛利收入 ","毛利完成率 ","欠费率 ","人均产值 ","人均服务积分 ","人均专租线收入 ","固网自由<br/>资源占用率","站均移网收入"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	listUnitType();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN},{array:[6,9,10,13,14,18],css:LchReport.NORMAL_STYLE}],
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

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var dealDate=$("#dealDate").val();
	var regionName=$.trim($("#regionName").val());
	var unitType=$.trim($("#unitType").val());
	var regionCode =$("#regionCode").val();
	var orderBy="";
	var sql=getSql();
//条件
	if(regionName!=''){
		sql+=" AND GROUP_ID_1 = '"+regionName+"'";
	}
	if(unitType!=''){
		sql+=" AND UNIT_TYPE = '"+unitType+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	}else{
		sql+=" AND GROUP_ID_1="+regionCode;
		orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	}
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
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
	var fs = "SELECT DEAL_DATE,                                                    "+
			"       GROUP_ID_1_NAME,                                              "+
			"       UNIT_NAME,                                                    "+
			"       UNIT_TYPE,                                                    "+
			"       PODS.GET_RADIX_POINT(TASK_INCOME,2)     AS TASK_INCOME     ,  "+
			"       PODS.GET_RADIX_POINT(TOTAL_FEE,2)       AS TOTAL_FEE       ,  "+
			"       PODS.GET_RADIX_POINT(INCOME_COMPLETE,2) AS INCOME_COMPLETE ,  "+
			"       TASK_DEV                                                   ,  "+
			"       PODS.GET_RADIX_POINT(DEV_COUNT,2)       AS DEV_COUNT       ,  "+
			"       PODS.GET_RADIX_POINT(DEV_COMPLETE,2)    AS DEV_COMPLETE    ,  "+
			"       PODS.GET_RADIX_POINT(STOCK_RATE,2)      AS STOCK_RATE      ,  "+
			"       PODS.GET_RADIX_POINT(BUDEGET_TASK,2)    AS BUDEGET_TASK    ,  "+
			"       PODS.GET_RADIX_POINT(BUDGET_ML,2)       AS BUDGET_ML       ,  "+
			"       PODS.GET_RADIX_POINT(ML_COMPLETE,2)     AS ML_COMPLETE     ,  "+
			"       PODS.GET_RADIX_POINT(OWEFEE_RATE,2)     AS OWEFEE_RATE     ,  "+
			"       PODS.GET_RADIX_POINT(AVG_TOTAL_FEE,2)   AS AVG_TOTAL_FEE   ,  "+
			"       PODS.GET_RADIX_POINT(AVG_SL_CRE,2)      AS AVG_SL_CRE      ,  "+
			"       PODS.GET_RADIX_POINT(AVG_ZZX_FEE,2)     AS AVG_ZZX_FEE     ,  "+
			"       PODS.GET_RADIX_POINT(GW_SELF_RATE,2)    AS GW_SELF_RATE    ,  "+
			"       PODS.GET_RADIX_POINT(AVG_MOVE_FEE,2)    AS AVG_MOVE_FEE       "+
			"  FROM PMRT.TAB_MRT_UNIT_BENCHMARKING_MON                            "+
			" WHERE DEAL_DATE ='"+dealDate+"'";
	return fs;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var regionName=$.trim($("#regionName").val());
	var unitType=$.trim($("#unitType").val());
	var regionCode =$("#regionCode").val();
	var orderBy="";
	var sql=getSql();
//条件
	sql+=" AND DEAL_DATE="+dealDate;
	if(regionName!=''){
		sql+=" AND GROUP_ID_1 = '"+regionName+"'";
	}
	if(unitType!=''){
		sql+=" AND UNIT_TYPE = '"+unitType+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	}else{
		sql+=" AND GROUP_ID_1="+regionCode;
		orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	}
	sql+=orderBy;
	showtext = '营服全省对标指标-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	//条件
	var sql = "SELECT DISTINCT(GROUP_ID_1),GROUP_ID_1_NAME FROM PMRT.TAB_MRT_UNIT_BENCHMARKING_MON WHERE 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		
	}else{
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	sql+=" ORDER BY GROUP_ID_1";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			/*listUnits(d[0].GROUP_ID_1);*/
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			//listUnits($(this).val());
			listUnitType();
		});
	} else {
		alert("获取地市信息失败");
	}
}

/**********************查询营服类型************************/
function listUnitType(){
	var dealDate=$("#dealDate").val();
	var code = $("#regionName").val();
	var regionCode=$("#regionCode").val();
	var orgLevel=$("#orgLevel").val();
	var sql = "SELECT DISTINCT(UNIT_TYPE) FROM PMRT.TAB_MRT_UNIT_BENCHMARKING_MON WHERE 1=1 AND UNIT_TYPE IS NOT NULL ";
	//权限
	if(orgLevel==1){
		
	}else{
		sql+=" AND GROUP_ID_1='"+code+"'";
	}
	if(code!=''){
		sql+=" AND GROUP_ID_1='"+code+"' ";
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_TYPE
					+ '" selected >'
					+ d[0].UNIT_TYPE + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_TYPE + '">' + d[i].UNIT_TYPE + '</option>';
			}
		}
		
		var $h = $(h);
		$("#unitType").empty().append($h);
	} else {
		alert("获取营服类型失败");
	}
}
