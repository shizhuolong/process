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
					+"<td>"+isNull(n['REGION_NAME'])+"</td>"
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
	var appName = $.trim($("#appName").val());
	var sql = "SELECT                                                                      "+
				"       O.REGION_NAME,O.ORGNAME,                                            		   "+
				"       U.REALNAME,                                                                    "+
				"       U.USERNAME,                                                                    "+
				"       U.PHONE,                                                                       "+
				"       L.TIMES,                                                                       "+
				"       L.LOGINTIME                                                                    "+
				"  FROM (SELECT T.APPNAME,                                                             "+
				"               T.USERNAME,                                                            "+
				"               TO_CHAR(T.LOGINTIME, 'yyyymmdd') AS LOGINTIME,                         "+
				"               COUNT(T.USERNAME) AS TIMES                                             "+
				"          FROM PORTAL.APDP_LOG_USERLOGIN T                                            "+
				"         WHERE TO_CHAR(T.LOGINTIME, 'yyyymmdd') BETWEEN "+startTime+" AND "+endTime	+
				"           AND T.APPNAME = '/"+appName+"'"												+
				"         GROUP BY T.APPNAME, T.USERNAME, T.LOGINTIME) L,                              "+
				"       PORTAL.APDP_USER U,                                                            "+
				"       PORTAL.APDP_ORG O                                                              "+
				" WHERE UPPER(U.USERNAME) = UPPER(L.USERNAME)                                          "+
				"   AND U.ORG_ID = O.ID                                                                ";
	if(queryOrgCode!=null&&queryOrgCode!=''){
		sql+=" AND O.REGION_CODE ="+queryOrgCode;
	}
	if(realname!=null&&''!=realname){
		sql+=" AND U.REALNAME LIKE '%"+realname+"%'";
	}
	if(username!=null&&''!=username){
		sql+=" AND U.USERNAME ="+username;
	}
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市','营服中心','姓名','工号','联系电话','登录次数','最后登录时间'];
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



