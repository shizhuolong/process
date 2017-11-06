var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var deal_date="";
$(function() {
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	if(orgLevel==1){
		$("#reppeatBtn").remove();
	}

	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	search(0);
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var regionCode = $.trim($("#regionCode").val());
	var unit_name = $.trim($("#unit_name").val());
	var name = $.trim($("#name").val());
	deal_date=$("#time").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/fixedSalary/import-fixed-salary!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "regionCode":regionCode,
           "unit_name":unit_name,
           "name":name,
           "deal_date":deal_date
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
            		content+="<tr align='center'>"
        				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
        				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
        				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
        				+"<td>"+isNull(n['HR_ID'])+"</td>"
        				+"<td>"+isNull(n['NMAE'])+"</td>"
        				+"<td>"+isNull(n['SALAY_NUM'])+"</td>"
        				+"<td>"+isNull(n['AWARD_NUM'])+"</td>";
            		var dateString=n['DEAL_DATE']+"01";
            		var pattern = /(\d{4})(\d{2})(\d{2})/;
            		var formatedDate = dateString.replace(pattern, '$1-$2-$3');
            		var dealDate = new Date(Date.parse(formatedDate));
            		var dealMonth=dealDate.getMonth()+1;
            		var myDate = new Date().getMonth()+1;
            		
            		if(myDate<=dealMonth+1){
            			content+="<td><a href='#' deal_date='"+n['DEAL_DATE']+"' group_id_name='"+n['GROUP_ID_1_NAME']+"' unit_name='"+n['UNIT_NAME']+"' hr_id='"+n['HR_ID']+"' name='"+n['NAME']+"' salary_num='"+n['SALAY_NUM']+"' award_num='"+n['AWARD_NUM']+"' " +
						" onclick='edit(this);'>修改</a></td>";	
            		}else{content+="<td></td>";}
    				content+="</tr>";
    			});
			if(content!="") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='9'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}
function downsAll() {
	var code=$("#code").val();
	var regionCode = $.trim($("#regionCode").val());
	var unit_name = $.trim($("#unit_name").val());
	var name = $.trim($("#name").val());
	deal_date=$("#time").val();
	var level=$("#orgLevel").val();
	
	var sql = "SELECT T.DEAL_DATE,                                          "+
	"T.GROUP_ID_1_NAME,                                                     "+
	"T.UNIT_NAME,                                                           "+
	"T.HR_ID,                                                     "+
	"T.NMAE,                                                        "+
	"T.SALAY_NUM,                                                        "+
	"T.AWARD_NUM                                                                "+
	"FROM PMRT.TAB_MRT_CHNL_SALAY_AWARD_MON T";
	var where=" WHERE T.DEAL_DATE='"+deal_date+"'";
	if(level==1) {//省
		
	}else if(level == 2) {//市
		where+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(level == 3) {
		where+=" AND T.UNIT_ID='"+code+"'";
	}else {
		where+=" AND 1=2";
	}
	
	if(regionCode != "") {
		where += " AND T.GROUP_ID_1='"+regionCode+"' ";
	}
	if(unit_name != "") {
		where += " AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
	if(name != "") {
		where += " AND T.NMAE LIKE '%"+name+"%' ";
	}
	
   sql+=where;
   var showtext="固定薪酬-专项奖励";
   var _head=["账期","地市名称","营服名称","HR编码","姓名","固定薪酬","专项奖励"];
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

function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_fixed_salary.jsp";
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		obj=0;
	}
	return obj;
}

function edit(ele) {
	var deal_date = $(ele).attr("deal_date");
	var group_id_name = $(ele).attr("group_id_name");
	var unit_name = $(ele).attr("unit_name");
	var hr_id = $(ele).attr("hr_id");
	var name = $(ele).attr("name");
	art.dialog.data('deal_date',deal_date);
	art.dialog.data('group_id_name',group_id_name);
	art.dialog.data('unit_name',unit_name);
	art.dialog.data('hr_id',hr_id);
	art.dialog.data('name',name);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/fixed_salary_update.jsp";
	art.dialog.open(url,{
		id:'networkUpdateDialog',
		width:'660px',
		height:'230px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改'
	});
}