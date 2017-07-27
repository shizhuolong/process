var field=["UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","BUSI_BEGIN_TIME","HQ_STATE","HQ_ZY","THIRD_TYPE","DEV_COUNT","CHARGE_NUM","ACC_NUM_NXS","HQ_ML","HQ_SAL_ML","HQ_CHARGE_SR","HQ_COST_ALL","COST_RATE","SUBS_OWE","SUBS_PAY","SECOND_PAY","IS_TY","IS_SOCIAL"];
var title=[["组织架构","所属基层单元","渠道编码","渠道名称","开始合作日期","渠道状态","渠道专业","三级属性","发展用户数","出账用户数","业务受理量(笔)(不含销售和收费)","毛利","其中：零售毛利","出账收入","成本合计","成本占收比","用户欠费","用户预存款余额","二次续费率","是否自建他营","是否社会化合作"]];
$(function(){
	var maxDate=getMaxDate("PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME"].concat(field),
		css:[{gt:7,css:LchReport.RIGHT_ALIGN}],
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
			var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					if(regionCode!=''){//有查询条件时等于点击市
						where+=" AND T1.GROUP_ID_1='"+regionCode+"'";
						level=3;
					}else{
						level=0;
					}
				}else if(orgLevel==3){//点击市
					if($("#orgLevel").val()==1&&regionCode!=''){//省级有地市查询条件时点击营服
						where+=" AND T1.UNIT_ID='"+code+"'";
						level=4;
					}else{
						where+=" AND T1.GROUP_ID_1='"+code+"'";
						level=0;
					}
				}else if(orgLevel==4){//点击营服
					if($("#orgLevel").val()==1&&regionCode!=''){//有地市查询条件时渠道
						return {data:[],extra:{}}
					}else{
						where+=" AND T1.UNIT_ID='"+code+"'";
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
						where+=" AND T1.GROUP_ID_1='"+regionCode+"'";
						level=2;
					}else{
						level=0;
					}
				}else if(orgLevel==2){//市
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					level=0;
				}else if(orgLevel==3){//营服
					where+=" AND T1.UNIT_ID IN("+_unit_relation(code)+")";
					level=0;
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where,level);
				if(hqChanName!=''||hq_zy!=''){//渠道或渠道专业查询条件不为空，展示渠道，不能下钻
					sql=getSql(4,where,0);
					orgLevel=4;
			    }
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
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
	where+=" AND LEV=4";
	var sql = getDownSql(where);
	var showtext = '云南联通渠道效能分析汇总表-' + startDate+"-"+endDate;
	var title=[["地市","所属基层单元","渠道编码","渠道名称","开始合作日期","渠道状态","渠道专业","三级属性","发展用户数","出账用户数","业务受理量(笔)(不含销售和收费)","毛利","其中：零售毛利","出账收入","成本合计","成本占收比","用户欠费","用户预存款余额","二次续费率","是否自建他营","是否社会化合作"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,level){//level区分是下钻还是查询
	var regionCode=$("#regionCode").val();
	var hqChanName=$("#hqChanName").val();
	var hqChanCode=$("#hqChanCode").val();
	var hq_zy=$("#hq_zy").val();
	if(regionCode!=''){
		if(level!=0){
			orgLevel=level;
		}
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
	return getSumSql(orgLevel,where);
  }

function getSumSql(level,where){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	if(level==1){
		return "SELECT                                                                               "+
		"       '云南省' ROW_NAME,                                                            "+
		"       '86000' ROW_ID,                                                               "+
		"       '--' UNIT_NAME,                                                               "+
		"       '--' HQ_CHAN_CODE,                                                            "+
		"       '--' HQ_CHAN_NAME,                                                            "+
		"       '--' BUSI_BEGIN_TIME,                                                         "+
		"       '--' HQ_STATE,                                                                "+
		"       '--' HQ_ZY,                                                                   "+
		"       '--' THIRD_TYPE,                                                              "+
		"SUM(NVL(DEV_COUNT, 0)) DEV_COUNT,                                                                 "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(CHARGE_NUM, 0)END) CHARGE_NUM,                "+
		"       SUM(NVL(ACC_NUM_NXS, 0)) ACC_NUM_NXS,                                                      "+
		"       SUM(NVL(HQ_ML, 0)) HQ_ML,                                                                  "+
		"       SUM(NVL(HQ_SAL_ML, 0)) HQ_SAL_ML,                                                          "+
		"       SUM(NVL(HQ_CHARGE_SR, 0)) HQ_CHARGE_SR,                                                    "+
		"       SUM(NVL(HQ_COST_ALL, 0)) HQ_COST_ALL,                                                      "+
		"       CASE                                                                                       "+
		"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) <> 0 THEN                                                 "+
		"          TRIM('.' FROM TO_CHAR(SUM(NVL(HQ_COST_ALL, 0)) * 100 /                                  "+
		"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                 "+
		"                       'FM9999990.99'))                                                           "+
		"       END || '%' COST_RATE,                                                                      "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_OWE, 0) END) SUBS_OWE,                   "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_PAY, 0) END) SUBS_PAY,                   "+
		"       CASE                                                                                       "+
		"         WHEN SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END) = 0 THEN           "+
		"          '0.00'                                                                                  "+
		"         ELSE                                                                                     "+
		"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(XF_7_NUM, 0)END) * 100 /  "+
		"                       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END),               "+
		"                       'FM999990.99'))                                                            "+
		"       END || '%' SECOND_PAY,                                                                     "+
		"        '--' IS_TY,                                                                                    "+
		"        '--' IS_SOCIAL                                                                                 "+
		"  FROM PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON T0                                                        "+
		"  LEFT JOIN  (SELECT  GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME                                                                   "+
		"                     ,HQ_CHAN_CODE                                                                "+
		"                     ,HQ_CHAN_NAME                                                                "+
		"                     ,BUSI_BEGIN_TIME                                                             "+
		"                     ,HQ_STATE                                                                    "+
		"                     ,HQ_ZY                                                                       "+
		"                     ,THIRD_TYPE                                                                  "+
		"                     ,IS_TY                                                                       "+
		"                     ,IS_SOCIAL                                                                   "+
		"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T                                                  "+
		"              WHERE T.DEAL_DATE='"+endDate+"'                                                     "+
		"              )T1                                                                                 "+
		"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                         "+ 
		       where+
		" AND LEV=4";
	}else if(level==2){
		return "SELECT                                                                        "+
		"       T1.GROUP_ID_1_NAME ROW_NAME,                                                     "+
		"       T1.GROUP_ID_1 ROW_ID,                                                            "+
		"       '--' UNIT_NAME,                                                               "+
		"       '--' HQ_CHAN_CODE,                                                            "+
		"       '--' HQ_CHAN_NAME,                                                            "+
		"       '--' BUSI_BEGIN_TIME,                                                         "+
		"       '--' HQ_STATE,                                                                "+
		"       '--' HQ_ZY,                                                                   "+
		"       '--' THIRD_TYPE,                                                              "+
		"SUM(NVL(DEV_COUNT, 0)) DEV_COUNT,                                                                 "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(CHARGE_NUM, 0)END) CHARGE_NUM,                "+
		"       SUM(NVL(ACC_NUM_NXS, 0)) ACC_NUM_NXS,                                                      "+
		"       SUM(NVL(HQ_ML, 0)) HQ_ML,                                                                  "+
		"       SUM(NVL(HQ_SAL_ML, 0)) HQ_SAL_ML,                                                          "+
		"       SUM(NVL(HQ_CHARGE_SR, 0)) HQ_CHARGE_SR,                                                    "+
		"       SUM(NVL(HQ_COST_ALL, 0)) HQ_COST_ALL,                                                      "+
		"       CASE                                                                                       "+
		"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) <> 0 THEN                                                 "+
		"          TRIM('.' FROM TO_CHAR(SUM(NVL(HQ_COST_ALL, 0)) * 100 /                                  "+
		"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                 "+
		"                       'FM9999990.99'))                                                           "+
		"       END || '%' COST_RATE,                                                                      "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_OWE, 0) END) SUBS_OWE,                   "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_PAY, 0) END) SUBS_PAY,                   "+
		"       CASE                                                                                       "+
		"         WHEN SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END) = 0 THEN           "+
		"          '0.00'                                                                                  "+
		"         ELSE                                                                                     "+
		"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(XF_7_NUM, 0)END) * 100 /  "+
		"                       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END),               "+
		"                       'FM999990.99'))                                                            "+
		"       END || '%' SECOND_PAY,                                                                     "+
		"        '--' IS_TY,                                                                                    "+
		"        '--' IS_SOCIAL                                                                                 "+
		"  FROM PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON T0                                                        "+
		"  LEFT JOIN  (SELECT  GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME                                                                   "+
		"                     ,HQ_CHAN_CODE                                                                "+
		"                     ,HQ_CHAN_NAME                                                                "+
		"                     ,BUSI_BEGIN_TIME                                                             "+
		"                     ,HQ_STATE                                                                    "+
		"                     ,HQ_ZY                                                                       "+
		"                     ,THIRD_TYPE                                                                  "+
		"                     ,IS_TY                                                                       "+
		"                     ,IS_SOCIAL                                                                   "+
		"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T                                                  "+
		"              WHERE T.DEAL_DATE='"+endDate+"'                                                     "+
		"              )T1                                                                                 "+
		"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                         "+ 
		       where+
		" AND LEV=4"+
		" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME                                                 ";
	}else if(level==3){
		return "SELECT                                                                         "+
		"       T1.UNIT_NAME ROW_NAME,                                                            "+
		"       T1.UNIT_ID ROW_ID,                                                                "+
		"       '--' UNIT_NAME,                                                                "+
		"       '--' HQ_CHAN_CODE,                                                             "+
		"       '--' HQ_CHAN_NAME,                                                             "+
		"       '--' BUSI_BEGIN_TIME,                                                          "+
		"       '--' HQ_STATE,                                                                 "+
		"       '--' HQ_ZY,                                                                    "+
		"       '--' THIRD_TYPE,                                                               "+
		"SUM(NVL(DEV_COUNT, 0)) DEV_COUNT,                                                                 "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(CHARGE_NUM, 0)END) CHARGE_NUM,                "+
		"       SUM(NVL(ACC_NUM_NXS, 0)) ACC_NUM_NXS,                                                      "+
		"       SUM(NVL(HQ_ML, 0)) HQ_ML,                                                                  "+
		"       SUM(NVL(HQ_SAL_ML, 0)) HQ_SAL_ML,                                                          "+
		"       SUM(NVL(HQ_CHARGE_SR, 0)) HQ_CHARGE_SR,                                                    "+
		"       SUM(NVL(HQ_COST_ALL, 0)) HQ_COST_ALL,                                                      "+
		"       CASE                                                                                       "+
		"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) <> 0 THEN                                                 "+
		"          TRIM('.' FROM TO_CHAR(SUM(NVL(HQ_COST_ALL, 0)) * 100 /                                  "+
		"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                 "+
		"                       'FM9999990.99'))                                                           "+
		"       END || '%' COST_RATE,                                                                      "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_OWE, 0) END) SUBS_OWE,                   "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_PAY, 0) END) SUBS_PAY,                   "+
		"       CASE                                                                                       "+
		"         WHEN SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END) = 0 THEN           "+
		"          '0.00'                                                                                  "+
		"         ELSE                                                                                     "+
		"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(XF_7_NUM, 0)END) * 100 /  "+
		"                       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END),               "+
		"                       'FM999990.99'))                                                            "+
		"       END || '%' SECOND_PAY,                                                                     "+
		"        '--' IS_TY,                                                                                    "+
		"        '--' IS_SOCIAL                                                                                 "+
		"  FROM PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON T0                                                        "+
		"  LEFT JOIN  (SELECT  GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME                                                                   "+
		"                     ,HQ_CHAN_CODE                                                                "+
		"                     ,HQ_CHAN_NAME                                                                "+
		"                     ,BUSI_BEGIN_TIME                                                             "+
		"                     ,HQ_STATE                                                                    "+
		"                     ,HQ_ZY                                                                       "+
		"                     ,THIRD_TYPE                                                                  "+
		"                     ,IS_TY                                                                       "+
		"                     ,IS_SOCIAL                                                                   "+
		"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T                                                  "+
		"              WHERE T.DEAL_DATE='"+endDate+"'                                                     "+
		"              )T1                                                                                 "+
		"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                         "+ 
		       where+
		" AND LEV=4"+
		" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T1.UNIT_NAME                                "+
		" ORDER BY T1.GROUP_ID_1,T1.UNIT_ID                                                          ";
	}else{
		return "SELECT                                                                           "+
		"       T1.HQ_CHAN_CODE ROW_ID,                                                          "+
		"       T1.HQ_CHAN_NAME ROW_NAME,                                                        "+
		"       T1.UNIT_NAME,                                                                    "+
		"       T1.HQ_CHAN_CODE,                                                                 "+
		"       T1.HQ_CHAN_NAME,                                                                 "+
		"       T1.BUSI_BEGIN_TIME,                                                              "+
		"       T1.HQ_STATE,                                                                     "+
		"       T1.HQ_ZY,                                                                        "+
		"       T1.THIRD_TYPE,                                                                   "+
		"SUM(NVL(DEV_COUNT, 0)) DEV_COUNT,                                                                 "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(CHARGE_NUM, 0)END) CHARGE_NUM,                "+
		"       SUM(NVL(ACC_NUM_NXS, 0)) ACC_NUM_NXS,                                                      "+
		"       SUM(NVL(HQ_ML, 0)) HQ_ML,                                                                  "+
		"       SUM(NVL(HQ_SAL_ML, 0)) HQ_SAL_ML,                                                          "+
		"       SUM(NVL(HQ_CHARGE_SR, 0)) HQ_CHARGE_SR,                                                    "+
		"       SUM(NVL(HQ_COST_ALL, 0)) HQ_COST_ALL,                                                      "+
		"       CASE                                                                                       "+
		"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) <> 0 THEN                                                 "+
		"          TRIM('.' FROM TO_CHAR(SUM(NVL(HQ_COST_ALL, 0)) * 100 /                                  "+
		"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                 "+
		"                       'FM9999990.99'))                                                           "+
		"       END || '%' COST_RATE,                                                                      "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_OWE, 0) END) SUBS_OWE,                   "+
		"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_PAY, 0) END) SUBS_PAY,                   "+
		"       CASE                                                                                       "+
		"         WHEN SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END) = 0 THEN           "+
		"          '0.00'                                                                                  "+
		"         ELSE                                                                                     "+
		"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(XF_7_NUM, 0)END) * 100 /  "+
		"                       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END),               "+
		"                       'FM999990.99'))                                                            "+
		"       END || '%' SECOND_PAY,                                                                     "+
		"        T1.IS_TY,                                                                                    "+
		"        T1.IS_SOCIAL                                                                                 "+
		"  FROM PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON T0                                                        "+
		"  LEFT JOIN  (SELECT  GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME                                                                   "+
		"                     ,HQ_CHAN_CODE                                                                "+
		"                     ,HQ_CHAN_NAME                                                                "+
		"                     ,BUSI_BEGIN_TIME                                                             "+
		"                     ,HQ_STATE                                                                    "+
		"                     ,HQ_ZY                                                                       "+
		"                     ,THIRD_TYPE                                                                  "+
		"                     ,IS_TY                                                                       "+
		"                     ,IS_SOCIAL                                                                   "+
		"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T                                                  "+
		"              WHERE T.DEAL_DATE='"+endDate+"'                                                     "+
		"              )T1                                                                                 "+
		"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                         "+ 
		       where+
		" AND LEV=4"+
		"   GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,                                              "+
		"       T1.UNIT_ID,                                                                      "+
		"       T1.UNIT_NAME,                                                                    "+
		"       T1.HQ_CHAN_CODE,                                                                 "+
		"       T1.HQ_CHAN_NAME,                                                                 "+
		"       T1.BUSI_BEGIN_TIME,                                                              "+
		"       T1.HQ_STATE,                                                                     "+
		"       T1.HQ_ZY,                                                                        "+
		"       T1.THIRD_TYPE,                                                                   "+
		"       T1.IS_TY,                                                                        "+
		"       T1.IS_SOCIAL                                                                     "+
		"       ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HQ_CHAN_CODE                                      ";
	}
}

