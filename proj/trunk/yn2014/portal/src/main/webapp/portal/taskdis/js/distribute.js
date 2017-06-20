var pageSize = 10;
var curPage=0;
var orders=[];
var teams=[];
var dis=[];
var proType="";
//guowl23
Array.prototype.shuffle = function() {
	var input = this;
	for (var i = input.length-1; i >=0; i--) {
		var randomIndex = Math.floor(Math.random()*(i+1)); 
		var itemAtIndex = input[randomIndex]; 
		input[randomIndex] = input[i]; 
		input[i] = itemAtIndex;
	}
};
function listProTypes(){
	var $proType = $("#proType");
	var sql = " SELECT distinct T.PRO_TYPE FROM PODS.TB_2G_ZD_TO_4G_LIST T  WHERE T.PRO_TYPE is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		for (var i = 0; i < d.length; i++) {
			h += '<option value="' + d[i].PRO_TYPE + '">' + d[i].PRO_TYPE + '</option>';
		}
		var $h = $(h);
		$proType.empty().append($h);
	} else {
		alert("获取任务类型失败");
	}
}
//获取数据
function query(sql){
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	return ls;
}
$(function() {
	initTeam();
	listProTypes();
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#searchBtn").trigger("click");
});
function getAllOrders(){
	proType=$("#proType").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/taskDis/task-dis!undisList.action",
		data:{
			"resultMap.proType":proType,
		    "resultMap.page":1,
            "resultMap.rows":1000000
	   	}, 
	   	success:function(data){
	   		if(data&&data.rows){
	   			orders=data.rows;
	   			distribute();
	   		}
	   	}
	});
}
function initTeam(){
	$.ajax({
		type:"POST",
		async:false,
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskDis/task-dis!getTeam.action",
		data:{}, 
	   	success:function(data){
	   		teams=data;
	   		var t="<li><span>总数</span><br/><a id='team_all'>"+orders.length+"</a>";
	   		t+="<ul>"
	   		for(var i=0;i<teams.length;i++){
   				var team=teams[i];
   				t+="<li><span>"+team.NAME+"</span><a title='点击切换为手动分配' href='javascript:void(0);' class='sys-icon' teamId='"+team.ID+"' onclick='changeType(this)'></a><br/><input type='text' value='0' onkeyup=\"if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};distribute();\" class='man-num default-text-input' style='display:none;'/><a class='sys-num' href='javascript:void(0);' id='team_"+team.ID+"'></a>";
	   		}
	   		
	   		t+="</ul>"
	   		t+="</li>";
	   		$("#team").empty().html(t);
	   		$("#team").jOrgChart({
	   	        chartElement : '#chart'
	   	        //dragAndDrop  : true
	   	    });
	   	},
	   	error:function(){
	   		alert("加载数据失败！");
		}
	});
}
function search(pageNumber) {
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	if(pageNumber==1){
		getAllOrders();
	}
	proType=$("#proType").val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/taskDis/task-dis!undisList.action",
		data:{
			"resultMap.proType":proType,
			"resultMap.page":pageNumber,
			"resultMap.rows":pageSize
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
				+"<td>"+isNull(n['DEVICE_NUMBER'])+"</td>"
				+"<td>"+isNull(n['SUBSCRIPTION_ID'])+"</td>"
				+"<td>"+isNull(n['PRODUCT_ID'])+"</td>"
				+"<td>"+isNull(n['PRODUCT_NAME'])+"</td>"
				+"<td>"+isNull(n['DEV_CHNL'])+"</td>"
				+"<td>"+isNull(n['DEV_CHNL_NAME'])+"</td>"
				
				+"<td>"+isNull(n['C1'])+"</td>"
				+"<td>"+isNull(n['C2'])+"</td>"
				+"<td>"+isNull(n['C3'])+"</td>"
				+"<td>"+isNull(n['C4'])+"</td>";
				content+="</tr>";
			});
	   	    
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='10'>暂无数据</td></tr>");
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
	       prev_text: '上页',       // 上一页按钮里text
		   next_text: '下页',       // 下一页按钮里text
		   num_display_entries: 5, 
		   num_edge_entries: 2
	 });
}
function getSysUsersLength(users){
	var c=0;
	for(var i=0;i<users.length;i++){
		var user = users[i];
		if(!user.manDis){
			c++;
		}
	}
	return c;
}
function distribute(o){
	$("#distributeBtn").hide();
	
	if(!teams||!teams.length){
		alert("没有可以分配的成员");
		return;
	}
	orders.shuffle();
	var index=0;
	dis=[];
	var counter=[];
	for(var i=0;i<teams.length;i++)
		counter[teams[i].ID]=0;
	
	//进行手动分配
	var man=0;
	for(var i=0;i<teams.length;i++){
		var user=teams[i];
		if(user.manDis){
			var manCount=$("#chart").find("#team_"+user.ID).parent().find(".man-num").val();
			for(var j=0;j<manCount;j++){
				man++;
				if(man>orders.length){
					alert("手动分配合计不能大于可分配最大值："+orders.length);
					$("#chart").find("#team_"+user.ID).parent().find(".man-num").focus();
					if(o) $(o).val('').focus();
					return;
				}
				dis.push({"proType":proType,"userId":user.ID,"subscriptionId":orders[index++]["SUBSCRIPTION_ID"]});
				if(!counter[user.ID]) counter[user.ID]=0;
				counter[user.ID]++;
			}
		}
	}
	var sysNum=orders.length-man;
	//自动平均分内部
	var avgUserNum=getSysUsersLength(teams);
	var mod=(avgUserNum>0?sysNum%avgUserNum:0);
	var avg=(avgUserNum>0?(sysNum-mod)/avgUserNum:0);
	
	for(var i=0;i<teams.length;i++){
		if(!teams[i].manDis){
			for(var j=0;j<avg;j++){
				dis.push({"proType":proType,"userId":teams[i].ID,"subscriptionId":orders[index++]["SUBSCRIPTION_ID"]});
				if(!counter[teams[i].ID]) counter[teams[i].ID]=0;
				counter[teams[i].ID]++;
			}
		}
	}
	//分配余数
	teams.shuffle();
	var sysIndex=0;
	for(var i=0;i<teams.length;i++){
		if(!teams[i].manDis){
			sysIndex++;
			if(sysIndex>mod) break;
			dis.push({"proType":proType,"userId":teams[i].ID,"subscriptionId":orders[index++]["SUBSCRIPTION_ID"]});
			if(!counter[teams[i].ID]) counter[teams[i].ID]=0;
			counter[teams[i].ID]++;
		}
	}
	
	$("#chart").find("A[id^='team_']").text("");
	$("#chart").find("A[id='team_all']").text(orders.length);
	for(var p in counter){
		if(counter[p]==null) counter[p]=0;
		$("#chart").find("#team_"+p).text(counter[p]);
		$("#chart").find("#team_"+p).parent().find(".man-num").val(counter[p]);
	}
	$("#distributeBtn").show();
}
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

