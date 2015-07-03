var pageSize = 100;
var orgId = "";
var code = "";
var unitid="";
var basetype="";

$(function() {
	
	//从用户登录信息中获取初始化根节点
	
	unitid=$("#unitid").val();
	basetype=$("#basetype").val();
	//查询营业人员信息列表
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#station_addr_name").val("");
		$("#station_addr_code").val("");
		$("#isDivide").val("");
	});
	$("#downloadExcel").click(downloadExcel);
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var station_addr_code = $.trim($("#station_addr_code").val());
	var station_addr_name = $.trim($("#station_addr_name").val());
	var isDivide = $.trim($("#isDivide option:selected").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/tabStation_queryStationDetail.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "station_addr_code":station_addr_code,
           "station_addr_name":station_addr_name,
           "unitid":unitid,
			"basetype":basetype,
           "isDivide":isDivide,
           "dealdate":dealdate
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
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_ID_NAME'])+"</td>"
				+"<td>"+isNull(n['STATION_NAME'])+"</td>";
				//已划分
				content += "<td>" +
							"<a href='#' station_name='"+n['STATION_NAME']+"' onclick='showDetail(this);'>详细信息</a></td>";
				
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//查看详细信息
function showDetail(ele) {
	var station_name = $(ele).attr("station_name");
	var myDialog = art.dialog({
		id:'stationInfo',
		width:'410px',
		height:'200px',
		padding:'0 0',
		title:'基站详细信息',
		lock:true,
		resize:false
	});
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/tabStation_BaseDetail.action",
		data:{
			"station_name":station_name,
			"dealdate":dealdate
	   	}, 
	   	success:function(data){
	   		var content = "<table style='width:100%;margin-top: 5px;' id='nRtable'>";
	   		content+="<tr>";
	   		content+="<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址地区</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].TERRITORY_NAME+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址乡镇</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].TOWN_NAME+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>地理属性</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GEOGRAPHY+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>覆盖范围</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].ROUNDITEM+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_SERIAL+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>站址名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_NAME+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>基站类型</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].STATION_TYPE+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>房租费</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].ROOM_FEES)+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>水电费</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].WATER_FEES)+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>代维费</td><td style='height: 25px; padding: 0px;width: 150px;'>"+isNull(data[0].MAINTENANCE_FEES)+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>资产所在地点编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].ASSETS_CODE+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>地市编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GROUP_ID_1+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>地市名称</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].GROUP_ID_1_NAME+"</td>" +
			"<td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>营服中心编码</td><td style='height: 25px; padding: 0px;width: 150px;'>"+data[0].UNIT_ID+"</td></tr>" +
			"<tr><td style='height: 25px; padding: 0px;width: 50px;background: #d8f0e5;'>营服中心名称</td><td colspan='3' style='height: 25px; padding: 0px;width: 150px;'>"+data[0].UNIT_ID_NAME+"</td></tr>";
	   		content += "</table>";
	   		myDialog.content(content);// 填充对话框内容
	   		//myDialog.close();
		},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
       callback: search,
       items_per_page:pageSize,
       link_to:"###",
       prev_text: '上页',       //上一页按钮里text  
   	next_text: '下页',       //下一页按钮里text  
   	num_display_entries: 5, 
   	num_edge_entries: 2
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

//导出excel
function downloadExcel() {
	var station_addr_code = $.trim($("#station_addr_code").val());
	var station_addr_name = $.trim($("#station_addr_name").val());
	var sql = "SELECT T.GROUP_ID_1_NAME, T.UNIT_ID_NAME, T.STATION_NAME " +
			 "FROM PCDE.TAB_CDE_STATION_NE_ADDR_CODE T WHERE 1=1 ";
	if(orgLevel == 2) {
		sql += " AND T.GROUP_ID_1 = '"+code+"'";
	}
	if(orgLevel == 3) {
		sql += " AND T.UNIT_ID = '"+code+"'";
	}
	if(orgLevel == 4) {
		sql += " AND 1=2";
	}
	if(station_addr_name != "") {
		sql += " AND T.STATION_NAME LIKE '%"+station_addr_name+"%'";
	}
	if(dealdate != ""){
		sql+=" AND TO_CHAR(T.DAY_STAMP,'YYYYMMDD') ='"+dealdate+"'";
		
	}
	if(unitid != ""){
       sql+=" AND T.UNIT_ID='"+unitid+"'";
    }
	if(basetype != ""){
	    sql+=" AND trim(replace(T.STATION_TYPE_CODE, chr(9), '')) ='"+basetype+"G'";
	    
	}
   var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','基站名称'];
   loadWidowMessage(1);
   _execute(3001,{type:12,
		     data:{
		    	  sql:sql,
		    	  contname:_head,
		    	  startRow:1,
		    	  startCol:0,
		    	  cols:-1,
		    	  sheetname:showtext,
		    	  excelModal:'reportModel.xls'
		     }     
	},function(res){
		loadWidowMessage(0);
		 click_flag=0;
		 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext1+'.xls'))].join('');
		 window.location.href=url;
	});
}

function _execute(type, parameter, callback, msg, dom){
   $.Project.execute(type, parameter, callback, msg, dom);
}

/**
 * 程序锁屏信息，1为加载，其他为去除锁屏信息
 * @param flag
 * @return
 */
function loadWidowMessage(flag){
	if(flag == 1){
		$.messager.progress({
			text:'正在处理数据，请稍等...',
			interval:100
		}); 
	}else{
		$.messager.progress('close'); 
	}
}



