/*
	*依赖JQuery
	*/
	function LchReport(options){
		/*
		 * 动态判断加入artDialog
		 * 
		 */
		if(typeof(art)=="undefined"){
			$("BODY").append('<script type="text/javascript" src="'+$("#ctx").val()+'/js/artDialog4.1.7/artDialog.js"></script>');
			$("BODY").append('<link href="'+$("#ctx").val()+'/js/artDialog4.1.7/skins/default.css" rel="stylesheet" type="text/css" />');
		}
		if(!options){
			return;
		}
		this.title=options.title;
		this.closeHeader=options.closeHeader;
		pageHeader=this.title;
		this.content=options.content;
		this.field=options.field;
		this.css=options.css;
		this.rowParams=options.rowParams;
		this.getSubRows=options.getSubRowsCallBack;//获取数据回调函数
		this.afterShowSubRows=options.afterShowSubRows;
		this.initTable();
		this.renderHeader();
		if(this.closeHeader)
			this.showAllCols(0);
		else
			this.showAllCols(1);
		this.OnOrder(options.orderCallBack);
	}
	LchReport.prototype={
		constructor:LchReport,
		info:function(msg){
			alert(msg);
		},
		initTable:function(){
			//如果需要渠道属性下拉选择
			//加载zree相关的样式和js
			if($("#channelBox").length>0){
				$('<link type="text/css" rel="stylesheet" href="'+$("#ctx").val()+'/js/zTree/css/zTreeStyle/zTreeStyle.css">').appendTo($("HEAD"));
				$('<script src="'+$("#ctx").val()+'/js/zTree/js/jquery.ztree.core-3.1.min.js" type="text/javascript">').appendTo($("HEAD"));
				$('<script src="'+$("#ctx").val()+'/js/zTree/js/jquery.ztree.excheck-3.1.min.js" type="text/javascript">').appendTo($("HEAD"));
				$("#channelBox").attr("readOnly","readOnly");
				 $("#channelBox").val("请选渠道属性");
				$("#channelBox").after("<div class='channelBox' style='display:none;'><div class='ztree' id='ztree'></div>"+
						"<a class='default-btn ok' href='#' style='float:left;margin:15px;' >确定</a><a class='default-btn cancel' href='#' style='float:left;margin:15px;' >清空</a></div>");
				var sql='select kind_id "id",up_kind_id "pId",kind_value "name",kind_level "chlLevel" from pcde.TB_CDE_CHL_HQ_KIND_CODE';
				var zNodes=query(sql);
				var setting = {
						callback:{
							onClick:function(event,treeId,treeNode) {
								
							}
						},
						check:{
							enable:true,
							chkboxType:{ "Y" : "", "N" : "" }
						},
						data:{
							simpleData:{
								enable:true,
								idKey:"id",
								pIdKey:"pId",
								rootPId:null
							}
						}
					};
				$.fn.zTree.init($(".channelBox .ztree"), setting, zNodes);
				$(".channelBox").css({position:'absolute',backgroundColor:'white',zIndex:9999,border:'1px solid #e7d4b3'});
				$("#channelBox").click(function(){
					$(".channelBox").show();
				});
				$(".channelBox .ok").click(function(){
					var treeObj=$.fn.zTree.getZTreeObj("ztree");
					var nodes=treeObj.getCheckedNodes(true);
		            var v="";
					var kindIds="";
					var level=null;
		            for(var i=0;i<nodes.length;i++){
		            	if(v!="") v+=",";
		            	if(kindIds!="") kindIds+=",";
		            	v+=nodes[i].name;
		            	kindIds+="'"+nodes[i].id+"'";
		            	if(level!=null&&level!=nodes[i].chlLevel){
		            		alert("选中的不是同一层级");
		            		return;
		            	}
		            	level=nodes[i].chlLevel;
		            }
		            $("#channelBox").val(v);
		            $("#channelBox").attr("level",level);
		            $("#channelBox").attr("kindIds",kindIds);
		            $(".channelBox").hide();
				});
				$(".channelBox .cancel").click(function(){
					var treeObj = $.fn.zTree.getZTreeObj("ztree");
					treeObj.checkAllNodes(false);
		            $("#channelBox").val("请选渠道属性");
		            $("#channelBox").attr("level","");
		            $("#channelBox").attr("kindIds","");
				});
			}
			/////////////////////
			if(!this.title||!this.title instanceof Array){
				this.info("表头必须是字符串数组");
				return;
			}
			var $table=  $('<table cellpadding="0" cellspacing="0">'+
							'<thead id="lch_DataHead">	'+		
							'</thead>'+
							'<tbody id="lch_DataBody">'+			
							'</tbody>'+
						'</table>');
			var $content=$("#"+this.content);
			if(!$content.length){
				this.info("报表载体ID不能为空");
			}
			//导出页面数据初始化
			var $td=$('<td width="5%" style="padding-left:10px;">'
			+'<a id="exportPageBtn" class="default-btn" onclick="downPageAll()" href="#">导出页面</a>'
			+'</td>');
			$("BODY").find("form").find("TABLE").find("TR:eq(0)").append($td);
			$content.empty().append($table);
			
			
		},
		showAllCols:function(type){
			var showColFunc=this.showCol;
			$("#lch_DataHead").find("TR:eq(0)").find("TH").each(function(){
				showColFunc($(this),type);
			});
		},
		showCol:function($th,type){
			$th.attr("show",type);
			var cx=1,cy=1,x=0,y=0;//默认为第一单元格
			cx=parseInt($th.attr("cx"));
			cy=parseInt($th.attr("cy"));
			y=parseInt($th.attr("y"));
			x=parseInt($th.attr("x"));
			
			var showColFunc=arguments.callee;
			$th.parent().parent().find("TR:eq("+(y+cy)+")").find("TH").each(function(){
				var thisX=parseInt($(this).attr("x"));
				if(thisX>=x&&thisX<=x+cx-1){
					showColFunc($(this),type);
					if(type==0){
						$(this).hide();
						$th.find("A").remove();
						$th.prepend("<a class='sub_on'></a>");
					}else{
						$(this).show();
						$th.find("A").remove();
						$th.prepend("<a class='sub_off'></a>");
					}
					if(type==0){
						var rs=$(this).attr("rowspan");
						var cy0=0;
						if(rs){
							cy0=parseInt(rs);
						}
						$th.attr("rowspan",(cy+cy0));
					}else{
						$th.attr("rowspan",cy);
					}
				}
			});
					
			$("#lch_DataBody").find("TR").each(function(){
				$(this).find("TD").each(function(thisX){
					if(thisX>=x&&thisX<x+cx-1){
						if(type==0){
							$(this).hide();
						}else{
							$(this).show();
						}
					}else if(thisX==x+cx-1){
						if(type==0){
							$(this).attr("colspan",cx);
						}else{
							$(this).attr("colspan",1);
						}
					}
				});
			});
		},
		renderHeader:function(){
			var headData=this.title;
			//单表头
			if( typeof headData[0]=='string' || (headData[0] instanceof Array && headData.length==1)){
				if(headData[0] instanceof Array && headData.length==1){
					headData=headData[0];
				}
				var x=headData.length;
				var h='<tr>';
				for(var i=0;i<x;i++){
					h+='<th x="'+i+'" y="'+0+'" cx="'+1+'" cy="'+1+'" colspan="'+1+'" rowspan="'+1+'" >'+headData[i]+'</th>';
				}
				h+=   '</tr>';
				var $header=$(h);
				$("#lch_DataHead").empty().append($header);
			//多表头
			}else if(headData[0] instanceof Array){
				/**
			     *合并相同标题的表头，采用横向优先法
				 */
				var h='';
				var flag=[];
				for(var y=0;y<headData.length;y++){
					flag[y]=[];
					for(var x=0;x<headData[0].length;x++){
						flag[y][x]=0;
					}
				}
				for(var y=0;y<headData.length;y++){
					h+='<tr>';
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
								if(t!=tnew&&tnew!=''){
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
						h+='<th x="'+x+'" y="'+y+'" cx="'+dx+'" cy="'+dy+'" colspan='+dx+' rowspan='+dy+' >'+headData[y][x]+'</th>';
						
						for(var j=0;j<dy;j++)
							for(var i=0;i<dx;i++)
								flag[y+j][x+i]=1;
					}
					h+='</tr>';
				}
				var $header=$(h);
				
				$("#lch_DataHead").empty().append($header);	
				var showColFunc=this.showCol;
				$("#lch_DataHead").find("TH").toggle(function(){
					showColFunc($(this),0);
				},function(){
					showColFunc($(this),1);
				});
			}
		},
		OnOrder:function(callback){
			//初始化排序开始
			var $order=$("<a class='asc'>&nbsp;</a>");
			var $oldOrder=$("<a class='desc'>&nbsp;</a>");
			var space="<a class='space'>&nbsp;</a>";
			$("#lch_DataHead").find("TH[colspan='1']").append(space);
			$("#lch_DataHead").find("TH[colspan='1']").mouseenter(function(){
				if(!($(this).find(".asc").length||$(this).find(".desc").length)){
					$(this).append($order);
					$(this).find(".space").remove();
					$order.show();
					var $th=$(this);
					$order.unbind().click(function(){
						if($(this).hasClass("asc")){
							callback($(this).parent().attr("x"),"desc");
							$oldOrder.removeClass("asc").addClass("desc");
							$order.removeClass("asc").addClass("desc");
						}else{
							callback($(this).parent().attr("x"),"asc");
							$oldOrder.removeClass("desc").addClass("asc");
							$order.removeClass("desc").addClass("asc");
						}
						if(!$oldOrder.parent().find(".space").length){
							$oldOrder.parent().append(space);
						}
						$oldOrder.appendTo($th);
						$order.appendTo($("body")).hide();
						$th.find(".space").remove();
						$oldOrder.unbind().click(function(){
							if($(this).hasClass("asc")){
								callback($(this).parent().attr("x"),"desc");
								$oldOrder.removeClass("asc").addClass("desc");
								$order.removeClass("asc").addClass("desc");
							}else{
								callback($(this).parent().attr("x"),"asc");
								$oldOrder.removeClass("desc").addClass("asc");
								$order.removeClass("desc").addClass("asc");
							}
						});
					});
					$order.click(function(event){
						event.stopPropagation();
					});
					$oldOrder.click(function(event){
						event.stopPropagation();
					});
				}
			});
			
			$("#lch_DataHead").find("TH[colspan='1']").bind({mouseleave:function(){
				$order.appendTo($("body"));
				$order.hide();
				if(!($(this).find(".space").length||$(this).find(".asc").length||$(this).find(".desc").length)){
					$(this).append(space);
				}
			}});
			//初始化排序结束
		
		},
		showSubRow:function($tr){
			var isTitle=true;
			//var start = new Date().getTime();//起始时间
			if(!$tr){
				var result=this.getSubRows($tr);
				if(null==result){
					return;
				}
				var d=result.data;
				var extra=result.extra;
				$("#lch_DataBody").empty();
				for(var i=0;i<d.length;i++){
					var h="<tr ";
					for(var p=0;p< this.rowParams.length;p++){
						var pName=this.rowParams[p];
							h+=" "+pName+"="+d[i][pName]+" ";
					}
					if(extra){
						for(var extName in extra){
								h+=" "+extName+"="+extra[extName]+" ";
						}
					}
					h+=" parentId=''><td><a class='sub_on'>"+d[i][this.field[0]]+"</a></td>";
					for(var j=1;j<this.field.length;j++){
						h+="<td>"+this.isNull(d[i][this.field[j]])+"</td>";
					}
					h+="</tr>";
					$("#lch_DataBody").append(h);
				}
			}else{/////////////////////////////////
				var hasSub=true;
				var $sub=null;
				if($tr.attr(this.rowParams[0])=='undefined'){
					$sub=$tr.next();
					if($sub.length>0&&$sub.attr("parentId")=='undefined'){
						hasSub=true;
					}else{
						hasSub=false;
					}
				}else{
					$sub=$("#lch_DataBody").find("TR[parentId='"+$tr.attr(this.rowParams[0])+"']");
					if(!$sub.length){
						hasSub=false;
					}
				}
				
				if(!hasSub){
					var result=this.getSubRows($tr);
					if(null==result){
						return;
					}
					var d=result.data;
					var extra=result.extra;
					if(d.length<=0){
						alert("该级已经不能下钻");
						$tr.find("TD:eq(0)").find("A").removeClass("sub_on").addClass("sub_off");
						return ;
					}
					/////处理隐藏显示问题
					var $first=$("#lch_DataBody").find("TR:eq(0)");
					var cols=[];
					var diss=[];
					if($first.length){
						isTitle=false;
						$first.find("TD").each(function(index){
							cols[index]=$(this).attr("colspan");
							diss[index]=$(this).is(":hidden")?'none':'';
						});
					}else{
						
					}
					/////////////////
					var h="";
					for(var i=0;i<d.length;i++){
						h+="<tr ";
						for(var p=0;p< this.rowParams.length;p++){
							var pName=this.rowParams[p];
							h+=" "+pName+"="+d[i][pName]+" ";
						}
						if(extra){
							for(var extName in extra){
									h+=" "+extName+"="+extra[extName]+" ";
							}
						}
						h+=" parentId='"+$tr.attr(this.rowParams[0])+"'><td colspan='"+cols[0]+"' style='display:"+diss[0]+";' ><a class='sub_on' style='margin-left:"+(extra.orgLevel-2)*12+"px;'>"+d[i][this.field[0]]+"</a></td>";
						for(var j=1;j<this.field.length;j++){
							h+="<td  colspan='"+cols[j]+"' style='display:"+diss[j]+";'>"+this.isNull(d[i][this.field[j]])+"</td>";
						}
						h+="</tr>";
					}
					$tr.after(h);
				}
				
				var id=$tr?$tr.attr(this.rowParams[0]):'undefined';
				var $a=$tr.find("TD:eq(0)").find("A");
				if($a.hasClass("sub_on")){
					if(id=='undefined'){
						var $next=$tr.next();
						while($next.attr("parentId")==id){
							$next.show();
							$next=$next.next();
						}
					}else{
						$("#lch_DataBody").find("TR[parentId='"+id+"']").show();
					}
					$a.removeClass("sub_on").addClass("sub_off");
				}else{
					var hideSubRowFuncThis=this;
					if(id=='undefined'){
						var $next=$tr.next();
						while($next.attr("parentId")==id){
							hideSubRowFuncThis.hideSubRow($next);
							$next.hide();
							$next=$next.next();
						}
					}else{
						$("#lch_DataBody").find("TR[parentId='"+id+"']").each(function(){
							hideSubRowFuncThis.hideSubRow($(this));
						});
						$("#lch_DataBody").find("TR[parentId='"+id+"']").hide();
					}
					$a.removeClass("sub_off").addClass("sub_on");
				}
			}
			
			//var start = new Date().getTime();//起始时间
			
			//////////////////////////////////////////////
			//如果已经存在一条数据将新加入的数据按第一行数据展示，否则按照标题展示
			if(isTitle){
				var showColFunc=this.showCol;
				$("#lch_DataHead").find("TR:eq(0)").find("TH").each(function(){
					var type=$(this).attr("show");
					showColFunc($(this),type);
				});
			}/*else{
				/*var $first=$("#lch_DataBody").find("TR:eq(0)");//).is(":hidden")
				$("#lch_DataBody").find("TR:gt(0)").each(function(){
					$(this).find("TD").each(function(x){
					    $(this).attr("colspan",$first.find("TD:eq("+x+")").attr("colspan"));
						if($first.find("TD:eq("+x+")").is(":hidden")){
							$(this).hide();
						}else{
							$(this).show();
						}
					});
				});
			}*///此段性能太低，但较为符合操作习惯
			
			//如果没有数据则
			if(!$("#lch_DataBody").find("TR").length){
				$("#lch_DataBody").append("<tr><td colspan='"+(this.field.length)+"'>暂无数据</td></tr>");
			}else{
			    var showSubRowFuncThis=this;
				$("#lch_DataBody").find("A.sub_on,A.sub_off").unbind().click(function(){
					var $thisTr=$(this).parent().parent();
					if($thisTr.length)
						showSubRowFuncThis.showSubRow($thisTr);
				});
			}
			//样式处理
			if(this.css instanceof Array&&this.css.length>0){
				var csses=this.css;
				$("#lch_DataBody").find("TR").each(function(){
					for(var i=0;i<csses.length;i++){
						var css=csses[i];
						if(css.eq!=undefined){
							$(this).find("TD:eq("+css.eq+")").css(css.css);
						}
						if(css.gt!=undefined &&css.lt==undefined){
							$(this).find("TD:gt("+css.gt+")").css(css.css);
						}
						if(css.gt==undefined&&css.lt!=undefined){
							$(this).find("TD:lt("+css.lt+")").css(css.css);
						}
						if(css.gt!=undefined&&css.lt!=undefined){
							$(this).find("TD:gt("+css.gt+"):lt("+css.lt+")").css(css.css);
						}
						
						if(css.array!=undefined){
							var filter="";
							for(var i=0;i<css.array.length;i++){
								if(filter.length>0){
									filter+=",";
								}
								filter+="TD:eq("+css.array[i]+")";
							}
							if(filter!=""){
								$(this).find(filter).css(css.css);
							}
						}
					}
				});
			}
			
			if(this.afterShowSubRows){
				this.afterShowSubRows();
			}
		},
		hideSubRow:function($tr){
			$tr.hide();
			$tr.find(".sub_off").removeClass("sub_off").addClass("sub_on");
			var id=$tr.attr(this.rowParams[0]);
			//如果节点下存在rowId不存在的情况，则把后续parentId不存在的所有行影藏
			var  hideSubRowFuncThis=this;
			if(id=='undefined'){
				var $next=$tr.next();
				while($next.attr("parentId")==id){
					hideSubRowFuncThis.hideSubRow($next);
					$next.hide();
					$next=$next.next();
				}
			}else{
				
				$("#lch_DataBody").find("TR[parentId='"+id+"']").each(function(){
					hideSubRowFuncThis.hideSubRow($(this));
				});
			}
		},
		isNull:function(obj){
			if((obj+'').startWith('.')){
				obj='0'+obj;
			}
			if(obj==0||obj=='0'){
				return 0;
			}
			if(obj == undefined || obj == null || obj == '') {
				return '';
			}
			return obj;
		}
	}

	//获取数据
	function query(sql){
		var ls=[];
		//loadWidowMessage(1);
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/devIncome/devIncome_query.action",
			data:{
	           "sql":sql
		   	}, 
		   	success:function(data){
		   		if(data&&data.length>0){
		   			ls=data;
		   		}
		    }
		});
		//loadWidowMessage(0);
		return ls;
	}
	//获取数据
	function downloadExcelSplit(sql,header,fileName,index){
		
		var start=parseInt(index)*50000;
		var end=(parseInt(index)+1)*50000;
		
		sql="select ttt.* from ( select tt.*,rownum rr from (" + sql
		+ " ) tt where rownum<=" + end + " ) ttt where ttt.rr>" + start;
		
		var headerStr=[];
		for(var i=0;i<header.length;i++){
			headerStr[i]=header[i].join(",");
		}
		headerStr=headerStr.join("||");
		
		var form = $("<form>");  
		form.attr('style','display:none');  
		form.attr('target','');  
		form.attr('method','post');  
		form.attr('action',$("#ctx").val()+"/devIncome/devIncome_export.action?only="+(new Date()).valueOf());  
		  
		var fileNameInput = $('<input>');  
		fileNameInput.attr('type','hidden');  
		fileNameInput.attr('name','fileName');  
		fileNameInput.attr('value',fileName); 
		var tableTitleInput = $('<input>');
		tableTitleInput.attr('type','hidden');  
		tableTitleInput.attr('name','tableTitle');  
		tableTitleInput.attr('value',headerStr); 
		var sqlInput = $('<input>');
		sqlInput.attr('type','hidden');  
		sqlInput.attr('name','sql');  
		sqlInput.attr('value',sql); 
		$('body').append(form);  
		form.append(fileNameInput);
		form.append(tableTitleInput);
		form.append(sqlInput);   
		form.submit();  
		form.remove();  
	}
	function downloadExcel(sql,header,fileName){
		var cdata = query("select count(*) total from(" + sql+")");
		var total = 0;
		if(cdata && cdata.length) {
			total = cdata[0].TOTAL;
			if(total>50000){
				var h="<div id='exportSplitDiv' style='max-width:400px;max-height:300px;'>";
				var fsize=Math.ceil(total/50000);
				for(var i=0;i<fsize;i++){
					h+="<a style='display:block;float:left;margin:10px;' index='"+i+"' href='#'>"+fileName+"-part["+(i+1)+"]"+"</a>";
				}
				h+="</div>";
				art.dialog({
				    title: '数据拆分导出',
				    content: h,
				    padding: 0,
				    lock:true
				});
				$("#exportSplitDiv").find("A").click(function(index){
					downloadExcelSplit(sql,header,$(this).text(),$(this).attr("index"));
				});
				return ;
			}
		}
		
		var headerStr=[];
		for(var i=0;i<header.length;i++){
			headerStr[i]=header[i].join(",");
		}
		headerStr=headerStr.join("||");
		
		var form = $("<form>");  
		form.attr('style','display:none');  
		form.attr('target','');  
		form.attr('method','post');  
		form.attr('action',$("#ctx").val()+"/devIncome/devIncome_export.action?only="+(new Date()).valueOf());  
		  
		var fileNameInput = $('<input>');  
		fileNameInput.attr('type','hidden');  
		fileNameInput.attr('name','fileName');  
		fileNameInput.attr('value',fileName); 
		var tableTitleInput = $('<input>');
		tableTitleInput.attr('type','hidden');  
		tableTitleInput.attr('name','tableTitle');  
		tableTitleInput.attr('value',headerStr); 
		var sqlInput = $('<input>');
		sqlInput.attr('type','hidden');  
		sqlInput.attr('name','sql');  
		sqlInput.attr('value',sql); 
		$('body').append(form);  
		form.append(fileNameInput);
		form.append(tableTitleInput);
		form.append(sqlInput);   
		form.submit();  
		form.remove();  
	}
