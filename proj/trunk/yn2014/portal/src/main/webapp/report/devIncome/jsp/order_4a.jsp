<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>云门户工单同步维护</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
</head>
<body class="" style="overflow-x:auto;">
<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="4%">待办信息的编号：</td>
					<td width="15%">
						<input class="default-text-input wper80" onchange="getInfo()" name="pendingCode" type="text" id="pendingCode"/>
					</td>
					<td width="4%">代办信息标题：</td>
					<td width="15%">
						<input class="default-text-input wper80" name="pendingTitle" type="text" id="pendingTitle"/>
					</td>
				</tr>
				<tr>
					<td width="4%">上一步处理人姓名：</td>
					<td width="15%">
						<input class="default-text-input wper80" name="pendingSource" type="text" id="pendingSource"/>
					</td>
					<td width="4%">上一步处理人邮箱前缀：</td>
					<td width="15%">
						<input class="default-text-input wper80" name="suemail" type="text" id="suemail"/>
					</td>
				</tr>
				<tr>
					<td width="4%">当前处理人邮箱前缀：</td>
					<td width="15%">
						<input class="default-text-input wper80" name="email" type="text" id="email"/>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="btn" onclick="doUpdate()">置为已办</a>
					</td>
					<td width="5%">
						<a class="default-btn" href="#" id="btn" onclick="doDelete()">删除</a>
					</td>
				</tr>
			</table>
		</form>
</body>
<script>
	function getInfo(){
		var sql = "select * from portal.ORDER_PENDING_VIEW v where v.pendingcode='"+$("#pendingCode").val()+"' ";
		var data = query(sql);
		if(data&&data.length){
			data=data[0];
		}else{
			sql = "select * from portal.ORDER_PENDING_VIEW@ynwgyx_200 v where v.pendingcode='"+$("#pendingCode").val()+"' ";
			data = query(sql);
			if(data==null|| data.length<=0)
				return;
			data=data[0];
		}
		
		$("#pendingSource").val(data["PENDINGSOURCE"]);
		$("#pendingTitle").val(data["PENDINGTITLE"]);
		$("#suemail").val(data["PENDINGSOURCEUSERID"]);
		$("#email").val(data["PENDINGUSERID"]);
	}
	function doUpdate(){
		var pendingCode=$("#pendingCode").val();
		var pendingSource=$("#pendingSource").val();
		var pendingTitle=$("#pendingTitle").val();
		var suemail=$("#suemail").val();
		var email=$("#email").val();
		
		 $.ajax({
		 	type:"POST",
	      	dataType:'json',async:false,cache:false,
	      	url:$("#ctx").val()+"/workflow_4a/work-flow4-a!update.action",
	      	data:{
	           pendingCode:pendingCode,
	           pendingSource:pendingSource,
	           pendingTitle:pendingTitle,
	           suemail:suemail,
	           email:email
		   	}, 
		   	success:function(data)
		   	{
		   		alert(data.msg);
		   	}
		 });
	}
	function doDelete(){
		var pendingCode=$("#pendingCode").val();
		var pendingSource=$("#pendingSource").val();
		var pendingTitle=$("#pendingTitle").val();
		var suemail=$("#suemail").val();
		var email=$("#email").val();
		
		 $.ajax({
		 	type:"POST",
	      	dataType:'json',async:false,cache:false,
	      	url:$("#ctx").val()+"/workflow_4a/work-flow4-a!delete.action",
	      	data:{
	           pendingCode:pendingCode,
	           pendingSource:pendingSource,
	           pendingTitle:pendingTitle,
	           suemail:suemail,
	           email:email
		   	}, 
		   	success:function(data)
		   	{
		   		alert(data.msg);
		   	}
		 });
	}
</script>
</html>