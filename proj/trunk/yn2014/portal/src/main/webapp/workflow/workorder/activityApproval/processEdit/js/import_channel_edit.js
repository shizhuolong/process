var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	search(0);
	initFileDiv();
	initUpload();
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

function change(){
	$("#up_end_month").val(getEndMonth($("#up_start_month").val()));
}
function changeEndDateAdd(){
	$("#end_month").val(getEndMonth($("#start_month").val()));
}

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/contract/contract-process!listByWorkNo.action",
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
	                +"<td><a href='#' uu_id='"+isNull(n['ID'])+"' onclick='edit($(this));' style='color:#BA0C0C;'>修改</a></td>"
	                +"</tr>";
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

function edit(obj){
	var uu_id=$(obj).attr("uu_id");
	var formdiv=$('#updateFormDiv');
	var url = $("#ctx").val()+"/contract/contract-process!findById.action";
	$.get(url,
		  {id:uu_id},
		  function(data){
		  	 if(data!=null&&data!=""){
		  		var data=eval("("+data+")");
		  		$("#up_hq_chan_code").val(data.HQ_CHAN_CODE);
		  		$("#up_hq_chan_name").val(data.HQ_CHAN_NAME);
		  		$("#up_start_month").val(data.START_MONTH);
		  		$("#up_end_month").val(data.END_MONTH);
		  		$("#up_assess_target").val(data.ASSESS_TARGET);
		  		$("#up_rate_three").val(data.RATE_THREE);
		  		$("#up_rate_six").val(data.RATE_SIX);
		  		$("#up_rate_nine").val(data.RATE_NINE);
		  		$("#up_rate_twelve").val(data.RATE_TWELVE);
		  		$("#up_ysdz_xs").val(data.YSDZ_XS);
		  		$("#up_zx_bt").val(data.ZX_BT);
		  		$("#up_hz_ms").val(data.HZ_MS);
		  		$("#up_fw_fee").val(data.FW_FEE);
		  	 }
	      });
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 400,
		height : 500,
		closed : false,
		cache : false,
		modal : true,
		maximizable : true,
		buttons: {
	        "保存": function() {
	        	$(this).dialog("close");
	        	formdiv.hide();
	        	var url = $("#ctx").val()+"/contract/contract-process!updateChannel.action";
	        	var hq_chan_code=$.trim($("#up_hq_chan_code").val());
	        	var hq_chan_name=$.trim($("#up_hq_chan_name").val());
	        	var start_month=$.trim($("#up_start_month").val());
	        	var end_month=$.trim($("#up_end_month").val());
	        	var assess_target=$.trim($("#up_assess_target").val());
	        	var rate_three=$.trim($("#up_rate_three").val());
	        	var rate_six=$.trim($("#up_rate_six").val());
	        	var rate_nine=$.trim($("#up_rate_nine").val());
	        	var rate_twelve=$.trim($("#up_rate_twelve").val());
	        	var ysdz_xs=$.trim($("#up_ysdz_xs").val());
	        	var zx_bt=$.trim($("#up_zx_bt").val());
	        	var hz_ms=$.trim($("#up_hz_ms").val());
	        	var fw_fee=$.trim($("#up_fw_fee").val());
	        	var form = $("#updateForm");
	        	var b=validateNotNull(form,2);
	        	if(b){
	        	$.post(
	        			 url,
	        			 {
	        			   hq_chan_code:hq_chan_code,
	        			   hq_chan_name:hq_chan_name,
	        			   start_month:start_month,
	        			   end_month:end_month,
	        			   assess_target:assess_target,
	        			   rate_three:rate_three,
	        			   rate_six:rate_six,
	        			   rate_nine:rate_nine,
	        			   rate_twelve:rate_twelve,
	        			   id:uu_id,
	        			   ysdz_xs:ysdz_xs,
	        			   zx_bt:zx_bt,
	        			   hz_ms:hz_ms,
	        			   fw_fee:fw_fee
	        			 },
	        			 function(data,status){
	        				var win = artDialog.open.origin;//来源页面
	        			    var data = eval(data);
	        			    if(data!=""&&null!=data){
	        			    	win.art.dialog({
	        			    		title:"修改失败",
	        			    		icon:'error',
	        			    		content:data,
	        			    		width:'100px',
	        			    		height:'200px',
	        			    		lock:true,
	        			    		ok: function () {
	        							win.art.dialog.close();
	        			   		    }
	        			    	});
	        			    }else{
	        			    	win.art.dialog({
	        			   			title: '提示',
	        			   		    content: '修改成功',
	        			   		    icon: 'succeed',
	        			   		    lock: true,
	        			   		    ok: function () {
	        			   		    	//var win = artDialog.open.origin;//来源页面
	        			   		    	win.art.dialog.close();
	        							//调用父页面的search方法，刷新列表
	        							win.search(0);
	        			   		    }
	        			   		});
	        			    }
	        			 });
	        	}
	        },
	        "返回": function() {
	        	$(this).dialog("close");
	        }
	    }
	});
}

