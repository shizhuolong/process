var pageSize = 10;
var curPage=0;
var orders=[];
var teams=[];
var dis=[];
function getInnerTeam(teams){
	for(var i=0;i<teams.length;i++)
		if(teams[i].TEAM_TYPE==1)
			return teams[i];
};
function getOuterTeam(teams){
	for(var i=0;i<teams.length;i++)
		if(teams[i].TEAM_TYPE==2)
			return teams[i];
};
function getTeamUserById(teamId){
	var innerTeam=getInnerTeam(teams);
	var outerTeam=getOuterTeam(teams);
	
	var innerUsers=innerTeam.children;//内部用户
	for(var i=0;i<innerUsers.length;i++){
		var inner =innerUsers[i];
		if(inner.ID==teamId){
			return inner;
		}
	}
	var outerUsers=outerTeam.children;//外部用户
	for(var i=0;i<outerUsers.length;i++){
		var outer = outerUsers[i];
		if(outer.ID==teamId){
			return outer;
		}
	}
	return {};
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
Array.prototype.shuffle = function() {
	var input = this;
	for (var i = input.length-1; i >=0; i--) {
		var randomIndex = Math.floor(Math.random()*(i+1)); 
		var itemAtIndex = input[randomIndex]; 
		input[randomIndex] = input[i]; 
		input[i] = itemAtIndex;
	}
};
$(function() {
	initTeam();
	listServiceNames();
	listServiceOrders();
	listServiceProducts();
	$("input:radio[name='disType']").change(function (){
		var disType=$(this).val();
		if(1==disType){
			$("#teamDesc").text("内部团队订单量百分比[0-100]（%）:");
		}else{
			$("#teamDesc").text("内部团队订单绝对值量[0-"+orders.length+"]:");
		}
		$("#disValue").val(0);
		distribute();
	});
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#searchBtn").trigger("click");
});
function getAllOrders(){
	var activeStatus=$("#activeStatus").val();
	var isFirst=$("#isFirst").val();
	var serviceName=$("#serviceName").val();
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var serviceOrder=$("#serviceOrder").val();
	var serviceProduct=$("#serviceProduct").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!undistributedOrderList.action",
		data:{
			"resultMap.startTime":startTime,
			"resultMap.endTime":endTime,
			"resultMap.serviceOrder":serviceOrder,
			"resultMap.serviceProduct":serviceProduct,
			"resultMap.activeStatus":activeStatus,
			"resultMap.isFirst":isFirst,
			"resultMap.serviceName":serviceName,
			"resultMap.cols":"ORDER_NO",
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
		url:$("#ctx").val()+"/t2i2c/t2i2c!getTeamByParentId.action",
		data:{
		   "pId":"-1"
	   	}, 
	   	success:function(data){
	   		teams=data;
	   		var t="<li><span>订单总数</span><br/><a id='team_all'>"+orders.length+"</a>";
	   		t+="<ul>"
	   		for(var i=0;i<teams.length;i++){
	   			var team=teams[i];
	   			t+="<li><span>"+team.NAME+"</span><br/><a id='team_"+team.ID+"'></a>";
	   			if(team.children&&team.children.length){
	   				t+="<ul>";
	   				for(var j=0;j<team.children.length;j++){
	   					var subTeam=team.children[j];
	   					t+="<li><span>"+subTeam.NAME+"</span><a title='点击切换为手动分配' href='javascript:void(0);' class='sys-icon' teamId='"+subTeam.ID+"' onclick='changeType(this)'></a><br/><input type='text' value='0' onkeyup=\"if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')};distribute();\" class='man-num default-text-input' style='display:none;'/><a class='sys-num' href='javascript:void(0);' id='team_"+subTeam.ID+"'></a>";
	   				}
	   				t+="</ul>";
	   			}
	   			t+="</li>";
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
	   		alert("加载团队数据失败！");
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
function search(pageNumber) {
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	if(pageNumber==1){
		getAllOrders();
		$("input:radio[name='disType']").eq(0).trigger("click");
	}
	var activeStatus=$("#activeStatus").val();
	var isFirst=$("#isFirst").val();
	var serviceName=$("#serviceName").val();
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var serviceOrder=$("#serviceOrder").val();
	var serviceProduct=$("#serviceProduct").val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!topList.action",
		data:{
			"resultMap.startTime":startTime,
			"resultMap.endTime":endTime,
			"resultMap.serviceOrder":serviceOrder,
			"resultMap.serviceProduct":serviceProduct,
			"resultMap.activeStatus":activeStatus,
			"resultMap.isFirst":isFirst,
			"resultMap.serviceName":serviceName,
			"resultMap.cols":"ORDER_NO,ORDER_TIME,GROUP_ID_1_NAME,CITY_NAME,ORDER_STATUS,CUST_NAME,BOOK_NUM,PRODUCT_NAME,SHOOP_NAME,SERVICE_NUMBER,ACTIVE_STATUS",
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
				+"<td>"+isNull(n['ORDER_NO'])+"</td>"
				+"<td>"+isNull(n['ORDER_TIME'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['CITY_NAME'])+"</td>"
				+"<td>"+isNull(n['ORDER_STATUS'])+"</td>"
				+"<td>"+isNull(n['CUST_NAME'])+"</td>"
				+"<td>"+isNull(n['BOOK_NUM'])+"</td>"
				+"<td>"+isNull(n['PRODUCT_NAME'])+"</td>"
				+"<td>"+isNull(n['SHOOP_NAME'])+"</td>"
				+"<td>"+isNull(n['SERVICE_NUMBER'])+"</td>"
				+"<td>"+isNull(n['ACTIVE_STATUS'])+"</td>";
				content+="</tr>";
			});
	   	    
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
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
	       prev_text: '上页',       // 上一页按钮里text
		   next_text: '下页',       // 下一页按钮里text
		   num_display_entries: 5, 
		   num_edge_entries: 2
	 });
}
function distribute(o){
	$("#distributeBtn").hide();
	var disValue=$("#disValue").val();
	var disType=$("input:radio[name='disType']:checked").val();
	if(disType==1&&(disValue<0||disValue>100)){
		alert("百分比分配只能输入0到100的整数");
		$("#disValue").val(0);
	}
	if(disType==2&&(disValue<0||disValue>parseInt(orders.length))){
		alert("绝对值分配只能输入0到"+orders.length+"的整数");
		$("#disValue").val(0);
	}
	disValue=$("#disValue").val();
	var inner=disType==1?Math.round(orders.length*disValue/100):disValue;//内部总数
	var outer=orders.length-inner;//外部总数
	
	var innerTeam=getInnerTeam(teams);
	var outerTeam=getOuterTeam(teams);
	
	
	var innerUsers=innerTeam.children;//内部用户
	var outerUsers=outerTeam.children;//外部用户
	if(!innerUsers||!innerUsers.length){
		alert("内部团队没有成员");
		return;
	}
	if(!outerUsers||!outerUsers.length){
		alert("外部团队没有成员");
		return;
	}
	
	orders.shuffle();
	var index=0;
	dis=[];
	var counter=[];
	for(var i=0;i<innerUsers.length;i++)
		counter[innerUsers[i].ID]=0;
	for(var i=0;i<outerUsers.length;i++)
		counter[outerUsers[i].ID]=0;
	//进行内部手动分配
	var innerMan=0;
	for(var i=0;i<innerUsers.length;i++){
		var user=innerUsers[i];
		if(user.manDis){
			var manCount=$("#chart").find("#team_"+user.ID).parent().find(".man-num").val();
			for(var j=0;j<manCount;j++){
				innerMan++;
				if(innerMan>inner){
					alert("手动分配合计不能大于内部团队可分配最大值："+inner);
					$("#chart").find("#team_"+user.ID).parent().find(".man-num").focus();
					if(o) $(o).val('').focus();
					return;
				}
				dis.push({"teamId":user.ID,"orderNo":orders[index++]["ORDER_NO"]});
				if(!counter[user.ID]) counter[user.ID]=0;
				counter[user.ID]++;
			}
		}
	}
	//进行外部手动分配
	var outerMan=0;
	for(var i=0;i<outerUsers.length;i++){
		var user=outerUsers[i];
		if(user.manDis){
			var manCount=$("#chart").find("#team_"+user.ID).parent().find(".man-num").val();
			for(var j=0;j<manCount;j++){
				outerMan++;
				if(outerMan>outer){
					alert("手动分配合计不能大于外部团队可分配最大值："+outer);
					$("#chart").find("#team_"+user.ID).parent().find(".man-num").focus();
					if(o) $(o).val('').focus();
					return;
				}
				dis.push({"teamId":user.ID,"orderNo":orders[index++]["ORDER_NO"]});
				if(!counter[user.ID]) counter[user.ID]=0;
				counter[user.ID]++;
			}
		}
	}
	inner=inner-innerMan;
	outer=outer-outerMan;
	//自动平均分内部
	var innerAvgUserNum=getSysUsersLength(innerUsers);
	var innerMod=(innerAvgUserNum>0?inner%innerAvgUserNum:0);
	var innerAvg=(innerAvgUserNum>0?(inner-innerMod)/innerAvgUserNum:0);
	
	for(var i=0;i<innerUsers.length;i++){
		if(!innerUsers[i].manDis){
			for(var j=0;j<innerAvg;j++){
				dis.push({"teamId":innerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
				if(!counter[innerUsers[i].ID]) counter[innerUsers[i].ID]=0;
				counter[innerUsers[i].ID]++;
			}
		}
	}
	innerUsers.shuffle();
	var sysIndex=0;
	for(var i=0;i<innerUsers.length;i++){
		if(!innerUsers[i].manDis){
			sysIndex++;
			if(sysIndex>innerMod) break;
			dis.push({"teamId":innerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
			if(!counter[innerUsers[i].ID]) counter[innerUsers[i].ID]=0;
			counter[innerUsers[i].ID]++;
		}
	}
	//自动平均分外部
	var outerAvgUserNum=getSysUsersLength(outerUsers);
	var outerMod=(outerAvgUserNum>0?outer%outerAvgUserNum:0);
	var outerAvg=(outerAvgUserNum>0?(outer-outerMod)/outerAvgUserNum:0);
	
	for(var i=0;i<outerUsers.length;i++){
		if(!outerUsers[i].manDis){
			for(var j=0;j<outerAvg;j++){
				dis.push({"teamId":outerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
				if(!counter[outerUsers[i].ID]) counter[outerUsers[i].ID]=0;
				counter[outerUsers[i].ID]++;
			}
		}
	}
	outerUsers.shuffle();
	var sysIndex=0;
	for(var i=0;i<outerUsers.length;i++){
		if(!outerUsers[i].manDis){
			sysIndex++;
			if(sysIndex>outerMod) break;
			dis.push({"teamId":outerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
			if(!counter[outerUsers[i].ID]) counter[outerUsers[i].ID]=0;
			counter[outerUsers[i].ID]++;
		}
	}
	$("#chart").find("A[id^='team_']").text("");
	$("#chart").find("A[id='team_all']").text(orders.length);
	$("#chart").find("#team_"+innerTeam.ID).text(inner+innerMan);
	$("#chart").find("#team_"+outerTeam.ID).text(outer+outerMan);
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
	var params={};
	var disValue=$("#disValue").val();
	var disType=$("input:radio[name='disType']:checked").val();
	
	params.disValue=disValue;
	params.disType=disType;
	params.dis=dis;
	
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!regionDistribute.action",
		data:{
		   jsonStr:JSON.stringify(params)
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
function listServiceNames(){
	var $serviceName = $("#serviceName");
	var sql = " SELECT distinct T.SERVICE_NAME FROM PODS.VIEW_ODS_2I2C_NOT_ASS T where T.SERVICE_NAME is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].SERVICE_NAME
					+ '" selected >'
					+ d[0].SERVICE_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].SERVICE_NAME + '">' + d[i].SERVICE_NAME + '</option>';
			}
		}
		var $h = $(h);
		$serviceName.empty().append($h);
	} else {
		alert("获取人员状态失败");
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
function listServiceOrders(){
	var $serviceOrder = $("#serviceOrder");
	var sql = " SELECT distinct T.ORDER_STATUS FROM PODS.TB_ODS_2I2C_ORDER_STATUS T where T.ORDER_STATUS is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].ORDER_STATUS
					+ '" selected >'
					+ d[0].ORDER_STATUS + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].ORDER_STATUS + '">' + d[i].ORDER_STATUS + '</option>';
			}
		}
		var $h = $(h);
		$serviceOrder.empty().append($h);
	} else {
		alert("获取订单状态失败");
	}
}
function listServiceProducts(){
	var $serviceProduct = $("#serviceProduct");
	var sql = " SELECT distinct T.SHOOP_NAME FROM PODS.TB_ODS_2I2C_SHOOP_NAME T where T.SHOOP_NAME is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].SHOOP_NAME
					+ '" selected >'
					+ d[0].SHOOP_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].SHOOP_NAME + '">' + d[i].SHOOP_NAME + '</option>';
			}
		}
		var $h = $(h);
		$serviceProduct.empty().append($h);
	} else {
		alert("获取商品信息失败");
	}
}