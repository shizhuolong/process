<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
String path = request.getContextPath();
String exceedFlag = request.getParameter("exceedFlag");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>审批意见公用界面</title>
<link href="<%=path%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/workflow/js/qtip/jquery.qtip.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/workflow/js/jui/themes/redmond/jquery-ui-1.9.2.custom.min.css">
<link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
var path = "<%=path%>";
var exceedFlag = "<%=exceedFlag%>";
var processType = "${workOrderVo.processKey}";
var applyUserId = "${workOrderVo.startMan}";
var applyUserName = "${workOrderVo.startManName}";
var processCommon = {
		taskId :"${workOrderVo.taskId}",
		processInstanceId:"${workOrderVo.processInstanceId}",
		queryListType:"${workOrderVo.queryListType}"
};
</script>
<%-- <script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/workorder/activityApproval/graphTrace.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/js/jui/jquery-ui-1.9.2.min.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/js/qtip/jquery.qtip.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/js/jquery.outerhtml.js"></script> --%>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.excheck-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/workorder/activityApproval/graphTrace.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/workorder/activityApproval/approveCommon.js?v=2"></script>
</head>
<body>
	<div id="defer-list">
		<%-- <div>
			<span class="txt">
				<a class="trace" style="cursor:pointer;"  pid="${workOrderVo.processInstanceId}" title="点击查看流程图">审核流转图</a>
			</span>
       	 </div>
       	 <br/> --%>
		<div class="title-o">
			<i>审批意见</i>
		</div>
		<div class="default-dt">
		<table id="table-color2" class="overflow-y" style="text-align:center;">
			<tr>
				<th width="15%">序号</th>
				<th width="15%">审批环节</th>
				<th width="15%">审批人</th>
				<th width="15%">审批状态</th>
				<th width="25%">审批意见</th>
				<th width="15%">审批时间</th>
			</tr>
			<tbody id="processHistory">
			</tbody>
		</table>
		</div>
		<c:if test="${workOrderVo.queryListType == 'wait'}">
			<form method="post" id="taskForm">
				<input type="hidden" id="taskId" name="workOrderVo.taskId" value="${workOrderVo.taskId}"/>
			    <input type="hidden" id="noEditUrl" name="workOrderVo.noEditUrl" value="${workOrderVo.noEditUrl}"/>
			    <input type="hidden" id="editUrl" name="workOrderVo.editUrl" value="${workOrderVo.editUrl}"/>
			    <input type="hidden" id="processInstanceId" name="workOrderVo.processInstanceId" value="${workOrderVo.processInstanceId}"/>
			    <input type="hidden" id="startMan" name="workOrderVo.startMan" value="${workOrderVo.startMan}"/>
			    <input type="hidden" id="title" name="workOrderVo.title" value="${workOrderVo.title}"/>
			    <input type="hidden" id="businessKey" name="workOrderVo.businessKey" value="${workOrderVo.businessKey}"/>
			    <input type="hidden" id="processKey" name="workOrderVo.processKey" value="${workOrderVo.processKey}"/>
			    <input type="hidden" id="actNodeName" name="workOrderVo.actNodeName" value=""/>
			    <input type="hidden" id="isNeedApprover" name="isNeedApprover" value="true"/>
			    <input type="hidden" id="isHavingFile" name="isHavingFile"/>
			    <!-- 金额>xx时为true否则为false -->
			    <input type="hidden" id="maxAmountFlag" name="workOrderVo.exceed" value="false"/>
				<div id="chose-sender">
					<div class="title-o">
						<i>选择发送人</i>
					</div>
					<table style="height: 120px; width: 70%;" class="mt10">
						<tr>
							<td width="10%">审批：</td>
							<td width="90%">
								<!-- <ul class="audit_list">
									<li><a class="audit_btn" href="#">通过</a></li>
									<li><a class="audit_btn select" href="#">冻结</a></li>
									<li><a class="audit_btn" href="#">解冻</a></li>
									<li><a class="audit_btn" href="#">拒绝支付</a></li>
								</ul> -->
								<select id="passOrNot" name="workOrderVo.passOrNot" onchange="changeNextRouter()">
									<option value="true">同意</option>
									<option value="false">不同意</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>审批意见：</td>
							<td>
							<textarea rows="5" cols="70" class="audit_text-input" id="approveAdvice" name="workOrderVo.desc">同意</textarea>
							</td>
						</tr>
					</table>
					<table width="70%">
						<tr>
							<td width="10%">审核步骤：</td>
							<td width="35%">
								<select id="nextRouter" name="workOrderVo.nextRouter" style="padding: 2px;font-size:13px;" onchange="findTaskExterPro()">
		    					</select>
							</td>
							<td width="15%" class="approver_td">选择下一步审批人：
								<input id="nextDealer" type="hidden" value="" name="workOrderVo.nextDealer"/>
							</td>
							<td width="35%" class="approver_td">
								<div class="ztree"  id="nextDealerTree">
								</div>
							</td>
						</tr>
					</table>
				</div>
				<div class="center mt30 mb20">
					<table width="100%;">
						<tr>
							<td width="50%" class="right">
								<a href="javascript:void(0)"  class="default-btn fRight mr10" onclick="submitTask()" id="sendTask">发送</a>
							</td>
							<td width="50%" class="left">
								<a href="javascript:void(0)" class="default-btn fLeft ml10" onclick="history.go(-1);">返回</a>
							</td>
						</tr>
					</table>				
				</div>
			</form>
		</c:if>
		<c:if test="${workOrderVo.queryListType != 'wait'}">
		<div class="center mt30 mb20">
			<a href="javascript:void(0)" class="default-btn mauto" onclick="window.history.back();">返回</a>
		</div>
		</c:if>
	</div>
</body>
</html>