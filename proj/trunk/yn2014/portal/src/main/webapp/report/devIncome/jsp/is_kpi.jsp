<%@page language="java" import="java.util.*" %>
<%@page import="java.net.*" %>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    User user = UserHolder.getCurrentLoginUser();
    Org org = user.getOrg();
	String path = request.getContextPath();
    List<String> err=(List<String>) request.getAttribute("err");
    Calendar ca=Calendar.getInstance();
	ca.add(Calendar.MONTH, -1);
	String time=new SimpleDateFormat("yyyyMM").format(ca.getTime());
%>
<html>
  <head>
    <link href="<%=path %>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=path%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
    <link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=path%>/report/devIncome/js/is_kpi.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
	<script type="text/javascript">
	  var paths="<%=path%>";
	</script>
	<style>
		th {
		    background: #ffecc8 none repeat scroll 0 0;
		    border-left: 1px solid #e7d4b3;
		    color: #d28531;
		    font-size: 14px;
		    font-weight: bold;
		    text-align: center;
		    white-space: nowrap;
		}
		td{
			font-size: 14px;
		    font-weight: normal;
		}
		TR{
			height:50px;
		}
		td,th{
			border-top:1px solid #e7d4b3;
		    border-left:1px solid #e7d4b3;
		    border-bottom:none;
		    border-right:none;
		}
		Table{
			border-bottom:1px solid #e7d4b3;
			border-right:1px solid #e7d4b3;
		}
	</style>
  </head>
  <body class="taskPage">
    <input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="hrId" value="<%=user.getHrId()%>">
	<input type="hidden" id="regionCode" value="<%=org.getRegionCode()%>">
	
		<div id="main" class="clearfix">
			<div class="main-block">
				<div class="title">
					<i></i>自设KPI考核评分导入
				</div>
				<div id="chose-sender">
					<div class="title-o">
						<i>文件上载步骤</i>
					</div>
					<form id="uploadForm" name="mainForm"
						action="<%=request.getContextPath()%>/devIncome/kpiUpload_importKpi.action"
						method="post" enctype="multipart/form-data">

						<table cellspacing="0" width="100%">
							<tr>
								<th  width="100px">第一步</th>
								<td colspan='2'><span style="display:inline-block;">点击<b>模板下载</b>，导出对应的EXCEL数据模板。 </span><a class="default-btn" style="display:inline-block;"
									  style="cursor: pointer"
									onclick="downloadFile();" >模板下载</a>
								</td>
							</tr>
							<tr>
								<th  width="100px">第二步</th>
								<td colspan='2'>点击<b>浏览</b>,选择编辑好的EXCEL数据文件，提交即可。
								</td>
							</tr> 
							<tr>
								<th  width="100px">第三步</th>
								<td width="6%">账期：
								    <input type="text" style="width: 200px;" class="Wdate default-text-input wper80" 
						            onclick="WdatePicker({skin:'whyGreen',dateFmt:'yyyyMM'})" value="<%=time%>" id="time" name="time"/>
						         </td>
					             <td width="">地市：
					                <select style="width: 200px;" id="regionName" name="regionCode"></select>
					             </td>
							</tr>
							<tr>
								<th  width="100px">上传文件</th>
								<td>
								    <input style="display:inline-block;" type="file" size="60" name="uploadFile" />
								</td>
								<td>
								    <a style="display:inline-block;" class="default-btn"  style="cursor: pointer" id="upload">提交</a><span style="display:inline-block;">
								    <font color='red'>（说明：文件目前只支持XLS格式，且内容为文本格式。）</font>
								</td>
							</tr>
						</table>
						<input type="hidden" id="userId" name="userId" value="<%=user.getUsername()%>"/>
					</form>
					<%
  if(err!=null){	
  %>
  	<div style="width:98%;margin-left:10px;">
		<fieldset>
		    <legend><font size="3" style="color:blue;">错误信息</font></legend>
		    <%
		    int ii=0;
		    for(String s:err){
		    	ii++;
		    %>
		    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2" color="red"><%=(ii+"."+s) %></font>	</br>
	  		<%}%>
	  	</fieldset>
  	</div>
  <%
  }
  %>
				</div>
			</div>
		</div>		
	</body>
</html>
