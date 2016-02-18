$(function() {
	var hr_id=art.dialog.data('hr_id');
	var chooseMonth=art.dialog.data('chooseMonth');
	var hq_chan_code=art.dialog.data('hq_chan_code');
	$("#hr_id").val(hr_id);
	$("#chooseMonth").val(chooseMonth);
	$("#hq_chan_code").val(hq_chan_code);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/magPerson_update.action';
		$('#update').form('submit',{
			url:url,
			onSubmit:function(){
				return $(this).form('validate');
			},
			success:function(r){
				//var d = $.parseJSON(r);
				if(r=='营业厅编码错误'){
					alert(r);
				}else{
					art.dialog({
			   			title: '提示',
			   		    content: r,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    	var win = artDialog.open.origin;//来源页面
							win.art.dialog({id: 'update'}).close();
							//调用父页面的search方法，刷新列表
							win.search(0);
			   		    }
			   		});
				}
				
			}
		});
	});
});		

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

