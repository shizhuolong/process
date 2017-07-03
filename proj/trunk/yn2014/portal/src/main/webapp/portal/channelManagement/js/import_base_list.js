var nowData = [];
var title=[["工单编号","地市","品牌","型号","内存","颜色","终端串码","营业厅名称","渠道编码","供应商名称","供应商渠道编码","进货价","零售价","发起人","审批意见"]];
var field=["WORK_FLOW_CODE","GROUP_ID_1_NAME","ZD_BRAND","ZD_TYPES","ZD_MEMORY","ZD_COLOR","ZD_IEMI","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","IN_PRICE","OUT_PRICE","REALNAME","OPTIONS"];
var report = null;
var downSql="";
var startMan="";
var workNo="";
var role="ROLE_MANAGER_RESOURCEMANAGER_ZDZY_ZDXS_BASE_MANAGER_UPDATEPART";
$(function() {
	var orgLevel=$("#orgLevel").val();
	$("#status").change(function(){
		if($(this).val()=="1"){//审批中,生成工单列表,移除导入按钮
			$("#businessTd").show();
			$("#bussinessSelectTd").show();
			$("#repeatTd").hide();
			$("#sendTd").hide();
			initBusiness(1);
		}else if($(this).val()=="2"){//已通过,由于此类工单太多，不生成生成工单列表，批量查询,移除导入按钮
			$("#repeatTd").hide();
			$("#businessTd").hide();
			$("#bussinessSelectTd").hide();
			$("#sendTd").hide();
		}else if($(this).val()=="3"){//未通过,生成工单列表,可以导入，保留工单编号覆盖
			initBusiness(3);
			if($("#business").val()!=""){//没有未通过单，隐藏按钮
				$("#repeatTd").show();
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
				$("#sendTd").show();
			}else{
				$("#repeatTd").hide();
				$("#businessTd").hide();
				$("#bussinessSelectTd").hide();
				$("#sendTd").hide();
			}
		}else{//未发送,无有效工单编号,导入覆盖后不保留工单编号
			initBusiness(0);
			if($("#business").val()!=""){//有工单，显示按钮
				$("#repeatTd").show();
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
				$("#sendTd").show();
			}else{//没有工单，隐藏按钮
				$("#businessTd").hide();
				$("#repeatTd").show();
				$("#bussinessSelectTd").hide();
				$("#sendTd").hide();
			}
		}
		search(0);
	});
	if(orgLevel==1){
		$("#repeatTd").remove();
		$("#approvalBtn").remove();
		$("#sendTd").remove();
	}else{
		if(isGrantedNew(role)){//有审批权限
			$("#repeatTd").hide();
			$("#sendTd").hide();
		    $("#status option:first").remove();
		    initBusiness(1);
		}else{//有导入权限
			$("#approvalBtn").remove();
			initBusiness(0);
			if($("#business").val()!=""){//有工单，显示按钮
				$("#repeatTd").show();
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
				$("#sendTd").show();
			}else{//没有工单，隐藏按钮
				$("#businessTd").hide();
				$("#repeatTd").show();
				$("#bussinessSelectTd").hide();
				$("#sendTd").hide();
			}
		}
	}
	
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var field1=["WORK_FLOW_CODE","GROUP_ID_1_NAME","ZD_BRAND","ZD_TYPES","ZD_MEMORY","ZD_COLOR","ZD_IEMI","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","IN_PRICE","OUT_PRICE"];
	var sql="";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var status=$("#status").val();
	var zd_brands=$("#zd_brands").val();
	var is_back=$("#is_back").val();
	var business=$("#business").val();
	if(isShopper=="1"&&status=="2"&&is_back=="0"){
		sql="SELECT "+field1.join(",")+",T2.REALNAME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>&nbsp;&nbsp;<a style=\"color:blue;cursor:hand;\" onclick=\"backZd($(this));\" zd_iemi='||ZD_IEMI||'>退库<a/>' OPTIONS FROM PMRT.TAB_MRT_YYT_ZD_BASE T1,PORTAL.APDP_USER T2 WHERE T1.USER_NAME=T2.USERNAME AND T1.STATUS='"+status+"'";
	}else{
		sql="SELECT "+field1.join(",")+",T2.REALNAME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>' OPTIONS FROM PMRT.TAB_MRT_YYT_ZD_BASE T1,PORTAL.APDP_USER T2 WHERE T1.USER_NAME=T2.USERNAME AND T1.STATUS='"+status+"'";
	}
	
	if(regionCode!=''){
		sql+=" AND T1.GROUP_ID_1='"+regionCode+"'";
	}
	if(zd_brands!=''){
		sql+=" AND ZD_BRAND LIKE '%"+zd_brands+"%'";
	}
	if(is_back!=''){
		sql+=" AND IS_BACK = '"+is_back+"'";
	}
	if(business!=""){
		sql+=" AND T1.WORK_FLOW_CODE='"+business+"'";
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if(nowData!=null&&nowData.length>1){
		startMan=nowData[0].USER_NAME;
	}
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function initBusiness(status){
	var regionCode=$("#regionCode").val();
	var s="SELECT DISTINCT WORK_FLOW_CODE FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE STATUS='"+status+"' AND GROUP_ID_1='"+regionCode+"'";
    var r=query(s);
    var h="";
    if(r!=null&&r.length>0){
    	for(var i=0;i<r.length;i++){
    		h+="<option value='"+r[i].WORK_FLOW_CODE+"'>"+r[i].WORK_FLOW_CODE+"</option>";
    	}
    }else{
    	h+="<option value=''>无</option>";
    }
    $("#business").empty().append($(h));
}

 function getWorkNo(){
		var regionCode=$("#regionCode").val();
	    var sql="SELECT WORK_FLOW_CODE FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+regionCode+"' AND STATUS='1'";
	    var d=query(sql);
	    if(d!=null&&d.length>0){
	    	return d[0].WORK_FLOW_CODE
	    }
	    return "";
 }
 
 function buinessDetail(obj){//查看审批意见
	workNo=obj.attr("workNo");
	var sql=" SELECT CHECK_MAN,CHECK_IDEA,T2.REALNAME FROM PMRT.TAB_MRT_YYT_ZD_CHECK T1,PORTAL.APDP_USER T2 WHERE T1.CHECK_MAN = T2.USERNAME AND WORK_FLOW_CODE='"+workNo+"'";
	var r=query(sql);
	var content="";
	var check_man="";
	if(r!=null&&r.length>0){
		content=r[0].CHECK_IDEA;
		check_man=r[0].REALNAME;
	}
	if(content!=null&&content!=undefined&&content!=""){
		$("#optionsDetail").empty().append("审批人"+check_man+"回复:</br>"+content);
	}else{
		$("#optionsDetail").empty().text("没有审批意见！");
	}
	$("#optionsDetail").show();
	$('#optionsDetail').dialog({
		title : '审批意见',
		width : 300,
		height : 200,
		closed : false,
		cache : false,
		modal : false,
		maximizable : true,
		onClose:function(){
			$("#optionsDetail").hide();
		}
	});
 }
 
 function backZd(obj){
	 var zd_iemi=obj.attr("zd_iemi");
	 var url = $("#ctx").val()+'/optionsManager/options-manager!backZd.action?resultMap.zd_iemi='+zd_iemi;
	 window.location.href=url;
 }
 
 function repeatImport(){
	 var businessKey="";
	 if($("#status").val()=="3"||$("#status").val()=="0"){//不通过，退回的工单，或者未发送工单重复导入
		 businessKey=$("#business").val();
	 }
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_base.jsp?businessKey="+businessKey;
 }
 
 function exportData(){
	 var title=[["工单编号","地市","品牌","型号","内存","颜色","终端串码","营业厅名称","渠道编码","供应商名称","供应商渠道编码","进货价","零售价","发起人"]];
	var showtext = '终端导出';
	downloadExcel(downSql,title,showtext);
 }
 
 function approval(){
	    workNo=getWorkNo();
	    if(workNo==""){
	    	alert("当前无需要审批工单！");
	    	return;
	    }
	    $("#workNo").val(workNo);
		$("#optionsDiv").show();
		$('#optionsDiv').dialog({
			title : '地市审批',
			width : 600,
			height : 350,
			closed : false,
			cache : false,
			modal : false,
			maximizable : true,
			onClose:function(){
				$("#optionsDiv").hide();
			}
		});
 }
 
 function send(){
	 var workNo=$("#business").val();
	 if(workNo!=null&&workNo!=""){
		 var url = $("#ctx").val()+'/optionsManager/options-manager!send.action?resultMap.workNo='+workNo;
		 window.location.href=url;
	 }
 }
 
 function save(){
		var url = $("#ctx").val()+'/optionsManager/options-manager!save.action';
		$('#optionsForm').form('submit',{
			url:url,
			dataType:"json",
			async: false,
			type: "POST", 
			onSubmit:function(){
				$("#startPhone").val(getStartPhone());
				$("#workNo").val($("#business").val());
			},
			success:function(data){
				var d = $.parseJSON(data);
				if(d.state=="1"){
					alert(d.msg);
					$('#optionsDiv').dialog('close');
					$("#optionsDiv").hide();
					window.location.reload();
				}else{
					alert(d.msg);
				}
			}
		});
	}
 
 function getStartPhone(){
	 var sql=" SELECT PHONE FROM PORTAL.APDP_USER WHERE USERNAME='"+startMan+"' AND ENABLED=1";
	 var r=query(sql);
	 if(r!=null&&r.length>0){
		 return r[0].PHONE;
	 }
	 return "";
 }