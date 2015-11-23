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
	Calendar ca = Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String time = new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>积分月汇总</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/page/javascript/jlkh/tb_jcdy_jf_all_mon1.js"></script>
<style>
  #lch_DataHead TR TH,#lch_table_corner TR TH,#lch_DataBody TR TD,#lch_table_left TR TD{
		min-width:100px;
  }
</style>
</head>
<body class="" style="overflow-x: auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<form id="searchForm" method="post">
		<table width="100%" style="margin: 10px 0; border: none;">
			<tr height="35px">
				<td width="6%" style="padding-left: 10px;">账期：</td>
				<td width="15%"><input type="text"
					class="Wdate default-text-input wper80"
					onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"
					value="<%=time%>" id="time"></td>
				<td width="4%">地市：</td>
				<td width="13%"><select name="regionName" id="regionName"
					onchange="" class="default-text-input wper80">
						<option value=''>请选择</option>
				</select></td>
				<td width="6%">营服中心：</td>
				<td width="13%"><select name="unitName" id="unitName"
					onchange="" class="default-text-input wper80">
						<option value=''>请选择</option>
				</select></td>
				<td width="6%">人员姓名：</td>
				<td width="15%"><input class="default-text-input wper80"
					name="name" type="text" id="name" /></td>
				<td width="5%"><a class="default-btn" href="#" id="searchBtn"
					style="float: right; margin-right: 30px;">查询</a></td>
				<td width="5%"><a class="default-btn" href="#" id="exportBtn"
					onclick="downsAll()">导出</a></td>
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