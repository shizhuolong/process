<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%
  String path=request.getContextPath();
  String paySession=session.getId();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道考核合同续签审批(编辑)</title>
<%--  <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/platform/theme/style/easyui.css"> --%>

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
<script type="text/javascript" src="<%=request.getContextPath()%>/workflow/workorder/activityApproval/processEdit/js/channel_renew_edit.js?v=9"></script>
<script type="text/javascript">
   var path="<%=path%>";
   var paySession="<%=paySession%>";
</script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="smartForm">
		<input type="hidden" name="resultMap.page" />
        <input type="hidden" name="resultMap.rows" />
		<div id="container">
				<div id="cc" style="width: 100%;">
						<div id="main" class="clearfix">
							<div class="main-block">
						<form id="taskEditForm" method="post">
								<div class="title">
									<i></i>渠道考核合同续签审批(修正)
								</div>
								
								<div class="default-dt dt-autoH">
									<div class="no-js-table">
										<table class="overflow-y">
												<thead>
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
												<td colspan="15">
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
							</form>
							
							<div class="title-o">
			                     <i style="margin-top:20px;">附件列表</i>
		                    </div>
		                    <div id="fileDiv" name="fileDiv">
							  
							</div>
		                    <!-- 上传附件 -->
		                    <div class="title-o">
			                     <i style="margin-top:40px;">上传附件</i>
		                    </div>
		                    <span style="color:red;font-size:10px;">注意：上传采取批量覆盖的方式，支持批量上传；先点击添加附件选择文件，再点击开始上传。</span>
								<div region="south" style="height:auto;" >
									<div style="margin-left:10px;margin-top:10px"><input type="file" name="uploadify" id="uploadify" align="right"/></div>
									<br/>
									<div id="fileQueue"></div> 
									<p><span id="speed"></span></p>
									<p>
										&nbsp;&nbsp;<a style="font-size:15px;" href="javascript:uploasFile()">开始上传</a>&nbsp;
										<a style="font-size:15px;" href="javascript:jQuery('#uploadify').uploadifyClearQueue()">取消选择</a>
									</p>
								</div> 
								<!--上传附件-->
							
							<jsp:include page="/workflow/workorder/activityApproval/approveCommonWithFile.jsp"></jsp:include>
							</div>
						</div>
				</div>
		</div>
	</div>
	<div id="updateFormDiv" style="display:none;">
           <form id="updateForm" method="POST">
           <table style="border-collapse:separate; border-spacing:0px 10px;">
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
           </form>
    </div>
    
</body>
</html>