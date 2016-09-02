<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>无协议渠道管理</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/notreaty_manager_list.js"></script>
<script type="text/javascript">
	var privileges='<%=user.getAuthoritiesStr()%>';
	function isGrantedNew(role){
	    if(privileges.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
	        return true;
	    }
	    if(privileges.toString().indexOf(role)==-1){
	        return false;
	    }
	    return true;
	}
</script>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<div data-options="region:'west',split:false,title:'无协议渠道管理'"
		style="width: 220px; padding: 10px;">
		<div id="ztree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'无协议渠道管理'">
		<div id="container">
			<form id="searchForm" method="post">
				<input type="hidden" name="resultMap.page" /> <input type="hidden"
					name="resultMap.rows" />
				<table width="100%" style="margin: 10px 0;">
					<tr height="35px">
						<td width="5%" style="padding-left:10px;">渠道名称：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chanlName" name="chanlName" type="text" /></td>
						<td width="5%">渠道编码：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chanlCode" name="chanlCode" type="text" /></td>
						<!-- <td width="8%" ><a class="default-btn" href="#"
							id="addBtn">新增</a> -->
					</tr>
					<tr height="35px">
						<td width="5%" style="padding-left:10px;">营服中心：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="unitName" name="unitName" type="text" /></td>
						<td width="5%">是否有效：</td>
						<td width="20%">
							<select id="status" class="default-text-input wper40" name="status" style="float:left;">
	                    		<option value="">全部</option>
	                    		<option value="1">有效</option>
	                    		<option value="0">无效</option>
	                    	</select>
	                    	<!-- <a class="default-btn" href="#"
							id="searchBtn" style="float:right;margin-right:48px;">查询</a> -->
						</td>
						<!-- <td><a class="default-btn" href="#"
							id="exportBtn">导出</a></td></td> -->
					</tr>
					<tr>
						<td colspan="4">
							<%
								String auth = user.getAuthoritiesStr();
								if(auth.toString().indexOf("ROLE_SUPERMANAGER") !=-1) {
							%>
								<a class="default-btn fLeft mr10" href="#" id="addBtn" style="margin-left: 300px;">新增</a>
							<%
								} else if(auth.toString().indexOf("ROLE_MANAGER_RESOURCEMANAGER_PROCESSTIME_NOT-REATY-MANAGER_UPDATEPART") != -1){
							%>
								<a class="default-btn fLeft mr10" href="#" id="addBtn" style="margin-left: 300px;">新增</a>
							<%}%>
                         	<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
                         	<a class="default-gree-btn fLeft mr10" href="#" id="exportBtn">导出</a>
                        </td>
					</tr>
				</table>
			</form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">渠道名称</th>
								<th>渠道编码</th>
								<th>地市</th>
								<th>营服中心</th>
								<th>HR编码</th>
								<th>渠道经理</th>
								<th>渠道经理电话</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
						<td colspan="8">
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
</body>
</html>