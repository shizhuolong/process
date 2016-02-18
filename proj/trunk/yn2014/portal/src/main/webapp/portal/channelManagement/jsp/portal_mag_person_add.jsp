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
	ca.add(Calendar.MONTH, 0);
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/portal_mag_person_add.js"></script>
</head>
<body style="min-width: 400px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="orgLevel" name="orgLevel" value="<%=org.getOrgLevel()%>">
<div id="container" style="min-height: 150px;">
	<div class="default-dt" style="width: 420px;">
		<div class="sticky-wrap" style="height: 150px;">
			<form id="add" method="POST">
			<input type="hidden" id="code" name="code" value="<%=org.getCode()%>"/>
			<input type="hidden" id="chooseMonth" name="chooseMonth"/>
				<table>
				<tr>
				 <td>主管编码：<input type="text" style="margin-left:12px;" required="true" class="easyui-validatebox" missingMessage="主管编码不能为空" name="hr_id" id="hr_id"/>
				 </td>
				</tr>
				<tr>
				  <td>人员姓名：<input type="text" style="margin-left:12px;" required="true" readonly="true" class="easyui-validatebox" missingMessage="人员姓名不能为空" name="name" id="name"/>
				  </td>
				</tr>
				<tr>
				 <td>营业厅编码：<input type="text" required="true" class="easyui-validatebox" missingMessage="营业厅编码不能为空" name="hq_chan_code" id="hq_chan_code"/>
				 </td>
				</tr>
				<tr>
				  <td valign="middle">营业厅名称：<textarea rows="3" cols="20" required="true" readonly="true" class="easyui-validatebox" missingMessage="营业厅名称不能为空" style="" readonly="true" name="hq_chan_name" id="hq_chan_name"></textarea>
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
<div id="describe" style="display:none;">
   <div>1、增加唯一身份</div>
   <div>2、处理营业人员，管理厅长编码</div>
</div>
</body>
</html>