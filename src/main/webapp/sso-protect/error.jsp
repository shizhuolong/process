<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String errorcode = request.getParameter("errorCode");
String errorMsg = "";
if(errorcode!=null && errorcode.length()>0){
	if(errorcode.equals("2")) errorMsg = "验证码出错";
	else if(errorcode.equals("1")) errorMsg = "账号或口令错误";
	else if(errorcode.equals("999")) errorMsg = "4A服务器内部错误";
	else if(errorcode.equals("3")) errorMsg = "账号停止使用";
	else if(errorcode.equals("4")) errorMsg = "没有访问此站点授权";
	else if(errorcode.equals("5")) errorMsg = "该站点未注册";
	else if(errorcode.equals("998")) errorMsg = "SSO维护中";
	else if(errorcode.equals("21")) errorMsg = "该用户已退出";
	else if(errorcode.equals("22")) errorMsg = "超时";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>Error Page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

  </head>
  
  <body>
    	<font color='red'>错误信息：<%=errorMsg %></font>
  </body>
</html>
