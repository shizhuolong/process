var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	/*$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	$("#importExcel").click(function(){
		importExcel();
	});*/
	
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
		url:$("#ctx").val()+"/twoSupported/two-supported!listByWorkNo.action",
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
		url:$("#ctx").val()+"/twoSupported/two-supported!queryTotalFeeByInitId.action",
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
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","渠道编码","渠道名称","用户编码","电话号码","佣金科目","佣金类别","业务类别","佣金金额(元)","操作员工编码","员工名称","第一个月发展量","第二个月发展量","第三个月发展量","执行月发展量","前三个月发展平均量"]];
	var downSql=getDetailSql();
	var showtext = '系统支撑2G明细';
	downloadExcel(downSql,title,showtext);
}

function getDetailSql(){
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql= "SELECT BILLINGCYCLID,                         "+
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
	"  FROM PMRT.TAB_MRT_COMM_2G_AUDIT WHERE INIT_ID = '"+workNo+"'";
	if(remark!=""){
		sql+=" AND REMARK1 LIKE '%"+remark+"%'";
	}
	return sql;
}

function downsAll(){
	var title=[["结算账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","佣金类别","佣金金额"]];
	var downSql=getDownSql();
	var showtext = '系统支撑2G汇总';
	downloadExcel(downSql,title,showtext);
}

function getDownSql(){//汇总导出
	var workNo = $("#businessKey").val();
	var remark=$.trim($("#remark").val());
	var sql="SELECT BILLINGCYCLID,                                                     "+
	"PAY_CHNL_ID,PAY_CHNL_NAME,DEV_CHNL_ID,                                           "+
	"DEV_CHNL_NAME,REMARK1,SUM(FEE) COMM                                              "+
	"FROM PMRT.TAB_MRT_COMM_2G_AUDIT                                                  "+
	"WHERE INIT_ID ='"+workNo+"'";
	if(remark!=""){
		sql+=" AND REMARK1 LIKE '%"+remark+"%'";
	}
	sql+=" GROUP BY PAY_CHNL_ID,BILLINGCYCLID,PAY_CHNL_NAME,DEV_CHNL_ID,DEV_CHNL_NAME,REMARK1";
	return sql;
}
/*function edit(obj){
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
			url:$("#ctx").val()+"/twoSupported/two-supported!delEdit.action",
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
	var url = $("#ctx").val()+'/twoSupported/two-supported!update.action';
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
	var url = $("#ctx").val()+"/portal/supported/jsp/importExcel.jsp";
	art.dialog.data('businessKey',businessKey);
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'未支撑补贴2G审批导入',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/twoSupported/two-supported!downloadTemplate.action";
}
*/