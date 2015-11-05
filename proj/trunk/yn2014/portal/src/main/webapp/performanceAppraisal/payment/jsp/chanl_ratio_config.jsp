<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, 0);
	String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>渠道积分配置</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css"/>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/performanceAppraisal/payment/js/chanl_ratio_config.js"></script>
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
	<div data-options="region:'west',split:false,title:'渠道积分配置'" style="width:220px;padding:10px;">
		<div id="ztree" class="ztree"></div>
	</div>
	<div data-options="region:'center',title:'渠道积分配置'">
		<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table style="margin-top: 10px;">
          		<tr>
                	<td align="">渠道编码：</td>
                    <td><input class="default-text-input wper140" name="hq_chan_code" id="hq_chan_code" type="text"/></td>
                    <td align="">渠道名称：</td>
                    <td><input class="default-text-input" style="width: 150px;" name="group_id_4_name" id="group_id_4_name" type="text"/></td>
                    <td align="">渠道状态：</td>
                    <td>
	                    <select class="default-text-input" style="width: 80px;" name="status" id="status">
							<option value="">全部</option>
							<option value="00">草稿</option>
							<option value="01">待审核</option>
							<option value="10">正常</option>
							<option value="11">清算</option>
							<option value="12">终止</option>
							<option value="100">其他</option>
						</select>
					</td>
                </tr>
                <tr>
                	<td align="">是否配置渠道系数：</td>
                	<td>
                		<select class="default-text-input" style="width: 80px;" name="ratio" id="ratio">
							<option value="">全部</option>
							<option value="1">是</option>
							<option value="0">否</option>
						</select>
                	</td>
                	<td align="">是否配置服务系数：</td>
                	<td colspan="" style="padding: 15px 0px;">
                		<select class="default-text-input" style="width: 80px;" name="server_ratio" id="server_ratio">
							<option value="">全部</option>
							<option value="1">是</option>
							<option value="0">否</option>
						</select>
                	</td>
                     <td>账期：</td>
					<td>
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=month%>" readonly="readonly" id="month"/>
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
								<th>渠道编码</th>
								<th>渠道名称</th>
								<th>渠道类型</th>
								<th>渠道系数</th>
								<th>服务系数</th>
								<th>渠道状态</th>
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