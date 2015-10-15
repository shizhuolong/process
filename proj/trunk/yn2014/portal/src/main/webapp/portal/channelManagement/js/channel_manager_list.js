var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_RLZY_CHANNEL_MANAGER_UPDATEPART";
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
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#resetBtn").click(function(){
		$("#name").val("");
		$("#hq_chan_code").val("");
		$("#hq_chan_name").val("");
		$("#hr_id").val("");
		$("#unit_name").val("");
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hr_id = $.trim($("#hr_id").val());
	var unit_name = $.trim($("#unit_name").val());
	var deal_date = $.trim($("#deal_date").val());
	var month = $.trim($("#month").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelManager_queryMobPerson.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"name":name,
           	"hq_chan_code":hq_chan_code,
           	"hq_chan_name":hq_chan_name,
           	"hr_id":hr_id,
           	"unit_name":unit_name,
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
					+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
					+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>";
				//是否已经划分营服中心
				var isDivision = n['ISDIVISION'];
				//是否绑定
				var isBind = n['ISBIND'];
				//已划分营服中心
				if(isDivision == "1") {
					if(isGrantedNew(UPDATE_ROLE)) {
						//已绑定
						if(isBind == "1") {
							content += "<td class='operater'><a href='#'  deal_date='"+deal_date+"' group_id_code='"+n['GROUP_ID_CODE']+"' group_id_1='"+n['GROUP_ID_1']+"' unit_id='"+n['UNIT_ID']+"' id='"+n['ID']+"' hr_id='"+n['HR_ID']+"' onclick='bindPerson(this);'>修改</a>&nbsp;&nbsp;" +
							"<a href='#' deal_date='"+deal_date+"' group_id_code='"+n['GROUP_ID_CODE']+"' hr_id='"+n['HR_ID']+"' onclick='unBindPerson(this);'>解绑</a></td>";
						} else {
							content += "<td class='operater'><a href='#'  deal_date='"+deal_date+"' group_id_code='"+n['GROUP_ID_CODE']+"' group_id_1='"+n['GROUP_ID_1']+"' unit_id='"+n['UNIT_ID']+"' id='"+n['ID']+"' hr_id='"+n['HR_ID']+"' onclick='bindPerson(this);'>绑定</a>&nbsp;&nbsp;" +
							"<a href='#' deal_date='"+deal_date+"' group_id_code='"+n['GROUP_ID_CODE']+"' hr_id='"+n['HR_ID']+"' onclick='unBindPerson(this);'>解绑</a></td>";
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
				if(month!=deal_date){
					$(".operater").empty();
				}
			}else {
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
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
	var id = $(obj).attr("id");
	var group_id_code = $(obj).attr("group_id_code");
	var deal_date = $(obj).attr("deal_date");
	var url = $("#ctx").val()
			+ "/portal/channelManagement/jsp/channel_manager_bind_person.jsp?deal_date="+deal_date;
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('unit_id',unit_id);
	art.dialog.data('id',id);
	art.dialog.data('group_id_code',group_id_code);
	art.dialog.open(url,{
		id:'bindPersonDialog',
		width:'530px',
		height:'320px',
		lock:true,
		resize:false
	});
}

//解绑
function unBindPerson(ele) {
	var group_id_code = $(ele).attr("group_id_code");
	var deal_date =$(ele).attr("deal_date");
	art.dialog.confirm('您确定要进行解绑操作吗？',function(){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/channelManager_updateBindPerson.action",
			data:{
				"group_id_code":group_id_code,
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
	var name = $.trim($("#name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hr_id = $.trim($("#hr_id").val());
	var unit_name = $.trim($("#unit_name").val());
	var deal_date =  $.trim($("#deal_date").val());
	var sql = "";
	if(orgLevel == "1") {
		sql = "SELECT T.NAME,T.PHONE,T.UNIT_NAME,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE," +
				"T.HQ_CHAN_NAME,T.HR_ID " +
				"FROM PORTAL.TAB_PORTAL_MOB_PERSON T LEFT JOIN PORTAL.APDP_ORG T2 " +
				"ON (T.GROUP_ID_1 = T2.CODE AND T2.ORGLEVEL = 2) LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T.UNIT_ID = T3.UNIT_ID) WHERE T.LEV = 2 AND T.DEAL_DATE="+deal_date;
	}else if(orgLevel == "2") {
		sql = "SELECT T.NAME,T.PHONE,T.UNIT_NAME,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE," +
				"T.HQ_CHAN_NAME,T.HR_ID " +
				"FROM PORTAL.TAB_PORTAL_MOB_PERSON T LEFT JOIN PORTAL.APDP_ORG T2 " +
				"ON (T.GROUP_ID_1 = T2.CODE AND T2.ORGLEVEL = 2) " +
				"LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 ON (T.UNIT_ID = T3.UNIT_ID) " +
				"WHERE T.LEV = 2 AND T.GROUP_ID_1='"+code+"' AND T.DEAL_DATE="+deal_date;
	}else if(orgLevel == "3") {
		sql = "SELECT T.NAME,T.PHONE,T.UNIT_NAME,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE," +
				"T.HQ_CHAN_NAME,T.HR_ID " +
				"FROM PORTAL.TAB_PORTAL_MOB_PERSON T LEFT JOIN PORTAL.APDP_ORG T2 " +
				"ON (T.GROUP_ID_1 = T2.CODE AND T2.ORGLEVEL = 2) " +
				"LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 ON (T.UNIT_ID = T3.UNIT_ID) " +
				"WHERE T.LEV = 2 AND T.UNIT_ID='"+code+"'  AND T.DEAL_DATE="+deal_date;
	}else {
		sql = "SELECT T.NAME,T.PHONE,T.UNIT_NAME,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE," +
				"T.HQ_CHAN_NAME,T.HR_ID " +
				"FROM PORTAL.TAB_PORTAL_MOB_PERSON T LEFT JOIN PORTAL.APDP_ORG T2 " +
				"ON (T.GROUP_ID_1 = T2.CODE AND T2.ORGLEVEL = 2) " +
				"LEFT JOIN PCDE.TAB_CDE_GROUP_CODE T3 " +
				"ON (T.UNIT_ID = T3.UNIT_ID) WHERE 1=2 AND T.DEAL_DATE="+deal_date;
	}
	if(hq_chan_code != "") {
		sql += "AND T.HQ_CHAN_CODE='"+hq_chan_code+"' ";
	}
	if(hr_id != "") {
		sql += "AND T.HR_ID='"+hr_id+"' ";
	}
	if(name != "") {
		sql += "AND T.NAME LIKE '%"+name+"%' ";
	} 
	if(hq_chan_name != "") {
		sql += "AND T.HQ_CHAN_NAME LIKE '%"+hq_chan_name+"%' ";
	}
	if(unit_name != "") {
		sql += "AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	sql += " ORDER BY T.LEV, T.NAME";
	var showtext="Sheet";
   var showtext1="result";
   var _head=['姓名','联系电话','营服中心','地市名称','渠道编码','渠道名称','HR编码'];
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


