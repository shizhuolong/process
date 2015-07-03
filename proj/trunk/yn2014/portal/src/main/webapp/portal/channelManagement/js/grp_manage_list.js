var pageSize = 15;
var groupId='-1';
var level=null;
$(function() {
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/grpManager_initTreeNode.action",
			autoParam : ["groupId=groupId","lev=level" ]
		},
		callback:{
			onClick:function(event,treeId,treeNode) {
				groupId=treeNode.groupId;
				level=treeNode.lev;
				search(0);
			},
			onAsyncSuccess:function(event, treeId, treeNode, msg) {
			    if(!treeNode){
			    	$(".level0").trigger("click");
			    }
			}
		}
	};
	$.fn.zTree.init($("#grptree"), setting);
	//查询人员信息列表
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("INPUT[name='name']").val("");
		$("INPUT[name='chanCode']").val("");
		$("INPUT[name='chanName']").val("");
		$("INPUT[name='phone']").val("");
		$("#type").val("");
		$("INPUT[name='developer']").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	
	var name=null,chanCode=null,chanName=null,type=null,phone=null;
	name=$.trim($("INPUT[name='name']").val());
	chanCode=$.trim($("INPUT[name='chanCode']").val());
	chanName=$.trim($("INPUT[name='chanName']").val());
	phone=$.trim($("INPUT[name='phone']").val());
	type=$.trim($("#type").val());
	var developer=$.trim($("INPUT[name='developer']").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_queryGrpPerson.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "groupId":groupId,
           "level":level,
           "name":name,
           "phone":phone,
           "chanCode":chanCode,
           "chanName":chanName,
           "type":type,
           "developer":developer
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['user_type'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['DEVELOPER'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").html(content);
			}else {
				$("#dataBody").html("<tr><td colspan='7'>暂无数据</td></tr>");
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
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function downloadExcel() {
	var name=$.trim($("INPUT[name='name']").val());
	var chanCode=$.trim($("INPUT[name='chanCode']").val());
	var chanName=$.trim($("INPUT[name='chanName']").val());
	var phone=$.trim($("INPUT[name='phone']").val());
	var type=$.trim($("#type").val());
	var developer=$.trim($("INPUT[name='developer']").val());
	
	var sql = "SELECT CASE T.USER_TYPE WHEN '1' THEN '渠道经理' WHEN '2' THEN '客户经理' " +
			"ELSE '其他' END as user_type,T.NAME, T.PHONE," +
			"T.DEVELOPER,T.UNIT_NAME, T.HQ_CHAN_CODE, T.HQ_CHAN_NAME " +
			"FROM PORTAL.TAB_PORTAL_GRP_PERSON T WHERE 1=1 ";
	if(level=="1") {
	}else if(level == "2") {
		sql += "AND T.Group_Id_1='"+groupId+"' ";
	}else if(level == "3") {
		sql += "AND T.UNIT_ID='"+groupId+"' ";
	}else if(level == "4") {
		sql += "AND T.UNIT_ID='"+groupId+"' ";
	}
	if(type != "") {
		sql += "AND T.User_Type='"+type+"' ";
	}
	if(name != "") {
		sql += "AND T.Name like '%"+name+"%' ";
	}
	if(phone != "") {
		sql += "AND T.Phone like '%"+phone+"%' ";
	}
	if(chanCode != "") {
		sql += "AND T.Hq_Chan_Code like '%"+chanCode+"%' ";
	}
	if(chanName != "") {
		sql += "AND T.Hq_Chan_Name like '%"+chanName+"%' ";
	}
	if(developer != "") {
		sql += "AND T.DEVELOPER = '"+developer+"' ";
	}
	sql += " ORDER BY T.HQ_CHAN_CODE";
	var showtext="Sheet";
   var showtext1="result";
   var _head=['类型','姓名','联系电话','发展人编码','营服中心','渠道编码','渠道名称'];
   loadWidowMessage(1);
   _execute(3001,{type:12,
		     data:{
		    	  sql:sql,
		    	  contname:_head,
		    	  startRow:1,
		    	  startCol:0,
		    	  cols:-1,
		    	  sheetname:showtext,
		    	  excelModal:'reportModel.xls'
		     }     
	},function(res){
		loadWidowMessage(0);
		 click_flag=0;
		 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext1+'.xls'))].join('');
		 window.location.href=url;
	});
	
}

function _execute(type, parameter, callback, msg, dom){
   $.Project.execute(type, parameter, callback, msg, dom);
}

/**
 * 程序锁屏信息，1为加载，其他为去除锁屏信息
 * @param flag
 * @return
 */
function loadWidowMessage(flag){
	if(flag == 1){
		$.messager.progress({
			text:'正在处理数据，请稍等...',
			interval:100
		}); 
	}else{
		$.messager.progress('close'); 
	}
}

