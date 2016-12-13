var nowData = [];
var field=["GROUP_ID_1_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","UNIT_NAME","START_DATE","STATUS","CHN_CDE_1_NAME","PROFIT","PROFIT_RATIO","COST_INCOME_RATIO","DSDBCOST_RATIO","INCOME1","DSDB_INCOME","SLL_COUNT","COST_ALL","COMM_XJ","SALES_COMM","CALLS_COMM","DSDB_COMM","REWARD_COMM","OTHER_COMM","JMWB_FEE","QDBT_FEE","ZDBT_FEE","RENT_FEE","JRCB_FEE","KCB_FEE","DEV_NUM","INCOME","SR_2G","SR_3G","SR_4G","SR_ZX","SR_KD","SR_GH","SR_QT","TRADE_ALL","TRADE_2G","TRADE_3G","TRADE_4G","TRADE_ZX","TRADE_KD","TRADE_GH","TRADE_PAY","TRADE_QT","RATE_ALL","RATE_2G","RATE_3G","RATE_4G","RATE_ZX","RATE_KD","RATE_GH"];
var title=[["地市名称","渠道编码","渠道名称","营服中心","开始合作日期","渠道状态","一级属性","毛利(收入-成本)","毛利率(毛利/收入)(%)","成本占收比(%)","代收代办服务费占代收金额比(%)","出账收入(减赠费、退费)","代收费金额","业务受理量(笔)(不含销售和收费)","成本合计","分科目佣金","","","","","","紧密型费用","渠道补贴","终端补贴","房租费","客户接入成本","卡成本","发展用户数","其中：收入明细","","","","","","","","其中：佣金明细(当期应付)","","","","","","","","","佣金占收比","","","","","",""],
           ["","","","","","","","","","","","","","","","佣金小计(不含紧密型)","销售佣金","话费分成","代收代办服务费(含一卡充)","奖励佣金","其他佣金","","","","","","","","收入合计","2G收入","3G收入","4G收入","专线收入","宽带收入","固话收入","其他收入","分专业佣金合计","2G佣金","3G佣金","4G佣金","专线佣金","宽带佣金","固话佣金","缴费服务佣金","其他","总佣金占收比(%)","2G佣金占收比(%)","3G佣金占收比(%)","4G佣金占收比(%)","专线佣金占收比(%)","宽带佣金占收比(%)","固话佣金占收比(%)"],
           ["","","","","","","","","","","","","","","成本合计=佣金小计+渠道补贴+终端补贴+<br/>房租+客户接入成本+卡成本","佣金小计=销售佣金+话费分成+<br/>代收代办服务费+奖励佣金+其他佣金","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","总佣金占收比=佣金合计/收入合计","2G占收比=2G佣金明细/2G收入明细","3G佣金占收比=3G佣金明细/3G收入明细项","4G佣金占收比=4G佣金明细项/4G收入明细项","专线佣金占收比=专线佣金收入明细项/专线收入明细项","宽带佣金占收比=宽带佣金收入明细项/宽带收入明细项","固话佣金占收比=固话佣金收入明细项/固话收入明细项"]];
