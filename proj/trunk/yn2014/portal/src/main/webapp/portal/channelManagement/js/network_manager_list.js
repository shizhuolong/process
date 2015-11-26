var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_RLZY_NETWORK_MANAGER_UPDATEPART";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/channelManager_listTreeNode.action",
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
	if(orgLevel==3 || orgLevel==4) {
		isp = false
	}
	var zNodes =[{ id:orgId, pId:-1, name:initOrgName,code:code,orgLevel:orgLevel,open:true, isParent:isp}];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
	$(".level0").trigger("click");
	//查询人员信息列表
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#unit_name").val("");
		$("#std_6_id").val("");
		$("#std_6_name").val("");
		$("#name").val("");
		$("#account").val("");
		$("#hr_id").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var unit_name = $.trim($("#unit_name").val());
	var std_6_id = $.trim($("#std_6_id").val());
	var std_6_name = $.trim($("#std_6_name").val());
	var name = $.trim($("#name").val());
	var account = $.trim($("#account").val());
	var hr_id = $.trim($("#hr_id").val());
	var deal_date = $.trim($("#deal_date").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/networkManager_listNetworkPerson.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "unit_name":unit_name,
           "std_6_id":std_6_id,
           "std_6_name":std_6_name,
           "name":name,
           "account":account,
           "hr_id":hr_id,
           "deal_date":deal_date
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
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['STD_6_ID'])+"</td>"
				+"<td>"+isNull(n['STD_6_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['ACCOUNT'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>";
				//是否已经划分营服中心
				var isDivision = n['ISDIVIDE'];
				//是否绑定
				var isBind = n['ISBIND'];
				//已划分营服中心
				if(isDivision == "1") {
					if(isGrantedNew(UPDATE_ROLE)) {
						//已绑定
						if(isBind == "1") {
							content += "<td>" +
									"<a href='#' orgId='"+n['ID']+"' group_id_1='"+n['GROUP_ID_1']+"' group_id_1_name='"+n['GROUP_ID_1_NAME']+"' unit_name='"+n['UNIT_NAME']+"' unit_id='"+n['UNIT_ID']+"' id='"+n['STD_6_ID']+"' onclick='bindPerson(this);'>修改</a>&nbsp;&nbsp;" +
									"<a href='#' id='"+n['STD_6_ID']+"' hr_id='"+n['HR_ID']+"' onclick='unBindPerson(this);'>解绑</a>" +
									"</td>";
						} else {
							content += "<td><a href='#' orgId='"+n['ID']+"' group_id_1='"+n['GROUP_ID_1']+"' group_id_1_name='"+n['GROUP_ID_1_NAME']+"' unit_name='"+n['UNIT_NAME']+"' unit_id='"+n['UNIT_ID']+"' id='"+n['STD_6_ID']+"' onclick='bindPerson(this);'>绑定</a>&nbsp;&nbsp;";
						}
					}else {
						content += "<td>&nbsp;&nbsp;&nbsp;</td>";
					}
					
				} else {
					content += "<td>&nbsp;&nbsp;&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='10'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//绑定人员
function bindPerson(obj) {
	var group_id_1 = $(obj).attr("group_id_1");
	var unit_id = $(obj).attr("unit_id");
	var std_6_id = $(obj).attr("id");
	var orgId = $(obj).attr("orgId");
	var group_id_1_name = $(obj).attr("group_id_1_name");
	var unit_name = $(obj).attr("unit_name");
	var deal_date = $.trim($("#deal_date").val());
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/network_manager_bind_person.jsp";
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('unit_id',unit_id);
	art.dialog.data('std_6_id',std_6_id);
	art.dialog.data('orgId',orgId);
	art.dialog.data('group_id_1_name',group_id_1_name);
	art.dialog.data('unit_name',unit_name);
	art.dialog.data('deal_date',deal_date);
	art.dialog.open(url,{
		id:'networkBindPersonDialog',
		width:'530px',
		height:'330px',
		lock:true,
		resize:false
	});
}

//解绑
function unBindPerson(ele) {
	var std_6_id = $(ele).attr("id");
	var old_hr_id = $(ele).attr("hr_id");
	var deal_date = $.trim($("#deal_date").val());
	art.dialog.confirm('您确定要进行解绑操作吗？',function(){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/networkManager_deleteBindPerson.action",
			data:{
				"std_6_id":std_6_id,
				"old_hr_id":old_hr_id,
				"deal_date":deal_date
		   	}, 
		   	success:function(data){
		   		art.dialog({
		   			title: '提示',
		   		    content: data.msg,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
						search(0);
		   		    }
		   		});
		   	}
		});
	},function(){
		art.dialog.tips('执行取消绑定操作');
	});
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

function downloadExcel() {
	var unit_name = $.trim($("#unit_name").val());
	var std_6_id = $.trim($("#std_6_id").val());
	var std_6_name = $.trim($("#std_6_name").val());
	var name = $.trim($("#name").val());
	var account = $.trim($("#account").val());
	var hr_id = $.trim($("#hr_id").val());
	var deal_date = $.trim($("#deal_date").val());
	
	var sql = "";
	if(orgLevel == "1") {
		sql = "SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.STD_6_ID,T1.STD_6_NAME,T2.NAME,T2.ACCOUNT," +
				"T2.PHONE,T2.HR_ID " +
				"FROM PCDE.TAB_CDE_6_STD T1 LEFT JOIN PORTAL.TAB_PORTAL_NET_PERSON T2 " +
				"ON (T1.STD_6_ID = T2.STD_ID_6) LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T1.UNIT_ID = T3.UNIT_ID) LEFT JOIN PORTAL.APDP_ORG T4 ON (T3.GROUP_ID_1=T4.CODE) " +
				"WHERE T1.STATE = 'U' AND T1.IS_SIGN = 1 ";
	}else if(orgLevel == "2") {
		sql = "SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.STD_6_ID,T1.STD_6_NAME,T2.NAME,T2.ACCOUNT," +
				"T2.PHONE,T2.HR_ID " +
				"FROM PCDE.TAB_CDE_6_STD T1 LEFT JOIN PORTAL.TAB_PORTAL_NET_PERSON T2 " +
				"ON (T1.STD_6_ID = T2.STD_ID_6) LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T1.UNIT_ID = T3.UNIT_ID) LEFT JOIN PORTAL.APDP_ORG T4 " +
				"ON (T3.GROUP_ID_1=T4.CODE) WHERE T1.STATE = 'U' AND T1.IS_SIGN = 1 " +
				"AND T1.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == "3") {
		sql = "SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.STD_6_ID,T1.STD_6_NAME,T2.NAME,T2.ACCOUNT," +
				"T2.PHONE,T2.HR_ID " +
				"FROM PCDE.TAB_CDE_6_STD T1 LEFT JOIN PORTAL.TAB_PORTAL_NET_PERSON T2 " +
				"ON (T1.STD_6_ID = T2.STD_ID_6) LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T1.UNIT_ID = T3.UNIT_ID) LEFT JOIN PORTAL.APDP_ORG T4 " +
				"ON (T3.GROUP_ID_1=T4.CODE) WHERE T1.STATE = 'U' AND T1.IS_SIGN = 1 " +
				"AND T1.UNIT_ID = '"+code+"' ";
	}else { 
		sql = "SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.STD_6_ID,T1.STD_6_NAME,T2.NAME,T2.ACCOUNT," +
				"T2.PHONE,T2.HR_ID " +
				"FROM PCDE.TAB_CDE_6_STD T1 LEFT JOIN PORTAL.TAB_PORTAL_NET_PERSON T2 " +
				"ON (T1.STD_6_ID = T2.STD_ID_6) LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T1.UNIT_ID = T3.UNIT_ID) LEFT JOIN PORTAL.APDP_ORG T4 " +
				"ON (T3.GROUP_ID_1=T4.CODE) WHERE T1.STATE = 'U' AND T1.IS_SIGN = 1 AND 1=2 ";
	}
	if(unit_name != "") {
		sql += " AND T1.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(std_6_id != "") {
		sql += " AND T1.STD_6_ID = '"+std_6_id+"' ";
	}
	if(std_6_name != "") {
		sql += " AND T1.STD_6_NAME LIKE '%"+std_6_name+"%' ";
	}
	if(name != "") {
		sql += " AND T2.NAME LIKE '%"+name+"%' ";
	}
	if(account != "") {
		sql += " AND T2.ACCOUNT = '"+account+"' ";
	}
	if(hr_id != "") {
		sql += " AND T2.HR_ID = '"+hr_id+"' ";
	}
	if(deal_date != "") {
		sql += " AND T2.DEAL_DATE = '"+deal_date+"' ";
	}
	sql += " ORDER BY T2.GROUP_ID_1, T2.UNIT_ID, T2.STD_ID_6";
	var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','小区编码','小区名称','姓名','帐号','联系电话','HR编码'];
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



