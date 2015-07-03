var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_PROCESSTIME_NOT-REATY-MANAGER_UPDATEPART";
$(function() {
	$("#exportBtn").click(function(){
		exportExcel();
	});
	$("#addBtn").click(function(){
		add();
	});
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/notReatyManager_listTreeNode.action",
			autoParam : ["id=orgId","orgLevel=orgLevel","code=code"]
		},
		callback:{
			onClick:function(event,treeId,treeNode) {
				orgId = treeNode.id;
				orgLevel = treeNode.orgLevel;
				code = treeNode.code;
				search(0);
			}
		}
	};
	var isp = true;
	if(orgLevel>=3) {
		isp = false
	}
	var zNodes =[{ id:orgId, pId:-1, name:initOrgName,code:code,orgLevel:orgLevel,open:true, isParent:isp}];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
	$(".level0").trigger("click");
	$("#searchBtn").click(function(){
		search(0);
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var chanlName = $.trim($("#chanlName").val());
	var chanlCode = $.trim($("#chanlCode").val());
	var unitName = $.trim($("#unitName").val());
	var status = $.trim($("#status").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/notReatyManager_list.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"chanlName":chanlName,
           	"chanlCode":chanlCode,
           	"unitName":unitName,
           	"status":status
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
				+"<td>"+isNull(n['CHANLNAME'])+"</td>"
				+"<td>"+isNull(n['CHANLID'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['AGENT_NAME'])+"</td>"
				+"<td>"+isNull(n['AGENT_TEL'])+"</td>";
				
				if(isGrantedNew(UPDATE_ROLE)) {
					content += "<td><a href='#'  onclick='view(\""+n['CHANLID']+"\");'>查看</a>&nbsp;&nbsp;" +
					"<a href='#' onclick='edit(\""+n['CHANLID']+"\");'>修改</a>&nbsp;&nbsp;" ;
					if(n['STATE']==1){
						content+="<a href='#' onclick='cancel(\""+n['CHANLID']+"\",0);'>注销</a>&nbsp;&nbsp;";
					}else{
						content+="<a href='#' onclick='cancel(\""+n['CHANLID']+"\",1);'>恢复</a>&nbsp;&nbsp;";
					}
				}else {
					content += "<td><a href='#'  onclick='view(\""+n['CHANLID']+"\");'>查看</a>&nbsp;&nbsp;";
				}
				
				content+="</td></tr>";
				
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='8'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function edit(chanlId){
	window.location.href=$("#ctx").val()+"/channelManagement/notReatyManager_add.action?action=add&id="+chanlId;
}
function view(chanlId){
	window.location.href=$("#ctx").val()+"/channelManagement/notReatyManager_add.action?action=view&id="+chanlId;
}
function cancel(chanlId,state){
	var msg="注销";
	if(state==1){
		msg="恢复";
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/notReatyManager_delUnit.action",
		data:{
			"model.CHANLID":chanlId,
			"model.state":state
		}, 
	   	success:function(data){
	   		if(data){
	   			if(data.result>0){
	   				alert(msg+"成功");
	   				search(0);
	   			}else{
	   				alert(msg+"失败");
	   			}
	   			//在提交时要验证一下TOP_GROUP_ID_4与TOP_GROUP_ID_4_NAME的chanlCode是否一致
	   		}else{
	   			alert(msg+"失败");
	   		}
	   },
	   	error:function(){
	   		alert(msg+"失败");
	   	}
	});
}
function add(){
	window.location.href=$("#ctx").val()+"/channelManagement/notReatyManager_add.action";
}
function exportExcel(){
	alert("导出");
}
//分页
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
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}
function exportExcel() {
	var chanlName = $.trim($("#chanlName").val());
	var chanlCode = $.trim($("#chanlCode").val());
	var unitName = $.trim($("#unitName").val());
	var status = $.trim($("#status").val());
	var sql = "";
		sql+="SELECT ";
		sql+=" T.CHANLNAME, ";
		sql+=" T.CHANLID, ";
		sql+=" CASE T.STATE WHEN '1' THEN '有效' ELSE '无效' END STATE, ";
		sql+=" T.GROUP_ID_1_NAME, ";
		sql+=" T.UNIT_NAME, ";
		sql+=" T.TOP_GROUP_ID_4_NAME, ";
		sql+=" T.UP_CHANL_HQ_CODE, ";
		sql+=" T.AGENT_NAME, ";
		sql+=" T.AGENT_TEL, ";
		sql+=" T.HR_ID, ";
		sql+=" T.AGTMGR_NAME, ";
		sql+=" T.AGTMGR_TEL, ";
		sql+=" T.CREATE_TIME, ";
		sql+=" T.HAMLET, ";
		sql+=" CASE T.CITY_TYPE WHEN '1' THEN '城市' ELSE '乡村' END CITYTYPE, ";
		sql+=" T.LNG, ";
		sql+=" T.LAT ";
		sql+="FROM ";
		sql+="  PORTAL.TAB_PORTAL_NOTREATY_CHANL T ";
		sql+="WHERE  1=1 "; 
	var where="";
	if(orgLevel==1){
		where+=" AND T.GROUP_ID_0='"+code+"' ";
	}else if(orgLevel==2){
		where+=" AND T.GROUP_ID_1='"+code+"' ";
	}else if(orgLevel==3){
		where+=" AND T.UNIT_ID='"+code+"' ";
	}else if(orgLevel>3){
		where+=" AND 1=2 ";
	}
	if(status&&status!=""){
		where+=" AND T.STATE='"+status+"' ";
	}
	if(chanlName&&chanlName!=""){
		where+=" AND CHANLNAME LIKE '%"+chanlName+"%' ";
	}
	if(chanlCode&&chanlCode!=""){
		where+=" AND T.CHANLID LIKE '%"+chanlCode+"%' ";
	}
	if(unitName&&unitName!=""){
		where+=" AND T.UNIT_NAME LIKE '%"+unitName+"%' ";
	}
	var orderby=" ORDER BY T.GROUP_ID_1_NAME, T.UNIT_NAME,T.CHANLID ";	
	
	sql+=where;
	sql+=orderby;

	var showtext="Sheet";
	var showtext1="result";

	var _head=['渠道名称',
	           '渠道编码',
	           '渠道状态',
	           '地市',
	           '营服中心',
	           '上级渠道名称',
	           '上级渠道编码',
	           '渠道经理',
	           '渠道经理电话',
	           'HR编码',
	           '管理人员姓名',
	           '管理人员电话',
	           '录入时间',
	           '行政村',
	           '城乡标识',
	           '经度',
	           '维度'];
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
function loadWidowMessage(flag) {
	if (flag == 1) {
		$.messager.progress({
			text : '正在处理数据，请稍等...',
			interval : 100
		});
	} else {
		$.messager.progress('close');
	}
}

