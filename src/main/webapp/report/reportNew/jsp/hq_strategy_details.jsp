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
<title>战略渠道效能分析明细表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/reportNew/js/hq_strategy_details.js?v=2"></script>
<style type="text/css">
  #lch_DataHead TR TH,#lch_DataBody TR TD{
   min-width: 10px;
}

</style>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id=region value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post" style="width:50%">
			<table style="width:55%;margin: 5px 0; border:none;">
				<tr height="35px">
					<td width="7%" style="padding-left: 1px;" align="right">开始账期：</td>
					<td width="8%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="startDate">
					</td>
					<td width="7%" style="padding-left: 1px;" align="right">结束账期：</td>
                    <td width="8%">
                        <input type="text"  class="Wdate default-text-input wper80" 
                        onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=dealDate %>" id="endDate">
                    </td>
					<td width="4%" align="right">地市：</td>
					<td width="12%">
						<select name="regionCode" id="regionCode" onchange="" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
				<!-- </tr>
				<tr> -->	
					<td width="7%" align="right">渠道编码：</td>
                    <td width="8%">
                        <input name="hqChanCode" id="hqChanCode" class="default-text-input wper80"/>
                    </td>
                    <td width="7%" align="right">渠道名称：</td>
                    <td width="8%">
                        <input name="hqChanName" id="hqChanName" class="default-text-input wper80"/>
                    </td>
			        <td width="5%">
                        <a class="default-btn" href="#" id="searchBtn"
                        style="float: right; margin-right: 10px;">查询</a>
                    </td>
                    <td width="5%">
                        <a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
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