function submitDistribute(){
	$("#distributeBtn").hide();

	
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/taskDis/task-dis!distribute.action",
		data:{
		   jsonStr:JSON.stringify(dis)
	   	}, 
	   	success:function(data){
	   		alert(data.msg);
	   		window.location.href=window.location.href;
	   	},
	   	error:function(){
	   		alert("出现错误，请重新分配");
	   		window.location.href=window.location.href;
	   	}
	});
}
function changeType(o){
	$icon=$(o);
	var teamId=$(o).attr("teamId");
	var teamUser = getTeamUserById(teamId);
	
	if($icon.hasClass("sys-icon")){
		$icon.removeClass("sys-icon").addClass("man-icon");
		$icon.attr("title","点击切换为系统分配");
		$icon.parent().find(".man-num").show();
		$icon.parent().find(".sys-num").hide();
		
		teamUser.manDis=true;//手动
	}else{
		$icon.removeClass("man-icon").addClass("sys-icon");
		$icon.attr("title","点击切换为手动分配");
		$icon.parent().find(".man-num").hide();
		$icon.parent().find(".sys-num").show();
		
		teamUser.manDis=false;//自动
	}
	
	distribute(o);
}
function getTeamUserById(teamId){
	for(var i=0;i<teams.length;i++){
		var user =teams[i];
		if(user.ID==teamId){
			return user;
		}
	}
	return {};
}