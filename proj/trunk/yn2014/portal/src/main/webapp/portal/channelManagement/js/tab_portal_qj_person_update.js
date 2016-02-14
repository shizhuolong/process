$(function() {
	listjob();
	var hr_id=art.dialog.data('hr_id');
	var job=art.dialog.data('job');
	var is_logo=art.dialog.data('is_logo');
	var chooseMonth=art.dialog.data('chooseMonth');
	$("#is_logo").val(is_logo);
	$("#job").val(job);
	$("#hr_id").val(hr_id);
	$("#chooseMonth").val(chooseMonth);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var user_code=$("#job").find("option:selected").attr("user_code");
		$("#user_code").val(user_code);
		var url = $("#ctx").val()+'/channelManagement/qjPerson_update.action';
		$('#update').form('submit',{
			url:url,
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
						win.art.dialog({id: 'update'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});		
function listjob(){
	var sql = "SELECT DISTINCT T.USER_TYPE,T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T union all select '渠道经理(固网)' as user_type, 2 as user_code from dual union all select '后台支撑' as user_type,0 as user_code from dual";
	var d=query(sql);
	if (d) {
		var h = '';
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].USER_TYPE +'" user_code="'+d[i].USER_CODE+'">' + d[i].USER_TYPE + '</option>';
			}
		$("#job").empty().append($(h));
	} else {
		alert("获取岗位失败");
	}
}
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

