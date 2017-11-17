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
<title>计算薪酬</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/reportNew/js/chnl_salary_mon.js?v=24"></script>
<style type="text/css">
  #lch_DataHead TR TH,#lch_DataBody TR TD{
   min-width: 10px;
  }
  #detailTable{
    border-collapse:separate; border-spacing:0px 2px;
    width:100%;
  }
  #detailTable th{
   border:1px solid #c0e2ef;
   font-size:15px;
  }
  #detailTable td{
   border:1px solid #c0e2ef;
   font-size:15px;
  }
  #detailTable tr{
   margin:1px 0;
  }

</style>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id=region value="<%=org.getRegionCode()%>">
		<form id="searchForm" method="post" style="width:100%">
			<table style="width:70%;margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="2%" style="padding-left: 1px;" align="right">账期：</td>
					<td width="4%">
						<input type="text" class="Wdate default-text-input wper80" readonly
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=dealDate %>" id="dealDate">
					</td>
					<td width="2%" align="right">地市：</td>
					<td width="6%">
						<select name="regionCode" id="regionCode" class="default-text-input wper90">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="2%" align="right">营服：</td>
					<td width="6%">
						<select name="unitCode" id="unitCode" class="default-text-input wper90">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="2%" align="right">姓名：</td>
                    <td width="4%">
                        <input name="name" id="name" class="default-text-input wper80">
                    </td>
			        <td width="2%">
                        <a class="default-btn" href="#" id="searchBtn"
                        style="float: right; margin-right: 10px;">查询</a>
                    </td>
                    <td width="2%">
                        <a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
                    </td>
				</tr>
			</table>
		</form>
		<div id="detailDiv" style="display:none;">
		  <table id="detailTable"></table>
		</div>
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