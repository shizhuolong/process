var pageSize = 15;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	
	//添加日常巡检
	$("#addRCInspection").click(function(){
		addRCInspectionMsg();
	});
	//添加活动巡检
	$("#addHDInspection").click(function(){
		addHDInspectionMsg();
	});
	//添加信息收集
	$("#addXXInspection").click(function(){
		addXXInspectionMsg();
	});
	$("#resetBtn").click(function(){
		$("#qinspec_name").val("");
		$("#qstartTime").val("");
		$("#qcreator").val("");
		$("#qendtTime").val("");
		$("#qinspec_type").val("");
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var qinspec_name = $.trim($("#qinspec_name").val());
	var qcreator = $.trim($("#qcreator").val());
	var qstartTime = $.trim($("#qstartTime").val());
	var qendTime = $.trim($("#qendTime").val());
	var qinspec_type = $.trim($("#qinspec_type").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "inspec_name":qinspec_name,
           "creator":qcreator,
           "startTime":qstartTime,
           "endtTime":qendTime,
           "inspec_type":qinspec_type
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
				+"<td>"+isNull(n['INSPEC_ID'])+"</td>"
				+"<td>"+isNull(n['INSPEC_NAME'])+"</td>"
				+"<td>"+isNull(n['INSPEC_TYPE_NAME'])+"</td>"
				+"<td>"+isNull(n['START_TIME'])+"</td>"
				+"<td>"+isNull(n['END_TIME'])+"</td>"
				+"<td>"+isNull(n['C_USER_NAME'])+"</td>";
				var is_del = n['IS_DEL'];
				if(is_del == "0"&& n['C_USER_ID'] == userId) {
					content+="<td style='text-align:center;'>" +
							"<a href='#' onclick='editHd(this)' id='"+n['INSPEC_ID']+"' inspectype='"+n['INSPEC_TYPE']+"'>修改</a>&nbsp;&nbsp;&nbsp;" +
							"<a href='#' onclick='del(this)' id='"+n['INSPEC_ID']+"'>删除</a>&nbsp;&nbsp;&nbsp;" +
							"<a href='#' onclick='showDetails(this)' id='"+n['INSPEC_ID']+"'>详情</a>" +
							"</td>";
				} else {
					content+="<td style='text-align:center;'><a href='#' onclick='showDetails(this)' id='"+n['INSPEC_ID']+"'>详情</a></td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='7'>暂无数据</td></tr>");
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
	      prev_text: '上页',       // 上一页按钮里text
		  next_text: '下页',       // 下一页按钮里text
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

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

//添加日常巡检
function addRCInspectionMsg() {
	var url = $("#ctx").val()+"/taskManagement/chanlInspection_addRCInspection.action";
	window.parent.openWindow("添加日常巡检",'funMenu',url);
}
//添加活动巡检
function addHDInspectionMsg() {
	var url = $("#ctx").val()+"/taskManagement/chanlInspection_addHDInspection.action";
	window.parent.openWindow("添加活动巡检",'funMenu',url);
}
//添加活动巡检
function addXXInspectionMsg() {
	var url = $("#ctx").val()+"/taskManagement/chanlInspection_addXXInspection.action";
	window.parent.openWindow("添加信息收集任务",'funMenu',url);
}

function del(ele) {
	var id = $(ele).attr("id");
	art.dialog.confirm('您确定要进行该操作吗？',function(){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/taskManagement/chanlInspection_delHdInspection.action",
			data:{
				"id":id
		   	}, 
		   	success:function(data){
				if(data.code=='OK') {
					art.dialog({
			   			title: '提示',
			   		    content: '操作成功！',
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
							search(0);
			   		    }
			   		});
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("操作失败！"+errorThrown);
		   	}
		});
	},function(){
		//art.dialog.tips('执行取消操作');
	});
}

function editHd(ele) {
	var inspec_id = $(ele).attr("id");
	var inspectype = $(ele).attr("inspectype");
	if(inspectype==1){
		var url = $("#ctx").val()+"/taskManagement/chanlInspection_updateRcInspection.action?id="+inspec_id;
		window.parent.openWindow("修改日常巡检信息",'funMenu',url);
	}else if(inspectype==2){
		var url = $("#ctx").val()+"/taskManagement/chanlInspection_updateHdInspection.action?id="+inspec_id;
		window.parent.openWindow("修改活动巡检信息",'funMenu',url);
	}else{
		var url = $("#ctx").val()+"/taskManagement/chanlInspection_updateXXInspection.action?id="+inspec_id;
		window.parent.openWindow("修改信息采集",'funMenu',url);
	}
}

function showDetails(ele) {
	var inspec_id = $(ele).attr("id");
	var url = $("#ctx").val()+"/taskManagement/chanlInspection_showInspecInfo.action?id="+inspec_id;
	window.parent.openWindow("巡检详细信息",'funMenu',url);
}