<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道补贴积分兑换调整</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.stickyheader.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/workflow/workorder/activityApproval/processEdit/js/channel_subsidy_pay_approve_edit.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="workTitle"  value="${workOrderVo.title}"/>
	<input type="hidden" id="workTaskId"  value="${workOrderVo.actNodeKey}"/>
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
		<div id="container">
				<div id="cc" style="width: 100%;">
						<div id="main" class="clearfix">
							<div class="main-block">
						<form id="taskEditForm" method="post">
								<div class="title">
									<i></i>${workOrderVo.title}
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<th style="width: 100px;">渠道编码：</th>
										<td style="width: 180px;">
											<input type="hidden" id="businessKey" name="businessKey" value="${workOrderVo.businessKey}"/>
											<input type="text" id="channelCode" name="channelCode">
										</td>
										<td>
											<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
										</td>
										<td width="3%">
											<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
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
													<th>渠道编码</th>
													<th>渠道名称</th>
													<th>手工兑换积分</th>
													
													<th>手工兑换金额</th>
													<th>累计已兑积分</th>
													<th>累计剩余积分</th>
													<th>累计已兑金额</th>
													
													
													<th>渠道属性</th>
													<th>渠道等级</th>
													<th>本月积分</th>
													<th>本月清算积分</th>
													<th>本月可兑积分</th>
													<th>本月可兑金额</th>
													<th>本半年累计积分</th>
													<th>本半年累计清算积分</th>
													<th>本半年累计可兑积分</th>
													<th>本半年累计可兑金额</th>
												</tr>
											</thead>
											<tbody id="dataBody">
											</tbody>
											<tr>
												<td colspan="20">
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
							</form>
							<jsp:include page="/workflow/workorder/activityApproval/approveCommon.jsp"></jsp:include>
							</div>
						</div>
				</div>
		</div>
	</div>
</body>
</html>