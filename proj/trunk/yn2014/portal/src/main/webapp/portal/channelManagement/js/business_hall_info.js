var pageSize = 15;
$(function() {
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var is_ball = $("#is_ball").val();
	var hall_code = $.trim($("#hall_code").val());
	var deal_date=$("#deal_date").val();
	
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/businessHallInfo_list.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.hall_code":hall_code,
           "resultMap.is_ball":is_ball,
           "resultMap.deal_date":deal_date
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
	   		  $.each(pages.rows,function(i,item){
				content+="<tr>"
					+"<td>"+ isNull(item["GROUP_ID_1_NAME"])+ "</td>"
					+"<td>"+ isNull(item["YYY_NAME"])+ "</td>"
					+"<td>"+ isNull(item["HALL_CODE"])+ "</td>"
					+"<td>"+ isNull(item["YYY_ARRE_NAME"])+ "</td>"
					+"<td>"+ isNull(item["HQ_CHAN_CODE"])+ "</td>"
					+"<td>"+ isNull(item["IS_BALL"]=='1'?'是':'否')+ "</td>"
					/*+"<td>"+ isNull(item["CHANNLE_NAME"])+ "</td>"
					+"<td>"+ isNull(item["OPEN_TIME"])+ "</td>"
					+"<td>"+ isNull(item["YYY_TYPE"])+ "</td>"
					+"<td>"+ isNull(item["OPERATE_TYPE"])+ "</td>"*/
					/*+"<td>"+ isNull(item["T_TYPE"])+ "</td>"
					+"<td>"+isNull(item["MANAGE_NAME"])+"</td>"
					+"<td>"+isNull(item["AGENT_INNER_TIME"])+"</td>"
					+"<td>"+isNull(item["PACT_CREATE_TIME"])+"</td>"
					+"<td>"+isNull(item["PACT_INACTIVE_TIME"])+"</td>"
					+"<td>"+isNull(item["PACT_MONEY"])+"</td>"
					+"<td>"+isNull(item["AREA_STRUCTURE"])+"</td>"
					+"<td>"+isNull(item["YYT_NUM"])+"</td>"
					+"<td>"+isNull(item["AGENT_NUM"])+"</td>"
					+"<td>"+isNull(item["SELF_SERVICE_NUM"])+"</td>"
					+"<td>"+isNull(item["T_MANAGE_NAME"])+"</td>"
					+"<td>"+isNull(item["PHONE"])+"</td>"
					+"<td>"+isNull(item["MON_RENT"])+"</td>"
					+"<td>"+isNull(item["PM_FEE"])+"</td>"
					+"<td>"+isNull(item["W_AND_E"])+"</td>"
					+"<td>"+isNull(item["FIT_FEE"])+"</td>"
					+"<td>"+isNull(item["SEC_FEE"])+"</td>"*/
			 	+"<td><a onclick='del($(this))' nameid='"+isNull(item['NAMEID'])+"' href='#'>查看</a></td>";
				content+="</tr>";
			 });
			if(content != "") {
				$("#dataBody").empty().html(content);
			}else {
				$("#dataBody").empty().html("<tr><td colspan='30'>暂无数据</td></tr>");
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
function update(obj) {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/agent_person_update.jsp";
	art.dialog.data('hq_chan_code',obj.attr("hq_chan_code"));
	art.dialog.data('hq_chan_name',obj.attr("hq_chan_name"));
	art.dialog.data('people_type',obj.attr("people_type"));
	art.dialog.data('name',obj.attr("name"));
	art.dialog.data('phone',obj.attr("phone"));
	art.dialog.data('deal_date',initMonth);
	art.dialog.data('nameid',obj.attr("nameid"));
	art.dialog.open(url,{
		id:'update',
		width:'550px',
		height:'130px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'修改代理商人员'
	});
}
function isNull(obj){
	if(obj == undefined || obj == null || obj == '' || obj == null) {
		return "";
	}
	return obj;
}

function downloadExcel() {
	var hall_code = $.trim($("#hall_code").val());
	var is_ball = $("#is_ball").val();
	var code =$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var deal_date=$("#deal_date").val();
	var where=" WHERE 1=1 AND DEAL_DATE='"+deal_date+"'";
	
	var sql = "SELECT GROUP_ID_1_NAME     ," +
	"YYY_NAME            ," +
	"HALL_CODE           ," +
	"YYY_ARRE_NAME       ," +
	"HQ_CHAN_CODE        ," +
	"CASE WHEN IS_BALL='1' THEN '是' ELSE '否' END IS_BALL," +
	"CHANNLE_NAME        ," +
	"OPEN_TIME           ," +
	"YYY_TYPE            ," +
	"OPERATE_TYPE        ," +
	"T_TYPE              ," +
	"MANAGE_NAME         ," +
	"AGENT_INNER_TIME    ," +
	"PACT_CREATE_TIME    ," +
	"PACT_INACTIVE_TIME  ," +
	"PACT_MONEY          ," +
	"AREA_STRUCTURE      ," +
	"YYT_NUM             ," +
	"AGENT_NUM           ," +
	"SELF_SERVICE_NUM    ," +
	"T_MANAGE_NAME       ," +
	"PHONE               ," +
	"MON_RENT            ," +
	"PM_FEE              ," +
	"W_AND_E             ," +
	"FIT_FEE             ," +
	"SEC_FEE FROM PTEMP.TB_TEMP_BUS_HALL_INFO ";
	if(orgLevel==1) {//省
			
	}else if(level == 2) {//市
		where+=" AND GROUP_ID_1='"+code+"'";
	}else {
		where+=" AND 1=2";
	}
	
	if(hall_code != "") {
		where += " AND HALL_CODE = '"+hall_code+"'";
	}
	if(is_ball != "") {
		where += " AND IS_BALL='"+is_ball+"'";
	}
   sql+=where;
   var showtext="营业厅固化信息-"+deal_date;
   var _head=["地市","营业厅名称","主厅编码","营业厅地址","渠道编码","是否主厅","渠道名称 ","渠道启用时间","营业厅类型（自有产权、租用、自有+租用）","运营模式（自营、柜台外包、他营）","厅类型（旗舰、标准、小型） ","经营者名称（自营、代理商名称）","代理商进驻厅的开始时间","房屋合同起始日期","房屋合同截止日期","合同年租金（万元）","建筑面积（M2）","营业厅人数（联通方）","代理商或厂家驻店人数","自助终端数量（台）","厅经理姓名","店长联系方式","月房租","物业管理费用","水电费","装修费","安保费"];
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

