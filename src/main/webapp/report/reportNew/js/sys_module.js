var nowData = [];
var report = null;
var orderBy='';
var field=["REGION_NAME","LOGIN_DAY_NUM69","LOGIN_DAY_NUM70","LOGIN_DAY_NUM71","LOGIN_DAY_NUM72","LOGIN_DAY_NUMFMQD","LOGIN_DAY_NUMJYGK","LOGIN_DAY_NUMYJJK","LOGIN_DAY_NUMXTGL",
           "LOGIN_MON_NUM69","LOGIN_MON_NUM70","LOGIN_MON_NUM71","LOGIN_MON_NUM72","LOGIN_MON_NUMFMQD","LOGIN_MON_NUMJYGK","LOGIN_MON_NUMYJJK","LOGIN_MON_NUMXTGL"];
var title=[["分公司","当日使用人数","","","","","","","","当月使用人数","","","","","","",""],
           ["","任务管理","资源管理","激励考核","统计分析","负面清单","经营管控","预警监控","系统管理","任务管理","资源管理","激励考核","统计分析","负面清单","经营管控","预警监控","系统管理"]];
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
	var sql="SELECT T.REGION_NAME         REGION_NAME                                                                                   "+
	"      ,NVL(T1.LOGIN_DAY_NUM69,0)     LOGIN_DAY_NUM69                                                                               "+
	"      ,NVL(T1.LOGIN_MON_NUM69,0)     LOGIN_MON_NUM69                                                                               "+
	"      ,NVL(T1.LOGIN_DAY_NUM70,0)     LOGIN_DAY_NUM70                                                                               "+
	"      ,NVL(T1.LOGIN_MON_NUM70,0)     LOGIN_MON_NUM70                                                                               "+
	"      ,NVL(T1.LOGIN_DAY_NUM71,0)     LOGIN_DAY_NUM71                                                                               "+
	"      ,NVL(T1.LOGIN_MON_NUM71,0)     LOGIN_MON_NUM71                                                                               "+
	"      ,NVL(T1.LOGIN_DAY_NUM72,0)     LOGIN_DAY_NUM72                                                                               "+
	"      ,NVL(T1.LOGIN_MON_NUM72,0)     LOGIN_MON_NUM72                                                                               "+
	"      ,NVL(T1.LOGIN_DAY_NUMFMQD,0)   LOGIN_DAY_NUMFMQD                                                                             "+
	"      ,NVL(T1.LOGIN_MON_NUMFMQD,0)   LOGIN_MON_NUMFMQD                                                                             "+
	"      ,NVL(T1.LOGIN_DAY_NUMJYGK,0)   LOGIN_DAY_NUMJYGK                                                                             "+
	"      ,NVL(T1.LOGIN_MON_NUMJYGK,0)   LOGIN_MON_NUMJYGK                                                                             "+
	"      ,NVL(T1.LOGIN_DAY_NUMYJJK,0)   LOGIN_DAY_NUMYJJK                                                                             "+
	"      ,NVL(T1.LOGIN_MON_NUMYJJK,0)   LOGIN_MON_NUMYJJK                                                                             "+
	"      ,NVL(T1.LOGIN_DAY_NUMXTGL,0)   LOGIN_DAY_NUMXTGL                                                                             "+
	"      ,NVL(T1.LOGIN_MON_NUMXTGL,0)   LOGIN_MON_NUMXTGL                                                                             "+
	"FROM (SELECT DISTINCT REGION_CODE,REGION_NAME                                                                                      "+
	"      FROM PORTAL.APDP_ORG) T                                                                                                      "+
	"LEFT JOIN (                                                                                                                        "+
	"          SELECT T1.REGION_CODE                                                                                                    "+
	//              -- 69 任务管理                                                                                                     "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                     "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=69 )     "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUM69                                                                      "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=69 )     "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUM69                                                                      "+
	//               -- 70    资源管理                                                                                                 "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                    "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=70)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUM70                                                                      "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=70)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUM70                                                                      "+
	//                -- 71  激励考核                                                                                                   "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                    "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=71)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUM71                                                                      "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=71)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUM71                                                                      "+
	//                -- 72  统计分析                                                                                                   "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                   "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=72)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUM72                                                                      "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=72)      "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUM72                                                                      "+
	//                -- 370521 负面清单                                                                                                "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                    "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=370521)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUMFMQD                                                                    "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=370521)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUMFMQD                                                                    "+
	//                -- 377341 经营管控                                                                                                "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                    "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=377341)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUMJYGK                                                                    "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=377341)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUMJYGK                                                                    "+
	//               -- 477161   预警监控                                                                                              "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                  "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=477161)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUMYJJK                                                                    "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=477161)  "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUMYJJK                                                                    "+
	//                -- 188 系统管理                                                                                                   "+
	"                ,COUNT(DISTINCT CASE WHEN TO_CHAR(T.ACCESS_TIME,'YYYYMMDD')="+dealDate+"                                    "+
	"                                      AND T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=188)     "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_DAY_NUMXTGL                                                                    "+
	"                ,COUNT(DISTINCT CASE WHEN T.MODULEID IN (SELECT TO_CHAR(ID)                                                        "+
	"                                                  FROM portal.apdp_module                                                          "+
	"                                                  START WITH PARENTMODULE_ID =(SELECT ID FROM portal.apdp_module WHERE ID=188)     "+
	"                                                  CONNECT BY PRIOR ID=PARENTMODULE_ID)                                             "+
	"                                     THEN T.USERID                                                                                 "+
	"                                     END)     LOGIN_MON_NUMXTGL                                                                    "+                                                                                                                                                                   
	"          FROM PORTAL.MODULE_ACCESSTIME_DETAIL T                                                                                   "+
	"          JOIN PORTAL.APDP_USER T0                                                                                                 "+
	"          ON   (LOWER(T.USERID)=T0.ID)                                                                                             "+
	"          JOIN PORTAL.APDP_ORG T1                                                                                                  "+
	"          ON   (T0.ORG_ID=T1.ID)                                                                                                   "+
	"          WHERE TO_CHAR(T.ACCESS_TIME,'YYYYMM') =SUBSTR("+dealDate+",1,6)                                                  "+
	"            AND TO_CHAR(T.ACCESS_TIME,'YYYYMMDD') <="+dealDate+"                                                        "+
	"          AND T0.USERNAME !='ADMIN'                                                                                                "+
	"          AND T.MODULEID IS NOT NULL                                                                                               "+
	"          GROUP BY T1.REGION_CODE                                                                                                  "+
	")T1                                                                                                                                "+
	"ON(T.REGION_CODE=T1.REGION_CODE) ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	showtext = "各模块使用情况统计-"+dealDate+"";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
