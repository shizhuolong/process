var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","DEV_HQ_NUM","DEV_HQ_ZB" ,"DEV_HQ_HB" ,"DEV_0_HQ_NUM" ,"DEV_HQ_ZB0" ,"DEV_HQ_HB0" ,"DEV_0_HQ_NUM1" ,"DEV_L5_HQ_NUM" ,"DEV_L20_HQ_NUM" ,"DEV_L50_HQ_NUM" ,"DEV_L80_HQ_NUM" ,"DEV_L120_HQ_NUM" ,"DEV_120_HQ_NUM" ,"DEV_M120_HQ_NUM" ,"CN" ,"HZT_DEV_0_HQ_NUM" ,"HZT_DEV_L5_HQ_NUM" ,"HZT_DEV_L20_HQ_NUM" ,"HZT_DEV_L50_HQ_NUM" ,"HZT_DEV_L80_HQ_NUM" ,"HZT_DEV_L120_HQ_NUM" ,"HZT_DEV_120_HQ_NUM" ,"HZT_DEV_M120_HQ_NUM" ,"ZJTY_DEV_0_HQ_NUM","ZJTY_DEV_L5_HQ_NUM","ZJTY_DEV_L20_HQ_NUM","ZJTY_DEV_L50_HQ_NUM","ZJTY_DEV_L80_HQ_NUM","ZJTY_DEV_L120_HQ_NUM",
           "ZJTY_DEV_120_HQ_NUM","ZJTY_DEV_M120_HQ_NUM","ZLLS_DEV_0_HQ_NUM","ZLLS_DEV_L5_HQ_NUM","ZLLS_DEV_L20_HQ_NUM","ZLLS_DEV_L50_HQ_NUM","ZLLS_DEV_L80_HQ_NUM","ZLLS_DEV_L120_HQ_NUM","ZLLS_DEV_120_HQ_NUM","ZLLS_DEV_M120_HQ_NUM","BLQD_DEV_0_HQ_NUM","BLQD_DEV_L5_HQ_NUM","BLQD_DEV_L20_HQ_NUM","BLQD_DEV_L50_HQ_NUM","BLQD_DEV_L80_HQ_NUM","BLQD_DEV_L120_HQ_NUM","BLQD_DEV_120_HQ_NUM","BLQD_DEV_M120_HQ_NUM","SHZX_DEV_0_HQ_NUM","SHZX_DEV_L5_HQ_NUM","SHZX_DEV_L20_HQ_NUM","SHZX_DEV_L50_HQ_NUM","SHZX_DEV_L80_HQ_NUM","SHZX_DEV_L120_HQ_NUM","SHZX_DEV_120_HQ_NUM","SHZX_DEV_M120_HQ_NUM"];
var title=[["州市","产能汇总","","","","","","全省汇总","","","","","","","","","合作厅、专营店、社区沃店（家）","","","","","","","","其中：自建他营模式渠道","","","","","","","","战略连锁渠道","","","","","","","","便利型渠道","","","","","","","","社会直销渠道","","","","","","",""],
           ["","有销量渠道（家）","有销量渠道占比","有销量渠道环比上月","零销量渠道（家）","零销量渠道占比","零销量渠道环比上月","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X","店均产能","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X","0","1≤X＜5","5≤X＜20","20≤X＜50","50≤X＜80","80≤X＜120","120","120≤X"]];
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
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	
	var dealDate=$("#dealDate").val();
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	
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

function getSql(){
	var dealDate=$("#dealDate").val();
	var sql="SELECT GROUP_ID_1_NAME        "+
	"      ,DEV_HQ_NUM             "+
	"      ,DEV_HQ_ZB              "+
	"      ,DEV_HQ_HB              "+
	"      ,DEV_0_HQ_NUM           "+
	"      ,DEV_HQ_ZB0             "+
	"      ,DEV_HQ_HB0             "+
	"      ,DEV_0_HQ_NUM1          "+
	"      ,DEV_L5_HQ_NUM          "+
	"      ,DEV_L20_HQ_NUM         "+
	"      ,DEV_L50_HQ_NUM         "+
	"      ,DEV_L80_HQ_NUM         "+
	"      ,DEV_L120_HQ_NUM        "+
	"      ,DEV_120_HQ_NUM         "+
	"      ,DEV_M120_HQ_NUM        "+
	"      ,CN                     "+
	"      ,HZT_DEV_0_HQ_NUM       "+
	"      ,HZT_DEV_L5_HQ_NUM      "+
	"      ,HZT_DEV_L20_HQ_NUM     "+
	"      ,HZT_DEV_L50_HQ_NUM     "+
	"      ,HZT_DEV_L80_HQ_NUM     "+
	"      ,HZT_DEV_L120_HQ_NUM    "+
	"      ,HZT_DEV_120_HQ_NUM     "+
	"      ,HZT_DEV_M120_HQ_NUM    "+
	"      ,ZJTY_DEV_0_HQ_NUM      "+
	"      ,ZJTY_DEV_L5_HQ_NUM     "+
	"      ,ZJTY_DEV_L20_HQ_NUM    "+
	"      ,ZJTY_DEV_L50_HQ_NUM    "+
	"      ,ZJTY_DEV_L80_HQ_NUM    "+
	"      ,ZJTY_DEV_L120_HQ_NUM   "+
	"      ,ZJTY_DEV_120_HQ_NUM    "+
	"      ,ZJTY_DEV_M120_HQ_NUM   "+
	"      ,ZLLS_DEV_0_HQ_NUM      "+
	"      ,ZLLS_DEV_L5_HQ_NUM     "+
	"      ,ZLLS_DEV_L20_HQ_NUM    "+
	"      ,ZLLS_DEV_L50_HQ_NUM    "+
	"      ,ZLLS_DEV_L80_HQ_NUM    "+
	"      ,ZLLS_DEV_L120_HQ_NUM   "+
	"      ,ZLLS_DEV_120_HQ_NUM    "+
	"      ,ZLLS_DEV_M120_HQ_NUM   "+
	"      ,BLQD_DEV_0_HQ_NUM      "+
	"      ,BLQD_DEV_L5_HQ_NUM     "+
	"      ,BLQD_DEV_L20_HQ_NUM    "+
	"      ,BLQD_DEV_L50_HQ_NUM    "+
	"      ,BLQD_DEV_L80_HQ_NUM    "+
	"      ,BLQD_DEV_L120_HQ_NUM   "+
	"      ,BLQD_DEV_120_HQ_NUM    "+
	"      ,BLQD_DEV_M120_HQ_NUM   "+
	"      ,SHZX_DEV_0_HQ_NUM      "+
	"      ,SHZX_DEV_L5_HQ_NUM     "+
	"      ,SHZX_DEV_L20_HQ_NUM    "+
	"      ,SHZX_DEV_L50_HQ_NUM    "+
	"      ,SHZX_DEV_L80_HQ_NUM    "+
	"      ,SHZX_DEV_L120_HQ_NUM   "+
	"      ,SHZX_DEV_120_HQ_NUM    "+
	"      ,SHZX_DEV_M120_HQ_NUM   "+
	"FROM PMRT.VIEW_MRT_HQ_EFF_MON ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "渠道产能";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
