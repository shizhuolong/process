var nowData = [];
var title=[["地市","营服中心","账期","员工工号","姓名","岗位等级","薪档","固定薪酬","","艰苦地区补贴","KPI绩效","积分提成","专项奖励","","","","加班工资","过节费","福利及补贴","","","","","","","","应发合计数","养老保险缴费<br/>(个人)","医疗保险缴费<br/>(个人)","失业保险缴费<br/>(个人)","住房公积金缴费<br/>(个人)","补充养老保险缴费<br/>(个人)","个人所得税","其他扣款1","其他扣款项","应扣合计数","实发数","人员类型"],
           ["","","","","","","","岗位工资","综合补贴","","","","绩效工资<br/>(非经常项目1)","绩效工资<br/>(非经常项目2)","其他奖励<br/>(非经常项目1)","其他奖励<br/>(非经常项目2)","","","独生子女费","综合补贴<br/>(WY物业)","综合补贴<br/>(WC误餐)","综合补贴<br/>(JT交通)","综合补贴<br/>(TX通信)","低收入补贴","其他1","其他2","","","","","","","","","","","",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","DEAL_DATE","HR_NO","USER_NAME","POST_LEVEL","SALARY_LEVEL","POST_SALARY","GENERAL_SUBS","DIFFICULT_AREAS","KPI_SALARY","JF_SALARY","MERIT_PAY_1","MERIT_PAY_2","OTHER_PAY_1","OTHER_PAY_2","OVERTIME_PAY","FESTIVITY_PAY","CHINA_ONE_PAY","MULTI_WY","MULTI_WC","MULTI_JT","MULTI_TX","MULTI_DSR","OTHER1","OTHER2","SALARY_PAY_TOTAL","PROVIDE_AGE","TREATMENT","UNEMPLOYE","HOUSING","SUPPLEMENTARY","INCOME_TAX","OTHER_COST_1","OTHER_COST_1_ITEM","DEDUCTED_TOTAL","FACT_TOTAL","USER_TYPE"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[
		     {gt:5,css:LchReport.RIGHT_ALIGN},
		     {array:[7,10,11,26,35,36],css:LchReport.NORMAL_STYLE}
		     ],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
			//search(0);
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
	
	var time=$("#time").val();
	var userName=$.trim($("#userName").val());
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
//条件
	var sql = getSelectSql();
	if(userName!=''){
		sql+=" AND T.USER_NAME like '%"+userName+"%'";
	}
	if(regionCode!=''){
		sql+=" AND TR.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND TR.UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND TR.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" AND T.HR_NO in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 "; 
		 }
	}
	
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
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

