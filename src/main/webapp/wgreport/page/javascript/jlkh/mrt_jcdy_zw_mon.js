var field=["GROUP_ID_1","GROUP_ID_1_NAME","NAME","HR_ID","USER_ROLE","SERVICE_NUM","ITEMCODE","ITEMDESC","ARCH_DT","CRE","HQ_CRE","UNIT_CRE"];
var title=[["地市编码","地市","姓名","HR编码","角色","电话号码","指标编码","指标描述","受理日期","原始积分","渠道系数","营服系数"]];
var nowData = [];
var report=null;
$(function() {
	listRegions();
	 report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
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
	var regionName=$("#regionName").val();
	var userName=$.trim($("#userName").val());
	var orderBy="";
	var sql=getSql();
	var hrId=$("#hrId").val();
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(userName!=''){
		sql+=" and NAME LIKE '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by hr_id";
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
	var s="select "+field.join(",")+" from PMRT.TB_MRT_JCDY_ZW_MON where 1=1";
	return s;
}
function listRegions(){
	var sql="";
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME,t.group_id_1 from PMRT.TB_MRT_JCDY_ZW_MON t where 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	//排序
		sql += " order by t.group_id_1";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
	}
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	var time=$("#month").val();
	var regionName=$("#regionName").val();
	var userName=$.trim($("#userName").val());
	var orderBy="";
	var sql=getSql();
	var hrId=$("#hrId").val();
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(userName!=''){
		sql+=" and NAME LIKE '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by hr_id";
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	sql+=orderBy;
	showtext = '装维积分明细-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////