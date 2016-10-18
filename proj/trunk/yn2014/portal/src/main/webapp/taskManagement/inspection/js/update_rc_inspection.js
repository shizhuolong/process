var pageSize = 7;
$(function(){
	search(0);
	initRcInspectionChanl();
	$("#searchBtn").click(function(event) {
		event.preventDefault();
		search(0);
	});

	$("#resetBtn").click(function(event) {
		event.preventDefault();
		$("#realName").val("");
		$("#username").val("");
		$("#phone").val("");
	});

	$("#searchChlBtn").click(function(event) {
		event.preventDefault();
		searchRcChanl(0);
	});

	$("#resetChlBtn").click(function(event) {
		event.preventDefault();
		$("#hqChanlName").val("");
		$("#hqChanlCode").val("");
	});
});
var	serid ="";
var	name ="";
var	username ="";
var	phone = "";
var	pLevel ="";
var	pCode ="";

//查询日常巡检人员
function search(pageNumber){
	var pageNumber = pageNumber + 1;
	var realName = $.trim($("#realName").val());
	var username = $.trim($("#username").val());
	var phone = $.trim($("#phone").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryRcPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "realName":realName,
           "username":username,
           "phone":phone,
           "unit_id":unit_id
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
	   				content += "<td><input type='radio' name='person' onclick='getRcChanlMsg(this);'  id='"+n['USERID']+"' uname='"+n['NAME']+"' username='"+n['USERNAME']+"' phone='"+n['PHONE']+"' pLevel='"+orgLevel+"' pCode='"+orgCode+"' checked='true'></td>";
	   				userId = n['USERID'];
	   				name = n['NAME'];
	   				username = n['USERNAME'];
	   				phone = n['PHONE'];
	   				/*pLevel = n['ORGLEVEL'];
	   				pCode = n['CODE'];*/
	   				pLevel = orgLevel;
	   				pCode = orgCode;
	   				searchRcChanl(0);
	   			} else {
	   				content += "<td><input type='radio' name='person' onclick='getRcChanlMsg(this);'  id='"+n['USERID']+"' uname='"+n['NAME']+"' username='"+n['USERNAME']+"' phone='"+n['PHONE']+"'pLevel='"+orgLevel+"' pCode='"+orgCode+"'></td>"
	   			}
	   			content+="<td>"+isNull(n['NAME'])+"</td>"
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

//初始化渠道巡检人分页
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
//定义是否为空，作为查询结果给页面表单赋值处理
function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

//定义函数，用于处理传递参数
function getRcChanlMsg(ele){
	userId = $(ele).attr("id");
	name = $(ele).attr("uname")
	username = $(ele).attr("username");
	phone = $(ele).attr("phone");
	pLevel = $(ele).attr("pLevel");
	pCode = $(ele).attr("pCode");
	searchRcChanl(0);
}

//查询日常巡检渠道
function searchRcChanl(pageNumber){
	var hqChanlName = $.trim($("#hqChanlName").val());
	var hqChanlCode = $.trim($("#hqChanlCode").val());
	var pageNumber = pageNumber +1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryRcChanl.action",
		data:{
			"resultMap.page":pageNumber,
			"resultMap.rows":pageSize,
			"resultMap.userId":userId,
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
   			var value = $("#selected_inspection_chanl tr td#__"+n['HQ_CHAN_CODE']+"_"+userId).html();
   			if(!value) {
   				value = "";
   			}
   			content+="<tr>";
   			content+="<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
			+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
			+"<td>"+isNull(n['NAME'])+"</td>"
			+"<td>"+isNull(n['PHONE'])+"</td>"
			+"<td style='display:none;'>"+userId+"</td>"
   			+"<td><input type='text' size='15' onkeyup='valid(this)' id='"+n['CODE']+"_"+userId+"' value='"+value+"'></td>"
   			+"<td><a href='#' onclick='create(this,event)' chl_name='"+n['HQ_CHAN_NAME']+"' chl_code='"+n['HQ_CHAN_CODE']+"' pLevel='"+orgLevel+"' pCode='"+pCode+"' name='"+name+"' userId='"+userId+"' username='"+username+"' phone='"+phone+"'  chanl_type='"+n['CHLTYPE']+"'>选择</a></td>"
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

//初始化巡检渠道分页
function initChanlPagination(totalCount) {
	 $("#chanlTotalCount").html(totalCount);
	 $("#chanlPagination").pagination(totalCount, {
    callback: searchRcChanl,
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
	var susername = $(ele).attr("username");
	var schl_name = $(ele).attr("chl_name");
	var srealName = $(ele).attr("name");
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

function closeRcDialog() {
	window.parent.closeWindow("修改活动巡检信息");
}

function toDate(str){
    var sd=str.split("-");
    return new Date(sd[0],sd[1],sd[2]);
}

function updateRcInpec() {
	var inspec_name = $.trim($("#inspec_name").val());
	var startTime = $.trim($("#startTime").val());
	var endTime = $.trim($("#endTime").val());
	var inspec_desc = $.trim($("#inspec_desc").val());
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
	if(b<a) {
		art.dialog.alert("结束时间不能小于起始时间！");
		return;
	}
	art.dialog.confirm('您确定要执行该操作吗？',function(){
		jQuery.blockUI({
			message: "<div style='text-align:center;'><b>正在处理中，请稍等...</b></div>",
			fadeIn: 700,
			centerY: true,
			showOverlay: true
		});
		var taskInfo = '{taskInfo:[';
		$("#selected_inspection_chanl tr").each(function(i){
			taskInfo += '{"inspec_type":"1","inspec_name":"'+inspec_name+'","start_time":"'+startTime+'","end_time":"'+endTime+'","remark":"'+inspec_desc+'",';
			taskInfo += '"chanl_name":"'+$(this).find("td:eq(0)").html()+'",';
			taskInfo += '"hq_chanl_id":"'+$(this).find("td:eq(1)").html()+'",';
			taskInfo += '"r_user_name":"'+$(this).find("td:eq(2)").html()+'",';
			taskInfo += '"r_phone":"'+$(this).find("td:eq(3)").html()+'",';
			taskInfo += '"inspec_sum":"'+$(this).find("td:eq(4)").html()+'",';
			var td4 = $(this).find("td:eq(5)");
			taskInfo += '"r_user_id":"'+$(td4).attr("userId")+'",';
			taskInfo += '"r_user_region":"'	+$(td4).attr("pCode")+'",';
			taskInfo += '"chanl_type":"'+$(td4).attr("chanl_type")+'",';
			taskInfo += '"r_user_region_level":"'+$(td4).attr("pLevel")+'"},';
		});
		taskInfo = taskInfo.substring(0,taskInfo.lastIndexOf(","));
		taskInfo += "]}";
		$("#taskInfoJsonStr").val(taskInfo);
		$('#updateSpectionFrom').form('submit', {				 
		    url:$("#ctx").val()+"/taskManagement/chanlInspection_updateHdInspec.action",
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
//			   		    	window.parent.closeWindow("添加日常巡检");
			   		    	window.parent.closeWindow("修改日常巡检信息");
			   		    	//此处还存在问题，需要刷新列表
			   		    }
			   		});
				}else {
					art.dialog.alert(data.msg);
				}
	    	},
	    	error: function(XMLHttpRequest, textStatus, errorThrown) {
	    		jQuery.unblockUI();
	            art.dialog.alert("修改失败！"+errorThrown);
	        }
		});
	},function(){
		//art.dialog.tips('执行取消绑定操作');
	});
}

//初始化修改列表
function initRcInspectionChanl() {
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryInspectionChanl.action",
		data:{
		   "inspec_id":inspec_id
	   	},
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		var content="";
	   		$.each(pages,function(i,n){
	   			if(i == 0) {
	   				$("#inspec_name").val(n['INSPEC_NAME']);
	   				$("#startTime").val(n['START_TIME']);
	   				$("#endTime").val(n['END_TIME']);
	   				$("#inspec_desc").val(n['REMARK']);
	   			}
	   			var sc = "<tr>" +
				"<td>"+n['CHANL_NAME']+"</td><td>"+n['HQ_CHANL_ID']+"</td>" +
				"<td>"+n['R_USER_NAME']+"</td><td>"+n['R_PHONE']+"</td>" +
				"<td id='__"+n['HQ_CHANL_ID']+"_"+n['R_USER_ID']+"'>"+n['INSPEC_SUM']+"</td>" +
				"<td userId='"+n['R_USER_ID']+"' pCode='"+n['R_USER_REGION']+"' pLevel='"+n['R_USER_REGION_LEVEL']+"' chanl_type='"+n['CHANL_TYPE']+"'><a href='#' del_hd_id='"+n['HQ_CHANL_ID']+"_"+n['R_USER_ID']+"'>&nbsp;</a></td></td>"+
				"</tr>";
				$("#selected_inspection_chanl").append(sc);
			});
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

