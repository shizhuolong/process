var nowData = [];
var title=[["塔类","账期月份","是否入库","产品业务确认单编号","运营商","运营商地市","区县","配置平台站址编码","需求承接地市","站址所属地市","站址名称","站址编码","需求确认单编号","业务属性","服务起始日期","业务场景","风压","产品类型","机房类型","用电服务费（包干）","油机发电模式","油机发电服务费（包干和非包干）","超过10%高等级服务站址额外维护服务费","蓄电池额外保障费","产品单元数1","对应实际最高天线挂高（米）1","RRU拉远时BBU是否放在铁塔公司机房1","其他折扣1","对应铁塔基准价格1","产品单元数2","实际最高天线挂高（米）2","RRU拉远时BBU是否放在铁塔公司机房2","其他折扣2","对应铁塔基准价格2","产品单元数3","实际最高天线挂高（米）3","RRU拉远时BBU是否放在铁塔公司机房3","其他折扣3","对应铁塔基准价格3","期末铁塔共享用户数","铁塔共享运营商1的起租日期","铁塔共享运营商1起租后的共享折扣","铁塔共享运营商2的起租日期","铁塔共享运营商2起租后的共享折扣","期末铁塔共享后基准价格1+2+3","对应机房基准价格1","对应机房基准价格2","对应机房基准价格3","期末机房共享用户数","机房共享运营商1的起租日期","机房共享运营商1起租后的共享折扣","机房共享运营商2的起租日期","机房共享运营商2起租后的共享折扣","期末机房共享后基准价格1+2+3","对应配套基准价格1","对应配套基准价格2","对应配套基准价格3","配套共享用户数","配套共享运营商1的起租日期","配套共享运营商1起租后的共享折扣","配套共享运营商2的起租日期","配套共享运营商2起租后的共享折扣","配套共享后基准价格1+2+3","bbu安装在铁塔机房费","对应维护费1","对应维护费2","对应维护费3","维护费共享用户数","维护费共享运营商1的起租日期","维护费共享运营商1起租后的共享折扣","维护费共享运营商2的起租日期","维护费共享运营商2起租后的共享折扣","维护费折扣后金额1+2+3","场地费","场地费共享用户数","场地费共享运营商1的起租日期","场地费共享运营商1起租后的共享折扣","场地费共享运营商2的起租日期","场地费共享运营商2起租后的共享折扣","场地费折扣后金额","电力引入费","电力引入费共享用户数","电力引入费共享运营商1的起租日期","电力引入费共享运营商1起租后的共享折扣","电力引入费共享运营商2的起租日期","电力引入费共享运营商2起租后的共享折扣","电力引入费折扣后金额","WLAN费用","微波费用","其他费用1","产品服务费月费用合计（不含税）","产品服务费月费用合计（含税）","确认状态（调整、争议）","调整费项","费项的调整金额（正负表示）（不含税）","费项的调整后金额（不含税）","费项调整原因","费项的争议金额（不含税）"]];
var field=["IRON_TYPE","DEAL_DATE","IS_IN_UNIT","BUSI_CONF_CODE","CARRIEROPERATOR","GROUP_ID_1_NAME","UNIT_NAME","P_ADDR_CODE","ACC_CITY","ADDR_REGION","IRON_ADDR_NAME","IRON_ADDR_CODE","CONF_CODE","BUSI_TYPE","SVR_BEGIN_TIME","BUSI_SCENE","WIND_PRESS","PRODUCT_TYPE","ROOM_TYPE","ELECT_Y_FEE","OIL_ELECT_TYPE","OIL_ELECT_Y_FEE","TEN_PER_FEE","CELL_FEE","PRODUCT_UNIT_NUM1","FACT_HIGH","RRU_BBU1","OTHER_SHARE1","IRON_STAND_FEE1","PRODUCT_UNIT_NUM2","HIGHS","RRU_BBU2","OTHER_SHARE2","IRON_STAND_FEE2","PRODUCT_UNIT_NUM3","FACT_HIGH3","RRU_BBU3","OTHER_SHARE3","IRON_STAND_FEE3","IRON_END_NUMS","IRON_BEGIN_DATE1","IRON_SHARE_RATIO1","IRON_BEGIN_DATE2","IRON_SHARE_RATIO2","IRON_STAND_FEE123","ROOM_STAND_FEE1","ROOM_STAND_FEE2","ROOM_STAND_FEE3","ROOM_END_NUMS","ROOM_BEGIN_DATE1","ROOM_SHARE_RATIO1","ROOM_BEGIN_DATE2","ROOM_SHARE_RATIO2","ROOM_STAND_FEE123","STAND_PRICE1","STAND_PRICE2","STAND_PRICE3","IRON_STORE_NUM","SHARE_BEGIN_DATE1","SHARE_BEGIN_RATIO1","SHARE_BEGIN_DATE2","SHARE_BEGIN_RATIO2","PT_STAND_FEE123","BBU_FEE","SVR_FEE1","SVR_FEE2","SVR_FEE3","WH_SHARE_NUMS","WH_SHERE_BEGIN_DATE1","WH_SHERE_BEGIN_RATIO1","WH_SHERE_BEGIN_DATE2","WH_SHERE_BEGIN_RATIO2","WH_RATIO_MONEY123","PLACE_FEE","PLACE_SHARE_NUM","PLACE_BEGIN_DATE1","PLACE_BEGIN_RATIO1","PLACE_BEGIN_DATE2","PLACE_BEGIN_RATIO2","PLACE_RATIO_MONEY","ELECT_IN_FEE","ELECT_IN_NUM","ELECT_IN_DATE1","ELECT_IN_RATIO1","ELECT_IN_DATE2","ELECT_IN_RATIO2","ELECT_IN_RATIO_MONEY","WLAN_FEE","WBO_FEE","OTHER_FEE1","PRODUCT_FEE_SUM","PRODUCT_FEE_MON_SUM","CONF_STATE","CHANGE_FEE","FEE_ITEM_CHANGE_ZF","FEE_ITEM_CHANGE","FEE_ITEM_CHANGE_RESON","FEE_ITEM_ZY_MONEY"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID,BUSI_CONF_CODE";
var report = null;
var downSql="";
$(function() {
	var maxDate=getMaxDate("PMRT.TAB_MRT_IRON_ABILITY_MON");
	$("#time").val(maxDate);
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		$("#reppeatBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
		css:[
		      {array:[2],css:LchReport.NORMAL_STYLE}
		    ],
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

function toRules(){
	var url = $("#ctx").val()+"/report/devIncome/jsp/rules.jsp?type=5";
	window.parent.openWindow("取数规则",null,url);
}

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
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var iron_type=$("#iron_type").val();
	var is_in_unit=$("#is_in_unit").val();
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_IRON_ABILITY_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID = '"+unitCode+"'";
	}
	if(iron_type!=''){
		sql+=" AND IRON_TYPE='"+iron_type+"'";
	}
	if(is_in_unit!=''){
		sql+=" AND IS_IN_UNIT='"+is_in_unit+"'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	sql += orderBy;
	downSql=sql;
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var time=$("#time").val();
	var showtext = '铁塔含室分报表-'+time;
	downloadExcel(downSql,title,showtext);
}

function repeatImport(){
	 window.location.href=$("#ctx").val()+"/report/devIncome/jsp/import_iron_ability_mon.jsp";
}
