var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/subsidyInput/subsidy-input!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
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
					+"<td>"+isNull(n['DEVELOP_CHNL_CODE'])+"</td>"
	                +"<td>"+isNull(n['DEVELOP_CHNL_NAME'])+"</td>"
	                +"<td>"+isNull(n['PAY_CHNL_CODE'])+"</td>"
	                +"<td>"+isNull(n['PAY_CHNL_NAME'])+"</td>"
	                +"<td>"+isNull(n['BILLINGCYCLID'])+"</td>"
	                +"<td>"+isNull(n['CUST_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_WAY'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_FEE'])+"</td>"
	                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
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
