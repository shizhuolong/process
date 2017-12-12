var nowData = [];
var title=[["组织架构","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","","","业务受理量","营业厅毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品印制及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费"/*,"成本占收比"*/,"生命周期（月）","","","当月出账用户平均ARPU值","","","生命周期出账收入","","","生命周期成本","","","生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额"/*,"二次续费率"*/],
           ["","","","","","","","","","","","","","","","","移网","固网","合计","","","","","","合同制","紧密制","财务计列(如劳保等)","小计","","","","","","","","","","","","","","","","","","","","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","","数量","金额","数量","金额","数量","金额","","",""]];
var field=["YYT_MAN_NUM","YYT_DEV_NUM","YW_CHARGE_NUM","GW_CHARGE_NUM","TOTAL_CHARGE_NUM","ACCT_NUM","YYT_ML","RETAIL_ML","CHARGE_SR","COST_SUM","MAN_COST_CONTRACT","MAN_COST_NOCONT","MAN_COST_FINACE","MAN_COST_SUM","YJ_AMOUNT","HQ_SUBSIDY","TERMINAL_AMOUNT","PLACE_RENT_AMOUNT","RENT_AMOUNT","DECORATION_AMOUNT","JRCB_AMOUNT","KCB_AMOUNT","SDWY_AMOUNT","ADVERTISE_AMOUNT","YWYP_AMOUNT","PRODUCT_DOWN_PRE","RETAIL_SR","RETAIL_COST","OFFICE_AMOUNT","CAR_AMOUNT","ZDF_AMOUNT","TRAVEL_AMOUNT","TXF_AMOUNT"/*,"COST_IN_SR_RATE"*/,"BIRTH_YW","BIRTH_KD","BIRTH_OTHER","ARPU_YW","ARPU_KD","ARPU_OTHER","BIRTH_SR_YW","BIRTH_SR_KD","BIRTH_SR_OTHER","BIRTH_COST_YW","BIRTH_COST_KD","BIRTH_COST_OTHER","BIRTH_ML","TERMINAL_NUM","TERMINAL_MONEY","THREE_MON_TERM_NUM","THREE_MON_TERM_MONEY","ONE_YEAR_TERM_NUM","ONE_YEAR_TERM_MONEY","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT"/*,"SECOND_PAY_RATE"*/];
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_YYT_ABILITY_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME","UNIT_NAME","YYT_CODE","YYT_NAME","YYT_ADDR","HQ_CHAN_CODE","HQ_CHAN_NAME","YYT_CREATE_TIME","BUSI_BEGIN_TIME","YYT_TYPE","BUSI_MODE","THIRD_ATTRI","BUSI_NAME","RENT_NO"].concat(field),
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var regionCode=$("#regionCode").val();
			var yyt_name=$("#yyt_name").val();
			var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					level=2;
				}else if(orgLevel==3){//点击市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					level=3;
				}else if(orgLevel==4){//点击营服
					where+=" AND T1.UNIT_ID='"+code+"'";
					level=4;
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,level);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=1;
				}else if(orgLevel==2){//市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					level=2;
				}else if(orgLevel==3){//营服
					where+=" AND T1.UNIT_ID IN("+_unit_relation(code)+")";
					level=3;
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(where,level);
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function toRules(){
	var url = $("#ctx").val()+"/report/devIncome/jsp/rules.jsp?type=4";
	window.parent.openWindow("取数规则",null,url);
}

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	var regionCode=$("#regionCode").val();
	var yyt_name=$("#yyt_name").val();
	var hqChanCode=$("#hqChanCode").val();
	if (orgLevel == 1) {//省
	} else if(orgLevel == 2){//市
		where += " AND T1.GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND T1.UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_name!=''){
		where+=" AND T1.YYT_NAME LIKE '%"+yyt_name+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	var title=[["地市","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","","","业务受理量","营业厅毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品印制及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费"/*,"成本占收比"*/,"生命周期（月）","","","当月出账用户平均ARPU值","","","生命周期出账收入","","","生命周期成本","","","生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额"/*,"二次续费率"*/],
	           ["","","","","","","","","","","","","","","","","移网","固网","合计","","","","","","合同制","紧密制","财务计列(如劳保等)","小计","","","","","","","","","","","","","","","","","","","","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","","数量","金额","数量","金额","数量","金额","","",""]];
	var sql = getDownSql(where);
	var showtext = '云南联通营业厅效能分析明细表' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function getSql(where,level){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var yyt_name=$("#yyt_name").val();
	var hqChanCode=$("#hqChanCode").val();
	var where1=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	if(regionCode!=''){
		where+=" AND T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_name!=''){
		where+=" AND T1.YYT_NAME LIKE '%"+yyt_name+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if(level==1){
		return "SELECT '云南省' ROW_NAME,                                                                                    "+
		"       '86000' ROW_ID,                                                                                            "+
		"       '--' UNIT_NAME,                                                                                            "+
		"       '--' YYT_CODE,                                                                                             "+
		"       '--' YYT_NAME,                                                                                             "+
		"       '--' YYT_ADDR,                                                                                             "+
		"       '--' HQ_CHAN_CODE,                                                                                         "+
		"       '--' HQ_CHAN_NAME,                                                                                         "+
		"       '--' YYT_CREATE_TIME,                                                                                      "+
		"       '--' BUSI_BEGIN_TIME,                                                                                      "+
		"       '--' YYT_TYPE,                                                                                             "+
		"       '--' BUSI_MODE,                                                                                            "+
		"       '--' THIRD_ATTRI,                                                                                          "+
		"       '--' BUSI_NAME,                                                                                            "+
		"       '--' RENT_NO,                                                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                    "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM END) YW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN GW_CHARGE_NUM END) GW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN NVL(YW_CHARGE_NUM,0)+NVL(GW_CHARGE_NUM,0) END )TOTAL_CHARGE_NUM, "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
		"       SUM(MAN_COST_CONTRACT) MAN_COST_CONTRACT,                                                                    "+
		"       SUM(MAN_COST_NOCONT) MAN_COST_NOCONT,                                                                        "+
		"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                                        "+
		"       SUM(MAN_COST_SUM) MAN_COST_SUM,                                                                              "+
		"       SUM(YJ_AMOUNT) YJ_AMOUNT,                                                                                    "+
		"       SUM(HQ_SUBSIDY) HQ_SUBSIDY,                                                                                  "+
		"       SUM(TERMINAL_AMOUNT) TERMINAL_AMOUNT,                                                                        "+
		"       SUM(PLACE_RENT_AMOUNT) PLACE_RENT_AMOUNT,                                                                    "+
		"       SUM(RENT_AMOUNT) RENT_AMOUNT,                                                                                "+
		"       SUM(DECORATION_AMOUNT) DECORATION_AMOUNT,                                                                    "+
		"       SUM(JRCB_AMOUNT) JRCB_AMOUNT,                                                                                "+
		"       SUM(KCB_AMOUNT) KCB_AMOUNT,                                                                                  "+
		"       SUM(SDWY_AMOUNT) SDWY_AMOUNT,                                                                                "+
		"       SUM(ADVERTISE_AMOUNT) ADVERTISE_AMOUNT,                                                                      "+
		"       SUM(YWYP_AMOUNT) YWYP_AMOUNT,                                                                                "+
		"       SUM(PRODUCT_DOWN_PRE) PRODUCT_DOWN_PRE,                                                                      "+
		"       SUM(RETAIL_SR) RETAIL_SR,                                                                                    "+
		"       SUM(RETAIL_COST) RETAIL_COST,                                                                                "+
		"       SUM(OFFICE_AMOUNT) OFFICE_AMOUNT,                                                                            "+
		"       SUM(CAR_AMOUNT) CAR_AMOUNT,                                                                                  "+
		"       SUM(ZDF_AMOUNT) ZDF_AMOUNT,                                                                                  "+
		"       SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,                                                                            "+
		"       SUM(TXF_AMOUNT) TXF_AMOUNT,                                                                                  "+
		"       SUM(BIRTH_YW) BIRTH_YW,                                                                                      "+
		"       SUM(BIRTH_KD) BIRTH_KD,                                                                                      "+
		"       SUM(BIRTH_OTHER) BIRTH_OTHER,                                                                                "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_MOB_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END) END                                 "+
		"                  ,'FM999990.99')) ARPU_YW,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_KD_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END) END                                 "+
		"                  ,'FM999990.99')) ARPU_KD,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END)=0            "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_OTHER_NUM END)                             "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END) END                              "+
		"                  ,'FM999990.99')) ARPU_OTHER,                                                                      "+
		"       SUM(BIRTH_SR_YW) BIRTH_SR_YW,                                                                                "+
		"       SUM(BIRTH_SR_KD) BIRTH_SR_KD,                                                                                "+
		"       SUM(BIRTH_SR_OTHER) BIRTH_SR_OTHER,                                                                          "+
		"       SUM(BIRTH_COST_YW) BIRTH_COST_YW,                                                                            "+
		"       SUM(BIRTH_COST_KD) BIRTH_COST_KD,                                                                            "+
		"       SUM(BIRTH_COST_OTHER) BIRTH_COST_OTHER,                                                                      "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                      "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                              "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                          "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                  "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                              "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                    "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                                 "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                              "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                     "+
		"                      YYT_CODE,                                                                                     "+
		"                      YYT_NAME,                                                                                     "+
		"                      YYT_ADDR,                                                                                     "+
		"                      HQ_CHAN_CODE,                                                                                 "+
		"                      HQ_CHAN_NAME,                                                                                 "+
		"                      YYT_CREATE_TIME,                                                                              "+
		"                      BUSI_BEGIN_TIME,                                                                              "+
		"                      YYT_TYPE,                                                                                     "+
		"                      BUSI_MODE,                                                                                    "+
		"                      THIRD_ATTRI,                                                                                  "+
		"                      BUSI_NAME,                                                                                    "+
		"                      RENT_NO,                                                                                      "+
		"                      GROUP_ID_1,                                                                                   "+
		"                      GROUP_ID_1_NAME,                                                                              "+
		"                      UNIT_iD,                                                                                      "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                                            "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                      "+
		                where1+
		"             )WHERE RN=1                                                                                          "+
		"             )T1                                                                                                  "+
		" ON (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                                             "+
		               where;
	}else if(level==2){
		return "SELECT T1.GROUP_ID_1_NAME ROW_NAME,                                                                        "+
		"       T1.GROUP_ID_1 ROW_ID,                                                                                      "+
		"       '--' UNIT_NAME,                                                                                            "+
		"       '--' YYT_CODE,                                                                                             "+
		"       '--' YYT_NAME,                                                                                             "+
		"       '--' YYT_ADDR,                                                                                             "+
		"       '--' HQ_CHAN_CODE,                                                                                         "+
		"       '--' HQ_CHAN_NAME,                                                                                         "+
		"       '--' YYT_CREATE_TIME,                                                                                      "+
		"       '--' BUSI_BEGIN_TIME,                                                                                      "+
		"       '--' YYT_TYPE,                                                                                             "+
		"       '--' BUSI_MODE,                                                                                            "+
		"       '--' THIRD_ATTRI,                                                                                          "+
		"       '--' BUSI_NAME,                                                                                            "+
		"       '--' RENT_NO,                                                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                    "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM END) YW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN GW_CHARGE_NUM END) GW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN NVL(YW_CHARGE_NUM,0)+NVL(GW_CHARGE_NUM,0) END )TOTAL_CHARGE_NUM, "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
		"       SUM(MAN_COST_CONTRACT) MAN_COST_CONTRACT,                                                                    "+
		"       SUM(MAN_COST_NOCONT) MAN_COST_NOCONT,                                                                        "+
		"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                                        "+
		"       SUM(MAN_COST_SUM) MAN_COST_SUM,                                                                              "+
		"       SUM(YJ_AMOUNT) YJ_AMOUNT,                                                                                    "+
		"       SUM(HQ_SUBSIDY) HQ_SUBSIDY,                                                                                  "+
		"       SUM(TERMINAL_AMOUNT) TERMINAL_AMOUNT,                                                                        "+
		"       SUM(PLACE_RENT_AMOUNT) PLACE_RENT_AMOUNT,                                                                    "+
		"       SUM(RENT_AMOUNT) RENT_AMOUNT,                                                                                "+
		"       SUM(DECORATION_AMOUNT) DECORATION_AMOUNT,                                                                    "+
		"       SUM(JRCB_AMOUNT) JRCB_AMOUNT,                                                                                "+
		"       SUM(KCB_AMOUNT) KCB_AMOUNT,                                                                                  "+
		"       SUM(SDWY_AMOUNT) SDWY_AMOUNT,                                                                                "+
		"       SUM(ADVERTISE_AMOUNT) ADVERTISE_AMOUNT,                                                                      "+
		"       SUM(YWYP_AMOUNT) YWYP_AMOUNT,                                                                                "+
		"       SUM(PRODUCT_DOWN_PRE) PRODUCT_DOWN_PRE,                                                                      "+
		"       SUM(RETAIL_SR) RETAIL_SR,                                                                                    "+
		"       SUM(RETAIL_COST) RETAIL_COST,                                                                                "+
		"       SUM(OFFICE_AMOUNT) OFFICE_AMOUNT,                                                                            "+
		"       SUM(CAR_AMOUNT) CAR_AMOUNT,                                                                                  "+
		"       SUM(ZDF_AMOUNT) ZDF_AMOUNT,                                                                                  "+
		"       SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,                                                                            "+
		"       SUM(TXF_AMOUNT) TXF_AMOUNT,                                                                                  "+
		"       SUM(BIRTH_YW) BIRTH_YW,                                                                                      "+
		"       SUM(BIRTH_KD) BIRTH_KD,                                                                                      "+
		"       SUM(BIRTH_OTHER) BIRTH_OTHER,                                                                                "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_MOB_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END) END                                 "+
		"                  ,'FM999990.99')) ARPU_YW,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_KD_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END) END                                 "+
		"                  ,'FM999990.99')) ARPU_KD,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END)=0            "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_OTHER_NUM END)                             "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END) END                              "+
		"                  ,'FM999990.99')) ARPU_OTHER,                                                                      "+
		"       SUM(BIRTH_SR_YW) BIRTH_SR_YW,                                                                                "+
		"       SUM(BIRTH_SR_KD) BIRTH_SR_KD,                                                                                "+
		"       SUM(BIRTH_SR_OTHER) BIRTH_SR_OTHER,                                                                          "+
		"       SUM(BIRTH_COST_YW) BIRTH_COST_YW,                                                                            "+
		"       SUM(BIRTH_COST_KD) BIRTH_COST_KD,                                                                            "+
		"       SUM(BIRTH_COST_OTHER) BIRTH_COST_OTHER,                                                                      "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                      "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                              "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                          "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                  "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                              "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                    "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                                 "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                              "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                     "+
		"                      YYT_CODE,                                                                                     "+
		"                      YYT_NAME,                                                                                     "+
		"                      YYT_ADDR,                                                                                     "+
		"                      HQ_CHAN_CODE,                                                                                 "+
		"                      HQ_CHAN_NAME,                                                                                 "+
		"                      YYT_CREATE_TIME,                                                                              "+
		"                      BUSI_BEGIN_TIME,                                                                              "+
		"                      YYT_TYPE,                                                                                     "+
		"                      BUSI_MODE,                                                                                    "+
		"                      THIRD_ATTRI,                                                                                  "+
		"                      BUSI_NAME,                                                                                    "+
		"                      RENT_NO,                                                                                      "+
		"                      GROUP_ID_1,                                                                                   "+
		"                      GROUP_ID_1_NAME,                                                                              "+
		"                      UNIT_iD,                                                                                      "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                                            "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                      "+
		                where1+
		"             )WHERE RN=1                                                                                          "+
		"             )T1                                                                                                  "+
		" ON (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                                             "+
		               where+
		" GROUP BY T1.GROUP_ID_1,                                                                                          "+
		"       T1.GROUP_ID_1_NAME                                                                                         ";
	}else if(level==3){
		return "SELECT T1.UNIT_NAME ROW_NAME,                                                                                       "+
		"       T1.UNIT_ID ROW_ID,                                                                                           "+
		"       T1.UNIT_NAME,                                                                                                "+
		"       '--' YYT_CODE,                                                                                               "+
		"       '--' YYT_NAME,                                                                                               "+
		"       '--' YYT_ADDR,                                                                                               "+
		"       '--' HQ_CHAN_CODE,                                                                                           "+
		"       '--' HQ_CHAN_NAME,                                                                                           "+
		"       '--' YYT_CREATE_TIME,                                                                                        "+
		"       '--' BUSI_BEGIN_TIME,                                                                                        "+
		"       '--' YYT_TYPE,                                                                                               "+
		"       '--' BUSI_MODE,                                                                                              "+
		"       '--' THIRD_ATTRI,                                                                                            "+
		"       '--' BUSI_NAME,                                                                                              "+
		"       '--' RENT_NO,                                                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                    "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM END) YW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN GW_CHARGE_NUM END) GW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN NVL(YW_CHARGE_NUM,0)+NVL(GW_CHARGE_NUM,0) END )TOTAL_CHARGE_NUM, "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
		"       SUM(MAN_COST_CONTRACT) MAN_COST_CONTRACT,                                                                    "+
		"       SUM(MAN_COST_NOCONT) MAN_COST_NOCONT,                                                                        "+
		"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                                        "+
		"       SUM(MAN_COST_SUM) MAN_COST_SUM,                                                                              "+
		"       SUM(YJ_AMOUNT) YJ_AMOUNT,                                                                                    "+
		"       SUM(HQ_SUBSIDY) HQ_SUBSIDY,                                                                                  "+
		"       SUM(TERMINAL_AMOUNT) TERMINAL_AMOUNT,                                                                        "+
		"       SUM(PLACE_RENT_AMOUNT) PLACE_RENT_AMOUNT,                                                                    "+
		"       SUM(RENT_AMOUNT) RENT_AMOUNT,                                                                                "+
		"       SUM(DECORATION_AMOUNT) DECORATION_AMOUNT,                                                                    "+
		"       SUM(JRCB_AMOUNT) JRCB_AMOUNT,                                                                                "+
		"       SUM(KCB_AMOUNT) KCB_AMOUNT,                                                                                  "+
		"       SUM(SDWY_AMOUNT) SDWY_AMOUNT,                                                                                "+
		"       SUM(ADVERTISE_AMOUNT) ADVERTISE_AMOUNT,                                                                      "+
		"       SUM(YWYP_AMOUNT) YWYP_AMOUNT,                                                                                "+
		"       SUM(PRODUCT_DOWN_PRE) PRODUCT_DOWN_PRE,                                                                      "+
		"       SUM(RETAIL_SR) RETAIL_SR,                                                                                    "+
		"       SUM(RETAIL_COST) RETAIL_COST,                                                                                "+
		"       SUM(OFFICE_AMOUNT) OFFICE_AMOUNT,                                                                            "+
		"       SUM(CAR_AMOUNT) CAR_AMOUNT,                                                                                  "+
		"       SUM(ZDF_AMOUNT) ZDF_AMOUNT,                                                                                  "+
		"       SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,                                                                            "+
		"       SUM(TXF_AMOUNT) TXF_AMOUNT,                                                                                  "+
		"       SUM(BIRTH_YW) BIRTH_YW,                                                                                      "+
		"       SUM(BIRTH_KD) BIRTH_KD,                                                                                      "+
		"       SUM(BIRTH_OTHER) BIRTH_OTHER,                                                                                "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_MOB_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END) END                                 "+
		"                  ,'FM999990.99')) ARPU_YW,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_KD_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END) END                                 "+
		"                  ,'FM999990.99')) ARPU_KD,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END)=0            "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_OTHER_NUM END)                             "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END) END                              "+
		"                  ,'FM999990.99')) ARPU_OTHER,                                                                      "+
		"       SUM(BIRTH_SR_YW) BIRTH_SR_YW,                                                                                "+
		"       SUM(BIRTH_SR_KD) BIRTH_SR_KD,                                                                                "+
		"       SUM(BIRTH_SR_OTHER) BIRTH_SR_OTHER,                                                                          "+
		"       SUM(BIRTH_COST_YW) BIRTH_COST_YW,                                                                            "+
		"       SUM(BIRTH_COST_KD) BIRTH_COST_KD,                                                                            "+
		"       SUM(BIRTH_COST_OTHER) BIRTH_COST_OTHER,                                                                      "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                      "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                              "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                          "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                  "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                              "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                    "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                                 "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                              "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                     "+
		"                      YYT_CODE,                                                                                     "+
		"                      YYT_NAME,                                                                                     "+
		"                      YYT_ADDR,                                                                                     "+
		"                      HQ_CHAN_CODE,                                                                                 "+
		"                      HQ_CHAN_NAME,                                                                                 "+
		"                      YYT_CREATE_TIME,                                                                              "+
		"                      BUSI_BEGIN_TIME,                                                                              "+
		"                      YYT_TYPE,                                                                                     "+
		"                      BUSI_MODE,                                                                                    "+
		"                      THIRD_ATTRI,                                                                                  "+
		"                      BUSI_NAME,                                                                                    "+
		"                      RENT_NO,                                                                                      "+
		"                      GROUP_ID_1,                                                                                   "+
		"                      GROUP_ID_1_NAME,                                                                              "+
		"                      UNIT_iD,                                                                                      "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                                            "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                      "+
		    where1+
		"             )WHERE RN=1                                                                                            "+
		"             )T1                                                                                                    "+
		" ON (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                                               "+
		     where+
		" GROUP BY T1.GROUP_ID_1,T1.UNIT_ID,T1.UNIT_NAME                                                                     ";
	}else{
		return "SELECT T1.YYT_NAME ROW_NAME,                                                                                "+
		"       T1.YYT_CODE ROW_ID,                                                                                           "+
		"       T1.UNIT_NAME,                                                                                                "+
		"       T1.YYT_CODE,                                                                                                 "+
		"       T1.YYT_NAME,                                                                                                 "+
		"       T1.YYT_ADDR,                                                                                                 "+
		"       T1.HQ_CHAN_CODE,                                                                                             "+
		"       T1.HQ_CHAN_NAME,                                                                                             "+
		"       T1.YYT_CREATE_TIME,                                                                                          "+
		"       T1.BUSI_BEGIN_TIME,                                                                                          "+
		"       T1.YYT_TYPE,                                                                                                 "+
		"       T1.BUSI_MODE,                                                                                                "+
		"       T1.THIRD_ATTRI,                                                                                              "+
		"       T1.BUSI_NAME,                                                                                                "+
		"       T1.RENT_NO,                                                                                                  "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                    "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM END) YW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN GW_CHARGE_NUM END) GW_CHARGE_NUM,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN NVL(YW_CHARGE_NUM,0)+NVL(GW_CHARGE_NUM,0) END )TOTAL_CHARGE_NUM, "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
		"       SUM(MAN_COST_CONTRACT) MAN_COST_CONTRACT,                                                                    "+
		"       SUM(MAN_COST_NOCONT) MAN_COST_NOCONT,                                                                        "+
		"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                                        "+
		"       SUM(MAN_COST_SUM) MAN_COST_SUM,                                                                              "+
		"       SUM(YJ_AMOUNT) YJ_AMOUNT,                                                                                    "+
		"       SUM(HQ_SUBSIDY) HQ_SUBSIDY,                                                                                  "+
		"       SUM(TERMINAL_AMOUNT) TERMINAL_AMOUNT,                                                                        "+
		"       SUM(PLACE_RENT_AMOUNT) PLACE_RENT_AMOUNT,                                                                    "+
		"       SUM(RENT_AMOUNT) RENT_AMOUNT,                                                                                "+
		"       SUM(DECORATION_AMOUNT) DECORATION_AMOUNT,                                                                    "+
		"       SUM(JRCB_AMOUNT) JRCB_AMOUNT,                                                                                "+
		"       SUM(KCB_AMOUNT) KCB_AMOUNT,                                                                                  "+
		"       SUM(SDWY_AMOUNT) SDWY_AMOUNT,                                                                                "+
		"       SUM(ADVERTISE_AMOUNT) ADVERTISE_AMOUNT,                                                                      "+
		"       SUM(YWYP_AMOUNT) YWYP_AMOUNT,                                                                                "+
		"       SUM(PRODUCT_DOWN_PRE) PRODUCT_DOWN_PRE,                                                                      "+
		"       SUM(RETAIL_SR) RETAIL_SR,                                                                                    "+
		"       SUM(RETAIL_COST) RETAIL_COST,                                                                                "+
		"       SUM(OFFICE_AMOUNT) OFFICE_AMOUNT,                                                                            "+
		"       SUM(CAR_AMOUNT) CAR_AMOUNT,                                                                                  "+
		"       SUM(ZDF_AMOUNT) ZDF_AMOUNT,                                                                                  "+
		"       SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,                                                                            "+
		"       SUM(TXF_AMOUNT) TXF_AMOUNT,                                                                                  "+
		"       SUM(BIRTH_YW) BIRTH_YW,                                                                                      "+
		"       SUM(BIRTH_KD) BIRTH_KD,                                                                                      "+
		"       SUM(BIRTH_OTHER) BIRTH_OTHER,                                                                                "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_MOB_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END) END                                 "+
		"                  ,'FM999990.99')) ARPU_YW,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END)=0               "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_KD_NUM END)                                "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END) END                                 "+
		"                  ,'FM999990.99')) ARPU_KD,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END)=0            "+
		"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_OTHER_NUM END)                             "+
		"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END) END                              "+
		"                  ,'FM999990.99')) ARPU_OTHER,                                                                      "+
		"       SUM(BIRTH_SR_YW) BIRTH_SR_YW,                                                                                "+
		"       SUM(BIRTH_SR_KD) BIRTH_SR_KD,                                                                                "+
		"       SUM(BIRTH_SR_OTHER) BIRTH_SR_OTHER,                                                                          "+
		"       SUM(BIRTH_COST_YW) BIRTH_COST_YW,                                                                            "+
		"       SUM(BIRTH_COST_KD) BIRTH_COST_KD,                                                                            "+
		"       SUM(BIRTH_COST_OTHER) BIRTH_COST_OTHER,                                                                      "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                      "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                              "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                          "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                  "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                              "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                    "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                                "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                                 "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                              "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                     "+
		"                      YYT_CODE,                                                                                     "+
		"                      YYT_NAME,                                                                                     "+
		"                      YYT_ADDR,                                                                                     "+
		"                      HQ_CHAN_CODE,                                                                                 "+
		"                      HQ_CHAN_NAME,                                                                                 "+
		"                      YYT_CREATE_TIME,                                                                              "+
		"                      BUSI_BEGIN_TIME,                                                                              "+
		"                      YYT_TYPE,                                                                                     "+
		"                      BUSI_MODE,                                                                                    "+
		"                      THIRD_ATTRI,                                                                                  "+
		"                      BUSI_NAME,                                                                                    "+
		"                      RENT_NO,                                                                                      "+
		"                      GROUP_ID_1,                                                                                   "+
		"                      GROUP_ID_1_NAME,                                                                              "+
		"                      UNIT_iD,                                                                                      "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                                            "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                      "+
		              where1+
		"             )WHERE RN=1                                                                                            "+
		"             )T1                                                                                                    "+
		" ON (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                                               "+
		              where+
		" GROUP BY T1.UNIT_ID,                                                                                               "+
		"       T1.UNIT_NAME,                                                                                                "+
		"       T1.YYT_CODE,                                                                                                 "+
		"       T1.YYT_NAME,                                                                                                 "+
		"       T1.YYT_ADDR,                                                                                                 "+
		"       T1.HQ_CHAN_CODE,                                                                                             "+
		"       T1.HQ_CHAN_NAME,                                                                                             "+
		"       T1.YYT_CREATE_TIME,                                                                                          "+
		"       T1.BUSI_BEGIN_TIME,                                                                                          "+
		"       T1.YYT_TYPE,                                                                                                 "+
		"       T1.BUSI_MODE,                                                                                                "+
		"       T1.THIRD_ATTRI,                                                                                              "+
		"       T1.BUSI_NAME,                                                                                                "+
		"       T1.RENT_NO,                                                                                                  "+
		"       T1.GROUP_ID_1_NAME                                                                                           ";
	}
}

