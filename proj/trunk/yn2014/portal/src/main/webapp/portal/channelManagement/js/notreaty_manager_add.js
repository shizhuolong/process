	var orgLevel='';
	var orgId='';
	$(function(){		
		var orgLevel=$("#orgLevel").val();
		var orgId=$("#orgId").val();
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/channelManagement/notReatyManager_listArea.action",
			data:{
	           "orgId":orgId,
	           "orgLevel":orgLevel
		   	}, 
		   	success:function(data){
		   		if(data&&data.length>0){
		   			var h='';
		   			if(data.length==1){
		   				h+='<option value="'+data[0].REGION_CODE+'" selected areaId="'+data[0].ID+'">'+data[0].REGION_NAME+'</option>';
		   				changeUnit(orgLevel>2?orgId:data[0].ID,orgLevel);
		   			}else{
		   				h+='<option value="" selected>请选择</option>';
		   				for(var i=0;i<data.length;i++){
		   					h+='<option value="'+data[i].REGION_CODE+'" areaId="'+data[i].ID+'">'+data[i].REGION_NAME+'</option>';
		   				}
		   			}
		   			var $area=$("#GROUP_ID_1");
		   			var $h=$(h);
		   			$area.empty().append($h);
		   			$area.change(function(){
		   				$("#GROUP_ID_1_NAME").val($(this).find("OPTION[value='"+$(this).val()+"']").text());
		   				changeUnit(orgLevel>2?orgId:$(this).find("OPTION[value='"+$(this).val()+"']").attr("areaId"),orgLevel);
		   			});
		   		}else{
		   			alert("获取地市信息失败");
		   		}
		   }
		});
		$("#CHANLNAME").blur(function(){
			checkChanlName();
		});
		$("#CHANLNAME").focus(function(){
			if($("#GROUP_ID_1").val()==""){
				alert("请先选择地市");
				$(this).blur();
			}
		});
		
		//判断操作类型
		var action=$("#action").val();
		if(action=='add'){
			edit($("#CHANLID").val());
		}
		if(action=='view'){
			edit($("#CHANLID").val());
			view();
		}
	});
	function changeUnit(areaId,level){
		if(!areaId||areaId.length<=0){
			$("#UNIT_ID").empty();
		}
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/channelManagement/notReatyManager_listServiceCenter.action",
			data:{
	           "orgId":areaId,
	           "orgLevel":level
		   	}, 
		   	success:function(data){
		   		if(data&&data.length>0){
		   			var h='';
		   			if(data.length==1){
		   				h+='<option value="'+data[0].CODE+'" selected unitId="'+data[0].ID+'" >'+data[0].ORGNAME+'</option>';
		   				$("#UNIT_NAME").val(data[0].ORGNAME);
		   			}else{
		   				h+='<option value="" selected>请选择</option>';
		   				for(var i=0;i<data.length;i++){
		   					h+='<option value="'+data[i].CODE+'" unitId="'+data[i].ID+'">'+data[i].ORGNAME+'</option>';
		   				}
		   			}
		   			var $unit=$("#UNIT_ID");
		   			var $h=$(h);
		   			$unit.empty().append($h);
		   			$unit.change(function(){
		   				$("#UNIT_NAME").val($(this).find("OPTION[value='"+$(this).val()+"']").text());
			   			var oldId=$("#OLDUNIT_ID").val();
			   			var newId=$("#UNIT_ID").val();
			   			if(oldId!=newId&&$("#USERID").val().length>0){
			   				alert("由于营服中心已经改变，渠道经理信息已经被清空，请重新选择，");
			   				$("#AGENT_NAME").val("");
			   				$("#AGENT_TEL").val("");
			   				$("#HR_ID").val("");
			   				$("#USERID").val("");
			   				$("#OLDUNIT_ID").val($(this).val());
			   			}
		   			});
		   			if(data.length==1){
		   				$unit.trigger("change");
		   			}
		   		}else{
		   			alert("获取营服中心信息失败");
		   		}
		   }
		});
	}
	function checkChanlName(){
		var name=$("#CHANLNAME").val();
		var code=$("#GROUP_ID_1").val();
		if(hasChanlName(code,name)){
			alert($("#GROUP_ID_1_NAME").val()+"下已经存在--"+name+"");
			$("#CHANLNAME").val("");
			return false;
		}
		return true;
	}
	function hasChanlName(code,chanlName){
		if($("#CHANLNAME").attr("oldName")==chanlName){
			return false;
		}
		var r=false;
		if(chanlName&&$.trim(chanlName).length>0&&code&&code.length>0){
			$.ajax({
				type:"POST",
				async:false,
				dataType:'json',
				cache:false,
				url:$("#ctx").val()+"/channelManagement/notReatyManager_hasChanlName.action",
				data:{
		           "resultMap.code":code,
		           "resultMap.chanlName":chanlName
			   	}, 
			   	success:function(data){
			   		if(data&&data.length>0){
			   			r= true;
			   		}else{
			   			r= false;
			   		}
			   }
			});
		}
		return r;
	}
	function selectChannel(){
		var chanlCode=$("#UP_CHANL_HQ_CODE").val();
		if(chanlCode.length<=0){return;}
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/notReatyManager_getChanlByCode.action",
			data:{
	           "resultMap.chanlCode":chanlCode
		   	}, 
		   	success:function(data){
		   		if(data&&data.length>0){
		   			$("#TOP_GROUP_ID_4_NAME").val(data[0].GROUP_ID_4_NAME);
		   			$("#TOP_GROUP_ID_4").val(data[0].GROUP_ID_4);
		   			//在提交时要验证一下TOP_GROUP_ID_4与TOP_GROUP_ID_4_NAME的chanlCode是否一致
		   		}else{
		   			$("#TOP_GROUP_ID_4_NAME").val("");
		   			$("#TOP_GROUP_ID_4").val("");
		   			$("#UP_CHANL_HQ_CODE").val("");
		   			alert("您输入的上级渠道编码不正确");
		   			$("#UP_CHANL_HQ_CODE").focus();
		   		}
		   },
		   	error:function(){
		   		$("#TOP_GROUP_ID_4_NAME").val("");
	   			$("#TOP_GROUP_ID_4").val("");
	   			alert("您输入的上级渠道编码不正确");
	   			$("#UP_CHANL_HQ_CODE").focus();
	   			$("#UP_CHANL_HQ_CODE").val("");
		   	}
		});
	}
	function selectPrincipal(){
		var areaCode = $("#GROUP_ID_1").val();
		if(areaCode.length<=0){
			alert("先选择地市");
			return;
		}
		var unitId = $("#UNIT_ID").val();
		if(unitId.length<=0){
			alert("先选择营服中心");
			return;
		}
		var url = $("#ctx").val()+"/portal/channelManagement/jsp/notreaty_manager_bind_person.jsp";
		art.dialog.data('areaCode',areaCode);
		art.dialog.data('unitId',unitId);
		art.dialog.open(url,{
			id:'selectPersonDialog',
			width:'530px',
			height:'320px',
			lock:true,
			resize:false
		});
	}
	function setPrincipalValues(userId,userName,phone,hrId){
		$("#AGENT_NAME").val(userName);
		$("#AGENT_TEL").val(phone);
		$("#USERID").val(userId);
		$("#HR_ID").val(hrId);
	}
	function edit(id){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/channelManagement/notReatyManager_getUnit.action",
			data:{
				"model.CHANLID":id
			}, 
		   	success:function(data){
		   		if(data){
		   			$("#CHANLID").val(data["CHANLID"]);
		   			$("#GROUP_ID_1").val(data["GROUP_ID_1"]);
		   			$("#GROUP_ID_1").trigger("change");
		   			$("#GROUP_ID_1").attr("disabled",true);
		   			$("#UNIT_ID").val(data["UNIT_ID"]);
		   			$("#OLDUNIT_ID").val(data["UNIT_ID"]);
		   			$("#UNIT_ID").trigger("change");
		   			$("#CHANLNAME").val(data["CHANLNAME"]);
		   			$("#CHANLNAME").attr("oldName",data["CHANLNAME"]);
		   			$("#UP_CHANL_HQ_CODE").val(data["UP_CHANL_HQ_CODE"]);
		   			$("#TOP_GROUP_ID_4").val(data["TOP_GROUP_ID_4"]);
		   			$("#TOP_GROUP_ID_4_NAME").val(data["TOP_GROUP_ID_4_NAME"]);
		   			$("#TOWNS").val(data["TOWNS"]);
		   			$("#HAMLET").val(data["HAMLET"]);
		   			$("#CITY_TYPE").val(data["CITY_TYPE"]);
		   			$("#MARKET_TYPE").val(data["MARKET_TYPE"]);
		   			$("#COVER_RANGE").val(data["COVER_RANGE"]);
		   			$("#AGTMGR_NAME").val(data["AGTMGR_NAME"]);
		   			$("#AGTMGR_TEL").val(data["AGTMGR_TEL"]);
		   			$("#POSITION").val(data["POSITION"]);
		   			$("#AGENT_NAME").val(data["AGENT_NAME"]);
		   			$("#AGENT_TEL").val(data["AGENT_TEL"]);
		   			$("#HR_ID").val(data["HR_ID"]);
		   			$("#USERID").val(data["USERID"]);
		   			$("#COUNTER_LENGTH").val(data["COUNTER_LENGTH"]);
		   			$("#DOOR_WIDTH").val(data["DOOR_WIDTH"]);
		   			$("#ACT_CNT").val(data["ACT_CNT"]);
		   			$("#TECH_SUPPORT_CNT").val(data["TECH_SUPPORT_CNT"]);
		   			$("#CONSULT_CNT").val(data["CONSULT_CNT"]);
		   			$("#CNT_COUNT").val(data["CNT_COUNT"]);
		   			$("#MANAGER_CNT").val(data["MANAGER_CNT"]);
		   			$("#STAFF_NUM").val(data["STAFF_NUM"]);
		   			$("#AUTO_SELL_CNT").val(data["AUTO_SELL_CNT"]);
		   			$("#AUTO_PAY_CNT").val(data["AUTO_PAY_CNT"]);
		   			$("#AUTO_ACCEPTOR_CNT").val(data["AUTO_ACCEPTOR_CNT"]);
		   			$("#AUTO_CNT_COUNT").val(data["AUTO_CNT_COUNT"]);
		   			$("#ACCEPTED_CNT").val(data["ACCEPTED_CNT"]);
		   			$("#STAFF_COUNT").val(data["STAFF_COUNT"]);
		   			$("#BUS_DISTANCE").val(data["BUS_DISTANCE"]);
		   			$("#IS_MAIN_WAY").val(data["IS_MAIN_WAY"]);
		   			$("#OPERATE_AREA").val(data["OPERATE_AREA"]);	
		   			$("#lat").val(data["LAT"]);
		   			$("#lon").val(data["LNG"]);
		   		}else{
		   			alert("获取渠道信息出错");
		   		}
		   },
		   	error:function(){
		   		alert("获取渠道信息出错");
		   	}
		});
	}
	function view(){
		$("input").attr("disabled",true);
		$("select").attr("disabled",true);
		$(".photoflag").show();
		$(".photoflag").find("input").attr("disabled",false);
		$("#latlon").show();
		$("#saveBtn").hide();
	}
	function addSubmit(){
		//验证必填字段
		if(!checkRequired()){
			return false;
		}
		//验证数字
		if(!checkFnumber()){
			return false;
		}
		//验证整数
		if(!checkNumber()){
			return false;
		}
		//验证整数
		if(!unionTel()){
			return false;
		}
		var model=$("#updateForm").serialize();
		model+="&model.GROUP_ID_1="+$("#GROUP_ID_1").val();
		var url="";
		var rm="";
		if($("#CHANLID").val().length>0){
			url=$("#ctx").val()+"/channelManagement/notReatyManager_updateUnit.action"
			rm="更新";
		}else{
			url=$("#ctx").val()+"/channelManagement/notReatyManager_addUnit.action"
			rm="添加";
		}
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:url,
			data:model, 
		   	success:function(data){
		   		if(data){
		   			if(data.result>0){
		   				alert(rm+"成功");
		   				goBack();
		   			}else{
		   				alert(rm+"失败");
		   			}
		   			//在提交时要验证一下TOP_GROUP_ID_4与TOP_GROUP_ID_4_NAME的chanlCode是否一致
		   		}else{
		   			alert(rm+"渠道出错");
		   		}
		   },
		   	error:function(){
		   		alert(rm+"渠道出错");
		   	}
		});
	}
	function goBack(){
		history.go(-1);
	}
	function checkRequired(){
		var r=true;
		var msg="";
		$(".require").each(function(){
				if($.trim($(this).val()).length<=0){
					r=false;
					var tm=$(this).parent().prev().text();
					if(tm&&tm.length>0){
						msg+=$(this).parent().prev().text()+"是必填项\r\n";
					}
				}	
		});
		if(msg.length>0){
			alert(msg);
		}
		return r;
	}
	function checkFnumber(){
		var r=true;
		var msg="";
		$(".fnumber").each(function(){
			if($(this).val().length<=0){
				return;
			}
			if(isNaN($(this).val())||$(this).val()<0){
				r=false;
				var tm=$(this).parent().prev().text();
				if(tm&&tm.length>0){
					msg+=$(this).parent().prev().text()+"必须是大于等于0的数字\r\n";
				}
			}
		});
		if(msg.length>0){
			alert(msg);
		}
		return r;
	}
	function showMap(){
		var log_no=$("#lon").val();
		var lat_no=$("#lat").val();
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
	function checkNumber(){
		var r=true;
		var msg="";
		$(".number").each(function(){
			if($(this).val().length<=0){
				return;
			}
			if(!/^[0-9]+$/.test($(this).val())){
				r=false;
				var tm=$(this).parent().prev().text();
				if(tm&&tm.length>0){
					msg+=$(this).parent().prev().text()+"必须是大于等于0的整数\r\n";
				}
			}
		});
		if(msg.length>0){
			alert(msg);
		}
		return r;
	}
	function unionTel(){
		if(!/^((13[0-2])|(145)|(15[5-6])|(18[5-6])|(176))\d{8}$/.test($("#AGTMGR_TEL").val())){
			alert("必须输入联通号码");
			$("#AGTMGR_TEL").val("");
			$("#AGTMGR_TEL").focus();
			return false;
		}
		return true;
	}
	function selectPic(type){
		var picRoot="http://130.86.10.199:10006/portal";
		var picName="",picUrl="";
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,
			cache:false,
			url:$("#ctx").val()+"/channelManagement/notReatyManager_getPic.action",
			data:{
				"model.CHANLID":$("#CHANLID").val(),
				"model.PIC_TYPE":type
			}, 
		   	success:function(data){
		   		if(data){
		   			if(data.length&&data.length>0){
		   				picName=data[0]["PIC_NAME"];
		   				picUrl=data[0]["PIC_URL"];
		   			}else{
		   				picName=data["PIC_NAME"];
		   				picUrl=data["PIC_URL"];
		   			}
		   		}
		    }
		});
		if(picUrl==""){
				alert("您还没使用手机端上传此图片!");
				return;
		}
		art.dialog({
			title:'图片浏览',
			fixed:true,
			lock:true,
			padding:0,
			content:'<div style="width:600px;height:350px;overflow:auto;text-align:center;line-height:350px;"><img src="'+picRoot+picUrl+'" /></div>'
		});	
		(function ($) {
		    var types = ['DOMMouseScroll', 'mousewheel'];
		    $.event.special.mousewheel = {
		        setup: function () {
		            if (this.addEventListener) {
		                for (var i = types.length; i;) {
		                    this.addEventListener(types[--i], handler, false);
		                }
		            } else {
		                this.onmousewheel = handler;
		            }
		        },
		        teardown: function () {
		            if (this.removeEventListener) {
		                for (var i = types.length; i;) {
		                    this.removeEventListener(types[--i], handler, false);
		                }
		            } else {
		                this.onmousewheel = null;
		            }
		        }
		    };
		    $.fn.extend({
		        mousewheel: function (fn) {
		            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
		        },
		        unmousewheel: function (fn) {
		            return this.unbind("mousewheel", fn);
		        }
		    });

		　　function handler(event) {
		        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
		        event = $.event.fix(orgEvent);
		        event.type = "mousewheel";
		        // Old school scrollwheel delta
		        if (event.originalEvent.wheelDelta) { delta = event.originalEvent.wheelDelta / 120; }
		        if (event.originalEvent.detail) { delta = -event.originalEvent.detail / 3; }
		        // New school multidimensional scroll (touchpads) deltas
		        deltaY = delta;
		        // Gecko
		        if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
		            deltaY = 0;
		            deltaX = -1 * delta;
		        }
		        // Webkit
		        if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120; }
		        if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120; }
		        // Add event and delta to the front of the arguments
		        args.unshift(event, delta, deltaX, deltaY);
		        return $.event.handle.apply(this, args);
		    }
		})(jQuery);
		//定位到图片的位置,进行放大缩小
		$(".aui_content img").each(function(){
			var img=$(this);
			$(this).mousewheel(function (e, detail) {
				if(detail>0){
					$(img).height($(img).height()*1.2);
				}else{
					$(img).height($(img).height()*0.8);
				}
			});
		  });
	}