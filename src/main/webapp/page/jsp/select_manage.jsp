<%@ page language="java"  import="org.apdplat.module.security.model.User,org.apdplat.module.security.service.UserHolder,java.util.*,java.net.URLDecoder"  contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
User user = UserHolder.getCurrentLoginUser();
String path = request.getContextPath(); 
String loginno =user.getUsername();
%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" URIEncoding="UTF-8"/>
	<title>查询条件管理</title> 
	<script type="text/javascript" > 
		var rootPath = "<%=path%>";  // 定义全局变量
	</script>
	<link href="<%=path%>/page/css/common2.css" rel="stylesheet" type="text/css"></link>
	<link href="<%=path%>/page/css/right.css" rel="stylesheet" type="text/css" />   
	<script type="text/javascript" src="<%=path%>/page/js/common/jquery-1.3.2.min.js"></script> 
	<script type="text/javascript" src="<%=path%>/page/js/select_manage.js"></script> 
</head>

<body> 
<!-- 查询条件管理--> 
<div>
	<form method="post" name="mainForm"  action="<%=path%>/page/reportList!selectManage.action">
	<input type="hidden" id="currPage" name="currPage" />
	<!-- 查询菜单 -->
	<div class="search-div" id="conditions" style=""> 
			<span style="margin-left:5px;"><input type="text" id="selName" name="selName"  class="ipt-txt" value="请输入查询条件名称" title="请输入查询条件名称"  /> </span>
			<span style="margin-left:5px;"><input type="button" id="search" class="btn-search" onclick="findAllSelConfig()" /> </span>
			<span style="margin-left:5px;"><input type="button" id="addBtn" class="add-rpt-button2"  style="font-weight: bold;cursor:pointer;" value="" onclick="parent.openWindow('增加一个查询条件','computer','<%=path%>/page/jsp/select_config.jsp?op=add','')" title="增加一个查询条件"/></span>
		 
	</div>
			
	<!-- 查询内容 -->
	<div class="work-div" style="margin-top: 5px">
		<div class="item p3">
			<div style="width: 99.9%">
				<table border="0" cellspacing="0" cellpadding="0" class="table-normal table-line" id="datalist" width="100%">
					<tr>
						<th>查询条件ID</th>
						<th>查询条件名称</th>
						<th>数据权限</th>
						<th>层级类型</th>
						<th>选项类型</th>  
						<th>创建人</th>
						<th>创建日期</th> 
						<th>操作</th> 
					</tr> 
			       <tbody id="sel" > </tbody>
				   <tbody id="sel_temp" style="display:none;"> 
			     	<tr id="tr_{$selID}" onmouseover="onmouseoverTr({$selID})" onmouseout="onmouseoutTr({$selID})" onclick="onmouseoutTr2()">
							<td style="text-align:center"> {$selID} </td>
							<td style="text-align:left"> <a href="javascript:void(0);" onclick="parent.openWindow('[查询条件查看]{$selName}','computer','<%=path%>/page/jsp/select_config.jsp?op=view&selID={$selID}&loginno=<%=loginno%>',''')" title="查看配置信息" style="text-decoration: none;">{$selName}</a> </td>
							<td style="text-align:center"> {$dataLevel} </td>  
							<td style="text-align:center"> {$selType} </td>
							<td style="text-align:center"> {$isMore} </td>  
							<td style="text-align:center"> {$createUserid} </td>
							<td style="text-align:center"> {$createTime} </td>  
							<td  style="text-align:left;padding-left:50px">
							    <a href="javascript:void(0);" onclick="parent.openWindow('[查询条件查看]{$selName}','computer','<%=path%>/page/jsp/select_config.jsp?op=view&selID={$selID}&loginno=<%=loginno%>','')" title="查看配置信息" style="text-decoration: none;">查看</a>&#12288;
							    <a href="javascript:void(0);" onclick="parent.openWindow('[查询条件修改]{$selName}','computer','<%=path%>/page/jsp/select_config.jsp?op=update&selID={$selID}&loginno=<%=loginno%>','')" title="修改配置信息" style="text-decoration: none;">修改</a>&#12288;
								<a href="javascript:void(0);" onclick="delSel({$selID},'{$selName}');" style="text-decoration: none;">删除</a>
							</td> 
						</tr> 
					</tbody>
				</table> 
		 
		<div id="pageHtml"></div>
		</div> 
	</div>
  </div>
</form>
</div>
<input id="loginno" type="hidden" value="<%=loginno%>"/> 
 <input id="currentPage" type="hidden" value="1"/>
<input id="maxPage" type="hidden" value="1"/>  
<input id="maxRow" type="hidden" value="0"/>
</body>
</html>