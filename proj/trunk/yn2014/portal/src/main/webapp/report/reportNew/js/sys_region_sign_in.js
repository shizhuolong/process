var nowData = [];
var report = null;
var orderBy='';
var field=["REGION_NAME","ZCRY_LOGIN_DAY","QXZ_LOGIN_DAY","TZR_LOGIN_DAY","QDJL_LOGIN_DAY","ZCRY_LOGIN_MON","QXZ_LOGIN_MON","TZR_LOGIN_MON","QDJL_LOGIN_MON","ZCRY_ZB","QXZ_ZB","TZR_ZB","QDJL_ZB"];
var title=[["分公司","当日","","","","本月累计","","","","累计占比","","",""],
           ["","支撑管理人员","区县总","营业厅主任","渠道/宽固经理","支撑管理人员","区县总","营业厅主任","渠道/宽固经理","支撑管理人员","区县总","营业厅主任","渠道/宽固经理"]];
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
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var hr_id=$("#hr_id").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var where = "";
	//权限
	
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
	var sql="SELECT T.REGION_NAME                                                                               "+
	"      ,NVL(T1.ZCRY_LOGIN_DAY,0)     ZCRY_LOGIN_DAY                                                         "+
	"      ,NVL(T1.ZCRY_LOGIN_MON,0)     ZCRY_LOGIN_MON                                                         "+
	"      ,NVL(T1.QXZ_LOGIN_DAY,0)      QXZ_LOGIN_DAY                                                          "+
	"      ,NVL(T1.QXZ_LOGIN_MON,0)      QXZ_LOGIN_MON                                                          "+
	"      ,NVL(T1.TZR_LOGIN_DAY,0)      TZR_LOGIN_DAY                                                          "+
	"      ,NVL(T1.TZR_LOGIN_MON,0)      TZR_LOGIN_MON                                                          "+
	"      ,NVL(T1.QDJL_LOGIN_DAY,0)     QDJL_LOGIN_DAY                                                         "+
	"      ,NVL(T1.QDJL_LOGIN_MON,0)     QDJL_LOGIN_MON                                                         "+
	"      ,NVL(ZCRY_ZB,'0.00%')         ZCRY_ZB                                                                "+
	"      ,NVL(QXZ_ZB,'0.00%')          QXZ_ZB                                                                 "+
	"      ,NVL(TZR_ZB,'0.00%')          TZR_ZB                                                                 "+
	"      ,NVL(QDJL_ZB,'0.00%')         QDJL_ZB                                                                "+
	"FROM (SELECT DISTINCT REGION_CODE,REGION_NAME                                                              "+
	"      FROM PORTAL.APDP_ORG) T                                                                              "+
	"LEFT JOIN (                                                                                                "+
	"          SELECT T1.REGION_CODE                                                                            "+
	"                                                                                                           "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='0' AND TO_CHAR(T.CREATETIME, 'yyyymmdd')="+dealDate+"  "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     ZCRY_LOGIN_DAY                                               "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='0'                                                 "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     ZCRY_LOGIN_MON                                               "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='1' AND TO_CHAR(T.CREATETIME, 'yyyymmdd')="+dealDate+"  "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     QXZ_LOGIN_DAY                                                "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='1'                                                 "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     QXZ_LOGIN_MON                                                "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='6' AND TO_CHAR(T.CREATETIME, 'yyyymmdd')="+dealDate+"  "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     TZR_LOGIN_DAY                                                "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='6'                                                 "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     TZR_LOGIN_MON                                                "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='2' AND TO_CHAR(T.CREATETIME, 'yyyymmdd')="+dealDate+"  "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     QDJL_LOGIN_DAY                                               "+
	"                ,COUNT(DISTINCT CASE WHEN T3.USER_CODE='2'                                                 "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)     QDJL_LOGIN_MON                                               "+
	"                ,PMRT.LINK_RATIO_ZB(COUNT(DISTINCT CASE WHEN T3.USER_CODE='0'                              "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)                                                                  "+
	"                                    ,COUNT(DISTINCT T.USERNAME)                                            "+
	"                                    ,1)              ZCRY_ZB                                               "+
	"                 ,PMRT.LINK_RATIO_ZB(COUNT(DISTINCT CASE WHEN T3.USER_CODE='1'                             "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)                                                                  "+
	"                                    ,COUNT(DISTINCT T.USERNAME)                                            "+
	"                                    ,1)              QXZ_ZB                                                "+
	"                  ,PMRT.LINK_RATIO_ZB(COUNT(DISTINCT CASE WHEN T3.USER_CODE='6'                            "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)                                                                  "+
	"                                    ,COUNT(DISTINCT T.USERNAME)                                            "+
	"                                    ,1)              TZR_ZB                                                "+
	"                  ,PMRT.LINK_RATIO_ZB(COUNT(DISTINCT CASE WHEN T3.USER_CODE='2'                            "+
	"                                     THEN T.USERNAME                                                       "+
	"                                     END)                                                                  "+
	"                                    ,COUNT(DISTINCT T.USERNAME)                                            "+
	"                                    ,1)              QDJL_ZB                                               "+                                                                                     
	"          FROM PORTAL.APDP_LOG_USERLOGIN T                                                                 "+
	"          JOIN PORTAL.APDP_USER T0                                                                         "+
	"          ON   (LOWER(T.USERNAME)=T0.USERNAME)                                                             "+
	"          JOIN PORTAL.TAB_PORTAL_QJ_PERSON  T3                                                             "+
	"          ON(T0.HR_ID=T3.HR_ID AND T3.DEAL_DATE=SUBSTR("+dealDate+",1,6))                            "+
	"          JOIN PORTAL.APDP_ORG T1                                                                          "+
	"          ON   (T0.ORG_ID=T1.ID)                                                                           "+
	"          WHERE TO_CHAR(T.CREATETIME, 'yyyymm') =SUBSTR("+dealDate+",1,6)                            "+
	"          AND T.APPNAME  LIKE '%portal%' /*like  '%appservice%'*/ AND T.USERNAME !='ADMIN'                 "+
	"          GROUP BY T1.REGION_CODE                                                                          "+
	")T1                                                                                                        "+
	"ON(T.REGION_CODE=T1.REGION_CODE)   ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	showtext = "基层系统登录日报-"+dealDate+"";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
