var isNeedApprover = true;//
var pageSize = 10;
var curPage=0;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

function search(pageNumber) {
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	var channelCode = $.trim($("#channelCode").val());
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelSubsidyPay/channel-subsidy-pay!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "channelCode":channelCode,
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
	   		var taskId=$("#workTaskId").val();
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['FD_CHNL_ID'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_4_NAME'])+"</td>";
				if(taskId&&taskId=="commissionManagerAudit"){//如果是佣金管理员
					content+="<td><input type='text' value='"+isNull(n['IS_JF'])+"' /><a href='#' hqCode='"+isNull(n['FD_CHNL_ID'])+"' onclick='updateJF(this);'>保存</a></td>";
				}else{
					content+="<td>"+isNull(n['IS_JF'])+"</td>";
				}
				content+="<td>"+isNull(n['IS_JF_JE'])+"</td>"
				+"<td>"+isNull(n['IS_JF_LJ_ALL'])+"</td>"
				+"<td>"+isNull(n['IS_JF_SPLUS_ALL'])+"</td>"
				+"<td>"+isNull(n['IS_COMM_LJ_ALL'])+"</td>"
				+"<td>"+isNull(n['DEPT_TYPE'])+"</td>"
				+"<td>"+isNull(n['INTEGRAL_GRADE'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_TOTAL'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_QS'])+"</td>"
				+"<td>"+isNull(n['MON_JF'])+"</td>"
				+"<td>"+isNull(n['MON_JE'])+"</td>"////////////
				+"<td>"+isNull(n['LJ_JF_TOTAL'])+"</td>"
				+"<td>"+isNull(n['LJ_JF_QS'])+"</td>"
				+"<td>"+isNull(n['LJ_JF_DH'])+"</td>"
				+"<td>"+isNull(n['LJ_BN_JE'])+"</td>"
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='12'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function updateJF(a){
	var isJf=$.trim($(a).parent().find("INPUT").val());
	var businessKey=$("#businessKey").val();
	var hqCode=$(a).attr("hqCode");
	if(isNaN(isJf)||$.trim(isJf)==""){
		alert("请输入数字");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/channelSubsidyPay/channel-subsidy-pay!updateJf.action",
		data:{
	       "hqCode":hqCode,
	       "isJf":isJf,
	       "businessKey":businessKey
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			//return;
	   		}
	   		search(curPage);
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
function downsAll(){
	var businessKey = $("#businessKey").val();
	var channelCode = $.trim($("#channelCode").val());
	
	var sql="";
	sql+=" SELECT DEAL_DATE,                                                         ";
	sql+=" 	       GROUP_ID_1_NAME,                                                  ";
	sql+=" 	       UNIT_NAME,                                                        ";
	sql+=" 	       HR_ID,                                                            ";
	sql+=" 	       HR_ID_NAME,                                                       ";
	sql+=" 	       FD_CHNL_ID,                                                       ";
	sql+=" 	       GROUP_ID_4_NAME,                                                  ";
	sql+=" 	       IS_JF,                                                            ";
	sql+=" 	                                                                         ";
	sql+=" 	                                                                         ";
	sql+=" 	       CASE                                                              ";
	sql+=" 			   WHEN T.HZ_MONTH <= 3 THEN                                  ";
	sql+=" 			    1.3 * nvl(IS_JF, 0) * 5 * 0.7                                ";
	sql+=" 			   WHEN T.HZ_MONTH > 3 THEN                                   ";
	sql+=" 			    CASE                                                         ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'S' THEN                           ";
	sql+=" 			       1.3 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'A' THEN                           ";
	sql+=" 			       1.2 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'B' THEN                           ";
	sql+=" 			       1.1 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'C' THEN                           ";
	sql+=" 			       1.0 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			    end                                                          ";
	sql+=" 			                                                                 ";
	sql+=" 			   ELSE                                                          ";
	sql+=" 			    0                                                            ";
	sql+=" 		   END IS_JF_JE,                                                     ";
	sql+=" 		                                                                     ";
	sql+=" 		                                                                     ";
	sql+=" 	       nvl(IS_JF_LJ_ALL,0)+nvl(IS_JF,0) IS_JF_LJ_ALL,                    ";
	sql+=" 	                                                                         ";
	sql+=" 	                                                                         ";
	sql+=" 	       nvl(IS_COMM_LJ_ALL,0)                                             ";
	sql+=" 	       +                                                                 ";
	sql+=" 	       CASE                                                              ";
	sql+=" 			   WHEN T.HZ_MONTH <= 3 THEN                                  ";
	sql+=" 			    1.3 * nvl(IS_JF, 0) * 5 * 0.7                                ";
	sql+=" 			   WHEN T.HZ_MONTH > 3 THEN                                   ";
	sql+=" 			    CASE                                                         ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'S' THEN                           ";
	sql+=" 			       1.3 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'A' THEN                           ";
	sql+=" 			       1.2 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'B' THEN                           ";
	sql+=" 			       1.1 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			      WHEN T.INTEGRAL_GRADE = 'C' THEN                           ";
	sql+=" 			       1.0 * nvl(IS_JF, 0) * 5 * 1 + nvl(BJ_COMM, 0)             ";
	sql+=" 			    end                                                          ";
	sql+=" 			                                                                 ";
	sql+=" 			   ELSE                                                          ";
	sql+=" 			    0                                                            ";
	sql+=" 		   END IS_COMM_LJ_ALL,                                               ";
	sql+=" 		                                                                     ";
	sql+=" 	       nvl(IS_JF_SPLUS_ALL,0)-nvl(IS_JF,0) IS_JF_SPLUS_ALL,              ";
	sql+=" 	       DEPT_TYPE,                                                        ";
	sql+=" 	       INTEGRAL_GRADE,                                                   ";
	sql+=" 	       nvl(ALL_JF_TOTAL, 0) ALL_JF_TOTAL,                                ";
	sql+=" 	       nvl(ALL_JF_QS, 0) ALL_JF_QS,                                      ";
	sql+=" 	       NVL(ALL_JF_TOTAL, 0) + NVL(ALL_JF_QS, 0) MON_JF,                  ";
	sql+=" 	       DECODE(INTEGRAL_GRADE, 'D', NULL, NVL(COMM, 0)) MON_JE,           ";
	sql+=" 	       NVL(LJ_JF_TOTAL, 0) LJ_JF_TOTAL,                                  ";
	sql+=" 	       NVL(LJ_JF_QS, 0) LJ_JF_QS,                                        ";
	sql+=" 	       NVL(LJ_JF_DH, 0) LJ_JF_DH,                                        ";
	sql+=" 	       DECODE(INTEGRAL_GRADE, 'D', NULL, NVL(LJ_COMM, 0)) LJ_BN_JE       ";
	sql+=" 	  FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T                                ";
	sql+="  	  WHERE T.INTEGRAL_SUB = 1                                           ";
	sql+=" 	  AND T.INIT_ID ='"+businessKey+"'                                       ";
	
	
	if(channelCode&&channelCode!=""){
		sql+=" 	 	AND T.FD_CHNL_ID='"+channelCode+"'                               ";
	}                                                                 
	
	
	sql+=" 	 ORDER BY GROUP_ID_4_NAME,FD_CHNL_ID ASC                                 ";
	
	
	
	var title=[["账期","地市","营服中心","HR编码","人员姓名","渠道编码","渠道名称",
	            "手工兑换积分","手工兑换金额","累计已兑积分","累计剩余积分","累计已兑金额",
	            "渠道属性","渠道等级","本月积分","本月清算积分","本月可兑积分","本月可兑金额",
	            "本半年累计积分","本半年累计清算积分","本半年累计可兑积分","本半年累计可兑金额"]];
	var showtext =$("#workTitle").val();
	downloadExcel(sql,title,showtext);
}