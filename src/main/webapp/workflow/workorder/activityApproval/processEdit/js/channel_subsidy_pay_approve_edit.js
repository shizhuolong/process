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
				+"<td>"+isNull(n['DEV_CHNL_NAME'])+"</td>"
				+"<td>"+isNull(n['DEPT_TYPE'])+"</td>"
				+"<td>"+isNull(n['INTEGRAL_GRADE'])+"</td>"
				
				+"<td>"+isNull(n['IS_JF'])+"</td>";
				if(taskId&&taskId=="commissionManagerAudit"&&n['INTEGRAL_GRADE']!='D'&&n['INTEGRAL_GRADE']!='待评'){//如果是佣金管理员、渠道等级不为"D"和"待评"
					content+="<td><input type='text' value='"+isNull(n['IS_JF_CX'])+"' /><a href='#' upCx='"+n['UP_JF_CX']+"' hqCode='"+isNull(n['FD_CHNL_ID'])+"' onclick='updateCx(this);'>保存</a>&nbsp;<font color='gray'>(最大:"+isNull(n['UP_JF_CX'])+"分)</font></td>";
					content+="<td><input type='text' value='"+isNull(n['IS_JF_FCX'])+"' /><a href='#' upFcx='"+n['UP_JF_FCX']+"' hqCode='"+isNull(n['FD_CHNL_ID'])+"' onclick='updateFcx(this);'>保存</a>&nbsp;<font color='gray'>(最大:"+isNull(n['UP_JF_FCX'])+"分)</font></td>";
				}else{
					content+="<td>"+isNull(n['IS_JF_CX'])+"</td>";
					content+="<td>"+isNull(n['IS_JF_FCX'])+"</td>";
				}
				content+="<td>"+isNull(n['IS_COMM_CX'])+"</td>"
				+"<td>"+isNull(n['IS_COMM_FCX'])+"</td>"
				+"<td>"+isNull(n['BJ_COMM'])+"</td>"
				+"<td>"+isNull(n['IS_JF_SPLUS'])+"</td>"
				+"<td>"+isNull(n['IS_JF_SPLUS_CX'])+"</td>"
				+"<td>"+isNull(n['IS_JF_SPLUS_FCX'])+"</td>"
				+"<td>"+isNull(n['IS_JF_LJ_DH'])+"</td>"
				+"<td>"+isNull(n['IS_COMM_LJ_DH'])+"</td>"
				+"<td>"+isNull(n['IS_JF_SPLUS_ALL'])+"</td>"
				
				
				+"<td>"+isNull(n['ALL_JF_TOTAL'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_QS'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_YF'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_YFSF'])+"</td>"
				+"<td>"+isNull(n['IS_JF_YZF'])+"</td>"
				+"<td>"+isNull(n['ALL_JF'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_CX'])+"</td>"
				+"<td>"+isNull(n['ALL_JF_FCX'])+"</td>"
				+"<td>"+isNull(n['COMM'])+"</td>"
				+"<td>"+isNull(n['COMM_CX'])+"</td>"
				+"<td>"+isNull(n['COMM_FCX'])+"</td>"
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
function updateCx(a){
	var cx=$.trim($(a).parent().find("INPUT").val());
	var upCx=$(a).attr("upCx");
	
	var hqCode=$(a).attr("hqCode");
	var businessKey=$("#businessKey").val();
	
	var fcx=$.trim($(a).parent().next().find("INPUT").val());
	var upFcx=$(a).parent().next().find("A").attr("upFcx");
	
	updateJF(hqCode,businessKey,cx,upCx,fcx,upFcx);
}
function updateFcx(a){
	var cx=$.trim($(a).parent().prev().find("INPUT").val());
	var upCx=$(a).parent().prev().find("A").attr("upCx");
	
	var hqCode=$(a).attr("hqCode");
	var businessKey=$("#businessKey").val();
	
	var fcx=$.trim($(a).parent().find("INPUT").val());
	var upFcx=$(a).attr("upFcx");
	
	updateJF(hqCode,businessKey,cx,upCx,fcx,upFcx);
}
function updateJF(hqCode,businessKey,cx,upCx,fcx,upFcx){
	if(cx=="") cx=0;
	if(fcx=="") fcx=0;
	if(isNaN(cx)||$.trim(cx)==""){
		alert("请输入数字");
		return;
	}
	if(isNaN(fcx)||$.trim(fcx)==""){
		alert("请输入数字");
		return;
	}
	cx=parseFloat(cx);
	fcx=parseFloat(fcx);
	upCx=parseFloat(upCx);
	upFcx=parseFloat(upFcx);
	
	if(cx>upCx&&cx!=0){
		alert("本期手工录入积分(促销)不能大于最大可录积分（促销）");
		return;
	}
	if(fcx>upFcx&&fcx!=0){
		alert("本期手工录入积分(非促销)不能大于最大可录积分（非促销）");
		return;
	}
	if(cx<0){
		alert("录入积分不能为负积分");
		return;
	}
	if(fcx<0){
		alert("录入积分不能为负积分");
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
	       "cx":cx,
	       "fcx":fcx,
	       "businessKey":businessKey
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
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
	if(obj==0){
		return obj;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}
function downsAll(){
	var businessKey = $("#businessKey").val();
	var channelCode = $.trim($("#channelCode").val());
	
	var sql="";
	sql+=" SELECT                                                       ";
	sql+=" 		   DEAL_DATE,                                           ";
	sql+=" 	       GROUP_ID_1_NAME,                                     ";
	sql+=" 	       UNIT_NAME,                                           ";
	sql+=" 	       FD_CHNL_ID,                                          ";
	sql+=" 	       DEV_CHNL_NAME,                                       ";
	sql+=" 	       DEPT_TYPE,                                           ";
	sql+=" 	       INTEGRAL_GRADE,                                      ";
	sql+=" 	                                                            ";
	sql+=" 	                                                            ";
	sql+=" 	       nvl(IS_JF, 0) IS_JF,                                 ";
	sql+=" 	       nvl(IS_JF_CX, 0) IS_JF_CX,                           ";
	sql+=" 	       NVL(IS_JF_FCX, 0) IS_JF_FCX,                         ";
	sql+=" 	       NVL(IS_COMM_CX, 0) IS_COMM_CX,                       ";
	sql+=" 	       NVL(IS_COMM_FCX, 0) IS_COMM_FCX,                     ";
	sql+=" 	       NVL(BJ_COMM, 0) BJ_COMM,                             ";
	sql+=" 	       NVL(IS_JF_SPLUS, 0) IS_JF_SPLUS,                     ";
	sql+=" 	       nvl(IS_JF_SPLUS_CX, 0) IS_JF_SPLUS_CX,               ";
	sql+=" 	       nvl(IS_JF_SPLUS_FCX, 0) IS_JF_SPLUS_FCX,             ";
	sql+=" 	       NVL(IS_JF_LJ_DH, 0) IS_JF_LJ_DH,                     ";
	sql+=" 	       NVL(IS_COMM_LJ_DH, 0) IS_COMM_LJ_DH,                 ";
	sql+=" 	       NVL(IS_JF_SPLUS_ALL, 0) IS_JF_SPLUS_ALL,             ";
	sql+=" 	                                                            ";
	sql+=" 	       NVL(ALL_JF_TOTAL, 0) ALL_JF_TOTAL,                   ";
	sql+=" 	       nvl(ALL_JF_QS, 0) ALL_JF_QS,                         ";
	sql+=" 	       nvl(ALL_JF_YF, 0) ALL_JF_YF,                         ";
	sql+=" 	       NVL(ALL_JF_YFSF, 0) ALL_JF_YFSF,                     ";
	sql+=" 	       NVL(IS_JF_YZF, 0) IS_JF_YZF,                         ";
	sql+=" 	       NVL(ALL_JF, 0) ALL_JF,                               ";
	sql+=" 	       NVL(ALL_JF_CX, 0) ALL_JF_CX,                         ";
	sql+=" 	       NVL(ALL_JF_FCX, 0) ALL_JF_FCX,                       ";
	sql+=" 	       nvl(COMM, 0) COMM,                                   ";
	sql+=" 	       nvl(COMM_CX, 0) COMM_CX,                             ";
	sql+=" 	       NVL(COMM_FCX, 0) COMM_FCX,                           ";
	sql+=" 	       NVL(UP_JF_CX, 0) UP_JF_CX,                           ";
	sql+=" 	       NVL(UP_JF_FCX, 0) UP_JF_FCX                          ";
	sql+=" 	  FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T                   ";
	sql+="  	  WHERE T.INTEGRAL_SUB = 1                              ";
	sql+=" 	  AND T.INIT_ID ='"+businessKey+"'                          ";
	
	
	if(channelCode&&channelCode!=""){
		sql+=" 	 	AND T.FD_CHNL_ID='"+channelCode+"'                  ";
	}                                                                 
	
	
	sql+=" 	 ORDER BY DEV_CHNL_NAME,FD_CHNL_ID ASC                    ";
	
	var title=[["账期","地市","营服中心","渠道编码","渠道名称","渠道属性","渠道等级",
	            
	            "本期手工录入积分合计","本期手工录入积分(促销)","本期手工录入积分(非促销)",
	            "本期录入折算金额(促销)","本期录入折算金额(非促销)","本期补结金额","本年未兑换总积分",
	            "本年未兑换总积分(促销)","本年未兑换总积分(非促销)",
	            "自201506累计已兑换总积分","自201506累计已兑换总金额","自201506累计剩余未兑积分",
	            
	            "本月计算积分","本月清算积分","本月延付积分","本月延付释放积分",
	            "本月预支付积分","本月实算积分","本月实算积分(促销)","本月实算积分(非促销)",
	            "本月实算金额","本月实算金额(促销)","本月实算金额(非促销)",
	            
	            "最大可录积分（促销）","最大可录积分(非促销)"
	            ]];
	var showtext =$("#workTitle").val();
	downloadExcel(sql,title,showtext);
}