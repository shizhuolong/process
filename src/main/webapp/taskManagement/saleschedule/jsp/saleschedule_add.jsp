<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	Calendar c=Calendar.getInstance();
	String year=new SimpleDateFormat("yyyyMM").format(c.getTime());
	
	Org org = UserHolder.getCurrentLoginUser().getOrg();
	String code1 = request.getParameter("code1");
	String regionName = org.getOrgName();
	String regionCode = org.getCode();
	String orgLevel = org.getOrgLevel();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>添加销量排产</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/css/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery-easyui-1.3.0/plugins/jquery.form.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine-zh_CN.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/saleschedule_add.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
	var code1 = "<%=code1%>";
	var regionCode = "<%=regionCode%>";
	var regionName = "<%=regionName%>";
	var orgLevel = <%=orgLevel%>;
</script>
<style type="text/css">
.taskTable td {
	text-align:center;
}
</style>
</head>
<body>
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<form id="justValidateFrom">
							<table id="sm-payment-order-apply">
		                    	<tr>
		                        	<td width="10%">标题：</td>
		                            <td colspan="3"><input class="default-text-input wper91 validate[required]" id="theme" type="text" /><span><font color="red">&nbsp;&nbsp;*</font></span></td>
		                        </tr>
		                    </table>
							<div class="title-o"><i>新增排产任务</i></div>
							<div class="title" style="margin-top: 20px;"><i></i>任务时间</div>
						
							<table id="sm-payment-order-apply" style="width: 100%;">
	                       		<tr>
	           						<th style="width: 10%;">时间类型：</th>
	           						<td style="width: 10%;">
	            						<select id="dateType">
	            							<!-- <option value="2">季度</option> -->
	            							<option value="3">月份</option>
	            						</select>
	           						</td>
	           						<th style="width: 5%;">时间：</th>
	                            	<td style="width: 80px;">
	                               		<input readonly="readonly" type="text" style="width:80px" class="Wdate" id="dateValue"  name="sale_datepi"  value="<%=year %>"  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"/>
	            					</td>
	                           	</tr>
	                       	</table>
	                       	<div class="title" style="margin-top: 20px;"><i></i>设置指标及总任务值</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                             	<div class="no-js-table">
	                             		<input type="button" id="selectIndexBtn" value="选择指标" class="default-gree-btn mr10" style="height: 28px;width: 84px;border:0px;"/>
	                          			<table class="overflow-y taskTable" style="margin-top: 5px;">
	                                		<thead>
	                                			<tr>
	                      							<th>地市</th>
		                                       	<th>指标名称</th>
		                                       	<th>指标单位</th>
		                                       	<th>业务类型</th>
		                                       	<th>指标值</th>
		                                    </tr>
	                              			</thead>
	                              			<tbody id="sumDataBoby">
	                              			</tbody>
	                              		</table>
	                              	</div>
	                       	</div>		
	                        <div class="title" style="margin-top: 20px;"><i></i>任务分解</div>
	                        <div class="default-dt dt-autoH" style="margin-top: 12px;">
	                       		<div class="no-js-table">
	                         		<table class="overflow-y taskTable" id="subordinateAreaDataTable">
	                             		<thead>
	                          				<tr>
	                      						<th>下级地域</th>
	                                    	 	<th>指标名称</th>
	                                      		<th>指标单位</th>
	                                      		<th>业务类型</th>
	                                      		<th>指标值</th>
	                                   		</tr>
	                             		</thead>
	                             	</table>
	                             </div>
	                       	</div>
                       	</form>
                   		<form id="addSaleScheduleForm" method="post" encType="multipart/form-data">
      						<div class="title" style="margin-top: 20px;"><i></i>上传附件</div>
                           	<div class="default-dt dt-autoH">
                           		<div class="div_box"  id="filetd" style="width: 98%">
					            	<span ><input type='file' name='myFile'  size='80%' /><img alt="" src="<%=path %>/images/add.png" onclick="addFile()" ></span>			        
								</div>
                           	</div>
                           	<!-- <div class="title" style="margin-top: 20px;"><i></i>排产描述</div> 
                               <div class="default-dt dt-autoH">
                               	<textarea rows="3" cols="90"></textarea>
                           	</div>
                           	-->
                           	<div id="chose-sender">
                            	<div class="title-o"><i>选择发送人</i></div>
                            	<table width="70%">
                                    <tr>
                                        <td width="15%">审核步骤：</td>
                                        <td width="35%"><input class="default-text-input validate[required]" name="" readonly="readonly" type="text" value="部门领导审批"/></td>
                                        <td width="15%">选择下一步审批人：</td>
                                        <td width="35%"><select class="default-text-input wper80 validate[required]" id="nextDealer" name="nextDealer"><option></option></select></td>
                                    </tr>
                                </table>    
                            </div>
                            <div class="center mt30 mb20">
                            	<a href="javascript:void(0)" class="default-btn mauto" onclick="doSubmit()">发送</a>
                            </div>
                           	
                           <!-- 	<div class="default-dt dt-autoH" style="margin-top: 20px;">
                           		<a class="default-btn fLeft mr10" href="javascript:void(0)" onclick="doSubmit()">保存</a>
                           		<a class="default-btn fLeft mr10" href="javascript:history.go(-1);">返回</a>
                           	</div> -->
                           	
                           	<input type="hidden" name="sumTaskInfoJsonStr" id="sumTaskInfoJsonStr" value="" />
                           	<input type="hidden" name="taskInfoJsonStr" id="taskInfoJsonStr" value="" />
                           	<input type="hidden" name="title" id="workTitle" value=""/>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="indexDialog" style="min-height: 200px;display:none;">
		<div class="default-dt" style="width: 600px;">
			<div>
				<table class="default-table sticky-enabled">
					<thead>
						<tr>
							<th><input type="checkbox" id="selectIndexAll" onclick="selectIndexAll()"/></th>
							<th>指标类型</th>
							<th>指标名称</th>
						</tr>
					</thead>
					<tbody id="indexDataBody">
					
					</tbody>
					<tr>
		                <td colspan="3" style="padding-left: 240px;">
			                <a href="javascript:void(0)" onclick="selectIndex()" class="default-btn fLeft mr10" id="confirmBtn">确认</a>
			                <a href="javascript:void(0)" onclick="cancelIndexDialog()" class="default-btn fLeft ml10" id="cancleBtn">取消</a>
		                </td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</body>
</html>