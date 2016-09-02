<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>营服中心系数配置</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css"/>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/unit_ratio_config.js"></script>
<script type="text/javascript">
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
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<div data-options="region:'west',split:false,title:'营服中心系数配置'" style="width:220px;padding:10px;">
		<div id="ztree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'营服中心系数配置'">
		<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table style="margin-top: 10px;">
          		<tr>
                	<td align="right">营服中心：</td>
                    <td>
                    	<input class="default-text-input w400" id="unit_name" name="unit_name" type="text" />
                    </td>
                    <td align="right">是否配置营服系数：</td>
                    <td>
	                    <select class="default-text-input" style="width: 80px;" name="unit_ratio" id="unit_ratio">
							<option value="">全部</option>
							<option value="1">是</option>
							<option value="0">否</option>
						</select>
					</td>
                </tr>
                <tr height="35px">
                	<td colspan="4" align="center">
                		<a class="default-btn fLeft mr10" href="#" id="searchBtn">查询</a>
                		<a class="default-btn fLeft mr10" href="#" id="resetBtn">重置</a>
                		<a class="default-gree-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
                	</td>
                </tr>
            </table>
         </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">地市名称</th>
								<th>营服中心</th>
								<th>营服中心系数</th>
								<th>营服中心责任人系数</th>
								<th>营业厅店长系数</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="6">
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