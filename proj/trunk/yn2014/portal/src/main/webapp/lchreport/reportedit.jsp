<%@page import="com.lch.report.util.FileUtil"%>
<%@page import="com.lch.report.dto.Report"%>
<%@page import="java.io.File"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="com.lch.report.util.JsonUtil"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>

<%
	String path=request.getContextPath();
	String id=request.getParameter("id");
	String title=request.getParameter("title");
	Report report=null;
	if(id!=null){
		id=URLDecoder.decode(id,"UTF-8");
		title=URLDecoder.decode(title,"UTF-8");
		report=FileUtil.getReport(new File(id));
	}
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
	<div data-options="region:'east',collapsed:true,title:'工具箱'" style="width:200px;padding:0px;">
		<div id="rightTabs" class="easyui-tabs">
			<div title="查询条件" style="padding:10px">
				<!-- 组件添加
				步骤一：
				添加组件DOM，如下（type属性标识组件的类型，class属性每个组件都一样）
				 <div class="condition" type="date">
	            	日期查询
	             </div>
				 -->
	            <div class="condition" type="like">
	            	模糊查询
	            </div>
	            <div class="condition" type="select">
	            	下拉选择
	            </div>
	            <div class="condition" type="date">
	            	日期查询
	            </div>
	            <div class="condition" type="queryBtn">
	            	<input type="button" value="查询"/>
	            </div>
	            <div class="condition" type="downBtn">
	            	<input type="button" value="导出"/>
	            </div>
	        </div>
	        <div  title="权限" style="padding:10px;height:100%;width:100%;overflow: auto;">
	             <div class="condition" type="unit_org">
	            	基层责任单元组织机构权限
	            </div>
	        </div>
	        <div  title="数据集" style="padding:10px;height:100%;width:100%;overflow: auto;">
	            <ul id="dbTree" style="width:auto;height:auto;"></ul>
	        </div>
		</div>
	</div>
	<div data-options="region:'center',border:false">
			<div id="lchContent" style="width:100%;height:100%;">
				<div class="lchComponent" style="display:'';">
					<div class="cpBody">
						<table width="100%" height="100%">
							<tr>
								<td height="20%">
									<div class="opratorBtns">
										<a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="view()">预览</a>
										<a id="saveBtn" href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-save'" reportId="<%=id%>" onclick="save(this)">保存</a>	
										<a id="reportPath" href=""></a>			
						       		</div>
									<div class="conditions" style="height:60px;width:100%;border:solid red 1px;overflow-x:auto;">
										
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div id="editTable" style="position:absolute;overflow:hidden;">
										<table  cellspacing=0 cellpadding=0>
											<tr style="height:15px;">
												<td style="width:15px;border-right:none;border-bottom:none;">
												</td>
												<td style="border-left:none;">
													<div id="topTool" style="overflow:hidden;"></div>
												</td>
											</tr>
											<tr>
												<td style="border-right:0px;border-top:none;">
													<div id="leftTool" style="overflow:hidden;"></div>
												</td>
												<td style="border-top:0px;border-left:0px;">
													<div id="tableBody" style="overflow:auto;">
														<div class="selToolBox" flag="" style="position:absolute;float:left;display:none;overflow:visible;"></div>
													</div>
												</td>
											</tr>
										</table>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
	</div>
