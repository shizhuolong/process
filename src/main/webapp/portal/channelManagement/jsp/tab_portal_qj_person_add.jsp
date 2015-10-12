<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%><%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
	
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>增加</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/tab_portal_qj_person_add.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 420px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="add" method="POST">
			<input type="hidden" id="code" name="code" value="<%=org.getCode()%>"/>
			<input type="hidden" id="user_code" name="user_code"/>
				<table class="default-table sticky-enabled">
				<tr>
				 <td width="8%">營服中心：
					<select name="unit_name" id="unit_name" onchange="" class="">
						<option value=''>请选择</option>
				    </select>
				 </td>
				 <td width="8%">从业类型：
					<select name="emp_type" id="emp_type" onchange="" class="">
						<option value=''>请选择</option>
				    </select>
				 </td>
				</tr>
				<tr>
				 <td width="8%">岗位类型：
					<select name="job_type" id="job_type" onchange="" class="">
						<option value=''>请选择</option>
				    </select>
				 </td>
				 <td width="8%">主管编码：<input type="text" style="width:100px;" required="true" class="easyui-validatebox" missingMessage="HR编码不能为空" name="hr_id" id="hr_id"/>
				 </td>
				</tr>
				<tr>
				 <td width="8%">工作岗位：
					<select name="job" id="job" onchange="" class="">
						<option value=''>请选择</option>
				    </select>
				 </td>
				 <td width="8%">人员姓名：<input type="text" style="width:100px;" readonly="true" name="name" id="name"/>
				 </td>
				</tr>
				<tr>
				 <td colspan='2' width="8%" style="padding-left: 10px;">生效时间：
						<input type="text"  class="Wdate " 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time%>" name="time" id="time">
				 </td>
				</tr>			
				<tr>
	                <td colspan="2" style="padding-left: 120px;">
		                <a href="#" class="default-btn fLeft mr10" id="saveBtn">保存</a>
		                <a href="#" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
	                </td>
				</tr>
			</table>
		</form>
		</div>
	</div>
</div>
</body>
</html>