<%@page language="java" import="java.util.*" %>
<%@page import="java.net.*" %>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    User user = UserHolder.getCurrentLoginUser();
    Org org = user.getOrg();
    String path = request.getContextPath();
    List<String> err=(List<String>) request.getAttribute("err");
    Calendar ca=Calendar.getInstance();
    ca.add(Calendar.MONTH, -1);
    String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>未支撑补贴审批导入</title>
<style type="text/css">
	.list_table tr td{
		border-bottom:1px solid #c0e2ef;
		padding: 0.5em 1em;
    	text-align: left;
	}
	.list_table tr td {
		border-left:1px solid #e7d4b3;
	}
	.list_table {
		border-right: 1px solid #e7d4b3;
		width: 525px;
		height: 225px;
	}

</style>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/import_channel_excel.js"></script>
</head>
<body style="min-width:400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<div id="container" style="min-height: 210px;">
	<div style="width: 410px;">
		<form id="importForm" method="post" enctype="multipart/form-data">
			<table class="list_table">
				<tr>
					<td></td>
					<td>上传步骤：</td>
				</tr>
				<tr>
					<td></td>
					<td>(1)点击模板下载，下载对应的EXCEL模板文件。</td>
				</tr>
				<!-- <tr>
					<td></td>
					<td>(2)选择数据去向。</td>
				</tr> -->
				<tr>
					<td></td>
					<td>(2)点击浏览,并选择编辑好的EXCEL文件，提交既可。</td>
				</tr>
				<!-- <tr>
					<td style="width: 70px; text-align: right;">去向：</td>
					<td>
					   <select id="pay_address" name="pay_address">
					      <option value="">请选择</option>
					      <option value="集中系统">集中系统</option>
					      <option value="BSS系统">BSS系统</option>
					   </select>
					</td>
				</tr> -->
				<tr>
					<td style="width: 70px; text-align: right;">上传文件：</td>
					<td><input type="file" size='70' name="uploadFile" /></td>
				</tr>
				<tr>
					<td></td>
					<td><font style="color: red;">(注意：删除上传文件的一条记录时，必须整行删除，否则会上传失败)</font></td>
				</tr>
				<tr>
					<td></td>
					<td><font style="color: red;">(说明：上传的文件必需是下载的模板编辑后的EXCEL文件)</font></td>
				</tr>
				<tr style="height: 35px">
					<td colspan="2">
						<a class="default-btn fLeft mr10" href="#" onclick="importExcel()" style="margin-left: 220px;">提交</a>
					</td>
				</tr>
			</table>
		</form>
	</div>
</div>
</body>
</html>