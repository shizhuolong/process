var nowData = [];
var title=[["账期","人员编号","姓名","归属外包公司名称","所在组织","固定工资","绩效工资","津贴补贴","过节费","加班工资","其他工资性支出","应发金额","税前扣款项","税后扣款项","社保公积金扣减额","个人所得税扣缴额","实发金额","养老保险","生育保险","失业保险","医疗保险","工伤保险","公积金","小计","为本企业服务开始日期","在本企业缴纳社会保险起始日期","工会会费","管理费","税金","其他人工支出项目","备注","成本合计"]];
var field=["DEAL_DATE","HR_NO","USER_NAME","OWN_COMPANY","OWN_ORG","POST_SALARY","JX_SALARY","SUBSIDY","FESTIVITY_PAY","OVERTIME_PAY","OTHER_PAY","SALARY_PAY_TOTAL","OTHER_COST_1","OTHER_COST_1_ITEM","HOUSING","INCOME_TAX","FACT_TOTAL","PROVIDE_AGE","BIRTH_FEE","UNEMPLOYE","TREATMENT","HURT_FEE","GJJ_FEE","DEDUCTED_TOTAL","BEGIN_DATE","DEDUCT_DATE","UNION_DUES","MANA_FEE","FAX_FEE","OTHER_MAN_PAY","NOTE","COST_TOTAL"];
var report = null;
var downSql="";
/*LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}*/
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
	var orgLevel=$("#orgLevel").val();
	var type=1;
	if(orgLevel==2){
		type=2;
	}
	var sql="SELECT "+field.join(",")+" FROM PTEMP.TB_TMP_JCDY_OUT_HR_SALARY_TEMP WHERE DEAL_DATE='"+time+"' AND TYPE='"+type+"'";
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
	var showtext = "调整后外包导入-"+time;
	downloadExcel(downSql,title,showtext);
}

function confirmImport(){
	var time=$("#time").val();
	var userId=$("#userId").val();
	if(totalCount){
		if(confirm("确认导入？")){
			$("#confirmBtn").hide();
			$.ajax({
				type:"POST",
				dataType:'json',
				async:true,
				cache:false,
				url:paths+"/devIncome/orUpload_confirmTax.action",
				data:{
		           "time":time,
		           "userId":userId
			   	}, 
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库");
			   			window.location.href=paths+"/report/devIncome/jsp/tmp_jcdy_hr_salary_out_result.jsp";
			   		}else{
			   			alert("入库失败,请重试");
			   			$("#confirmBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入");
		window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_out_salary.jsp";
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/tmp_jcdy_hr_out_salary.jsp";
 }