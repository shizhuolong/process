<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.*"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>  

<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Map<String,Object> m=(Map<String,Object>)(request.getAttribute("detail"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link
	href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css"
	rel="stylesheet" type="text/css" />
<link
	href="<%=request.getContextPath()%>/platform/theme/style/public.css"
	rel="stylesheet" type="text/css" />
<link
	href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css"
	rel="stylesheet" type="text/css" />
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<%-- <script type="text/javascript"
	src="<%=request.getContextPath()%>/portal/channelManagement/js/business_hall_detail.js"></script> --%>
<title>营业厅固化信息明细</title>
<style type="text/css">
table {
	margin-top: 10px;
	margin-bottom: 20px;
}

table tr th {
	width: 120px;
	padding: 8px 10px;
	text-align: right;
}

table tr td {
	width: 250px;
}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>" />
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>" />
	<input type="hidden" id="code" value="<%=org.getCode()%>" />
	<div id="smartForm">
		<div id="container">
			<div id="content">
				<div id="main" class="clearfix">
					<div class="main-block">
						<div class="title" style="border-bottom: 2px solid #e7d4b3;">
							<i></i><span>固定信息</span>
						</div>
						
						<table class="chanlInfoForom">
							 <tr>
								<th width="200">地市:</th>
								 <td><%=null==m.get("GROUP_ID_1_NAME")?"":m.get("GROUP_ID_1_NAME")%></td> 
								 <th width="200">营业厅名称:</th>
								<td><%=null==m.get("YYY_NAME")?"":m.get("YYY_NAME")%></td> 
							</tr> 
							  <tr>
								<th width="200">主厅编码:</th>
								<td><%=null==m.get("HALL_CODE")?"":m.get("HALL_CODE")%></td>
								<th width="200">营业厅地址:</th>
								<td><%=null==m.get("YYY_ARRE_NAME")?"":m.get("YYY_ARRE_NAME")%></td>
							</tr>
							
							 <tr>
								<th width="200">渠道编码:</th>
								<td><%=null==m.get("HQ_CHAN_CODE")?"":m.get("HQ_CHAN_CODE")%></td>
								<th width="200">是否主厅 :</th>
								<td id="IS_BALL"><%="1"==m.get("IS_BALL")?"是":"否"%></td>
							</tr>
							<tr>
								<th width="200">渠道名称:</th>
								<td><%=null==m.get("CHANNLE_NAME")?"":m.get("CHANNLE_NAME")%></td>
							</tr>
						</table>
						<div class="title" style="border-bottom: 2px solid #e7d4b3;">
							<i></i>可变信息
						</div>
						<table class="chanlInfoForom">
							<tr>
								<th width="210">区域（市级/县级/乡镇/乡镇以下） :</th>
								<td><%=null==m.get("CHANNEL_2_NAME")?"":m.get("CHANNEL_2_NAME")%></td>
								<th width="200">渠道启用时间 :</th>
								<td><%=null==m.get("OPEN_TIME")?"":m.get("OPEN_TIME")%></td>
							</tr>

							<tr>
								<th width="240">营业厅类型（自有产权、租用、租用（赠送）） :</th>
								<td><%=null==m.get("YYY_TYPE")?"":m.get("YYY_TYPE")%></td>
								<th width="200">运营模式（自营、柜台外包、他营）:</th>
								<td><%=null==m.get("OPERATE_TYPE")?"":m.get("OPERATE_TYPE")%></td>
							</tr>

							<tr>
								<th width="240">厅类型（旗舰、标准、小型） :</th>
								<td><%=null==m.get("T_TYPE")?"":m.get("T_TYPE")%></td>
								<th width="200">经营者名称（自营、代理商名称）:</th>
								<td><%=null==m.get("MANAGE_NAME")?"":m.get("MANAGE_NAME")%></td>
							</tr>

							<tr>
								<th width="240">代理商进驻厅的开始时间 :</th>
								<td><%=null==m.get("AGENT_INNER_TIME")?"":m.get("AGENT_INNER_TIME")%></td>
								<th width="200">房屋合同起始日期:</th>
								<td><%=null==m.get("PACT_CREATE_TIME")?"":m.get("PACT_CREATE_TIME")%></td>
							</tr>

							<tr>
								<th width="240">房屋合同截止日期 :</th>
								<td><%=null==m.get("PACT_INACTIVE_TIME")?"":m.get("PACT_INACTIVE_TIME")%></td>
								<th width="200">合同年租金（万元） :</th>
								<td><%=null==m.get("PACT_MONEY")?"":m.get("PACT_MONEY")%></td>
							</tr>

							<tr>
								<th width="240">建筑面积（M2） :</th>
								<td><%=null==m.get("AREA_STRUCTURE")?"":m.get("AREA_STRUCTURE")%></td>
								<th width="200">营业厅人数（联通方）:</th>
								<td><%=null==m.get("YYT_NUM")?"":m.get("YYT_NUM")%></td>
							</tr>

							<tr>
								<th width="240">代理商或厂家驻店人数 :</th>
								<td><%=null==m.get("AGENT_NUM")?"":m.get("AGENT_NUM")%></td>
								<th width="200">自助终端数量（台）:</th>
								<td><%=null==m.get("SELF_SERVICE_NUM")?"":m.get("SELF_SERVICE_NUM")%></td>
							</tr>

							<tr>
								<th width="240">厅经理姓名 :</th>
								<td><%=null==m.get("T_MANAGE_NAME")?"":m.get("T_MANAGE_NAME")%></td>
								<th width="200">店长联系方式:</th>
								<td><%=null==m.get("PHONE")?"":m.get("PHONE")%></td>
							</tr>

							<tr>
								<th width="240">月房租:</th>
								<td><%=null==m.get("MON_RENT")?"":m.get("MON_RENT")%></td>
								<th width="200">物业管理费用:</th>
								<td><%=null==m.get("PM_FEE")?"":m.get("PM_FEE")%></td>
							</tr>

							<tr>
								<th width="240">水电费:</th>
								<td><%=null==m.get("W_AND_E")?"":m.get("W_AND_E")%></td>
								<th width="200">装修费:</th>
								<td><%=null==m.get("FIT_FEE")?"":m.get("FIT_FEE")%></td>
							</tr>

							<tr>
								<th width="240">安保费:</th>
								<td><%=null==m.get("SEC_FEE")?"":m.get("SEC_FEE")%></td>
							</tr>  
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
<style>
.aui_w,.aui_e {
	width: 0px;
}

.aui_c {
	width: 530px;
}
</style>
</html>