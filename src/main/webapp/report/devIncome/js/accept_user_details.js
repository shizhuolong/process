var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","SUBSCRIPTION_ID","SERVICE_NUM","BUSI_ID","BUSI_DESC","SLL","SOURCES","OFFICE_ID","OPERATOR_ID"];
var title=[["账期","地市名称","营服名称","HR编码","姓名","用户编号","用户号码","业务编码","业务描述","最终受理量","受理来源","部门ID ","操作员工号"]];
var orderBy='';	
var report = null;
$(function() {
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
	var userName =$.trim($("#userName").val());
	//业务描述
	var busiDesc =$.trim($("#busiDesc").val());
	//用户号码
	var service_num=$.trim($("#service_num").val());
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	var csql="select  count(rowid) TOTAL FROM PMRT.TB_MRT_ACC_DETAIL_MON PARTITION(P"+dealDate+") T WHERE 1=1";
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
		csql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
		csql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" AND INSTR(T.NAME,'"+userName+"')>0";
		csql+=" AND INSTR(T.NAME,'"+userName+"')>0";
	}
	if(busiDesc!=''){
		sql+=" AND INSTR(T.BUSI_DESC,'"+busiDesc+"')>0";
		csql+=" AND INSTR(T.BUSI_DESC,'"+busiDesc+"')>0";
	}
	if(service_num!=''){
		sql+=" AND T.SERVICE_NUM = '"+service_num+"'";
		csql+=" AND T.SERVICE_NUM = '"+service_num+"'";
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
		sql+=" AND T.GROUP_ID_1 =" + region+" AND UNIT_ID IN("+_unit_relation(code)+") ";
		csql+=" AND T.GROUP_ID_1 =" + region+" AND UNIT_ID IN("+_unit_relation(code)+") ";
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
	sql+=" ORDER BY GROUP_ID_1,UNIT_ID ";
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
		var s="SELECT  T.DEAL_DATE,"+
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
	var userName =$.trim($("#userName").val());
	//业务描述
	var busiDesc =$.trim($("#busiDesc").val());
	//用户号码
	var service_num=$.trim($("#service_num").val());
	//条件
	var sql = getSql()+" WHERE 1=1" ;
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" AND INSTR(T.NAME,'"+userName+"')>0";
	}
	if(busiDesc!=''){
		sql+=" AND INSTR(T.BUSI_DESC,'"+busiDesc+"')>0";
	}
	if(service_num!=''){
		sql+=" AND T.SERVICE_NUM = '"+service_num+"'";
	}
	var orgLevel=$("#orgLevel").val();
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 =" + region+" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND T.HR_ID="+code;
	}
	sql+=" ORDER BY GROUP_ID_1,UNIT_ID ";
	showtext = '受理用户明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



