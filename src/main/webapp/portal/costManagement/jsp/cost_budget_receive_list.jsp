<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.model.Org"%>
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
<title>成本预算接收</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css"/>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/cost_budget_receive_list.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>

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
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
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
									<i></i>成本预算接收
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<th style="width: 50px;">帐期：</th>
										<td style="width: 80px;">
											<input readonly="readonly" type="text" style="width: 80px" class="Wdate"
											id="deal_date" name="deal_date" value=""
											onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" />
										</td>
										<th style="width: 50px;">地市：</th>
										<td style="width: 120px;">
											<select id="group_id_1" name="group_id_1">
												<option value="">请选择地市</option>
											</select>
										</td>
										<th style="width: 100px;">成本中心名称：</th>
										<td style="width: 120px;">
										<select id="unit_name" name="unit_name">
												<option value="">请选择</option>
										</select>
										</td>
										<!-- <td style="width: 180px;">
											<input type="text" id="unit_name" name="unit_name">
										</td>  -->
										<th style="width: 50px;">状态：</th>
										<td style="width: 180px;">
											<select class="default-text-input wper40" name="is_confirm" id="is_confirm">
												<option value="">全部</option>
												<option value="1">已确认</option>
												<option value="0">未确认</option>
											</select>
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
													<th>工单编号</th>
													<th>下发时间</th>
													<th>创建人</th>
													<th>状态</th>
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