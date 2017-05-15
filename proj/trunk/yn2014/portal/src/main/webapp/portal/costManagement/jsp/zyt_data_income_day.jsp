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
<title>自营厅实时收入日通报</title>
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/jquery.min.js"></script> 

<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/jquery-easyui-1.4.5/echarts.min.js"></script> 
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script> 
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/costManagement/js/zyt_data_income_day.js?v=12"></script> 
<style type="text/css">
body {
    color: #717171;
    font-family: "微软雅黑",Arial,"Simsun",sans-serif,SimSun,"宋体",Heiti,"黑体";
    font-size: 72.5%;
}

TABLE {
    border-collapse: collapse;
    border-right: 1px solid #e7d4b3;
    border-top: 1px solid #e7d4b3;
    width: 100%;
}
TABLE THEAD TR TH{
	background: #ffecc8 none repeat scroll 0 0;
    height: 30px;
    color: #d28531;
    font-size: 12px;
    font-weight: bold;
    min-width: 10px;
    padding: 6px 12px;
    text-align: center;
    white-space: nowrap;
    border:1px solid #c0e2ef;
    }
TABLE TBODY TR TD{
	border-bottom: 1px solid #c0e2ef;
    border-left: 1px solid #e7d4b3;
    box-sizing: border-box;
    font-size: 12px;
    min-width: 10px;
    padding: 6px 12px;
    white-space: nowrap;
}
.titleDivStyle{
    font-size: 14px;
    font-weight: bold;
    min-width: 10px;
    padding: 6px 12px;
    text-align: center;
    white-space: nowrap;
    border:1px solid #c0e2ef;
   background-color: #FDCD81;
}
.titleDivStyle P{
	word-spacing:50px;
	letter-spacing:8px;
}
.numberStyle{
	text-align:right;
}
.background{
	background-color:#FFECC8;
}

.toolbarStyle{
	background-color:#FFFFFF;
	font-size: 10pt;
	/* font-weight: bold; */
	color:red;
}
</style>
</head>
<body style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="region" value="<%=org.getRegionCode()%>">
	<div>
		<div style="padding:5px;border:1px solid #c0e2ef;margin-top:10px;;border-top:none;">
		    <!-- <div style="color:red;font-size:15px;">
		                   备注：从20170317账期开始收入修改成主营收入
		    </div> -->
			<div class="titleDivStyle">
				<P align=center><FONT style="FONT-SIZE: 14pt; FILTER: shadow(color=#6495ED,strength=15); WIDTH: 100%; COLOR: #4B4B4B; 
				LINE-HEIGHT: 100%; FONT-FAMILY: 方正舒体">自营厅实时收入日通报</FONT></P>
			</div>
			<div id="incomeDataGridDiv">
				<div style="padding:2px;background:#fafafa;width:99.5%;border:1px solid #ccc">
					<table class="default-table sticky-enabled">
						<tr>
							<th style="text-align:right;border:none;">开始账期：</th>
							<td style="text-align:right;border:none;">
								<input readonly="readonly" type="text" class="Wdate default-text-input wper80"
												id="incomeStartDate" name="incomeStartDate" value="<%=dealDate %>"
												onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" />
							</td>
							<th style="text-align:right;border:none;">结束账期：</th>
							<td style="text-align:right;border:none;">
								<input readonly="readonly" type="text" class="Wdate default-text-input wper80"
												id="incomeEndDate" name="incomeEndDate" value="<%=dealDate %>"
												onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMMdd',isShowClear:false})" />
							</td>
							<th style="text-align:right;border:none;">运营模式：</th>
							<td style="text-align:right;border:none;">
								<select id="incomeOpeType" name="incomeOpeType" class="Wdate default-text-input wper80">
									<option value=''>全部</option>
									<option value='自营' selected>自营</option>
									<option value='他营'>他营</option>
									<option value='柜台外包'>柜台外包</option>
								</select>
							</td>
							<th style="text-align:right;border:none;">厅类型：</th>
							<td style="text-align:right;border:none;">
								<select id="incomeChnlType" name="incomeChnlType" class="Wdate default-text-input wper80">
									<option value=''>全部</option>
									<option value='小型厅'>小型厅</option>
									<option value='标准厅'>标准厅</option>
									<option value='旗舰厅'>旗舰厅</option>
								</select>	
							</td>
							<td style="text-align:right;border:none;">
								<a class="default-btn fLeft mr10" id="incomeSearchBtn">查询</a>
								<a class="default-gree-btn fLeft mr10" id="incomeDownBtn">导出</a>
							</td>
						</tr>
					</table>
				</div>
				<div>
					<div id="incomeDataBar" style="border-left:1px solid #c0e2ef;border-right:1px solid #c0e2ef;">
						<span>单位：&nbsp;</span>
						<span class="toolbarStyle">户&nbsp;&nbsp;&nbsp;&nbsp;</span>|
						<span>本月截止:&nbsp;&nbsp;</span>
						<span id='incomeDataBarSpan' class="toolbarStyle" style="color:red;"></span >
						<span class="toolbarStyle">日</span>
					</div>
					<table id="incomeDataGrid"></table>
				</div>
			</div>
		</div>
	</div>
	</body>
</html>