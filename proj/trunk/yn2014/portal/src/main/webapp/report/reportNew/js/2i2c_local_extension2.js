var nowData = [];
var report = null;
var orderBy='';
var maxDate=null;
var field=["AREA_NAME","NUM_20","NUM_50","NUM_100" ,"PROMOTION_FEE" ,"FIRST_REWARD" ,"NUM_MONTH" ,"PROMOTION_MONTH" ,"FIRST_MONTH" ,"NUM_LJ" ,"PROMOTION_LJ" ,"FIRST_LJ","NUM_UNIT","IS_SALES","PERSON_DEV_NUM"];
var title=[["州市","当天","","","","","月累计","","","累计","","","过程指标","",""],
		   ["","首冲20","首冲50","首冲100","人工成本","营销成本","首冲数","人工成本","营销成本","首冲数","人工成本","营销成本","区县/营服数","有销量区县/营服数","有销量人数"]];
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
	maxDate = getMaxDate("pmrt.tb_DW_V_D_HLW_OUTLINE_USER");
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var hr_id=$("#hr_id").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var startDete=$("#startDate").val();
	var endDete=$("#endDate").val();
	var dealDate=endDete.substr(0,6);
	var where="";
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND HR_ID IN (SELECT PORTAL.HR_PERM('"+hr_id+"', '"+dealDate+"') FROM DUAL)";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
		
	var sql=getSql(where);
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
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(where){
	var startDete=$("#startDate").val();
	var endDete=$("#endDate").val();
	var sql="SELECT AREA_NAME,                                                                      "+
	"       UNIT_ID,                                                                                  "+
	"       UNIT_NAME,                                                                                "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) =  '"+endDete+"' AND                                   "+
	"                  t.payment_fee_first >= 20 and t.payment_fee_first < 50 THEN                    "+
	"              1                                                                                  "+
	"             ELSE                                                                                "+
	"              0                                                                                  "+
	"           END) NUM_20,                                                                          "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' AND                                    "+
	"                  t.payment_fee_first >= 50 and t.payment_fee_first < 100 THEN                   "+
	"              1                                                                                  "+
	"             ELSE                                                                                "+
	"              0                                                                                  "+
	"           END) NUM_50,                                                                          "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' AND                                    "+
	"                  t.payment_fee_first >= 100 THEN                                                "+
	"              1                                                                                  "+
	"             ELSE                                                                                "+
	"              0                                                                                  "+
	"           END) NUM_100,                                                                         "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' THEN                                   "+
	"              PROMOTION_FEE                                                                      "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) PROMOTION_FEE,                                                                   "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' THEN                                   "+
	"              FIRST_REWARD                                                                       "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) FIRST_REWARD,                                                                    "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND '"+endDete+"' THEN                  "+
	"              1                                                                                  "+
	"             ELSE                                                                                "+
	"              0                                                                                  "+
	"           END) NUM_MONTH,                                                                       "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND '"+endDete+"' THEN                  "+
	"              PROMOTION_FEE                                                                      "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) PROMOTION_MONTH,                                                                 "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND '"+endDete+"' THEN                    "+
	"              FIRST_REWARD                                                                       "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) FIRST_MONTH,                                                                     "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND '"+endDete+"' THEN        "+
	"              1                                                                                  "+
	"             ELSE                                                                                "+
	"              0                                                                                  "+
	"           END) NUM_LJ,                                                                          "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND '"+endDete+"' THEN       "+
	"              PROMOTION_FEE                                                                      "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) PROMOTION_LJ,                                                                    "+
	"       SUM(CASE                                                                                  "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND '"+endDete+"' THEN       "+
	"              FIRST_REWARD                                                                       "+
	"             else                                                                                "+
	"              0                                                                                  "+
	"           END) FIRST_LJ,                                                                        "+
	"       count(distinct unit_id) num_unit,                                                         "+
	"       case                                                                                      "+
	"         when SUM(CASE                                                                           "+
	"                    WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND '"+endDete+"' THEN "+
	"                     1                                                                           "+
	"                    ELSE                                                                         "+
	"                     0                                                                           "+
	"                  END) >= 10 then                                                                "+
	"          1                                                                                      "+
	"         else                                                                                    "+
	"          0                                                                                      "+
	"       end IS_SALES,                                                                             "+
	"       (SELECT nvl(PERSON_DEV_NUM,0)                                                                    "+
	"          FROM (SELECT unit_id,                                                                  "+
	"                       count(distinct OPEN_PERSON_CODE) PERSON_DEV_NUM                           "+
	"                  FROM pmrt.tb_DW_V_D_HLW_OUTLINE_USER PARTITION(p"+maxDate+") T                "+
	"                 WHERE t.payment_fee_first >= 20                                                 "+
	"                   and PERSON_DEV_NUM >= 2                                                       "+
	"                   and substr(payment_time_first, 1, 8) >= 20171020                      "+
	"                 GROUP BY unit_id) t1                                                            "+
	"         WHERE t.unit_id = t1.unit_id) PERSON_DEV_NUM                                            "+
	"  FROM pmrt.tb_DW_V_D_HLW_OUTLINE_USER PARTITION(p"+maxDate+") T                                "+
	" WHERE t.payment_fee_first >= 20                                                                 "+
	"   and substr(payment_time_first, 1, 8) >= 20171020                                    "+
	where +
	" GROUP BY AREA_NAME, UNIT_ID, UNIT_NAME  ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var field=["GROUP_ID_1","PART_AREA","UNIT_ID","UNIT_NAME","NUM_20","NUM_50","NUM_100" ,"PROMOTION_FEE" ,"FIRST_REWARD" ,"NUM_MONTH" ,"PROMOTION_MONTH" ,"FIRST_MONTH" ,"NUM_LJ" ,"PROMOTION_LJ" ,"FIRST_LJ","NUM_UNIT","IS_SALES","PERSON_DEV_NUM"];
	var title=[["州市","营服编码","营服","当天","","","","","月累计","","","累计","","","过程指标","",""],
			   ["","","","首冲20","首冲50","首冲100","人工成本","营销成本","首冲数","人工成本","营销成本","首冲数","人工成本","营销成本","区县/营服数","有销量区县/营服数","有销量人数"]];
	showtext = "2I2C地推推广情况";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function getMaxDate(tableName){
	var sql="SELECT MAX(ACCT_DATE) DEAL_DATE FROM "+tableName;
	var r=query(sql);
	if(r!=null&&r[0]!=null&&r.length>0){
		return r[0]["DEAL_DATE"];
	}
	return "";
}