String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}

String.prototype.startWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
}


LchReport.RIGHT_ALIGN={textAlign:"right"};
LchReport.SUM_STYLE={background:'lightyellow'};
LchReport.SUM_PART_STYLE={background:'lightcyan'};
/*****报表样式内容高亮显示******/
//常规样式(主要用来标亮数值，重新选择一个字体)
LchReport.NORMAL_STYLE={
		'color':'#d28531',
		'background-color':'#ffecc8',
		'font-size':'12px',
		'font-family':'Verdana, Geneva, sans-serif'
	 };
/****************************/
/********地市营服选择************/
function _list_regions(){
	var $area = $("#regionCode");
	if(!$area||$area.length<1)
		return;
	var sql = " SELECT distinct t.group_id_1 REGION_CODE,t.GROUP_ID_1_name REGION_NAME FROM pcde.VIEW_UNIT_CHARGE t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and 1=2 ";
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].REGION_CODE
					+ '" selected >'
					+ d[0].REGION_NAME + '</option>';
			_list_units(d[0].REGION_CODE);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].REGION_CODE + '">' + d[i].REGION_NAME + '</option>';
			}
		}
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			_list_units($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function _list_units(regionCode){
	var $unit=$("#unitCode");
	if(!$unit||$unit.length<1)
		return;
	var sql = "SELECT distinct t.unit_id UNIT_ID,t.unit_name UNIT_NAME FROM pcde.VIEW_UNIT_CHARGE t where t.group_id_1="+regionCode+" ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
			
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and 1=2 ";
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="">请选择</option>';
			h += '<option value="' + d[0].UNIT_ID
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取营服信息失败");
	}
}
$(function(){
	_list_regions();
	_init_operateType();
});
function _init_operateType(){
	var $operateType=
		($("#operateType").length&&$("#operateType"))||
		($("#operType").length&&$("#operType"))||
		($("#operate_type").length&&$("#operate_type"));
	if(!$operateType||$operateType.length<1)
		return;
	var h="<option value='自营'>自营</option>";
	
	//玉溪特殊处理
	//var code=$("#code").val();
	//if(code=="16005"&&document.title=='营业厅收入报表'){//玉溪的营业厅收入报表
		h="<option value=''>全部</option><option value='柜台外包'>柜台外包</option><option value='自营' selected>自营</option><option value='他营'>他营</option>";
	//}
	
	$operateType.empty().html(h);
}
/****************************/
function _unit_relation(unit){
	return " select distinct u.OLD_UNIT_ID from pcde.VIEW_UNIT_CHARGE u where u.UNIT_ID='"+unit+"' ";
}

