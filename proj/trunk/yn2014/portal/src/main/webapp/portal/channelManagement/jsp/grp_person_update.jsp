<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%
	String dealDate = request.getParameter("dealDate");
	String devNum = request.getParameter("devNum");
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	/* Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime()); */
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>集客的客户经理及渠道经理修改</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/grp_person_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<input type="hidden" id="devNum" value="<%=devNum%>">
<input type="hidden" id="dealDate" value="<%=dealDate%>">

<div id="container" style="min-height: 160px;">
	<div class="default-dt" style="width: 800px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="addKpiBasePerformance" method="POST">
				<table class="default-table sticky-enabled">
				<tr>
					<td width="6%" style="padding-left: 10px;" >发展人编码</td>
					<td width="15%" colspan="3">
						<%=devNum%>
					</td>
				</tr>
				<tr>
					<td width="4%">渠道编码</td>
					<td width="45%">
						<input class="default-text-input wper90" name="chanNum" type="text" id="chanNum" onblur="checkChannelCode()"/>
					</td>
					<td width="4%">渠道名称</td>
					<td width="45%" id="chanName" nowrap='nowrap'></td>
				</tr>
				<tr>
					<td width="8%">HR编码</td>
					<td width="45%">
						<input class="default-text-input wper90" name="hrNum" type="text" id="hrNum" onblur="checkHrCode()"/>
					</td>
					<td width="8%">姓名</td>
					<td width="45%" id="userName"></td>
				</tr>
				<tr>
	                <td colspan="4" style="padding-left: 120px;">
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