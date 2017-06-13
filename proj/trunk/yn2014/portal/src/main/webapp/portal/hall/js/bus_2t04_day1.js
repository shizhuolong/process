var nowData = [];
var title=[["分公司","总工号数","活跃工号数","","","弹窗2升4用户数","","当日办理量","办理用户总数","其中承诺低消送终端","","办理用户占弹窗总数比率"],
           ["","","当日","总累计","工号活跃率","当日","总累计","","","当日办理量","办理总数",""]];
var field=["GROUP_ID_1_NAME","GH_NUM_ALL","GH_NUM_DAY","GH_NUM_MON","GH_RATE","TC_NUM_DAY","TC_NUM_MON","BL_NUM_DAY","BL_NUM_MON","CNDX_NUM_DAY","CNDX_NUM_MON","TC_RATE_ALL"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PTEMP.TB_TEMP_BUS_2TO4_DAY"));
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
	var showtext = '2转4G和冰激淋2-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT  GROUP_ID_1_NAME                                                                                      "+
	"       ,GH_NUM_ALL                                                                                           "+
	"       ,GH_NUM_DAY                                                                                           "+
	"       ,GH_NUM_MON                                                                                           "+
	"       ,PODS.GET_RADIX_POINT(GH_RATE,1)  GH_RATE                                                             "+
	"       ,TC_NUM_DAY                                                                                           "+
	"       ,TC_NUM_MON                                                                                           "+
	"       ,BL_NUM_DAY                                                                                           "+
	"       ,BL_NUM_MON                                                                                           "+
	"       ,CNDX_NUM_DAY                                                                                         "+
	"       ,CNDX_NUM_MON                                                                                         "+
	"       ,PODS.GET_RADIX_POINT(TC_RATE_ALL,1) TC_RATE_ALL                                                      "+
	"FROM PTEMP.TB_TEMP_BUS_2TO4_DAY                                                                              "+
	"WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1_NAME='全省'                                                       "+
	"UNION ALL                                                                                                    "+
	"SELECT * FROM (                                                                                              "+
	"      SELECT GROUP_ID_1_NAME                                                                                 "+
	"            ,GH_NUM_ALL                                                                                      "+
	"            ,GH_NUM_DAY                                                                                      "+
	"            ,GH_NUM_MON                                                                                      "+
	"            ,PODS.GET_RADIX_POINT(GH_RATE,1)  GH_RATE                                                        "+
	"            ,TC_NUM_DAY                                                                                      "+
	"            ,TC_NUM_MON                                                                                      "+
	"            ,BL_NUM_DAY                                                                                      "+
	"            ,BL_NUM_MON                                                                                      "+
	"            ,CNDX_NUM_DAY                                                                                    "+
	"            ,CNDX_NUM_MON                                                                                    "+
	"            ,PODS.GET_RADIX_POINT(TC_RATE_ALL,1) TC_RATE_ALL                                                 "+
	"      FROM PTEMP.TB_TEMP_BUS_2TO4_DAY                                                                        "+
	"      WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1_NAME<>'全省' ORDER BY TO_NUMBER(REPLACE(TC_RATE_ALL,'%')) DESC)";
}
