var field=["UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_STATE","HQ_ZY","THIRD_TYPE","IS_TY","IS_SOCIAL","IS_DS","MAN_COUNT","DEV_2G_NUM","DEV_3G_NUM","DEV_4G_NUM","DEV_KD_NUM","DEV_ZZX_NUM","DEV_NET_NUM","DEV_OTHER_NUM","DEV_COUNT","CHARGE_YW","CHARGE_GW","CHARGE_TOTAL","ACC_NUM","DS_MONEY","DS_SVR_RATE","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","MAN_COST_CONT","MAN_COST_JM","MAN_COST_FINACE","MAN_COST_ALL","YJ_ALL","HQ_QDBT","TERM_BT","GT_PLACE_RENT","HQ_RENT","HQ_ZX_FEE","KHJR_AMOUNT","KCB_COST","WART_NUM","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","COST_RATE","SR_DETAIL_YW","SR_DETAIL_ZX","SR_DETAIL_KD","SR_DETAIL_GH","SR_DETAIL_OTHER","SR_DETAIL_SUM","YF_MON_YW","YF_MON_ZX","YF_MON_KD","YF_MON_GH","YF_MON_OTHER","YF_MON_SUM","YJ_DEV","YJ_ACC","YJ_BOT","YJ_TWO_ALL","COMMFEE_MOB_ZSHB","COMMFEE_ZZX_ZSHB","COMMFEE_KD_ZSHB","COMMFEE_NET_ZSHB","COMMFEE_ZSHB","COMMFEE_DEV_ZSHB","COMMFEE_ACC_ZSHB","COMMFEE_BOT_ZSHB","COMMFEE_ALL_ZSB","SUBS_OWE","SUBS_PAY","SECOND_PAY","COMM_STOP"];
var title=[["组织架构","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道状态","渠道专业","三级属性","是否自建他营","是否社会化合作","是否代收费点(1是 0不是)","人数","发展用户数","","","","","","","","出账用户数","","","业务受理量","代收费金额","代收服务费占代收金额比","毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比(%)","其中：出账收入明细","","","","","","其中：佣金明细分类一","","","","","","其中：佣金明细分类二","","","","其中：佣金占收比分类一","","","","","其中：佣金占收比分类二","","","","用户欠费","用户预存款","二次续费率","终止清算佣金"],
           ["","","","","","","","","","","","","2G发展量","3G发展量","4G发展量","宽带发展量","专租线发展量","固话发展量","其他发展量","合计","移网","固网","合计","","","","","","","","合同制","紧密型","财务列账","小计","","","","","","","","","","","","","","","","","","","","","移网","专线","宽带","固话","其他","小计","移网","专线","宽带","固话","不可分摊","合计","按发展渠道","按受理渠道","BOT建设方","合计","移网","专线","宽带","固话","总佣金占收比","发展渠道","受理渠道","BOT建设方","合计","","","",""]];
$(function(){
	var maxDate=getMaxDate("PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		/*$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();*/
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME"].concat(field),
		css:[{gt:7,css:LchReport.RIGHT_ALIGN}, {array:[12,19,23,49,55],css:LchReport.NORMAL_STYLE}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var regionCode=$("#regionCode").val();
			var hqChanName=$("#hqChanName").val();
			var hq_zy=$("#hq_zy").val();
			var where=" WHERE LEV=4 AND DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					
				}else if(orgLevel==3){//点击市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服
					where+=" AND T1.UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where);
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服
					where+=" AND T1.UNIT_ID IN("+_unit_relation(code)+")";
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where);
			}
			orgLevel++;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	/*$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();*/
	///////////////////////////////////////////
});

