var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var initMonth="";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	initMonth=$("#time").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/qjPerson_listTreeNode.action",
			autoParam : ["id=orgId","orgLevel=orgLevel","code=code"]
		},
		callback:{
			onClick:function(event,treeId,treeNode) {
				orgId = treeNode.id;
				orgLevel = treeNode.orgLevel;
				code = treeNode.code;
				search(0);
			}
		}
	};
	var isp = true;
	if(orgLevel==3 || orgLevel==4) {
		isp = false
	}
	var zNodes =[{ id:orgId, pId:-1, name:initOrgName,code:code,orgLevel:orgLevel,open:true, isParent:isp}];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
	$(".level0").trigger("click");
	//查询营业人员信息列表
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#name").val("");
		$("#unit_name").val("");
		$("#job_type").val("");
		$("#job").val("");
		$("#hr_id").val("");
		$("#active_time").val("");
	});
	
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#addBtn").click(function(){
		add();
	});
});
function controll(){
	search(0);
	var chooseMonth=$("#time").val();
	if(chooseMonth==initMonth){
		$('#addBtn').show();
	}else{
		$('#addBtn').hide();
	}
}
function del(obj){
	var hr_id=obj.attr("hr_id");
	var path=$("#ctx").val();
	if(confirm('确认刪除吗?')){
	  window.location.href=path+"/channelManagement/qjPerson_del.action?hr_id="+hr_id+"&month="+initMonth+"";
	}
}
function add() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/tab_portal_qj_person_add.jsp";
	art.dialog.open(url,{
		id:'add',
		width:'520px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加唯一身份管理'
	});
}
function update(obj) {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/tab_portal_qj_person_update.jsp";
	var job=obj.attr("job");
	var hr_id=obj.attr("hr_id");
	var is_logo=obj.attr("is_logo");
	var hr_ratio=obj.attr("hr_ratio");
	var chooseMonth=obj.attr("chooseMonth");
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('job',job);
	art.dialog.data('is_logo',is_logo);
	art.dialog.data('hr_ratio',hr_ratio);
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'140px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改唯一身份管理'
	});
}
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var unit_name = $.trim($("#unit_name").val());
	var job_type = $.trim($("#job_type").val());
	var job = $.trim($("#job").val());
	var hr_id = $.trim($("#hr_id").val());
	var active_time = $.trim($("#active_time").val());
	var chooseMonth=$("#time").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/qjPerson_queryMagPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"name":name,
           	"unit_name":unit_name,
           	"job_type":job_type,
           	"job":job,
           	"hr_id":hr_id,
           	"active_time":active_time,
            "chooseMonth":chooseMonth 
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
	   		if(orgLevel==1){
	   			$("#addBtn").remove();
		   		 $.each(pages.rows,function(i,n){
					content+="<tr>"
					+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
					+"<td>"+isNull(n['NAME'])+"</td>"
					+"<td>"+isNull(n['JOB'])+"</td>"
					+"<td>"+isNull(n['HR_ID'])+"</td>"
					+"<td>"+isNull(n['EMP_TYPE'])+"</td>"
					+"<td>"+isNull(n['ACTIVE_TIME'])+"</td>"
					+"<td>"+isNull(n['IS_LOGO'])+"</td>"
				 +"<td></td>";
					content+="</tr>";
				 });
	   		}else{
	   		  if(chooseMonth==initMonth){
	   		    $.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['JOB'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['EMP_TYPE'])+"</td>"
				+"<td>"+isNull(n['ACTIVE_TIME'])+"</td>"
				+"<td>"+isNull(n['IS_LOGO'])+"</td>"
			 +"<td><a onclick='update($(this))' chooseMonth='"+chooseMonth+"' job='"+isNull(n['JOB'])+"' is_logo='"+n['IS_LOGO']+"' hr_id='"+isNull(n['HR_ID'])+"' hr_ratio='"+isNull(n['HR_RATIO'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
			 		"<a onclick='del($(this))' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>";
				content+="</tr>";
			 });
	   	    }else{
	   	    	$.each(pages.rows,function(i,n){
					content+="<tr>"
					+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
					+"<td>"+isNull(n['NAME'])+"</td>"
					+"<td>"+isNull(n['JOB'])+"</td>"
					+"<td>"+isNull(n['HR_ID'])+"</td>"
					+"<td>"+isNull(n['EMP_TYPE'])+"</td>"
					+"<td>"+isNull(n['ACTIVE_TIME'])+"</td>"
					+"<td>"+isNull(n['IS_LOGO'])+"</td>"
					+"<td></td>";
					content+="</tr>";
				 });
	   		}
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
	if(obj == undefined || obj == null) {
		return "";
	}else if(obj=="0"){
		return "否";
	}else if(obj=="1"){
		return "是";
	}
	return obj;
}

