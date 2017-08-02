var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var remark=$.trim($("#remark").val());
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/fourSupported/four-supported!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.remark":remark,
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
					+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
	                +"<td>"+isNull(n['CHANNEL_NAME'])+"</td>"
	                +"<td>"+isNull(n['CHANNEL_ID'])+"</td>"
	                +"<td>"+isNull(n['FD_CHNL_ID'])+"</td>"
	                +"<td>"+isNull(n['BAK_1'])+"</td>"
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

function initTotalFee(){
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/fourSupported/four-supported!queryTotalFeeByInitId.action",
		data:{
           "workNo":workNo,
           "resultMap.remark":remark
	   	}, 
	   	success:function(data){
	   		$("#totalFee").text(data+"元");
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function downsDetail(){
	var title=[["规则名称","规则描述","佣金科目","佣金","用户ID","手机号码","BSS编码","目标套餐名","实际套餐名","目标套餐ID","实际套餐ID","目标套餐月费","实际套餐月费","套餐生效时间","套餐结束时间"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑4G明细';
	downloadExcel(downSql,title,showtext);
}

function getDetailSql(){
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql= "SELECT DISTINCT NVL(T1.BAK_1, T1.REMARK) AS BAK_1,T2.RULE_DESC,T2.COMMITEM,                                       "+
	"							T2.COMM,T2.SUBSCRIPTION_ID,T2.SERVICE_NUM,T2.CHANNEL_NAME,T2.CHANNEL_ID,                      "+
	"							T2.PRODUCT_NAME_OLD,T2.PRODUCT_NAME,T2.PRODUCT_ID_OLD,                                        "+
	"							T2.PRODUCT_ID,T2.PRODUCT_FEE_OLD,T2.PRODUCT_FEE,T2.PRODUCT_END_DATE,T2.PRODUCT_START_DATE     "+
	"							FROM PMRT.TAB_MRT_COMM_4G_HH T1 LEFT JOIN PMRT.TAB_MRT_4G_USER_COMM_HH T2                     "+
	"							ON (T1.DEAL_DATE = T2.DEAL_DATE AND T1.FD_CHNL_ID = T2.FD_CHNL_ID AND t1.bak_1 = t2.rule_name)"+
	"              WHERE T1.INIT_ID ='"+workNo+"'"; 
	if(remark!=""){
		sql+=" AND REMARK LIKE '%"+remark+"%'";
	}
	return sql;
}

function downsAll(){
	var title=[["帐期","总部发展渠道编码","发展渠道名称","佣金科目","佣金规则描述","佣金金额"]];
	var downSql=getDownSql();
	var showtext = '系统支撑4G汇总';
	downloadExcel(downSql,title,showtext);
}

function getDownSql(){//汇总导出
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql= "SELECT DEAL_DATE,       "+
	"       CHANNEL_NAME,             "+
	"       CHANNEL_ID,               "+
	"       FD_CHNL_ID,               "+
	"       NVL(BAK_1,REMARK) BAK_1,  "+
	"       SUM(COMM) AS COMM,        "+
	"       SUM(MOD_COMM) AS MOD_COMM,"+
	"       COMM_SUB                  "+
	"         FROM PMRT.TAB_MRT_COMM_4G_HH"+
	"         WHERE INIT_ID ='"+workNo+"'";
	if(remark!=""){
		sql+=" AND REMARK LIKE '%"+remark+"%'";
	}
	sql+=" GROUP BY DEAL_DATE,CHANNEL_NAME,CHANNEL_ID,FD_CHNL_ID,NVL(BAK_1, REMARK),COMM_SUB ORDER BY COMM_SUB";
    return sql;
}
