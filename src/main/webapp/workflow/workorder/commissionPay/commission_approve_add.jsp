<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String processId = request.getParameter("processId");
System.out.println("------------->"+processId);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>佣金支付工单申请</title>
<link rel="stylesheet" href="<%=path%>/js/zTree/css/demo.css" type="text/css">
<link rel="stylesheet" href="<%=path%>/js/zTree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<script type="text/javascript" src="<%=path%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.core-3.1.js"></script>
<script type="text/javascript" src="<%=path%>/js/zTree/js/jquery.ztree.excheck-3.1.js"></script>
<SCRIPT type="text/javascript">
		
var setting = {
	check: {
		enable: true,
		chkStyle:"radio",
		radioType:"all",
		chkboxType: {"Y":"ps", "N":"s"}
	},
	view: {
		dblClickExpand: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		beforeClick: beforeClick,
		onClick: onClick
	}
};

		var zNodes =[
			{id:1, pId:0, name:"北京"},
			{id:2, pId:0, name:"天津"},
			{id:3, pId:0, name:"上海"},
			{id:6, pId:0, name:"重庆"},
			{id:4, pId:0, name:"河北省", open:true},
			{id:41, pId:4, name:"石家庄"},
			{id:42, pId:4, name:"保定"},
			{id:43, pId:4, name:"邯郸"},
			{id:44, pId:4, name:"承德"},
			{id:5, pId:0, name:"广东省", open:true},
			{id:51, pId:5, name:"广州"},
			{id:52, pId:5, name:"深圳"},
			{id:53, pId:5, name:"东莞"},
			{id:54, pId:5, name:"佛山"},
			{id:6, pId:0, name:"福建省", open:true},
			{id:61, pId:6, name:"福州"},
			{id:62, pId:6, name:"厦门"},
			{id:63, pId:6, name:"泉州"},
			{id:64, pId:6, name:"三明"}
		 ];

		function beforeClick(treeId, treeNode) {
			var check = (treeNode && !treeNode.isParent);
			if (!check) alert("只能选择城市...");
			return check;
		}
		
		function onClick(e, treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
			nodes = zTree.getSelectedNodes(),
			v = "";
			nodes.sort(function compare(a,b){return a.id-b.id;});
			for (var i=0, l=nodes.length; i<l; i++) {
				v += nodes[i].name + ",";
			}
			if (v.length > 0 ) v = v.substring(0, v.length-1);
			var cityObj = $("#citySel");
			cityObj.attr("value", v);
		}

		function showMenu() {
			var cityObj = $("#citySel");
			var cityOffset = $("#citySel").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");

			$("body").bind("mousedown", onBodyDown);
		}
		function hideMenu() {
			$("#menuContent").fadeOut("fast");
			$("body").unbind("mousedown", onBodyDown);
		}
		function onBodyDown(event) {
			if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
				hideMenu();
			}
		}

		$(document).ready(function(){
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
		});
		//-->
	</SCRIPT>
</head>
<body>

	<form id="leaveForm" action="" method="post">
		<table  border="1">
			<tr>
				<td colspan="6">标题:<input type="text" size="100" name=""/></td> 
			</tr>
			<tr>
				<th colspan="2">分公司：</th>
				<td align="left">
				<input type="text" name=""/>
				</td>
				<th>工单编号：</th> 
				<td align="left">
				<input type="text" name=""/>
				</td>
			</tr>
			<tr>
				<th colspan="2">部门：</th>
				<td align="left">
				<input type="text" name=""/>
				</td>
				<th>申请时间：</th> 
				<td align="left">
				<input type="text" name=""/>
				</td>
			</tr>
			<tr>
				<th>姓名：</th>
				<td><label id="username">111</label></td>
				<th>所属部门:</th>
				<td><label id="departmentname">2222</label></td>
				<th>填表日期:</th>
				<td>
					<input type="hidden" name="leave.fillTime" value="" id="fileTime_input"/>
				</td>
			</tr>
			<tr>
				<th>申请类型：</th>
				<td colspan="6" rows="2" align="left">
				<select id="select2" name="leave.leaveCategory"><option value="0">请选择请假类别</option></select>
				</td>
			</tr>
			<tr>
				<th>事由：</th>
				<td colspan="6" align="left"><textarea rows="2" cols="80" id="leavesubject" name="leave.leaveSubject" onblur="leave()" ></textarea></td>
				
			</tr>
			<tr>
				<th >起止时间：</th>
				<td colspan="6" align="left">由<input size="20" class="Wdate" type="text" id="starttime" name="leave.startTime" onFocus="WdatePicker({startDate:'%y-%M-%d 9:00:00',dateFmt:'yyyy-MM-dd HH:mm',maxDate:'#F{$dp.$D(\'endtime\',{d:-1});}'})" />起 
				至<input size="20" class="Wdate" type="text" id="endtime" name="leave.endTime" checked="checked" onblur="endtimes();" onFocus="WdatePicker({startDate:'%y-%M-%d 18:00:00',dateFmt:'yyyy-MM-dd HH:mm',minDate:'#F{$dp.$D(\'starttime\');}'})" />止 </td>
			</tr>
			<tr>
				<th>共计时间：</th>
				<td colspan="6" align="left"><label id="tota"></label>
					<input type="hidden" id="totallength" name="leave.totalLength"/>
				</td>
				<!-- <td colspan="5"></td> -->
				<!-- <td><input type="button" value="计算时间" onclick="time();"/></td> -->
			</tr>
			<tr>
				<th colspan="2">审批步骤：</th>
				<td align="left">
				</td>
				<th>选择下一步审批人：</th> 
				<td align="left">
					<!-- <input type="text" id="citySel" onclick="showMenu(); return false;"/> -->
					<select >
						<option value="1">admin</option>
					</select>
				</td>
			</tr>
			<tr>
				<th colspan="7" align="center">
				<input type="button" value="发送" onclick="leaveAll()" />
				</th>	
		</tr>
		</table>
	</form>
<div id="menuContent" class="menuContent" style="display:none; position: absolute;">
	<ul id="treeDemo" class="ztree" style="margin-top:0; width:160px;"></ul>
</div>
</body>
</html>