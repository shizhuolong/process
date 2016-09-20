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
	String mon=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>月预警报表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report-fix.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/socialChannels/js/audit_comm_warn_mon.js"></script>
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
		<form id="searchForm" method="post">
			<table width="100%" style="margin: 10px 0; border:none;">
				<tr height="35px">
					<td width="5%" style="padding-left: 10px;">账期：</td>
					<td width="13%">
						<input type="text"  class="Wdate default-text-input wper80" readonly="true"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',isShowClear:false})" value="<%=mon%>" id="mon">
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
					<td width="3%">
						<a class="default-btn" href="#" id="searchBtn"
						style="float: right; margin-right: 30px;">查询</a>
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="exportBtn" onclick="downsAll()">导出</a>
					</td>
				</tr>
				<tr height="35px">
				    <td width="7%">网点：</td>
					<td width="13%">
						<input class="default-text-input wper80" name="unit_id_3_name" type="text" id="unit_id_3_name"/>
					</td>
					<td width="7%">开始发展日期：</td>
					<td width="13%">
						<input type="text" class="Wdate default-text-input wper80"
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',maxDate:'#F{$dp.$D(\'mon\')}'})" id="startDevMonth">
					</td>
					<td width="7%">结束发展日期：</td>
					<td width="13%">
						<input type="text" class="Wdate default-text-input wper80" 
						onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM',minDate:'#F{$dp.$D(\'startDevMonth\')}',maxDate:'#F{$dp.$D(\'mon\')}'})" id="endDevMonth">
					</td>
					<td width="3%">
						<a class="default-btn" href="#" id="remark"
						style="float: right; margin-right: 30px;">说明</a>
					</td>
				</tr>
			</table>
		</form>
		<div id="content"></div>
		<div style="display:none;" id="remarkDiv">
		  <span style="color:red;font-size:15px;">1.只选账期，查询的是账期所在年份1月到当前账期的累计数据；</span></br>
          <span style="color:red;font-size:15px;">2.选择了账期、开始发展日期、结束发展日期之后，查询的是开始发展日期到结束发展日期之间发展的用户在当前账期的情况的统计；</span></br>
          <span style="color:red;font-size:15px;">3.只选账期和开始发展日期的话，默认结束发展日期为当前账期，只选账期和结束发展日期，默认开始发展日期为当前账期所在年份的1月；</span></br>
          <span style="color:red;font-size:15px;">4.有效率=（发展总量-无效用户数）/发展总量，其中只要用户满足降套、销户、三无和极低中的一种都会被算作无效用户。</span>
        </div>
</body>

</html>