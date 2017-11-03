var pageSize = 5;
$(function() {
	var deal_date = art.dialog.data('deal_date');
	var group_id_name = art.dialog.data('group_id_name');
	var unit_name = art.dialog.data('unit_name');
	var hr_id = art.dialog.data('hr_id');
	var name = art.dialog.data('name');
	loadData(deal_date,hr_id);
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'networkUpdateDialog'}).close();

	});
	$("#saveBtn").hide();
	$("#saveBtn").click(function(){
		var username=$("#username").val();
		var salary_num=$("#salary_num").val();
		var award_num=$("#award_num").val();
		var group_id_name=$("#group_id_name").val();
		var unit_name=$("#unit_name").val();
		var hr_id=$("#hr_id").val();
		var deal_date=$("#deal_date").val();
		var nmae=$("#nmae").val();
		var url=$("#ctx").val()+'/fixedSalary/import-fixed-salary!update.action';
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:url,
			data:{
	           	"username":username,
	           	"group_id_name":group_id_name,
	           	"unit_name":unit_name,
	           	"hr_id":hr_id,
	           	"deal_date":deal_date,
	           	"nmae":nmae,
	           	"salary_num":salary_num,
	           	"award_num":award_num
		   	}, 
		   	success:function(data){
				art.dialog({
		   			title: '提示',
		   		    content: data,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'networkUpdateDialog'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			},
		  error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("加载数据失败！");
			    }
		});
	});
	$("#salary_num").blur(function(){
		var s=$("#salary_num").val();
		if (s == null||s=="") { 
		$("#salary").show();
		$("#salary").html("固定薪酬不能为空");
		} else{$("#salary").hide();$("#saveBtn").show();}
	});
	$("#award_num").blur(function(){
		var s=$("#salary_num").val();
		if (s == null||s=="") {
		$("#award").show();
		$("#award").html("专项奖励不能为空");
		} else{$("#award").hide();$("#saveBtn").show();}
	});
});

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

function loadData(deal_date,hr_id) {
	$.ajax({
        type: "POST",
        async:true,
        cache:false,
        url:$("#ctx").val()+'/fixedSalary/import-fixed-salary!list1.action',
        data:{
            "deal_date":deal_date,
            "hr_id":hr_id
            },
        success:function(data){
        	var obj = $.parseJSON(data);
        	$("#deal_date").val(obj.rows[0].DEAL_DATE);
        	$("#group_id_name").val(obj.rows[0].GROUP_ID_1_NAME);
        	$("#unit_name").val(obj.rows[0].UNIT_NAME);
        	$("#hr_id").val(obj.rows[0].HR_ID);
        	$("#nmae").val(obj.rows[0].NMAE);
        	$("#salary_num").val(obj.rows[0].SALAY_NUM);
        	$("#award_num").val(obj.rows[0].AWARD_NUM);
        }
    });
}

