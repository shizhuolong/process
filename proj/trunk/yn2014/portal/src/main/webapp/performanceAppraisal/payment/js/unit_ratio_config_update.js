var pageSize = 5;
var unit_id = "";
var unit_manager_ratio = "";
var unit_head_ratio = "";
$(function() {
	unit_id = art.dialog.data('unit_id');
	unit_manager_ratio=art.dialog.data('unit_manager_ratio');
	unit_head_ratio=art.dialog.data('unit_head_ratio');
	loadData();
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'updateUnitConfig'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/unitRatioConfig_updateUnitRatio.action';
		$('#updateUnitRatioForm').form('submit',{
			url:url,
			onSubmit:function(){
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
						win.art.dialog({id: 'updateUnitConfig'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function loadData() {
	$.ajax({
        type: "POST",
        async:true,
        cache:false,
        url:$("#ctx").val()+'/assessment/unitRatioConfig_loadUnitRatio.action',
        data:{unit_id:unit_id},
        success:function(data){
        	var r = $.parseJSON(data);
        	$("#unit_id").val(r[0].UNIT_ID);
        	$("#group_id_1_name").html(r[0].GROUP_ID_1_NAME);
        	$("#unit_name").html(r[0].UNIT_NAME);
        	$("#unit_ratio").numberbox('setValue', r[0].UNIT_RATIO);
        	$("#unit_manager_ratio").numberbox('setValue', r[0].UNIT_MANAGER_RATIO);
        	$("#unit_head_ratio").numberbox('setValue', r[0].UNIT_HEAD_RATIO);
        }
    });
}

