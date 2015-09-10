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
		this.content=options.content;
		this.field=options.field;
		this.css=options.css;
		this.rowParams=options.rowParams;
		this.getSubRows=options.getSubRowsCallBack;//获取数据回调函数
		this.afterShowSubRows=options.afterShowSubRows;
		this.initTable();
		this.renderHeader();
		this.showAllCols(1);
		this.OnOrder(options.orderCallBack);
	}
	LchReport.prototype={
		constructor:LchReport,
		info:function(msg){
			alert(msg);
		},
		initTable:function(){
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