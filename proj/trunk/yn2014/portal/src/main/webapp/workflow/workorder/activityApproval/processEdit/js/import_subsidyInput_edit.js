var isNeedApprover = true;
var pageSize = 10;
$(function(){
	search(0);
	$("#downExcelTemp").click(function(){
		downExcelTemp();
	});
	$("#importExcel").click(function(){
		importExcel();
	});
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var businessKey = $("#businessKey").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/subsidyInput/subsidy-input!listByWorkNo.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
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
				+"<td>"+isNull(n['DEVELOP_CHNL_CODE'])+"</td>"
                +"<td>"+isNull(n['DEVELOP_CHNL_NAME'])+"</td>"
                +"<td>"+isNull(n['PAY_CHNL_CODE'])+"</td>"
                +"<td>"+isNull(n['PAY_CHNL_NAME'])+"</td>"
                +"<td>"+isNull(n['BILLINGCYCLID'])+"</td>"
                +"<td>"+isNull(n['CUST_TYPE'])+"</td>"
                +"<td>"+isNull(n['SUBSIDY_TYPE'])+"</td>"
                +"<td>"+isNull(n['SUBSIDY_WAY'])+"</td>"
                +"<td>"+isNull(n['SUBSIDY_FEE'])+"</td>"
                +"<td><a href='#' seque_no='"+isNull(n['SEQUE_NO'])+"' subsidy_type='"+isNull(n['SUBSIDY_TYPE'])+"' subsidy_way='"+isNull(n['SUBSIDY_WAY'])+"' subsidy_fee='"+isNull(n['SUBSIDY_FEE'])+"' onclick='edit($(this));' style='color:#BA0C0C;'>修改</a></td>"
                +"<td><a href='#' seque_no='"+isNull(n['SEQUE_NO'])+"' onclick='del($(this));' style='color:#BA0C0C;'>删除</a></td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='11'>暂无数据</td></tr>");
			}
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

function edit(obj){
	var seque_no=$(obj).attr("seque_no");
    art.dialog.data('seque_no',seque_no);
	var subsidy_type=$(obj).attr("subsidy_type");
	var subsidy_way=$(obj).attr("subsidy_way");
	var subsidy_fee=$(obj).attr("subsidy_fee");
	$("#subsidy_type").val(subsidy_type);
	$("#subsidy_way").val(subsidy_way);
	$("#subsidy_fee").val(subsidy_fee);
	var formdiv=$('#updateFormDiv');
	formdiv.show();
	formdiv.dialog({
		title : '修改',
		width : 400,
		height : 200,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function del(obj){
	var seque_no=obj.attr("seque_no");
	if(confirm('确认刪除吗?')){
	  $.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			async: false,
			url:$("#ctx").val()+"/subsidyInput/subsidy-input!delEdit.action",
			data:{
	           "seque_no":seque_no
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
	var seque_no=art.dialog.data('seque_no');
	var subsidy_type=$("#subsidy_type").val();
	var subsidy_way=$("#subsidy_way").val();
	var subsidy_fee=$("#subsidy_fee").val();
	$("#seque_no").val(seque_no);
	var url = $("#ctx").val()+'/subsidyInput/subsidy-input!update.action';
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
			if(subsidy_type==""||subsidy_way==""){
				alert("下拉选项能不为空,请选择！");
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
	art.dialog.data('businessKey',businessKey);
	var url = $("#ctx").val()+"/portal/subsidyInput/jsp/importExcel.jsp";
	art.dialog.open(url,{
		id:'importExcelDailog',
		width:'530px',
		height:'300px',
		padding:'0 0',
		title:'渠道补贴',
		lock:true,
		resize:false
	});
}

//下载模板
function downExcelTemp() {
	location.href = $("#ctx").val()+"/subsidyInput/subsidy-input!downloadTemplate.action";
}
