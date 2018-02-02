$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_EFF_ANA_MON"));
	var title=[["组织架构","渠道编码","产权模式","厅类型","经营模式","开帐收入","","新增发展","业务受理量","成本类","","","","","","","","","","","","","","","","","","","","","当月毛利","当月毛利率","累计毛利","累计毛利率","毛利增长","","","月环比排名","店长名字","评议标识"],
	           ["","","","","","本月","其中新增收入","","","房租","","人工成本","佣金","渠道补贴","终端补贴","柜台及场地出租收入","营业厅装修","客户接入成本","卡成本","水电物业","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","","","","","环比","同比","定比去年12月","","",""],
	           ["","","","","","","","","","本月房租成本","其中自有产权估算房租成本","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]];
    
	var field=["HALL_ID","YYY_TYPE","CHNL_TYPE","OPERATE_TYPE","SR_ACC","SR_NEW","DEV_NEW","ACCEPT","MON_RENT","MON_RENT_ZY","PER_COST","COMM_ACC_JZ","COMM_ACC_QDBT","ZDBT1","GT_RENT","FIT_FEE","KHJR_AMOUNT","KCB_COST","WE_FEE","ADV_FEE","YWYP_FEE","CH_PRO_PRE","SALE_DETAIL_SR","SALE_DETAIL_COST","BG_FEE","CAR_FEE","ZD_FEE","CL_FEE","TX_FEE","ML_SR_ACC","ML_RATE","ML_SR_ACC1","ML_RATE1","ML_RATEL","ML_RATE_LTMN","ML_RATEL12","RN","T_MANAGE_NAME","EVALUATE"];
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
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
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
			var dealDate=$("#dealDate").val();
			var where="";
			var where1="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(orgLevel,where,where1);
				}else if(orgLevel==3){//点击市
					where+=" WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+code+"'";
					where1+=" WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+code+"'";
					sql=getSql(orgLevel,where,where1);
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql=getSql(orgLevel,where,where1);
				}else if(orgLevel==2||orgLevel==3){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					where1+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
					sql=getSql(orgLevel,where,where1);
				}else{
					return {data:[],extra:{}};
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

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hall_id=$.trim($("#hall_id").val());
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	var where1=" WHERE DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
		where1 += " AND GROUP_ID_1='"+region+"' ";
	} 
	
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
		where1+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
		where1 += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(hall_id!=""){
		where += " AND HALL_ID LIKE '%"+hall_id+"%' ";
	}
	var sql = getDownSql(where);
	var showtext = '营业厅毛利率评价月报表-' + dealDate;
	var title=[["地市","营业厅","渠道编码","产权模式","厅类型","经营模式","开帐收入","","新增发展","业务受理量","成本类","","","","","","","","","","","","","","","","","","","","","当月毛利","当月毛利率","累计毛利","累计毛利率","毛利增长","","","月环比排名","店长名字","评议标识"],
	           ["","","","","","","本月","其中新增收入","","","房租","","人工成本","佣金","渠道补贴","终端补贴","柜台及场地出租收入","营业厅装修","客户接入成本","卡成本","水电物业","广告宣传费","业务用品及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费","","","","","环比","同比","定比去年12月","","",""],
	           ["","","","","","","","","","","本月房租成本","其中自有产权估算房租成本","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,where1){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hall_id=$.trim($("#hall_id").val());
	var dealDate=$("#dealDate").val();
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
		where1+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
		where1 += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(hall_id!=""){
		where += " AND HALL_ID LIKE '%"+hall_id+"%' ";
	}
	
	if(orgLevel==1){
		return "SELECT T.GROUP_ID_0 ROW_ID,                                                            "+
		"'云南省' ROW_NAME,                                                                              "+
		"       '--' HALL_ID,                                                                          "+
		"       '--' YYY_TYPE,                                                                         "+
		"       '--' CHNL_TYPE,                                                                        "+
		"       '--' OPERATE_TYPE,                                                                     "+
		"       SUM(NVL(ROUND(T.SR_ACC/10000,3), 0)) SR_ACC,                                                          "+
		"       SUM(NVL(ROUND(T.SR_NEW/10000,3), 0)) SR_NEW,                                                          "+
		"       SUM(NVL(T.DEV_NEW, 0)) DEV_NEW,                                                        "+
		"       SUM(NVL(T.ACCEPT, 0)) ACCEPT,                                                          "+
		"       SUM(NVL(ROUND(T.MON_RENT/10000,3), 0)) MON_RENT,                                                      "+
		"       SUM(ROUND(T.MON_RENT_ZY/10000,3)) MON_RENT_ZY,                                                        "+
		
		"SUM(NVL(ROUND(T.PER_COST    / 10000, 3), 0)) PER_COST     "+
		",SUM(NVL(ROUND(T.COMM_ACC_JZ          / 10000, 3), 0)) COMM_ACC_JZ           "+
		",SUM(NVL(ROUND(T.COMM_ACC_QDBT         / 10000, 3), 0)) COMM_ACC_QDBT          "+
		",SUM(NVL(ROUND(T.ZDBT1         / 10000, 3), 0)) ZDBT1          "+
		",SUM(NVL(ROUND(T.GT_RENT   / 10000, 3), 0)) GT_RENT    "+
		",SUM(NVL(ROUND(T.FIT_FEE       / 10000, 3), 0)) FIT_FEE        "+
		",SUM(NVL(ROUND(T.KHJR_AMOUNT     / 10000, 3), 0)) KHJR_AMOUNT      "+
		",SUM(NVL(ROUND(T.KCB_COST        / 10000, 3), 0)) KCB_COST         "+
		",SUM(NVL(ROUND(T.WE_FEE        / 10000, 3), 0)) WE_FEE         "+
		",SUM(NVL(ROUND(T.ADV_FEE         / 10000, 3), 0)) ADV_FEE          "+
		",SUM(NVL(ROUND(T.YWYP_FEE        / 10000, 3), 0)) YWYP_FEE         "+
		",SUM(NVL(ROUND(T.CH_PRO_PRE      / 10000, 3), 0)) CH_PRO_PRE       "+
		",SUM(NVL(ROUND(T.SALE_DETAIL_SR  / 10000, 3), 0)) SALE_DETAIL_SR   "+
		",SUM(NVL(ROUND(T.SALE_DETAIL_COST/ 10000, 3), 0)) SALE_DETAIL_COST "+
		",SUM(NVL(ROUND(T.BG_FEE          / 10000, 3), 0)) BG_FEE           "+
		",SUM(NVL(ROUND(T.CAR_FEE         / 10000, 3), 0)) CAR_FEE          "+
		",SUM(NVL(ROUND(T.ZD_FEE          / 10000, 3), 0)) ZD_FEE           "+
		",SUM(NVL(ROUND(T.CL_FEE          / 10000, 3), 0)) CL_FEE           "+
		",SUM(NVL(ROUND(T.TX_FEE          / 10000, 3), 0)) TX_FEE           "+

		
		",       SUM(NVL(ROUND(T.ML_SR_ACC/10000,3), 0)) ML_SR_ACC,                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T.SR_ACC, 0)) <> 0 THEN                            "+
		"                               SUM(NVL(T.ML_SR_ACC, 0)) * 100 / SUM(NVL(T.SR_ACC, 0))         "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE,                                                       "+
		"       SUM(NVL(ROUND(T4.ML_SR_ACC/10000,3), 0)) ML_SR_ACC1,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T4.SR_ACC, 0)) <> 0 THEN                           "+
		"                               SUM(NVL(T4.ML_SR_ACC, 0)) * 100 / SUM(NVL(T4.SR_ACC, 0))       "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE1,                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T1.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T1.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T1.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATEL,                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T2.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T2.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T2.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE_LTMN,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T3.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T3.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T3.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATEL12,                                                    "+
		"       '--' RN,                                                                               "+
		"       '--' T_MANAGE_NAME,                                                                    "+
		"       '--' EVALUATE                                                                          "+
		"  FROM (SELECT GROUP_ID_0 ,                                                                   "+
		"               SUM(NVL(SR_ACC, 0)) SR_ACC,                                                    "+
		"               SUM(NVL(SR_NEW, 0)) SR_NEW,                                                    "+
		"               SUM(NVL(DEV_NEW, 0)) DEV_NEW,                                                  "+
		"               SUM(NVL(ACCEPT, 0)) ACCEPT,                                                    "+
		"               SUM(NVL(MON_RENT, 0)) MON_RENT,                                                "+
		"               SUM(CASE                                                                       "+
		"                     WHEN YYY_TYPE LIKE '自有%' THEN                                           "+
		"                      NVL(MON_RENT, 0)                                                        "+
		"                     ELSE                                                                     "+
		"                      0                                                                       "+
		"                   END) MON_RENT_ZY,                                                          "+
		
		"SUM(PER_COST    )   PER_COST     "+ 
		",SUM(COMM_ACC_JZ          )   COMM_ACC_JZ           "+ 
		",SUM(COMM_ACC_QDBT         )   COMM_ACC_QDBT          "+ 
		",SUM(ZDBT1         )   ZDBT1          "+ 
		",SUM(GT_RENT   )   GT_RENT    "+ 
		",SUM(FIT_FEE       )   FIT_FEE        "+ 
		",SUM(KHJR_AMOUNT     )   KHJR_AMOUNT      "+ 
		",SUM(KCB_COST        )   KCB_COST         "+ 
		",SUM(WE_FEE        )   WE_FEE         "+ 
		",SUM(ADV_FEE         )   ADV_FEE          "+ 
		",SUM(YWYP_FEE        )   YWYP_FEE         "+ 
		",SUM(CH_PRO_PRE      )   CH_PRO_PRE       "+ 
		",SUM(SALE_DETAIL_SR  )   SALE_DETAIL_SR   "+ 
		",SUM(SALE_DETAIL_COST)   SALE_DETAIL_COST "+ 
		",SUM(BG_FEE          )   BG_FEE           "+ 
		",SUM(CAR_FEE         )   CAR_FEE          "+ 
		",SUM(ZD_FEE          )   ZD_FEE           "+ 
		",SUM(CL_FEE          )   CL_FEE           "+ 
		",SUM(TX_FEE          )   TX_FEE           "+ 

		
		",               SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC,                                              "+
		"               SUM(NVL(ML_SR_ACC1, 0)) ML_SR_ACC1,                                            "+
		"               SUM(NVL(SR_ACC1, 0)) SR_ACC1                                                   "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+dealDate+"                                                         "+
		    where+
		"        GROUP BY GROUP_ID_0                                                                   "+
		")T                                                                                            "+
		"LEFT JOIN (SELECT GROUP_ID_0,                                                                 "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastMonth(dealDate)+"                                           "+
		    where+
		"        GROUP BY GROUP_ID_0                                                                   "+
		")T1                                                                                           "+
		"ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0,                                                                 "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastYearSameMonth(dealDate)+"                                   "+
		    where+
		"        GROUP BY GROUP_ID_0                                                                   "+
		")T2                                                                                           "+
		"ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0 ,                                                                "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastYearEndMonth(dealDate)+"                                    "+
		    where+
		"        GROUP BY GROUP_ID_0                                                                   "+
		")T3                                                                                           "+
		"ON(T.GROUP_ID_0=T3.GROUP_ID_0)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0,                                                                 "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"                 ,SUM(NVL(SR_ACC, 0)) SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE BETWEEN "+getFristMonth(dealDate)+" AND "+dealDate                     +  
		    where+
		"        GROUP BY GROUP_ID_0                                                                   "+
		")T4                                                                                           "+
		"ON(T.GROUP_ID_0=T4.GROUP_ID_0)  "+
		"GROUP BY T.GROUP_ID_0                                                                         ";
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                            "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                            "+
		"       '--' HALL_ID,                                                                          "+
		"       '--' YYY_TYPE,                                                                         "+
		"       '--' CHNL_TYPE,                                                                        "+
		"       '--' OPERATE_TYPE,                                                                     "+
		"       SUM(NVL(ROUND(T.SR_ACC/10000,3), 0)) SR_ACC,                                                  "+
		"       SUM(NVL(ROUND(T.SR_NEW/10000,3), 0)) SR_NEW,                                                  "+
		"       SUM(NVL(T.DEV_NEW, 0)) DEV_NEW,                                                        "+
		"       SUM(NVL(T.ACCEPT, 0)) ACCEPT,                                                          "+
	    "       SUM(NVL(ROUND(T.MON_RENT/10000,3), 0)) MON_RENT,                                                      "+
		"       SUM(ROUND(T.MON_RENT_ZY/10000,3)) MON_RENT_ZY,                                                        "+
		
		"SUM(NVL(ROUND(T.PER_COST    / 10000, 3), 0)) PER_COST     "+
		",SUM(NVL(ROUND(T.COMM_ACC_JZ          / 10000, 3), 0)) COMM_ACC_JZ           "+
		",SUM(NVL(ROUND(T.COMM_ACC_QDBT         / 10000, 3), 0)) COMM_ACC_QDBT          "+
		",SUM(NVL(ROUND(T.ZDBT1         / 10000, 3), 0)) ZDBT1          "+
		",SUM(NVL(ROUND(T.GT_RENT   / 10000, 3), 0)) GT_RENT    "+
		",SUM(NVL(ROUND(T.FIT_FEE       / 10000, 3), 0)) FIT_FEE        "+
		",SUM(NVL(ROUND(T.KHJR_AMOUNT     / 10000, 3), 0)) KHJR_AMOUNT      "+
		",SUM(NVL(ROUND(T.KCB_COST        / 10000, 3), 0)) KCB_COST         "+
		",SUM(NVL(ROUND(T.WE_FEE        / 10000, 3), 0)) WE_FEE         "+
		",SUM(NVL(ROUND(T.ADV_FEE         / 10000, 3), 0)) ADV_FEE          "+
		",SUM(NVL(ROUND(T.YWYP_FEE        / 10000, 3), 0)) YWYP_FEE         "+
		",SUM(NVL(ROUND(T.CH_PRO_PRE      / 10000, 3), 0)) CH_PRO_PRE       "+
		",SUM(NVL(ROUND(T.SALE_DETAIL_SR  / 10000, 3), 0)) SALE_DETAIL_SR   "+
		",SUM(NVL(ROUND(T.SALE_DETAIL_COST/ 10000, 3), 0)) SALE_DETAIL_COST "+
		",SUM(NVL(ROUND(T.BG_FEE          / 10000, 3), 0)) BG_FEE           "+
		",SUM(NVL(ROUND(T.CAR_FEE         / 10000, 3), 0)) CAR_FEE          "+
		",SUM(NVL(ROUND(T.ZD_FEE          / 10000, 3), 0)) ZD_FEE           "+
		",SUM(NVL(ROUND(T.CL_FEE          / 10000, 3), 0)) CL_FEE           "+
		",SUM(NVL(ROUND(T.TX_FEE          / 10000, 3), 0)) TX_FEE           "+

		",       SUM(NVL(ROUND(T.ML_SR_ACC/10000,3), 0)) ML_SR_ACC,                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T.SR_ACC, 0)) <> 0 THEN                            "+
		"                               SUM(NVL(T.ML_SR_ACC, 0)) * 100 / SUM(NVL(T.SR_ACC, 0))         "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE,                                                       "+
		"       SUM(NVL(ROUND(T4.ML_SR_ACC/10000,3), 0)) ML_SR_ACC1, "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T4.SR_ACC, 0)) <> 0 THEN                           "+
		"                               SUM(NVL(T4.ML_SR_ACC, 0)) * 100 / SUM(NVL(T4.SR_ACC, 0))       "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE1,                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T1.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T1.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T1.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATEL,                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T1.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T1.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T1.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATEL,                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T2.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T2.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T2.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE_LTMN,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T3.ML_SR_ACC, 0)) <> 0 THEN                        "+
		"                               (SUM(NVL(T.ML_SR_ACC, 0)) - SUM(NVL(T3.ML_SR_ACC, 0))) * 100 / "+
		"                               SUM(NVL(T3.ML_SR_ACC, 0))                                      "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATEL12,                                                    "+
		"       '--' RN,                                                                               "+
		"       '--' T_MANAGE_NAME,                                                                    "+
		"       '--' EVALUATE                                                                          "+
		"  FROM (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                         "+
		"               SUM(NVL(SR_ACC, 0)) SR_ACC,                                                    "+
		"               SUM(NVL(SR_NEW, 0)) SR_NEW,                                                    "+
		"               SUM(NVL(DEV_NEW, 0)) DEV_NEW,                                                  "+
		"               SUM(NVL(ACCEPT, 0)) ACCEPT,                                                    "+
		"               SUM(NVL(MON_RENT, 0)) MON_RENT,                                                "+
		"               SUM(CASE                                                                       "+
		"                     WHEN YYY_TYPE LIKE '自有%' THEN                                          "+
		"                      NVL(MON_RENT, 0)                                                        "+
		"                     ELSE                                                                     "+
		"                      0                                                                       "+
		"                   END) MON_RENT_ZY,                                                          "+

		"SUM(PER_COST    )   PER_COST     "+
		",SUM(COMM_ACC_JZ          )   COMM_ACC_JZ           "+
		",SUM(COMM_ACC_QDBT         )   COMM_ACC_QDBT          "+
		",SUM(ZDBT1         )   ZDBT1          "+
		",SUM(GT_RENT   )   GT_RENT    "+
		",SUM(FIT_FEE       )   FIT_FEE        "+
		",SUM(KHJR_AMOUNT     )   KHJR_AMOUNT      "+
		",SUM(KCB_COST        )   KCB_COST         "+
		",SUM(WE_FEE        )   WE_FEE         "+
		",SUM(ADV_FEE         )   ADV_FEE          "+
		",SUM(YWYP_FEE        )   YWYP_FEE         "+
		",SUM(CH_PRO_PRE      )   CH_PRO_PRE       "+
		",SUM(SALE_DETAIL_SR  )   SALE_DETAIL_SR   "+
		",SUM(SALE_DETAIL_COST)   SALE_DETAIL_COST "+
		",SUM(BG_FEE          )   BG_FEE           "+
		",SUM(CAR_FEE         )   CAR_FEE          "+
		",SUM(ZD_FEE          )   ZD_FEE           "+
		",SUM(CL_FEE          )   CL_FEE           "+
		",SUM(TX_FEE          )   TX_FEE           "+

		",               SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC,                                              "+
		"               SUM(NVL(ML_SR_ACC1, 0)) ML_SR_ACC1,                                            "+
		"               SUM(NVL(SR_ACC1, 0)) SR_ACC1                                                   "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+dealDate+"                                                         "+
		    where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                        "+
		")T                                                                                            "+
		"LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                      "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastMonth(dealDate)+"                                           "+
		    where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                        "+
		")T1                                                                                           "+
		"ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                      "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastYearSameMonth(dealDate)+"                                   "+
		    where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                        "+
		")T2                                                                                           "+
		"ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                      "+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE ="+getLastYearEndMonth(dealDate)+"                                    "+
		    where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                        "+
		")T3                                                                                           "+
		"ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                                "+
		"LEFT JOIN (SELECT GROUP_ID_0,                                                                 "+
		" 				   GROUP_ID_1,GROUP_ID_1_NAME,"+
		"                  SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC                                            "+
		"                 ,SUM(NVL(SR_ACC, 0)) SR_ACC                                                  "+
		"        FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                      "+
		"        WHERE DEAL_DATE BETWEEN "+getFristMonth(dealDate)+" AND "+dealDate                     +  
		    where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                  "+
		")T4                                                                                           "+
		"ON(T.GROUP_ID_1=T4.GROUP_ID_1)"+
		"GROUP BY T.GROUP_ID_1,                                                                        "+
		"         T.GROUP_ID_1_NAME                                                                    ";
	}else{
		return "SELECT BUS_HALL_NAME ROW_NAME                                                           "+
							"      ,HALL_ID ROW_ID                                                                                                "+
							",HALL_ID"+
							"      ,YYY_TYPE                                                                                                "+
							"      ,CHNL_TYPE                                                                                               "+
							"      ,OPERATE_TYPE                                                                                            "+
							"      ,ROUND(SR_ACC/10000,3) SR_ACC                                                                                                  "+
							"      ,ROUND(SR_NEW/10000,3) SR_NEW                                                                                                  "+
	                        "      ,ROUND(CB_ACC/10000,3) CB_ACC                                                                                                  "+
							"      ,DEV_NEW                                                                                                 "+
							"      ,ACCEPT                                                                                                  "+
							"     ,ROUND(MON_RENT/10000,3) MON_RENT                                                                                     "+
							"     ,ROUND(MON_RENT_ZY/10000,3) MON_RENT_ZY                                                                                    "+
							
							",ROUND(PER_COST    /10000,3)  PER_COST      "+
							",ROUND(COMM_ACC_JZ          /10000,3)  COMM_ACC_JZ            "+
							",ROUND(COMM_ACC_QDBT         /10000,3)  COMM_ACC_QDBT           "+
							",ROUND(ZDBT1         /10000,3)  ZDBT1           "+
							",ROUND(GT_RENT   /10000,3)  GT_RENT     "+
							",ROUND(FIT_FEE       /10000,3)  FIT_FEE         "+
							",ROUND(KHJR_AMOUNT     /10000,3)  KHJR_AMOUNT       "+
							",ROUND(KCB_COST        /10000,3)  KCB_COST          "+
							",ROUND(WE_FEE        /10000,3)  WE_FEE          "+
							",ROUND(ADV_FEE         /10000,3)  ADV_FEE           "+
							",ROUND(YWYP_FEE        /10000,3)  YWYP_FEE          "+
							",ROUND(CH_PRO_PRE      /10000,3)  CH_PRO_PRE        "+
							",ROUND(SALE_DETAIL_SR  /10000,3)  SALE_DETAIL_SR    "+
							",ROUND(SALE_DETAIL_COST/10000,3)  SALE_DETAIL_COST  "+
							",ROUND(BG_FEE          /10000,3)  BG_FEE            "+
							",ROUND(CAR_FEE         /10000,3)  CAR_FEE           "+
							",ROUND(ZD_FEE          /10000,3)  ZD_FEE            "+
							",ROUND(CL_FEE          /10000,3)  CL_FEE            "+
							",ROUND(TX_FEE          /10000,3)  TX_FEE            "+
							
							"      ,ROUND(ML_SR_ACC/10000,3) ML_SR_ACC                                                                                               "+
							"      ,ML_RATE                                                                                                 "+
							"      ,ROUND(ML_SR_ACC1/10000,3) ML_SR_ACC1                                                                                              "+
							"      ,ML_RATE1                                                                                                "+
							"      ,ML_RATEL                                                                                                "+
							"      ,ML_RATE_LTMN                                                                                            "+
							"      ,ML_RATEL12                                                                                              "+
							"      ,RN                                                                                                      "+
							"      ,T_MANAGE_NAME	                                                                                        "+
							"      ,CASE WHEN RN<=ROUND(T_NUM * 0.2 ,0)                                                                     "+
							"            THEN '优秀[):]'                                                     "+
							"            WHEN RN>ROUND(T_NUM * 0.2 ,0) AND RN <=ROUND(T_NUM * 0.9 ,0)                                       "+
							"            THEN '良好[):]'                                                     "+
							"            ELSE '差评[:\'\'(]' END evaluate                                        "+
							"FROM(                                                                                                          "+
							"SELECT GROUP_ID_1_NAME                                                                                         "+
                            "      ,GROUP_ID_1                                                                                           "+							
                            "      ,T.DEAL_DATE                                                                                           "+                          
                            "      ,BUS_HALL_NAME                                                                                           "+
							"      ,HALL_ID                                                                                                 "+
							"      ,YYY_TYPE                                                                                                "+
							"      ,CHNL_TYPE                                                                                               "+
							"      ,OPERATE_TYPE                                                                                            "+
							"      ,SR_ACC                                                                                                  "+
	                        "      ,CB_ACC                                                                                                  "+
							"      ,SR_NEW                                                                                                  "+
							"      ,DEV_NEW                                                                                                 "+
							"      ,ACCEPT                                                                                                  "+
							"      ,MON_RENT                                                                                                "+
							"      ,MON_RENT_ZY                                                                                             "+
							
							",PER_COST     "+
							",COMM_ACC_JZ           "+
							",COMM_ACC_QDBT          "+
							",ZDBT1          "+
							",GT_RENT    "+
							",FIT_FEE        "+
							",KHJR_AMOUNT      "+
							",KCB_COST         "+
							",WE_FEE         "+
							",ADV_FEE          "+
							",YWYP_FEE         "+
							",CH_PRO_PRE       "+
							",SALE_DETAIL_SR   "+
							",SALE_DETAIL_COST "+
							",BG_FEE           "+
							",CAR_FEE          "+
							",ZD_FEE           "+
							",CL_FEE           "+
							",TX_FEE           "+
							
							"      ,ML_SR_ACC                                                                                               "+
							"      ,ML_RATE                                                                                                 "+
							"      ,ML_SR_ACC1                                                                                              "+
							"      ,ML_RATE1                                                                                                "+
							"      ,ML_RATEL                                                                                                "+
							"      ,ML_RATE_LTMN                                                                                            "+
							"      ,ML_RATEL12                                                                                              "+
							"      ,ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE ORDER BY TO_NUMBER(REPLACE(ML_RATE,'%'))                    "+
							" DESC) RN                                                                                                      "+
							"      ,T_MANAGE_NAME	                                                                                        "+
							"      ,T1.T_NUM                                                                                                "+
							"FROM(                                                                                                          "+
							"SELECT GROUP_ID_1_NAME                                                                                         "+
                            "      ,GROUP_ID_1                                                                                           "+							
							"      ,BUS_HALL_NAME                                                                                           "+
							"      ,HALL_ID                                                                                                 "+
							"      ,YYY_TYPE                                                                                                "+
							"      ,CHNL_TYPE                                                                                               "+
							"      ,OPERATE_TYPE                                                                                            "+
							"      ,DEAL_DATE                                                                                               "+
							"      ,T_MANAGE_NAME                                                                                           "+
							"      ,COUNT(HALL_ID)  T_NUM                                                                                   "+
							"      ,SUM(NVL(SR_ACC,0))                 SR_ACC                                                               "+
							"      ,SUM(NVL(SR_NEW,0))                 SR_NEW                                                               "+
							"      ,SUM(NVL(DEV_NEW,0))                DEV_NEW                                                              "+
							"      ,SUM(NVL(ACCEPT,0))                 ACCEPT                                                               "+
	                        "      ,SUM(NVL(CB_ACC,0))                 CB_ACC                                                               "+
							"      ,SUM(NVL(MON_RENT,0))               MON_RENT                                                             "+
							"      ,SUM(CASE WHEN YYY_TYPE LIKE '自有%'                                                                     "+
							"                THEN NVL(MON_RENT,0) ELSE 0 END) MON_RENT_ZY                                                          "+
							
							",SUM(PER_COST    )   PER_COST     "+
							",SUM(COMM_ACC_JZ          )   COMM_ACC_JZ           "+
							",SUM(COMM_ACC_QDBT         )   COMM_ACC_QDBT          "+
							",SUM(ZDBT1         )   ZDBT1          "+
							",SUM(GT_RENT   )   GT_RENT    "+
							",SUM(FIT_FEE       )   FIT_FEE        "+
							",SUM(KHJR_AMOUNT     )   KHJR_AMOUNT      "+
							",SUM(KCB_COST        )   KCB_COST         "+
							",SUM(WE_FEE        )   WE_FEE         "+
							",SUM(ADV_FEE         )   ADV_FEE          "+
							",SUM(YWYP_FEE        )   YWYP_FEE         "+
							",SUM(CH_PRO_PRE      )   CH_PRO_PRE       "+
							",SUM(SALE_DETAIL_SR  )   SALE_DETAIL_SR   "+
							",SUM(SALE_DETAIL_COST)   SALE_DETAIL_COST "+
							",SUM(BG_FEE          )   BG_FEE           "+
							",SUM(CAR_FEE         )   CAR_FEE          "+
							",SUM(ZD_FEE          )   ZD_FEE           "+
							",SUM(CL_FEE          )   CL_FEE           "+
							",SUM(TX_FEE          )   TX_FEE           "+

							
							"      ,SUM(NVL(ML_SR_ACC,0))              ML_SR_ACC                                                            "+
							"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(SR_ACC,0))<>0                                                    "+
							"                                 THEN SUM(NVL(ML_SR_ACC,0))*100/SUM(NVL(SR_ACC,0))                             "+
							"                                 ELSE 0 END ||  '%'                                                            "+
							"                          ,2)             ML_RATE                                                              "+
							"      ,SUM(NVL(ML_SR_ACC1,0))             ML_SR_ACC1                                                           "+
							"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(SR_ACC1,0))<>0                                                   "+
							"                                 THEN SUM(NVL(ML_SR_ACC1,0))*100/SUM(NVL(SR_ACC1,0))                           "+
							"                                 ELSE 0 END ||  '%'                                                            "+
							"                          ,2)             ML_RATE1                                                             "+
							"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACCL,0))<>0                                                "+
							"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACCL,0)))*100                       "+
							"                                      /SUM(NVL(ML_SR_ACCL,0))                                                  "+
							"                                 ELSE 0 END ||  '%'                                                            "+
							"                          ,2)             ML_RATEL                                                             "+
							"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACC_LTMN,0))<>0                                            "+
							"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACC_LTMN,0)))*100                   "+
							"                                      /SUM(NVL(ML_SR_ACC_LTMN,0))                                              "+
							"                                 ELSE 0 END ||  '%'                                                            "+
							"                          ,2)              ML_RATE_LTMN                                                        "+
							"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACCL12,0))<>0                                              "+
							"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACCL12,0)))*100                     "+
							"                                      /SUM(NVL(ML_SR_ACCL12,0))                                                "+
							"                                 ELSE 0 END ||  '%'                                                            "+
							"                          ,2)              ML_RATEL12                                                          "+
							"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                               "+
							where1+
							"GROUP BY GROUP_ID_1_NAME                                                                                       "+
                            "        ,GROUP_ID_1                                                                                         "+
							"        ,BUS_HALL_NAME                                                                                         "+
							"        ,HALL_ID                                                                                               "+
							"        ,YYY_TYPE                                                                                              "+
							"        ,CHNL_TYPE                                                                                             "+
							"        ,OPERATE_TYPE                                                                                          "+
							"        ,DEAL_DATE                                                                                             "+
							"        ,T_MANAGE_NAME                                                                                         "+
							")  T                                                                                                           "+
							"LEFT JOIN (SELECT DEAL_DATE,COUNT(HALL_ID) T_NUM                                                               "+
							"            FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                   "+
							                                            where1+
							"            GROUP BY DEAL_DATE ) T1                                                                            "+
							"ON(T.DEAL_DATE=T1.DEAL_DATE)                                                                                   "+
							")                                                                                                              "+
							                       where+
							"ORDER BY RN                                                                                              ";
	}
  }
	function getDownSql(where){
		 
		return "SELECT GROUP_ID_1_NAME,BUS_HALL_NAME                                                                    "+
		"      ,HALL_ID                                                                                                 "+
		"      ,YYY_TYPE                                                                                                "+
		"      ,CHNL_TYPE                                                                                               "+
		"      ,OPERATE_TYPE                                                                                            "+
		"      ,SR_ACC                                                                                                  "+
		"      ,SR_NEW                                                                                                  "+
		"      ,DEV_NEW                                                                                                 "+
		"      ,ACCEPT                                                                                                  "+
		"      ,MON_RENT                                                                                                "+
		"      ,MON_RENT_ZY                                                                                             "+
		
		",PER_COST     "+
		",COMM_ACC_JZ           "+
		",COMM_ACC_QDBT          "+
		",ZDBT1          "+
		",GT_RENT    "+
		",FIT_FEE        "+
		",KHJR_AMOUNT      "+
		",KCB_COST         "+
		",WE_FEE         "+
		",ADV_FEE          "+
		",YWYP_FEE         "+
		",CH_PRO_PRE       "+
		",SALE_DETAIL_SR   "+
		",SALE_DETAIL_COST "+
		",BG_FEE           "+
		",CAR_FEE          "+
		",ZD_FEE           "+
		",CL_FEE           "+
		",TX_FEE           "+
		
		"      ,ML_SR_ACC                                                                                               "+
		"      ,ML_RATE                                                                                                 "+
		"      ,ML_SR_ACC1                                                                                              "+
		"      ,ML_RATE1                                                                                                "+
		"      ,ML_RATEL                                                                                                "+
		"      ,ML_RATE_LTMN                                                                                            "+
		"      ,ML_RATEL12                                                                                              "+
		"      ,RN                                                                                                      "+
		"      ,T_MANAGE_NAME	                                                                                        "+
		"      ,CASE WHEN RN<=ROUND(T_NUM * 0.2 ,0)                                                                     "+
		"            THEN '优秀 '                                                     "+
		"            WHEN RN>ROUND(T_NUM * 0.2 ,0) AND RN <=ROUND(T_NUM * 0.9 ,0)                                       "+
		"            THEN '良好 '                                                     "+
		"            ELSE '差评 '  END evaluate                                        "+
		"FROM(                                                                                                          "+
		"SELECT GROUP_ID_1_NAME                                                                                         "+
		"      ,BUS_HALL_NAME                                                                                           "+
		"      ,HALL_ID                                                                                                 "+
		"      ,YYY_TYPE                                                                                                "+
		"      ,CHNL_TYPE                                                                                               "+
		"      ,OPERATE_TYPE                                                                                            "+
		"      ,ROUND(SR_ACC/10000,3) SR_ACC                                                                                                  "+
		"      ,ROUND(SR_NEW/10000,3) SR_NEW                                                                                                 "+
		"      ,DEV_NEW                                                                                                 "+
		"      ,ACCEPT                                                                                                  "+
		"      ,ROUND(MON_RENT/10000,3) MON_RENT                                                                                         "+
		"      ,ROUND(MON_RENT_ZY/10000,3) MON_RENT_ZY                                                                                          "+
		
		",ROUND(PER_COST    /10000,3)  PER_COST      "+
		",ROUND(COMM_ACC_JZ          /10000,3)  COMM_ACC_JZ            "+
		",ROUND(COMM_ACC_QDBT         /10000,3)  COMM_ACC_QDBT           "+
		",ROUND(ZDBT1         /10000,3)  ZDBT1           "+
		",ROUND(GT_RENT   /10000,3)  GT_RENT     "+
		",ROUND(FIT_FEE       /10000,3)  FIT_FEE         "+
		",ROUND(KHJR_AMOUNT     /10000,3)  KHJR_AMOUNT       "+
		",ROUND(KCB_COST        /10000,3)  KCB_COST          "+
		",ROUND(WE_FEE        /10000,3)  WE_FEE          "+
		",ROUND(ADV_FEE         /10000,3)  ADV_FEE           "+
		",ROUND(YWYP_FEE        /10000,3)  YWYP_FEE          "+
		",ROUND(CH_PRO_PRE      /10000,3)  CH_PRO_PRE        "+
		",ROUND(SALE_DETAIL_SR  /10000,3)  SALE_DETAIL_SR    "+
		",ROUND(SALE_DETAIL_COST/10000,3)  SALE_DETAIL_COST  "+
		",ROUND(BG_FEE          /10000,3)  BG_FEE            "+
		",ROUND(CAR_FEE         /10000,3)  CAR_FEE           "+
		",ROUND(ZD_FEE          /10000,3)  ZD_FEE            "+
		",ROUND(CL_FEE          /10000,3)  CL_FEE            "+
		",ROUND(TX_FEE          /10000,3)  TX_FEE            "+
		
		"      ,ROUND(ML_SR_ACC/10000,3)  ML_SR_ACC                                                                                             "+
		"      ,ML_RATE                                                                                                 "+
		"      ,ROUND(ML_SR_ACC1/10000,3) ML_SR_ACC1                                                                                             "+
		"      ,ML_RATE1                                                                                                "+
		"      ,ML_RATEL                                                                                                "+
		"      ,ML_RATE_LTMN                                                                                            "+
		"      ,ML_RATEL12                                                                                              "+
		"      ,ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE ORDER BY TO_NUMBER(REPLACE(ML_RATE,'%'))                    "+
		" DESC) RN                                                                                                      "+
		"      ,T_MANAGE_NAME	                                                                                        "+
		"      ,T1.T_NUM                                                                                                "+
		"FROM(                                                                                                          "+
		"SELECT GROUP_ID_1_NAME                                                                                         "+
		"      ,BUS_HALL_NAME                                                                                           "+
		"      ,HALL_ID                                                                                                 "+
		"      ,YYY_TYPE                                                                                                "+
		"      ,CHNL_TYPE                                                                                               "+
		"      ,OPERATE_TYPE                                                                                            "+
		"      ,DEAL_DATE                                                                                               "+
		"      ,T_MANAGE_NAME                                                                                           "+
		"      ,COUNT(HALL_ID)  T_NUM                                                                                   "+
		"      ,SUM(NVL(SR_ACC,0))                 SR_ACC                                                               "+
		"      ,SUM(NVL(SR_NEW,0))                 SR_NEW                                                               "+
		"      ,SUM(NVL(DEV_NEW,0))                DEV_NEW                                                              "+
		"      ,SUM(NVL(ACCEPT,0))                 ACCEPT                                                               "+
		"      ,SUM(NVL(MON_RENT,0))               MON_RENT                                                             "+
		"      ,SUM(CASE WHEN YYY_TYPE LIKE '自有%'                                                                     "+
		"                THEN NVL(MON_RENT,0) ELSE 0 END) MON_RENT_ZY                                                          "+
		
		",SUM(PER_COST    )   PER_COST     "+
		",SUM(COMM_ACC_JZ          )   COMM_ACC_JZ           "+
		",SUM(COMM_ACC_QDBT         )   COMM_ACC_QDBT          "+
		",SUM(ZDBT1         )   ZDBT1          "+
		",SUM(GT_RENT   )   GT_RENT    "+
		",SUM(FIT_FEE       )   FIT_FEE        "+
		",SUM(KHJR_AMOUNT     )   KHJR_AMOUNT      "+
		",SUM(KCB_COST        )   KCB_COST         "+
		",SUM(WE_FEE        )   WE_FEE         "+
		",SUM(ADV_FEE         )   ADV_FEE          "+
		",SUM(YWYP_FEE        )   YWYP_FEE         "+
		",SUM(CH_PRO_PRE      )   CH_PRO_PRE       "+
		",SUM(SALE_DETAIL_SR  )   SALE_DETAIL_SR   "+
		",SUM(SALE_DETAIL_COST)   SALE_DETAIL_COST "+
		",SUM(BG_FEE          )   BG_FEE           "+
		",SUM(CAR_FEE         )   CAR_FEE          "+
		",SUM(ZD_FEE          )   ZD_FEE           "+
		",SUM(CL_FEE          )   CL_FEE           "+
		",SUM(TX_FEE          )   TX_FEE           "+
		
		"      ,SUM(NVL(ML_SR_ACC,0))              ML_SR_ACC                                                            "+
		"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(SR_ACC,0))<>0                                                    "+
		"                                 THEN SUM(NVL(ML_SR_ACC,0))*100/SUM(NVL(SR_ACC,0))                             "+
		"                                 ELSE 0 END ||  '%'                                                            "+
		"                          ,2)             ML_RATE                                                              "+
		"      ,SUM(NVL(ML_SR_ACC1,0))             ML_SR_ACC1                                                           "+
		"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(SR_ACC1,0))<>0                                                   "+
		"                                 THEN SUM(NVL(ML_SR_ACC1,0))*100/SUM(NVL(SR_ACC1,0))                           "+
		"                                 ELSE 0 END ||  '%'                                                            "+
		"                          ,2)             ML_RATE1                                                             "+
		"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACCL,0))<>0                                                "+
		"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACCL,0)))*100                       "+
		"                                      /SUM(NVL(ML_SR_ACCL,0))                                                  "+
		"                                 ELSE 0 END ||  '%'                                                            "+
		"                          ,2)             ML_RATEL                                                             "+
		"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACC_LTMN,0))<>0                                            "+
		"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACC_LTMN,0)))*100                   "+
		"                                      /SUM(NVL(ML_SR_ACC_LTMN,0))                                              "+
		"                                 ELSE 0 END ||  '%'                                                            "+
		"                          ,2)              ML_RATE_LTMN                                                        "+
		"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ML_SR_ACCL12,0))<>0                                              "+
		"                                 THEN (SUM(NVL(ML_SR_ACC,0))-SUM(NVL(ML_SR_ACCL12,0)))*100                     "+
		"                                      /SUM(NVL(ML_SR_ACCL12,0))                                                "+
		"                                 ELSE 0 END ||  '%'                                                            "+
		"                          ,2)              ML_RATEL12                                                          "+
		"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                               "+
		                                            where+
		"GROUP BY GROUP_ID_1_NAME                                                                                       "+
		"        ,BUS_HALL_NAME                                                                                         "+
		"        ,HALL_ID                                                                                               "+
		"        ,YYY_TYPE                                                                                              "+
		"        ,CHNL_TYPE                                                                                             "+
		"        ,OPERATE_TYPE                                                                                          "+
		"        ,DEAL_DATE                                                                                             "+
		"        ,T_MANAGE_NAME                                                                                         "+
		")  T                                                                                                           "+
		"LEFT JOIN (SELECT DEAL_DATE,COUNT(HALL_ID) T_NUM                                                               "+
		"            FROM PMRT.TB_MRT_BUS_EFF_ANA_MON                                                                   "+
		                                            where+
		"            GROUP BY DEAL_DATE ) T1                                                                            "+
		"ON(T.DEAL_DATE=T1.DEAL_DATE)                                                                                   "+
		")                                                                                                              "+
		"ORDER BY RN                                                                                                    ";
	
	}
	
	function getLastMonth(dealDate){
		var year=dealDate.substr(0,4);
	    var month=dealDate.substr(4,6);
	    if(month=='01'){
	    	return (year-1)+'12';
	    }
	   return dealDate-1;
	}

	function getFristMonth(dealDate){
		var year=dealDate.substr(0,4);
		return year+'01';
	}

	function getLastYearSameMonth(dealDate){
		var year=dealDate.substr(0,4);
	    var month=dealDate.substr(4,6);
	    return (year-1)+month;
	}

	function getLastYearEndMonth(dealDate){
		var year=dealDate.substr(0,4);
		return (year-1)+'12';
	}
