<%@page import="java.util.Calendar"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar c = Calendar.getInstance();     
	String currentday = new java.text.SimpleDateFormat("yyyyMMdd").format(c.getTime());
	c.add(Calendar.DATE, -1);
	String lastday = new java.text.SimpleDateFormat("yyyyMMdd").format(c.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登录情况统计</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath() %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/common.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/extend.jquery.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/plus.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/bireport/js/analize/helper.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/loginStatistics/js/index.js"></script>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<div data-options="region:'center',title:'登录情况统计'">
		<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table width="100%" style="margin:10px 0;">
                <tr height="35px">
                	<td width="6%" style="padding-left:10px;" align="right">地市：</td>
                    <td width="15%">
                    	<select id='orgName' name='orgName' style='width:150px;height:20px;font-size: 12px; '></select>
                    </td>
                    <td width="6%" style="padding-left:10px;" align="right">姓名：</td>
                    <td width="15%"><input class="default-text-input wper80" id="realname" name="realname" type="text"/></td>
                    <td width="5%" align="right">工号：</td>
                    <td width="15%"><input class="default-text-input wper80" id="username" name="username" type="text"/></td>
                	
                </tr>
                <tr height="35px">
                	<td width="6%" style="padding-left:10px;" align="right">登录方式：</td>
                    <td width="15%">
                    	<select id='appName' name='appName' style='width:150px;height:20px;font-size: 12px; '>
                    		<option value ="portal">基层单元web</option>
                    		<option value ="appservice">基层单元app</option>
                    	</select>
                    </td>
                	<td width="5%" style="padding-left:10px;" align="right">起始日期：</td>
                    <td width="15%">
                    	<input type="text" class="Wdate" id="startTime" readonly="readonly" onclick="new WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd', maxDate:'%y-%M-%d'})" value="<%=lastday %>" />
                    </td>
                    <td width="5%" align="right">截至日期：</td>
                    <td width="15%">
                    	<input type="text" class="Wdate" id="endTime" readonly="readonly" onclick="new WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd', maxDate:'%y-%M-%d'})" value="<%=currentday %>" />
                    </td>
                </tr>
                <tr height="35px">
                	<td colspan="6">
                		<a class="default-140-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 350px;">查询</a>
                		<a class="default-140-btn fLeft mr10" href="#" id="resetBtn">重置</a>
                		<a class="default-gree-140-btn fLeft mr10" href="#" id="downloadExcel">导出</a>
                	</td>
                </tr>
            </table>
         </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">地市</th>
								<th>营服中心</th>
								<th>姓名</th>
								<th>工号</th>
								<th>联系电话</th>
								<th>登录次数</th>
								<th>最后登录时间</th>
							</tr>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="7">
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