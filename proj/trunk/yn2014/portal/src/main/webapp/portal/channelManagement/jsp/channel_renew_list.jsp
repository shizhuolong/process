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
    ca.add(Calendar.MONTH, -1);
    String dealDate=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>渠道续签审批</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/uploadify.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.validate.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/messages_zh.min.js"></script>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/channel_renew_list.js?v=21"></script>
<script type="text/javascript">
   var path="<%=path%>";
   var paySession="<%=paySession%>";
</script>
<style>
.error{
    color:red;
}
</style>
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
						<form id="searchForm" method="post">
							<div class="main-block">
								<div class="title">
									<i></i>渠道续签
								</div>
								<table id="sm-payment-order-apply" style="width: 100%;">
									<tr>
									    <td width="7%" align="right">渠道编码：</td>
					                    <td width="8%">
					                        <input name="hqChanName" id="hqChanName" class="default-text-input wper80"/>
					                    </td>
					                    <td width="6%" style="padding-left: 1px;" align="right">开始月份：</td>
					                    <td width="8%">
					                        <input type="text" style="width:100px" class="Wdate" id="startDate" readonly="readonly" value="<%=dealDate %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMM'})"/>
					                    </td>
					                    <td width="6%" style="padding-left: 1px;" align="right">结束月份：</td>
					                    <td width="8%">
					                        <input type="text" style="width:100px" class="Wdate" id="endDate" readonly="readonly" value="<%=dealDate %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMM'})"/>
					                    </td>
										<td style="padding-left: 20px;">
											<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
											<a class="default-gree-btn fLeft mr10" href="#" id="renewBtn">批量续签</a>
										</td>
									</tr>
								</table>
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
												<thead>
												    <tr>
												        <th rowspan="2">请选择</th>
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
												<td colspan="16">
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
							</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
    <div id="addFormDiv" style="display:none;">
           <form id="taskForm" method="POST">
			 <input type="hidden" id="isHavingFile" name="isHavingFile">
			 <input type="hidden" id="actNodeName" name="actNodeName">
			 <input type="hidden" id="id" name="id">
			 <input type="hidden" id="type" name="type" value="1">			    
           <table style="border-collapse:separate; border-spacing:0px 10px;">
                <tr>
	                 <th style="width: 70px;">工单主题：</th>
                     <td colspan="3">
					    <input class="default-text-input w480" id="theme" name="theme" type="text" />
					 </td>						                                     	
                </tr>
                <tr><th>渠道编码：</th><td><input readonly="readonly" style='border-style:none' id="hq_chan_code" type="text" name="hq_chan_code"/></td>
                <th>渠道名称：</th><td><input readonly="readonly" style='border-style:none' id="hq_chan_name" type="text" name="hq_chan_name"/></td></tr>
                
                <tr><th>开始时间：</th><td><input readonly="readonly" style='border-style:none' id="start_month" type="text" name="start_month"/></td>
                <th>结束时间：</th><td><input readonly="readonly" style='border-style:none' id="end_month" type="text" name="end_month"/></td></tr>
                
                <tr><th>合作年份：</th><td><input readonly="readonly" style='border-style:none' id="hz_year" type="text" name="hz_year"/></td>
                <th>年考核指定金额：</th><td><input min="0" required id="assess_target" type="text" name="assess_target"/></td></tr>
                
                <tr><th>以收定支考核系数：</th><td><input min="0" required id="ysdz_xs" type="text" name="assess_target"/></td>
                <th>装修补贴：</th><td><input id="zx_bt" type="text" name="assess_target"/></td></tr>
                
                <tr><th>合作模式：</th><td><input id="hz_ms" type="text" name="assess_target"/></td>
                <th>房租（房补）：</th><td><input id="fw_fee" type="text" name="assess_target"/></td></tr>
                
                <tr><th colspan="4">考核进度</th></tr>
                <tr><th>1-3月：</th><td><input id="rate_three" type="text" name="rate_three"/></td>
                <th>1-6月：</th><td><input id="rate_six" type="text" name="rate_six"/></td></tr>
                <tr><th>1-9月：</th><td><input id="rate_nine" type="text" name="rate_nine"/></td>
                <th>1-12月：</th><td><input id="rate_twelve" type="text" name="rate_twelve"/></td></tr>
           </table>
           
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
                               		<input type="button" class="default-btn mauto" value="发送" id="submitTask" style="border: 0px;">
                               </div>
							</div>
           </form>
    </div>  
    
</body>
</html>