<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%
	User user = UserHolder.getCurrentLoginUser();
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>编辑渠道系数</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/chanl_ratio_config_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 130px;">
	<div class="default-dt" style="width: 620px;">
		<div class="sticky-wrap" style="height: 100px;">
			<form id="updateChanlRatioForm" method="POST">
			    <input type="hidden" id="username" name="username" value="<%=user.getUsername()%>"/>
				<input type="hidden" name="groupcode" id="groupcode">
				<input type="hidden" name="groupname" id="groupname">
				<input type="hidden" name="group_id_1" id="group_id_1">
				<input type="hidden" name="month" id="month">
				<table class="default-table sticky-enabled">
				<tr>
					<td style="width: 75px;">渠道编码:</td>
					<td style="width: 175px;">
						<span id="hq_chan_code"></span>
					</td>
					<td>渠道名称:</td>
					<td>
						<span id="group_id_4_name"></span>
					</td>
				</tr>
				<tr>
					<td>服务系数:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="服务系数不能为空" precision="4" min="0.0" value="1.0000" name="server_ratio" id="server_ratio">
					</td>
					<td style="width: 65px;">渠道系数:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="渠道系数不能为空" precision="4" name="ratio" id="ratio">
					</td>
				</tr>
				<tr>
				    <td>包含之后账期:</td>
				    <td colspan="3">
				     <input type="checkbox" name="is_all" id="is_all" checked value="0"/>
				     <span style="color:red;margin-left:20px;">备注:若勾选，则该账期及以后账期的数据将被修改,若不勾，则只修改当前账期的数据。</span>
				    </td>
	                
				</tr>
				<tr>
				    <td colspan="4" style="padding-left: 230px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
	            </tr>
			</table>
		</form>
		</div>
	</div>
</div>
</body>
</html>