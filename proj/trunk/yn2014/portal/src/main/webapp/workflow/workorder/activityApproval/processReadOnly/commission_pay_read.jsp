<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.util.*" %>
<%@ taglib prefix ="s" uri="/struts-tags"%>
<%
String path = request.getContextPath();
String needSelectNextTaskByMoney[] = {"financeLeaderAudit","regionDeputyManagerAudit","provinceFinancerAudit","provinceDeputyManagerAudit"};
String taskKey = request.getParameter("workOrderVo.actNodeKey");
String exceedFlag = "";
List<String> list = Arrays.asList(needSelectNextTaskByMoney);
if(list.contains(taskKey)) {
	exceedFlag = "false";
}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>请假申请</title>
</head>
<body>
	<fieldset>
		<legend><small>请假申请</small></legend>
		<form action="<%=path%>/leave/leave-handler!submitLeaveOrder.action" method="post">
			<table border="1" width="100%">
				<tr>
					<td>请示主题：</td>
					<td>${workOrderVo.title}</td>
				</tr>
				<tr>
					<td>工单编号：</td>
					<td>${workOrderVo.displayPid}</td>
				</tr>
				<tr>
					<td>申请时间：</td>
					<td><s:date name="workOrderVo.createTime" /></td>
				</tr>
				<tr>
					<td>请假类型：</td>
					<td>
						${workOrderVo.actNodeKey}
					</td>
				</tr>
				<tr>
					<td>开始时间：</td>
					<td>${workOrderVo.startMan}</td>
				</tr>
				<tr>
					<td>结束时间：</td>
					<td>${workOrderVo.startManName}</td>
				</tr>
				<tr>
					<td>请假原因：</td>
					<td>
						<textarea name="reason"></textarea>
					</td>
				</tr>
			</table>
		</form>
	</fieldset>
	<jsp:include page="/workflow/workorder/activityApproval/approveCommon.jsp">
		<jsp:param name="exceedFlag" value="<%=exceedFlag%>" />
	</jsp:include>
</body>
</html>