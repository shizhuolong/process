var nowData = [];
var title=[["帐期","地市","地市编码","基层单元名称","姓名","HR编码","用户编号","用户号码","入网日期","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","指标编码","指标描述","ITEMVALUE","DEVELOPER_ID","HQ_CHANL_CODE","渠道名称","总部编码","SOURCE_CRE","SOURCE_CODE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY","UNIT_ID"]];
var field=["DEAL_DATE","AREA_NAME","GROUP_ID_1","UNIT_NAME","USER_NAME","HR_NO","SUBSCRIPTION_ID","SERVICE_NUM","JOIN_DATE","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","ITEMCODE","ITEMDESC","ITEMVALUE","DEVELOPER_ID","HQ_CHANL_CODE","HQ_CHAN_NAME","FD_CHANL_CODE","SOURCE_CRE","SOURCE_CODE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY","UNIT_ID"];
var orderBy = '';
var report = null;
$(function() {
	getRegionName();
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
function getRegionName(){
	var sql="select distinct t.area_name regionName from PMRT.VIEW_JCDY_NOUNIT_MON t where 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	//var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and 1=2";
	}
	var result=query(sql);
	 var html="";
	if(result.length==1){
		html+="<option selected value="+result[0].REGIONNAME+">"+result[0].REGIONNAME+"</option>";
		$("#regionName").empty().append($(html));
		//getUnitName($("#regionName"));
	}else{
		 html +="<option value=''>全部</option>";
		    for(var i=0;i<result.length;i++){
		    	html+="<option value="+result[i].REGIONNAME+">"+result[i].REGIONNAME+"</option>";
		    }
	}
    $("#regionName").empty().append($(html));
}
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
	var cityName=$.trim($("#regionName").val());
	var userCode=$.trim($("#userCode").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = " FROM PMRT.VIEW_JCDY_NOUNIT_MON WHERE 1=1 ";
	if(time!=''){
		sql+=" AND DEAL_DATE='"+time+"' ";
	}
	if(cityName!=''){
		sql+=" AND AREA_NAME like '%"+cityName+"%'";
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
		sql+=" and GROUP_ID_1="+regionCode;
	}
	
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
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
	var s=" SELECT DEAL_DATE     	,"+
			"AREA_NAME     	,"+
			"GROUP_ID_1    	,"+
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
			"UNIT_ID	    ";		

	sql = s + sql;
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
	var sql=" SELECT DEAL_DATE     	,"+
	"AREA_NAME     	,"+
	"GROUP_ID_1    	,"+
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
	"UNIT_ID	    FROM PMRT.VIEW_JCDY_NOUNIT_MON where 1=1 " ;
	
	var time=$("#time").val();
	var cityName=$.trim($("#regionName").val());
	var userCode=$.trim($("#userCode").val());
	//条件
	if(time!=''){
		sql+=" AND DEAL_DATE='"+time+"' ";
	}
	if(cityName!=''){
		sql+=" AND AREA_NAME like '%"+cityName+"%'";
	}
	if(userCode!=''){
		sql+=" AND SERVICE_NUM like '%"+userCode+"%'";
	}
	
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var regionCode=$.trim($("#regionCode").val());
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ="+code;
	}else {
		sql+=" and GROUP_ID_1="+regionCode;
	}
	sql+=" ORDER BY GROUP_ID_1";
	var title=[["帐期","地市","地市编码","基础单元名称","姓名","HR编码","用户编号","用户号码","入网日期","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","指标编码","指标描述","ITEMVALUE","DEVELOPER_ID","HQ_CHANL_CODE","渠道名称","总部编码","SOURCE_CRE","SOURCE_CODE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY","UNIT_ID"]];
	showtext = '未归集到基层人员的积分-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////