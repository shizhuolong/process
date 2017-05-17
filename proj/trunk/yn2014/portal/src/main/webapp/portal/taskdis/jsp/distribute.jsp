<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>任务分配</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/portal/taskdis/css/jquery.jOrgChart.css?v=1">
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/portal/taskdis/js/json2.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/portal/taskdis/js/jquery.jOrgChart.js?v=2"></script>
<script type="text/javascript" src="<%=path%>/portal/taskdis/js/distribute.js?v=10"></script>
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
						<div class="title-o"><i>未分配列表</i></div>
						<div class="default-dt dt-autoH">
							<div class="sticky-wrap">
								<table>
		                       		<tr>
					                	<td align="right">任务类型：</td>
					                    <td>
					                    	<select class="default-text-input wper80" name="proType" id="proType">
					                    		<option value="23升4" selected>23升4</option>
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
											<th class="first">用户号码</th>
											<th>用户编码</th>
											<th>套餐ID</th>
											<th>套餐名称</th>
											<th>发展渠道编码</th>
											<th>发展渠道名称</th>
											<th>--</th>
											<th>--</th>
											<th>--</th>
											<th>--</th>
										</tr>
									</thead>
									<tbody id="dataBody">
									</tbody>
									<tr>
										<td colspan="10">
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
						<div class="title-o"><i>分配</i></div>
						<br/>
						<ul id="team" style="display:none">
					    	<li>总数<br/>
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