var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","SERIAL_NUMBER","MOB_NAME","REWARD_JF"];
var title=[["地市","营服","HR编码","姓名","用户编号","机型","积分"]];
var nowData = [];
var report=null;
$(function() {
	 report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
		css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		content : "content",
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
	
	var time=$("#month").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var orderBy="";
	var sql=getSql();
	var hrId=$("#hrId").val();
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" and GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and NAME LIKE '%"+userName+"%'";
	}
	
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by unit_id,hr_id";
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
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
function getSql(){
	var s="select "+field.join(",")+" from PMRT.TB_MRT_JCDY_BARE_MON where 1=1";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	var time=$("#month").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var orderBy="";
	var sql=getSql();
	var hrId=$("#hrId").val();
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" and GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" and NAME LIKE '%"+userName+"%'";
	}
	
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by unit_id,hr_id";
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	sql+=orderBy;
	showtext = '裸机积分明细-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////