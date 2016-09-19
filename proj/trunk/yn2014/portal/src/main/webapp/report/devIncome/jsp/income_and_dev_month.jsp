<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
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
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>全业务发展收入月报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/income_and_dev_month.js"></script>
</head>
<style>
	
</style>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="text-align:right;">开始账期：</td>
					<td width="15%">
						<input type="text" readonly class="Wdate default-text-input wper20" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isClear:'false'})" value="<%=month%>" id="startDate">
					</td>
					<td width="5%" style="text-align:right;">结束账期：</td>
					<td width="15%">
						<input type="text" readonly class="Wdate default-text-input wper20" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isClear:'false'})" value="<%=month%>" id="endDate">
					</td>
					<td width="5%" style="padding-left: 10px;display:none;">环比</td>
					<td width="10%" style="display:none;">
						<input type="checkbox" id="mmBtn"/>
					</td>
					<td width="2%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;">查询</a>
					</td>
					<td width="2%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
	</form>
	
	<div id="content">
	</div>
	<!-- <div id="mark" style="color:red;font-size:15px;"> 
		备注：</br>
		1.发展收入优先直销发展人归集，归不到直销发展人的用户会归到渠道经理</br>
        2.移网收入：剔除了挂账、赠费和退费</br>
        3.固网收入：剔除挂账、赠费和帐后调账</br>
        4.4G收入从201601账期开始也做剔除赠费操作
	</div> -->
</html>