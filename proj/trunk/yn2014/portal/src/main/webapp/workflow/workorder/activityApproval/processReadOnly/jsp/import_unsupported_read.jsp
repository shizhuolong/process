<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
   String path=request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>未支撑补贴审批(只读)</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
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
<script type="text/javascript" src="<%=request.getContextPath()%>/workflow/workorder/activityApproval/processReadOnly/js/import_unsupported_read.js"></script>
<script type="text/javascript">
  var path="<%=path%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
        <input type="hidden" id="taskId" name="taskId" value="${workOrderVo.taskId }">
        <input type="hidden" id="businessKey" name="businessKey" value="${workOrderVo.businessKey }">
		<div id="container">
				<div id="cc" style="width: 100%;">
						<div id="main" class="clearfix">
							<div class="main-block">
						<form id="taskReadForm" method="post">
								<div class="title">
									<i></i>未支撑补贴审批导入
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<th style="width: 80px;">渠道名称：</th>
										<td style="width: 80px;">
											<input type="text" id="channel_name" name="channel_name"/>
										</td>
										<th style="width: 70px;">佣金总额：</th>
									    <td id="totalFee" style="color:red;width: 70px;">
										
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
														<th>结算账期</th>
														<th>渠道名称</th>
														<th>渠道编码</th>
														<!-- <th>渠道类型</th> -->
														<th>佣金大类</th>
														<th>佣金科目</th>
														<th>业务类型</th>
														<th>佣金金额</th>
														<th>佣金总额</th>
														<th>净额</th>
														<th>备注</th>
													</tr>
											</thead>
											<tbody id="dataBody">
											</tbody>
											<tr>
												<td colspan="14">
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
							</form>
							
							<div class="title-o">
			                     <i>附件列表</i>
		                    </div>
							<div id="fileDiv" name="fileDiv">
							  
							</div>
							
							<jsp:include page="/workflow/workorder/activityApproval/approveCommonWithFile.jsp"></jsp:include>
							</div>
						</div>
				</div>
		</div>
	</div>
	
</body>
</html>