function getDownSql(where){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var where1=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	return "SELECT T1.GROUP_ID_1_NAME,                                                                                "+
	"       T1.UNIT_NAME,                                                                                                "+
	"       T1.YYT_CODE,                                                                                                 "+
	"       T1.YYT_NAME,                                                                                                 "+
	"       T1.YYT_ADDR,                                                                                                 "+
	"       T1.HQ_CHAN_CODE,                                                                                             "+
	"       T1.HQ_CHAN_NAME,                                                                                             "+
	"       T1.YYT_CREATE_TIME,                                                                                          "+
	"       T1.BUSI_BEGIN_TIME,                                                                                          "+
	"       T1.YYT_TYPE,                                                                                                 "+
	"       T1.BUSI_MODE,                                                                                                "+
	"       T1.THIRD_ATTRI,                                                                                              "+
	"       T1.BUSI_NAME,                                                                                                "+
	"       T1.RENT_NO,                                                                                                  "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                    "+
	"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM END) YW_CHARGE_NUM,                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN GW_CHARGE_NUM END) GW_CHARGE_NUM,                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN NVL(YW_CHARGE_NUM,0)+NVL(GW_CHARGE_NUM,0) END )TOTAL_CHARGE_NUM, "+
	"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
	"       SUM(YYT_ML) YYT_ML,                                                                                          "+
	"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
	"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
	"       SUM(COST_SUM) COST_SUM,                                                                                      "+
	"       SUM(MAN_COST_CONTRACT) MAN_COST_CONTRACT,                                                                    "+
	"       SUM(MAN_COST_NOCONT) MAN_COST_NOCONT,                                                                        "+
	"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                                        "+
	"       SUM(MAN_COST_SUM) MAN_COST_SUM,                                                                              "+
	"       SUM(YJ_AMOUNT) YJ_AMOUNT,                                                                                    "+
	"       SUM(HQ_SUBSIDY) HQ_SUBSIDY,                                                                                  "+
	"       SUM(TERMINAL_AMOUNT) TERMINAL_AMOUNT,                                                                        "+
	"       SUM(PLACE_RENT_AMOUNT) PLACE_RENT_AMOUNT,                                                                    "+
	"       SUM(RENT_AMOUNT) RENT_AMOUNT,                                                                                "+
	"       SUM(DECORATION_AMOUNT) DECORATION_AMOUNT,                                                                    "+
	"       SUM(JRCB_AMOUNT) JRCB_AMOUNT,                                                                                "+
	"       SUM(KCB_AMOUNT) KCB_AMOUNT,                                                                                  "+
	"       SUM(SDWY_AMOUNT) SDWY_AMOUNT,                                                                                "+
	"       SUM(ADVERTISE_AMOUNT) ADVERTISE_AMOUNT,                                                                      "+
	"       SUM(YWYP_AMOUNT) YWYP_AMOUNT,                                                                                "+
	"       SUM(PRODUCT_DOWN_PRE) PRODUCT_DOWN_PRE,                                                                      "+
	"       SUM(RETAIL_SR) RETAIL_SR,                                                                                    "+
	"       SUM(RETAIL_COST) RETAIL_COST,                                                                                "+
	"       SUM(OFFICE_AMOUNT) OFFICE_AMOUNT,                                                                            "+
	"       SUM(CAR_AMOUNT) CAR_AMOUNT,                                                                                  "+
	"       SUM(ZDF_AMOUNT) ZDF_AMOUNT,                                                                                  "+
	"       SUM(TRAVEL_AMOUNT) TRAVEL_AMOUNT,                                                                            "+
	"       SUM(TXF_AMOUNT) TXF_AMOUNT,                                                                                  "+
	"       SUM(BIRTH_YW) BIRTH_YW,                                                                                      "+
	"       SUM(BIRTH_KD) BIRTH_KD,                                                                                      "+
	"       SUM(BIRTH_OTHER) BIRTH_OTHER,                                                                                "+
	"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END)=0               "+
	"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_MOB_NUM END)                                "+
	"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_YW END) END                                 "+
	"                  ,'FM999990.99')) ARPU_YW,                                                                         "+
	"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END)=0               "+
	"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_KD_NUM END)                                "+
	"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_KD END) END                                 "+
	"                  ,'FM999990.99')) ARPU_KD,                                                                         "+
	"       TRIM('.' FROM TO_CHAR(CASE WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END)=0            "+
	"                THEN 0 ELSE SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SR_OTHER_NUM END)                             "+
	"                  /SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN LAST_ACCT_OTHER END) END                              "+
	"                  ,'FM999990.99')) ARPU_OTHER,                                                                      "+
	"       SUM(BIRTH_SR_YW) BIRTH_SR_YW,                                                                                "+
	"       SUM(BIRTH_SR_KD) BIRTH_SR_KD,                                                                                "+
	"       SUM(BIRTH_SR_OTHER) BIRTH_SR_OTHER,                                                                          "+
	"       SUM(BIRTH_COST_YW) BIRTH_COST_YW,                                                                            "+
	"       SUM(BIRTH_COST_KD) BIRTH_COST_KD,                                                                            "+
	"       SUM(BIRTH_COST_OTHER) BIRTH_COST_OTHER,                                                                      "+
	"       SUM(BIRTH_ML) BIRTH_ML,                                                                                      "+
	"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                              "+
	"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                          "+
	"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                  "+
	"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                              "+
	"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                    "+
	"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                                "+
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                                 "+
	"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                              "+
	"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                     "+
	"                      YYT_CODE,                                                                                     "+
	"                      YYT_NAME,                                                                                     "+
	"                      YYT_ADDR,                                                                                     "+
	"                      HQ_CHAN_CODE,                                                                                 "+
	"                      HQ_CHAN_NAME,                                                                                 "+
	"                      YYT_CREATE_TIME,                                                                              "+
	"                      BUSI_BEGIN_TIME,                                                                              "+
	"                      YYT_TYPE,                                                                                     "+
	"                      BUSI_MODE,                                                                                    "+
	"                      THIRD_ATTRI,                                                                                  "+
	"                      BUSI_NAME,                                                                                    "+
	"                      RENT_NO,                                                                                      "+
	"                      GROUP_ID_1,                                                                                   "+
	"                      GROUP_ID_1_NAME,                                                                              "+
	"                      UNIT_iD,                                                                                      "+
	"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
	"                       ORDER BY DEAL_DATE DESC)RN                "+
	"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                      "+
	              where1+
	"             )WHERE RN=1                                                                                            "+
	"             )T1                                                                                                    "+
	" ON (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                                               "+
	              where+
	" GROUP BY T1.UNIT_ID,                                                                                               "+
	"       T1.UNIT_NAME,                                                                                                "+
	"       T1.YYT_CODE,                                                                                                 "+
	"       T1.YYT_NAME,                                                                                                 "+
	"       T1.YYT_ADDR,                                                                                                 "+
	"       T1.HQ_CHAN_CODE,                                                                                             "+
	"       T1.HQ_CHAN_NAME,                                                                                             "+
	"       T1.YYT_CREATE_TIME,                                                                                          "+
	"       T1.BUSI_BEGIN_TIME,                                                                                          "+
	"       T1.YYT_TYPE,                                                                                                 "+
	"       T1.BUSI_MODE,                                                                                                "+
	"       T1.THIRD_ATTRI,                                                                                              "+
	"       T1.BUSI_NAME,                                                                                                "+
	"       T1.RENT_NO,                                                                                                  "+
	"       T1.GROUP_ID_1_NAME                                                                                           ";
}