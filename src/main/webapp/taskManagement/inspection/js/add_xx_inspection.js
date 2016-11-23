var pageSize = 7;
$(function(){
	searchXXPerson(0);
	$("#searchBtn").click(function(event){
		event.preventDefault();
		searchXXPerson(0);
	});
	$("#resetBtn").click(function(event){
		event.preventDefault();
		$("#realName").val("");
		$("#userName").val("");
		$("#phone").val("");
	});
});
var userId = "";
var realName = "";
var userName = "";
var phone = "";
var pLevel = "";
var pCode = "";
//查询人员
function searchXXPerson(pageNumber) {
	pageNumber = pageNumber + 1;
	var qrealName = $.trim($("#realName").val());
	var quserName = $.trim($("#userName").val());
	var qphone = $.trim($("#phone").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryHdPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "realName":qrealName,
           "userName":quserName,
           "phone":qphone
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
	   			content+="<tr>";
	   			if(i==0) {
	   				content += "<td><input type='radio' onclick='getXXChanlMsg(this);' name='person' id='"+n['ID']+"' realName='"+n['REALNAME']+"' userName='"+n['USERNAME']+"' phone='"+n['PHONE']+"' pLevel='"+n['ORGLEVEL']+"' pCode='"+n['CODE']+"' checked='true'></td>";
	   				userId = n['ID'];
	   				realName = n['REALNAME'];
	   				userName = n['USERNAME'];
	   				phone = n['PHONE'];
	   				pLevel = n['ORGLEVEL'];
	   				pCode = n['CODE'];
	   			} else {
	   				content += "<td><input type='radio' onclick='getXXChanlMsg(this);' name='person' id='"+n['ID']+"' realName='"+n['REALNAME']+"' userName='"+n['USERNAME']+"' phone='"+n['PHONE']+"' pLevel='"+n['ORGLEVEL']+"' pCode='"+n['CODE']+"'></td>";
	   			}
	   			content+="<td>"+isNull(n['REALNAME'])+"</td>"
				+"<td>"+isNull(n['USERNAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				content+="</tr>";
			});
			if(content != "") {
				$("#inspection_person_data").empty().html(content);
			}else {
				$("#inspection_person_data").empty().html("<tr><td colspan='3'>暂无数据</td></tr>");
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
     callback: searchXXPerson,
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

function getXXChanlMsg(ele) {
	userId = $(ele).attr("id");
	realName = $(ele).attr("realName")
	userName = $(ele).attr("userName");
	phone = $(ele).attr("phone");
	pLevel = $(ele).attr("pLevel");
	pCode = $(ele).attr("pCode");
}
//验证输入框输入值
function valid(obj) {
	var id = $(obj).attr("id");
	  $("#"+id).keyup(function(e){
 		var event = e.srcElement ? e.srcElement:e.target;
    	 //响应鼠标事件，允许左右方向键移动 
    	 if(event.keyCode == 37 | event.keyCode == 39){ 
             return; 
         }
    	 $(this).val($(this).val().replace(/[^\d]|(^0\d)/g,''));
     });
	  $("#"+id).blur(function(e){
 		var event = e.srcElement ? e.srcElement:e.target;
    	 //响应鼠标事件，允许左右方向键移动 
    	 if(event.keyCode == 37 | event.keyCode == 39){ 
             return; 
         }
    	 $(this).val($(this).val().replace(/[^\d]|(^0\d)/g,''));
     });
}

function toDate(str){
    var sd=str.split("-");
    return new Date(sd[0],sd[1],sd[2]);
}

function closeXXDialog() {
	window.parent.closeWindow("添加信息收集任务");
}

function addXXInpec() {
	art.dialog.confirm('您确定要执行该操作吗？',function(){
		var inspecName = $.trim($("#inspecName").val());
		var startTime = $.trim($("#startTime").val());
		var endTime = $.trim($("#endTime").val());
		var inspecNesc = $.trim($("#inspecDesc").val());
		var taskCodes="";
		$("INPUT[name='taskCode']:checked").each(function(){
			if(taskCodes.length>0) taskCodes+=",";
			taskCodes+=$(this).val();
		});
		if(inspecName == "") {
			art.dialog.alert("巡检任务名称不能为空！");
			return;
		}
		if(startTime == "") {
			art.dialog.alert("巡检任务开始时间不能为空！");
			return;
		}
		if(endTime == "") {
			art.dialog.alert("巡检任务结束时间不能为空！");
			return;
		}
		var a = toDate(startTime);
		var b = toDate(endTime);
		if(b < a) {
			art.dialog.alert("结束时间不能小于起始时间！");
			return;
		}
		jQuery.blockUI({
			message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
			fadeIn: 700,
			centerY: true,
			showOverlay: true
		});
		
		var taskInfo = '{taskInfo:[';
			taskInfo += '{"inspec_type":"3","inspec_name":"'+inspecName+'","start_time":"'+startTime+'","end_time":"'+endTime+'","remark":"'+inspecNesc+'",';
			taskInfo += '"chanl_name":"",';
			taskInfo += '"hq_chanl_id":"",';
			taskInfo += '"r_user_name":"'+realName+'",';
			taskInfo += '"r_phone":"'+phone+'",';
			taskInfo += '"inspec_sum":"1",';
			taskInfo += '"r_user_id":"'+userId+'",';
			taskInfo += '"r_user_region":"'+pCode+'",';
			taskInfo += '"chanl_type":"'+taskCodes+'",';
			taskInfo += '"r_user_region_level":"'+pLevel+'"},';
		taskInfo = taskInfo.substring(0,taskInfo.lastIndexOf(","));
		taskInfo += "]}";
		$("#taskInfoJsonStr").val(taskInfo);
		$('#spectionFrom').form('submit', {
		    url:$("#ctx").val()+"/taskManagement/chanlInspection_saveXXInspection.action",
		    success:function(data){
				jQuery.unblockUI();
				data=eval('('+data+')');
				if(data.code=='OK') {
					art.dialog({
			   			title: '提示',
			   		    content: data.msg,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
				   		    window.parent.tab.items.each(function(item){
				   		        if(item.title=="渠道巡检"){
				   		            var id = item.getItemId();
				   		            window.parent.frames[id].location.reload();
				   		        }
				   		    });
			   		    	window.parent.closeWindow("添加信息收集任务");
			   		    }
			   		});
				}else {
					art.dialog.alert(data.msg);
				}
	    	},
	    	error: function(XMLHttpRequest, textStatus, errorThrown) {
	    		jQuery.unblockUI();
	            art.dialog.alert("新增失败！"+errorThrown);
	        }
		});
	},function(){
		//art.dialog.tips('执行取消绑定操作');
	});
}