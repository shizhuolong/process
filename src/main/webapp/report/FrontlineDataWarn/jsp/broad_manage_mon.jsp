<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>宽带经营月报</title>
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/FrontlineDataWarn/js/broad_manage_mon.js"></script>
</head>
<body class="" style="overflow-x: auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<form id="searchForm" method="post">
		<table width="100%" style="margin: 10px 0; border: none;">
			<tr height="35px">
				<td width="5%" style="padding-left: 10px;">账期：</td>
				<td width="13%"><input type="text"
					class="Wdate default-text-input wper80" readonly="true"
					onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false,onpicked:function() {javascript:loadRegion();}})"
					value="<%=month%>" id="month"></td>
				<td width="4%">地市：</td>
				<td width="13%"><select name="regionCode" id="regionCode"
					class="default-text-input wper80">
						<option value=''>请选择</option>
				</select></td>
				<td width="7%">营服中心：</td>
				<td width="13%"><select name="unitId" id="unitId"
					class="default-text-input wper80">
						<option value=''>请选择</option>
				</select></td>
				<td width="3%"><a class="default-btn" href="#" id="searchBtn"
					style="float: right; margin-right: 30px;">查询</a></td>
				<td width="3%"><a class="default-btn" href="#" id="exportBtn"
					onclick="downsAll()">导出</a></td>
				<td width="3%"><a class="default-btn" href="#" id="remark">说明</a></td>
			</tr>
		</table>
	</form>
	<div id="content"></div>
	<div style="color: red; font-size: 15px;display:none;" id="remarkDiv">
		取数口径:<br> 1.智慧沃家出账渗透率:智慧沃家出账中宽带出账用户数/宽带出账用户<br>
		2.TV出账渗透率:TV出账用户数/宽带出账用户数
	</div>
</body>

</html>