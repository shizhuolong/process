<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	//科目id
	String dbTypeId = request.getParameter("dbTypeId");
	//地市编码
	String groupId = request.getParameter("groupId");
	//帐期
	String dealDate = request.getParameter("dealDate");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>对比报表详细信息</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/manualCommission/js/compareReportDetail.js"></script>
</head>
<body class="" style="overflow-x: auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="dbTypeId" value="<%=dbTypeId%>">
	<input type="hidden" id="groupId" value="<%=groupId%>">
	<input type="hidden" id="dealDate" value="<%=dealDate%>">
	<form id="searchForm" method="post">
		<table width="100%" style="margin: 10px 0; border: none;">
			<tr height="35px">
				<td width="6%">渠道编码：</td>
				<td width="15%"><input class="default-text-input wper80" name="channelCode" type="text" id="channelCode" /></td>
				<td width="5%"><a class="default-btn" href="#" id="searchBtn" style="float: right; margin-right: 30px;">查询</a></td>
				<td width="5%"><a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a></td>
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
<script>
	
</script>
</html>