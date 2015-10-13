<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
String deal_date = request.getParameter("deal_date");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/channel_manager_bind_person.js"></script>
</head>
<body style="min-width:500px;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
<input type="hidden" id="deal_date" value="<%=deal_date%>">
<div id="container" style="min-height: 310px;">
	<div style="width: 500px;">
		<form>
			<table width="100%" style="margin: 10px 0;">
				<tr>
					<td width="5%">姓名：</td>
					<td width="20%"><input class="default-text-input wper80" id="name" name="name"  type="text" /></td>
					<td width="5%">帐号：</td>
					<td width="20%"><input class="default-text-input wper80" id="username" name="username" type="text" /></td>
					<td width="8%"><a class="default-btn" href="#" id="searchBtn">查询</a></td>
				</tr>
			</table>
		</form>
	</div>
	<div class="default-dt" style="width: 500px;">
			<div class="sticky-wrap">
				<table class="default-table sticky-enabled">
					<thead>
						<tr>
							<th class="first">选择</th>
							<th>姓名</th>
							<th>帐号</th>
							<th>联系电话</th>
						</tr>
					</thead>
					<tbody id="personDatas">
					</tbody>
					<tr>
						<td colspan="4" style="height: 30px;" >
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
					<tr>
						<td width="50%" class="right" colspan="2"
							style="border-right: none;"><a href="#"
							class="default-btn fRight mr10" id="saveBtn">确定</a></td>
						<td width="50%" class="left" colspan="2" style="border-left: none;"><a href="#"
							class="default-btn fLeft ml10" id="cancleBtn"
							>取消</a></td>
					</tr>
				</table>
			</div>		
	</div>
</div>
</body>
</html>