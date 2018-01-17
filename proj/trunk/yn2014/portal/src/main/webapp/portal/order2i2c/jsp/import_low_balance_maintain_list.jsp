<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser(); 
     Org org = user.getOrg();
     String path = request.getContextPath();
     Calendar ca=Calendar.getInstance();
 	// ca.add(Calendar.MONTH, -1);
 	 String time=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>低余额T3维系清单导入</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=path%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/import_low_balance_maintain_list.js"></script>
</head>
<body style="overflow-x:auto;margin:5px;margin-top:0;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="userName" value="<%=user.getUsername()%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width:100%;font-size:100%;">
					<tr>
						<td  width="1%">账期：</td>
						<td width="1%">
								    <input type="text" style="width: 200px;" class="Wdate default-text-input wper80" readonly
						            onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" value="<%=time%>" id="time" name="time"/>
						</td>
					    <td width="1%">
						   <a class="default-btn" href="#" id="searchBtn"
						    style="float: right; margin-right: 18px;">查询</a>
					    </td>
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="reppeatBtn" onclick="repeatImport()">导入</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="exportBtn" onclick="downsAll()">导出</a>
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