</body>
<script type="text/javascript">
	var report=<%=JsonUtil.beanToJson(report)%>;
	
	///////////
	$(function(){
		var id=$("#saveBtn").attr("reportId");
		id=encodeURI(encodeURI(id));
		var reportPath="/portal/lchreport?action=showreport&id="+id;
		$("#reportPath").attr("href",reportPath).text(reportPath);
		//加载数据集
		$('#dbTree').tree({
			url:$("#ctx").val()+'/lchreport?action=dbtree',
			method:'post',
			animate:true,
			onBeforeLoad:function(node, param){
				if(node){
					param.owner=node.attributes.owner;
					param.tableName=node.attributes.tableName;
					param.colName=node.attributes.colName;
				}
			},
			onExpand:function(node){
			    var $t=$(node.target).parent("LI").find("UL LI .tree-node .tree-title");
			    
			    if($t.attr("drag")!='drag'){
			    	$t.draggable({
					    revert:true,
					    proxy:'clone',
					    onStartDrag:function(){
					        start.x=null;
					    },
					    onStopDrag:function(){
					        $(this).draggable('options').cursor='move';
					    }
					});
			    	$t.attr("drag","drag");
			    }
			} 
		});
		//条件拖拽
		$(".condition").draggable({
		    revert:true,
		    proxy:'clone',
		    onStartDrag:function(){
		        start.x=null;
		    },
		    onStopDrag:function(){
		        $(this).draggable('options').cursor='move';
		    }
		});
		//条件拖入
		$(".conditions").droppable({
			    accept:".condition",
				onDrop:function(e,source){
					var type=$(source).attr("type");
					initConditions(type,$(this));
				}
		});
		
		//一、初始化条件
		var inits=[];
		//1.likes
		if(report&&report.condition&&report.condition.likes){
			var likes=report.condition.likes;
			for(var i=0;i<likes.length;i++){
				//initConditions('like',$(".conditions"),likes[i]);
				inits[likes[i].index]={type:'like',param:likes[i]};
			}	
		}
		//2。equals
		if(report&&report.condition&&report.condition.equals){
			var equals=report.condition.equals;
			for(var i=0;i<equals.length;i++){
				//initConditions(equals[i].type,$(".conditions"),equals[i]);
				inits[equals[i].index]={type:equals[i].type,param:equals[i]};
			}	
		}
		//3.buttons
		if(report&&report.condition&&report.condition.buttons){
			var buttons=report.condition.buttons;
			for(var i=0;i<buttons.length;i++){
				//initConditions(buttons[i].type,$(".conditions"),buttons[i]);
				inits[buttons[i].index]={type:buttons[i].type,param:buttons[i]};
			}	
		}
		//4.power
		if(report&&report.condition&&report.condition.power){
			var power=report.condition.power;
			//initConditions(power,$(".conditions"),{});
			inits.push({type:power,param:{}});
		}
		
		for(var i=0;i<inits.length;i++){
			initConditions(inits[i].type,$(".conditions"),inits[i].param);
		}
		//二、初始化单元格行列标题
		
	});
	function initConditions(type,$cds,param){
		 /*组件添加
			步骤二：
			进行类型判断，然后对不同的组件进行内容、初始化参数、事件等的添加
			*/
		if(type=="like"){
			var h="<div class='condition' style='display:inline-block;' title='拖入数据源进行绑定' table='' column='' cdtype='like'><input class='desc' type='text' value='输入描述' style='width:50px;'/><input  class='bind' type='text' value='' />";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			//初始化参数
			if(param){
				$h.attr("table",param.tableName);
				$h.attr("column",param.column);
				$h.find(".bind").val(param.column);
				$h.find(".desc").val(param.desc);
			}
			$h.droppable({
				accept:".tree-title",
				onDrop:function(e,source){
					var $s=$(source);
			        var colName=$(source).parent().attr("node-id");
			        var $table=$(source).parent().parent().parent().prev();
			        var tableName=$table.attr("node-id");
			        var $owner=$table.parent().parent().prev();
			        var owner=$owner.attr("node-id");
			        if(!owner){
			        	owner=tableName;
			        	tableName=colName;
			        	colName=null;
			        }
			        if(colName){
			        	//拖拽的是列
			        	var tableTitle=$(source).text();
			        	$(this).attr("table",owner+"."+tableName);
			        	$(this).attr("column",colName);
			        	$(this).find(".bind").val(colName);
			        	$(this).find(".desc").val(tableTitle);
			        }
				}
			});
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}else if(type=="select"){
			var h="<div class='condition' style='display:inline-block;' title='拖入数据源进行绑定' table='' column='' cdtype='select'><input class='desc' type='text' value='输入描述' style='width:50px;'/><select  class='bind' value='' ><option value=''>全部</option></select>";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			if(param){
				$h.attr("table",param.tableName);
				$h.attr("column",param.column);
				$h.find(".bind").val(param.column);
				$h.find(".desc").val(param.desc);
			}
			$h.droppable({
				accept:".tree-title",
				onDrop:function(e,source){
					var $s=$(source);
			        var colName=$(source).parent().attr("node-id");
			        var $table=$(source).parent().parent().parent().prev();
			        var tableName=$table.attr("node-id");
			        var $owner=$table.parent().parent().prev();
			        var owner=$owner.attr("node-id");
			        if(!owner){
			        	owner=tableName;
			        	tableName=colName;
			        	colName=null;
			        }
			        if(colName){
			        	//拖拽的是列
			        	var tableTitle=$(source).text();
			        	$(this).attr("table",owner+"."+tableName);
			        	$(this).attr("column",colName);
			        	$(this).find(".bind").val(colName);
			        	$(this).find(".desc").val(tableTitle);
			        	
			        	var url=$("#ctx").val()+"/lchreport?action=listcolumn";
			        	$.ajax({
			    			type:"POST",
			    			dataType:'json',
			    			async:true,
			    			cache:false,
			    			data:{column:colName,table:tableName},
			    			url:url,
			    		   	success:function(data){
			    		   		if(data&&data.length>0){
			    		   			var h='<option value="" >全部</option>';
			    		   			for(var i=0;i<data.length;i++){
			    		   				h+='<option value="'+data[i][0]+'" >'+data[i][0]+'</option>';
			    		   			}
			    		   			$h.find("SELECT").empty().append(h);
			    		   		}
			    		    }
			    		});
			        }
				}
			});
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}else if(type=="date"){
			var h="<div class='condition' style='display:inline-block;' title='拖入数据源进行绑定' table='' column='' cdtype='date'><input class='bind' type='hidden' value=''/><input class='desc' type='text' value='输入描述' style='width:50px;'/><select  class='format' value='' ><option value='yyyy'>yyyy</option><option value='yyyyMM'>yyyyMM</option><option value='yyyyMMdd'>yyyyMMdd</option></select>";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			if(param){
				$h.attr("table",param.tableName);
				$h.attr("column",param.column);
				$h.find(".bind").val(param.column);
				$h.find(".format").val(param.format);
				$h.find(".format").find("OPTION[value='"+param.format+"']").attr("selected","selected");
				$h.find(".desc").val(param.desc);
			}
			$h.droppable({
				accept:".tree-title",
				onDrop:function(e,source){
					var $s=$(source);
			        var colName=$(source).parent().attr("node-id");
			        var $table=$(source).parent().parent().parent().prev();
			        var tableName=$table.attr("node-id");
			        var $owner=$table.parent().parent().prev();
			        var owner=$owner.attr("node-id");
			        if(!owner){
			        	owner=tableName;
			        	tableName=colName;
			        	colName=null;
			        }
			        if(colName){
			        	//拖拽的是列
			        	var tableTitle=$(source).text();
			        	$(this).attr("table",owner+"."+tableName);
			        	$(this).attr("column",colName);
			        	$(this).find(".bind").val(colName);
			        	$(this).find(".desc").val(tableTitle);
			        }
				}
			});
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}else if(type=='queryBtn'){
			var h="<div class='condition' style='display:inline-block;' cdtype='query'><input type='button' value='查询'/>";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			if(param){
				$h.attr("cdtype",'query');
			}
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}else if(type=='downBtn'){
			var h="<div class='condition' style='display:inline-block;' cdtype='down'><input type='button' value='导出'/>";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			if(param){
				$h.attr("cdtype",'down');
			}
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}else if(type=='unit_org'){
			var h="<div class='condition' style='display:inline-block;' cdtype='unit_org'><span type='power'>基层责任单元组织机构权限</span>";
			h+="<a href='javascript:void(0);'>删除</a>";
			h+="</div>";
			var $h=$(h);
			$h.find("A").click(function(){
				$(this).parent().remove();
			});
			$cds.append($h);
		}
	}
</script>

