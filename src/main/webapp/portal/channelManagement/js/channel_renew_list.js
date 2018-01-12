var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	//使用插件校验Form
	$("#taskForm").validate({
	    onfocusout: function(element){
	        $(element).valid();
	    }
	});
	initUpload();
	search(0);
	
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#submitTask").click(function(){
		submitTask();
	});
	$("#renewBtn").click(function(){
		var id_array=new Array();  
		$('input[name="selected"]:checked').each(function(){  
		    id_array.push("'"+$(this).val()+"'");//向数组中添加元素  
		});
			var idstr=id_array.join(',');
			if(id_array.length>=2){
				var url="/portal/portal/channelManagement/jsp/channel_batch_renew.jsp?id="+idstr;
				//window.parent.openWindow("批量续签",'funMenu',url);
				window.location.href="/portal/portal/channelManagement/jsp/channel_batch_renew.jsp?id="+idstr;
			}else{
				art.dialog({
					title: '提示',
		   		    content: '选择的数量小于2',
		   		    icon: 'succeed',
		   		    lock: true
				});
			}
		});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/renew/renew-process!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
	   			initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td> <input type='checkbox' name='selected' value='"+isNull(n['ID'])+"'></td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
                +"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
                +"<td>"+isNull(n['START_MONTH'])+"</td>"
                +"<td>"+isNull(n['END_MONTH'])+"</td>"
                +"<td>"+isNull(n['HZ_YEAR'])+"</td>"
                +"<td>"+isNull(n['ASSESS_TARGET'])+"</td>"
                +"<td>"+isNull(n['YSDZ_XS'])+"</td>"
                +"<td>"+isNull(n['ZX_BT'])+"</td>"
                +"<td>"+isNull(n['HZ_MS'])+"</td>"
                +"<td>"+isNull(n['FW_FEE'])+"</td>"
                +"<td>"+isNull(n['RATE_THREE'])+"</td>"
                +"<td>"+isNull(n['RATE_SIX'])+"</td>"
                +"<td>"+isNull(n['RATE_NINE'])+"</td>"
                +"<td>"+isNull(n['RATE_TWELVE'])+"</td>"
                +"<td><a href='#' uu_id='"+isNull(n['ID'])+"' onclick='renew($(this));' style='color:#BA0C0C;'>续签</a></td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='16'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function renew(obj){
	var formdiv=$('#addFormDiv');
	initReNewData(obj);
	findNextDealer("contract_marketManager","2");
	formdiv.show();
	formdiv.dialog({
		id:"renewDialog",
		title : '续签',
		width : 800,
		height : 500,
		closed : false,
		cache : false,
		modal : true,
		maximizable : true
	});
}

var uu_id="";
function initReNewData(obj){
	uu_id=$(obj).attr("uu_id");
	var url = $("#ctx").val()+"/renew/renew-process!findById.action";
	$.get(url,
			  {id:uu_id},
			  function(data){
			  	 if(data!=null&&data!=""){
			  		var data=eval("("+data+")");
			  		$("#hq_chan_code").val(data.HQ_CHAN_CODE);
			  		$("#hq_chan_name").val(data.HQ_CHAN_NAME);
			  		//续签合作年份默认加1年
			  		$("#start_month").val(data.START_MONTH);
			  		$("#end_month").val(getEndMonth(data.END_MONTH));
			  		$("#hz_year").val(parseInt(data.HZ_YEAR)+1);
			  		$("#assess_target").val(data.ASSESS_TARGET);
			  		$("#rate_three").val(data.RATE_THREE);
			  		$("#rate_six").val(data.RATE_SIX);
			  		$("#rate_nine").val(data.RATE_NINE);
			  		$("#rate_twelve").val(data.RATE_TWELVE);
			  		$("#ysdz_xs").val(data.YSDZ_XS);
			  		$("#zx_bt").val(data.ZX_BT);
			  		$("#hz_ms").val(data.HZ_MS);
			  		$("#fw_fee").val(data.FW_FEE);
			  	 }
		      });
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
					var isPass=checkForm();
					if(!isPass){
						return false;
					}
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
				   		    	search(0); 
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
	if(!checkForm()) {
		art.dialog.alert("表单不能为空！");
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
function checkForm(){
	if($("#assess_target").val()==""
		||$("#zx_bt").val()==""
		||$("#hz_ms").val()==""
		||$("#fw_fee").val()==""
		||$("#rate_three").val()==""
		||$("#rate_six").val()==""
		||$("#rate_nine").val()==""
		||$("#rate_twelve").val()==""
			){
		return false;
	}
	return true;
}

function save(){
	var isOk=true;
	//$("#renewDialog").dialog("close");
	//$('#addFormDiv').hide();
	var url = $("#ctx").val()+"/renew/renew-process!renew.action";
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var hq_chan_name=$.trim($("#hq_chan_name").val());
	var assess_target=$.trim($("#assess_target").val());
	var rate_three=$.trim($("#rate_three").val());
	var rate_six=$.trim($("#rate_six").val());
	var rate_nine=$.trim($("#rate_nine").val());
	var rate_twelve=$.trim($("#rate_twelve").val());
	var hz_year=$.trim($("#hz_year").val());
	var ysdz_xs=$.trim($("#ysdz_xs").val());
	var zx_bt=$.trim($("#zx_bt").val());
	var hz_ms=$.trim($("#hz_ms").val());
	var fw_fee=$.trim($("#fw_fee").val());
	var end_month=$.trim($("#end_month").val());
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
			   "resultMap.hq_chan_code":hq_chan_code,
			   "resultMap.hq_chan_name":hq_chan_name,
			   "resultMap.assess_target":assess_target,
			   "resultMap.rate_three":rate_three,
			   "resultMap.rate_six":rate_six,
			   "resultMap.rate_nine":rate_nine,
			   "resultMap.rate_twelve":rate_twelve,
			   "resultMap.ysdz_xs":ysdz_xs,
			   "resultMap.zx_bt":zx_bt, 
			   "resultMap.hz_ms":hz_ms,
			   "resultMap.fw_fee":fw_fee,
			   "resultMap.hz_year":hz_year,
			   "resultMap.end_month":end_month,
			   "resultMap.id":uu_id
	   	}, 
	   	success:function(data){
		    if(data.state=="0"){
		    	art.dialog.alert(data.msg);
		    	isOk=false;
		    }else{
		    	$("#id").val(data.id);
		    	isOk=true;
		    }
		 
		},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("出现异常！");
	    }
	});
	return isOk;
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: search,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
  	next_text: '下页',       //下一页按钮里text  
  	num_display_entries: 5, 
  	num_edge_entries: 2
	 });
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

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}
