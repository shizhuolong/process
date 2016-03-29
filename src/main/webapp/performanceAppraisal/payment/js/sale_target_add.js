var pageSize = 5;
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'addSaleTarget'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/saleTargetConfig_saveTarget.action';
		$('#addSaleTargetForm').form('submit',{
			url:url,
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				var itemcode = $.trim($("#itemcode").val());
				var itemdesc = $.trim($("#itemdesc").val());
				var result = "";
				$.ajax({
			        type: "POST",
			        dataType:"joson",
			        async:false,
			        cache:false,
			        url:$("#ctx").val()+'/assessment/saleTargetConfig_validSaleTarget.action',
			        data:{itemcode:itemcode,itemdesc:itemdesc},
			        success:function(r){
			        	if(r.msg == '0'){
			            }else {
			            	result = r.msg;
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
				var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: d,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'addSaleTarget'}).close();
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

