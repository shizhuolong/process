<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%
User user = UserHolder.getCurrentLoginUser();
Org org = user.getOrg();
Calendar ca=Calendar.getInstance();
ca.add(Calendar.DATE, 0);
String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>常见问题</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/themes/default/default.css" rel="stylesheet" type="text/css" />
	<link	href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css"	rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/kindeditor-min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/kindeditor/lang/zh_CN.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/quest/js/comm_problem.js"></script>
	<style>
	 	#questDataBody{
	 		margin-top:32px;
			margin-left:50px;
			width:80%;
			float:left;
			border:solid 1px #2F4F4F;
		}
		#commonDataBody{
			margin-top:32px;
			margin-left:50px;
			width:80%;
			float:left;
			border:solid 1px #2F4F4F;
			/* background:green; */
		}
		h1{
			color:orange;
			text-align:center;
			}
		#rightTitle{
			/* margin-right:50px; */
			/* margin-top:15%; */
			width:20px;
			right:40px;
    		top:100px;
			position:fixed ;
		}
		#rightTitle a{
			color: #8fde62;
			text-align:center;
			font-size:150%;
			font-weight:bold;
		}
		
		#rightTitle a:hover{
			color:#FF6600;
		}
		.menu{
			position:fixed ;
			padding:none;
			margin:0px 20px 0px 20px;
			height:30px;
			width:90%;
			background:#FF8C00; 
			border-radius: 3px;
		}
		.menu li{
			position:relative;
			list-style:none;
			float:left;
			display:block;
			height:30px;
		}
		.menu li a {
			display:block;
			padding:0 60px;
			margin:1px 0;
			line-height: 28px;
			text-decoration: none;
			border-left: 1px solid #393942;
			border-right: 1px solid #4f5058;
			font-family: Helvetica, Arial, sans-serif;
			font-weight: bold;
			font-size: 17px;
			color: #f3f3f3;
			text-shadow: 1px 1px 1px rgba(0,0,0,.6);
			transition: color .2s ease-in-out;
		}
		
		.menu li:first-child a {
			color: #8fde62;
			border-left: none;
		}
		.menu li:last-child a {
			border-right: none;
		}
		.menu li:hover > a {
			color: #FF6600;
		}
		#common_quest_countent{
			resize:none;
			width:100%;
		}
		#common_quest_answer{
			resize:none;
			width:100%;
			height:100px;
		}
		#add_comment_quest_button{
			
			float:right;
		}
		#add_comment_quest{
			margin:0 0 70px 0;
		}
	</style>
</head>
<body>
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="userName" value="<%=user.getUsername()%>">
<input type="hidden" id="dealDate" value="<%=dealDate%>">
	<ul class="menu">
	  <li><a id="show_commonDataBody">常见问题</a></li>
	  <li><a id="show_dataBody">用户提问</a></li>
	 </ul>
	 <div id="commonDataBody">
		<h1>常见问题</h1>
		<!-- <button id="add_comment_quest_button" class="default-btn right mr10">添加常见问题</button> -->
		<!-- <div id="add_comment_quest">
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
		</div> -->
		<div id="commonQuest">
			
		</div>
	</div>
	<div id="questDataBody" style="display:none">
		<h1>用户提问</h1>
		<div id="userQuest">
		
		</div>
	</div>
	<div id="rightTitle"><span><a id="comm_quest_add">添加常见问题</a><br/><br/><br/><a id="user_quest_add">我 要 提 问</a></span></div>
</body>
</html>