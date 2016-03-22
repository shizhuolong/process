<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser();
     Org org = user.getOrg();
     String path = request.getContextPath();
     Calendar ca=Calendar.getInstance();
 	 ca.add(Calendar.MONTH, -1);
     String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>专租线项目系数配置</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/zzx_ratio_select.js"></script>
<script type="text/javascript">
    var paths="<%=path%>";
</script>
</head>
<body class="" style="overflow-x:auto;margin:5px;margin-top:0;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width: 70%;">
					<tr>
					    <td width="12%" style="padding-left: 10px;">生效时间：</td>
					    <td width="20%">
						  <input type="text"  class="Wdate default-text-input wper80" readonly="true"
						  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=time%>" id="time">
					    </td>
					    <td width="12%">服务号码：</td>
					    <td width="20%">
						  <input class="default-text-input wper80" name="device_number" type="text" id="device_number"/>
					    </td>
						<td width="1%">
							<a style="cursor:pointer;" class="default-btn" id="exportBtn" onclick="downsAll()">导出</a>
						</td>
						
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="importBtn" onclick="importBtn()">批量导入</a>
					    </td>
					    
					     <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="searchBtn">查询</a>
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