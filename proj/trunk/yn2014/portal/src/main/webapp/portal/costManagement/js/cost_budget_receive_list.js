var isNeedApprover = true;
var pageSize = 10;
var UPDATE_ROLE = 'ROLE_MANAGER_RESOURCEMANAGER_CBZY_FUN-MENU_UPDATEPART';
$(function(){
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downloadExcel").click(function(){
		download();
	});
	init_sitem();
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var deal_date = $.trim($("#deal_date").val());
	var unit_name = $.trim($("#unit_name").val());
	var is_confirm = $.trim($("#is_confirm").val());
	var group_id_1 = $.trim($("#group_id_1").val());
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "deal_date":deal_date,
           "unit_name":unit_name,
           "is_confirm":is_confirm,
           "resultMap.group_id_1":group_id_1
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
				+"<td>"+isNull(n['DEAL_DATE'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['INIT_ID'])+"</td>"
				+"<td>"+isNull(n['END_TIME_'])+"</td>"
				+"<td>"+isNull(n['REALNAME'])+"</td>";
				var isConf = n['IS_CONFIRM_EN'];
				if(isConf == "1") {
					content+="<td style='color:#007700;'>"+isNull(n['ISCONFIM_CN'])+"</td>";
					content += "<td style='text-align:center;'>" +
					"<a href='#' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='showDetails(this);'>明细</a>" +
					"</td>";
				} else if(isConf == '2') {
					content+="<td style='color:#CC0000;'>"+isNull(n['ISCONFIM_CN'])+"</td>";
					content += "<td style='text-align:center;'>" +
					"<a href='#' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='showDetails(this);'>明细</a>" +
					"</td>";
				} else {
					content+="<td style='color:#f00;'>"+isNull(n['ISCONFIM_CN'])+"</td>";
					if(isGrantedNew(UPDATE_ROLE)) {
						content += "<td style='text-align:center;'>"+
						"<a href='#' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='confirmTask(this);'>确认</a>&nbsp;&nbsp;&nbsp;" +
						"<a href='#' group_id_1_name='"+n['GROUP_ID_1_NAME']+"' unit_name='"+n['UNIT_NAME']+"' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='refuseTask(this);'>拒绝</a>&nbsp;&nbsp;&nbsp;" +
						"<a href='#' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='showDetails(this);'>明细</a>" +
						"</td>";
					} else {
						content += "<td style='text-align:center;'>"+
						"<a href='#' unit_id='"+n['UNIT_ID']+"' init_id='"+n['INIT_ID']+"' deal_date='"+n['DEAL_DATE']+"' onclick='showDetails(this);'>明细</a>" +
						"</td>";
					}
					
				}
				content+="</tr>";
			});
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='8'>暂无数据</td></tr>");
			}
	   	},
	   	error:function(XMLHttpRequest, textStatus, errorThrown){
		   alert("加载数据失败！");
	    }
	});
}

