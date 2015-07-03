var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var init_id = $("#init_id").val();
	var unit_id = $("#unit_id").val();
	var deal_date = $("#deal_date").val();
	var cost_center_name = $.trim($("#cost_center_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!listDetailsInfo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "deal_date":deal_date,
           "unit_id":unit_id,
           "init_id":init_id,
           "cost_center_name":cost_center_name
	   	}, 
	   	success:function(data){
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
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='11'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
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
