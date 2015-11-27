<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser();
     Org org = user.getOrg();
     String path = request.getContextPath();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>自设KPI考核评分预览</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/is_kpi_list.js"></script>
<script type="text/javascript">
    var paths="<%=path%>";
</script>
</head>
<body class="" style="overflow-x:auto;margin:5px;margin-top:0;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="time" value="<%=request.getAttribute("time")%>">
	<input type="hidden" id="userId" value="<%=request.getAttribute("userId")%>">
	<input type="hidden" id="cityCode" value="<%=request.getAttribute("regionCode")%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width: 150px;">
					<tr>
						<td width="1%">
							<a style="cursor:pointer;" class="default-btn" id="exportBtn" onclick="downsAll()">导出</a>
						</td>
						<td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="confirmBtn" onclick="confirmImport()">确认入库</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="reppeat" onclick="repeatImport()">重新导入</a>
					    </td> 
					</tr>
				</table>
	</div>
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