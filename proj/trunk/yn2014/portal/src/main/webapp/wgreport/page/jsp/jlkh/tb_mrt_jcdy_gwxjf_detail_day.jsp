<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	Calendar ca=Calendar.getInstance();
	ca.add(Calendar.DATE, -1);
	String dealDate=new SimpleDateFormat("yyyyMMdd").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>固网积分日明细</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/wgreport/page/javascript/jlkh/tb_mrt_jcdy_gwxjf_detail_day.js"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="6%" style="text-align:right;">账期：</td>
					<td width="22%">
						<input type="text" style="width:100px" class="Wdate" id="startDate" readonly="readonly" value="<%=dealDate %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/>至
						<input type="text" style="width:100px" class="Wdate" id="endDate" readonly="readonly" value="<%=dealDate %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/>
					</td>
					<td width="6%" style="text-align:right;">地市：</td>
					<td width="13%">
						<select name="regionCode" id="regionCode" class="default-text-input wper100">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="6%" style="text-align:right;">营服中心：</td>
					<td width="15%">
						<select name="unitCode" id="unitCode" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="margin-right: 10px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-gree-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
				<tr>
					<td width="6%" style="text-align:right;">用户号码：</td>
					<td width="11%">
						<input class="default-text-input wper80" name="userPhone" type="text" id="userPhone"/>
					</td>
					<td width="6%" style="text-align:right;">人员姓名：</td>
					<td width="11%">
						<input class="default-text-input wper90" name="userName" type="text" id="userName"/>
					</td>
					<td width="6%" style="text-align:right;">业务描述：</td>
					<td width="11%">
						<input class="default-text-input wper80" name="itemdesc" type="text" id="itemdesc"/>
					</td>
				</tr>
			</table>
		</form>
		<div id="content"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>
</body>
</html>





<%-- <%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
	String path = request.getContextPath();
	Calendar c = Calendar.getInstance();     
	c.add(Calendar.DATE, -1);
	String currentday = new SimpleDateFormat("yyyyMMdd").format(c.getTime());
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String orgLevel = org.getOrgLevel();
	String orgCode = org.getCode();
%>
<html>
  <head>
    <title>固网积分日明细</title>
<script type="text/javascript">
	var group_id = "<%=orgCode%>";
	var group_level = "<%=orgLevel%>";
	var deal_date = "<%=currentday%>";
</script>

<link href="<%=path%>/wgreport/bireport/nresources/default/css/reset.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/wgreport/bireport/nresources/default/css/common.css" rel="stylesheet" type="text/css" />
<link href="<%=path%>/wgreport/bireport/nresources/default/css/provincial.css" rel="stylesheet" type="text/css" />

<link href="<%=path %>/wgreport/bireport/css/pub-ana.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/plus.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/ana/modal-1.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/wgreport/bireport/css/ana/img.css" rel="stylesheet" type="text/css" />
<link href="<%=path %>/js/My97DatePicker/skin/WdatePicker.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="<%=path %>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/wgreport/bireport/js/main.js"></script>
<script type="text/javascript" src="<%=path%>/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/common.jquery.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/extend.jquery.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/plus.js"></script>
<script type="text/javascript" src="<%=path %>/wgreport/bireport/js/analize/helper.js"></script>

<script type="text/javascript" src="<%=path %>/wgreport/page/javascript/jlkh/tb_mrt_jcdy_gwxjf_detail_day.js"></script>

<style type="text/css">
	.attend_th {white-space:nowrap;}
</style>
</head>
  
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<div class="work-div" style="margin-top: 0px;margin-left: 5px;" id="workdiv">
		<div class="search-div" style="width: 100%;" id="contions"> 
			<table>
				<tr>
					<td align="right">帐期:</td>
					<td>
						<input type="text" style="width:100px" class="Wdate" id="startTime" readonly="readonly" value="<%=currentday %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/>至
						<input type="text" style="width:100px" class="Wdate" id="endTime" readonly="readonly" value="<%=currentday %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMMdd'})"/>
					</td>
					<td align="right">地市:</td>
					<td>
						<div class="mutiSelect" style="width: 150px; font-size: 12px;">
							<div class="ct" style="height: 16px; width: 150px">
								<span class="tmp">全部</span>
							</div>
							<ul class="theOptions" style="width: 150px" id="boxselect">
								<!-- JS后台加载 -->
							</ul>
						</div>
					</td>
					<td align="right">用户号码:</td>
					<td>
						<input type="text" name="service_num" id="service_num">
					</td>
				</tr>
				<tr>
					<td>营服中心：</td>
					<td>
						<input type="text" name="unit_name" id="unit_name">
					</td>
					<td>人员姓名:</td>
					<td>
						<input type="text" name="user_name" id="user_name" style="width: 152px;">
					</td>
					<td align="right">业务描述</td>
					<td>
						<input type="text" name="itemdesc" id="itemdesc" style="width: 152px;">
					</td>
					<td align="center" rowspan="2" width="100">
						<input type="button" id="search" class="btn-search" />
					</td>
					<td rowspan="2">
						<input type="button" id="exceldown" value="导出Excel" class="ana-button" style="cursor:pointer;margin-top: 3px;"/>
					</td>
				</tr>
			</table>
		</div>
		<div class="item p3" style="margin-top:3px;" >
		<div id="target-data" style="height: 100%;width:100%">
		 <div id="data" style="width:100%;">
		 	<div id="scrollDiv" class="scrollDiv" style="height:700px;margin:0px" >
			   <table id="tableData" border="0" cellspacing="0" cellpadding="0" class="table-normal" style="margin-left:5px;border-bottom:1px solid #F9C9D1;width: 90%" >
				    <thead>  
				   </thead> 
				   	<tbody>
				   	</tbody>
			   	</table>
		   	</div>
			<div id="ana-img-buttons" style="text-align: right;width:99%;margin:0px" align="right"></div> 
		</div>
		</div>
		</div>
	</div>
  </body>
</html> --%>
