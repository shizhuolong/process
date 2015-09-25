<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<%
	String path = request.getContextPath();
	Calendar c = Calendar.getInstance();     
	c.add(Calendar.MONTH, -1);
	String currentday = new SimpleDateFormat("yyyyMM").format(c.getTime());
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String orgLevel = org.getOrgLevel();
	String orgCode = org.getCode();
	String hrId=user.getHrId();
%>
<html>
  <head>
    <title>直销人发展积分明细</title>
<script type="text/javascript">
	var group_id = "<%=orgCode%>";
	var group_level = "<%=orgLevel%>";
	var deal_date = "<%=currentday%>";
	var hrId="<%=hrId%>";
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
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>

<script type="text/javascript" src="<%=path %>/wgreport/page/javascript/jlkh/tb_mrt_jcdy_jkxsjf.js"></script>

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
					<td align="left" style="width:30px;">帐期</td>
					<td>
						<input type="text" style="width:100px" class="Wdate" id="deal_date" readonly="readonly" value="<%=currentday %>"  onclick="WdatePicker({isShowClear:false,skin:'whyGreen',dateFmt:'yyyyMM'})"/>
					</td>
					<td align="left">地市名称</td>
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
					<td align="left">营服中心</td>
					<td>
						<input type="text" name="unit_name" id="unit_name">
					</td>
					<td align="left">人员姓名</td>
					<td>
						<input type="text" name="user_name" id="user_name" style="width: 152px;">
					</td>
					</tr>
					<tr>
					<td align="left">用户号码</td>
					<td>
						<input type="text" name="service_num" id="service_num" style="width: 152px;">
					</td>
					<td align="left">业务描述</td>
					<td>
						<input type="text" name="itemdesc" id="itemdesc" style="width: 152px;">
					</td>
					<td align="left">备注</td>
					<td>
						<input type="text" name="remark" id="remark" style="width: 152px;">
					</td>
					<td align="left" colspan="3">
						<input type="button" id="search" class="btn-search" style="float:left;"/>
						<input type="button" id="exceldown" value="导出Excel" class="ana-button" style="cursor:pointer;margin-top:0px;margin-bottom:0px;padding-top:0px;float:left;"/>
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
</html>
