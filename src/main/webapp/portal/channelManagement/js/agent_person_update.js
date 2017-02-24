$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();
	});
	var deal_date=art.dialog.data('deal_date');//隐藏
	$("#deal_date").val(deal_date);
	$("#hq_chan_code").val(art.dialog.data('hq_chan_code'));
	$("#hq_chan_name").val(art.dialog.data('hq_chan_name'));
	$("#name").val(art.dialog.data('name'));
	$("#phone").val(art.dialog.data('phone'));
	var people_type=art.dialog.data('people_type');
	if(people_type=="店长"){
		people_type="1";
	}else{
		people_type="2";
	}
	$("#people_type").val(people_type);
	$("#nameid").val(art.dialog.data('nameid'));
	
	$("#hq_chan_code").blur(function(){
		initHqChanName(deal_date);
	});
	
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/agentPerson_update.action';
		$('#update').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				var people_type= $("#people_type").val();
				if(people_type==""){
					alert("请选择人员类型！");
					return false;
				}else{
					return isPassCheck(people_type);
				}
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

function initHqChanName(deal_date){
	var hq_chan_code=$("#hq_chan_code").val();
	var sql= "SELECT HQ_CHAN_NAME FROM PORTAL.TAB_PORTAL_MOB_PERSON WHERE HQ_CHAN_CODE='"+hq_chan_code+"' AND DEAL_DATE='"+deal_date+"'";                                    
	var r=query(sql);
    if(r&&r.length>0){
    	$("#hq_chan_name").val(r[0].HQ_CHAN_NAME);
    }else{
    	$("#hq_chan_name").val("");
    	alert("代理商编码错误！");
    }
}

function isPassCheck(people_type){
	var url = $("#ctx").val()+'/channelManagement/agentPerson_isPassCheck.action';
	var r;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
           	"hq_chan_code":$("#hq_chan_code").val(),
           	"name":$("#name").val(),
           	"phone":$("#phone").val(),
           	"deal_date":$("#deal_date").val(),
           	"people_type":$("#people_type").val()
	   	}, 
	   	success:function(data){
	   		if(data=="success"){
	   			r=true;
	   		}else{
	   			alert(data);
	   			r=false;
	   		}
		},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("出现异常！");
	    }
	});
	return r;
}