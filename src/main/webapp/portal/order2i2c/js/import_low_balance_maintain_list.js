var nowData = [];
var title=[["号码","用户编码","余额","余额更新时间","入网时间","省份","区号","省份代码","城市","联系电话","推送时间","类型","累计缴费金额","累计缴费次数","触发原因","短信内容","活动开始时间","活动结束时间"]];
var field=["DEVICE_NUMBER","SUBSCRIPTION_ID","BALANCE","UPDATE_TIME","INNET_TIME","PRO_NAME","COUNTY_ID","PRO_CODE","CITY_NAME","CONNECT_PHONE","SEND_TIME","CON_TYPE","TOTAL_FEE","JF_TIMES","TRIGGER_RESON","MESSAGE_CONTENT","START_TIME","END_TIME"];
var orderBy = " ORDER BY DEAL_DATE DESC";
var report = null;
var downSql="";

$(function() {
	/*var orgLevel=$("#orgLevel").val();
	if(orgLevel!=1){
		$("#reppeatBtn").remove();
	}*/
	report = new LchReport({
		title : title,
		field : field,
		css:[
		      {array:[2],css:LchReport.NORMAL_STYLE}
		    ],
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
	var time=$("#time").val();
	var userName=$("#userName").val();
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_2I2C_VISIT_INPUT ";
	var where = " WHERE DEAL_DATE = "+time + " AND INPUT_USER = '"+ userName +"'";
	sql += where;
	sql += orderBy;
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/order2i2c/jsp/import_low_balance_maintain.jsp";
 }
 
 function downsAll(){
	var time=$("#time").val();
	var showtext = '低余额T3维系清单导入-'+time;
	downloadExcel(downSql,title,showtext);
 }

 