<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%
Calendar ca=Calendar.getInstance();
ca.add(Calendar.MONTH,0);
String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>集客的客户经理及渠道经理</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css"/>
	<link href="<%=request.getContextPath()%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/grp_manage_list.js"></script>

</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div data-options="region:'west',split:false,title:'集客的客户经理及渠道经理'" style="width:220px;padding:10px;">
		<div id="grptree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'集客的客户经理及渠道经理'">
		<div id="container">
			<form id="searchForm" method="post">
				<input type="hidden" name="resultMap.page" />
	            <input type="hidden" name="resultMap.rows" />
	            <input type="hidden" id="month" value="<%=month%>" />
	          	<table width="100%" style="margin:10px 0px;">
	                <tr height="35px">
	                	<th style="width: 50px;">帐期：</th>
						<td style="width: 80px;"><input readonly="readonly"
							type="text" style="width: 80px" class="Wdate" id="dealDate"
							name="dealDate" value="<%=month%>"
							onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" />
						</td>
	                	<td width="6%" style="padding-left:10px;">类型：</td>
	                    <td width="15%">
	                    	<select id="type" class="default-text-input wper80" name="type">
	                    		<option value="">所有</option>
	                    		<option value="1">渠道经理</option>
	                    		<option value="2">客户经理</option>
	                    		<option value="3">其他</option>
	                    	</select>
	                    </td>
	                    <td width="6%">姓名：</td>
	                    <td width="15%"><input class="default-text-input wper80" name="name" type="text" /></td>
						
					</tr>
	                <tr height="35px">
	                    <td width="6%">联系电话：</td>
	                    <td width="15%"><input class="default-text-input wper80" name="phone" type="text" /></td>
	                    <td width="6%" style="padding-left:10px;">渠道编码：</td>
	                    <td width="15%"><input class="default-text-input wper80" name="chanCode" type="text" /></td>
	                   <!--  <td width="6%">渠道名称：</td>
	                    <td width="15%"><input class="default-text-input wper80" name="chanName" type="text" /></td> -->
	                     <td width="6%">发展人编码：</td>
	                    <td width="15%"><input class="default-text-input wper80" name="developer" type="text" /></td>
	                </tr>
	                <tr>
						<td colspan="6">
                         	<a class="default-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 300px;">查询</a>
                         	<a class="default-btn fLeft mr10" href="#" id="addBtn">新增</a>
                         	<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
                         	<a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
                        </td>
					</tr>
	            </table>
	        </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table id="dataTale" class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">类型</th>
								<th>姓名</th>
								<th>联系电话</th>
								<th>发展人编码</th>
								<th>营服中心</th>
								<th>渠道编码</th>
								<th>渠道名称</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="8">
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
	</div>
</body>
</html>