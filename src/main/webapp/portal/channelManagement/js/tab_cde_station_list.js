var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var dealdate="20150326";
$(function() {
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/tabStation_listTreeNode.action",
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
		isp = false;
	}
	var zNodes =[{ id:orgId, pId:-1, name:initOrgName,code:code,orgLevel:orgLevel,open:true, isParent:isp}];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
	$(".level0").trigger("click");
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
		url:$("#ctx").val()+"/channelManagement/tabStation_queryStationList.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "station_addr_code":station_addr_code,
           "station_addr_name":station_addr_name,
           "isDivide":isDivide,
           "dealdate":dealdate
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
	   			var unitid=isNull(n['UNITID']);
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_ID_NAME'])+"</td>"
				+"<td><a unitid="+unitid+" basetype='2' onclick='openOrderWindow(this)'>"+isNull(n['JZ_2G'])+"</a></td>"
				+"<td><a unitid="+unitid+" basetype='3' onclick='openOrderWindow(this)'>"+isNull(n['JZ_3G'])+"</a></td></tr>";
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
function openOrderWindow(element) {
    var unitid=$(element).attr("unitid");
    var basetype=$(element).attr("basetype");
 	window.parent.openWindow('基站详细信息','computer',$("#ctx").val()+'/portal/channelManagement/jsp/tab_cde_detail.jsp?unitid='+unitid+'&basetype='+basetype+'&code='+code+'&orgLevel='+orgLevel+'&dealdate='+dealdate); 		
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
		url:$("#ctx").val()+"/channelManagement/tabStation_queryStationInfo.action",
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
	var sql = "SELECT T.GROUP_ID_1_NAME, T.UNIT_ID_NAME, " +
			"COUNT(CASE WHEN T.STATION_TYPE_CODE = '2G' THEN T.STATION_SERIAL END)" +
			" JZ_2G,COUNT(CASE WHEN T.STATION_TYPE_CODE = '3G' THEN T.STATION_SERIAL END)" +
			" JZ_3G FROM PCDE.TAB_CDE_STATION_NE_ADDR_CODE T WHERE 1=1 "
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
		sql += "AND  T.UNIT_ID_NAME LIKE '%"+station_addr_code+"%' ";
	}
	if(station_addr_name != "") {
		sql += "AND T.GROUP_ID_1_NAME LIKE '%"+station_addr_name+"%' ";
	}
	if(dealdate != ""){
		sql+="AND TO_CHAR(T.DAY_STAMP,'YYYYMMDD') ="+dealdate+" ";
	}
	sql+="GROUP BY T.GROUP_ID_1_NAME, T.UNIT_ID,T.UNIT_ID_NAME";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','2G基站总数','3G基站总数'];
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



