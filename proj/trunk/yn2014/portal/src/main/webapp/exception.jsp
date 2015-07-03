<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>公共错误</title>
<link href="<%=request.getContextPath()%>/css/tips_style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath() %>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/jscroll.js"></script>
<script type="text/javascript">
	$(document).ready(function(){
		$("#tips_content").jscroll();
	});
</script>
</head>
<body>
	<div id="container">
		<div id="tips_top">
			<div id="tips_top_left"></div>
			<div id="tips_top_main"></div>
			<div id="tips_top_right"></div>
			<div class="clear"></div>
		</div>
		<div id="tips_content">

			<div id="wrong_tips">
				<p class="wrong_tips_title">错误提示：系统出现异常，请联系管理员！</p>
				<p class="wrong_tips_info"><s:property value="exception"/></p>
				<s:property value="exceptionStack"/>
				<br />
			</div>
		</div>
		<div id="tips_bottom">
			<div id="tips_bottom_left"></div>
			<div id="tips_bottom_main">
				<!--  <a href="#" id="back_btn"></a>-->
			</div>
			<div id="tips_bottom_right"></div>
			<div class="clear"></div>
		</div>
	</div>
</body>
</html>