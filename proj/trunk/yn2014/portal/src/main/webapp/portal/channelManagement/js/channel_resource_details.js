$(function(){
	var group_id_4 = $("#group_id_4").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_loadChanlDetails.action",
		data:{
          "group_id_4":group_id_4
	   	}, 
	   	success:function(data){
	   		$("#hq_chan_code").html(data[0].HQ_CHAN_CODE);
	   		$("#group_id_4_name").html(data[0].GROUP_ID_4_NAME);
	   		$("#group_id_1_name").html(data[0].GROUP_ID_1_NAME);
	   		$("#unit_name").html(data[0].UNIT_NAME);
	   		$("#chn_cde_1_name").html(data[0].CHN_CDE_1_NAME);
	   		$("#chn_cde_2_name").html(data[0].CHN_CDE_2_NAME);
	   		$("#chn_cde_3_name").html(data[0].CHN_CDE_3_NAME);
	   		$("#chn_cde_4_name").html(data[0].CHN_CDE_4_NAME);
	   		$("#contact_name").html(data[0].CONTACT_NAME);
	   		$("#contact_phone").html(data[0].CONTACT_PHONE);
	   		$("#con_office_phone").html(data[0].CON_OFFICE_PHONE);
	   		$("#log_no").html(data[0].LOG_NO);
	   		$("#lat_no").html(data[0].LAT_NO);
	   		$("#chnl_addr").html(data[0].CHNL_ADDR);
	   		$("#status").html(data[0].STATUS);
	   		$("#is_mini_hall").html(data[0].IS_MINI_HALL);
	   		$("#create_time").html(data[0].CREATE_TIME);
	   		$("#hall_area_size").html(data[0].HALL_AREA_SIZE);
	   		$("#chain_flag").html(data[0].CHAIN_FLAG);
	   		$("#bus_area_size").html(data[0].BUS_AREA_SIZE);
	   		$("#name").html(data[0].NAME);
	   		$("#account").html(data[0].ACCOUNT);
	   		$("#phone").html(data[0].PHONE);
	   		if(data[0].IMGFORNT != null && data[0].IMGFORNT != "") {
	   			$("#imgfornt").attr("src","http://130.86.10.199:10006/portal/"+data[0].IMGFORNT);
	   		}
	   		if(data[0].IMGMIDDLE != null && data[0].IMGMIDDLE != "") {
	   			$("#imgmiddle").attr("src","http://130.86.10.199:10006/portal/"+data[0].IMGMIDDLE);
	   		}
	   		if(data[0].IMGLATER != null && data[0].IMGLATER != "") {
	   			$("#imglater").attr("src","http://130.86.10.199:10006/portal/"+data[0].IMGLATER);
	   		}
	   	}
	});
	$("#imgfornt").click(function(){
		var url = $(this).attr("src");
		var t = $(this).attr("alt");
		art.dialog({
			title:t,
			fixed:true,
			lock:true,
			content:'<img width="500" height="400" src="'+url+'" />'
	    });
	});
	$("#imgmiddle").click(function(){
		var url = $(this).attr("src");
		var t = $(this).attr("alt");
		art.dialog({
			title:t,
			fixed:true,
			lock:true,
			content:'<img width="500" height="400" src="'+url+'" />'
	    });
	});
	$("#imglater").click(function(){
		var url = $(this).attr("src");
		var t = $(this).attr("alt");
		art.dialog({
			title:t,
			fixed:true,
			lock:true,
			content:'<img width="500" height="400" src="'+url+'" />'
	    });
	});
});

function showMap(){
	var log_no=$("#log_no").text();
	var lat_no=$("#lat_no").text();
	if(log_no&&lat_no){
		var url=$("#ctx").val()+"/portal/channelManagement/jsp/chanl_position_map.jsp?log="+log_no+"&lat="+lat_no;
		art.dialog.open(url,{
			id:'showMap',
			width:'1030px',
			height:'320px',
			lock:true,
			resize:false
		});
	}else{
		alert("缺少经纬度信息");
	}
}