var nowData = [];
var title=[["账期","地市名称","营服名称","用户编码","用户号码","局站名称","套餐名称","宽带速率","竣工时间","用户名称","业务类型"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","EXCH_NAME","MU_DESC","COLUMN_DESC","INNET_DATE","USER_NAME","SERVICE_TYPE"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	var maxDate=getMaxDate("PODS.TAB_ODS_NEW_EOC_BOT_MON");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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

var pageSize = 25;
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
	var sql=getSql();
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
 
function downsAll(){
	var showtext = '当月新增BOT_EOC-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(){
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var device_number=$.trim($("#device_number").val());
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(device_number!=""){
		where+=" AND DEVICE_NUMBER LIKE '%"+device_number+"%'";
	}
    if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1='"+region+"'";
	}else{
		where+=" AND 1=2";
	}
	return "SELECT "+field.join(",")+" FROM PODS.TAB_ODS_NEW_EOC_BOT_MON"+where;
}
