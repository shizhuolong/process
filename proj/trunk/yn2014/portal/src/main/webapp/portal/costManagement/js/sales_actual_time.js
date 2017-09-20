	$(function() {
	//主-数据表显示需要时间为年月日时
	$("#dealDate").val($("#date").val());
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var orgCode  = $("#code").val();
	var orgName  = $("#orgName").val()
	dataShow();
	
	//echarts图表显示需要时间为年月日
	var dayStr=dealDate.substr(0,8);
	showDataChart(dayStr,orgLevel,orgCode,orgName);
	$("#searchBtn").click(function(){
		dealDate = $("#dealDate").val();
		orgLevel = $("#orgLevel").val();
		orgCode  = $("#code").val();
		orgName  = $("#orgName").val()
		$("#dataGrodDiv").empty("").append("<table id=\"dataGrid\"></table>");
		dataShow();
		dayStr=dealDate.substr(0,8);
		showDataChart(dayStr,orgLevel,orgCode,orgName);
	});
});

/**
 * 数据展示
 */
function dataShow(){
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var hrId = $("#hrId").val();
	var orgCode  = $("#code").val();
	var orgName  = $("#orgName").val();
	$('#dataGrid').treegrid({
	    url:$("#ctx").val()+"/channelManagement/sales_listSales.action",
	    idField:'GROUPID',
	    treeField:'GROUPNAME',
	    method : 'post',
	    cache: false,
	    loadMsg : '正在加载数据',
        onLoadError : function() {
            alertDialog('加载失败！');
        },
	    queryParams : {
			"endDate":dealDate,
			"orgLevel":orgLevel,
			"orgCode" :orgCode,
			"hrId":hrId
        },
        frozenColumns:[[{field:'GROUPNAME',title:'组织架构',width:284,resizable:true}]],
	    columns:[[
			/*{field:'GROUPNAME',title:'组织架构'},*/
		 	{field:'DEV_2G',title:'2G',align:'right',width:60},
		 	{field:'DEV_3G',title:'3G',align:'right',width:60},
		 	{field:'DEV_WIFI',title:'上网卡',align:'right',width:60},
		 	{field:'DEV_4G',title:'4G',align:'right',width:60},
		 	{field:'DEV_KD',title:'宽带',align:'right',width:60},
		 	{field:'DEV_ALL',title:'合计',align:'right',width:60},
		 	{field:'ORGLEVEL',title:'层级',align:'right',hidden:'true'}
	    ]],
	    //展开节点前触发(重置请求参数)
	    onBeforeExpand:function(row){
	    	var nextCode  = row.GROUPID;
	    	var nextLevel = row.ORGLEVEL;
	    	$('#dataGrid').treegrid('options').queryParams={
	    		"endDate"  : dealDate,
				"nextLevel": nextLevel,
				"nextCode" : nextCode
	    	}
        },
        //展开节点时候触发(点击节点联动重新加载图表)
        onExpand:function(row){
        	var level = row.ORGLEVEL-1;
		    var code  = row.GROUPID;
		    var name  = row.GROUPNAME;
	    	//图表显示需要时间为年月日
	    	var dayStr= dealDate.substr(0,8);
	    	showDataChart(dayStr,level,code,name);
        	var devType="";
        	showDataDetail(code,name,dayStr,level,devType,dealDate);
        },
        //双击单元格触发(显示营服层级或者渠道级别的渠道明细)
        //当前时间，显示到小时(当选中某个小时的时候，明细展示当天选中小时以前的数据，即当天0点到选中日期之间的数据)
        onDblClickCell:function(ield,row){
        	var code   = row.GROUPID;
        	var name   = row.GROUPNAME;
	    	var dayStr = dealDate.substr(0,8);
        	var level  = row.ORGLEVEL-1;
        	var type   = ield;
        	var devType="";
        	if(type=="DEV_2G"){
        		devType="2G";
        	}else if(type=="DEV_3G"){
        		devType="3G";
        	}else if(type=="DEV_4G"){
        		devType="4G";
        	}else if(type=="DEV_WIFI"){
        		devType="上网卡";
        	}else if(type=="DEV_KD"){
        		devType="宽带";
        	}else{
        		devType="";
        	}
        	showDataDetail(code,name,dayStr,level,devType,dealDate);
        }
	});
}

/**
 * 查看渠道明细
 */
