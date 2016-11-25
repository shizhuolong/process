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
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>佣金规则报表</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/commission_rules_report.js"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="text-align:right;">账期：</td>
					<td width="22%">
						<input type="text"  class="Wdate default-text-input wper40" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="startDate"> 至 
						<input type="text"  class="Wdate default-text-input wper40" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="endDate">
					</td>
					<td width="5%" style="text-align:right;">地市：</td>
					<td width="15%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
							<option value=''>请选择</option>
						</select>
					</td>
					<td width="5%" style="text-align:right;">网别：</td>
					<td width="15%">
						<select id="c3" name="c3" class="default-text-input wper80">
							<option value="">全部</option>
							<option value="2G">2G</option>
							<option value="3G">3G</option>
							<option value="4G">4G</option>
							<option value="固网">固网</option>
							<option value="共用">共用</option>
						</select>
					</td> 
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 18px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
				<tr>
					<td width="5%" style="text-align:right;">佣金类型:</td>
					<td width="22%">
						<select id="c5"  name="c5" class="default-text-input wper90">
							<option value="">全部</option>
							<option value="1">1、一次性代办费</option>
							<option value="2">2、话费分成</option>
							<option value="3">3、奖罚佣金</option>
							<option value="4">4、代收代办服务费</option>
							<option value="5">5、固网佣金</option>
							<option value="7">7、客服部维系</option>
							<option value="8">8、增值佣金</option>
							<option value="100">其他</option>
						</select>
					</td> 
					<td width="5%" style="text-align:right;">增存量:</td>
					<td width="15%">
						<select id="c4" name="c4" class="default-text-input wper80">
							<option value="">全部</option>
							<option value="存量用户佣金">存量用户佣金</option>
							<option value="增量用户佣金">增量用户佣金</option>
							<option value="其他">其他</option>
						</select>
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