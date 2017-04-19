jQuery(function(){
	$("#upload").click(complete);
});

function downloadFile() {
	var time=$("#time").val();
	var code=$("#code").val();
	var sql = "SELECT T.GROUP_ID_1_NAME,T.YYY_NAME,T.HALL_CODE,T.YYY_ARRE_NAME,T.HQ_CHAN_CODE,T.IS_BALL,T.CHANNLE_NAME,T.CLOSE_OUT,T.LABOR_COST FROM PTEMP.TB_TEMP_BUS_HALL_INFO T WHERE T.DEAL_DATE='"+time+"' AND T.GROUP_ID_1_NAME IN(SELECT GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE WHERE GROUP_ID_1='"+code+"')";
	var title=[["营业厅基础信息","","","","","",""," 紧密外包(元) "," 合同及派遣人工成本（元）"], 
	           ["","","","","","","","",""],
	           ["地市","营业厅名称","主厅编码","营业厅地址","渠道编码","是否主厅","渠道名称","",""]];
	var showtext = '固话信息模板';
	downloadExcel(sql,title,showtext);
}

function complete(){
	$("#upload").hide();
	var flag=checkOptions();
	 if(flag){
		//$.addMessage({msg:'正在导入数据!请稍后......',storeDom:$("#showmsg")});
		 var action=$("#ctx").val()+"/ghUpload/gh-upload!importToTemp.action";
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_ghUpload_list.jsp";
}