var pageSize = 15;
var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_XSJFZBPZ_UPDATEPART";
$(function() {
	//销售积分信息
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(resetCon);
	$("#downloadExcel").click(downloadExcel);
	$("#addBtn").click(addTarget);
	
});


function search(pageNumber) {
	var itemcode = $.trim($("#itemcode").val());
	var itemdesc = $.trim($("#itemdesc").val());
	var busitype = $.trim($("#busitype").val());
	var busidesc = $.trim($("#busidesc").val());
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/assessment/saleTargetConfig_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "itemcode":itemcode,
           "itemdesc":itemdesc,
           "busitype":busitype,
           "busidesc":busidesc
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
				+"<td>"+isNull(n['SOURCECODE'])+"</td>"
				+"<td>"+isNull(n['ITEMCODE'])+"</td>"
				+"<td>"+isNull(n['ITEMDESC'])+"</td>"
				+"<td>"+isNull(n['BUSITYPE'])+"</td>";
				if(isNull(n['BUSIDESC'])=="存费送费、存费送业务"||isNull(n['BUSIDESC'])=="存费送费"){
					content+="<td style='color:#4095ce'><a href='#' onclick='open1();'>"+isNull(n['BUSIDESC'])+"</a></td>";
				}else{
					content+="<td>"+isNull(n['BUSIDESC'])+"</td>";
				}
				content+="<td>"+isNull(n['CRE'])+"</td>"
				+"<td>"+isNull(n['MONEY'])+"</td>"
				+"<td>"+isNull(n['STATE'])+"</td>";
				if(isGrantedNew(UPDATE_ROLE)) {
					content+="<td><a href='#' style='text-align: center;' sourcecode='"+n['SOURCECODE']+"' onclick='editSaleTarget(this);'>修改</a></td>";
				}else {
					content+="<td>&nbsp;</td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function open1(){
		var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/mrt_234G_fzd_schme.jsp";
		art.dialog.open(url,{
			id:'open',
			width:'1200px',
			height:'400px',
			padding:'0 0',
			lock:true,
			resize:false,
			title:'活动明细'
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

//重置
function resetCon() {
	$("#itemcode").val("");
	$("#itemdesc").val("");
	$("#busitype").val("");
	$("#busidesc").val("");
}

function downloadExcel() {
	var itemcode = $.trim($("#itemcode").val());
	var itemdesc = $.trim($("#itemdesc").val());
	var busitype = $.trim($("#busitype").val());
	var busidesc = $.trim($("#busidesc").val());
	var sql = "SELECT T.SOURCECODE,T.ITEMCODE,T.ITEMDESC,T.BUSITYPE,T.BUSIDESC," +
			"TO_CHAR(T.CRE, 'fm9999999999999999990.0000') AS CRE," +
			"TO_CHAR(T.MONEY, 'fm9999999999999999990.0000') AS MONEY," +
			"DECODE(T.STATE, '1', '有效', '无效') AS STATE " +
			"FROM PODS.TB_ODS_JCDY_SALLCRE T WHERE 1=1 ";
	if(itemcode != "") {
		sql += " AND T.ITEMCODE = '"+itemcode+"' ";
	}
	if(itemdesc != "") {
		sql += " AND T.ITEMDESC LIKE '%"+itemdesc+"%' "; 
	}
	if(busitype != "") {
		sql += " AND T.BUSITYPE = '"+busitype+"' ";
	}
	if(busidesc != "") {
		sql += " AND T.BUSIDESC LIKE '%"+busidesc+"%' ";
	}
   var showtext="Sheet";
   var showtext1="result";
   var _head=['原始编码','指标编码','指标描述','业务类型','业务描述','积分值','单价','状态'];
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
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sale_target_add.jsp";
	art.dialog.open(url,{
		id:'addSaleTarget',
		width:'660px',
		height:'150px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'添加销售积分指标'
	});
}

//修改
function editSaleTarget(ele) {
	var sourcecode = $(ele).attr("sourcecode");
	art.dialog.data('sourcecode',sourcecode);
	var url = $("#ctx").val()+"/performanceAppraisal/payment/jsp/sale_target_update.jsp";
	art.dialog.open(url,{
		id:'updateSaleTarget',
		width:'660px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改销售积分指标'
	});
}



