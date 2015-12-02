var field=["DEAL_DATE",
           "GROUP_ID_1_NAME",
           "HALL_ID",
           "HALL_NAME",
           "HR_ID",
           "NAME",
           "FIXED_SALARY",
           "BASE_SALARY",
           "JF_SALARY",
           "SPECIAL_AWARD",
           "ALL_SALARY",
           "MONTH_RATE",
           "YEAR_RATE"];
var title=[["账期",
            "地市名称",
            "营业厅编码",
            "营业厅名称",
            "HR编码",
            "姓名",
            "营业厅人员薪酬（元）",
            "",
            "",
            "",
            "",
            "环比",
            ""  ],
           ["",
            "",
            "",
            "",
            "",
            "",
            "固定薪酬",
            "KPI绩效",
            "积分提成",
            "专项奖励",
            "合计",
            "月环比",
            "年累计环比"  ]];
var nowData = [];
var orderBy = ' order by GROUP_ID_1_NAME,HALL_NAME,NAME,ALL_SALARY ';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},
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
	var regionName=$("#regionName").val();
	var hallName=$("#hallName").val();
	var userName=$("#userName").val();
//条件
	var sql = " from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(hallName!=''){
		sql+=" and t.HALL_NAME = '"+hallName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select * " + sql;

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
function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME AREA_NAME from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].AREA_NAME
					+ '" selected >'
					+ d[0].AREA_NAME + '</option>';
			listUnits(d[0].AREA_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].AREA_NAME + '">' + d[i].AREA_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#hallName");
	var time=$("#time").val();
	var sql = "select distinct t.HALL_NAME UNIT_NAME from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else{
			 var hrIds=_jf_power(hrId,time);
			 if(hrIds&&hrIds!=""){
			   sql+=" and t.HR_ID in("+hrIds+") ";
			 }else{
			   sql+=" and 1=2 ";	 
			 }
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_NAME
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取营业厅信息失败");
	}
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var hallName=$("#hallName").val();
	var userName=$("#userName").val();
	//条件
	var sql = " from PMRT.TB_MRT_YYT_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(hallName!=''){
		sql+=" and t.HALL_NAME = '"+hallName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select "+field.join(",")+ sql;
	showtext = '营业厅人员薪酬-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////