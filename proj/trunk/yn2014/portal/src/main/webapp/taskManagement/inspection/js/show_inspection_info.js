var pageSize = 7;
$(function(){
	initInspectionChanl();
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function initInspectionChanl() {
	var inspec_id = $("#inspec_id").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryInspectionChanl.action",
		data:{
		   "inspec_id":inspec_id
	   	},
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		var content="";
	   		$.each(pages,function(i,n){
	   			if(i == 0) {
	   				$("#inspec_name").html(n['INSPEC_NAME']);
	   				$("#startTime").html(n['START_TIME']);
	   				$("#endTime").html(n['END_TIME']);
	   				$("#inspec_desc").html(n['REMARK']);
	   			}
	   			var sc = "<tr>" +
				"<td>"+n['CHANL_NAME']+"</td><td>"+n['HQ_CHANL_ID']+"</td>" +
				"<td>"+n['R_USER_NAME']+"</td><td>"+n['R_PHONE']+"</td>" +
				"<td id='__"+n['HQ_CHANL_ID']+"_"+n['R_USER_ID']+"'>"+n['INSPEC_SUM']+"</td>" +
				"<td userid='"+n['R_USER_ID']+"' p_code='"+n['R_USER_REGION']+"' p_levl='"+n['R_USER_REGION_LEVEL']+"' chanl_type='"+n['CHANL_TYPE']+"'><a href='#' del_hd_id='"+n['HQ_CHANL_ID']+"_"+n['R_USER_ID']+"'>&nbsp;</a></td></td>"+
				"</tr>";
				$("#selected_inspection_chanl").append(sc);
			});
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function closeHdDialog() {
	window.parent.closeWindow("巡检详细信息");
}

