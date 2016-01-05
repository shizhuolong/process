var pageSize = 15;
var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_SLJFZBPZ_UPDATEPART";
$(function() {
	//查询营业人员信息列表
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(resetCon);
	$("#downloadExcel").click(downloadExcel);
	$("#addBtn").click(addTarget);
	
});


function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var bigbusi_desc = $.trim($("#bigbusi_desc").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/assessment/sljfTargetConfig_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "bigbusi_desc":bigbusi_desc
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
				+"<td>"+isNull(n['BIGBUSI_CODE'])+"</td>"
				+"<td><a href='#' onclick='showDetail("+n['BIGBUSI_CODE']+");'>"+isNull(n['BIGBUSI_DESC'])+"</a></td>"
				+"<td>"+isNull(n['CRE'])+"</td>"
				+"<td>"+isNull(n['MONEY'])+"</td>";
				if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' style='text-align: center;' id='"+n['BIGBUSI_CODE']+"' onclick='editSljfTarget(this);'>修改</a></td>";
				} else {
					content+="<td>&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='5'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function showDetail(code){
	var  sql="select t.bigbusi_desc,busi_code,busi_desc,sources  from ptemp.TB_JCDY_SLJF_BIG_BUSI t where t.bigbusi_code='"+code+"'";
	var d=query(sql);
	var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
		+"<table><thead class='lch_DataHead'>"
		+"<tr><th>大类描述</th>"
		+"<th>业务小类编码</th>"
		+"<th>业务小类描述</th>"
		+"<th>来源</th></tr>"
		+"</thead>"
		+"<tbody class='lch_DataBody'>";
		
	for(var i=0;i<d.length;i++){
		h+="<tr><td>"+isNull(d[i]["BIGBUSI_DESC"])
		+"</td><td>"+isNull(d[i]["BUSI_CODE"])
		+"</td><td>"+isNull(d[i]["BUSI_DESC"])
		+"</td><td>"+isNull(d[i]["SOURCES"])
		+"</td></tr>";
	}
	h+="</table></div>";
	art.dialog({
	    title: '详细信息',
	    content: h,
	    padding: 0,
	    lock:true
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
	$("#bigbusi_desc").val("");
}

function downloadExcel() {
	var bigbusi_desc = $.trim($("#bigbusi_desc").val());
	var sql = "SELECT T.BIGBUSI_CODE, T.BIGBUSI_DESC, TO_CHAR(T.CRE,'fm9999999999999999990.0000') AS CRE, TO_CHAR(T.MONEY,'fm9999999999999999990.0000') AS MONEY " +
			"FROM PTEMP.TB_JCDY_SLJF_BUSICRE T ";
	if(bigbusi_desc != "") {
		sql += "WHERE T.BIGBUSI_DESC LIKE '%"+bigbusi_desc+"%'" 
	} 
   var showtext="Sheet";
   var showtext1="result";
   var _head=['指标编码','指标名称','积分值','积分单价'];
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
function addTarget() {
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sljf_target_add.jsp";
	art.dialog.open(url,{
		id:'addSljfTarget',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'添加受理积分指标'
	});
}

//修改
function editSljfTarget(ele) {
	var code = $(ele).attr("id");
	art.dialog.data('code',code);
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sljf_target_update.jsp";
	art.dialog.open(url,{
		id:'updateSljfTarget',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改受理积分指标'
	});
}



