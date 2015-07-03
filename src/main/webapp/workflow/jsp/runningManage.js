
var pageSize = 15;
$(function(){
	loadData();
	
	function loadData(){
		baseInfo.listType = $("input[name='orderState'][checked]").val(); 
		baseInfo.workNo = $("#workNo").val();
		baseInfo.title = $("#workTitle").val();
		baseInfo.createTime = $("#createTime").val();
	    baseInfo.getDataBySelectIndex(0);
	    
	}
	
	$("#searchBtn").click(function(){
		loadData();
	});
	
	$("input[name='orderState']").change(function(){
		var orderState = $(this).val();
		baseInfo.listType = orderState;
		baseInfo.workNo = $("#workNo").val();
		baseInfo.title = $("#workTitle").val();
		baseInfo.createTime = $("#createTime").val();
		baseInfo.getDataBySelectIndex(0);
	});
});

var baseInfo={
	listType:"",
	workNo:"",
	title:"",
	createTime:"",

	getDataBySelectIndex:function(pageNumber){
	//	$("#dataBody").empty();
	//  $("#dialogid").show();
	//  $("#dialogid").dialog({title: '加载中...',modal:true,width:222,closeable:false});
		pageNumber = pageNumber+1;
		jQuery.blockUI({
			message: "<div style='text-align:center;'><h2>正在查询，请稍等...</h2></div>",
			fadeIn: 700,
			centerY: true,
			showOverlay: true
		});	
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:path+"/workflow/processInstance/process-instance!qryTraceProcessInstanceList.action",
			data:{
		           "vo.queryListType":baseInfo.listType,
		           "vo.displayPid":baseInfo.workNo,
		           "vo.title":baseInfo.title,
		           "vo.createTime":baseInfo.createTime+" 00:00:00",
		           "vo.pageNo":pageNumber,
		           "vo.pageSize":pageSize
		           //"wv.ProcessKey":processType
		   	}, 
		   	success:function(data){
				jQuery.unblockUI();
				var pages=data;
				if(pageNumber == 1) {
					initPagination(pages.totalCount);
				}
				 
				var tempData="";
				var content="";
				var url = path+"/workflow/work-flow!toProcessDoingDetail.action";
				$.each(pages.result,function(i,n){
					 
					content+="<tr "+(i%2!=0?"class='even'":"")+">"
					+"<td><form method='post' id='"+n['processInstanceId']+"' action='"+url+"'  enctype='multipart/form-data'>"
					+"<input type='hidden' value='"+n['actNodeKey']+"' name='workOrderVo.actNodeKey'/>"
					+"<input type='hidden' value='"+n['actNodeName']+"' name='workOrderVo.actNodeName'/>"
					+"<input type='hidden' value='"+n['assignee']+"' name='workOrderVo.assignee'/>"
					+"<input type='hidden' value='"+n['assigneeName']+"' name='workOrderVo.assigneeName'/>"
					+"<input type='hidden' value='"+n['businessKey']+"' name='workOrderVo.businessKey'/>"
					+"<input type='hidden' value='"+n['desc']+"' name='workOrderVo.desc'/>"
					+"<input type='hidden' value='"+n['editUrl']+"' name='workOrderVo.editUrl'/>"
					+"<input type='hidden' value='"+n['noEditUrl']+"' name='workOrderVo.noEditUrl'/>"
					+"<input type='hidden' value='"+n['passOrNot']+"' name='workOrderVo.passOrNot'/>"
					+"<input type='hidden' value='"+n['processInstanceId']+"' name='workOrderVo.processInstanceId'/>"
					+"<input type='hidden' value='"+n['processKey']+"' name='workOrderVo.processKey'/>"
					+"<input type='hidden' value='"+n['processName']+"' name='workOrderVo.processName'/>"
					+"<input type='hidden' value='"+n['queryListType']+"' name='workOrderVo.queryListType'/>"
					+"<input type='hidden' value='"+n['startMan']+"' name='workOrderVo.startMan'/>"
					+"<input type='hidden' value='"+n['startManName']+"' name='workOrderVo.startManName'/>"
					+"<input type='hidden' value='"+n['status']+"' name='workOrderVo.status'/>"
					+"<input type='hidden' value='"+n['taskDesc']+"' name='workOrderVo.taskDesc'/>"
					+"<input type='hidden' value='"+n['taskId']+"' name='workOrderVo.taskId'/>"
					+"<input type='hidden' value='"+n['title']+"' name='workOrderVo.title'/>"
					+"<input type='hidden' value='"+n['wayId']+"' name='workOrderVo.wayId'/>"
					+"<input type='hidden' value='"+n['displayPid']+"' name='workOrderVo.displayPid'/>"
					+"<input type='hidden' value='"+n['createTime']+"' name='workOrderVo.createTime'/>"
					+"</form>"
					+""+n['displayPid']+"</td>"
					+"<td>"+n['processName']+"</td>"
					+"<td><a href='#!' onclick='$(\"#"+n['processInstanceId']+"\").submit();'>"+n['title']+"</a></td>"
					+"<td>"+n['startManDeptName']+"</td>"
					+"<td>"+n['startManName']+"</td>"
					+"<td>"+n['createTime']+"</td>";
					content+="</tr>";
				});
				if(content != "") {
					$("#dataBody").html(content);
				}else {
					$("#dataBody").html("<tr><td colspan='6'>暂无数据</td></tr>");
				}
		   },
		   error:function(XMLHttpRequest, textStatus, errorThrown){
			   jQuery.unblockUI();
			   alert("加载数据失败！");
		   }
	  });
	}
};


function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
        callback: baseInfo.getDataBySelectIndex,
        items_per_page:pageSize,
        link_to:"###",
        prev_text: '上页',       //上一页按钮里text  
    	next_text: '下页',       //下一页按钮里text  
    	num_display_entries: 5, 
    	num_edge_entries: 2
	 });
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

