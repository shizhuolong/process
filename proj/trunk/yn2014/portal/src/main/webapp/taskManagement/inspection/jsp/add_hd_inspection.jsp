<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>添加活动巡检</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/inspection/js/add_hd_inspection.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<form id="spectionFrom" method="post">
							<input type="hidden" id="taskInfoJsonStr" name="taskInfoJsonStr">
							<div class="title-o"><i>添加活动巡检任务</i></div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 15%;">巡检任务名称：</th>
	           						<td style="width: 20%;">
	            						<input type="text" id="inspecName" name="inspecName" size="50">
	           						</td>
	           						<th style="width: 10%;">开始日期：</th>
	                            	<td style="width: 10%;">
	                            		<input type="text" class="Wdate" id="startTime" name="startTime" readonly="readonly" onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})" value="" />
	            					</td>
	            					<th style="width: 10%;">结束日期：</th>
	                            	<td style="width: 20px;">
	                            		<input type="text" class="Wdate" id="endTime" name="endTime" readonly="readonly" onclick="new WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})" value="" />
	            					</td>
	                           	</tr>
	                           	<tr>
	           						<th style="width: 15%;">巡检任务描述：</th>
	           						<td style="width: 20%;" colspan="5">
	           							<textarea rows="4" cols="81"  id="inspecDesc"></textarea>
	           						</td>
	                           	</tr>
	                       	</table>
	                       	<div class="title" style="margin-top: 20px;"><i></i>巡检人</div>
	                       	<div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       	<div class="no-js-table" style="padding-bottom: 5px;">
	                       		<table>
	                       		<tr>
				                	<td align="right">巡检人姓名：</td>
				                    <td><input class="default-text-input wper140" name="realName" id="realName" type="text"/></td>
				                    <td align="right">巡检人帐号：</td>
				                    <td><input class="default-text-input" style="width: 250px;" name="userName" id="userName" type="text"/></td>
				                     <td align="right">巡检人电话：</td>
				                    <td><input class="default-text-input" style="width: 250px;" name="phone" id="phone" type="text"/></td>
				                </tr>
				                <tr height="35px">
				                	<td colspan="6" align="center">
				                		<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
				                		<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
				                	</td>
				                </tr>
				                </table>
	                       	</div>
	                       	</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 5px;">
	                       		<div class="no-js-table">
	                         		<table class="overflow-y taskTable" id="subordinateAreaDataTable">
	                             		<thead>
	                          				<tr>
	                      						<th>选择</th>
	                                    	 	<th>巡检人姓名</th>
	                                      		<th>巡检人账号</th>
	                                      		<th>巡检人电话号码</th>
	                                   		</tr>
	                             		</thead>
	                             		<tbody id="inspection_person_data">
	                             		</tbody>
	                             		<tr>
											<td colspan="4">
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
	                       	<div class="title" style="margin-top: 20px;"><i></i>巡检渠道</div>
	                       	<div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       	<div class="no-js-table" style="padding-bottom: 5px;">
	                       		<table>
	                       		<tr>
				                	<td style="width: 15%;" align="right">渠道名称：</td>
				                    <td style="width: 25%;"><input class="default-text-input" style="width: 100%;" name="hqChanlName" id="hqChanlName" type="text"/></td>
				                    <td style="width: 15%;" align="right">渠道编码：</td>
				                    <td style="width: 25%;"><input class="default-text-input" style="width: 100%;" name="hqChanlCode" id="hqChanlCode" type="text"/></td>
				                	<td style="width: 20%;">
				                		<a class="default-btn fLeft mr10" href="#" id="searchChlBtn">查询</a>
				                		<a class="default-btn fLeft mr10" href="#" id="resetChlBtn">重置</a>
				                	</td>
				                </tr>
				                <tr height="35px" style="background-color:#D9F1E7;">
				                	<td colspan="5" align="left" >
				                		<FONT style="FONT-SIZE: 12pt; FILTER: shadow(color=#6495ED,strength=15); WIDTH: 100%; COLOR:  	rgb(255,0,0);LINE-HEIGHT: 100%; FONT-FAMILY: 微软雅黑">
				                			操作步骤：<br/>
				                			&nbsp;&nbsp;&nbsp;&nbsp;1、填写巡检次数<br/>
				                			&nbsp;&nbsp;&nbsp;&nbsp;2、点击"操作栏"的&nbsp;"添加到巡检列表"&nbsp; 添加渠道到《已选择的巡检渠道》<br/>
				                			原因：要把需要巡检的渠道添加到《已选择的巡检渠道》列表中,点击"确认"按钮提交数据才有效
				                		</FONT>
				                	</td>
				                </tr>
				                </table>
	                       	</div>
	                       	</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                             	<div class="no-js-table">
	                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
	                                		<thead>
	                                			<tr>
	                      						<th>巡检渠道名称</th>
		                                       	<th>渠道编码</th>
		                                       	<th>巡检人</th>
		                                       	<th>巡检人电话号码</th>
		                                       	<th>指派巡检次数</th>
		                                       	<th>操作</th>
		                                    </tr>
	                              			</thead>
	                              			<tbody id="inspection_chanl_data">
	                              			</tbody>
	                              			<tr>
												<td colspan="6">
													<div class="page_count">
														<div class="page_count_left">
															共有 <span id="chanlTotalCount"></span> 条数据
														</div>
	
														<div class="page_count_right">
															<div id="chanlPagination"></div>
														</div>
													</div>
												</td>
											</tr>
	                              		</table>
	                              	</div>
	                       	</div>
	                       	<div class="title" style="margin-top: 20px;"><i></i>已选择的巡检渠道</div>
	                       	<div class="default-dt dt-autoH" style="margin-top: 12px;">
                             	<div class="no-js-table">
                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
                                		<thead>
                                			<tr>
                      						<th>巡检渠道名称</th>
	                                       	<th>渠道编码</th>
	                                       	<th>巡检人</th>
	                                       	<th>巡检人电话号码</th>
	                                       	<th>指派巡检次数</th>
	                                       	<th>操作</th>
	                                    </tr>
                              			</thead>
                              			<tbody id="selected_inspection_chanl">
                              			</tbody>
                              		</table>
                              	</div>
	                       	</div>
	                       	 <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<table class="overflow-y taskTable" style="margin-top: 5px;">
	                       			<tr>
						                <td style="padding-left: 480px;">
							                <a href="javascript:void(0)" onclick="addHdInpec()" class="default-btn fLeft mr10" id="confirmBtn">确认</a>
							                <a href="javascript:void(0)" onclick="closeHdDialog()" class="default-btn fLeft ml10" id="cancleBtn">关闭</a>
						                </td>
									</tr>
	                       		</table>
	                       	</div>	
                       	</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>