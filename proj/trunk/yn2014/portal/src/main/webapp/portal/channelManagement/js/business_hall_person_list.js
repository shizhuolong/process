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
			url : $("#ctx").val()+"/channelManagement/businessHallPerson_listTreeNode.action",
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
		$("#phone").val("");
		$("#hq_chan_code").val("");
		$("#hq_chan_name").val("");
		$("#user_code").val("");
		$("#user_log_code").val("");
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
	var user_code=obj.attr("user_code");
	var regionCode=obj.attr("regioncode");
	var path=$("#ctx").val();
	if(confirm('确认解绑吗?')){
	  window.location.href=path+"/channelManagement/businessHallPerson_del.action?hr_id="+hr_id+"&user_code="+user_code+"&regionCode="+regionCode;
	}
	//window.location.reload();
}
function add() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/business_hall_person_add.jsp";
	art.dialog.open(url,{
		id:'add',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加营业员配置'
	});
}
function update(obj) {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/business_hall_person_update.jsp";
	var hr_id=obj.attr("hr_id");
	var user_code=obj.attr("user_code");
	var regionCode=obj.attr("regioncode");
	var unit_name=obj.attr("unit_name");
	var name=obj.attr("name");
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('user_code',user_code);
	art.dialog.data('regionCode',regionCode);
	art.dialog.data('unit_name',unit_name);
	art.dialog.data('name',name);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改营业员配置'
	});
}
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var phone = $.trim($("#phone").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var user_code = $.trim($("#user_code").val());
	var user_log_code = $.trim($("#user_log_code").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/businessHallPerson_queryMagPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"name":name,
           	"hq_chan_code":hq_chan_code,
           	"hq_chan_name":hq_chan_name,
           	"phone":phone,
           	"user_code":user_code,
           	"user_log_code":user_log_code
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
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['USER_CODE'])+"</td>"
				+"<td>"+isNull(n['USER_LOG_CODE'])+"</td>"+
				"<td>"+"<a onclick='update($(this))' user_code='"+isNull(n['USER_CODE'])+"' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' name='"+isNull(n['NAME'])+"' unit_name='"+isNull(n['UNIT_NAME'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
				"<a onclick='del($(this))' user_code='"+isNull(n['USER_CODE'])+"' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>解绑</a></td>";
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
	var phone = $.trim($("#phone").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var user_code = $.trim($("#user_code").val());
	var user_log_code = $.trim($("#user_log_code").val());
	
	var sql = "";
	if(orgLevel=="1") {
		sql = "SELECT T.NAME,T.PHONE,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME," +
				"T.USER_CODE,T.USER_LOG_CODE " +
				"FROM PORTAL.TAB_PORTAL_MAG_PERSON T WHERE 1=1 ";
	}else if(orgLevel == "2") {
		sql = "SELECT T.NAME,T.PHONE,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME," +
				"T.USER_CODE,T.USER_LOG_CODE " +
				"FROM PORTAL.TAB_PORTAL_MAG_PERSON T " +
				"WHERE T.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == "3") {
		sql = "SELECT T.NAME,T.PHONE,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME," +
				"T.USER_CODE,T.USER_LOG_CODE FROM PORTAL.TAB_PORTAL_MAG_PERSON T " +
				"WHERE T.UNIT_ID = '"+code+"' ";
	}else {
		sql = "SELECT T.NAME,T.PHONE,T.HQ_CHAN_CODE,T.HQ_CHAN_NAME," +
				"T.USER_CODE,T.USER_LOG_CODE " +
				"FROM PORTAL.TAB_PORTAL_MAG_PERSON T WHERE 1=2 ";
	}
	if(hq_chan_code != "") {
		sql += "AND T.HQ_CHAN_CODE='"+hq_chan_code+"' ";
	}
	if(phone != "") {
		sql += "AND T.PHONE='"+phone+"' ";
	}
	if(name != "") {
		sql += "AND T.NAME LIKE '%"+name+"%' ";
	}
	if(hq_chan_name != "") {
		sql += "AND T.HQ_CHAN_NAME LIKE '%"+hq_chan_name+"%' ";
	}
	if(user_code != "") {
		sql += "AND T.USER_CODE='"+user_code+"' ";
	}
	if(user_log_code != "") {
		sql += "AND T.USER_LOG_CODE='"+user_log_code+"' ";
	}
	sql += " ORDER BY T.NAME";
	console.log(sql);
   var showtext="Sheet";
   var showtext1="result";
   var _head=['姓名','联系电话','营业厅编码','营业厅名称','工位','工号'];
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

