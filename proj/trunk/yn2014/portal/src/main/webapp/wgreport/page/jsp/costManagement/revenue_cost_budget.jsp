<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
  String path = request.getContextPath();
  User user = UserHolder.getCurrentLoginUser();
  Org org = user.getOrg();
  Calendar ca=Calendar.getInstance();
  ca.add(Calendar.MONTH, -1);
  String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<%@page import="java.text.Format"%>
<%@page import="java.text.DateFormat"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   <meta name="renderer" content="webkit">
   <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
   <title>收入成本预算展现报表</title>
   <link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
   <link href="<%=path%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
   <link href="<%=path %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
   <script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
   <script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
   <script type="text/javascript" src="<%=path%>/report/devIncome/js/lch-report-fix.js"></script>
   <script type="text/javascript" src="<%=path%>/wgreport/page/javascript/costManagement/revenue_cost_budget.js"></script>
</head>
  <body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="6%" style="padding-left: 10px;">开始账期：</td>
					<td width="15%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time%>" id="startdate">
					</td>
					 <td width="6%" style="padding-left: 10px;">结束账期：</td>
					<td width="15%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time%>" id="enddate">
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
		<div id="lchcontent"></div>
	</body>
</html>
