var nowData = [];
var title=[["套餐名称","发展用户数","当月新发展三无极低用户数","使用过4G网络用户数"]];
var field=["PRODUCT_NAME","ALL_DEV","IS_SW_JD","IS_4G_NET"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_HQ_DEV_DETAIL_MON"));
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
	var showtext = '渠道发展用户月报汇总表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT '合计' PRODUCT_NAME                           "+
	"      ,COUNT(SUBSCRIPTION_ID)  ALL_DEV                     "+
	"      ,COUNT(CASE WHEN NVL(IS_SW,0)=1 AND NVL(IS_JD,0)=1   "+
	"             THEN SUBSCRIPTION_ID                          "+
	"             END                                           "+
	"             )            IS_SW_JD                         "+
	"      ,COUNT(CASE WHEN NVL(IS_4G_NET,0)=1                  "+
	"             THEN SUBSCRIPTION_ID                          "+
	"             END )  IS_4G_NET                              "+
	"FROM  PMRT.TB_MRT_HQ_DEV_DETAIL_MON                        "+
	     where+
	"UNION ALL                                                  "+
	"SELECT NVL(PRODUCT_NAME,'无套餐')                            "+
	"      ,COUNT(SUBSCRIPTION_ID)  ALL_DEV                     "+
	"      ,COUNT(CASE WHEN NVL(IS_SW,0)=1 AND NVL(IS_JD,0)=1   "+
	"             THEN SUBSCRIPTION_ID                          "+
	"             END                                           "+
	"             )            IS_SW_JD                         "+
	"      ,COUNT(CASE WHEN NVL(IS_4G_NET,0)=1                  "+
	"             THEN SUBSCRIPTION_ID                          "+
	"             END )  IS_4G_NET                              "+
	"FROM  PMRT.TB_MRT_HQ_DEV_DETAIL_MON                        "+
	    where+
	"GROUP BY GROUPING SETS (DEAL_DATE,(DEAL_DATE,PRODUCT_NAME))";                                            
}
