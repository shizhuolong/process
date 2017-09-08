var nowData = [];
var title=[["分公司","营服","营服属性","渠道经理","渠道编码","渠道名称","用户号码","套餐名称","活动名称"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","UNIT_TYPE","HQ_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","DEVICE_NUMBER","PRODUCT_NAME","SCHEME_NAME"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	var maxDate=getMaxDate("PMRT.TB_MRT_USER_WX_SCHEME_MON");
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
	var showtext = '老用户维系活动受理月报明细表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_name=$("#hq_name").val();
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_name!=""){
		where+=" AND HQ_NAME LIKE '%"+hq_name+"%'";
	}
	
	return "SELECT "+field.join(",")+" FROM PMRT.TB_MRT_USER_WX_SCHEME_MON"+where;
}
