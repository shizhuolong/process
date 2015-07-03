var pageSize = 10;
var paraValue = '1';
var dateValue = "";
var group_id_1 = "";
$(function(){
	
	
	loadData();
	
	function loadData(){
		if(dateValue1=="") {
			dateValue = $("#dateValue").val();
		}else {
			dateValue = dateValue1;
		}
	    baseInfo.getDataBySelectIndex(0);
	   
	}
	
	//查询
	$("#searchBtn").click(function(){
		dateValue = $("#dateValue").val();
		loadData();
	});
	
	//省公司增加按地市查询
	if(regionType == "1") {
		init_sitem();
	}
	$("#searchGroupBtn").click(function(){
		group_id_1 = $("#group_id_1").val();
		baseInfo.getDataBySelectIndex(0);
	});
	
});

var baseInfo={
	
	//获取表格数据
	getDataBySelectIndex:function(pageNumber){
		pageNumber = pageNumber+1;
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:path+"/taskManagement/saleSchedule_qrySaleScheduleReport.action",
			data:{
				"resultMap.page":pageNumber,
				"resultMap.rows":pageSize,
				"resultMap.dateValue":dateValue,
				"resultMap.regionType":regionType,
				"resultMap.parentRegionCode":parentRegionCode,
				"resultMap.taskCode":taskCode,
				"resultMap.group_id_1":group_id_1
		   	}, 
		   	success:function(data){
		   		if(data.msg) {
		   			alert(data.msg);
		   			return;
		   		}
		   		var pages=data;
		   		if(pageNumber == 1) {
					initPagination(pages.pagin.totalCount);
				}
		   		var content='';
		   		$.each(pages.rows,function(i,n){
		   			$.each(n.taskDetailList,function(j,m){
		   				if(j==0) {
		   					content += '<tr><td rowspan="'+n.taskDetailList.length+'">'+n.dateValue+'</td><td rowspan="'+n.taskDetailList.length+'">';
		   					if(n.regionType != 4) {
		   						content += '<a href="javascript:void(0)" regionType="'+n.regionType+'" regionCode="'+n.regionCode+'" taskCode="'+n.taskCode+'" onclick="qrySubordinateTask(this)">'+n.regionName+'</a></td><td>'+m.targetName+'</td>';
		   					}else {
		   						content += n.regionName+'</td><td>'+m.targetName+'</td>';
		   					}
		   					content += '<td>'+m.unit+'</td><td>'+m.targetType+'</td><td>'+m.targetValue+'</td></tr>';
		   				}else {
		   					content += '<tr><td>'+m.targetName+'</td>'
		   					+'<td>'+m.unit+'</td><td>'+m.targetType+'</td><td>'+m.targetValue+'</td></tr>';
		   				}
		   			});
				});
				if(content != "") {
					$("#dataBody").empty().html(content);
				}else {
					$("#dataBody").empty().html("<tr><td colspan='6' style='text-align:center;'>暂无数据</td></tr>");
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("加载数据失败！");
		    }
	  });
	}
};

function qrySubordinateTask(element) {
	
	var regionType = $(element).attr("regionType");
	var regionCode = $(element).attr("regionCode");
	var taskCode = $(element).attr("taskCode");
	var regionName = $(element).text();
	var url = path+'/taskManagement/saleschedule/jsp/saleschedule_report.jsp?regionType='+regionType+'&parentRegionCode='+regionCode+'&taskCode='+taskCode+'&dateValue='+dateValue;
	parent.openWindow('排产分析-'+regionName,'computer',url);
}

//分页插件
function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
        callback: baseInfo.getDataBySelectIndex,
        items_per_page:pageSize,
        link_to:"###",
        prev_text: '上页',       //上一页按钮里text  
    	next_text: '下页',       //下一页按钮里text  
    	num_display_entries: 5, 
    	num_edge_entries: 2
	 });
}


function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

function init_sitem() {
	$.ajax({
		type:"post",
		dataType:"json",
		url:path+"/taskManagement/common_!selectRegion.action",
		data:{},
		success:function(data){
			var str = "<option value=''>请选择地市</option>";
			for(var i=0;i<data.length;i++){
				console.log(data[i]);
				str += "<option value='"+data[i].ID+"'>"+data[i].NAME+"</option>";
			}
			//str += "</select>";
			$("#group_id_1").empty().append(str);
		},
		error:function(){
			alert("网络延迟");
		}
	});
}
