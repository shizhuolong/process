var deal_date="";
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();
	});
	$("#cancleInnerBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();
	});
	deal_date=art.dialog.data('deal_date');
	$("#deal_date").val(deal_date);
	$("#deal_date_inner").val(deal_date);
	
	$("#hq_chan_code").blur(function(){
		initHqChanName(deal_date,2);
	});
	$("#hq_chan_code_inner").blur(function(){
		initHqChanName(deal_date,1);
	});
	$("#hr_id_inner").blur(function(){
		initInnerByHrId($(this).val());
	});
	$("#team_type").change(function(){
		if($(this).val()=="1"){
			$("#add_div").hide();
			$("#add_div_inner").show();
			$("#hq_chan_name_inner").val("");
		}else if($(this).val()=="2"){
			$("#add_div_inner").hide();
			$("#add_div").show();
			$("#hq_chan_name").val("");
		}else{
			$("#add_div_inner").hide();
			$("#add_div").hide();
		}
	});
	
	$("#saveBtn").click(function(){
		save("addForm");
	});
	$("#saveInnerBtn").click(function(){
		save("addInnerForm");
	});
});

function save(obj){
	var url = $("#ctx").val()+'/channelManagement/agentPerson_save.action';
	$("#"+obj).form('submit',{
		url:url,
		dataType:"json",
		onSubmit:function(){
			var isValidate = $(this).form('validate');//验证有问题，怎么都是true
			if(isValidate == false) {
	    		return false;
			}
			var people_type;
			var phoneNumber;
			if(obj=="addForm"){
				if($("#hq_chan_name").val()==""){
					alert("代理商名称不能为空！");
					return false;
				}
				if($("#name").val()==""){
					alert("姓名不能为空！");
					return false;
				}
				people_type= $("#people_type").val();
				phoneNumber= $.trim($("#phone").val());
			}else{
				if($("#hq_chan_name_inner").val()==""){
					alert("代理商名称不能为空！");
					return false;
				}
				if($("#userId_inner").val()==""){
					alert("HR编码错误！")
					return false;
				}
				people_type= $("#people_type_inner").val();
				phoneNumber= $("#phone_inner").val();
			}
			
			if(people_type==""){
				alert("请选择人员类型！");
				return false;
			}
			if(obj=="addForm"){
				if(checkMobile(phoneNumber)==false){
					return false;
				}
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

}
function isPassCheck(people_type){
	var url = $("#ctx").val()+'/channelManagement/agentPerson_isPassCheck.action';
    var team_type=$("#team_type").val();
    var hq_chan_code;
    var name;
    var phone;
    var deal_date;
    var people_type;
    
    if(team_type==1){
    	hq_chan_code=$("#hq_chan_code_inner").val();
       	name=$("#name_inner").val();
       	phone=$("#phone_inner").val();
       	deal_date=$("#deal_date_inner").val();
       	people_type=$("#people_type_inner").val();
    }else{
    	hq_chan_code=$("#hq_chan_code").val();
       	name=$("#name").val();
       	phone=$("#phone").val();
       	deal_date=$("#deal_date").val();
       	people_type=$("#people_type").val();
    }
	var r;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
           	"hq_chan_code":hq_chan_code,
           	"name":name,
           	"phone":phone,
           	"deal_date":deal_date,
           	"people_type":people_type
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

function initHqChanName(deal_date,teamType){
	var hq_chan_code;
	if(teamType==1){
		var hq_chan_code=$("#hq_chan_code_inner").val();
	}else{
		var hq_chan_code=$("#hq_chan_code").val();
	}
	
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
    	$("#hq_chan_name_inner").val(r[0].HQ_CHAN_NAME);
    }else{
    	$("#hq_chan_name").val("");
    	$("#hq_chan_name_inner").val("");
    	//alert("代理商编码错误！");
    }
}

function initInnerByHrId(hrId){
	var region=$("#region").val();
	var sql="SELECT u.ID,u.REALNAME,u.PHONE FROM PORTAL.APDP_USER u,portal.apdp_org org WHERE u.org_id=org.id and HR_ID='"+hrId+"'";
	var orgLevel=$("#orgLevel").val();
	if(orgLevel!=1){
		sql+=" AND org.REGION_CODE='"+region+"'";
	}
	var r=query(sql);
	if(r!=null&&r.length>0){
		$("#userId_inner").val(r[0].ID);
		$("#name_inner").val(r[0].REALNAME);
		$("#phone_inner").val(r[0].PHONE);
	}else{
		$("#userId_inner").val("");
		$("#name_inner").val("");
		$("#phone_inner").val("");
	}
}