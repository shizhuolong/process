var nowData = [];
var title=[["州市编码","州市","营服编码","营服名称","渠道名称","渠道编码","用户号码","办理时间","套餐ID","套餐名称","发展人编码","发展人HR","发展人名称"]];
var field=["GROUP_ID_1","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","GROUP_ID_4_NAME","HQ_CHAN_CODE","DEVICE_NUMBER","DEAL_DATE","PRODUCT_ID","PRODUCT_NAME","DEVELOPER","DEVELOPER_HR","DEVELOPER_NAME"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_JK_DDCARD_DEV_DAY"));
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
	var showtext = '集客钉钉卡套餐用户发展明细-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqChanCode=$("#hqChanCode").val();
	var where=" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND  '"+endDate+"'";
	if(regionCode!=''){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hqChanCode!=''){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	return " SELECT "+field.join(",")+" FROM PMRT.TB_MRT_JK_DDCARD_DEV_DAY"+where;
}
