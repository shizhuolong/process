var nowData = [];
var report = null;
var orderBy='';
var maxDate=null;
var field=["AREA_NAME","UNIT_NAME","ORDER_FLAG","PAY_MODE","USER_ID","DEVICE_NUMBER","HALL_CODE","HALL_NAME","CHANNEL_TYPE","OPEN_PERSON_CODE","OPEN_PERSON_NAME","ACTIVE_NAME","ACTIVE_CODE","EMP_TYPE","HR_ID","OPEN_DATE","INNET_DATE","PAYMENT_TIME_FIRST","PAYMENT_FEE_FIRST","COMM","PROMOTION_FEE","FIRST_REWARD"];
var title=[["州市","区县/营服","订单来源","订单类型","用户编码","订购号码","渠道ID","渠道名称","渠道属性","开户人员发展编码","开户人姓名","激活人姓名","激活人员发展编码","用工性质","HR编码","开户时间","激活时间","首冲时间","首冲金额","奖励金额","",""],
           ["","","","","","","","","","","","","","","","","","","","系统出佣","营销成本","人工成本"]];
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
	var dealDate=$("#dealDate").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
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
	if(openPersonCode!=''){
		where+= " AND OPEN_PERSON_CODE LIKE '%"+openPersonCode+"%'";
	}
	if(deviceNumber!=''){
		where+= " AND DEVICE_NUMBER LIKE '%"+deviceNumber+"%'";
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
	var dealDate = $("#dealDate").val();
	var sql="SELECT AREA_NAME ,						                "+
	"       UNIT_NAME ,  						                "+
	"       DECODE(ORDER_FLAG,						            "+
	"              'SDG',						                "+
	"              '闪电购',						            "+
	"              'XCS',						                "+
	"              '码上购',						            "+
	"              'YYT',						                "+
	"              '码上购',						            "+
	"              '沃云销') ORDER_FLAG, 						"+
	"       CASE						                        "+
	"         WHEN ORDER_FLAG = 'SDG' THEN						"+
	"          '现场交付'						                "+
	"         WHEN ORDER_FLAG = 'YYT' THEN						"+
	"          '到厅自提'						                "+
	"         WHEN ORDER_FLAG = 'XCS' THEN						"+
	"          '现场受理'						                "+
	"         WHEN ORDER_FLAG LIKE '%WMBT%'  THEN				"+
	"          PAY_MODE						                    "+
	"       END PAY_MODE,						                "+
	"       USER_ID,						                    "+
	"       DEVICE_NUMBER,						                "+
	"       HALL_CODE,						                    "+
	"       HALL_NAME,						                    "+
	"       CHANNEL_TYPE,						                "+
	"       OPEN_PERSON_CODE,						            "+
	"       OPEN_PERSON_NAME,						            "+
	"       ACTIVE_NAME,						                "+
	"       ACTIVE_CODE,						                "+
	"       EMP_TYPE,						                    "+
	"       HR_ID,						                        "+
	"       OPEN_DATE,						                    "+
	"       INNET_DATE,						                    "+
	"       PAYMENT_TIME_FIRST,						            "+
	"       PAYMENT_FEE_FIRST,						            "+
	"       COMM,						                        "+
	"       PROMOTION_FEE,						                "+
	"       FIRST_REWARD						                "+
	"  FROM PMRT.TB_HLW_OUTLINE_USER_COMM PARTITION(p"+dealDate+")  ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "2I2C地推奖励清单明细";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////