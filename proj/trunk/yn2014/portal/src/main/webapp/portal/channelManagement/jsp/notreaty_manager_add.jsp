<%@ page isELIgnored="false"%> 
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	
<%
	User user = UserHolder.getCurrentLoginUser();
	Org org = user.getOrg();
	String action=(String)request.getParameter("action");
	if(action==null){action="";}
	String id=(String)request.getParameter("id");
	if(id==null){id="";}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>无协议渠道管理</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/zTree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-easyui-1.3.0/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/zTree/js/jquery.ztree.core-3.1.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/artDialog.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog4.1.7/plugins/iframeTools.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/portal/channelManagement/js/notreaty_manager_add.js"></script>
</head>
<body>
<div id="smartForm">
    	<div id="container">
            <div id="content">
                <div id="main" class="clearfix">
                    <div class="main-block">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="orgLevel" value="<%=org.getOrgLevel()%>">
	<input type="hidden" id="orgId" value="<%=org.getId()%>">
	<input type="hidden" id="action" value="<%=action%>">
	
	<form action=""
		name="updateForm" id="updateForm" method="post"
		enctype="multipart/form-data">
		<input type="hidden" name="model.UPDATOR" id="UPDATOR" value="<%=user.getUsername() %>"/>
		<input type="hidden" name="model.CHANLID" id="CHANLID" value="<%=id%>">
		<div class="title"><i></i>渠道基础信息</div>
		<table cellspacing="0" cellpadding="0" border="0" class="channel-add-form">
			
				<tr>
					
					<th width="200">地市:</th>
					<td>
							<select name="model.GROUP_ID_1" id="GROUP_ID_1" onchange="" class="default-text-input w175 require">
								<option value=''>请选择</option>
							</select>
							<input name="model.GROUP_ID_1_NAME" id="GROUP_ID_1_NAME" type="hidden" />
							<i class="required">*</i></td>
					<th width="200">营服中心:</th>
					<td>
						<select name="model.UNIT_ID" id="UNIT_ID" class="default-text-input w175 require">
								<option value=""></option>
						</select>
						<input name="model.UNIT_NAME" id="UNIT_NAME" type="hidden" />
						<input name="model.OLDUNIT_ID" id="OLDUNIT_ID" type="hidden" />
						<i class="required">*</i></td>
				</tr>
				
				<tr>
					<th width="200">渠道名称:</th>
					<td><input type="text" width="12" name="model.CHANLNAME"
						value="" id="CHANLNAME" class="default-text-input w160 require" /> <span><i class="required">*</i></span></td>
					<th width="200">上级渠道编码（总部编码）:</th>
					<td><input type="text" width=10% name="model.UP_CHANL_HQ_CODE"
						value="" onChange="selectChannel()" onClick="selectChannel()"
						id="UP_CHANL_HQ_CODE" class="default-text-input w160 require" placeholder="请输入总部编码,按左键"/>
						<input type="hidden" name="model.TOP_GROUP_ID_4" id="TOP_GROUP_ID_4" />
						<input
							type="text" name="model.TOP_GROUP_ID_4_NAME"
							value="" id="TOP_GROUP_ID_4_NAME"
							width=200px readonly="readonly" chanlCode="" class="default-text-input w160"> <i class="required">*</i></td>
				</tr>


				<tr>
					<th width="200">乡镇/街道:</th>
					<td><input type="text" width=10% name="model.TOWNS"
						value="" id="TOWNS" class="default-text-input w160 require"> <i class="required">*</i></td>
					<th width="200">行政村:</th>
					<td><input type="text" width=10% name="model.HAMLET"
						value="" id="HAMLET" class="default-text-input w160 require"> <i class="required">*</i></td>
				</tr>
				<tr>
					<th width="200">城乡标识:</th>
					<td><select name="model.CITY_TYPE" id="CITY_TYPE" class="default-text-input w175 require">
							<option value=''>请选择</option>
							<option value="1">城市</option>
							<option value="2">乡村</option>
					</select> <i class="required">*</i></td>
					<th width="200">所处商业类型:</th>
					<td><select name="model.MARKET_TYPE" id="MARKET_TYPE" class="default-text-input w175 require">
							<option value=''>请选择</option>
							<option value="1">政府办公区</option>
							<option value="2">居民住宅区</option>
							<option value="3">新技术开发区</option>
							<option value="4">繁华商业区</option>
							<option value="5">写字楼</option>
							<option value="6">校园</option>
							<option value="7">其他区域</option>
					</select> <i class="required">*</i></td>
				</tr>
				<tr>
					<th width="200">覆盖范围(KM):</th>
					<td><input type="text" width=10% name="model.COVER_RANGE"
						value="0" id="COVER_RANGE" class="default-text-input w160 fnumber">
					</td>
				</tr>
			</table>
            <div class="title"><i></i>渠道联系方式</div>
            <table class="channel-add-form">
				<tr>
					<th width="200">联系人姓名:</th>
					<td><input type="text" width=10% name="model.AGTMGR_NAME"
						value="" id="AGTMGR_NAME" class="default-text-input w160 require">
						<i class="required">*</i></td>
					<th width="200">联系人电话:</th>
					<td><input type="text" width=10% name="model.AGTMGR_TEL"
						value="" id="AGTMGR_TEL" class="default-text-input w160 require">
						<i class="required">*</i></td>
				</tr>
				<tr id="latlon" style="display:none;">
					<th width="200">纬度:</th>
					<td><input type="text" width=10% 
						value="" id="lat" class="default-text-input w160">
					<th width="200">经度:</th>
					<td><input type="text" width=10% 
						value="" id="lon" class="default-text-input w160">
						地图:<a href="#" onClick="showMap()">显示</a></td>
				</tr>
				<tr>
					<th width="200">无协议渠道地址:</th>
					<td><input type="text" width=10% name="model.POSITION"
						value="" id="POSITION" class="default-text-input w160 require">
						<i class="required">*</i></td>
				</tr>
 			</table>
            <div class="title"><i></i>渠道管理信息</div>
            <table class="channel-add-form">
				<tr>
					<th width="200">渠道经理姓名:</th>
					<td><input type="text" width=10% name="model.AGENT_NAME"
						value="" id="AGENT_NAME" class="default-text-input w160 require"
						readonly="readonly" placeholder="请先选择渠道经理" onclick="selectPrincipal()"> 
						<i class="required">*</i></td>
					<th width="200">渠道经理电话:</th>
					<td><input type="text" width=10% name="model.AGENT_TEL"
						value="" id="AGENT_TEL" 
						readonly="readonly" class="default-text-input w160"> <input type="hidden" width=10%
						name="model.USERID" value="" id="USERID" class="default-text-input w160"><i class="required">*</i></td>
				</tr>
				<tr>
					<th width="200">HR编码:</th>
					<td><input type="text" width=10% name="model.HR_ID"
						value="" id="HR_ID" class="default-text-input w160 require"
						readonly="readonly"/> 
						<i class="required">*</i></td>
				</tr>
				<tr>
					<th width="200">柜台长度(米):</th>
					<td><input type="text" width=10% name="model.COUNTER_LENGTH"
						value="0" id="COUNTER_LENGTH" class="default-text-input w160 fnumber">
					</td>
					<th width="200">门头宽度(米):</th>
					<td><input type="text" width=10% name="model.DOOR_WIDTH"
						value="0" id="DOOR_WIDTH" class="default-text-input w160 fnumber">
					</td>
				</tr>
				

				<tr>
					<th width="200">业务演示台数量:</th>
					<td><input type="text" width=10% name="model.ACT_CNT"
						value="0" id="ACT_CNT" class="default-text-input w160 number"></td>
					<th width="200">技术支持台数量:</th>
					<td><input type="text" width=10% name="model.TECH_SUPPORT_CNT"
						value="0" id="TECH_SUPPORT_CNT"
						class="default-text-input w160 number"></td>
				</tr>

				<tr>
					<th width="200">业务咨询台数量:</th>
					<td><input type="text" width=10% name="model.CONSULT_CNT"
						value="0" id="CONSULT_CNT" class="number default-text-input w160 ">
					</td>
					<th width="200">厅内台数席数合计:</th>
					<td><input type="text" width=10 name="model.CNT_COUNT"
						value="0" id="CNT_COUNT" class="default-text-input w160 number">
					</td>
				</tr>


				<tr>
					<th width="200">管理人员数量:</th>
					<td><input type="text" width=10% name="model.MANAGER_CNT"
						value="0" id="MANAGER_CNT" class="default-text-input w160 number">
					</td>
					<th width="200">营业员数量:</th>
					<td><input type="text" width=10% name="model.STAFF_NUM"
						value="0" id="STAFF_NUM" class="default-text-input w160 number">
					</td>
				</tr>
				<tr>
					<th width="200">自助查询终端数量:</th>
					<td><input type="text" width=10% name="model.AUTO_SELL_CNT"
						value="0" id="AUTO_SELL_CNT" class="default-text-input w160 number">
					</td>
					<th width="200">自助缴费终端数量:</th>
					<td><input type="text" width=10% name="model.AUTO_PAY_CNT"
						value="0" id="AUTO_PAY_CNT" class="default-text-input w160 number">
					</td>
				</tr>

				<tr>
					<th width="200">自助受理终端数量:</th>
					<td><input type="text" width=10%
						name="model.AUTO_ACCEPTOR_CNT" value="0"
						id="AUTO_ACCEPTOR_CNT" class="default-text-input w160 number"></td>
					<th width="200">自助终端数量合计:</th>
					<td><input type="text" width=10% name="model.AUTO_CNT_COUNT"
						value="0" id="AUTO_CNT_COUNT" class="default-text-input w160 number">
					</td>
				</tr>
				<tr>

					<th width="200">业务受理台数量:</th>
					<td><input type="text" width=10% name="model.ACCEPTED_CNT"
						value="0" id="ACCEPTED_CNT" class="default-text-input w160 number">
					</td>
					<th width="200">人员合计:</th>
					<td><input type="text" width=10 name="model.STAFF_COUNT"
						value="0" id="STAFF_COUNT" class="default-text-input w160 number">
					</td>
				</tr>
				<tr>
					<th width="200">距公交地铁距离</th>
					<td><select name="model.BUS_DISTANCE" id="BUS_DISTANCE" class="default-text-input w175">
							<option value=''>请选择</option>
							<option value="a">20米以内</option>
							<option value="b">20-50米</option>
							<option value="c">50-100米</option>
							<option value="d">100-200米</option>
							<option value="e">200米以上</option>
					</select></td>
					<th width="200">是否紧邻主干道:</th>
					<td><select name="model.IS_MAIN_WAY" id="IS_MAIN_WAY" class="default-text-input w175">
							<option value=''>请选择</option>
							<option value="0">否</option>
							<option value="1">是</option>
					</select></td>
				</tr>
			</table>
            <div class="title"><i></i>其它信息</div>
            <style>
            	.photoflag{display:none;}
            </style>
            <table class="channel-add-form">
            	<tr class="photoflag">
					<th width="200">店前照片:</th>
					<td><input type="button" width=10% value="图片浏览"
						 onclick="selectPic(1)"></td>
					<th width="200">店中照片:</th>
					<td><input type="button" width=10% value="图片浏览"
						 onclick="selectPic(2)"></td>
				</tr>	
				<tr>
					<th width="200" class="photoflag">店后照片:</th>
					<td class="photoflag"><input type="button" width=10% value="图片浏览"
						class="photoflag" onclick="selectPic(3)"></td>
					<th width="200">经营面积(平方米):</th>
					<td><input type="text" width=10% name="model.OPERATE_AREA"
						value="0" id="OPERATE_AREA" class="require fnumber default-text-input w160">
						<i class="required">*</i></td>
				</tr>
				
		   </table>
		   <table class="channel-add-form">
                <tr>
                     <td align="center">
                          <a id="saveBtn" class="default-140-btn mr30" href="javascript:void(0);" onclick="addSubmit()" style="display:inline-block;">确定</a>
                          <a class="default-140-btn mr10" href="javascript:void(0);" onclick="goBack()" style="display:inline-block;">返回</a>
                     </td>
                </tr>
           </table>
	</form>
</div></div></div></div></div>
<style>
	.aui_w,.aui_e{
		width:0px;
	}
	.aui_c{
		width:530px;
	}
</style>
</body>
</html>