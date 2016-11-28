$(function(){
	var group_id_4 = $("#group_id_4").val();
	var chnl_id = $("#chnl_id").val();
	listChnlType();
	var orgLevel=$("#orgLevel").val();
	if(orgLevel>1){
		$("#addBtn").remove();
	}
	$("#addBtn").click(function(){
		var formdiv=$('#addFormDiv');
		formdiv.show();
		formdiv.dialog({
			title : '添加',
			width : 400,
			height : 100,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true
		});
	});
	$("#saveBtn").click(function(){
		add();
	});
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		async:false,
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
	   		$("#chnl_type").val(chnl_id);
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
	$("#updateBtn").click(function(){
		update();
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

function add(){
	var url = $("#ctx").val()+'/channelManagement/channelResource_add.action';
	var addForm=$('#addForm');
	addForm.form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($(this).form('validate')==false){
				return false;
			}
			var d=isExist();
			if(d==true){
				return false;
			}
		},
		success:function(data){
			var d = $.parseJSON(data);
			alert(d.msg);
			$('#addFormDiv').dialog('close');
			listChnlType();
			openDetail1();
		}
	});
}

function openDetail1(){
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_resource_list_detail1.jsp";
	/*art.dialog.open(url,{
		id:'update',
		width:'1200px',
		height:'1000px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'列表'
	});*/
	window.parent.openWindow("渠道类型列表",null,url);
}

function isExist(){
	var r=false;
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_isExist.action", 
        dataType: "json",
		data:{
			type_name:$("#type_name").val()
		},
		 success:function(data){
			 if(data.msg){
				 r=true;
				 alert(data.msg);
			 }
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});
	return r;
}

function update(){
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_update.action", 
        dataType: "json",
		data:{
			chnl_id:$("#chnl_type").val(),
			chnl_type:$("#chnl_type").find("option:selected").attr("chnl_type"),
			hq_chan_code:$("#hq_chan_code").text()
		},
		 success:function(data){
			alert(data.msg);
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});
}

function listChnlType(){
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_loadChnlType.action", 
        dataType: "json",
        async:false,
		success:function(d){
			if (d&&d[0]) {
				var h = '';
					//h += '<option value="" selected>请选择</option>';
					for (var i = 0; i < d.length; i++) {
						h += '<option chnl_type="'+d[i].TYPE_NAME+'" value="' + d[i].ID + '">' + d[i].TYPE_NAME + '</option>';
					}
				$("#chnl_type").empty().append($(h));
    	 } else {
    		alert("获取渠道类型失败!");
    	 }
	    },
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});
}

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