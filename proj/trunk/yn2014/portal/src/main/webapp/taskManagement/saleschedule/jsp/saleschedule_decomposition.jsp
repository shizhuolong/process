<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String id = request.getParameter("taskId");
	String userType = request.getParameter("userType");
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
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/saleschedule_decomposition.js?v=4"></script>
<script type="text/javascript">
	var id = '<%=id%>';
	var path = '<%=path%>';
	var userType = '<%=userType%>';
	if(userType == "" || userType == null) {
		userType = "";
	}
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
						<form id="taskDecompositionFrom" method="post">
							<input type="hidden" name="dateType" id="dateType">
							<input type="hidden" name="dateValue" id="dateValue">
								<input type="hidden" name="taskInfoJsonStr" id="taskInfoJsonStr"/>
								<input type="hidden" name="taskCode" id="taskCode">
								<input type="hidden" name="task_region_code" id="task_region_code">
								<input type="hidden" name="taskId" id="taskId" value="<%=id%>">
	                       	<div class="title" style="margin-top: 5px;"><i></i>排产任务</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
                             	<div class="no-js-table">
                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
                                		<thead>
                                			<tr>
                                			<th>地域</th>
	                                       	<th>指标名称</th>
	                                       	<th>指标单位</th>
	                                       	<th>业务类型</th>
	                                       	<th>指标值</th>
	                                       	<th>已分解任务值</th>
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
	                                    	 	<th>指标名称</th>
	                                      		<th>指标单位</th>
	                                      		<th>业务类型</th>
	                                      		<th>指标值</th>
	                                   		</tr>
	                                   	</thead>
	                             	</table>
	                             </div>
	                       	</div>
	                       	<div class="center mt30 mb20">
	                       		<table align="center">
	                       			<tr>
										<td width="50%" class="right" style="border-right: none;" colspan="2">
											<a href="#" class="default-btn fRight mr10" onclick="doSubmit()">保存</a>
										</td>
						                <td width="50%" class="left" style="border-left: none;" colspan="2">
						                	<a href="#" class="default-btn fLeft ml10" onclick="window.history.back();">返回</a>
						                </td>
									</tr>
	                       		</table>
                            </div>
                       	</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>