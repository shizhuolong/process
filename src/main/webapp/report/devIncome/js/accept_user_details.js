var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","SUBSCRIPTION_ID","SERVICE_NUM","BUSI_ID","BUSI_DESC","SLL","SOURCES","OFFICE_ID","OPERATOR_ID"];
var title=[["账期","地市名称","营服名称","HR编码","姓名","用户编号","用户号码","业务编码","业务描述","最终受理量","受理来源","部门ID ","操作员工号"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
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
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//人员姓名
	var userName =$("#userName").val();
	//业务描述
	var busiDesc =$("#busiDesc").val();
	//用户号码
	var service_num=$.trim($("#service_num").val());
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	var csql="select /*+index(NUMBER_INCOME_HR)*/ count(1) TOTAL FROM PMRT.TB_MRT_ACC_DETAIL_MON PARTITION(P"+dealDate+") T WHERE 1=1";
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
		csql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID ='"+unitCode+"'";
		csql+=" AND T.UNIT_ID ='"+unitCode+"'";
	}
	if(userName!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+userName+"')>0";
		csql+=" AND INSTR(T.SERVICE_NUM,'"+userName+"')>0";
	}
	if(busiDesc!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+busiDesc+"')>0";
		csql+=" AND INSTR(T.SERVICE_NUM,'"+busiDesc+"')>0";
	}
	if(service_num!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+service_num+"')>0";
		csql+=" AND INSTR(T.SERVICE_NUM,'"+service_num+"')>0";
	}
	var orgLevel=$("#orgLevel").val();
	//权限
	if(orgLevel==1){
		  if(regionCode==''&&unitCode==''&&userName==''&&busiDesc==''&service_num==''){
	    	  csql="SELECT TABLE_ROWS TOTAL FROM PODS.TB_ODS_TABLE_ROWS T WHERE OWNER='PMRT' AND TABLE_NAME='TB_MRT_ACC_DETAIL_MON' AND PART_NAME='P"+dealDate+"'";
	      }
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 =" + code;
		csql+=" AND T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 =" + region+" AND T.UNIT_ID='"+code+"'";
		csql+=" AND T.GROUP_ID_1 =" + region+" AND T.UNIT_ID='"+code+"'";
	}else{
		sql+=" AND T.HR_ID="+code;
		csql+=" AND T.HR_ID="+code;
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
		var dealDate=$("#dealDate").val();
		var s="SELECT /*+index(NUM_ACC_DETAIL)*/ T.DEAL_DATE,"+
			"       T.GROUP_ID_1_NAME,            "+
			"       T.UNIT_NAME,                  "+
			"       T.HR_ID,                      "+
			"       T.NAME,                       "+
			"       T.SUBSCRIPTION_ID,            "+
			"       T.SERVICE_NUM,                "+
			"       T.BUSI_ID,                    "+
			"       T.BUSI_DESC,                  "+
			"       T.SLL,                        "+
			"       T.SOURCES,                    "+
			"       T.OFFICE_ID,                  "+
			"       T.OPERATOR_ID                 "+
			"  FROM PMRT.TB_MRT_ACC_DETAIL_MON  partition(p"+dealDate+")T  ";
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
	var unitCode =$("#unitCode").val();
	//人员姓名
	var userName =$("#userName").val();
	//业务描述
	var busiDesc =$("#busiDesc").val();
	//用户号码
	var service_num=$.trim($("#service_num").val());
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID ='"+unitCode+"'";
	}
	if(userName!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+userName+"')>0";
	}
	if(busiDesc!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+busiDesc+"')>0";
	}
	if(service_num!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+service_num+"')>0";
	}
	var orgLevel=$("#orgLevel").val();
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 =" + region+" AND T.UNIT_ID='"+code+"'";
	}else{
		sql+=" AND T.HR_ID="+code;
	}
	showtext = '受理用户明细-'+dealDate;
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
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else{
		sql+=" and T.GROUP_ID_1='"+region+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1";
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
		/**查询营服中心编码条件是有地市编码，***/
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
	
	sql+=" ORDER BY T.UNIT_ID";
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