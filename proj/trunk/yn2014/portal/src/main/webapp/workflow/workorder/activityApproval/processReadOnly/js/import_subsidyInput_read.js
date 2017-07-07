var isNeedApprover = true;
var pageSize = 10;
var isHavingFile="notWithFile";
$(function(){
	search(0);
	initFileDiv();
	$("a[name='downFile']").click(function(){
		downFile($(this).attr("fileName"),$(this).attr("filePath"));
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/subsidyInput/subsidy-input!listByWorkNo.action",
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
					+"<td>"+isNull(n['DEVELOP_CHNL_CODE'])+"</td>"
	                +"<td>"+isNull(n['DEVELOP_CHNL_NAME'])+"</td>"
	                +"<td>"+isNull(n['PAY_CHNL_CODE'])+"</td>"
	                +"<td>"+isNull(n['PAY_CHNL_NAME'])+"</td>"
	                +"<td>"+isNull(n['BILLINGCYCLID'])+"</td>"
	                +"<td>"+isNull(n['CUST_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_WAY'])+"</td>"
	                +"<td>"+isNull(n['SUBSIDY_FEE'])+"</td>"
	                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
			}
			initTotalFee(); 
			initTotalChnl();
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function initTotalFee(){
	var workNo = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,//true是异步，false是同步
		cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
		url:$("#ctx").val()+"/subsidyInput/subsidy-input!queryTotalFeeByInitId.action",
		data:{
	           "workNo":workNo
		},
		success:function(data){
	   		$("#totalFee").text(data+"元");
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        	alert("加载数据失败！");
        }
	});
}

function initTotalChnl(){
	var workNo = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,//true是异步，false是同步
		cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
		url:$("#ctx").val()+"/subsidyInput/subsidy-input!queryTotalChnlByInitId.action",
		data:{
	           "workNo":workNo
		},
		success:function(data){
	   		$("#totalChnl").text(data+"个");
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function initFileDiv(){
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"post",
		dataType:'json',
        cache:false,
        async:false,
		url:path+'/subsidyInput/subsidy-input!queryFiles.action',
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
	location.href = $("#ctx").val()+"/subsidyInput/subsidy-input!downloadFile.action?filePath="+encodeURI(encodeURI(filePath))+"&fileName="+encodeURI(encodeURI(fileName));
}

function downsAll(){
	var businessKey = $("#businessKey").val();
	var downSql="SELECT DEVELOP_CHNL_CODE,DEVELOP_CHNL_NAME,PAY_CHNL_CODE,     "+
	"			PAY_CHNL_NAME,BILLINGCYCLID,CUST_TYPE,SUBSIDY_TYPE,SUBSIDY_WAY,"+
	"			SUBSIDY_FEE FROM PAPP.TAB_COMMI_SUBSIDY_INFO                   "+
	"			WHERE INIT_ID ='"+businessKey+"'";
	var showtext = '渠道补贴';
	var title=[["发展渠道编码","发展渠道名称","结算渠道编码","结算渠道名称","帐期","客户类型","补贴用途","补贴方式","补贴金额"]];
	downloadExcel(downSql,title,showtext);
}