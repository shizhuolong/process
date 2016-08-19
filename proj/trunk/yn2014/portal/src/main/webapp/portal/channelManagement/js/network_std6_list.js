var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_WLZY_NETWORK_STD6_UPDATEPART";
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
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#std_6_id").val("");
		$("#std_6_name").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var std_6_id = $.trim($("#std_6_id").val());
	var std_6_name = $.trim($("#std_6_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/networkStd6_listNetworkStd6.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"std_6_id":std_6_id,
           	"std_6_name":std_6_name
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
				+"<td>"+isNull(n['STD_6_ID'])+"</td>"
				+"<td>"+isNull(n['STD_6_NAME'])+"</td>"
				+"<td>"+isNull(n['HOUSE_PE'])+"</td>"
				+"<td>"+isNull(n['COVER_HOUSE_PE'])+"</td>"
				+"<td>"+isNull(n['JD'])+"</td>"
				+"<td>"+isNull(n['WD'])+"</td>"
				+"<td>"+isNull(n['ZW_NAME'])+"</td>"
				+"<td>"+isNull(n['ZW_NAME_NUM'])+"</td>"
				+"<td>"+isNull(n['SERVICE_NAME'])+"</td>"
				+"<td>"+isNull(n['SERVICE_NUM'])+"</td>";
				//是否划分小区归属
				var isDivide = n['IS_DIVIDE'];
				if(isGrantedNew(UPDATE_ROLE)) {
					if(isDivide == "1") {
						content += "<td style='text-align:center;'><a href='#' std_6_id='"+n['STD_6_ID']+"' group_id_1='"+n['GROUP_ID_1']+"' onclick='networkDivide(this);'>修改小区归属</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' std_6_name='"+n['STD_6_NAME']+"' std_6_id='"+n['STD_6_ID']+"' onclick='edit(this);'>编辑</a></td>";
					} else {
						content += "<td style='text-align:center;'><a href='#' std_6_id='"+n['STD_6_ID']+"' group_id_1='"+n['GROUP_ID_1']+"' onclick='networkDivide(this);'>小区归属划分</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' std_6_name='"+n['STD_6_NAME']+"' std_6_id='"+n['STD_6_ID']+"' onclick='edit(this);'>编辑</a></td>";
					}
				}else {
					content += "<td>&nbsp;</td>";
				}
				
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='13'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//编辑
function edit(ele) {
	var std_6_id = $(ele).attr("std_6_id");
	var std_6_name = $(ele).attr("std_6_name");
	art.dialog.data('std_6_id',std_6_id);
	art.dialog.data('std_6_name',std_6_name);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/network_std6_update.jsp";
	art.dialog.open(url,{
		id:'networkUpdateDialog',
		width:'660px',
		height:'230px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'编辑名单制小区信息'
	});
}

//小区归属划分
function networkDivide(ele) {
	var std_6_id = $(ele).attr("std_6_id");
	var group_id_1 = $(ele).attr("group_id_1");
	var login_name =$("#login_name").val();
	art.dialog.data('std_6_id',std_6_id);
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('login_name',login_name);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/network_std6_divide.jsp";
	art.dialog.open(url,{
		id:'networkDivideDialog',
		width:'410px',
		height:'320px',
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

function downloadExcel() {
	var std_6_id = $.trim($("#std_6_id").val());
	var std_6_name = $.trim($("#std_6_name").val());
	var sql = "";
	if(orgLevel=="1") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.STD_6_ID," +
				"T.STD_6_NAME," +
				"T.HOUSE_PE,T.COVER_HOUSE_PE,T.JD,T.WD,T.ZW_NAME," +
				"T.ZW_NAME_NUM,T.SERVICE_NAME,T.SERVICE_NUM " +
				"FROM PCDE.TAB_CDE_6_STD T,PCDE.TAB_CDE_GROUP_CODE T2 " +
				"WHERE T.UNIT_ID = T2.UNIT_ID AND T.STATE = 'U' AND T.IS_SIGN = 1 ";
	}else if(orgLevel == "2") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.STD_6_ID," +
				"T.STD_6_NAME, " +
				"T.HOUSE_PE,T.COVER_HOUSE_PE,T.JD,T.WD,T.ZW_NAME," +
				"T.ZW_NAME_NUM,T.SERVICE_NAME,T.SERVICE_NUM " +
				"FROM PCDE.TAB_CDE_6_STD T,PCDE.TAB_CDE_GROUP_CODE T2 " +
				"WHERE T.UNIT_ID = T2.UNIT_ID AND T.STATE = 'U' AND T.IS_SIGN = 1 " +
				"AND T.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == "3") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.STD_6_ID," +
				"T.STD_6_NAME, " +
				"T.HOUSE_PE,T.COVER_HOUSE_PE,T.JD,T.WD,T.ZW_NAME," +
				"T.ZW_NAME_NUM,T.SERVICE_NAME,T.SERVICE_NUM " +
				"FROM PCDE.TAB_CDE_6_STD T,PCDE.TAB_CDE_GROUP_CODE T2 " +
				"WHERE T.UNIT_ID = T2.UNIT_ID AND T.STATE = 'U' AND T.IS_SIGN = 1 " +
				"AND T.UNIT_ID = '"+code+"' ";
	}else {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME," +
				"T.STD_6_ID,T.STD_6_NAME, " +
				"T.HOUSE_PE,T.COVER_HOUSE_PE,T.JD,T.WD,T.ZW_NAME," +
				"T.ZW_NAME_NUM,T.SERVICE_NAME,T.SERVICE_NUM " +
				"FROM PCDE.TAB_CDE_6_STD T,PCDE.TAB_CDE_GROUP_CODE T2 " +
				"WHERE T.UNIT_ID = T2.UNIT_ID AND T.STATE = 'U' AND T.IS_SIGN = 1 AND 1=2 ";
	}
	if(std_6_id != "") {
		sql += " AND T.STD_6_ID = '"+std_6_id+"' ";
	}
	if(std_6_name != "") {
		sql += " AND T.STD_6_NAME LIKE '%"+std_6_name+"%' ";
	}
	sql += " ORDER BY T.GROUP_ID_1, T.UNIT_ID, T.STD_6_ID"
	var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','名单制小区编码','名单制小区名称','住户数','覆盖住户数','经度','纬度','装维联系人','装维联系人电话','业务办理联系人','业务办理联系人号码'];
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


