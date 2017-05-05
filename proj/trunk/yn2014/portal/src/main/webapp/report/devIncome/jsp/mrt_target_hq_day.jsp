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
	ca.add(Calendar.DATE, -1);
	String month=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>全业务渠道分类日报</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/mrt_target_hq_day.js?v=1"></script>
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
					<td width="5%" style="padding-left: 10px;">日期：</td>
					<td width="30%">
						<input type="text"  class="Wdate default-text-input wper20" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd'})" value="<%=month%>" id="month">
					</td>
					<td width="5%" align="right">地市：</td>
					<td width="10%">
						<select name="regionCode" id="regionCode"  class="default-text-input wper80">
								
						</select>
					</td>
					<td width="8%" align="right">渠道类型：</td>
					<td width="8%">
						<select name="chnlType" id="chnlType" class="default-text-input wper100">
								<option value=''>全部</option>
								<option value='集客'>集客</option>
								<option value='电子'>电子</option>
								<option value='社会实体'>社会实体</option>
								<option value='外包'>外包</option>
								<option value='自营'>自营</option>
						</select>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 48px;">查询</a>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
	</form>
	<div id="lchcontent">
	</div>

</html>