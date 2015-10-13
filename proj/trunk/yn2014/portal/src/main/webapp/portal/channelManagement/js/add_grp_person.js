var orgCode="";
var orgLevel="";

var pageSize = 5;
$(function() {
	/////////////////////////////
	///1
	
	$("#next1").click(function(){
		var devNum=$("#developDatas").find("INPUT[name='ckUnit']:checked").attr("devNum");
		if(devNum!=null||devNum!=''){
			$("#step1,#step3").hide();
			$("#step2").show();
		}else{
			alert("请先选择发展人编码");
			$("#next1").hide();
		}
	});
	////2
	$("#grpType").change(function(){
		$("#next2").show();
	});
	$("#next2").click(function(){
		var grpType=$('#grpType input[name="ckHr"]:checked ').val();
		if(grpType!=null||grpType!=''){
			$("#step1,#step2").hide();
			listHrCode(0);
			$("#step3").show();
		}else{
			alert("请先选择人员类型");
			$("#next2").hide();
		}
	});
	$("#prev2").click(function(){
		$("#step2,#step3").hide();
		$("#step1").show();
	});
	///3
	$("#prev3").click(function(){
		$("#step1,#step3").hide();
		$("#step2").show();
	});
	/*$("#next3").click(function(){
		var hr_id=$("#hrDatas").find("INPUT[name='hrCode']:checked").attr("hr_id");
		if(hr_id!=null||hr_id!=''){
			$("#step1,#step2,#step3").hide();
			$("#step4").show();
		}else{
			alert("请先hr编码");
			$("#next3").hide();
		}
	});
	///4
	$("#prev4").click(function(){
		$("#step1,#step2,#step4").hide();
		$("#step3").show();
	});*/
	/////////////////////////////
	orgCode=$("#orgCode").val();
	orgLevel=$("#orgLevel").val();
	listDevNum(0);
	$("#searchBtn").click(function(){
		listDevNum(0);
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'addGrpPerson'}).close();

	});
	$("#grpType").change(function(){
			getGrpType();
			return true;
	});
	$("#saveBtn").click(function(){
			addGrp();
	});
			
});

