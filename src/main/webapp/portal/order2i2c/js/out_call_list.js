var nowData = [];
var title=[["地市","客户经理","团队类型","外呼状态","外呼累计量","外呼成功率"]];
var field=["REGION_NAME_ABBR","NAME","TEAM_NAME","OUTBOUND","OUT_NUM","OUT_SUCESS"];
var report = null;
var downSql="";
var orderBy="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
		content : "lchcontent",
		orderCallBack:function(index,type){
			orderBy=" ORDER BY "+field[index]+" "+type+" ";
			search(0);
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

var pageSize = 15;
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
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var s;
	var where="";
	//权限控制
    if(orgLevel!=1){
		s=query("SELECT userid FROM PORTAL.TAB_PORTAL_2I2C_TEAM WHERE userid="+userId);
	    if(s!=null&&s.length>0){
			 where=" AND T3.USERID='"+userId+"' "; 
	    }else{
	    	 where=" AND T4.GROUP_ID_1="+region;   	
	    }
	}
	var sql=getSql(where);
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	if(orderBy!=""){
		sql="SELECT * FROM ("+sql+")"+orderBy;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function downAll(){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var showtext = '外呼统计-'+startTime+"-"+endTime;
	downloadExcel(downSql,title,showtext);
}

function getSql(where){
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	return "SELECT DISTINCT                                                                                                       "+
	"       T4.REGION_NAME_ABBR                                                                                            "+
	"      ,T1.NAME_ID                                                                                                     "+
	"      ,T3.NAME                                                                                                        "+
	"      ,T1.TEAM_NAME                                                                                                   "+
	"      ,CASE WHEN T2.OUTBOUND IS NOT NULL THEN T2.OUTBOUND END OUTBOUND                                                "+
	"      ,COUNT(CASE WHEN T2.INSERT_TIME IS NOT NULL THEN T1.ORDER_NO END) OUT_NUM                                       "+
	"      ,TRIM('.'FROM TO_CHAR(CASE WHEN COUNT(CASE WHEN T2.INSERT_TIME IS NOT NULL THEN T1.ORDER_NO END)=0 THEN 0       "+
	"                                 ELSE COUNT(DISTINCT CASE WHEN T2.OUTBOUND LIKE '已接通%' THEN T1.ORDER_NO END)*100/  "+
	"                                      COUNT(CASE WHEN T2.INSERT_TIME IS NOT NULL THEN T1.ORDER_NO END)                "+
	"                                 END                                                                                  "+
	"                    ,'FM9999990.99')) || '%'OUT_SUCESS                                                                "+
	"FROM PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1                                                                             "+
	"LEFT JOIN (SELECT T.*                                                                                                 "+
	"                 ,ROW_NUMBER()OVER(PARTITION BY T.ORDER_NO ORDER BY T.INSERT_TIME DESC)RN                             "+
	"           FROM  PODS.TAB_ODS_2I2C_REMARK T                                                                           "+
	"           WHERE TO_CHAR(INSERT_TIME,'YYYYMMDD') BETWEEN "+startTime+" AND "+endTime+"                                "+
	"           ) T2                                                                                                       "+
	"ON   (T1.ORDER_NO=T2.ORDER_NO AND T2.RN=1)                                                                            "+
	"JOIN PORTAL.TAB_PORTAL_2I2C_TEAM T3                                                                                   "+
	"ON   (T1.NAME_ID=T3.ID)                                                                                               "+
	"JOIN PCDE.TB_CDE_REGION_CODE T4                                                                                       "+
	"ON   (T3.GROUP_ID_1=T4.GROUP_ID_1)                                                                                    "+
	where +
	" GROUP BY T1.NAME_ID                                                                                                   "+
	"        ,T3.NAME                                                                                                      "+
	"        ,T1.TEAM_NAME                                                                                                 "+
	"        ,CASE WHEN T2.OUTBOUND IS NOT NULL THEN T2.OUTBOUND END                                                       "+
	"        ,T4.REGION_NAME_ABBR                                                                                          ";
}