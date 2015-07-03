$(document).ready(function(){
	
	qrySumTaskData();
	
	
	// 表单验证框架提示配置
	$('#justValidateFrom').validationEngine('attach', { 
	    //promptPosition: 'centerRight', 
	    scroll: false,
	    maxErrorsPerField:1
	}); 
	
	//查询部门领导
	$.ajax({
		  type:"POST",
	      dataType:'json',cache:false,async:true,
	      url:path+"/approver/approver-handler!qryMyDepartLeader.action",
	      data:{}, 
		   success:function(data){
				var str = "";
			   $.each(data,function(i,n){
				   str += "<option value='"+n.USER_ID+"'>"+n.USER_NAME+"</option>";
			   });
			   $("#nextDealer").html(str);
		 }
	 });
});

//总任务
function qrySumTaskData() {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qryTaskById.action",
	    data:{
	    	taskId:taskId
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
            	
            	qrySubordinateTaskData();
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载任务汇总信息失败！");
	    }
	});
}


//下级任务分解
function qrySubordinateTaskData() {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qryRejectTaskByParentTaskId.action",
	    data:{
	    	parentTaskId:taskId
		},
        success:function(resultData){
           if(isNotBlank(resultData)) {
            	var htmlStr = '';
            	for(var i=0,len=resultData.length;i<len;i++) {
            		htmlStr += '<tbody>';
            		var data = resultData[i];
	            	for(var j=0;j<data.taskDetailList.length;j++) {
		            	if(j == 0) {
		            		htmlStr += '<tr taskId="'+data.id+'" detailId="'+data.taskDetailList[j].id+'" indexId="'+data.taskDetailList[j].targetId+'"><td rowspan="'+data.taskDetailList.length+'" name="regionName" regionCode="'+data.regionCode+'">'+data.regionName+'</td><td rowspan="'+data.taskDetailList.length+'">'+getStatusName(parseInt(data.status))+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
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
		   art.dialog.alert("加载任务信息失败！");
	    }
	});
}

//计算总任务汇总值
function calSumIndexValue(element) {
	
	var indexId = $(element).attr("indexId");
	var sum = 0;
	var lastSum = 0;
	$('#subordinateAreaDataTable').find('input[indexId="'+indexId+'"]').each(function(){
		var val = $(this).val();
		if(isNotBlank($.trim(val))) {
			//sum += parseInt(val);
			sum += parseFloat(val);
		}
		
		var lastVal = $(this).attr("lastValue");
		if(isNotBlank($.trim(lastVal))) {
			lastSum += parseFloat(lastVal);
		}
	});
	if((sum+"").indexOf(".")!=-1) {
		sum = sum.toFixed(2);
	}
	if((lastSum+"").indexOf(".")!=-1) {
		lastSum = lastSum.toFixed(2);
	}
	var $sumTd = $('#sumDataBoby').find('td[indexId="'+indexId+'"]');
	var oldValue = $sumTd.attr("lastValue");
	var newValue = parseFloat(oldValue) - parseFloat(lastSum) + parseFloat(sum);
	if((newValue+"").indexOf(".")!=-1) {
		newValue = newValue.toFixed(2);
	}
	$sumTd.html(newValue);
}

//提交保存
function doSubmit() {
	
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
			
			taskInfo += '{"dateType":"'+dateType+'","dateDesc":"'+dateValue+'","dateValue":"'+dateValue+'","regionType":"'+(orgLevel+1)+'",';
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
		
		art.dialog.confirm('确定提交吗？', function () {
			jQuery.blockUI({
				message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
				fadeIn: 700,
				centerY: true,
				showOverlay: true
			});
			$("#workTitle").val($("#theme").val());
			$('#addSaleScheduleForm').form('submit', {
			    url:path+"/taskManagement/saleSchedule_editRejectTask.action",
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
				   		    	window.location.href = path+"/taskManagement/saleschedule/jsp/my_saleschedule.jsp";
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


function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}
