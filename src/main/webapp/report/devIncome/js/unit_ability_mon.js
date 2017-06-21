var title=[["州市名称","营服中心","营服编码","营服状态","发展用户数","","","","","","出账用户数","","","","","","销售毛利","","","营服毛利","","","出账收入预算","","出账收入实际完成","","","","","","出账收入时序预算完成率","人工成本-年累计","去年总收入","平均人数","市场成本","","","网运成本","","","营业欠款余额","用户欠费余额","用户预存款余额","二次续费率"],
           ["","","","","移网","专线","宽带","固话","其他","合计","移网","专线","宽带","固话","其他","合计","全年预算","预算完成率","实际完成","全年预算","预算完成率","实际完成","年度","时序","移网","专线","宽带","固话","其他","合计","","","","","年度预算","剩余额度","实际完成","年度预算","剩余额度","实际完成","","","",""]];
var field=["DEV_YW_NUM","DEV_ZX_NUM","DEV_KD_NUM","DEV_GH_NUM","DEV_OTHER_NUM","DEV_ALL_NUM","CHARGE_YW_NUM","CHARGE_ZX_NUM","CHARGE_KD_NUM","CHARGE_GH_NUM","CHARGE_OTHER_NUM","CHARGE_ALL_NUM","YS_SALE_AMOUNT","COM_SALE_RATE","FACT_SALE_AMOUNT","YS_UNIT_AMOUNT","COM_UNIT_RATE","FACT_UNIT_AMOUNT","CHARGE_YEAR_YS","FACT_CHARGE_MON_YS","FACT_CHARGE_YW_NUM","FACT_CHARGE_ZX_NUM","FACT_CHARGE_KD_NUM","FACT_CHARGE_GH_NUM","FACT_CHARGE_OTHER_NUM","FACT_CHARGE_ALL_NUM","CHARGE_COM_RATE","MAN_COST","SR_LAST_YEAR","HR_COUNTS","SC_COST","SC_LEFT","SC_COM","LAN_COST","LAN_LEFT","LAN_COM","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT","SECOND_PAY_RATE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_UNIT_ABILITY_MON");
	var dealDate=$("#startDate").val();
	$("#startDate").val(getFristMon(dealDate));
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
		field:["ROW_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE"].concat(field),
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}, {array:[9,15,29],css:LchReport.NORMAL_STYLE}],
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
			var unitCode=$("#unitCode").val();
			var where=" WHERE T.DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					level=2;
				}else if(orgLevel==3){//点击市
					where+=" AND T.GROUP_ID_1='"+code+"'";
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				if(regionCode!=''){
					where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
					level=3;
				}
				if(unitCode!=''){
					where+=" AND T.UNIT_ID ='"+unitCode+"'";
					level=4;
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
					where+=" AND T.GROUP_ID_1='"+code+"'";
					level=2;
				}else if(orgLevel==3){//营服
					level=3;
					where+=" AND T.UNIT_ID IN("+_unit_relation(code)+")";
				}else {
					return {data:[],extra:{}};
				}
				if(regionCode!=''){
					where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
					level=2;
				}
				if(unitCode!=''){
					where+=" AND T.UNIT_ID ='"+unitCode+"'";
					level=3;
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
	var unitCode=$("#unitCode").val();
	
	if (orgLevel == 1) {//省
		
	} else if(orgLevel == 2){//市
		where += " AND T.GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND T.UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND T.UNIT_ID = '"+unitCode+"'";
	}
	var sql=getAllSql(where,3);
	var showtext = '云南联通营服效能汇总表' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function getSql(where,level){
	return getAllSql(where,level);
 }

function getAllSql(where,level){
  var startDate=$("#startDate").val();
  var endDate=$("#endDate").val();
  if(level==1){
	  return "SELECT '云南省' ROW_NAME,                                                                                               "+
	  "       '86000' ROW_ID,                                                                                                  "+
	  "       '--' UNIT_NAME,                                                                                                  "+
	  "       '--' UNIT_ID,                                                                                                    "+
	  "       '--' UNIT_TYPE,                                                                                                  "+
	  "       SUM(NVL(T.DEV_YW_NUM,0)) DEV_YW_NUM,                                                                                          "+
	  "       SUM(NVL(T.DEV_ZX_NUM,0)) DEV_ZX_NUM,                                                                                          "+
	  "       SUM(NVL(T.DEV_KD_NUM,0)) DEV_KD_NUM,                                                                                          "+
	  "       SUM(NVL(T.DEV_GH_NUM,0)) DEV_GH_NUM,                                                                                          "+
	  "       SUM(NVL(T.DEV_OTHER_NUM,0)) DEV_OTHER_NUM,                                                                                       "+
	  "       SUM(NVL(T.DEV_ALL_NUM,0)) DEV_ALL_NUM,                                                                                         "+
	  "       SUM(NVL(T.CHARGE_YW_NUM,0)) CHARGE_YW_NUM,                                                                                       "+
	  "       SUM(NVL(T.CHARGE_ZX_NUM,0)) CHARGE_ZX_NUM,                                                                                       "+
	  "       SUM(NVL(T.CHARGE_KD_NUM,0)) CHARGE_KD_NUM,                                                                                       "+
	  "       SUM(NVL(T.CHARGE_GH_NUM,0)) CHARGE_GH_NUM,                                                                                       "+
	  "       SUM(NVL(T.CHARGE_OTHER_NUM,0)) CHARGE_OTHER_NUM,                                                                                    "+
	  "       SUM(NVL(T.CHARGE_ALL_NUM,0)) CHARGE_ALL_NUM,                                                                                      "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) YS_SALE_AMOUNT,  "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_SALE_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+"))||'%'  COM_SALE_RATE,        "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_SALE_AMOUNT, "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) YS_UNIT_AMOUNT,        "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_UNIT_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+"))||'%' COM_UNIT_RATE,              "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_UNIT_AMOUNT,      "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_YEAR_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) CHARGE_YEAR_YS,        "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_MON_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_MON_YS,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_YW_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_YW_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ZX_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_ZX_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_KD_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_KD_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_GH_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_GH_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_OTHER_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_OTHER_NUM, "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ALL_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) FACT_CHARGE_ALL_NUM,   "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_COM_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+"))||'%' CHARGE_COM_RATE,            "+
	  "       SUM(PMRT.SUM_RATIO((SELECT MAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) MAN_COST,              "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SR_LAST_YEAR FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) SR_LAST_YEAR,          "+
	  "       SUM(TO_NUMBER(T.HR_COUNTS)) HR_COUNTS,                                                                                             "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) SC_COST,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) SC_LEFT,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) SC_COM,                "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) LAN_COST,              "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) LAN_LEFT,              "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+")) LAN_COM,               "+
	  "       SUM(NVL(T.BUSI_OWE_LEFT,0)) BUSI_OWE_LEFT,                                                                                       "+
	  "       SUM(NVL(T.SUBS_OWE_LEFT,0)) SUBS_OWE_LEFT,                                                                                       "+
	  "       SUM(NVL(T.SUBS_PAY_LEFT,0)) SUBS_PAY_LEFT,                                                                                       "+
	  "      SUM(PMRT.SUM_RATIO((SELECT SECOND_PAY_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+"))||'%' SECOND_PAY_RATE        "+
	  "  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON T                                                                                   "+
	      where+
	  "   AND T.GROUP_LEVEL = 0                                                                                                  ";
  }else if(level==2){
	  return "SELECT T.GROUP_ID_1_NAME ROW_NAME,                                                                                                           "+
	  "       T.GROUP_ID_1 ROW_ID,                                                                                                                         "+
	  "       '--' UNIT_NAME,                                                                                                                              "+
	  "       '--' UNIT_ID,                                                                                                                                "+
	  "       '--' UNIT_TYPE,                                                                                                                              "+
	  "       SUM(NVL(T.DEV_YW_NUM,0)) DEV_YW_NUM,                                                                                                                    "+
	  "       SUM(NVL(T.DEV_ZX_NUM,0)) DEV_ZX_NUM,                                                                                                                    "+
	  "       SUM(NVL(T.DEV_KD_NUM,0)) DEV_KD_NUM,                                                                                                                    "+
	  "       SUM(NVL(T.DEV_GH_NUM,0)) DEV_GH_NUM,                                                                                                                    "+
	  "       SUM(NVL(T.DEV_OTHER_NUM,0)) DEV_OTHER_NUM,                                                                                                              "+
	  "       SUM(NVL(T.DEV_ALL_NUM,0)) DEV_ALL_NUM,                                                                                                                  "+
	  "       SUM(NVL(T.CHARGE_YW_NUM,0)) CHARGE_YW_NUM,                                                                                                              "+
	  "       SUM(NVL(T.CHARGE_ZX_NUM,0)) CHARGE_ZX_NUM,                                                                                                              "+
	  "       SUM(NVL(T.CHARGE_KD_NUM,0)) CHARGE_KD_NUM,                                                                                                               "+
	  "       SUM(NVL(T.CHARGE_GH_NUM,0)) CHARGE_GH_NUM,                                                                                                               "+
	  "       SUM(NVL(T.CHARGE_OTHER_NUM,0)) CHARGE_OTHER_NUM,                                                                                                              "+
	  "       SUM(NVL(T.CHARGE_ALL_NUM,0)) CHARGE_ALL_NUM,                                                                                                                  "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) YS_SALE_AMOUNT,     "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_SALE_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+"))||'%' COM_SALE_RATE,            "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_SALE_AMOUNT, "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) YS_UNIT_AMOUNT,          "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_UNIT_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+"))||'%' COM_UNIT_RATE,                 "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_UNIT_AMOUNT,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_YEAR_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) CHARGE_YEAR_YS,           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_MON_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_MON_YS,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_YW_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_YW_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ZX_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_ZX_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_KD_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_KD_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_GH_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_GH_NUM,    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_OTHER_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_OTHER_NUM, "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ALL_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) FACT_CHARGE_ALL_NUM,   "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_COM_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+"))||'%' CHARGE_COM_RATE,            "+
	  "       SUM(PMRT.SUM_RATIO((SELECT MAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) MAN_COST,                    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SR_LAST_YEAR FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) SR_LAST_YEAR,            "+
	  "       SUM(TO_NUMBER(T.HR_COUNTS)) HR_COUNTS,                                                                                                                    "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) SC_COST,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) SC_LEFT,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) SC_COM,                 "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) LAN_COST,             "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) LAN_LEFT,             "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1=T.GROUP_ID_1),"+startDate+","+endDate+")) LAN_COM,               "+
	  "       SUM(NVL(T.BUSI_OWE_LEFT,0)) BUSI_OWE_LEFT,                                                                                                                 "+
	  "       SUM(NVL(T.SUBS_OWE_LEFT,0)) SUBS_OWE_LEFT,                                                                                                                 "+
	  "       SUM(NVL(T.SUBS_PAY_LEFT,0)) SUBS_PAY_LEFT,                                                                                                                 "+
	  "      SUM(PMRT.SUM_RATIO((SELECT SECOND_PAY_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=0),"+startDate+","+endDate+"))||'%' SECOND_PAY_RATE                                   "+
	  "  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON T                                                                                                              "+
	      where+
	  "   AND T.GROUP_LEVEL = 1                                                                                                                            "+
	  "   GROUP BY T.GROUP_ID_1,                                                                                                                           "+
	  "            T.GROUP_ID_1_NAME                                                                                                                       ";
  }else if(level==3){
	  return "SELECT T.GROUP_ID_1_NAME,UNIT_NAME ROW_NAME,                                                                                                                                                               "+
	  "       T.UNIT_ID,                                                                                                                                                                                "+
	  "       T.UNIT_TYPE,                                                                                                                                                                              "+
	  "       SUM(NVL(T.DEV_YW_NUM,0)) DEV_YW_NUM,                                                                                                                                                      "+
	  "       SUM(NVL(T.DEV_ZX_NUM,0)) DEV_ZX_NUM,                                                                                                                                                      "+
	  "       SUM(NVL(T.DEV_KD_NUM,0)) DEV_KD_NUM,                                                                                                                                                      "+
	  "       SUM(NVL(T.DEV_GH_NUM,0)) DEV_GH_NUM,                                                                                                                                                      "+
	  "       SUM(NVL(T.DEV_OTHER_NUM,0)) DEV_OTHER_NUM,                                                                                                                                                "+
	  "       SUM(NVL(T.DEV_ALL_NUM,0)) DEV_ALL_NUM,                                                                                                                                                    "+
	  "       SUM(NVL(T.CHARGE_YW_NUM,0)) CHARGE_YW_NUM,                                                                                                                                                "+
	  "       SUM(NVL(T.CHARGE_ZX_NUM,0)) CHARGE_ZX_NUM,                                                                                                                                                "+
	  "       SUM(NVL(T.CHARGE_KD_NUM,0)) CHARGE_KD_NUM,                                                                                                                                                "+
	  "       SUM(NVL(T.CHARGE_GH_NUM,0)) CHARGE_GH_NUM,                                                                                                                                                "+
	  "       SUM(NVL(T.CHARGE_OTHER_NUM,0)) CHARGE_OTHER_NUM,                                                                                                                                          "+
	  "       SUM(NVL(T.CHARGE_ALL_NUM,0)) CHARGE_ALL_NUM,                                                                                                                                              "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1 AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) YS_SALE_AMOUNT,                "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_SALE_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+"))||'%' COM_SALE_RATE,                      "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_SALE_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_SALE_AMOUNT,           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT YS_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) YS_UNIT_AMOUNT,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT COM_UNIT_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+"))||'%'  COM_UNIT_RATE,                      "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_UNIT_AMOUNT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_UNIT_AMOUNT,           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_YEAR_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) CHARGE_YEAR_YS,               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_MON_YS FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_MON_YS,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_YW_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_YW_NUM,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ZX_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_ZX_NUM,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_KD_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_KD_NUM,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_GH_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_GH_NUM,       "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_OTHER_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_OTHER_NUM, "+
	  "       SUM(PMRT.SUM_RATIO((SELECT FACT_CHARGE_ALL_NUM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) FACT_CHARGE_ALL_NUM,     "+
	  "       SUM(PMRT.SUM_RATIO((SELECT CHARGE_COM_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+"))||'%' CHARGE_COM_RATE,                  "+
	  "       SUM(PMRT.SUM_RATIO((SELECT MAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) MAN_COST,                           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SR_LAST_YEAR FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) SR_LAST_YEAR,                   "+
	  "       SUM(TO_NUMBER(T.HR_COUNTS)) HR_COUNTS,                                                                                                                                                         "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) SC_COST,                             "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) SC_LEFT,                             "+
	  "       SUM(PMRT.SUM_RATIO((SELECT SC_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) SC_COM,                               "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COST FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) LAN_COST,                           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_LEFT FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) LAN_LEFT,                           "+
	  "       SUM(PMRT.SUM_RATIO((SELECT LAN_COM FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+")) LAN_COM,                             "+
	  "       SUM(NVL(T.BUSI_OWE_LEFT,0)) BUSI_OWE_LEFT,                                                                                                                                                "+
	  "       SUM(NVL(T.SUBS_OWE_LEFT,0)) SUBS_OWE_LEFT,                                                                                                                                                "+
	  "       SUM(NVL(T.SUBS_PAY_LEFT,0)) SUBS_PAY_LEFT,                                                                                                                                                "+
	  "      SUM(PMRT.SUM_RATIO((SELECT SECOND_PAY_RATE FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE DEAL_DATE="+endDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1=T.GROUP_ID_1  AND UNIT_ID=T.UNIT_ID),"+startDate+","+endDate+"))||'%' SECOND_PAY_RATE                "+
	  "  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON T                                                                                                                                                           "+
	        where+
	  "   AND T.GROUP_LEVEL = 2                                                                                                                                                                         "+
	  "   GROUP BY T.GROUP_ID_1,                                                                                                                                                                        "+
	  "            T.GROUP_ID_1_NAME,                                                                                                                                                                   "+
	  "            T.UNIT_ID,                                                                                                                                                                           "+
	  "            T.UNIT_NAME,                                                                                                                                                                         "+
	  "            T.UNIT_TYPE";
  }else{
	  
  }	
}

function getFristMon(dealDate){
	 return dealDate.substring(0,4)+"01";
}