function _jf_power(hrId,month){
	if(month.length==8){
			month=month.substring(0,6);
	}	
	var sql="SELECT PORTAL.HR_PERM('"+hrId+"','"+month+"') HRIDS FROM DUAL";                                                                                
	var d=query(sql);
	var r="''";
	if(d&&d.length>0){
		r=d[0]["HRIDS"];
	}
	return r;
}



var pageHeader=[];
function downPageAll(){
	var header=pageHeader;
	//将header中的<br/>去掉
	if(null!=header&&header.length>0&&header[0].length>0){
		for(var i=0;i<header.length;i++){
			for(var j=0;j<header[i].length;j++){
				header[i][j]=header[i][j].replace(new RegExp(/<br\/>|<br>|<\/br>/g),'');
			}
		}
	}
	//1.处理左边
	var $l=$("#lch_DataBody").find("TR:visible");
	var data=[];
	var isSub=false;
	$l.each(function(index){
		var $td=$(this).find("TD:eq(0)");
		var v=$td.text();
		if($td.find("A").length){
			isSub=true;
			v=$td.find("A").text();
			var margin=$td.find("A").css("margin-left");
			try{
				margin=parseInt(margin);
			}catch(e){}
			if(margin){
				var p="";
				for(var i=0;i<margin;i+=12)
					p+="--";
				v="|"+p+">"+v;
			}
		}
		data[index]=[v];
	});
	if(isSub){
		var $b=$("#lch_DataBody").find("TR:visible");
		$b.each(function(index){
			var r=[];
			$(this).find("TD:gt(0)").each(function(i){
				var text=$(this).text();
				if($(this).find("A").length){
					text=$(this).find("A").text();
				}
				r[i]=text;
			});
			data[index]=data[index].concat(r);
		});
	}else{
		var $b=$("#lch_DataBody").find("TR:visible");
		$b.each(function(index){
			var r=[];
			$(this).find("TD").each(function(i){
				var text=$(this).text();
				if($(this).find("A").length){
					text=$(this).find("A").text();
				}
				r[i]=text;
			});
			data[index]=r;
		});
	}
	
	
	var sql="";
	for(var i=0;i<data.length;i++){
		if(sql!=''){
			sql+=" union all ";
		}
		sql+=" select * from( select ";
		
		var tmp="";
		for(var j=0;j<data[i].length;j++){
			if(tmp!=''){ tmp+=","}
			tmp+="'"+data[i][j]+"' as c"+j;
		}
		sql+=tmp+" from dual order by 1) ";
	}
	downloadExcel(sql,header,"data");
}

if(!Array.indexOf) 
{ 
    Array.prototype.indexOf = function(obj) 
    {                
        for(var i=0; i<this.length; i++) 
        { 
            if(this[i]==obj) 
            { 
                return i; 
            } 
        } 
        return -1; 
    } 
}

function getMaxDate(tableName){
	var sql="SELECT MAX(DEAL_DATE) DEAL_DATE FROM "+tableName;
	var r=query(sql);
	if(r!=null&&r[0]!=null&&r.length>0){
		return r[0]["DEAL_DATE"];
	}
	return "";
}