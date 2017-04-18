<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca = Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String dealDate = new SimpleDateFormat("yyyyMM").format(ca
			.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<title>营业厅固话信息维护</title>
<link
	href="<%=request.getContextPath()%>/platform/theme/style/public.css"
	rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/css/jpagination.css">
<link type="text/css" rel="stylesheet"
	href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css">
<script type="text/javascript"
	src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/portal/channelManagement/js/business_hall_info.js?v=14"></script>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">

	<div data-options="region:'center'">
		<div id="container">
			<form id="searchForm" method="post">
				<!-- <input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" /> -->
				<table width="100%" style="margin: 10px 0;">
					<tr height="35px">
						<td width="6%" style="text-align: right;">账期：</td>
						<td width="15%"><input type="text"
							class="Wdate default-text-input wper80" readonly
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})"
							value="<%=dealDate%>" id="deal_date" /></td>
						<td width="6%" style="text-align: right;">主厅编码：</td>
						<td width="15%"><input class="default-text-input wper80"
							id="hall_code" name="hall_code" type="text" /></td>
						<td width="6%" align="right">是否主厅：</td>
						<td width="15%"><select name="is_ball" id="is_ball"
							class="default-text-input wper80">
								<option value="">全部</option>
								<option value="0">否</option>
								<option value="1">是</option>
						</select></td>
					</tr>
					<tr>
						<td colspan="4"><a class="default-btn fLeft mr10" href="#"
							id="searchBtn" style="margin-left: 250px;">查询</a> <a
							class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
						</td>
					</tr>
				</table>
			</form>
			<div class="default-dt dt-autoH" style="overflow: auto;">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="frist">地市</th>
								<th>营业厅名称</th>
								<th>主厅编码</th>
								<th>营业厅地址</th>
								<th>渠道编码</th>
								<th>是否主厅</th>
								<th>渠道名称</th>
								<th>渠道启用时间</th>
								<th>营业厅类型（自有产权、租用、自有+租用）</th>
								<th>运营模式（自营、柜台外包、他营）</th>
								<th>厅类型（旗舰、标准、小型）</th> 
								<th>经营者名称（自营、代理商名称）</th>
								<th>代理商进驻厅的开始时间</th>
								<th>房屋合同起始日期</th>
								<th>房屋合同截止日期</th>
								<th>合同年租金（万元）</th>
								<th>建筑面积（M2）</th>
								<th>营业厅人数（联通方）</th>
								<th>代理商或厂家驻店人数</th>
								<th>自助终端数量（台）</th>
								<th>厅经理姓名</th>
								<th>店长联系方式</th>
								<th>月房租</th>
								<th>物业管理费用</th>
								<th>水电费</th>
								<th>装修费</th>
								<th>安保费</th> 
								<th>操作</th>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="30">
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
</body>
</html>