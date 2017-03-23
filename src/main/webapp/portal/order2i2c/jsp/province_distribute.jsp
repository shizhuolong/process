<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String workNo= request.getParameter("workNo");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>省级订单任务分配</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/portal/order2i2c/css/jquery.jOrgChart.css">
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/json2.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/jquery.jOrgChart.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/province_distribute.js?v=6"></script>
<script type="text/javascript">
	var path = "<%=path%>";
	var workNo = "<%=workNo%>";
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<input id="ctx" type="hidden" value="<%=path%>"/> 
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<table class="default-table sticky-enabled">
							 <tr height="55px">
			                    <th  style="text-align: right;width:300px;">分配方式：</th>
			                    <td style="text-align: left;padding-left:12px;">
			                    	<label>百分比<input   name="disType" type="radio" value="1"/></label>
			                    	<label>绝对值<input   name="disType" type="radio" value="2"/></label>
			                    </td>
			                 </tr>
			                 <tr>
			                    <th  style="text-align: right;" id="teamDesc"></th>
			                    <td style="text-align: left;padding-left:12px;"><input
			                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};distribute();" 
			                    onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};distribute();"
			                     class="default-text-input wper80" style="width:80px;" id="disValue" name="disValue" type="text"/></td>
							 </tr>	
						</table>
						<ul id="team" style="display:none">
					    	<li>订单总数<br/>
					    		<ul>
							         <li>内部团队
							           <ul>
							             <li>张三</li>
							             <li>李四</li>
							           </ul>
							         </li>
							         <li class="fruit">外部团队
							           <ul>
							             <li>张三</li>
							             <li>李四</li>
							             <li>张三</li>
							             <li>李四</li>
							           </ul>
							         </li>
							     </ul>
					     </li>
					   </ul>            
    					<div id="chart" class="orgChart"></div>
    					<table>
    						<tr>
							 	<td colspan=2 style="padding-left:300px;padding-top:12px;"><a class="default-btn" href="javascript:void(0);" id="distributeBtn" onclick="submitDistribute()">重新分配</a></td>
							 </tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>