//明细
function showDetails(ele) {
	var unit_id = $(ele).attr("unit_id");
	var init_id = $(ele).attr("init_id");
	var deal_date = $(ele).attr("deal_date");
	var url = $("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!listDetails.action?unit_id="+unit_id+"&init_id="+init_id+"&deal_date="+deal_date;
	window.parent.openWindow("成本预算明细",'funMenu',url);
}

//拒绝
function refuseTask(ele) {
	var unit_id = $(ele).attr("unit_id");
	var init_id = $(ele).attr("init_id");
	var deal_date = $(ele).attr("deal_date");
	var group_id_1_name = $(ele).attr("group_id_1_name");
	var unit_name = $(ele).attr("unit_name");
	art.dialog.data('unit_id',unit_id);
	art.dialog.data('init_id',init_id);
	art.dialog.data('deal_date',deal_date);
	art.dialog.data('group_id_1_name',group_id_1_name);
	art.dialog.data('unit_name',unit_name);
	var url = $("#ctx").val()+"/portal/costManagement/jsp/cost_budget_refuse.jsp";
	art.dialog.open(url,{
		id:'costBudgetRefuseDialog',
		width:'440px',
		height:'240px',
		padding:'0 0',
		title:'成本预算拒绝操作',
		lock:true,
		resize:false
	});
}

//确认
function confirmTask(ele) {
	var unit_id = $(ele).attr("unit_id");
	var init_id = $(ele).attr("init_id");
	var deal_date = $(ele).attr("deal_date");
	art.dialog.confirm('您确定要进行该操作吗？',function(){
		$.ajax({
			type:"POST",
			dataType:'json',
			cache:false,
			url:$("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!confirmTask.action",
			data:{
				"unit_id":unit_id,
				"init_id":init_id,
				"deal_date":deal_date
		   	}, 
		   	success:function(data){
				if(data.code=='OK') {
					art.dialog({
			   			title: '提示',
			   		    content: '操作成功！',
			   		    icon: 'succeed',
			   		    lock: true,
			   		    ok: function () {
							search(0);
			   		    }
			   		});
				}
		   	},
		   	error:function(XMLHttpRequest, textStatus, errorThrown){
				   alert("操作失败！"+errorThrown);
		   	}
		});
	},function(){
		art.dialog.tips('执行取消操作');
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

function init_sitem() {
	$.ajax({
		type:"post",
		dataType:"json",
		url:$("#ctx").val()+"/costBudgetRecevie/cost-budget-recevie!selectRegion.action",
		data:{},
		success:function(data){
			var str = "<option value=''>请选择地市</option>";
			if(data.length!=1){
			for(var i=0;i<data.length;i++){
				console.log(data[i]);
				str += "<option value='"+data[i].ID+"'>"+data[i].NAME+"</option>";
			 }
		    }else{
		    	listUnits(data[0].ID);
		    }
			//str += "</select>";
			$("#group_id_1").empty().append(str);
		  
		},
		error:function(){
			alert("网络延迟");
		}
	});
	$("#group_id_1").change(function(){
		listUnits($(this).val());
	});
}
function listUnits(regionCode){
	var $unit=$("#unit_name");
	var sql = "SELECT DISTINCT t.ORGNAME group_id_2_name FROM PORTAL.APDP_ORG t WHERE t.ORGLEVEL='3'";
	if(regionCode!=''){
		sql+=" and t.REGION_CODE='"+regionCode+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			//sql+=" and t.CODE="+code;
		}else if(orgLevel==3){
			sql+=" and t.CODE="+code;
		}else{
			//sql+=" and t.grou_id_4='"+code+"'";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_2_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_2_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_2_NAME + '">' + d[i].GROUP_ID_2_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}

function download() {
	var deal_date = $.trim($("#deal_date").val());
	var unit_name = $("#unit_name").val();
	var is_confirm = $("#is_confirm").val();
	var group_id_1 = $("#group_id_1").val();
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	
	var sql = "SELECT DISTINCT T.DEAL_DATE,                                                 "+
	"                T.GROUP_ID_1_NAME,                                                     "+
	"                T.UNIT_NAME,                                                           "+
	"                T.INIT_ID,                                                             "+
	"                TO_CHAR(T1.END_TIME_, 'yyyy-MM-dd HH24:mi:ss') AS END_TIME_,           "+
	"                T2.REALNAME,                                                           "+
	"                DECODE(T.ISCONFIM, '1', '已确认', 2,'已拒绝','未确认') AS ISCONFIM_CN        "+
	"  		FROM PORTAL.TAB_PORTAL_COST_BUDGETTOERP_IM T,PORTAL.ACT_HI_PROCINST T1,         "+
	"       		PORTAL.APDP_USER T2                                                     "+
	" 		WHERE T.INIT_ID = T1.BUSINESS_KEY_                                              "+
	"   		AND T1.START_USER_ID_ = T2.ID                                               "+
	"   		AND T.STATUS = '10'                                                         ";

	if(orgLevel==1) {
		
	}else if(orgLevel == 2) {
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel == 3) {
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else {
		sql+=" AND 1=2";
	}
	
	if(deal_date != "") {
		sql+=" AND T.DEAL_DATE ='"+deal_date+"' ";
	}
	if(group_id_1 != "") {
		sql+=" AND T.GROUP_ID_1 ='"+group_id_1+"' ";
	}
	if(unit_name != "") {
		sql+=" AND T.UNIT_NAME ='"+unit_name+"' ";
	}
	if(is_confirm == "1") {
		sql+=" AND T.ISCONFIM = '1'";
	}
	if(is_confirm == "0") {
		sql+=" AND T.ISCONFIM IS NULL";
	}
	sql+=" ORDER BY T.DEAL_DATE DESC";
   var showtext="成本预算接收";
   var _head=["帐期","地市","营服中心","工单编号","下发时间","创建人","状态"];
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