jQuery(function(){
	getRegionName(); 
	$("#upload").click(complete);
});
function downloadFile() {
	window.location.href=$("#ctx").val()+"/electricMaintain/import-electric-maintain!downfile.action";
}

//完成
function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==2){
	 if(flag){
		//$.addMessage({msg:'正在导入数据!请稍后......',storeDom:$("#showmsg")});
		document.mainForm.submit(); 
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
//执行方法
function getRegionName(){
	var sql="SELECT distinct t.region_name regionName,t.region_code regionCode FROM portal.apdp_org  t where 1=1";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
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