<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>自营厅分等分级评价表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/bus_evaluate_mon.js?v=2"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="4%" style="text-align:right;">账期：</td>
					<td width="8%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate%>" id="dealDate">
					</td>
					<td width="5%" align="right">地市：</td>
					<td width="10%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="10%" align="right">营业厅类型：</td>
					<td width="10%">
						<select name="chnl_type" id="chnl_type" class="default-text-input wper80">
								<option value=''>请选择</option>
								<option value="旗舰厅" selected>旗舰厅</option>
								<option value="小型厅">小型厅</option>
								<option value="标准厅">标准厅</option>
						</select>
					</td>
					<td width="8%" align="right">区域：</td>
					<td width="10%">
						<select name="area_type" id="area_type" class="default-text-input wper80">
						        <option value=''>全部</option>
								<option value='城区'>城区</option>
								<option value='县城'>县城</option>
								<option value='乡镇'>乡镇</option>
						</select>
					</td>
					<td width="1%">
						<a class="default-btn " href="#" id="searchBtn">查询</a>
					</td>
					<td width="1%">
						<a class="default-btn default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
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

</body>

</html>