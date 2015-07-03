<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/cost_budget_refuse_info.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 400px;">
		<div class="sticky-wrap" style="height: 180px;width: 430px;">
		<form id="refuseInfoForm" method="post">
			<table class="default-table sticky-enabled">
			<tbody>
				<tr>
					<th>帐期</th>
					<td id="deal_date"></td>
					<th>地市</th>
					<td id="group_id_1_name"></td>
				</tr>
				<tr>
					<th>营服中心</th>
					<td colspan="3" id="unit_name"></td>
				</tr>
				<tr>
					<th>拒绝原因</th>
					<td colspan="3">
						<textarea rows="5" cols="40" id="refuseReason" name="refuseReason" readonly="readonly"></textarea>
					</td>
				</tr>
			</tbody>
			<tr>
                <td class="left" style="border-left: none;padding-left: 190px;" colspan="4">
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