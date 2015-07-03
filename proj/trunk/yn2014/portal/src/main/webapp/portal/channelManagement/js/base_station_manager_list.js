var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_WLZY_BASE_STATION_MANAGER_UPDATEPART";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/baseStation_listTreeNode.action",
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
	//查询营业人员信息列表
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#station_addr_name").val("");
		$("#station_addr_code").val("");
		$("#isDivide").val("");
	});
	$("#downloadExcel").click(downloadExcel);
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var station_addr_code = $.trim($("#station_addr_code").val());
	var station_addr_name = $.trim($("#station_addr_name").val());
	var isDivide = $.trim($("#isDivide option:selected").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/baseStation_queryStationList.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "station_addr_code":station_addr_code,
           "station_addr_name":station_addr_name,
           "isDivide":isDivide
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
				+"<td>"+isNull(n['STATIONNAME'])+"</td>"
				+"<td>"+isNull(n['STATION_ADDR_CODE'])+"</td>"
				+"<td>"+isNull(n['STATION_ADDR_NAME'])+"</td>";
				var is_divide = n['ISDIVIDE'];
				if(isGrantedNew(UPDATE_ROLE)) {
					//已划分
					if(is_divide == 0) {
						content += "<td><a href='#' group_id_1='"+n['GROUP_ID_1']+"' station_addr_code='"+n['STATION_ADDR_CODE']+"' onclick='stationDivide(this);'>修改归属</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' station_addr_code='"+n['STATION_ADDR_CODE']+"' onclick='showDetail(this);'>详细信息</a></td>";
					} else {
						content += "<td><a href='#' group_id_1='"+n['GROUP_ID_1']+"' station_addr_code='"+n['STATION_ADDR_CODE']+"' onclick='stationDivide(this);'>划分归属</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' station_addr_code='"+n['STATION_ADDR_CODE']+"' onclick='showDetail(this);'>详细信息</a></td>";
					}
				}else {
					content += "<td><a href='#' station_addr_code='"+n['STATION_ADDR_CODE']+"' onclick='showDetail(this);'>详细信息</a></td>";
				}
				
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//基站划分
function stationDivide(ele) {
	var group_id_1 = $(ele).attr("group_id_1");
	var station_addr_code = $(ele).attr("station_addr_code");
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('station_addr_code',station_addr_code);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/base_station_divide.jsp";
	art.dialog.open(url,{
		id:'stationDivideDialog',
		width:'410px',
		height:'330px',
		lock:true,
		resize:false
	});
}

//查看详细信息
function showDetail(ele) {
	var station_addr_code = $(ele).attr("station_addr_code");
	var myDialog = art.dialog({
		id:'stationInfo',
		width:'410px',
		height:'200px',
		padding:'0 0',
		title:'基站详细信息',
		lock:true,
		resize:false
	});
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/baseStation_queryStationInfo.action",
		data:{
			"station_addr_code":station_addr_code
	   	}, 
	   	success:function(data){
	   		var content = "<table style='width:100%;margin-top: 5px;' id='nRtable'>";
	   		content+="<tr>";
	   		content+="<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>地市名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GROUP_ID_1_NAME+"</td>" +
	   				"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>营服中心</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].UNIT_NAME+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>基站名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATIONNAME+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>基站编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATIONCODE+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>基站类型</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATIONTYPE+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_ADDR_NAME+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_ADDR_CODE+"</td>" +
   					"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>经度</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].LON+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>纬度</td><td colspan='3' style='height: 25px; padding: 0px;width: 150px;'>"+data[0].LAT+"</td></tr>" +
   					"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>基站地址</td><td colspan='3' style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_ADDR+"</td></tr>";
	   		content += "</table>";
	   		myDialog.content(content);// 填充对话框内容
	   		//myDialog.close();
		},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
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

//导出excel
function downloadExcel() {
	var station_addr_code = $.trim($("#station_addr_code").val());
	var station_addr_name = $.trim($("#station_addr_name").val());
	var isDivide = $.trim($("#isDivide option:selected").val());
	var sql = "SELECT " +
			"T.GROUP_ID_1_NAME, T.UNIT_NAME, T.STATIONNAME, T.STATION_ADDR_CODE, T.STATION_ADDR_NAME " +
			"FROM PORTAL.TAB_PORTAL_STATION T WHERE 1=1 ";
	if(orgLevel == 2) {
		sql += "AND T.GROUP_ID_1 = '"+code+"' ";
	}
	if(orgLevel == 3) {
		sql += "AND T.UNIT_ID = '"+code+"' ";
	}
	if(orgLevel == 4) {
		sql += "AND 1=2 ";
	}
	if(station_addr_code != "") {
		sql += "AND T.STATION_ADDR_CODE = '"+station_addr_code+"' ";
	}
	if(station_addr_name != "") {
		sql += "AND T.STATION_ADDR_NAME LIKE '%"+station_addr_name+"%' ";
	}
	if(isDivide == '0') {
		sql += "AND T.UNIT_ID IS NOT NULL ";
	}
	if(isDivide == '1') {
		sql += "AND T.UNIT_ID IS NULL ";
	}
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','基站名称','站址编码','站址名称'];
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



