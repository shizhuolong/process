var pageSize = 5;
$(function() {
	//查询地市
	listRegions();
	//根据地市查询人员
	$("#regionName").change(function(){
		queryPersonByCity();
	});
	
	//根据人员姓名设置好人编码
	$("#userName").change(function(){
		$("#hrCode").html("");
		addHrCode();
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'addKpiBasePerformance'}).close();
	});
	
	$("#saveBtn").click(function(){
		var time = $.trim($("#time").val());
		var regionCode = $.trim($("#regionName").val());
		var userName = $.trim($("#userName").val());
		if(userName==""||userName==null){
			alert("请选择人员姓名！");
			return;
		}
		var hrCode = $.trim($("#hrCode").text());
		if(hrCode==""||hrCode==null){
			alert("hr编码不存在！");
			return;
		}
		var baseSalary = $.trim($("#baseSalary").val());
		if(baseSalary==""||baseSalary==null){
			alert("基础薪酬不能为空！！！");
			return;
		}
		
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/kpiManager/kpiBasicPerConfig_saveKpiBasicPerConfig.action",
			data:{
				"time":time,
				"regionCode":regionCode,
				"userName":userName,
				"hrCode":hrCode,
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
						win.art.dialog({id: 'addKpiBasePerformance'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});


function addHrCode(){
	var hrCode = $.trim($("#userName").find("option:selected").attr("hrId"));
	if(hrCode!=''&&hrCode!=null){
		$("#hrCode").html(hrCode);
	}
	
}

function queryPersonByCity(){
	var regionCode = $.trim($("#regionName").val());
	var time = $.trim($("#time").val());
	var month = $.trim($("#month").val());
	var thisMonth = month+1;
	if(time==month||time==thisMonth){
		var sql = "SELECT  HR_ID, NAME                    "+
					"  FROM PORTAL.TAB_PORTAL_QJ_PERSON T              "+
					" WHERE T.DEAL_DATE = "+time						+
					"   AND T.GROUP_ID_1 = "+regionCode					+
					"   AND NOT EXISTS (SELECT 1                       "+
					"          FROM PTEMP.TB_JCDY_PORTAL_BASESALARY_MON"+
					"         WHERE DEAL_DATE = "+time					+
					"           AND GROUP_ID_1 = "+regionCode			+
					"           AND HR_ID = T.HR_ID)                   ";
		//权限
		var d=query(sql);
		if (d) {
			var h = '';
			if (d.length == 1) {
				h += '<option value="' + d[0].NAME + '"  hrId="' + d[0].HR_ID + '" selected >'
						+ d[0].NAME + '</option>';
			} else {
				h += '<option value="" selected>请选择</option>';
				for (var i = 0; i < d.length; i++) {
					h += '<option value="' + d[i].NAME + '" hrId="' + d[0].HR_ID + '">' + d[i].NAME + '</option>';
				}
			}
			var $area = $("#userName");
			var $h = $(h);
			$area.empty().append($h);
		} else {
			alert("获取人员信息失败");
		}
	}else{
		alert("不能新增超过本月或者上一个月以外的其他帐期的数据！！！");
	}
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function listRegions(){
	var sql = "SELECT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PCDE.TB_CDE_REGION_CODE T WHERE 1=1";
	var orderBy =" ORDER BY T.GROUP_ID_1"
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var regionCode = $("#regionCode").val();
	if(orgLevel==1){
		
	}else{
		sql+=" AND T.GROUP_ID_1="+regionCode;
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
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
	//loadWidowMessage(0);
	return ls;
}