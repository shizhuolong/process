$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'bindDialog'}).close();
	});
	$("#id").val(art.dialog.data('id'));
	$("#hq_chan_code").val(art.dialog.data('hq_chan_code'));
	$("#hq_chan_name").val(art.dialog.data('hq_chan_name'));
	$("#userId").val(art.dialog.data('userId'));
	$("#accout").val(art.dialog.data('accout'));
	$("#name").val(art.dialog.data('name'));
	$("#phone").val(art.dialog.data('phone'));
	var group_id_1=art.dialog.data('group_id_1');
	var unit_id=art.dialog.data('unit_id');
	
	$("#hq_chan_code").change(function(){
		var hq_chan_code=$(this).val();
		var sql="SELECT HQ_CHAN_NAME,USERID,NAME,ACCOUNT,PHONE FROM PORTAL.TAB_PORTAL_MOB_PERSON WHERE" +
				" HQ_CHAN_CODE='"+hq_chan_code+"' AND DEAL_DATE=TO_CHAR(SYSDATE,'YYYYMM')" +
				" AND HR_ID IS NOT NULL AND UNIT_ID='"+unit_id+"'";
		var r=query(sql);
        if(r&&r.length==1){
    	    $("#hq_chan_name").val(r[0].HQ_CHAN_NAME);
    	    $("#userId").val(r[0].USERID);
    	    $("#name").val(r[0].NAME);
    	    $("#accout").val(r[0].ACCOUNT);
    	    $("#phone").val(r[0].PHONE);
        }else{
        	$("#hq_chan_name").val("");
        	$("#userId").val("");
        	$("#name").val("");
        	$("#accout").val("");
        	$("#phone").val("");
        	alert("渠道编码错误！");
        }
	});

	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/chnlPerson_bind.action';
		var phone=$("#phone").val();
		if($.trim($("#phone").val())==""){//防止无操作，easyui验证通过直接提交
			return;
		}
		$('#bind').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
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
						win.art.dialog({id: 'bindDialog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

