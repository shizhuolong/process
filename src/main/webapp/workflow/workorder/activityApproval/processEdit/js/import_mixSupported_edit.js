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
	var businessKey = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/mixSupported/mix-supported!listByWorkNo.action",
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
	var remark=$.trim($("#remark").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
		url:$("#ctx").val()+"/mixSupported/mix-supported!queryTotalFeeByInitId.action",
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
function downsDetail(){
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","渠道编码","渠道名称","佣金科目","用户编码","电话号码","套餐名称","业务类型","创建时间","生效时间","失效时间","佣金"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑融合明细';
	downloadExcel(downSql,title,showtext);
}

function getDetailSql(){
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql= "select billingcyclid,pay_chnl_id,pay_chnl_name,dev_chnl_code,dev_chnl_name,agentid,group_id_4_name,remark,subscription_id,svcnum,"
	  +"product_name,net_type,to_char(create_time,'yyyy-mm-dd hh24:mi:ss') as create_time,to_char(active_time,'yyyy-mm-dd hh24:mi:ss') as active_time,"
	  +"to_char(inactive_time,'yyyy-mm-dd') as inactive_time,fee from PMRT.TAB_MRT_COMM_FLOW_MON"
	  +"              WHERE INIT_ID ='"+workNo+"'";
	if(remark!=""){
		sql+=" AND REMARK LIKE '%"+remark+"%'";
	}
	return sql;
}

function downsAll(){
	var title=[["结算帐期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","佣金科目","佣金"]];
	var downSql=getDownSql();
	var showtext = '系统支撑融合汇总';
	downloadExcel(downSql,title,showtext);
}

function getDownSql(){//汇总导出
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql="SELECT BILLINGCYCLID,PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_CODE," +
			"DEV_CHNL_NAME,REMARK,SUM(FEE) COMM"+
			" FROM PMRT.TAB_MRT_COMM_FLOW_MON " +
	        "WHERE INIT_ID = '"+workNo+"'";
	if(remark!=""){
		sql+=" AND REMARK LIKE '%"+remark+"%'";
	}
	sql+=" GROUP BY BILLINGCYCLID,PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_CODE,DEV_CHNL_NAME,REMARK";
	return sql;
}