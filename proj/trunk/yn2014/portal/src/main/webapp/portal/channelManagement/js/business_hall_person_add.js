var sql="";
var code="";
var orgLevel="";
var deal_date="";
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'add'}).close();
	});
	deal_date=art.dialog.data('deal_date');
	$("#deal_date").val(deal_date);
	code=$("#code").val();
	orgLevel=$("#orgLevel").val();
	$("#user_code").change(function(){
		var user_code=$.trim($(this).val());
		if(orgLevel==1){
		sql="SELECT T.USER_CODE,T.USER_LOGIN_NAME,T.HQ_DEPT_ID,T.DEPT_NAME                "+
        "  FROM PORTAL.TB_PORTAL_BSS_USER T                                               "+
        "  JOIN PCDE.TB_CDE_CHANL_HQ_CODE T1                                              "+
        "  ON   (T.HQ_DEPT_ID=T1.HQ_CHAN_CODE)                                            "+
        "  WHERE T.USER_CODE='"+user_code+"'                                              "+
        "  AND   T.USER_CODE NOT IN (SELECT USER_CODE FROM PORTAL.TAB_PORTAL_MAG_PERSON T2"+
        "                            WHERE T.USER_CODE=T2.USER_CODE                       "+
        "                            AND T2.DEAL_DATE='"+deal_date+"')                     ";
		}else{
			sql="SELECT T.USER_CODE,T.USER_LOGIN_NAME,T.HQ_DEPT_ID,T.DEPT_NAME                "+
	        "  FROM PORTAL.TB_PORTAL_BSS_USER T                                               "+
	        "  JOIN PCDE.TB_CDE_CHANL_HQ_CODE T1                                              "+
	        "  ON   (T.HQ_DEPT_ID=T1.HQ_CHAN_CODE)                                            "+
	        "  WHERE T.USER_CODE='"+user_code+"'                                              "+
	        "  AND T1.GROUP_ID_1='"+code+"'                                                   "+
	        "  AND   T.USER_CODE NOT IN (SELECT USER_CODE FROM PORTAL.TAB_PORTAL_MAG_PERSON T2"+
	        "                            WHERE T.USER_CODE=T2.USER_CODE                       "+
	        "                            AND T2.DEAL_DATE='"+deal_date+"')                    ";
		}
        var r=query(sql);
        if(r&&r.length>=1){
        	$("#hq_chan_code").val(r[0].HQ_DEPT_ID);
    	    $("#hq_chan_name").val(r[0].DEPT_NAME);
    	    $("#user_login_name").val(r[0].USER_LOGIN_NAME);
        }else{
        	$("#hq_chan_code").val("");
    	    $("#hq_chan_name").val("");
    	    $("#user_login_name").val("");
        	alert("工位错误！");
        }
	});
	$("#hr_id").change(function(){
		var hq_chan_code=$("#hq_chan_code").val();
		var hr_id=$.trim($(this).val());
		var region=$("#region").val();
		sql="SELECT T1.REALNAME                                                 "+
		"FROM  PORTAL.APDP_USER T1                                              "+
		"WHERE NOT EXISTS (SELECT 1                                             "+
		"                  FROM PORTAL.VIEW_U_PORTAL_PERSON T2                  "+
		"                  WHERE T2.DEAL_dATE=TO_CHAR(SYSDATE,'YYYYMM')         "+
		"                  AND  T1.ID=T2.USERID                                 "+
		"                  AND  T2.GROUP_ID_1='"+region+"'                      "+
		"                  AND  T2.UNIT_ID !=(SELECT T4.UNIT_ID                 "+
		"                                     FROM PCDE.TAB_CDE_CHANL_HQ_CODE T4"+
		"                                     WHERE T4.HQ_CHAN_CODE='"+hq_chan_code+"'"+
		"                                     ))                                "+
		" AND EXISTS (SELECT 1                                                  "+
		"            FROM PORTAL.APDP_ORG T3                                    "+
		"            WHERE T1.ORG_ID=T3.ID                                      "+
		"            AND  T3.REGION_CODE='"+region+"'                           "+
		"            )                                                          "+
		"AND T1.ENABLED=1 AND T1.HR_ID='"+hr_id+"'                              ";
		var r=query(sql);
        if(r&&r.length>=1){
        	$("#realname").val(r[0].REALNAME);
        }else{
        	$("#realname").val("");
        	alert("HR编码错误！");
        }
	});
	
	$("#f_hr_id").change(function(){
		var f_hr_id=$.trim($("#f_hr_id").val());
		var user_code=$("#user_code").val();
		var hq_chan_code=$("#hq_chan_code").val();
		if(f_hr_id!=""){
			if(orgLevel==1){
				sql="SELECT NAME FROM PORTAL.TAB_PORTAL_MAG_PERSON  T                                                    "+
				"   WHERE T.DEAL_DATE='"+deal_date+"'                                                                    "+
				"   AND T.USER_TYPE=1                                                                                    "+
				"   AND T.HR_ID='"+f_hr_id+"'                                                                            "+
				"   AND T.UNIT_ID IN(SELECT UNIT_ID FROM PCDE.TAB_CDE_CHANL_HQ_CODE T1 WHERE T1.HQ_CHAN_CODE='"+hq_chan_code+"')";
			}else{
				sql="SELECT NAME FROM PORTAL.TAB_PORTAL_MAG_PERSON  T                                                    "+
				"   WHERE T.DEAL_DATE='"+deal_date+"'                                                                    "+
				"   AND T.USER_TYPE=1                                                                                    "+
				"   AND T.GROUP_ID_1='"+code+"'                                                                          "+
				"   AND T.HR_ID='"+f_hr_id+"'                                                                            "+
				"   AND T.UNIT_ID IN(SELECT UNIT_ID FROM PCDE.TAB_CDE_CHANL_HQ_CODE T1 WHERE T1.HQ_CHAN_CODE='"+hq_chan_code+"')";
			}
			var r=query(sql);
	        if(r&&r.length>=1){
	        	$("#name").val(r[0].NAME);
	        }else{
	        	$("#name").val("");
	        	alert("厅长HR编码错误！");
	        }
		}
	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/businessHallPerson_save.action';
		$('#add').form('submit',{
			url:url,
			dataType:"json",
			onSubmit:function(){
				var isValidate = $(this).form('validate');
				if(isValidate == false) {
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

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

