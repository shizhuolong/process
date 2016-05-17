var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","HALL_ID","HQ_CHAN_CODE","BUS_NAME","OPERATE_TYPE","SUBSCRIPTION_ID","VIRTUAL_ID","BIND_NUMBER","USER_NAME","USER_ADDRES","DEVICE_NUMBER","PRODUCT_NAME","INNER_DATE","INACTIVE_TIME","BUREAU_ID","JOIN_TYPE","SPEED_NUM","PRODUCT_ID","PRODUCT_NAME1","PRODUCT_DESC","ACCEPR_DATE","SYSTEM_NAME"];
var title=[["账期","地市名称","主厅编码","下挂厅编码","营业厅名称","经营模式","用户标识","虚拟号码","捆绑号码","用户名称","客户地址","联系方式","套餐","入网时间","离网时间","局站","接入方式","宽带速率","办理产品ID","办理产品名称","产品说明","办理时间","系统标识(BS/CB)"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	queryOperaterType();
	report = new LchReport({
		title : title,
		field : field,
		//css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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
	//经营模式
	var operateType = $("#operateType").val();
	//主厅编码
	var hallId = $("#hallId").val();
	//捆绑号码
	var bandNumber = $("#bandNumber").val();
	//系统标识
	var systemName = $("#systemName").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(operateType!=''){
		sql+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	if(hallId!=''){
		sql+=" AND T.HALL_ID = '"+ hallId+"'";
	}
	if(bandNumber!=''){
		sql+=" AND T.BIND_NUMBER = '"+ bandNumber+"'";
	}
	if(systemName!=''){
		sql+=" AND T.SYSTEM_NAME = '"+ systemName+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else{
		sql+=" and T.GROUP_ID_1 =" + region;
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
	var s="SELECT T.DEAL_DATE,                         "+
			"       T.GROUP_ID_1_NAME,                   "+
			"       T.HALL_ID,                           "+
			"       T.HQ_CHAN_CODE,                      "+
			"       T.BUS_NAME,                          "+
			"       T.OPERATE_TYPE,                      "+
			"       T.SUBSCRIPTION_ID,                   "+
			"       T.VIRTUAL_ID,                        "+
			"       T.BIND_NUMBER,                       "+
			"       T.USER_NAME,                         "+
			"       T.USER_ADDRES,                       "+
			"       T.DEVICE_NUMBER,                     "+
			"       T.PRODUCT_NAME,                      "+
			"       T.INNER_DATE,                        "+
			"       T.INACTIVE_TIME,                     "+
			"       T.BUREAU_ID,                         "+
			"       T.JOIN_TYPE,                         "+
			"       T.SPEED_NUM,                         "+
			"       T.PRODUCT_ID,                        "+
			"       T.PRODUCT_NAME1,                     "+
			"       T.PRODUCT_DESC,                      "+
			"       T.ACCEPR_DATE,                       "+
			"       T.SYSTEM_NAME                        "+
			"  FROM PMRT.TB_MRT_BUS_HALL_ZHWJ_SALE_MON T ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code =$("#code").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//经营模式
	var operateType = $("#operateType").val();
	//主厅编码
	var hallId = $("#hallId").val();
	//捆绑号码
	var bandNumber = $("#bandNumber").val();
	//系统标识
	var systemName = $("#systemName").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	
	//权限
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(operateType!=''){
		sql+=" AND T.OPERATE_TYPE = '"+ operateType+"'";
	}
	if(hallId!=''){
		sql+=" AND T.HALL_ID = '"+ hallId+"'";
	}
	if(bandNumber!=''){
		sql+=" AND T.BIND_NUMBER = '"+ bandNumber+"'";
	}
	if(systemName!=''){
		sql+=" AND T.SYSTEM_NAME = '"+ systemName+"'";
	}
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else{
		sql+=" and T.GROUP_ID_1 =" + region;
	}
	showtext = '营业厅智慧沃家营销清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql=" SELECT DISTINCT(T.GROUP_ID_1),T.GROUP_ID_1_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_COMPLETEZB T WHERE T.GROUP_ID_1 IS NOT NULL ";
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
			//listUnits(d[0].GROUP_ID_1);
			//queryOperaterType();
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		/*$area.change(function() {
			//listUnits($(this).attr('value'));
			queryOperaterType();
		});*/
	} else {
		alert("获取地市信息失败");
	}
}

/************查询营服中心***************/
/*function listUnits(region){
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
}*/

function queryOperaterType(region){
	var $operateType=$("#operateType");
	var sql = "SELECT DISTINCT T.OPERATE_TYPE FROM PMRT.TB_MRT_BUS_HALL_ZHWJ_SALE_MON T WHERE 1=1   ";
	/*if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
	}*/
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].OPERATE_TYPE
					+ '" selected >'
					+ d[0].OPERATE_TYPE + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].OPERATE_TYPE + '">' + d[i].OPERATE_TYPE + '</option>';
			}
		}
		
		var $h = $(h);
		$operateType.empty().append($h);
	} else {
		alert("获取经营模式信息失败");
	}
}