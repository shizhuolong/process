$(document).ready(function(){
	
	getIndexInfoList();
	getSubordinateAreas();
	
	// 表单验证框架提示配置
	$('#justValidateFrom').validationEngine('attach', { 
	    //promptPosition: 'centerRight',
		validationEventTriggers:"keyup blur",
	    scroll: false,
	    maxErrorsPerField:1
	}); 
	
	$("#selectIndexBtn").click(function(){
		
		art.dialog({
			id:"indexInfoDialog",
			title:"选择指标",
			lock:true,
			width:600,
			height:200,
			content:document.getElementById("indexDialog")
		}).show();
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

//获取指标信息
function getIndexInfoList() {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        async:false,
        url:path+"/taskManagement/common_qryIndexInfoList.action",
	    data:{
	    	code1:code1
		},
        success:function(data){
            if(isNotBlank(data)) {
            	var htmlStr = '';
            	for(var i=0;i<data.length;i++) {
            		htmlStr += '<tr>';
            		if(data[i].CODE_2=="totalscore"&&data[i].CODE_1=="score"){
	            		htmlStr += '<td style="text-align:center;"><input readonly="readonly" checked type="checkbox" onclick="return false;" name="selectIndexCheckbox" value="'+data[i].ID+'" '
	            			+' indexType="'+data[i].NAME_1+'" indexName="'+data[i].NAME_2+'" indexUnit="'+data[i].UNIT+'"/></td>';
            		}else{
            			htmlStr += '<td style="text-align:center;"><input type="checkbox" name="selectIndexCheckbox" value="'+data[i].ID+'" '
            			+' indexType="'+data[i].NAME_1+'" indexName="'+data[i].NAME_2+'" indexUnit="'+data[i].UNIT+'"/></td>';
            		}
            		htmlStr += '<td style="text-align:center;">'+data[i].NAME_1+'</td>';
            		htmlStr += '<td style="text-align:center;">'+data[i].NAME_2+'</td>';
            		htmlStr += '</tr>';
            	}
            	$("#indexDataBody").html(htmlStr);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载数据失败！");
	    }
	});
}

var areaCodeArr = null;
var areaNameArr = null;
//获取下级区域信息
function getSubordinateAreas() {
	
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        async:false,
        url:path+"/taskManagement/common_qrySubordinateAreas.action",
	    data:{
	    	code1:regionCode
		},
        success:function(data){
            if(isNotBlank(data)) {
            	areaCodeArr = new Array();
            	areaNameArr = new Array();
            	for(var i=0,len=data.length;i<len;i++) {
            		areaCodeArr.push(data[i].CODE);
            		areaNameArr.push(data[i].ORGNAME);
            	}
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   art.dialog.alert("加载下级区域信息失败！");
	    }
	});
}

//指标全选
function selectIndexAll(){
	if ($("#selectIndexAll").attr("checked")) {
		$("input[name='selectIndexCheckbox'][readonly!='readonly']").attr("checked", true);
	} else {
		$("input[name='selectIndexCheckbox'][readonly!='readonly']").attr("checked", false);
	}
}

//选择指标-取消
function cancelIndexDialog() {
	art.dialog({id:"indexInfoDialog"}).close();
}

//选择指标-确认
function selectIndex() {
	
	if($("input[name='selectIndexCheckbox']:checked").length==0) {
		art.dialog.alert("请选择指标！");
		return;
	}
	var indexNameArr = new Array();
	var indexUnitArr = new Array();
	var indexTypeArr = new Array();
	var indexIdArr = new Array();
	$("input[name='selectIndexCheckbox']:checked").each(function(){
		indexNameArr.push($(this).attr("indexName"));
		indexUnitArr.push($(this).attr("indexUnit"));
		indexTypeArr.push($(this).attr("indexType"));
		indexIdArr.push($(this).val());
	});
	renderTable(indexNameArr,indexUnitArr,indexTypeArr,indexIdArr);
}

//渲染表格
function renderTable(indexNameArr,indexUnitArr,indexTypeArr,indexIdArr) {
	if(areaCodeArr == null) {
		art.dialog.alert("获取下级排产区域信息失败！");
		return;
	}
	var indexLength = indexNameArr.length;
	var htmlStr = '';
	for(var i=0,len=areaNameArr.length;i<len;i++) {
		htmlStr += '<tbody>';
		for(var j=0;j<indexLength;j++) {
			if(j == 0) {
				if(indexIdArr[j] == "20" || indexIdArr[j] == "21" || indexIdArr[j] == "22" || indexIdArr[j] == "24") {
					htmlStr += '<tr indexId="'+indexIdArr[j]+'"><td rowspan="'+indexLength+'" name="regionName" regionCode="'+areaCodeArr[i]+'">'+areaNameArr[i]+'</td><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
					+'<td>'+indexTypeArr[j]+'</td><td><input type="text" indexId="'+indexIdArr[j]+'" name="indexValue" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveInteger]" value="0"/></td></tr>';
				} else {
					htmlStr += '<tr indexId="'+indexIdArr[j]+'"><td rowspan="'+indexLength+'" name="regionName" regionCode="'+areaCodeArr[i]+'">'+areaNameArr[i]+'</td><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
						+'<td>'+indexTypeArr[j]+'</td><td><input type="text" indexId="'+indexIdArr[j]+'" name="indexValue" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveNoneroNumber]" value="0"/></td></tr>';
				}
			}else{
				if(indexIdArr[j] == "20" || indexIdArr[j] == "21" || indexIdArr[j] == "22" || indexIdArr[j] == "24") {
					htmlStr += '<tr indexId="'+indexIdArr[j]+'"><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
					+'<td>'+indexTypeArr[j]+'</td><td><input type="text" name="indexValue" indexId="'+indexIdArr[j]+'" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveInteger]" value="0"/></td></tr>';
				} else {
					htmlStr += '<tr indexId="'+indexIdArr[j]+'"><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
					+'<td>'+indexTypeArr[j]+'</td><td><input type="text" name="indexValue" indexId="'+indexIdArr[j]+'" onkeyup="calSumIndexValue(this)" class="validate[required] custom[positiveNoneroNumber]" value="0"/></td></tr>';
				}
			}
		}
		htmlStr += '</tbody>';
	}
	//汇总区域
	var sumStr = '';
	for(var j=0;j<indexLength;j++) {
		if(j == 0) {
			sumStr += '<tr indexId="'+indexIdArr[j]+'"><td rowspan="'+indexLength+'">'+regionName+'</td><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
				+'<td>'+indexTypeArr[j]+'</td><td name="indexValue" indexId="'+indexIdArr[j]+'">0</td></tr>';
		}else{
			sumStr += '<tr indexId="'+indexIdArr[j]+'"><td>'+indexNameArr[j]+'</td><td>'+indexUnitArr[j]+'</td>'
			+'<td>'+indexTypeArr[j]+'</td><td name="indexValue" indexId="'+indexIdArr[j]+'">0</td></tr>';
		}
	}
	$("#subordinateAreaDataTable").find("tbody").remove();
	$("#subordinateAreaDataTable").append(htmlStr);
	$("#sumDataBoby").html(sumStr);
	art.dialog({id:"indexInfoDialog"}).close();
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


//提交保存
function doSubmit() {
	
	var result = $("#justValidateFrom").validationEngine("validate");
	var result1 = $("#addSaleScheduleForm").validationEngine("validate");
	if(result && result1) {
		var dateType = $("#dateType").val();
		var dateValue = $("#dateValue").val();
		
		var sumTaskInfo = '{taskInfo:[{"dateType":"'+dateType+'","dateDesc":"'+dateValue+'","dateValue":"'+dateValue+'","regionCode":"'+regionCode+'","regionName":"'+regionName+'","regionType":"'+orgLevel+'",';
		var sumTaskDetailStr = '[';
		$("#sumDataBoby").find("tr").each(function(i){
			var $tr = $(this);
			sumTaskDetailStr += '{"targetId":"'+$tr.attr("indexId")+'",';
			sumTaskDetailStr += '"targetValue":"'+$tr.find("td[name='indexValue']").text()+'"},';
			
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
					taskInfo +='"regionName":"'+$tr.find("td[name='regionName']").text()+'",';
					
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
		if($("#sumDataBoby").find("tr").length == 0) {
			art.dialog.alert("请选择指标！");
			return;
		}
		
		art.dialog.confirm('确定提交吗？', function () {
			$("#workTitle").val($("#theme").val());
			jQuery.blockUI({
				message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
				fadeIn: 700,
				centerY: true,
				showOverlay: true
			});
			$('#addSaleScheduleForm').form('submit', {
			    url:path+"/taskManagement/saleSchedule_addTask.action",
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
				   		    	window.location.href = path+"/taskManagement/saleschedule/jsp/saleschedule_add.jsp";
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

//添加附件
function addFile(){
	$("#filetd").append("<span><br/><input type='file' name='myFile' size='80%'><img alt='' src='/portal/images/delete.png' onclick='delFile(this)'/></span>");
}
function delFile(element){
	$(element).parent().remove();
}	

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}