jQuery(function(){
	getRegionName(); 
	$("#upload").click(complete);
});
function downloadFile() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel<=2){
	  window.location.href=paths+"/devIncome/orUploadOld_downfile.action";
	}
}
//完成
function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	var orgLevel=$("#orgLevel").val();
	if(orgLevel<=2){
	 if(flag){
		//$.addMessage({msg:'正在导入数据!请稍后......',storeDom:$("#showmsg")});
		document.mainForm.submit(); 
	 }else{
		 alert("你没有导入权限！");
	 }
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
function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='');
}
//执行方法
function _execute(type,parameter,callback,msg,dom){
    $.Project.execute(type,parameter,callback,msg,dom);
}
function getRegionName(){
	var sql="SELECT distinct t.region_name regionName,t.region_code regionCode FROM portal.apdp_org  t where t.region_code <> '86000'";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	//var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.region_code='"+code+"'";
	}else{
		sql+=" and 1=2";
	}
	var result=query(sql);
	 var html="";
	  for(var i=0;i<result.length;i++){
		 html+="<option value="+result[i].REGIONCODE+">"+result[i].REGIONNAME+"</option>";
	  }
    $("#regionName").empty().append($(html));
}					 