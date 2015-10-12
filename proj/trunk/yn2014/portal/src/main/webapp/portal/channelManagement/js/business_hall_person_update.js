$(function() {
	var hr_id=art.dialog.data('hr_id');
	var user_code=art.dialog.data('user_code');
	var old_user_code=art.dialog.data('user_code');
	var regionCode=art.dialog.data('regionCode');
	var name=art.dialog.data('name');
	var unit_name=art.dialog.data('unit_name');
	$("#name").val(name);
	$("#user_code").val(user_code);
	$("#old_user_code").val(old_user_code);
	$("#hr_id").val(hr_id);
	$("#unit_name").val(unit_name);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/businessHallPerson_update.action';
		$('#update').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				var user_code = $.trim($("#user_code").val());
				var code=$("#code").val();
				var hr_id=$.trim($("#hr_id").val());
				var result = "";
			    $.ajax({
				        type: "POST",
				        dataType:"json",
				        async:false,
				        cache:false,
				        url:$("#ctx").val()+"/channelManagement/businessHallPerson_checkIsExistForUpdate.action",
				        data:{
				        	"hr_id":hr_id
				        },
				        success:function(r){
				        	if(r.message=="ok"){
				        		
				        	}else {
				            	result = r.message;
				            }
				        }
				 });
				if(result != "") {
					art.dialog.alert(result);
					return false;
				}
				return true;
			},
			success:function(r){
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
		});
	});
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

