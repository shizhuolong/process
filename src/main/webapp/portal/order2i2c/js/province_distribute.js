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
});
function getAllOrders(){
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!taskListDetail.action",
		data:{
			"resultMap.workNo":workNo,
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
		url:$("#ctx").val()+"/t2i2c/t2i2c!getTeamByWorkNo.action",
		data:{
		   "workNo":workNo
	   	}, 
	   	success:function(data){
	   		teams=data;
	   		var t="<li><span>订单总数</span><br/><a id='team_all' href='javascript:void(0);' onclick='showDetail(\"\",0)'>"+orders.length+"</a>";
	   		t+="<ul>"
	   		for(var i=0;i<teams.length;i++){
	   			var team=teams[i];
	   			t+="<li><span>"+team.NAME+"</span><br/><a id='team_"+team.ID+"' href='javascript:void(0);' onclick='showDetail(\""+team.ID+"\",1)'></a>";
	   			if(team.children&&team.children.length){
	   				t+="<ul>";
	   				for(var j=0;j<team.children.length;j++){
	   					var subTeam=team.children[j];
	   					t+="<li><span>"+subTeam.NAME+"</span><br/><a id='team_"+subTeam.ID+"' href='javascript:void(0);' onclick='showDetail(\""+subTeam.ID+"\",2)'></a>";
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
	
	params.taskNo=workNo;
	params.disValue=disValue;
	params.disType=disType;
	params.dis=dis;
	
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/t2i2c/t2i2c!provinceDistribute.action",
		data:{
		   jsonStr:JSON.stringify(params)
	   	}, 
	   	success:function(data){
	   		alert(data.msg);
	   		if(data.ok){
	   			var win = artDialog.open.origin;//来源页面
	   			win.search(win.curPage);
	   			win.art.dialog({id: 'redisDlg'}).close();
	   		}
	   	},
	   	error:function(){
	   		alert("出现错误，请重新分配");
	   		window.location.href=window.location.href;
	   	}
	});
}
function showDetail(teamId,teamType){
	/*var url=path+"/portal/order2i2c/jsp/distribute_view_list.jsp?workNo="+workNo+"&teamType="+teamType+"&teamId="+teamId;
	art.dialog.open(url,{
		title:'分配明细'
	});*/
}