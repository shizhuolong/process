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
	                +"</tr>";
				});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='13'>暂无数据</td></tr>");
			}
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
		url:path+'/contract/contract-process!queryFiles.action',
		data:{
			businessKey:businessKey
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
	location.href = $("#ctx").val()+"/processUpload/process-upload!download.action?filePath="+encodeURI(encodeURI(filePath))+"&fileName="+encodeURI(encodeURI(fileName));
}

function downsAll(){
	var businessKey = $("#businessKey").val();
	var downSql="SELECT                          "+
				"HQ_CHAN_CODE,                   "+
				"HQ_CHAN_NAME,                   "+
				"START_MONTH,                    "+
				"END_MONTH,                      "+
				"HZ_YEAR,                      "+
				"ASSESS_TARGET,                  "+
				"YSDZ_XS,                  "+
				"ZX_BT,                  "+
				"HZ_MS,                  "+
				"FW_FEE,                  "+
				"RATE_THREE,                     "+
				"RATE_SIX,                       "+
				"RATE_NINE,                      "+
				"RATE_TWELVE                     "+
				"FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL"+
	            " WHERE BUSINESS_KEY ='"+businessKey+"'";
	
	var showtext = '渠道考核合同审批数据';
	var title=[["渠道编码","渠道名称","开始月","结束月","合作年份","年考核指定金额","以收定支系数","装修补贴","合作模式","房屋租金（房屋补贴）","考核进度","","",""],
	           ["","","","","","","","","","","1-3月","1-6月","1-9月","1-12月"]];
	downloadExcel(downSql,title,showtext);
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
