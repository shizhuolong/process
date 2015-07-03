var pageSize = 7;
$(function(){
	$("#searchBtn").click(function(event){
		event.preventDefault();
		searchHdPerson(0);
	});
	$("#resetBtn").click(function(event){
		event.preventDefault();
		$("#realname").val("");
		$("#username").val("");
		$("#phone").val("");
	});
	$("#searchChlBtn").click(function(event){
		event.preventDefault();
		searchHdChanl(0);
	});
	$("#resetChlBtn").click(function(event){
		event.preventDefault();
		$("#qgroup_id_4_name").val("");
		$("#qhq_chanl_code").val("");
	});
	initInspectionChanl();
	searchHdPerson(0);
});
var userid = "";
var realname = "";
var username = "";
var phone = "";
var p_levl = "";
var p_code = "";
//查询人员
function searchHdPerson(pageNumber) {
	pageNumber = pageNumber + 1;
	var qrealname = $.trim($("#realname").val());
	var qusername = $.trim($("#username").val());
	var qphone = $.trim($("#phone").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryHdPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "realname":qrealname,
           "username":qusername,
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
	   				content += "<td><input type='radio' onclick='getHdChanlMsg(this);' name='person' id='"+n['ID']+"' realname='"+n['REALNAME']+"' username='"+n['USERNAME']+"' phone='"+n['PHONE']+"' p_levl='"+n['ORGLEVEL']+"' p_code='"+n['CODE']+"' checked='true'></td>";
	   				userid = n['ID'];
	   				realname = n['REALNAME'];
	   				username = n['USERNAME'];
	   				phone = n['PHONE'];
	   				p_levl = n['ORGLEVEL'];
	   				p_code = n['CODE'];
	   				searchHdChanl(0);
	   			} else {
	   				content += "<td><input type='radio' onclick='getHdChanlMsg(this);' name='person' id='"+n['ID']+"' realname='"+n['REALNAME']+"' username='"+n['USERNAME']+"' phone='"+n['PHONE']+"' p_levl='"+n['ORGLEVEL']+"' p_code='"+n['CODE']+"'></td>";
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
	userid = $(ele).attr("id");
	realname = $(ele).attr("realname")
	username = $(ele).attr("username");
	phone = $(ele).attr("phone");
	p_levl = $(ele).attr("p_levl");
	p_code = $(ele).attr("p_code");
	searchHdChanl(0);
}
//查询活动巡检渠道
function searchHdChanl(pageNumber) {
	var qgroup_id_4_name = $.trim($("#qgroup_id_4_name").val());
	var qhq_chanl_code = $.trim($("#qhq_chanl_code").val());
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskManagement/chanlInspection_queryHdChanl.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.userId":userid,
           "resultMap.realname":realname,
           "resultMap.phone":phone,
           "resultMap.p_levl":p_levl,
           "resultMap.p_code":p_code,
           "group_id_4_name":qgroup_id_4_name,
           "hq_chanl_code":qhq_chanl_code
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
	   			var value = $("#selected_inspection_chanl tr td#__"+n['CODE']+"_"+userid).html();
	   			if(!value) {
	   				value = "";
	   			}
	   			content+="<tr>";
	   			content+="<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['CODE'])+"</td>"
				+"<td>"+realname+"</td>"
				+"<td>"+phone+"</td>"
				+"<td style='display:none;'>"+userid+"</td>"
	   			+"<td><input type='text' size='15' onkeyup='valid(this)' id='"+n['CODE']+"_"+userid+"' value='"+value+"'></td>"
	   			+"<td><a href='#' onclick='create(this,event)' chl_name='"+n['NAME']+"' chl_code='"+n['CODE']+"' p_code='"+p_code+"' realname='"+realname+"' userid='"+userid+"' username='"+username+"' phone='"+phone+"' p_levl='"+p_levl+"' chanl_type='"+n['CHLTYPE']+"'>选择</a></td>"
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
	var suserid = $(ele).attr("userid");
	var susername = $(ele).attr("username");
	var schl_name = $(ele).attr("chl_name");
	var srealname = $(ele).attr("realname");
	var sphone = $(ele).attr("phone");
	var sp_code =  $(ele).attr("p_code");
	var schl_code =  $(ele).attr("chl_code");
	var schanl_type = $(ele).attr("chanl_type");
	var sp_levl = $(ele).attr("p_levl");
	var spenum = $(ele).parent("td").prev("td").find("input").val();
	if(spenum == null || spenum == "" || spenum == "null") {
		art.dialog.alert("对不起，你还没有填写巡检次数！");
		return;
	} else {
		if(spenum == 0) {
			art.dialog.alert("添加的巡检次数不能为0！");
			return;
		} else {
			var sdchl = $("#selected_inspection_chanl tr td#__"+schl_code+"_"+suserid).html();
			if(sdchl) {
				$("#selected_inspection_chanl tr td#__"+schl_code+"_"+suserid).html(spenum);
			} else {
				var sc = "<tr>" +
				"<td>"+schl_name+"</td><td>"+schl_code+"</td>" +
				"<td>"+srealname+"</td><td>"+sphone+"</td>" +
				"<td id='__"+schl_code+"_"+userid+"'>"+spenum+"</td>" +
				"<td userid='"+suserid+"' p_code='"+sp_code+"' p_levl='"+sp_levl+"' chanl_type='"+schanl_type+"'><a href='#' del_hd_id='"+schl_code+"_"+userid+"'  onclick='del(this,event)'>移除</a></td></td>"+
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

function closeHdDialog() {
	window.parent.closeWindow("修改活动巡检信息");
}

function toDate(str){
    var sd=str.split("-");
    return new Date(sd[0],sd[1],sd[2]);
}

function updateHdInpec() {
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
			taskInfo += '{"inspec_type":"2","inspec_name":"'+inspec_name+'","start_time":"'+startTime+'","end_time":"'+endTime+'","remark":"'+inspec_desc+'",';
			taskInfo += '"chanl_name":"'+$(this).find("td:eq(0)").html()+'",';
			taskInfo += '"hq_chanl_id":"'+$(this).find("td:eq(1)").html()+'",';
			taskInfo += '"r_user_name":"'+$(this).find("td:eq(2)").html()+'",';
			taskInfo += '"r_phone":"'+$(this).find("td:eq(3)").html()+'",';
			taskInfo += '"inspec_sum":"'+$(this).find("td:eq(4)").html()+'",';
			var td4 = $(this).find("td:eq(5)");
			taskInfo += '"r_user_id":"'+$(td4).attr("userid")+'",';
			taskInfo += '"r_user_region":"'+$(td4).attr("p_code")+'",';
			taskInfo += '"chanl_type":"'+$(td4).attr("chanl_type")+'",';
			taskInfo += '"r_user_region_level":"'+$(td4).attr("p_levl")+'"},';
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
			   		    	window.parent.closeWindow("添加活动巡检");
			   		    	window.parent.closeWindow("修改活动巡检信息");
			   		    	//此处还存在问题，需要刷新列表
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

function initInspectionChanl() {
	var inspec_id = $("#inspec_id").val();
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
				"<td userid='"+n['R_USER_ID']+"' p_code='"+n['R_USER_REGION']+"' p_levl='"+n['R_USER_REGION_LEVEL']+"' chanl_type='"+n['CHANL_TYPE']+"'><a href='#' del_hd_id='"+n['HQ_CHANL_ID']+"_"+n['R_USER_ID']+"'>&nbsp;</a></td></td>"+
				"</tr>";
				$("#selected_inspection_chanl").append(sc);
			});
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

