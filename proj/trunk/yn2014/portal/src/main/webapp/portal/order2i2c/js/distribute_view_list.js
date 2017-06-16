var nowData = [];
var title=[["任务编号","所在团队","人员","订单号","订单时间","地市","配送区县","订单状态","客户姓名","预约号码","套餐名称","商品名称","订购号码","激活状态"]];
var field=["WORK_NO","TEAM_NAME","NAME","ORDER_NO","ORDER_TIME","GROUP_ID_1_NAME","CITY_NAME","ORDER_STATUS","CUST_NAME","BOOK_NUM","PRODUCT_NAME","SHOOP_NAME","SERVICE_NUMBER","ACTIVE_STATUS"];


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
	sql+=" select t1.work_no,t1.team_name,t1.name,t2.* from  						";
	sql+=" PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1,PODS.TAB_ODS_2I2C_ASS_TASK T,		";
	sql+=" 	PODS.TAB_ODS_2I2C_LEAD_DAY t2                    						";
	sql+=" 	where t1.order_no=t2.order_no  and t.work_No=t1.work_No                 ";
	sql+=" and t1.work_No='"+workNo+"'                       						";
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

function exportAll(){
	var sql="select "+field.join(",")+" from( ";
	sql+=" select t1.work_no,t1.team_name,t1.name,t2.* from  						";
	sql+=" PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1,PODS.TAB_ODS_2I2C_ASS_TASK T,		";
	sql+=" 	PODS.TAB_ODS_2I2C_LEAD_DAY t2                    						";
	sql+=" 	where t1.order_no=t2.order_no  and t.work_No=t1.work_No                 ";
	sql+=" and t1.work_No='"+workNo+"'                       						";
	if(teamType==0){//所有
		sql+=" and 1=1                                       ";
	}else if(teamType==1){//团队
		sql+=" and t1.team_id='"+teamId+"'                   ";
	}else if(teamType==2){//人员
		sql+=" and t1.name_id='"+teamId+"'                   ";
	}else{
		sql+=" and 1=2                                       ";
	}
	sql+=" )"
	downloadExcel(sql,title,"分配明细");
}