var group_id_1 = "";
var unit_id = "";
var id = "";
var group_id_code = "";
var old_hr_id="";
var pageSize = 5;
$(function() {
	group_id_1 = art.dialog.data('group_id_1');
	unit_id = art.dialog.data('unit_id');
	id = art.dialog.data('id');
	group_id_code = art.dialog.data('group_id_code');
	old_hr_id=art.dialog.data('old_hr_id');
	listPerson(0);
	$("#searchBtn").click(function(){
		listPerson(0);
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'bindPersonDialog'}).close();

	});
	$("#saveBtn").click(function(){
		if($('input:radio:checked').length<=0) {
			art.dialog.alert("请选择需要绑定的负责人!");
			return false;
		}
		var userid = $('input:radio:checked').val()
		var name = $('input:radio:checked').attr("name");
		var username = $('input:radio:checked').attr("username");
		var phone = $('input:radio:checked').attr("phone");
		var hr_id = $('input:radio:checked').attr("hr_id");
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/channelManager_saveBindPerson.action",
			data:{
	           "userid" : userid,
	           "name":name,
	           "username":username,
	           "phone":phone,
	           "group_id_code":group_id_code,
	           "hr_id":hr_id,
	           "old_hr_id":old_hr_id
		   	}, 
		   	success:function(data){
		   		art.dialog({
		   			title: '提示',
		   		    content: data.msg,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'bindPersonDialog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
		   	}
		});
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
		url:$("#ctx").val()+"/channelManagement/channelManager_listBindPerson.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "group_id_1" : group_id_1,
           "unit_id" : unit_id,
           "id" : id,
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

