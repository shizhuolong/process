<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%
	String path = request.getContextPath();
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>游离渠道</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css"/>
<link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.excheck-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=path%>/warningAndMonitor/resourceMonitor/js/free_channel_list.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
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
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>"/>
	<input type="hidden" id="code" value="<%=org.getCode()%>"/>
	<input type="hidden" id="login_name" value="<%=user.getUsername()%>"/>
	<input type="hidden" name="resultMap.page" />
    <input type="hidden" name="resultMap.rows" />
	<div id="smartForm">
		<div id="container">
			<div id="main" class="clearfix">
				<div class="main-block">
					<div class="title">
						<i></i>游离渠道列表
					</div>
					<div id="chose-place">
						<table width="100%" style="margin:10px 0;">
			                <tr style="height:35px;">
			                	<td width="6%" style="padding-left:10px;" align="right">地市：</td>
			                    <td width="15%">
			                    	<select id='orgName' name='orgName' style='width:150px;height:20px;font-size: 12px; '></select>
			                    </td>
			                    <td width="6%" style="padding-left:10px;" align="right">渠道编码：</td>
			                    <td width="15%"><input class="default-text-input wper80" id="hq_chan_code" name="hq_chan_code" type="text"/></td>
			                    <td width="5%" align="right">渠道名称：</td>
			                    <td width="15%"><input class="default-text-input wper80" id="group_id_4_name" name="group_id_4_name" type="text"/></td>
			                </tr>
			                <tr height="35px">
			                	<td colspan="6">
			                		<a class="default-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 400px;">查询</a>
                					<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
                					<a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
			                	</td>
			                </tr>
			            </table>
					</div>
					<div class="default-dt dt-autoH">
						<div class="no-js-table">
							<table class="overflow-y taskTable">
								<thead>
									<tr>
										<th>地市</th>
										<th>营服中心</th>
										<th>渠道编码</th>
										<th>渠道名称</th>
										<th>操作</th>
									</tr>
								</thead>
								<tbody id="dataBody" style="text-align: center;">
								</tbody>
							</table>
							<div class="page_count">
								<div class="page_count_left">
									共有 <span id="totalCount"></span> 条数据
								</div>
	
								<div class="page_count_right">
									<div id="pagination"></div>
								</div>
							</div>
						</div>
	
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