function toRules(){
	var url = $("#ctx").val()+"/report/devIncome/jsp/rules.jsp?type=2";
	window.parent.openWindow("取数规则",null,url);
}

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var code=$("#code").val();
	var where=" WHERE LEV=4 AND DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
	var hqChanCode=$("#hqChanCode").val();
	var hq_zy=$("#hq_zy").val();
	
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
	if(hqChanName!=''){
		where+=" AND T1.HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if(hq_zy!=''){
		where+=" AND T1.HQ_ZY = '"+hq_zy+"'";
	}
	var sql = "SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.HQ_CHAN_CODE,T1.HQ_CHAN_NAME,T1.BUSI_BEGIN_TIME,T1.HQ_STATE,T1.HQ_ZY,T1.THIRD_TYPE,T1.IS_TY,T1.IS_SOCIAL,T0.IS_DS,"+getSumSql(4)+where+" GROUP BY T1.HQ_CHAN_NAME,T1.UNIT_NAME,T1.HQ_CHAN_CODE,T1.HQ_CHAN_NAME,T1.BUSI_BEGIN_TIME,T1.HQ_STATE,T1.HQ_ZY,T1.THIRD_TYPE,T1.IS_TY,T1.IS_SOCIAL,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T0.IS_DS ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HQ_CHAN_CODE";
	var showtext = '云南联通渠道效能分析明细表-' + startDate+"-"+endDate;
	var title=[["地市","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道状态","渠道专业","三级属性","是否自建他营","是否社会化合作","是否代收费点(1是 0不是)","人数","发展用户数","","","","","","","","出账用户数","","","业务受理量","代收费金额","代收服务费占代收金额比","毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比(%)","其中：出账收入明细","","","","","","其中：佣金明细分类一","","","","","","其中：佣金明细分类二","","","","其中：佣金占收比分类一","","","","","其中：佣金占收比分类二","","","","用户欠费","用户预存款","二次续费率","终止清算佣金"],
	           ["","","","","","","","","","","","","2G发展量","3G发展量","4G发展量","宽带发展量","专租线发展量","固话发展量","其他发展量","合计","移网","固网","合计","","","","","","","","合同制","紧密型","财务列账","小计","","","","","","","","","","","","","","","","","","","","","移网","专线","宽带","固话","其他","小计","移网","专线","宽带","固话","不可分摊","合计","按发展渠道","按受理渠道","BOT建设方","合计","移网","专线","宽带","固话","总佣金占收比","发展渠道","受理渠道","BOT建设方","合计","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
	var hqChanCode=$("#hqChanCode").val();
	var hq_zy=$("#hq_zy").val();
	if(regionCode!=''){
		where+=" AND T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		where+=" AND T1.HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T1.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if(hq_zy!=''){
		where+=" AND T1.HQ_ZY = '"+hq_zy+"'";
	}
	if(orgLevel==1){
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' UNIT_NAME,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' BUSI_BEGIN_TIME,'--' HQ_STATE,'--' HQ_ZY,'--' THIRD_TYPE,'--' IS_TY,'--' IS_SOCIAL,'--' IS_DS,"+getSumSql(orgLevel)+where;
	}else if(orgLevel==2){
		return " SELECT T1.GROUP_ID_1_NAME ROW_NAME,T1.GROUP_ID_1 ROW_ID,'--' UNIT_NAME,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' BUSI_BEGIN_TIME,'--' HQ_STATE,'--' HQ_ZY,'--' THIRD_TYPE,'--' IS_TY,'--' IS_SOCIAL,'--' IS_DS,"+getSumSql(orgLevel)+where+" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME ORDER BY T1.GROUP_ID_1";
	}else if(orgLevel==3){
		return " SELECT T1.UNIT_NAME ROW_NAME,T1.UNIT_ID ROW_ID,'--' UNIT_NAME,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' BUSI_BEGIN_TIME,'--' HQ_STATE,'--' HQ_ZY,'--' THIRD_TYPE,'--' IS_TY,'--' IS_SOCIAL,'--' IS_DS,"+getSumSql(orgLevel)+where+" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T1.UNIT_NAME ORDER BY T1.GROUP_ID_1,T1.UNIT_ID";
	}else if(orgLevel==4){
		return " SELECT T1.HQ_CHAN_NAME ROW_NAME,T1.UNIT_NAME,T1.HQ_CHAN_CODE,T1.HQ_CHAN_NAME,T1.BUSI_BEGIN_TIME,T1.HQ_STATE,T1.HQ_ZY,T1.THIRD_TYPE,T1.IS_TY,T1.IS_SOCIAL,T0.IS_DS,"+getSumSql(orgLevel)+where+" GROUP BY T1.HQ_CHAN_NAME,T1.UNIT_NAME,T1.HQ_CHAN_CODE,T1.HQ_CHAN_NAME,T1.BUSI_BEGIN_TIME,T1.HQ_STATE,T1.HQ_ZY,T1.THIRD_TYPE,T1.IS_TY,T1.IS_SOCIAL,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T0.IS_DS ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HQ_CHAN_CODE";
	}
  }

function getSumSql(level){
	var endDate=$("#endDate").val();
	var sql= "SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN MAN_COUNT END ) MAN_COUNT,                              "+
	"SUM(T0.DEV_2G_NUM) DEV_2G_NUM,      "+
	"SUM(T0.DEV_3G_NUM) DEV_3G_NUM,      "+
	"SUM(T0.DEV_4G_NUM) DEV_4G_NUM,      "+
	"SUM(T0.DEV_KD_NUM) DEV_KD_NUM,      "+
	"SUM(T0.DEV_ZZX_NUM) DEV_ZZX_NUM,     "+
	"SUM(T0.DEV_NET_NUM) DEV_NET_NUM,     "+
	"SUM(T0.DEV_OTHER_NUM) DEV_OTHER_NUM,"+
	"SUM(T0.DEV_COUNT) DEV_COUNT,         "+
	"       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN CHARGE_YW END) CHARGE_YW,                        "+
	"       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN CHARGE_GW END) CHARGE_GW,                        "+
	"       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN CHARGE_YW + CHARGE_GW END) CHARGE_TOTAL,         "+
	"       SUM(ACC_NUM) ACC_NUM,                                                                       "+
	"       SUM(DS_MONEY) DS_MONEY,                                                                     "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(DS_MONEY, 0)) = 0 THEN                                                       "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM                                                                            "+
	"               TO_CHAR(SUM(NVL(DS_FEE, 0)) * 100 / SUM(NVL(DS_MONEY, 0)),                          "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' DS_SVR_RATE,                                                                     "+
	"       SUM(HQ_ML) HQ_ML,                                                                           "+
	"       SUM(HQ_SAL_ML) HQ_SAL_ML,                                                                   "+
	"       SUM(HQ_CHARGE_SR) HQ_CHARGE_SR,                                                             "+
	"       SUM(HQ_COST_ALL) HQ_COST_ALL,                                                               "+
	"       SUM(MAN_COST_CONT) MAN_COST_CONT,                                                           "+
	"       SUM(MAN_COST_JM) MAN_COST_JM,                                                               "+
	"       SUM(MAN_COST_FINACE) MAN_COST_FINACE,                                                       "+
	"       SUM(MAN_COST_ALL) MAN_COST_ALL,                                                             "+
	"       SUM(YJ_ALL) YJ_ALL,                                                                         "+
	"       SUM(HQ_QDBT) HQ_QDBT,                                                                       "+
	"       SUM(TERM_BT) TERM_BT,                                                                       "+
	"       SUM(GT_PLACE_RENT) GT_PLACE_RENT,                                                           "+
	"       SUM(HQ_RENT) HQ_RENT,                                                                       "+
	"       SUM(HQ_ZX_FEE) HQ_ZX_FEE,                                                                   "+
	"       SUM(KHJR_AMOUNT) KHJR_AMOUNT,                                                               "+
	"       SUM(KCB_COST) KCB_COST,                                                                     "+
	"       SUM(WART_NUM) WART_NUM,                                                                     "+
	"       SUM(ADV_FEE) ADV_FEE,                                                                       "+
	"       SUM(YWYP_FEE) YWYP_FEE,                                                                     "+
	"       SUM(CH_PRO_PRE) CH_PRO_PRE,                                                                 "+
	"       SUM(SALE_DETAIL_SR) SALE_DETAIL_SR,                                                         "+
	"       SUM(SALE_DETAIL_COST) SALE_DETAIL_COST,                                                     "+
	"       SUM(BG_FEE) BG_FEE,                                                                         "+
	"       SUM(CAR_FEE) CAR_FEE,                                                                       "+
	"       SUM(ZD_FEE) ZD_FEE,                                                                         "+
	"       SUM(CL_FEE) CL_FEE,                                                                         "+
	"       SUM(TX_FEE) TX_FEE,                                                                         "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM                                                                            "+
	"               TO_CHAR(SUM((MAN_COST_ALL + YJ_ALL + HQ_QDBT + TERM_BT +                            "+
	"                           GT_PLACE_RENT + HQ_RENT + HQ_ZX_FEE +                                   "+
	"                           KHJR_AMOUNT + KCB_COST + WART_NUM + ADV_FEE +                           "+
	"                           YWYP_FEE + CH_PRO_PRE + SALE_DETAIL_SR +                                "+
	"                           SALE_DETAIL_COST + BG_FEE + CAR_FEE + ZD_FEE +                          "+
	"                           CL_FEE + TX_FEE)) * 100 /                                               "+
	"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                  "+
	"                       'FM9999990.99'))                                                            "+
	"       END || '%' COST_RATE,                                                                       "+
	"       SUM(SR_DETAIL_YW) SR_DETAIL_YW,                                                             "+
	"       SUM(SR_DETAIL_ZX) SR_DETAIL_ZX,                                                             "+
	"       SUM(SR_DETAIL_KD) SR_DETAIL_KD,                                                             "+
	"       SUM(SR_DETAIL_GH) SR_DETAIL_GH,                                                             "+
	"       SUM(SR_DETAIL_OTHER) SR_DETAIL_OTHER,                                                       "+
	"       SUM(SR_DETAIL_SUM) SR_DETAIL_SUM,                                                           "+
	"       SUM(YF_MON_YW) YF_MON_YW,                                                                   "+
	"       SUM(YF_MON_ZX) YF_MON_ZX,                                                                   "+
	"       SUM(YF_MON_KD) YF_MON_KD,                                                                   "+
	"       SUM(YF_MON_GH) YF_MON_GH,                                                                   "+
	"       SUM(YF_MON_OTHER) YF_MON_OTHER,                                                             "+
	"       SUM(YF_MON_SUM) YF_MON_SUM,                                                                 "+
	"       SUM(YJ_DEV) YJ_DEV,                                                                         "+
	"       SUM(YJ_ACC) YJ_ACC,                                                                         "+
	"       SUM(YJ_BOT) YJ_BOT,                                                                         "+
	"       SUM(YJ_TWO_ALL) YJ_TWO_ALL,                                                                 "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(SR_DETAIL_YW, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YF_MON_YW, 0)) * 100 /                                     "+
	"                       SUM(NVL(SR_DETAIL_YW, 0)),                                                  "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_MOB_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(SR_DETAIL_ZX, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YF_MON_ZX, 0)) * 100 /                                     "+
	"                       SUM(NVL(SR_DETAIL_ZX, 0)),                                                  "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_ZZX_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(SR_DETAIL_KD, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YF_MON_KD, 0)) * 100 /                                     "+
	"                       SUM(NVL(SR_DETAIL_KD, 0)),                                                  "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_KD_ZSHB,                                                                 "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(SR_DETAIL_GH, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YF_MON_GH, 0)) * 100 /                                     "+
	"                       SUM(NVL(SR_DETAIL_GH, 0)),                                                  "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_NET_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(SR_DETAIL_SUM, 0)) = 0 THEN                                                  "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YF_MON_SUM, 0)) * 100 /                                    "+
	"                       SUM(NVL(SR_DETAIL_SUM, 0)),                                                 "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_ZSHB,                                                                    "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM                                                                            "+
	"               TO_CHAR(SUM(NVL(YJ_DEV, 0)) * 100 / SUM(NVL(HQ_CHARGE_SR, 0)),                      "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_DEV_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM                                                                            "+
	"               TO_CHAR(SUM(NVL(YJ_ACC, 0)) * 100 / SUM(NVL(HQ_CHARGE_SR, 0)),                      "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_ACC_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM                                                                            "+
	"               TO_CHAR(SUM(NVL(YJ_BOT, 0)) * 100 / SUM(NVL(HQ_CHARGE_SR, 0)),                      "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_BOT_ZSHB,                                                                "+
	"       CASE                                                                                        "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) = 0 THEN                                                   "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(YJ_TWO_ALL, 0)) * 100 /                                    "+
	"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                  "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' COMMFEE_ALL_ZSB,                                                                 "+
	"       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SUBS_OWE END) SUBS_OWE,                          "+
	"       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN SUBS_PAY END) SUBS_PAY,                          "+
	"       CASE                                                                                        "+
	"         WHEN SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN NVL(INNET_7_NUM, 0)END) = 0 THEN          "+
	"          '0.00'                                                                                   "+
	"         ELSE                                                                                      "+
	"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN NVL(XF_7_NUM, 0) END ) * 100 / "+
	"                       SUM(CASE WHEN DEAL_DATE='"+endDate+"' THEN NVL(INNET_7_NUM, 0)END),                "+
	"                       'FM999990.99'))                                                             "+
	"       END || '%' SECOND_PAY,SUM(T0.COMM_STOP) COMM_STOP                                                                       "+
	"  FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON T0                                                        ";
	
	sql+="LEFT JOIN (SELECT GROUP_ID_1,GROUP_ID_1_NAME," +
		"                      UNIT_ID,UNIT_NAME        "+
		"                     ,HQ_CHAN_CODE              "+
		"                     ,HQ_CHAN_NAME              "+
		"                     ,BUSI_BEGIN_TIME           "+
		"                     ,HQ_STATE                  "+
		"                     ,HQ_ZY                     "+
		"                     ,THIRD_TYPE                "+
		"                     ,IS_TY                     "+
		"                     ,IS_SOCIAL                 "+
		"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T"+
		"              WHERE T.DEAL_DATE='"+endDate+"'   "+
		"              )T1                               "+
		"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)       ";
	return sql;
}