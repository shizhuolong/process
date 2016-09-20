<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" >
	<title>监控用户管理</title>
	<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/platform/theme/style/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css">
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/platform/theme/js/sdmenu.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/portal/monitorUserManagement/js/monitor_user_list.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>
</head>
<body>
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>"/>
	<div id="container">
		<form id="searchForm" method="post">
			<input type="hidden" name="resultMap.page" /> <input type="hidden"
				name="resultMap.rows" />
			<table width="100%" style="margin: 10px 0px;">
				<tr height="35px">
					<td width="8%">&nbsp;姓名：</td>
					<td width="15%">
						<input class="default-text-input wper80" style="width:124px; height: 22px;" name="name" type="text" id="name"/>
					</td>
					<td width="8%">电话：</td>
					<td width="15%">
						<input class="default-text-input wper80" style="width:124px; height: 22px;" name="phone" type="text" id="phone"/>
					</td>
					<td width="8%">&nbsp;</td>
					
				</tr>
				<tr>
				    <td width="8%">&nbsp;是否联通员工：</td>
					<td width="15%">
						<select id="isUncom" class="default-text-input wper80" name="type">
							<option value="">请选择</option>
							<option value="1">是</option>
							<option value="0">否</option>
					    </select>
				    </td>
					
					<td width="8%">是否正常发送：</td>
					<td width="15%">
						<select id="sendFlag" class="default-text-input wper80" name="type">
							<option value="">请选择</option>
							<option value="1">是</option>
							<option value="0">否</option>
					    </select>
					</td>
					<td width="6%"><a class="default-btn" href="#"
						id="searchBtn">查询</a></td>
					<td>
						<a class="default-btn" href="#"
							id="addBtn">新增</a>
					</td>
				</tr>
				
			</table>
		</form>
		
		<form id="addForm" style="display:none;" method="post"  action="<%=request.getContextPath()%>/monitorUser/monitorUserManager_add.action">
			<input type="hidden" name="resultMap.id" />
			<input type="hidden" id="oldName" />
			<input type="hidden" id="oldPhone" />
			<table width="530px" style="margin-left: 12px ;margin-top:10px;">
				<tr height="35px">
				    <td width="5%">地市：</td>
				    <td>
				      <select class="default-text-input wper80" style="width:124px; height: 22px;" id="regionCity" name="resultMap.regionCity">
				        <option value=''>全部</option>
				      </select>
				    </td>
				</tr>
				<tr height="35px">
				     <td width="5%">营服中心：</td>
				     <td>
				       <select class="default-text-input wper80" style="width:124px; height: 22px;" id="unitName" name="resultMap.unitName">
				        <option value=''>全部</option>
				       </select>
				     </td>
				     <td width="10%">管理员级别：</td>
				     <td>
				        <select class="default-text-input wper80" style="width:124px; height: 22px;" id="levelDesc" name="resultMap.levelDesc">
				          <option value='省级管理员'>省级管理员</option>
				          <option value='地市管理员'>地市管理员</option>
				          <option value='营服管理员'>营服管理员</option>
				        </select>
				     </td>   
				</tr>    
				<tr height="35px">
					<td width="10%">姓名：</td>
					<td>
						<input class="default-text-input wper80" style="width:124px; height: 22px;padding-right: 0px;padding-left: 0px;border-left-width: 1px;border-right-width: 1px;" name="resultMap.name"  type="text" />
				    </td>
				    <td width="10%">电话：</td>
					<td>
						<input class="default-text-input wper80" style="width:124px; height: 22px;padding-right: 0px;padding-left: 0px;border-left-width: 1px;border-right-width: 1px;"  name="resultMap.phone"  type="text" />
				    </td>
				</tr>
				<tr height="35px">
					<td width="10%">是否联通员工：</td>
					<td width="15%">
						<select id="dIsUncom" class="default-text-input wper60" style="width: 52px;" name="resultMap.isUncom">
							<option value="1">是</option>
							<option value="0">否</option>
					    </select>
				    </td>
					<td width="10%">是否正常发送：</td>
					<td width="15%">
						<select id="dSendFlag" class="default-text-input wper60" style="width: 52px;" name="resultMap.sendFlag">
							<option value="1">是</option>
							<option value="0">否</option>
					    </select>
					</td>
				</tr>
				<tr>
					<td width="10%">业务类型：</td>
					<input type="hidden" value="" name="resultMap.busiType"/>
					<td width="15%" colspan="3" id="typeContent" style="line-height:35px;">
						
					</td>
				</tr>
				<tr height="50px">
					<td colspan="2">
						<a class="default-btn" href="javascript:void(0);" style="float:right;margin:10px;"
						id="saveBtn">保存</a>
					</td>
					<td colspan="2">
						<a class="default-btn" href="javascript:void(0);" style="float:left;margin:10px;"
						id="cancelBtn">取消</a>
					</td>
				</tr>
			</table>
		</form>
		<div class="default-dt dt-autoH">
			<div class="sticky-wrap">
				<table class="default-table sticky-enabled">
					<thead>
						<tr>
							<th class="first">架构</th>
							<th>姓名</th>
							<th>电话</th>
							<th>是否联通员工</th>
							<th>是否正常发送</th>
							<th>业务类型</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody id="dataBody">
					</tbody>
					<tr>
						<td colspan="6">
							<div class="page_count" style="width:1180px;">
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
</body>
<script>

</script>
</html>