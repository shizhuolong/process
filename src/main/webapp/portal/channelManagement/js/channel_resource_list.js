var pageSize = 15;
var orgId = "";
var orgLevel = "";
var code = "";
var UPDATE_ROLE = "ROLE_MANAGER_RESOURCEMANAGER_PROCESSTIME_CHANNEL_RESOURCE_UPDATEPART";
$(function() {
	//从用户登录信息中获取初始化根节点
	orgLevel = $("#orgLevel").val();
	code = $("#code").val();
	orgId = $("#orgId").val();
	var initOrgName = $("#orgName").val();
	var setting = {
		async : {
			enable : true,
			url : $("#ctx").val()+"/channelManagement/channelResource_listTreeNode.action",
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
		isp = false;
	}
	var zNodes =[{ id:orgId, pId:-1, name:initOrgName,code:code,orgLevel:orgLevel,open:true, isParent:isp}];
	$.fn.zTree.init($("#ztree"), setting, zNodes);
	$(".level0").trigger("click");
	//查询渠道信息
	//search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
	$("#downloadExcel").click(function(){
		downloadExcel();
	});
	$("#resetBtn").click(function(){
		$("#hq_chan_name").val("");
		$("#hq_chan_code").val("");
		$("#is_default").val("");
		$("#chn_cde_1_name").val("");
		$("#chn_cde_2_name").val("");
		$("#chn_cde_3_name").val("");
		$("#chn_cde_4_name").val("");
		$("#isMark").val("");
	});
	
	$("#updateAgentBtn").click(function(){
		updateAgent();
	});
	
	$("#updateNotAgentBtn").click(function(){
		updateNotAgent();
	});
		
	$("#agent_city_id").change(function(){
		listTownType(true,$(this).val());
	});
	$("#notAgent_city_id").change(function(){
		listTownType(false,$(this).val());
	});
});

//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var is_default = $.trim($("#is_default option:selected").val());
	var chn_cde_1_name = $.trim($("#chn_cde_1_name").val());
	var chn_cde_2_name = $.trim($("#chn_cde_2_name").val());
	var chn_cde_3_name = $.trim($("#chn_cde_3_name").val());
	var chn_cde_4_name = $.trim($("#chn_cde_4_name").val());
	var isMark= $("#isMark").val();
	var isAgent= $("#isAgent").val();
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_listChannel.action",
		data:{
           "resultMap.page":pageNumber,
           "resultMap.rows":pageSize,
           "resultMap.orgId":orgId,
           "resultMap.orgLevel":orgLevel,
           "resultMap.code":code,
           	"hq_chan_code":hq_chan_code,
           	"hq_chan_name":hq_chan_name,
           	"is_default":is_default,
           	"chn_cde_1_name":chn_cde_1_name,
           	"chn_cde_2_name":chn_cde_2_name,
           	"chn_cde_3_name":chn_cde_3_name,
           	"chn_cde_4_name":chn_cde_4_name,
           	"isMark":isMark,
           	"isAgent":isAgent
	   	}, 
	   	success:function(data){
	   		if(data.msg) {
	   			art.dialog.alert(data.msg);
	   			return;
	   		}
	   		var pages=data;
	   		if(pageNumber == 1) {
				initPagination(pages.pagin.totalCount);
			}
	   		var content="";
	   		$.each(pages.rows,function(i,n){
				content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td>"+isNull(n['UNIT_NAME'])+"</td>"
				+"<td>"+isNull(n['GROUP_ID_4_NAME'])+"</td>"
				+"<td>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td>"+isNull(n['CHNL_TYPE'])+"</td>"
				+"<td>"+isNull(n['CHN_CDE_1_NAME'])+"</td>"
				+"<td>"+isNull(n['CHN_CDE_2_NAME'])+"</td>"
				+"<td>"+isNull(n['CHN_CDE_3_NAME'])+"</td>"
				+"<td>"+isNull(n['CHN_CDE_4_NAME'])+"</td>";
				//是否已经划分营服中心
				var isDivision = n['ISDIVISION'];
				var is_mark=n['IS_MARK'];
				if(isGrantedNew(UPDATE_ROLE)) {
					if(is_mark=="0"){
						//已划分
						if(isDivision == "1") {
							content += "<td><a href='#' is_mark='0' hq_chan_code='"+n['HQ_CHAN_CODE']+"' chnl_id='"+isNull(n['CHNL_ID'])+"' city_id='"+isNull(n['CITY_ID'])+"' town_id='"+isNull(n['TOWN_ID'])+"' onclick='mark(this);'>打标</a>&nbsp;&nbsp;"+
								       "<a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' onclick='channelDivideNotMark(this);'>修改渠道归属</a>&nbsp;&nbsp;" +
									   "<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
						} else {
							content += "<td><a href='#' is_mark='0' hq_chan_code='"+n['HQ_CHAN_CODE']+"' chnl_id='"+isNull(n['CHNL_ID'])+"' city_id='"+isNull(n['CITY_ID'])+"' town_id='"+isNull(n['TOWN_ID'])+"' onclick='mark(this);'>打标</a>&nbsp;&nbsp;"+
									"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' onclick='channelDivideNotMark(this);'>渠道归属划分</a>&nbsp;&nbsp;&nbsp;" +
									"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
						}
					}else{//已打标
						if(isDivision == "1") {
							content += "<td><a href='#' is_mark='1' hq_chan_code='"+n['HQ_CHAN_CODE']+"' chnl_id='"+isNull(n['CHNL_ID'])+"' city_id='"+isNull(n['CITY_ID'])+"' town_id='"+isNull(n['TOWN_ID'])+"' onclick='mark(this);'>已打标</a>&nbsp;&nbsp;"+
								       "<a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' onclick='channelDivideIsMark(this);'>修改渠道归属</a>&nbsp;&nbsp;" +
									   "<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
						} else {
							content += "<td><a href='#' is_mark='1' hq_chan_code='"+n['HQ_CHAN_CODE']+"' chnl_id='"+isNull(n['CHNL_ID'])+"' city_id='"+isNull(n['CITY_ID'])+"' town_id='"+isNull(n['TOWN_ID'])+"' onclick='mark(this);'>已打标</a>&nbsp;&nbsp;"+
									"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' group_id_1='"+n['GROUP_ID_1']+"' hq_chan_code='"+isNull(n['HQ_CHAN_CODE'])+"' onclick='channelDivideIsMark(this);'>渠道归属划分</a>&nbsp;&nbsp;&nbsp;" +
									"<a href='#' group_id_4='"+n['GROUP_ID_4']+"' onclick='showDetails(this);'>详细信息</a></td>";
						}
					}
					
				}else {
					content += "<td><a href='#' group_id_4='"+n['GROUP_ID_4']+"' chnl_id='"+isNull(n['CHNL_ID'])+"' onclick='showDetails(this);'>详细信息</a></td>";
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

//渠道划分
function channelDivideNotMark(ele) {
	alert("该渠道还未打标，请打标！");
}

function channelDivideIsMark(ele) {
	var group_id_1 = $(ele).attr("group_id_1");
	var group_id_4 = $(ele).attr("group_id_4");
	var hq_chan_code = $(ele).attr("hq_chan_code");
	var is_mark=$(ele).attr("is_mark");
	var login_name = $("#login_name").val();
	art.dialog.data('group_id_1',group_id_1);
	art.dialog.data('group_id_4',group_id_4);
	art.dialog.data('login_name',login_name);
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_resource_divide.jsp";
	art.dialog.open(url,{
		id:'channelDivideDialog',
		width:'410px',
		height:'310px',
		lock:true,
		resize:false
	});
}

function isAgentPoint(hq_chan_code){
	var pointType;
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_isAgentPoint.action",
		data:{
	       "hq_chan_code":hq_chan_code
	   	}, 
	   	success:function(data){
	   		if(data=="isAgentPoint"){
	   			pointType="isAgentPoint";
	   		}else{
	   			pointType="notAgentPoint";
	   		}
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("验证出现异常！");
        }
	});
	return pointType;
}

function openAgentChnlType(){
	var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_type_list_detail.jsp";
	window.parent.openWindow("代理点列表",null,url);
}

function openAgentTownType(){
	var city_id=$("#agent_city_id").val();
	var group_id_1=$("#agent_city_id").find("option:selected").attr("group_id_1");
	var group_id_1_name=$("#agent_city_id").find("option:selected").attr("group_id_1_name");
	var city_name=$("#agent_city_id").find("option:selected").attr("city_name");
	group_id_1_name = encodeURI(encodeURI(group_id_1_name)); 
	city_name = encodeURI(encodeURI(city_name)); 
	if(city_id==""){
		alert("请选择区县归属!");
	}else{
		var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_town_list_detail.jsp?city_id="+city_id+"&city_name="+city_name+"&group_id_1="+group_id_1+"&group_id_1_name="+group_id_1_name;
		window.parent.openWindow("乡镇列表",null,url);
	}
}

function openNotAgentTownType(){
	var city_id=$("#notAgent_city_id").val();
	var group_id_1=$("#notAgent_city_id").find("option:selected").attr("group_id_1");
	var group_id_1_name=$("#notAgent_city_id").find("option:selected").attr("group_id_1_name");
	var city_name=$("#notAgent_city_id").find("option:selected").attr("city_name");
	group_id_1_name = encodeURI(encodeURI(group_id_1_name)); 
	city_name = encodeURI(encodeURI(city_name)); 
	if(city_id==""){
		alert("请选择区县归属!");
	}else{
		var url = $("#ctx").val()+"/portal/channelManagement/jsp/channel_town_list_detail.jsp?city_id="+city_id+"&city_name="+city_name+"&group_id_1="+group_id_1+"&group_id_1_name="+group_id_1_name;
		window.parent.openWindow("乡镇列表",null,url);
	}
}

function isExist(){
	var r=false;
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_isExist.action", 
        dataType: "json",
		data:{
			type_name:$("#type_name").val()
		},
		 success:function(data){
			 if(data.msg){
				 r=true;
				 alert(data.msg);
			 }
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});
	return r;
}

function updateAgent(){
	var hq_chan_code=art.dialog.data("hq_chan_code");
	if($("#agent_chnl_id").val()==""||$("#agent_city_id").val()==""||$("#agent_town_id").val()==""){
		alert("下拉选择不能为空！");
		return;
	}
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_updateAgent.action", 
        dataType: "json",
		data:{
			chnl_id:$("#agent_chnl_id").val(),
			chnl_type:$("#agent_chnl_id").find("option:selected").attr("chnl_type"),
			hq_chan_code:hq_chan_code,
			city_id:$("#agent_city_id").val(),
			city_name:$("#agent_city_id").find("option:selected").attr("city_name"),
			town_id:$("#agent_town_id").val(),
			town_name:$("#agent_town_id").find("option:selected").attr("town_name")
		},
		 success:function(data){
			alert(data.msg);
			$("#updateAgentFormDiv").dialog('close');
			search(0);
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
		} 
	});
}

