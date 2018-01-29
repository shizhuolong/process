<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%
    String path=request.getContextPath();
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>校园先锋</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/icon.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/schoolManagement/js/school_pioneer.js"></script>
<script type="text/javascript">
   var path="<%=path%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<div data-options="region:'north'" style="height: 25px;">
        <a href="#" class="easyui-linkbutton"
            data-options="iconCls:'icon-edit'" onclick="addPioneer()">新增</a>
       <!--  <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'"
            onclick="edit()">修改</a> 
        <a href="#" class="easyui-linkbutton"
            data-options="iconCls:'icon-cancel'" onclick="remove()">删除</a> -->
    </div>
	<div style="margin:5px 0;">
	   <table id="list" class="easyui-treegrid" 
	        style="width:1000px;height:900"
            data-options="
                url: '<%=request.getContextPath()%>/school/school-pioneer!listTree.action', 
                method: 'get',
                idField: 'id',
                treeField: 'PIONEER_NAME'
            ">
        <thead>
            <tr>
                <th data-options="field:'PIONEER_NAME',width:250,editor:'text'">姓名</th>
                <th data-options="field:'PIONEER_PHONE',width:200,editor:'text'">联系电话</th>
                <th data-options="field:'PIONEER_CLASS',width:150,editor:'text'">班级</th>
                <th data-options="field:'SCHOOL_NAME',width:250,editor:'text'">学校</th>
                <th data-options="field:'operate',width:150,editor:'text'">操作</th>
            </tr>
        </thead>
        </table>
	</div>
</body>
</html>