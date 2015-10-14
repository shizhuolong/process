<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>公告管理</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/bullManagement/js/bull_manage_list.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div id="container">
		<table>
			<tr>
				<td style="padding-left:12px;padding-top:12px;">
					<a class="default-btn" href="#"
						id="addBtn">新增</a><br/>
				</td>
			</tr>
		</table>
		
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0px;">
				<tr height="35px">
					<td width="6%" style="padding-left: 10px;">是否显示：</td>
					<td width="15%">
						<select id="isShow" class="default-text-input wper80" name="type">
							<option value="">请选择</option>
							<option value="1">显示</option>
							<option value="0">不显示</option>
					    </select>
				    </td>
					<td width="6%">是否置顶：</td>
					<td width="15%">
						<select id="isTop" class="default-text-input wper80" name="type">
							<option value="">请选择</option>
							<option value="1">置顶</option>
							<option value="0">不置顶</option>
					    </select>
					</td>
					<td width="6%">领导首页显示：</td>
					<td width="15%">
						<select id="isManage" class="default-text-input wper80" name="type">
							<option value="">请选择</option>
							<option value="1">显示</option>
							<option value="0">不显示</option>
					    </select>
					</td>
					<td width="5%" colspan="2"><a class="default-btn" href="#"
						id="searchBtn">查询</a></td>
				</tr>
				
			</table>
		</form>
		<div class="default-dt dt-autoH">
			<div class="sticky-wrap">
				<table class="default-table sticky-enabled">
					<thead>
						<tr>
							<th class="first">公告名称</th>
							<th>创建者</th>
							<th>创建时间</th>
							<th>附件下载</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody id="dataBody">
					</tbody>
					<tr>
						<td colspan="5">
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
	</div>
</body>
</html>