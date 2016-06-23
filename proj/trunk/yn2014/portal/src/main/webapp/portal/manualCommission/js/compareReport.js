var pageSize = 15;
$(function() {
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	listRegions();
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var orgLevel = $.trim($("#orgLevel").val());
	var region = $.trim($("#region").val());
	var dealDate = $.trim($("#month").val());
	var regionCode =$.trim($("#regionCode").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/commission/compareReport_queryCompareData.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgLevel":orgLevel,
           "resultMap.region":region,
           "resultMap.dealDate":dealDate,
           "regionCode":regionCode
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
	   		//alert(pages.rows[0]['DEAL_DATE']);
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>" +
							"<td>"+isNull(n['DEAL_DATE'])+"</td>" +
							"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>" +
							"<td>"+isNull(n['ITEM'])+"</td>" +
							"<td>"+isNull(n['BD_TYPE_ID'])+"</td>" +
							"<td>"+isNull(n['BD_TYPE'])+"</td>" +
							"<td>"+isNull(n['INI_NUM'])+"</td>" +
							"<td>"+isNull(n['INIT_FEE'])+"</td>" +
							"<td><a href='#' dealDate='"+isNull(n['DEAL_DATE'])+"' groupId='"+isNull(n['GROUP_ID_1'])+"'  dbTypeId='"+isNull(n['BD_TYPE_ID'])+"' successNum='1' failNum='' detailType='成功'  onclick='showDetails(this);'>"+isNull(n['SUCESS_NUM'])+"</a></td>" +
							"<td>"+isNull(n['SUCCESS_FEE'])+"</td>" +
							"<td><a href='#' dealDate='"+isNull(n['DEAL_DATE'])+"' groupId='"+isNull(n['GROUP_ID_1'])+"'  dbTypeId='"+isNull(n['BD_TYPE_ID'])+"' successNum='' failNum='1'  detailType='失败' onclick='showDetails(this);'>"+isNull(n['FAIL_NUM'])+"</a></td>" +
							"<td>"+isNull(n['FAIL_FEE_YL'])+"</td>" +
							"<td>"+isNull(n['FAIL_FEE_SL'])+"</td>" +
							"<td>"+isNull(n['FAIL_FEE_XY'])+"</td>" +
						"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#dataBody").find("TR").each(function(){
					$(this).find("TD:gt(3)").css({"text-align":"right"});
				});
			}else {
				$("#dataBody").empty().html("<tr><td colspan='12'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//查看明细
function showDetails(ele) {
	//帐期
	var dealDate = $(ele).attr("dealDate");
	//地市编码
	var groupId = $(ele).attr("groupId");
	//科目id
	var dbTypeId = $(ele).attr("dbTypeId");
	var successNum=$(ele).attr("successNum");
	var failNum= $(ele).attr("failNum");
	var detailType=$(ele).attr("detailType");
	var url = $("#ctx").val()+"/portal/manualCommission/jsp/compareReportClassfyDetail.jsp?dealDate="+dealDate+"&groupId="+groupId+"&dbTypeId="+dbTypeId+"&detailType="+detailType;
	if(successNum!=''){
		url+="&successNum="+successNum;
	}
	if(failNum!=''){
		url+="&failNum="+failNum;
	}
	window.parent.openWindow("对比报表详细信息("+detailType+")",'funMenu',url);
}


//分页
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
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}


function downloadExcel() {
	var orgLevel = $.trim($("#orgLevel").val());
	var region = $.trim($("#region").val());
	var dealDate = $.trim($("#month").val());
	var regionCode =$.trim($("#regionCode").val());
	var sql = "SELECT DEAL_DATE,                          "+
			"	GROUP_ID_1_NAME,                        "+
			"	ITEM,                             		"+
			"	BD_TYPE_ID,                             "+
			"	BD_TYPE,                                "+
			"	SUM(INIT_NUM) INI_NUM,                  "+
			"	SUM(INIT_FEE) INIT_FEE,                 "+
			"	SUM(SUCCESS_NUM) SUCESS_NUM,            "+
			"	sum(SUCCESS_FEE) SUCCESS_FEE,           "+
			"	SUM(FAIL_NUM) FAIL_NUM,                 "+
			"	SUM(FAIL_FEE_YL) FAIL_FEE_YL,           "+
			"	SUM(FAIL_FEE_SL) FAIL_FEE_SL,           "+
			"	SUM(FAIL_FEE_XY) FAIL_FEE_XY            "+
			"	FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T "+
			"	WHERE DEAL_DATE = '"+dealDate+"'";
	if(orgLevel!=1){
		sql+=" AND T.GROUP_ID_1 = '"+region+"'";
	}
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
	sql+=" GROUP BY DEAL_DATE, GROUP_ID_1_NAME, BD_TYPE_ID, BD_TYPE,ITEM";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['帐期','地市名称','科目','比对项目','比对备注','工单总数','工单总额','对比成功工单总数','对比成功过工单总额','失败工单数','失败应录金额','失败实录金额','失败差异金额'];
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

/**查询地市编码和地市名称**/
function listRegions() {
	var sql = "";
	var region = $("#region").val();
	var orderBy = " ORDER BY GROUP_ID_1";
	// 条件
	var sql = "SELECT DISTINCT(GROUP_ID_1),GROUP_ID_1_NAME FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL ";
	// 权限
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {

	} else {
		sql += " AND GROUP_ID_1='" + region + "'";
	}
	// 排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d = query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1 + '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">'
						+ d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		/*
		 * $area.change(function() { listUnits($(this).val()); });
		 */
	} else {
		alert("获取地市信息失败");
	}
}



//获取数据
function query(sql){
	var ls=[];
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