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
		url:$("#ctx").val()+"/twoSupported/two-supported!list.action",
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
                +"<td>"+isNull(n['DEV_CHNL_ID'])+"</td>"
                +"<td>"+isNull(n['DEV_CHNL_NAME'])+"</td>"
                +"<td>"+isNull(n['REMARK1'])+"</td>"
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
		url:$("#ctx").val()+"/twoSupported/two-supported!queryTotalFee.action",
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

function downsDetail(){
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","渠道编码","渠道名称","用户编码","电话号码","佣金科目","佣金类别","业务类别","佣金金额(元)","操作员工编码","员工名称","第一个月发展量","第二个月发展量","第三个月发展量","执行月发展量","前三个月发展平均量"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑2G明细';
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
		where+=" AND REMARK1 LIKE '%"+remark+"%'";
	}
	return "SELECT BILLINGCYCLID,                           "+
	"       PAY_CHNL_ID,                                    "+
	"       PAY_CHNL_NAME,                                  "+
	"       DEV_CHNL_ID,                                    "+
	"       DEV_CHNL_NAME,                                  "+
	"       AGENTID,                                        "+
	"       GROUP_ID_4_NAME,                                "+
	"       SUBSCRBID,                                      "+
	"       SVCNUM,                                         "+
	"       REMARK,                                         "+
	"       REMARK1,                                        "+
	"       NET_TYPE,                                       "+
	"       FEE,                                            "+
	"       NVL(OPERATOR_ID, '') OPERATOR_ID,               "+
	"       NVL(USER_NAME, '') USER_NAME,                   "+
	"       DECODE(COUNT1, NULL, '', COUNT1) COUNT1,        "+
	"       DECODE(COUNT2, NULL, '', COUNT2) COUNT2,        "+
	"       DECODE(COUNT3, NULL, '', COUNT3) COUNT3,        "+
	"       DECODE(COUNT4, NULL, '', COUNT4) COUNT4,        "+
	"       DECODE(AVG_COUNT, NULL, '', AVG_COUNT) AVG_COUNT"+
	"  FROM PMRT.TAB_MRT_COMM_2G_AUDIT WHERE BILLINGCYCLID=  "+
	"TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND INIT_ID IS NULL"
	+where;
}

function downsAll(){
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","佣金类别","佣金金额"]];
	var downSql=getDownSql();
	var showtext = '系统支撑2G汇总';
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
		where+=" AND REMARK1 LIKE '%"+remark+"%'";
	}
	
	return "SELECT BILLINGCYCLID,                                                     "+
	"PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_ID,                                           "+
	"DEV_CHNL_NAME,REMARK1,SUM(FEE) COMM                                              "+
	"FROM PMRT.TAB_MRT_COMM_2G_AUDIT                                                  "+
	"WHERE BILLINGCYCLID=TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND INIT_ID IS NULL"+
	   where+
	" GROUP BY PAY_CHNL_ID,BILLINGCYCLID,PAY_CHNL_NAME,DEV_CHNL_ID,DEV_CHNL_NAME,REMARK1";
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
				url:$("#ctx").val()+'/twoSupported/two-supported!doSubmitTask.action',
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