<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    Calendar ca = Calendar.getInstance();
    ca.add(Calendar.DATE, 0);
    String time = new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>任务分配</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/portal/order2i2c/css/jquery.jOrgChart.css?v=2">
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet"
    href="<%=path%>/page/js/date/skin/WdatePicker.css">
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/json2.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/jquery.jOrgChart.js?v=2"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/region_distribute.js?v=11"></script>
<script type="text/javascript"
    src="<%=path%>/page/js/date/WdatePicker.js"></script>
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
	<input id="ctx" type="hidden" value="<%=path%>"/> 
	<div id="smartForm">
		<div id="container">
			<div id="cc" style="width:100%;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<div class="title-o"><i>未分配订单列表</i></div>
						<div class="default-dt dt-autoH">
							<div class="sticky-wrap">
								<table>
		                       		<tr>
		                       		    <td align="right">开始时间：</td>
                                        <td width="5%"><input type="text" style="width: 100px;"
                                        class="Wdate default-text-input wper80" readonly
                                        onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})"
                                        value="<%=time%>" id="startTime" name="startTime" />
                                        </td>
                                        <td width="5%" align="right">结束时间：</td>
                                        <td width="5%"><input type="text" style="width: 100px;"
                                        class="Wdate default-text-input wper80" readonly
                                        onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})"
                                        value="<%=time%>" id="endTime" name="endTime" />
                                        </td>
                                        <td align="right">订单状态：</td>
                                        <td>
                                            <select class="default-text-input wper80" name="serviceOrder" id="serviceOrder">
                                            
                                            </select>
                                        </td>
                                        <td align="right">商品名称：</td>
                                        <td>
                                            <select class="default-text-input wper80" name="serviceProduct" id="serviceProduct">
                                              
                                            </select>
                                        </td>
                                   </tr>
                                   <tr>
					                	<td align="right">激活状态：</td>
					                    <td>
					                    	<select class="default-text-input wper80" name="activeStatus" id="activeStatus">
					                    		<option value="">全部</option> 
					                    		<option value="已激活">已激活</option>
					                    		<option value="未激活" selected>未激活</option>
					                    	</select>
					                    </td>
					                    <td align="right">是否首充：</td>
					                    <td>
					                    	<select class="default-text-input wper80"  name="isFirst" id="isFirst">
					                    		<option value="">全部</option>
					                    		<option value="已首充">已首充</option>
					                    		<option value="未首充" selected>未首充</option>
					                    	</select>	
					                    </td>
					                    <td align="right">用户状态：</td>
					                    <td>
					                    	<select class="default-text-input wper80"  name="serviceName" id="serviceName">
					                    	</select>	
					                    </td>
					                    <td>
					                    	<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
					                    </td>
					                </tr>
				                </table>
				            </div>
							<div class="sticky-wrap">
								<table id="dataTale" class="default-table sticky-enabled">
									<thead>
										<tr>
											<th class="first">订单号</th>
											<th>订单时间</th>
											<th>地市</th>
											<th>配送区县</th>
											<th>订单状态</th>
											<th>客户姓名</th>
											<th>预约号码</th>
											<th>套餐名称</th>
											<th>商品名称</th>
											<th>订购号码</th>
											<th>激活状态</th>
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
						<div class="title-o"><i>订单分配</i></div>
						<br/>
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
			                    onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};distribute(this);"
			                     class="default-text-input wper80" style="width:80px;" id="disValue" name="disValue" type="text"/></td>
							 </tr>	
						</table>
						<br/>
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
							 	<td colspan=2 style="padding-left:300px;padding-top:12px;"><a class="default-btn" href="javascript:void(0);" id="distributeBtn" onclick="submitDistribute()">分配</a></td>
							 </tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>