var nowData = [];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","SVR_OPERATOR_ID","ITEMCODE","ITEMDESC","ITEMVALUE","CRE","HR_CRE","UNIT_CRE"];
var title=[["地市名称","营服名称","HR编码","姓名","客服工位","指标编码","指标描述","指标值","原始积分","人员系数积分","区域调节积分"]];
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		//css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//人员姓名
	var name =$.trim($("#name").val());
	//指标描述
	var itemDesc =$.trim($("#itemDesc").val());

	//条件
	var sql = "SELECT DEAL_DATE,"+field.join(",")+" FROM PMRT.TB_MRT_SERVICE_JF_MON partition(p"+dealDate+") WHERE 1=1";
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID ='"+unitCode+"'";
	}
	if(name!=''){
		sql+=" AND NAME LIKE '%"+name+"%'";
	}
	if(itemDesc!=''){
		sql+=" AND ITEMDESC LIKE '%"+itemDesc+"%'";
	}
	var orgLevel=$("#orgLevel").val();
	var code =$("#code").val();
	var hrId=$("#hrId").val();
	//权限
    if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
	}else{
	  var hrIds=_jf_power(hrId,time);
	  if(hrIds!=""){
		   sql+=" and HR_ID in("+hrIds+") ";
	  }
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	//地市编码
	var regionCode =$("#regionCode").val();
	//营服中心编码
	var unitCode =$("#unitCode").val();
	//人员姓名
	var name =$.trim($("#name").val());
	//指标描述
	var itemDesc =$.trim($("#itemDesc").val());

	//条件
	var sql = "SELECT DEAL_DATE,"+field.join(",")+" FROM PMRT.TB_MRT_SERVICE_JF_MON partition(p"+dealDate+") WHERE 1=1";
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID ='"+unitCode+"'";
	}
	if(name!=''){
		sql+=" AND NAME LIKE '%"+name+"%'";
	}
	if(itemDesc!=''){
		sql+=" AND ITEMDESC LIKE '%"+itemDesc+"%'";
	}
	var orgLevel=$("#orgLevel").val();
	var code =$("#code").val();
	var hrId=$("#hrId").val();
	//权限
    if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
	}else{
	  var hrIds=_jf_power(hrId,time);
	  if(hrIds!=""){
		   sql+=" and HR_ID in("+hrIds+") ";
	  }
	}
    var title=[["账期","地市名称","营服名称","HR编码","姓名","客服工位","指标编码","指标描述","指标值","原始积分","人员系数积分","区域调节积分"]];
	showtext = '客服积分明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



/****************地市查询以及结果设置到页面选项框**********************/
function listRegions(){
	var sql="SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PMRT.TB_MRT_SERVICE_JF_MON T WHERE 1=1 AND T.GROUP_ID_1 IS NOT NULL";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1='"+code+"'";
	}else{
		sql+=" and T.UNIT_ID='"+code+"'";
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
	var sql = "SELECT DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PMRT.TB_MRT_SERVICE_JF_MON T WHERE 1=1 ";
	if(region!=''){
		sql+=" AND T.GROUP_ID_1='"+region+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		/**查询营服中心编码条件是有地市编码，***/
		if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
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
		alert("获取营服中心失败！");
	}
}