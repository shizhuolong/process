var pageSize = 5;
$(function() {
	//初始化页面 数据
	queryBydevNum();
	
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'updateGrpPerson'}).close();
	});
	
	$("#saveBtn").click(function(){
		var devNum = $.trim($("#devNum").val());
		var dealDate = $.trim($("#dealDate").val());
		var chanCode = $.trim($("#chanNum").val());
		var chanName = $.trim($("#chanName").text());
		var hrNum = $.trim($("#hrNum").val());
		var userName = $.trim($("#userName").text());
		if(chanCode==""||chanCode==null){
			alert("请填写渠道编码！");
			return;
		}
		if(hrNum==""||hrNum==null){
			alert("请填写hr编码！");
			return;
		}
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/grpManager_updateGrpPerson.action",
			data:{
				"devNum":devNum,
				"dealDate":dealDate,
				"chanCode":chanCode,
				"chanName":chanName,
				"hrNum":hrNum,
				"userName":userName
		   	},
			success:function(data){
				if(data.msg) {
		   			art.dialog.alert(data.msg);
		   			$("#chanNum").css("color","red");
		   			$("#hrNum").css("color","red");
		   			return;
		   		}else{
		   			art.dialog({
			   			title: '提示',
			   		    content: data.SUCCESS,
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
			   		    	var win = artDialog.open.origin;//来源页面
							win.art.dialog({id: 'updateGrpPerson'}).close();
							//调用父页面的search方法，刷新列表
							win.search(0);
			   		    }
			   		});
		   		}
			}
		});
	});
});

/**验证hr编码是否正确*/
function checkHrCode(){
	var orgLevel = $("#orgLevel").val();
	var chanCode =$("#chanNum").val();
	var hrNum = $("#hrNum").val();
	$("#hrNum").css("color","#000000");
	$("#userName").css("color","#000000");
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_checkHrCode.action",
		data:{
			"hrNum":hrNum,
			"orgLevel":orgLevel,
			"chanCode":chanCode
	   	},
		success:function(data){
			if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			$("#userName").text(data.msg);
	   			$("#hrNum").css("color","red");
	   			$("#userName").css("color","red");
	   			return;
	   		}
			$("#userName").text(data.REALNAME);
		}
	});
}

/**验证填写渠道编码是否正确*/
function checkChannelCode(){
	$("#chanNum").css("color","#000000");
	$("#chanName").css("color","#000000");
	var devNum =$("#devNum").val();
	var chanCode =$("#chanNum").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/grpManager_checkChannelCode.action",
		data:{
			"devNum":devNum,
			"chanCode":chanCode
	   	},
		success:function(data){
			if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			$("#chanName").text(data.msg);
	   			$("#chanNum").css("color","red");
	   			$("#chanName").css("color","red");
	   			return;
	   		}
			$("#chanName").text(data.GROUP_ID_4_NAME);
		}
	});
}

function queryBydevNum(){
	var devNum = $("#devNum").val();
	var dealDate = $("#dealDate").val();

	var sql = "SELECT T.HQ_CHAN_CODE,                "+
				"       T.HQ_CHAN_NAME,                "+
				"       T.HR_ID,                       "+
				"       T.NAME                        "+
				"  FROM PORTAL.TAB_PORTAL_GRP_PERSON T "+
				" WHERE T.DEVELOPER = "+devNum+
				"   AND T.DEAL_DATE = "+dealDate;
	//权限
	var d=query(sql);
	if (d) {
		$("#chanNum").val(d[0].HQ_CHAN_CODE);
		$("#chanName").text(d[0].HQ_CHAN_NAME);
		$("#hrNum").val(d[0].HR_ID);
		$("#userName").text(d[0].NAME);
	} else {
		alert("获取信息失败");
	}

}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
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
	//loadWidowMessage(0);
	return ls;
}