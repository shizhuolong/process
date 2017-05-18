var field=["UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_STATE","HQ_ZY","THIRD_TYPE","MAN_COUNT","DEV_COUNT","CHARGE_YW","CHARGE_GW","CHARGE_TOTAL","ACC_NUM","DS_MONEY","DS_SVR_RATE","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","MAN_COST_CONT","MAN_COST_JM","MAN_COST_FINACE","MAN_COST_ALL","YJ_ALL","HQ_QDBT","TERM_BT","GT_PLACE_RENT","HQ_RENT","HQ_ZX_FEE","KHJR_AMOUNT","KCB_COST","WART_NUM","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","COST_RATE","SR_DETAIL_YW","SR_DETAIL_ZX","SR_DETAIL_KD","SR_DETAIL_GH","SR_DETAIL_OTHER","SR_DETAIL_SUM","YF_MON_YW","YF_MON_ZX","YF_MON_KD","YF_MON_GH","YF_MON_OTHER","YF_MON_SUM","YJ_DEV","YJ_ACC","YJ_BOT","COMMFEE_ZSHB","COMMFEE_MOB_ZSHB","COMMFEE_ZZX_ZSHB","COMMFEE_KD_ZSHB","COMMFEE_NET_ZSHB","COMMFEE_DEV_ZSHB","COMMFEE_ACC_ZSHB","COMMFEE_BOT_ZSHB","SUBS_OWE","SUBS_PAY","SECOND_PAY","IS_TY","IS_SOCIAL"];
var title=[["组织架构","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道状态","渠道专业","三级属性","人数","发展用户数","出账用户数","","","业务受理量","代收费金额","代收服务费占代收金额比","毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比(%)","其中：出账收入明细","","","","","","其中：佣金明细分类一","","","","","","其中：佣金明细分类二","","","其中：佣金占收比分类一","","","","","其中：佣金占收比分类二","","","用户欠费","用户预存款","二次续费率","是否自建他营","是否社会化合作"],
           ["","","","","","","","","","","移网","固网","合计","","","","","","","","合同制","紧密型","财务列账","小计","","","","","","","","","","","","","","","","","","","","","移网","专线","宽带","固话","其他","小计","移网","专线","宽带","固话","不可分摊","合计","按发展渠道","按受理渠道","BOT建设方","总佣金占收比","移网","专线","宽带","固话","发展渠道","受理渠道","BOT建设方","","","","",""]];
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
			var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					if(regionCode!=''){//有查询条件时等于点击市
						where+=" AND GROUP_ID_1='"+regionCode+"'";
						level=3;
					}else{
						where+=" AND GROUP_ID_0='"+code+"'";
						level=0;
					}
				}else if(orgLevel==3){//点击市
					if($("#orgLevel").val()==1&&regionCode!=''){//省级有地市查询条件时点击营服
						where+=" AND UNIT_ID='"+code+"'";
						level=4;
					}else{
						where+=" AND GROUP_ID_1='"+code+"'";
						level=0;
					}
				}else if(orgLevel==4){//点击营服
					if($("#orgLevel").val()==1&&regionCode!=''){//有地市查询条件时渠道
						return {data:[],extra:{}}
					}else{
						where+=" AND UNIT_ID='"+code+"'";
						level=0;
					}
				}else{
					return {data:[],extra:{}}
				}
				
			    if(hqChanName!=''){//渠道查询条件不为空，展示渠道，不能下钻
			    	return {data:[],extra:{}}
			    }
				sql=getSql(orgLevel,where,level);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					if(regionCode!=''){//有查询条件时等于点击市
						where+=" AND GROUP_ID_1='"+regionCode+"'";
						level=2;
					}else{
						where+=" AND GROUP_ID_0=86000";
						level=0;
					}
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					level=0;
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID IN("+_unit_relation(code)+")";
					level=0;
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where,level);
				if(hqChanName!=''){//渠道查询条件不为空，展示渠道，不能下钻
					sql=getSql(4,where,0);
			    }
				orgLevel++;
			}
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

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
	
	if (orgLevel == 1) {//省
		where += " AND GROUP_ID_0=86000";
	} else if(orgLevel == 2){//市
		where += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		where+=" AND HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	where+=" AND LEV=4";
	var field1=["UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_STATE","HQ_ZY","THIRD_TYPE","MAN_COUNT","DEV_COUNT","CHARGE_YW","CHARGE_GW"];
	var field2=["ACC_NUM","DS_MONEY","DS_SVR_RATE","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","MAN_COST_CONT","MAN_COST_JM","MAN_COST_FINACE","MAN_COST_ALL","YJ_ALL","HQ_QDBT","TERM_BT","GT_PLACE_RENT","HQ_RENT","HQ_ZX_FEE","KHJR_AMOUNT","KCB_COST","WART_NUM","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","COST_RATE","SR_DETAIL_YW","SR_DETAIL_ZX","SR_DETAIL_KD","SR_DETAIL_GH","SR_DETAIL_OTHER","SR_DETAIL_SUM","YF_MON_YW","YF_MON_ZX","YF_MON_KD","YF_MON_GH","YF_MON_OTHER","YF_MON_SUM","YJ_DEV","YJ_ACC","YJ_BOT","COMMFEE_ZSHB","COMMFEE_MOB_ZSHB","COMMFEE_ZZX_ZSHB","COMMFEE_KD_ZSHB","COMMFEE_NET_ZSHB","COMMFEE_DEV_ZSHB","COMMFEE_ACC_ZSHB","COMMFEE_BOT_ZSHB","SUBS_OWE","SUBS_PAY","SECOND_PAY","IS_TY","IS_SOCIAL"];
	var sql = " SELECT GROUP_ID_1_NAME,"+field1.join(",")+",(CHARGE_YW+CHARGE_GW) CHARGE_TOTAL,"+field2.join(",")+" FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	var showtext = '云南联通渠道效能分析明细表-' + startDate+"-"+endDate;
	var title=[["地市","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道状态","渠道专业","三级属性","人数","发展用户数","出账用户数","","","业务受理量","代收费金额","代收服务费占代收金额比","毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","成本占收比(%)","其中：出账收入明细","","","","","","其中：佣金明细分类一","","","","","","其中：佣金明细分类二","","","其中：佣金占收比分类一","","","","","其中：佣金占收比分类二","","","用户欠费","用户预存款","二次续费率","是否自建他营","是否社会化合作"],
	           ["","","","","","","","","","","移网","固网","合计","","","","","","","","合同制","紧密型","财务列账","小计","","","","","","","","","","","","","","","","","","","","","移网","专线","宽带","固话","其他","小计","移网","专线","宽带","固话","不可分摊","合计","按发展渠道","按受理渠道","BOT建设方","总佣金占收比","移网","专线","宽带","固话","发展渠道","受理渠道","BOT建设方","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,level){
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
	if(regionCode!=''){
		if(level!=0){
			orgLevel=level;
		}
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		where+=" AND HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	where+=" AND LEV="+orgLevel;
	var field1=["UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_STATE","HQ_ZY","THIRD_TYPE","MAN_COUNT","DEV_COUNT","CHARGE_YW","CHARGE_GW"];
	var field2=["ACC_NUM","DS_MONEY","DS_SVR_RATE","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","MAN_COST_CONT","MAN_COST_JM","MAN_COST_FINACE","MAN_COST_ALL","YJ_ALL","HQ_QDBT","TERM_BT","GT_PLACE_RENT","HQ_RENT","HQ_ZX_FEE","KHJR_AMOUNT","KCB_COST","WART_NUM","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","COST_RATE","SR_DETAIL_YW","SR_DETAIL_ZX","SR_DETAIL_KD","SR_DETAIL_GH","SR_DETAIL_OTHER","SR_DETAIL_SUM","YF_MON_YW","YF_MON_ZX","YF_MON_KD","YF_MON_GH","YF_MON_OTHER","YF_MON_SUM","YJ_DEV","YJ_ACC","YJ_BOT","COMMFEE_ZSHB","COMMFEE_MOB_ZSHB","COMMFEE_ZZX_ZSHB","COMMFEE_KD_ZSHB","COMMFEE_NET_ZSHB","COMMFEE_DEV_ZSHB","COMMFEE_ACC_ZSHB","COMMFEE_BOT_ZSHB","SUBS_OWE","SUBS_PAY","SECOND_PAY","IS_TY","IS_SOCIAL"];
	if(orgLevel==1){
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,"+field1.join(",")+",(CHARGE_YW+CHARGE_GW) CHARGE_TOTAL,"+field2.join(",")+" FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON "+where;
	}else if(orgLevel==2){
		return " SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,"+field1.join(",")+",(CHARGE_YW+CHARGE_GW) CHARGE_TOTAL,"+field2.join(",")+" FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON "+where+" ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		return " SELECT UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,"+field1.join(",")+",(CHARGE_YW+CHARGE_GW) CHARGE_TOTAL,"+field2.join(",")+" FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
	}else if(orgLevel==4){
		return " SELECT HQ_CHAN_NAME ROW_NAME,"+field1.join(",")+",(CHARGE_YW+CHARGE_GW) CHARGE_TOTAL,"+field2.join(",")+" FROM PMRT.VIEW_MRT_HQ_ABILITY_DETAIL_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	}
  }
