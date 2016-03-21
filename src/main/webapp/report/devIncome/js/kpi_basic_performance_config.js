var pageSize = 15;
//var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_SLJFZBPZ_UPDATEPART";
$(function() {
	//查询地市
	listRegions();
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(resetCon);
	$("#downloadExcel").click(downloadExcel);
	$("#addBtn").click(function(){
		addKpiBaseConfig();
	});
	
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var time = $.trim($("#time").val());
	var regionName = $.trim($("#regionName").val());
	var regionCode = $.trim($("#regionCode").val());
	var userName = $.trim($("#userName").val());
	var orgLevel = $.trim($("#orgLevel").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/kpiManager/kpiBasicPerConfig_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "time":time,
           "orgLevel":orgLevel,
           "regionCode":regionCode,
           "regionName":regionName,
           "userName":userName
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
				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['BASESALARY'])+"</td>"
				+"<td style='text-align: center;'><a href='#' style='text-align: center;'  hrId='"+n['HR_ID']+"' time='"+n['DEAL_DATE']+"' onclick='editKpiBseicByHrid(this);'>修改</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
				+"<a href='#' style='text-align: center;' hrId='"+n['HR_ID']+"' name='"+n['NAME']+"'  time='"+n['DEAL_DATE']+"'  onclick='delKpiBseicByHrid(this);'>删除</a></td>"
				/*if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' style='text-align: center;' id='"+n['BIGBUSI_CODE']+"' onclick='editSljfTarget(this);'>修改</a></td>";
				} else {
					content+="<td>&nbsp;</td>";
				}*/
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
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

//重置
function resetCon() {
	$("#userName").val("");
}

function listRegions(){
	var sql = "SELECT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE T WHERE 1=1 ";
	var orderBy =" ORDER BY T.GROUP_ID_1"
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var regionCode = $("#regionCode").val();
	if(orgLevel==1){
		
	}else{
		sql+=" AND T.GROUP_ID_1="+regionCode;
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
	}
}

function downloadExcel() {
	var time = $.trim($("#time").val());
	var regionCode = $.trim($("#regionName").val());
	var userName = $.trim($("#userName").val());
	var sql = "SELECT T1.DEAL_DATE,T2.GROUP_ID_1_NAME,T1.NAME, T1.HR_ID, T1.BASESALARY "+
		"  FROM PTEMP.TB_JCDY_PORTAL_BASESALARY_MON T1, PCDE.TB_CDE_REGION_CODE T2 "+
		" WHERE T1.GROUP_ID_1 = T2.GROUP_ID_1                                      "+
		" AND T1.DEAL_DATE ="+time;
	if(regionCode != "") {
		sql += " AND  T1.GROUP_ID_1 ="+ regionCode;
	} 
	if(userName != "") {
		sql += " AND  T1.NAME ='"+ userName+"'";
	} 
	sql+=" ORDER BY T1.GROUP_ID_1";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['帐期','地市','人员姓名','HR编码','基础薪酬'];
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

//添加
function addKpiBaseConfig() {
	//var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sljf_target_add.jsp";
	var url = $("#ctx").val()+"/report/devIncome/jsp/kpi_base_performance_add.jsp";
	art.dialog.open(url,{
		id:'addKpiBasePerformance',
		width:'420px',
		height:'220px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'添加KPI基础绩效'
	});
}

//修改
function editKpiBseicByHrid(ele) {
	var hrId = $(ele).attr("hrId");
	var time = $(ele).attr("time");
	art.dialog.data('hrId',hrId);
	art.dialog.data('time',time);
	//var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sljf_target_update.jsp";
	var url = $("#ctx").val()+"/report/devIncome/jsp/kpi_base_performance_edit.jsp";
	art.dialog.open(url,{
		id:'editKpiBasePerformance',
		width:'420px',
		height:'220px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改KPI基础绩效'
	});
}


function delKpiBseicByHrid(even){
	var hrId =$(even).attr("hrId");
	var time=$(even).attr("time");
	var name=$(even).attr("name");
	if(confirm("确定删除"+name+"的kpi基础绩效吗？")){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/kpiManager/kpiBasicPerConfig_delKpiBasicByHrid.action",
			data:{
	           "hrId":hrId,
	           "time":time
		   	}, 
		   	success:function(data){
		   		if(data){
		   			search(0);
		   		}else{
		   			alert("删除失败");
		   			search(0);
		   		}
		   	}
		 });
	}
}
