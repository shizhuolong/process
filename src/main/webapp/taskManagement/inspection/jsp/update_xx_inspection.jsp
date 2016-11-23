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
<title>修改信息采集</title>
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
<script type="text/javascript" src="<%=path%>/taskManagement/inspection/js/update_xx_inspection.js"></script>
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
						<form id="updateSpectionFrom" method="post">
							<input type="hidden" id="inspec_id" name="inspec_id" value="${inspec_id }">
							<input type="hidden" id="taskInfoJsonStr" name="taskInfoJsonStr">
							<div class="title-o"><i>修改信息采集任务</i></div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 15%;">巡检任务名称：</th>
	           						<td style="width: 20%;">
	            						<input type="text" id="inspec_name" name="inspec_name" size="50">
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
	           						<th style="width: 15%;">所需收集信息：</th>
	           						<td style="width: 20%;" colspan="5">
	           							产品信息<input type="checkbox" name="taskCode" value="T01"/>
	           							佣金政策信息<input type="checkbox" name="taskCode" value="T02"/>
	           							营销活动信息<input type="checkbox" name="taskCode" value="T03"/>
	           						</td>
	                           	</tr>
	                           	<tr>
	           						<th style="width: 15%;">巡检任务描述：</th>
	           						<td style="width: 20%;" colspan="5">
	           							<textarea rows="4" cols="81"  id="inspec_desc"></textarea>
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
												</div>
												<div class="page_count">
													<div class="page_count_left">
														共有 <span id="totalCount"></span> 条数据
													</div>

													<div class="page_count_right">
														<div id="pagination"></div>
													</div>
												</div>
												</div>
											</td>
										</tr>
	                             	</table>
	                             </div>
	                       	</div>
	                       	 <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<table class="overflow-y taskTable" style="margin-top: 5px;">
	                       			<tr>
						                <td style="padding-left: 480px;">
							                <a href="javascript:void(0)" onclick="updateXXInpec()" class="default-btn fLeft mr10" id="confirmBtn">确认</a>
							                <a href="javascript:void(0)" onclick="closeXXDialog()" class="default-btn fLeft ml10" id="cancleBtn">关闭</a>
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