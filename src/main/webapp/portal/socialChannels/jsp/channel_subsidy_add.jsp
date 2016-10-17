<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/channel_subsidy_add.js"></script>
</head>
<body style="min-width: 400px;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="container" style="min-height: 200px;">
		<div class="default-dt" >
			<div class="sticky-wrap" >
				<form id="add" method="POST">
				  <table>
						<tr>
							<td>渠道编码：</td><td><input style="margin-left: 12px;" type="text" required="true" validType="chanCode"
								class="easyui-validatebox" missingMessage="渠道编码不能为空"
								name="hqChanCode" id="hqChanCode" />
							</td>
						</tr>
						<tr>
							<td>渠道名称：</td><td><input type="text" style="margin-left: 12px;"
								readOnly="readonly" name="hqChanName" id="hqChanName" />
							</td>
						</tr>
						<tr>
							<td>审批工单编码：</td><td><input type="text" style="margin-left: 12px;"
								required="true"  class="easyui-validatebox"
								missingMessage="审批工单编码不能为空" name="workNo" id="workNo" />
							</td>
						</tr>
						<tr>
							<td>金额：</td><td><input type="text" style="margin-left: 12px;"
								required="true" class="easyui-validatebox"
								missingMessage="金额不能为空" name="money" validType="money" id="money" />
							</td>
						</tr>
						<tr>
							<td>考核账期数：</td><td>
								<select name="dealDateNum" id="dealDateNum" style="margin-left: 12px;">
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
									
									<option value="9">9</option>
									<option value="10">10</option>
									<option value="11">11</option>
									<option value="12">12</option>
								</select>
							</td>
						</tr>
						<tr>
		                <td colspan="2" style="padding-left: 120px;">
			                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
			                <a href="#" class="default-btn fLeft ml10" id="cancelBtn">取消</a>
		                </td>
					</tr>
				</table>
			</form>
			</div>
		</div>
	</div>
</body>
<script>
	
</script>
</html>