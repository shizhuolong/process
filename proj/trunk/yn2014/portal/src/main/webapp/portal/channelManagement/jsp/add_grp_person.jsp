<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%
	String dealDate = request.getParameter("dealDate");
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.DATE, 0);
	String start_time=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>集客经理</title>
<link	href="<%=request.getContextPath()%>/platform/theme/style/public.css"	rel="stylesheet" type="text/css" />
<link	href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css"	rel="stylesheet" type="text/css" />
<link   href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css"	href="<%=request.getContextPath()%>/css/jpagination.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/add_grp_person.js"></script>
</head>
<body style="min-width: 550px;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="orgCode" value="<%=org.getCode()%>">
	<input type="hidden" id="userName" value="<%=user.getUsername()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
	<input type="hidden" id="dealDate" value="<%=dealDate%>">
	<!--选择发展人编码  -->
	<div class="title" id="step1"><i></i>第一步：选择发展人编码
		<div id="develop" style="width: 550px; height: auto;">
			<div style="width: 550px; height: auto;">
				<form>
					<table width="100%" style="margin: 10px 0; height: auto;">
						<tr>
							<td width="7%">发展人编码：</td>
							<td width="15%"><input class="default-text-input wper80"
								id="dev_code" name="dev_code" type="text" /></td>
							<td width="7%">营服名称：</td>
							<td width="15%"><input class="default-text-input wper80"
								id="unit_name" name="unit_name" type="text" /></td>
							<td width="5%"><a class="default-btn" href="#"
								id="searchBtn">查询</a></td>
						</tr>
					</table>
				</form>
			</div>
			<div class="default-dt" style="width: 550px; height: auto;">
				<div class="sticky-wrap" style="width: 550px; height: auto;">
					<table class="default-table sticky-enabled"
						style="width: 550px; height: auto;">
						<thead>
							<tr>
								<th class="first">选择</th>
								<th>发展人编码</th>
								<th>营服编码</th>
								<th>营服名称</th>
							</tr>
						</thead>
						<tbody id="developDatas">
						</tbody>
						<tr>
							<td colspan="4" style="height: 30px;">
								<div class="page_count">
									<div class="page_count_left">
										共有 <span id="totalCount1"></span> 条数据
									</div>
									<div class="page_count_right">
										<div id="pagination1"></div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td  colspan='3' width="75%" class="right" style="border-right: none;"><a href="#" class="default-btn fRight mr10" id="next1" style="display:none;">下一步</a></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
	<div class="title" id="step2" style="margin-top: 20px;height: auto;display:none;"><i></i>第二步：选择发展人类型
		<div id="type" style="width: 550px;height: auto;">
			<div class="default-dt" style="width: 550px;height: auto;">
				<div class="sticky-wrap" style="width: 550px;height: auto;">
					<table class="default-table sticky-enabled" style="width: 550px;height: auto;">
						<thead>
							<tr>
								<th colspan="2">选择人员</th>
							</tr>
						</thead>
						<tbody>
						<tr id="grpType">
							<td><input type='radio' name='ckHr' value='0' >营业员</td>
							<td><input type='radio' name='ckHr' value='1' >直销发展人</td>
						</tr>
						<tr>
							<td  width="50%" class="right" style="border-right: none;"><a href="#" class="default-btn fRight mr10" id="prev2">上一步</a></td>
							<td  width="50%" class="left"style="border-left: none;"><a href="#"class="default-btn fLeft ml10" id="next2" style="display:none;">下一步</a></td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<!--选择hr编码  -->
	<div class="title" id="step3" style="margin-top: 20px; height: auto;display:none;">
		<i></i>第三步：选择HR编码
		<div id="hr" style="width: 550px;height: auto;">
			<div class="default-dt" style="width: 550px;height: auto;">
				<div class="sticky-wrap" style="width: 550px;height: auto;">
					<table class="default-table sticky-enabled" style="width: 550px;height: auto;">
						<thead>
							<tr>
								<th>选择人员</th>
								<th>人员姓名</th>
								<th>工号</th>
								<th>HR编码</th>
							</tr>
						</thead>
						<tbody id="hrDatas">
						</tbody>
						<tr>
							<td colspan="4" style="height: 30px;">
								<div class="page_count">
									<div class="page_count_left">
										共有 <span id="totalCount2"></span> 条数据
									</div>

									<div class="page_count_right">
										<div id="pagination2"></div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td  width="50%" colspan="2" class="right" style="border-right: none;"><a href="#" class="default-btn fRight mr10" id="prev3">上一步</a></td>
							<td  width="25%" class="right" style="border-right: none;"><a href="#" class="default-btn fRight mr10" id="saveBtn">确定</a></td>
							<td  width="25%" class="left"style="border-left: none;"><a href="#"class="default-btn fLeft ml10" id="cancleBtn">取消</a></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
	
</body>
</html>