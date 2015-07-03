<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>审批节点管理</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css"/>
<link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.excheck-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/workflow/jsp/taskNodeManage.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
</script>
</head>

<body>
<div id="smartForm">
	<div id="container">
		<div id="main" class="clearfix">
			<div class="main-block">
				<div class="title">
					<i></i>审批节点列表
				</div>
				<div id="chose-place">
					<table width="50%" style="margin: 10px 0;">
						<tr>
							<th>节点名称：</th>
							<td style="text-align: left;"><input type="text"
								id="taskName" value="" class="default-text-input" /></td>
							<!--  <th>工单编号：</th>
                                    <td ><input class="default-text-input w140" name="" type="text" /></td> -->
							<td colspan="2"><a class="default-btn"
								href="javascript:void(0);" id="searchBtn">查询</a></td>
						</tr>
					</table>
				</div>
				<div class="default-dt dt-autoH">
					<div class="no-js-table">
						<table class="overflow-y">
							<thead>
								<tr>
									<th>序号</th>
									<th>节点名称</th>
									<th>操作</th>
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
		<ul id="treeNodeDep" class="ztree" style="width:320px; height: 220px;overflow:auto;"></ul>
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
