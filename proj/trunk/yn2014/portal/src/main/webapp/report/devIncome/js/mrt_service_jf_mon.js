var nowData = [];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","SVR_OPERATOR_ID","ITEMCODE","ITEMDESC","ITEMVALUE","CRE","HR_CRE","UNIT_CRE"];
var title=[["地市名称","营服名称","HR编码","姓名","客服工位","指标编码","指标描述","指标值","原始积分","人员系数积分","区域调节积分"]];
var report = null;
$(function() {
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
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TB_MRT_SERVICE_JF_MON partition(p"+dealDate+") WHERE 1=1";
	
	//选项框条件
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+ regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
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
	sql+=" ORDER BY GROUP_ID_1,UNIT_ID ";
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
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
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
    sql+=" ORDER BY GROUP_ID_1,UNIT_ID ";
    var title=[["账期","地市名称","营服名称","HR编码","姓名","客服工位","指标编码","指标描述","指标值","原始积分","人员系数积分","区域调节积分"]];
	showtext = '客服积分明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////