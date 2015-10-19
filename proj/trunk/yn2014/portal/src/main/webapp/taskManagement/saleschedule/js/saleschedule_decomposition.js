$(document).ready(function(){
	getUnitTask();
	
	// 表单验证框架提示配置
	$('#taskDecompositionFrom').validationEngine('attach', { 
	    //promptPosition: 'centerRight',
		validationEventTriggers:"keyup blur",
	    scroll: false,
	    maxErrorsPerField:1
	}); 
});

//获取营服中心总任务值
function getUnitTask() {
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        async:false,
        url:path+"/taskManagement/saleSchedule_qryTaskById.action",
	    data:{
	    	taskId:id
		},
        success:function(data){
        	if(isNotBlank(data)) {
        		var content = "";
        		var targetNameArr = [];
        		var targetIdArr = [];
        		var targetUnitArr = [];
        		var targetTypeArr = [];
        		$("#dateValue").val(data.dateValue);
        		$("#dateType").val(data.dateType);
        		$("#taskCode").val(data.taskCode);
        		$("#task_region_code").val(data.regionCode);
        		for(var i=0; i<data.taskDetailList.length; i++) {
        			targetNameArr.push(data.taskDetailList[i].indexTargetBean.name2);
        			targetIdArr.push(data.taskDetailList[i].indexTargetBean.id);
        			targetUnitArr.push(data.taskDetailList[i].indexTargetBean.unit);
        			targetTypeArr.push(data.taskDetailList[i].indexTargetBean.name1);
        			if(i == 0) {
        				content += "<tr flag='"+data.taskDetailList[i].indexTargetBean.flag+"'>" +
        				"<td style='text-align:center;' rowspan="+data.taskDetailList.length+">"+data.regionName+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.name2+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.unit+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.name1+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].targetValue+"</td>" +
        				"<td style='text-align:center;' indexId='"+data.taskDetailList[i].indexTargetBean.id+"'>0</td>" +
        				"</tr>";
        			} else {
        				content += "<tr flag='"+data.taskDetailList[i].indexTargetBean.flag+"'>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.name2+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.unit+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].indexTargetBean.name1+"</td>" +
        				"<td style='text-align:center;'>"+data.taskDetailList[i].targetValue+"</td>" +
        				"<td style='text-align:center;' indexId='"+data.taskDetailList[i].indexTargetBean.id+"'>0</td>" +
        				"</tr>";
        			}
        		}
        		$("#sumDataBoby").empty().append(content);
        		//加载下级地域
        		getNextRegion(targetNameArr,targetIdArr,targetUnitArr,targetTypeArr);
        	}
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("查询营服中心排产任务信息失败！");
	    }
	});
}

