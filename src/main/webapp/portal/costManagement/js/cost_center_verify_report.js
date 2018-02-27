var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	
	$("#importExcel").click(function(){
		importExcel();
	});
	$("#confirmBtn").click(function(){
		confirmOperate();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var regionCode = $.trim($("#regionCode").val());
	var unitCode   = $.trim($("#unitCode").val());
	var centerCode = $.trim($("#centerCode").val());
	var centerName = $.trim($("#centerName").val());
	var isMarking  = $.trim($("#isMarking").val());
	var orgLevel   = $("#orgLevel").val();
	var orgCode    = $("#code").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/costCenter_findCostCenterList.action",
		data:{
		   "page"		: pageNumber,
           "rows"		: pageSize,
           "regionCode"	: regionCode,
           "unitCode"	: unitCode,
           "centerCode"	: centerCode,
           "centerName"	: centerName,
           "isMarking"  : isMarking,
           "orgLevel"	: orgLevel,
           "orgCode"	: orgCode
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
	   		var orgLevel=$("#orgLevel").val();
	   		if(orgLevel==1){
	   			$.each(pages.rows,function(i,n){
					content+="<tr>"
					+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
					+"<td>"+isNull(n['CC_DESC'])+"</td>"
					+"<td>"+isNull(n['CC_CODE'])+"</td>"
					+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
					+"<td>"+isNull(n['UNIT_ID'])+"</td>"
					+"<td style='text-align:center;'>" 
					+	"<a href='#' groupId1='"+n['GROUP_ID_1']+"' ccCode='"+n['CC_CODE']+"' onclick='editRow(this);'>修改</a>&nbsp;&nbsp;&nbsp;" 
					+	"<a href='#' groupId1='"+n['GROUP_ID_1']+"' ccCode='"+n['CC_CODE']+"' onclick='saveRow(this);'>保存</a>" 
					+"</td>" 
					+"</tr>";
				});
	   		}else{
	   			$.each(pages.rows,function(i,n){
					content+="<tr>"
					+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
					+"<td>"+isNull(n['CC_DESC'])+"</td>"
					+"<td>"+isNull(n['CC_CODE'])+"</td>"
					+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
					+"<td>"+isNull(n['UNIT_ID'])+"</td>"
					+"<td style='text-align:center;'>" 
					+	"<a href='#' groupId1='"+n['GROUP_ID_1']+"' ccCode='"+n['CC_CODE']+"' onclick='editRow(this);'>修改</a>&nbsp;&nbsp;&nbsp;" 
					+	"<a href='#' groupId1='"+n['GROUP_ID_1']+"' ccCode='"+n['CC_CODE']+"' onclick='saveRow(this);'>保存</a>" 
					+"</td>" 
					+"</tr>";
				});
	   		}
	   		
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='7'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//导入excel
function importExcel() {	 //"/portal/costManagement/jsp/importCostCenterExcel.jsp"
	var url = $("#ctx").val()+"/portal/costManagement/jsp/importCostCenterExcel.jsp";
	art.dialog.open(url,{
		id:'importCostCenterExcelDailog',
		width:'530px',
		height:'260px',
		padding:'0 0',
		title:'成本中心导入',
		lock:true,
		resize:false
	});
}



//下载模板
function downExcelTemp() {
	var regionCode = $.trim($("#regionCode").val());
	var unitCode   = $.trim($("#unitCode").val());
	var centerCode = $.trim($("#centerCode").val());
	var centerName = $.trim($("#centerName").val());
	var isMarking  = $.trim($("#isMarking").val());
	var orgLevel   = $("#orgLevel").val();
	var orgCode    = $("#code").val();

	var sql = 	" SELECT T.GROUP_ID_1,					  " +
				"		 T.GROUP_ID_1_NAME,               "+
				"        T.CC_DESC,                       "+
				"        T.CC_CODE,                       "+
				"        T.UNIT_NAME                      "+
				"   FROM PODS.TAB_ODS_GB_CENTER_UNIT T    "+
				"  WHERE  1=1";//T.CC_CODE IS NOT NULL  AND T.CC_CODE <> '0'
	if(regionCode){ 
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode){
		sql+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	if(centerName){
		sql+=" AND T.CC_DESC LIKE CONCAT(CONCAT('%',"+centerName+",'%')";
		
	}
	if(centerCode){
		sql+=" AND T.CC_CODE = '"+centerCode+"'";
	}
	if(isMarking==1){
		sql+=" AND T.UNIT_ID IS NOT NULL";
	}else{
		sql+=" AND T.UNIT_ID IS NOT NULL";
	}
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 ='"+orgCode+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID = '"+orgCode+"'";
	}else{
		sql+=" AND 1=2 ";
	}
	sql+="  ORDER BY T.GROUP_ID_1, T.UNIT_ID       ";
	//var title=[["地市名称","地市编码","成本中心名称","成本中心编码","营服名称","营服编码"]];
	var title=[["地市编码","地市名称","成本中心名称","成本中心编码","营服名称"]];
	showtext = '成本中心确认';
	downloadExcel(sql,title,showtext);
}


/**
 * 保存修改行信息
 * @param even
 */
function saveRow(even){
	//获得select选项框选中项的内容
	var unitName = $(even).parent().prev().prev().find("select:eq(0)").find("option:selected").text();
	//获得编辑行选项框内容改变后的营服编码
	var unitCode = $(even).parent().prev().prev().find("select:eq(0)").find("option:selected").val();
	//数据库表中的唯一字段，用做修改数据的唯一条件(成本中心编码)
	var ccCode   = $(even).attr("ccCode");
	//修改行对应的地市编码，也用来做修改数据的条件
	var groupId1 = $(even).attr("groupId1");
	
	 $.ajax({
		   	type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/channelManagement/costCenter_saveRow.action",
			data:{
	          "unitName"  : unitName,
	          "unitCode"  : unitCode,
	          "centerCode": ccCode,
	          "regionCode": groupId1
		   	}, 
	         success: function (data){
	        	 if(data&&data==1){
	        		 //console.info("data=====>"+data);
	        		 search(0);
	        		 alert("修改成功");
	        		 
	        	 }else{
	        		 alert("修改失败");
	        	 }
	         }
	   });
	
}

/**
 * 行编辑
 * @param even
 */
function editRow(even){
	var groupId1 = $(even).attr("groupId1");
	var ccCode = $(even).attr("ccCode");
	var result="<select id='save_"+ccCode+"' onchange='javascript:changeUnit(this);'>" ;
	 $.ajax({
		   type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/channelManagement/costCenter_findUnitList.action",
			data:{
	          "orgCode":groupId1
		   	}, 
	         success: function (data){
	        	 $.each(data,function(i,n){
	        		 result+="<option unitName ="+isNull(n['UNIT_NAME'])+"  value="+isNull(n['UNIT_ID'])+">"+isNull(n['UNIT_NAME'])+"</option>";
	        	 });
	         }
	   });
	    result+="</select>";
	    $(even).parent().prev().prev().empty().html(result);
}

/**
 * 当下拉框内容改变的时候改变营服编码字段在表中对应的值
 * @param even
 */
function changeUnit(even){
	var unitId = $(even).val();
	$(even).parent().next().empty().text(unitId);
}

/**
 * 确认划分成本中心(更新成本中心状态)
 */
function confirmOperate(){
	var regionCode = $("#region").val();
	$.ajax({
	   	type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/channelManagement/costCenter_updateState.action",
		data:{
          "regionCode": regionCode
	   	}, 
         success: function (data){
        	 if(data){
        		alert(data);
        	 }
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