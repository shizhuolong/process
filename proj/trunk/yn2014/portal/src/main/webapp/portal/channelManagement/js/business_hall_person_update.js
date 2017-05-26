var sql="";
var code="";
var orgLevel="";
var deal_date="";
$(function() {
	//关闭dailog
	$("#cancleBtn").click(function(){
		var win = artDialog.open.origin;//来源页面
		win.art.dialog({id: 'update'}).close();
	});
	code=$("#code").val();
	orgLevel=$("#orgLevel").val();
	deal_date=art.dialog.data('deal_date');
	$("#deal_date").val(deal_date);
	$("#user_code").val(art.dialog.data('user_code'));
	$("#hq_chan_code").val(art.dialog.data('hq_chan_code'));
	$("#hq_chan_name").val(art.dialog.data('hq_chan_name'));
	$("#hr_id").val(art.dialog.data('hr_id'));
	$("#realname").val(art.dialog.data('name'));
	$("#f_hr_id").val(art.dialog.data('f_hr_id'));
	initName(art.dialog.data('f_hr_id'));//初始化厅长姓名
	$("#hq_chan_code").blur(function(){
		var hq_chan_code=$.trim($(this).val());
		var user_code=$("#user_code").val();
		if(orgLevel==1){
		  sql="SELECT T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANl_hq_code T"+
		   " WHERE T.UNIT_ID IN (SELECT UNIT_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON  T  "+
		   "WHERE T.DEAL_DATE='"+deal_date+"' AND T.USER_CODE='"+user_code+"')       "+
		   "AND T.HQ_CHAN_CODE='"+hq_chan_code+"'        ";
		}else{
	      sql="SELECT T.HQ_CHAN_CODE,T.GROUP_ID_4_NAME FROM PCDE.TAB_CDE_CHANl_hq_code T"+
			   " WHERE T.UNIT_ID IN (SELECT UNIT_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON  T  "+
			   "WHERE T.DEAL_DATE='"+deal_date+"' AND T.USER_CODE='"+user_code+"')       "+
			   "AND T.GROUP_ID_1='"+code+"' AND T.HQ_CHAN_CODE='"+hq_chan_code+"'        ";
		}
        var r=query(sql);
        if(r&&r.length>=1){
    	    $("#hq_chan_name").val(r[0].GROUP_ID_4_NAME);
        }else{
        	$("#hq_chan_name").val("");
        	alert("营业厅编码错误！");
        }
	});
	$("#hr_id").blur(function(){
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
		"AND T1.ENABLED=1 AND T1.HR_ID='11'                                     ";
		var r=query(sql);
        if(r&&r.length>=1){
        	$("#realname").val(r[0].REALNAME);
        }else{
        	$("#realname").val("");
        	alert("HR编码错误！");
        }
	});
	$("#f_hr_id").blur(function(){
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
		}else{
			$("#name").val("");
		}
	});
	$("#saveBtn").click(function(){
		var url = $("#ctx").val()+'/channelManagement/businessHallPerson_update.action';
		var user_code = $.trim($("#user_code").val());
		var hq_chan_code = $.trim($("#hq_chan_code").val());
		var hq_chan_name = $.trim($("#hq_chan_name").val());
		var hr_id = $.trim($("#hr_id").val());
		var f_hr_id = $.trim($("#f_hr_id").val());
		if(hq_chan_name==null || hq_chan_name==''){
			alert("工位不在该渠道下,不能提交！");
			return;
		}
		
		//alert("===============|"+f_hr_id+"|=========");
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:url,
			data:{
	           	"user_code":user_code,
	           	"hq_chan_code":hq_chan_code,
	           	"hq_chan_name":hq_chan_name,
	           	"hr_id":hr_id,
	           	"f_hr_id":f_hr_id,
	           	"deal_date":deal_date
		   	}, 
		   	success:function(data){
				//var d = $.parseJSON(r);
				art.dialog({
		   			title: '提示',
		   		    content: data,
		   		    icon: 'succeed',
		   		    lock: true,
		   		    ok: function () {
		   		    	var win = artDialog.open.origin;//来源页面
						win.art.dialog({id: 'update'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}/*,
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
			   alert("加载数据失败！");
		    }*/
		});
		/*$('#update').form('submit',{
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
						win.art.dialog({id: 'update'}).close();
						//调用父页面的search方法，刷新列表
						win.search(0);
		   		    }
		   		});
			}
		});*/
	});
});
function initName(f_hr_id){
	var user_code=$.trim($(user_code).val());
	sql="SELECT REALNAME FROM PORTAL.APDP_USER T WHERE T.HR_ID ='"+f_hr_id+"'";
    var r=query(sql);
    if(r&&r.length>=1){
        $("#name").val(r[0].REALNAME);
    }
} 
function isNull(obj){
	if(obj == undefined || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

