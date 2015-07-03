<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt"%>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>创建工单</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/style.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/js/jquery-easyui-1.3.0/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/js/jquery-easyui-1.3.0/themes/icon.css">
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
</head>
<body>
	<table class="easyui-datagrid" style="height:auto">        
	 	<thead>            
 			<tr>               
	 			<th data-options="field:'attr2',align:'center',width:150">ID</th>                
	 			<th data-options="field:'attr3',align:'center',width:200">名称</th>            
	 			<th data-options="field:'attr4',align:'center',width:200">描述</th>             
	 			<th data-options="field:'attr5',align:'center',width:300">图片</th>            
	 			<th data-options="field:'attr6',align:'center',width:200">操作</th>             
 			</tr>        
		</thead>        
		<tbody>     
			<c:forEach items="${pagination.result}" var="process">
				<tr>
					<td>${process.id}</td>
					<td>${process.name}</td>
					<td>${process.description }</td>
					<td><a target="_blank" href='<%=path%>/workflow/work-flow!loadByDeployment.action?processDefinitionId=${process.id}&resourceType=image'>${process.diagramResourceName }</a></td>
					<td>
						 <c:if test="${!process.hasStartFormKey}">
                             <a href="javascript:parent.openWindow('新建工单','computer','<%=path%>/workflow/workorder/leave/leaveApply.jsp?processId=${process.id}')">创建工单</a>
                         </c:if>
                         <c:if test="${process.hasStartFormKey}">
                             <a href="javascript:parent.openWindow('新建工单','computer','<%=path%>/workflow/workorder/leave/leaveApply.jsp?processId=${process.id}')">创建工单</a>
                         </c:if>
					</td>
				</tr>
			</c:forEach>
		</tbody>  
	</table>   
	<tags:pagination page="${pagination}" paginationSize="${pagination.pageSize}"/>     
</body>
</html>