var code = "";
var pageSize = 5;
$(function() {
	code = art.dialog.data('code');
	loadData();
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'updateSljfTarget'}).close();

	});
	$("#updateBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/sljfTargetConfig_updateTarget.action';
		$('#updateSljfTargetForm').form('submit',{
			url:url,
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				var bigbusi_desc = $.trim($("#bigbusi_desc").val());
				var result = "";
				$.ajax({
			        type: "POST",
			        async:false,
			        cache:false,
			        url:$("#ctx").val()+'/assessment/sljfTargetConfig_loadTargetByUpdateCode.action',
			        data:{bigbusi_desc:bigbusi_desc,code:code},
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
						win.art.dialog({id: 'updateSljfTarget'}).close();
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
        url:$("#ctx").val()+'/assessment/sljfTargetConfig_loadTargetByCode.action',
        data:{code:code},
        success:function(data){
        	var r = $.parseJSON(data);
        	$("#bigbusi_code").val(r[0].BIGBUSI_CODE);
        	$("#bigbusi_desc").val(r[0].BIGBUSI_DESC);
        	$("#cre").numberbox('setValue', r[0].CRE);
        	$("#money").numberbox('setValue', r[0].MONEY);
        }
    });
}

