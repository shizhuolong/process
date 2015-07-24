$(function(){
	  // 路径配置
    require.config({
        paths: {
            echarts: $("#ctx").val()+'/portal/index/echarts/build/dist'
        }
    });
	var myMenu = new SDMenu("my_menu");
	myMenu.init();
	//查询收入与发展
	searchIncomeAndDev();
	//日发展量趋势图表
	showIncomeDevChart();
	//日收入趋势图表
	showNetIncomeChart();
	//最新公告
	listBulls();
	//文件下载列表
	indexDocList();
	//游离渠道数量
	freeChannel();
	//佣金下载
	searchYj();
	//实时发展
	searchRealTimeDev();
	//待办工单数
	qryTodoWorkOrderNum();
	//显示渠道分布地图
	showChanlMap();
	$(".arrow-up-map,arrow-down-map").parent().trigger("click");
	//销售排名
	showXsph();
	//积分排名
	showJfph();
});

//游离渠道
function freeChannel(){
	$.ajax({
		url:$("#ctx").val()+"/index/index_freeChannel.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			$("#freechannel").html('游离渠道：'+data);
		}
	});
}

function searchfreeChannel(element) {
	
	var text = $(element).text();
	if(text == '游离渠道：0') {
		return;
	}
	var lis=parent.document.getElementById("navi").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
        if(lis[i].className=="select1"){
            lis[i].className="";
            lis[i].getElementsByTagName("a")[0].className="";
        }
        if(i==8) {
        	lis[i].className="select1";
        	lis[i].getElementsByTagName("a")[0].className="select";
        }
    };
    parent.openWindow('游离渠道','computer', $("#ctx").val()+'/warningAndMonitor/freeChannel!index.action');
	parent.switchFirstMenu('module-477161','预警监控');
}

//文件下载列表
function indexDocList() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listDoc.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					//str+="<a target='_blank' href='"+$("#ctx").val()+"/docManagement/docManager_downfile.action?id="+data[i].ID+"' id='"+data[i].ID+"'>"+data[i].OLDNAME+"</a>";
					str+="<a href='#' onclick='downDoc(\""+data[i].ID+"\");'>"+data[i].OLDNAME+"</a>";
				}
			}
			$("#indexDocList").after(str);
			if(str==""){
				$("#indexDocList").parent().addClass("collapsed");
			}
		}
	});
}
//待办工单数
function qryTodoWorkOrderNum() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_qryTodoWorkOrderNum.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			$("#workOrderNum").html('待办：'+data);
		}
	});
}

function openOrderWindow(element) {
	
	var text = $(element).text();
	if(text == '待办：0') {
		return;
	}
	var lis=parent.document.getElementById("navi").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
        if(lis[i].className=="select1"){
            lis[i].className="";
            lis[i].getElementsByTagName("a")[0].className="";
        }
        if(i==5) {
        	lis[i].className="select1";
        	lis[i].getElementsByTagName("a")[0].className="select";
        }
    };
    parent.openWindow('工单列表','computer','/portal/workflow/workorder/activityApproval/processApprove/processApprove.jsp');
	parent.switchFirstMenu('module-377341','经营管控');
}

