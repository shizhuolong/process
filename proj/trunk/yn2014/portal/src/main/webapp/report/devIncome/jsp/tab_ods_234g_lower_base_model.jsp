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
	ca.add(Calendar.MONTH, -1);
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户质态判定表</title>
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/tab_ods_234g_lower_base_model.js"></script>
<style type="text/css">
  #lch_DataHead TR TH,#lch_DataBody TR TD{
   min-width: 10px;
}
</style>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="cityName" value="<%=org.getRegionName()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">账期：</td>
					<td width="15%">
						<input type="text"  class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time %>" id="time">
					</td>
					<td width="4%">地市：</td>
					<td width="13%">
						<select name="regionName" id="regionName" onchange="" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="7%">营服中心：</td>
					<td width="13%">
						<select name="unitName" id="unitName" onchange="" class="default-text-input wper80">
								<option value=''>请选择</option>
						</select>
					</td>
					<td width="7%">电话号码：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="phoneNumber" type="text" id="phoneNumber"/>
					</td>
					<td width="7%">三无：</td>
					<td width="13%">
						<select name="isSW" id="isSW" class="default-text-input wper80">
						        <option value='' selected>全部</option>
								<option value='1'>是</option>
								<option value='0'>否</option>
						</select>
					</td>
					</tr>
					<tr>
					<td width="7%" style="padding-left: 10px;">极低：</td>
					<td width="13%">
						<select name="isJD" id="isJD" class="default-text-input wper80">
								<option value='' selected>全部</option>
								<option value='1'>是</option>
								<option value='0'>否</option>
						</select>
					</td>
					<td width="7%">资料完备：</td>
					<td width="13%">
						<select name="isZLWB" id="isZLWB" class="default-text-input wper80">
								<option value='' selected>全部</option>
								<option value='1'>是</option>
								<option value='0'>否</option>
						</select>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="lchcontent"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>
</body>
<div style="color:red;font-size:10px;">
资料完备标准：<br/>
客户名称：不为空<br/>
经办人（联系人）：不为空<br/>
联系电话：不少于7位数字<br/>
证件号码：身份证号码要求15位或者18位而且全为数字或者有字母A到Z<br/>
证件类型：（使用系统中类型）'18位身份证',护照','军人证','驾驶证','工作证','学生证','户口本','暂住证','警官证', '单位介绍信','营业执照','数固客户编码',
 '集团编号','武警身份证','港澳居民来往内地通行证',
'台湾居民来往大陆通行证')<br/>
客户类型：（使用系统中类型）('个人客户','单位客户','集团客户') --<br/>
客户地址：非数字<br/>
通信地址：非数字<br/><br/>

资料完备用户：<br/>
例：1月入网，则考核4月，4月资料完备，资料完备用户<br/><br/>

极低标准：<br/>
语音<3分钟 且 流量<4M 且 短信<5<br/>
极低用户：<br/>
例：1月入网用户，考核2月3月4月，2月3月都是极低 或 3月4月都是是极低，极低用户<br/></br>

三无标准：<br/>
语音=0 且 流量=0 且 短信=0<br/>
三无用户：<br/>
例：1月入网用户，考核2月3月4月，2月3月都是三无 或 3月4月都是是三无，三无用户<br/><br/>

低饱和标准：<br/>
实际语音小于套餐内语音20%，并且实际流量小于套餐内流量20%，则是低饱和<br/>
低饱和用户：<br/>
例：1月入网用户，考核2月3月4月，2月3月都是低饱和 或 3月4月都是低饱和，低饱和用户

</div>
</html>