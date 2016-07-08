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
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>当期兑换报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/tab_mrt_integral_dev_report.js"></script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;text-align:right;">账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" readonly
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=time%>" id="time">
					</td>
					<td width="4%" style="text-align:right;">地市：</td>
					<td width="13%">
						<select name="regionName" id="regionName" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="7%" style="text-align:right;">营服中心：</td>
					<td width="13%">
						<select name="unitName" id="unitName" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="7%" style="text-align:right;">人员姓名：</td>
					<td width="13%" colspan="2">
						<input class="default-text-input wper80" name="userName" type="text" id="userName"/>
					</td>
				</tr>
				<tr height="35px">
					<td width="7%" style="text-align:right;">HR编码：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="hr_id" type="text" id="hr_id"/>
					</td>
					<td width="7%" style="text-align:right;">渠道编码：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="fd_chnl_id" type="text" id="fd_chnl_id"/>
					</td>
					<td width="7%" style="text-align:right;">等级：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="integral_grade" type="text" id="integral_grade"/>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
					<td width="3%">
						<a class="default-gree-btn" href="#" style="float: right; margin-left: 30px;" id="exportLevel" onclick="showLevelExp();">等级说明</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="lchcontent"></div>
</body>
</html>