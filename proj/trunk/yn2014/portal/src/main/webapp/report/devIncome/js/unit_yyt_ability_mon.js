var nowData = [];
var title=[["组织架构","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","业务受理量","毛利","其中：零售毛利","出账收入","成本合计"/*,"成本占收比"*/,"生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额"/*,"二次续费率（最近7个月入网用户（不含当月）截止目前续费情况）"*/],
           ["","","","","","","","","","","","","","","","","","","","","","","","数量","金额","数量","金额","数量","金额","","",""/*,""*/]];
var field=["YYT_MAN_NUM","YYT_DEV_NUM","YW_CHARGE_NUM","ACCT_NUM","YYT_ML","RETAIL_ML","CHARGE_SR","COST_SUM"/*,"COST_IN_SR_RATE"*/,"BIRTH_ML","TERMINAL_NUM","TERMINAL_MONEY","THREE_MON_TERM_NUM","THREE_MON_TERM_MONEY","ONE_YEAR_TERM_NUM","ONE_YEAR_TERM_MONEY","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT"/*,"SECOND_PAY_RATE"*/];
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
	var title=[["地市","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","业务受理量","毛利","其中：零售毛利","出账收入","成本合计"/*,"成本占收比"*/,"生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额"/*,"二次续费率（最近7个月入网用户（不含当月）截止目前续费情况）"*/],
	           ["","","","","","","","","","","","","","","","","","","","","","","","数量","金额","数量","金额","数量","金额","","",""/*,""*/]];
	var sql = getDownSql(where);
	var showtext = '云南联通营业厅效能分析汇总表' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function toRules(){
	var url = $("#ctx").val()+"/report/devIncome/jsp/rules.jsp?type=4";
	window.parent.openWindow("取数规则",null,url);
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
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                  "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM+GW_CHARGE_NUM END) YW_CHARGE_NUM,                "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                    "+
		"       SUM(YYT_ML) YYT_ML,                                                                                        "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                  "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                  "+
		"       SUM(COST_SUM) COST_SUM,                                                                                    "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                    "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                            "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                        "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                            "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                  "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                               "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                            "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                   "+
		"                      YYT_CODE,                                                                                   "+
		"                      YYT_NAME,                                                                                   "+
		"                      YYT_ADDR,                                                                                   "+
		"                      HQ_CHAN_CODE,                                                                               "+
		"                      HQ_CHAN_NAME,                                                                               "+
		"                      YYT_CREATE_TIME,                                                                            "+
		"                      BUSI_BEGIN_TIME,                                                                            "+
		"                      YYT_TYPE,                                                                                   "+
		"                      BUSI_MODE,                                                                                  "+
		"                      THIRD_ATTRI,                                                                                "+
		"                      BUSI_NAME,                                                                                  "+
		"                      RENT_NO,                                                                                    "+
		"                      GROUP_ID_1,                                                                                 "+
		"                      GROUP_ID_1_NAME,                                                                            "+
		"                      UNIT_iD,                                                                                    "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                    "+
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
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YYT_MAN_NUM END) YYT_MAN_NUM,                                  "+
		"       SUM(YYT_DEV_NUM) YYT_DEV_NUM,                                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM+GW_CHARGE_NUM END) YW_CHARGE_NUM,                "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                    "+
		"       SUM(YYT_ML) YYT_ML,                                                                                        "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                  "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                  "+
		"       SUM(COST_SUM) COST_SUM,                                                                                    "+
		"       SUM(BIRTH_ML) BIRTH_ML,                                                                                    "+
		"       SUM(TERMINAL_NUM) TERMINAL_NUM,                                                                            "+
		"       SUM(TERMINAL_MONEY) TERMINAL_MONEY,                                                                        "+
		"       SUM(THREE_MON_TERM_NUM) THREE_MON_TERM_NUM,                                                                "+
		"       SUM(THREE_MON_TERM_MONEY) THREE_MON_TERM_MONEY,                                                            "+
		"       SUM(ONE_YEAR_TERM_NUM) ONE_YEAR_TERM_NUM,                                                                  "+
		"       SUM(ONE_YEAR_TERM_MONEY) ONE_YEAR_TERM_MONEY,                                                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN BUSI_OWE_LEFT END) BUSI_OWE_LEFT,                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_OWE_LEFT END) SUBS_OWE_LEFT,                              "+
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN SUBS_PAY_LEFT END) SUBS_PAY_LEFT                               "+
		"  FROM PMRT.TAB_MRT_YYT_ABILITY_MON T0                                                                            "+
		"  LEFT JOIN (SELECT * FROM (SELECT   UNIT_NAME,                                                                   "+
		"                      YYT_CODE,                                                                                   "+
		"                      YYT_NAME,                                                                                   "+
		"                      YYT_ADDR,                                                                                   "+
		"                      HQ_CHAN_CODE,                                                                               "+
		"                      HQ_CHAN_NAME,                                                                               "+
		"                      YYT_CREATE_TIME,                                                                            "+
		"                      BUSI_BEGIN_TIME,                                                                            "+
		"                      YYT_TYPE,                                                                                   "+
		"                      BUSI_MODE,                                                                                  "+
		"                      THIRD_ATTRI,                                                                                "+
		"                      BUSI_NAME,                                                                                  "+
		"                      RENT_NO,                                                                                    "+
		"                      GROUP_ID_1,                                                                                 "+
		"                      GROUP_ID_1_NAME,                                                                            "+
		"                      UNIT_iD,                                                                                    "+
		"                      ROW_NUMBER()OVER(PARTITION BY HQ_CHAN_CODE "+
		"                       ORDER BY DEAL_DATE DESC)RN                "+
		"             FROM PMRT.TAB_MRT_YYT_ABILITY_MON                                                                    "+
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
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM+GW_CHARGE_NUM END) YW_CHARGE_NUM,                  "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
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
		"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM+GW_CHARGE_NUM END) YW_CHARGE_NUM,                  "+
		"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
		"       SUM(YYT_ML) YYT_ML,                                                                                          "+
		"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
		"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
		"       SUM(COST_SUM) COST_SUM,                                                                                      "+
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
	"       SUM(CASE WHEN DEAL_DATE ='"+endDate+"' THEN YW_CHARGE_NUM+GW_CHARGE_NUM END) YW_CHARGE_NUM,                  "+
	"       SUM(ACCT_NUM) ACCT_NUM,                                                                                      "+
	"       SUM(YYT_ML) YYT_ML,                                                                                          "+
	"       SUM(RETAIL_ML) RETAIL_ML,                                                                                    "+
	"       SUM(CHARGE_SR) CHARGE_SR,                                                                                    "+
	"       SUM(COST_SUM) COST_SUM,                                                                                      "+
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
