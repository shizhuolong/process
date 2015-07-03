<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%
	String path = request.getContextPath();
	Calendar c=Calendar.getInstance();
	String cMonth=new SimpleDateFormat("yyyyMM").format(c.getTime());
	User user = UserHolder.getCurrentLoginUser();
	String userFlag = request.getParameter("userFlag");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>任务包排产</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/css/jpagination.css"/>
<link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=path%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.excheck-3.1.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/task_common.js"></script>
<script type="text/javascript" src="<%=path%>/taskManagement/saleschedule/js/my_saleschedule.js"></script>
<script type="text/javascript">
	var path = "<%=path%>";
	var cMonth = "<%=cMonth%>";
	var userFlag = "<%=userFlag%>";
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
						<i></i>任务列表
					</div>
					<div id="chose-place">
						<table style="margin: 10px 0;">
							<tr>
								<th>时间：</th>
								<td style="text-align:left;">
									<input readonly="readonly" type="text" style="width:80px" class="Wdate" id="dateValue"  name="sale_datepi"  value="<%=cMonth %>"  onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})"/>
								</td>
								<td></td>
								<td style="padding-left:10px;">
									<a class="default-btn" href="javascript:void(0);" id="searchBtn">查询</a>
								</td>
							</tr>
						</table>
					</div>
					<div class="default-dt dt-autoH">
						<div class="no-js-table">
							<table class="overflow-y taskTable">
								<thead>
									<tr>
										<th>时间</th>
										<th>地域</th>
										<th>状态</th>
										<th>指标名称</th>
										<th>指标单位</th>
										<th>业务类型</th>
										<th>指标值</th>
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
