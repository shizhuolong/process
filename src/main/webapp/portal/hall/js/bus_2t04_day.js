var nowData = [];
var title=[["分公司","2转4","","","冰激凌","",""],
           ["","任务数","完成数","完成率","任务数","完成数","完成率"]];
var field=["GROUP_ID_1_NAME","TAR_2TO4","DEV_2TO4","RATE_2TO4","TAR_BJL","DEV_BJL","RATE_BJL"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PTEMP.TB_TEMP_BUS_2TO4_BJL_DAY"));
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
	var showtext = '2转4G和冰激淋1-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT GROUP_ID_1_NAME                                                                          "+
	"      ,TAR_2TO4                                                                                 "+
	"      ,DEV_2TO4                                                                                 "+
	"      ,PODS.GET_RADIX_POINT(RATE_2TO4,1) RATE_2TO4                                              "+
	"      ,TAR_BJL                                                                                  "+
	"      ,DEV_BJL                                                                                  "+
	"      ,PODS.GET_RADIX_POINT(RATE_BJL,1) RATE_BJL                                                "+
	"FROM PTEMP.TB_TEMP_BUS_2TO4_BJL_DAY                                                             "+
	"WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1_NAME='全省'                                         "+
	"UNION ALL                                                                                       "+
	"SELECT * FROM (                                                                                 "+
	"SELECT GROUP_ID_1_NAME                                                                          "+
	"      ,TAR_2TO4                                                                                 "+
	"      ,DEV_2TO4                                                                                 "+
	"      ,PODS.GET_RADIX_POINT(RATE_2TO4,1) RATE_2TO4                                              "+
	"      ,TAR_BJL                                                                                  "+
	"      ,DEV_BJL                                                                                  "+
	"      ,PODS.GET_RADIX_POINT(RATE_BJL,1) RATE_BJL                                                "+
	"FROM PTEMP.TB_TEMP_BUS_2TO4_BJL_DAY                                                             "+
	"WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1_NAME<>'全省' ORDER BY TO_NUMBER(REPLACE(RATE_2TO4,'%')))";
}
