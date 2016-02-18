var code="";
var user_code="";
var orgLevel="";
$(function() {
	code=$("#code").val();
	orgLevel=$("#orgLevel").val();
	var chooseMonth=art.dialog.data('chooseMonth');
	$("#chooseMonth").val(chooseMonth);
	$("#hr_id").blur(function(){
		initName();
	});
	$("#hq_chan_code").blur(function(){
		initChanName();
	});
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();

	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/magPerson_save.action';
		$('#add').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
		    	return $(this).form('validate');
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
						win.art.dialog({
							content:document.getElementById('describe'),
							id:'describe',
							width:'250px',
							height:'90px',
							lock:true,
							title:'描述',
							ok: function () {
								win.art.dialog({id:"describe"}).close();
							}
						});
		   		    }
		   		});
			}
		});
	});
});
function initName(){
	var hr_id=$.trim($("#hr_id").val());
	var sql="SELECT T.REALNAME FROM PORTAL.APDP_USER T WHERE T.HR_ID='"+hr_id+"' AND T.ENABLED=1";
	var d=query(sql);
	if(d&&d.length>=1){
	 var name=d[0].REALNAME;
	 $("#name").val(name);
	}else{
		alert("主管编码错误");
	}
}
function initChanName(){
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	if(orgLevel==1){
		var sql="SELECT T.GROUP_ID_4_NAME FROM PCDE.TB_CDE_CHANL_HQ_CODE T WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"'";
	}else{
		var sql="SELECT T.GROUP_ID_4_NAME FROM PCDE.TB_CDE_CHANL_HQ_CODE T WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"' AND T.GROUP_ID_1='"+code+"'";
	}
	var d=query(sql);
	if(d&&d.length>=1){
	 var name=d[0].GROUP_ID_4_NAME;
	 $("#hq_chan_name").val(name);
	}else{
		alert("营业厅编码错误");
	}
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

