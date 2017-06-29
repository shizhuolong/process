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
	if(orgLevel==1){
		$("#reppeatBtn").remove();
		$("#optionsDetailBtn").remove();//审批意见按钮
		$("#approvalBtn").remove();
	}else{
		if(isGrantedNew(role)){
			$("#reppeatBtn").remove();
			$("#optionsDetailBtn").remove();
		}else{
			$("#approvalBtn").remove();
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
	var check_result=$("#check_result").val();
	if(check_result==''){
		sql="SELECT "+field1.join(",")+",T2.REALNAME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>' OPTIONS FROM PMRT.TAB_MRT_YYT_ZD_BASE T1,PORTAL.APDP_USER T2 WHERE T1.USER_NAME=T2.USERNAME";
	}else{
		sql="SELECT "+field1.join(",")+",T2.REALNAME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>' OPTIONS FROM PMRT.TAB_MRT_YYT_ZD_BASE T1,PORTAL.APDP_USER T2 WHERE T1.CHECK_USER=T2.USERNAME";
	}
	
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(check_result==''){
		sql+=" AND IS_YES IS NULL"; 
	}else{
		sql+=" AND IS_YES='"+check_result+"'";
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

 function getWorkNo(){
	var regionCode=$("#regionCode").val();
    var sql="SELECT WORK_FLOW_CODE FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+regionCode+"' AND IS_YES IS NOT NULL";
    var d=query(sql);
    if(d!=null&&d.length>0){
    	return d[0].WORK_FLOW_CODE
    }
    return "";
 }
 
 function getWorkNo1(){
		var regionCode=$("#regionCode").val();
	    var sql="SELECT WORK_FLOW_CODE FROM PMRT.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+regionCode+"' AND IS_YES IS NULL";
	    var d=query(sql);
	    if(d!=null&&d.length>0){
	    	return d[0].WORK_FLOW_CODE
	    }
	    return "";
 }
 
 function buinessDetail(obj){
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
 
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_base.jsp";
 }
 
 function exportData(){
	 var title=[["工单编号","地市","品牌","型号","内存","颜色","终端串码","营业厅名称","渠道编码","供应商名称","供应商渠道编码","进货价","零售价","发起人"]];
	var showtext = '终端导出';
	downloadExcel(downSql,title,showtext);
 }
 
 function approval(){
	    workNo=getWorkNo1();
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
 
 function save(){
		var url = $("#ctx").val()+'/optionsManager/options-manager!save.action';
		$('#optionsForm').form('submit',{
			url:url,
			dataType:"json",
			async: false,
			type: "POST", 
			onSubmit:function(){
				$("#startPhone").val(getStartPhone());
			},
			success:function(data){
				var d = $.parseJSON(data);
				if(d.state=="1"){
					alert(d.msg);
					$('#optionsDiv').dialog('close');
					$("#optionsDiv").hide();
					search(0);
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