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
        		$.fn.validatebox.defaults.rules.chanCode.message ="渠道编码不存在";
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
	        	if(r){
	        		$.ajax({
		        		type:"POST",
		        		dataType:'json',
		        		async:false,
		        		cache:false,
		        		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!existCode.action",
		        		data:{
		                   "params.hqChanCode":value,
		                   "params.dealDate":dealDate
		        	   	}, 
		        	   	success:function(data){
		        	   		if(data&&data.ok){
		        	   			r=false;
		        	   			$.fn.validatebox.defaults.rules.chanCode.message ="["+dealDate+"]账期的已经录入，不能重复录入";
		        	   		}
		        	   	}
		        	});
	        	}
	        	return r;
            },
            message: '渠道编码不存在'
          }
       }
     );
});
$(function() {
	dealDate=art.dialog.data('dealDate');
	//关闭dailog
	$("#cancelBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();

	});
	$("#saveBtn").click(function(){
		if(!$("#add").form('validate')){
			return;
		}
		$.ajax({
    		type:"POST",
    		dataType:'json',
    		cache:false,
    		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!addSubsidy.action",
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
    	   			alert("增加成功");
    	   			var win = artDialog.open.origin;
    	   			win.art.dialog({id: 'add'}).close();
    	   			win.search(0);
    	   		}else{
    	   			alert("增加失败");
    	   		}
    	   	}
    	});
	});
});
