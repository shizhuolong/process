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
	ca.add(Calendar.DATE, -2);
	String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
	String path = request.getContextPath();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>订单明细-未首充</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/order2i2c/js/order_detail_uncharge.js?v=17"></script>
<script type="text/javascript">
    var path="<%=path%>";
</script>
</head>
<body  style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="userId" value="<%=user.getId()%>">
	<form id="searchForm" method="post">
		<table width="100%"
			style="margin: 10px 0; border: none; font-size: 100%;">
			<tr>
				<td width="4%" style="text-align: right;">账期：</td>
				<td width="4%"><input type="text" style="width: 100px;"
					class="Wdate default-text-input wper80" readonly
					value="<%=dealDate%>" onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})"
					id="dealDate" name="dealDate" /></td>
				<td width="4%" style="text-align: right;">是否首充：</td>
				<td width="4%"><select class="default-text-input wper80" name="isFirst"	id="isFirst">
						<option value="">全部</option>
						<option value="已首充">已首充</option>
						<option value="未首充">未首充</option>
				</select></td>
				<td width="4%" style="text-align: right;">用户状态：</td>
				<td width="4%"><select class="default-text-input wper80"
					name="serviceName" id="serviceName">
				</select></td>
				<td width="4%" align="right">订购号码：</td>
				<td width="4%">
					<input class="default-text-input wper80" name="serviceNumber" type="text" id="serviceNumber"/>
				</td>
				<td width="6%">
				  <a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
				  <a class="default-btn" href="#" style="float: right;" onclick="exportAll()">导出</a>
			    </td>
			</tr>
		</table>
	</form>
	<div id="lchcontent" style="margin-top:5px;">
	</div>
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