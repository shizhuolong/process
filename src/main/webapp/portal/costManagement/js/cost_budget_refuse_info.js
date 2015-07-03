$(function() {
	var id = art.dialog.data('id');
	loadData(id);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'refuseInfoDailog'}).close();

	});
});

function loadData(id) {
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/importCostBudget/import-cost-budget!getRrefuseInfo.action",
		data:{
			"id":id
	   	}, 
	   	success:function(data){
	   		$("#deal_date").html(data[0].DEAL_DATE);
	   		$("#group_id_1_name").html(data[0].GROUP_ID_1_NAME);
	   		$("#unit_name").html(data[0].UNIT_NAME);
	   		$("#refuseReason").html(data[0].REMARK);
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

