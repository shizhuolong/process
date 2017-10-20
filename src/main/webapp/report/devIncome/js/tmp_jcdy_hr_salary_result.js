var nowData = [];
var title=[["账期","员工号","员工姓名","组织","分配编号","工资单","工资发放月数","岗位工资","综合补贴","艰苦地区补贴","取暖补贴","保留工资","月度绩效工资_非经常","月度绩效工资_二次","年终绩效工资","年终绩效工资-不计当期成本","加班工资","综合补贴（WY）","综合补贴（CB）","夜班津贴","过节费","专项奖励","倒算税奖励","上级拨款奖励","调整工资","固定工资考核扣款","绩效工资考核扣款","其他扣款","其他扣款","异地交流补贴","政府特殊津贴","信访岗位津贴","3G奖励","本地网奖励","伤残补贴","独生子女费用(不纳税)","独生子女费用(纳税)","交通补贴(不纳税)","交通补贴(纳税)","丧葬抚恤金","集体福利","工作服","家属补助","离职补偿","其他工资_不计当期成本_税前","其他工资_计提","补充医疗_商业保险_公司缴费","补充养老保险缴费(不抵税)","补充养老保险缴费(抵税)","补充养老保险缴费_公司","企业年金（个人）","企业年金_公司","养老保险缴费_个人","养老保险缴费_公司","医疗保险缴费_个人","医疗保险缴费_公司","失业保险缴费_个人","失业保险缴费_公司","工伤保险缴费_公司","生育保险缴费_公司","大病大额医疗保险个人缴费(抵税)","月大病大额医疗保险雇主缴费","大病大额医疗保险缴费调整_个人","大病大额医疗保险缴费调整_公司","养老保险缴费调整_个人","养老保险缴费调整_公司","医疗保险缴费调整_个人","医疗保险缴费调整_公司","失业保险缴费调整_个人","失业保险缴费调整_公司","工伤保险缴费调整_公司","生育保险缴费调整_公司","抵扣社保费用","住房公积金缴费_个人","住房公积金缴费_公司","住房公积金缴费调整_个人","住房公积金缴费调整_公司","补充住房公积金缴费_个人","补充住房公积金_公司","劳保费（免税）","劳保费（纳税）","工会经费","教育经费","教育经费支出","工会经费调整","教育经费调整","个人所得税调整","附加免税额","其他计税项","员工管理费","其他保险","应发工资","扣款合计","个人所得税扣减额","年度奖金税额","离职遣散费的个人所得税扣减额","实发工资","工资总额","职工薪酬成本"]];
var field=["DEAL_DATE","HR_NO","USER_NAME","OWN_ORG","DIS_NUM","SALARY_UNIT","SALARY_MONTH","POST_SALARY","MULTI_PAY","AREA_PAY","WARM_PAY","HOLD_SALAY","MON_SALARY_1","MON_SALARY_2","YEAR_SALARY","YEAR_SALARY_NOCOST","OVERTIME_PAY","MULTI_WY","MULTI_CB","NIGHT_PAY","FESTIVITY_PAY","SPECIAL_PAY","OTHER_TAX_PAY","UP_PAY","ADJUST_SALARY","POST_KH_PAY","JX_KH_PAY","OTHER1","OTHER2","OTHER_PLACE_PAY","GOV_SPECIAL_PAY","PETITION_POST_PAY","G3_PAY","NATIVE_LAN_PAY","HURT_PAY","CHINA_ONE_NO_TAX","CHINA_ONE_TAX","JT_NO_TAX","JT_TAX","FUNERAL_PENSION","COLLECTIVE_WELFARE","COVERALL","FAMILY_ALLOWANCE","SEVERANCE_PACKAGE","OTHER_SALA_NO_COST","OTHER_SALA_JT","TREATMENT","PROVIDE_AGE_NOTAX","PROVIDE_AGE_TAX","PROVIDE_AGE_COM","INDIVIDUAL","INDIVIDUAL_COM","PROVIDE_AGE_PER","PROVIDE_COM","TREATMENT_PER","TREATMENT_COM","UNEMPLOYE_PER","UNEMPLOYE_COM","HURT_COM","MATERNITY_COM","BIGMEDI_TAX","MON_BIGMEDI","BIGMEDI_PER","BIGMEDI_COM","PROVIDE_ADJUST_PER","PROVIDE_ADJUST_COM","TREATMENT_ADJUST_PER","TREATMENT_ADJUST_COM","UNEMPLOYE_ADJUST_PER","UNEMPLOYE_ADJUST_COM","HURT_ADJUST_COM","MATERNITY_ADJUST_COM","DIS_SOCIAL","HOUSING_PER","HOUSING_COM","HOUSING_ADUST_PER","HOUSING_ADUST_COM","BC_HOUSING_PER","BC_HOUSING_COM","LABOR_NO_TAX","LABOR_TAX","LABOUR_FEE","EDU_FEE","EDU_PAY","LABOR_ADJUST","EDU_ADJUST","INCOME_TAX_ADJUST","ADD_NO_TAX","OTHER_TAX","MANA_FEE","OTHER_ASSURANCE","SALARY_PAY_TOTAL","DEDUCTED_TOTAL","INCOME_TAX_DISS","YEAR_JJ_TAX","LEAVE_TAX","FACT_TOTAL","ALL_SALARY","SALARY_COST"];
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
	var orgLevel=$("#orgLevel").val();
	var type=$("#type").val();
	var sql="SELECT "+field.join(",")+" FROM PTEMP.TB_TMP_JCDY_HR_SALARY WHERE DEAL_DATE='"+time+"' AND TYPE='"+type+"'";
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
	var showtext = "调整后合同导出-"+time+"-"+$("#type").find("option:selected").text();
	downloadExcel(downSql,title,showtext);
}

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_salary.jsp";
 }
