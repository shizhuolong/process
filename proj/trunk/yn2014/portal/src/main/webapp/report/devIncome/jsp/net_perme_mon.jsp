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
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>自有厅4G渗透率支撑</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/net_perme_mon.js?v=2"></script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="3%" style="text-align:right;">账期：</td>
					<td width="10%">
						<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=dealDate %>" id="dealDate">
					</td>
					<td width="3%" style="text-align:right;">地市：</td>
					<td width="10%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="4%" style="text-align:right;">厅类型：</td>
					<td width="10%">
				     	<select name="hallType" id="hallType" class="default-text-input wper80">
							<option value=''>全部</option>
							<option value='小型厅'>小型厅</option>
							<option value='标准厅'>标准厅</option>
							<option value='旗舰厅'>旗舰厅</option>
						</select>
					</td>
					<td width="4%" style="text-align:right;">经营模式：</td>
					<td width="10%">
				     	<select name="operateType" id="operateType" class="default-text-input wper80">
							<option value='自营'>自营</option>
						</select>
					</td>
					
					<td width="5%">营业厅编码：</td>
					<td width="10%">
						<input class="default-text-input wper80" name="hq_chan_code" type="text" id="hq_chan_code"/>
					</td>
					<td width="1%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="content"></div>
</body>
</html>