function getDownSql(where){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	return "SELECT T1.GROUP_ID_1_NAME,                                                       "+
	"       T1.UNIT_NAME,                                                                    "+
	"       T1.HQ_CHAN_CODE,                                                                 "+
	"       T1.HQ_CHAN_NAME,                                                                 "+
	"       T1.BUSI_BEGIN_TIME,                                                              "+
	"       T1.HQ_STATE,                                                                     "+
	"       T1.HQ_ZY,                                                                        "+
	"       T1.THIRD_TYPE,                                                                   "+
	"SUM(NVL(DEV_COUNT, 0)) DEV_COUNT,                                                                 "+
	"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(CHARGE_NUM, 0)END) CHARGE_NUM,                "+
	"       SUM(NVL(ACC_NUM_NXS, 0)) ACC_NUM_NXS,                                                      "+
	"       SUM(NVL(HQ_ML, 0)) HQ_ML,                                                                  "+
	"       SUM(NVL(HQ_SAL_ML, 0)) HQ_SAL_ML,                                                          "+
	"       SUM(NVL(HQ_CHARGE_SR, 0)) HQ_CHARGE_SR,                                                    "+
	"       SUM(NVL(HQ_COST_ALL, 0)) HQ_COST_ALL,                                                      "+
	"       CASE                                                                                       "+
	"         WHEN SUM(NVL(HQ_CHARGE_SR, 0)) <> 0 THEN                                                 "+
	"          TRIM('.' FROM TO_CHAR(SUM(NVL(HQ_COST_ALL, 0)) * 100 /                                  "+
	"                       SUM(NVL(HQ_CHARGE_SR, 0)),                                                 "+
	"                       'FM9999990.99'))                                                           "+
	"       END || '%' COST_RATE,                                                                      "+
	"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_OWE, 0) END) SUBS_OWE,                   "+
	"       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(SUBS_PAY, 0) END) SUBS_PAY,                   "+
	"       CASE                                                                                       "+
	"         WHEN SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END) = 0 THEN           "+
	"          '0.00'                                                                                  "+
	"         ELSE                                                                                     "+
	"          TRIM('.' FROM TO_CHAR(SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(XF_7_NUM, 0)END) * 100 /  "+
	"                       SUM(CASE WHEN DEAL_DATE="+endDate+" THEN NVL(INNET_7_NUM, 0)END),               "+
	"                       'FM999990.99'))                                                            "+
	"       END || '%' SECOND_PAY,                                                                     "+
	"        T1.IS_TY,                                                                                "+
	"        T1.IS_SOCIAL                                                                             "+
	"  FROM PMRT.VIEW_MRT_HQ_ABILITY_ALL_MON T0                                                        "+
	"  LEFT JOIN  (SELECT  GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME                                        "+
	"                     ,HQ_CHAN_CODE                                                                "+
	"                     ,HQ_CHAN_NAME                                                                "+
	"                     ,BUSI_BEGIN_TIME                                                             "+
	"                     ,HQ_STATE                                                                    "+
	"                     ,HQ_ZY                                                                       "+
	"                     ,THIRD_TYPE                                                                  "+
	"                     ,IS_TY                                                                       "+
	"                     ,IS_SOCIAL                                                                   "+
	"              FROM PMRT.TAB_MRT_HQ_ABILITY_MON T                                                  "+
	"              WHERE T.DEAL_DATE='"+endDate+"'                                                     "+
	"              )T1                                                                                 "+
	"   ON   (T0.HQ_CHAN_CODE=T1.HQ_CHAN_CODE)                                                         "+ 
	       where+
	" AND LEV=4"+
	"   GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,                                              "+
	"       T1.UNIT_ID,                                                                      "+
	"       T1.UNIT_NAME,                                                                    "+
	"       T1.HQ_CHAN_CODE,                                                                 "+
	"       T1.HQ_CHAN_NAME,                                                                 "+
	"       T1.BUSI_BEGIN_TIME,                                                              "+
	"       T1.HQ_STATE,                                                                     "+
	"       T1.HQ_ZY,                                                                        "+
	"       T1.THIRD_TYPE,                                                                   "+
	"       T1.IS_TY,                                                                        "+
	"       T1.IS_SOCIAL                                                                     "+
	"       ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HQ_CHAN_CODE                                      ";
}
