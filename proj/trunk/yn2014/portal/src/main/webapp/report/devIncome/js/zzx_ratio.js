jQuery(function(){
	$("#upload").click(complete);
});
function downloadFile() {
	  window.location.href=paths+"/devIncome/ZZXUpload_downfile.action";
}
//完成
function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	if(flag){
		document.mainForm.submit(); 
	}
}
/**校验**/
function checkOptions(){
	var file=$(':file');
	var allow = new Array('xls'); //允许的拓展名
	if(null==file.val() || ''==file.val()){
		alert("请选择上传文件!");
		return false;
	}else{
		var ext=file.val().split('.').pop().toLowerCase(); 
		if(jQuery.inArray(ext, allow) == -1) {
			alert('请选择xls文件!'); 
			return false;
		} 
	}
	return true;
}
