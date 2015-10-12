$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/businessHallPerson_save.action';
		$('#add').form('submit',{
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
			        url:$("#ctx").val()+"/channelManagement/businessHallPerson_checkIsExist.action",
			        data:{
			        	"user_code":user_code,
			        	"hr_id":hr_id,
			        	"code":code
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
				//var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: r,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'add'}).close();
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

