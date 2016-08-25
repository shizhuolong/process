var pageSize = 15;
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_YJJK_ZYJK_YLQD_UPDATEPART";
$(function(){
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	search(0);
	init_org();
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#orgName").val("");
		$("#hq_chan_code").val("");
		$("#group_id_4_name").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var group_id_1 = $.trim($("#orgName").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var group_id_4_name = $.trim($("#group_id_4_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/freeChannel/free-channel!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "group_id_1":group_id_1,
           "hq_chan_code":hq_chan_code,
           "group_id_4_name":group_id_4_name
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
				+"<td>"+isNull(n['GROUP_ID_4_NAME'])+"</td>";
				if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' onclick='channelDivide(this);'>渠道归属划分</a></td>";
				} else {
					content+="<td>&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='5'>暂无数据</td></tr>");
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

function init_org() {
	$.ajax({
		type:"post",
		dataType:"json",
		url:$("#ctx").val()+"/freeChannel/free-channel!searchSelectOrg.action",
		data:{},
		success:function(data){
			str = "<option value=''>请选择地市</option>";
			for(var i=0;i<data.length;i++){
				/*if(i==0){
					str = "<option value='"+data[i].CODE+"'>"+data[i].ORGNAME+"</option>";
				}else{
					str += "<option value='"+data[i].CODE+"'>"+data[i].ORGNAME+"</option>";
				}*/
				str += "<option value='"+data[i].CODE+"'>"+data[i].ORGNAME+"</option>";
			}
			$("#orgName").empty().append(str);
		},
		error:function(){
			/*alert("网络延迟");*/
		}
	});
}

//渠道划分
function channelDivide(ele) {
	var group_id_1 = $(ele).attr("group_id_1");
	var group_id_4 = $(ele).attr("group_id_4");
	var login_name = $("#login_name").val();
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('group_id_4',group_id_4);
	art.dialog.data('login_name',login_name);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_resource_divide.jsp";
	art.dialog.open(url,{
		id:'channelDivideDialog',
		width:'410px',
		height:'310px',
		lock:true,
		resize:false
	});
}

function downloadExcel() {
	var group_id_1 = $.trim($("#orgName").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var group_id_4_name = $.trim($("#group_id_4_name").val());
	var sql = "SELECT T.GROUP_ID_1_NAME, T.UNIT_NAME, T.HQ_CHAN_CODE, T.GROUP_ID_4_NAME " +
	"FROM PCDE.TAB_CDE_CHANL_HQ_CODE T, PCDE.TAB_CDE_GROUP_CODE T1 " +
	"WHERE T.UNIT_ID = T1.UNIT_ID AND T1.IS_DEFAULT = 1 AND T.IS_SIGN = 1 ";
	if(orgLevel == 2) {
		sql += " AND T.GROUP_ID_1 = '"+code+"' ";
	} else if(orgLevel == 3){
		sql += " AND T.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == 4) {
		sql += " AND 1 = 2 ";
	}
	if(group_id_1 != "") {
		sql += " AND T.GROUP_ID_1 = '"+group_id_1+"' ";
	}
	if(hq_chan_code != "") {
		sql += " AND T.HQ_CHAN_CODE = '"+hq_chan_code+"' ";
	}
	if(group_id_4_name != "") {
		sql += " AND T.GROUP_ID_4_NAME LIKE '%"+group_id_4_name+"%' ";
	}
	sql += " ORDER BY T.GROUP_ID_1";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市','营服中心','渠道编码','渠道名称'];
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

