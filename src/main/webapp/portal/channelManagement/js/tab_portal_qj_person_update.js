$(function() {
	var unit_name=art.dialog.data('unit_name');
	var job=art.dialog.data('job');
	var hr_id=art.dialog.data('hr_id');
	var logo=art.dialog.data('is_logo');
	var hr_ratio=art.dialog.data('hr_ratio');
	var chooseMonth=art.dialog.data('chooseMonth');
	var userCode=art.dialog.data('userCode');
	var unit_id=art.dialog.data('unit_id');
	$('#hr_ratio').numberbox('setValue', hr_ratio);
	$("#hr_id").val(hr_id);
	$("#chooseMonth").val(chooseMonth);
	
	if(unit_name!=""){
		$("#unit_name").empty().append("<option value ="+unit_name+" unit_id ="+unit_id+">"+unit_name+"</option>");
	}
	
	if(logo=='0'){
		$("#is_logo").empty().append("<option value =0>否</option>");
	}else{
		$("#is_logo").empty().append("<option value =1>是</option>");
	}
	if(job!=''){
		$("#job").empty().append("<option value ="+job+" user_code="+userCode+">"+job+"</option>");
	}
	//获得焦点触发
	$("#unit_name").focus(function(){
		listunit_name();
	})
	$("#job").focus(function(){
		listjob();
	})
	$("#is_logo").focus(function(){
		$("#is_logo").empty().append(" <option value=''>请选择</option><option value='1'>是</option><option value='0'>否</option>");
	});
		//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();
	});
	
	$("#saveBtn").click(function(){
		var user_code=$("#job").find("option:selected").attr("user_code");
		$("#user_code").val(user_code);
		$("#unit_id").val($("#unit_name").find("option:selected").attr("unit_id"));
		var url = $("#ctx").val()+'/channelManagement/qjPerson_update.action';
		
		$('#update').form('submit',{
			url:url,
			onSubmit:function(){
				if($("#unit_name").val()==""){
					alert("请选择营服中心！");
					return false;
				}
				return $(this).form('validate');
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
						win.art.dialog({id: 'update'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});	

function listunit_name(){
	var chooseMonth=$("#chooseMonth").val();
	var hr_id=$("#hr_id").val();
	var sql ="SELECT DISTINCT UNIT_ID,UNIT_NAME FROM PORTAL.TAb_PORTAL_QJ_PERSON WHERE DEAL_DATE='"+chooseMonth+"' AND HR_ID='"+hr_id+"'"+" UNION "+"SELECT DISTINCT UNIT_ID,UNIT_NAME FROM PORTAL.VIEW_U_PORTAL_PERSON WHERE DEAL_DATE='"+chooseMonth+"' AND HR_ID='"+hr_id+"'";
	var d=query(sql);
	if (d) {
		var h = '<option value="" selected >请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option unit_id="'+d[i].UNIT_ID+'" value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		$("#unit_name").empty().append(h);
		
	} else {
		alert("获取营服中心失败!");
	}
}

function listjob(){
	var sql = "SELECT JOB,USER_CODE FROM PORTAL.TAB_PORTAL_QJ";
	var d=query(sql);
	if (d) {
		var h = '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="'+ d[i].JOB +'" user_code="' + d[i].USER_CODE + '">' + d[i].JOB + '</option>';
			}
		$("#job").empty().append(h);
	} else {
		alert("获取岗位失败!");
	}
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

