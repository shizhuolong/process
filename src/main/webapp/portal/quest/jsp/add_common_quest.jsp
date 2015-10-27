<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%
	String askTime = request.getParameter("dealDate");
	String askName = request.getParameter("userName");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>问题新增</title>
<link	href="<%=request.getContextPath()%>/platform/theme/style/public.css"	rel="stylesheet" type="text/css" />
<link	href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css"	rel="stylesheet" type="text/css" />
<link	href="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/themes/default/default.css"	rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/kindeditor-min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/quest/js/add_common_quest.js"></script>
<style>
	#common_quest_countent{
		width: 500px;
		height: 44px;
		resize:none;
	}
	#common_quest_answer{
		width:500px;
		height:200px;
		resize:none;
	}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<input type="hidden" id="askTime" value="<%=askTime%>"/>
	<input type="hidden" id="askName" value="<%=askName%>"/>
	<input type="hidden" id="answerTime" value="<%=askTime%>"/>
	
			<div class="default-dt">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
							<tr>
								<td align="right">问题名称:</td>
							<td>
								<input type="text" style="width:500px" name="common_quest_name" id="common_quest_name">
							</td>
						</tr>
						<tr>
						<td align="right">问题描述:</td>
						<td>
							<div class='askArea'>                                                                        
	 							<textarea id='common_quest_countent' name='common_quest_countent' placeholder='请输入问题描述'></textarea>   
							</div>    
						</td>
					</tr>
						<tr>
							<td align="right">问题答案:</td>
							<td>
								<div class='answerArea'>                                                                        
		 							<textarea id='common_quest_answer' name='common_quest_answer' placeholder='请输入问题答案'></textarea> 
								</div>    
							</td>
						</tr>
						<tr>
							<td   class="right" style="border-right: none;"></td>
							<td   class="left"style="border-left: none;">
								<a href="#" style="margin: 0 50px"class="default-btn fLeft ml10" id="saveBtn">确定</a>
								<a href="#"class="default-btn fLeft ml10" id="cancleBtn">取消</a>
							</td>
						</tr>
					</table>
				</div>
			</div>
	
</body>
</html>