function downDoc(docId){
	docId = encodeURI(encodeURI(docId));
	window.location.href = $("#ctx").val()+"/docManagement/docManager_downDoc.action?id="+docId;
}
//最新公告
function listBulls() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listBulls.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					str+="<a style='padding-right:5px;' href='javascript:void(0);' onclick='showBull(\""+data[i].BULLETINID+"\")' id='"+data[i].BULLETINID+"'><table><tr><td width='65%'>"+firstNChar(data[i].BULLNAME,7)+"</td><td>"+data[i].CREATETIME+"</td></tr></table></a>";
				}
			}
			$("#bulls").after(str);
			if(str==""){
				$("#bulls").parent().addClass("bulls");
			}
		}
	});
}
function firstNChar(s,n){
	if(!s){s=""};
	if(s.length>n){
		return s.substring(0,n)+"...";
	}else{
		return s;
	}
}
function showBull(id){
	$.ajax({
		url:$("#ctx").val()+"/index/index_getBullById.action",
		type:'POST',
		dataType:'json',
		data:{
	           "id":id
		},
		success:function(data){
			if(data&&data.length>0){
				var c="<div style='width:530px;height:320px;overflow:auto;padding:20px 25px;'>";
					c+="<div>";
				c+=data[0].BULLETINDESC;
					c+="</div><br/>";
					c+="<div style='line-height:26px;'>";
					c+="	<h1>附件：</h1>";
					if(data[0].ACCESSORYNAME){
						var attachNames=data[0].ACCESSORYNAME.split("&&");
						var attachUrl=data[0].ATTACHMENTS.split("&&");
						for(var i=0;i<attachNames.length;i++){
							c+="<a target='_blank' href='"+$("#ctx").val()+"/bullManagement/bullManager_downfile.action?downUrl="+attachUrl[i]+"&downName="+encodeURI(encodeURI(attachNames[i]))+"'>"+attachNames[i]+"</a><br/>";
						}
					}else{
						c+="没有附件";
					}
					
					
					c+="</div>";
				c+="</div>";
				
				art.dialog({
				    title: data[0].BULLNAME,
				    content: c,
				    width:530,
				    height:320,
				    padding: 0,
				    lock:true
				});

			}
		}
	});
	/*var url = $("#ctx").val()+"/index/index_getBullById.action?id="+id;
	//art.dialog.data('id',id);
	art.dialog.open(url,{
		id:'bullDialog',
		width:'530px',
		height:'320px',
		lock:true,
		resize:false
	});*/
}
//日收入趋势图表
function showNetIncomeChart() {
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	//初始化echarts图表
	        	var myChart = ec.init(document.getElementById('net_income_chart'));
	        	//图表显示提示信息
	        	myChart.showLoading({
	        	    text : "图表数据正在努力加载...",
	        	    effect : 'ring',
	        	    x : 'center',
	        	    y : 'center',
	        	    textStyle : {
	        	        fontSize : 16
	        	    }
	        	});
	        	var option = {
	        		title:{
	        			text:'日净增收入(元)',
	        			textStyle:{
	        				fontSize:12,
	        				fontWeight: 'bolder',
	        				color:'#6c6b6b'
	        			}
	        		},
	        		tooltip:{
	        			trigger: 'axis'
	        		},
	        		color:['#ff6347','#1e90ff','#ba55d3','#40e0d0','#ff7f50','#6495ed','#ff00ff'],
	        		legend:{
	        			data:['2G','3G']
	        		},
	        		xAxis:[{
	        			type:'category',
	        			data : ['']
	        		}],
	        		yAxis:[{
	        			type:'value'
	        		}],
	        		series:[]
	        	};
	        	$.ajax({
	        		url:$("#ctx").val()+"/index/index_listNetIncomeChart.action",
	        		type:'POST',
	        		dataType:'json',
	        		async:true,
	        		success:function(result){
	        			if(result.categoryList.length>0){
	        				option.legend.data = result.legend;
	        				option.xAxis[0].data = result.categoryList;
	        				option.series = result.seriesList;
	        			} else {
	        				option.series = [{"data":[0],"id":1,"name":"2G","type":"scatter"}];
	        				option.xAxis[0].data = [""];
	        			}
	        			myChart.hideLoading();
	        			// 为echarts对象加载数据 
	        			myChart.setOption(option);
	        		
	        			
	        		}
	        	});
	        }
	 );
}

//日发展量趋势图表
function showIncomeDevChart() {
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
	        ],
		function(ec) {
			//初始化echarts图表
			var myChart = ec.init(document.getElementById('income_dev_chart'));
			//图表显示提示信息
			myChart.showLoading({
				text : "图表数据正在努力加载...",
				effect : 'ring',
				x : 'center',
				y : 'center',
				textStyle : {
					fontSize : 16
				}
			});
			var option = {
					title:{
						text:'日发展用户数(户)',
						textStyle:{
							fontSize:12,
							fontWeight: 'bolder',
							color:'#6c6b6b'
						}
					},
					tooltip:{
						trigger: 'axis'
					},
					color:['#40e0d0','#ff7f50','#6495ed','#ff00ff','#ff6347'],
					legend:{
						data:['2G','3G']
					},
					xAxis:[{
						type:'category',
						data : []
					}],
					yAxis:[{
						type:'value'
					}],
					series:[]
			};
			$.ajax({
				url:$("#ctx").val()+"/index/index_listIncomeAndDevChart.action",
				type:'POST',
				dataType:'json',
				async:true,
				success:function(result){
					if(result.categoryList.length>0){
						option.legend.data = result.legend;
						option.xAxis[0].data = result.categoryList;
						option.series = result.seriesList;
					} else {
						option.series = [{"data":[0],"id":1,"name":"2G","type":"scatter"}];
						option.xAxis[0].data = [""];
					}
					myChart.hideLoading();
					// 为echarts对象加载数据 
					myChart.setOption(option);	
				}
			});
		}
	);
}

//收入与发展
function searchIncomeAndDev() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchIncomeAndDev.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='9' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].DEV_2G_NUM+"</td>";
					str+="<td>"+data[i].SR_2G_NUM+"</td>";
					str+="<td>"+data[i].DEV_3G_NUM+"</td>";
					str+="<td>"+data[i].SR_3G_NUM+"</td>";
					str+="<td>"+data[i].DEV_4G_NUM+"</td>";
					str+="<td>"+data[i].SR_4G_NUM+"</td>";
					str+="<td>"+data[i].TOTAL_DEV_NUM+"</td>";
					str+="<td>"+data[i].TOTAL_SR_NUM+"</td>";
					str+= "</tr>";
				}
			}
			$("#income_dev tbody").empty().append(str);
		}
	});
}

