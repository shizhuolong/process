$(function() {
	var hr_id=art.dialog.data('hr_id');
	var chooseMonth=art.dialog.data('chooseMonth');
	var hq_chan_code=art.dialog.data('hq_chan_code');
	var hq_chan_name=art.dialog.data('hq_chan_name');
	var hr_name=art.dialog.data('hr_name');
	var f_user_name=art.dialog.data('f_user_name');
	var f_hr_id=art.dialog.data('f_hr_id');
	$("#hr_id").val(hr_id);
	$("#hrId").val(hr_id);
	$("#chooseMonth").val(chooseMonth);
	$("#hq_chan_code").val(hq_chan_code);
	$("#hq_chan_name").val(hq_chan_name);
	$("#hr_name").val(hr_name);
	$("#f_user_name").val(f_user_name);
	$("#f_hr_id").val(f_hr_id);
	
	$("#hr_id").change(function(){
		initName();
	});
	
	$("#f_hr_id").change(function(){
		initFName();
	});
	
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/personManagement/hall-mag-person!update.action';
		$('#update').form('submit',{
			url:url,
			onSubmit:function(){
				return $(this).form('validate');
			},
			success:function(r){
				//var d = $.parseJSON(r);
				if(r=='营业厅编码错误'){
					alert(r);
				}else{
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
				
			}
		});
	});
});		

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

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
	$("#hr_name").val("");
	if(d&&d.length>=1){
	 var name=d[0].REALNAME;
	 $("#hr_name").val(name);
	}else{
		alert("营业员HR编码错误");
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