function addChannel(){
	var addDiv=$('#addFormDiv');
	addDiv.show();
	$('#addFormDiv').dialog({
		id: 'addDialog',
		title : '添加',
		width : 400,
		height : 500,
		modal: true,
		buttons: {
	        "保存": function() {
	        	$(this).dialog("close");
	        	addDiv.hide();
	        	var url = $("#ctx").val()+"/contract/contract-process!addChannel.action";
	        	var hq_chan_code=$.trim($("#hq_chan_code").val());
	        	var hq_chan_name=$.trim($("#hq_chan_name").val());
	        	var start_month=$.trim($("#start_month").val());
	        	var end_month=$.trim($("#end_month").val());
	        	var assess_target=$.trim($("#assess_target").val());
	        	var rate_three=$.trim($("#rate_three").val());
	        	var rate_six=$.trim($("#rate_six").val());
	        	var rate_nine=$.trim($("#rate_nine").val());
	        	var rate_twelve=$.trim($("#rate_twelve").val());
	        	var ysdz_xs=$.trim($("#ysdz_xs").val());
	        	var zx_bt=$.trim($("#zx_bt").val());
	        	var hz_ms=$.trim($("#hz_ms").val());
	        	var fw_fee=$.trim($("#fw_fee").val());
	        	var form = $("#addForm");
	        	var b=validateNotNull(form,1);
	        	if(b){
	        	$.post(
	        			 url,
	        			 {
	        			   hq_chan_code:hq_chan_code,
	        			   hq_chan_name:hq_chan_name,
	        			   start_month:start_month,
	        			   end_month:end_month,
	        			   assess_target:assess_target,
	        			   rate_three:rate_three,
	        			   rate_six:rate_six,
	        			   rate_nine:rate_nine,
	        			   rate_twelve:rate_twelve,
	        			   ysdz_xs:ysdz_xs,
	        			   zx_bt:zx_bt,
	        			   hz_ms:hz_ms,
	        			   fw_fee:fw_fee
	        			 },
	        			 function(data,status){
	        				var win = artDialog.open.origin;//来源页面
	        			    var data = eval(data);
	        			    if(data!=""&&null!=data){
	        			    	win.art.dialog({
	        			    		title:"添加失败",
	        			    		icon:'error',
	        			    		content:data,
	        			    		width:'550px',
	        			    		height:'250px',
	        			    		lock:true,
	        			    		ok: function () {
	        							win.art.dialog.close();
	        			   		    }
	        			    	});
	        			    }else{
	        			    	win.art.dialog({
	        			   			title: '提示',
	        			   		    content: '添加成功',
	        			   		    icon: 'succeed',
	        			   		    lock: true,
	        			   		    ok: function () {
	        			   		    	//var win = artDialog.open.origin;//来源页面
	        			   		    	win.art.dialog.close();
	        							//调用父页面的search方法，刷新列表
	        							win.search(0);
	        			   		    }
	        			   		});
	        			    }
	        			 });
	        	}
	        },
	        "返回": function() {
	          $(this).dialog("close");
	        }
		}
	});
}

//校验form中带name的input非空
function validateNotNull(form,type){
	var values = form.serializeArray(); 
	for (var i=0;i<values.length;i++){ 
			if(values[i].value=="" || values[i].value==null){ 
				alert("必填项不能为空");
				return false;
			}
	}
	var rate_three;
	var rate_six;
	var rate_nine;
	var rate_twelve;
	
	if(type==1){
		rate_three=$.trim($("#rate_three").val());
		rate_six=$.trim($("#rate_six").val());
		rate_nine=$.trim($("#rate_nine").val());
		rate_twelve=$.trim($("#rate_twelve").val());
	}else{
		rate_three=$.trim($("#up_rate_three").val());
		rate_six=$.trim($("#up_rate_six").val());
		rate_nine=$.trim($("#up_rate_nine").val());
		rate_twelve=$.trim($("#up_rate_twelve").val());
	}
	if(rate_three.indexOf("%") == -1||rate_six.indexOf("%") == -1
    		||rate_nine.indexOf("%") == -1||rate_twelve.indexOf("%") == -1){
		alert("百分数请加上百分号%！");
		return false;
	}
	rate_three=rate_three.replace("%","");
	rate_six=rate_six.replace("%","");
	rate_nine=rate_nine.replace("%","");
	rate_twelve=rate_twelvereplace("%","");
	if(parseInt(rate_three)>100||parseInt(rate_six)>100||parseInt(rate_nine)>100||parseInt(rate_twelve)>100){
		alert("百分数填写不能大于100%！");
		return false;
	}
	return true;
}

//导入excel
function importExcel() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/import_channel_excel.jsp";
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'渠道考核合同导入',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/contract/contract-process!downfile.action";
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

function initFileDiv(){
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"post",
		dataType:'json',
        cache:false,
        async:false,
		url:path+'/contract/contract-process!queryFiles.action',
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

function downFile(fileName,filePath){
	fileName=fileName.replace(/%/g,"%25");
    filePath=filePath.replace(/%/g,"%25");
	location.href = $("#ctx").val()+"/processUpload/process-upload!download.action?filePath="+encodeURI(encodeURI(filePath))+"&fileName="+encodeURI(encodeURI(fileName));
}

function delFile(filePath){
	$.ajax({
		type:"post",
		dataType:'json',
		data:{
			filePath:filePath
	    },
        cache:false,
		url:path+'/processUpload/process-upload!deleteFile.action',
		success:function(data){
			if(data.success) {
				window.location.reload();
			}
		},
		error:function(XMLResponse){
			alert(XMLResponse);
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

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}