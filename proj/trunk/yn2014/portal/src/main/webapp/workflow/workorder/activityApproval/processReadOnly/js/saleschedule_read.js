$(document).ready(function(){
	
	var workNo = $("#workNo").val();
	qrySumTaskData(workNo);
	
	getAttachment(workNo);
});


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
            		var data = resultData[i];
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

//查询附件
function getAttachment(workNo) {
	
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

//下载附件
function downloadFile(element) {
	var filepath = $.trim($(element).attr("path"));
	var filename = $(element).attr("name");
	filepath = encodeURI(encodeURI(filepath));
	filename = encodeURI(encodeURI(filename));
	window.location.href=path+"/common/download_download.action?fileName="+filename+"&filePath="+filepath;
}