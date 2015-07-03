var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var cost_center_name = $.trim($("#cost_center_name").val());
	var deal_date = $.trim($("#deal_date").val());
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/importCostBudget/import-cost-budget!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "cost_center_name":cost_center_name,
           "deal_date":deal_date,
           "businessKey":businessKey
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['COST_CENTER_CODE'])+"</td>"
				+"<td>"+isNull(n['COST_CENTER_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_ITEM'])+"</td>"
				+"<td>"+isNull(n['BUDGET_ITEM_CODE'])+"</td>"
				+"<td>"+isNull(n['BUDGET_ITEM_NAME'])+"</td>"
				+"<td>"+isNull(n['BUDGET_MONEY'])+"</td>"
				+"<td>"+isNull(n['ZSB_RATE'])+"</td>"
				+"<td>"+isNull(n['FLAG'])+"</td>";
				content += "<td><a href='#' id='"+n['ID']+"' flag='"+n['F']+"' onclick='edit(this);'>修改</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='12'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function edit(ele) {
	var id = $(ele).attr("id");
	var flag = $(ele).attr("flag");
	art.dialog.data('id',id);
	art.dialog.data('flag',flag);
	var url = $("#ctx").val()+"/portal/costManagement/jsp/import_cost_budget_update.jsp";
	art.dialog.open(url,{
		id:'importCostBudgetUpdateDailog',
		width:'610px',
		height:'240px',
		padding:'0 0',
		title:'成本预算修改',
		lock:true,
		resize:false
	});
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: search,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
  	next_text: '下页',       //下一页按钮里text  
  	num_display_entries: 5, 
  	num_edge_entries: 2
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}
