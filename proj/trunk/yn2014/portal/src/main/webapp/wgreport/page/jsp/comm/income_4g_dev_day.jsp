<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
String path = request.getContextPath();
Calendar l=Calendar.getInstance();
l.add(Calendar.MONTH,-1); 
Calendar c = Calendar.getInstance();     
c.add(Calendar.DATE, -1);

String lastday = new java.text.SimpleDateFormat( "yyyyMMdd").format(c.getTime());
String currentday = new java.text.SimpleDateFormat( "yyyyMMdd").format(c.getTime());

User user = UserHolder.getCurrentLoginUser();
Org org = user.getOrg();
String orgLevel = org.getOrgLevel();
String orgCode = org.getCode();

%>
<%@page import="java.text.Format"%>
<%@page import="java.text.DateFormat"%>
<html>
  <head>
    <title>4G用户发展与收入汇总日报</title>
    <!--	
    pmrt.tb_mrt_agent_comm
    -->
    <script type="text/javascript">
			var group_id = "<%=orgCode%>";
			var group_level = "<%=orgLevel%>";
			group_level = group_level -1;
			var deal_date = "<%=currentday%>";
	</script>
	<link href="<%=path%>/wgreport/bireport/nresources/default/css/reset.css" rel="stylesheet" type="text/css" />
    <link href="<%=path%>/wgreport/bireport/nresources/default/css/common.css" rel="stylesheet" type="text/css" />
    <link href="<%=path%>/wgreport/bireport/nresources/default/css/provincial.css" rel="stylesheet" type="text/css" />
    
	<link href="<%=path %>/wgreport/bireport/css/pub-ana.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/wgreport/bireport/css/plus.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/wgreport/bireport/css/ana/modal-1.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/wgreport/bireport/css/ana/img.css" rel="stylesheet" type="text/css" />
	<link href="<%=path %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="<%=path %>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/common.jquery.js"></script>
	<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/extend.jquery.js"></script>
	<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/plus.js"></script>
	<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/helper.js"></script>
	
	<script type="text/javascript" src="<%=path %>/wgreport/page/javascript/comm/income_4g_dev_day.js"></script>

	<style type="text/css">
		.attend_th {white-space:nowrap;}
	</style>
</head>
  
<body>
  <input type="hidden" id="whereConditon">
  <input type="hidden" id="path" value="<%=path %>" />  
  
	   <div class="search-div"  style="width: 100%; margin-left:3px;" id="contions" >
			<ul>
			   <li><span style="margin-top:7px;;font-size:12px;">日期：</span><input type="text" class="Wdate" id="searchTime" readonly="readonly" onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd', maxDate:'%y-%M-%d'})" value="<%=currentday %>" /></li>
			   <li><input type="button" onclick="searchClick()" class="btn-search" id="searchTime" style="cursor:pointer; margin-top:5px;" /></li>
			   <li style='margin-left:10px;'><input type="button"  class="ana-button" value="导出excel"   id="button_excel"/></li>  
			   <li style='margin-left:5px;'><input type="button"  class="ana-button" value="导出全部"   id="button_all_excel" /></li>
			   <li style='margin-left:20px;margin-top: 5px;'>
			   	<span style="color:red;">(数据稽核中，仅供参考)</span>
			   </li>
			</ul>
		</div>
  
		<div class="work-div" id="workdiv" style="margin-top: 3px">
		<!-- <div class="item p3" style="margin-left: 8px;">	 -->

			<div class="item p3" style="margin-left: 0px;">	
				<!-- 数据展示 -->
				<div class="scrollDiv" id="showtablediv" class="scrollDiv" >
				<table id="tableData" style='margin-left:5px; border-bottom:1px solid #999;'   width='90%' border='0'  cellspacing='0' cellpadding='0' class='table-normal'> <!--   -->
				</table>
				</div>
			</div>
	   </div>
	<div id="excelExportDialog" title="Dialog" style="padding:5px;">
	</div>
	
  </body>
</html>
