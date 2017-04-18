var nowData = [];
var title=[["州市名称","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道专业","三级属性","人数","发展用户数","出账用户数","","业务受理量","代收费金额","代收服务费占代收金额比","毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比(%)","其中：出账收入明细","","","","","","其中：佣金明细分类一(当期应付)","","","","","","其中：佣金明细分类二","","","用户欠费","用户预存款","二次续费率","是否自建他营","是否社会化合作"],
           ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","移网","固网","","","","","","","","小计","合同制","紧密型","财务列账","","","","","","","","","","","","","","","","","","","","小计","移网","专线","宽带","固话","其他","合计","移网","专线","宽带","固话","其他","按发展渠道","按受理渠道","BOT建设方","","","","",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_ZY","THIRD_TYPE","MAN_COUNT","DEV_COUNT","CHARGE_YW","CHARGE_GW","ACC_NUM","DS_MONEY","DS_SVR_RATE","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","MAN_COST_ALL","MAN_COST_CONT","MAN_COST_JM","MAN_COST_FINACE","YJ_ALL","HQ_QDBT","TERM_BT","GT_PLACE_RENT","HQ_RENT","HQ_ZX_FEE","KHJR_AMOUNT","KCB_COST","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","COST_RATE","SR_DETAIL_SUM","SR_DETAIL_YW","SR_DETAIL_ZX","SR_DETAIL_KD","SR_DETAIL_GH","SR_DETAIL_OTHER","YF_MON_SUM","YF_MON_YW","YF_MON_ZX","YF_MON_KD","YF_MON_GH","YF_MON_OTHER","YJ_DEV","YJ_ACC","YJ_BOT","SUBS_OWE","SUBS_PAY","SECOND_PAY","IS_TY","IS_SOCIAL"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_HQ_ABILITY_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		sql+=" AND HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
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
	var showtext = '云南联通渠道效能分析明细表-'+time;
	downloadExcel(downSql,title,showtext);
}
