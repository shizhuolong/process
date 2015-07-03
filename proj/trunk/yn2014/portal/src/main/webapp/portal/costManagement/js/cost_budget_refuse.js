var pageSize = 5;
$(function() {
	var unit_id = art.dialog.data('unit_id');
	var init_id = art.dialog.data('init_id');
	var deal_date = art.dialog.data('deal_date');
	var group_id_1_name = art.dialog.data('group_id_1_name');
	var unit_name = art.dialog.data('unit_name');
	$("#unit_id").val(unit_id);
	$("#init_id").val(init_id);
	$("#deal_date").val(deal_date);
	$("#date").html(deal_date);
	$("#group_id_1_name").html(group_id_1_name);
	$("#unit_name").html(unit_name);
	$("#saveBtn").click(function(){
		$("#refuseForm").form("submit",{
			url:$("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!refuseCostBudget.action",
			onSubmit:function(){
				return $("#refuseForm").validationEngine("validate");
			},
			success:function(data){
				art.dialog({
		   			title: '提示',
		   		    content: '操作成功！',
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
		   		    	win.art.dialog({id: 'costBudgetRefuseDialog'}).close();
		   		    	win.search(0);
		   		    }
		   		});
			},
		 	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("发送失败！"+errorThrown);
		   	}
      	});
	});
	
	$('#refuseForm').validationEngine({ 
		//提示所在的位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight 
	    promptPosition: 'topLeft', 
	    scroll: false,
	    'custom_error_messages':{
	    	'required':{
	    		'message':"拒绝原因不能空！"
	    	}
	    }
	}); 
	
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'costBudgetRefuseDialog'}).close();

	});
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

