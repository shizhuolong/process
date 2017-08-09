jQuery(function(){
	$("#upload").click(complete);
});

function downloadFile() {
	window.location.href=$("#ctx").val()+"/base/import-base!downfile.action";
}

function answer(){
	window.location.href=$("#ctx").val()+"/portal/channelManagement/down/answer.doc";
}

//完成
function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	 if(flag){
		//$.addMessage({msg:'正在导入数据!请稍后......',storeDom:$("#showmsg")});
		var action=$("#ctx").val()+"/base/import-base!importToTemp.action?businessKey="+$("#businessKey").val();
		$("#uploadForm").attr("action",action);
		document.mainForm.submit(); 
  }
}
/**校验**/
function checkOptions(){
	var file=$(':file');
	var allow = new Array('xls','xlsx'); //允许的拓展名
	if(null==file.val() || ''==file.val()){
		alert("请选择上传文件!");
		return false;
	}else{
		var ext=file.val().split('.').pop().toLowerCase(); 
		if(jQuery.inArray(ext, allow) == -1) {
			alert('请选择xls、xlsx文件!'); 
			return false;
		} 
	}
	return true;
}

function toBack(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_base_list.jsp";
}