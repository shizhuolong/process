<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>公告管理</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/themes/default/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/kindeditor-min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/lang/zh_CN.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/bull_manage_edit.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div id="container">
		<form id="bullForm" method="post" enctype="multipart/form-data" action="<%=request.getContextPath()%>/bullManagement/bullManager_addBull.action">
			<input type="hidden" name="id" />
			<table width="830px" style="margin-left: 12px ;margin-top:10px;">
				<tr height="35px">
					<td width="10%" style="padding-left: 10px;">公告标题：</td>
					<td colspan="5">
						<input class="default-text-input wper80" id="bullName" name="bullName"  type="text" />
				    </td>
				</tr>
				<tr height="35px">
					<td width="10%" style="padding-left: 10px;">是否显示：</td>
					<td width="15%">
						<select id="isShow" class="default-text-input wper60" name="isShow">
							<option value="1">显示</option>
							<option value="0">不显示</option>
					    </select>
				    </td>
					<td width="10%">是否置顶：</td>
					<td width="15%">
						<select id="isTop" class="default-text-input wper60" name="isTop">
							<option value="1">置顶</option>
							<option value="0">不置顶</option>
					    </select>
					</td>
					<td width="10%">类型：</td>
					<td width="15%">
						<select id="isManage" class="default-text-input wper60" name="isManage">
							<option value="1">系统公告</option>
							<option value="0">政策通知</option>
					    </select>
					</td>
				</tr>
				<tr height="200px">
					<td width="10%">公告内容：</td>
					<td width="15%" colspan="5">
						<textarea name="content" style="width:95%;"></textarea>
					</td>
				</tr>
				<tr>
					<td width="10%">上传附件：</td>
					<td width="15%" colspan="5" id="files">
						<input type="hidden" name="oldUrls"/>
						<input type="hidden" name="oldUrls0"/>
						<input type="hidden" name="oldNames"/>
						<p id="oldAttachs">
						
						</p>
						<input class="default-text-input wper60" style="margin:5px;" id="file" name="file"  type="file" /><input type="hidden" name="fileName" /><a href="javascript:void(0);" onclick="addMore()">继续添加</a><br/>
					</td>
				</tr>
				<tr height="50px">
					<td colspan="3">
						<a class="default-btn" href="javascript:void(0);" style="float:right;margin:10px;"
						id="addBtn">保存</a>
					</td>
					<td colspan="3">
						<a class="default-btn" href="javascript:void(0);" style="float:left;margin:10px;"
						id="cancelBtn">取消</a>
					</td>
				</tr>
			</table>
		</form>
	</div>
	<script type="text/javascript">
		
		
	</script>
</body>
</html>