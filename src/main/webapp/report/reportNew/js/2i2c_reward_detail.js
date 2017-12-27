var nowData = [];
var report = null;
var orderBy='';
var maxDate=null;
var field=["AREA_NAME","UNIT_NAME","ORDER_ID","ORDER_DATE" ,"ORDER_STATE" ,"ORDER_NUMBER" ,"PRODUCT_NAME" ,"HALL_NAME" ,"HALL_CODE" ,"OPEN_PERSON_CODE" ,"OPEN_PERSON_NAME" ,"ACTIVE_CODE","ACTIVE_NAME","PAY_MODE","ORDER_FLAG","IS_TRANS","OPEN_DATE","ACTIVE_STATE","ACTIVE_TIME","ORDER_CERT_NUMBER","USER_STATUS_DESC","STATUS_CHG_DATE","REMOVE_FLAG_DESC","CERT_TYPE","CERT_NUMBER","USER_ID","DEVICE_NUMBER","IS_THIS_DEV","IS_INNET","IS_YW_REAL","IS_2ND","INNET_DATE","CLOSE_DATE","IS_PAY_LJ","PAYMENT_ID","PAYMENT_NAME","PAYMENT_TIME_FIRST","PRODUCT_ID","PRODUCT_NAME_U","PRODUCT_MIAN_U","PAYMENT_FEE_FIRST","PAYMENT_FEE_LJ","PAYMENT_NUM","BALANCE","EMP_TYPE","HR_ID","NAME","PROMOTION_FEE","FIRST_REWARD"];
var title=[["地市","区县/营服","订单ID","订单时间","订单状态","订购号码","产品名称","渠道名称","渠道ID","开户人员发展编码","开户人姓名","激活人员发展编码","激活人姓名","交付方式","订单类型","是否转线上","开户时间","激活状态","激活时间","订单证件号","用户状态","用户状态变更时间","销户标识","证件类型","证件号码","用户ID","用户号码","是否本期发展","是否在网","是否异网","是否二次充值","入网时间","销户时间","是否累计有充值","最后一次缴费ID","最后一次缴费方式名称","首次缴费时间","产品ID","子产品","主产品","首次缴费金额","累计缴费金额","累计缴费次数","实时余额","用工性质","HR编码","姓名","营销成本","人工成本"]];
$(function() {
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
	maxDate = getMaxDate("pmrt.tb_DW_V_D_HLW_OUTLINE_USER");
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var hr_id=$("#hr_id").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	var orderId=$.trim($("#orderId").val());
	var openPersonCode=$.trim($("#openPersonCode").val());
	var deviceNumber=$.trim($("#deviceNumber").val());
	var empType=$.trim($("#empType").val());
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var dealDate=maxDate.substr(0,6);
	var where=" WHERE ";
	where += " substr(payment_time_first, 1, 8) BETWEEN '"+startDate+"' AND '"+endDate+"'";
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND UNIT_ID='"+code+"'";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(hqChanlCode!=''){
		where+= " AND HALL_CODE LIKE '%"+hqChanlCode+"%'";
	}
	if(orderId!=''){
		where+= " AND ORDER_ID LIKE '%"+orderId+"%'";
	}
	if(openPersonCode!=''){
		where+= " AND OPEN_PERSON_CODE LIKE '%"+openPersonCode+"%'";
	}
	if(deviceNumber!=''){
		where+= " AND DEVICE_NUMBER LIKE '%"+deviceNumber+"%'";
	}
	if(empType!=''){
		where+= " AND EMP_TYPE LIKE '%"+empType+"%'";
	}
	
		
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
	var cdata = query("select count(*) total from(" + sql+")");
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var sql="SELECT       "+
	"AREA_NAME           "+
	",UNIT_NAME           "+
	",ORDER_ID            "+
	",ORDER_DATE          "+
	",ORDER_STATE         "+
	",ORDER_NUMBER        "+
	",PRODUCT_NAME        "+
	",HALL_NAME           "+
	",HALL_CODE           "+
	",OPEN_PERSON_CODE    "+
	",OPEN_PERSON_NAME    "+
	",ACTIVE_CODE         "+
	",ACTIVE_NAME         "+
	",PAY_MODE            "+
	",ORDER_FLAG          "+
	",IS_TRANS            "+
	",OPEN_DATE           "+
	",ACTIVE_STATE        "+
	",ACTIVE_TIME         "+
	",ORDER_CERT_NUMBER   "+
	",USER_STATUS_DESC    "+
	",STATUS_CHG_DATE     "+
	",REMOVE_FLAG_DESC    "+
	",CERT_TYPE           "+
	",CERT_NUMBER         "+
	",USER_ID             "+
	",DEVICE_NUMBER       "+
	",IS_THIS_DEV         "+
	",IS_INNET            "+
	",IS_YW_REAL          "+
	",IS_2ND              "+
	",INNET_DATE          "+
	",CLOSE_DATE          "+
	",IS_PAY_LJ           "+
	",PAYMENT_ID          "+
	",PAYMENT_NAME        "+
	",PAYMENT_TIME_FIRST  "+
	",PRODUCT_ID          "+
	",PRODUCT_NAME_U      "+
	",PRODUCT_MIAN_U      "+
	",PAYMENT_FEE_FIRST   "+
	",PAYMENT_FEE_LJ      "+
	",PAYMENT_NUM         "+
	",BALANCE             "+
	",EMP_TYPE            "+
	",HR_ID               "+
	",NAME               "+
	",PROMOTION_FEE       "+
	",FIRST_REWARD        "+
	"FROM pmrt.tb_DW_V_D_HLW_OUTLINE_USER partition(p"+maxDate+")";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "2I2C地推奖励清单明细";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function getMaxDate(tableName){
	var sql="SELECT MAX(ACCT_DATE) DEAL_DATE FROM "+tableName;
	var r=query(sql);
	if(r!=null&&r[0]!=null&&r.length>0){
		return r[0]["DEAL_DATE"];
	}
	return "";
}