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
<title>终端导入</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=path%>/portal/channelManagement/js/import_base_list.js?v=6"></script>
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
<body style="overflow-x:auto;margin:5px;margin-top:0;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<div class="search-div">
				<table style="margin: 0px 0; border:none;width:100%;font-size:100%">
					<tr>
						<td width="2%" style="text-align:right;">地市：</td>
						<td width="4%">
						     <select name="regionCode" id="regionCode" class="default-text-input wper100">
								<option value=''>请选择</option>
						     </select>
					    </td>
					   <td width="4%" style="text-align:right;">审批结果：</td>
						<td width="4%">
						     <select name="check_result" id="check_result" class="default-text-input wper100">
								<option value=''>未审批</option>
								<option value='1'>同意</option>
								<option value='0'>不同意</option>
						     </select>
					    </td>
					    <td width="1%">
						   <a class="default-btn" href="#" id="searchBtn"
						    style="float: right; margin-right: 18px;">查询</a>
					    </td>
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="reppeatBtn" onclick="repeatImport()">导入</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="approvalBtn" onclick="approval()">审批</a>
					    </td> 
					    <td width="1%">
						    <a style="cursor:pointer;margin-left: 20px;" class="default-btn" id="exportBtn" onclick="exportData()">导出</a>
					    </td>
					</tr>
				</table>
	</div>
	<div id="lchcontent" style="margin-top:5px;">
	</div>
	<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
	</div>
	<div style="display:none;" id="optionsDiv">
	   <table class="default-table sticky-enabled" style="width:100%;border-collapse:separate; border-spacing:0px 20px;">
	       <form id="optionsForm" method="post">
	         <input type="hidden" id="startPhone" name="resultMap.startPhone"/>
	         <input type="hidden" id="workNo" name="resultMap.workNo"/>
		       <tr>
		          <td clospan="2">
			          <input type="radio" name="resultMap.isAgree" value="1" checked/>同意
			          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			          <input type="radio" name="resultMap.isAgree" value="0"/>不同意
		          </td>
		       </tr>
		       <tr>
		          <td clospan="2">
			                        审批意见:
		          </td>
		       </tr>
		       <tr>
		          <td clospan="2">
			          <textarea style="border:solid 1px #fd9115;" cols="80" rows="8" name="resultMap.options"></textarea>
		          </td>
		       </tr>
		       <tr>
	                <td colspan="2">
		                <a href="#" style="margin-left: 200px;" class="default-btn fLeft mr10" id="saveBtn" onclick="save();">提交</a>
	                </td>
			   </tr>
	       </form>
	     </table> 
	</div>
	<div id="optionsDetail" style="display:none;font-size:15px;">
	  
	</div>
  </body>
</html>