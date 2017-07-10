var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	search(0);
	initFileDiv();
	$("a[name='downFile']").click(function(){
		downFile($(this).attr("fileName"),$(this).attr("filePath"));
	});
	$("#searchBtn").click(function(){
		search(0);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	var channel_name=$.trim($("#channel_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/unsupported/unsupported!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "businessKey":businessKey,
           "channel_name":channel_name
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
	               /* +"<td>"+isNull(n['DEPT_PTYPE'])+"</td>"*/
	                +"<td>"+isNull(n['COMM_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBJECTID'])+"</td>"
	                +"<td>"+isNull(n['SVCTP'])+"</td>"
	                +"<td>"+isNull(n['FEE'])+"</td>"
	                +"<td>"+isNull(n['TOTALFEE'])+"</td>"
	                +"<td>"+isNull(n['NETFEE'])+"</td>"
	                +"<td>"+isNull(n['PAY_ADDRESS'])+"</td>"
	                +"<td>"+isNull(n['REMARK'])+"</td>"
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
				html+="<li><a name='downFile' style='color:blue;font-size:15px;cursor:pointer' filePath='"+data[i].FILE_PATH+"' fileName='"+data[i].FILE_NAME+"'>"+data[i].FILE_NAME+"</a></li>";
			}
			html+="</ol>";
			$("#fileDiv").append($(html));
		},
		error:function(XMLResponse){
			alert("加载文件列表失败！");
		}
	});
}


function downFile(fileName,filePath){
	fileName=fileName.replace(/%/g,"%25");
    filePath=filePath.replace(/%/g,"%25");
	location.href = $("#ctx").val()+"/unsupported/unsupported!downloadFile.action?filePath="+encodeURI(encodeURI(filePath))+"&fileName="+encodeURI(encodeURI(fileName));
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

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function downsAll(){
	var businessKey = $("#businessKey").val();
	var channel_name = $("#channel_name").val(); 
	var downSql="SELECT       "+
	"BILLINGCYCLID,           "+
	"CHANNEL_NAME,            "+
	"AGENTID,                 "+
	"DEPT_PTYPE,              "+
	"COMM_TYPE,               "+
	"SUBJECTID,               "+
	"SVCTP,                   "+
	"FEE,                     "+
	"TOTALFEE,                "+
	"NETFEE,                  "+
	"REMARK                   "+
	"FROM PAPP.TAB_COMM_IMPORT"+
	" WHERE INIT_ID ='"+businessKey+"'";
	if(channel_name!=""){
		downSql+=" AND CHANNEL_NAME LIKE '%"+channel_name+"%'";
	}
	var showtext = '系统未支撑补贴';
	var title=[["结算账期","渠道名称","渠道编码","佣金大类","佣金科目","业务类型","佣金金额","总额","净额","数据去向","备注"]];
	downloadExcel(downSql,title,showtext);
}
