<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%><%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/tab_portal_qj_person_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="code" value="<%=org.getCode()%>">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 420px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="update" method="POST">
				<table class="default-table sticky-enabled">
				<tr>
					<td>营服中心:</td>
					<td><input type="text" required="true" readonly="true" class="easyui-validatebox" missingMessage="营服中心不能为空" name="unit_name" id="unit_name"></td>
				</tr>
				<tr>
					<td>姓名:</td>
					<td><input type="text" required="true" readonly="true" class="easyui-validatebox" missingMessage="姓名不能为空"  name="name"  id="name"></td>
				</tr>
				<tr>
					<td>类别:</td>
					<td><input type="text" required="true" readonly="true" class="easyui-validatebox" missingMessage="类别不能为空" name="job_type" id="job_type"></td>
				</tr>
				<tr>
					<td>岗位:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="岗位不能为空" name="job" id="job"></td>
				</tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
			<input type="hidden" id="user_id" name="user_id" value="<%=user.getUsername()%>"/>
			<input type="hidden" id="cityCode" name="cityCode" value="<%=org.getRegionCode()%>"/>
		</form>
		</div>
	</div>
</div>
</body>
</html>