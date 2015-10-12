var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
$(function() {
	isRemoveAddBtn();//地市才有增加权限，其他的只能查看
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#name").val("");
		$("#hr_id").val("");
		$("#user_code").val("");
		$("#unit_name").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#addBtn").click(function(){
		add();
	});
});
function isRemoveAddBtn(){
	var orgLevel= $.trim($("#orgLevel").val());
	if(orgLevel=='2'){
		
	}else{
		$("a:eq(2)").remove();
	}
}
function add() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/mag_person_add.jsp";
	art.dialog.open(url,{
		id:'add',
		width:'420px',
		height:'170px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'营业员配置'
	});
}
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var name = $.trim($("#name").val());
	var hr_id = $.trim($("#hr_id").val());
	var unit_name = $.trim($("#unit_name").val());
	var user_code = $.trim($("#user_code").val());
	var orgLevel= $.trim($("#orgLevel").val());
	var code= $.trim($("#code").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/magPerson_queryMagPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           //"resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"name":name,
           	"hr_id":hr_id,
           	"unit_name":unit_name,
           	"user_code":user_code
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
				+"<td>"+isNull(n['USERID'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['ACCOUNT'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['USER_CODE'])+"</td>"
				+"<td>"+isNull(n['USER_LOG_CODE'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td><a onclick='del($(this))' user_code='"+isNull(n['USER_CODE'])+"' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>解绑</a>" +
					"<a onclick='update($(this))' user_code='"+isNull(n['USER_CODE'])+"' regioncode='"+isNull(n['GROUP_ID_1'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>修改</a></td>";
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='11'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function del(obj){
	var hr_id=obj.attr("hr_id");
	var user_code=obj.attr("user_code");
	var regionCode=obj.attr("regioncode");
	var path=$("#ctx").val();
	if(confirm('确认删除吗?')){
	  window.location.href=path+"/channelManagement/magPerson_del.action?hr_id="+hr_id+"&user_code="+user_code+"&regionCode="+regionCode;
	}
	//window.location.reload();
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
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}
function downloadExcel() {
	var name = $.trim($("#name").val());
	var hr_id = $.trim($("#hr_id").val());
	var unit_name = $.trim($("#unit_name").val());
	var user_code = $.trim($("#user_code").val());
	var orgLevel= $.trim($("#orgLevel").val());
	var code= $.trim($("#code").val());
	var sql = "SELECT T.USERID,T.NAME,T.ACCOUNT,T.PHONE,T.UNIT_NAME," +
				"T.HQ_CHAN_CODE,T.HQ_CHAN_NAME,T.USER_CODE,T.USER_LOG_CODE," +
				"T.HR_ID FROM PORTAL.TAB_PORTAL_MAG_PERSON T WHERE 1=1 ";
	if(orgLevel=="1") {
		
	}else if(orgLevel == "2") {
		sql += " AND T.GROUP_ID_1 = '"+code+"' ";
	}else{
		sql +=" AND 1=2 ";
	}
	if(name != "") {
		sql += " AND T.NAME LIKE '%"+name+"%' ";
	}
	if(hr_id != "") {
		sql += " AND T.HR_ID LIKE '%"+hr_id+"%' ";
	}
	if(unit_name != "") {
		sql += " AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(user_code != "") {
		sql += "AND T.USER_CODE LIKE '%"+user_code+"%' ";
	}
	sql += " ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	//console.log(sql);
   var showtext="营业员配置";
   var showtext1="营业员配置";
   var _head=['人员编码','姓名','账号','电话','营服中心','营业厅编码','渠道名称','人员工位','人员工号','HR编码'];
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

