<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>编辑名单制小区信息</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/network_std6_update.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 220px;">
	<div class="default-dt" style="width: 640px;">
		<div class="sticky-wrap" style="height: 220px;">
			<form id="updateForm" method="POST">
				<input type="hidden" name="std_6_id" id="std_6_id">
				<table class="default-table sticky-enabled">
				<tr>
					<td align="right">名单制小区编码：</td>
					<td id="std6id" colspan="3"></td>
				</tr>
				<tr>
					<td align="right">名单制小区名称：</td>
					<td id="std6name" colspan="3"></td>
				</tr>
				<tr>
					<td style="width: 75px;" align="right">住户数：</td>
					<td style="width: 175px;">
						<input type="text" class="easyui-numberbox"  name="house_pe" id="house_pe">
					</td>
					<td align="right">覆盖住户数：</td>
					<td>
						<input type="text" class="easyui-numberbox" name="cover_house_pe" id="cover_house_pe">
					</td>
				</tr>
				<tr>
					<td align="right">经度：</td>
					<td>
						<input type="text" name="jd" id="jd">
					</td>
					<td align="right">纬度：</td>
					<td>
						<input type="text" name="wd" id="wd">
					</td>
				</tr>
				<tr>
					<td align="right">装维联系人：</td>
					<td>
						<input type="text" name="zw_name" id="zw_name">
					</td>
					<td align="right">装维联系人电话：</td>
					<td>
						<input type="text" name="zw_name_num" id="zw_name_num">
					</td>
				</tr>
				<tr>
					<td align="right">业务办理联系人：</td>
					<td>
						<input type="text" name="service_name" id="service_name">
					</td>
					<td align="right">业务办理联系人号码：</td>
					<td>
						<input type="text" name="service_num" id="service_num">
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