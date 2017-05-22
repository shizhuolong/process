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
<title>固网宽带发展收入月报</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/bb_income_dev_mon.js?v=1"></script>
</head>

<body style="overflow-x:auto;">
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
					<td width="5%" style="text-align:right;">账期：</td>
					<td width="10%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=month %>" id="time">
					</td>
					<td width="4%" style="text-align:right;">地市：</td>
					<td width="10%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="5%" style="text-align:right;">营服中心：</td>
					<td width="10%">
						<select name="unitCode" id="unitCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="5%" style="text-align:right;">小区名称：</td>
					<td width="10%">
						<input class="default-text-input wper80" name="stdName" type="text" id="stdName"/>
					</td>
					<td width="2%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;">查询</a>
					</td>
					<td width="2%">
						<a class="default-btn" href="#" id="showMark"
						style="float: right; margin-right: 48px;">口径</a>
					</td>
					<td width="2%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
	</form>
	<div id="mark" style="display:none;color:red;font-size:15px;">
		   备注：<br/>
		 1.发展收入直接对到渠道经理不存在优先发展人(昆明、省集客除外)<br/>
         2.收入：剔除挂账、赠费和帐后调账<br/>                                                  
	</div>
	<div id="content">
	</div>
</html>