<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%
	String path = request.getContextPath();
	String taskId = request.getParameter("taskId");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>添加销量排产</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/task_common.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/saleschedule_read.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
	var taskId = "<%=taskId%>";
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<form id="justValidateFrom">
							<div class="title-o"><i>排产任务信息</i></div>
							<div class="title" style="margin-top: 20px;"><i></i>任务时间</div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 10%;">时间类型：</th>
	           						<td style="width: 10%;" id="dateType">
	           						</td>
	           						<th style="width: 5%;">时间：</th>
	                            	<td style="width: 80px;">
	                               		<input readonly="readonly" onfocus="blur()" type="text" style="width:80px" class="Wdate" id="dateValue"  name="sale_datepi"  value="" />
	            					</td>
	                           	</tr>
	                       	</table>
	                       	<div class="title" style="margin-top: 20px;"><i></i>指标及总任务值</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                             	<div class="no-js-table">
	                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
	                                		<thead>
	                                			<tr>
	                      							<th>地市</th>
		                                       	<th>指标名称</th>
		                                       	<th>指标单位</th>
		                                       	<th>业务类型</th>
		                                       	<th>指标值</th>
		                                    </tr>
	                              			</thead>
	                              			<tbody id="sumDataBoby">
	                              			</tbody>
	                              		</table>
	                              	</div>
	                       	</div>		
	                        <div class="title" style="margin-top: 20px;"><i></i>任务分解</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<div class="no-js-table">
	                         		<table class="overflow-y taskTable" id="subordinateAreaDataTable">
	                             		<thead>
	                          				<tr>
	                      						<th>下级地域</th>
	                      						<th>状态</th>
	                                    	 	<th>指标名称</th>
	                                      		<th>指标单位</th>
	                                      		<th>业务类型</th>
	                                      		<th>指标值</th>
	                                   		</tr>
	                             		</thead>
	                             		<tbody id="subordinateDataBoby">
                              			</tbody>
	                             	</table>
	                             </div>
	                       	</div>
                       	</form>
                       	<div class="title" style="margin-top: 20px;"><i></i>附件信息</div>
                       	<div class="default-dt dt-autoH">
                            <table id="attachment_Info"></table>
                       	</div>
                       	<div class="center mt20 mb10">
							<a href="javascript:void(0)" class="default-btn mauto" onclick="window.history.back();">返回</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>