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
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>未归集到基层人员的积分</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/page/javascript/jlkh/view_jcdy_nounit_mon.js"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="text-align:right;">账期：</td>
					<td width="15%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time %>" id="time">
					</td>
		           <td width="4%" style="text-align:right;">地市:</td>
                   <td width="17%">
                    <select id="regionName" name="regionName" class="default-text-input wper80">
                      <option value="">全部</option>
                    </select>
                   </td>
					<td width="8%" style="text-align:right;">用户号码：</td>
					<td width="17%">
						<input class="default-text-input wper80" name="userCode" type="text" id="userCode"/>
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
		<div id="lchcontent"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>
		<div style="color:red;font-size:10px;">备注：已出积分但是没有对应到具体基层人员的清单 <br/> 1、梳理积分和基层人员的业务对应关系，并在系统中进行匹配处理<br/>  2、渠道系数为空关注游离渠道绑定和系数设置</div>

</body>
<script>

</script>
</html>