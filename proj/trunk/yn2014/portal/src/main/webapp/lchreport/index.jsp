<%@page import="com.lch.report.util.JsonUtil"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<%
	String path=request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet" type="text/css" href="css/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="css/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="css/themes/color.css">
	<link rel="stylesheet" type="text/css" href="css/report.css">
	<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="js/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="js/easyui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="js/jquery.etree.js"></script>
</head>
<style>
	.condition{
		padding:10px;
		border:solid gray 1px;
		margin:10px;
	}
</style>
<body class="easyui-layout" fit="true">
	<input type="hidden" id="ctx" value="<%=path %>"/>
	<!-- div data-options="region:'north',border:false"  style="height:60px;background:#B3DFDA;padding:10px">顶部</div-->
	<div data-options="region:'west',collapsed:false,title:'导航'" style="width:250px;padding:10px;">
		<div>
			<a href="#" onclick="javascript:$('#reportTree').etree('create')" class="easyui-linkbutton" data-options="iconCls:'icon-add'">增加</a>
			<a href="#" onclick="javascript:$('#reportTree').etree('edit')" class="easyui-linkbutton" data-options="iconCls:'icon-edit'">编辑</a>
	        <a href="#" onclick="javascript:$('#reportTree').etree('destroy')" class="easyui-linkbutton" data-options="iconCls:'icon-remove'">删除</a>
		</div>
		<ul id="reportTree" style="width:auto;height:auto;margin-top:10px;">
		
		</ul>
	</div>
	<!-- div data-options="region:'south',border:false" style="height:50px;background:#A9FACD;padding:10px;">底部</div-->
	<div data-options="region:'center',border:false">
		<div id="mainTabs" class="easyui-tabs">
		</div>
	</div>
</body>
<script type="text/javascript">
	//中文化提示信息
	$.extend($.fn.etree.defaults,{
		editMsg:{
			norecord:{
				title:'警告',
				msg:'请先选择节点后再进行修改操作。'
			}
		},
		destroyMsg:{
			norecord:{
				title:'警告',
				msg:'请先选择节点后再进行删除操作。'
			},
			confirm:{
				title:'确认',
				msg:'是否真的删除选定的节点？'
			}
		}
	
	});
	///////////
	function addTab(title, url){
	    if($('#mainTabs').tabs('exists', title)){
	        $('#mainTabs').tabs('select', title);
	    }else{
	        var content = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
	        $('#mainTabs').tabs('add',{
	            title:title,
	            content:content,
	            closable:true
	        });
	    }
	    $("#mainTabs,#mainTabs .tabs-panels,#mainTabs .tabs-panels .panel,#mainTabs .tabs-panels .panel .panel-body")
        .height('100%').css("overflow","hidden");
	}
	$(function(){
		$(".layout-button-left").hide();
		$("#mainTabs").tabs({onSelect:function(title,index){
			 $("#mainTabs,#mainTabs .tabs-panels,#mainTabs .tabs-panels .panel,#mainTabs .tabs-panels .panel .panel-body")
		        .height('100%').css("overflow","hidden");
		}});
		//加载报表树
		$('#reportTree').etree({
		    url:$("#ctx").val()+'/lchreport?action=reporttree',
		    createUrl:$("#ctx").val()+'/lchreport?action=reporttreeadd',
		    updateUrl:$("#ctx").val()+'/lchreport?action=reporttreeedit',
		    destroyUrl:$("#ctx").val()+'/lchreport?action=reporttreedel',
		    dnd:false,
		    onClick: function(node){
				var isLeaf=$('#reportTree').tree("isLeaf",node.target);
				if(!isLeaf){
					return;
				}
				/*var url=$("#ctx").val()+"/lchreport?action=getreport";
	        	$.ajax({
	    			type:"POST",
	    			dataType:'json',
	    			async:true,
	    			cache:false,
	    			data:{id:node.id},
	    			url:url,
	    		   	success:function(report){
	    		   		if(report){
	    		   			
	    		   		}
	    		    }
	    		});*/
	        	var title=node.text;
	        	var pnode = $('#reportTree').tree('getParent',node.target);
	        	while(pnode){
	        		title=pnode.text+">>"+title;
	        		pnode = $('#reportTree').tree('getParent',pnode.target);
	        	}
	        	addTab(title,$("#ctx").val()+"/lchreport/reportedit.jsp?title="+encodeURI(encodeURI(node.text))+"&id="+encodeURI(encodeURI(node.id)));
			},
			onBeforeDrag:function(node){
				return false;
			},
			onBeforeDrop:function(target,source,point){
				return false;
			}
		});
	});
</script>
</html>

