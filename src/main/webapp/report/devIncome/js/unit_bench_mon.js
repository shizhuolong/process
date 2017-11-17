var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_2_NAME","UNIT_ID","UNIT_NAME","SR_YS","SR_WC","SR_RATE","OWE_RATE","LAST_SR","COST_YS","SC_COST_LAST","MAN_COST","SR_LAST_YEAR","HR_COUNTS","SR_UP","ML_YS","ML_WC","ML_RATE","LAN_YS","LAN_WC","LAN_RATE","SC_WC","SR_2I2C_NUM"];
var title=[["账期","地市编码","地市名称","营服ID","区县营服","收入预算","收入完成","收入完成率","欠费率","去年同期收入","预算成本","去年同期市场成本","人工成本-年累计","去年总收入","平均人数","收入增长率","毛利预算","毛利完成","毛利完成率","网运成本预算","网运成本实际","网运成本完成率","市场成本完成","网厅2I2C收入"]];
var orderBy='';	
var report = null;
var downSql="";
$(function() {
	$("#time").val(getMaxDate("PMRT.TAB_MRT_UNIT_BENCH_MON"));
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}],
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
	var regionCode= $("#regionCode").val();
	var unitCode= $("#unitCode").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_BENCH_MON WHERE 1=1";
//条件
	sql+=" AND DEAL_DATE="+time;
	if(regionCode!=null&&regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=null&&unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
		orderBy=" ORDER BY UNIT_ID";
	}else{
		sql+=" AND 1=2";
	}
	downSql=sql;
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var showtext = '营服区县对标-新-'+time;
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
