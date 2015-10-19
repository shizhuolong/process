var pageSize = 5;
var UPDATE_ROLE = 'ROLE_MANAGER_TASKMANAGEMENT_MYTASK_TASK-LIST_UPDATEPART';	//修改权限
var UPDATE_MANAGER_ROLE = 'ROLE_MANAGER_TASKMANAGEMENT_MYTASK_MANAGER-TASK-LIST_UPDATEPART';	//修改权限
var paraValue = '1';
$(function(){
	
	$.ajaxSettings.async = false; //同步
	$.getJSON(
	    path+"/common/commonParam_qryStaticParaByParaCode.action?paraCode=1",
	    function(data) {
	    	paraValue = data.paraValue;
	    }
    );
	$.ajaxSettings.async = true;//查询完后改为异步
	
	loadData();
	
	function loadData(){
	    baseInfo.getDataBySelectIndex(0);
	   
	}
	
	//查询
	$("#searchBtn").click(function(){
		loadData();
	});
	
});

var baseInfo={
	
	//获取表格数据
	getDataBySelectIndex:function(pageNumber){
		var dateValue = $("#dateValue").val();
		pageNumber = pageNumber+1;
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:path+"/taskManagement/saleSchedule_queryMyTaskList.action",
			data:{
				"resultMap.page":pageNumber,
				"resultMap.rows":pageSize,
				"resultMap.dateValue":dateValue,
				"userFlag":userFlag
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
		   		var content='';
		   		$.each(pages.rows,function(i,n){
		   			var operateStr = getOperateStr(n.status,n.id,n.isNew,n.rejectTaskNum,n.dateValue,n.userType,n.regionType);
		   			$.each(n.taskDetailList,function(j,m){
		   				if(j==0) {
		   					content += '<tr><td rowspan="'+n.taskDetailList.length+'">'+n.dateValue+'</td><td rowspan="'+n.taskDetailList.length+'">'+n.regionName+'</td><td rowspan="'+n.taskDetailList.length+'">'+getStatusName(parseInt(n.status))+'</td><td>'+m.indexTargetBean.name2+'</td>'
		   						+'<td>'+m.indexTargetBean.unit+'</td><td>'+m.indexTargetBean.name1+'</td><td>'+m.targetValue+'</td><td rowspan="'+n.taskDetailList.length+'" style="text-align:center;">'+operateStr+'</td></tr>';
		   				}else {
		   					content += '<tr><td>'+m.indexTargetBean.name2+'</td>'
		   					+'<td>'+m.indexTargetBean.unit+'</td><td>'+m.indexTargetBean.name1+'</td><td>'+m.targetValue+'</td></tr>';
		   				}
		   			});
				});
				if(content != "") {
					$("#dataBody").empty().html(content);
				}else {
					$("#dataBody").empty().html("<tr><td colspan='8' style='text-align:center;'>暂无数据</td></tr>");
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("加载数据失败！");
		    }
	  });
	}
};

//根据任务当前状态及是否是省或地市任务来判断相应的操作
function getOperateStr(status,id,isNew,num,dateValue,userType,regionType) {
	
	var str = '';
	if(isNew=='1') {	//省公司或地市任务
		str = '<a href="#" taskId="'+id+'" onclick="checkTask(this)">查看</a>';
		if(isGrantedNew(UPDATE_ROLE)) {	//
			if(num > 0) {
				str += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" onclick="editRejectTask(this)">重排已拒绝任务</a>';
			}
			if((cMonth==dateValue && status=='6') || (cMonth!=dateValue && paraValue=='0' && status=='6')) {
				str += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" onclick="cancelTask(this)">作废</a>';
			}
		}
	}else if(isNew=='2') {
		if(userFlag == 'chnlManager') {
			if(status=='2' && isGrantedNew(UPDATE_MANAGER_ROLE)) {	//上级已审批通过
				str = '<a href="#" taskId="'+id+'" onclick="receiveTask(this)">认领</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" onclick="rejectTask(this)">拒绝</a>';
			}else if(status=='4' && isGrantedNew(UPDATE_MANAGER_ROLE)) {
				if(regionType == '4' || (regionType == '10' && userType == '3')) {
					str = '<a href="#" taskId="'+id+'" onclick="checkTask(this)">查看</a>';
				} else {
					str = '<a href="#" taskId="'+id+'" userType="'+userType+'" onclick="resolveTask(this)">分解</a>';
				}
			}else if(status=='6') {
				str = '<a href="#" taskId="'+id+'" onclick="checkTask(this)">查看</a>';
				if((cMonth==dateValue && isGrantedNew(UPDATE_MANAGER_ROLE)) || (cMonth!=dateValue && paraValue=='0' && isGrantedNew(UPDATE_MANAGER_ROLE))) {
					str += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" userType="'+userType+'" onclick="cancelTask(this)">作废</a>';
				}
			}
		} else {
			if(status=='2' && isGrantedNew(UPDATE_ROLE)) {	//上级已审批通过
				str = '<a href="#" taskId="'+id+'" onclick="receiveTask(this)">认领</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" onclick="rejectTask(this)">拒绝</a>';
			}else if(status=='4' && isGrantedNew(UPDATE_ROLE)) {
				if(regionType == '4') {
					str = '<a href="#" taskId="'+id+'" onclick="checkTask(this)">查看</a>';
				} else {
					str = '<a href="#" taskId="'+id+'" userType="'+userType+'" onclick="resolveTask(this)">分解</a>';
				}
			}else if(status=='6') {
				str = '<a href="#" taskId="'+id+'" onclick="checkTask(this)">查看</a>';
				if((cMonth==dateValue && isGrantedNew(UPDATE_ROLE)) || (cMonth!=dateValue && paraValue=='0' && isGrantedNew(UPDATE_ROLE))) {
					str += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" taskId="'+id+'" userType="'+userType+'" onclick="cancelTask(this)">作废</a>';
				}
			}
		}
	}
	return str;
}

