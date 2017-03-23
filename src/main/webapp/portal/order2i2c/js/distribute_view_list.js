var nowData = [];
var title=[["任务编号","所在团队","人员","正式订单号","订单时间","配送区县","商城实收","商城应收","订单状态","客户姓名","证件号码","预约号码","性别","年龄","套餐名称","商品名称","订购号码","配送地址","物流跟踪","激活状态","激活待人工审单","激活时间","审单人员备注","退款时间","发货时间","签收时间","物流公司","物流单号","退单原因","短信明细","审单工号","发货工号","激活工号","下单推荐人","激活推荐人"]];
var field=["WORK_NO","TEAM_NAME","NAME","ORDER_NO","ORDER_TIME","CITY_NAME","SHOOP_OFF","SHOOP_RECE","ORDER_STATUS","CUST_NAME","CARD_ID","BOOK_NUM","SEX","AGE","PRODUCT_NAME","SHOOP_NAME","SERVICE_NUMBER","ADDR_NAME","LOG_TRACK","ACTIVE_STATUS","ACTIVE_WAIT","ACTIVE_TIME","REMARK_NAME","REFUND_TIME","SEND_TIME","SIGN_TIME","LOG_COMP","ORDER_NUM","REFUND_WHY","NOTE_DETAIL","AUDIT_CODE","SEND_CODE","ACTIVE_CODE","REFER","ACTIVE_REFER"];
var report = null;
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	report = new LchReport({
		title : title,
		field : field,
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
	
	var sql="";
	sql+=" select t1.work_no,t1.team_name,t1.name,t2.* from  ";
	sql+=" PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1,             ";
	sql+=" 	PODS.TAB_ODS_2I2C_LEAD_DAY t2                    ";
	sql+=" 	where t1.order_no=t2.order_no                    ";
	sql+=" and t1.work_No='"+workNo+"'                       ";
	if(teamType==0){//所有
		sql+=" and 1=1                                       ";
	}else if(teamType==1){//团队
		sql+=" and t1.team_id='"+teamId+"'                   ";
	}else if(teamType==2){//人员
		sql+=" and t1.name_id='"+teamId+"'                   ";
	}else{
		sql+=" and 1=2                                       ";
	}
	
	
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