var nowData = [];
var title=[["帐期","地市名称","营业厅编码","营业厅名称","日-裸机销售（顺价销售）","日-裸机销售（带卡销售）","日-合计","月-裸机销售（顺价销售）","月-裸机销售（带卡销售）","月-合计","毛利合计","毛利分享","营销成本","营业厅利润"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","YYT_HQ_CODE","YYT_HQ_NAME","NO_CHANGENUM_DAY","CHANGENUM_DAY","DAY_NUM","NO_CHANGENUM_MON","CHANGENUM_MON","MON_NUM","PROFIT_ALL","PROFIT_SHARE","ZD_COST","YYT_PROFIT"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
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
	var showtext = '营业厅终端销售统计-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var yyt_hq_code=$("#yyt_hq_code").val(); 
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(yyt_hq_code!=""){
		where+=" AND YYT_HQ_CODE LIKE '%"+yyt_hq_code+"%'";
	}
	return "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ZD_REPORT"+where+" ORDER BY GROUP_ID_1";                                          
}
