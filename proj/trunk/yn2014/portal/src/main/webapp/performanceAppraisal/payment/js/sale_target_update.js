var pageSize = 5;
var sourcecode = "";
$(function() {
	sourcecode = art.dialog.data('sourcecode');
	loadData();
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'updateSaleTarget'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/saleTargetConfig_updateTarget.action';
		$('#updateSaleTargetForm').form('submit',{
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
			        async:false,
			        cache:false,
			        dataType:"json",
			        url:$("#ctx").val()+'/assessment/saleTargetConfig_validUpdateSaleTarget.action',
			        data:{itemcode:itemcode,itemdesc:itemdesc,sourcecode:sourcecode},
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
						win.art.dialog({id: 'updateSaleTarget'}).close();
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

function loadData() {
	$.ajax({
        type: "POST",
        async:true,
        cache:false,
        url:$("#ctx").val()+'/assessment/saleTargetConfig_loadTarget.action',
        data:{sourcecode:sourcecode},
        success:function(data){
        	var r = $.parseJSON(data);
        	$("#itemcode").val(r[0].ITEMCODE);
        	$("#itemdesc").val(r[0].ITEMDESC);
        	$("#busitype").val(r[0].BUSITYPE);
        	$("#busidesc").val(r[0].BUSIDESC);
        	$("#cre").numberbox('setValue', r[0].CRE);
        	$("#money").numberbox('setValue', r[0].MONEY);
        	$("#sourcecode").val(r[0].SOURCECODE);
        	$("#state").combobox('setValue',r[0].STATE);
        }
    });
}

