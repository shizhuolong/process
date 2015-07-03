$(document).ready(function(){
	
	qrySumTaskData();
});


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
            	qrySubordinateTaskData(parentTaskId);
            	getAttachment(data.workNo);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载任务汇总信息失败！");
	    }
	});
}

function qrySubordinateTaskData(parentTaskId) {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskManagement/saleSchedule_qrySubordinateTaskData.action",
	    data:{
	    	parentTaskId:parentTaskId
		},
        success:function(resultData){
           if(isNotBlank(resultData)) {
            	var htmlStr = '';
            	for(var i=0,len=resultData.length;i<len;i++) {
            		var data = resultData[i];
	            	for(var j=0;j<data.taskDetailList.length;j++) {
		            	if(j == 0) {
		            		htmlStr += '<tr><td rowspan="'+data.taskDetailList.length+'">'+data.regionName+'</td><td rowspan="'+data.taskDetailList.length+'">'+getStatusName(parseInt(data.status))+'</td><td>'+data.taskDetailList[j].indexTargetBean.name2+'</td><td>'+data.taskDetailList[j].indexTargetBean.unit+'</td>'
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

//查询附件
function getAttachment(workNo) {
	
	if(isNotBlank(workNo)) {
		$.ajax({
			url:path+'/common/fileDocument_qryFileMsgList.action',
			data:{foreignId:workNo},
			cache : false,
			dataType : "json",
			success : function(data) {
		       var content="";	
		       content += "<tr><td align='left'>";
		       $.each(data,function(i,n){
		    	   content += "<a  href='javascript:void(0)' path='"+n.filePath+"' name='"+n.newFileName+"' onclick='javascript:downloadFile(this)'>"+n.newFileName+"</a>&nbsp;&nbsp;&nbsp;";
		      	   //if((i+1)%2==0){
		      		 content+="<br><br>";
		      	   //}
		       });	
		       content+="</td></tr>";
		       //if(data.length==0)content="<tr><td>暂无附件信息</td></tr>";
		       $("#attachment_Info").html(content);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
			   art.dialog.alert("加载附件信息失败！");
		    }
		 });
	}
}

//下载附件
function downloadFile(element) {
	var filepath = $.trim($(element).attr("path"));
	var filename = $(element).attr("name");
	filepath = encodeURI(encodeURI(filepath));
	filename = encodeURI(encodeURI(filename));
	window.location.href=path+"/common/download_download.action?fileName="+filename+"&filePath="+filepath;
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}