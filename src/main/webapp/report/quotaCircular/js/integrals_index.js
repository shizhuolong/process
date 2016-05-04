var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","UNIT_TYPE","COUNT_HQ","COUNT_JFHR","COUNT_CLERK","AVG_SR","AVG_HQ_PER","AVG_SR_PER","SR_SINGLE_HQ","AVG_CRE","AVG_SCRE","CRE_SINGLE_HQ","SCRE_SINGLE_HQ","TOTAL_CRE","TOTAL_SCRE"];
var title=[["账期","地市名称","营服名称","营服类型","渠道个数","有积分人员数量（不含营服负责人）","营业员","月均出账收入（万元）","人均渠道数量（不含营业员）","人均月出账收入（万元/人）","单渠道收入（万元/月）","当月人均原始积分","当月人均计薪积分","当月单渠道原始积分","当月单渠道计薪积分","本月原始积分","本月计薪积分"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
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
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var region=$("#region").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate;
	//权限
	var orgLevel=$("#orgLevel").val();
	//地市编码
	var regionCode=$("#regionCode").val();
	//营服中心编码
	var unitCode=$("#unitCode").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 = "+code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 = '"+region +"' AND T.UNIT_ID ='"+code+"'";
	}else{
		sql+=" AND 1=2";
	}
	
	if(regionCode!=""){
		sql+=" AND T.GROUP_ID_1 ='"+ regionCode+"'";
	}
	if(unitCode!=""){
		sql+=" AND T.UNIT_ID ='"+ unitCode+"'";
	}
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	var s="SELECT T.DEAL_DATE,                       "+
			"       T.GROUP_ID_1_NAME,                 "+
			"       T.UNIT_NAME,                       "+
			"       T.UNIT_TYPE,                       "+
			"       T.COUNT_HQ,                        "+
			"       T.COUNT_JFHR,                      "+
			"       T.COUNT_CLERK,                     "+
			"       T.AVG_SR,                          "+
			"       T.AVG_HQ_PER,                      "+
			"       T.AVG_SR_PER,                      "+
			"       T.SR_SINGLE_HQ,                    "+
			"       T.AVG_CRE,                         "+
			"       T.AVG_SCRE,                        "+
			"       T.CRE_SINGLE_HQ,                   "+
			"       T.SCRE_SINGLE_HQ,                  "+
			"       T.TOTAL_CRE,                       "+
			"       T.TOTAL_SCRE                       "+
			"  FROM PMRT.TB_MRT_JF_ZB_COUNT_INTEGRAL T ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var region=$("#region").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate;
	//权限
	var orgLevel=$("#orgLevel").val();
	//地市编码
	var regionCode=$("#regionCode").val();
	//营服中心编码
	var unitCode=$("#unitCode").val();
	if(orgLevel==1){

	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 = "+code;
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_1 = '"+region +"' AND T.UNIT_ID ='"+code+"'";
	}else{
		sql+=" AND 1=2";
	}
	
	if(regionCode!=""){
		sql+=" AND T.GROUP_ID_1 ='"+ regionCode+"'";
	}
	if(unitCode!=""){
		sql+=" AND T.UNIT_ID ='"+ unitCode+"'";
	}
	showtext = '积分指标-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql=" SELECT DISTINCT(T.GROUP_ID_1),T.GROUP_ID_1_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_INTEGRAL T WHERE T.GROUP_ID_1 IS NOT NULL ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var region =$("#region").val();
	if(orgLevel==1){
		sql+="";
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.GROUP_ID_1 ='"+region+"'";
	}else{
		sql+=" and T.GROUP_ID_1='"+region+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

/************查询营服中心***************/
function listUnits(region){
	var $unit=$("#unitCode");
	var sql = "SELECT DISTINCT(T.UNIT_ID),T.UNIT_NAME FROM  PMRT.TB_MRT_JF_ZB_COUNT_INTEGRAL T WHERE T.UNIT_ID IS NOT NULL ";
	if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else if(orgLevel==4){
			sql+=" AND 1=2";
		}else{
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	
	sql+=" ORDER BY T.UNIT_ID"
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}
