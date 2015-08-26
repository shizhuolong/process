$(function() {
	var group_id_1 = art.dialog.data('group_id_1');
	var group_id_1_name = art.dialog.data('group_id_1_name');
	var ratio = art.dialog.data('ratio');
	$("#group_id_1").val(group_id_1);
	$("#group_id_1_name").html(group_id_1_name);
	$("#ratio").val(ratio);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/zzxRatioConfig_update.action';
		$('#updateForm').form('submit',{
			url:url,
			onSubmit:function(){
				var ratio=$.trim($("#ratio").val());
				var f=true;
				if(parseFloat(ratio)>1){
					f=false;
					alert("系数必须小于1");
				}
				return $(this).form('validate')&&f;
			},
			success:function(r){
				//var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: r,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'update'}).close();
						//调用父页面的search方法，刷新列表
						win.search();
		   		    }
		   		});
			}
		});
	});
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}