function getSelectSql(){
	var time=$("#time").val();
	var sql="SELECT DEAL_DATE,                                                 		  "+
			"		TR.GROUP_ID_1_NAME,                                               "+
			"		TR.UNIT_NAME,                                                     "+
			"		HR_NO,                                                            "+
			"		USER_NAME,                                                        "+
			"		POST_LEVEL,                                                       "+
			"		SALARY_LEVEL,                                                     "+
			"		PODS.GET_RADIX_POINT(POST_SALARY,2)        AS POST_SALARY        ,"+
			"		PODS.GET_RADIX_POINT(GENERAL_SUBS,2)       AS GENERAL_SUBS       ,"+
			"		PODS.GET_RADIX_POINT(DIFFICULT_AREAS,2)    AS DIFFICULT_AREAS    ,"+
			"		PODS.GET_RADIX_POINT(KPI_SALARY,2)         AS KPI_SALARY         ,"+
			"		PODS.GET_RADIX_POINT(JF_SALARY,2)          AS JF_SALARY          ,"+
			"		PODS.GET_RADIX_POINT(MERIT_PAY_1,2)        AS MERIT_PAY_1        ,"+
			"		PODS.GET_RADIX_POINT(MERIT_PAY_2,2)        AS MERIT_PAY_2        ,"+
			"		PODS.GET_RADIX_POINT(OTHER_PAY_1,2)        AS OTHER_PAY_1        ,"+
			"		PODS.GET_RADIX_POINT(OTHER_PAY_2,2)        AS OTHER_PAY_2        ,"+
			"		PODS.GET_RADIX_POINT(OVERTIME_PAY,2)       AS OVERTIME_PAY       ,"+
			"		PODS.GET_RADIX_POINT(FESTIVITY_PAY,2)      AS FESTIVITY_PAY      ,"+
			"		PODS.GET_RADIX_POINT(CHINA_ONE_PAY,2)      AS CHINA_ONE_PAY      ,"+
			"		PODS.GET_RADIX_POINT(MULTI_WY,2)           AS MULTI_WY           ,"+
			"		PODS.GET_RADIX_POINT(MULTI_WC,2)           AS MULTI_WC           ,"+
			"		PODS.GET_RADIX_POINT(MULTI_JT,2)           AS MULTI_JT           ,"+
			"		PODS.GET_RADIX_POINT(MULTI_TX,2)           AS MULTI_TX           ,"+
			"		PODS.GET_RADIX_POINT(MULTI_DSR,2)          AS MULTI_DSR          ,"+
			"		PODS.GET_RADIX_POINT(OTHER1,2)             AS OTHER1             ,"+
			"		PODS.GET_RADIX_POINT(OTHER2,2)             AS OTHER2             ,"+
			"		PODS.GET_RADIX_POINT(SALARY_PAY_TOTAL,2)   AS SALARY_PAY_TOTAL   ,"+
			"		PODS.GET_RADIX_POINT(PROVIDE_AGE,2)        AS PROVIDE_AGE        ,"+
			"		PODS.GET_RADIX_POINT(TREATMENT,2)          AS TREATMENT          ,"+
			"		PODS.GET_RADIX_POINT(UNEMPLOYE,2)          AS UNEMPLOYE          ,"+
			"		PODS.GET_RADIX_POINT(HOUSING,2)            AS HOUSING            ,"+
			"		PODS.GET_RADIX_POINT(SUPPLEMENTARY,2)      AS SUPPLEMENTARY      ,"+
			"		PODS.GET_RADIX_POINT(INCOME_TAX,2)         AS INCOME_TAX         ,"+
			"		PODS.GET_RADIX_POINT(OTHER_COST_1,2)       AS OTHER_COST_1       ,"+
			"		PODS.GET_RADIX_POINT(OTHER_COST_1_ITEM,2)  AS OTHER_COST_1_ITEM  ,"+
			"		PODS.GET_RADIX_POINT(DEDUCTED_TOTAL,2)     AS DEDUCTED_TOTAL     ,"+
			"		PODS.GET_RADIX_POINT(FACT_TOTAL,2)         AS FACT_TOTAL         ,"+
			"CASE USER_TYPE WHEN 1.00 THEN '合同内' ELSE '外包' END USER_TYPE                                  "+
			"FROM PODS.TB_ODS_JCDY_HR_SALARY T  LEFT JOIN (SELECT DISTINCT GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID" +
			",UNIT_NAME,HR_ID FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE DEAL_DATE='"+time+"') TR ON T.HR_NO=TR.HR_ID " +
			"WHERE T.DEAL_DATE='"+time+"'";
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var sql=getSelectSql();
	var userName=$.trim($("#userName").val());
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	if(userName!=''){
		sql+=" AND T.USER_NAME like '%"+userName+"%'";
	}
	if(regionCode!=''){
		sql+=" AND TR.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql += " AND TR.UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND TR.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" AND T.HR_NO IN("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 "; 
		 }
	}
	
	var title=[["账期","地市","营服中心","员工工号","姓名","岗位等级","薪档","固定薪酬","","艰苦地区补贴","KPI绩效","积分提成","专项奖励","","","","加班工资","过节费","福利及补贴","","","","","","","","应发合计数","养老保险缴费_个人","医疗保险缴费_个人","失业保险缴费_个人","住房公积金缴费_个人","补充养老保险缴费_个人","个人所得税","其他扣款1","其他扣款项","应扣合计数","实发数","人员类型"],
	           ["","","","","","","","岗位工资","综合补贴","","","","绩效工资_非经常项目1","绩效工资_非经常项目2","其他奖励_非经常项目1","其他奖励_非经常项目2","","","独生子女费","综合补贴(WY物业)","综合补贴(WC误餐)","综合补贴(JT交通)","综合补贴(TX通信)","低收入补贴","其他1","其他2","","","","","","","","","","","",""]];
	showtext = '人员薪酬明细-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////