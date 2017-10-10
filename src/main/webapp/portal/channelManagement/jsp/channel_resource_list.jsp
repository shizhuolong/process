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
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>渠道资源管理</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/channel_resource_list.js?v=3"></script>
<script type="text/javascript">
	var privileges='<%=user.getAuthoritiesStr()%>';
	function isGrantedNew(role) {
		if (privileges.toString().indexOf("ROLE_SUPERMANAGER") != -1) {
			return true;
		} else if (privileges.toString().indexOf(role) ==-1) {
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
	<input type="hidden" id="login_name" value="<%=user.getUsername()%>">
	<input type="hidden" id="isHavingMark" value="<%=request.getParameter("isHavingMark")%>">
	<div data-options="region:'west',split:false,title:'渠道资源管理'"
		style="width: 220px; padding: 10px;">
		<div id="ztree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'渠道资源管理'">
		<div id="container">
			<form id="searchForm" method="post">
				<input type="hidden" name="resultMap.page" /> <input type="hidden"
					name="resultMap.rows" />
				<table width="100%" style="margin: 10px 0;">
					<tr height="35px">
						<td width="10%" style="padding-left: 10px;">渠道名称：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="hq_chan_name" name="hq_chan_name" type="text" /></td>
						<td width="10%">渠道编码：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="hq_chan_code" name="hq_chan_code" type="text" /></td>
						<!-- <td width="8%" rowspan="2"><a class="default-btn" href="#"
							id="searchBtn">查询</a></td> -->
					</tr>
					<tr height="35px">
						<td width="10%" style="padding-left: 10px;">是否划分营服中心：</td>
						<td width="20%">
							<select class="default-text-input wper80" name="is_default" id="is_default">
								<option value="">全部</option>
								<option value="0">是</option>
								<option value="1">否</option>
							</select>
						</td>
						<td width="10%">渠道属性1：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chn_cde_1_name" name="chn_cde_1_name" type="text" /></td>
					</tr>
					<tr height="35px">
						<td width="10%" style="padding-left: 10px;">渠道属性2：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chn_cde_2_name" name="chn_cde_2_name" type="text" /></td>
						<td width="10%">渠道属性3：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chn_cde_3_name" name="chn_cde_3_name" type="text" /></td>
					</tr>
					<tr height="35px">
						<td width="10%" style="padding-left: 10px;">渠道属性4：</td>
						<td width="20%"><input class="default-text-input wper80"
							id="chn_cde_4_name" name="chn_cde_4_name" type="text" /></td>
					    <td width="10%">是否打标：</td>
						<td width="20%">
							<select class="default-text-input wper80" name="isMark" id="isMark">
								<option value="">全部</option>
								<option value="1">是</option>
								<option value="0">否</option>
							</select>
						</td>
					</tr>
					<tr height="35px">
				     	<td width="10%" style="padding-left: 10px;">是否代理点：</td>
						<td width="20%">
							<select class="default-text-input wper80" name="isAgent" id="isAgent">
								<option value="">全部</option>
								<option value="1">是</option>
								<option value="0">否</option>
							</select>
						</td>
						<td width="10%" >是否战略渠道：</td>
                        <td width="20%">
                            <select class="default-text-input wper80" name="isStart" id="isStart">
                                <option value="">全部</option>
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </td>
					</tr>
					<tr>
						<td colspan="4">
                         	<a class="default-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 300px;">查询</a>
                         	<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
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
							<th class="first">地市名称</th>
							<th>营服中心</th>
							<th>渠道名称</th>
							<th>渠道编码</th>
							<th>代理点类型</th>
							<th>渠道属性1</th>
							<th>渠道属性2</th>
							<th>渠道属性3</th>
							<th>渠道属性4</th>
							<th>战略渠道简称</th>
                            <th>战略渠道级别</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody id="dataBody">
					</tbody>
					<tr>
						<td colspan="10">
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
	
	<div class="sticky-wrap" id="updateAgentFormDiv" style="display:none;">
		<form id="updateAgentForm" method="POST">
			<table style="height:100px;">
				<tr>
					<td style="width:100px;">代理点类型:</td>
					<td style="width:100px;">
					  <select id="agent_chnl_id" name="chnl_id" style="width:100px;">
					  </select>
					</td>
					<td style="width:100px;">
					  <a style="margin-left: 20px;" class="default-gree-btn fLeft mr10" href="#" id="agentMoreChnl" onclick="openAgentChnlType();">更多</a>
					</td>
				</tr>
				<tr colspan="3">
				    <td style="width:100px;">区县归属:</td>
					<td style="width:100px;">
					  <select id="agent_city_id" name="city_id" style="width:100px;">
					  </select>
					</td>
				</tr>
				<tr>
				    <td style="width:100px;">乡镇归属:</td>
					<td style="width:100px;">
					  <select id="agent_town_id" name="town_id" style="width:100px;">
					  </select>
					</td>
					<td style="width:100px;">
					  <a style="margin-left: 20px;" class="default-gree-btn fLeft mr10" href="#" id="agentMoreTown" onclick="openAgentTownType();">更多</a>
					</td>
				</tr>
				<tr>
	                <td style="padding-left: 120px;padding-top: 20px;" colspan="3">
		                <a href="#" class="default-btn fLeft mr10" id="updateAgentBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn" onclick="cancel('updateAgentFormDiv');">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
    
    <div class="sticky-wrap" id="updateNotAgentFormDiv" style="display:none;">
		<form id="updateNotAgentForm" method="POST">
			<table style="height:200px;">
				<tr colspan="3">
				    <td style="width:100px;">区县归属:</td>
					<td style="width:100px;">
					  <select id="notAgent_city_id" name="city_id" style="width:100px;">
					  </select>
					</td>
				</tr>
				<tr>
				    <td style="width:100px;">乡镇归属:</td>
					<td style="width:100px;">
					  <select id="notAgent_town_id" name="town_id" style="width:100px;">
					  </select>
					</td>
					<td style="width:100px;">
					  <a style="margin-left: 20px;" class="default-gree-btn fLeft mr10" href="#" id="notAgentMoreTown" onclick="openNotAgentTownType();">更多</a>
					</td>
				</tr>
				<tr>
	                <td colspan="3" style="padding-left: 120px;width:100px;">
		                <a href="#" class="default-btn fLeft mr10" id="updateNotAgentBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn" onclick="cancel('updateNotAgentFormDiv');">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
</body>
</html>