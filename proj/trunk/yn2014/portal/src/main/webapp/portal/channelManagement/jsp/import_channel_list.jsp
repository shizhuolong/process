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
<title>合同拟稿人发起审批界面</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jqueryUpload/jquery.uploadify.v2.1.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/import_channel_list.js"></script>
<script type="text/javascript">
   var path="<%=path%>";
   var paySession="<%=paySession%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="username" value="<%=user.getUsername()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<div id="smartForm">
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
							<div class="main-block">
								<div class="title">
									<i></i>渠道导入
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
										<td>
											<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
											<a class="default-gree-btn fLeft mr10" href="#" id="newBtn">新增</a>
											<a class="default-gree-btn fLeft mr10" href="#" id="downExcelTemp">模板下载</a>
											<a class="default-gree-btn fLeft mr10" href="#" id="importExcel">清空导入</a>
										</td>
									</tr>
								</table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
												<thead>
												    <tr>
												        <th rowspan="2">渠道编码</th>
                                                        <th rowspan="2">渠道名称</th>
                                                        <th rowspan="2">开始月</th>
                                                        <th rowspan="2">结束月</th>         
                                                        <th rowspan="2">年考核指定金额</th>
                                                        <th colspan="4">考核进度</th>
                                                        <th rowspan="2">操作</th>
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
												<tr>
												<td colspan="14">
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
										</table>
									</div>
								</div>
								
								<div id="chose-sender">
                               	<div class="title-o"><i style="margin-top:40px;">选择发送人</i></div>
                               	<table width="70%" id="sm-payment-order-apply">
                                     <tr>
                                         <td width="15%">审核步骤：</td>
                                         <td width="35%">
                                     		<input class="default-text-input" name="nextRouter" type="text" id="nextRouter" value="地市管理部门经理审批" readonly="readonly"/>
                                         </td>
                                         <td width="20%">选择下一步审批人：</td>
                                         <td width="35%">
                                       		<select class="default-text-input wper80" id="nextDealer" name="nextDealer">
                                       		</select>
                                         </td>
                                     </tr>
                                 </table>    
                               </div>
                               <div class="center mt30 mb20">
                               		<input type="button" class="default-btn mauto" value="发送" id="submitTask" style="border: 0px;">
                               </div>
							</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="updateFormDiv" style="display:none;">
           <form id="updateForm" method="POST">
           <table style="border-collapse:separate; border-spacing:0px 10px;">
                <tr><th>渠道编码：</th><td><input readonly="readonly" id="up_hq_chan_code" type="text" name="hq_chan_code"/></td></tr>
                <tr><th>渠道名称：</th><td><input readonly="readonly" id="up_hq_chan_name" type="text" name="hq_chan_name"/></td></tr>
                <tr><th>开始月：</th><td><input class="Wdate" id="up_start_month" type="text" readonly="readonly" onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/></td></tr>
                <tr><th>结束月：</th><td><input class="Wdate" id="up_end_month" type="text" readonly="readonly" onclick="WdatePicker({minDate:'#F{$dp.$D(\'up_start_month\')}',isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/></td></tr>
                <tr><th>年考核指定金额：</th><td><input id="up_assess_target" type="text" name="assess_target"/></td></tr>
                <tr><th>考核进度：</th></tr>
                <tr><th>1-3月：</th><td><input id="up_rate_three" type="text" name="rate_three"/></td></tr>
                <tr><th>1-6月：</th><td><input id="up_rate_six" type="text" name="rate_six"/></td></tr>
                <tr><th>1-9月：</th><td><input id="up_rate_nine" type="text" name="rate_nine"/></td></tr>
                <tr><th>1-12月：</th><td><input id="up_rate_twelve" type="text" name="rate_twelve"/></td></tr>
           </table>
           </form>
    </div>
    
    <div id="addFormDiv" style="display:none;">
           <form id="updateForm" method="POST">
           <table style="border-collapse:separate; border-spacing:0px 10px;">
                <tr><th>渠道编码：</th><td><input id="hq_chan_code" type="text" name="hq_chan_code"/></td></tr>
                <tr><th>渠道名称：</th><td><input id="hq_chan_name" type="text" name="hq_chan_name"/></td></tr>
                <tr><th>开始月：</th><td><input class="Wdate" id="start_month" type="text" readonly="readonly" onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/></td></tr>
                <tr><th>结束月：</th><td><input class="Wdate" id="end_month" type="text" readonly="readonly" onclick="WdatePicker({minDate:'#F{$dp.$D(\'start_month\')}',isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/></td></tr>
                <tr><th>年考核指定金额：</th><td><input id="assess_target" type="text" name="assess_target"/></td></tr>
                <tr><th>考核进度：</th></tr>
                <tr><th>1-3月：</th><td><input id="rate_three" type="text" name="rate_three"/></td></tr>
                <tr><th>1-6月：</th><td><input id="rate_six" type="text" name="rate_six"/></td></tr>
                <tr><th>1-9月：</th><td><input id="rate_nine" type="text" name="rate_nine"/></td></tr>
                <tr><th>1-12月：</th><td><input id="rate_twelve" type="text" name="rate_twelve"/></td></tr>
           </table>
           </form>
    </div>  
    
</body>
</html>