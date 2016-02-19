var code="";
var user_code="";
var orgLevel="";
var chooseMonth="";
$(function() {
	code=$("#code").val();
	orgLevel=$("#orgLevel").val();
	chooseMonth=art.dialog.data('chooseMonth');
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
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var sql="";
	if(orgLevel==1){
		sql="SELECT T.REALNAME FROM PORTAL.APDP_USER T                                   "+
		"WHERE T.ORG_ID IN (                                                         "+
		"                   SELECT T.PARENT_ID FROM PORTAL.APDP_ORG T                "+
		"                    WHERE T.CODE IN                                         "+
		"                       (SELECT T.GROUP_ID_4 FROM PCDE.TB_CDE_CHANL_HQ_CODE T"+
		"                        WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"')            "+
		"                        )                                                   "+
		"AND T.ENABLED=1 AND T.HR_ID='"+hr_id+"'                                     "+
		"UNION ALL                                                                   "+
		"SELECT REALNAME FROM PORTAL.APDP_USER T                                     "+
		"WHERE T.ORG_ID  IN(                                                         "+
		"SELECT ID FROM PORTAL.APDP_ORG T                                            "+
		"WHERE T.ORGLEVEL=1                                                          "+
		"START WITH T.CODE IN (SELECT T.GROUP_iD_4 FROM PCDE.TB_CDE_CHANL_HQ_CODE T  "+
		"                        WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"')            "+
		"CONNECT BY PRIOR T.PARENT_ID=T.ID)                                          "+
		"AND T.ENABLED=1 AND T.HR_ID='"+hr_id+"'                                     ";
	}else{
	  sql="SELECT T.REALNAME FROM PORTAL.APDP_USER T                                    "+
           "WHERE T.ORG_ID  IN (                                                        "+
           "                   SELECT T.PARENT_ID FROM PORTAL.APDP_ORG T                "+
           "                    WHERE T.CODE IN                                         "+
           "                       (SELECT T.GROUP_iD_4 FROM PCDE.TB_CDE_CHANL_HQ_CODE T"+
           "                        WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"')            "+
           "                        )                                                   "+
           "AND T.ENABLED=1 AND T.HR_ID='"+hr_id+"'                                     "+
           "UNION ALL                                                                   "+
           "SELECT REALNAME FROM PORTAL.APDP_USER T                                     "+
           "WHERE T.ORG_ID  IN(                                                         "+
           "SELECT ID FROM PORTAL.APDP_ORG T                                            "+
           "WHERE T.ORGLEVEL=2                                                          "+
           "START WITH T.CODE IN (SELECT T.GROUP_iD_4 FROM PCDE.TB_CDE_CHANL_HQ_CODE T  "+
           "                        WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"')            "+
           "CONNECT BY PRIOR T.PARENT_ID=T.ID)                                          "+
           "AND T.ENABLED=1 AND T.HR_ID='"+hr_id+"'                                      ";
	}
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
		var sql="SELECT T.GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANL_HQ_CODE T " +
		"WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"'";
	}else{
		var sql="SELECT T.GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANL_HQ_CODE T " +
		"WHERE T.HQ_CHAN_CODE='"+hq_chan_code+"' AND T.GROUP_ID_1='"+code+"'";
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

