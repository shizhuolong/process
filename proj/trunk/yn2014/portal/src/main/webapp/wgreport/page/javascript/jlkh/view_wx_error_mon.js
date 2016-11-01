var nowData = [];
var title=[["账期","地市编码","地市名称","营服编码","营服名称","用户编号","用户号码","受理时间","指标编码","指标描述","指标值","渠道编码","操作员","产品id","原始积分","区域调节后积分"]];
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","USER_NO","DEVICE_NUMBER","ACCT_DATE","ITEMCODE","ITEMDESC","ITEMVALUE","HQ_CHAN_CODE","OPERATOR_ID","PRODUCT_ID","CRE","UNIT_CRE"];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:13,css:LchReport.RIGHT_ALIGN}],
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
	var regionCode=$.trim($("#regionCode").val());
	var unitCode=$.trim($("#unitCode").val());
	var device_number=$.trim($("#device_number").val());
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.VIEW_WX_ERROR_MON WHERE DEAL_DATE='"+time+"'";
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(device_number!=''){
		sql+=" AND DEVICE_NUMBER LIKE '%"+device_number+"%'";
	}
//权限
	
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" and HQ_CHAN_CODE ='"+code+"'";
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
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	sql += orderBy;
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
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$.trim($("#time").val());
	var regionCode=$.trim($("#regionCode").val());
	var unitCode=$.trim($("#unitCode").val());
	var device_number=$.trim($("#device_number").val());
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.VIEW_WX_ERROR_MON WHERE DEAL_DATE='"+time+"'";
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(device_number!=''){
		sql+=" AND DEVICE_NUMBER LIKE '%"+device_number+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" and HQ_CHAN_CODE ='"+code+"'";
	}
	sql+=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	showtext = '未归集到人员维系积分-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////