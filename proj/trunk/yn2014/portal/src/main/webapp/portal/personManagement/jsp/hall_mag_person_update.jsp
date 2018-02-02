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
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>修改</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/personManagement/js/hall_mag_person_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 420px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="update" method="POST">
				<table class="default-table sticky-enabled">
				<tr>
                 <td>渠道编码：</td>
                 <td><input type="text" readonly="readonly" required="true" class="easyui-validatebox" missingMessage="渠道编码不能为空" name="hq_chan_code" id="hq_chan_code"/></td>
                </tr>
                <tr>
                 <td>渠道名称：
                 </td>
                 <td><input type="text" readonly="readonly" required="true" class="easyui-validatebox" missingMessage="渠道名称不能为空" name="hq_chan_name" id="hq_chan_name"/></td>
                </tr>
                <tr>
                <tr>
                 <td>营业员HR编码：
                 </td>
                 <td><input type="text" required="true" class="easyui-validatebox" missingMessage="HR编码不能为空" name="hr_id" id="hr_id"/></td>
                </tr>
                 <td>营业员姓名：
                 </td>
                 <td><input type="text" readonly="readonly" required="true" class="easyui-validatebox" missingMessage="营业员姓名不能为空" name="hr_name" id="hr_name"/></td>
                </tr>
                <tr>
                 <td>厅主任HR编码：
                 </td>
                 <td><input type="text" required="true" class="easyui-validatebox" missingMessage="厅主任编码不能为空" name="f_hr_id" id="f_hr_id"/></td>
                </tr>
                <tr>
                 <td>厅主任：
                 </td>
                 <td><input type="text" required="true" readonly="true" class="easyui-validatebox" missingMessage="厅主任姓名不能为空" name="f_user_name" id="f_user_name"/></td>
                </tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
			<input type="hidden" id="code" name="code" value="<%=org.getCode()%>">
			<input type="hidden" id="orgLevel" name="orgLevel" value="<%=org.getOrgLevel()%>">
            <input type="hidden" id="region" name="region" value="<%=org.getRegionCode()%>">
			<input type="hidden" id="chooseMonth" name="chooseMonth"/>
			<input type="hidden" id="hrId" name="hrId"/>
		</form>
		</div>
	</div>
</div>
</body>
</html>