var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	search(0);
	initFileDiv();
	initUpload();
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	$("#importExcel").click(function(){
		importExcel();
	});
	$("a[name='downFile']").click(function(){
		downFile($(this).attr("fileName"),$(this).attr("filePath"));
	});
	$("a[name='delFile']").click(function(){
		delFile($(this).attr("filePath"));
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var channel_name=$.trim($("#channel_name").val());
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/unsupported/unsupported!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "channel_name":channel_name,
           "businessKey":businessKey
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
					+"<td>"+isNull(n['BILLINGCYCLID'])+"</td>"
	                +"<td>"+isNull(n['CHANNEL_NAME'])+"</td>"
	                +"<td>"+isNull(n['AGENTID'])+"</td>"
	                /*+"<td>"+isNull(n['DEPT_PTYPE'])+"</td>"*/
	                +"<td>"+isNull(n['COMM_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBJECTID'])+"</td>"
	                +"<td>"+isNull(n['SVCTP'])+"</td>"
	                +"<td>"+isNull(n['FEE'])+"</td>"
	                +"<td>"+isNull(n['TOTALFEE'])+"</td>"
	                +"<td>"+isNull(n['NETFEE'])+"</td>"
	                +"<td>"+isNull(n['PAY_ADDRESS'])+"</td>"
	                +"<td>"+isNull(n['REMARK'])+"</td>"
	                +"<td><a href='#' bill_id='"+isNull(n['BILL_ID'])+"' fee='"+isNull(n['FEE'])+"' onclick='edit($(this));' style='color:#BA0C0C;'>修改</a></td>"
	                +"<td><a href='#' bill_id='"+isNull(n['BILL_ID'])+"' onclick='del($(this));' style='color:#BA0C0C;'>删除</a></td>"
	                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='13'>暂无数据</td></tr>");
			}
			initTotalFee();
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function initFileDiv(){
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"post",
		dataType:'json',
        cache:false,
        async:false,
		url:path+'/unsupported/unsupported!queryFiles.action',
		data:{
			initId:businessKey
		},
		success:function(data){
			var html="<ol>";
			for(var i=0;i<data.length;i++){
				html+="<li><a name='downFile' style='color:blue;font-size:15px;cursor:pointer' filePath='"+data[i].FILE_PATH+"' fileName='"+data[i].FILE_NAME+"'>"+data[i].FILE_NAME+"</a>&nbsp;<a name='delFile' style='color:red;font-size:15px;cursor:pointer' filePath='"+data[i].FILE_PATH+"'>删除</a></li>";
			}
			html+="</ol>";
			$("#fileDiv").empty().append($(html));
		},
		error:function(XMLResponse){
			alert("加载文件列表失败！");
		}
	});
}

function downFile(fileName,filePath){
	location.href = $("#ctx").val()+"/unsupported/unsupported!downloadFile.action?filePath="+encodeURI(encodeURI(filePath))+"&fileName="+encodeURI(encodeURI(fileName));
}

function delFile(filePath){
	$.ajax({
		type:"post",
		dataType:'json',
		data:{
			filePath:filePath
	    },
        cache:false,
		url:path+'/upload/upload!deleteFile.action',
		success:function(data){
			if(data.success) {
				window.location.reload();
				/*$("a[name='delFile']").click(function(){
					delFile($(this).attr("filePath"));
				});*/
			}
		},
		error:function(XMLResponse){
			alert(XMLResponse);
		}
	});
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

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function initTotalFee(){
	var workNo = $("#businessKey").val();
	var channel_name=$.trim($("#channel_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/unsupported/unsupported!queryTotalFeeByInitId.action",
		data:{
           "workNo":workNo,
           "channel_name":channel_name
	   	}, 
	   	success:function(data){
	   		$("#totalFee").text(data+"元");
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function edit(obj){
	var bill_id=$(obj).attr("bill_id");
    art.dialog.data('bill_id',bill_id);
	var fee=$(obj).attr("fee")
	$("#fee").val(fee);
	var formdiv=$('#updateFormDiv');
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 400,
		height : 100,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function del(obj){
	var bill_id=obj.attr("bill_id");
	if(confirm('确认刪除吗?')){
	  $.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			async: false,
			url:$("#ctx").val()+"/unsupported/unsupported!delEdit.action",
			data:{
	           "bill_id":bill_id
		   	}, 
		   	success:function(data){
		   		search(0);
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("出现异常，删除失败！");
		    }
	  });
	}
}

function save(){
	var bill_id=art.dialog.data('bill_id');
	$("#bill_id").val(bill_id);
	var url = $("#ctx").val()+'/unsupported/unsupported!update.action';
	var updateForm=$('#updateForm');
	updateForm.form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($(this).form('validate')==false){
				return false;
			}
		},
		success:function(data){
			var d = $.parseJSON(data);
			alert(d.msg);
			$('#updateFormDiv').dialog('close');
			search(0);
		}
	});

}
//导入excel
function importExcel() {
	var businessKey = $("#businessKey").val();
	var url = $("#ctx").val()+"/portal/unsupported/jsp/importExcel.jsp";
	art.dialog.data('businessKey',businessKey);
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'未支撑补贴审批导入',
		lock:true,
		resize:false
	});
}

function initUpload() {
	var initId = $("#businessKey").val();
	/*  注：上传路径 tomcat用jsessionid, weblogic 用portalSession [2013-05-09 H]*/
	$("#uploadify").uploadify({
		   'uploader'       : path+'/js/jqueryUpload/uploadify.swf',
		   'script'         : path+'/upload/upload!upload.action',//servlet的路径或者.jsp 这是访问servlet 'scripts/uploadif' 
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
		   'scriptData'     :{'initId':initId},
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
		url:path+'/upload/upload!beforeUpload.action',
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
		url:path+'/upload/upload!deleteFile.action',
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
	filePath = encodeURI(encodeURI(filePath));
	fileName = encodeURI(encodeURI(fileName));
	window.location.href=path+"/upload/upload!download.action?fileName="+fileName+"&filePath="+filePath;
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/unsupported/unsupported!downloadTemplate.action";
}

function cancel() {
	$("#updateFormDiv").dialog('close');
}