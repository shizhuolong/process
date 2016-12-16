<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道补贴(编辑)</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/workflow/workorder/activityApproval/processEdit/js/import_subsidyInput_edit.js"></script>
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
						<form id="taskEditForm" method="post">
								<div class="title">
									<i></i>渠道补贴导入
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<td>
											<a class="default-gree-btn fLeft mr10" href="#" id="downExcelTemp">模板下载</a>
											<a class="default-gree-btn fLeft mr10" href="#" id="importExcel">清空重导</a>
										</td>
									</tr>
								</table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
										  <thead>
											<tr>
												<th>发展渠道编码</th>
												<th>发展渠道名称</th>
												<th>结算渠道编码</th>
												<th>结算渠道名称</th>
												<th>帐期</th>
												<th>客户类型</th>
												<th>补贴用途</th>
												<th>补贴方式</th>
												<th>补贴金额</th>  
												<th colspan='2'>操作</th>
											</tr>
										  </thead>
											<tbody id="dataBody">
											</tbody>
											<tr>
												<td colspan="11">
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
							<jsp:include page="/workflow/workorder/activityApproval/approveCommon.jsp"></jsp:include>
							</div>
						</div>
				</div>
		</div>
	</div>
	<div class="sticky-wrap" id="updateFormDiv" style="display:none;">
		<form id="updateForm" method="POST">
		  <input type="hidden" id="seque_no" name="seque_no"/>
			<table class="default-table sticky-enabled">
			    <tr>
					<td style="padding-left: 60px;">补贴用途:</td>
					<td>
					  <select id="subsidy_type" name="subsidy_type">
					    <option value="">请选择</option>
					    <option value="房屋补贴">房屋补贴</option>
					    <option value="装修费补贴">装修费补贴</option>
					    <option value="设施补贴">设施补贴</option>
					    <option value="宣传补贴">宣传补贴</option>
					    <option value="其他一次性补贴">其他一次性补贴</option>
					  </select>
					</td>
				</tr>
				<tr>
					<td style="padding-left: 60px;">补贴方式:</td>
					<td>
					  <select id="subsidy_way" name="subsidy_way">
					    <option value="">请选择</option>
					    <option value="实物">实物</option>
					    <option value="现金">现金</option>
					  </select>
					</td>
				</tr>
				<tr>
					<td style="padding-left: 60px;">补贴金额:</td>
					<td><input type="text" required="true" class="easyui-validatebox" missingMessage="补贴金额不能为空" name="subsidy_fee" id="subsidy_fee"></td>
				</tr>
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn" onclick="save();">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn" onclick="cancel();">取消</a>
	                </td>
				</tr>
			</table>
		</form>
    </div>		
</body>
</html>