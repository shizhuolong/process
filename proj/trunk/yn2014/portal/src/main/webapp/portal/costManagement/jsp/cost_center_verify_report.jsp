<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
    Org org = user.getOrg();
    
    int lev = Integer.parseInt(org.getOrgLevel());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>成本中心确认</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css"/>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/cost_center_verify_report.js?v=5"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
		<div id="container">
			<div id="content">
				<div id="cc" style="width: 100%;">
					<div data-options="region:'center'">
						<div id="main" class="clearfix">
						<form id="taskForm" method="post">
							<input type="hidden" id="actNodeName" name="actNodeName">
							<div class="main-block">
								<div class="title">
									<i></i>成本中心确认
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<td width="8%" align="right">地市：</td>
										<td width="15%">
											<select name="regionCode" id="regionCode"  class="default-text-input wper90">
													<option value=''>请选择</option>
											</select>
										</td>
										<td width="8%" align="right">营服中心：</td>
										<td width="20%">
											<select name="unitCode" id="unitCode"  class="default-text-input wper80">
													<option value=''>请选择</option>
											</select>
										</td>
										<td width="10%" align="right">是否划分成本中心：</td>
										<td width="8%">
											<select name="isMarking" id="isMarking"  class="default-text-input wper80">
													<!-- <option value=''>请选择</option> -->
													<option value="1">是</option>
													<option value="0">否</option>
											</select>
										</td>
										<td style="text-decoration: none;text-align:center">
											<a class="default-btn fLeft mr10"  href="#" id="searchBtn">查询</a>
									        <a class="default-btn fLeft mr10" href="#" id="downExcelTemp">导出</a>
										</td>
									</tr>
									<tr>
										<td width="8%" style="text-align:right;">成本中心编码：</td>
										<td width="15%">
											<input class="default-text-input wper80" name="centerCode" type="text" id="centerCode"/>
										</td>
										<td width="8%" style="text-align:right;">成本中心名称：</td>
										<td width="15%">
											<input class="default-text-input wper80" name="centerName" type="text" id="centerName"/>
										</td>
										<td></td>
										<td></td>
										<%if(lev==2){%>
										<td >
											<a class="default-btn fLeft mr10" href="#" id="importExcel">导入Excel</a>&nbsp;&nbsp;&nbsp;
											<a class="default-gree-btn fLeft mr10" href="#" id="confirmBtn">确认成本中心</a>
										</td>
										<%}%> 
									</tr>
								</table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
											<thead>
												<tr>
													<th>地市名称</th>
													<th>成本中心名称</th>
													<th>成本中心代码</th>
													<th>营服名称</th>
													<th>营服编码</th>
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
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>