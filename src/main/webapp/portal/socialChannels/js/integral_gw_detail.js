var nowData = [];
var field=["GROUP_ID_1_NAME","SUBSCRIPTION_ID","SERVICE_NUM","USERNAME","USERADD","USER_ADDR","USERTEL","PRODUCT_NAME","INNET_DATE","LW_TYPE","EXCH_NAME","INPUT_TYPE","KD_SL","GROUP_ID_4_NAME"];
var title=[["渠道分等分级**年**月宽带新增用户明细","","","","","","","","","","","","",""],
           ["分公司","用户标识","宽带账号","用户名","客户地址","装机地址","联系电话","套餐","入网时间","状态","局站","接入方式","宽带速率","代理商"]];
var downSql="";
var dealDate="";
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		//css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],
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
	
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionName").val();
	var unitId=$("#unitName").val();
	var userName=$.trim($("#userName").val());
	sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_INTEGRAL_GW_DETAIL T WHERE 1=1";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else {
		var hrIds=_jf_power(hrId,dealDate);
	    if(hrIds&&hrIds!=""){
		   sql+=" and T.HR_ID in("+hrIds+") ";
		}else{
		   sql+=" and 1=2 ";	 
		}
	}    
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitId!=''){
		sql+=" AND T.UNIT_ID = '"+unitId+"'";
	}
	if(userName!=''){
		sql+=" AND T.USERNAME LIKE '%"+userName+"%'";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID,T.HR_ID";
	downSql=sql;
	var cdata = query("select count(*) total from (" + sql+")");
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
	var dealDate=$("#dealDate").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1,t.GROUP_ID_1_NAME from PMRT.TAB_MRT_INTEGRAL_GW_DETAIL t WHERE 1=1";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	//排序
	sql += " ORDER BY GROUP_ID_1";
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
function listUnits(regionCode){
	var $unit=$("#unitName");
	var sql = "select distinct t.UNIT_ID,t.UNIT_NAME from PMRT.TAB_MRT_INTEGRAL_GW_DETAIL t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1='"+regionCode+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1='"+code+"'";
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

function downsAll(){
	showtext = '宽带渠道分等分级新增-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
