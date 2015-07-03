$(document).ready(function(){
	
	var workNo = $("#workNo").val();
	qrySumTaskData(workNo);
	
	getAttachment(workNo);
	
	// 表单验证框架提示配置
	$('#justValidateFrom').validationEngine('attach', { 
	    //promptPosition: 'centerRight', 
	    scroll: false,
	    maxErrorsPerField:1
	}); 
});

//总任务
function qrySumTaskData(workNo) {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qrySumTaskData.action",
	    data:{
	    	workNo:workNo
		},
        success:function(data){
           if(isNotBlank(data)) {
            	var htmlStr = '';
            	for(var j=0;j<data.taskDetailList.length;j++) {
	            	if(j == 0) {
	            		htmlStr += '<tr taskId="'+data.id+'" detailId="'+data.taskDetailList[j].id+'" indexId="'+data.taskDetailList[j].targetId+'"><td rowspan="'+data.taskDetailList.length+'">'+data.regionName+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
	        				+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td name="indexValue" lastValue="'+data.taskDetailList[j].targetValue+'" indexId="'+data.taskDetailList[j].targetId+'">'+data.taskDetailList[j].targetValue+'</td></tr>';
	        		}else{
	        			htmlStr += '<tr detailId="'+data.taskDetailList[j].id+'" indexId="'+data.taskDetailList[j].targetId+'"><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
	        			+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td name="indexValue" lastValue="'+data.taskDetailList[j].targetValue+'" indexId="'+data.taskDetailList[j].targetId+'">'+data.taskDetailList[j].targetValue+'</td></tr>';
	        		}
            	}
            	$("#sumDataBoby").html(htmlStr);
            	if(data.dateType=='2') {
            		dateTypeDesc = '季度';
            	}else if(data.dateType=='3'){
            		dateTypeDesc = '月份';
            	}
            	$("#dateType").html(dateTypeDesc);
            	$("#dateValue").val(data.dateValue);
            	var parentTaskId = data.id;
            	qrySubordinateTaskData(workNo,parentTaskId);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载任务汇总信息失败！");
	    }
	});
}
//下级任务分解
function qrySubordinateTaskData(workNo,parentTaskId) {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qrySubordinateTaskData.action",
	    data:{
	    	workNo:workNo,
	    	parentTaskId:parentTaskId
		},
        success:function(resultData){
           if(isNotBlank(resultData)) {
            	var htmlStr = '';
            	for(var i=0,len=resultData.length;i<len;i++) {
            		htmlStr += '<tbody>';
            		var data = resultData[i];
	            	for(var j=0;j<data.taskDetailList.length;j++) {
		            	if(j == 0) {
		            		htmlStr += '<tr taskId="'+data.id+'" detailId="'+data.taskDetailList[j].id+'" indexId="'+data.taskDetailList[j].targetId+'"><td rowspan="'+data.taskDetailList.length+'" name="regionName" regionCode="'+data.regionCode+'">'+data.regionName+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
		        				+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td><input type="text" lastValue="'+data.taskDetailList[j].targetValue+'" value="'+data.taskDetailList[j].targetValue+'" name="indexValue" indexId="'+data.taskDetailList[j].targetId+'" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveNumber]" /></td></tr>';
		        		}else{
		        			htmlStr += '<tr detailId="'+data.taskDetailList[j].id+'" indexId="'+data.taskDetailList[j].targetId+'"><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
		        			+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td><input type="text" lastValue="'+data.taskDetailList[j].targetValue+'" value="'+data.taskDetailList[j].targetValue+'" name="indexValue" indexId="'+data.taskDetailList[j].targetId+'" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveNumber]" /></td></tr>';
		        		}
	            	}
	            	htmlStr += '</tbody>';
            	}
            	$("#subordinateAreaDataTable").append(htmlStr);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载下级任务信息失败！");
	    }
	});
}
//计算总任务汇总值
function calSumIndexValue(element) {
	
	var indexId = $(element).attr("indexId");
	var sum = 0;
	$('#subordinateAreaDataTable').find('input[indexId="'+indexId+'"]').each(function(){
		var val = $(this).val();
		if(isNotBlank($.trim(val))) {
			//sum += parseInt(val);
			sum += parseFloat(val);
		}
	});
	if((sum+"").indexOf(".")!=-1) {
		sum = sum.toFixed(2);
	}
	$('#sumDataBoby').find('td[indexId="'+indexId+'"]').html(sum);
}

