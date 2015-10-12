var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
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
function del(obj){
	var hr_id=obj.attr("hr_id");
	var path=$("#ctx").val();
	if(confirm('确认刪除吗?')){
	  window.location.href=path+"/channelManagement/qjPerson_del.action?hr_id="+hr_id;
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
/*function update(obj) {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/tab_portal_qj_person_update.jsp";
	var job_type=obj.attr("job_type");
	var job=obj.attr("job");
	var regionCode=obj.attr("regioncode");
	var hr_id=obj.attr("hr_id");
	var name=obj.attr("name");
	var unit_name=obj.attr("unit_name");
	
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('job_type',job_type);
	art.dialog.data('regionCode',regionCode);
	art.dialog.data('unit_name',unit_name);
	art.dialog.data('name',name);
	art.dialog.data('job',job);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改唯一身份管理'
	});
}*/
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var unit_name = $.trim($("#unit_name").val());
	var job_type = $.trim($("#job_type").val());
	var job = $.trim($("#job").val());
	var hr_id = $.trim($("#hr_id").val());
	var active_time = $.trim($("#active_time").val());
	
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
           	"active_time":active_time
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
	   		var content="";/*isNull(n['ACTIVE_TIME'])*/
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['JOB_TYPE'])+"</td>"
				+"<td>"+isNull(n['JOB'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['EMP_TYPE'])+"</td>"
				+"<td>"+isNull(n['ACTIVE_TIME'])+"</td>"+
			"<td>"/*+"<a onclick='update($(this))' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' name='"+isNull(n['NAME'])+"' unit_name='"+isNull(n['UNIT_NAME'])+"' job='"+isNull(n['JOB'])+"' job_type='"+isNull(n['JOB_TYPE'])+"' href='#'>修改</a>&nbsp;&nbsp;" +*/
			+"<a onclick='del($(this))' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>";
				content+="</tr>";
			});
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
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "&nbsp;";
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
	var sql = "";
	 if(orgLevel == "2") {
		sql = "SELECT UNIT_NAME,NAME,JOB_TYPE,JOB,HR_ID,EMP_TYPE,ACTIVE_TIME FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE GROUP_ID_1 = '"+code+"'";
	}else if(orgLevel == "3") {
		sql = "SELECT UNIT_NAME,NAME,JOB_TYPE,JOB,HR_ID,EMP_TYPE,ACTIVE_TIME FROM PORTAL.TAB_PORTAL_QJ_PERSON WHERE UNIT_ID = '"+code+"'";
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
   var _head=['营服','姓名','类别','岗位','HR编码','从业类型','申效时间'];
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

