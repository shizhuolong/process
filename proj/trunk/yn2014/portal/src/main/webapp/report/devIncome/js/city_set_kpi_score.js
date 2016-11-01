var nowData = [];
var title=[["帐期","地市","营服编码","营服","HR编码","人员名称","人员角色","KPI指标","KPI考核结果","KPI考核得分","KPI指标权重"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","HR_ID","NAME","USER_ROLE","KPI_NAME","KPI_TARGET","KPI_SCORE","KPI_WEIGHT"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:7,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	
	var dealDate=$.trim($("#deal_date").val());
	var regionCode=$.trim($("#regionCode").val());
	var unitCode=$.trim($("#unitCode").val());
	var userName=$.trim($("#userName").val());
	var realName=$.trim($("#realName").val());
//条件
	var sql = "SELECT T.DEAL_DATE,                 "+
				"       T.GROUP_ID_1_NAME,              "+
				"       T.UNIT_ID,                      "+
				"       T.UNIT_NAME,                    "+
				"       T.HR_ID,                        "+
				"       T.NAME,                         "+
				"       DECODE(T.USER_ROLE,             "+
				"              1,                       "+
				"              '营服中心责任人',        	"+
				"              2,                       "+
				"              '渠道经理',              	"+
				"              3,                       "+
				"              '集客经理',              	"+
				"              4,                       "+
				"              '营业员',                	"+
				"              5,                       "+
				"              '固网专员',              	"+
				"              6,                       "+
				"              '营业厅主任',            	"+
				"              7,                       "+
				"              '集客行业总监') USER_ROLE,	"+
				"       T.KPI_NAME,                     "+
				"       T.KPI_TARGET,                   "+
				"       T.KPI_SCORE,                    "+
				"       T.KPI_WEIGHT                    "+
				"  FROM PMRT.TAB_MRT_JCDY_KPI_QJ_MON T WHERE T.DEAL_DATE = '"+dealDate+"'";
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(userName!=''){
		sql+=" AND T.NAME LIKE '%"+userName+"%'";
	}
	/*if(userCode!=''){
		sql+=" AND T.DEVICE_NUMBER ='"+userCode+"'";
	}*/
//权限
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql += " AND UNIT_ID IN("+_unit_relation(code)+")";
	}else{
		sql+=" and T.NAME ='"+realName+"'";
	}
	
	var csql = sql;
	/*old*/
	/*var cdata = query("select count(*) total " + csql);*/
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy="ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	if (orderBy != '') {
		sql += orderBy;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$.trim($("#deal_date").val());
	var regionCode=$.trim($("#regionCode").val());
	var unitCode=$.trim($("#unitCode").val());
	var userName=$.trim($("#userName").val());
	var realName=$.trim($("#realName").val());
	var sql = "SELECT T.DEAL_DATE,                 "+
	"       T.GROUP_ID_1_NAME,              "+
	"       T.UNIT_ID,                      "+
	"       T.UNIT_NAME,                    "+
	"       T.HR_ID,                        "+
	"       T.NAME,                         "+
	"       DECODE(T.USER_ROLE,             "+
	"              1,                       "+
	"              '营服中心责任人',        	"+
	"              2,                       "+
	"              '渠道经理',              	"+
	"              3,                       "+
	"              '集客经理',              	"+
	"              4,                       "+
	"              '营业员',                	"+
	"              5,                       "+
	"              '固网专员',              	"+
	"              6,                       "+
	"              '营业厅主任',            	"+
	"              7,                       "+
	"              '集客行业总监') USER_ROLE,	"+
	"       T.KPI_NAME,                     "+
	"       T.KPI_TARGET,                   "+
	"       T.KPI_SCORE,                    "+
	"       T.KPI_WEIGHT                    "+
	"  FROM PMRT.TAB_MRT_JCDY_KPI_QJ_MON T WHERE  T.DEAL_DATE = '"+dealDate+"'";
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(userName!=''){
		sql+=" AND T.NAME LIKE '%"+userName+"%'";
	}
	
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql += " AND UNIT_ID IN("+_unit_relation(code)+")";
	}else{
		sql+=" and T.NAME ='"+realName+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	var title=[["帐期","地市","营服编码","营服","HR编码","人员名称","人员角色","KPI指标","KPI考核结果","KPI考核得分","KPI指标权重"]];
	showtext = '地市自设KPI得分-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////