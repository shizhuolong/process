var pageSize = 10;
var curPage=0;
$(function() {
	$("#checkAll").change(function(){
		var billIds="";
		$("#dataBody").find(".isUsed").each(function(){
			if(billIds.length>0) billIds+=",";
			billIds+="'"+$(this).parent().attr("billId")+"'";
		});
		var isUsed=0;
		if($(this).is(':checked')){
			isUsed=1;
		}
		save(2,billIds,{isUsed:isUsed});
	});
	$("#searchBtn").click(function(){
		search(0);
	});
	
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	
	search(0);
});
// oper为1是更新考核账期数 2是更新是否可以抵扣
function save(oper,billIds,values){
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!updateSubsidy.action",
		data:{
           "params.oper":oper,
           "params.billIds":billIds,
           "params.dealDateNum":values.dealDateNum,
           "params.updateMan":values.updateMan,
           "params.isUsed":values.isUsed
	   	}, 
	   	success:function(data){
	   		if(data&&data.ok){
	   			alert("修改成功");
	   			var win = artDialog.open.origin;
	   			win.art.dialog({id: 'update'}).close();
	   			win.search(curPage);
	   		}else{
	   			alert("修改失败");
	   		}
	   	}
	});
}
function nextMonth(d){
	var year=d.substr(0,4);
	var month=d.substr(4,2);
	var day=d.substr(6,2);
	if(month==12){
		month=1;
		year++;
	}else{
		month++;
	}
	
	return year+(month>9?'':'0')+month+day;
}
function initOper(){
	var orgLevel=$("#orgLevel").val();
	var updateMan=$("#updateMan").val();
	//初始化考核账期修改
	var nowMonth=$("#nowMonth").val();
	var dealDate=$("#dealDate").val();
	var n1=nextMonth(dealDate+'02');
	var n2=nextMonth(n1);
	if((orgLevel>1&&nowMonth>=n1&&nowMonth<=n2)||orgLevel==1){
		var selectStr="";
		selectStr+=" <select class='default-text-input wper80'>                                  ";
    	selectStr+=" 	<option value='1'>1</option>          ";
    	selectStr+=" 	<option value='2'>2</option>          ";
    	selectStr+=" 	<option value='3'>3</option>          ";
		selectStr+=" 	<option value='4'>4</option>          ";
		selectStr+=" 	<option value='5'>5</option>          ";
		selectStr+=" 	<option value='6'>6</option>          ";
		selectStr+=" 	<option value='7'>7</option>          ";
		selectStr+=" 	<option value='8'>8</option>          ";
		selectStr+=" 	<option value='9'>9</option>          ";
		selectStr+=" 	<option value='10'>10</option>        ";
		selectStr+=" 	<option value='11'>11</option>        ";
		selectStr+=" 	<option value='12'>12</option>        ";
    	selectStr+=" </select>                                 ";
		$("#dataBody").find(".dealDateNum").each(function(){
			var $selectBox=$(selectStr);
			var billIds="'"+$(this).parent().attr("billId")+"'";
			var text=$(this).text();
			$selectBox.val(text);
			$selectBox.change(function(){
				var updateMan=$("#updateMan").val();
				var dealDateNum=$(this).val();
				save(1,billIds,{dealDateNum:dealDateNum,updateMan:updateMan});
			});
			$(this).empty().append($selectBox);
		});
	}
	
	//初始化是否抵扣修改
	if(orgLevel==1){
		$("#dataBody").find(".isUsed").each(function(){
			var billIds="'"+$(this).parent().attr("billId")+"'";
			var text=$(this).text();
			var $checkBox=$("<input type='checkbox'/>");
			if(text=="是"){
				$checkBox.attr("checked","checked");
			}else{
				$checkBox.removeAttr("checked");
			}
			$checkBox.change(function(){
				var isUsed=0;
				if($(this).is(':checked')){
					isUsed=1;
				}
				save(2,billIds,{isUsed:isUsed});
			});
			$(this).empty().append($checkBox).append(text);
		});
		$("#checkAll").show();
	}
}
function changeDealDate(){
	var dealDate=$("#dealDate").val();
	if(dealDate!=$("#nowMonth").val()){
		$("#addBtn").hide();
		$("#dataBody").find("TR").find("TD:last").find("A").hide();
	}else{
		$("#addBtn").show();
		$("#dataBody").find("TR").find("TD:last").find("A").show();
	}
}

