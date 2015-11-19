var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_PROCESSTIME_CHANNEL_RESOURCE_UPDATEPART";
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
	//查询渠道信息
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#resetBtn").click(function(){
		$("#hq_chan_name").val("");
		$("#hq_chan_code").val("");
		$("#is_default").val("");
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var is_default = $.trim($("#is_default option:selected").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_listChannel.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"hq_chan_code":hq_chan_code,
           	"hq_chan_name":hq_chan_name,
           	"is_default":is_default
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
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
				+"<td>"+isNull(n['GROUP_ID_4_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>";
				//是否已经划分营服中心
				var isDivision = n['ISDIVISION'];
				if(isGrantedNew(UPDATE_ROLE)) {
					//已划分
					if(isDivision == "1") {
						content += "<td><a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' onclick='channelDivide(this);'>修改渠道归属</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
					} else {
						content += "<td><a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' onclick='channelDivide(this);'>渠道归属划分</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
					}
				}else {
					content += "<td><a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
				}
				
				content+="</tr>";
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

//渠道划分
function channelDivide(ele) {
	var group_id_1 = $(ele).attr("group_id_1");
	var group_id_4 = $(ele).attr("group_id_4");
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('group_id_4',group_id_4);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_resource_divide.jsp";
	art.dialog.open(url,{
		id:'channelDivideDialog',
		width:'410px',
		height:'310px',
		lock:true,
		resize:false
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

//查询详细信息
function showDetails(ele) {
	var group_id_4 = $(ele).attr("group_id_4");
	var url = $("#ctx").val()+"/channelManagement/channelResource_loadChanlInfo.action?group_id_4="+group_id_4;
	window.parent.openWindow("渠道详细信息",'funMenu',url);
	/*var group_id_4 = $(ele).attr("group_id_4");
	var myDialog = art.dialog({
		id:'stationInfo',
		width:'465px',
		height:'350px',
		padding:'0 0',
		title:'渠道详细信息',
		lock:true,
		resize:false
	});
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_queryChanelInfo.action",
		data:{
			"group_id_4":group_id_4
	   	}, 
	   	success:function(data){
	   		var content = "<table style='width:100%;margin-top: 5px;' id='nRtable'>";
	   		content+="<tr>";
	   		content+="<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>地市名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GROUP_ID_1_NAME+"</td>" +
	   				"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>营服中心</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].UNIT_NAME+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GROUP_ID_4_NAME+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].HQ_CHAN_CODE+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道经理</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].NAME)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道经理联系电话</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].PHONE)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道属性1</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].CHN_CDE_1_NAME)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道属性2</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].CHN_CDE_2_NAME)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道属性3</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].CHN_CDE_3_NAME)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道属性4</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].CHN_CDE_4_NAME)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>经度</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].LOG_NO)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>纬度</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].LAT_NO)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>渠道状态</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].LOG_NO)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>总部结算渠道ID</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].HQ_PAY_CHNL_ID)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>结算渠道名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].PAY_CHNL_NAME)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>是否接入联通受理系统</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].IS_INPUT_SYSTEM)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>接入系统数量</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].SYSTEM_NUM)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>是否有协议</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].IS_SIGN)+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>是否发展人</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].IS_DEVELOPER)+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 100px;background: #d8f0e5;'>是否迷你厅</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].IS_MINI_HALL)+"</td></tr>"
	   		content += "</table>";
	   		myDialog.content(content);// 填充对话框内容
	   		//myDialog.close();
		},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});*/
}

function downloadExcel() {
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var is_default = $.trim($("#is_default option:selected").val());
	var sql = "";
	if(orgLevel=="1") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,                        "+
		"        CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                            "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1                                                                                   ";
	}else if(orgLevel == "2") {
	    sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,                        "+
		"        CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                            "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND T.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == "3") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,                 "+
		"        CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                            "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND T.UNIT_ID = '"+code+"' ";
	}else {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,                 "+
		"        CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                            "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND 1=2 ";
	}
	if(hq_chan_name != "") {
		sql += " AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%' ";
	}
	if(hq_chan_code != "") {
		sql += "AND T.HQ_CHAN_CODE='"+hq_chan_code+"' ";
	}
	if(is_default != "") {
		sql += "AND T2.IS_DEFAULT='"+is_default+"' ";
	}
	sql += "ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','渠道名称','渠道编码','是否划分营服中心','状态'];
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
