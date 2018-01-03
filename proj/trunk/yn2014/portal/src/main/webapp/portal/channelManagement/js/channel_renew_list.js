var isNeedApprover = true;
var pageSize = 10;
$(function(){
	//使用插件校验Form
	$("#updateForm").validate({
	    onfocusout: function(element){
	        $(element).valid();
	    }
	});
	
	search(0);
	
	$("#searchBtn").click(function(){
		search(0);
	});
	
	$("#renewBtn").click(function(){
		var id_array=new Array();  
		$('input[name="selected"]:checked').each(function(){  
		    id_array.push("'"+$(this).val()+"'");//向数组中添加元素  
		});
			var idstr=id_array.join(',');
			if(id_array.length>=2){
				var url="/portal/portal/channelManagement/jsp/channel_batch_renew.jsp?id="+idstr;
				//window.parent.openWindow("批量续签",'funMenu',url);
				window.location.href="/portal/portal/channelManagement/jsp/channel_batch_renew.jsp?id="+idstr;
			}else{
				art.dialog({
					title: '提示',
		   		    content: '选择的数量小于2',
		   		    icon: 'succeed',
		   		    lock: true
				});
			}
		
		/*
		art.dialog.open('/portal/portal/channelManagement/jsp/channel_renew.jsp?id=' + idstr, {
			width: '100%',   
		    height: '50%',    
			title : '批量续签'
		});*/
	});
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async: false,
		url:$("#ctx").val()+"/channel/renew-channel!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td> <input type='checkbox' name='selected' value='"+isNull(n['ID'])+"'></td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
                +"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
                +"<td>"+isNull(n['START_MONTH'])+"</td>"
                +"<td>"+isNull(n['END_MONTH'])+"</td>"
                +"<td>"+isNull(n['HZ_YEAR'])+"</td>"
                +"<td>"+isNull(n['ASSESS_TARGET'])+"</td>"
                +"<td>"+isNull(n['YSDZ_XS'])+"</td>"
                +"<td>"+isNull(n['ZX_BT'])+"</td>"
                +"<td>"+isNull(n['HZ_MS'])+"</td>"
                +"<td>"+isNull(n['FW_FEE'])+"</td>"
                +"<td>"+isNull(n['RATE_THREE'])+"</td>"
                +"<td>"+isNull(n['RATE_SIX'])+"</td>"
                +"<td>"+isNull(n['RATE_NINE'])+"</td>"
                +"<td>"+isNull(n['RATE_TWELVE'])+"</td>"
                +"<td><a href='#' uu_id='"+isNull(n['ID'])+"' onclick='renew($(this));' style='color:#BA0C0C;'>续签</a></td>"
                +"</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
				$("#submitTask").attr("disabled",false);
			}else {
				$("#submitTask").attr("disabled",true);
				$("#dataBody").empty().html("<tr><td colspan='14'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function renew(obj){
	var uu_id=$(obj).attr("uu_id");
	var formdiv=$('#addFormDiv');
	var url = $("#ctx").val()+"/channel/renew-channel!findById.action";
	$.get(url,
		  {id:uu_id},
		  function(data){
		  	 if(data!=null&&data!=""){
		  		var data=eval("("+data+")");
		  		$("#hq_chan_code").val(data.HQ_CHAN_CODE);
		  		$("#hq_chan_name").val(data.HQ_CHAN_NAME);
		  		$("#hz_year").val(data.HZ_YEAR);
		  		$("#assess_target").val(data.ASSESS_TARGET);
		  		$("#rate_three").val(data.RATE_THREE);
		  		$("#rate_six").val(data.RATE_SIX);
		  		$("#rate_nine").val(data.RATE_NINE);
		  		$("#rate_twelve").val(data.RATE_TWELVE);
		  		$("#ysdz_xs").val(data.YSDZ_XS);
		  		$("#zx_bt").val(data.ZX_BT);
		  		$("#hz_ms").val(data.HZ_MS);
		  		$("#fw_fee").val(data.FW_FEE);
		  	 }
	      });
	formdiv.show();
	formdiv.dialog({
		title : '续签',
		width : 400,
		height : 550,
		closed : false,
		cache : false,
		modal : true,
		maximizable : true,
		buttons: {
	        "保存": function() {
	        	$(this).dialog("close");
	        	formdiv.hide();
	        	var url = $("#ctx").val()+"/channel/renew-channel!renew.action";
	        	var hq_chan_code=$.trim($("#hq_chan_code").val());
	        	var hq_chan_name=$.trim($("#hq_chan_name").val());
	        	var assess_target=$.trim($("#assess_target").val());
	        	var rate_three=$.trim($("#rate_three").val());
	        	var rate_six=$.trim($("#rate_six").val());
	        	var rate_nine=$.trim($("#rate_nine").val());
	        	var rate_twelve=$.trim($("#rate_twelve").val());
	        	var hz_year=$.trim($("#hz_year").val());
	        	var ysdz_xs=$.trim($("#ysdz_xs").val());
	        	var zx_bt=$.trim($("#zx_bt").val());
	        	var hz_ms=$.trim($("#hz_ms").val());
	        	var fw_fee=$.trim($("#fw_fee").val());
	        	
	        	$.post(
	        			 url,
	        			 {
	        			   "resultMap.hq_chan_code":hq_chan_code,
	        			   "resultMap.hq_chan_name":hq_chan_name,
	        			   "resultMap.assess_target":assess_target,
	        			   "resultMap.rate_three":rate_three,
	        			   "resultMap.rate_six":rate_six,
	        			   "resultMap.rate_nine":rate_nine,
	        			   "resultMap.rate_twelve":rate_twelve,
	        			   "resultMap.id":uu_id,
	        			   "resultMap.ysdz_xs":ysdz_xs,
	        			   "resultMap.zx_bt":zx_bt,
	        			   "resultMap.hz_ms":hz_ms,
	        			   "resultMap.fw_fee":fw_fee,
	        			   "resultMap.hz_year":hz_year
	        			   
	        			 },
	        			 function(data,status){
	        				var win = artDialog.open.origin;//来源页面
	        			    var data = eval(data);
	        			    if(data!=""&&null!=data){
	        			    	win.art.dialog({
	        			    		title:"续签失败",
	        			    		icon:'error',
	        			    		content:data,
	        			    		width:'100px',
	        			    		height:'200px',
	        			    		lock:true,
	        			    		ok: function () {
	        							win.art.dialog.close();
	        			   		    }
	        			    	});
	        			    }else{
	        			    	win.art.dialog({
	        			   			title: '提示',
	        			   		    content: '续签成功',
	        			   		    icon: 'succeed',
	        			   		    lock: true,
	        			   		    ok: function () {
	        			   		    	//var win = artDialog.open.origin;//来源页面
	        			   		    	win.art.dialog.close();
	        							//调用父页面的search方法，刷新列表
	        							win.search(0);
	        			   		    }
	        			   		});
	        			    }
	        			 });
	        },
	        "返回": function() {
	        	$(this).dialog("close");
	        }
	    }
	});
}

function initPagination(totalCount) {
	 $("#totalCount").html(totalCount);
	 $("#pagination").pagination(totalCount, {
      callback: search,
      items_per_page:pageSize,
      link_to:"###",
      prev_text: '上页',       //上一页按钮里text  
  	next_text: '下页',       //下一页按钮里text  
  	num_display_entries: 5, 
  	num_edge_entries: 2
	 });
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
	}
	return obj;
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='' || obj=='null');
}
