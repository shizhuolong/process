var code="";
var user_code="";
var orgLevel="";
var chooseMonth="";
$(function() {
	code=$("#code").val();
	orgLevel=$("#orgLevel").val();
	chooseMonth=art.dialog.data('chooseMonth');
	$("#chooseMonth").val(chooseMonth);
	$("#hr_id").change(function(){
		initName();
	});
	$("#hq_chan_code").change(function(){
		initChanName();
	});
	$("#f_hr_id").change(function(){
		initFName();
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/personManagement/hall-mag-person!save.action';
		$('#add').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
		    	return $(this).form('validate');
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

function initName(){
	var orgLevel = $.trim($("#orgLevel").val());
	var hr_id=$.trim($("#hr_id").val());
	var region = $.trim($("#region").val());
	var sql = "";
	if(orgLevel==1){
		sql="SELECT REALNAME FROM PORTAL.APDP_USER WHERE HR_ID ='"+hr_id+"'";
	}else{
		sql="SELECT REALNAME FROM PORTAL.APDP_USER T1 "+
			" JOIN PORTAL.APDP_ORG T2 "+
			" ON(T1.ORG_ID=T2.ID) "+
			" WHERE T2.REGION_CODE='"+region+"'"+
			" AND HR_ID ='"+hr_id+"'";
	}
	var d=query(sql);
	$("#name").val("");
	if(d&&d.length>=1){
	 var name=d[0].REALNAME;
	 $("#name").val(name);
	}else{
		alert("营业员HR编码错误");
	}
}

function initChanName(){
	var orgLevel = $.trim($("#orgLevel").val());
	var region = $.trim($("#region").val());
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var sql = "";
	if(orgLevel==1){
		sql = "SELECT GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANL_HQ_CODE where hq_chan_code ='"+hq_chan_code+"'";
	}else{
		sql = "SELECT GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANL_HQ_CODE where hq_chan_code ='"+hq_chan_code+"' AND GROUP_ID_1 ='"+region+"'";
	}
	var d=query(sql);
	$("#hq_chan_name").val("");
	if(d&&d.length>=1){
	 var name=d[0].GROUP_ID_4_NAME;
	 $("#hq_chan_name").val(name);
	}else{
		alert("渠道编码错误");
	}
}

function initFName(){
	var f_hr_id=$.trim($("#f_hr_id").val());
	var orgLevel = $.trim($("#orgLevel").val());
	var region = $.trim($("#region").val());
	var sql = "";
	if(orgLevel==1){
		sql="SELECT REALNAME FROM PORTAL.APDP_USER WHERE HR_ID ='"+f_hr_id+"'";
	}else{
		sql="SELECT REALNAME FROM PORTAL.APDP_USER T1 "+
			" JOIN PORTAL.APDP_ORG T2 "+
			" ON(T1.ORG_ID=T2.ID) "+
			" WHERE T2.REGION_CODE='"+region+"'"+
			" AND HR_ID ='"+f_hr_id+"'";
	}
	var d=query(sql);
	$("#f_user_name").val("");
	if(d&&d.length>=1){
	 var name=d[0].REALNAME;
	 $("#f_user_name").val(name);
	}else{
		alert("厅主任HR编码错误");
	}
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

