var nowData = [];
var title=[["州市","当日12点发展量","","当日18点发展量",""],
           ["","2I2C","线下产品","2I2C","线下产品"]];
var field=["GROUP_ID_1_NAME","THIS_12_2I2C_NUM","THIS_12_NUM","THIS_18_2I2C_NUM","THIS_18_NUM"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PODS.TAB_ODS_SCH_DEV_DAY"));
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

var pageSize = 30;
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
	var showtext = '校园秋开通报-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel!=1){
		where+=" AND GROUP_ID_1='"+region+"'";
	}
	return "SELECT "+field.join(",")+" FROM PODS.TAB_ODS_SCH_DEV_DAY"+where;
}
