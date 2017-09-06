var nowData = [];
var title=[["州市","厅数","模式一","","终端众筹","","一厅一商","","小计","","","定比","定比排名","季度日累计任务时序完成率","年度日累计终端时序完成率"],
           ["","","日销量","月累计","日销量","月累计","日销售","月累计","日销量","月累计","单厅","","","",""]];
var field=["GROUP_ID_1_NAME","HALL_NUM","TYPE1_DEV","TYPE1_DEV1","THIS_ZCZD_DEV","THIS_ZCZD_DEV1","YTYS_NUM","YTYS_NUM1","ALL_NUM","ALL_NUM1","ALL_DT_DEV","ALL_DB","DB_RANK","SEASON_SXWC_RATE","YEAR_SXWC_RATE"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.MRT_BUS_ZY_ZD_REPORT_NEW"));
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
	dealDate=$("#dealDate").val();
	var sql=getSql(dealDate);
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
	var showtext = '自营厅终端销售日通报-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT "+field.join(",")+" FROM PMRT.MRT_BUS_ZY_ZD_REPORT_NEW WHERE DEAL_DATE='"+dealDate+"' ORDER BY DB_RANK";
}


