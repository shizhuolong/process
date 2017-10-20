var nowData = [];
var title=[["账期","人员编号","姓名","归属外包公司名称","所在组织","固定工资","绩效工资","津贴补贴","过节费","加班工资","其他工资性支出","应发金额","税前扣款项","税后扣款项","社保公积金扣减额","个人所得税扣缴额","实发金额","养老保险","生育保险","失业保险","医疗保险","工伤保险","公积金","小计","为本企业服务开始日期","在本企业缴纳社会保险起始日期","工会会费","管理费","税金","其他人工支出项目","备注","成本合计"]];
var field=["DEAL_DATE","HR_NO","USER_NAME","OWN_COMPANY","OWN_ORG","POST_SALARY","JX_SALARY","SUBSIDY","FESTIVITY_PAY","OVERTIME_PAY","OTHER_PAY","SALARY_PAY_TOTAL","OTHER_COST_1","OTHER_COST_1_ITEM","HOUSING","INCOME_TAX","FACT_TOTAL","PROVIDE_AGE","BIRTH_FEE","UNEMPLOYE","TREATMENT","HURT_FEE","GJJ_FEE","DEDUCTED_TOTAL","BEGIN_DATE","DEDUCT_DATE","UNION_DUES","MANA_FEE","FAX_FEE","OTHER_MAN_PAY","NOTE","COST_TOTAL"];
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	initType();
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

function initType(){
	var orgLevel=$("#orgLevel").val();
	var h="";
	if(orgLevel==1){
		h="<option value='1'>省级导入</option><option value='2'>地市导入</option>";
	}else{
		h="<option value='2'>地市导入</option>";
	}
	$("#type").empty().append($(h));
}

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var userId=$("#userId").val();
	var type=$("#type").val();
	var sql="SELECT "+field.join(",")+" FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY WHERE DEAL_DATE='"+time+"' AND TYPE='"+type+"'";
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	sql+=" ORDER BY GROUP_ID_1";
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
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
function downsAll() {
	var time=$("#time").val();
	var showtext = "调整后外包导出-"+time+"-"+$("#type").find("option:selected").text();
	downloadExcel(downSql,title,showtext);
}

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_out_salary.jsp";
 }
