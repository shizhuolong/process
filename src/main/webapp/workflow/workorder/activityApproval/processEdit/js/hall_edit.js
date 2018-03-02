var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	search(0);
	/*initFileDiv();
	initUpload();*/
	/*$("a[name='downFile']").click(function(){
		downFile($(this).attr("fileName"),$(this).attr("filePath"));
	});
	$("a[name='delFile']").click(function(){
		delFile($(this).attr("filePath"));
	});*/
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/personManagement/hall-mag-person!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
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
	   				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
					+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
					+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
					+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
					+"<td>"+isNull(n['NAME'])+"</td>"
					+"<td>"+isNull(n['HR_ID'])+"</td>"
					+"<td>"+isNull(n['F_USER_NAME'])+"</td>"
					+"<td>"+isNull(n['F_HR_ID'])+"</td>"
				    +"<td><a onclick='update($(this))' hq_chan_name='"+isNull(n['HQ_CHAN_NAME'])+"' deal_date='"+isNull(n['DEAL_DATE'])+"' hr_name='"+isNull(n['NAME'])+"' f_user_name='"+isNull(n['F_USER_NAME'])+"' f_hr_id='"+isNull(n['F_HR_ID'])+"' hr_id='"+isNull(n['HR_ID'])+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
				 		"<a onclick='del($(this))' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' deal_date='"+isNull(n['DEAL_DATE'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>";
					content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
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
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
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

//提交审批
function submitTask(){
	if(validate()) {
		art.dialog.confirm("您确定提交审批吗？",function(){
			var actNodeName = $("#nextDealer option:selected").text();
			$("#actNodeName").val(actNodeName);
			$("#isHavingFile").val(isHavingFile);
			$("#taskForm").form("submit",{
				url:$("#ctx").val()+'/personManagement/hall-mag-person!doSubmitTask.action',
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
				   		    content: "提交成功！",
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	search(0);
				   		    }
				   		});
					}
					return false;
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

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

function initFileDiv(){
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"post",
		dataType:'json',
        cache:false,
        async:false,
		url:path+'/personManagement/hall-mag-person!queryFiles.action',
		data:{
			businessKey:businessKey
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

function initUpload() {
	var businessKey = $("#businessKey").val();
	/*  注：上传路径 tomcat用jsessionid, weblogic 用portalSession [2013-05-09 H]*/
	$("#uploadify").uploadify({
		   'uploader'       : path+'/js/jqueryUpload/uploadify.swf',
		   'script'         : path+'/processUpload/process-upload!upload.action',//servlet的路径或者.jsp 这是访问servlet 'scripts/uploadif' 
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
		   'scriptData'     :{'paySession':paySession,'businessKey':businessKey},
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

function del(obj){
	var chooseMonth = obj.attr("deal_date");
	var hr_id=obj.attr("hr_id");
	var hq_chan_code=obj.attr("hq_chan_code");
	var path=$("#ctx").val();
	if(confirm('确认刪除吗?')){
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,//true是异步，false是同步
		cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
		url:path+"/personManagement/hall-mag-person!delMagPerson.action",
		data:{
	       "hr_id":hr_id,
	       "chooseMonth":chooseMonth,
	       "hq_chan_code":hq_chan_code
	   	}, 
	   	success:function(data){
	   		alert(data);
	   	    search(0);
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("请求出错！");
        }
	});
	}
}

function update(obj) {
	var businessKey = $("#businessKey").val();
	var url = $("#ctx").val()+"/portal/personManagement/jsp/hall_mag_person_update.jsp";
	var hr_id=obj.attr("hr_id");
	var hq_chan_code=obj.attr("hq_chan_code");
	var hq_chan_name=obj.attr("hq_chan_name");
	var hr_name=obj.attr("hr_name");
	var f_user_name=obj.attr("f_user_name");
	var f_hr_id=obj.attr("f_hr_id");
	var chooseMonth=obj.attr("deal_date");
	art.dialog.data('businessKey',businessKey);
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.data('hq_chan_code',hq_chan_code);
	art.dialog.data('hq_chan_name',hq_chan_name);
	art.dialog.data('hr_name',hr_name);
	art.dialog.data('f_user_name',f_user_name);
	art.dialog.data('f_hr_id',f_hr_id);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'250px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改营业厅人员'
	});
}