function updateNotAgent(){
	var hq_chan_code=art.dialog.data("hq_chan_code");
	if($("#notAgent_city_id").val()==""||$("#notAgent_town_id").val()==""){
		alert("下拉框不能为空！");
		return;
	}
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_updateNotAgent.action", 
        dataType: "json",
		data:{
			hq_chan_code:hq_chan_code,
			city_id:$("#notAgent_city_id").val(),
			city_name:$("#notAgent_city_id").find("option:selected").attr("city_name"),
			town_id:$("#notAgent_town_id").val(),
			town_name:$("#notAgent_town_id").find("option:selected").attr("town_name")
		},
		 success:function(data){
			alert(data.msg);
			$("#updateNotAgentFormDiv").dialog('close');
			search(0);
    	},
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert("修改失败！"); 
		} 
	});
}

function listChnlType(isAgent){
		$.ajax({ 
	        type: "POST", 
	        async: false,
	        url: $("#ctx").val()+"/channelManagement/channelResource_loadChnlType.action", 
	        dataType: "json",
			success:function(d){
				if (d&&d[0]) {
					var h = '';
						h += '<option value="" selected>请选择</option>';
						for (var i = 0; i < d.length; i++) {
							h += '<option chnl_type="'+d[i].TYPE_NAME+'" value="' + d[i].ID + '">' + d[i].TYPE_NAME + '</option>';
						}
						if(isAgent){
							$("#agent_chnl_id").empty().append($(h));
						}else{
							$("#notAgent_chnl_id").empty().append($(h));
						}
	    	 } else {
	    		alert("获取代理点类型失败!");
	    	 }
		    },
	    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
	    		alert("获取代理点类型失败!");
			} 
		});
}

