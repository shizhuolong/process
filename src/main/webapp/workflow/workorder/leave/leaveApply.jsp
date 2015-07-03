<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>请假申请</title>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript">
var path = "<%=path%>";
$(document).ready(function(){
	alert(11);
	$.ajax({
		  type:"POST",
	      dataType:'json',cache:false,async:true,
	      url:path+"/approver/approver-handler!qryMyDepartLeader.action",
	      data:{}, 
		   success:function(data){
				var str = "";
			   $.each(data,function(i,n){
				   str += "<option value='"+n.USER_ID+"'>"+n.USER_NAME+"</option>";
			   });
			   alert(str);
			   $("#nextDealer").html(str);
		 }
	 });
});
</script>
</head>
<body>
	<fieldset>
		<legend><small>请假申请</small></legend>
		<form action="<%=path%>/leave/leave-handler!submitLeaveOrder.action" method="post">
			<table border="1" width="100%">
				<tr>
					<td>请示主题：</td>
					<td><input type="text" name="title" value=""/></td>
				</tr>
				<tr>
					<td>请假类型：</td>
					<td>
						<select id="leaveType" name="leaveType">
							<option>公休</option>
							<option>病假</option>
							<option>调休</option>
							<option>事假</option>
							<option>婚假</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>开始时间：</td>
					<td><input type="text" id="startTime" name="startTime" /></td>
				</tr>
				<tr>
					<td>结束时间：</td>
					<td><input type="text" id="endTime" name="endTime" /></td>
				</tr>
				<tr>
					<td>请假原因：</td>
					<td>
						<textarea name="reason"></textarea>
					</td>
				</tr>
				<tr>
					<td>下一步审批人：</td>
					<td>
						<select id="nextDealer" name="nextDealer">
						</select>
					</td>
				</tr>
				<tr>
					<td colspan="2" style="text-align:center">
						<button type="submmit">申请</button>
					</td>
				</tr>
			</table>
		</form>
	</fieldset>

</body>
</html>