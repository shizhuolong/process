<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String path = request.getContextPath();
	Calendar ca = Calendar.getInstance();
	ca.add(Calendar.DATE, 0);
	String time = new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<title>订单上传</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet"
	type="text/css" />
<link href="<%=path%>/report/devIncome/css/lch-report.css"
	rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css"
	href="<%=path%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet"
	href="<%=path%>/page/js/date/skin/WdatePicker.css">
<script type="text/javascript"
	src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript"
	src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript"
	src="<%=path%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript"
	src="<%=path%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript"
	src="<%=path%>/portal/order2i2c/js/import_order_list.js?v=6"></script>
</head>
<body style="overflow-x: auto; margin: 5px; margin-top: 0;">
	<input type="hidden" id="ctx" value="<%=path%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<div class="search-div">
		<table style="margin: 0px 0; border: none; width: 100%;font-size:100%;">
			<tr>
				<td width="8%">开始时间：</td>
				<td width="1%"><input type="text" style="width: 100px;"
					class="Wdate default-text-input wper80" readonly
					onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})"
					value="<%=time%>" id="startTime" name="startTime" /></td>
				<td width="8%">结束时间：</td>
				<td width="1%"><input type="text" style="width: 100px;"
					class="Wdate default-text-input wper80" readonly
					onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})"
					value="<%=time%>" id="endTime" name="endTime" /></td>
				<td width="8%">订单编号：</td>
				<td width="1%"><input type="text" style="width: 150px;"
					class="default-text-input wper80" id="orderNo" name="orderNo" /></td>
				<td width="8%" style="text-align: right;">激活状态：</td>
				<td width="13%"><select name="active_status" id="active_status"
					class="default-text-input wper100">
						<option value=''>请选择</option>
						<option value='未发货'>未发货</option>
						<option value='已发货未激活'>已发货未激活</option>
						<option value='已激活未首充'>已激活未首充</option>
						<option value='已首充'>已首充</option>
				</select></td>
				
				<td width="1%"><a class="default-btn" href="#" id="searchBtn"
					style="float: right; margin-right: 18px;">查询</a></td>
				<td width="1%"><a style="cursor: pointer; margin-left: 20px;"
					class="default-btn" onclick="orderImport()">导入</a>
				</td>
				<td width="1%"><a style="cursor: pointer; margin-left: 20px;"
					class="default-btn" id="exportBtn" onclick="orderExport()">导出</a></td>
			</tr>
		</table>
	</div>
	<div id="lchcontent" style="margin-top: 5px;"></div>
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