//佣金总览
var  yjx=[''];
var  yjy=[0];
var  yjzb=[];
function searchYj() {
	//if(!$("#Yj tbody").find("TR").length) return;
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchYj.action",
		type:'POST',
		async:true,
		dataType:'json',
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='8' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].TOTAL_2G+"</td>";
					str+="<td>"+data[i].TOTAL_3G+"</td>";
					str+="<td>"+data[i].TOTAL_NETWORK+"</td>";
					str+="<td>"+data[i].TOTAL_FLOW+"</td>";
					str+="<td>"+data[i].CHANL_SUBSIDY+"</td>";
					str+="<td>"+data[i].OTHER+"</td>";
					str+="<td>"+data[i].TOTAL+"</td>";
					str+= "</tr>";
					var ns=data[i].GROUPNAME.split("");
					ns=ns.join("\n");
					yjx[i]=ns;
					yjy[i]=data[i].TOTAL;
					if(data[i].FLAG==1){
						yjzb=[
						   {name:'2G佣金',value:data[i].TOTAL_2G},
						   {name:'3G佣金',value:data[i].TOTAL_3G},   
						   {name:'固网佣金',value:data[i].TOTAL_NETWORK},   
						   {name:'融合佣金',value:data[i].TOTAL_FLOW},   
						   {name:'渠道补贴佣金',value:data[i].CHANL_SUBSIDY},   
						   {name:'其他佣金',value:data[i].OTHER}  
						      ];
					}
				}
			}
			$("#Yj tbody").empty().append(str);
			showYj();
		}
	});
}
//显示佣金柱状图

function showYj(){
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	var myChart = ec.init(document.getElementById('yjfb'));
	        	var option = {
	        		    title : {
	        		        text: '佣金分布-'+$("#prevMonth").val(),
	        		        x:'center',
	        		        textStyle:{
	        					fontSize:12,
	        					fontWeight: 'bolder',
	        					color:'#6c6b6b'
	        				}
	        		    },
	        		    tooltip : {
	        		        trigger: ''
	        		    },
	        		    color:['#40e0d0','#ff7f50'],
	        		    calculable : true,
	        		    xAxis : [
	        		        {
	        		            type : 'category',
	        		            axisLabel: {interval:0 },
	        		            boundaryGap : true,
	        		            data : yjx
	        		        }
	        		    ],
	        		    yAxis : [
	        		        {
	        		            type : 'value',
	        		            axisLabel : {
	        		                formatter: '{value}'
	        		            }
	        		        }
	        		    ],
	        		    series : [
	        		        {
	        		            name:'',
	        		            type:'bar',
	        		            data:yjy,
	        		            itemStyle: {
	        		            	barBorderRadius:[10,10,0,0],
	        		            	label:{
	        		            		show:true,
	        		            		position:'outer'
	        		            	},
	        		                normal: {
	        		                    borderRadius: 10,
	        		                    /*color : (function (){
	        		                        var zrColor = require('zrender/tool/color');
	        		                        return zrColor.getLinearGradient(
	        		                            0, 0, 1000, 0,
	        		                            [[0, 'rgba(222,66,23,0.8)'],[1, 'rgba(200,43,166,0.8)']]
	        		                        )
	        		                    })()*/
	        		                    color:function(params) {
	        		                    	var colorList = ['#f0e229','#d971d4','#88d0fc','#31cc31','#d67a7d',
	        		                    	                 '#ff8052','#00CCCC','#CC0033','#00AA00','#880088',
	        		                    	                 '#FF9966','#6633CC','#339966','#FF9933','#FF66FF',
	        		                    	                 '#3366FF','#FF6666'
	        		                    	                 ];
	        		                    	return colorList[params.dataIndex];
	        		                    }
	        		                }
	        		            },
	        		            markLine : {
	        		                data : [
	        		                    {type : 'average', name: '平均值'}
	        		                ]
	        		            }
	        		        }
	        		    ]
	        		};
	        		                    
	        	myChart.setOption(option);
	        }
	);
	
	require(
	        [
	            'echarts',
	            'echarts/chart/scatter',
	            'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
	        ],
	        function(ec) {
	        	var myChart2 = ec.init(document.getElementById('yjzb'));
	        	var option2 = {
	        		      title : {
	        		          text: '佣金占比-'+$("#prevMonth").val(),
	        		          x:'center',
	        		          textStyle:{
	        						fontSize:12,
	        						fontWeight: 'bolder',
	        						color:'#6c6b6b'
	        				  }
	        		      },
	        		      calculable : true,
	        		      tooltip : {
	        		          trigger: 'item'
	        		      },
	        		     // color:['red', 'green','blueviolet','yellow','blue','black'],
	        		      legend: {
	        		          orient : 'vertical',
	        		          x : 'left',
	        		          data:['2G佣金','3G佣金','固网佣金','融合佣金','渠道补贴佣金','其他佣金']
	        		      },
	        		      series : [
	        		          {
	        		              name:'佣金占比',
	        		              type:'pie',
	        		              radius : '55%',
	        		              minAngle:10,
	        		              startAngle:-90,
	        		              center: ['50%', '50%'],
	        		              itemStyle: {
		        		                normal: {
		        		                    borderRadius: 10,
		        		                    color : function(params){
		        		                    	var colorList = [
		        		                    	                 '#f0e229','#d971d4','#88d0fc','#31cc31','#d67a7d',
		        		                    	                 '#ff8052'
		        		                    	                 ];
		        		                    	return colorList[params.dataIndex];
		        		                    }
		        		                }
		        		            },
	        		              data:yjzb
	        		          }
	        		      ]
	        		  };
	        		  myChart2.setOption(option2);
	        }
	);
}
//显示实时发展
function searchRealTimeDev() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_searchRealTimeDev.action",
		type:'POST',
		async:true,
		dataType:'json',
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='5' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr>";
					str+="<td>"+data[i].GROUPNAME+"</td>";
					str+="<td>"+data[i].DEV_G2+"</td>";
					str+="<td>"+data[i].DEV_G3+"</td>";
					str+="<td>"+data[i].DEV_WIFI+"</td>";
					str+="<td>"+data[i].DEV_ALL+"</td>";
					str+= "</tr>";
				}
			}
			$("#ssfzTable tbody").empty().append(str);
		}
	});
}

