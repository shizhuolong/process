<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>对比报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/manualCommission/js/compareReport.js"></script>
<%-- <script type="text/javascript">
	var privileges='<%=user.getAuthoritiesStr()%>';
	function isGrantedNew(role){
	    if(privileges.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
	        return true;
	    }
	    if(privileges.toString().indexOf(role)==-1){
	        return false;
	    }
	    return true;
	}
</script> --%>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<!-- <div data-options="region:'west',split:false,title:'营服中心负责人管理'"
		style="width: 220px; padding: 10px;">
		<div id="ztree" class="ztree"></div>
	</div> -->
	<div data-options="region:'center',title:'对比报表'">
		<div id="container">
			<form id="searchForm" method="post">
				<input type="hidden" name="resultMap.page" /> <input type="hidden"
					name="resultMap.rows" />
				<table width="100%" style="margin: 10px 0;">
					<tr height="35px">
						<td width="5%" style="padding-left:10px;">账期：</td>
						<td width="20%"><input type="text"  class="Wdate default-text-input wper40" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=month %>" id="month" curMonth="<%=month %>">
						</td>
						<td width="4%">地市：</td>
						<td width="13%">
							<select name="regionCode" id="regionCode" onchange="" class="default-text-input wper80">
									<option value=''>请选择</option>
							</select>
						</td>
						<td width="3%">
							<a class="default-btn" href="#" id="searchBtn"style="float: right; margin-right: 30px;">查询</a>
						</td>
						<td width="3%">
							<a class="default-btn" href="#" id="downloadExcel" >导出</a>
						</td>
					</tr>
				</table>
			</form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">帐期</th>
								<th>地市名称</th>
								<th>科目</th>
								<th>比对项目</th>
								<th>比对备注</th>
								<th>工单总数</th>
								<th>工单总额</th>
								<th>成功工单总数</th>
								<th>成功过工单总额</th>
								<th>失败工单数</th>
								<th>失败应录金额</th>
								<th>失败实录金额</th>
								<th>失败差异金额</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
						<td colspan="13">
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
		</div>
	</div>
</body>
</html>