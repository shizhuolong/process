var nowData = [];
var title=[["账期","地市","地市名称","基层单元编码","基层单元名称","hr编码","姓名","角色类型","用户编号","用户号码","类型","月累计收入","上年12月收入","上级hr编码","归属上级姓名","责任人编码","责任人"]];
var field=["账期","地市","地市名称","基层单元编码","基层单元名称","hr编码","姓名","角色类型","用户编号","用户号码","类型","月累计收入","上年12月收入","上级hr编码","归属上级姓名","责任人编码","责任人"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:10,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	
	var time=$.trim($("#time").val());
	var regionName=$.trim($("#regionName").val());
	var unitName=$.trim($("#unitName").val());
	var userName=$.trim($("#userName").val());
	var userCode=$.trim($("#userCode").val());
	var userPhone=$.trim($("#userPhone").val());
	var hrId=$.trim($("#hrId").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = "SELECT T.账期        ,"+
				"T.地市        ,"+
				"T.地市名称    ,"+
				"T.基层单元编码,"+
				"T.基层单元名称,"+
				"T.hr编码      ,"+
				"T.姓名        ,"+
				"T.角色类型    ,"+
				"T.用户编号    ,"+
				"T.用户号码    ,"+
				"T.类型        ,"+
				"T.月累计收入 ,"+
				"T.上年12月收入,"+
				"T.上级hr编码  ,"+
				"T.归属上级姓名,"+
				"T.责任人编码  ,"+
				"T.责任人     FROM PMRT.VIEW_MRT_KPI_INCOME_ALL_MON  T WHERE T.账期 = '"+time+"'";

	if(regionName!=''){
		sql+=" AND T.地市名称 like '%"+regionName+"%'";
	}
	if(unitName!=''){
		sql+=" AND T.基层单元名称 like '%"+unitName+"%'";
	}
	if(userName!=''){
		sql+=" AND (T.姓名 LIKE '%"+userName+"%' OR  T.归属上级姓名 LIKE '%"+userName+"%' OR T.责任人 LIKE '%"+userName+"%')";
	}
	if(userPhone!=''){
		sql+=" AND T.用户号码 like '%"+userPhone+"%'";
	}
//权限
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.地市 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.基层单元编码 ='"+code+"'";
	}else{
		sql+=" AND T.用户编号 ='"+hrId+"'";
	}
	
	var csql = sql;
	/*old*/
	/*var cdata = query("select count(*) total " + csql);*/
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy="ORDER BY T.地市,T.基层单元编码,T.hr编码";
	if (orderBy != '') {
		sql += orderBy;
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
//function roundN(number,fractionDigits){   
//    with(Math){   
//        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
//    }   
//}   


function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct T.地市名称  GROUP_ID_1_NAME  from PMRT.VIEW_MRT_KPI_INCOME_ALL_MON t where 1=1 and T.地市名称 is not null ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	/*var hrId=$("#hrId").val();*/
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.地市 ="+code;
	}else if(orgLevel==3){
		sql+=" and T.基层单元编码 ='"+code+"'";
	}else{
		sql+=" and T.hr编码 ='"+hrId+"'";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
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
	var $unit=$("#unitName");
	var time=$("#time").val();
	var sql = "select distinct t.基层单元名称  UNIT_NAME from PMRT.VIEW_MRT_KPI_INCOME_ALL_MON t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.地市名称 ='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.地市 ="+code;
		}else if(orgLevel==3){
			sql+=" and t.基层单元编码='"+code+"'";
		}else{
			sql+=" and t.hr编码='"+hrId+"'";
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
		alert("获取基层单元信息失败");
	}
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var sql ="SELECT T.账期        ,"+
					"T.地市        ,"+
					"T.地市名称    ,"+
					"T.基层单元编码,"+
					"T.基层单元名称,"+
					"T.hr编码      ,"+
					"T.姓名        ,"+
					"T.角色类型    ,"+
					"T.用户编号    ,"+
					"T.用户号码    ,"+
					"T.类型        ,"+
					"T.月累计收入 ,"+
					"T.上年12月收入,"+
					"T.上级hr编码  ,"+
					"T.归属上级姓名,"+
					"T.责任人编码  ,"+
					"T.责任人     FROM PMRT.VIEW_MRT_KPI_INCOME_ALL_MON  T WHERE T.账期 = '"+time+"'";

	var time=$.trim($("#time").val());
	var regionName=$.trim($("#regionName").val());
	var unitName=$.trim($("#unitName").val());
	var userName=$.trim($("#userName").val());
	var userCode=$.trim($("#userCode").val());
	var userPhone=$.trim($("#userPhone").val());
	var hrId=$.trim($("#hrId").val());
	var regionCode=$.trim($("#regionCode").val());
	//条件
	/*if(time!=''){
		sql+=" AND DEAL_DATE='"+time+"' ";
	}*/
	if(regionName!=''){
		sql+=" AND T.地市名称 like '%"+regionName+"%'";
	}
	if(unitName!=''){
		sql+=" AND T.基层单元名称 like '%"+unitName+"%'";
	}
	if(userName!=''){
		sql+=" AND (T.姓名 LIKE '%"+userName+"%' OR  T.归属上级姓名 LIKE '%"+userName+"%' OR T.责任人 LIKE '%"+userName+"%')";
	}
	if(userPhone!=''){
		sql+=" AND T.用户号码 like '%"+userPhone+"%'";
	}
	
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var regionCode=$.trim($("#regionCode").val());
	if(orgLevel==1){
		
		}else if(orgLevel==2){
			sql+=" and T.地市 ='"+code+"'";
		}else if(orgLevel==3){
			sql+=" and T.基层单元编码 ='"+code+"'";
		}else{
			sql+=" AND T.用户编号 ='"+hrId+"'";
		}
	
	orderBy="ORDER BY T.地市,T.基层单元编码,T.hr编码";
	//var title=[["账期","地市","地市名称","基层单元编码","基层单元名称","hr编码","姓名","角色类型","用户编号","用户号码","类型","收入","上级hr编码","归属上级姓名","责任人编码","责任人"]];
	showtext = 'KPI月累计存量输入-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////