//提交保存
function doEdit() {
	
	var result = $("#justValidateFrom").validationEngine("validate");
	if(result) {
		var dateType = $("#dateType").text();
		var dateValue = $("#dateValue").val();
		
		var sumTaskInfo = '{taskInfo:[{"dateType":"'+dateType+'","dateDesc":"'+dateValue+'","dateValue":"'+dateValue+'",';
		var sumTaskDetailStr = '[';
		$("#sumDataBoby").find("tr").each(function(i){
			var $tr = $(this);
			if(i==0) {
				sumTaskInfo += '"id":"'+$tr.attr("taskId")+'",';
			}
			sumTaskDetailStr += '{"targetId":"'+$tr.attr("indexId")+'","id":"'+$tr.attr("detailId")+'",';
			sumTaskDetailStr += '"targetValue":"'+$tr.find("td[name='indexValue']").text()+'","lastValue":"'+$tr.find("td[name='indexValue']").attr("lastValue")+'"},';
			
		});
		sumTaskDetailStr = sumTaskDetailStr.substring(0,sumTaskDetailStr.lastIndexOf(","));
		sumTaskInfo += '"taskDetails":'+sumTaskDetailStr+']';
		sumTaskInfo += '}]}';
		$("#sumTaskInfoJsonStr").val(sumTaskInfo);
			
		var taskInfo = '{taskInfo:[';
		$("#subordinateAreaDataTable").find("tbody").each(function(i){
			
			taskInfo += '{"dateType":"'+dateType+'","dateDesc":"'+dateValue+'","dateValue":"'+dateValue+'",';
			var taskDetailStr = '[';
			$(this).find("tr").each(function(j){
				var $tr = $(this);
				if(j==0) {
					taskInfo +='"regionCode":"'+$tr.find("td[name='regionName']").attr("regionCode")+'",';
					taskInfo +='"regionName":"'+$tr.find("td[name='regionName']").text()+'","id":"'+$tr.attr("taskId")+'",';
					
					taskDetailStr += '{"targetId":"'+$tr.attr("indexId")+'","id":"'+$tr.attr("detailId")+'",';
					taskDetailStr += '"targetValue":"'+$tr.find("input[name='indexValue']").val()+'","lastValue":"'+$tr.find("input[name='indexValue']").attr("lastValue")+'"}';
				}else {
					taskDetailStr += ',{"targetId":"'+$tr.attr("indexId")+'","id":"'+$tr.attr("detailId")+'",';
					taskDetailStr += '"targetValue":"'+$tr.find("input[name='indexValue']").val()+'","lastValue":"'+$tr.find("input[name='indexValue']").attr("lastValue")+'"}';
				}
			});
			taskInfo += '"taskDetails":'+taskDetailStr+']';
			taskInfo += '},'
		});
		taskInfo = taskInfo.substring(0,taskInfo.lastIndexOf(","));
		taskInfo += "]}";
		$("#taskInfoJsonStr").val(taskInfo);
		if($("#sumDataBoby").find("tr").length == 0) {
			art.dialog.alert("请选择指标！");
			return;
		}
		
		art.dialog.confirm('确定提交吗？', function () {
			jQuery.blockUI({
				message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
				fadeIn: 700,
				centerY: true,
				showOverlay: true
			});
			$('#addSaleScheduleForm').form('submit', {
			    url:path+"/taskManagement/saleSchedule_editTask.action",
			    success:function(data){
					jQuery.unblockUI();
					data=eval('('+data+')');
					if(data.code=='OK') {
						art.dialog({
				   			title: '提示',
				   		    content: data.msg,
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	window.location.href = path+"/workflow/workorder/activityApproval/processApprove/processApprove.jsp";
				   		    }
				   		});
					}else {
						art.dialog.alert(data.msg);
					}
		    	},
		    	error: function(XMLHttpRequest, textStatus, errorThrown) {
		    		jQuery.unblockUI();
		            art.dialog.alert("新增失败！"+errorThrown);
		        }
			});
		}, function () {
		    //art.dialog.tips('执行取消操作');
		});
	}
}

//查询附件
function getAttachment(workNo) {
	
	$.ajax({
		url:path+'/common/fileDocument_qryFileMsgList.action',
		data:{foreignId:workNo},
		cache : false,
		dataType : "json",
		success : function(data) {
	       var content="";	
	       $.each(data,function(i,n){
	    	   content += "<tr><td align='left'>";
	    	   content += "<a  href='javascript:void(0)' path='"+n.filePath+"' name='"+n.newFileName+"' onclick='javascript:downloadFile(this)'>"+n.newFileName+"</a>&nbsp;&nbsp;&nbsp;";
	    	   content += "<a href='javascript:void(0)' fileId='"+n.id+"' onclick='delAttachement(this)'>删除</a>";
	      	   //if((i+1)%2==0){
	      		 //content+="<br/><br/>";  
	      	   //}
	    	   content+="</td></tr>";
	       });	
	       //if(data.length==0)content="<tr><td>暂无附件信息</td></tr>";
	       $("#attachment_Info").html(content);
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载附件信息失败！");
	    }
	 });
}

/**删除附件**/
function delAttachement(element) {
	
	var fileId = $(element).attr("fileId");
	art.dialog.confirm('确定删除吗？', function () {
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:path+"/common/fileDocument_doDelete.action",
		    data:{
				fileId:fileId
			},
	        success:function(data){
				if(data.code == 'FAIL'){
					alert(data.msg);
				}else if(data.code == 'OK') {
					$(element).parent().parent().remove();
				}
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
	            alert(errorThrown);
	        }
		});
	}, function () {
	    //art.dialog.tips('执行取消操作');
	});
}

//下载附件
function downloadFile(element) {
	var filepath = $.trim($(element).attr("path"));
	var filename = $(element).attr("name");
	filepath = encodeURI(encodeURI(filepath));
	filename = encodeURI(encodeURI(filename));
	window.location.href=path+"/common/download_download.action?fileName="+filename+"&filePath="+filepath;
}

//添加附件
function addFile(){
	$("#filetd").append("<span><br/><input type='file' name='myFile' size='80%'><img alt='' src='/portal/images/delete.png' onclick='delFile(this)'/></span>");
}
function delFile(element){
	$(element).parent().remove();
}
