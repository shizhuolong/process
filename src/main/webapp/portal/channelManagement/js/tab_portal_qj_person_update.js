$(function() {
	var hr_id=art.dialog.data('hr_id');
	var job_type=art.dialog.data('job_type');
	var regionCode=art.dialog.data('regionCode');
	var unit_name=art.dialog.data('unit_name');
	var name=art.dialog.data('name');
	var job=art.dialog.data('job');
	$("#name").val(name);
	$("#unit_name").val(unit_name);
	$("#job_type").val(job_type);
	$("#job").val(job);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/qjPerson_update.action';
		var name = $.trim($("#name").val());
		var unit_name = $("#unit_name").val();
		var job = $("#job").val();
		var job_type = $("#job_type").val();
		var result = "";
	    $.ajax({
		 type: "POST",
		 dataType:"json",
		 async:false,
		 cache:false,
		 url:url,
		 data:{
		 "hr_id":hr_id,
		 "name":name,
		 "unit_name":unit_name,
		 "job":job,
		 "job_type":job_type
		 },
		 success:function(r){
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
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

