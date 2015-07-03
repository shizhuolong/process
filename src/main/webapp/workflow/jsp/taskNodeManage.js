
var taskId;
var uncheck;//保存取消的叶子节点id
var alcheck;//保存选中的叶子节点id
var pageSize = 12;
$(function(){
	loadData();
	
	function loadData(){
	    baseInfo.getDataBySelectIndex(0);
	   
	}
	
	//查询
	$("#searchBtn").click(function(){
		loadData();
	});
});

var baseInfo={
	
	//获取表格数据
	getDataBySelectIndex:function(pageNumber){
		var taskName = $("#taskName").val();
		pageNumber = pageNumber+1;
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:path+"/taskNode/task-node-manage!qryTaskNodeList.action",
			data:{
				"resultMap.page":pageNumber,
				"resultMap.rows":pageSize,
				"resultMap.taskName":taskName
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
		   		var content='';
		   		$.each(pages.rows,function(i,n){
					content	+=	'<tr>';
					content	+=	'<td style="text-align:center">'+(i+1)+'</td>';
					content	+=	'<td style="text-align:center">'+n["TASK_NAME"]+'</td>';
					content	+=	'<td style="text-align:center"><a href="javascript:void(0)" taskId="'+n["TASK_ID"]+'" taskName="'+n["TASK_NAME"]+'" onclick="configureApprover(this)">配置审批人</a></td>';
					content	+=	'</tr>';
				});
				if(content != "") {
					$("#dataBody").empty().html(content);
				}else {
					$("#dataBody").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("加载数据失败！");
		    }
	  });
	}
};

//分页插件
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

