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
		url:$("#ctx").val()+"/threeSupported/three-supported!list.action",
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
				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
                +"<td>"+isNull(n['CHANNEL_NAME'])+"</td>"
                +"<td>"+isNull(n['CHANNEL_ID'])+"</td>"
                +"<td>"+isNull(n['FD_CHNL_CODE'])+"</td>"
                +"<td>"+isNull(n['RULE_NAME'])+"</td>"
                +"<td>"+isNull(n['COMM'])+"</td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
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
		url:$("#ctx").val()+"/threeSupported/three-supported!queryTotalFee.action",
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
				url:$("#ctx").val()+'/threeSupported/three-supported!doSubmitTask.action',
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

function cancel() {
	$("#updateFormDiv").dialog('close');
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}

function downsDetail(){
	var title=[["规则名称","规则描述","佣金科目","佣金","用户ID","手机号码","用户生效时间","用户失效时间","入网时间","用户状态","业务状态","地市ID","区县","营业点编码","操作员","活动ID","活动名称","套餐编码","套餐名称","面值（元）","预存款","月套餐费","发展人","渠道类型","BSS侧渠道编码","发展渠道编码","发展渠道名称","支付渠道编码","支付渠道名称","客户名称","联系人","联系电话","证件类型","证件号码","客户类型","证件地址","联系地址","是否单卡","BSS自备机入网","是否机卡匹配","是否客户资料完备","是否三无用户","是否准活卡","实际数据账期","备注"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑3G明细';
	downloadExcel(downSql,title,showtext);
}

function getDetailSql(){
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var remark=$.trim($("#remark").val());
	var where="";
	if(orgLevel==1){
		
	}else{
		where+=" AND T1.GROUP_ID_1='"+region+"'";
	}
	if(remark!=""){
		where+=" AND T1.REMARK LIKE '%"+remark+"%'";
	}
	return "select nvl(t1.bak_1,t1.rule_name) rule_name,t2.rule_desc,t2.commitem,t2.comm,t2.subscription_id,t2.service_num,t2.active_date,                   "+
	"t2.inactive_date,t2.join_date,t2.subs_status,t2.service_status,t2.region_id,t2.county_id,t2.office_id,t2.operation_id,t2.scheme_id,              "+
	"t2.scheme_name,t2.product_id,t2.product_name,t2.card_fee,t2.final_prepayment,t2.product_fee,t2.developer,t2.dept_ptype,t2.bss_channel_id,        "+
	"t2.fd_chnl_id,t2.dev_chnl_name,t2.fd_chnl_code,t2.pay_chnl_name,t2.customer_name,t2.contact_man,t2.contact_phone,t2.cert_type,t2.cert_num,       "+
	"t2.customer_type,t2.cert_addr,t2.contact_addr,t2.signle_card_flag,t2.bss_owner_phone_flag,t2.phone_card_flag,t2.data_full_flag,t2.three_not_flag,"+
	"t2.active_card_flag, t2.actual_cycle,t2.remark4                                                                                                  "+
	"                FROM PMRT.TAB_MRT_COMM_01_HH t1                                                                                                  "+
	"               LEFT JOIN PMRT.TAB_MRT_3G_USER_COMM_HH t2                                                                                         "+
	"                ON (T1.DEAL_DATE = T2.DEAL_DATE AND                                                                                              "+
	"               NVL(T1.REGION_ID, 'x') = NVL(T2.REGION_ID,'x') AND NVL(T1.COUNTY_ID, 'x') = NVL(T2.COUNTY_ID,'x') AND                             "+
	"                NVL(T1.GROUP_ID_1, 'x') = NVL(T2.GROUP_ID_1,'x') AND NVL(T1.GROUP_ID_1_NAME, 'x') = NVL(T2.GROUP_ID_1_NAME,'x') AND              "+
	"                NVL(T1.GROUP_ID_2, 'x') = NVL(T2.GROUP_ID_2,'x') AND NVL(T1.GROUP_ID_2_NAME, 'x') = NVL(T2.GROUP_ID_2_NAME,'x') AND              "+
	"                NVL(T1.GROUP_ID_3, 'x') = NVL(T2.GROUP_ID_3,'x') AND NVL(T1.GROUP_ID_3_NAME, 'x') = NVL(T2.GROUP_ID_3_NAME,'x') AND              "+
	"                NVL(T1.GROUP_ID_4, 'x') = NVL(T2.GROUP_ID_4,'x') AND NVL(T1.CHANNEL_ID, 'x') = NVL(T2.CHANNEL_ID,'x') AND                        "+
	"                NVL(T1.CHANNEL_NAME, 'x') = NVL(T2.CHANNEL_NAME,'x') AND NVL(T1.FD_CHNL_CODE, 'x') = NVL(T2.FD_CHNL_CODE,'x') AND                "+
	"                NVL(T1.PAY_CHNL_NAME, 'x') = NVL(T2.PAY_CHNL_NAME,'x') AND NVL(T1.FD_CHNL_ID, 'x') = NVL(T2.FD_CHNL_ID,'x') AND                  "+
	"                NVL(T1.DEV_CHNL_NAME, 'x') = NVL(T2.DEV_CHNL_NAME,'x') AND NVL(T1.DEPT_PTYPE, 'x') = NVL(T2.DEPT_PTYPE,'x') AND                  "+
	"                NVL(T1.BSS_CHANNEL_ID, 'x') = NVL(T2.BSS_CHANNEL_ID,'x') AND NVL(T1.COMM_SUB, 'x') = NVL(T2.COMM_SUB,'x') AND                    "+
	"                NVL(T1.COMMITEM, 'x') = NVL(T2.COMMITEM,'x') AND NVL(T1.RULE_NAME, 'x') = NVL(T2.RULE_NAME,'x') AND                              "+
	"                NVL(T1.RULE_DESC, 'x') = NVL(T2.RULE_DESC,'x') AND NVL(T1.REMARK, 'x') = NVL(T2.REMARK,'x')) and                                 "+
	"                NVL(T1.group_id_4, 'x') = NVL(T2.group_id_4,'x') AND NVL(T1.group_id_4_name, 'x') = NVL(T2.group_id_4_name,'x')                  "+
	"              WHERE T1.DEAL_DATE=TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND T1.INIT_ID IS NULL                                                      "+  
	   where+
	"               ORDER BY RULE_NAME                                                                                                                ";
}

function downsAll(){
	var title=[["账期","渠道名称","BSS渠道编码","总部渠道编码","佣金科目","佣金金额(元)"]];
	var downSql=getDownSql();
	var showtext = '系统支撑3G汇总';
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
	return "SELECT DEAL_DATE,                                                              "+
	"              CHANNEL_NAME,                                                           "+
	"              CHANNEL_ID,                                                             "+
	"              FD_CHNL_CODE,                                                           "+
	"              NVL(BAK_1, RULE_NAME) RULE_NAME,                                        "+
	"              SUM(COMM) AS COMM,                                                      "+
	"              SUM(MOD_COMM) AS MOD_COMM,                                              "+
	"              COMM_SUB                                                                "+
	"         FROM PMRT.TAB_MRT_COMM_01_HH                                                 "+
	"         WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(SYSDATE,-1), 'yyyymm') AND INIT_ID IS NULL"+
	   where+
	" GROUP BY DEAL_DATE,CHANNEL_NAME,CHANNEL_ID,FD_CHNL_CODE, NVL(BAK_1,RULE_NAME),COMM_SUB ORDER BY COMM_SUB";
}