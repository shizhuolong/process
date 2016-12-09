<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
    String city_name=request.getParameter("city_name");
    city_name=java.net.URLDecoder.decode(city_name,"UTF-8"); 
    String group_id_1_name=request.getParameter("group_id_1_name");
    group_id_1_name=java.net.URLDecoder.decode(group_id_1_name,"UTF-8"); 
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>查看</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/channel_town_list_detail.js"></script>
<style>
  .aui_title{cursor: move; display: block;width: 1000px;}
</style>

</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<input type="hidden" id="login_name" value="<%=user.getUsername()%>">
	
	<div data-options="region:'center',title:'列表'">
		<div id="container">
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
				 <a class="default-gree-btn fLeft mr10" href="#" id="openAdd" onclick="openAdd();">新增</a>
					<table class="default-table sticky-enabled">
					<thead>
						<tr>
						    <th class="first">区县归属</th>
							<th class="first">乡镇归属</th>
							<th class="first">操作</th>
						</tr>
					</thead>
					<tbody id="dataBody">
					</tbody>
					<tr>
						<td colspan="4">
								<div class="page_count">
									<div class="page_count_left">
										共有 <span id="totalCount"></span> 条数据
									</div>
	
									<div class="page_count_right">
										<div id="pagination"></div>
									</div>
								</div>
						</td>
					</tr>
				</table>
				</div>
			</div>
		</div>
	</div>
	<div class="sticky-wrap" id="updateFormDiv" style="display:none;">
		<form id="updateForm" method="POST">
		  <input type="hidden" id="id" name="id"/>
			<table class="default-table sticky-enabled">
				<tr>
					<td style="padding-left: 60px;">乡镇归属:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="乡镇归属不能为空" name="town_name" id="town_name"></td>
				</tr>
				<tr></tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn" onclick="cancel('updateFormDiv');">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
    
    <div class="sticky-wrap" id="addFormDiv" style="display:none;">
		<form id="addForm" method="POST">
		<input type="hidden" id="city_id" name="city_id" value="<%=request.getParameter("city_id")%>">
		<input type="hidden" id="city_name" name="city_name">
		<input type="hidden" id="group_id_1" name="group_id_1" value="<%=request.getParameter("group_id_1")%>">
		<input type="hidden" id="group_id_1_name" name="group_id_1_name">
			<table class="default-table sticky-enabled">
				<tr>
					<td style="padding-left: 60px;">乡镇归属:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="乡镇归属不能为空" name="town_name" id="add_town_name"></td>
				</tr>
				<tr></tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="addSaveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="addCancleBtn" onclick="cancel('addFormDiv');">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
</body>
<script type="text/javascript">
   $("#city_name").val("<%=city_name%>");
   $("#group_id_1_name").val("<%=group_id_1_name%>");
</script>
</html>