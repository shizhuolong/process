var nowData = [];
var title=[["账期","地市编码","创建者","创建时间","员工工号","姓名","岗位等级","薪档","岗位工资","综合补贴","艰苦地区补贴","绩效工资_非经常项目1","绩效工资_非经常项目2","其他奖励_非经常项目1","其他奖励_非经常项目2","加班工资","过节费","独生子女费","综合补贴(WY物业)","综合补贴(WC误餐)","综合补贴(JT交通)","综合补贴(TX通信)","低收入补贴","其他2","应发合计数","养老保险缴费_个人","医疗保险缴费_个人","失业保险缴费_个人","住房公积金缴费_个人","补充养老保险缴费_个人","个人所得税","其他扣款1","其他扣款项","应扣合计数","实发数"]];
var field=["DEAL_DATE","GROUP_ID_1","CREATOR","CREATETIME","HR_NO","USER_NAME","POST_LEVEL","SALARY_LEVEL","POST_SALARY","GENERAL_SUBS","DIFFICULT_AREAS","MERIT_PAY_1","MERIT_PAY_2","OTHER_PAY_1","OTHER_PAY_2","OVERTIME_PAY","FESTIVITY_PAY","CHINA_ONE_PAY","MULTI_WY","MULTI_WC","MULTI_JT","MULTI_TX","MULTI_DSR","OTHER2","SALARY_PAY_TOTAL","PROVIDE_AGE","TREATMENT","UNEMPLOYE","HOUSING","SUPPLEMENTARY","INCOME_TAX","OTHER_COST_1","OTHER_COST_1_ITEM","DEDUCTED_TOTAL","FACT_TOTAL"];
var report = null;
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	report = new LchReport({
		title : title,
		field : field,
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
	var time=$("#time").val();
	var userId=$("#userId").val();
	var sql="select DEAL_DATE,GROUP_ID_1,CREATOR,CREATETIME,HR_NO,USER_NAME,POST_LEVEL,SALARY_LEVEL,POST_SALARY,GENERAL_SUBS,DIFFICULT_AREAS,MERIT_PAY_1,MERIT_PAY_2,OTHER_PAY_1,OTHER_PAY_2,OVERTIME_PAY,FESTIVITY_PAY,CHINA_ONE_PAY,MULTI_WY,MULTI_WC,MULTI_JT,MULTI_TX,MULTI_DSR,OTHER2,SALARY_PAY_TOTAL,PROVIDE_AGE,TREATMENT,UNEMPLOYE,HOUSING,SUPPLEMENTARY,INCOME_TAX,OTHER_COST_1,OTHER_COST_1_ITEM,DEDUCTED_TOTAL,FACT_TOTAL from PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND CREATOR='"+userId+"'";
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
	var userId=$("#userId").val();
	var sql="select DEAL_DATE,GROUP_ID_1,CREATOR,CREATETIME,HR_NO,USER_NAME,POST_LEVEL,SALARY_LEVEL,POST_SALARY,GENERAL_SUBS,DIFFICULT_AREAS,MERIT_PAY_1,MERIT_PAY_2,OTHER_PAY_1,OTHER_PAY_2,OVERTIME_PAY,FESTIVITY_PAY,CHINA_ONE_PAY,MULTI_WY,MULTI_WC,MULTI_JT,MULTI_TX,MULTI_DSR,OTHER2,SALARY_PAY_TOTAL,PROVIDE_AGE,TREATMENT,UNEMPLOYE,HOUSING,SUPPLEMENTARY,INCOME_TAX,OTHER_COST_1,OTHER_COST_1_ITEM,DEDUCTED_TOTAL,FACT_TOTAL from PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND CREATOR='"+userId+"'";
	var showtext = "调整后外包导入";
	showtext = '调整后外包导入';
	downloadExcel(sql,title,showtext);
}

function confirmImport(){
	var time=$("#time").val();
	var userId=$("#userId").val();
	var regionCode=$("#cityCode").val();
	if(totalCount){
		if(confirm("确认导入？")){
			$("#confirmBtn").hide();
			$.ajax({
				type:"POST",
				dataType:'json',
				async:true,
				cache:false,
				url:paths+"/devIncome/orUploadOld_confirmTax.action",
				data:{
		           "time":time,
		           "userId":userId,
		           "regionCode":regionCode
			   	}, 
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库");
			   			window.location.href=paths+"/report/devIncome/jsp/tmp_jcdy_hr_out_old_salary.jsp";
			   		}else{
			   			alert("入库失败,请重试");
			   			$("#confirmBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入");
		window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_out_old_salary.jsp";
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_out_old_salary.jsp";
 }