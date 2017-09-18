var nowData = [];
var title=[["分公司","问题类型","渠道编码","渠道名称","处理方式"]];
var field=["GROUP_ID_1_NAME","TROUBLE_TYPE","HQ_CHAN_CODE","BUS_HALL_NAME","SOLVE_TYPE"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PTEMP.TB_TEMP_BUS_HALL_INFO "));
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
	var showtext = '效能分析基础数据核查-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var regionCode=$("#regionCode").val();
	var regionWhere="";
	if(regionCode!=""){
		regionWhere+=" WHERE GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT GROUP_ID_1_NAME,                                                                                         "+
	"       TROUBLE_TYPE                                                                                                    "+
	"      ,HQ_CHAN_CODE                                                                                                    "+
	"      ,BUS_HALL_NAME                                                                                                   "+
	"      ,SOLVE_TYPE                                                                                                   "+
	"FROM (                                                                                                                 "+
	"      SELECT '营业厅面积为0' TROUBLE_TYPE,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,YYY_NAME BUS_HALL_NAME ,1 PAIXU_FLAG,'到固话信息维护处修改' SOLVE_TYPE     "+
	"             FROM PTEMP.TB_TEMP_BUS_HALL_INFO                                                                          "+
	"      WHERE  NVL(AREA_STRUCTURE,0)=0 AND OPERATE_TYPE='自营' AND IS_BALL=1 AND DEAL_DATE="+dealDate+"                   "+
	"      UNION ALL                                                                                                        "+
	"      SELECT '营业厅类型为空' ,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,YYY_NAME ,2 ,'到固话信息维护处修改' SOLVE_TYPE           "+
	"      FROM PTEMP.TB_TEMP_BUS_HALL_INFO                                                                                 "+
	"      WHERE IS_BALL=1 AND YYY_TYPE IS NULL  AND DEAL_DATE="+dealDate+"                                                 "+
	"      UNION ALL                                                                                                        "+
	"      SELECT '营业厅年房租为0' ,GROUP_ID_1,GROUP_ID_1_NAME,HQ_CHAN_CODE,YYY_NAME  ,3 ,'上工单申请修改' SOLVE_TYPE             "+
	"      FROM PTEMP.TB_TEMP_BUS_HALL_INFO                                                                                 "+
	"      WHERE IS_BALL=1 AND PACT_MONEY=0  AND DEAL_DATE="+dealDate+"                                                     "+
	"      UNION ALL                                                                                                        "+
	"      SELECT '未导入成本的地市',T3.GROUP_ID_1,T3.GROUP_ID_1_NAME ,'','',4 ,'到成本导入处导入' SOLVE_TYPE                                                  "+
	"      FROM PCDE.TB_CDE_REGION_CODE T3                                                                                  "+
	"       WHERE T3.GROUP_ID_1_NAME NOT IN                                                                                 "+
	"            (SELECT  T1.GROUP_ID_1_NAME                                                                                "+
	"            FROM PCDE.TB_CDE_CHANL_HQ_CODE T1                                                                          "+
	"            JOIN PMRT.TB_MRT_CLOSE_COST T2                                                                             "+
	"            ON T1.HQ_CHAN_CODE=T2.HQ_CHAN_CODE AND T2.DEAL_DATE="+dealDate+"                                           "+
	"            )  AND T3.GROUP_ID_1 NOT IN(16099,16017)                                                                   "+
	"      UNION ALL                                                                                                        "+
	"      SELECT DISTINCT '成本数据导入重复的地市' ,GROUP_ID_1 ,GROUP_ID_1_NAME,'','',5 ,'' SOLVE_TYPE                                         "+
	"      FROM PCDE.TB_CDE_CHANL_HQ_CODE WHERE HQ_CHAN_CODE IN (                                                           "+
	"                SELECT HQ_CHAN_CODE FROM PMRT.TB_MRT_CLOSE_COST                                                        "+
	"                WHERE DEAL_DATE="+dealDate+"                                                                           "+
	"                GROUP BY HQ_CHAN_CODE,DEAL_DATE HAVING COUNT(*)>1                                                      "+
	"            )                                                                                                          "+
	")                                                                                                                      "+
	   regionWhere+                                                                                                         
	"  ORDER BY PAIXU_FLAG ,GROUP_ID_1                                                                                      ";
}