<script>
		function getReportModel(){
			var $body=$('#tableBody');
			var title=getTitles($body);
			var bind=getBindDatas($body);
			var conditions=getConditions($(".conditions"));
			//得到表头
			var report={};
			report.name="<%=title%>";
			report.topTitle=title.top;
			report.leftTitle=title.left;
			report.bind=bind;
			report.condition=conditions;
			report.pageSize=report.leftTitle.length;//跟左标题的行数一样
			report.cx=report.topTitle[0].length;
			report.cy=report.topTitle.length+report.pageSize;
			alert(JSON.stringify(report));
			//得到绑定的数据
			if(!bind){
				return;
			}
			//得到条件
			if(!conditions){
				return;
			}
			return report;
		}
		function save(t){
			var id=$(t).attr("reportId");
			if(!id){
				return;
			}
			id=encodeURI(encodeURI(id));
			var url=$("#ctx").val()+"/lchreport?action=savereport&id="+id;
        	$.ajax({
    			type:"POST",
    			dataType:'json',
    			async:true,
    			cache:false,
    			data:{report:JSON.stringify(getReportModel())},
    			url:url,
    		   	success:function(data){
    		   		if(data&&data.ok){
    		   			alert("保存成功");
    		   		}else{
    		   			alert("保存失败");
    		   		}
    		    }
    		});
		}
		function view(){
			
			var form = $("<form>");  
			form.attr('style','display:none');  
			form.attr('target','_blank');  
			form.attr('method','post');  
			form.attr('action',$("#ctx").val()+"/lchreport?action=showreport");  
			  
			var reportInput = $('<input>');  
			reportInput.attr('type','hidden');  
			reportInput.attr('name','report');  
			reportInput.attr('value',JSON.stringify(getReportModel())); 

			$('body').append(form);  
			form.append(reportInput); 
			form.submit();  
			form.remove();  
		}
		/*
		组件添加：
		步骤三
		获取该组件相应的数据并组装
		*/
		function getConditions($cds){
			var conditions={buttons:[],likes:[],equals:[],power:null};
			var flag=true;
			$cds.find(".condition").each(function(index){
				var cdType=$(this).attr("cdtype");
				if(cdType=='down'){
					conditions.buttons.push({value:'导出',method:'downAll()',type:'downBtn',index:index});
				}else if(cdType=='query'){
					conditions.buttons.push({value:'查询',method:'getPage(0)',type:'queryBtn',index:index});
				}else if(cdType=='like'){
					var tableName=$(this).attr("table");
					var column=$(this).attr("column");
					var desc=$(this).find(".desc").val();
					if(!column){
						alert("第["+(index+1)+"]个条件没有绑定数据,请先绑定。");
						flag=false;
					}else{
						conditions.likes.push({tableName:tableName,column:column,desc:desc,index:index});
					}
				}else if(cdType=='select'){
					var tableName=$(this).attr("table");
					var column=$(this).attr("column");
					var desc=$(this).find(".desc").val();
					if(!column){
						alert("第["+(index+1)+"]个条件没有绑定数据,请先绑定。");
						flag=false;
					}else{
						conditions.equals.push({tableName:tableName,column:column,desc:desc,type:'select',index:index});
					}
				}else if(cdType=='date'){
					var tableName=$(this).attr("table");
					var column=$(this).attr("column");
					var desc=$(this).find(".desc").val();
					var format=$(this).find(".format").val();
					if(!column){
						alert("第["+(index+1)+"]个条件没有绑定数据,请先绑定。");
						flag=false;
					}else{
						conditions.equals.push({tableName:tableName,column:column,desc:desc,type:'date',format:format,index:index});
					}
				}else if(cdType=='unit_org'){
					conditions.power='unit_org';
				}
				
			});
			if(!flag){
				return null;
			}
			return conditions;
		}
		function getBindDatas($cp){
			//得到分界线
			var $td=$cp.find("TD[tdtype='data']:first:visible");
			var y=parseInt($td.attr("y"));
			var x=0;//左标题也可以绑定数据
			
			var x1=-1;
			//先找第一行的第一个没有标题的单元格作为结束单元格，如果不存在这样的单元格则取最后一行标题的长度
			$cp.find("TR:eq(0)").find("TD:visible").each(function(){
				var text=$(this).text();
				if(!text||$.trim(text)==''){
					if(x1==-1) x1=parseInt($(this).attr('x'));
				}
			});
			if(x1==-1){
				x1=$cp.find("TD[y='"+(y-1)+"']").length;
			}
			
			var bindData=[];//[{name:'',cols:[{colName:'',index:6},{}]},{}]
			for(var i=x;i<x1;i++){
				var $cTd=$cp.find("TD[x='"+i+"'][y='"+y+"']");
				var table=$cTd.attr("table");
				var column=$cTd.attr("column");
				if(!table||!column){
					alert("单元格["+(i+1)+","+(y+1)+"]没有绑定数据");
					return null;
				}
				//判断该表是否已经存在
				var curTable=null;
				for(var t=0;t<bindData.length;t++){
					if(bindData[t].name==table){
						curTable=bindData[t];
						break;
					}
				}
				if(curTable){
					curTable.cols.push({colName:column,index:i});
				}else{
					bindData.push({name:table,cols:[{colName:column,index:i}]});
				}
			}
			return bindData;
		}
		
		function getTitles($cp){
			//得到分界线
			var $td=$cp.find("TD[tdtype='data']:first:visible");
			var y=parseInt($td.attr("y"));
			var x=parseInt($td.attr("x"));
			var cx=-1;
			$cp.find("TR:eq(0)").find("TD:visible").each(function(){
				var text=$(this).text();
				if(!text||$.trim(text)==''){
					if(cx==-1) cx=parseInt($(this).attr('x'));
				}
			});
			if(cx==-1){
				cx=$cp.find("TD[y='"+(y-1)+"']").length;
			}
			var cy=$cp.find("TR").length;
			var r={top:[],left:[]};
			//得到顶部的title
			for(var j=0;j<y;j++){
				if(!r.top[j]) r.top[j]=[];
				for(var i=x;i<cx;i++){
					var $t=$cp.find("TD[x='"+i+"'][y='"+j+"']");
					if($t.is(":visible")){
						r.top[j][i-x]=$t.text();
						if($t.find("input").length){
							r.top[j][i-x]=$t.find("input").val();
						}
					}else{
						r.top[j][i-x]="";
					}
				}
			}
			//得到左边的title
			for(var j=y;j<cy;j++){
				if(!r.left[j-y]) r.left[j-y]=[];
				for(var i=0;i<x;i++){
					var $t=$cp.find("TD[x='"+i+"'][y='"+j+"']");
					if($t.is(":visible")){
						r.left[j-y][i]=$t.text();
						if($t.find("input").length){
							r.top[j][i]=$t.find("input").val();
						}
					}else{
						r.left[j-y][i]="";
					}
				}
			}
			//alert(JSON.stringify(r));
			return r;
		}
		function editInit($cp){
			$cp.find("TD").unbind("dblclick");
			$cp.find("TD").dblclick(function(){
				if($editor.parent("TD").length){
					$editor.parent("TD").text($editor.val());
				}
				$editor.val($(this).text());
				$(this).empty().append($editor);
				$editor.show();
				$editor.focus();
				$editor.unbind("click").click(function(e){ e.stopPropagation(); /*return false;*/});
				$editor.unbind("mouseup").mouseup(function(e){ e.stopPropagation(); /*return false;*/});
				$editor.unbind("mousedown").mousedown(function(e){ e.stopPropagation(); /*return false;*/});
				$editor.unbind("mousemove").mousemove(function(e){ e.stopPropagation(); /*return false;*/});
			});
			/////支持放入
			$cp.find("TD").droppable({
			    accept:".tree-title",
				onDrop:function(e,source){
					var $s=$(source);
			        var x=$(this).attr("x");
			        var $dbData=$cp.find("TD[x='"+x+"'][tdtype='data']:first:visible");
			        var $dbTitle=$cp.find("TD[x='"+x+"'][tdtype='title']:last:visible");
			        if($dbTitle.length==0){
			        	$dbTitle=$cp.find("TD[x='"+x+"'][tdtype='title']:first:visible");
			        }
			        if(!$dbData.length){
			        	return;
			        }
			       
			        var colName=$(source).parent().attr("node-id");
			        var $table=$(source).parent().parent().parent().prev();
			        var tableName=$table.attr("node-id");
			        var $owner=$table.parent().parent().prev();
			        var owner=$owner.attr("node-id");
			        if(!owner){
			        	owner=tableName;
			        	tableName=colName;
			        	colName=null;
			        }
			        if(colName){
			        	//拖拽的是列
			        	var tableTitle=$(source).text();
			        	$dbData.attr("table",owner+"."+tableName);
			        	$dbData.attr("column",colName);
			        	$dbData.text(colName);
			        	//alert($dbTitle.length);
			        	$dbTitle.text(tableTitle);
			        	$dbTitle.attr("title",owner+"."+tableName+"."+colName);
			        	ajustHead($editTable);
			        }else{
			        	//拖拽的是表
			        }
			        //如果owner不存在则代表拖拽的是整个表,此时 tableName就是owner，colName就是 tableName
			        return false;
			    }
			});
		}
		function getSelRange($cp,p){
			var tp={};
			var mx=parseInt(p.x1),my=parseInt(p.y1),minx=parseInt(p.x0),miny=parseInt(p.y0);
			$cp.find("TD:not([colspan='1']),TD:not([rowspan='1'])").each(function(){
				var $td=$(this);
				var x=parseInt($td.attr("x"));
				var y=parseInt($td.attr("y"));
				if(!$td.is(':hidden')){
					var tx1=parseInt($td.attr("colspan"))+x-1;
					var ty1=parseInt($td.attr("rowspan"))+y-1;
					var isIn=false;
					for(var j=y;j<=ty1;j++){
						for(var i=x;i<=tx1;i++){
							if(i>=p.x0&&i<=p.x1&&j>=p.y0&&j<=p.y1){
								if(minx>x) minx=x;
								if(mx<tx1) mx=tx1;
								if(miny>y) miny=y;
								if(my<ty1) my=ty1;
								isIn=true;
								break;
							}
						}
						if(isIn) break;
					}
				}
			});
			tp.x0=parseInt(minx);
			tp.x1=parseInt(mx);
			tp.y0=parseInt(miny);
			tp.y1=parseInt(my);
			if(!(p.x0==tp.x0&&p.x1==tp.x1&&p.y0==tp.y0&&p.y1==tp.y1)){
				return getSelRange($cp,tp);
			}
			return tp;
		}
		function showSelBox($cp,start,end){
			if(start.x==null) return;
			if($editor.parent("TD").length){
				$editor.parent("TD").text($editor.val());
				$editor.appendTo($("body"));
				$editor.hide();
			}
			$cp.find(".sel").removeClass("sel");
			//处理start和end，保证start总不会大于end
			var x0=start.x<end.x?start.x:end.x;
			var y0=start.y<end.y?start.y:end.y;
			var x1=start.x>end.x?start.x:end.x;
			var y1=start.y>end.y?start.y:end.y;
			var p={};
			p.x0=x0;
			p.x1=x1;
			p.y0=y0;
			p.y1=y1;
			p=getSelRange($cp,p);
			x0=p.x0;
			x1=p.x1;
			y0=p.y0;
			y1=p.y1;
			/////////////////////////////////////
			//显示操作按钮
			var $tdrt=$cp.find("TR:eq("+y0+")").find("TD[x='"+x0+"']");//得到右上角单元格
			var cols=parseInt($tdrt.attr("colspan"));
			var selCol=parseInt(x0);
			while(cols+selCol-1!=x1){
				selCol++;
				$tdrt=$cp.find("TR:eq("+y0+")").find("TD[x='"+selCol+"']");
				cols=parseInt($tdrt.attr("colspan"));
			}
			var x=$tdrt.position().left+$tdrt.width();
			var y=$tdrt.position().top;
			$cp.parent().find(".selToolBox").css({left:x+"px",top:y+"px"});
			$cp.parent().find(".selToolBox").show();
			
			var lf=$("#tableBody").scrollLeft();
			var tp=$("#tableBody").scrollTop();
			var $splitBtn=$("<a class='button' href='javascript:void(0);'>拆分</a>");
			var $mergeBtn=$("<a class='button' href='javascript:void(0);'>合并</a>");
			$cp.parent().find(".selToolBox")
			.attr("flag","rowandcol")
			.attr("x0",x+lf)
			.attr("y0",y+tp).empty();
			//1.如果选中的单元格只有一个且colspan和rowspan都为1什么也不做
			//2.如果选中的单元格有多于一个的，则显示合并按钮
			
			if(x0!=x1||y0!=y1){
				$mergeBtn.click(function(){
					for(var y=y0;y<=y1;y++){
						for(var x=x0;x<=x1;x++){
							var $td=$cp.find("TR:eq("+y+")").find("TD[x='"+x+"']");
							if(y==y0&&x==x0){
								$td.attr("colspan",x1-x0+1);
								$td.attr("rowspan",y1-y0+1);
							}else{
								$td.hide();
							}
						}
					}
					//$cp.find(".selToolBox").empty().append($splitBtn);
					showSelBox($cp,{x:x0,y:y0},{x:x0,y:y0});
				});
				$cp.parent().find(".selToolBox").empty().append($mergeBtn);
			}
			//3.如果选中的单元格只有一个且colspan和rowspan不都为1，显示拆分按钮
			if(parseInt(x0)+parseInt($tdrt.attr("colspan"))-1==x1
				&&parseInt(y0)+parseInt($tdrt.attr("rowspan"))-1==y1
				&&(parseInt($tdrt.attr("colspan"))+parseInt($tdrt.attr("rowspan")))>2){
				$splitBtn.click(function(){
					for(var y=y0;y<=y1;y++){
						for(var x=x0;x<=x1;x++){
							var $td=$cp.find("TR:eq("+y+")").find("TD[x='"+x+"']");
							$td.attr("colspan",1);
							$td.attr("rowspan",1);
							$td.show();
						}
					}
					$cp.find("TR:eq("+y0+")").find("TD[x='"+x0+"']").removeClass("selBottom").removeClass("selRight");
					//$cp.find(".selToolBox").empty().append($mergeBtn);
					showSelBox($cp,{x:x0,y:y0},{x:x1,y:y1});
				});
				$cp.parent().find(".selToolBox").empty().append($splitBtn);
			}
			///////////////////////////////////////////////
			//显示选中边框
			$cp.find(".selTop").removeClass("selTop");
			$cp.find(".selBottom").removeClass("selBottom");
			$cp.find(".selLeft").removeClass("selLeft");
			$cp.find(".selRight").removeClass("selRight");
			for(var j=y0;j<=y1;j++){
				for(var i=x0;i<=x1;i++){
					if(j==y0) $cp.find("TR:eq("+y0+")").find("TD[x='"+i+"']").addClass("selTop");
					if(j==y1) $cp.find("TR:eq("+y1+")").find("TD[x='"+i+"']").addClass("selBottom");
					if(i==x0) $cp.find("TR:eq("+j+")").find("TD[x='"+x0+"']").addClass("selLeft");
					if(i==x1) $cp.find("TR:eq("+j+")").find("TD[x='"+x1+"']").addClass("selRight");
					var $ntd=$cp.find("TR:eq("+j+")").find("TD[x='"+i+"']");
					var cx=parseInt($ntd.attr("colspan"));
					var cy=parseInt($ntd.attr("rowspan"));
					if(parseInt(i)+cx-1==x1) $ntd.addClass("selRight");
					if(parseInt(j)+cy-1==y1) $ntd.addClass("selBottom");
				}
			}
			/////////////////////////////////////////////
			//自动识别顶部表头，顶部由上到下找到第一行colspan全为1的TR的所有行作为表头，包括该TR
			$cp.find("TD").removeClass("title").attr("tdType","data");
			var fp={x0:0,y0:0,x1:0,y1:0};
			for(var i=0;i<$cp.find("TR").length;i++){
				var $tmpTr=$cp.find("TR:eq("+i+")");
				var $mutilTd=$tmpTr.find("TD:not([colspan='1']):visible");
				//$tmpTr.find("TD").addClass("title");
				if(!$mutilTd.length){
					fp.y1=i;
					fp.x1=parseInt($cp.find("TR:eq(0)").find("TD:last").attr("x"));
					break;
				}
			}
			fp=getSelRange($cp,fp);
			$cp.find("TR:lt("+(fp.y1+1)+")").find("TD:lt("+(fp.x1+1)+")").addClass("title").attr("tdType","title");
			/////////////////////////////////////////////
			//自动识别左边的表头，由左到右找到第一列rowspan全为1的TD的所有列，不包括该TD
			fp={x0:0,y0:fp.y1+1,x1:0,y1:fp.y1+1};
			var flag=false;
			for(var i=0;i<$cp.find("TR:eq(0)").find("TD").length;i++){
				var $mutilTd=$cp.find("TD[x='"+i+"']:not([rowspan='1']):visible");
				if($mutilTd.length==0){//&&$mutilTd.attr("y")>fp.y1
					if(flag){
						fp.x1=i;
						fp.y1=$cp.find("TR").length-1;
						break;
					}else{
						break;
					}
				}else{
					for(var j=0;j<$mutilTd.length;j++){
						if($($mutilTd[j]).attr("y")>=fp.y1){
							flag=true;
							break;
						}
					}
					if(flag){
						continue;
					}else{
						fp.x1=i;
						fp.y1=$cp.find("TR").length-1;
						break;
					}
				}
			}
			fp=getSelRange($cp,fp);
			$cp.find("TR:lt("+(fp.y1+1)+")").find("TD:lt("+(fp.x1==0?fp.x1:(fp.x1+1))+")").addClass("title").attr("tdType","title");
		}
		function ajustHead($t){
			var $body=$t.find("#tableBody").find("TABLE");
			var $top=$t.find("#topTool").find("TABLE");
			var $left=$t.find("#leftTool").find("TABLE");
			
			$top.width($body.width());
			$top.find("TD").each(function(i){
				var cx=$body.find("TD[x='"+i+"'][colspan='1']:visible").width();
				$(this).width(cx);
			});
			
			$left.height($body.height());
			$left.find("TD").each(function(i){
				var cx=$body.find("TD[y='"+i+"'][rowspan='1']:visible").height();
				$(this).height(cx);
			});
		}
		function createTable(cx,cy){
			var h="<table>";
			for(var j=0;j<cy;j++){
				h+="<tr>";
				for(var i=0;i<cx;i++){
					h+="<td x="+i+" y="+j+" colspan=1 rowspan=1></td>";
				}
				h+="</tr>";
			}
			h+="</table>"
			return $(h);
		}
		
		var $editTable=$("#editTable");
		$editTable.css({backgroundColor:'#c2c2c2'});
		$editTable.width('100%').height("100%");
		$editTable.height($editTable.height()-15-95);
		$editTable.width($editTable.width()-15);
		var $topTool=createTable(report&&report.cx?report.cx:20,1);//初始化表格行列
		$topTool.find("TD").css({textAlign:'center',cursor:'pointer'});
		$topTool.find("TD").each(function(i){
			$(this).text(i+1);
		});
		$topTool.find("TD").css({borderTop:'0px',borderBottom:'0px'});
		$topTool.find("TR").css({height:'15px'});
		$topTool.css({borderBottom:'none'});
		$topTool.css({position:'relative',backgroundColor:'#c2c2c2'});
		$("#topTool").height(15).width($editTable.width()-15);
		
		var $leftTool=createTable(1,report&&report.cy?report.cy:15);////初始化表格行列
		$leftTool.find("TD").css({textAlign:'center',cursor:'pointer'});
		$leftTool.find("TD").each(function(i){
			$(this).text(i+1);
		});
		$("#leftTool").height($editTable.height()-15).width(15);
		$leftTool.find("TD").css({borderLeft:'0px',width:'15px'});
		$leftTool.css({borderRight:'0px'});
		$leftTool.css({position:'relative',backgroundColor:'#c2c2c2'});
		
		
		var $editor=$("<input style='display:block;border:none;outline:none;width:99%;height:99%;line-height:100%;'></input>");
		
		var $tableBody=createTable(report&&report.cx?report.cx:20,report&&report.cy?report.cy:15);//初始化表格行列
		$tableBody.css({backgroundColor:'#ffffff'});
		$("#tableBody").height($editTable.height()-15).width($editTable.width()-15);
		$tableBody.find("TD").css({minWidth:'80px',maxWidth:'250px'});
		//添加编辑事件
		editInit($tableBody);
		//添加单元格选中事件
		var  start={x:null,y:null};
		var  end={x:null,y:null};
		$tableBody.find("TD").mousedown(function(e){
			if(e.button==0){//鼠标左键0-左，1-中，2-右
				start.x=parseInt($(e.target).attr("x"));
				start.y=parseInt($(e.target).attr("y"));
			}
			return false;
		});
		$tableBody.find("TD").mousemove(function(e){
		    if(e.buttons==1){//鼠标左键1-左，4-中，2-右
				end.x=parseInt($(e.target).attr("x"));
				end.y=parseInt($(e.target).attr("y"));
				showSelBox($tableBody,start,end);
			}
			//return false;
		});
		$tableBody.find("TD").mouseup(function(e){
			if(e.button==0){//鼠标左键0-左，1-中，2-右
				end.x=parseInt($(e.target).attr("x"));
				end.y=parseInt($(e.target).attr("y"));
				showSelBox($tableBody,start,end);
			}
			return false;
		});
		////////////////////
		$("#topTool").append($topTool);
		var topClick=function(){
			var $cp=$("#tableBody");
			var x=parseInt($(this).attr("x"));
			$cp.find("TABLE").find("TD").removeClass("sel");
			$cp.find("TABLE").find("TD[x='"+x+"'][colspan='1']").addClass("sel");

			//去掉选中边框
			$cp.find(".selTop").removeClass("selTop");
			$cp.find(".selBottom").removeClass("selBottom");
			$cp.find(".selLeft").removeClass("selLeft");
			$cp.find(".selRight").removeClass("selRight");
			var x0=$cp.find("TABLE").find("TD[x='"+x+"'][colspan='1']:visible:eq(0)").position().left+($(this).width()/2);
			var y=20;
			$cp.parent().find(".selToolBox").css({left:x0+"px",top:y+"px"});
			$cp.parent().find(".selToolBox").show();
			
			var $addBtn=$("<a class='button' href='javascript:void(0);'>插入</a>");
			var $delBtn=$("<a class='button' href='javascript:void(0);'>删除</a>");
			$addBtn.click(function(){
				//将大于x的所有单元格的x+1
				var dx=parseInt($cp.find("TD:last").attr("x"))-x;
				var $next=$cp.find("TD[x='"+(x+dx)+"']");
				while($next.length&&dx>0){
					$next.attr("x",x+dx+1);
					dx--;
					$next=$cp.find("TD[x='"+(x+dx)+"']");
				}
				
				$cp.find("TD[x='"+x+"']").each(function(y){
					var $td=$("<td x="+(x+1)+" y="+y+" colspan=1 rowspan=1 style='min-width: 80px; max-width: 250px;'></td>");
					//1.事件
					$td.mousedown(function(e){
						if(e.button==0){//鼠标左键0-左，1-中，2-右
							start.x=parseInt($(e.target).attr("x"));
							start.y=parseInt($(e.target).attr("y"));
						}
						return false;
					});
					$td.mousemove(function(e){
						if(e.buttons==1){//鼠标左键1-左，4-中，2-右
							end.x=parseInt($(e.target).attr("x"));
							end.y=parseInt($(e.target).attr("y"));
							showSelBox($tableBody,start,end);
						}
						//return false;
					});
					$td.mouseup(function(e){
						if(e.button==0){//鼠标左键0-左，1-中，2-右
							end.x=parseInt($(e.target).attr("x"));
							end.y=parseInt($(e.target).attr("y"));
							showSelBox($tableBody,start,end);
						}
						return false;
					});
					$(this).after($td);
				});
				//当穿过时 >=x0 && <x1,要将范围内的单元格隐藏，且该合并的单元格colspan+1
				$cp.find("TD:not([colspan='1']):visible").each(function(){
					var x0=parseInt($(this).attr("x"));
					var cx=parseInt($(this).attr("colspan"));
					var x1=x0+cx-1;
					
					var y0=parseInt($(this).attr("y"));
					var cy=parseInt($(this).attr("rowspan"));
					for(var ty=y0;ty<(y0+cy);ty++){
						if(x>=x0&&x<x1){
							$cp.find("TD[x='"+(x+1)+"'][y='"+ty+"']").hide();
							$(this).attr("colspan",cx+1);
						}
					}
				});
				//添加顶部工具最后一列
				var tln=$topTool.find("TD").length;
				var $topTd=$("<td x="+tln+" y="+0+" colspan=1 rowspan=1 style='min-width: 80px; max-width: 250px;'>"+(tln+1)+"</td>");
				$topTd.click(topClick);
				$("#topTool").find("TD:last").after($topTd);
				ajustHead($editTable);
				$cp.find(".sel").removeClass("sel");
				$cp.parent().find(".selToolBox").hide();
				//添加编辑事件
				editInit($cp);
			});
			$delBtn.click(function(){
				//如果该单元格是可见的且colspan!=1那么要将其后第一个不可见单元格可见且colspan为本单元格的减少一，rowspan保持
				$cp.find("TD[x='"+x+"']:not([colspan='1']):visible").each(function(){
					var y0=parseInt($(this).attr("y"));
					var x0=parseInt($(this).attr("x"));
					var cy=parseInt($(this).attr("rowspan"));
					var cx=parseInt($(this).attr("colspan"));
					$cp.find("TD[x='"+(x0+1)+"'][y='"+y0+"']")
					.attr("rowspan",cy)
					.attr("colspan",cx-1)
					.show();
				});
				//将穿过该行的已经合并的单元格的rowspan减少1
				$cp.find("TD:not([colspan='1']):visible").each(function(){
					var x0=parseInt($(this).attr("x"));
					var cx=parseInt($(this).attr("colspan"));
					if(x>=x0&&x<(x0+cx)){
						$(this).attr("colspan",cx-1);
					}
				});
				//删除顶部工具最后一列
				$("#topTool").find("TD:last").remove();
				$cp.find("TD[x='"+x+"']").remove();
				$cp.parent().find(".selToolBox").hide();
				//删除该列，后续列x值减少1
				var dx=1;
				var $next=$cp.find("TD[x='"+(x+dx)+"']");
				while($next.length){
					$next.attr("x",x+dx-1);
					dx++;
					$next=$cp.find("TD[x='"+(x+dx)+"']");
				}
				ajustHead($editTable);
			});
			var lf=$("#tableBody").scrollLeft();
			var tp=$("#tableBody").scrollTop();
			$cp.parent().find(".selToolBox")
			.attr("flag","col")
			.attr("x0",x0+lf)
			.attr("y0",y)
			.empty().append($addBtn).append($delBtn);
		}
		$("#topTool").find("TD").click(topClick);
		//////////////////////
		$("#leftTool").append($leftTool);
		var leftClick=function(){
			var $cp=$("#tableBody");
			var y=parseInt($(this).attr("y"));
			$cp.find("TABLE").find("TD").removeClass("sel");
			$cp.find("TABLE").find("TD[y='"+y+"'][rowspan='1']").addClass("sel");
			
			//去掉选中边框
			$cp.find(".selTop").removeClass("selTop");
			$cp.find(".selBottom").removeClass("selBottom");
			$cp.find(".selLeft").removeClass("selLeft");
			$cp.find(".selRight").removeClass("selRight");
			var x=20;
			var y0=$cp.find("TABLE").find("TD[y='"+y+"'][rowspan='1']:visible:eq(0)").position().top+($(this).height()/2);
			$cp.parent().find(".selToolBox").css({left:x+"px",top:y0+"px"});
			$cp.parent().find(".selToolBox").show();
			
			var $addBtn=$("<a class='button'  href='javascript:void(0);'>插入</a>");
			$addBtn.click(function(){
				//将大于y的所有单元格的y+1
				var dy=$cp.find("TR").length-1-y;
				var $next=$cp.find("TD[y='"+(y+dy)+"']");
				while($next.length&&dy>0){
					$next.attr("y",y+dy+1);
					dy--;
					$next=$cp.find("TD[y='"+(y+dy)+"']");
				}
				var $tr=$("<tr></tr>");
				$cp.find("TD[y='"+y+"']").each(function(x){
					var $td=$("<td x="+x+" y="+(y+1)+" colspan=1 rowspan=1 style='min-width: 80px; max-width: 250px;'></td>");
					//1.事件
					$td.mousedown(function(e){
						if(e.button==0){//鼠标左键0-左，1-中，2-右
							start.x=parseInt($(e.target).attr("x"));
							start.y=parseInt($(e.target).attr("y"));
						}
						return false;
					});
					$td.mousemove(function(e){
						if(e.buttons==1){//鼠标左键1-左，4-中，2-右
							end.x=parseInt($(e.target).attr("x"));
							end.y=parseInt($(e.target).attr("y"));
							showSelBox($tableBody,start,end);
						}
						//return false;
					});
					$td.mouseup(function(e){
						if(e.button==0){//鼠标左键0-左，1-中，2-右
							end.x=parseInt($(e.target).attr("x"));
							end.y=parseInt($(e.target).attr("y"));
							showSelBox($tableBody,start,end);
						}
						return false;
					});
					$tr.append($td);
				});
				$cp.find("TD[y='"+y+"']").parent("TR").after($tr);
				//当穿过时 >=y0 && <y1,要将范围内的单元格隐藏，且该合并的单元格rowspan+1
				$cp.find("TD:not([rowspan='1']):visible").each(function(){
					var y0=parseInt($(this).attr("y"));
					var cy=parseInt($(this).attr("rowspan"));
					var y1=y0+cy-1;
					
					var x0=parseInt($(this).attr("x"));
					var cx=parseInt($(this).attr("colspan"));
					for(var tx=x0;tx<(x0+cx);tx++){
						if(y>=y0&&y<y1){
							$cp.find("TD[y='"+(y+1)+"'][x='"+tx+"']").hide();
							$(this).attr("rowspan",cy+1);
						}
					}
				});
				//添加左部工具最后一行
				var tln=parseInt($leftTool.find("TR:last").find("TD:first").attr("y"));
				var $leftTd=$("<tr><td x="+0+" y="+(tln+1)+" colspan=1 rowspan=1 >"+(tln+2)+"</td></tr>");
				$leftTd.find("TD").click(leftClick);
				$("#leftTool").find("TR:last").after($leftTd);
				$cp.find(".sel").removeClass("sel");
				$cp.parent().find(".selToolBox").hide();
				ajustHead($editTable);
				//添加编辑事件
				editInit($cp);
			});
			var $delBtn=$("<a class='button'  href='javascript:void(0);'>删除</a>");
			$delBtn.click(function(){
				var $tr=$cp.find("TD[y='"+y+"']:eq(0)").parent("TR");
				
				//如果该单元格是可见的且rowspan!=1那么要将其后第一个不可见单元格可见且rowspan为本单元格的减少一，colspan保持
				$tr.find("TD:not([rowspan='1']):visible").each(function(){
					var y0=parseInt($(this).attr("y"));
					var x0=parseInt($(this).attr("x"));
					var cy=parseInt($(this).attr("rowspan"));
					var cx=parseInt($(this).attr("colspan"));
					$cp.find("TD[y='"+(y0+1)+"'][x='"+x0+"']")
					.attr("rowspan",cy-1)
					.attr("colspan",cx)
					.show();
				});
				//将穿过改行的已经合并的单元格的rowspan减少1
				$cp.find("TD:not([rowspan='1']):visible").each(function(){
					var y0=parseInt($(this).attr("y"));
					var cy=parseInt($(this).attr("rowspan"));
					if(y>=y0&&y<(y0+cy)){
						$(this).attr("rowspan",cy-1);
					}
				});
				
				
				
				//删除该行，后续行y值减少1
				var $next=$tr.next();
				var dy=0;
				while($next.length){
					$next.find("TD").attr("y",y+dy);
					dy++;
					$next=$next.next();
				}
				//删除左工具最后一行
				$("#leftTool").find("TR:last").remove();
				
				$tr.remove();
				$cp.parent().find(".selToolBox").hide();
				ajustHead($editTable);
			});
			var lf=$("#tableBody").scrollLeft();
			var tp=$("#tableBody").scrollTop();
			$cp.parent().find(".selToolBox")
			.attr("flag","row")
			.attr("x0",x)
			.attr("y0",y0+tp)
			.empty().append($addBtn).append($delBtn);
		}
		$("#leftTool").find("TD").click(leftClick);
		
		$("#tableBody").append($tableBody);
		$("#tableBody").scroll(function(){
			var lf=$(this).scrollLeft();
			var tp=$(this).scrollTop();
			var $selToolBox=$(this).find(".selToolBox");
			var flag=$selToolBox.attr("flag");
			var selX0=parseInt($selToolBox.attr("x0"));
			var selY0=parseInt($selToolBox.attr("y0"));
			if(flag=='rowandcol'){//如果是单元格
				$(this).find(".selToolBox").css({left:(selX0-lf)+'px',top:(selY0-tp)+'px'});
			}
			if(flag=='col'){//如果是顶部操作
				$(this).find(".selToolBox").css({left:(selX0-lf)+'px',top:selY0+'px'});
			}
			if(flag=='row'){//如果是左边操作
				$(this).find(".selToolBox").css({left:selX0+'px',top:(selY0-tp)+'px'});
			}
			
			$("#topTool").find("table").css({left:'-'+lf+'px'});
			$("#leftTool").find("table").css({top:'-'+tp+'px'});
			//ajustHead($editTable);
		});
		//初始化表头
		//1.顶部
		if(report&&report.topTitle&&report.topTitle[0].length){
			initTableTitle($tableBody,report.topTitle);
		}
		//2。左边
		if(report&&report.leftTitle){
			initTableTitle($tableBody,report.leftTitle,report.topTitle.length);
		}
		
		ajustHead($editTable);
		showSelBox($tableBody,{x:0,y:0},{x:0,y:0});
		//3。绑定数据name:'',cols:[{"colName":"STOCK_3G_NUM","index":5},...]
		if(report&&report.bind.length){
			initTableBind($tableBody,report.bind);
		}
		
		function initTableBind($cp,bind){
			//得到分界线
			var $td=$cp.find("TD[tdtype='data']:first:visible");
			var y=parseInt($td.attr("y"));
			var x=parseInt($td.attr("x"));
			
			for(var i=0;i<bind[0].cols.length;i++){
				var $cTd=$cp.find("TD[x='"+(x+i)+"'][y='"+y+"']");
				$cTd.attr("table",bind[0].name);
				$cTd.attr("column",bind[0].cols[i].colName);
				$cTd.text(bind[0].cols[i].colName);
			}
		}
		function initTableTitle($cp,headData,y0){
			/**
		     *合并相同标题的表头，采用横向优先法
			 */
			 if(!y0) y0=0;
			var flag=[];
			for(var y=0;y<headData.length;y++){
				flag[y]=[];
				for(var x=0;x<headData[0].length;x++){
					flag[y][x]=0;
				}
			}
			for(var y=0;y<headData.length;y++){
				for(var x=0;x<headData[0].length;x++){
					if(flag[y][x]==1) continue;
					var dx=1,dy=1;
					var t=headData[y][x];
					for(var i=1;(x+i)<headData[0].length;i++){
						if(flag[y][x+i]==1) continue;
						var tnew=headData[y][x+i];
						if(t==tnew||tnew==''){
							dx++;
						}else{
							break;
						}
					}
					for(var j=1;(y+j)<headData.length;j++){
						var eq=true;
						for(var i=0;i<dx;i++){
							var tnew=headData[y+j][x+i];
							if(/*t!=tnew&&*/tnew!=''){
								eq=false;
								break;
							}
						}
						if(eq){
							dy++;
						}else{
							break;
						}
					}
					//h+='<td x="'+x+'" y="'+y+'" class="title" colspan="'+dx+'" rowspan="'+dy+'" >'+headData[y][x]+'</td>';
					$cp.find("TD[x='"+x+"'][y='"+(y0+y)+"']").attr("colspan",dx).attr("rowspan",dy).attr("tdtype",'title').text(headData[y][x]);
					for(var j=0;j<dy;j++){
						for(var i=0;i<dx;i++){
							flag[y+j][x+i]=1;
							if(!(i==0&&j==0)){
								$cp.find("TD[x='"+(x+i)+"'][y='"+(y0+y+j)+"']").hide();
							}
						}
					}
							
				}
				
			}
		}
	</script>
</html>

