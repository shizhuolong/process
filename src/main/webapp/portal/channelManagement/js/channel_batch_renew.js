var isHavingFile="notWithFile";
var isNeedApprover = true;
$(function(){
	findNextDealer("contract_marketManager","2");
	initUpload();
	var pageNumber =1;
	var pageSize = 10;
	var url=$("#ctx").val()+"/renew/renew-process!findByIds.action";
	var id=$("#uu_id").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:url,
		data:{
			"resultMap.page":pageNumber,
	        "resultMap.rows":pageSize,
	        id:id
		},
		success:function(data){
			if(data!=null&&data!=""){
				var content="";
		   		$.each(data.rows,function(i,n){
					content+="<tr>"
					+"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['HQ_CHAN_CODE'])+"></td>"
	                +"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['HQ_CHAN_NAME'])+"></td>"
	                +"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['START_MONTH'])+"></td>"
	                +"<td><input readonly='readonly' style='border-style:none' value="+getEndMonth(n['END_MONTH'])+"></td>"
	                +"<td><input readonly='readonly' style='border-style:none' value="+isNull(n['HZ_YEAR']+1)+"></td>"
	                +"<td><input value="+isNull(n['ASSESS_TARGET'])+"></td>"
	                +"<td><input value="+isNull(n['YSDZ_XS'])+"></td>"
	                +"<td><input value="+isNull(n['ZX_BT'])+"></td>"
	                +"<td><input value="+isNull(n['HZ_MS'])+"></td>"
	                +"<td><input value="+isNull(n['FW_FEE'])+"></td>"
	                +"<td><input value="+isNull(n['RATE_THREE'])+"></td>"
	                +"<td><input value="+isNull(n['RATE_SIX'])+"></td>"
	                +"<td><input value="+isNull(n['RATE_NINE'])+"></td>"
	                +"<td><input value="+isNull(n['RATE_TWELVE'])+"></td>"
	                +"<td style='border-style:none; margin:0; padding: 0px;'><input type='hidden' style='border-style:none' value="+isNull(n['ID'])+"></td>"
	                +"</tr>";
				});
		   		if(content != "") {
					$("#dataBody").empty().html(content);
				}else {
					$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
				}
			}
		}
	});
	$("#submitTask").click(function(){
		submitTask();
	})
});

function toBack(){
  var url="channel_renew_list.jsp";
  window.location.href=url;	
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function getEndMonth(obj){
	obj=obj+"";
	var year=obj.substring(0,4);
	var endYear=parseInt(year)+1;
	var endMonth=obj.substring(4,6);
	return endYear+endMonth;
}

//提交审批
function submitTask(){
	if(validate()) {
		art.dialog.confirm("您确定提交审批吗？",function(){
			var actNodeName = $("#nextDealer option:selected").text();
			$("#actNodeName").val(actNodeName);
			$("#isHavingFile").val(isHavingFile);
			var isOk=save();
			if(!isOk){
				return;
			}
			$("#taskForm").form("submit",{
				url:$("#ctx").val()+'/renew/renew-process!doSubmitTask.action',
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h2>正在发送中，请稍等...</h2></div>",
						fadeIn: 700,
						centerY: true,
						showOverlay: true
					});	
					return true;
				},
				success:function(data){
					data=eval('('+data+')');
					jQuery.unblockUI();
					if(data.code=='OK') {
						art.dialog({
				   			title: '提示',
				   		    content: "发送成功！",
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	$("#submitTask").remove();
				   		        window.location.href="channel_renew_list.jsp";	 
				   		    }
				   		});
					}
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("发送失败！"+errorThrown);
			   	}
	      	});
		},function(){
			art.dialog.tips('执行取消操作');
		});
	}
}

function validate(){
	var flag = true ;
	var nextRouter = $("#nextRouter").val();
	var theme = $.trim($("#theme").val());
	if(!isNotBlank(theme)) {
		art.dialog.alert("工单主题不能为空！");
		return false;
	}
	
	if(!isNotBlank(nextRouter)){
		art.dialog.alert("下一环节不能为空！");
		return false;
	}
	if(isNeedApprover) {
		if(!isNotBlank($("#nextDealer").val())){
			art.dialog.alert("请选择下一步处理人！");
			flag = false;
		}
	}
	return flag; 
}

//下一步审批人
function findNextDealer(taskId,taskFlag) {
	
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = $("#ctx").val()+"/approver/approver-handler!DepartmentManager.action";
	}else {
		//查询节点上配置的人员
		url = $("#ctx").val()+"/approver/approver-handler!qryTaskApprover.action";
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
     		taskId:taskId,
        	taskFlag:taskFlag
		}, 
	 	success:function(data){
	 		var str = "";
	 		$.each(data,function(i,n){
	 			str += "<option value='"+n.USER_ID+"'>"+n.USER_NAME+"</option>";
			});
	 		$("#nextDealer").html(str);
		 }
	 });
}
function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

