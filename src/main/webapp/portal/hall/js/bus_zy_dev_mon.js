var nowData = [];
var title=[["州市","本月累计发展(户)","环比上月同期","排名","其中移网发展（户）","环比","其中宽网发展（户）","环比","二季度累计发展时序完成率"]];
var field=["GROUP_ID_1_NAME","THIS_ALL_MON_DEV","LJ_ALL_DEV_RATE","RN","THIS_YW_MON_DEV","LJ_YW_DEV_RATE","THIS_NET_DAY_DEV","LJ_NET_DEV_RATE","SXWC_RATE"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.VIEW_MRT_ZY_DEV_REPORT"));
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
	var showtext = '销量下降分析-州市-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT GROUP_ID_1_NAME                                                                                     "+
	"      ,THIS_ALL_MON_DEV                                                                                           "+
	"      ,LJ_ALL_DEV_RATE                                                                                            "+
	"      ,RN                                                                                                         "+
	"      ,THIS_YW_MON_DEV                                                                                            "+
	"      ,LJ_YW_DEV_RATE                                                                                             "+
	"      ,THIS_NET_DAY_DEV                                                                                           "+
	"      ,LJ_NET_DEV_RATE                                                                                            "+
	"      ,SXWC_RATE                                                                                                  "+
	"FROM(                                                                                                             "+
	"      SELECT T.*                                                                                                  "+
	"            ,CASE WHEN GROUP_ID_1_NAME='全省'                                                                      "+
	"                  THEN 0                                                                                          "+
	"                  ELSE ROW_NUMBER() OVER(PARTITION BY FLAG ORDER BY TO_NUMBER(REPLACE(LJ_ALL_DEV_RATE,'%')) DESC) "+
	"                  END  RN                                                                                         "+
	"      FROM(                                                                                                       "+
	"          SELECT GROUP_ID_1_NAME                                                                                  "+
	"                ,THIS_ALL_MON_DEV                                                                                 "+
	"                ,LJ_ALL_DEV_RATE                                                                                  "+
	"                ,THIS_YW_MON_DEV                                                                                  "+
	"                ,LJ_YW_DEV_RATE                                                                                   "+
	"                ,THIS_NET_DAY_DEV                                                                                 "+
	"                ,LJ_NET_DEV_RATE                                                                                  "+
	"                ,SXWC_RATE                                                                                        "+
	"                ,1 FLAG                                                                                           "+
	"          FROM PMRT.VIEW_MRT_ZY_DEV_REPORT                                                                        "+
	"          WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1_NAME <>'全省'                                              "+
	"          UNION ALL                                                                                               "+
	"          SELECT GROUP_ID_1_NAME                                                                                  "+
	"                ,THIS_ALL_MON_DEV                                                                                 "+
	"                ,LJ_ALL_DEV_RATE                                                                                  "+
	"                ,THIS_YW_MON_DEV                                                                                  "+
	"                ,LJ_YW_DEV_RATE                                                                                   "+
	"                ,THIS_NET_DAY_DEV                                                                                 "+
	"                ,LJ_NET_DEV_RATE                                                                                  "+
	"                ,SXWC_RATE                                                                                        "+
	"                ,0 FLAG                                                                                           "+
	"          FROM PMRT.VIEW_MRT_ZY_DEV_REPORT                                                                        "+
	"          WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1_NAME ='全省'                                               "+
	"      )T                                                                                                          "+
	")                                                                                                                 ";
}
