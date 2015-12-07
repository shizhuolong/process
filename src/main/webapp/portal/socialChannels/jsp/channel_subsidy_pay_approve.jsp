<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道补贴审批工单生成</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/channel_subsidy_pay_approve.js"></script>
<script type="text/javascript">
</script>
</head>
<style>
html{height:100%;overflow:hidden}
body{height:100%; overflow:hidden; margin:0px; padding:0px;}
</style>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<table style="height:100%;width:100%;">
		<tr height='30px'>
			<td>
				<form id="form" method="post">
					<table width="100%" style="margin: 10px 0; border: none;">
						<tr height="35px">
							<td width="5%" style="padding-left: 10px;">工单标题：</td>
							<td width="60%"><input type="text"
								class="Wdate default-text-input" style="width: 500px;"
								value="渠道分等分级补贴工单" id="title" name="title"></td>
							<td width="3%"><a class="default-btn" href="#" id="btn"
								style="float: right;">生成审批工单</a></td>
						</tr>
					</table>
				</form>
			</td>
		</tr>
		<tr height="">
			<td>
				<iframe id="dataframe" name="dataframe" frameborder="0" scrolling="auto"  width="100%" height="100%" src="<%=request.getContextPath()%>/portal/socialChannels/jsp/tab_mrt_integral_dev_report.jsp">
		
				</iframe>
			</td>
		</tr>
	</table>
</body>
<script type="text/javascript">
$(function(){
var winy=$(window).height()-65;
$("#dataframe").height(winy);
$(window).resize(function(){
	var winy=$(window).height()-65;
	$("#dataframe").height(winy);
});
$("#btn").click(function(){
		var title=$("#title").val();
		var month=$("#time",window.frames["dataframe"].document).val();
		createWorkOrder(month,title);
	});
});
function createWorkOrder(month,title){
		art.dialog.confirm("您确定提交审批吗？",function(){
			$("#form").form("submit",{
				url:$("#ctx").val()+'/channelSubsidyPay/channel-subsidy-pay!createWorkOrder.action?dealDate='+month,
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h2>正在发送中，请稍等...</h2></div>",
						fadeIn: 700,
						centerY: true,
						showOverlay: true
					});	
					return true;
				},
				success:function(data){
					data=eval('('+data+')');
					jQuery.unblockUI();
					if(data.ok==true) {
						art.dialog({
				   			title: '提示',
				   		    content: "提交成功！",
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    }
				   		});
					}else{
						art.dialog({
				   			title: '提示',
				   		    content: data.msg,
				   		    icon: 'error',
				   		    lock: true,
				   		    ok: function () {
				   		    }
				   		});
					}
					return false;
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("发送失败！"+errorThrown);
			   	}
	      	});
		},function(){
			art.dialog.tips('执行取消操作');
		});	
}
</script>
</html>