function listCityType(isAgent,hq_chan_code){
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_loadCityType.action", 
        dataType: "json",
        data:{
        	"hq_chan_code":hq_chan_code
        },
		success:function(d){
			if (d&&d[0]) {
				var h = '';
					h += '<option value="" selected>请选择</option>';
					for (var i = 0; i < d.length; i++) {
						h += '<option city_name="'+d[i].CITY_NAME+'" group_id_1="'+d[i].GROUP_ID_1+'" group_id_1_name="'+d[i].GROUP_ID_1_NAME+'" value="' + d[i].CITY_ID + '">' + d[i].CITY_NAME + '</option>';
					}
				if(isAgent){
					$("#agent_city_id").empty().append($(h));
				}else{
					$("#notAgent_city_id").empty().append($(h));
				}	
    	 } else {
    		alert("获取区县归属失败!");
    	 }
	    },
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
    		alert("获取区县归属失败!");
		} 
	});
}

function listTownType(isAgent,city_id){
	$.ajax({ 
        type: "POST", 
        async: false,
        url: $("#ctx").val()+"/channelManagement/channelResource_loadTownType.action", 
        dataType: "json",
        data:{
        	"city_id":city_id
        },
		success:function(d){
			if (d&&d[0]) {
				var h = '';
				h += '<option value="" selected>请选择</option>';
					for (var i = 0; i < d.length; i++) {
						h += '<option town_name="'+d[i].TOWN_NAME+'" value="' + d[i].TOWN_ID + '">' + d[i].TOWN_NAME + '</option>';
					}
					if(isAgent){
						$("#agent_town_id").empty().append($(h));
					}else{
						$("#notAgent_town_id").empty().append($(h));
					}	
    	   } else {
    		   alert("获取乡镇归属失败!");
    	   }
	    },
    	error: function (XMLHttpRequest, textStatus, errorThrown) { 
    		alert("获取乡镇归属失败!");
		} 
	});
}

