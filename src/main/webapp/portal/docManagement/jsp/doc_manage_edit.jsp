<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>文件管里</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/themes/default/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/docManagement/js/doc_manage_edit.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div id="">
		<form id="docForm" method="post" enctype="multipart/form-data" action="<%=request.getContextPath()%>/docManagement/docManager_addDoc.action">
			<input type="hidden" name="id" id="id"/>
			<input type="hidden" name="newName"/>
			<input type="hidden" name="oldName" id="oldName"/>
			<table  style="margin-left: 12px ;margin-top:10px;">
				<tr height="35px">
					<td width="20%" style="padding-left: 10px;">文件名称：</td>
					<td>
						<input class="default-text-input wper40" id="oldName0" name="oldName0"  type="text" />&nbsp;(不填写则为上传文件的名称)
				    </td>
				</tr>
				<tr>
					<td width="10%" style="padding-left: 10px;">首页显示：</td>
					<td >
						<select id="isValid" class="default-text-input wper40" name="isValid">
							<option value="1">显示</option>
							<option value="0">不显示</option>
					    </select>
				    </td>
				</tr>
				<tr height="35px">
					<td  style="padding-left: 10px;">文件描述：</td>
					<td>
						<input class="default-text-input wper40" id="description" name="description"  type="text" />
				    </td>
				</tr>
				<tr height="35px">
					<td  style="padding-left: 10px;">文件上传：</td>
					<td>	
						<input class="default-text-input wper40" id="docFile" name="docFile"  type="file" /><br/>
						<font color="red">允许上传的文件类型：zip,rar,gz,tar,apk,pxl,ipa,doc,docx,xlsx,xls,txt,ppt,pptx,pdf,png,jpg,gif</font>
				    </td>
				</tr>
			
				<tr height="80px">
					<td >
						&nbsp;
					</td>
					<td >
						<a class="default-btn" href="javascript:void(0);" style="float:left;margin:10px;margin-left:60px;"
						id="addBtn">保存</a>
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