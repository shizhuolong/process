var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	
	//查询下一步骤审批人
	findNextDealer("departmentManager","2");
	$("#submitTask").click(function(){
		submitTask();
	});
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var remark=$.trim($("#remark").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/mixSupported/mix-supported!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.remark":remark
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
                +"<td>"+isNull(n['PAY_CHNL_ID'])+"</td>"
                +"<td>"+isNull(n['PAY_CHNL_NAME'])+"</td>"
                +"<td>"+isNull(n['DEV_CHNL_CODE'])+"</td>"
                +"<td>"+isNull(n['DEV_CHNL_NAME'])+"</td>"
                +"<td>"+isNull(n['REMARK'])+"</td>"
                +"<td>"+isNull(n['COMM'])+"</td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='7'>暂无数据</td></tr>");
			}
			initTotalFee();
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function initTotalFee(){
	var remark=$.trim($("#remark").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,//true是异步，false是同步
		cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
		url:$("#ctx").val()+"/mixSupported/mix-supported!queryTotalFee.action",
		data:{
	         "resultMap.remark":remark
		},
		success:function(data){
	   		$("#totalFee").text(data+"元");
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
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

//下一步审批人
function findNextDealer(taskId,taskFlag) {
	var url = "";
	if(taskFlag == '4') {	//查本部门领导
		url = $("#ctx").val()+"/approver/approver-handler!DepartmentManager.action";
	}else {
		//查询节点上配置的人员
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
				url:$("#ctx").val()+'/mixSupported/mix-supported!doSubmitTask.action',
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
	if(!isNotBlank(theme)) {
		art.dialog.alert("工单主题不能为空！");
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

function downsDetail(){
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","渠道编码","渠道名称","佣金科目","用户编码","电话号码","套餐名称","业务类型","创建时间","生效时间","失效时间","佣金"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑融合明细';
	downloadExcel(downSql,title,showtext);
}

function getDetailSql(){
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var remark=$.trim($("#remark").val());
	var where="";
	if(orgLevel==1){
		
	}else{
		where+=" AND GROUP_ID_1='"+region+"'";
	}
	if(remark!=""){
		where+=" AND REMARK LIKE '%"+remark+"%'";
	}
	
	return "select billingcyclid,pay_chnl_id,pay_chnl_name,dev_chnl_code,dev_chnl_name,agentid,group_id_4_name,remark,subscription_id,svcnum,"
	  +"product_name,net_type,to_char(create_time,'yyyy-mm-dd hh24:mi:ss') as create_time,to_char(active_time,'yyyy-mm-dd hh24:mi:ss') as active_time,"
	  +"to_char(inactive_time,'yyyy-mm-dd') as inactive_time,fee from PMRT.TAB_MRT_COMM_FLOW_MON"
	  +"              WHERE billingcyclid=TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND INIT_ID IS NULL"+
	  where;
}

function downsAll(){
	var title=[["结算帐期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","佣金科目","佣金"]];
	var downSql=getDownSql();
	var showtext = '系统支撑融合汇总';
	downloadExcel(downSql,title,showtext);
}

function getDownSql(){//汇总导出
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var remark=$.trim($("#remark").val());
	var where="";
	if(orgLevel==1){
		
	}else{
		where+=" AND GROUP_ID_1='"+region+"'";
	}
	if(remark!=""){
		where+=" AND REMARK LIKE '%"+remark+"%'";
	}
	return "SELECT BILLINGCYCLID,PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_CODE," +
			"DEV_CHNL_NAME,REMARK,SUM(FEE) COMM"+
			" FROM PMRT.TAB_MRT_COMM_FLOW_MON "                                             +
	        "WHERE billingcyclid=TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND INIT_ID IS NULL"+
	   where+
	   " GROUP BY BILLINGCYCLID,PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_CODE,DEV_CHNL_NAME,REMARK";
}