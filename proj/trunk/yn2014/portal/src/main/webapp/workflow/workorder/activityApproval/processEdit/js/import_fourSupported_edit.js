var isNeedApprover = true;
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
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var channel_name=$.trim($("#channel_name").val());
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/fourSupported/four-supported!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "channel_name":channel_name,
           "businessKey":businessKey
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
					+"<td>"+isNull(n['BILLINGCYCLID'])+"</td>"
	                +"<td>"+isNull(n['CHANNEL_NAME'])+"</td>"
	                +"<td>"+isNull(n['AGENTID'])+"</td>"
	                /*+"<td>"+isNull(n['DEPT_PTYPE'])+"</td>"*/
	                +"<td>"+isNull(n['COMM_TYPE'])+"</td>"
	                +"<td>"+isNull(n['SUBJECTID'])+"</td>"
	                +"<td>"+isNull(n['SVCTP'])+"</td>"
	                +"<td>"+isNull(n['FEE'])+"</td>"
	                +"<td>"+isNull(n['TOTALFEE'])+"</td>"
	                +"<td>"+isNull(n['NETFEE'])+"</td>"
	                +"<td>"+isNull(n['REMARK'])+"</td>"
	                +"<td><a href='#' bill_id='"+isNull(n['BILL_ID'])+"' fee='"+isNull(n['FEE'])+"' onclick='edit($(this));' style='color:#BA0C0C;'>修改</a></td>"
	                +"<td><a href='#' bill_id='"+isNull(n['BILL_ID'])+"' onclick='del($(this));' style='color:#BA0C0C;'>删除</a></td>"
	                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='13'>暂无数据</td></tr>");
			}
			initTotalFee();
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

function initTotalFee(){
	var workNo = $("#businessKey").val();
	var channel_name=$.trim($("#channel_name").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/fourSupported/four-supported!queryTotalFeeByInitId.action",
		data:{
           "workNo":workNo,
           "channel_name":channel_name
	   	}, 
	   	success:function(data){
	   		$("#totalFee").text(data+"元");
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function edit(obj){
	var bill_id=$(obj).attr("bill_id");
    art.dialog.data('bill_id',bill_id);
	var fee=$(obj).attr("fee")
	$("#fee").val(fee);
	var formdiv=$('#updateFormDiv');
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 400,
		height : 100,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function del(obj){
	var bill_id=obj.attr("bill_id");
	if(confirm('确认刪除吗?')){
	  $.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			async: false,
			url:$("#ctx").val()+"/fourSupported/four-supported!delEdit.action",
			data:{
	           "bill_id":bill_id
		   	}, 
		   	success:function(data){
		   		search(0);
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("出现异常，删除失败！");
		    }
	  });
	}
}

function save(){
	var bill_id=art.dialog.data('bill_id');
	$("#bill_id").val(bill_id);
	var url = $("#ctx").val()+'/fourSupported/four-supported!update.action';
	var updateForm=$('#updateForm');
	updateForm.form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($(this).form('validate')==false){
				return false;
			}
		},
		success:function(data){
			var d = $.parseJSON(data);
			alert(d.msg);
			$('#updateFormDiv').dialog('close');
			search(0);
		}
	});

}
//导入excel
function importExcel() {
	var businessKey = $("#businessKey").val();
	var url = $("#ctx").val()+"/portal/supported/jsp/importExcelFour.jsp";
	art.dialog.data('businessKey',businessKey);
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'未支撑补贴3G审批导入',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/fourSupported/four-supported!downloadTemplate.action";
}
