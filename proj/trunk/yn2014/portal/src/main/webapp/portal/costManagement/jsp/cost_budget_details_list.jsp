<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>成本预算明细</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/cost_budget_details_list.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
        <input type="hidden" name="unit_id" id="unit_id" value="${unit_id }">
        <input type="hidden" name="deal_date" id="deal_date" value="${deal_date }">
        <input type="hidden" name="init_id" id="init_id" value="${init_id }">
		<div id="container">
			<div id="content">
				<div id="cc" style="width: 100%;">
					<div data-options="region:'center'">
						<div id="main" class="clearfix">
						<form id="taskForm" method="post">
							<input type="hidden" id="actNodeName" name="actNodeName">
							<div class="main-block">
								<div class="title">
									<i></i>成本预算明细
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<th style="width: 100px;">成本中心名称：</th>
										<td style="width: 180px;">
											<input type="text" id="cost_center_name" name="cost_center_name">
										</td>
										<td>
											<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
										</td>
									</tr>
								</table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
											<thead>
												<tr>
													<th>帐期</th>
													<th>地市</th>
													<th>营服中心</th>
													<th>成本中心代码</th>
													<th>成本中心名称</th>
													<th>基层单元成本项</th>
													<th>预算科目编码</th>
													<th>预算科目名称</th>
													<th>预算金额</th>
													<th>占收比</th>
													<th>标识</th>
												</tr>
											</thead>
											<tbody id="dataBody">
											</tbody>
											<tr>
												<td colspan="11">
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