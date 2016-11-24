$(function(){
	findNextDealer("unsupported",'3')
	$("#submitTask").click(function(){
		createWorkOrder();
	});
});

function createWorkOrder(){
	var title=$("#title").val();
	var content=$("#content").val();
	art.dialog.confirm("您确定提交审批吗？",function(){
		$("#form").form("submit",{
			url:$("#ctx").val()+'/test/test!createWorkOrder.action',
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
				if(data.ok==true) {
					art.dialog({
			   			title: '提示',
			   		    content: "提交成功！",
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    }
			   		});
				}else{
					art.dialog({
			   			title: '提示',
			   		    content: data.msg,
			   		    icon: 'error',
			   		    lock: true,
			   		    ok: function () {
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

function findNextDealer(taskId,taskFlag) {
	
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = $("#ctx").val()+"/approver/approver-handler!qryMyDepartLeader.action";
	}else {
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
