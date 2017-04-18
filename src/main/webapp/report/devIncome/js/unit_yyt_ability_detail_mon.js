var nowData = [];
var title=[["州市名称","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","","业务受理量","营业厅毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品印制及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比","生命周期（月）","","","上月出账用户平均ARPU值","","","生命周期出账收入","","","生命周期成本","","","生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额","二次续费率"],
           ["","","","","","","","","","","","","","","","","","","","","","","","小计","合同制","紧密型","财务计列（如劳保等）","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","移网","固网","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","","数量","金额","数量","金额","数量","金额","","","",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","YYT_CODE","YYT_NAME","YYT_ADDR","HQ_CHAN_CODE","HQ_CHAN_NAME","YYT_CREATE_TIME","BUSI_BEGIN_TIME","YYT_TYPE","BUSI_MODE","THIRD_ATTRI","BUSI_NAME","RENT_NO","YYT_MAN_NUM","YYT_DEV_NUM","YW_CHARGE_NUM","GW_CHARGE_NUM","ACCT_NUM","YYT_ML","RETAIL_ML","CHARGE_SR","COST_SUM","MAN_COST_SUM","MAN_COST_CONTRACT","MAN_COST_NOCONT","MAN_COST_FINACE","YJ_AMOUNT","HQ_SUBSIDY","TERMINAL_AMOUNT","PLACE_RENT_AMOUNT","RENT_AMOUNT","DECORATION_AMOUNT","JRCB_AMOUNT","KCB_AMOUNT","SDWY_AMOUNT","ADVERTISE_AMOUNT","YWYP_AMOUNT","PRODUCT_DOWN_PRE","RETAIL_SR","RETAIL_COST","OFFICE_AMOUNT","CAR_AMOUNT","ZDF_AMOUNT","TRAVEL_AMOUNT","TXF_AMOUNT","COST_IN_SR_RATE","BIRTH_YW","BIRTH_KD","BIRTH_OTHER","ARPU_YW","ARPU_KD","ARPU_OTHER","BIRTH_SR_YW","BIRTH_SR_KD","BIRTH_SR_OTHER","BIRTH_COST_YW","BIRTH_COST_KD","BIRTH_COST_OTHER","BIRTH_ML","TERMINAL_NUM","TERMINAL_MONEY","THREE_MON_TERM_NUM","THREE_MON_TERM_MONEY","ONE_YEAR_TERM_NUM","ONE_YEAR_TERM_MONEY","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT","SECOND_PAY_RATE"];
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
	var yyt_name=$("#yyt_name").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ABILITY_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_name!=''){
		sql+=" AND YYT_NAME LIKE '%" +yyt_name+"%'";
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
	var showtext = '云南联通营业厅效能分析明细表-'+time;
	downloadExcel(downSql,title,showtext);
}
