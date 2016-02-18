var pageSize = 15;
var orgLevel = "";
var code = "";
$(function() {
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	//查询营业人员信息列表
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(resetCon);
	$("#downloadExcel").click(downloadExcel);
	init_org();
	
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var startTime = $.trim($("#startTime").val());
	var endTime = $.trim($("#endTime").val());
	var queryOrgCode = $.trim($("#orgName option:selected").val());
	var realname = $.trim($("#realname").val());
	var username = $.trim($("#username").val());
	var appName = $.trim($("#appName").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/sysManager/loginStatistics!searchUserLoginTimes.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "startTime":startTime,
           "endTime":endTime,
           "queryOrgCode":queryOrgCode,
           "realname":realname,
           "username":username,
           "appName":appName
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
				+"<td>"+isNull(n['ORGNAME'])+"</td>"
				+"<td>"+isNull(n['REALNAME'])+"</td>"
				+"<td>"+isNull(n['USERNAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['TIMES'])+"</td>"
				+"<td>"+isNull(n['LOGINTIME'])+"</td>";
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
		url:$("#ctx").val()+"/sysManager/loginStatistics!searchSelectOrg.action",
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

//重置
function resetCon() {
	$("#orgName").val("");
	$("#realname").val("");
	$("#username").val("");
}

function downloadExcel() {
	var startTime = $.trim($("#startTime").val());
	var endTime = $.trim($("#endTime").val());
	var queryOrgCode = $.trim($("#orgName option:selected").val());
	var realname = $.trim($("#realname").val());
	var username = $.trim($("#username").val());
	var sql = "";
	if(orgLevel == 1) {
		sql = "SELECT T2.ORGNAME,T1.REALNAME,T.USERNAME,T1.PHONE,COUNT(T.USERNAME) AS TIMES," +
				"TO_CHAR(T3.LOGINTIME, 'yyyy-MM-dd hh24:mi:ss') AS LOGINTIME " +
				"FROM PORTAL.APDP_LOG_USERLOGIN T JOIN PORTAL.APDP_USER T1 " +
				"ON (T.USERNAME = T1.USERNAME) JOIN PORTAL.APDP_ORG T2 ON (T1.ORG_ID = T2.ID) " +
				"JOIN (SELECT T3.USERNAME, MAX(T3.LOGINTIME) LOGINTIME " +
				"FROM PORTAL.APDP_LOG_USERLOGIN T3 " +
				"WHERE TO_CHAR(T3.LOGINTIME, 'yyyymmdd') BETWEEN '"+startTime+"' AND '"+endTime+"' "+
				"GROUP BY T3.USERNAME) T3 ON (T.USERNAME = T3.USERNAME) WHERE T1.ENABLED = 1 " +
				"AND TO_CHAR(T.LOGINTIME, 'yyyymmdd') BETWEEN '"+startTime+"' AND '"+endTime+"' ";
				if(queryOrgCode != "") {
					sql += " AND T2.CODE = '"+queryOrgCode+"' ";
				}
				if(username != "") {
					sql += " AND T1.USERNAME = '"+username+"' ";
				}
				if(realname != "") {
					sql += " AND T1.REALNAME LIKE '%"+realname+"%' ";
				}
				sql += "GROUP BY T2.ORGNAME, T1.REALNAME, T.USERNAME, T1.PHONE, T3.LOGINTIME " +
						"ORDER BY COUNT(T.USERNAME) DESC";
	} else {
		sql = "SELECT T2.ORGNAME,T1.REALNAME,T.USERNAME,T1.PHONE,COUNT(T.USERNAME) AS TIMES," +
				"TO_CHAR(T3.LOGINTIME, 'yyyy-MM-dd hh24:mi:ss') AS LOGINTIME " +
				"FROM PORTAL.APDP_LOG_USERLOGIN T JOIN PORTAL.APDP_USER T1 " +
				"ON (T.USERNAME = T1.USERNAME) JOIN PORTAL.APDP_ORG T2 ON (T1.ORG_ID = T2.ID) " +
				"JOIN (SELECT T3.USERNAME, MAX(T3.LOGINTIME) LOGINTIME " +
				"FROM PORTAL.APDP_LOG_USERLOGIN T3 " +
				"WHERE TO_CHAR(T3.LOGINTIME, 'yyyymmdd') BETWEEN '"+startTime+"' AND '"+endTime+"' "+
				"GROUP BY T3.USERNAME) T3 ON (T.USERNAME = T3.USERNAME) WHERE T1.ENABLED = 1 " +
				"AND TO_CHAR(T.LOGINTIME, 'yyyymmdd') BETWEEN '"+startTime+"' AND '"+endTime+"' "+
				"AND EXISTS (SELECT 1 FROM (SELECT T.ID FROM PORTAL.APDP_ORG T " +
				"START WITH T.PARENT_ID = (SELECT ID FROM PORTAL.APDP_ORG T " +
				"WHERE T.CODE = '"+code+"') CONNECT BY PRIOR T.ID = T.PARENT_ID UNION " +
				"SELECT ID FROM PORTAL.APDP_ORG T WHERE T.CODE = '"+code+"') T5 " +
				"WHERE T5.ID = T2.ID)";
				if(queryOrgCode != "") {
					sql += " AND T2.CODE = '"+queryOrgCode+"' ";
				}
				if(username != "") {
					sql += " AND T1.USERNAME = '"+username+"' ";
				}
				if(realname != "") {
					sql += " AND T1.REALNAME LIKE '%"+realname+"%' ";
				}
				sql += "GROUP BY T2.ORGNAME, T1.REALNAME, T.USERNAME, T1.PHONE, T3.LOGINTIME " +
				"ORDER BY COUNT(T.USERNAME) DESC";
	}
   var showtext="Sheet";
   var showtext1="result";
   var _head=['用户归属','姓名','工号','联系电话','登录次数','最后登录时间'];
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



