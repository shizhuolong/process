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
	ca.add(Calendar.DAY_OF_MONTH, -1);
	String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>2i2c发展用户首充奖励</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/reportNew/js/2i2c_user_dev.js"></script>
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
		<form id="searchForm" method="post" style="width:60%">
			<table style="width:100%;margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="3%" style="padding-left: 1px;" align="right">账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd'})" value="<%=dealDate %>" id="dealDate">
					</td>
					<td width="3%" style="text-align:right;">地市：</td>
                    <td width="13%">
                        <select name="regionCode" id="regionCode" class="default-text-input wper100">
                                <option value=''>请选择</option>
                        </select>
                    </td>
                    <td width="5%">
                        <a class="default-btn" href="#" id="searchBtn"
                        style="float: right; margin-left: 10px; margin-right: 10px;">查询</a>
                    </td>
                    <td width="5%">
                        <a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
                    </td>
			        
				</tr>
				<tr>
                    <td width="10%" style="text-align:right;">用户号码：</td>
                    <td width="15%">
                        <input class="default-text-input wper80" name="userPhone" type="text" id="userPhone"/>
                    </td>
                    <td width="10%" style="text-align:right;">人员姓名：</td>
                    <td width="15%">
                        <input class="default-text-input wper90" name="userName" type="text" id="userName"/>
                    </td>
                    <td width="10%" style="text-align:right;">渠道编码：</td>
                    <td width="15%">
                        <input type="text" name="hqChanlCode" id="hqChanlCode" class="default-text-input wper80"></input>
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