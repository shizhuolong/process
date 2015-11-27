var nowData = [];
var title=[["账期","地市名称","营服名称","HR编码","姓名","角色","发展得分","收入得分","欠费得分","存量得分","毛利得分","自设得分","总得分","全省排名","地市排名","营服排名"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_ROLE","DEV_SCORE","IN_SCORE","OWE_SCORE","STOCK_SCORE","ML_SCORE","CUSTOM_SCORE","ALL_SCORE","KPI_RANK","GROUP_RANK","UNIT_RANK"];
var orderBy = ' ORDER BY T.KPI_RANK,T.GROUP_RANK,T.UNIT_RANK ASC';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			if(index==8){
				orderBy = " order by PER_CENT1 " + type + " ";
			}else{
				orderBy = " order by " + field[index] + " " + type + " ";
			}
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
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	
	var sql ="SELECT " +
				"T.DEAL_DATE       ,"+
				"T.GROUP_ID_1      ,"+
				"T.GROUP_ID_1_NAME ,"+
				"T.UNIT_ID         ,"+
				"T.UNIT_NAME       ,"+
				"T.HR_ID           ,"+
				"T.NAME            ,"+
				"T.USER_ROLE       ,"+
				"T.DEV_SCORE       ,"+
				"T.IN_SCORE        ,"+
				"T.OWE_SCORE       ,"+
				"T.STOCK_SCORE     ,"+
				"T.ML_SCORE        ,"+
				"T.CUSTOM_SCORE    ,"+
				"T.ALL_SCORE       ,"+
				"T.KPI_RANK        ,"+
				"T.GROUP_RANK      ,"+
				"T.UNIT_RANK       "+
			"FROM  PMRT.TB_MRT_JCDY_KPI_RANK_MON T WHERE 1=1 ";

//条件
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
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
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
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


	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
function listRegions(){
	var sql="";
	
	//条件
	var sql = " SELECT DISTINCT T.GROUP_ID_1_NAME GROUP_ID_1_NAME FROM PMRT.TB_MRT_JCDY_KPI_RANK_MON T WHERE 1=1 AND T.GROUP_ID_1_NAME IS NOT NULL ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else{
		sql+=" AND T.HR_ID='"+hrId+"'";
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
	var sql = "SELECT DISTINCT T.UNIT_NAME UNIT_NAME FROM PMRT.TB_MRT_JCDY_KPI_RANK_MON T WHERE 1=1 AND T.UNIT_NAME IS NOT NULL ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		
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
		alert("获取营服中心信息失败");
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
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	
	
	var sql ="SELECT " +
			"T.DEAL_DATE       ,"+
			"T.GROUP_ID_1_NAME ,"+
			"T.UNIT_NAME       ,"+
			"T.HR_ID           ,"+
			"T.NAME            ,"+
			"T.USER_ROLE       ,"+
			"T.DEV_SCORE       ,"+
			"T.IN_SCORE        ,"+
			"T.OWE_SCORE       ,"+
			"T.STOCK_SCORE     ,"+
			"T.ML_SCORE        ,"+
			"T.CUSTOM_SCORE    ,"+
			"T.ALL_SCORE       ,"+
			"T.KPI_RANK        ,"+
			"T.GROUP_RANK      ,"+
			"T.UNIT_RANK       "+
		"FROM  PMRT.TB_MRT_JCDY_KPI_RANK_MON T WHERE 1 = 1 ";
//条件
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
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
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	var showtext = 'kpi得分排名';
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////