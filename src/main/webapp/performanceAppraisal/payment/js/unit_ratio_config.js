var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_YFZXXSPZ_UPDATEPART";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/assessment/unitRatioConfig_listTreeNode.action",
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
		$("#unit_name").val("");
		$("#unit_ratio").val("");
	});
	$("#downloadExcel").click(downloadExcel);
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var unit_name = $.trim($("#unit_name").val());
	var unit_ratio = $.trim($("#unit_ratio").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/assessment/unitRatioConfig_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "unit_name":unit_name,
           "unit_ratio":unit_ratio
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
				+"<td>"+isNull(n['UNIT_RATIO'])+"</td>"
				+"<td>"+isNull(n['UNIT_MANAGER_RATIO'])+"</td>"
				+"<td>"+isNull(n['UNIT_HEAD_RATIO'])+"</td>";
				if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' unit_id='"+n['UNIT_ID']+"' unit_manager_ratio='"+n['UNIT_MANAGER_RATIO']+"' unit_head_ratio='"+n['UNIT_HEAD_RATIO']+"' onclick='editUnitConfig(this);'>修改</a></td>";
				} else {
					content+= "<td>&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//编辑营服中心系数
function editUnitConfig(ele) {
	var unit_id = $(ele).attr("unit_id");
	var unit_manager_ratio=$(ele).attr("unit_manager_ratio");
	var unit_head_ratio = $(ele).attr("unit_head_ratio");
	art.dialog.data('unit_id',unit_id);
	art.dialog.data('unit_manager_ratio',unit_manager_ratio);
	art.dialog.data('unit_head_ratio',unit_head_ratio);
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/unit_ratio_config_update.jsp";
	art.dialog.open(url,{
		id:'updateUnitConfig',
		width:'630px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'编辑营服中心系数'
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
	var unit_name = $.trim($("#unit_name").val());
	var unit_ratio = $.trim($("#unit_ratio").val());
	var sql = "SELECT T2.ORGNAME AS GROUP_ID_1_NAME,T1.UNIT_NAME," +
			"TO_CHAR(T1.UNIT_RATIO, 'fm9999999990.0000') AS UNIT_RATIO," +
			"TO_CHAR(T1.UNIT_MANAGER_RATIO, 'fm9999999990.0000') AS UNIT_MANAGER_RATIO," +
			"TO_CHAR(T1.UNIT_HEAD_RATIO, 'fm9999999990.0000') AS UNIT_HEAD_RATIO " +
			"FROM PCDE.TAB_CDE_GROUP_CODE T1 JOIN PORTAL.APDP_ORG T2 " +
			"ON (T1.GROUP_ID_1 = T2.CODE AND T2.ORGLEVEL = 2) WHERE 1=1 ";
	if(orgLevel == 2) {
		sql += " AND T1.GROUP_ID_1 = '"+code+"' ";
	}
	if(orgLevel == 3) {
		sql += " AND T1.UNIT_ID = '"+code+"' ";
	}
	if(orgLevel == 4) {
		sql += " AND 1=2 ";
	}
	if(unit_name != "") {
		sql += " AND T1.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(unit_ratio != "") {
		if(unit_ratio == "1") {
			sql += " AND T1.UNIT_RATIO IS NOT NULL ";
		}else {
			sql += " AND T1.UNIT_RATIO IS NULL ";
		}
	}
	sql += " ORDER BY T1.GROUP_ID_1, T1.UNIT_ID";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','营服中心系数','营服中心责任人系数','营业厅店长系数'];
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



