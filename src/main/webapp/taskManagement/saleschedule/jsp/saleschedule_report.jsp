<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%
	Calendar c=Calendar.getInstance();
	c.add(Calendar.MONTH, -1);
	String lastMonth=new SimpleDateFormat("yyyyMM").format(c.getTime());
	String path = request.getContextPath();
	String regionType = request.getParameter("regionType")==null?"":request.getParameter("regionType");
	String dateValue = request.getParameter("dateValue")==null?"":request.getParameter("dateValue");
	String parentRegionCode = request.getParameter("parentRegionCode")==null?"":request.getParameter("parentRegionCode");
	String taskCode = request.getParameter("taskCode")==null?"":request.getParameter("taskCode");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>任务包排产</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css"/>
<link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/saleschedule_report.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
	var regionType = "<%=regionType%>";
	var parentRegionCode = "<%=parentRegionCode%>";
	var taskCode = "<%=taskCode%>";
	var dateValue1 = "<%=dateValue%>";
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
			<div id="main" class="clearfix">
				<div class="main-block">
					<div class="title">
						<i></i>排产分析报表
					</div>
					<%if("".equals(dateValue)){ %>
					<div id="chose-place">
						<table style="margin: 10px 0;">
							<tr>
								<th>时间：</th>
								<td style="text-align:left;">
									<input readonly="readonly" type="text" style="width:80px" class="Wdate" id="dateValue"  name="sale_datepi"  value="<%=lastMonth%>"  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"/>
								</td>
								<td></td>
								<td style="padding-left:10px;">
									<a class="default-btn" href="javascript:void(0);" id="searchBtn">查询</a>
								</td>
							</tr>
						</table>
					</div>
					<%} %>
					<%if("1".equals(regionType)) {%>
						<div>
							<table style="margin: 10px 0;">
								<tr>
									<th>地市：</th>
									<td style="text-align:left;">
										<select id="group_id_1" name="group_id_1">
											<option value="">请选择地市</option>
											<option value="16004">曲靖</option>
										</select>
									</td>
									<td></td>
									<td style="padding-left:10px;">
										<a class="default-btn" href="javascript:void(0);" id="searchGroupBtn">查询</a>
									</td>
								</tr>
							</table>
						</div>
					<%}%>
					<div class="default-dt dt-autoH" style="margin-top:10px;">
						<div class="no-js-table">
							<table class="overflow-y taskTable">
								<thead>
									<tr>
										<th>时间</th>
										<th>地域</th>
										<th>指标名称</th>
										<th>指标单位</th>
										<th>业务类型</th>
										<th>上级下发指标数</th>
									<!-- 	<th>操作</th> -->
									</tr>
								</thead>
								<tbody id="dataBody" style="text-align: center;">
								</tbody>
							</table>
							<div class="page_count">
								<div class="page_count_left">
									共有 <span id="totalCount"></span> 条数据
								</div>
	
								<div class="page_count_right">
									<div id="pagination"></div>
								</div>
							</div>
						</div>
	
					</div>
				</div>
			</div>
		</div>
		
		<div id="departmentDialog" title="Dialog" style="padding:5px;display:none;" >
			<ul id="treeNodeDep" class="ztree" style="width:320px; height: 300px;overflow:auto;"></ul>
			<table width="100%">
				<tr>
					<td>
						<a class="default-btn" href="javascript:void(0);" onclick="submit()">确定</a>
					</td>
					<td>
						<a class="default-btn" href="javascript:void(0);" onclick="cancel()">取消</a>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
