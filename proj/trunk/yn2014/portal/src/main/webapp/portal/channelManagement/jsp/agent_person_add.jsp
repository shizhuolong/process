<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>增加</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/agent_person_add.js?v=13"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="code" value="<%=org.getCode()%>">
<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 420px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="add" method="POST">
				<table class="default-table sticky-enabled">
				<tr>
					<td>代理商编码:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="代理商编码不能为空" name="hq_chan_code" id="hq_chan_code"/></td>
				    <td>代理商名称:</td>
					<td><input type="text" required="true" readonly="true" class="easyui-validatebox" missingMessage="代理商名称不能为空" name="hq_chan_name" id="hq_chan_name"></td>
				    <td></td>
				</tr>
				<tr>
				    <td>人员姓名:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="人员姓名不能为空" name="name" id="name"></td>
				    <td>人员类型:</td>
					<td>
					   <select id="people_type" name="people_type">
					     <option value=''>请选择</option>
					     <option value='1'>店长</option>
					     <option value='2'>店员</option>
					   </select>
					</td>
				</tr>
				<tr>
				    <td>电话号码:</td>
					<td colspan="4"><input type="text" required="true" class="easyui-validatebox" missingMessage="电话号码不能为空" name="phone" id="phone"></td>
				</tr>
				
				<tr>
	                <td colspan="4" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
			<input type="hidden" id="username" name="username" value="<%=user.getUsername()%>"/>
			<input type="hidden" id="deal_date" name="deal_date"/>
		</form>
		</div>
	</div>
</div>
</body>
</html>