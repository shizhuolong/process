<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    User user = UserHolder.getCurrentLoginUser();
    Org org = user.getOrg();
    String username=user.getUsername();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>修改</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/fixed_salary_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 220px;">
	<div class="default-dt" style="width: 640px;">
		<div class="sticky-wrap" style="height: 220px;">
			<form id="updateForm" method="POST">
			<input type="hidden" id="username" name="username" value="<%=username%>"/>
				<table class="default-table sticky-enabled">
				<tr>
					<td align="right">账期：</td>
					<td colspan="3"><input type="text" readonly="readonly" style="border:none" id="deal_date" value=""/></td>
				</tr>
				<tr>
					<td align="right">地市名称：</td>
					<td colspan="3"><input type="text" readonly="readonly" style="border:none" id="group_id_name" value=""/></td>
				</tr>
				<tr>
					<td align="right">营服名称：</td>
					<td colspan="3"><input type="text" readonly="readonly" style="border:none" id="unit_name" value=""/></td>
				</tr>
				<tr>
				    <td align="right">HR编码：</td>
                    <td><input type="text" readonly="readonly" style="border:none" id="hr_id" value=""/></td>
					<td align="right">姓名：</td>
					<td><input type="text" readonly="readonly" style="border:none" id="nmae" value=""/></td>
				</tr>
				<tr>
				    <td align="right">固定薪酬：</td>
                    <td>
                        <input type="text" name="salary_num" id="salary_num"> <span style="color:red" id="salary"></span>
                    </td>
					<td align="right">专项奖励：</td>
					<td>
						<input type="text" name="award_num" id="award_num">  <span style="color:red" id="award"></span>
					</td>
				</tr>
				<tr>
	                <td colspan="4" style="padding-left: 240px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
		</form>
		</div>
	</div>
</div>
</body>
</html>