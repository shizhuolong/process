var nowData = [];
var title=[["分公司","2I2C业务发展数","","","","","","2I2C业务出账用户数","","","","","","2I2C剔除赠退费后的出账收入","","","","","","4G套餐主营业务收入与出账收入占比","2I2C主营业务收入","","","","",""],
           ["","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];
var field=["GROUP_ID_1_NAME","DEV_2I2C_ZY","DEV_2I2C_JK","DEV_2I2C_DZ","DEV_2I2C_SHST","DEV_2I2C_GTWB","DEV_2I2C_ALL","ACCT_2I2C_ZY","ACCT_2I2C_JK","ACCT_2I2C_DZ","ACCT_2I2C_SHST","ACCT_2I2C_GTWB","ACCT_2I2C_ALL","SR_2I2C_ZY","SR_2I2C_JK","SR_2I2C_DZ","SR_2I2C_SHST","SR_2I2C_GTWB","SR_2I2C_ALL","SR_ZB_4G","ZY_SR_ZY","ZY_SR_JK","ZY_SR_DZ","ZY_SR_SHST","ZY_SR_GTWB","ZY_SR_ALL"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_HQ_2I2C_SRHS_HZ"));
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
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var sql="SELECT "+getSql()+" FROM PMRT.TB_MRT_HQ_2I2C_SRHS_HZ WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";
	}
	sql+=" ORDER BY DEV_2I2C_DZ DESC";
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
	var showtext = '各渠道2I2C主营收入换算表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(){
	return " GROUP_ID_1_NAME                "+
	",NVL(DEV_2I2C_ZY  ,0)  DEV_2I2C_ZY     "+
	",NVL(DEV_2I2C_JK  ,0)  DEV_2I2C_JK     "+
	",NVL(DEV_2I2C_DZ  ,0)  DEV_2I2C_DZ     "+
	",NVL(DEV_2I2C_SHST,0)  DEV_2I2C_SHST   "+
	",NVL(DEV_2I2C_GTWB,0)  DEV_2I2C_GTWB   "+
	",NVL(DEV_2I2C_ZY  ,0)                  "+
	"+NVL(DEV_2I2C_JK  ,0)                  "+
	"+NVL(DEV_2I2C_DZ  ,0)                  "+
	"+NVL(DEV_2I2C_SHST,0)                  "+
	"+NVL(DEV_2I2C_GTWB,0)  DEV_2I2C_ALL    "+
	",NVL(ACCT_2I2C_ZY  ,0)  ACCT_2I2C_ZY   "+
	",NVL(ACCT_2I2C_JK  ,0)  ACCT_2I2C_JK   "+
	",NVL(ACCT_2I2C_DZ  ,0)  ACCT_2I2C_DZ   "+
	",NVL(ACCT_2I2C_SHST,0)  ACCT_2I2C_SHST "+
	",NVL(ACCT_2I2C_GTWB,0)  ACCT_2I2C_GTWB "+
	",NVL(ACCT_2I2C_ZY  ,0)                 "+
	"+NVL(ACCT_2I2C_JK  ,0)                 "+
	"+NVL(ACCT_2I2C_DZ  ,0)                 "+
	"+NVL(ACCT_2I2C_SHST,0)                 "+
	"+NVL(ACCT_2I2C_GTWB,0)  ACCT_2I2C_ALL  "+
	",NVL(SR_2I2C_ZY  ,0)  SR_2I2C_ZY       "+
	",NVL(SR_2I2C_JK  ,0)  SR_2I2C_JK       "+
	",NVL(SR_2I2C_DZ  ,0)  SR_2I2C_DZ       "+
	",NVL(SR_2I2C_SHST,0)  SR_2I2C_SHST     "+
	",NVL(SR_2I2C_GTWB,0)  SR_2I2C_GTWB     "+
	",NVL(SR_2I2C_ZY  ,0)                   "+
	"+NVL(SR_2I2C_JK  ,0)                   "+
	"+NVL(SR_2I2C_DZ  ,0)                   "+
	"+NVL(SR_2I2C_SHST,0)                   "+
	"+NVL(SR_2I2C_GTWB,0)  SR_2I2C_ALL      "+
	",ROUND(NVL(SR_ZB_4G,0)*100,2) ||'%' SR_ZB_4G"+
	",NVL(ZY_SR_ZY  ,0)  ZY_SR_ZY           "+
	",NVL(ZY_SR_JK  ,0)  ZY_SR_JK           "+
	",NVL(ZY_SR_DZ  ,0)  ZY_SR_DZ           "+
	",NVL(ZY_SR_SHST,0)  ZY_SR_SHST         "+
	",NVL(ZY_SR_GTWB,0)  ZY_SR_GTWB         "+
	",NVL(ZY_SR_ZY  ,0)                     "+
	"+NVL(ZY_SR_JK  ,0)                     "+
	"+NVL(ZY_SR_DZ  ,0)                     "+
	"+NVL(ZY_SR_SHST,0)                     "+
	"+NVL(ZY_SR_GTWB,0)  ZY_SR_ALL          ";
}
