var nowData = [];
var title=[["地市名称","客户经理","团队类型","未激活累计分配数","已激活数","激活首充数","激活率","激活率排名","未首充累计分配数","已首充数","首充率","累计充值金额","首充率排名"],
           ["","","","","","自然月内累计充值 ≥10元","","","","自然月内累计充值≥10元","","",""]];

var field=["GROUP_ID_1_NAME","NAME","TEAM_NAME","NOT_ACTIVE_NUM","ACTIVE_NUM","ACTIVE_FIRST_NUM","ACTIVE_RATIO","ACTIVE_RANK","NOT_FIRST_NUM","FIRST_NUM","FRIST_RATIO","ADD_PAYMENT_FEE","FIRST_RANK"];
var report = null;
var downSql="";
var orderBy="";
$(function() {
//	var maxDate=getMaxDate("PODS.VIEW_ODS_2I2C_ANALY_DAY");
//	$("#startTime").val(maxDate);
//	$("#endTime").val(maxDate);	
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
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var where=" WHERE DEAL_DATE BETWEEN '"+startTime+"' AND '"+endTime+"'";
	var sql=getSql();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1='"+region+"'";
	}else{
		where+=" AND 1=2";
	}
	var name=$.trim($("#name").val());
	var team_name=$("#team_name").val();
	if(name!=""){
		where+=" AND NAME LIKE '%"+name+"%'";
	}
	if(team_name!=""){
		where+=" AND TEAM_NAME='"+team_name+"'";
	}
	sql+=where+" GROUP BY T.NAME,T.TEAM_NAME,T.GROUP_ID_1,T.GROUP_ID_1_NAME";
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
	var showtext = '未激活未首冲-'+startTime+"-"+endTime;
	downloadExcel(downSql,title,showtext);
}

function getSql(){
	return "SELECT T.GROUP_ID_1_NAME                                                                                                        "+
	"      ,T.NAME                                                                                                                          "+
	"      ,T.TEAM_NAME                                                                                                                     "+
	"      ,SUM(NVL(T.NOT_ACTIVE_NUM,0)) NOT_ACTIVE_NUM                                                                                     "+
	"      ,SUM(NVL(T.ACTIVE_NUM,0))ACTIVE_NUM                                                                                              "+
	"      ,SUM(NVL(T.FIRST_NUM,0))ACTIVE_FIRST_NUM                                                                                         "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALLOT_NUM,0))=0 THEN 0                                                                "+
	"                                  ELSE SUM(NVL(T.ACTIVE_NUM,0))*100/SUM(NVL(T.ALLOT_NUM,0)) END                                        "+
	"                                    ,'FM9999990.99'))||'%' ACTIVE_RATIO                                                                "+
	"     ,DENSE_RANK()OVER(PARTITION BY T.GROUP_ID_1,T.TEAM_NAME ORDER BY TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALLOT_NUM,0))=0 THEN 0 "+
	"                                  ELSE SUM(NVL(T.ACTIVE_NUM,0))*100/SUM(NVL(T.ALLOT_NUM,0)) END                                        "+
	"                                    ,'FM9999990.99')) DESC) ACTIVE_RANK                                                                "+
	"     ,SUM(NVL(T.NOT_FIRST_NUM,0)) NOT_FIRST_NUM                                                                                        "+
	"     ,SUM(NVL(T.FIRST_NUM,0))FIRST_NUM                                                                                                 "+
	"     ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALLOT_NUM,0))=0 THEN 0                                                                 "+
	"                                 ELSE SUM(NVL(T.FIRST_NUM,0))*100/SUM(NVL(T.ALLOT_NUM,0)) END                                          "+
	"                                    ,'FM9999990.99'))||'%' FRIST_RATIO                                                                 "+
	"                                                                                                                                       "+
	"     ,SUM(NVL(T.ADD_PAYMENT_FEE,0))ADD_PAYMENT_FEE                                                                                     "+
	"     ,DENSE_RANK()OVER(PARTITION BY T.GROUP_ID_1,T.TEAM_NAME ORDER BY TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.ALLOT_NUM,0))=0 THEN 0 "+
	"                                 ELSE SUM(NVL(T.FIRST_NUM,0))*100/SUM(NVL(T.ALLOT_NUM,0)) END                                          "+
	"                                    ,'FM9999990.99'))DESC) FIRST_RANK                                                                  "+
	"FROM  PODS.VIEW_ODS_2I2C_ANALY_DAY T                                                                                                ";
}