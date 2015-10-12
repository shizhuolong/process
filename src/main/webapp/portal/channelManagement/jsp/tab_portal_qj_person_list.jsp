<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
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
<title>唯一身份管理</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css"/>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/tab_portal_qj_person_list.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<div data-options="region:'west',split:false,title:'唯一身份管理'" style="width:220px;padding:10px;">
		<div id="ztree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'唯一身份管理'">
		<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table width="100%" style="margin:10px 0;">
                <tr height="35px">
                    <td width="6%" style="padding-left:10px;">姓名：</td>
                    <td width="15%"><input class="default-text-input wper80" id="name" name="name" type="text"/></td>
                    <td width="5%" style="padding-left:10px;">营服中心：</td>
                    <td width="15%"><input class="default-text-input wper80" id="unit_name" name="unit_name" type="text"/></td>
                </tr>
                <tr height="35px">
                    <td width="6%" style="padding-left:10px;">工作类别：</td>
                    <td width="15%"><input class="default-text-input wper80" id="job_type" name="job_type" type="text"/></td>
                    <td width="5%" style="padding-left:10px;">岗位：</td>
                    <td width="15%"><input class="default-text-input wper80" id="job" name="job" type="text"/></td>
                </tr>
                <tr height="35px">
                	<td width="6%" style="padding-left:10px;">HR编码：</td>
                    <td width="15%"><input class="default-text-input wper80" id="hr_id" name="hr_id" type="text"/></td>
                    <td width="5%" style="padding-left:10px;">申效时间：</td>
                    <td width="15%"><input class="default-text-input wper80" id="active_time" name="active_time" type="text"/></td>
                </tr>
                <tr>
					<td colspan="4">
                        	<a class="default-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 250px;">查询</a>
                        	<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
                        	<a class="default-btn fLeft mr10" href="#" id="addBtn" style="">新增</a>
                        	<a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
                       </td>
				</tr>
            </table>
         </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">营服中心</th>
								<th>姓名</th>
								<th>类别</th>
								<th>岗位</th>
								<th>HR编码</th>
								<th>从业类型</th>
								<th>申效时间</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="6">
								</div>
									<div class="page_count">
										<div class="page_count_left">
											共有 <span id="totalCount"></span> 条数据
										</div>
		
										<div class="page_count_right">
											<div id="pagination"></div>
										</div>
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