var status="'10'";
var status1="'2G'";

var firstClick=true;
function showChanlMap() {
	//
	$(".arrow-up-map,.arrow-down-map").parent().click(function(){
		if($(this).find(".arrow-up-map").length){
			$(this).find(".arrow-up-map").addClass("arrow-down-map").removeClass("arrow-up-map");
			$(this).next().slideUp();
		}else{
			$(this).find(".arrow-down-map").addClass("arrow-up-map").removeClass("arrow-down-map");
			$(this).next().slideDown();
		}
	}).css({cursor:'pointer'});
	
	$("#qdtt").click(function(event){
		$("#jzfb,#jzfbFrame").hide();
		$("#qdfb,#qdfbFrame").show();
		$(this).css({backgroundColor:'rgba(129, 208, 177, 0.3)'});
		$("#jztt").css({backgroundColor:''});
		isLoad=false;
		setTimeout(function(){
			map.centerAndZoom(new BMap.Point(101, 24.709), 7);
		},500);
		if(firstClick){
			firstClick=false;
		}else{
			$(this).find(".arrow-down-map").addClass("arrow-up-map").removeClass("arrow-down-map");
			$(this).parent().next().slideDown();
		}
		event.stopPropagation();
	});
	$("#jztt").click(function(event){
		$("#qdfb,#qdfbFrame").hide();
		$("#jzfb,#jzfbFrame").show();
		$(this).css({backgroundColor:'rgba(129, 208, 177, 0.3)'});
		$("#qdtt").css({backgroundColor:''});
		isLoad1=false;
		setTimeout(function(){
			map1.centerAndZoom(new BMap.Point(101, 24.709), 7);
		},500);
		$(this).find(".arrow-down-map").addClass("arrow-up-map").removeClass("arrow-down-map");
		$(this).parent().next().slideDown();
		event.stopPropagation();
	});
	//
	var zsIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsRedIcon = new BMap.Icon($("#ctx").val()+"/portal/index/images/location_red16.png", new BMap.Size(16,
			16), {
		offset : new BMap.Size(8, 8),
		imageOffset : new BMap.Size(0, 0)
	});
	var zsIcon1 = new BMap.Icon($("#ctx").val()+"/portal/index/images/m0.png", new BMap.Size(53,
			52), {
		offset : new BMap.Size(26, 26),
		imageOffset : new BMap.Size(0, 0)
	});
	var map = new BMap.Map("qdfb");
	map.disableScrollWheelZoom();
	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map.addControl(top_left_control);        
	map.addControl(top_left_navigation);   
	map.centerAndZoom(new BMap.Point(101, 24.709), 7);
	map.enableScrollWheelZoom();
	//////////////////////////////////
	var map1 = new BMap.Map("jzfb");
	map1.disableScrollWheelZoom();
	var top_left_control1 = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation1 = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	map1.addControl(top_left_control1);        
	map1.addControl(top_left_navigation1);   
	//处理悬浮层
	
	map1.centerAndZoom(new BMap.Point(101, 24.709), 7);
	map1.enableScrollWheelZoom();
	//////////////////////////////////
	/*var regions = [ "昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "普洱市", "临沧市",
			"文山壮族苗族自治州 ", "红河哈尼族彝族自治州", "西双版纳", "楚雄彝族自治州", "大理白族自治州", "德宏",
			"怒江傈僳族自治州", "迪庆藏族自治州" ];
	for (var i = 0; i < regions.length; i++) {
		bdary.get(regions[i], function(rs) {
			var count = rs.boundaries.length;
			for (var i = 0; i < count; i++) {
				var ply = new BMap.Polygon(rs.boundaries[i], {
					strokeWeight : 2,
					strokeColor : "#bfff00",
					fillOpacity : 0.3,
					fillColor : "#ba3f90"
				}); // 建立多边形覆盖物
				map.addOverlay(ply);
			}
		});
	}*/
	
	setInterval(function() {$(".anchorBL").hide();}, 50);
	var isLoad=false;
	var isLoad1=false;
	//
	
	
	$("#qdfbFrame").find("INPUT[type='checkbox']").click(function(){
		status="";
		$("#qdfbFrame").find("INPUT[type='checkbox']:checked").each(function(){
			if(status!=""){
				status+=",";
			}
			status+="'"+$(this).val()+"'";
		})
		if(status==""){
			status="''";
		}
		isLoad=false;
		map.centerAndZoom(new BMap.Point(101, 24.709), 7);
	});
	$("#jzfbFrame").find("INPUT[type='checkbox']").click(function(){
		status1="";
		$("#jzfbFrame").find("INPUT[type='checkbox']:checked").each(function(){
			if(status1!=""){
				status1+=",";
			}
			status1+="'"+$(this).val()+"'";
		})
		if(status1==""){
			status1="''";
		}
		isLoad1=false;
		map1.centerAndZoom(new BMap.Point(101, 24.709), 7);
	});
	
	
	// 地图加载完成时重新获取可视范围内的点
	map.addEventListener('tilesloaded',function(){
		var bs = map.getBounds(); // 获取可视区域
		var bssw = bs.getSouthWest(); // 可视区域左下角
		var bsne = bs.getNorthEast(); // 可视区域右上角
		var log0 = bssw.lng<bsne.lng?bssw.lng:bsne.lng;
		var log1 = bssw.lng>bsne.lng?bssw.lng:bsne.lng;
		var lat0 = bssw.lat<bsne.lat?bssw.lat:bsne.lat;
		var lat1 = bssw.lat>bsne.lat?bssw.lat:bsne.lat;
		var  dlat=lat1-lat0;

		if(dlat>2&&!isLoad){
			map.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listChanlPositions.action",
				data:{
					flag:0//显示所有地市
					,status:status
				},
				success : function(data) {
					isLoad=true;
					if (data && data.length > 0) {
						for(var i=0;i<data.length;i++){
							///////////////
							var pt =new BMap.Point(data[i].LOG_NO, data[i].LAT_NO);
							var marker = new BMap.Marker(pt,{icon:zsIcon1});
							(function(){
						        var group = data[i].GROUP_ID_1;
						        marker.addEventListener('click',function(e){
						        	var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									map.centerAndZoom(new BMap.Point(lon, lat), 10);
						        	
						        	$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_listChanlPositions.action",
										data:{
											flag:1,//点击地市显示所有营服中心
											group:group
											,status:status
										},
										success : function(d) {
											if(d&&d.length){
												isLoad=false;
												map.clearOverlays();
												for(var i=0;i<d.length;i++){
													var pt =new BMap.Point(d[i].LOG_NO, d[i].LAT_NO);
													var marker = new BMap.Marker(pt,{icon:zsIcon1});
													marker.addEventListener('click',function(e){
														var p=e.target;
														var lon=p.getPosition().lng;
														var lat=p.getPosition().lat;
														map.centerAndZoom(new BMap.Point(lon, lat), 12);
													});
													
													
													map.addOverlay(marker);
													
													var opts = {
														position : pt,   // 指定文本标注所在的地理位置
														offset   : new BMap.Size(-11, -10)    //设置文本偏移量
													}
													var label = new BMap.Label("&nbsp;"+d[i].NUM, opts);  // 创建文本标注对象
													label.setStyle({
														fontSize : "10px",
														border:'none',
														background:'transparent',
														textAlign:'center',
														height : "20px",
														lineHeight : "20px",
														fontFamily:"微软雅黑"
													});
													map.addOverlay(label); 
												}
											}
										}
						        	});
								}); 
						    })();
							map.addOverlay(marker);
							/////////////
							var opts = {
							  position : pt,   // 指定文本标注所在的地理位置
							  offset   : new BMap.Size(-11, -10)    //设置文本偏移量
							}
							var label = new BMap.Label(data[i].NUM, opts);  // 创建文本标注对象
								label.setStyle({
									 fontSize : "10px",
									 border:'none',
									 background:'transparent',
									 textAlign:'center',
									 height : "20px",
									 lineHeight : "20px",
									 fontFamily:"微软雅黑"
								 });
							map.addOverlay(label); 
						}
					}
				}
			});
		}else if(dlat<=0.5){
			isLoad=false;
			map.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listChanlPositions.action",
				data:{
					lat0:lat0,
					lat1:lat1,
					log0:log0,
					log1:log1,
					flag:2
					,status:status
				},
				success : function(data) {
					if (data && data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i] && data[i]['LOG_NO'] && data[i]['LAT_NO']) {
								var pt = new BMap.Point(data[i]['LOG_NO'],
										data[i]['LAT_NO']);
								var tzsIcon=zsIcon;
								if(data[i]["HASDEV"]){
									tzsIcon=zsIcon;
								}else{
									tzsIcon=zsRedIcon;
								}
								var marker = new BMap.Marker(pt,{icon:tzsIcon,title:data[i]['GROUP_ID_4_NAME']});
								marker.addEventListener('click',function(e){
									var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									
									$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_getChanlPosition.action",
										data:{
											lat:lat,
											log:lon
										},
										success : function(chanl) {
											if(!chanl||chanl.length<=0) return;
											chanl=chanl[0];
											var h="<table>";
											h+="<tr>";
											h+="  <td style='width:60px;'>名称：</td><td>"+chanl["GROUP_ID_4_NAME"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>编码：</td><td>"+chanl["HQ_CHAN_CODE"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>地址：</td><td>"+chanl["CHNL_ADDR"]+"</td>"
											h+="</tr>";
											h+="</table>";
										
											var point = new BMap.Point(lon,lat);
											var opts = {
													title : "渠道信息" , // 信息窗口标题
													enableMessage:false//设置允许信息窗发送短息
											};
											var infoWindow = new BMap.InfoWindow(h,opts);  // 创建信息窗口对象 
											map.openInfoWindow(infoWindow,point); //开启信息窗口
											/*$('.chanlImg').onload = function (){
												infoWindow.redraw();
											}*/
										}
									});
								});
								map.addOverlay(marker);
							}
						}
					}
				}
			});
		}
	});
	
	//////////////////////////////////////
	// 地图加载完成时重新获取可视范围内的点
	map1.addEventListener('tilesloaded',function(){
		var bs = map1.getBounds(); // 获取可视区域
		var bssw = bs.getSouthWest(); // 可视区域左下角
		var bsne = bs.getNorthEast(); // 可视区域右上角
		var log0 = bssw.lng<bsne.lng?bssw.lng:bsne.lng;
		var log1 = bssw.lng>bsne.lng?bssw.lng:bsne.lng;
		var lat0 = bssw.lat<bsne.lat?bssw.lat:bsne.lat;
		var lat1 = bssw.lat>bsne.lat?bssw.lat:bsne.lat;
		var  dlat=lat1-lat0;

		if(dlat>2&&!isLoad1){
			map1.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listJZPositions.action",
				data:{
					flag:0//显示所有地市
					,status:status1
				},
				success : function(data) {
					isLoad1=true;
					if (data && data.length > 0) {
						for(var i=0;i<data.length;i++){
							///////////////
							var pt =new BMap.Point(data[i].LOG_NO, data[i].LAT_NO);
							var marker = new BMap.Marker(pt,{icon:zsIcon1});
							(function(){
						        var group = data[i].GROUP_ID_1;
						        marker.addEventListener('click',function(e){
						        	var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									map1.centerAndZoom(new BMap.Point(lon, lat), 10);
						        	
						        	$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_listJZPositions.action",
										data:{
											flag:1,//点击地市显示所有营服中心
											group:group
											,status:status1
										},
										success : function(d) {
											if(d&&d.length){
												isLoad1=false;
												map1.clearOverlays();
												for(var i=0;i<d.length;i++){
													var pt =new BMap.Point(d[i].LOG_NO, d[i].LAT_NO);
													var marker = new BMap.Marker(pt,{icon:zsIcon1});
													marker.addEventListener('click',function(e){
														var p=e.target;
														var lon=p.getPosition().lng;
														var lat=p.getPosition().lat;
														map1.centerAndZoom(new BMap.Point(lon, lat), 12);
													});
													
													
													map1.addOverlay(marker);
													
													var opts = {
														position : pt,   // 指定文本标注所在的地理位置
														offset   : new BMap.Size(-11, -10)    //设置文本偏移量
													}
													var label = new BMap.Label("&nbsp;"+d[i].NUM, opts);  // 创建文本标注对象
													label.setStyle({
														fontSize : "10px",
														border:'none',
														background:'transparent',
														textAlign:'center',
														height : "20px",
														lineHeight : "20px",
														fontFamily:"微软雅黑"
													});
													map1.addOverlay(label); 
												}
											}
										}
						        	});
								}); 
						    })();
							map1.addOverlay(marker);
							/////////////
							var opts = {
							  position : pt,   // 指定文本标注所在的地理位置
							  offset   : new BMap.Size(-11, -10)    //设置文本偏移量
							}
							var label = new BMap.Label(data[i].NUM, opts);  // 创建文本标注对象
								label.setStyle({
									 fontSize : "10px",
									 border:'none',
									 background:'transparent',
									 textAlign:'center',
									 height : "20px",
									 lineHeight : "20px",
									 fontFamily:"微软雅黑"
								 });
							map1.addOverlay(label); 
						}
					}
				}
			});
		}else if(dlat<=0.5){
			isLoad1=false;
			map1.clearOverlays();
			$.ajax({
				type : "POST",
				dataType : 'json',
				async : true,
				cache : false,
				url : $("#ctx").val()+"/index/index_listJZPositions.action",
				data:{
					lat0:lat0,
					lat1:lat1,
					log0:log0,
					log1:log1,
					flag:2
					,status:status1
				},
				success : function(data) {
					if (data && data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (data[i] && data[i]['LOG_NO'] && data[i]['LAT_NO']) {
								var pt = new BMap.Point(data[i]['LOG_NO'],
										data[i]['LAT_NO']);
								var tzsIcon=zsIcon;
								if($.trim(data[i]["STATION_TYPE_CODE"])=='2G'){
									tzsIcon=zsIcon;
								}else{
									tzsIcon=zsRedIcon;
								}
								var marker = new BMap.Marker(pt,{icon:tzsIcon,title:data[i]['STATION_NAME']});
								marker.addEventListener('click',function(e){
									var p=e.target;
									var lon=p.getPosition().lng;
									var lat=p.getPosition().lat;
									
									$.ajax({
										type : "POST",
										dataType : 'json',
										async : true,
										cache : false,
										url : $("#ctx").val()+"/index/index_getJZPosition.action",
										data:{
											lat:lat,
											log:lon
										},
										success : function(chanl) {
											if(!chanl||chanl.length<=0) return;
											chanl=chanl[0];
											var h="<table>";
											h+="<tr>";
											h+="  <td style='width:60px;'>名称：</td><td>"+chanl["STATION_NAME"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>编码：</td><td>"+chanl["STATION_SERIAL"]+"</td>"
											h+="</tr>";
											h+="<tr>";
											h+="  <td>类型：</td><td>"+chanl["STATION_TYPE"]+"</td>"
											h+="</tr>";
											h+="</table>";
										
											var point = new BMap.Point(lon,lat);
											var opts = {
													title : "基站信息" , // 信息窗口标题
													enableMessage:false//设置允许信息窗发送短息
											};
											var infoWindow = new BMap.InfoWindow(h,opts);  // 创建信息窗口对象 
											map1.openInfoWindow(infoWindow,point); //开启信息窗口
											/*$('.chanlImg').onload = function (){
												infoWindow.redraw();
											}*/
										}
									});
								});
								map1.addOverlay(marker);
							}
						}
					}
				}
			});
		}
	});
	$("#qdtt").trigger("click");
}
//销售排名
function showXsph() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listXsph.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='11' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr USER_NAME='"+isNull(data[i].USER_NAME)+"' HR_NO='"+isNull(data[i].HR_NO)+"'>";
					str+="<td>"+isNull(data[i].AREA_NAME)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_NAME)+"</td>";
					str+="<td>"+isNull(data[i].USER_NAME)+"</td>";
					str+="<td>"+isNull(data[i].G2SLL)+"</td>";
					str+="<td>"+isNull(data[i].G3SLL)+"</td>";
					str+="<td>"+isNull(data[i].G4SLL)+"</td>";
					str+="<td>"+isNull(data[i].SWSLL)+"</td>";
					str+="<td>"+isNull(data[i].TOTAL_SLL)+"</td>";
					str+="<td>"+isNull(data[i].RANK)+"</td>";
					str+="<td>"+isNull(data[i].GROUP_RANK)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_RANK)+"</td>";
					str+= "</tr>";
				}
			}
			$("#xsphTable tbody").empty().append(str);
			
			//
			$("#xsphTable tbody").find("TR").each(function(){
				var $tr=$(this);
				var $2g=$tr.find("TD:eq(3)");
				var $3g=$tr.find("TD:eq(4)");
				var $4g=$tr.find("TD:eq(5)");
				var $swk=$tr.find("TD:eq(6)");
				
				if(!$2g.text()||$.trim($2g.text())==''||$.trim($2g.text())=='0'){
					
				}else{
					$2g.html("<a href='#' >"+$2g.text()+"</a>");
					$2g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='2GDK','2GHY'";
						//window.parent.openWindow(userName+"-2G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-2G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$3g.text()||$.trim($3g.text())==''||$.trim($3g.text())=='0'){
					
				}else{
					$3g.html("<a href='#' >"+$3g.text()+"</a>");
					$3g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='3GDK','3GHY'";
						//window.parent.openWindow(userName+"-3G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-3G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$4g.text()||$.trim($4g.text())==''||$.trim($4g.text())=='0'){
					
				}else{
					$4g.html("<a href='#' >"+$4g.text()+"</a>");
					$4g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='4GDK','4GHY'";
						//window.parent.openWindow(userName+"-4G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-4G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				
				if(!$swk.text()||$.trim($swk.text())==''||$.trim($swk.text())=='0'){
					
				}else{
					$swk.html("<a href='#' >"+$swk.text()+"</a>");
					$swk.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list_swk.jsp?hrNo="+hrNo+"&time="+time+"&itemCode=";
						//window.parent.openWindow(userName+"-上网卡发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-上网卡发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
			});
		}
	});
}
//积分排名
function showJfph() {
	$.ajax({
		url:$("#ctx").val()+"/index/index_listJfph.action",
		type:'POST',
		dataType:'json',
		async:true,
		success:function(data){
			var str = "";
			if(data==null || data.length==0) {
				str+= "<tr>";
				str+= "<td colspan='8' align='center'>暂无数据</td>";
				str+= "</tr>";
			} else {
				for(var i=0; i<data.length; i++) {
					str+= "<tr USER_NAME='"+isNull(data[i].USER_NAME)+"' HR_NO='"+isNull(data[i].HR_NO)+"'>";
					str+="<td>"+isNull(data[i].AREA_NAME)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_NAME)+"</td>";
					str+="<td>"+isNull(data[i].USER_NAME)+"</td>";
					str+="<td>"+isNull(data[i].ALL_JF)+"</td>";
					str+="<td>"+isNull(data[i].ALL_JF_MONEY)+"</td>";
					str+="<td>"+isNull(data[i].PRO_RANK)+"</td>";
					str+="<td>"+isNull(data[i].GROUP_RANK)+"</td>";
					str+="<td>"+isNull(data[i].UNIT_RANK)+"</td>";
					str+= "</tr>";
				}
			}
			$("#jfphTable tbody").empty().append(str);
			
			//
			/*$("#xsphTable tbody").find("TR").each(function(){
				var $tr=$(this);
				var $2g=$tr.find("TD:eq(3)");
				var $3g=$tr.find("TD:eq(4)");
				var $4g=$tr.find("TD:eq(5)");
				var $swk=$tr.find("TD:eq(6)");
				
				if(!$2g.text()||$.trim($2g.text())==''||$.trim($2g.text())=='0'){
					
				}else{
					$2g.html("<a href='#' >"+$2g.text()+"</a>");
					$2g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='2GDK','2GHY'";
						//window.parent.openWindow(userName+"-2G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-2G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$3g.text()||$.trim($3g.text())==''||$.trim($3g.text())=='0'){
					
				}else{
					$3g.html("<a href='#' >"+$3g.text()+"</a>");
					$3g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='3GDK','3GHY'";
						//window.parent.openWindow(userName+"-3G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-3G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				if(!$4g.text()||$.trim($4g.text())==''||$.trim($4g.text())=='0'){
					
				}else{
					$4g.html("<a href='#' >"+$4g.text()+"</a>");
					$4g.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='4GDK','4GHY'";
						//window.parent.openWindow(userName+"-4G发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-4G发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
				
				if(!$swk.text()||$.trim($swk.text())==''||$.trim($swk.text())=='0'){
					
				}else{
					$swk.html("<a href='#' >"+$swk.text()+"</a>");
					$swk.click(function(){
						var hrNo=$tr.attr("HR_NO");
						var userName=$tr.attr("USER_NAME");
						var time=$("#time").val();
						var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list_swk.jsp?hrNo="+hrNo+"&time="+time+"&itemCode=";
						//window.parent.openWindow(userName+"-上网卡发展详细",null,url);
						art.dialog.open(url,{
							id:'xsphDetailDialog',
							title:userName+"-上网卡发展详细",
							width:'530px',
							height:'320px',
							lock:true,
							resize:false
						});
					});
					
				}
			});*/
		}
	});
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