var ids;
function save(){
	var str ="";
	$("#dataBody").find("tr").each(function(){
        var tdArr = $(this).children();
        var hq_chan_code = tdArr.eq(0).find('input').val();
        var hq_chan_name = tdArr.eq(1).find('input').val();
        var start_month = tdArr.eq(2).find('input').val();
        var end_month = tdArr.eq(3).find('input').val();
        var hz_year = tdArr.eq(4).find('input').val();
        var assess_target = tdArr.eq(5).find('input').val();
        var ysdz_xs = tdArr.eq(6).find('input').val();
        var zx_bt = tdArr.eq(7).find('input').val();
        var hz_ms = tdArr.eq(8).find('input').val();
        var fw_fee = tdArr.eq(9).find('input').val();
        var rate_three = tdArr.eq(10).find('input').val();
        var rate_six = tdArr.eq(11).find('input').val();
        var rate_nine = tdArr.eq(12).find('input').val();
        var rate_twelve = tdArr.eq(13).find('input').val();
        var uu_id = tdArr.eq(14).find('input').val();
        str += hz_year+ ","+end_month+","+assess_target+","+rate_three+","+rate_six+","+
        rate_nine+","+rate_twelve+","+ysdz_xs+","+zx_bt+","+hz_ms+","+fw_fee+","+uu_id+"|"
    });
	var oldIds=$("#uu_id").val();
	var url = $("#ctx").val()+"/renew/renew-process!renewBatch.action";
	var isSaveOk=true;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:url, 
		data:{
			param:str,
			oldIds:oldIds
		},
		success:function(data){
			if(data!=null&&data.state==1){
				ids=data.ids;
				//用于发送工单产生工单编号
				$("#id").val(ids);
				isSaveOk=true;
			}else{
				isSaveOk=false;
			}
		}
	});
	return isSaveOk;
}

function initUpload() {
	/*  注：上传路径 tomcat用jsessionid, weblogic 用portalSession [2013-05-09 H]*/
	$("#uploadify").uploadify({
		   'uploader'       : path+'/js/jqueryUpload/uploadify.swf',
		   'script'         : path+'/processUpload/process-upload!upload.action?paySession='+paySession,//servlet的路径或者.jsp 这是访问servlet 'scripts/uploadif' 
		   'method'         :'GET',  //如果要传参数，就必须改为GET
		   'cancelImg'      : path+'/images/cancel.png',
		   'folder'         : 'upload', //要上传到的服务器路径，
		   'queueID'        : 'fileQueue',
		   'buttonImg'  	: path+'/images/file-btn1.jpg',
		   //'wmode'			: 'transparent',
		   'auto'           : false, //选定文件后是否自动上传，默认false
		   'multi'          : true, //是否允许同时上传多文件，默认false
		   'simUploadLimit' : 1, //一次同步上传的文件数目  
		   'sizeLimit'      : 536870912, //设置单个文件大小限制，单位为byte  
		   'queueSizeLimit' : 10, //限制在一次队列中的次数（可选定几个文件）。默认值= 999，而一次可传几个文件有 simUploadLimit属性决定。
		   //'fileDesc'       : '支持格式:jpg或gif', //如果配置了以下的'fileExt'属性，那么这个属性是必须的  
		   'fileDesc'       : '', //如果配置了以下的'fileExt'属性，那么这个属性是必须的  
		   //'fileExt'        : '*.jpg;*.gif;*.docx;*.doc;*.xls;*.txt;*.pdf;*.zip',//允许的格式
		   'fileExt'        : '',//允许的格式
		   'fileDataName'	:'uploadify',  
		   'width'			:82,
		   'height'			:28,
	   　  	onComplete: function (event, queueID, fileObj, response, data) {
			   if(response=='error') {
				   $.messager.alert('提示','文件:'+fileObj.name+'上传失败','error');
			   }else {
				    isHavingFile="withFile";
			  		$("#speed").append("<span>&nbsp;&nbsp;&nbsp;<a href='#' onclick='downloadFile(this)' path='"+response+"' name='"+fileObj.name+"'>"+fileObj.name
					  		    +"</a>&nbsp;&nbsp;&nbsp;<a href='###' path='"+response+"' onclick='delAttachement(this)'><font color='red'>删除</font></a><br/><br/></span>");
			   }
		   　},  
   　		  onError: function(event, queueID, fileObj) {  
		   　	 alert("文件:" + fileObj.name + "上传失败");  
		   　},  
	   　 	  onCancel: function(event, queueID, fileObj){  
		   　	 //alert("取消了" + fileObj.name);  
		   　},
		  onProgress:function(event,queueId,fileObj,data) {
			 //$("#speed").html("percentage:"+data.percentage+"  speed:"+data.speed);
	   	  },
	   	  onAllComplete:function(event,data) {
	   		$.unblockUI(); 
	   	  }
  });
}

//上传
function uploasFile(){ 
	var content = $("#fileQueue").html();
	if(!content){
		return;//队列里面没文件，不能上传
	}
	$.ajax({
		type:"post",
		dataType:'json',
        cache:false,
        async:false,
		url:path+'/processUpload/process-upload!beforeUpload.action',
		success:function(data){
			if(isNotBlank(content)) {
				 jQuery.blockUI({
				        message: "<div style='text-align:center;'><span>正在上传中，请稍等...</span></div>",
				        fadeIn: 700,
				        centerY: true,
				        showOverlay: true
			      });
				}
			    $("#speed").empty();
			  	jQuery('#uploadify').uploadifyUpload(); 
		},
		error:function(XMLResponse){
			alert("上传出现异常，上传失败！");
		}
	});
}

//删除附件
function delAttachement(element) {
	//此处要去掉空格，否则不能删除数据库中的记录
	var filePath = $.trim($(element).attr("path"));
	$.ajax({
		type:"post",
		dataType:'json',
		data:{filePath:filePath},
        cache:false,
		url:path+'/processUpload/process-upload!deleteFile.action',
		success:function(data){
			if(data.success) {
				$(element).parent().remove();
			}
		},
		error:function(XMLResponse){
			alert(XMLResponse);
		}
	});
}
//附件下载
function downloadFile(element) {
	var filePath = $.trim($(element).attr("path"));
	var fileName = $(element).attr("name");
	fileName=fileName.replace(/%/g,"%25");
    filePath=filePath.replace(/%/g,"%25");
	filePath = encodeURI(encodeURI(filePath));
	fileName = encodeURI(encodeURI(fileName));
	window.location.href=path+"/processUpload/process-upload!download.action?fileName="+fileName+"&filePath="+filePath;
}