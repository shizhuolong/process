var nowData = [];
var title=[["账期","地市","渠道编码","渠道名称","工号","操作人姓名","受理时间","串号","终端品牌名称","终端型号编码","终端型号名称","终端机型编码","终端机型","来源","实收金额","成本价","终端毛利"]];
var field=["DEAL_DATE","AREA","CHANNEL_ID","CHANNEL_NAME","TRADE_STAFF_ID","TRADE_STAFF_NAME","ACCEPT_DATE","IMEI","TERMINAL_BRAND_DESC","TERMINAL_MODEL_CODE","TERMINAL_MODEL_DESC","MACHINE_TYPE_CODE","MACHINE_TYPE_NAME","SOURCE","FEE","DEVICE_PRICE","ZDML"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_TS_R_CBSS_TMP"));
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
	dealDate=$("#dealDate").val();
	var hqChanCode=$("#hqChanCode").val();
	var source=$("#source").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_TS_R_CBSS_TMP WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";  
	}
	 
	if(hqChanCode!=""){
		sql+=" AND CHANNEL_ID LIKE '%"+hqChanCode+"%'";
	}
	if(source!=""){
		sql+=" AND SOURCE LIKE '%"+source+"%'";
	}
	
	sql+= " ORDER BY GROUP_ID_1,CHANNEL_ID";
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
	var showtext = '自营厅终端顺价明细-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
