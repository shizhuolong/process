<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser();
     String path = request.getContextPath();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>分配列表</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/taskdis/js/23to4_send_list.js?v=9"></script>
<script type="text/javascript">
    var path="<%=path%>";
</script>
</head>
<body  style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="userId" value="<%=user.getId()%>">
	<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;font-size:100%;">
				<tr height="35px">
					<td width="8%" align="right">用户号码：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="deviceNumber" type="text" id="deviceNumber"/>
					</td>
					<td width="8%" align="right">用户编码：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="subscriptionId" type="text" id="subscriptionId"/>
					</td>
					<td width="8%" align="right">接收人：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="receiver" type="text" id="receiver"/>
					</td>
					<td align="right">激活状态：</td>
					<td>
						<select class="default-text-input wper80" name="state" id="state">
					          <option value="">全部</option> 
					          <option value="1">已阅</option>
					          <option value="0">未阅</option>
					     </select>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" onclick="exportAll()"
						style="float: right; margin-right: 30px;">导出</a>
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