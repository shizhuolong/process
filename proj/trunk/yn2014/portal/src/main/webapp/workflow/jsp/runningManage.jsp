<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>流程监控</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/workflow/style/css/public.css">
<link rel="stylesheet" type="text/css" href="<%=path%>/workflow/style/css/jpagination.css">
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/js/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/jsp/runningManage.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
</script>
</head>
<body>
<div id="smartForm">
	<div id="container">
    	<div id="content">
       		<div id="cc" style="width:100%;height:auto;">
				<div id="main" class="clearfix">
					<div class="main-block">
						<div class="title">
							<i></i>工单列表
						</div>
						<table width="100%" style="margin: 10px 0;">
							<tr>
								<td width="5%">申请时间：</td>
								<td width="8%"><input readonly="readonly" type="text" style="width:120px" class="Wdate" id="createTime"  name="sale_datepi"  value=""  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})"/></td>
								<td width="5%">工单编号：</td>
								<td width="8%"><input class="default-text-input wper80" id="workNo" type="text"  value=""/></td>
								<td width="5%">工单主题：</td>
								<td width="8%"><input class="default-text-input wper80" id="workTitle" type="text"  value=""/></td>
								<td width="5%">工单状态：</td>
								<td width="8%">
									<input type="radio" name="orderState" value="doing" checked="checked"/>运行中
									<input type="radio" name="orderState" value="done"/>已结束
								</td>
								<td width="25%" colspan="2"><a class="default-btn" href="javascript:void(0);" id="searchBtn">查询</a></td>
							</tr>
						</table>
						<div class="default-dt">
							<table class="default-table">
								<thead>
									<tr>
										<th>工单编号</th>
										<th>流程名称</th>
										<th>请示主题</th>
										<th>申请部门</th>
										<th>拟稿人</th>
										<th>申请日期</th>
									</tr>
								</thead>
								<tbody id="dataBody">
								</tbody>
								 <tr>
				                	<td colspan="13"  style="height:30px;">
				                    <div class="page_count">
				                    	<div class="page_count_left">共有 <span id="totalCount"></span> 条数据</div>
				                        
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
			</div>
		</div>
	</div>
</div>
</body>
</html>