<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH,-1);
	String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>区县总经理打分</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.all-3.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/manager/js/mark_score.js?v=28"></script>
<style type="text/css">
  /* .default-dt .sticky-wrap {
     width:1600px;
  } */
</style>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="regionName" value="<%=org.getRegionName()%>">
	<input type="hidden" id="userId" value="<%=user.getId()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<input type="hidden" id="lastMonth" value="<%=dealDate%>">
	<div data-options="region:'center',title:''">
		<div id="container">
			<form id="searchForm" method="post">
				<table width="60%">
				 <tr>
					<td width="4%" style="text-align: right;">账期：</td>
					<td width="6%">
					   <input type="text" class="Wdate default-text-input wper80" style="width:100px;"
								onclick="WdatePicker({skin:'whyGreen',onpicked:change(),dateFmt:'yyyyMM',isShowClear:false})" value="<%=dealDate%>" id="dealDate"/>
					</td>
					<td width="4%" style="text-align: right;">打分类型：</td>
					<td width="6%">
					   <select class="default-text-input wper80" id="mark_type" name="mark_type">
					      <option value="1">渠道经理</option>
					      <option value="2">宽固经理</option>
					   </select>
					</td>
					<td width="1%">
						   <a class="default-btn" href="#" id="searchBtn"
						    style="float: right; margin-right: 18px;">查询</a>
					</td>
				 <tr>
				</table>
			</form>
			<div class="default-dt dt-autoH" style="margin-top: 10px;">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled" id="dataTable">
						<thead>
							<tr>
							    <th class="first">账期</th>
								<th>地市</th>
								<th>营服</th>
								<th>HR编码</th>
								<th>姓名</th>
								<th>指标名称</th>
								<th>权重(%)</th>
								<th>得分</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
					 </table>
				</div>
				<div id="saveDiv" style="margin-top:20px;text-align:center;">
					<a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-ok" onclick="save();">保存</a>
			    </div>
			</div>
		</div>
	</div>
</body>
</html>