var nowData = [];
var title=null;
var field=["BUS_HALL_NAME","ACC_NUM","ACC_NUML1","ACC_TB","ALL_SR","ALL_SRL","SR_TB","ARPU","ARPUL","ARPU_TB"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_INCOME_MON"));
	$("#regionCode").val("16001");
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
	dealDate=$("#dealDate").val();
	var lastYearSameMon=getLastYearSameMon(dealDate);
	title=[["营业厅",dealDate+"出账用户",lastYearSameMon+"出账用户","出账用户同比",dealDate+"出账收入",lastYearSameMon+"出账收入","出账收入同比",dealDate+"出账ARPU",lastYearSameMon+"出账ARPU","出账ARPU同比"]];
	if($("#searchTr").find("td:last").find("a").text()=="导出页面"){
		$("#searchTr").find("td:last").remove();
	}
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
	
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
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
	var showtext = '分公司点评3-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var regionCode=$("#regionCode").val();
	var where=" AND T.OPERATE_TYPE='自营' AND T.IS_BALL=1";
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT NVL(YYY_NAME,'合计') BUS_HALL_NAME                                                        "+
	"      ,SUM(ACC_NUM)       ACC_NUM                                                                      "+
	"      ,SUM(ACC_NUML)      ACC_NUML1                                                                    "+
	"      ,PMRT.LINK_RATIO(SUM(ACC_NUM),SUM(ACC_NUML),0) ACC_TB                                            "+
	"      ,SUM(ALL_SR)                                   ALL_SR                                            "+
	"      ,SUM(ALL_SRL)                                  ALL_SRL                                           "+
	"      ,PMRT.LINK_RATIO(SUM(ALL_SR),SUM(ALL_SRL),0)  SR_TB                                              "+
	"      ,PODS.GET_RADIX_POINT(                                                                           "+
	"              CASE  WHEN SUM(ACC_NUM)<>0                                                               "+
	"                    THEN SUM(ALL_SR)*10000/SUM(ACC_NUM)                                                "+
	"                    ELSE 0 END ,1)        ARPU                                                         "+
	"      ,PODS.GET_RADIX_POINT(                                                                           "+
	"              CASE WHEN SUM(ACC_NUML)<>0                                                               "+
	"                    THEN SUM(ALL_SRL)*10000/SUM(ACC_NUML)                                              "+
	"                    ELSE 0 END ,1)        ARPUL                                                        "+
	"      ,PMRT.LINK_RATIO(CASE WHEN SUM(ACC_NUM)<>0                                                       "+
	"                            THEN SUM(ALL_SR)*10000/SUM(ACC_NUM)                                        "+
	"                            ELSE 0 END,                                                                "+
	"                       CASE WHEN SUM(ACC_NUML)<>0                                                      "+
	"                            THEN SUM(ALL_SRL)*10000/SUM(ACC_NUML)                                      "+
	"                            ELSE 0 END,                                                                "+
	"                       0)                  ARPU_TB                                                     "+
	"FROM (                                                                                                 "+
	"      SELECT T.GROUP_ID_1                                                                              "+
	"            ,T.HALL_CODE                                                                               "+
	"            ,T.YYY_NAME                                                                                "+
	"            ,NVL(T1.ACC_NUM,0) ACC_NUM                                                                 "+
	"            ,NVL(T2.ACC_NUM,0) ACC_NUML                                                                "+
	"            ,NVL(T3.ALL_SR,0)  ALL_SR                                                                  "+
	"            ,NVL(T4.ALL_SR,0)  ALL_SRL                                                                 "+
	"      FROM PTEMP.TB_TEMP_BUS_HALL_INFO T                                                               "+
	"      LEFT JOIN (                                                                                      "+
	"        SELECT HQ_CHAN_CODE                                                                            "+
	"              ,GROUP_ID_1                                                                              "+
	"              ,YYT_NAME                                                                                "+
	"              ,ACC_NUM_TORTAL   ACC_NUM                                                                "+
	"        FROM PMRT.TB_MRT_BUS_USER_INCREASE_MON                                                         "+
	"        WHERE DEAL_DATE="+dealDate+"                                                                   "+
	"          AND OPERATE_TYPE='自营'                                                                       "+
	"      )T1 ON (T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"        SELECT HQ_CHAN_CODE                                                                            "+
	"              ,GROUP_ID_1                                                                              "+
	"              ,YYT_NAME                                                                                "+
	"              ,ACC_NUM_TORTAL   ACC_NUM                                                                "+
	"        FROM PMRT.TB_MRT_BUS_USER_INCREASE_MON                                                         "+
	"        WHERE DEAL_DATE="+getLastYearSameMon(dealDate)+"                                               "+
	"          AND OPERATE_TYPE='自营'                                                                       "+
	"      )T2 ON (T.HQ_CHAN_CODE=T2.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"      SELECT  HQ_CHAN_CODE                                                                             "+
	"             ,ROUND(ALL_SR,1) ALL_SR                                                                   "+
	"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                             "+
	"      WHERE DEAL_DATE="+dealDate+"                                                                     "+
	"        AND OPERATE_TYPE='自营'                                                                         "+
	"      )T3 ON (T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE)                                                          "+
	"      LEFT JOIN (                                                                                      "+
	"      SELECT  HQ_CHAN_CODE                                                                             "+
	"             ,ROUND(ALL_SR,1) ALL_SR                                                                   "+
	"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                             "+
	"      WHERE DEAL_DATE="+getLastYearSameMon(dealDate)+"                                                 "+
	"        AND OPERATE_TYPE='自营'                                                                         "+
	"      )T4 ON (T.HQ_CHAN_CODE=T4.HQ_CHAN_CODE)                                                          "+
	"      WHERE T.DEAL_DATE="+dealDate+"                                                                   "+
	        where+
	")                                                                                                      "+
	"GROUP BY GROUPING SETS (GROUP_ID_1,(GROUP_ID_1,YYY_NAME))                                              ";
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