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
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>移动月流失预警清单</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/FrontlineDataWarn/js/subs_leave_mon_list.js"></script>
<style>
  #detail{position:absolute;height:auto;width:200px;background:yellow;}
</style>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>"/>
	<input type="hidden" id="code" value="<%=org.getCode()%>"/>
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>"/>
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="3%" style="text-align:right;">账期：</td>
					<td width="10%">
						<input type="text"  class="Wdate default-text-input wper80" readonly
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:'false'})" value="<%=month%>" id="dealDate">
					</td>
					<td width="3%" style="text-align:right;">地市：</td>
					<td width="8%">
						<select name="regionCode" id="regionCode" class="default-text-input wper90">
							<option value=''>请选择</option>
						</select>
					</td>
					<td width="6%" style="text-align:right;">营服中心：</td>
					<td width="8%">
						<select name="unitCode" id="unitCode" class="default-text-input wper90">
							<option value=''>请选择</option>
						</select>
					</td>
					<td width="6%" style="text-align:right;">用户号码：</td>
					<td width="8%">
						<input type="text" id="device_number" class="default-text-input wper80"/>
					</td>
					<td width="6%" style="text-align:right;">渠道经理：</td>
					<td width="8%">
						<input type="text" id="name" class="default-text-input wper80"/>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 18px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="lchcontent"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>
    <div style="color: red; font-size: 10px;" id="remarkDiv">
		口径说明:<br /> 1.流失用户：上月有出账收入，本月无出账收入。<br /> 2.生命周期消费额：近一年的出账收入。<br />
	</div>
	<div id="detail" style="color:red;display:none;"></div>
</body>
</html>