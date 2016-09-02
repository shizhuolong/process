<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>成本预算修改</title>
<style type="text/css">
	.list_table tr td{
		border-bottom:1px solid #c0e2ef;
		padding: 0.4em 1em;
    	text-align: left;
	}
	.list_table tr td {
		border-left:1px solid #e7d4b3;
	}
	.list_table {
		border-right: 1px solid #e7d4b3;
		width: 600px;
		height: 225px;
	}
</style>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/import_cost_budget_update.js"></script>
</head>
<body style="min-width:400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 210px;">
	<div style="width: 600px;">
		<form id="importUpdateForm" method="post">
			<input type="hidden" id="id" name="id">
			<input type="hidden" id="f" name="f">
			<table class="list_table">
				<tr>
					<td>帐期：</td>
					<td id="deal_date"></td>
					<td>地市名称：</td>
					<td id="group_id_1_name"></td>
				</tr>
				<tr>
					<td>营服中心：</td>
					<td id="unit_name"></td>
					<td>成本中心代码：</td>
					<td id="cost_center_code"></td>
				</tr>
				<tr>
					<td>成本中心名称：</td>
					<td id="cost_center_name"></td>
					<td>基层单元成本项：</td>
					<td id="unit_item"></td>
				</tr>
				<tr>
					<td>预算科目编码：</td>
					<td id="budget_item_code"></td>
					<td>预算科目名称：</td>
					<td id="budget_item_name"></td>
				</tr>
				<tr>
					<td>预算金额：</td>
					<td>
						<input type="text" required="true" class="easyui-numberbox" missingMessage="预算金额不能为空" precision="2" name="budget_money" id="budget_money">
					</td>
					<td>占收比：</td>
					<td>
						<input type="text" required="true" min="0.01" max="1.00" class="easyui-numberbox" missingMessage="占收比不能为空" precision="2" name="zsb_rate" id="zsb_rate">
					</td>
				</tr>
				<tr>
					<td>标识：</td>
					<td id="flag" colspan="3"></td>
				</tr>
				<tr style="height: 35px">
					<td colspan="4">
						<a class="default-btn fLeft mr10" href="#" style="margin-left: 210px;" id="saveBtn">提交</a>
						<a class="default-btn fLeft mr10" href="#" id="cancleBtn">取消</a>
					</td>
				</tr>
			</table>
		</form>
	</div>
</div>
</body>
</html>