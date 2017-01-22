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
	//查询下一步骤审批人
	findNextDealer("financeLeaderAudit",4);
	$("#submitTask").click(function(){
		submitTask();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var cost_center_name = $.trim($("#cost_center_name").val());
	var deal_date = $.trim($("#deal_date").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/importCostBudget/import-cost-budget!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "cost_center_name":cost_center_name,
           "deal_date":deal_date
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
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['COST_CENTER_CODE'])+"</td>"
				+"<td>"+isNull(n['COST_CENTER_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_ITEM'])+"</td>"
				+"<td>"+isNull(n['BUDGET_ITEM_CODE'])+"</td>"
				+"<td>"+isNull(n['BUDGET_ITEM_NAME'])+"</td>"
				+"<td>"+isNull(n['BUDGET_MONEY'])+"</td>"
				+"<td>"+isNull(n['ZSB_RATE'])+"</td>"
				+"<td>"+isNull(n['FLAG'])+"</td>"
				+"<td style='color:#007700;'>"+isNull(n['STATUS'])+"</td>";
				var is_confirm = n['ISCONFIM_EN'];
				if(is_confirm==2) {
					content+="<td style='color:#CC0000;'>"+isNull(n['ISCONFIM'])+"</td>" +
							"<td><a href='#' id='"+n['ID']+"' flag='"+n['F']+"' onclick='edit(this);'>修改</a>&nbsp;&nbsp;&nbsp;" +
								"<a href='#' id='"+n['ID']+"' onclick='showReason(this);'>拒绝原因</a></td>";
				} else {
					content+="<td style='color:#CC0000;'>"+isNull(n['ISCONFIM'])+"</td>" +
							"<td><a href='#' id='"+n['ID']+"' flag='"+n['F']+"' onclick='edit(this);'>修改</a></td>";
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//查询
function showReason(ele) {
	var id = $(ele).attr("id");
	art.dialog.data('id',id);
	var url = $("#ctx").val()+"/portal/costManagement/jsp/cost_budget_refuse_info.jsp";
	art.dialog.open(url,{
		id:'refuseInfoDailog',
		width:'450px',
		height:'240px',
		padding:'0 0',
		title:'成本预算拒绝原因',
		lock:true,
		resize:false
	});
}

function edit(ele) {
	var id = $(ele).attr("id");
	var flag = $(ele).attr("flag");
	art.dialog.data('id',id);
	art.dialog.data('flag',flag);
	var url = $("#ctx").val()+"/portal/costManagement/jsp/import_cost_budget_update.jsp";
	art.dialog.open(url,{
		id:'importCostBudgetUpdateDailog',
		width:'610px',
		height:'240px',
		padding:'0 0',
		title:'成本预算修改',
		lock:true,
		resize:false
	});
}

//导入excel
function importExcel() {
	var url = $("#ctx").val()+"/portal/costManagement/jsp/importNewExcel.jsp";
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'600px',
		height:'350px',
		padding:'0 0',
		title:'成本预算导入',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/importCostBudget/import-cost-budget!downloadNewTemplate.action";
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

//下一步审批人
function findNextDealer(taskId,taskFlag) {
	
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = $("#ctx").val()+"/approver/approver-handler!qryMyDepartLeader.action";
	}else {
		url = $("#ctx").val()+"/approver/approver-handler!qryTaskApprover.action";
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:url,
		data:{
     		taskId:taskId,
        	taskFlag:taskFlag
		}, 
	 	success:function(data){
	 		var str = "";
	 		$.each(data,function(i,n){
	 			str += "<option value='"+n.USER_ID+"'>"+n.USER_NAME+"</option>";
			});
	 		$("#nextDealer").html(str);
		 }
	 });
}

//提交审批
function submitTask(){
	if(validate()) {
		art.dialog.confirm("您确定提交审批吗？",function(){
			var actNodeName = $("#nextDealer option:selected").text();
			$("#actNodeName").val(actNodeName);
			$("#taskForm").form("submit",{
				url:$("#ctx").val()+'/importCostBudget/import-cost-budget!doSubmitTask.action',
				onSubmit:function(){
					jQuery.blockUI({
						message: "<div style='text-align:center;'><h2>正在发送中，请稍等...</h2></div>",
						fadeIn: 700,
						centerY: true,
						showOverlay: true
					});	
					return true;
				},
				success:function(data){
					data=eval('('+data+')');
					jQuery.unblockUI();
					if(data.code=='OK') {
						art.dialog({
				   			title: '提示',
				   		    content: "提交成功！",
				   		    icon: 'succeed',
				   		    lock: true,
				   		    ok: function () {
				   		    	search(0);
				   		    }
				   		});
					}
					return false;
				},
			 	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("发送失败！"+errorThrown);
			   	}
	      	});
		},function(){
			art.dialog.tips('执行取消操作');
		});
	}
}

function validate(){
	var flag = true ;
	var nextRouter = $("#nextRouter").val();
	var theme = $.trim($("#theme").val());
	var deal_date = $.trim($("#deal_date").val());
	if(!isNotBlank(theme)) {
		art.dialog.alert("工单主题不能为空！");
		return false;
	}
	if(!isNotBlank(deal_date)) {
		art.dialog.alert("帐期不能为空！");
		return false;
	}
	if(!isNotBlank(nextRouter)){
		art.dialog.alert("下一环节不能为空！");
		return false;
	}
	if(isNeedApprover) {
		if(!isNotBlank($("#nextDealer").val())){
			art.dialog.alert("请选择下一步处理人！");
			flag = false;
		}
	}
	return flag; 
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}