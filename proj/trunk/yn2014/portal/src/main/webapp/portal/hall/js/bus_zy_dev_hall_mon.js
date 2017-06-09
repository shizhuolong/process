var nowData = [];
var title=[["州市","厅数","20户以下厅数(个)","其中零销厅(个)","低销厅","","零销厅",""],
            ["","","","","低销厅占比","环比","零销厅占比","环比"]];
var field=["GROUP_ID_1_NAME","HQ_NUM","LESS_20_NUM","EQU_0_NUM","ZB_DXT","HB_DXT","ZB_0XT","HB_0XT"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_HALL_DEV_DAY"));
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
	var showtext = '销量下降分析-厅-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	return "SELECT T.GROUP_ID_1_NAME                                                          "+
	"      ,T1.HQ_NUM                                                                         "+
	"      ,T1.LESS_20_NUM                                                                    "+
	"      ,T1.EQU_0_NUM                                                                      "+
	"      ,PODS.GET_RADIX_POINT( CASE WHEN T1.HQ_NUM<>0                                      "+
	"            THEN NVL(T1.LESS_20_NUM,0)/NVL(T1.HQ_NUM,0)*100                              "+
	"            ELSE 0 END   || '%',0)  ZB_DXT                                               "+
	"      ,PMRT.LINK_RATIO(CASE WHEN T1.HQ_NUM<>0                                            "+
	"                            THEN NVL(T1.LESS_20_NUM,0)/NVL(T1.HQ_NUM,0)                  "+
	"                            ELSE 0 END,                                                  "+
	"                       CASE WHEN T2.HQ_NUM<>0                                            "+
	"                            THEN NVL(T2.LESS_20_NUM,0)/NVL(T2.HQ_NUM,0)                  "+
	"                            ELSE 0 END,                                                  "+
	"                        0)          HB_DXT                                               "+
	"      ,PODS.GET_RADIX_POINT( CASE WHEN T1.HQ_NUM<>0                                      "+
	"            THEN NVL(T1.EQU_0_NUM,0)/NVL(T1.HQ_NUM,0)*100                                "+
	"            ELSE 0 END   || '%',0)   ZB_0XT                                              "+
	"      ,PMRT.LINK_RATIO(CASE WHEN T1.HQ_NUM<>0                                            "+
	"                            THEN NVL(T1.EQU_0_NUM,0)/NVL(T1.HQ_NUM,0)                    "+
	"                            ELSE 0 END,                                                  "+
	"                       CASE WHEN T2.HQ_NUM<>0                                            "+
	"                            THEN NVL(T2.EQU_0_NUM,0)/NVL(T2.HQ_NUM,0)                    "+
	"                            ELSE 0 END,                                                  "+
	"                        0)          HB_0XT                                               "+
	"FROM PCDE.TB_CDE_BUS_HALL_TARGET T                                                       "+
	"LEFT JOIN (                                                                              "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                        "+
	"      ,COUNT（HQ_CHAN_CODE）HQ_NUM                                                        "+
	"      ,COUNT(CASE WHEN  ALL_NUM1<20                                                      "+
	"                  THEN HQ_CHAN_CODE                                                      "+
	"                  END)  LESS_20_NUM                                                      "+
	"      ,COUNT(CASE WHEN  NVL(ALL_NUM1,0)=0                                                "+
	"                  THEN HQ_CHAN_CODE                                                      "+
	"                  END)  EQU_0_NUM                                                        "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY                                                        "+
	"WHERE DEAL_DATE="+dealDate+"                                                             "+
	"      AND OPERATE_TYPE='自营'                                                             "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                         "+
	") T1 ON (T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                           "+
	"LEFT JOIN (                                                                              "+
	"SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                        "+
	"      ,COUNT（HQ_CHAN_CODE）HQ_NUM                                                        "+
	"      ,COUNT(CASE WHEN  ALL_NUM1<20                                                      "+
	"                  THEN HQ_CHAN_CODE                                                      "+
	"                  END)  LESS_20_NUM                                                      "+
	"      ,COUNT(CASE WHEN  NVL(ALL_NUM1,0)=0                                                "+
	"                  THEN HQ_CHAN_CODE                                                      "+
	"                  END)  EQU_0_NUM                                                        "+
	"FROM PMRT.TB_MRT_BUS_HALL_DEV_DAY                                                        "+
	"WHERE DEAL_DATE="+getLastMon(dealDate)+
	"  AND OPERATE_TYPE='自营'                                                                 "+
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                         "+
	") T2 ON (T.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                           ";
}

function getLastMon(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    var day=dealDate.substr(6,8);
    if(month=='01'){
    	return (year-1)+'12';
    }
   return (parseInt(dealDate.substring(0,6))-1)+day;
}
