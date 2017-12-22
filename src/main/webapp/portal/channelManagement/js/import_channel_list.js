var isNeedApprover = true;
var pageSize = 10;
$(function(){
	/*if($("#orgLevel").val()!=2){
		$("#importExcel").remove();
	}*/
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	$("#importExcel").click(function(){
		importExcel();
	});
	$("#newBtn").click(function(){
		addChannel();
	});
	//查询下一步骤审批人
	/*findNextDealer("DepartmentManager","2");
	$("#submitTask").click(function(){
		submitTask();
	});*/
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/channel/import-channel!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize
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
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
                +"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
                +"<td>"+isNull(n['START_MONTH'])+"</td>"
                +"<td>"+isNull(n['END_MONTH'])+"</td>"
                +"<td>"+isNull(n['ASSESS_TARGET'])+"</td>"
                +"<td>"+isNull(n['RATE_THREE'])+"</td>"
                +"<td>"+isNull(n['RATE_SIX'])+"</td>"
                +"<td>"+isNull(n['RATE_NINE'])+"</td>"
                +"<td>"+isNull(n['RATE_TWELVE'])+"</td>"
                +"<td><a href='#' uu_id='"+isNull(n['ID'])+"' onclick='edit($(this));' style='color:#BA0C0C;'>修改</a></td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function edit(obj){
	var uu_id=$(obj).attr("uu_id");
	var formdiv=$('#updateFormDiv');
	var url = $("#ctx").val()+"/channel/import-channel!findById.action";
	$.get(url,
		  {id:uu_id},
		  function(data){
		  	 if(data!=null&&data!=""){
		  		var data=eval("("+data+")");
		  		$("#up_hq_chan_code").val(data.HQ_CHAN_CODE);
		  		$("#up_hq_chan_name").val(data.HQ_CHAN_NAME);
		  		$("#up_start_month").val(data.START_MONTH);
		  		$("#up_end_month").val(data.END_MONTH);
		  		$("#up_assess_target").val(data.ASSESS_TARGET);
		  		$("#up_rate_three").val(data.RATE_THREE);
		  		$("#up_rate_six").val(data.RATE_SIX);
		  		$("#up_rate_nine").val(data.RATE_NINE);
		  		$("#up_rate_twelve").val(data.RATE_TWELVE);
		  	 }
	      });
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 300,
		height : 400,
		closed : false,
		cache : false,
		modal : true,
		maximizable : true,
		buttons: {
	        "保存": function() {
	        	$(this).dialog("close");
	        	formdiv.hide();
	        	var url = $("#ctx").val()+"/channel/import-channel!updateChannel.action";
	        	var hq_chan_code=$.trim($("#up_hq_chan_code").val());
	        	var hq_chan_name=$.trim($("#up_hq_chan_name").val());
	        	var start_month=$.trim($("#up_start_month").val());
	        	var end_month=$.trim($("#up_end_month").val());
	        	var assess_target=$.trim($("#up_assess_target").val());
	        	var rate_three=$.trim($("#up_rate_three").val());
	        	var rate_six=$.trim($("#up_rate_six").val());
	        	var rate_nine=$.trim($("#up_rate_nine").val());
	        	var rate_twelve=$.trim($("#up_rate_twelve").val());
	        	$.post(
	        			 url,
	        			 {
	        			   hq_chan_code:hq_chan_code,
	        			   hq_chan_name:hq_chan_name,
	        			   start_month:start_month,
	        			   end_month:end_month,
	        			   assess_target:assess_target,
	        			   rate_three:rate_three,
	        			   rate_six:rate_six,
	        			   rate_nine:rate_nine,
	        			   rate_twelve:rate_twelve,
	        			   id:uu_id
	        			 },
	        			 function(data,status){
	        				var win = artDialog.open.origin;//来源页面
	        			    var data = eval(data);
	        			    if(data!=""&&null!=data){
	        			    	win.art.dialog({
	        			    		title:"修改失败",
	        			    		icon:'error',
	        			    		content:data,
	        			    		width:'100px',
	        			    		height:'200px',
	        			    		lock:true,
	        			    		ok: function () {
	        							win.art.dialog.close();
	        			   		    }
	        			    	});
	        			    }else{
	        			    	win.art.dialog({
	        			   			title: '提示',
	        			   		    content: '修改成功',
	        			   		    icon: 'succeed',
	        			   		    lock: true,
	        			   		    ok: function () {
	        			   		    	//var win = artDialog.open.origin;//来源页面
	        			   		    	win.art.dialog.close();
	        							//调用父页面的search方法，刷新列表
	        							win.search(0);
	        			   		    }
	        			   		});
	        			    }
	        			 });
	        },
	        "返回": function() {
	        	$(this).dialog("close");
	        }
	    }
	});
}

