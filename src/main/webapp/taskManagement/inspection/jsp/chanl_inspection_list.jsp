<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	Calendar c = Calendar.getInstance();     
	String currentMon = new SimpleDateFormat("yyyyMM").format(c.getTime());
	User user  = UserHolder.getCurrentLoginUser();
	String user_id = user.getId().toString();
	String state = (String)request.getAttribute("state");
	
	String unit_id = (String)request.getAttribute("unit_id");	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道巡检</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.stickyheader.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/taskManagement/inspection/js/chanl_inspection_list.js"></script>
<script type="text/javascript">
	var state = "<%=state%>";
	var unit_id ="<%=unit_id%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
		<div id="container">
			<div id="content">
				<div id="cc" style="width: 100%; height: 500px;">
					<div data-options="region:'center'">
						<div id="main" class="clearfix">
						<form id="taskForm" method="post">
							<input type="hidden" id="actNodeName" name="actNodeName">
							<div class="main-block">
								<div class="title">
									<i></i>渠道巡检
								</div>
								<table style="margin-top: 10px;">
					          		<tr>
					                	<td align="right">巡检任务名称：</td>
					                    <td><input class="default-text-input wper140" name="qinspec_name" id="qinspec_name" type="text"/></td>
					                    <td align="right">开始时间：</td>
					                    <td>
					                    	<input type="text" class="Wdate" id="qstartTime" name="qstartTime" readonly="readonly" onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})" value="" />
					                    </td>
					                     <td align="right">结束时间：</td>
					                    <td>
					                    	<input type="text" class="Wdate" id="qendtTime" name="qendtTime" readonly="readonly" onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})" value="" />
					                    </td>
					                </tr>
					                <tr>
					                	<td align="right">巡检类型：</td>
					                    <td colspan="5">
					                    	<select id="qinspec_type" class="default-text-input" name="qinspec_type">
					                    		<option value="">全部</option>
					                    		<option value="1">日常巡检</option>
					                    		<option value="2">活动巡检</option>
					                    	</select>
					                    </td>
					                </tr>
					                <tr height="35px">
					                	<td colspan="6" align="center">
					                		<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
					                		<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
					                		<% if(state.equals("1")){ %>
					                		<a class="default-140-btn fLeft mr10" href="#" id="addRCInspection">添加日常巡检</a>
					                		<% }%>
					                		<a class="default-140-btn fLeft mr10" href="#" id="addHDInspection">添加活动巡检</a>
					                		<!-- <a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a> -->
					                	</td>
					                </tr>
					            </table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
											<thead>
												<tr>
													<th>巡检任务编号</th>
													<th>巡检任务名称</th>
													<th>巡检类型</th>
													<th>开始时间</th>
													<th>结束时间</th>
													<th>创建人姓名</th>
													<th>操作</th>
												</tr>
											</thead>
											<tbody id="dataBody">
											</tbody>
											<tr>
												<td colspan="7">
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
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>