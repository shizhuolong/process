<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags" %>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>部署流程</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/style.css">    
<link rel="stylesheet" type="text/css" href="<%=path%>/js/jquery-easyui-1.3.0/themes/default/easyui.css">    
<link rel="stylesheet" type="text/css" href="<%=path%>/js/jquery-easyui-1.3.0/themes/icon.css">    
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
</head>
<body>

	<form action="<%=path%>/workflow/work-flow!deploy.action" method="post" enctype="multipart/form-data">
		<input type="file" name="file" />
		<input type="submit" value="Submit" />
	</form> 

	<table class="easyui-datagrid" style="height:auto">        
	 	<thead>            
 			<tr>               
	 			<!-- <th data-options="field:'attr0'">ProcessDefinitionId</th>    -->             
	 			<!--<th data-options="field:'attr1'">DeploymentId</th>  -->                 
	 			<th data-options="field:'attr2',align:'center',width:150">名称</th>                
	 			<th data-options="field:'attr3',align:'center',width:100">KEY</th>            
	 			<th data-options="field:'attr4',align:'center',width:50">版本号</th>            
	 			<th data-options="field:'attr5',align:'center',width:150">XML</th>            
	 			<th data-options="field:'attr6',align:'center',width:120">图片</th>            
	 			<th data-options="field:'attr7',align:'center',width:200">部署时间</th>            
	 			<th data-options="field:'attr8',align:'center',width:120">是否挂起</th>            
	 			<th data-options="field:'attr9',align:'center',width:200">操作</th>            
 			</tr>        
		</thead>        
		<tbody>     
			<c:forEach items="${pagination.result }" var="object">
				<c:set var="process" value="${object[0] }" />
				<c:set var="deployment" value="${object[1] }" />
				<tr>
					<td>${process.name }</td>
					<td>${process.key }</td>
					<td>${process.version }</td>
					<td><a target="_blank" href='<%=path%>/workflow/work-flow!loadByDeployment.action?processDefinitionId=${process.id}&resourceType=xml'>${process.resourceName }</a></td>
					<td><a target="_blank" href='<%=path%>/workflow/work-flow!loadByDeployment.action?processDefinitionId=${process.id}&resourceType=image'>${process.diagramResourceName }</a></td>
					<td>
						${deployment.deploymentTime}
					</td>
					<td>${process.suspended} |
						<c:if test="${process.suspended }">
							<a href="<%=path%>/workflow/work-flow!updateStateOfProcessDefinition.action?processDefinitionId=${process.id}&state=active">激活</a>
						</c:if>
						<c:if test="${!process.suspended }">
							<a href="<%=path%>/workflow/work-flow!updateStateOfProcessDefinition.action?processDefinitionId=${process.id}&state=suspend">挂起</a>
						</c:if>
					</td>
					<td>
                        <a url='<%=path%>/workflow/work-flow!delete.action?deploymentId=${process.deploymentId}' onclick='delProcess($(this))'>删除</a>
                        <!--  <a href='${ctx }/workflow/process/convert-to-model/${process.id}'>转换为Model</a>-->
                    </td>
				</tr>
			</c:forEach>
		</tbody>  
	</table>   
	<tags:pagination page="${pagination}" paginationSize="${pagination.pageSize}"/>     
</body>
<script type="text/javascript">
  function delProcess(obj){
	  if(confirm("确认要删除？")){
		  var url=obj.attr("url");
		  window.location.href=url;
	  }
  }
</script>
</html>