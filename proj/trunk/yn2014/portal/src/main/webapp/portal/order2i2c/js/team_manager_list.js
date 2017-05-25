$.extend($.fn.validatebox.defaults.rules, {
	remote:{
        validator : function(value, param){
        	var hrId=value;
        	var sql="SELECT ID,USERNAME,REALNAME,PHONE   "+
        	"FROM PORTAL.APDP_USER T1                    "+
        	"WHERE T1.HR_ID='"+hrId+"'                   "+
        	"AND T1.ENABLED=1                            "+
        	"AND T1.USERNAME IS NOT NULL                 "+
        	"AND T1.PHONE IS NOT NULL                    "+
        	"AND T1.REALNAME IS NOT NULL                 "+
        	"AND EXISTS (SELECT 1                        "+
        	"            FROM PORTAL.APDP_ORG T2         "+
        	"            WHERE T1.ORG_ID=T2.ID           "+
        	"            AND   T2.REGION_CODE='"+code+ "'"+
        	"            )                               ";
        	var d=query(sql);
        	if(d!=null&&d.length>0){
        		$("#innerName").val(d[0].REALNAME);
        		$("#innerPhone").val(d[0].PHONE);
        		$("#account").val(d[0].USERNAME);
        		$("#userId").val(d[0].ID);
        		return true;
        	}
        	$("#innerName").val("");
    		$("#innerPhone").val("");
    		$("#account").val("");
        	return false;
        },
        message : 'HR编码错误！'    
    }
});
var pageSize = 15;
var orgLevel="";
var code="";
var name="";
var regionCode="";
var teamType="";
$(function() {
	orgLevel = $("#orgLevel").val();
	if(orgLevel==1){
		$("#addBtn").remove();
	}
	code = $("#region").val();
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#team_type").change(function(){
		if($(this).val()=="1"){
			$("#outEditDiv").hide();
			$("#innerEditDiv").show();
		}else if($(this).val()=="2"){
			$("#innerEditDiv").hide();
			$("#outEditDiv").show();
		}else{
			$("#innerEditDiv").hide();
			$("#outEditDiv").hide();
		}
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	regionCode=$("#regionCode").val();
	name=$.trim($("#name").val());
	teamType=$("#teamType").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/teamManager/team-manager!query.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.regionCode":regionCode,
           "resultMap.name":name,
           "resultMap.teamType":teamType
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
            if(orgLevel==2||orgLevel==3){
            	$.each(pages.rows,function(i,n){
    				content+="<tr>"
    				+"<td align='center'>"+isNull(n['ID'])+"</td>"
    				+"<td align='center'>"+isNull(n['NAME'])+"</td>"
    				+"<td align='center'>"+isNull(n['TEAM_NAME'])+"</td>"
    				+"<td align='center'>"+isNull(n['ACCOUNT'])+"</td>"
    				+"<td align='center'>"+isNull(n['PHONE'])+"</td>"
    			 	+"<td align='center'><a onclick='del($(this))' id='"+isNull(n['ID'])+"' href='#'>删除</a></td>";
    				content+="</tr>";
    			 });
            }else{
            	$.each(pages.rows,function(i,n){
    				content+="<tr>"
    				+"<td align='center'>"+isNull(n['ID'])+"</td>"
    				+"<td align='center'>"+isNull(n['NAME'])+"</td>"
    				+"<td align='center'>"+isNull(n['TEAM_NAME'])+"</td>"
    				+"<td align='center'>"+isNull(n['ACCOUNT'])+"</td>"
    				+"<td align='center'>"+isNull(n['PHONE'])+"</td>"
    			 	+"<td align='center'></td>";
    				content+="</tr>";
    			 });
            }
	   		  
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='6'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

function del(obj){
	var id=obj.attr("id");
	if(confirm('确认刪除吗?')){
	  window.location.href=$("#ctx").val()+"/teamManager/team-manager!del.action?resultMap.id="+id;
	}
}

function add() {
	$("#team_type").val("");
	$("#innerEditDiv").hide();
	$("#outEditDiv").hide();
	$('#editDiv').show();
	$('#editDiv').dialog({
		title : '增加人员',
		width : 600,
		height : 350,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true
	});
}

function innerSave(){
	var url = $("#ctx").val()+'/teamManager/team-manager!innerSave.action';
	$('#innerEditForm').form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($("#innerName").val()==""){
				return false;
			}
			if($("#innerPhone").val()==""){
				return false;
			}
			if($("#account").val()==""){
				return false;
			}
			var d=isNameNotExist($("#innerName").val(),$("#innerPhone").val());
			if(d==false){
				return false;
			}
		},
		success:function(data){
			var d = $.parseJSON(data);
			if(d.state=="1"){
				alert(d.msg);
				$('#editDiv').dialog('close');
				$("#outEditDiv").hide();
				$("#innerEditDiv").hide();
				search(0);
			}else{
				alert(d.msg);
			}
		}
	});
}

function outSave(){
	var url = $("#ctx").val()+'/teamManager/team-manager!outSave.action';
	$('#outEditForm').form('submit',{
		url:url,
		dataType:"json",
		async: false,
		type: "POST", 
		onSubmit:function(){
			if($("#outName").val()==""){
				return false;
			}
			if($("#outPhone").val()==""){
				return false;
			}
			var d=isNameNotExist($("#outName").val(),$("#outPhone").val());
			if(d==false){
				return false;
			}
		},
		success:function(data){
			var d = $.parseJSON(data);
			if(d.state=="1"){
				alert(d.msg);
				$('#editDiv').dialog('close');
				$("#outEditDiv").hide();
				$("#innerEditDiv").hide();
				search(0);
			}else{
				alert(d.msg);
			}
		}
	});
}

function isNameNotExist(name,phone){
	var sql="SELECT NAME FROM PORTAL.TAB_PORTAL_2I2C_TEAM WHERE NAME='"+name+"' AND PHONE='"+phone+"' AND IS_VALID=1";
	var r=query(sql);
	if(r==null || r.length<1){
		return true;
	}
	alert("姓名已存在！");
	return false;
}

function isNull(obj){
	if(obj == undefined || obj == null) {
		return "";
	}
	return obj;
}

function downsAll() {
	var downSql="SELECT ID,NAME,TEAM_NAME,ACCOUNT,PHONE FROM PORTAL.TAB_PORTAL_2I2C_TEAM WHERE F_ID !='-1' AND IS_VALID=1";
	var title=[["人员编号","姓名","团队类型","用户账号","电话"]];
	if(name!="") {
		downSql+=" AND NAME LIKE '%"+name+"%' ";
	}
	if(orgLevel==2||orgLevel==3){
		downSql+=" AND GROUP_ID_1='"+code+"'";
	}else{
		downSql+=" AND 1=2";
	}
    var showtext="2I2C人员";
    downloadExcel(downSql,title,showtext);
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