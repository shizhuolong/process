<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>App用户管理</title>
        <%@include file="../../include/common.jsp" %>
	<script type="text/javascript" src="js/appuser.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
</head>
<body>
		<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
        <div id='form-div' style="width:100%; height:100%;">
        </div>
</body>
</html>