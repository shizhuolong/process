var pageSize = 10;
$(function() {
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#addBtn").click(function(){
		showAddOrUpdateDialog(null);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	
	var isTop=$("#isTop").val();
	var isManage=$("#isManage").val();
	var bullName = $.trim($("#bullName").val());
	var isAlert = $("#isAlert").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/bullManagement/bullManager_listBulls.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "bullName":bullName,
           "isAlert":isAlert,
           "isManage":isManage,
           "isTop":isTop
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['BULLNAME'])+"</td>"
				+"<td>"+isNull(n['CREATOR'])+"</td>"
				+"<td>"+isNull(n['CREATETIME'])+"</td>"
				+"<td title='"+isNull(n['ACCESSORYNAME'])+"'>"+first40Char(isNull(n['ACCESSORYNAME']))+"</td>"
				+"<td><a href='javascript:void(0);' onclick='showAddOrUpdateDialog(\""+n['BULLETINID']+"\")'>编辑</a>&nbsp;<a href='javascript:void(0);' onclick='deleteBull(\""+n['BULLETINID']+"\",\""+n['ATTACHMENTS']+"\")'>删除</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").html(content);
			}else {
				$("#dataBody").html("<tr><td colspan='5'>暂无数据</td></tr>");
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
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function first40Char(s){
	if(s){
		if(s.length>40){
			return s.substring(0,40)+"...";
		}else{
			return s;
		}
	}else{
		return "&nbsp;";
	}
}
function showAddOrUpdateDialog(id){
	var url = $("#ctx").val()+"/portal/bullManagement/jsp/bull_manage_edit.jsp";
	var title="增加公告";
	if(null!=id&&id.length>0){
		title="编辑公告";
		$.ajax({
			url:$("#ctx").val()+"/index/index_getBullById.action",
			type:'POST',
			dataType:'json',
			async:false,
			data:{
		           "id":id
			},
			success:function(data){
				if(data&&data.length>0){
					var bull=data[0];
					art.dialog.data('id',id);
					art.dialog.data('bullName',isNull(bull['BULLNAME']));
					art.dialog.data('isTop',bull['ISFLAG']);
					art.dialog.data('isManage',bull['ISMANAGER']);
					art.dialog.data('isShow',bull['ISSHOW']);
					art.dialog.data('content',isNull(bull['BULLETINDESC']));
					art.dialog.data('attachmentsUrl',isNull(bull['ATTACHMENTS']));
					art.dialog.data('attachmentsNames',isNull(bull['ACCESSORYNAME']));
					art.dialog.data('isAlert',bull['IS_ALTER']);
				}
			}
		});
	}else{
		art.dialog.data('id','');
		art.dialog.data('bullName','');
		art.dialog.data('isTop','');
		art.dialog.data('isManage','');
		art.dialog.data('isShow','');
		art.dialog.data('content','');
		art.dialog.data('attachmentsUrl','');
		art.dialog.data('attachmentsNames','');
		art.dialog.data('isAlert','');
	}
	art.dialog.open(url,{
		id:'bullEditDialog',
		title:title,
		width:'830px',
		height:'420px',
		lock:true,
		resize:false
	});
}
function deleteBull(id,urls){
	$.ajax({
		url:$("#ctx").val()+"/bullManagement/bullManager_delBull.action",
		type:'POST',
		dataType:'json',
		async:false,
		data:{
	           "id":id,
	           "oldUrls":urls
		},
		success:function(data){
			if(data&&data['ok']){
				window.location.reload();
			}else{
				alert("系统错误");
			}
		}
			
	});
}

