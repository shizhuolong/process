<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>地市订单任务分配</title>
<link href="<%=path%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css">
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/portal/order2i2c/js/undistribute_list.js"></script>
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
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>