var nowData = [];
var title=[["账期","地市编码","营服ID","营服中心","姓名","HR编码","指标名称","得分","权重(%)","创建者"]];
var field=["DEAL_DATE","GROUP_ID_1","UNIT_ID","UNIT_NAME","USER_NAME","HR_ID","KPI_NAME","KPI_SCORE","KPI_WEIGHT","LOGIN_NAME"];
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
	var sql="SELECT DEAL_DATE,GROUP_ID_1,UNIT_ID,UNIT_NAME,USER_NAME,HR_ID,KPI_NAME,KPI_SCORE,KPI_WEIGHT,LOGIN_NAME FROM PCDE.IS_KPI_TEMP WHERE DEAL_DATE='"+time+"' AND LOGIN_NAME='"+userId+"'";
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
	var sql="SELECT DEAL_DATE,GROUP_ID_1,UNIT_ID,UNIT_NAME,USER_NAME,HR_ID,KPI_NAME,KPI_SCORE,KPI_WEIGHT,LOGIN_NAME FROM PCDE.IS_KPI_TEMP WHERE DEAL_DATE='"+time+"' AND LOGIN_NAME='"+userId+"'";
	var showtext = "KPI自设导入预览";
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
				url:paths+"/devIncome/kpiUpload_confirmKpi.action",
				data:{
		           "time":time,
		           "userId":userId,
		           "regionCode":regionCode
			   	}, 
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库");
			   			window.location.href=paths+"/report/devIncome/jsp/is_kpi.jsp";
			   		}else{
			   			alert("入库失败,请重试");
			   			$("#confirmBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入");
		window.location.href=$("#ctx").val()+"/report/devIncome/jsp/is_kpi.jsp";
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/is_kpi.jsp";
 }