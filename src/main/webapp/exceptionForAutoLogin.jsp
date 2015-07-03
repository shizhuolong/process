<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String errorFlag = request.getParameter("errorFlag");
 	String msg = "";
 	if("1".equals(errorFlag)) {
 		msg = "错误提示：菜单地址不正确！";
 	}else {
 		msg = "错误提示：自动登录失败，用户账号不正确！";
 	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登录错误</title>
<link href="<%=request.getContextPath()%>/css/tips_style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<div id="container">
		<div id="tips_top">
			<div id="tips_top_left"></div>
			<div id="tips_top_main" style="width:380px;"></div>
			<div id="tips_top_right"></div>
			<div class="clear"></div>
		</div>
		<div id="tips_content" style="width:398px;">

			<div id="wrong_tips">
				<p class="wrong_tips_title"><%=msg%></p>
				<p class="wrong_tips_info"><s:property value="exception"/></p>
				<s:property value="exceptionStack"/>
				<br />
			</div>
		</div>
		<div id="tips_bottom">
			<div id="tips_bottom_left"></div>
			<div id="tips_bottom_main" style="width:380px;">
				<!--  <a href="#" id="back_btn"></a>-->
			</div>
			<div id="tips_bottom_right"></div>
			<div class="clear"></div>
		</div>
	</div>
</body>
</html>