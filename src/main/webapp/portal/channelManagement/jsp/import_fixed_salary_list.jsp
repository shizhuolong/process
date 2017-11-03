<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
     User user = UserHolder.getCurrentLoginUser();
     Org org = user.getOrg();
     String path = request.getContextPath();
     Calendar ca=Calendar.getInstance();
 	ca.add(Calendar.MONTH, -1);
 	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>固定薪酬-专项奖励</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"/> 
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
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=path%>/portal/channelManagement/js/import_fixed_salary_list.js"></script>
</head>
<body >
    <input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
    <input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
    <input type="hidden" id="code" value="<%=org.getCode()%>">
    <input type="hidden" id="region" value="<%=org.getRegionCode()%>">
    <input type="hidden" id="hrId" value="<%=user.getHrId()%>">
    <input type="hidden" id="orgId" value="<%=org.getId()%>">
    <input type="hidden" id="orgName" value="<%=org.getOrgName()%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width:100%;font-size:100%;">
					<tr>
						<td  width="4%">账期：</td>
						<td width="10%">
							<input type="text" class="Wdate default-text-input wper80" readonly
						     onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=time%>" id="time" name="time"/>
						</td>
						<td width="4%" style="text-align:right;">地市：</td>
						<td width="11%">
						     <select name="regionCode" id="regionCode" class="default-text-input wper100">
								<option value=''>请选择</option>
						     </select>
					    </td>
					    <td width="4%" style="text-align:right;">营服：</td>
                        <td width="10%"><input class="default-text-input wper80" id="unit_name" name="unit_name" type="text"/></td>
                        <td width="4%" style="text-align:right;">姓名：</td>
                        <td width="10%"><input class="default-text-input wper80"
                        id="name" name="name" type="text" /></td>
                       
					    <td width="1%">
						   <a class="default-btn" href="#" id="searchBtn"
						    style="float: right; margin-right: 18px;">查询</a>
					    </td>
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="reppeatBtn" onclick="repeatImport()">导入</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="exportBtn" onclick="downsAll()">导出</a>
					    </td>
					</tr>
				</table>
	</div>
	<div class="default-dt dt-autoH" style="font-size:10px">
                <div class="sticky-wrap">
                    <table style="font-size: 14px" class="default-table sticky-enabled">
                        <thead>
                            <tr>
                                <th class="first">账期</th>
                                <th>地市名称</th>
                                <th>营服名称</th>
                                <th>HR编码</th>
                                <th>姓名</th>
                                <th>固定薪酬</th>
                                <th>专项奖励</th>
                                <th>操作</th>
                        </thead>
                        <tbody id="dataBody">
                        </tbody>
                        <tr>
                            <td colspan="9">
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
  </body>
</html>