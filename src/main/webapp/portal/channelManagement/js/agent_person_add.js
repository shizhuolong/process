var deal_date="";
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();
	});
	deal_date=art.dialog.data('deal_date');
	$("#deal_date").val(deal_date);
	
	$("#hq_chan_code").blur(function(){
		initHqChanName(deal_date);
	});
	
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/agentPerson_save.action';
		$('#add').form('submit',{
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
				}
				var phoneNumber= $("#phone").val();
				if(checkMobile(phoneNumber)==false){
					return false;
				}
				return isPassCheck(people_type);
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
function checkMobile(phoneNumber){ 
   if(phoneNumber.length!=11){ 
	    alert("手机号码有误，请重填");  
	    return false; 
	} 
    return true;
} 
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function initHqChanName(deal_date){
	var hq_chan_code=$("#hq_chan_code").val();
	var sql= "SELECT T.HQ_CHAN_NAME                             "+
	"FROM PORTAL.TAB_PORTAL_MOB_PERSON t                        "+
	"JOIN PCDE.TAB_CDE_CHANL_HQ_CODE T1                         "+
	"ON   (T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                      "+
	"WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"' AND T.DEAL_DATE='"+deal_date+"' AND T1.STATUS IN ('10','11')";                                    

	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	
	if(orgLevel==1) {//省
		
	}else if(orgLevel == 2) {//市
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel == 3) {//营服
		sql+=" AND T.HR_ID IN("+_jf_power(hrId,deal_date)+")";
	}else {
		sql+=" AND 1=2";
	}
	var r=query(sql);
    if(r&&r.length>0){
    	$("#hq_chan_name").val(r[0].HQ_CHAN_NAME);
    }else{
    	$("#hq_chan_name").val("");
    	alert("代理商编码错误！");
    }
}