//选择发展人类型
function getGrpType(){
	var unit_name=$("#developDatas").find("INPUT[name='ckUnit']:checked").val();
	var grpType=$('#grpType input[name="ckHr"]:checked ').val(); 
	if(unit_name==null || unit_name==''){
		alert("请选择发展人编码！");
		return;
	}
	if(grpType==''||grpType==null){
		alert("请选择发展人类型！");
		return;
	}
	listHrCode(0);
	
}
//hr编码列表
function listHrCode(pageNumber){
	pageNumber = pageNumber + 1;
	var unit_id = $("#developDatas").find("INPUT[name='ckUnit']:checked").val();
	var grpType = $('#grpType input[name="ckHr"]:checked ').val(); 
	var dealDate = $.trim($("#dealDate").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_searchHrNum.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "unit_id" : unit_id,
           "grpType" : grpType,
           "dealDate":dealDate
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
	   			initPagination2(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
	   		  content+="<tr>"
	   		     +"<td id='hr_data'>" +
	   		      "<input type='radio' name='hrCode' hr_id='"+n['HR_ID']+"'>" +
	   		     "</td>"
	   		      +"<td>"+isNull(n['REALNAME'])+"</td>"
	   		      +"<td>"+isNull(n['USERNAME'])+"</td>"
	   		     +"<td>"+isNull(n['HR_ID'])+"</td>"
	   		     content+="</tr>";
			});
	   		
	   		
			if(content != "") {
				$("#hrDatas").empty().html(content);
			}else {
				$("#hrDatas").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
			$("#hrDatas").find("INPUT[name='hrCode']").click(function(){
				$("#next3").show();
			});
	   	}
	});
	
}
function listDevNum(pageNumber) {
	pageNumber = pageNumber + 1;
	var devNum = $("#dev_code").val();
	var unit_name = $("#unit_name").val();
	var dealDate = $.trim($("#dealDate").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_searchDevNum.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "devNum" : devNum,
           "unit_name" : unit_name,
           "orgCode" : orgCode,
           "orgLevel" : orgLevel,
           "dealDate":dealDate
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
	   			initPagination1(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
	   		  content+="<tr>"
	   		     +"<td>" +
	   		      "<input type='radio' name='ckUnit' devNum='"+n['FD_CHNL_CODE']+"'  unit_name='"+n['UNIT_NAME']+"' value='"+n['UNIT_ID']+"'>" +
	   		     "</td>"
	   		     +"<td>"+isNull(n['FD_CHNL_CODE'])+"</td>"
	   		     +"<td>"+isNull(n['UNIT_ID'])+"</td>"
	   		     +"<td>"+isNull(n['UNIT_NAME'])+"</td>"
	   		     content+="</tr>";
			});
	   		
	   		
			if(content != "") {
				$("#developDatas").empty().html(content);
			}else {
				$("#developDatas").empty().html("<tr><td colspan='4'>暂无数据</td></tr>");
			}
			$("#developDatas").find("INPUT[name='ckUnit']").click(function(){
				$("#next1").show();
			});
	   	}
	});
}
function addGrp(){
	var devNum=$("#developDatas").find("INPUT[name='ckUnit']:checked").attr("devNum");
	var hrNum=$("#hrDatas").find("INPUT[name='hrCode']:checked").attr("hr_id");
	var grpType=$("#grpType").find("INPUT[name='ckHr']:checked").val();
	var userName=$("#userName").val();
	var regionCode=$("#regionCode").val();
	var start_time=$.trim($("#startTime").val());
	var dealDate = $.trim($("#dealDate").val());
	
	if(devNum==''||devNum==null){
		alert("发展人编码不能为空，请选择发展人");
		return;
	}
	if(grpType ==''||grpType==null){
		alert(grpType);
		alert("发展人类型不能为空，请选择发展人类型");
		return;
	}
	if(hrNum==''||hrNum==null){
		alert("HR编码不能为空，请选择Hr编码");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_addGrpManager.action",
		data:{
			"devNum":devNum,
			"hrNum":hrNum,
			"grpType":grpType,
			"userName":userName,
			"regionCode":regionCode,
			"dealDate":dealDate
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		if(data&& data>0){
	   			var result=confirm("直销发展人添加成功，请跳转至唯一身份管理，处理当前人信息，是否现在跳转？");
				 if(result){
					 var topWin=window.parent.parent;
					 var win = artDialog.open.origin;//来源页面
   					 win.art.dialog({id: 'addGrpPerson'}).close();
					 var url=$("#ctx").val()+"/portal/channelManagement/jsp/tab_portal_qj_person_list.jsp"; 
					 topWin.openWindow("唯一身份管理",'funMenu',url);
					 //parent.openWindow('唯一身份管理','computer', $("#ctx").val()+'/portal/cannelManagement/jsp/tab_portal_qj_person_list.jsp');
				 }else{
					 var win = artDialog.open.origin;//来源页面
	   					 win.art.dialog({id: 'addGrpPerson'}).close();
	   					 win.search(0);
				 }
	   		}
	   	}
	});
}

function initPagination1(totalCount) {
	 $("#totalCount1").html(totalCount);
	 $("#pagination1").pagination(totalCount, {
      callback: listDevNum,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
	   next_text: '下页',       //下一页按钮里text  
	   num_display_entries: 3, 
	   num_edge_entries: 0
	 });
}

function initPagination2(totalCount) {
	 $("#totalCount2").html(totalCount);
	 $("#pagination2").pagination(totalCount, {
     callback: listHrCode,
     items_per_page:pageSize,
     link_to:"###",
     prev_text: '上页',       //上一页按钮里text  
	   next_text: '下页',       //下一页按钮里text  
	   num_display_entries: 3, 
	   num_edge_entries: 0
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

