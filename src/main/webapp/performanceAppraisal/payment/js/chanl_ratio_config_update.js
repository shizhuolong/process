var pageSize = 5;
var hq_chan_code = "";
var month="";
$(function() {
	hq_chan_code = art.dialog.data('hq_chan_code');
	month = art.dialog.data('month');
	loadData();
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'updateChanlConfig'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/assessment/chanlRatioConfig_updateChanlRatio.action';
		$('#updateChanlRatioForm').form('submit',{
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
						win.art.dialog({id: 'updateChanlConfig'}).close();
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
        url:$("#ctx").val()+'/assessment/chanlRatioConfig_loadChanlRatio.action',
        data:{"hq_chan_code":hq_chan_code,"month":month},
        success:function(data){
        	var r = $.parseJSON(data);
        	$("#hq_chan_code").html(r[0].HQ_CHAN_CODE);
        	$("#group_id_4_name").html(r[0].GROUP_ID_4_NAME);
        	$("#chnl_type").combobox('setValue',r[0].CHNL_TYPE);
        	$("#ratio").numberbox('setValue', r[0].RATIO);
        	if(r[0].SERVER_RATIO == "" || r[0].SERVER_RATIO == null) {
        		$("#server_ratio").numberbox('setValue', '1.0000');
        	}else {
        		$("#server_ratio").numberbox('setValue', r[0].SERVER_RATIO);
        	}
        	$("#groupcode").val(r[0].HQ_CHAN_CODE);
        	$("#groupname").val(r[0].GROUP_ID_4_NAME);
        	$("#group_id_1").val(r[0].GROUP_ID_1);
        	$("#month").val(month);
        }
    });
}

