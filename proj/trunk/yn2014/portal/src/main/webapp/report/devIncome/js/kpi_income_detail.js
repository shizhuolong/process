var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_ROLE","SUBSCRIPTION_ID","DEVICE_NUMBER","NET_TYPE","TOTAL_FEE","HQ_CHAN_CODE"];
var title=[["账期","地市名称","营服名称","HR编码","姓名","角色","用户编号","用户号码","用户类型","出账收入（剔除增费、退费）","渠道编码"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
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
	var region=$("#region").val();
	var dealDate =$("#dealDate").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//人员名称
	var useName =$("#useName").val();
	//用户电话号码
	var userPhone = $("#userPhone").val();
	//
	
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	var csql="select /*+index(NUMBER_INCOME_HR)*/ count(1) TOTAL FROM PODS.TB_ODS_JCDY_INCOME_HR_MON PARTITION(P"+dealDate+") T WHERE 1=1 ";
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
		csql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
		csql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(useName!=''){
		sql+=" AND INSTR(T.NAME,'"+useName+"')>0";
		csql+=" AND INSTR(T.NAME,'"+useName+"')>0";
	}
	if(userPhone!=''){
		sql+=" AND INSTR(T.DEVICE_NUMBER,'"+userPhone+"')>0";
		csql+=" AND INSTR(T.DEVICE_NUMBER,'"+userPhone+"')>0";
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
      if(regionCode==''&&unitCode==''&&useName==''&&userPhone==''){
    	  csql="SELECT TABLE_ROWS TOTAL FROM PODS.TB_ODS_TABLE_ROWS T WHERE OWNER='PODS' AND TABLE_NAME='TB_ODS_JCDY_INCOME_HR_MON' AND PART_NAME='P"+dealDate+"'";
      }
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 =" + code;
		csql+=" and T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID =" + code;
		csql+=" and T.UNIT_ID =" + code;
	}else{
		sql+=" and 1=2";
		csql+=" and 1=2";
	}
	
	var cdata = query(csql);
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
	var dealDate =$("#dealDate").val();
	var s=" SELECT  /*+index(NUMBER_INCOME_HR)*/ T.DEAL_DATE,                                                             "+
			"       T.GROUP_ID_1_NAME,                                                       "+
			"       T.UNIT_NAME,                                                             "+
			"       T.HR_ID,                                                                 "+
			"       T.NAME,                                                                  "+
			"       T.USER_ROLE,                                                             "+
			"       T.SUBSCRIPTION_ID,                                                       "+
			"       T.DEVICE_NUMBER,                                                         "+
			"       DECODE(T.NET_TYPE,-1,'固网', 01, '2G', 02, '3G', 03, '3G上网卡', 04, '4G') AS NET_TYPE,                                                              "+
			"       T.TOTAL_FEE,                                                             "+
			"       T.HQ_CHAN_CODE FROM PODS.TB_ODS_JCDY_INCOME_HR_MON PARTITION(P"+dealDate+") T ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code =$("#code").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//人员名称
	var useName =$("#useName").val();
	//用户电话号码
	var userPhone = $("#userPhone").val();
	//
	
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(useName!=''){
		sql+=" AND INSTR(T.NAME,'"+useName+"')>0";
	}
	if(userPhone!=''){
		sql+=" AND INSTR(T.DEVICE_NUMBER,'"+userPhone+"')>0";
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID =" + code;
	}else{
		sql+=" and 1=2";
	}
	showtext = 'KPI收入明细报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql=" SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE  T WHERE 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var region =$("#region").val();
	if(orgLevel==1){
		sql+="";
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 ='"+region+"'";
	}else{
		sql+=" AND T.GROUP_ID_1='"+region+"'";
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
	var sql = "SELECT  DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T  WHERE 1=1 ";
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