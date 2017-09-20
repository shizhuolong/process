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
	/* ca.add(Calendar.MONTH, -1); */
	String dealDate=new SimpleDateFormat("yyyyMMddHH").format(ca.getTime());
	Calendar c=Calendar.getInstance();
	/* c.add(Calendar.DATE, -1); */
	String curMonth = new SimpleDateFormat("yyyy年MM月dd日").format(c.getTime());
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>实时销量明细</title>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<link href="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/themes/default/easyui.css" rel="stylesheet" type="text/css" />

<link href="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/themes/icon.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/jquery.min.js"></script> 
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/locale/easyui-lang-zh_CN.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/echarts.min.js"></script> 
 <script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script> 
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/sales_actual_time.js?v=1"></script> 
<style type="text/css">
/* 让toolbar位置右显示css样式 */
.datagrid-toolbar {
  height: auto;
  padding: 1px 2px;
  border-width: 0 0 1px 0;
  border-style: solid;
  height: 30px;
}
/* 让toolbar位置右显示css样式 */
.datagrid-toolbar table{
    float: right;
}
</style>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<input type="hidden" id="date" value="<%=dealDate%>">
	<div id="cc" class="easyui-layout" style="height:700px;">
	  	<div data-options="region:'center',title:'实时销量明细'"  id="north-iframe"  style="width:60%;">
	  		<div style="padding:2px;background:#fafafa;width:100%;border:1px solid #ccc">
	  			<span>时间：</span><input readonly="readonly" type="text" style="width: 150px;padding:3px;" class="Wdate"
											id="dealDate" name="dealDate" value="<%=dealDate %>"
											onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMddHH'})" />
				<a href="#" id="searchBtn" class="easyui-linkbutton" iconCls="icon-search">查询</a>
			</div>
			<div id="dataGrodDiv">
				<table id="dataGrid"></table>
			</div>
	  		<div style="color:red;text-align:center;width:100%;font-size :small;">
	  			<span><i style="color:green;">双击发展量值或公司名称</i>可在页面页面下端框内看到对应的发展明细</span><br/>
	  			历史账期只保留零点的数据(零点的数据是该历史账期一整天的发展量汇总)
	  		</div>
		 </div>
	    <div data-options="region:'east',title:'数据图表',split:true" style="width:40%;">
	    
	    	<div title="实时销量明细图表">
	    		<div class="title"><i></i><span id="chartDivTitle">实时销量明细图表</span>—<span id="chartDivDate"><%=curMonth%></span></div>
	    		<div class="" id="data_chart" style="height:290px;">
                </div>
	    	</div>
	    </div>
	    
	    <div data-options="region:'south',split:true"style="height:268px;">
	   		<div>
	    		<div class="title"><i></i><span id="chartDivTitle"></span></div>
	    		<div id="chanlDataDeatil">
	    			<table id="chanlDataDeatilTable"></table>
	    		</div>
	    	</div>
	    </div>
	</div>
	</body>
</html>