function configureApprover(element) {
	
	taskId = $(element).attr("taskId");
	var taskName = $(element).attr("taskName");
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskNode/task-node-manage!qryApproversOfTaskNode.action",
	    data:{
	    	taskId:taskId
		},
        success:function(data){
            updateNodeDep(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
	
	art.dialog({
		id:"departmentTreeDialog",
		title:"配置审批人员（"+taskName+"）",
		lock:true,
		width:320,
		height:230,
		content:document.getElementById("departmentDialog")
	}).show();
}


function updateNodeDep(data) {

	var nodeDeps = data;
	$.ajax({
        type:"POST",
        dataType:'json',
        cache:false,
        url:path+"/taskNode/task-node-manage!qryDepartmentTree.action",
	    data:{
        	level:-1
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    },
        success:function(zNodes){
			var dataSetting = {
				check: {
					enable: true,
					chkStyle:"checkbox",
					chkboxType: {"Y":"ps", "N":"s"}
				},
				async: {
					enable: true,
					url:path+"/taskNode/task-node-manage!qryDepartmentTree.action",
					autoParam:["id","level"],
					dataFilter: getDataChildren
				},
				view: {
					dblClickExpand: false
				},
				data: {
					simpleData: {
						enable: true,
						pIdKey: "pId"
					}
				},
				callback: {		
	   				beforeCheck: beforeCheckData,	
	   				onCheck: onCheckData,
	   				onNodeCreated: OnDataNodeCreated
	   			}
			};

			uncheck = new Array(); 
			alcheck = new Array();
			
			function getDataChildren(treeId, parentNode, childNodes) {
				$.each(childNodes,function(i,item){
					if(item.dLevel!=3) {
						item.isParent = true;
					}
					if(-1 != $.inArray(item.id,nodeDeps)){
						item.checked = true;
					}
				});			
				return childNodes;
			}

			function OnDataNodeCreated(event, treeId, treeNode) {
	   			if(-1 != $.inArray(treeNode.id,nodeDeps)){
		   			if('x'!=treeNode.dimCode){
   						var zTree = $.fn.zTree.getZTreeObj("treeNodeDep");
   						zTree.reAsyncChildNodes(treeNode, "add", false);		
	   				}
	   			}
		   	}

			function beforeCheckData(treeId, treeNode) {
		   		var checkStatus = treeNode.getCheckStatus();
	   			if(false == checkStatus.checked){
	   				checkChild(treeNode);
	   			}else {
	   				uncheckChild(treeNode);
	   			}
	   		    return true;
	   		};
	   		/**勾选节点后将节点下的所有叶子节点保存*/
	   		function checkChild(treeNode){		
		   		var result = new Array();
		   		getAllChildrenNodes(treeNode,result,"check");
		   		for(var i=0;i<result.length;i++) {
		   			if(-1==$.inArray(result[i],uncheck)) {
		   				alcheck.push(result[i]);		 
		   			}else {
		   				uncheck.splice($.inArray(result[i],uncheck),1); 
		   			} 
		   		}
		   	}

	   		/**取消节点后将节点下的所有叶子节点取消*/
	   		function uncheckChild(treeNode){		   			
	   			var result = new Array();
		   		getAllChildrenNodes(treeNode,result,"uncheck");
		   		for(var i=0;i<result.length;i++) {
		   			if(-1==$.inArray(result[i],alcheck)) {
	   					uncheck.push(result[i]);		 
		   			}else {
		   				alcheck.splice($.inArray(result[i],alcheck),1); //删除alcheck的元素
		   			} 
		   		}
		   	}
	   		/**获取节点的所有叶子节点*/
	   		function getAllChildrenNodes(treeNode,result,flag){
	   	       if (treeNode.isParent) {
		   	        var childrenNodes = treeNode.children;
		   	        if (childrenNodes) {
		   	            for (var i = 0; i < childrenNodes.length; i++) {
			   	            if(childrenNodes[i].dLevel==3) {//叶子节点
				   	            if("uncheck"==flag) {
					   	            if(childrenNodes[i].checked) {
		   	                			result.push(childrenNodes[i].id);
					   	            }
				   	            }else {
				   	            	result.push(childrenNodes[i].id);
				   	            }
			   	            }
		   	                result = getAllChildrenNodes(childrenNodes[i], result,flag);
		   	            }
		   	        }
		   	    }
		   	    return result;
	   		}
	   		function onCheckData(e, treeId, treeNode) {
		   		if(treeNode.dLevel == 3) {
		   			if(treeNode.checked==true){ 
		   				if(-1 == $.inArray(treeNode.id,uncheck)) {
		   					alcheck.push(treeNode.id);		 
			   			}else {
			   				uncheck.splice($.inArray(treeNode.id,uncheck),1);
			   			}  
		   			}else{ 
			   			if(-1 == $.inArray(treeNode.id,alcheck)) {
		   					uncheck.push(treeNode.id);		 
			   			}else {
			   				alcheck.splice($.inArray(treeNode.id,alcheck),1);
			   			}  
		   			} 
		   		}
		   		//alert("uncheck:"+uncheck+"   alcheck:"+alcheck);	
	   		}
						
			if(zNodes.length>0){
				for(var i=0;i<zNodes.length;i++){
	   				zNodes[i].isParent=true;
		   			if(-1 != $.inArray(zNodes[i].id,nodeDeps)){
		   				zNodes[i].checked = true;
		   			}
				}
	   		}	
			$.fn.zTree.init($("#treeNodeDep"), dataSetting, zNodes);
	   		//var zTree = $.fn.zTree.getZTreeObj("treeNodeDep");
			//zTree.reAsyncChildNodes(zTree.getNodes()[0], "add", false);		
        }
	});
}

function submit(){
	if(uncheck.length==0 && alcheck.length==0) {
		alert("没有勾选或取消人员信息！");
		return;
	}else {
		var uncheckStr = "";
		var alcheckStr = "";
		if(uncheck.length > 0) {
			uncheckStr = uncheck.join(',');
		}
		if(alcheck.length > 0) {
			alcheckStr = alcheck.join(',');
		}
		if(confirm("确认提交吗?")) {
			$.ajax({
		        type:"POST",
		        dataType:'json',
		        cache:false,
		        url:path+"/taskNode/task-node-manage!configureApproversOfTaskNode.action",
			    data:{
		        	taskId:taskId,
		        	uncheck:uncheckStr,
		        	alcheck:alcheckStr
				},
		        success:function(data){
		        	jQuery.unblockUI({fadeOut: 700});
		        	alert(data.msg);
		        	art.dialog({id:"departmentTreeDialog"}).close();
		        },
		    	error:function(XMLHttpRequest, textStatus, errorThrown){
		 		   alert("操作失败！"+textStatus);
		 		  jQuery.unblockUI({fadeOut: 700});
		 	    },
		        beforeSend: function(xhr) {
		            jQuery.blockUI({
		                  message: "<div style='text-align:center;'><h3>正在提交中，请稍等...</h3></div>",
		                  fadeIn: 700,
		                  centerY: true,
		                  showOverlay: true
	                });
		        }
			});
		}
	}
	return;
}

function cancel() {
	art.dialog({id:"departmentTreeDialog"}).close();
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

