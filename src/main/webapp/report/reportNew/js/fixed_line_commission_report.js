var nowData = [];
var report = null;
var orderBy='';
var field=["C1","C2","C3","C4","C5","C6","C7","C8"];
var title=[["分公司","账期","业务类型","增存量","佣金规则ID（手工录入无规则用户放入其他）","佣金规则","佣金","用户数"]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var start_date = $.trim($("#start_deal_date").val());
	var end_date = $.trim($("#end_deal_date").val());
	var c4 = $.trim($("#c4").val());
	
	//权限
	var where = " WHERE T.C2 BETWEEN '"+start_date+"' AND '"+end_date+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND T.GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
	if(c4 != "") {
		where+= " AND T.C4 = '"+c4+"'";
	}
		
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
	var cdata = query("select count(*) total from(" + sql+")");
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
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var sql="SELECT T.C1,T.C2,T.C3,T.C4,T.C5,T.C6,T.C7,T.C8 "+
	" FROM PMRT.TB_MRT_VIEW_COMMFEE_FIX T ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "固网佣金报表";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
