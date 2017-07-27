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
<title>铁塔含室分报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report-fix.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/iron_ability_mon.js?v=7"></script>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
				    <td width="4%" style="text-align:right;">账期：</td>
					<td width="15%">
						<input type="text"  class="Wdate default-text-input wper80" readonly="readonly"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time%>" id="time">
					</td>
					<td width="4%">地市：</td>
					<td width="15%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
								<option value="">全部</option>
						</select>
					</td>
					<td width="6%">营服中心：</td>
					<td width="15%">
						<select name="unitCode" id="unitCode" class="default-text-input wper80">
								<option value="">全部</option>
						</select>
					</td>
					<td width="1%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right;">查询</a>
					</td>
					<td width="1%">
						<a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="reppeatBtn" onclick="repeatImport()">导入</a>
					</td> 
					<td width="1%" style="padding-left:10px;">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
				<tr height="35px">
				  <td width="6%" style="text-align:right;">是否入库：</td>
					<td width="1%">
						     <select name="is_in_unit" id="is_in_unit" class="default-text-input wper100">
								<option value=''>请选择</option>
								<option value='是'>是</option>
								<option value='否'>否</option>
						     </select>
				    </td>
				    <td width="6%">塔类型：</td>
					<td width="15%">
						<select name="iron_type" id="iron_type" class="default-text-input wper80">
								<option value="">全部</option>
								<option value="存量自有">存量自有</option>
								<option value="既有共享">既有共享</option>
								<option value="存量改造">存量改造</option>
								<option value="存量自改">存量自改</option>
								<option value="新建塔">新建塔</option>
								<option value="室分产品">室分产品</option>
						</select>
					</td>
					<td width="6%" style="text-align:right;margin-left:10px;"><a id="rule" style="color:blue;cursor:pointer;" onclick="toRules();">取数规则</a></td>
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