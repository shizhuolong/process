var areaCode = "";
var unitId = "";
var pageSize = 5;
$(function() {
	areaCode = art.dialog.data('areaCode');
	unitId = art.dialog.data('unitId');
	listPerson(0);
	$("#searchBtn").click(function(){
		listPerson(0);
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'selectPersonDialog'}).close();

	});
	$("#saveBtn").click(function(){
		if($('input:radio:checked').length<=0) {
			art.dialog.alert("请选择作为渠道经理的人!");
			return false;
		}
		var userid = $('input:radio:checked').val()
		var name = $('input:radio:checked').attr("name");
		var phone = $('input:radio:checked').attr("phone");
		var hrId = $('input:radio:checked').attr("hr_id");
		
		var win = artDialog.open.origin;//来源页面
		win.setPrincipalValues(userid,name,phone,hrId);
		win.art.dialog({id: 'selectPersonDialog'}).close();
	});
});

function listPerson(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var username = $.trim($("#username").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/notReatyManager_listValidUsers.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "areaCode" : areaCode,
           "unitId" : unitId,
           "name":name,
           "username":username
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
				+"<td>" +
					"<input type='radio' hr_id='"+n['HR_ID']+"' phone='"+n['PHONE']+"' username='"+n['USERNAME']+"' name='"+n['REALNAME']+"' name='ckperson' value='"+n['ID']+"'>" +
				"</td>"
				+"<td>"+isNull(n['REALNAME'])+"</td>"
				+"<td>"+isNull(n['USERNAME'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#personDatas").empty().html(content);
			}else {
				$("#personDatas").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
	   	}
	});
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: listPerson,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
	   next_text: '下页',       //下一页按钮里text  
	   num_display_entries: 3, 
	   num_edge_entries: 0
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}