function search(pageNumber) {
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	var regionCode=$.trim($("#regionCode").val());
	var hqChanCode=$.trim($("#hqChanCode").val());
	var hqChanName=$.trim($("#hqChanName").val());
	var subItemName=$.trim($("#subItemName").val());
	var isUsed=$.trim($("#isUsed").val());
	var dealDate=$("#dealDate").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!listSubsidy.action",
		data:{
		   "params.page":pageNumber,
           "params.rows":pageSize,
           "params.regionCode":regionCode,
           "params.hqChanCode":hqChanCode,
           "params.hqChanName":hqChanName,
           "params.subItemName":subItemName,
           "params.isUsed":isUsed,
           "params.dealDate":dealDate
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
				content+="<tr billId='"+n["BILL_ID"]+"'>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['WORK_NO'])+"</td>"
				//考核账期数
				+"<td class='dealDateNum'>"+isNull(n['DEAL_DATE_NUM'])+"</td>"
				+"<td>"+isNull(n['UPDATE_MAN'])+"</td>"
				+"<td>"+isNull(n['UPDATE_TIME'])+"</td>"
				//是否抵扣
				+"<td class='isUsed'>"+isNull(n['IS_USE'])+"</td>"
				
				+"<td>"+isNull(n['FEE_TYPE'])+"</td>"
				+"<td>"+isNull(n['MONEY'])+"</td>"
				+"<td>"+isNull(n['MONEY_YF'])+"</td>"
				+"<td>"+isNull(n['MONEY_SY'])+"</td>"
				+"<td>"+isNull(n['CREATOR'])+"</td>"
				+"<td>"+isNull(n['CREATE_TIME'])+"</td>"
				+"<td>"+isNull(n['END_DATE'])+"</td>";
				content+="</tr>";
			});
	   	    
			if(content != "") {
				$("#dataBody").empty().html(content);
				initOper();
			}else {
				$("#dataBody").empty().html("<tr><td colspan='15'>暂无数据</td></tr>");
			}
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
	       prev_text: '上页',       // 上一页按钮里text
		   next_text: '下页',       // 下一页按钮里text
		   num_display_entries: 5, 
		   num_edge_entries: 2
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

function downloadExcel() {
	var regionCode=$.trim($("#regionCode").val());
	var hqChanCode=$.trim($("#hqChanCode").val());
	var hqChanName=$.trim($("#hqChanName").val());
	var subItemName=$.trim($("#subItemName").val());
	var isUsed=$.trim($("#isUsed").val());
	var dealDate=$("#dealDate").val();
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	
	var sql="";
	sql+="  select                                                                            ";
	sql+="       t.DEAL_DATE       	                                                          ";
	sql+="      ,t.GROUP_ID_1_NAME                                                            ";
	sql+="      ,t.HQ_CHAN_CODE                                                               ";
	sql+="      ,t.HQ_CHAN_NAME                                                               ";
	sql+="      ,t.WORK_NO                                                                    ";
	sql+="      ,t.DEAL_DATE_NUM                                                              ";
	sql+="      ,t.UPDATE_MAN                                                                 ";
	sql+="      ,to_char(t.UPDATE_TIME,'YYYY-MM-DD HH24:MI:SS')   UPDATE_TIME                 ";
	sql+="      ,case when  t.IS_USE=1 then '是' else '否' end    IS_USE                       ";
	sql+="      ,t.FEE_TYPE                                                                   ";
	sql+="      ,t.MONEY                                                                      ";
	sql+="      ,t.MONEY_YF                                                                   ";
	sql+="      ,t.MONEY_SY                                                                   ";
	sql+="      ,t.CREATOR                                                                    ";
	sql+="      ,to_char(t.CREATE_TIME,'YYYY-MM-DD HH24:MI:SS')   CREATE_TIME                 ";
	sql+="      ,to_char(t.END_DATE,'YYYY-MM-DD HH24:MI:SS')      END_DATE                    ";
	
	
	sql+="  from PAPP.TAB_JF_COMM_INPUT t    where 1=1   and t.DEAL_DATE='"+dealDate+"'      ";
	if(orgLevel>1){
		sql+=" and t.GRUOP_ID_1='"+code+"'";
	}
	
	if(regionCode!=''){
		sql+=" AND t.GRUOP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanCode!=''){
		sql+=" AND t.HQ_CHAN_CODE = '"+hqChanCode+"'";
	}
	if(hqChanName!=''){
		sql+=" AND t.HQ_CHAN_NAME like '%"+hqChanName+"%'";
	}
	if(subItemName!=''){
		sql+=" AND t.FEE_TYPE like '%"+subItemName+"%'";
	}
	if(isUsed!=''){
		sql+=" AND t.IS_USE = '"+isUsed+"'";
	}
	
	var showtext="渠道补贴录入";
	var _head=["账期","地市","渠道编码","渠道名称","工单编码","考核期数","期数修改人","期数修改时间","是否抵扣","补贴科目","总金额(元)","已抵扣金额(元)","未抵扣金额(元)","拟稿人","拟稿时间","结束时间"];
   //loadWidowMessage(1);
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
		 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext+'.xls'))].join('');
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

