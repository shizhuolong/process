var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","CZ_NUM","CZ_FEE","COMMFEE","COMMFEE_BOTYCX","COMMFEE_BOT_HJ","COMMFEE_BOT_LAST","COMMFEE_BOT_THIS"];
var title=[["账期","分公司","当月BOT出账用户数","当月BOT出账收入","当月报表佣金","其中一次性佣金","一次性佣金按月分摊后佣金 ","其中上月递延一次性佣金分摊金额","其中本月新增一次性佣金分摊金额"]];
var report = null;
var sql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{eq:2,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

//列表信息
function search(pageNumber) {
	var dealDate=$("#dealDate").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	var regionCode=$("#regionCode").val();

	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		where+=" AND T.GROUP_ID_1='"+code+"'";
	}else{
		where+=" AND 1=2";
	}
	//条件查询
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	sql = getSql(where,orgLevel);
	var d = query(sql);
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
	var showtext = 'BOT一次性佣金分摊报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}

function getSql(where,orgLevel){
	if(orgLevel==1){
		return "SELECT NVL(T.DEAL_DATE,'') DEAL_DATE,                                    "+
		"       NVL(T.GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME,                            "+
		"       SUM(T.CZ_NUM) CZ_NUM,                                                    "+
		"       SUM(T.CZ_FEE) CZ_FEE,                                                    "+
		"       SUM(T.COMMFEE) COMMFEE,                                                  "+
		"       SUM(T.COMMFEE_BOTYCX) COMMFEE_BOTYCX,                                    "+
		"       SUM(T.COMMFEE_BOT_HJ) COMMFEE_BOT_HJ,                                    "+
		"       SUM(T.COMMFEE_BOT_LAST) COMMFEE_BOT_LAST,                                "+
		"       SUM(T.COMMFEE_BOT_THIS) COMMFEE_BOT_THIS                                 "+
		"  FROM PMRT.TAB_MRT_BOT_COMM_REPORT T                                           "+
		         where+
		" GROUP BY GROUPING SETS(T.DEAL_DATE,(T.DEAL_DATE,T.GROUP_ID_1,T.GROUP_ID_1_NAME))"+
		" ORDER BY GROUP_ID_1                                                             ";
	}else{
		return "SELECT T.DEAL_DATE,                        "+
		"       T.GROUP_ID_1_NAME,                         "+
		"       SUM(T.CZ_NUM) CZ_NUM,                      "+
		"       SUM(T.CZ_FEE) CZ_FEE,                      "+
		"       SUM(T.COMMFEE) COMMFEE,                    "+
		"       SUM(T.COMMFEE_BOTYCX) COMMFEE_BOTYCX,      "+
		"       SUM(T.COMMFEE_BOT_HJ) COMMFEE_BOT_HJ,      "+
		"       SUM(T.COMMFEE_BOT_LAST) COMMFEE_BOT_LAST,  "+
		"       SUM(T.COMMFEE_BOT_THIS) COMMFEE_BOT_THIS   "+
		"  FROM PMRT.TAB_MRT_BOT_COMM_REPORT T             "+
		              where+
		" GROUP BY T.DEAL_DATE,T.GROUP_ID_1_NAME           ";
	}
}