jQuery(function(){
	$("#upload").click(complete);
});

function downloadFile() {
	window.location.href=$("#ctx").val()+"/fixedSalary/import-fixed-salary!downfile.action";
}

//完成
function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	 if(flag){
		//$.addMessage({msg:'正在导入数据!请稍后......',storeDom:$("#showmsg")});
		var action=$("#ctx").val()+"/fixedSalary/import-fixed-salary!importToTemp.action";
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_fixed_salary_list.jsp";
}
