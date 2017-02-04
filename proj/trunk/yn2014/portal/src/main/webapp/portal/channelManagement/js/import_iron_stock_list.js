var nowData = [];
var title=[["账期","地市","营服中心","配置平台站址编码","业务确认单编号","站址编码","需求确认单编号","站址名称","详细地址","经度","纬度","铁塔种类","机房配置","共享信息","挂高","天线数量","系统数量","RRU是否上塔","当前铁塔共享客户总数","当前机房及配套存量新增共享客户总数","0-6点是否可上站","维护等级","后备电池时长（小时）","电力保障服务费模式","是否具备发电条件","是否选择发电服务","油机发电服务费模式","包干电费（元/年）（不含税）","油机发电服务费（元/年）（不含税）","超过10%高等级服务站址额外维护服务费（元/年）（不含税）","BBU安装在铁塔机房的服务费（元/年）（不含税）","蓄电池额外保障费（元/年）（不含税）","其他费用（元/年）（不含税）","其它费用说明","铁塔基准价格（元/年）（不含税）","机房及配套基准价格（元/年）（不含税）","维护费（元/年）（不含税）","产品单元数","电力引入费（元/年）（不含税）","场地费（元/年）（不含税）","维护费折扣","场地费折扣","电力引入费折扣","铁塔共享折扣","机房及配套享折扣","服务起始日期","服务结束日期","产品服务费合计（元/月）不含税","产品服务费合计（元/年）含税","维护费用原始录入值","场地费原始录入值","电力引入原始录入值","油机发电服务费原始录入值","其他费用原始录入值","铁塔共享折扣系数1","铁塔共享变化日期1","机房及配套共享折扣系数1","机房及配套共享折扣变化日期1","铁塔共享折扣系数2","铁塔共享变化日期2","机房及配套共享折扣系数2","机房及配套共享折扣变化日期2"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","P_ADDR_CODE","BUSI_CONF_CODE","IRON_ADDR_CODE","NEED_CONF_CODE","OWN_ADDR_NAME","DETAIL_ADDR","LONGITUDE","LATITUDE","IRON_TYPE","ROOM_CONF","SHARE_INFO","HIGHS","LINE_NUM","SYS_NUM","RRU_ISON","SHARE_CLI_NUM","STOCK_CLI_NUM","ZERO_SIX","SVR_LEVEL","CELL_LONG","OIL_ELECT_TYPE","ELECT_SVR_MODE","IS_ELECT_SVR","OIL_SVR_MODE","ELECT_FEE","OIL_SVR_FEE","TEN_PER_FEE","BBU_SVR_FEE","CELL_FEE","OTHER_FEE","OTHER_FEE_DEC","OIL_STAND_FEE","ROOM_STAND_FEE","SVR_FEE","PRODUCT_UNIT_NUM","ELECT_IN_FEE","PLACE_FEE","SVR_FEE_RATIO","PLACE_FEE_RATIO","ELECT_IN_RATIO","IRON_SHARE_RATIO","ROOM_FEE_RATIO","SVR_BEGIN_DATE","SVR_END_DATE","PRO_SVR_FEE_NO","PRO_SVR_FEE","SVR_SOURCE_VALUE","PLACE_SOURCE_VALUE","ELECT_IN_VALUE","OIL_SOURCE_VALUE","OTHER_SOURCE_VALUE","OIL_SHARE_QUO1","OIL_SHARE_DATE1","ROOM_SHARE_QUO1","ROOM_SHARE_DATE1","OIL_SHARE_QUO","OIL_SHARE_DATE","ROOM_SHARE_QUO","ROOM_SHARE_DATE"];
var report = null;

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
	var hallType=$("#hallType").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IRON_STOCK_MON WHERE DEAL_DATE='"+time+"' AND HALL_TYPE='"+hallType+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		if(regionCode!=""){
			sql+=" AND GROUP_ID_1='"+regionCode+"'";
		}
	}else{
		sql+=" AND GROUP_ID_1='"+code+"'";
	}
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
	 var hallType=$("#hallType").val();
	 if(hallType==1){
		 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_iron_stock.jsp";
	 }else if(hallType==2){
		 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_iron_stock1.jsp";
	 }else{
		 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_iron_stock2.jsp";
	 }
 }