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
	String mon=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>佣金汇总月报</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/comm_manage.js"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=mon%>" id="mon">
					</td>
					<td width="7%">渠道名称：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="chnlName" type="text" id="chnlName"/>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="content"></div>
	<!-- 	<div>
		<fieldset style='margin-left:10px;'>  
	    <legend><font size="3" style="color:blue;">说明</font></legend>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">1.2G佣金数据来源于BSS系统未支撑佣金、总部集中系统计算2G佣金、网格系统2G手工计算佣金、BSS系统现返佣金佣金、网格系统未支撑佣金。</font><br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">2.3G佣金数据来源于总部集中系统计算3G佣金，网格系统3G手工计算佣金，网格系统未支撑佣金。</font>	<br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">3.固网佣金来源于BSS系统未未支撑佣金，网格系统固网手工计算佣金，网格系统未支撑固网佣金。</font><br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">4.融合佣金（流量包佣金）来源于BSS系统未支撑佣金，总部集中系统计算佣金，网格系统手工计算佣金，网格系统未支撑佣金。</font><br/>	
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">5.渠道补贴来源于网格系统渠道补贴录入佣金。</font><br/>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">6.紧密型外包的佣金指紧密型外包渠道的佣金，包含2G、3G、固网、融合、及现返佣金。</font><br/>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">7.集中系统中的佣金展示金额不包含现返佣金和紧密型外包的佣金。</font><br/><br/>	
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" style="color:blue;">时间展示：</font><br/>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">1.10-16号展示BSS系统未支撑佣金，总部集中系统计算佣金</font><br/>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style="color:black;">2.16-31号展示最终版佣金数据</font><br/>
  	</fieldset>
  	</div> -->
</body>

</html>