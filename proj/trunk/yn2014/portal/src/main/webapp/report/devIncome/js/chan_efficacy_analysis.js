var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","UNIT_NAME","START_DATE","STATUS","CHN_CDE_1_NAME","PROFIT","PROFIT_RATIO","COST_INCOME_RATIO","DSDBCOST_RATIO","INCOME","DSDB_INCOME","SLL_COUNT","COST_ALL","COMM_XJ","SALES_COMM","CALLS_COMM","DSDB_COMM","REWARD_COMM","JMWB_FEE","QDBT_FEE","ZDBT_FEE","RENT_FEE","JRCB_FEE","KCB_FEE","DEV_NUM"];
var title=[["账期","地市名称","渠道编码","渠道名称","营服中心","开始合作日期","渠道状态","一级属性","毛利(收入-成本)","毛利率(毛利/收入)(%)","成本占收比(%)","代收代办服务费占代收金额比(%)","出账收入(减赠费、退费)(%)","代收费金额","业务受理量(笔)(不含销售和收费)","成本合计","佣金小计(不含紧密型)","销售佣金","话费分成","代收代办服务费(含一卡充)","奖励佣金","紧密型费用","渠道补贴","终端补贴","房租费","客户接入成本","卡成本","发展用户数"]];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[/*{gt:3,css:LchReport.RIGHT_ALIGN},{array:[6,9,10,13,14,18],css:LchReport.NORMAL_STYLE}*/],
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
	
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	var sql=getSql();
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
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
	var startDate=$("#startDate").val();
	var endDate = $("#endDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode  = $("#unitCode").val();
	var chanlCode =$.trim($("#chanlCode").val());
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var sql =" SELECT T.DEAL_DATE,                       							"+	//--账期
			"        T.GROUP_ID_1_NAME,                   							"+	//--地市名称
			"        T.HQ_CHAN_CODE,                      							"+	//--渠道编码
			"        T.GROUP_ID_4_NAME,                   							"+	//--渠道名称
			"        T.UNIT_NAME,                         							"+	//--营服中心
			"        T.START_DATE,                        							"+	//--开始合作日期
			"        T.STATUS,                            							"+	//--渠道状态
			"        T.CHN_CDE_1_NAME,                    							"+	//--一级属性
			"        T.PROFIT,                            							"+	//--毛利(收入-成本)
			"        NVL(T.PROFIT_RATIO,0)*100||'%' AS PROFIT_RATIO,                "+  //--毛利率(毛利/收入)(%)
			"        NVL(T.COST_INCOME_RATIO,0)*100||'%' AS COST_INCOME_RATIO,      "+  //--成本占收比(%)
			"        NVL(T.DSDBCOST_RATIO,0)*100||'%' AS DSDBCOST_RATIO ,           "+  //--代收代办服务费占代收金额比(%)
			"        NVL(T.INCOME,0) AS   INCOME             ,        				"+	//--出账收入(减赠费、退费)(%)
			"        NVL(T.DSDB_INCOME,0) AS DSDB_INCOME     ,                		"+	//--代收费金额
			"        NVL(T.SLL_COUNT,0) AS  SLL_COUNT        ,              		"+	//--业务受理量(笔)(不含销售和收费)
			"        NVL(T.COST_ALL,0) AS COST_ALL           ,             			"+	//--成本合计
			"        NVL(T.COMM_XJ,0) AS  COMM_XJ            ,            			"+	//--佣金小计(不含紧密型)
			"        NVL(T.SALES_COMM,0) AS SALES_COMM       ,               		"+	//--销售佣金
			"        NVL(T.CALLS_COMM,0) AS CALLS_COMM       ,               		"+	//--话费分成
			"        NVL(T.DSDB_COMM,0) AS DSDB_COMM         ,              		"+	//--代收代办服务费(含一卡充)
			"        NVL(T.REWARD_COMM,0) AS REWARD_COMM     ,                		"+	//--奖励佣金
			"        NVL(T.JMWB_FEE,0) AS JMWB_FEE           ,             			"+	//--紧密型费用
			"        NVL(T.QDBT_FEE,0) AS QDBT_FEE           ,             			"+	//--渠道补贴
			"        NVL(T.ZDBT_FEE,0) AS ZDBT_FEE           ,            			"+	//--终端补贴
			"        NVL(T.RENT_FEE,0) AS RENT_FEE           ,            			"+	//--房租费
			"        NVL(T.JRCB_FEE,0) AS JRCB_FEE           ,             			"+	//--客户接入成本
			"        NVL(T.KCB_FEE, 0) AS KCB_FEE            ,             			"+	//--卡成本
			"        NVL(T.DEV_NUM, 0) AS DEV_NUM                        			"+	//--发展用户数
			"   FROM PMRT.TB_MRT_UNIT_CHL_ANALYSIS T                                "+
			"  WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";

	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" AND T.HQ_CHAN_CODE ='"+code+"'";
	}else{
		sql+=" AND 1=2 ";
	}
	
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(chanlCode!=''){
		sql+=" AND T.HQ_CHAN_CODE ='"+chanlCode+"'";
	}
	
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate = $("#endDate").val();
	var sql=getSql()+" ORDER BY GROUP_ID_1,UNIT_ID";

	showtext = '渠道效能分析明细表-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
