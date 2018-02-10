var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var initMonth="";
var chooseMonth="";
var sysTime="";
$(function() {
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#hr_id").val("");
		$("#f_hr_id").val("");
		$("#hq_chan_code").val("");
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
	var hq_chan_code=obj.attr("hq_chan_code");
	var path=$("#ctx").val();
	if(confirm('确认刪除吗?')){
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,//true是异步，false是同步
		cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
		url:path+"/personManagement/hall-mag-person!delMagPerson.action",
		data:{
	       "hr_id":hr_id,
	       "chooseMonth":chooseMonth,
	       "hq_chan_code":hq_chan_code
	   	}, 
	   	success:function(data){
	   		alert(data);
	   	    search(0);
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("请求出错！");
        }
	});
	}
}
function add() {
	var url = $("#ctx").val()+"/portal/personManagement/jsp/hall_mag_person_add.jsp";
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.open(url,{
		id:'add',
		width:'500px',
		height:'250px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加营业厅人员'
	});
}
function update(obj) {
	var url = $("#ctx").val()+"/portal/personManagement/jsp/hall_mag_person_update.jsp";
	var hr_id=obj.attr("hr_id");
	var hq_chan_code=obj.attr("hq_chan_code");
	var hq_chan_name=obj.attr("hq_chan_name");
	var hr_name=obj.attr("hr_name");
	var f_user_name=obj.attr("f_user_name");
	var f_hr_id=obj.attr("f_hr_id");
	chooseMonth=obj.attr("chooseMonth");
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('chooseMonth',chooseMonth);
	art.dialog.data('hq_chan_code',hq_chan_code);
	art.dialog.data('hq_chan_name',hq_chan_name);
	art.dialog.data('hr_name',hr_name);
	art.dialog.data('f_user_name',f_user_name);
	art.dialog.data('f_hr_id',f_hr_id);
	art.dialog.open(url,{
		id:'update',
		width:'420px',
		height:'250px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改营业厅人员'
	});
}
function search(pageNumber) {
	$("#addBtn").show();
	chooseMonth=$("#deal_date").val();
	sysTime = $("#sysTime").val()
	if(sysTime-chooseMonth!=0){
		$("#addBtn").hide();
	}
	pageNumber = pageNumber + 1;
	var hr_id = $.trim($("#hr_id").val());
	var f_hr_id = $.trim($("#f_hr_id").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	chooseMonth=$("#deal_date").val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/personManagement/hall-mag-person!queryMagPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.hr_id":hr_id,
           "resultMap.f_hr_id":f_hr_id,
           "resultMap.hq_chan_code":hq_chan_code,
           "resultMap.chooseMonth":chooseMonth 
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
	   		if(sysTime-chooseMonth!=0){
	   		    $.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['HR_ID'])+"</td>"
				+"<td>"+isNull(n['F_USER_NAME'])+"</td>"
				+"<td>"+isNull(n['F_HR_ID'])+"</td>"
			    +"<td></td>";
			    /*"<td><a onclick='update($(this))' chooseMonth='"+chooseMonth+"' hq_chan_name='"+isNull(n['HQ_CHAN_NAME'])+"' hr_name='"+isNull(n['NAME'])+"' f_user_name='"+isNull(n['F_USER_NAME'])+"' f_hr_id='"+isNull(n['F_HR_ID'])+"' hr_id='"+isNull(n['HR_ID'])+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
			 		"<a onclick='del($(this))' chooseMonth='"+chooseMonth+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>"*/
				content+="</tr>";
			    });
	   		}else{
	   			$.each(pages.rows,function(i,n){
					content+="<tr>"
					+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
					+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
					+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
					+"<td>"+isNull(n['NAME'])+"</td>"
					+"<td>"+isNull(n['HR_ID'])+"</td>"
					+"<td>"+isNull(n['F_USER_NAME'])+"</td>"
					+"<td>"+isNull(n['F_HR_ID'])+"</td>"
				    +"<td><a onclick='update($(this))' chooseMonth='"+chooseMonth+"' hq_chan_name='"+isNull(n['HQ_CHAN_NAME'])+"' hr_name='"+isNull(n['NAME'])+"' f_user_name='"+isNull(n['F_USER_NAME'])+"' f_hr_id='"+isNull(n['F_HR_ID'])+"' hr_id='"+isNull(n['HR_ID'])+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' href='#'>修改</a>&nbsp;&nbsp;" +
				 		"<a onclick='del($(this))' chooseMonth='"+chooseMonth+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' hr_id='"+isNull(n['HR_ID'])+"' href='#'>删除</a></td>";
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
	var hr_id = $.trim($("#hr_id").val());
	var f_hr_id = $.trim($("#f_hr_id").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var region = $.trim($("#region").val());
	orgLevel = $("#orgLevel").val();
	var sql = "";
	 if(orgLevel == 1) {
		sql = "SELECT T.GROUP_ID_1_NAME      "+
		" ,T.HQ_CHAN_CODE                    "+
		" ,T.HQ_CHAN_NAME                    "+
		" ,T.NAME                            "+
		" ,T.HR_ID                           "+
		" ,T.F_USER_NAME                     "+
		" ,T.F_HR_ID                         "+
		" FROM PCDE.TAB_CDE_YYT_PERSON_MON T "+
		" where T.DEAL_DATE= "+chooseMonth;
	 }
	 else{
		 sql = "SELECT T.GROUP_ID_1_NAME           "+
			" ,T.HQ_CHAN_CODE                    "+
			" ,T.HQ_CHAN_NAME                    "+
			" ,T.NAME                            "+
			" ,T.HR_ID                           "+
			" ,T.F_USER_NAME                     "+
			" ,T.F_HR_ID                         "+
			" FROM PCDE.TAB_CDE_YYT_PERSON_MON T "+
			" WHERE T.DEAL_DATE= "+chooseMonth +
			" AND GROUP_ID_1 = '"+region+"' ";
	 }
	 if(f_hr_id!=""){
		sql+=" AND T.F_HR_ID = '"+f_hr_id+"'"; 
	 }
	 if(hr_id!=""){
		sql+=" AND T.HR_ID = '"+hr_id+"'"; 
	 }
	 if(hq_chan_code!=""){
		sql+=" AND T.HQ_CHAN_CODE = '"+hq_chan_code+"'"; 
	 }
   var showtext="营业厅人员";
   var _head=["地市","渠道编码","渠道名称","营业员姓名","HR编码","厅主任","厅主任HR编码"];
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

