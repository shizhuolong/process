var pageSize = 5;
$(function() {
	var std_6_id = art.dialog.data('std_6_id');
	var std_6_name = art.dialog.data('std_6_name');
	$("#std_6_id").val(std_6_id);
	loadData(std_6_id);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'networkUpdateDialog'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/networkStd6_update.action';
		$('#updateForm').form('submit',{
			url:url,
			onSubmit:function(){
				var rs = $(this).form('validate');
				if(rs == false) {
					return fasle;
				}
				var zw_name_num = $.trim($("#zw_name_num").val());
				var service_num = $.trim($("#service_num").val());
				if(zw_name_num != "") {
					var t = checkMobile(zw_name_num);
					if(t == false) {
						art.dialog.alert("装维联系人电话格式不正确！");
						return false;
					}
				}
				if(service_num != "") {
					var t1 = checkMobile(service_num);
					if(t1 == false) {
						art.dialog.alert("业务办理联系人号码不正确！");
						return false;
					}
				}
			},
			success:function(r){
				var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: d.msg,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'networkUpdateDialog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});

function checkMobile(str) {
   var re = /^1\d{10}$/
   return re.test(str);
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function loadData(std_6_id) {
	$.ajax({
        type: "POST",
        async:true,
        cache:false,
        url:$("#ctx").val()+'/channelManagement/networkStd6_loadById.action',
        data:{std_6_id:std_6_id},
        success:function(data){
        	var r = $.parseJSON(data);
        	$("#std6id").html(r[0].STD_6_ID);
        	$("#std6name").html(r[0].STD_6_NAME);
        	$("#house_pe").numberbox('setValue',r[0].HOUSE_PE);
        	$("#cover_house_pe").numberbox('setValue',r[0].COVER_HOUSE_PE);
        	$("#jd").val(r[0].JD);
        	$("#wd").val(r[0].WD);
        	$("#zw_name").val(r[0].ZW_NAME);
        	$("#zw_name_num").val(r[0].ZW_NAME_NUM);
        	$("#service_name").val(r[0].SERVICE_NAME);
        	$("#service_num").val(r[0].SERVICE_NUM);
        }
    });
}

