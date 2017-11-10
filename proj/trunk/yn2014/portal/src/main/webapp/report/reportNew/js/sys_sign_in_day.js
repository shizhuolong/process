var nowData = [];
var report = null;
var orderBy='';
var field=["REGION_NAME","APP_LOGIN_NUM_DAY","APP_LOGIN_NUM_MON","JC_LOGIN_NUM_DAY","JC_LOGIN_NUM_MON"];
var title=[["分公司","APP登录统计","","WEB登录统计",""],
           ["","当日登录次数","本月累计次数","当日登录次数","本月累计次数"]];
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
	var sql="SELECT T.REGION_NAME REGION_NAME                                                   "+
	",T.REGION_CODE REGION_CODE                                                                 "+
	"      ,NVL(T2.LOGIN_DAY_NUM,0)     APP_LOGIN_NUM_DAY                                       "+
	"      ,NVL(T2.LOGIN_MON_NUM,0)     APP_LOGIN_NUM_MON                                       "+
	"      ,NVL(T1.LOGIN_DAY_NUM,0)     JC_LOGIN_NUM_DAY                                        "+
	"      ,NVL(T1.LOGIN_MON_NUM,0)     JC_LOGIN_NUM_MON                                        "+
	"FROM (SELECT DISTINCT REGION_CODE,REGION_NAME                                              "+
	"      FROM PORTAL.APDP_ORG) T                                                              "+
	"LEFT JOIN (                                                                                "+
	"          SELECT T1.REGION_CODE                                                            "+
	"                ,COUNT(CASE WHEN TO_CHAR(T.CREATETIME, 'yyyymmdd')='"+dealDate+"'          "+
	"                            THEN T.USERNAME                                                "+
	"                            END)     LOGIN_DAY_NUM                                         "+
	"                ,COUNT(T.USERNAME)   LOGIN_MON_NUM                                         "+
	"          FROM PORTAL.APDP_LOG_USERLOGIN T                                                 "+
	"          JOIN PORTAL.APDP_USER T0                                                         "+
	"          ON   (LOWER(T.USERNAME)=T0.USERNAME)                                             "+
	"          JOIN PORTAL.APDP_ORG T1                                                          "+
	"          ON   (T0.ORG_ID=T1.ID)                                                           "+
	"          WHERE TO_CHAR(T.CREATETIME, 'yyyymm') =SUBSTR("+dealDate+",1,6)                  "+ 
	"          AND T.APPNAME  LIKE '%portal%' /*like  '%appservice%'*/ AND T.USERNAME !='ADMIN' "+
	"          GROUP BY T1.REGION_CODE                                                          "+
	")T1                                                                                        "+
	"ON(T.REGION_CODE=T1.REGION_CODE)                                                           "+
	"LEFT JOIN (                                                                                "+
	"          SELECT T1.REGION_CODE                                                            "+
	"                ,COUNT(CASE WHEN TO_CHAR(T.CREATETIME, 'yyyymmdd')='"+dealDate+"'          "+
	"                            THEN T.USERNAME                                                "+
	"                            END)     LOGIN_DAY_NUM                                         "+
	"                ,COUNT(T.USERNAME)   LOGIN_MON_NUM                                         "+
	"          FROM PORTAL.APDP_LOG_USERLOGIN T                                                 "+
	"          JOIN PORTAL.APDP_USER T0                                                         "+
	"          ON   (LOWER(T.USERNAME)=T0.USERNAME)                                             "+
	"          JOIN PORTAL.APDP_ORG T1                                                          "+
	"          ON   (T0.ORG_ID=T1.ID)                                                           "+
	"          WHERE TO_CHAR(T.CREATETIME, 'yyyymm') =SUBSTR("+dealDate+",1,6)                  "+  
	"          AND T.APPNAME  /*LIKE '%portal%' */like  '%appservice%' AND T.USERNAME !='ADMIN' "+
	"          GROUP BY T1.REGION_CODE                                                          "+
	")T2                                                                                        "+
	"ON(T.REGION_CODE=T2.REGION_CODE)                                                           ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	showtext = "基层系统登录日报-"+dealDate+"";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
