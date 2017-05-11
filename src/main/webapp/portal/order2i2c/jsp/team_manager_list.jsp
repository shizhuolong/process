<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
<title>2I2C人员管理</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/order2i2c/js/team_manager_list.js?v=35"></script>
</head>
<body class="easyui-layout">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="code" value="<%=org.getCode()%>">
	
	<div data-options="region:'center',title:'2I2C人员管理'">
		<div id="container">
		<form id="searchForm">
			<input type="hidden" name="resultMap.page" />
            <input type="hidden" name="resultMap.rows" />
          	<table style="margin:10px 0;width:80%;">
                <tr height="35px">
                    <td align="right">地市：</td>
					<td width="17%">
						<select name="regionCode" id="regionCode" class="default-text-input wper80">
							<option value=''>请选择</option>
						</select>
					</td>
					 <td align="right">团队类型：</td>
                    <td>
                     	<select id="teamType" name="teamType">
                     	   <option value="">全部</option>
                     	   <option value="1">内部团队</option>
                     	   <option value="2">外部团队</option>
                        </select>
                    </td>
                    <td align="right">姓名：</td>
                    <td><input id="name" name="name" type="text"/></td>
                </tr>
                <tr>
					<td colspan="6">
                        	<a class="default-btn fLeft mr10" href="#" id="searchBtn" style="margin-left: 250px;">查询</a>
                        	<a class="default-btn fLeft mr10" href="#" id="addBtn" onclick="add();">新增</a>
                        	<a class="default-gree-btn fLeft mr10" href="#" onclick="downsAll();">导出</a>
                    </td>
				</tr>
            </table>
         </form>
			<div class="default-dt dt-autoH">
				<div class="sticky-wrap">
					<table class="default-table sticky-enabled">
						<thead>
							<tr>
								<th class="first">人员编码</th>
								<th>姓名</th>
								<th>团队类型</th>
								<th>用户账号</th>
								<th>电话</th>
								<th>操作</th>
						</thead>
						<tbody id="dataBody">
						</tbody>
						<tr>
							<td colspan="6">
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
	<div id="editDiv">
	   <div style="margin-top: 40px;">
	       <span style="color:red;font-size:15px;">请选择团队类型<span>
		   <select id="team_type" style="margin-left:50px;">
		     <option value="">请选择</option>
		     <option value="1">内部团队</option>
		     <option value="2">外部团队</option>
		   </select>
	   </div>
	   <div style="display:none;margin-top: 40px;" id="innerEditDiv" class="sticky-wrap">
	     <table class="default-table sticky-enabled" style="width:100%;border-collapse:separate; border-spacing:0px 20px;">
	       <form id="innerEditForm" method="post">
	           <input type="hidden" id="userId" required="false" name="resultMap.userId"/>
		       <tr>
		           <td>hr编码:</td>
			       <td>
			          <input id="hr_id" name="resultMap.hr_id" class="easyui-validatebox" data-options="required:true,validType:['remote']" missingMessage="hrId不能为空"/>
			       </td>
			       <td>账号:</td>
			       <td>
			          <input id="account" name="resultMap.account" readonly="true" required="true" class="easyui-validatebox" missingMessage="账号不能为空"/>
			       </td>
		       </tr>
		       <tr>
		       </tr>
		       <tr>
		          <td>姓名:</td>
		          <td>
			          <input name="resultMap.name" id="innerName" readonly="true" required="true" class="easyui-validatebox" missingMessage="姓名不能为空"/>
		          </td>
		          <td>电话号码:</td>
		          <td>
			          <input name="resultMap.phone" id="innerPhone" readonly="true" required="true" class="easyui-validatebox" missingMessage="电话不能为空"/>
		          </td>
		       </tr>
		       <tr>
	                <td colspan="4">
		                <a href="#" class="default-btn fLeft mr10" id="innerSaveBtn" style="margin-left: 220px;" onclick="innerSave();">保存</a>
	                </td>
			   </tr>
	       </form>
	     </table> 
	   </div>
	   
	   <div style="display:none;margin-top: 60px;" id="outEditDiv" class="sticky-wrap">
	     <table class="default-table sticky-enabled" style="width:100%;border-collapse:separate; border-spacing:0px 20px;">
	       <form id="outEditForm" method="post">
		       <tr>
		          <td>姓名:</td>
		          <td>
			          <input name="resultMap.name" id="outName" required="true" class="easyui-validatebox" missingMessage="姓名不能为空"/>
		          </td>
		          <td>电话号码:</td>
		          <td>
			          <input name="resultMap.phone" id="outPhone" required="true" class="easyui-validatebox" missingMessage="电话不能为空"/>
		          </td>
		       </tr>
		       <tr>
	                <td colspan="4">
		                <a href="#" style="margin-left: 200px;" class="default-btn fLeft mr10" id="outSaveBtn" onclick="outSave();">保存</a>
	                </td>
			   </tr>
	       </form>
	     </table> 
	   </div>
	</div>
</body>
</html>