function isHavingMark(hq_chan_code,type){
	var isHavingMark;
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/channelManagement/channelResource_isHavingMark.action",
		data:{
	       "hq_chan_code":hq_chan_code,
	       "type":type
	   	}, 
	   	success:function(data){
	   		if(data=="isHavingMark"){
	   			isHavingMark=true;
	   		}else{
	   			if(type==0){
	   				alert("该代理点未打标，请先打标！");
	   			}else{
	   				alert("该渠道未打标，请先打标！");
	   			}
	   			isHavingMark=false;
	   		}
	    },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("验证出现异常！");
        }
	});
	return isHavingMark;
}

function mark(ele){
	var hq_chan_code=$(ele).attr("hq_chan_code");
	var chnl_id=$(ele).attr("chnl_id");
	var city_id=$(ele).attr("city_id");
	var town_id=$(ele).attr("town_id");
	art.dialog.data("hq_chan_code",hq_chan_code);
	var pointType=isAgentPoint(hq_chan_code);
	var orgLevel=$("#orgLevel").val();
	if(orgLevel>1){
		$("#agentMoreChnl").remove();
		$("#agentMoreTown").remove();
		$("#notAgentMoreTown").remove();
	}
	if(pointType=="isAgentPoint"){
		var formdiv=$('#updateAgentFormDiv');
		listChnlType(true);
		listCityType(true,hq_chan_code);
		$("#agent_chnl_id").val(chnl_id);
		$("#agent_city_id").val(city_id);
		var agent_city_id=$("#agent_city_id").val();
		listTownType(true,agent_city_id);
		$("#agent_town_id").val(town_id);
		formdiv.show();
		art.dialog.data("type",0);
		formdiv.dialog({
			title : '修改',
			width : 450,
			height : 200,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true
		});
    }else{
    	var formdiv=$('#updateNotAgentFormDiv');
		listCityType(false,hq_chan_code);
		$("#notAgent_city_id").val(city_id);
		var notAgent_city_id=$("#notAgent_city_id").val();
		listTownType(false,notAgent_city_id);
		$("#notAgent_town_id").val(town_id);
		art.dialog.data("type",1);
		formdiv.show();
		formdiv.dialog({
			title : '修改',
			width : 400,
			height : 250,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true
		});
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

function cancel(id) {
	$("#"+id).dialog('close');
}

function isNull(obj){
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}

//查询详细信息
function showDetails(ele) {
	var group_id_4 = $(ele).attr("group_id_4");
	var url = $("#ctx").val()+"/channelManagement/channelResource_loadChanlInfo.action?group_id_4="+group_id_4;
	window.parent.openWindow("渠道详细信息",'funMenu',url);
}

function downloadExcel() {
	var hq_chan_name = $.trim($("#hq_chan_name").val());
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var is_default = $.trim($("#is_default option:selected").val());
	var chn_cde_1_name = $.trim($("#chn_cde_1_name").val());
	var chn_cde_2_name = $.trim($("#chn_cde_2_name").val());
	var chn_cde_3_name = $.trim($("#chn_cde_3_name").val());
	var chn_cde_4_name = $.trim($("#chn_cde_4_name").val());
	var isMark=$("#isMark").val();
	var isAgent=$("#isAgent").val();
	var sql = "";
	if(orgLevel=="1") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,T3.CHN_CDE_1_NAME,T3.CHN_CDE_2_NAME,T3.CHN_CDE_3_NAME,T3.CHN_CDE_4_NAME, "+
		"        T.CHNL_TYPE,CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		",T.CITY_NAME,T.TOWN_NAME,T3.LOG_NO,T3.LAT_NO,CASE WHEN IS_JK ='0' THEN '公众渠道' ELSE '集客渠道' END IS_JK "+
		",T.START_SHORT_NAME,T.START_LEVE                                                                   "+
		",T.IS_PHOTO FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1  AND T.GROUP_ID_1 !=16017                                                         ";
	}else if(orgLevel == "2") {
	    sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,T3.CHN_CDE_1_NAME,T3.CHN_CDE_2_NAME,T3.CHN_CDE_3_NAME,T3.CHN_CDE_4_NAME, "+
		"       T.CHNL_TYPE,CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                  "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		",T.CITY_NAME,T.TOWN_NAME,T3.LOG_NO,T3.LAT_NO,CASE WHEN IS_JK ='0' THEN '公众渠道' ELSE '集客渠道' END IS_JK "+
		",T.START_SHORT_NAME,T.START_LEVE             "+
		",T.IS_PHOTO FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND T.GROUP_ID_1 !=16017 AND T.GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel == "3") {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,T3.CHN_CDE_1_NAME,T3.CHN_CDE_2_NAME,T3.CHN_CDE_3_NAME,T3.CHN_CDE_4_NAME, "+
		"        T.CHNL_TYPE,CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                 "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		",T.CITY_NAME,T.TOWN_NAME,T3.LOG_NO,T3.LAT_NO,CASE WHEN IS_JK ='0' THEN '公众渠道' ELSE '集客渠道' END IS_JK "+
		",T.START_SHORT_NAME,T.START_LEVE             "+
		",T.IS_PHOTO FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND T.GROUP_ID_1 !=16017 AND T.UNIT_ID = '"+code+"' ";
	}else {
		sql = "SELECT T.GROUP_ID_1_NAME,T.UNIT_NAME,T.GROUP_ID_4_NAME,T.HQ_CHAN_CODE,                 "+
		"        T.CHNL_TYPE,CASE WHEN T2.IS_DEFAULT = 0 THEN '是' ELSE '否' END AS ISDIVISION                            "+
		"        ,DECODE(T3.STATUS,'00','草稿','01','待审核','10','正常','11','清算','12','终止',NULL) STATUS       "+
		",T.START_SHORT_NAME,T.START_LEVE             "+
		",T.IS_PHOTO FROM PCDE.TAB_CDE_CHANL_HQ_CODE T                                                                   "+
		",PCDE.TAB_CDE_GROUP_CODE T2                                                                         "+
		",PCDE.TB_CDE_CHANL_HQ_CODE T3                                                                       "+
		"WHERE T.UNIT_ID = T2.UNIT_ID                                                                        "+
		"AND    T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE                                                               "+   
		"AND T.IS_SIGN = 1 AND 1=2 ";
	}
	if(hq_chan_name != "") {
		sql += " AND T.GROUP_ID_4_NAME LIKE '%"+hq_chan_name+"%' ";
	}
	if(hq_chan_code != "") {
		sql += "AND T.HQ_CHAN_CODE='"+hq_chan_code+"' ";
	}
	if(is_default != "") {
		sql += "AND T2.IS_DEFAULT='"+is_default+"' ";
	}
	if(chn_cde_1_name != "") {
		sql += " AND T3.CHN_CDE_1_NAME LIKE '%"+chn_cde_1_name+"%' ";
	}
	if(chn_cde_2_name != "") {
		sql += " AND T3.CHN_CDE_2_NAME LIKE '%"+chn_cde_2_name+"%' ";
	}
	if(chn_cde_3_name != "") {
		sql += " AND T3.CHN_CDE_3_NAME LIKE '%"+chn_cde_3_name+"%' ";
	}
	if(chn_cde_4_name != "") {
		sql += " AND T3.CHN_CDE_4_NAME LIKE '%"+chn_cde_4_name+"%' ";
	}
	if (isMark != ""){
		sql+=" AND T.IS_MARK ='"+isMark+"'";
	}
	if (isAgent == "1"){
		sql+=" AND T.CHNL_TYPE IS NOT NULL";
	}
	if (isAgent == "0"){
		sql+=" AND T.CHNL_TYPE IS NULL";
	}
	sql += " ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	var showtext="Sheet";
   var showtext1="result";
   var _head=['地市名称','营服中心','渠道名称','渠道编码','渠道属性1','渠道属性2','渠道属性3','渠道属性4','代理点类型','是否划分营服中心','状态',"区县","乡镇","经度","纬度","渠道属性","战略渠道简称","战略渠道级别","是否有照片"];
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