//领取任务
function receiveTask(element) {
	var taskId = $(element).attr("taskId");
	updateStatus(taskId,"4","确定领取该任务吗？");
}

//拒绝任务
function rejectTask(element) {
	var taskId = $(element).attr("taskId");
	updateStatus(taskId,"5","确定拒绝领取该任务吗？");
}

//作废
function cancelTask(element) {
	
	var taskId = $(element).attr("taskId");
	var userType = $(element).attr("userType");
	art.dialog.confirm('此操作将会级联将下级所有地域的任务作废，确认进行吗？', function () {
		jQuery.blockUI({
			message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
			fadeIn: 700,
			centerY: true,
			showOverlay: true
		});
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:path+"/taskManagement/saleSchedule_doCancelTask.action",
		    data:{
		    	parentTaskId:taskId
			},
	        success:function(data){
	        	jQuery.unblockUI();
				if(data.code=='OK') {
					art.dialog({
			   			title: '提示',
			   		    content: data.msg,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    	if(userType == null || userType == "" || userType == "undefined" || userType == undefined || userType == "null") {
			   		    		window.location.href = path+'/taskManagement/saleschedule/jsp/my_saleschedule.jsp';
							} else {
								window.location.href = path+'/taskManagement/saleschedule/jsp/my_saleschedule.jsp?userFlag=chnlManager';
							}
			   		    }
			   		});
				}else {
					art.dialog.alert(data.msg);
				}
	        },
	        error:function(XMLHttpRequest, textStatus, errorThrown){
			   art.dialog.alert("操作失败！"+errorThrown);
		    }
		});
	}, function () {
	    //art.dialog.tips('执行取消操作');
	});
}

//分解下发
function resolveTask(element) {
	
	var taskId = $(element).attr("taskId");
	var userType = $(element).attr("userType");
	window.location.href = path+'/taskManagement/saleschedule/jsp/saleschedule_decomposition.jsp?taskId='+taskId+'&userType='+userType;
}

//查看任务详情
function checkTask(element) {
	var taskId = $(element).attr("taskId");
	window.location.href = path+'/taskManagement/saleschedule/jsp/saleschedule_read.jsp?taskId='+taskId;
}

//修改拒绝的任务并重新提交审批
function editRejectTask(element) {
	var taskId = $(element).attr("taskId");
	window.location.href = path+'/taskManagement/saleschedule/jsp/saleschedule_reject_edit.jsp?taskId='+taskId;
}

//更新任务状态
function updateStatus(taskId,status,msg) {
	art.dialog.confirm(msg, function () {
		jQuery.blockUI({
			message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
			fadeIn: 700,
			centerY: true,
			showOverlay: true
		});
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:path+"/taskManagement/saleSchedule_updateTaskStatusById.action",
		    data:{
		    	taskId:taskId,
		    	status:status
			},
	        success:function(data){
	        	jQuery.unblockUI();
				if(data.code=='OK') {
					art.dialog({
			   			title: '提示',
			   		    content: data.msg,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    	window.location.href = path+"/taskManagement/saleschedule/jsp/my_saleschedule.jsp";
			   		    }
			   		});
				}else {
					art.dialog.alert(data.msg);
				}
	        },
	        error:function(XMLHttpRequest, textStatus, errorThrown){
			   art.dialog.alert("操作失败！"+errorThrown);
		    }
		});
	}, function () {
	    //art.dialog.tips('执行取消操作');
	});
}

//分页插件
function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
        callback: baseInfo.getDataBySelectIndex,
        items_per_page:pageSize,
        link_to:"###",
        prev_text: '上页',       //上一页按钮里text  
    	next_text: '下页',       //下一页按钮里text  
    	num_display_entries: 5, 
    	num_edge_entries: 2
	 });
}


function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

