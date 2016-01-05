var nowData = [];
var title=[["地市","营服中心","渠道名称","渠道编码"]
];
var field=["GROUP_ID_1_NAME","UNIT_NAME","GROUP_ID_4_NAME","HQ_CHAN_CODE"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[],
		rowParams : [],//第一个为rowId
		content : "content",
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
	
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var channelName=$("#channelName").val();
//条件
	var sql = "     SELECT  t.GROUP_ID_1_NAME,t.UNIT_NAME,t.GROUP_ID_4_NAME,t.HQ_CHAN_CODE FROM PCDE.TAB_CDE_CHANL_HQ_CODE t, "
    +" PCDE.TB_CDE_CHANL_HQ_CODE wg                                "
    +" WHERE t.HQ_CHAN_CODE=wg.HQ_CHAN_CODE                        "
    +" AND wg.CHN_CDE_2 in('2010000','1010000')                    "
    +" and wg.status<>12                                           ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(channelName!=''){
		sql+=" and t.GROUP_ID_4_NAME like '%"+channelName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"' ";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"' ";
	}else{
		sql+=" and 1=2 ";
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME  from PCDE.TAB_CDE_CHANL_HQ_CODE t where 1=1 ";
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"' ";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"' ";
	}else{
		sql+=" and 1=2 ";
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
	var sql = "select distinct t.UNIT_NAME  from PCDE.TAB_CDE_CHANL_HQ_CODE t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1='"+code+"' ";
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"' ";
		}else{
			sql+=" and 1=2 ";
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
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var channelName=$("#channelName").val();
//条件
	var sql = "     SELECT  t.GROUP_ID_1_NAME,t.UNIT_NAME,t.GROUP_ID_4_NAME,t.HQ_CHAN_CODE FROM PCDE.TAB_CDE_CHANL_HQ_CODE t, "
    +" PCDE.TB_CDE_CHANL_HQ_CODE wg                                "
    +" WHERE t.HQ_CHAN_CODE=wg.HQ_CHAN_CODE                        "
    +" AND wg.CHN_CDE_2 in('2010000','1010000')                    "
    +" and wg.status<>12                                           ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(channelName!=''){
		sql+=" and t.GROUP_ID_4_NAME like '%"+channelName+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"' ";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"' ";
	}else{
		sql+=" and 1=2 ";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
	
	showtext = '未定位渠道';
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////