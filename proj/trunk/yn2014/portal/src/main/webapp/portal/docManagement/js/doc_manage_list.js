var pageSize = 5;
$(function() {
	search(0);
	$("#addBtn").click(function(){
		showAddOrUpdateDialog(null);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/docManagement/docManager_listDocs.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";   		
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['OLDNAME'])+"</td>"
				+"<td>"+isNull(n['CONTENTTYPE'])+"</td>"
				+"<td>"+isNull(n['SIZESTRING'])+"</td>"
				+"<td>"+isNull(n['CREATOR'])+"</td>"
				+"<td>"+isValid(isNull(n['ISVALID']))+"</td>"
				+"<td>"+isNull(n['CREATETIME'])+"</td>"
				+"<td>"+isNull(n['DESCRIPTION'])+"</td>"
				+"<td><a href='javascript:void(0);' onclick='showAddOrUpdateDialog(\""+n['ID']+"\")'>编辑</a>&nbsp;<a href='javascript:void(0);' onclick='deleteDoc(\""+n['ID']+"\")'>删除</a></td>";
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
function isValid(b){
	if(b&&b=="1"){
		return "是";
	}
	return "否";
}
function showAddOrUpdateDialog(id){
	var url = $("#ctx").val()+"/portal/docManagement/jsp/doc_manage_edit.jsp";
	var title="增加文件";
	if(null!=id&&id.length>0){
		title="编辑文件";
		$.ajax({
			url:$("#ctx").val()+"/docManagement/docManager_getDocById.action",
			type:'POST',
			dataType:'json',
			async:false,
			data:{
		           "id":id
			},
			success:function(doc){
				if(doc){
					art.dialog.data('id',id);
					art.dialog.data('OLDNAME',isNull(doc['OLDNAME']));
					art.dialog.data('NEWNAME',isNull(doc['NEWNAME']));
					art.dialog.data('DESCRIPTION',doc['DESCRIPTION']);
					art.dialog.data('ISVALID',doc['ISVALID']);
				}
			}
		});
	}else{
		art.dialog.data('id','');
		art.dialog.data('OLDNAME','');
		art.dialog.data('DESCRIPTION','');
		art.dialog.data('ISVALID','');
	}
	art.dialog.open(url,{
		id:'docDialog',
		title:title,
		width:'600px',
		height:'240px',
		lock:true,
		resize:false
	});
}
function deleteDoc(id){
	$.ajax({
		url:$("#ctx").val()+"/docManagement/docManager_delDoc.action",
		type:'POST',
		dataType:'json',
		async:false,
		data:{
	           "id":id
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

