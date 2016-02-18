var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var initMonth="";
var chooseMonth="";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	initMonth=$("#time").val();
	$("#time").blur(function(){
		chooseMonth=$("#time").val();
		if(chooseMonth!=initMonth){
			$("#addBtn").remove();
		}
	});
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/magPerson_listTreeNode.action",
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
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#name").val("");
		$("#unit_name").val("");
		$("#hr_id").val("");
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
	  window.location.href=path+"/channelManagement/magPerson_delMagPerson.action?hr_id="+hr_id+"&chooseMonth="+initMonth;
	  search(0);
	}
}
function add() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/portal_mag_person_add.jsp";
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.open(url,{
		id:'add',
		width:'520px',
		height:'180px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加营业厅厅主任'
	});
}
function update(obj) {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/portal_mag_person_update.jsp";
	var hr_id=obj.attr("hr_id");
	var hq_chan_code=obj.attr("hq_chan_code");
	chooseMonth=obj.attr("chooseMonth");
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.data('hq_chan_code',hq_chan_code);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'140px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改营业厅厅主任'
	});
}
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var unit_name = $.trim($("#unit_name").val());
	var hr_id = $.trim($("#hr_id").val());
	chooseMonth=$("#time").val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/magPerson_queryMagPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"name":name,
           	"unit_name":unit_name,
           	"hr_id":hr_id,
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
	   		if(chooseMonth==initMonth){
	   		    $.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				/*+"<td>"+isNull(n['CREATE_TIME'])+"</td>"*/
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['USER_CODE'])+"</td>"
				+"<td>"+isNull(n['USER_LOG_CODE'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
			 +"<td><a onclick='update($(this))' chooseMonth='"+chooseMonth+"' hr_id='"+isNull(n['HR_ID'])+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
			 		"<a onclick='del($(this))' chooseMonth='"+chooseMonth+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>";
				content+="</tr>";
			 });
	   	    }else{
	   	    	$.each(pages.rows,function(i,n){
					content+="<tr>"
						+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
						+"<td>"+isNull(n['NAME'])+"</td>"
						+"<td>"+isNull(n['PHONE'])+"</td>"
						+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
						/*+"<td>"+isNull(n['CREATE_TIME'])+"</td>"*/
						+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
						+"<td>"+isNull(n['USER_CODE'])+"</td>"
						+"<td>"+isNull(n['USER_LOG_CODE'])+"</td>"
						+"<td>"+isNull(n['HR_ID'])+"</td>"
					    +"<td></td>";
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
	}
	return obj;
}

function downloadExcel() {
	var name = $.trim($("#name").val());
	var unit_name = $.trim($("#unit_name").val());
	var hr_id = $.trim($("#hr_id").val());
	var sql = "";
	 if(orgLevel == "1") {
		sql = "SELECT UNIT_NAME,NAME,PHONE,HQ_CHAN_CODE,CREATE_TIME,HQ_CHAN_NAME,USER_CODE,USER_LOG_CODE,HR_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON T"
              +" WHERE T.DEAL_DATE='"+chooseMonth+"' AND T.USER_TYPE=1";
	 }
	 if(orgLevel == "2") {
		sql = "SELECT UNIT_NAME,NAME,PHONE,HQ_CHAN_CODE,CREATE_TIME,HQ_CHAN_NAME,USER_CODE,USER_LOG_CODE,HR_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON T"
            +" WHERE T.DEAL_DATE='"+chooseMonth+"' AND T.USER_TYPE=1 AND T.GROUP_ID_1='"+code+"'";
	 }else if(orgLevel == "3") {
		 sql = "SELECT UNIT_NAME,NAME,PHONE,HQ_CHAN_CODE,CREATE_TIME,HQ_CHAN_NAME,USER_CODE,USER_LOG_CODE,HR_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON T"
	            +" WHERE T.DEAL_DATE='"+chooseMonth+"' AND T.USER_TYPE=1 AND T.UNIT='"+code+"'";
	 }
	 if(name!=""){
		sql+=" AND T.NAME LIKE '%"+name+"%'"; 
	 }
	 if(hr_id!=""){
		sql+=" AND T.HR_ID LIKE '%"+hr_id+"%'"; 
	 }
	 if(unit_name!=""){
		sql+=" AND T.UNIT_NAME LIKE '%"+unit_name+"%'"; 
	 }
   sql += " ORDER BY T.GROUP_ID_1,T.UNIT_ID,T.HR_ID";
   var showtext="营业厅厅主任";
   var _head=["营服中心","名字","电话","营业厅编码","创建时间","渠道名称","人员工位","人员工号","HR编码"];
   //loadWidowMessage(1);
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
		 var url=[$.Project.downURL,'?path=',encodeURI('system:'+res),$.isNullStr(showtext)?'':'&alias='+encodeURI(encodeURI(showtext+'.xls'))].join('');
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

