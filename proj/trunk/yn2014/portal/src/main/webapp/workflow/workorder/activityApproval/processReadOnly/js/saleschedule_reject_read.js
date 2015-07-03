$(document).ready(function(){
	
	var workNo = $("#workNo").val();
	//qrySumTaskData(workNo);
	qrySubordinateTaskData(workNo);
});


function qrySumTaskData(taskId) {
	
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
	            		htmlStr += '<tr><td rowspan="'+data.taskDetailList.length+'">'+data.regionName+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
	        				+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td>'+data.taskDetailList[j].targetValue+'</td></tr>';
	        		}else{
	        			htmlStr += '<tr><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
	        			+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td>'+data.taskDetailList[j].targetValue+'</td></tr>';
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

function qrySubordinateTaskData(workNo) {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qrySubordinateTaskData.action",
	    data:{
	    	workNo:workNo
		},
        success:function(resultData){
           if(isNotBlank(resultData)) {
            	var htmlStr = '';
            	for(var i=0,len=resultData.length;i<len;i++) {
            		var data = resultData[i];
            		if(i==0){
            			if(data.dateType=='2') {
                    		dateTypeDesc = '季度';
                    	}else if(data.dateType=='3'){
                    		dateTypeDesc = '月份';
                    	}
                    	$("#dateType").html(dateTypeDesc);
                    	$("#dateValue").val(data.dateValue);
            		}
	            	for(var j=0;j<data.taskDetailList.length;j++) {
		            	if(j == 0) {
		            		htmlStr += '<tr><td rowspan="'+data.taskDetailList.length+'">'+data.regionName+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
		        				+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td>'+data.taskDetailList[j].targetValue+'</td></tr>';
		        		}else{
		        			htmlStr += '<tr><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
		        			+'<td>'+data.taskDetailList[j].indexTargetBean.name1+'</td><td>'+data.taskDetailList[j].targetValue+'</td></tr>';
		        		}
	            	}
            	}
            	$("#subordinateDataBoby").html(htmlStr);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载下级任务信息失败！");
	    }
	});
}