function downloadExcel() {
	var name = $.trim($("#name").val());
	var unit_name = $.trim($("#unit_name").val());
	var job_type = $.trim($("#job_type").val());
	var job = $.trim($("#job").val());
	var hr_id = $.trim($("#hr_id").val());
	var active_time = $.trim($("#active_time").val());
	var chooseMonth=$("#time").val();
	
	var sql = "";
	 if(orgLevel == "1") {
		sql = "SELECT UNIT_NAME,NAME,JOB_TYPE,JOB,HR_ID,EMP_TYPE,ACTIVE_TIME,CASE IS_LOGO WHEN '1' THEN '是' ELSE '否' END FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE DEAL_DATE='"+chooseMonth+"' AND IS_VALUE='1'";
	 }
	 if(orgLevel == "2") {
		sql = "SELECT UNIT_NAME,NAME,JOB_TYPE,JOB,HR_ID,EMP_TYPE,ACTIVE_TIME,CASE IS_LOGO WHEN '1' THEN '是' ELSE '否' END FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE GROUP_ID_1 = '"+code+"' AND DEAL_DATE='"+chooseMonth+"' AND IS_VALUE='1'";
	 }else if(orgLevel == "3") {
		sql = "SELECT UNIT_NAME,NAME,JOB_TYPE,JOB,HR_ID,EMP_TYPE,ACTIVE_TIME,CASE IS_LOGO WHEN '1' THEN '是' ELSE '否' END FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE UNIT_ID = '"+code+"' AND DEAL_DATE='"+chooseMonth+"' AND IS_VALUE='1'";
	 }
	if(name!=""){
		sql+=" AND NAME LIKE '%"+name+"%'"; 
	}
	if(job_type!=""){
		sql+=" AND JOB_TYPE LIKE '%"+job_type+"%'"; 
	}
	if(job!=""){
		sql+=" AND JOB LIKE '%"+job+"%'"; 
	}
	if(hr_id!=""){
		sql+=" AND HR_ID LIKE '%"+hr_id+"%'"; 
	}
	if(active_time!=""){
		sql+=" AND ACTIVE_TIME LIKE '%"+active_time+"%'"; 
	}
	sql += " ORDER BY GROUP_ID_1,UNIT_ID,HR_ID";
   var showtext="Sheet";
   var showtext1="result";
   var _head=['营服','姓名','类别','岗位','HR编码','从业类型','生效时间','是否打标'];
   loadWidowMessage(1);
   _execute(3001,{type:12,
		     data:{
		    	  sql:sql,
		    	  contname:_head,
		    	  startRow:1,
		    	  startCol:0,
		    	  cols:-1,
		    	  sheetname:showtext,
		    	  excelModal:'reportModel.xls'
		     }     
	},function(res){
		loadWidowMessage(0);
		 click_flag=0;
		 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext1+'.xls'))].join('');
		 window.location.href=url;
	});
	
}

function _execute(type, parameter, callback, msg, dom){
   $.Project.execute(type, parameter, callback, msg, dom);
}

/**
 * 程序锁屏信息，1为加载，其他为去除锁屏信息
 * @param flag
 * @return
 */
function loadWidowMessage(flag){
	if(flag == 1){
		$.messager.progress({
			text:'正在处理数据，请稍等...',
			interval:100
		}); 
	}else{
		$.messager.progress('close'); 
	}
}

