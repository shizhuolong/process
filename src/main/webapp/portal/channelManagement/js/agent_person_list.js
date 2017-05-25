var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var deal_date="";
var initMonth="";

$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	initMonth = $("#time").val();
	var addBtn=$("#addBtn");
	addBtn.click(function(){
	   add();
	});
	$("#time").blur(function(){
		deal_date=$("#time").val();
		if(deal_date!=initMonth){
			addBtn.hide();
		}else{
			addBtn.show();
		}
		search(0);
	});
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/agentPerson_listTreeNode.action",
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
		$("#hq_chan_code").val("");
		$("#hq_chan_name").val("");
		$("#unit_name").val("");
		$("#name").val("");
		$("#phone").val("");
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	
});

function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var unit_name = $.trim($("#unit_name").val());
	var name = $.trim($("#name").val());
	var phone = $.trim($("#phone").val());
	deal_date=$("#time").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/agentPerson_queryAgentPerson.action",
		data:{
		   "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           "hq_chan_code":hq_chan_code,
           "hq_chan_name":hq_chan_name,
           "name":name,
           "phone":phone,
           "unit_name":unit_name,
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
	   		
            if(deal_date==initMonth){
              var content="";
	   		  $.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['CHNLAGENT'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
				+"<td>"+isNull(n['NAME'])+"</td>"
				+"<td>"+isNull(n['PHONE'])+"</td>"
				+"<td>"+isNull(n['PEOPLE_TYPE'])+"</td>"
				+/*"<td><a onclick='update($(this))' hq_chan_name='"+isNull(n['HQ_CHAN_NAME'])+
				 "' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+
				 "' people_type='"+isNull(n['PEOPLE_TYPE'])+
				 "' name='"+isNull(n['NAME'])+
				 "' phone='"+isNull(n['PHONE'])+
				 "' nameid='"+isNull(n['NAMEID'])+
				 "' href='#'>修改</a>&nbsp;&nbsp;"*/ 
			 	"<td><a onclick='del($(this))' nameid='"+isNull(n['NAMEID'])+"' href='#'>删除</a></td>";
				content+="</tr>";
			 });
            }else{
            	var content="";
            	$.each(pages.rows,function(i,n){
    				content+="<tr>"
    				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
    				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
    				+"<td>"+isNull(n['CHNLAGENT'])+"</td>"
    				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
    				+"<td>"+isNull(n['HQ_CHAN_NAME'])+"</td>"
    				+"<td>"+isNull(n['NAME'])+"</td>"
    				+"<td>"+isNull(n['PHONE'])+"</td>"
    				+"<td>"+isNull(n['PEOPLE_TYPE'])+"</td>"
    				+"<td></td>";
    				content+="</tr>";
    			});
            }
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
function del(obj){
	var nameid=obj.attr("nameid");
	var path=$("#ctx").val();
	if(confirm('确认刪除吗?')){
	  window.location.href=path+"/channelManagement/agentPerson_del.action?nameid="+nameid+"&deal_date="+initMonth;
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
function add() {
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/agent_person_add.jsp";
	art.dialog.data('deal_date',initMonth);
	art.dialog.open(url,{
		id:'add',
		width:'550px',
		height:'400px',
		padding:'0 0',
		lock:true,
		resize:false,
		title:'增加代理商人员'
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
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var unit_name = $.trim($("#unit_name").val());
	var name = $.trim($("#name").val());
	var phone = $.trim($("#phone").val());
    var hrId=$("#hrId").val();
	var level=$("#orgLevel").val();
	
	var sql = "SELECT T.DEAL_DATE,                                          "+
	"T.GROUP_ID_1_NAME,                                                     "+
	"T.UNIT_NAME,                                                           "+
	"T1.NAME chnlAgent,                                                     "+
	"T.HQ_CHAN_CODE,                                                        "+
	"T.HQ_CHAN_NAME,                                                        "+
	"T.NAME,                                                                "+
	"T.PHONE,                                                               "+
	"CASE WHEN T.LEV='1' THEN '店长' ELSE '店员' END people_type              "+
	"FROM PORTAL.TAB_PORTAL_AGENT_PERSON T,PORTAL.TAB_PORTAL_MOB_PERSON T1  ";
	var where=" WHERE T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T.DEAL_DATE='"+deal_date+"' AND T1.DEAL_DATE='"+deal_date+"'";
	if(level==1) {//省
		if(orgLevel==2){//点击树上的地市
			where+=" AND T.GROUP_ID_1='"+code+"'";
		}else if(orgLevel==3){//点击树上的营服
			where+=" AND T.UNIT_ID='"+code+"'";
		}
	}else if(level == 2) {//市
		if(orgLevel==3){//点击树上的营服
			where+=" AND T.UNIT_ID='"+code+"'";
		}
		where+=" AND T.GROUP_ID_1='"+$("#code").val()+"'";
	}else if(level == 3) {
		where+=" AND T1.HR_ID IN("+_jf_power(hrId,deal_date)+")";
	}else {
		where+=" AND 1=2";
	}
	
	if(hq_chan_code != "") {
		where += " AND T.HQ_CHAN_CODE='"+hq_chan_code+"' ";
	}
	if(hq_chan_name != "") {
		where += " AND T.HQ_CHAN_NAME LIKE '%"+hq_chan_name+"%' ";
	}
	if(phone != "") {
		where += " AND T.PHONE LIKE '%"+phone+"%' ";
	}
	if(name != "") {
		where += " AND T.NAME LIKE '%"+name+"%' ";
	}
	if(unit_name != "") {
		where += " AND T.UNIT_NAME LIKE '%"+unit_name+"%' ";
	}
   sql+=where;
   var showtext="代理商人员管理";
   var _head=["账期","地市","营服","渠道经理","渠道编码","渠道名称","代理商人名","电话","人员类型"];
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

