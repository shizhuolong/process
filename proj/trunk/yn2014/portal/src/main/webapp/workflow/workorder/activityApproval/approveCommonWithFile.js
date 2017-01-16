var isNeedApprover = true;
var optionTrue = "";
var optionFalse = "";
var optionExceedTrue = "";
var optionExceedFalse = "";
$(document).ready(function(){
	
	 $('.trace').click(graphProcessTrace);
	
	processHistory();
	queryWorkOrderInfo();
});

//审批历史
function processHistory(){
	var object = null;
	 $.ajax({
		  type:"POST",
	      dataType:'json',async:false,cache:false,
	      url:path+"/workflow/work-flow!qryApproveAdviceHistory.action",
	      data:{
	           "workOrderVo.processInstanceId":processCommon.processInstanceId
		   }, 
		   success:function(data)
		   {
			   var html = "";
			   $.each(data,function(i,n){
				   if(i == 0){
					   $("#title").val(n.taskDesc);
				   }
				   if(n.actNodeName != 'Start') {
					   var passornot = n.passOrNot;
					   var submitTime = n.submitTime;
					   if(passornot == true){
						   passornot = "同意";
					   }else{
						   passornot = "不同意";
					   }
					   if(submitTime == null){
						   passornot = "审批中";
						   submitTime = "";
					   }
					   if(i%2 == 0){
		            		 classId = '';
		            	 }else{
		            		 classId = 'even';
		            	 }
					   html += "<tr class='"+classId+"'>"
						   + "<td>"+i+"</td>"
						   + "<td>"+n.actNodeName+"</td>"
						   + "<td>"+n.assigneeName+"</td>"
						   + "<td>"+passornot+"</td>"
						   + "<td>"+n.taskDesc+"</td>"
						   + "<td>"+submitTime+"</td>"
						   + "</tr>";
				   }
			   });
			   $("#processHistory").empty().append(html);
		 }
	 });
}

//当前审批信息
function queryWorkOrderInfo(){
	var object = null;
	if(processCommon.queryListType == 'wait'){
		$.ajax({
			  type:"POST",
		      dataType:'json',cache:false,async:true,
		      url:path+"/workflow/work-flow!queryNextUserTasks.action",
		      data:{
		           "workOrderVo.taskId":processCommon.taskId
			   }, 
			   success:function(data){
				  /*  $("#processKey").val(data.processKey);
				   $("#businessKey").val(data.businessKey);
				   $("#persentTask").text(data.actNodeName);
				   $("#persentUser").text(data.assigneeName); */
				   $.each(data.nextUserTaskList,function(i,n){
					   if(n.nextTrueFlag == 'TRUE'){
						   if(isNotBlank(exceedFlag)) {
							   if(exceedFlag=='true' && n.exceedFlag=='TRUE') {
								   optionExceedTrue += "<option value='"+n.nextActId+"'>"+n.nextActName+"</option>";
							   }else if(exceedFlag=='false' && n.exceedFlag=='FALSE'){
								   optionExceedFalse += "<option value='"+n.nextActId+"'>"+n.nextActName+"</option>";
							   }
						   }else {
							   optionTrue += "<option value='"+n.nextActId+"'>"+n.nextActName+"</option>";
						   }
					   }else{
						   optionFalse += "<option value='"+n.nextActId+"'>"+n.nextActName+"</option>";
					   }
				   });
				   if(isNotBlank(exceedFlag)) {
					   if(exceedFlag=='true') {
						   $("#nextRouter").empty().append(optionExceedTrue);
					   }else {
						   $("#nextRouter").empty().append(optionExceedFalse);
					   }
				   }else {
					   $("#nextRouter").empty().append(optionTrue);
				   }
				   
				   findTaskExterPro();
			 }
		 });
	}
}

function changeNextRouter(){
	if($("#passOrNot").val() == 'false'){
		$("#nextRouter").empty().append(optionFalse);
		$("#approveAdvice").val("不同意");
	}else{
		 if(isNotBlank(exceedFlag)) {
			if(exceedFlag=='true') {
			   $("#nextRouter").empty().append(optionExceedTrue);
			}else {
			   $("#nextRouter").empty().append(optionExceedFalse);
			}
		 }else {
			 $("#nextRouter").empty().append(optionTrue);
		 }
		 $("#approveAdvice").val("同意");
	}
	findTaskExterPro();
}

