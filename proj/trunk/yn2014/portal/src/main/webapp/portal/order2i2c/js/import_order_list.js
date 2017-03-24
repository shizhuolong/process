var nowData = [];
var title=[["正式订单号","订单时间","配送区县","商城实收","商城应收","订单状态","客户姓名","证件号码","预约号码","性别","年龄","套餐名称","商品名称","订购号码","配送地址","物流跟踪","激活状态","激活待人工审单","激活时间","审单人员备注","退款时间","发货时间","签收时间","物流公司","物流单号","退单原因","短信明细","审单工号","发货工号","激活工号","下单推荐人","激活推荐人"]];
var field=["ORDER_NO","ORDER_TIME","CITY_NAME","SHOOP_OFF","SHOOP_RECE","ORDER_STATUS","CUST_NAME","CARD_ID","BOOK_NUM","SEX","AGE","PRODUCT_NAME","SHOOP_NAME","SERVICE_NUMBER","ADDR_NAME","LOG_TRACK","ACTIVE_STATUS","ACTIVE_WAIT","ACTIVE_TIME","REMARK_NAME","REFUND_TIME","SEND_TIME","SIGN_TIME","LOG_COMP","ORDER_NUM","REFUND_WHY","NOTE_DETAIL","AUDIT_CODE","SEND_CODE","ACTIVE_CODE","REFER","ACTIVE_REFER"];
var report = null;

var downSql="";
var orgLevel="";
$(function() {
	orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		$("#orderImportBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var username=$("#username").val();
	var sql="SELECT "+field.join(",")+" FROM PODS.TAB_ODS_2I2C_LEAD_DAY WHERE ORDER_TIME BETWEEN '"+startTime+"' AND '"+endTime+"'";
	if(orgLevel==2){
		sql+=" AND LOGIN_NAME='"+username+"'";
	}
	var orderNo=$("#orderNo").val();
	var active_status=$("#active_status").val();
	if(orderNo!=""){
		sql+=" AND ORDER_NO='"+orderNo+"'";
	}
	if(active_status!=""){
		sql+=" AND ACTIVE_STATUS='"+active_status+"'";
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
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

function orderImport(){
	 window.location.href=$("#ctx").val()+"/portal/order2i2c/jsp/import_order.jsp";
}
  
function orderExport(){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var showtext = '订单-'+startTime+"-"+endTime;
	downloadExcel(downSql,title,showtext);
}