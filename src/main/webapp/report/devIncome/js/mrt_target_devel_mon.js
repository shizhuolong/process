var nowData = [];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","USER_NAME","DEVELOPER","USER_TYPE","DEV_2G_NUM","DEV_3G_NUM","DEV_4G_NUM","DEV_KD_NUM","DEV_ZZX_NUM","DEV_GH_NUM","SR_2G_NUM","SR_3G_NUM","SR_4G_NUM","SR_KD_NUM","SR_ZZX_NUM","SR_GH_NUM"];
var title=[["地市","营服中心","编码","姓名","发展人编码","人员类型","2g新发展","3g新发展","4g新发展","宽带新发展","专线新发展","固话新发展","2g出账收入","3g出账收入","4g出账收入","宽带出账收入","专租线出账收入","固话出账收入"]];
var orderBy='';	
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}],
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
	
	var time=$("#time").val();
	var user_type=$.trim($("#user_type").val());
	var hr_id=$.trim($("#hr_id").val());
	var developer=$.trim($("#developer").val());
	var orderBy="";
	var sql=getSql();
//条件
	sql+=" and DEAL_DATE="+time;
	if(hr_id!=''){
		sql+=" and hr_id = '"+hr_id+"'";
	}
	if(user_type!=''){
		sql+=" and user_type like '%"+user_type+"%'";
	}
	if(developer!=''){
		sql+=" and developer = '"+developer+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1="+code;
		orderBy=" order by unit_id,hr_id";
	}else if(orgLevel==3){
		sql+=" and UNIT_ID="+code;
		orderBy=" order by hr_id";
	}else{
		sql+=" and 1=2";
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
	var fs = "";
	for (var i = 0; i < field.length; i++) {
		if (fs.length > 0) {
			fs += ",";
		}
		fs += field[i];
	}
	return "SELECT "+fs+" FROM PMRT.TAB_MRT_TARGET_DEVEL_MON WHERE 1=1";
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var user_type=$.trim($("#user_type").val());
	var hr_id=$.trim($("#hr_id").val());
	var developer=$.trim($("#developer").val());
	var orderBy="";
	var sql=getSql();
//条件
	sql+=" and DEAL_DATE="+time;
	if(hr_id!=''){
		sql+=" and hr_id = '"+hr_id+"'";
	}
	if(user_type!=''){
		sql+=" and user_type like '%"+user_type+"%'";
	}
	if(developer!=''){
		sql+=" and developer = '"+developer+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,hr_id";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1="+code;
		orderBy=" order by unit_id,hr_id";
	}else if(orgLevel==3){
		sql+=" and UNIT_ID="+code;
		orderBy=" order by hr_id";
	}else{
		sql+=" and 1=2";
	}
	sql+=orderBy;
	showtext = '直销发展月报-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////