function showDataDetail(orgCode,orgName,dayStr,orgLevel,devType,dealDate){
	var titleStr ="("+orgName+")";
		if(devType){
			titleStr+="("+devType+")";
		}
		titleStr+="实时销量明细-"+dayStr;
	$("#chanlDataDeatilTable").datagrid({
		url:$("#ctx").val()+"/channelManagement/sales_listChanlSalesDetail.action",
		pagination:true,
		method : 'post',
		cache: false,
		width:'100%',
		title:titleStr,
		pageSize:5,
        pageNumber : 1 ,
        pageList : [5,10, 15, 20 ],
        //rownumbers : true,
        nowrap : true,
        striped : true,
        collapsible : true,
        loadMsg : '正在加载数据',
        toolbar: [{
			iconCls: 'icon-save',
			text:'导出明细',
			handler: function(){
				downsAll(orgCode,orgName,dayStr,orgLevel,devType,dealDate);
		}}],
	    queryParams : {
	    	//截止至某小时的时间
			"endDate"  : dealDate,
			"orgCode"  : orgCode,
			"orgLevel" : orgLevel,
			"devType"  : devType,
			//某天的时间
			"startDate": dayStr
        },
		columns:[[
		  		{field:'UNIT_NAME',title:'营服名称'},
		  		{field:'HQ_CHAN_CODE',title:'渠道编码'},
		  		{field:'GROUP_ID_4_NAME',title:'渠道名称',width:220},
		  		{field:'DEVELOPER',title:'bss发展编码'},
		  		{field:'FD_CHNL_CODE',title:'直销礼包编码',width:100},
		  		{field:'HR_ID',title:'HR编码',width:80},
		  		{field:'USERNAME',title:'直销人/渠道经理',width:100},
		  		{field:'SUBSCRIPTION_ID',title:'用户编码',width:130},
		  		{field:'SERVICE_NUM',title:'用户号码',width:97},
		  		{field:'WG_NET_TYPE',title:'网别',width:50},
		  		{field:'JOIN_DATE',title:'入网时间',width:100},
		  		{field:'PRODUCT_ID',title:'套餐编码',width:100},
		  		{field:'PRODUCT_NAME',title:'套餐名称',width:100},
		      ]]
	});
	/*$("#chanlDataDeatil").find(".datagrid-toolbar").find("A").css({
		'float':'right'
	});*/
}



/**
 * 实时销量明细图表
 */
function showDataChart(dealDate,orgLevel,orgCode,orgName){
	$("#chartDivTitle").html(orgName);
	var startDate = getDate(dealDate);
	var yearStr = dealDate.substr(0,4);
	var monStr  = dealDate.substr(4,2);
	var dayStr  = dealDate.substr(6,2);
	var contrastDate =yearStr+"年"+monStr+"月" +dayStr+"日";
	$("#chartDivDate").html(contrastDate);
	 // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('data_chart'));
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
				text:'实时销量(户)',
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
		url:$("#ctx").val()+"/channelManagement/sales_showDataChart.action",
		type:'POST',
		dataType:'json',
		async:true,
		data:{
			"endDate":dealDate,
			"orgLevel":orgLevel,
			"orgCode":orgCode,
			"startDate":startDate
		},
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
    myChart.setOption(option);

}


/**
 * 获取给定日期的前七天dealDate格式为20160101(即：年月日)
 */
function getDate(dealDate){
	//var dealDate ="20161001"
	var yearStr=dealDate.substr(0,4);
	var monStr=dealDate.substr(4,2);
	var dayStr=dealDate.substr(6);
	//创建给定的时间对象
	var date = new Date(yearStr,monStr,dayStr,0,0,0);
	var year = date.getFullYear();
	//给设置时间减去7天
	date.setDate(date.getDate() - 7); 
	var month = date.getMonth();
	if(month<=0){
		month= 12;
		year--;
	}
	var day = date.getDate();
	var contrastDate =year+""+(month<10?"0"+month:""+month)+"" + (day<10?"0"+day:""+day); 
	return contrastDate;
} 
  
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(orgCode,orgName,dealDate,orgLevel,devType,dealDate){
	dayStr=dealDate.substr(0,8);
	var sql = 	" SELECT SUBSTR(T.DEAL_DATE, 1, 8)  DEAL_DATE,  "+	//-账期
				"        T.GROUP_ID_1_NAME, 					"+	//--地市名称
				"        T.UNIT_NAME, 							"+	//--营服名称
				"        T.HQ_CHAN_CODE, 						"+	//--渠道编码
				"        T.GROUP_ID_4_NAME, 					"+	//--渠道名称
				"        T.DEVELOPER, 							"+	//--bss发展编码
				"        T.FD_CHNL_CODE, 						"+	//--直销礼包编码
				"        T.HR_ID, 								"+	//--HR编码
				"        T.USERNAME, 							"+	//--直销人/渠道经理
				"        T.SUBSCRIPTION_ID, 					"+	//--用户编码
				"        T.SERVICE_NUM, 						"+	//--用户号码
				"        T.WG_NET_TYPE, 						"+	//--网别
				"        T.JOIN_DATE,							"+	//--入网时间
				"        T.PRODUCT_ID,							"+	//--套餐编号
				"        T.PRODUCT_NAME 						"+	//--套餐名称
				"   FROM PODS.VIEW_ODS_DEVE_INFO_HOUR T         "+
				//显示数据为(给定时间dealDate)当天的零点到给定时间(到小时)之间的数据,传入参数dayStr作为查询时候DEAL_DATE参数，dealDate为入网时间JOIN_DATE的参数
				"  WHERE SUBSTR(T.DEAL_DATE, 1, 8) = '"+dayStr+"' AND T.JOIN_DATE<='"+dealDate+"'" ;
	if(orgLevel==1){
		sql+=" AND T.GROUP_ID_0='"+orgCode+"'";
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+orgCode+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+orgCode+"'";
	}else if(orgLevel==4){
		sql+=" AND T.HQ_CHAN_CODE='"+orgCode+"'";
	}else if(orgLevel==4){
		sql+=" AND 1=2 ";
	}
	if(devType){
		sql+=" AND T.WG_NET_TYPE ='"+devType+"'";
	}
	
	var title=[["账期","地市名称","营服名称","渠道编码","渠道名称","BSS发展编码","直销礼包编码","HR编码","直销人/渠道经理","用户编码","用户号码","网别","入网时间","套餐编号","套餐名称"]];
	showtext = "("+orgName+")("+devType+")实时销量明细-"+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////


