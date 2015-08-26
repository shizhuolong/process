$(function() {
  search();
});
function search() {
	var orgLevel = $("#orgLevel").val();
	var code=$("#code").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/assessment/zzxRatioConfig_list.action",
		data:{
           "orgLevel":orgLevel,
           "code":code
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var content="";
	   		$.each(data,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['BSS_REGION_CODE'])+"</td>"
				+"<td>"+isNull(n['RATIO'])+"</td>"
				+"<td><a href='#' group_id_1='"+n['GROUP_ID_1']+"' group_id_1_name='"+n['GROUP_ID_1_NAME']+"' ratio='"+isNull(n['RATIO'])+"' onclick='edit(this);'>修改</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
			//权限
			if(orgLevel!=1&&orgLevel!=2){
				$("#dataBody").empty().html("<tr><td colspan='4'>你无权限查看</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function edit(ele) {
	var group_id_1 = $(ele).attr("group_id_1");
	var group_id_1_name=$(ele).attr("group_id_1_name");
	var ratio=$(ele).attr("ratio");
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('group_id_1_name',group_id_1_name);
	art.dialog.data('ratio',ratio);
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/tab_cde_region_ratio_update.jsp";
	art.dialog.open(url,{
		id:'update',
		width:'630px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'专租线提出比例配置'
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}



