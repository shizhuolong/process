<%@page import="java.util.Calendar"%>
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
<title>销售积分指标配置</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/sale_target_config.js"></script>
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
	<div data-options="region:'center',title:'销售积分指标配置'">
		<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table id="sm-payment-order-apply" width="100%">
          		<tr>
                	<td width="10%">指标编码：</td>
                    <td width="40%"><input class="default-text-input wper80" name="itemcode" id="itemcode" type="text"/></td>
                    <td  width="10%">指标描述：</td>
                    <td width="40%"><input class="default-text-input wper80" name="itemdesc" id="itemdesc" type="text"/></td>
                </tr>
                <tr>
                	<td width="10%">业务类型：</td>
                    <td width="40%"><input class="default-text-input wper80" name="busitype" id="busitype" type="text"/></td>
                    <td  width="10%">业务描述：</td>
                    <td width="40%"><input class="default-text-input wper80" name="busidesc" id="busidesc" type="text"/></td>
                </tr>
                <tr height="35px">
                	<td colspan="8" align="center">
                		<%
                			String auth = user.getAuthoritiesStr();
	                		if(auth.toString().indexOf("ROLE_SUPERMANAGER")!=-1){
	                	%>
                			<a class="default-btn fLeft mr10" href="#" id="addBtn">新增</a>
	                	<%
	                		}else if(auth.toString().indexOf("ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_XSJFZBPZ_UPDATEPART")!=-1) {
	                	%>
	                		<a class="default-btn fLeft mr10" href="#" id="addBtn">新增</a>
                		<%  } else {%>
               			<%	}%>
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
								<th class="first">原始编码</th>
								<th>指标编码</th>
								<th>指标描述</th>
								<th>业务类型</th>
								<th>业务描述</th>
								<th>积分值</th>
								<th>单价</th>
								<th>状态</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="9">
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