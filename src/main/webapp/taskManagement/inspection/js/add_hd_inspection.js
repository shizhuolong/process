var pageSize = 7;
$(function(){
	searchHdPerson(0);
	$("#searchBtn").click(function(event){
		event.preventDefault();
		searchHdPerson(0);
	});
	$("#resetBtn").click(function(event){
		event.preventDefault();
		$("#realName").val("");
		$("#userName").val("");
		$("#phone").val("");
	});
	$("#searchChlBtn").click(function(event){
		event.preventDefault();
		searchHdChanl(0);
	});
	$("#resetChlBtn").click(function(event){
		event.preventDefault();
		$("#hqChanlName").val("");
		$("#hqChanlCode").val("");
	});
});
var userId = "";
var realName = "";
var userName = "";
var phone = "";
var pLevel = "";
var pCode = "";
//查询人员
function searchHdPerson(pageNumber) {
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
	   				content += "<td><input type='radio' onclick='getHdChanlMsg(this);' name='person' id='"+n['ID']+"' realName='"+n['REALNAME']+"' userName='"+n['USERNAME']+"' phone='"+n['PHONE']+"' pLevel='"+n['ORGLEVEL']+"' pCode='"+n['CODE']+"' checked='true'></td>";
	   				userId = n['ID'];
	   				realName = n['REALNAME'];
	   				userName = n['USERNAME'];
	   				phone = n['PHONE'];
	   				pLevel = n['ORGLEVEL'];
	   				pCode = n['CODE'];
	   				searchHdChanl(0);
	   			} else {
	   				content += "<td><input type='radio' onclick='getHdChanlMsg(this);' name='person' id='"+n['ID']+"' realName='"+n['REALNAME']+"' userName='"+n['USERNAME']+"' phone='"+n['PHONE']+"' pLevel='"+n['ORGLEVEL']+"' pCode='"+n['CODE']+"'></td>";
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
     callback: searchHdPerson,
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

function getHdChanlMsg(ele) {
	userId = $(ele).attr("id");
	realName = $(ele).attr("realName")
	userName = $(ele).attr("userName");
	phone = $(ele).attr("phone");
	pLevel = $(ele).attr("pLevel");
	pCode = $(ele).attr("pCode");
	searchHdChanl(0);
}
//查询活动巡检渠道
function searchHdChanl(pageNumber) {
	var hqChanlName = $.trim($("#hqChanlName").val());
	var hqChanlCode = $.trim($("#hqChanlCode").val());
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryHdChanl.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.pLevel":pLevel,
           "resultMap.pCode":pCode,
           "hqChanlName":hqChanlName,
           "hqChanlCode":hqChanlCode
	   	},
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
	   			initChanlPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
	   			var value = $("#selected_inspection_chanl tr td#__"+n['CODE']+"_"+userId).html();
	   			if(!value) {
	   				value = "";
	   			}
	   			content+="<tr>";
	   			content+="<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['CODE'])+"</td>"
				+"<td>"+realName+"</td>"
				+"<td>"+phone+"</td>"
				+"<td style='display:none;'>"+userId+"</td>"
	   			+"<td><input type='text' size='15' onkeyup='valid(this)' id='"+n['CODE']+"_"+userId+"' value='"+value+"'></td>"
	   			+"<td><a href='#' onclick='create(this,event)' chl_name='"+n['NAME']+"' chl_code='"+n['CODE']+"' pCode='"+pCode+"' realName='"+realName+"' userId='"+userId+"' userName='"+userName+"' phone='"+phone+"' pLevel='"+pLevel+"' chanl_type='"+n['CHLTYPE']+"'>选择</a></td>"
				content+="</tr>";
			});
			if(content != "") {
				$("#inspection_chanl_data").empty().html(content);
			}else {
				$("#inspection_chanl_data").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
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

function initChanlPagination(totalCount) {
	 $("#chanlTotalCount").html(totalCount);
	 $("#chanlPagination").pagination(totalCount, {
	     callback: searchHdChanl,
	     items_per_page:pageSize,
	     link_to:"###",
	     prev_text: '上页',       //上一页按钮里text  
		 next_text: '下页',       //下一页按钮里text  
		 num_display_entries: 5, 
		 num_edge_entries: 2
	 });
}

function create(ele,event) {
	if(event && event.preventDefault){
		event.preventDefault();
	}else{
		window.event.returnValue = false;//注意加window
	}
	var suserId = $(ele).attr("userId");
	var suserName = $(ele).attr("userName");
	var schl_name = $(ele).attr("chl_name");
	var srealName = $(ele).attr("realName");
	var sphone = $(ele).attr("phone");
	var spCode =  $(ele).attr("pCode");
	var schl_code =  $(ele).attr("chl_code");
	var schanl_type = $(ele).attr("chanl_type");
	var spLevel = $(ele).attr("pLevel");
	var spenum = $(ele).parent("td").prev("td").find("input").val();
	if(spenum == null || spenum == "" || spenum == "null") {
		art.dialog.alert("对不起，你还没有填写巡检次数！");
		return;
	} else {
		if(spenum == 0) {
			art.dialog.alert("添加的巡检次数不能为0！");
			return;
		} else {
			var sdchl = $("#selected_inspection_chanl tr td#__"+schl_code+"_"+suserId).html();
			if(sdchl) {
				$("#selected_inspection_chanl tr td#__"+schl_code+"_"+suserId).html(spenum);
			} else {
				var sc = "<tr>" +
				"<td>"+schl_name+"</td><td>"+schl_code+"</td>" +
				"<td>"+srealName+"</td><td>"+sphone+"</td>" +
				"<td id='__"+schl_code+"_"+userId+"'>"+spenum+"</td>" +
				"<td userId='"+suserId+"' pCode='"+spCode+"' pLevel='"+spLevel+"' chanl_type='"+schanl_type+"'><a href='#' del_hd_id='"+schl_code+"_"+userId+"'  onclick='del(this,event)'>移除</a></td></td>"+
				"</tr>";
				$("#selected_inspection_chanl").append(sc);
			}
		}
	}
}

function del(ele,event) {
	if(event && event.preventDefault){
		event.preventDefault();
	}else{
		window.event.returnValue = false;//注意加window
	}
	var del_hd_id = $(ele).attr("del_hd_id");
	$(ele).parent("td").parent("tr").remove();
	$("#"+del_hd_id).val("");
}

function toDate(str){
    var sd=str.split("-");
    return new Date(sd[0],sd[1],sd[2]);
}

function closeHdDialog() {
	window.parent.closeWindow("添加活动巡检");
}

function addHdInpec() {
	art.dialog.confirm('您确定要执行该操作吗？',function(){
		var inspec_name = $.trim($("#inspecName").val());
		var startTime = $.trim($("#startTime").val());
		var endTime = $.trim($("#endTime").val());
		var inspec_desc = $.trim($("#inspecDesc").val());
		if(inspec_name == "") {
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
		$("#selected_inspection_chanl tr").each(function(i){
			taskInfo += '{"inspec_type":"2","inspec_name":"'+inspec_name+'","start_time":"'+startTime+'","end_time":"'+endTime+'","remark":"'+inspec_desc+'",';
			taskInfo += '"chanl_name":"'+$(this).find("td:eq(0)").html()+'",';
			taskInfo += '"hq_chanl_id":"'+$(this).find("td:eq(1)").html()+'",';
			taskInfo += '"r_user_name":"'+$(this).find("td:eq(2)").html()+'",';
			taskInfo += '"r_phone":"'+$(this).find("td:eq(3)").html()+'",';
			taskInfo += '"inspec_sum":"'+$(this).find("td:eq(4)").html()+'",';
			var td4 = $(this).find("td:eq(5)");
			taskInfo += '"r_user_id":"'+$(td4).attr("userId")+'",';
			taskInfo += '"r_user_region":"'+$(td4).attr("pCode")+'",';
			taskInfo += '"chanl_type":"'+$(td4).attr("chanl_type")+'",';
			taskInfo += '"r_user_region_level":"'+$(td4).attr("pLevel")+'"},';
		});
		taskInfo = taskInfo.substring(0,taskInfo.lastIndexOf(","));
		taskInfo += "]}";
		$("#taskInfoJsonStr").val(taskInfo);
		$('#spectionFrom').form('submit', {
		    url:$("#ctx").val()+"/taskManagement/chanlInspection_saveHdInspection.action",
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
			   		    	window.parent.closeWindow("添加活动巡检");
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