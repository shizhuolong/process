<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改销售积分指标</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/sale_target_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 130px;">
	<div class="default-dt" style="width: 640px;">
		<div class="sticky-wrap" style="height: 155px;">
			<form id="updateSaleTargetForm" method="POST">
				<input type="hidden" name="sourcecode" id="sourcecode">
				<table class="default-table sticky-enabled">
				<tr>
					<td style="width: 75px;">指标编码:</td>
					<td style="width: 175px;">
						<input type="text" required="true" class="easyui-validatebox" missingMessage="指标编码不能为空" name="itemcode" id="itemcode">
					</td>
					<td>指标描述:</td>
					<td>
						<input type="text" required="true" class="easyui-validatebox" missingMessage="指标描述不能为空" name="itemdesc" id="itemdesc">
					</td>
				</tr>
				<tr>
					<td>业务类型:</td>
					<td>
						<input type="text" required="true" class="easyui-validatebox" missingMessage="业务类型不能为空" name="busitype" id="busitype">
					</td>
					<td>业务描述:</td>
					<td>
						<input type="text" required="true" class="easyui-validatebox" missingMessage="业务描述不能为空" name="busidesc" id="busidesc">
					</td>
				</tr>
				<tr>
					<td>积分值:</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="积分值不能为空" precision="4" name="cre" id="cre">
					</td>
					<td>单价:</td>
					<td>
						<input type="text" class="easyui-numberbox" missingMessage="单价不能为空" precision="4" name="money" id="money">
					</td>
				</tr>
				<tr>
					<td>状态:</td>
					<td colspan="3">
						<select id="state" class="easyui-combobox" name="state" style="width:200px;"> 
							<option value="1">有效</option> 
							<option value="0">无效</option> 
						</select> 
					</td>
				</tr>
				<tr>
	                <td colspan="4" style="padding-left: 240px;">
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