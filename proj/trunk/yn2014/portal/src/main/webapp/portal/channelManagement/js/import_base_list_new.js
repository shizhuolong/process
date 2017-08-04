var nowData = [];
var title=[["工单编号","地市","品牌","型号","内存","颜色","终端串码","营业厅名称","渠道编码","供应商名称","供应商渠道编码","进货价","零售价","发起人","销售状态","导入时间","审批时间","销售时间","审批意见"]];
var field=["WORK_FLOW_CODE","GROUP_ID_1_NAME","ZD_BRAND","ZD_TYPES","ZD_MEMORY","ZD_COLOR","ZD_IEMI","YYT_HQ_NAME","YYT_CHAN_CODE","SUP_HQ_NAME","SUP_HQ_CODE","IN_PRICE","OUT_PRICE","REALNAME","IS_BACK","CREATE_TIME","CHECK_TIME","SALE_TIME","OPTIONS"];
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
			initBusiness(1);
		}else if($(this).val()=="2"){//已通过,由于此类工单太多，不生成生成工单列表，批量查询,移除导入按钮
			$("#businessTd").hide();
			$("#bussinessSelectTd").hide();
			$("#business").empty().append("<option value=''>全部</option>");
		}else if($(this).val()=="3"){//未通过,生成工单列表,可以导入，保留工单编号覆盖
			initBusiness(3);
			if($("#business").val()!=""){//没有未通过单，隐藏按钮
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
			}else{
				$("#businessTd").hide();
				$("#bussinessSelectTd").hide();
			}
		}else{//未发送,无有效工单编号,导入覆盖后不保留工单编号
			initBusiness(0);
			if($("#business").val()!=""){//有工单，显示按钮
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
			}else{//没有工单，隐藏按钮
				$("#businessTd").hide();
				$("#bussinessSelectTd").hide();
			}
		}
		search(0);
	});
	if(orgLevel==1){
		$("#approvalBtn").remove();
	}else{
		if(isGrantedNew(role)){//有审批权限
		    $("#status option:first").remove();
		    initBusiness(1);
		}else{//有查看权限
			$("#approvalBtn").remove();
			initBusiness(0);
			if($("#business").val()!=""){//有工单，显示按钮
				$("#businessTd").show();
				$("#bussinessSelectTd").show();
			}else{//没有工单，隐藏按钮
				$("#businessTd").hide();
				$("#bussinessSelectTd").hide();
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
	var hallName=$("#hallName").val();
	if(isShopper=="1"&&status=="2"&&is_back=="0"){//店长才有退库权限
		sql="SELECT "+field1.join(",")+",T1.REALNAME,CASE WHEN T1.IS_BACK='0' THEN '未销售' WHEN T1.IS_BACK='1' THEN '已销售' ELSE '已退库' END IS_BACK,TO_CHAR(CREATE_TIME,'YYYYMMdd hh24:mi') CREATE_TIME,TO_CHAR(CHECK_TIME,'YYYYMMdd hh24:mi') CHECK_TIME,SALE_TIME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>&nbsp;&nbsp;<a style=\"color:blue;cursor:hand;\" onclick=\"backZd($(this));\" zd_iemi='||ZD_IEMI||'>退库<a/>' OPTIONS FROM AGENTS.TAB_MRT_YYT_ZD_BASE T1 WHERE 1=1";
	}else{
		sql="SELECT "+field1.join(",")+",T1.REALNAME,CASE WHEN T1.IS_BACK='0' THEN '未销售' WHEN T1.IS_BACK='1' THEN '已销售' ELSE '已退库' END IS_BACK,TO_CHAR(CREATE_TIME,'YYYYMMdd hh24:mi') CREATE_TIME,TO_CHAR(CHECK_TIME,'YYYYMMdd hh24:mi') CHECK_TIME,SALE_TIME"+",'<a style=\"color:blue;cursor:hand;\" onclick=\"buinessDetail($(this));\" workNo='||WORK_FLOW_CODE||'>查看意见<a/>' OPTIONS FROM AGENTS.TAB_MRT_YYT_ZD_BASE T1 WHERE 1=1";
	}
	
	if(regionCode!=''){
		sql+=" AND T1.GROUP_ID_1='"+regionCode+"'";
	}
	if(hallName!=''){
		sql+=" AND T1.YYT_HQ_NAME LIKE '%"+hallName+"%'";
	}
	if(zd_brands!=''){
		sql+=" AND T1.ZD_BRAND LIKE '%"+zd_brands+"%'";
	}
	if(is_back!=''){
		sql+=" AND T1.IS_BACK = '"+is_back+"'";
	}
	sql+=" AND T1.STATUS='"+status+"'";
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
	var s="SELECT DISTINCT WORK_FLOW_CODE FROM AGENTS.TAB_MRT_YYT_ZD_BASE WHERE STATUS='"+status+"' AND GROUP_ID_1='"+regionCode+"'";
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
	    var sql="SELECT WORK_FLOW_CODE FROM AGENTS.TAB_MRT_YYT_ZD_BASE WHERE GROUP_ID_1='"+regionCode+"' AND STATUS='1'";
	    var d=query(sql);
	    if(d!=null&&d.length>0){
	    	return d[0].WORK_FLOW_CODE
	    }
	    return "";
 }
 
 function buinessDetail(obj){//查看审批意见
	workNo=obj.attr("workNo");
	var sql=" SELECT CHECK_MAN,CHECK_IDEA,REALNAME FROM AGENTS.TAB_MRT_YYT_ZD_CHECK WHERE WORK_FLOW_CODE='"+workNo+"' ORDER BY CHECK_TIME DESC";
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
	 if(confirm('确认退库吗?')){
		 var zd_iemi=obj.attr("zd_iemi");
		 var url = $("#ctx").val()+'/optionsManager/options-manager!backZd.action?resultMap.zd_iemi='+zd_iemi;
		 window.location.href=url;
	 }
 }
 
 function exportData(){
	 var title=[["工单编号","地市","品牌","型号","内存","颜色","终端串码","营业厅名称","营业厅编码","供应商名称","供应商渠道编码","进货价","零售价","发起人","销售状态","导入时间","审批时间","销售时间",]];
	var showtext = '终端导出';
	downloadExcel(downSql,title,showtext);
 }
 
 function approval(){
	    workNo=$("#business").val();
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

 function isNull(obj){
		if(obj == undefined || obj == null || obj == '') {
			return "";
		}
		return obj;
 }