//var pageSize = 5;
var hrId = "";
var time = "";
$(function() {
	hrId = art.dialog.data('hrId');
	time = art.dialog.data('time');
	loadData();
	
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'editKpiBasePerformance'}).close();
	});
	
	$("#saveBtn").click(function(){
		var time = $.trim($("#time").text());
		var baseSalary = $.trim($("#baseSalary").val());
		if(baseSalary==""||baseSalary==null){
			alert("请填写基础薪酬！");
			return;
		}
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/kpiManager/kpiBasicPerConfig_updateKpiBasicPerConfig.action",
			data:{
				"time":time,
				"hrId":hrId,
				"baseSalary":baseSalary
		   	},
			success:function(r){
				//var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: r,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'editKpiBasePerformance'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});

/**
 * 加载编辑数据
 */
function loadData() {
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
        url:$("#ctx").val()+"/kpiManager/kpiBasicPerConfig_findKpiBasicByHrid.action",
        data:{
        	"hrId":hrId,
        	"time":time
        	},
        success:function(data){
        	$("#time").text(data.DEAL_DATE);
        	$("#regionName").text(data.GROUP_ID_1_NAME);
        	$("#userName").text(data.NAME);
        	$("#hrCode").text(data.HR_ID);
        	$("#baseSalary").val(data.BASESALARY);
        }
    });
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