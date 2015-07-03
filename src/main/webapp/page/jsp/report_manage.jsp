<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.User,org.apdplat.module.security.service.UserHolder,java.util.Date, java.util.Calendar, java.text.SimpleDateFormat"%>
<!DOCTYPE html>
<%
	User user = UserHolder.getCurrentLoginUser();
	String path = request.getContextPath(); 
	String loginno =user.getUsername();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
<title></title>
<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/reset.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/table2.css" />  
<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/btn.css"  />   
<link rel="stylesheet" type="text/css" href="<%=path%>/page/css/right.css"  />   
<script type="text/javascript" src="<%=path%>/page/js/common/jquery-1.3.2.min.js"></script> 
<script type="text/javascript" src="<%=path%>/page/js/report_manage.js"></script>
<style type="text/css">

tr td{
 padding-left:2px;
 padding-right:2px;
 word-break:break-all; /*支持IE，chrome，FF不支持 强制文字换行*/
 word-wrap:break-word;/*支持IE，chrome，FF*/ 
}

.input-form tr td{
  background-color: #ffffff;  
  border :1px solid #cebb9e; 
}
 
</style> 
<script type="text/javascript" >
	// 定义全局变量
	var rootPath = "<%=path%>";  
</script>
</head>

<body> 
	
<div class="search-div" style="height:28px;padding-top:10px;margin-top:-10px;"> 
 
      <input type="button" value=" 新增 " id='config_exp' class="b_foot" onclick="parent.openWindow('新增配置','computer','<%=path%>/page/jsp/report_config.jsp?op=add','')"/> 
      <a href="<%=path%>/page/jsp/downExcel.jsp?filePath=/page/down/doc/&fileName=help.doc&filedisplay=excel_help.doc"><span style="color:red;font-weight:bold;" title="通用数据录入平台 操作手册.doc">操作手册</span></a> 
      <span id="loading" style="display:yes;margin-left:100px;"><img src="<%=path%>/page/images/loading/load.gif" />&nbsp;<span id="loadWord">加载数据...</span></span> 
 
</div>

  <div class="work-div" style="margin-top:0px;">
	  <div id="demoDiv1">
          <div id="pageHtml"></div>
		 <div id="demoGrid1"> </div>
	 </div>
     <div class="clr"></div>
  </div> 
   <input id="loginno" type="hidden" value="<%=loginno%>"/>  
   <input id="currentPage" name="currentPage" type="hidden" value="1"/>
<input id="maxPage" name="maxPage" type="hidden" value="1"/>  
<input id="maxRow" name="maxRow" type="hidden" value="0"/>   
<input id="action" name="action" type="hidden" value="/page/report!findData.action"/>  
</body>
</html>
