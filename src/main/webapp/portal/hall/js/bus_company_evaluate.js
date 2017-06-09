var nowData = [];
var title=[["营业厅","销量","","","收入","",""],
           ["","2016年小计","2017年小计","同比","2016年小计","2017年小计","同比"]];
var field=["HALL_NAME","DEV_ALLL","DEV_ALL","DEV_TB","SR_ALLL","SR_ALL","SR_TB"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_INCOME_MON"));
	$("#regionCode").val("16001");
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
	var showtext = '分公司点评1-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var regionCode=$("#regionCode").val();
	var where=" AND T.OPERATE_TYPE='自营' AND T.IS_BALL=1";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT NVL(HALL_NAME,'合计') HALL_NAME	                                                        "+
	"      ,SUM(DEV_ALLL) DEV_ALLL                                                                          "+
	"      ,SUM(DEV_ALL)  DEV_ALL                                                                           "+
	"      ,PMRT.LINK_RATIO(SUM(DEV_ALL),SUM(DEV_ALLL),0) DEV_TB                                            "+
	"      ,SUM(SR_ALLL)  SR_ALLL                                                       					"+
	"      ,SUM(SR_ALL)   SR_ALL                                                          					"+
	"      ,PMRT.LINK_RATIO(SUM(SR_ALL),SUM(SR_ALLL),0) SR_TB                                				"+
	"FROM (                                                                                                 "+
	"      SELECT T.YYY_NAME HALL_NAME                                                                      "+
	"            ,T.GROUP_ID_1                                                                              "+
	"            ,NVL(T1.DEV_ALL,0)  DEV_ALL                                                                "+
	"            ,NVL(T2.DEV_ALL,0) DEV_ALLL                                                                "+
	"            ,NVL(T3.SR_ALL,0)  SR_ALL                                                                  "+
	"            ,NVL(T4.SR_ALL,0)  SR_ALLL                                                                 "+
	"      FROM PTEMP.TB_TEMP_BUS_HALL_INFO T                                                               "+
	"      LEFT JOIN (                                                                                      "+
	"          SELECT HQ_CHAN_CODE                                                                          "+
	"                ,SUM(ALL_NUM) DEV_ALL                                                                  "+
	"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                            "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                             "+
	"          GROUP BY HQ_CHAN_CODE                                                                        "+
	"      )T1 ON (T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"          SELECT HQ_CHAN_CODE                                                                          "+
	"                ,SUM(ALL_NUM) DEV_ALL                                                                  "+
	"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON                                                            "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)            +
	"          GROUP BY HQ_CHAN_CODE                                                                        "+
	"      )T2 ON (T.HQ_CHAN_CODE=T2.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"          SELECT HQ_CHAN_CODE                                                                          "+
	"                ,SUM(ALL_SR) SR_ALL                                                                    "+
	"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
	"WHERE DEAL_DATE BETWEEN "+getSameYearFristMon(dealDate)+" AND "+dealDate+"                             "+
	"          GROUP BY HQ_CHAN_CODE                                                                        "+
	"      )T3 ON (T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"          SELECT HQ_CHAN_CODE                                                                          "+
	"                ,SUM(ALL_SR) SR_ALL                                                                    "+
	"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
	"WHERE DEAL_DATE BETWEEN "+getLastYearFristMon(dealDate)+" AND "+getLastYearSameMon(dealDate)            +
	"          GROUP BY HQ_CHAN_CODE                                                                        "+
	"      )T4 ON (T.HQ_CHAN_CODE=T4.HQ_CHAN_CODE)                                                          "+
	"      WHERE T.DEAL_DATE="+dealDate+"                                                                   "+
	     where+
	")                                                                                                      "+
	"GROUP BY GROUPING SETS (GROUP_ID_1,(GROUP_ID_1,HALL_NAME))                                             ";
}

function getSameYearFristMon(dealDate){
	var year=dealDate.substr(0,4);
	return year+'01';
}

function getLastYearSameMon(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    return (year-1)+month;
}

function getLastYearFristMon(dealDate){
	var year=dealDate.substr(0,4);
	return (year-1)+'01';
}