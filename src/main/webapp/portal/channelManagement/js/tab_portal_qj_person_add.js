var code="";
var user_code="";
$(function() {
	code=$("#code").val();
	listSelect();
	$("#job").change(function(){
		//user_code=$(this).attr("user_code");
		//$("select[name=items]").find("option:selected").text();
		user_code=$(this).find("option:selected").attr("user_code");
		$("#user_code").val(user_code);
	});
	$("#hr_id").blur(function(){
		initName();
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/qjPerson_save.action';
		$('#add').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
		    		return false;
				}
				var hr_id=$.trim($("#hr_id").val());
				var result = "";
				$.ajax({
			        type: "POST",
			        dataType:"json",
			        async:false,
			        cache:false,
			        url:$("#ctx").val()+"/channelManagement/qjPerson_checkIsHrIdRepeat.action",
			        data:{
			        	"hr_id":hr_id,
			        },
			        success:function(r){
			        	if(r.message){
			        		result=r.message;
			        	}else {
			            }
			        }
			    });
				if(result != "") {
					art.dialog.alert(result);
					return false;
				}
				return true;
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
						win.art.dialog({id: 'add'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});
	});
});
function listSelect(){
	listunit_name();
	listemp_type();
	listjob();
	listjob_type();
}
function listunit_name(){
	var sql = "SELECT UNIT_ID,UNIT_NAME FROM PCDE.TAB_CDE_GROUP_CODE T WHERE T.GROUP_ID_1='"+code+"' ORDER BY GROUP_ID_1,UNIT_ID";
	var d=query(sql);
	if (d) {
		var h = '';
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		$("#unit_name").empty().append($(h));
	} else {
		alert("获取营服中心失败");
	}
}
function listemp_type(){
	var sql = "SELECT DISTINCT T.EMP_TYPE FROM PORTAL.TAB_PORTAL_QJ_PERSON T WHERE T.EMP_TYPE!='#N/A' AND T.EMP_TYPE IS NOT NULL";
	var d=query(sql);
	if (d) {
		var h = '';
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].EMP_TYPE + '">' + d[i].EMP_TYPE + '</option>';
			}
		$("#emp_type").empty().append($(h));
	} else {
		alert("获取从业类型失败");
	}
}
var user_code="";
function listjob(){
	var sql = "SELECT DISTINCT T.USER_TYPE,T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T union all select '后台支撑' as user_type,0 as user_code from dual";
	var d=query(sql);
	if (d) {
		var h = '';
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].USER_TYPE + '" user_code="' + d[i].USER_CODE + '">' + d[i].USER_TYPE + '</option>';
			}
		$("#job").empty().append($(h));
	} else {
		alert("获取岗位失败");
	}
}
function listjob_type(){
	var sql = "SELECT DISTINCT T.JOB_TYPE FROM PORTAL.TAB_PORTAL_QJ_PERSON T WHERE T.JOB_TYPE IS NOT NULL";
	var d=query(sql);
	if (d) {
		var h = '';
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].JOB_TYPE + '">' + d[i].JOB_TYPE + '</option>';
			}
		$("#job_type").empty().append($(h));
	} else {
		alert("获取岗位类型失败");
	}
}
function initName(){
	var unit_name=$("#unit_name").val();
	var hr_id=$("#hr_id").val();
	var sql="SELECT DISTINCT T.NAME FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.UNIT_NAME='"+unit_name+"' AND T.HR_ID='"+hr_id+"'";
	var d=query(sql);
	if(d&&d.length>=1){
	 var name=d[0].NAME;
	 $("#name").val(name);
	}else{
		alert("主管编码错误");
		//return;
	}
	
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

