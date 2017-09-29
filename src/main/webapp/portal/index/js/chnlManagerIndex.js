$(function(){
	  // 路径配置
	var myMenu = new SDMenu("my_menu");
	myMenu.init();
	yearTaskCompleteRate();
	timeTaskCompleteRate();
	initDevAndIncome();
	initHqWarn();
	jfRank(0);
	ruleImages();
	marketUser();
	devNumber()
	//最新公告
	listBulls();
});

function ruleImages(){
	$("#chnlYjRule").hover(function(){
        $("#chnlYjImage").show();
    }, function () {
        $("#chnlYjImage").hide();
    });
	$("#rules").hover(function(){
        $("#ruleImage").show();
    }, function () {
        $("#ruleImage").hide();
    });
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
}
var year_per="0";
var hour_per="0";
function getTaskRateData(){
	$.ajax({
        url: $("#ctx").val()+'/index/index_getTaskRateData.action',
        type: 'post',
        async:false,
        dataType: 'json',
        success: function (data) {
        	if(data){
        		year_per=data.YEAR_PER;
            	hour_per=data.HOUR_PER;
            	year_per=year_per.replace(/%/g, "");
            	hour_per=hour_per.replace(/%/g, "");
            	var h="<tr><td>"+data.SR_MOB_NUM+"</td><td>"+data.SR_GW_NUM+"</td><td>"+data.DEV_MOB_NUM+"</td><td>" 
            			+data.DEV_KD_NUM+"</td><td>"+data.DEV_ZZX_NUM+"</td><td>"+data.MARKET_COST+"</td><td>"+data.ALL_COST+"</td></tr>";
            	$("#contentTop tbody").empty().append($(h));
        	}else{ 
        		    var h="<tr colspan='7'>暂无数据</tr>";
                	$("#contentTop tbody").empty().append($(h));
        	}
        }
    });
}

//年度收入完成率
function yearTaskCompleteRate() {
	    getTaskRateData();
			//图表显示提示信息
		var myChart = echarts.init(document.getElementById('year_complete_chart'));
            // 指定图表的配置项和数据
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
			title: {
	                text: '年度收入完成率', //标题文本内容,
					x:'center',
					//backgroundColor: '#ff0000',            //背景
					textStyle: {
						fontWeight: 'normal',              //标题颜色
						color: '#ff0000'
					}
	        },
            toolbox: { //可视化的工具箱
                show: false,
                feature: {
                    restore: { //重置
                        show: false
                    },
                    saveAsImage: {//保存图片
                        show: false
                    }
                }
            },
            tooltip: { //弹窗组件
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [{
                name: '业务指标',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                max:100,
                data: [{value: year_per, name: ''}],
				axisLine: {            // 坐标轴线  
                     lineStyle: {       // 属性lineStyle控制线条样式  
                                   color: [[0.2, '#c23531'], [0.8, '#63869e'], [1, '#91c7ae']]
                                }  
                          },   
             }]
            };
			myChart.hideLoading();
			myChart.setOption(option);
}

