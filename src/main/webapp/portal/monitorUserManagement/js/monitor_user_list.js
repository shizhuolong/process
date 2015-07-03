var pageSize = 15;
var types=null;
$(function() {
	types=getTypes();
	getRegionCity();
	search(0);
	$("#regionCity").change(function(){
		getRegionUnit($(this));
		checkLevelDesc();
	});
	$("#searchBtn").click(function(){
		search(0);
	});
	checkLevelDesc();
	$("#unitName").change(function(){
		checkLevelDesc();
	});
	$("#addBtn").click(function(){
		showAddOrUpdateDialog(null);
	});
	$("#cancelBtn").click(function(){
		art.dialog({ id: 'addFormDialog' }).close();
	});
	$("#saveBtn").click(function(){
		var busiType="";
		$("input[name='busiType']").each(function(){
			if($(this).attr("checked")){
				if(busiType.length>0){
					busiType+=",";
				}
				busiType+=$(this).val();
			}
		});
		if(!$("input[name='resultMap.name']").val().length){
			alert("姓名不能为空");
			return;
		}
		var oldName=$("#oldName").val();
		var oldPhone=$("#oldPhone").val();
		var name=$("input[name='resultMap.name']").val();
		var phone=$("input[name='resultMap.phone']").val();
		if(oldName!=name&&existName(name)){
			alert("姓名已经存在,请在列表中找到该用户进行编辑");
			return;
		}
		if(!$("input[name='resultMap.phone']").val().length){
			alert("电话不能为空");
			return;
		}
		if(oldPhone!=phone&&existPhone(phone)){
			alert("电话号码已经存在,请在列表中找到该电话相关的用户进行编辑");
			return;
		}
		if(!/^((13[0-2])|(145)|(15[5-6])|(18[5-6])|(176))\d{8}$/.test($("input[name='resultMap.phone']").val())){
			alert("必须输入联通号码");
			return;
		}
		if (!busiType.length) {
			alert("请选择业务类型");
			return;
		}
		$("input[name='resultMap.busiType']").val(busiType);
		var model=$("#addForm").serialize();
		var url=$("#addForm").attr("action");
		var rm="";
		if($("input[name='resultMap.id']").val().length>0){
			rm="更新";
		}else{
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
		   			if(data.ok){
		   				alert(rm+"成功");
		   				art.dialog({ id: 'addFormDialog' }).close();
		   				search(0);
		   			}else{
		   				alert(rm+"失败");
		   			}
		   		}else{
		   			alert(rm+"出错");
		   		}
		   },
		   	error:function(){
		   		alert(rm+"出错");
		   	}
		});
	});
});
function checkLevelDesc(){
	var regionCode=$("#regionCity").val();
	var unitCode=$("#unitName").val();
	if(regionCode=='86000'&&unitCode==''){
		var html="<option value='省级管理员'>省级管理员</option>";
		$("#levelDesc").empty().append($(html));		
	}else if(regionCode!='86000'&&unitCode==''){
		var html="<option value='地市管理员'>地市管理员</option>";
		$("#levelDesc").empty().append($(html));
	}else if(regionCode!='86000'&&unitCode!=''){
		var html="<option value='营服管理员'>营服管理员</option>";
		$("#levelDesc").empty().append($(html));
	}
}
function getRegionUnit(obj){
	var regionCode=obj.attr("value");
	var sql="SELECT T.CODE,T.ORGNAME FROM portal.apdp_org T where T.ORGLEVEL='3'"+" and T.REGION_CODE='"+regionCode+"'";
	var data=query(sql);
	var html="";
	html+="<option value=''>全部</option>";
    for(var i=0;i<data.length;i++){
    	html+="<option value="+data[i].CODE+">"+data[i].ORGNAME+"</option>";
    }
    $("#unitName").empty().append($(html));
}
function getStartUnit(code){
	var sql="SELECT T.CODE,T.ORGNAME FROM portal.apdp_org T where T.ORGLEVEL='3'"+" and T.REGION_CODE='"+code+"'";
	var data=query(sql);
	var html="";
	html+="<option value=''>全部</option>";
    for(var i=0;i<data.length;i++){
    	html+="<option value="+data[i].CODE+">"+data[i].ORGNAME+"</option>";
    }
    $("#unitName").empty().append($(html));
}
function getStartUnitByRegionName(regionName){
	var sql="SELECT T.CODE,T.ORGNAME FROM portal.apdp_org T where T.ORGLEVEL='3'"+" and T.REGION_NAME='"+regionName+"'";
	var data=query(sql);
	var html="";
	html+="<option value=''>全部</option>";
    for(var i=0;i<data.length;i++){
    	html+="<option value="+data[i].CODE+">"+data[i].ORGNAME+"</option>";
    }
    $("#unitName").empty().append($(html));
}
function getRegionCity(){
	var sql="SELECT T.CODE,T.ORGNAME,T.REGION_NAME FROM portal.apdp_org T where T.orgLevel='1' UNION ALL SELECT T.CODE,T.ORGNAME,T.REGION_NAME FROM portal.apdp_org T where T.orgLevel='2'";
	var data=query(sql);
	var html="";
	for(var i=0;i<data.length;i++){
		html+="<option value="+data[i].CODE+" region_name="+data[i].REGION_NAME+">"+data[i].ORGNAME+"</option>";
	};
	$("#regionCity").empty().append($(html));
}
function getTypes(){
	var sql="SELECT * FROM PORTAL.TB_PORTAL_MONITOR_BUSI_TYPE";
	var types={};
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
	       "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	
	var h='';
	for(var i=0;i<ls.length;i++){
		types[ls[i].BUSI_TYPE_ID]=ls[i].BUSI_NAME;
		h+='<input style="vertical-align:middle;"  name="busiType" type="checkbox" value="'+ls[i].BUSI_TYPE_ID+'" />&nbsp;'+ls[i].BUSI_NAME+"&nbsp;";
	}
	$("#typeContent").empty().append(h);
	return types;
}
function existName(name){
	var sql="SELECT * FROM PORTAL.TB_PORTAL_MONITOR_USER where name='"+name+"'";
	var r=false;
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
	       "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			r=true;
	   		}
	    }
	});
	return r;
}
function existPhone(phone){
	var sql="SELECT * FROM PORTAL.TB_PORTAL_MONITOR_USER where phone='"+phone+"'";
	var r=false;
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
	       "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			r=true;
	   		}
	    }
	});
	return r;
}
function toTypeString(nums){
	var s="";
	if(!nums||nums==''){
		return '';
	}
	var ss=nums.split(",");
	for(var i=0;i<ss.length;i++){
		if(s.length>0){
			s+=",";
		}
		if(types[ss[i]]){
			s+=types[ss[i]];
		}
	}
	return s;
}
function search(pageNumber) {
	pageNumber++;
	var name=$("#name").val();
	var phone=$("#phone").val();
	var isUncom=$("#isUncom").val();
	var sendFlag=$("#sendFlag").val();
	var regionCode=$("#regionName").val();
	var unitCode=$("unitName").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/monitorUser/monitorUserManager_list.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "name":name,
           "phone":phone,
           "isUncom":isUncom,
           "sendFlag":sendFlag,
           "regionCode":regionCode,
           "unitCode":unitCode
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
	   			var code=isNull(n['LEVEL_ID']);
	   			var level_desc=isNull(n['LEVEL_DESC']);
	   			var sql="SELECT T.ORGLEVEL,T.ORGNAME,T.REGION_NAME FROM portal.apdp_org T where T.CODE='"+code+"'";
				var regionName=query(sql);
				var orgLevel=isNull(regionName[0].ORGLEVEL);
				var region_name=isNull(regionName[0].REGION_NAME);
	   			content+="<tr>"
	   			+"<td>"+isNull(regionName[0].ORGNAME)+"("+level_desc+")</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['ISUNCOM'])+"</td>"
				+"<td>"+isNull(n['SENDFLAG'])+"</td>"
				+"<td>"+toTypeString(n['BUSI_TYPE'])+"</td>"
				+"<td><a href='javascript:void(0);' onclick='showAddOrUpdateDialog(\""+n['ID']+"\",\""+n['NAME']+"\",\""+n['PHONE']+"\",\""+n['IS_UNCOM']+"\",\""+n['SEND_FLAG']+"\",\""+n['BUSI_TYPE']+"\",\""+code+"\",\""+orgLevel+"\",\""+region_name+"\",\""+level_desc+"\")'>编辑</a>&nbsp;<a href='javascript:void(0);' onclick='del(\""+n['ID']+"\")'>删除</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").html(content);
			}else {
				$("#dataBody").html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function showAddOrUpdateDialog(id,name,phone,isUncom,sendFlag,busiType,code,orgLevel,region_name,levelDesc){
	art.dialog({ content: document.getElementById('addForm'), id: 'addFormDialog' });
	if(id){
		var html="<option value='"+levelDesc+"'>"+levelDesc+"</option>";
		$("#levelDesc").empty().append($(html));
		$("INPUT[name='resultMap.id']").val(id);
		$("INPUT[name='resultMap.name']").val(name);
		$("#oldName").val(name);
		$("INPUT[name='resultMap.phone']").val(phone);
		$("#oldPhone").val(phone);
		$("#dIsUncom").find("option[value='"+isUncom+"']").attr("selected","selected");
		$("#dSendFlag").find("option[value='"+sendFlag+"']").attr("selected","selected");
		$("INPUT[name='busiType']").attr("checked",false);
		if(orgLevel==1||orgLevel==2){
		  $("#regionCity").find("option[value="+code+"]").attr("selected","selected");
		  getStartUnit(code);
		}else{
		  $("#regionCity").find("option[region_name="+region_name+"]").attr("selected","selected");
			getStartUnitByRegionName(region_name);
		  $("#unitName").find("option[value="+code+"]").attr("selected","selected");
		}
		if(busiType&&busiType.length){
			var ss=busiType.split(",");
			for(var i=0;i<ss.length;i++){
				$("INPUT[name='busiType'][value='"+ss[i]+"']").attr("checked",true);
			}
		}
	}else{
		$("INPUT[name='resultMap.name']").val("");
		$("#oldName").val("");
		$("INPUT[name='resultMap.phone']").val("");
		$("#oldPhone").val("");
		$("#dIsUncom").find("option:eq(0)").attr("selected","selected");
		$("#dSendFlag").find("option:eq(0)").attr("selected","selected");
		$("#regionCity").find("option:eq(0)").attr("selected","selected");
		$("#unitName").empty().append($("<option value=''>全部</option>"));
		$("#levelDesc").empty().append($("<option value='省级管理员'>省级管理员</option>"));
		$("INPUT[name='busiType']").attr("checked",false);
	}
}
function del(id){
	if(confirm('确认删除吗?')){
	$.ajax({
		url:$("#ctx").val()+"/monitorUser/monitorUserManager_del.action",
		type:'POST',
		dataType:'json',
		async:false,
		data:{
	           "id":id
		},
		success:function(data){
			if(data&&data['ok']){
				window.location.reload();
			}else{
				alert("系统错误");
			}
		}
	});
  }
}