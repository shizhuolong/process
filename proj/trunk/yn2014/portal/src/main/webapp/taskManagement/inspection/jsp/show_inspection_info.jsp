<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>巡检详细信息</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/inspection/js/show_inspection_info.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<form id="updateSpectionFrom" method="post">
							<input type="hidden" id="inspec_id" name="inspec_id" value="${inspec_id }">
							<input type="hidden" id="taskInfoJsonStr" name="taskInfoJsonStr">
							<div class="title-o"><i>巡检详细信息</i></div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 15%;">巡检任务名称：</th>
	           						<td style="width: 20%;" id="inspec_name">
	           						</td>
	           						<th style="width: 10%;">开始日期：</th>
	                            	<td style="width: 10%;" id="startTime">
	            					</td>
	            					<th style="width: 10%;">结束日期：</th>
	                            	<td id="endTime">
	            					</td>
	                           	</tr>
	                           	<tr class='xx_cj'>
	           						<th style="width: 15%;">巡检人：</th>
	           						<td style="width: 20%;" id="inspec_user">
	           						</td>
	           						<th style="width: 10%;">巡检人电话：</th>
	                            	<td style="width: 10%;" id="inspec_user_phone">
	            					</td>
	                           	</tr>
	                           	<tr class="xx_cj">
	           						<th style="width: 15%;">所需收集信息：</th>
	           						<td style="width: 20%;" colspan="5">
	           							产品信息<input readOnly="readOnly" type="checkbox" name="taskCode" value="T01"/>
	           							佣金政策信息<input readOnly="readOnly" type="checkbox" name="taskCode" value="T02"/>
	           							营销活动信息<input readOnly="readOnly" type="checkbox" name="taskCode" value="T03"/>
	           						</td>
	                           	</tr>
	                           	<tr>
	           						<th style="width: 15%;">巡检任务描述：</th>
	           						<td style="width: 20%;" colspan="5">
	           							<textarea rows="4" cols="81"  id="inspec_desc" readonly="readonly"></textarea>
	           						</td>
	                           	</tr>
	                       	</table>
	                       	<div class="title rc_hd" style="margin-top: 20px;"><i></i>已选择的巡检渠道</div>
	                       	<div class="default-dt dt-autoH rc_hd" style="margin-top: 12px;">
                             	<div class="no-js-table">
                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
                                		<thead>
                                			<tr>
                      						<th>巡检渠道名称</th>
	                                       	<th>渠道编码</th>
	                                       	<th>巡检人</th>
	                                       	<th>巡检人电话号码</th>
	                                       	<th>指派巡检次数</th>
	                                       	<th>操作</th>
	                                    </tr>
                              			</thead>
                              			<tbody id="selected_inspection_chanl">
                              			</tbody>
                              		</table>
                              	</div>
	                       	</div>
	                       	 <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<table class="overflow-y taskTable" style="margin-top: 5px;">
	                       			<tr>
						                <td style="padding-left: 480px;">
							                <a href="javascript:void(0)" onclick="closeHdDialog()" class="default-btn fLeft ml10" id="cancleBtn">关闭</a>
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