//日发展量趋势图表
function timeTaskCompleteRate() {
			//图表显示提示信息
		var myChart = echarts.init(document.getElementById('hour_complete_chart'));
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
		// 指定图表的配置项和数据
        var option = { 
        	title: {
	                text: '时序收入完成率', //标题文本内容,
					x:'center',
					//backgroundColor: '#ff0000',            //背景
					textStyle: {
						fontWeight: 'normal',              //标题颜色
						color: '#ff0000'
					}
	        },
            toolbox: { //可视化的工具箱
                show: false,
                feature: {
                    restore: { //重置
                        show: false
                    },
                    saveAsImage: {//保存图片
                        show: false
                    }
                }
            },
            tooltip: { //弹窗组件
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [{
                name: '业务指标',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                max:100,
                data: [{value: hour_per, name: ''}],
				axisLine: {            // 坐标轴线  
                     lineStyle: {       // 属性lineStyle控制线条样式  
                                   color: [[0.2, '#c23531'], [0.8, '#63869e'], [1, '#91c7ae']]
                                }  
                     },   
                }]
            };
			myChart.hideLoading();
			myChart.setOption(option);
}

function initDevAndIncome(){
	var hrId=$("#hrId").val();
	var sql="SELECT * FROM PMRT.VIEW_MRT_CODE_WARN WHERE HR_ID='"+hrId+"'";
	var data=query(sql);
	var str = "";
	if(data==null || data.length==0) {
		str+= "<tr>";
		str+= "<td colspan='4' align='center'>暂无数据</td>";
		str+= "</tr>";
	} else {
		for(var i=0; i<data.length; i++) {
			str+= "<tr>";
			str+="<td>"+data[i].HQ_CHAN_CODE+"</td>";
			str+="<td>"+data[i].GROUP_ID_4_NAME+"</td>";
			str+="<td>"+data[i].DEV_ALL_NUM+"</td>";
			str+="<td>"+data[i].SR_ALL_NUM+"</td>";
			str+= "</tr>";
		}
	}
	$("#income_dev tbody").empty().append(str);
}

function initHqWarn(){
	var hrId=$("#hrId").val();
	var sql="SELECT WARN_STATE,GROUP_ID_4_NAME,HQ_CHAN_CODE,CREATE_MONTH,SR_ALL_NUM,MARKET_COST,DEV_ALL_NUM,SR_COST_YEAR,SR_ALL_NUM_LIFE,MARKET_COST_LIFE,SR_COST_LIFE FROM PMRT.VIEW_MRT_CODE_WARN WHERE WARN_STATE IS NOT NULL AND HR_ID='"+hrId+"'";
	var data=query(sql);
	var str = "";
	if(data==null || data.length==0) {
		str+= "<tr>";
		str+= "<td colspan='11' align='center'>暂无数据</td>";
		str+= "</tr>";
	} else {
		for(var i=0; i<data.length; i++) {
			str+= "<tr>";
			var warnState=data[i].WARN_STATE;
			if(warnState=="正常"){
				str+="<td style='background-color:green;color:black;'>"+data[i].WARN_STATE+"</td>";
			}else if(warnState=="预警"){
				str+="<td style='background-color:yellow;'>"+data[i].WARN_STATE+"</td>";
			}else{
				str+="<td style='background-color:red;'>"+data[i].WARN_STATE+"</td>";
			}
			str+="<td>"+data[i].GROUP_ID_4_NAME+"</td>";
			str+="<td>"+data[i].HQ_CHAN_CODE+"</td>";
			str+="<td>"+data[i].CREATE_MONTH+"</td>";
			str+="<td>"+data[i].SR_ALL_NUM+"</td>";
			str+="<td>"+data[i].MARKET_COST+"</td>";
			str+="<td>"+data[i].DEV_ALL_NUM+"</td>";
			str+="<td>"+data[i].SR_COST_YEAR+"</td>";
			str+="<td>"+data[i].SR_ALL_NUM_LIFE+"</td>";
			str+="<td>"+data[i].MARKET_COST_LIFE+"</td>";
			str+="<td>"+data[i].SR_COST_LIFE+"</td>";
			str+= "</tr>";
		}
	}
	$("#chnl_yj tbody").empty().append(str);
}

function marketUser(){
	var hrId=$("#hrId").val();
	var sql="SELECT * FROM PMRT.VIEW_MRT_HQ_COST_PRE WHERE HR_ID='"+hrId+"' ORDER BY LEV";
	var data=query(sql);
	var str = "";
	if(data==null || data.length==0) {
		str+= "<tr>";
		str+= "<td colspan='4' align='center'>暂无数据</td>";
		str+= "</tr>";
	} else {
		for(var i=0; i<data.length; i++) {
			str+= "<tr>";
			str+="<td>"+data[i].HR_ID+"</td>";
			str+="<td>"+data[i].ITEM_TYPE+"</td>";
			str+="<td>"+data[i].TYPE_VALUE+"</td>";
			str+="<td>"+data[i].LEV+"</td>";
			str+= "</tr>";
		}
	}
	$("#market_user tbody").empty().append(str);
}

function devNumber(){
	var hrId=$("#hrId").val();
	var sql="SELECT HR_ID,HR_NAME, HQ_CHAN_CODE,HQ_CHAN_NAME,                                                      "+
	"       PMRT.LINK_RATIO_ZB(NVL(SUM(NVL(FIRST_PAY_ALL,0)),0),NVL(SUM(NVL(ALL_DEV_SUM, 0)),0), 2) FIRST_PAY_ALL, "+
	"       PMRT.LINK_RATIO_ZB(NVL(SUM(NVL(SECOND_PAY_ALL,0)),0),NVL(SUM(NVL(ALL_DEV_SUM, 0)),0), 2) SECOND_PAY_ALL"+
	" FROM PMRT.TB_MRT_HQ_DEV_YEAR_LJ_DETAIL WHERE HR_ID='"+hrId+"'                                                 "+
	"GROUP BY HR_ID,HR_NAME, HQ_CHAN_CODE,HQ_CHAN_NAME                                                             ";
	var data=query(sql);
	var str = "";
	if(data==null || data.length==0) {
		str+= "<tr>";
		str+= "<td colspan='4' align='center'>暂无数据</td>";
		str+= "</tr>";
	} else {
		for(var i=0; i<data.length; i++) {
			str+= "<tr>";
			str+="<td>"+data[i].HQ_CHAN_CODE+"</td>";
			str+="<td>"+data[i].HQ_CHAN_NAME+"</td>";
			str+="<td>"+data[i].FIRST_PAY_ALL+"</td>";
			str+="<td>"+data[i].SECOND_PAY_ALL+"</td>";
			str+= "</tr>";
		}
	}
	$("#dev_number tbody").empty().append(str);
}

function jfRank(pageNumber){
	pageNumber++;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+'/index/index_getJfRank.action',
		data:{
		   "page":pageNumber,
           "rows":pageSize
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
            var content="";
            	$.each(pages.rows,function(i,n){
    				content+="<tr>"
    				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
    				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
    				+"<td>"+isNull(n['UNIT_TYPE'])+"</td>"
    				+"<td>"+isNull(n['HR_ID'])+"</td>"
    				+"<td>"+isNull(n['NAME'])+"</td>"
    				+"<td>"+isNull(n['JOB'])+"</td>"
    				+"<td>"+isNull(n['SR'])+"</td>"
    				+"<td>"+isNull(n['ALL_JF'])+"</td>"
    				+"<td>"+isNull(n['GRADE'])+"</td>"
    				+"<td>"+isNull(n['RANK'])+"</td>"
    				content+="</tr>";
    			});
			if(content != "") {
				$("#jfRank tbody").empty().append($(content));
			}else {
				$("#jfRank tbody").empty().append($("<tr><td colspan='10'>暂无数据</td></tr>"));
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

var pageSize = 10;
var pageNumber=1;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : jfRank,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
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
