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
	getAllOrders();
	search(0);
});
function getAllOrders(){
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!undistributedOrderList.action",
		data:{
		   "resultMap.page":1,
           "resultMap.rows":1000000
	   	}, 
	   	success:function(data){
	   		if(data&&data.rows){
	   			orders=data.rows;
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
	   					t+="<li><span>"+subTeam.NAME+"</span><br/><a id='team_"+subTeam.ID+"'></a>";
	   				}
	   				t+="</ul>";
	   			}
	   			t+="</li>";
	   		}
	   		t+="</ul>"
	   		t+="</li>";
	   		$("#team").empty().html(t);
	   		$("#team").jOrgChart({
	   	        chartElement : '#chart',
	   	        dragAndDrop  : true
	   	    });
	   	},
	   	error:function(){
	   		alert("加载团队数据失败！");
		}
	});
}
function search(pageNumber) {
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!undistributedOrderList.action",
		data:{
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
	
	$("input:radio[name='disType']").eq(0).trigger("click");
}
function distribute(){
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
	var inner=disType==1?Math.round(orders.length*disValue/100):disValue;
	var outer=orders.length-inner;
	
	var innerTeam=getInnerTeam(teams);
	var outerTeam=getOuterTeam(teams);
	
	
	var innerUsers=innerTeam.children;
	var outerUsers=outerTeam.children;
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
	//分内部
	var innerMod=inner%innerUsers.length;
	var innerAvg=(inner-innerMod)/innerUsers.length;
	
	for(var i=0;i<innerUsers.length;i++){
		for(var j=0;j<innerAvg;j++){
			dis.push({"teamId":innerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
			if(!counter[innerUsers[i].ID]) counter[innerUsers[i].ID]=0;
			counter[innerUsers[i].ID]++;
		}
	}
	innerUsers.shuffle();
	for(var i=0;i<innerMod;i++){
		dis.push({"teamId":innerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
		if(!counter[innerUsers[i].ID]) counter[innerUsers[i].ID]=0;
		counter[innerUsers[i].ID]++;
	}
	//分外部
	var outerMod=outer%outerUsers.length;
	var outerAvg=(outer-outerMod)/outerUsers.length;
	
	for(var i=0;i<outerUsers.length;i++){
		for(var j=0;j<outerAvg;j++){
			dis.push({"teamId":outerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
			if(!counter[outerUsers[i].ID]) counter[outerUsers[i].ID]=0;
			counter[outerUsers[i].ID]++;
		}
	}
	outerUsers.shuffle();
	for(var i=0;i<outerMod;i++){
		dis.push({"teamId":outerUsers[i].ID,"orderNo":orders[index++]["ORDER_NO"]});
		if(!counter[outerUsers[i].ID]) counter[outerUsers[i].ID]=0;
		counter[outerUsers[i].ID]++;
	}
	$("#chart").find("A[id^='team_']").text("");
	$("#chart").find("A[id='team_all']").text(orders.length);
	$("#chart").find("#team_"+innerTeam.ID).text(inner);
	$("#chart").find("#team_"+outerTeam.ID).text(outer);
	for(var p in counter){
		$("#chart").find("#team_"+p).text(counter[p]);
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
	   		window.location.href=path+"/portal/order2i2c/jsp/my_order_list.jsp";
	   	},
	   	error:function(){
	   		alert("出现错误，请重新分配");
	   		window.location.href=window.location.href;
	   	}
	});
}