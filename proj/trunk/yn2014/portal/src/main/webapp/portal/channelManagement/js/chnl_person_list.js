var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var initDate="";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	initDate=$("#deal_date").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/chnlPerson_listTreeNode.action",
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
		$("#std_6_id").val("");
		$("#std_6_name").val("");
		$("#hq_chan_code").val("");
		$("#hq_chan_name").val("");
		$("#name").val("");
		$("#regionCode").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var deal_date = $("#deal_date").val();
	var std_6_id = $.trim($("#std_6_id").val());
	var std_6_name = $.trim($("#std_6_name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var name = $.trim($("#name").val());
	var regionCode = $("#regionCode").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/chnlPerson_listPerson.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "deal_date":deal_date,
           "std_6_id":std_6_id,
           "std_6_name":std_6_name,
           "hq_chan_code":hq_chan_code,
           "hq_chan_name":hq_chan_name,
           "name":name,
           "regionCode":regionCode
	   	}, 
	   	success:function(data){
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['STD_6_ID'])+"</td>"
				+"<td>"+isNull(n['STD_6_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['ACCOUT'])+"</td>";
				//是否划分小区归属
				var hq_chan_code = n['HQ_CHAN_CODE'];
				if(n['DEAL_DATE']==initDate){
					if(hq_chan_code) {
						content += "<td style='text-align:center;'><a href='#' id='"+n['ID']+"' onclick='unBind(this);'>解绑</a></td>";
					} else {
						content += "<td style='text-align:center;'><a href='#' id='"+n['ID']+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' hq_chan_name='"+isNull(n['HQ_CHAN_NAME'])+"' userId='"+isNull(n['USERID'])+"' name='"+isNull(n['NAME'])+"' accout='"+isNull(n['ACCOUT'])+"' phone='"+isNull(n['PHONE'])+"' group_id_1='"+isNull(n['GROUP_ID_1'])+"' unit_id='"+isNull(n['UNIT_ID'])+"' onclick='bind(this);'>绑定</a></td>";
					}
				}else{
					content+="<td></td>"
				}
				content+="</tr>";
			});
			if(content != "") {
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

//小区归属划分
function bind(ele) {
	var id =$(ele).attr("id");
	var hq_chan_code = $(ele).attr("hq_chan_code");
	var hq_chan_name = $(ele).attr("hq_chan_name");
	var userId =$(ele).attr("userId");
	var name =$(ele).attr("name");
	var accout =$(ele).attr("accout");
	var phone =$(ele).attr("phone");
	var group_id_1 =$(ele).attr("group_id_1");
	var unit_id =$(ele).attr("unit_id");
	art.dialog.data('id',id);
	art.dialog.data('hq_chan_code',hq_chan_code);
	art.dialog.data('hq_chan_name',hq_chan_name);
	art.dialog.data('userId',userId);
	art.dialog.data('name',name);
	art.dialog.data('accout',accout);
	art.dialog.data('phone',phone);
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('unit_id',unit_id);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/chnl_person_update.jsp";
	art.dialog.open(url,{
		id:'bindDialog',
		width:'900px',
		height:'150px',
		lock:true,
		resize:false
	});
}

function unBind(ele){
	if(confirm("确定解绑吗？")){
		var id =$(ele).attr("id");
		window.location.href=$("#ctx").val()+"/channelManagement/chnlPerson_unBind.action?id="+id;
	}
}

//分页
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
   var showtext="小区代理商人员管理";
   var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","STD_6_ID","STD_6_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","USERID","NAME","ACCOUT","PHONE"];
   var _head=['账期','地市','营服中心','小区编码','小区名称','渠道编码','渠道名称','渠道经理ID','渠道经理','账号','电话'];
   var sql="SELECT "+field.join(",")+" FROM PCDE.TAB_CDE_STD_CHNL_PERSON";
   var deal_date = $("#deal_date").val();
   var std_6_id = $.trim($("#std_6_id").val());
   var std_6_name = $.trim($("#std_6_name").val());
   var hq_chan_code = $.trim($("#hq_chan_code").val());
   var hq_chan_name = $.trim($("#hq_chan_name").val());
   var name = $.trim($("#name").val());
   var regionCode = $("#regionCode").val();
   var where=" WHERE DEAL_DATE='"+deal_date+"'";
   if(std_6_id!=null&&std_6_id!=""){
	   where+=" AND STD_6_ID LIKE '%"+std_6_id+"%'";
   }
   if(std_6_name!=null&&std_6_name!=""){
	   where+=" AND STD_6_NAME LIKE '%"+std_6_name+"%'";
   }
   if(hq_chan_code!=null&&hq_chan_code!=""){
	   where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
   }
   if(hq_chan_name!=null&&hq_chan_name!=""){
	   where+=" AND HQ_CHAN_NAME LIKE '%"+hq_chan_name+"%'";
   }
   if(name!=null&&name!=""){
	   where+=" AND NAME LIKE '%"+name+"%'";
   }
   if(regionCode!=null&&regionCode!=""){
	   where+=" AND GROUP_ID_1 ='"+regionCode+"'";
   }
   if(orgLevel==1){
	   where+=" AND GROUP_ID_0 ='"+code+"'";
   }else if(orgLevel==2){
	   where+=" AND GROUP_ID_1 ='"+code+"'";
   }else if(orgLevel==3){
	   where+=" AND UNIT_ID ='"+code+"'";
   }else{
	   where+=" AND 1=2";
   }
   sql+=where;
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