/****/
function findTaskExterPro() {
	
	var taskId = $("#nextRouter").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:path+"/approver/approver-handler!qryUserTaskProperty.action",
		data:{
	        taskId:taskId
	 	}, 
	 	success:function(data){
	 		$("#nextDealer").html("");
			if(null != data) {
		 		//taskFlag:0-当前审批环节审批人为拟稿人；1-当前审批环节审批人为省公司人员；2-当前审批环节审批人为同分公司人员；3-当前审批人为同部门人员。
			 	var taskFlag = data.TASK_FLAG; 
			 	$(".approver_td").show();
				if(taskFlag == '0') {
					$("#nextDealer").html("<option value='"+applyUserId+"'>"+applyUserName+"</option>");
				}else if(taskFlag == '5'){ //不需审批人
					isNeedApprover = false;
					$(".approver_td").hide();
					$("#isNeedApprover").val("false");
				}else {
			   		findNextDealer(taskId,taskFlag);
				}		
	 	   	}
		 }
	 });
}

//下一步审批人
function findNextDealer(taskId,taskFlag) {
	
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = path+"/approver/approver-handler!qryMyDepartLeader.action";
	}else {
		url = path+"/approver/approver-handler!qryTaskApprover.action";
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
     		taskId:taskId,
        	taskFlag:taskFlag
		}, 
	 	success:function(data){
	 		var str = "";
	 		$.each(data,function(i,n){
	 			str += "<option value='"+n.USER_ID+"'>"+n.USER_NAME+"</option>";
			});
	 		$("#nextDealer").html(str);
		 }
	 });
}

//提交审批
function submitTask(){
	
	if(validate()){
		art.dialog.confirm('确定发送吗？', function () {
			var actNodeName = $("#nextRouter option:selected").text();
			$("#actNodeName").val(actNodeName);
			if(isHavingFile=="withFile"){//有附件上传
				$("#isHavingFile").val(isHavingFile);
			}
			$("#taskForm").form("submit",{
				url:path+'/workflow/work-flow!doSubmitTask.action',
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h3>正在发送中，请稍等...</h3></div>",
						fadeIn: 700,
						centerY: true,
						showOverlay: true
					});	
					return true;
				},
				success:function(data){
					data=eval('('+data+')');
					jQuery.unblockUI();
					if(data.code=='OK') {
						art.dialog({
				   			title: '提示',
				   		    content: data.msg,
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	location.href = path+"/workflow/workorder/activityApproval/processApprove/processApprove.jsp";
				   		    }
				   		});
					}else {
						art.dialog.alert(data.msg);
					}
					return false;
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
			 		art.dialog.alert("发送失败！"+errorThrown);
			   	}
	      	});
		}, function () {
		    //art.dialog.tips('执行取消操作');
		});
	}
}

function submitTaskWithFile(){
	
	if(validate()){
		art.dialog.confirm('确定发送吗？', function () {
			var actNodeName = $("#nextRouter option:selected").text();
			$("#actNodeName").val(actNodeName);
			$("#taskForm").form("submit",{
				url:path+'/workflow/work-flow!doSubmitTask.action',
				data:{
					isHavingFile:isHavingFile
				},
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h3>正在发送中，请稍等...</h3></div>",
						fadeIn: 700,
						centerY: true,
						showOverlay: true
					});	
					return true;
				},
				success:function(data){
					data=eval('('+data+')');
					jQuery.unblockUI();
					if(data.code=='OK') {
						art.dialog({
				   			title: '提示',
				   		    content: data.msg,
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	location.href = path+"/workflow/workorder/activityApproval/processApprove/processApprove.jsp";
				   		    }
				   		});
					}else {
						art.dialog.alert(data.msg);
					}
					return false;
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
			 		art.dialog.alert("发送失败！"+errorThrown);
			   	}
	      	});
		}, function () {
		    //art.dialog.tips('执行取消操作');
		});
	}
}

function validate(){
	var flag = true ;
	var nextRouter = $("#nextRouter").val();
	if(!isNotBlank(nextRouter)){
		alert("下一环节不能为空！");
		return false;
	}
	if(isNeedApprover) {
		if(!isNotBlank($("#nextDealer").val())){
			alert("请选择下一步处理人！");
			flag = false;
		}
	}
	return flag; 
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}