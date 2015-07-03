<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
String path = request.getContextPath();
Calendar l=Calendar.getInstance();
l.add(Calendar.MONTH,-1);
String currentmon = new java.text.SimpleDateFormat("yyyyMM").format(l.getTime());
User user =	UserHolder.getCurrentLoginUser();
Org org = user.getOrg();
%>
<%@page import="java.text.Format"%>
<%@page import="java.text.DateFormat"%>

<html>
  <head>
    <title>主体财务成本下沉</title>
    <!--	
    PMRT.TB_MRT_COST_RPT_BUDGET
    -->
    <script type="text/javascript">
	var path = '<%=path%>';
	var group_id = '<%=org.getCode()%>';
	var group_level = '<%=org.getOrgLevel()%>';
	group_level = group_level -1;
	var deal_date = '<%=currentmon%>';
	var end_dealDate = '<%=currentmon%>';
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
<script type="text/javascript" src="<%=path %>/wgreport/page/javascript/costManagement/pmrt_prov_gb_cw.js"></script>
	<style type="text/css">
		.attend_th {white-space:nowrap;}
	</style>
</head>
  <body>
  <input type="hidden" id="whereConditon">
  <input type="hidden" id="path" value="../" />
	<div class="search-div" style="width: 100%; margin-left: 3px;"
		id="contions">
		<ul>
			<li><span style="font-size: 12px">开始帐期</span>&nbsp;<input
				type="text" class="Wdate" id="searchTime" readonly="readonly"
				onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"
				value="<%=currentmon%>" /></li>
				<li><span style="font-size: 12px">结束帐期</span>&nbsp;<input
				type="text" class="Wdate" id="endTime" readonly="readonly"
				onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"
				value="<%=currentmon%>" /></li>
			<li><input type="button" class="btn-search" id="search"
				style="cursor: pointer" /></li>
			<li style='margin-left: 20px;'><input type="button"
				class="ana-button" value="导出excel" id="button_excel" /></li>
			<li style='margin-left:5px;'><input type="button"  class="ana-button" value="导出全部"   id="button_all_excel"  style="margin-top: 3px;"/></li>
		</ul>
	</div>
	<!-- <div id="MessageLayer"></div> -->
	<div class="work-div" id="workdiv" style="margin-top: 3px">
		<div class="item p3" style="margin-left: 0px;">
			<div id="target-data" style="height: 100%; width: 100%">
				<div id="data" style="width: 100%;">
					<!-- 数据展示 -->
					<div id="showtablediv" class="">
						<table id="tableData"
							style='margin-left: 5px; border-bottom: 1px solid #cebb9e;'
							width='90%' border='0' cellspacing='0' cellpadding='0'
							class='table-normal'>
							<thead></thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- <fieldset style='margin-left:10px;'>
	    <legend><font size="3" style="color:blue;">说明</font></legend>
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="black">1、2g语音收入。</font>	<br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="black">2、3g语音收入 。</font>	<br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="black">3、3g上网卡收入。</font><br/>														
	    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="black">4、固网收入。</font><br/>	
  	</fieldset> -->
  </body>
</html>