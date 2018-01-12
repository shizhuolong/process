<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%
    String path=request.getContextPath();
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String paySession=session.getId();
	Calendar ca=Calendar.getInstance();
    ca.add(Calendar.DAY_OF_MONTH, -1);
    String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>批量续签</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/uploadify.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery.easyui.min.js"></script>
<script type="text/javascript" type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jqueryUpload/swfobject.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jqueryUpload/jquery.uploadify.v2.1.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/contract/js/channel_batch_renew.js?v=25"></script>
<script type="text/javascript">
   var path="<%=path%>";
   var paySession="<%=paySession%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="uu_id" value="<%=request.getParameter("id")%>">
	<div id="smartDiv">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
		<div id="container">
			<div id="content">
				<div id="cc" style="width: 100%; height: 500px;">
					<div data-options="region:'center'">
						<div id="main" class="clearfix">
						<form id="taskForm" method="post">
						    <input type="hidden" id="isHavingFile" name="isHavingFile">
							<input type="hidden" id="actNodeName" name="actNodeName">
							<input type="hidden" id="id" name="id">
							<input type="hidden" id="type" name="type" value="2">			    
							
							<div class="main-block">
								<div class="title">
									<i></i>批量续签
								</div>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
												<thead>
													<tr>
										                 <th style="width: 70px;">工单主题：</th>
									                     <td colspan="6">
														    <input class="default-text-input w480" id="theme" name="theme" type="text" />
														 </td>						                                     	
									                </tr>
												    <tr>
												        <th rowspan="2">渠道编码</th>
                                                        <th rowspan="2">渠道名称</th>
                                                        <th rowspan="2">开始月</th>
                                                        <th rowspan="2">结束月</th>
                                                        <th rowspan="2">合作年份</th>        
                                                        <th rowspan="2">年考核指定金额</th>
                                                        <th rowspan="2">以收定支考核系数</th>
                                                        <th rowspan="2">装修补贴</th>
                                                        <th rowspan="2">合作模式</th>
                                                        <th rowspan="2">房租（房补）</th>
                                                        <th colspan="4">考核进度</th>
												    </tr>
													<tr>
														<th>1-3月</th>
														<th>1-6月</th>
														<th>1-9月</th>
														<th>1-12月</th>
													</tr>
												</thead>
												<tbody id="dataBody">
												</tbody>
										</table>
									</div>
								</div>	
								
								 <div class="title-o"><i style="margin-top:20px;">上传附件</i></div>
								<span style="color:red;font-size:10px;">注意：上传采取批量覆盖的方式，支持批量上传；先点击添加附件选择文件，再点击开始上传。</span>
								<!-- 上传附件 -->
								<div region="south" style="height:auto;" >
									<div style="margin-left:10px;margin-top:10px"><input type="file" name="uploadify" id="uploadify" align="right"/></div>
									<br/>
									<div id="fileQueue"></div> 
									<p><span id="speed"></span></p>
									<p>
										&nbsp;&nbsp;<a style="font-size:15px;" href="javascript:uploasFile()">开始上传</a>&nbsp;
										<a style="font-size:15px;"  href="javascript:jQuery('#uploadify').uploadifyClearQueue()">取消选择</a>
									</p>
								</div> 
								<!--上传附件-->
								
                              <div id="chose-sender">
                               	<div class="title-o"><i style="margin-top:40px;">选择发送人</i></div>
                               	<table width="100%" id="sm-payment-order-apply">
                                     <tr>
                                         <td width="15%">审核步骤：</td>
                                         <td width="35%">
                                     		<input class="default-text-input" name="nextRouter" type="text" id="nextRouter" value="市场部经理" readonly="readonly"/>
                                         </td>
                                         <td width="25%">选择下一步审批人：</td>
                                         <td width="35%">
                                       		<select class="default-text-input wper80" id="nextDealer" name="nextDealer">
                                       		</select>
                                         </td>
                                     </tr>
                                 </table>    
                               </div>
                               <div class="center mt30 mb20">
                               		<input type="button" class="default-btn mauto" value="发送" id="submitTask" style="border: 0px;float:left;">
                                    <input type="button" class="default-btn mauto" value="返回" onclick="toBack();" style="border: 0px;float:left">
                               </div>
							</div>
							
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>