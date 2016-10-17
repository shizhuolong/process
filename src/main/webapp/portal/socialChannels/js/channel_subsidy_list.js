var pageSize = 15;
$(function() {
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#resetBtn").click(function(){
		$("#dealDate").val($("#nowMonth").val());
		$("#hqChanCode").val("");
	});
	
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#addBtn").click(function(){
		add();
	});
	search(0);
});
function changeDealDate(){
	var dealDate=$("#dealDate").val();
	if(dealDate!=$("#nowMonth").val()){
		$("#addBtn").hide();
		$("#dataBody").find("TR").find("TD:last").find("A").hide();
	}else{
		$("#addBtn").show();
		$("#dataBody").find("TR").find("TD:last").find("A").show();
	}
}
function del($tr){
	var hqChanCode=$tr.attr("hqChanCode");
	var dealDate=$("#dealDate").val();
	if(confirm('确认刪除吗?')){
		$.ajax({
			type:"POST",
			dataType:'json',
			async:false,//true是异步，false是同步
			cache:false,//设置为 false 将不会从浏览器缓存中加载请求信息。
			url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!deleteSubsidy.action",
			data:{
		       "params.dealDate":dealDate,
		       "params.hqChanCode":hqChanCode
		   	}, 
		   	success:function(data){
		   		if(data&&data.ok){
		   			alert("删除成功");
		   		}else{
		   			alert("删除失败");
		   		}
		   	    search(0);
		    },
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
	          alert("请求出错！");
	        }
		});
	}
}
function add() {
	var dealDate=$("#dealDate").val();
	var url = $("#ctx").val()+"/portal/socialChannels/jsp/channel_subsidy_add.jsp";
	art.dialog.data('dealDate',dealDate);
	art.dialog.open(url,{
		id:'add',
		width:'520px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加'
	});
}
function update($tr) {
	var url = $("#ctx").val()+"/portal/socialChannels/jsp/channel_subsidy_update.jsp";
	var workNo=$tr.attr("workNo");
	var money=$tr.attr("money");
	var dealDateNum=$tr.attr("dealDateNum");
	var hqChanCode=$tr.attr("hqChanCode");
	var hqChanName=$tr.attr("hqChanName");
	var dealDate=$("#dealDate").val();
	art.dialog.data('workNo',workNo);
	art.dialog.data('money',money);
	art.dialog.data('dealDateNum',dealDateNum);
	art.dialog.data('hqChanCode',hqChanCode);
	art.dialog.data('hqChanName',hqChanName);
	art.dialog.data('dealDate',dealDate);
	art.dialog.open(url,{
		id:'update',
		width:'520px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改'
	});
}
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var hqChanCode=$.trim($("#hqChanCode").val());
	var dealDate=$("#dealDate").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelSubsidy/channel-subsidy!listSubsidy.action",
		data:{
		   "params.page":pageNumber,
           "params.rows":pageSize,
           "params.hqChanCode":hqChanCode,
           "params.dealDate":dealDate
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
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['WORK_NO'])+"</td>"
				+"<td>"+isNull(n['MONEY'])+"</td>"
				+"<td>"+isNull(n['DEAL_DATE_NUM'])+"</td>";
				if(dealDate==$("#nowMonth").val()){
					content+="<td><a onclick='update($(this))' "
						+" workNo='"+n['WORK_NO']
						+"' money='"+isNull(n['MONEY'])
						+"' dealDateNum='"+isNull(n['DEAL_DATE_NUM'])
						+"' hqChanCode='"+isNull(n['HQ_CHAN_CODE'])
						+"' hqChanName='"+isNull(n['HQ_CHAN_NAME'])
						+"' href='javascript:void(0);'>修改</a>&nbsp;&nbsp;" 
						
						+"<a onclick='del($(this))'  "
						+" hqChanCode='"+isNull(n['HQ_CHAN_CODE'])
				 		+"' href='javascript:void(0);'>删除</a></td>";
				}
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
	       prev_text: '上页',       // 上一页按钮里text
		   next_text: '下页',       // 下一页按钮里text
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
	var hqChanCode=$("#hqChanCode").val();
	var dealDate=$("#dealDate").val();
	var userName=$("#userName").val();
	var sql="";
	if($("#level").val()>1){
		sql+="   select                                                 ";
		sql+="          t.deal_date,                                    ";
		sql+="          t.hq_chan_code,                                 ";
		sql+="          t.hq_chan_name,                                 ";
		sql+="          t.work_no,                                      ";
		sql+="          t.money,                                        ";
		sql+="          t.deal_date_num                                 ";
		sql+="   from                                                   ";
		sql+="   			PAPP.TAB_JF_COMM_INPUT t,                   ";
		sql+="   			PCDE.TB_CDE_CHANL_HQ_CODE hq,               ";
		sql+="   			PORTAL.APDP_USER u,                         ";
		sql+="   	      	PORTAL.APDP_ORG o                           ";
		sql+="   		where t.HQ_CHAN_CODE=hq.HQ_CHAN_CODE            ";
		sql+="   		and hq.GROUP_ID_1=o.REGION_CODE                 ";
		sql+="   	    and o.ID=u.ORG_ID                               ";
		sql+="   	    and u.USERNAME='"+userName+"'                   ";
	}else{
		sql+="   select                                                 ";
		sql+="          t.deal_date,                                    ";
		sql+="          t.hq_chan_code,                                 ";
		sql+="          t.hq_chan_name,                                 ";
		sql+="          t.work_no,                                      ";
		sql+="          t.money,                                        ";
		sql+="          t.deal_date_num                                 ";
		sql+="   from                                                   ";
		sql+="   			PAPP.TAB_JF_COMM_INPUT t,                   ";
		sql+="   			PCDE.TB_CDE_CHANL_HQ_CODE hq                ";
		sql+="   		where t.HQ_CHAN_CODE=hq.HQ_CHAN_CODE            ";
	}
	var showtext="渠道补贴录入";
	var _head=["账期","渠道编码","渠道名称","审批工单编码","手工录入预支金额(元)","考核账期数"];
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