//导入excel
function importExcel() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/import_channel_excel.jsp";
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'渠道审批导入',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/channel/import-channel!downfile.action";
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: search,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
  	next_text: '下页',       //下一页按钮里text  
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

//下一步审批人
function findNextDealer(taskId,taskFlag) {
	
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = $("#ctx").val()+"/approver/approver-handler!DepartmentManager.action";
	}else {
		//查询节点上配置的人员
		url = $("#ctx").val()+"/approver/approver-handler!qryTaskApprover.action";
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
	if(validate()) {
		art.dialog.confirm("您确定提交审批吗？",function(){
			var actNodeName = $("#nextDealer option:selected").text();
			$("#actNodeName").val(actNodeName);
			$("#isHavingFile").val(isHavingFile);
			$("#taskForm").form("submit",{
				url:$("#ctx").val()+'/unsupported/unsupported!doSubmitTask.action',
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h2>正在发送中，请稍等...</h2></div>",
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
				   		    content: "提交成功！",
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	search(0);
				   		    }
				   		});
					}
					return false;
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("发送失败！"+errorThrown);
			   	}
	      	});
		},function(){
			art.dialog.tips('执行取消操作');
		});
	}
}

function validate(){
	var flag = true ;
	var nextRouter = $("#nextRouter").val();
	var theme = $.trim($("#theme").val());
	if(!isNotBlank(theme)) {
		art.dialog.alert("工单主题不能为空！");
		return false;
	}
	if(!isNotBlank(nextRouter)){
		art.dialog.alert("下一环节不能为空！");
		return false;
	}
	if(isNeedApprover) {
		if(!isNotBlank($("#nextDealer").val())){
			art.dialog.alert("请选择下一步处理人！");
			flag = false;
		}
	}
	return flag; 
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

function addChannel(){
	var addDiv=$('#addFormDiv');
	addDiv.show();
	$('#addFormDiv').dialog({
		id: 'addDialog',
		title : '添加',
		width : 300,
		height : 400,
		modal: true,
		buttons: {
	        "保存": function() {
	        	$(this).dialog("close");
	        	addDiv.hide();
	        	var url = $("#ctx").val()+"/channel/import-channel!addChannel.action";
	        	var hq_chan_code=$.trim($("#hq_chan_code").val());
	        	var hq_chan_name=$.trim($("#hq_chan_name").val());
	        	var start_month=$.trim($("#start_month").val());
	        	var end_month=$.trim($("#end_month").val());
	        	var assess_target=$.trim($("#assess_target").val());
	        	var rate_three=$.trim($("#rate_three").val());
	        	var rate_six=$.trim($("#rate_six").val());
	        	var rate_nine=$.trim($("#rate_nine").val());
	        	var rate_twelve=$.trim($("#rate_twelve").val());
	        	$.post(
	        			 url,
	        			 {
	        			   hq_chan_code:hq_chan_code,
	        			   hq_chan_name:hq_chan_name,
	        			   start_month:start_month,
	        			   end_month:end_month,
	        			   assess_target:assess_target,
	        			   rate_three:rate_three,
	        			   rate_six:rate_six,
	        			   rate_nine:rate_nine,
	        			   rate_twelve:rate_twelve
	        			 },
	        			 function(data,status){
	        				var win = artDialog.open.origin;//来源页面
	        			    var data = eval(data);
	        			    if(data!=""&&null!=data){
	        			    	win.art.dialog({
	        			    		title:"添加失败",
	        			    		icon:'error',
	        			    		content:data,
	        			    		width:'550px',
	        			    		height:'250px',
	        			    		lock:true,
	        			    		ok: function () {
	        							win.art.dialog.close();
	        			   		    }
	        			    	});
	        			    }else{
	        			    	win.art.dialog({
	        			   			title: '提示',
	        			   		    content: '添加成功',
	        			   		    icon: 'succeed',
	        			   		    lock: true,
	        			   		    ok: function () {
	        			   		    	//var win = artDialog.open.origin;//来源页面
	        			   		    	win.art.dialog.close();
	        							//调用父页面的search方法，刷新列表
	        							win.search(0);
	        			   		    }
	        			   		});
	        			    }
	        			 });
	        },
	        "返回": function() {
	          $(this).dialog("close");
	        }
		}
	});
}