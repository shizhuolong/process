var dealDate;

$(function(){
	$.extend($.fn.validatebox.defaults.rules, {
        money: {
          validator: function (value, param) {
          	if(isNaN(value)){
          		return false;
          	}
          	if(value<=0){
          		return false;
          	}
          	if(value&&value.indexOf(".")!=-1){
          		if(value.substring(value.indexOf(".")).length>3){
          			return false;
          		}
          	}
            return true;
          },
          message: '请输入正数，最多两位小数'
        },
        chanCode: {
            validator: function (value, param) {
        		var r=false;
	        	$.ajax({
	        		type:"POST",
	        		dataType:'json',
	        		async:false,
	        		cache:false,
	        		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!checkCode.action",
	        		data:{
	                   "params.hqChanCode":value
	        	   	}, 
	        	   	success:function(data){
	        	   		if(data&&data["GROUP_ID_4_NAME"]){
	        	   			r=true;
	        	   			$("#hqChanName").val(data["GROUP_ID_4_NAME"]);
	        	   		}
	        	   	}
	        	});
	        	return r;
            },
            message: '渠道编码不存在'
          }
       }
     );
});
$(function() {
	dealDate=art.dialog.data('dealDate');
	
	$("#hqChanCode").val(art.dialog.data('hqChanCode'));
	$("#hqChanName").val(art.dialog.data('hqChanName'));
	$("#dealDateNum").val(art.dialog.data('dealDateNum'));
	$("#money").val(art.dialog.data('money'));
	$("#workNo").val(art.dialog.data('workNo'));
	//关闭dailog
	$("#cancelBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		if(!$("#add").form('validate')){
			return;
		}
		$.ajax({
    		type:"POST",
    		dataType:'json',
    		cache:false,
    		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!updateSubsidy.action",
    		data:{
               "params.dealDate":dealDate,
               "params.hqChanCode":$("#hqChanCode").val(),
               "params.hqChanName":$("#hqChanName").val(),
               "params.workNo":$("#workNo").val(),
               "params.money":$("#money").val(),
               "params.dealDateNum":$("#dealDateNum").val()
    	   	}, 
    	   	success:function(data){
    	   		if(data&&data.ok){
    	   			alert("修改成功");
    	   			var win = artDialog.open.origin;
    	   			win.art.dialog({id: 'update'}).close();
    	   			win.search(0);
    	   		}else{
    	   			alert("修改失败");
    	   		}
    	   	}
    	});
	});
});