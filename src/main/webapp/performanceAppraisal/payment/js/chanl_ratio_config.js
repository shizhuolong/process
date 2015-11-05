var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_QDXSPZ_UPDATEPART";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/assessment/chanlRatioConfig_listTreeNode.action",
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
		$("#hq_chan_code").val("");
		$("#group_id_4_name").val("");
		$("#status").val("");
		$("#ratio").val("");
		$("#server_ratio").val("");
	});
	$("#downloadExcel").click(downloadExcel);
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var group_id_4_name = $.trim($("#group_id_4_name").val());
	var status = $.trim($("#status").val());
	var ratio = $.trim($("#ratio").val());
	var server_ratio = $.trim($("#server_ratio").val());
	var month = $("#month").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/assessment/chanlRatioConfig_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "hq_chan_code":hq_chan_code,
           "group_id_4_name":group_id_4_name,
           "status":status,
           "ratio":ratio,
           "server_ratio":server_ratio,
           "month":month
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
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_4_NAME'])+"</td>"
				+"<td>"+isNull(n['CHNL_TYPE'])+"</td>"
				+"<td>"+isNull(n['RATIO'])+"</td>"
				+"<td>"+isNull(n['SERVER_RATIO'])+"</td>"
				+"<td>"+isNull(n['STATUS'])+"</td>";
				if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' hq_chan_code='"+n['HQ_CHAN_CODE']+"' month='"+month+"' onclick='editChanlConfig(this);'>修改</a></td>";
				} else {
					content+="<td>&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//编辑渠道系数
function editChanlConfig(ele) {
	var hq_chan_code = $(ele).attr("hq_chan_code");
	var month=$(ele).attr("month");
	art.dialog.data('hq_chan_code',hq_chan_code);
	art.dialog.data('month',month);
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/chanl_ratio_config_update.jsp";
	art.dialog.open(url,{
		id:'updateChanlConfig',
		width:'630px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'编辑渠道系数'
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
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var group_id_4_name = $.trim($("#group_id_4_name").val());
	var status = $.trim($("#status").val());
	var ratio = $.trim($("#ratio").val());
	var server_ratio = $.trim($("#server_ratio").val());
	var month = $("#month").val();
	var sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME," +
			"T3.CHANL_TYPE_NAME as CHNL_TYPE,TO_CHAR(T2.RATIO, 'fm9999999990.0000') AS RATIO," +
			"TO_CHAR(T2.SERVER_RATIO, 'fm9999999990.0000') AS SERVER_RATIO," +
			"DECODE(T1.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止','') AS STATUS " +
			"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T LEFT JOIN PCDE.TB_CDE_CHANL_HQ_CODE T1 " +
			"ON (T.FD_CHNL_CODE = T1.FD_CHNL_CODE) LEFT JOIN PTEMP.ALL_CHL_RATIO_LIST T2 " +
			"ON (T.FD_CHNL_CODE = T2.HQ_CHANL_CODE) " +
			"LEFT JOIN PTEMP.TB_TEMP_JCDY_CHANL_TYPE T3 " +
			"ON (T2.CHNL_TYPE = T3.CHANL_TYPE_CODE) WHERE T.IS_SIGN = 1 AND T2.DEAL_DATE='"+month+"' ";
			if(orgLevel == 2) {
				sql += "AND T.GROUP_ID_1 = '"+code+"' ";
			}
			if(orgLevel == 3) {
				sql += "AND T.UNIT_ID = '"+code+"' ";
			}
			if(orgLevel == 4) {
				sql += "AND 1=2 ";
			}
	if(hq_chan_code != "") {
		sql += " AND T.HQ_CHAN_CODE = '"+hq_chan_code+"' ";
	}
	if(group_id_4_name != "") {
		sql += " AND T.GROUP_ID_4_NAME LIKE '%"+group_id_4_name+"%' ";
	}
	if(status != "") {
		if(status=="100") {
			sql += " AND T1.STATUS NOT IN ('00', '01', '10', '11', '12') ";
		}else {
			sql += " AND T1.STATUS = '"+status+"' ";
		}
	}
	if(ratio != "") {
		if(ratio == "1") {
			sql += " AND T2.RATIO IS NOT NULL ";
		}else {
			sql += " AND T2.RATIO IS NULL ";
		}
	}
	if(server_ratio != "") {
		if(server_ratio == "1") {
			sql += " AND T2.SERVER_RATIO IS NOT NULL ";
		}else {
			sql += " AND T2.SERVER_RATIO IS NULL ";
		}
	}
	sql += " ORDER BY T.GROUP_ID_1, T.UNIT_ID, T.GROUP_ID_4";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','渠道编码','渠道名称','渠道类型','渠道系数','服务系数','渠道状态'];
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



