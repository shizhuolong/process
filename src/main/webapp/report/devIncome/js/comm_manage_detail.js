var nowData = [];
var field=["DEAL_DATE","PAY_CHANL_ID","PAY_CHANL_NAME","DEV_CHANL_ID","DEV_CHANL_NAME","SERVICE_NUM","SUBSCRIPTION_ID","COMM_TYPE","COMMITEM","ITEMNAME","RULE_NAME","MOD_NAME","CHN_CDE_1_NAME","CHN_CDE_4_NAME","COMM","REMARK","TITLE","TOTAL_FEE"];
var title;
var orderBy='';	
var report = null;
$(function() {
	$("#time").val($("#qdate").val());
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var time=$("#time").val();
	var channel_query=$.trim($("#channel_query").val());
	var rule_name=$.trim($("#rule_name").val());
	var itemname=$.trim($("#itemname").val());
	var code=$.trim($("#code").val()); 
	var orgCode=$.trim($("#orgCode").val()); 
	var orgLevel=$("#orgLevel").val(); 
	var level=$("#level").val(); 
	var tablecode=$("#tablecode").val();
	
	var sql = "SELECT DEAL_DATE,PAY_CHANL_ID,         "+
"       PAY_CHANL_NAME,                               "+
"       DEV_CHANL_ID,                                 "+
"       DEV_CHANL_NAME,                               "+
"       SERVICE_NUM,                                  "+
"       SUBSCRIPTION_ID,                              "+
"       COMM_TYPE,                                    "+
"       NVL(LOCAL_COMMITEM, COMMITEM) COMMITEM,       "+
"       NVL(LOCAL_ITEMNAME, ITEMNAME) ITEMNAME,       "+
"       RULE_NAME,                                    "+
"       MOD_NAME,                                     "+
"       CHN_CDE_1_NAME,                               "+
"       CHN_CDE_4_NAME                                ";

	
    var table="FROM PMRT.TAB_MRT_COMM_AGENT_DETAIL WHERE DEAL_DATE='"+time+"'";
	
	if(tablecode != null && tablecode != "") {
		sql+="," + tablecode + " COMM,REMARK,TITLE,TOTAL_FEE " + table +" AND "+tablecode + " != '0' ";
	}else {
		sql+=",REMARK REMARK,TITLE,TOTAL_FEE " + table;
	}
	if(channel_query!=''){
		sql+=" AND DEV_CHANL_NAME LIKE '%"+channel_query+"%'";
	}
	if(rule_name!=''){
		sql+=" AND RULE_NAME LIKE '%"+rule_name+"%'";
	}
	if(itemname!=''){
		sql+=" AND ITEMNAME LIKE '%"+itemname+"%'";
	}
	if(code!=null&&code!=""){
		if(level==1){
			sql+=" AND group_id_0='"+code+"'";
		}else if(level==2){
			sql+=" AND group_id_1='"+code+"'";
		}else if(level==3){
			sql+=" AND unit_id='"+code+"'";
		}else{
			sql+=" AND group_id_4='"+code+"'";
		}
	}
	//权限
	if(orgLevel==1){
		sql+=" AND GROUP_ID_0='"+orgCode+"'";
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+orgCode+"'";
	}else{
		 if(hrIds&&hrIds!=""){
		   sql+=" AND HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 ";	 
		 }
	}
	var cdata = query("select count(*) total FROM(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	title=[["账期","结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","电话号码","用户编码","佣金类型","佣金科目","科目名称","规则名称","政策名称","渠道属性大类","渠道属性小类",comm_name,"说明","工单名称","含税"]];
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],// 第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			/*orderBy = " order by " + field[index] + " " + type + " ";
			search(0);*/
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	report.showSubRow();
	if($(".default-btn").length>2){
		$(".default-btn:gt(2)").remove();
	}
	// /////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	// /////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var channel_query=$.trim($("#channel_query").val());
	var rule_name=$.trim($("#rule_name").val());
	var itemname=$.trim($("#itemname").val());
	var code=$("#code").val(); 
	var orgCode=$("#orgCode").val(); 
	var level=$("#level").val(); 
	var orgLevel=$("#orgLevel").val(); 
	var hrId=$("#hrId").val(); 
	var tablecode=$("#tablecode").val();
	//var comm_name=$.trim($("#comm_name").val());
	
	var sql = "SELECT DEAL_DATE,PAY_CHANL_ID,         "+
"       PAY_CHANL_NAME,                               "+
"       DEV_CHANL_ID,                                 "+
"       DEV_CHANL_NAME,                               "+
"       SERVICE_NUM,                                  "+
"       SUBSCRIPTION_ID,                              "+
"       COMM_TYPE,                                    "+
"       NVL(LOCAL_COMMITEM, COMMITEM) COMMITEM,       "+
"       NVL(LOCAL_ITEMNAME, ITEMNAME) ITEMNAME,       "+
"       RULE_NAME,                                    "+
"       MOD_NAME,                                     "+
"       CHN_CDE_1_NAME,                               "+
"       CHN_CDE_4_NAME                                ";

	
	var table="FROM PMRT.TAB_MRT_COMM_AGENT_DETAIL WHERE DEAL_DATE='"+time+"'";
	
	if(tablecode != null && tablecode != "") {
		sql+="," + tablecode + " COMM,REMARK,TITLE,TOTAL_FEE " + table +" AND "+tablecode + " != '0' ";
	}else {
		sql+=",REMARK REMARK,TITLE,TOTAL_FEE " + table;
	}
	if(channel_query!=''){
		sql+=" AND DEV_CHANL_NAME LIKE '%"+channel_query+"%'";
	}
	if(rule_name!=''){
		sql+=" AND RULE_NAME LIKE '%"+rule_name+"%'";
	}
	if(itemname!=''){
		sql+=" AND ITEMNAME LIKE '%"+itemname+"%'";
	}
	
	if(code!=null&&code!=""){
		if(level==1){
			sql+=" AND group_id_0='"+code+"'";
		}else if(level==2){
			sql+=" AND group_id_1='"+code+"'";
		}else if(level==3){
			sql+=" AND unit_id='"+code+"'";
		}else{
			sql+=" AND group_id_4='"+code+"'";
		}
	}
	//权限
	if(orgLevel==1){
		sql+=" AND GROUP_ID_0='"+orgCode+"'";
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+orgCode+"'";
	}else{
		 if(hrIds&&hrIds!=""){
		   sql+=" AND HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 ";	 
		 }
	}
	showtext = '佣金汇总月报汇总明细-'+time;
	downloadExcel(sql,title,showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
