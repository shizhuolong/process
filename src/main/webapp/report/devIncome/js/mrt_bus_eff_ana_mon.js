var nowData = [];
var title=[["账期","地市名称","营业厅编码","营业厅名称","营业厅地址","经营模式","营业厅类型","本月用户开账收入合计","本年新增用户开账收入","本月用户成本合计","本年新增用户成本合计","房租","实际成本","本月毛利","本月毛利率","新发展用户毛利","新发展用户毛利率","本月销量","日均销量","本月服务量","日均服务量"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME", "HALL_ID", "BUS_HALL_NAME","YYT_ARRE_NAME", "OPERATE_TYPE","YYY_TYPE","SR_ACC", "SR_NEW", "CB_ACC", "CB_NEW","MON_RENT","REAL_COST","ML_SR_ACC", "ML_SR_ACC_RATE", "ML_SR_NEW", "ML_SR_NEW_RATE","DEV_NEW", "DEV_NEW_RJ", "ACCEPT", "ACCEPT_RJ"];
var orderBy = " ORDER BY GROUP_ID_1,HALL_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN},{eq:3,css:LchReport.SUM_PART_STYLE}],
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var yyt_code=$("#yyt_code").val();
	var yyt_name=$("#yyt_name").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TB_MRT_BUS_EFF_ANA_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_code!=''){
		sql+=" AND HQ_CHAN_CODE LIKE '%" +yyt_code+"%'";
	}
	if(yyt_name!=''){
		sql+=" AND BUS_HALL_NAME LIKE '%" +yyt_name+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
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
 
function downsAll(){
	var showtext = '营业厅效能基础数据月报-'+time;
	downloadExcel(downSql,title,showtext);
}
