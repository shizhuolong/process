var nowData = [];
var title=[["账期","地市","营服中心","配置平台站址编码","业务确认单编号","站点编码","需求确认单编号","站址名称","站点名称","经度","纬度","产品种类","产品场景","建筑面积/隧道长度（平方米/公里）","系统数量","当前共享客户总数","后备电池时长（小时）","电力保障服务费模式","包干电费（元/月）不含税","其他费用（元/月）不含税","其它费用说明","基准价格（元/月）不含税","维护费（元/月）不含税","产品单元数","场地费（元/月）不含税","共享折扣","服务起始日期","服务结束日期","产品服务费合计（元/月）不含税","产品服务费合计（元/年）含税"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","P_ADDR_CODE","BUSI_CONF_CODE","IRON_ADDR_CODE","NEED_CONF_CODE","OWN_ADDR_NAME","ADDR_NOTE_NAME","LONGITUDE","LATITUDE","PRODUCT_TYPE","PRODUCT_SCENE","BUILD_AREA","SYS_NUM","SHARE_CLI_NUM","CELL_LONG","OIL_ELECT_TYPE","ELECT_FEE","OTHER_FEE","OTHER_FEE_DEC","OIL_STAND_FEE","SVR_FEE","PRODUCT_UNIT_NUM","PLACE_FEE","SHARE_RATIO","SVR_BEGIN_DATE","SVR_END_DATE","PRO_SVR_FEE_NO","PRO_SVR_FEE"];
var report = null;
var downSql="";

$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		$("#reppeatBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
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
	var code=$("#code").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IRON_PRO_MON WHERE DEAL_DATE='"+time+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		if(regionCode!=""){
			sql+=" AND GROUP_ID_1='"+regionCode+"'";
		}
	}else{
		sql+=" AND GROUP_ID_1='"+code+"'";
	}
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
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

function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_iron_pro.jsp";
}

function exportData(){
	var time=$("#time").val();
	var showtext = '铁塔起租室分产品-'+time;
	downloadExcel(downSql,title,showtext);
}