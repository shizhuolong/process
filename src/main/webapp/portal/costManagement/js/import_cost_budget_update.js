$(function(){
	var id = art.dialog.data('id');
	var flag = art.dialog.data('flag');
	/*if(flag == 1) {
		//$('#budget_money').attr("disabled","disabled")
		$('#budget_money').numberbox('disable');
	}
	if(flag == 2) {
		//$('#zsb_rate').attr("disabled","disabled")
		$('#zsb_rate').numberbox('disable');
	}*/
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'importCostBudgetUpdateDailog'}).close();
	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+"/importCostBudget/import-cost-budget!update.action";
		$('#importUpdateForm').form('submit',{
			url:url,
			onSubmit:function(){
				return $(this).form('validate');
			},
			success:function(r){
				var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: d.msg,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'importCostBudgetUpdateDailog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
	loadData(id);
});

function loadData(id) {
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/importCostBudget/import-cost-budget!loadById.action",
		data:{
			"id":id
	   	}, 
	   	success:function(data){
	   		$("#deal_date").html(data[0].DEAL_DATE);
	   		$("#group_id_1_name").html(data[0].GROUP_ID_1_NAME);
	   		$("#unit_name").html(data[0].UNIT_NAME);
	   		$("#cost_center_code").html(data[0].COST_CENTER_CODE);
	   		$("#cost_center_name").html(data[0].COST_CENTER_NAME);
	   		$("#unit_item").html(data[0].UNIT_ITEM);
	   		$("#budget_item_code").html(data[0].BUDGET_ITEM_CODE);
	   		$("#budget_item_name").html(data[0].BUDGET_ITEM_NAME);
	   		$('#budget_money').numberbox('setValue',data[0].BUDGET_MONEY);
	   		$('#zsb_rate').numberbox('setValue',data[0].ZSB_RATE);
	   		$("#flag").html(data[0].FLAG);
	   		$("#id").val(data[0].ID);
	   		$("#f").val(data[0].F);
	   	}
	});
}