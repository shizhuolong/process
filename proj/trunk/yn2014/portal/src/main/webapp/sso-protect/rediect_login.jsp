<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.ynunicom.sso.AppConstant"%>
<%
	String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>检验登录</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

  </head>
  <%
  	String appid = AppConstant.appId;		//当前应用系统的APPID，根据实际情况填写
         String returnurl = request.getParameter("return");
  		 String jobId = request.getParameter("jobId");
         returnurl = returnurl==null?"":returnurl; 
         
         String baseUrl = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
  		 jobId = jobId == null ? "" : jobId;
         System.out.println("jobId-------------------"+jobId);
         returnurl = returnurl + "?jobId="+jobId;
         System.out.println(baseUrl+"-------------------");
         System.out.println("returnurl-------------------"+returnurl);
        
  %>
  <body onload="javascript:document.checkForm.submit();">
    检验登录中..... <br>
    <form id="checkForm" name="checkForm" action="<%=AppConstant.checkLoginPath%>" method="GET">
		<div id="divLogin" align="center">
					<input type="hidden" name="success" value="<%=baseUrl%>/sso-protect/success.jsp">
				    <input type="hidden" name="error" value="<%=baseUrl%>/sso-protect/error.jsp">
					<input type="hidden" name="appid" value="<%=appid %>">
					<input type="hidden" name="return" value="<%=returnurl %>">
		</div>
	</form>
  </body>
</html>
