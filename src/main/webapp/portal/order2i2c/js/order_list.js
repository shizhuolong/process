var nowData = [];

var title=[["任务编号","所在团队","接收人","正式订单号","订单时间","省份","地市",
            "配送区县","商城实收","商城应收","订单状态","客户姓名",
            "证件号码","预约号码","性别","年龄","商品名称","订购号码",
            "配送地址","激活状态","是否首充","用户状态","累计充值金额","未激活时间","未首充时间"]];
var field=["WORK_NO","TEAM_NAME","NAME","ORDER_NO","ORDER_TIME","GROUP_ID_0_NAME","GROUP_ID_1_NAME",
           "CITY_NAME","SHOOP_OFF","SHOOP_RECE","ORDER_STATUS","CUST_NAME",
           "CARD_ID","BOOK_NUM","SEX","AGE","SHOOP_NAME","SERVICE_NUMBER",
           "ADDR_NAME","ACTIVE_STATUS","IS_FIRST","SERVICE_NAME","ADD_PAYMENT_FEE","NOT_ACTIVE_DAY","NOT_FIRST_TIME"];

var orderBy="";
var report = null;
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	listServiceNames();
	report = new LchReport({
		title : [["外呼记录"].concat(title[0])],
		field : [""].concat(field),
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};  
		},
		orderCallBack : function(index, type) {
			orderBy = " ORDER BY " + field[--index] + " " + type + " ";
			search(0);
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
function showVisit(a){
	$row=$(a).parent().parent();
	var orderNo=$row.attr("ORDER_NO");
	alert(orderNo);
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var activeStatus=$("#activeStatus").val();
	var isFirst=$("#isFirst").val();
	var serviceName=$("#serviceName").val();
	var userName=$("#userName").val();
	
	var orderNo=$("#orderNo").val();
	var serviceNumber=$("#serviceNumber").val();
	var bookNum=$("#bookNum").val();
	
	var sql="";
	sql+=" select t1.work_no,t1.team_name,t1.name,t2.* from  						";
	sql+=" PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1,PODS.TAB_ODS_2I2C_ASS_TASK T,		";
	sql+=" 	PODS.TAB_ODS_2I2C_LEAD_DAY t2                    						";
	sql+=" 	where t1.order_no=t2.order_no  and t.work_No=t1.work_No                 ";
	sql+=" and t.operator='"+userName+"'                       						";
	if(activeStatus){
		sql+=" and t2.ACTIVE_STATUS='"+activeStatus+"'                       		";
	}
	if(isFirst){
		sql+=" and t2.IS_FIRST='"+isFirst+"'                       		            ";
	}
	if(serviceName){
		sql+=" and t2.SERVICE_NAME='"+serviceName+"'                       		    ";
	}
	
	if(orderNo){
		sql+=" and t2.ORDER_NO='"+orderNo+"'                       		            ";
	}
	if(serviceNumber){
		sql+=" and t2.SERVICE_NUMBER='"+serviceNumber+"'                       		";
	}
	if(bookNum){
		sql+=" and t2.BOOK_NUM='"+bookNum+"'                       		            ";
	}
	
	//排序
	if (orderBy != '') {
		sql ="select * from ("+sql+")"+ orderBy;
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	
	if(total<=0) return ;
	
	$("#lch_DataBody").find("TR").each(function(){
		var $oper=$(this).find("TD:eq(0)");
		var orderNo=$oper.parent().attr("ORDER_NO");
		var $a=$("<a href='javascript:void(0);' onclick='showVisit(\""+orderNo+"\")'>查看</a>");
		$oper.empty().html($a);
	});
}
function showVisit(orderNo){
	var d=query("select * from PODS.TAB_ODS_2I2C_REMARK where order_no='"+orderNo+"' order by insert_time desc");
	
	if(d==null) d=[];
	
	var h="";
	
	
	
	h+="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
	+"<table><thead class='lch_DataHead'><tr><th>外呼时间</th><th>外呼状态</th><th>外呼描述</th></tr></thead><tbody class='lch_DataBody'>";
	for(var i=0;i<d.length;i++){
		h+="<tr><td>"+isNull(d[i]["INSERT_TIME"])
		+"</td><td>"+isNull(d[i]["OUTBOUND"])
		+"</td><td>"+isNull(d[i]["REMARK"])+"</td></tr>";
	}
	if(d.length==0){
		h+="<tr><td colspan=3>暂无记录</td></tr>";
	}
	h+="</tbody>"
	+"</table>";
	
	art.dialog({
		title: '外呼记录',
		id:'d'+orderNo,
		content: h,
		padding: 0,
		lock:true
	});
}
function exportAll(){
	var activeStatus=$("#activeStatus").val();
	var isFirst=$("#isFirst").val();
	var serviceName=$("#serviceName").val();
	var userName=$("#userName").val();
	
	var orderNo=$("#orderNo").val();
	var serviceNumber=$("#serviceNumber").val();
	var bookNum=$("#bookNum").val();
	
	var sql="select "+field.join(",")+" from( ";
	sql+=" select t1.work_no,t1.team_name,t1.name,t2.* from  						";
	sql+=" PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1,PODS.TAB_ODS_2I2C_ASS_TASK T,		";
	sql+=" 	PODS.TAB_ODS_2I2C_LEAD_DAY t2                    						";
	sql+=" 	where t1.order_no=t2.order_no  and t.work_No=t1.work_No                 ";
	sql+=" and t.operator='"+userName+"'                       						";
	if(activeStatus){
		sql+=" and t2.ACTIVE_STATUS='"+activeStatus+"'                       		";
	}
	if(isFirst){
		sql+=" and t2.IS_FIRST='"+isFirst+"'                       		            ";
	}
	if(serviceName){
		sql+=" and t2.SERVICE_NAME='"+serviceName+"'                       		    ";
	}
	
	if(orderNo){
		sql+=" and t2.ORDER_NO='"+orderNo+"'                       		            ";
	}
	if(serviceNumber){
		sql+=" and t2.SERVICE_NUMBER='"+serviceNumber+"'                       		";
	}
	if(bookNum){
		sql+=" and t2.BOOK_NUM='"+bookNum+"'                       		            ";
	}
	
	sql+=" )"
	downloadExcel(sql,title,"分配明细");
}
function listServiceNames(){
	var $serviceName = $("#serviceName");
	var sql = " SELECT distinct T.SERVICE_NAME FROM PODS.TAB_ODS_2I2C_LEAD_DAY T where T.SERVICE_NAME is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].SERVICE_NAME
					+ '" selected >'
					+ d[0].SERVICE_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].SERVICE_NAME + '">' + d[i].SERVICE_NAME + '</option>';
			}
		}
		var $h = $(h);
		$serviceName.empty().append($h);
	} else {
		alert("获取人员状态失败");
	}
}
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}