//查询渠道经理
function getNextRegion(targetNameArr,targetIdArr,targetUnitArr,targetTypeArr) {
	var task_region_code = $("#task_region_code").val();
	var month = $("#dateValue").val();
	if(targetIdArr.length<=0) {
		art.dialog.alert("获取下级地域信息失败！");
		return;
	} else {
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			async:false,
			url:path+"/taskManagement/common_getNextRegion.action",
			data:{
				task_region_code:task_region_code,
				month:month,
				type:"2,5,6,7",
				userType:userType
			},
			success:function(data){
				if(isNotBlank(data)) {
					var htmlStr = "";
					var indexLength = targetIdArr.length;
					for(var i=0; i<data.length; i++) {
						htmlStr += "<tbody>";
						for(var j=0; j<targetIdArr.length; j++) {
							if(j == 0) {
								if(targetIdArr[j] == "20" || targetIdArr[j] == "21" || targetIdArr[j] == "22" || targetIdArr[j] == "24") {
									htmlStr += "<tr indexId="+targetIdArr[j]+">" +
									"<td style='text-align:center;' rowspan="+indexLength+" name='regionName' regionCode='"+data[i].USERID+"' userType='"+data[i].USER_CODE+"'>"+data[i].NAME+"</td>" +
									"<td style='text-align:center;'>"+targetNameArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetUnitArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetTypeArr[j]+"</td>" +
									"<td style='text-align:center;'><input type='text' indexId="+targetIdArr[j]+" name='indexValue' onkeyup='calSumIndexValue(this)' class='validate[required] custom[positiveInteger]' value='0'></td>" +
									"</tr>";
								} else {
									htmlStr += "<tr indexId="+targetIdArr[j]+">" +
									"<td style='text-align:center;' rowspan="+indexLength+" name='regionName' regionCode='"+data[i].USERID+"' userType='"+data[i].USER_CODE+"'>"+data[i].NAME+"</td>" +
									"<td style='text-align:center;'>"+targetNameArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetUnitArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetTypeArr[j]+"</td>" +
									"<td style='text-align:center;'><input type='text' indexId="+targetIdArr[j]+" name='indexValue' onkeyup='calSumIndexValue(this)' class='validate[required] custom[positiveNoneroNumber]' value='0'></td>" +
									"</tr>";
								}
							}else{
								if(targetIdArr[j] == "20" || targetIdArr[j] == "21" || targetIdArr[j] == "22" || targetIdArr[j] == "24") {
									htmlStr += "<tr indexId="+targetIdArr[j]+">" +
									"<td style='text-align:center;'>"+targetNameArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetUnitArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetTypeArr[j]+"</td>" +
									"<td style='text-align:center;'><input type='text' indexId="+targetIdArr[j]+" name='indexValue' onkeyup='calSumIndexValue(this)' class='validate[required] custom[positiveInteger]' value='0'></td>" +
									"</tr>";
								} else {
									htmlStr += "<tr indexId="+targetIdArr[j]+">" +
									"<td style='text-align:center;'>"+targetNameArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetUnitArr[j]+"</td>" +
									"<td style='text-align:center;'>"+targetTypeArr[j]+"</td>" +
									"<td style='text-align:center;'><input type='text' indexId="+targetIdArr[j]+" name='indexValue' onkeyup='calSumIndexValue(this)' class='validate[required] custom[positiveNoneroNumber]' value='0'></td>" +
									"</tr>";
								}
							}
						}
						htmlStr += "</tbody>";
					}
					$("#subordinateAreaDataTable").find("tbody").remove();
					$("#subordinateAreaDataTable").append(htmlStr);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				art.dialog.alert("查询下级地域信息失败！");
			}
		});
	}
}

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


//保存
function doSubmit() {
	var result = $("#taskDecompositionFrom").validationEngine("validate");
	var result2 = true;
	if(result) {
		//flag=1的分解任务值时必须大于等于
		$("#sumDataBoby").find("tr").each(function(){
			var flag = $(this).attr("flag");
			if(flag == "1") {
				var total = Number($(this).find("td:eq(4)").html());
				var sum = Number($(this).find("td:eq(5)").html());
				var r = dcmSub(sum,total);
				if(r<0) {
					art.dialog.alert("已分解的发展用户数任务指标值必须大于或者等于上级下发的任务数！");
					result2 = false;
				}
			}
		});
	}
	if(result && result2) {
		var dateType = $("#dateType").val();
		var dateValue = $("#dateValue").val();
		var regionType = "";
		if(userType != "" && userType != null && userType != "null") {
			regionType = "4";
		} else {
			regionType = "10";
		}
		var taskInfo = '{taskInfo:[';
		$("#subordinateAreaDataTable").find("tbody").each(function(i){
			
			taskInfo += '{"dateType":"'+dateType+'","dateDesc":"'+dateValue+'","dateValue":"'+dateValue+'","regionType":"'+regionType+'",';
			var taskDetailStr = '[';
			$(this).find("tr").each(function(j){
				var $tr = $(this);
				if(j==0) {
					taskInfo +='"regionCode":"'+$tr.find("td[name='regionName']").attr("regionCode")+'",';
					taskInfo +='"regionName":"'+$tr.find("td[name='regionName']").text()+'",';
					var userType = $tr.find("td[name='regionName']").attr("userType");
					if(userType == null || userType == "" || userType == "undefined" || userType == undefined) {
						userType = "";
					}
					taskInfo +='"userType":"'+userType+'",';
					
					taskDetailStr += '{"targetId":"'+$tr.attr("indexId")+'",';
					taskDetailStr += '"targetValue":"'+$tr.find("input[name='indexValue']").val()+'"}';
				}else {
					taskDetailStr += ',{"targetId":"'+$tr.attr("indexId")+'",';
					taskDetailStr += '"targetValue":"'+$tr.find("input[name='indexValue']").val()+'"}';
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
			$('#taskDecompositionFrom').form('submit', {
			    url:path+"/taskManagement/saleSchedule_saveChanlManagerTask.action",
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