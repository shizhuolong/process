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
	ca.add(Calendar.MONTH, -1);
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>社会渠道分等分级渠道数分布</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/social_channel_num_integral.js"></script>
</head>
<style>
	
</style>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<!-- <td width="5%" style="padding-left: 10px;">日期：</td>-->
					<td width="20%"> 
						日期：<input type="text"  class="Wdate default-text-input wper20" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="month">
					<!-- </td> -->
					<!-- <td width="5%" style="padding-left: 10px;">渠道名称：</td>
					<td width="20%"> -->
						渠道名称：<input class="default-text-input" id="channelName" name="channelName" type="text" />
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
	<div id="lchcontent">
	</div>
<script>

</script>
</html>

<%-- <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>社会渠道积分分值分布月表</title>
<link href="<%=request.getContextPath()%>/nresources/default/css/common.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath() %>/css/plus.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/css/lch-report.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css"/>
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/css/lch-report.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/njs/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/javascript/app/comm/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/social_channel_integral_distribute.js"></script>

<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.3/themes/gray/easyui.css">
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.3/themes/icon.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.3/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.3/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/javascript/app/develop/cbtree.js"></script>
</head>
<body class="" style="overflow-x:auto;margin:5px;margin-top:0;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<div class="search-div">
				<table width="100%" style="margin: 0px 0; border:none;">
					<tr>
						<td width="5%">帐期：
							<input type="text"  style="margin-left: 19px;" class="Wdate default-text-input wper20" 
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=dealDate %>" id="dealDate" readonly="readonly">
                                                                     渠道名称：<input class="default-text-input w400" id="channelName" name="channelName" type="text" />
                            <input type="button" style="cursor:pointer;"  id="seachBtn"class="ana-button" value="查询" />
							<input type="button" style="cursor:pointer;" class="ana-button" value="导出" id="exportBtn" onclick="downsAll()"/>
						</td>
					</tr>
				</table>
	</div>
	<div id="lchcontent" style="margin-top:5px;">
	</div>
</body>	
</html> --%>