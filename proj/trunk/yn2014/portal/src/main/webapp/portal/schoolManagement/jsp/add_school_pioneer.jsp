<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%
    String path=request.getContextPath();
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>添加团长</title>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/schoolManagement/js/add_school_pioneer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript">
   var path="<%=path%>";
</script>
</head>
<body>
    <input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
    <input type="hidden" id="school_campus" >
    <input type="hidden" id="school_id" >
    <div id="addFormDiv" align="center" style="margin-top: 50px">
           <form id="addForm" method="POST">
           <table style="border-collapse:separate; margin:10px,0px; border-spacing:0px 10px;">
                <tr><th>学校：</th><td><input id="school_name" type="text" name="school_name"/></td></tr>
                <tr><th>姓名：</th><td><input id="pioneer_name" type="text" name="pioneer_name"/></td></tr>
                <tr><th>电话号码：</th><td><input id="pioneer_phone" type="text" name="pioneer_phone"/></td></tr>
                <tr><th>班级：</th><td><input id="pioneer_class" type="text" name="pioneer_class" /></td></tr>
           </table>
           </form>
    </div>
</body>
</html>