var nowData = [];
var title=[["帐期","地市","基层单元名称","姓名","HR编码","用户编号","用户号码","入网日期","操作员","部门","产品ID","指标编码","指标描述","指标值","发展人编码","渠道编码","渠道名称","总部编码","原始积分","原始积分编码","渠道系数","渠道调节积分","营服系数","区域调节积分","金额","营服编码"]];
var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","SUBSCRIPTION_ID","SERVICE_NUM","JOIN_DATE","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","ITEMCODE","ITEMDESC","ITEMVALUE","DEVELOPER_ID","HQ_CHANL_CODE","HQ_CHAN_NAME","FD_CHANL_CODE","SOURCE_CRE","SOURCE_CODE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY","UNIT_ID"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:10,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	
	var time=$("#time").val();
	var regionCode=$.trim($("#regionCode").val());
	var userCode=$.trim($("#userCode").val());
	var region=$.trim($("#region").val());
//条件
	var sql =
		" SELECT DEAL_DATE     	,"+
		"AREA_NAME     	,"+
		"UNIT_NAME 		,"+
		"USER_NAME 		,"+
		"HR_NO  		,"+	
		"SUBSCRIPTION_ID,"+ 
		"SERVICE_NUM 	,"+
		"JOIN_DATE 		,"+
		"OPERATOR_ID 	,"+
		"OFFICE_ID		,"+
		"PRODUCT_ID		,"+
		"ITEMCODE 		,"+
		"ITEMDESC 		,"+
		"ITEMVALUE		,"+
		"DEVELOPER_ID	,"+
		"HQ_CHANL_CODE	,"+
		"HQ_CHAN_NAME 	,"+
		"FD_CHANL_CODE 	,"+
		"SOURCE_CRE		,"+
		"SOURCE_CODE	,"+	
		"HQ_RATIO		,"+
		"HQ_CRE			,"+
		"UNIT_RATIO		,"+
		"UNIT_CRE		,"+
		"UNIT_MONEY		,"+
		"UNIT_ID	     "+
		" FROM PMRT.VIEW_JCDY_NOUNIT_MON WHERE DEAL_DATE='"+time+"' ";
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 like '%"+regionCode+"%'";
	}
	if(userCode!=''){
		sql+=" AND SERVICE_NUM like '%"+userCode+"%'";
	}
	
//权限
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ="+code;
	}else {
		sql+=" and GROUP_ID_1="+region;
	}
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
//	if (orderBy != '') {
//		sql += orderBy;
//	}
	sql+=" ORDER BY GROUP_ID_1 ";
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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
   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var regionCode=$.trim($("#regionCode").val());
	var userCode=$.trim($("#userCode").val());
	var sql=" SELECT DEAL_DATE     	,"+
	"AREA_NAME     	,"+
	"UNIT_NAME 		,"+
	"USER_NAME 		,"+
	"HR_NO  		,"+	
	"SUBSCRIPTION_ID,"+ 
	"SERVICE_NUM 	,"+
	"JOIN_DATE 		,"+
	"OPERATOR_ID 	,"+
	"OFFICE_ID		,"+
	"PRODUCT_ID		,"+
	"ITEMCODE 		,"+
	"ITEMDESC 		,"+
	"ITEMVALUE		,"+
	"DEVELOPER_ID	,"+
	"HQ_CHANL_CODE	,"+
	"HQ_CHAN_NAME 	,"+
	"FD_CHANL_CODE 	,"+
	"SOURCE_CRE		,"+
	"SOURCE_CODE	,"+	
	"HQ_RATIO		,"+
	"HQ_CRE			,"+
	"UNIT_RATIO		,"+
	"UNIT_CRE		,"+
	"UNIT_MONEY		,"+
	"UNIT_ID FROM PMRT.VIEW_JCDY_NOUNIT_MON where  DEAL_DATE='"+time+"' ";
	
	
	//条件
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(userCode!=''){
		sql+=" AND SERVICE_NUM like '%"+userCode+"%'";
	}
	
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var region=$.trim($("#region").val());
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ="+code;
	}else {
		sql+=" and GROUP_ID_1="+region;
	}
	sql+=" ORDER BY GROUP_ID_1";
	var title=[["帐期","地市","基层单元名称","姓名","HR编码","用户编号","用户号码","入网日期","操作员","部门","产品ID","指标编码","指标描述","指标值","发展人编码","渠道编码","渠道名称","总部编码","原始积分","原始积分编码","渠道系数","渠道调节积分","营服系数","区域调节积分","金额","营服编码"]];
	showtext = '未归集到基层人员的积分-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////