/*var title=[["账期","地市名称","渠道编码","渠道名称","营服中心","开始合作日期","渠道状态","一级属性","毛利(收入-成本)","毛利率(毛利/收入)(%)","成本占收比(%)","代收代办服务费占代收金额比(%)","出账收入(减赠费、退费)(%)","代收费金额","业务受理量(笔)(不含销售和收费)","成本合计","佣金小计(不含紧密型)","销售佣金","话费分成","代收代办服务费(含一卡充)","奖励佣金","其他佣金","紧密型费用","渠道补贴","终端补贴","房租费","客户接入成本","卡成本","发展用户数","收入合计","2G收入","3G收入","4G收入","专线收入","宽带收入","固话收入","其他收入","分专业佣金合计","2G佣金","3G佣金","4G佣金","专线佣金","宽带佣金","固话佣金","缴费服务佣金","其他金","总佣金占收比","2G佣金占收比","3G佣金占收比","4G佣金占收比","专线佣金占收比","宽带佣金占收比","固话佣金占收比"],
           ["账期","地市名称","渠道编码","渠道名称","营服中心","开始合作日期","渠道状态","一级属性","毛利(收入-成本)","毛利率(毛利/收入)(%)","成本占收比(%)","代收代办服务费占代收金额比(%)","出账收入(减赠费、退费)(%)","代收费金额","业务受理量(笔)(不含销售和收费)","成本合计","佣金小计(不含紧密型)","销售佣金","话费分成","代收代办服务费(含一卡充)","奖励佣金","其他佣金","紧密型费用","渠道补贴","终端补贴","房租费","客户接入成本","卡成本","发展用户数","收入合计","2G收入","3G收入","4G收入","专线收入","宽带收入","固话收入","其他收入","分专业佣金合计","2G佣金","3G佣金","4G佣金","专线佣金","宽带佣金","固话佣金","缴费服务佣金","其他金","总佣金占收比","2G佣金占收比","3G佣金占收比","4G佣金占收比","专线佣金占收比","宽带佣金占收比","固话佣金占收比"]];
*/
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN},{array:[8,9,10,11,12,14,15,28,36,45],css:LchReport.NORMAL_STYLE}],
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
	
	var orderBy=" ORDER BY T.GROUP_ID_1, T.UNIT_ID ";
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
	var sql =	" SELECT T.GROUP_ID_1_NAME,                                             "+  //--地市名称
				"        T.HQ_CHAN_CODE,                                                "+  //--渠道编码
				"        T.GROUP_ID_4_NAME,                                             "+  //--渠道名称
				"        T.UNIT_NAME,                                                   "+  //--营服中心
				"        T.START_DATE,                                                  "+  //--开始合作日期
				"        T.STATUS,                                                      "+  //--渠道状态
				"        T.CHN_CDE_1_NAME,                                              "+  //--一级属性
				"        SUM(NVL(T.PROFIT		,0)) AS  PROFIT         ,  				"+	//--出账收入(减赠费、退费)(%)
				"        CASE                                                           "+  //--出账收入(减赠费、退费)(%)
				"          WHEN SUM(NVL(T.INCOME, 0)) = 0 THEN                          "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.PROFIT, 0)) * 100 /          "+
				"                                SUM(NVL(T.INCOME, 0)) || '%',          "+
				"                                2)                                     "+
				"        END AS PROFIT_RATIO,                                           "+  //--毛利率(毛利/收入)(%)
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.INCOME, 0)) = 0 THEN                          "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.COST_ALL, 0)) * 100 /        "+
				"                                SUM(NVL(T.INCOME, 0)) || '%',          "+
				"                                2)                                     "+
				"        END AS COST_INCOME_RATIO ,                                     "+  //--成本占收比(%)
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.DSDB_COMM, 0)) = 0 THEN                       "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.DSDB_INCOME, 0)) * 100 /     "+
				"                                SUM(NVL(T.DSDB_COMM, 0)) || '%',       "+
				"                                2)                                     "+
				"        END AS DSDBCOST_RATIO,                                         "+  //--代收代办服务费占代收金额比(%)
				"        SUM(NVL(T.INCOME		,0)) AS  INCOME         ,  				"+	//--出账收入(减赠费、退费)(%)
				" 	     SUM(NVL(T.DSDB_INCOME	,0)) AS  DSDB_INCOME    ,       		"+	//--代收费金额
				" 	     SUM(NVL(T.SLL_COUNT	,0)) AS  SLL_COUNT      ,      			"+	//--业务受理量(笔)(不含销售和收费)
				" 	     SUM(NVL(T.COST_ALL		,0)) AS  COST_ALL       ,       		"+	//--成本合计
				" 	     SUM(NVL(T.COMM_XJ		,0)) AS  COMM_XJ        ,      			"+	//--佣金小计(不含紧密型)
				" 	     SUM(NVL(T.SALES_COMM	,0)) AS  SALES_COMM     ,       		"+	//--销售佣金
				" 	     SUM(NVL(T.CALLS_COMM	,0)) AS  CALLS_COMM     ,       		"+	//--话费分成
				" 	     SUM(NVL(T.DSDB_COMM	,0)) AS  DSDB_COMM      ,       	    "+	//--代收代办服务费(含一卡充)
				" 	     SUM(NVL(T.REWARD_COMM	,0)) AS  REWARD_COMM    ,       		"+	//--奖励佣金
				" 	     SUM(NVL(T.OTHER_COMM	,0)) AS  OTHER_COMM     ,        		"+	//--其他佣金
				" 	     SUM(NVL(T.JMWB_FEE		,0)) AS  JMWB_FEE       ,       		"+	//--紧密型费用
				" 	     SUM(NVL(T.QDBT_FEE		,0)) AS  QDBT_FEE       ,       		"+	//--渠道补贴
				" 	     SUM(NVL(T.ZDBT_FEE		,0)) AS  ZDBT_FEE       ,      			"+	//--终端补贴
				" 	     SUM(NVL(T.RENT_FEE		,0)) AS  RENT_FEE       ,      			"+	//--房租费
				" 	     SUM(NVL(T.JRCB_FEE		,0)) AS  JRCB_FEE       ,       		"+	//--客户接入成本
				" 	     SUM(NVL(T.KCB_FEE 		,0)) AS  KCB_FEE        ,       		"+	//--卡成本
				" 	     SUM(NVL(T.DEV_NUM 		,0)) AS  DEV_NUM        ,     			"+	//--发展用户数
				" 	     SUM(NVL(T.INCOME  		,0)) AS  INCOME1        ,		        "+	//--收入合计
				" 	     SUM(NVL(SR_2G	 		,0)) AS  SR_2G			,				"+	//--2G收入
				" 	     SUM(NVL(SR_3G	 		,0)) AS  SR_3G			,				"+	//--3G收入
				" 	     SUM(NVL(SR_4G	 		,0)) AS  SR_4G			,				"+	//--4G收入
				" 	     SUM(NVL(SR_ZX	 		,0)) AS  SR_ZX			,				"+	//--专线收入
				" 	     SUM(NVL(SR_KD	 		,0)) AS  SR_KD			,				"+	//--宽带收入
				" 	     SUM(NVL(SR_GH	 		,0)) AS  SR_GH			,				"+	//--固话收入
				" 	     SUM(NVL(SR_QT	 		,0)) AS  SR_QT			,				"+	//--其他收入
				" 	     SUM(NVL(TRADE_ALL 		,0)) AS  TRADE_ALL		,				"+	//--分专业佣金合计
				" 	     SUM(NVL(TRADE_2G	 	,0)) AS  TRADE_2G		,				"+	//--2G佣金
				" 	     SUM(NVL(TRADE_3G	 	,0)) AS  TRADE_3G		,				"+	//--3G佣金
				" 	     SUM(NVL(TRADE_4G	 	,0)) AS  TRADE_4G		,				"+	//--4G佣金
				" 	     SUM(NVL(TRADE_ZX	 	,0)) AS  TRADE_ZX		,				"+	//--专线佣金
				" 	     SUM(NVL(TRADE_KD	 	,0)) AS  TRADE_KD		,				"+	//--宽带佣金
				" 	     SUM(NVL(TRADE_GH	 	,0)) AS  TRADE_GH		,				"+	//--固话佣金
				" 	     SUM(NVL(TRADE_PAY 	 	,0)) AS  TRADE_PAY		,				"+	//--缴费服务佣金
				" 	     SUM(NVL(TRADE_QT	 	,0)) AS  TRADE_QT		,				"+	//--其他金
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.INCOME, 0)) = 0 THEN                          "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_ALL, 0)) * 100 /       "+
				"                                SUM(NVL(T.INCOME, 0)) || '%',          "+
				"                                2)                                     "+
				"        END AS RATE_ALL,                                               "+  //--总佣金占收比
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_2G, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_2G, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_2G, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_2G,                                                "+  //--2G佣金占收比
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_3G, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_3G, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_3G, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_3G,                                                "+  //--3G佣金占收比
				"                                                                       "+
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_4G, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_4G, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_4G, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_4G,                                                "+  //--4G佣金占收比
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_ZX, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_ZX, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_ZX, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_ZX,                                                "+  //--专线佣金占收比
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_KD, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_KD, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_KD, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_KD,                                                "+  //--宽带佣金占收比
				"        CASE                                                           "+
				"          WHEN SUM(NVL(T.SR_GH, 0)) = 0 THEN                           "+
				"           '-'                                                         "+
				"          ELSE                                                         "+
				"           PODS.GET_RADIX_POINT(SUM(NVL(T.TRADE_GH, 0)) * 100 /        "+
				"                                SUM(NVL(T.SR_GH, 0)) || '%',           "+
				"                                2)                                     "+
				"        END AS RATE_GH                                                 "+  //--固话佣金占收比
				"   FROM PMRT.TB_MRT_UNIT_CHL_ANALYSIS T                                "+
				"  WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'            ";

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
	sql+= 	"  GROUP BY T.GROUP_ID_1_NAME,                                          "+
			"           T.GROUP_ID_1,                                               "+
			"           T.HQ_CHAN_CODE,                                             "+
			"           T.GROUP_ID_4_NAME,                                          "+
			"           T.UNIT_NAME,                                                "+
			"           T.UNIT_ID,                                                  "+
			"           T.START_DATE,                                               "+
			"           T.STATUS,                                                   "+
			"           T.CHN_CDE_1_NAME                                            ";
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate = $("#endDate").val();
	var sql=getSql()+" ORDER BY T.GROUP_ID_1, T.UNIT_ID ";
	var title=[["地市名称","渠道编码","渠道名称","营服中心","开始合作日期","渠道状态","一级属性","毛利(收入-成本)","毛利率(毛利/收入)(%)","成本占收比(%)","代收代办服务费占代收金额比(%)","出账收入(减赠费、退费)","代收费金额","业务受理量(笔)(不含销售和收费)","成本合计","分科目佣金","","","","","","紧密型费用","渠道补贴","终端补贴","房租费","客户接入成本","卡成本","发展用户数","其中：收入明细","","","","","","","","其中：佣金明细(当期应付)","","","","","","","","","佣金占收比","","","","","",""],
	           ["","","","","","","","","","","","","","","","佣金小计(不含紧密型)","销售佣金","话费分成","代收代办服务费(含一卡充)","奖励佣金","其他佣金","","","","","","","","收入合计","2G收入","3G收入","4G收入","专线收入","宽带收入","固话收入","其他收入","分专业佣金合计","2G佣金","3G佣金","4G佣金","专线佣金","宽带佣金","固话佣金","缴费服务佣金","其他","总佣金占收比(%)","2G佣金占收比(%)","3G佣金占收比(%)","4G佣金占收比(%)","专线佣金占收比(%)","宽带佣金占收比(%)","固话佣金占收比(%)"],
	           ["","","","","","","","","","","","","","","成本合计=佣金小计+渠道补贴+终端补贴+房租+客户接入成本+卡成本","佣金小计=销售佣金+话费分成+代收代办服务费+奖励佣金+其他佣金","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","总佣金占收比=佣金合计/收入合计","2G占收比=2G佣金明细/2G收入明细","3G佣金占收比=3G佣金明细/3G收入明细项","4G佣金占收比=4G佣金明细项/4G收入明细项","专线佣金占收比=专线佣金收入明细项/专线收入明细项","宽带佣金占收比=宽带佣金收入明细项/宽带收入明细项","固话佣金占收比=固话佣金收入明细项/固话收入明细项"]];
	showtext = '渠道效能分析明细表-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
