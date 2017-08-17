$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_EFF_ANA_MON"));
	var title=[["组织架构","渠道编码","产权模式","厅类型","经营模式","开帐收入","","新增发展","业务受理量","成本类","","","","","","","","","","","","当月毛利","当月毛利率","累计毛利","累计毛利率","毛利增长","","","月环比排名","店长名字","评议标识"],
	           ["","","","","","本月","其中新增收入","","","房租","","水电","物管","安保","装修","集中佣金","渠道补贴","终端补贴","人工成本","紧密外包","房租收入","","","","","环比","同比","定比去年12月","","",""],
	           ["","","","","","","","","","本月房租成本","其中自有产权估算房租成本","","","","","","","","","","","","","","","","","","","",""]];
    
	var field=["HALL_ID","YYY_TYPE","CHNL_TYPE","OPERATE_TYPE","SR_ACC","SR_NEW","DEV_NEW","ACCEPT","MON_RENT","MON_RENT_ZY","WE_FEE","RENT_MAN_MON","SECURITY","FIT_FEE","COMM_ACC_JZ","COMM_ACC_QDBT","ZDBT1","PER_COST","JMWB","GT_RENT","ML_SR_ACC","ML_RATE","ML_SR_ACC1","ML_RATE1","ML_RATEL","ML_RATE_LTMN","ML_RATEL12","RN","T_MANAGE_NAME","EVALUATE"];
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
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(orgLevel,where);
				}else if(orgLevel==3){//点击市
					where+=" WHERE DEAL_DATE='"+dealDate+"' AND GROUP_ID_1='"+code+"'";
					sql=getSql(orgLevel,where);
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql=getSql(orgLevel,where);
				}else if(orgLevel==2||orgLevel==3){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
					sql=getSql(orgLevel,where);
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
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(hall_id!=""){
		where += " AND HALL_ID LIKE '%"+hall_id+"%' ";
	}
	var sql = getDownSql(where);
	var showtext = '营业厅毛利率评价月报表-' + dealDate;
	var title=[["地市","营业厅","渠道编码","产权模式","厅类型","经营模式","开帐收入","","新增发展","业务受理量","成本类","","","","","","","","","","","","当月毛利","当月毛利率","累计毛利","累计毛利率","毛利增长","","","月环比排名","店长名字","评议标识"],
	           ["","","","","","","本月","其中新增收入","","","房租","","水电","物管","安保","装修","集中佣金","渠道补贴","终端补贴","人工成本","紧密外包","房租收入","","","","","环比","同比","定比去年12月","","",""],
	           ["","","","","","","","","","","本月房租成本","其中自有产权估算房租成本","","","","","","","","","","","","","","","","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hall_id=$.trim($("#hall_id").val());
	var dealDate=$("#dealDate").val();
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
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
		"       SUM(NVL(T.SR_ACC, 0)) SR_ACC,                                                          "+
		"       SUM(NVL(T.SR_NEW, 0)) SR_NEW,                                                          "+
		"       SUM(NVL(T.DEV_NEW, 0)) DEV_NEW,                                                        "+
		"       SUM(NVL(T.ACCEPT, 0)) ACCEPT,                                                          "+
		"       SUM(NVL(T.MON_RENT, 0)) MON_RENT,                                                      "+
		"       SUM(T.MON_RENT_ZY) MON_RENT_ZY,                                                        "+
		"       SUM(NVL(T.WE_FEE, 0)) WE_FEE,                                                          "+
		"       SUM(NVL(T.RENT_MAN_MON, 0)) RENT_MAN_MON,                                              "+
		"       SUM(NVL(T.SECURITY, 0)) SECURITY,                                                      "+
		"       SUM(NVL(T.FIT_FEE, 0)) FIT_FEE,                                                        "+
		"       SUM(NVL(T.COMM_ACC_JZ, 0)) COMM_ACC_JZ,                                                "+
		"       SUM(NVL(T.COMM_ACC_QDBT, 0)) COMM_ACC_QDBT,                                            "+
		"       SUM(NVL(T.ZDBT1, 0)) ZDBT1,                                                            "+
		"       SUM(NVL(T.PER_COST, 0)) PER_COST,                                                      "+
		"       SUM(NVL(T.JMWB, 0)) JMWB,                                                              "+
		"       SUM(NVL(T.GT_RENT, 0)) GT_RENT,                                                        "+
		"       SUM(NVL(T.ML_SR_ACC, 0)) ML_SR_ACC,                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T.SR_ACC, 0)) <> 0 THEN                            "+
		"                               SUM(NVL(T.ML_SR_ACC, 0)) * 100 / SUM(NVL(T.SR_ACC, 0))         "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE,                                                       "+
		"       SUM(NVL(T4.ML_SR_ACC, 0)) ML_SR_ACC1,                                                  "+
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
		"               SUM(NVL(WE_FEE, 0)) WE_FEE,                                                    "+
		"               SUM(NVL(RENT_MAN_MON, 0)) RENT_MAN_MON,                                        "+
		"               SUM(NVL(SECURITY, 0)) SECURITY,                                                "+
		"               SUM(NVL(FIT_FEE, 0)) FIT_FEE,                                                  "+
		"               SUM(NVL(COMM_ACC_JZ, 0)) COMM_ACC_JZ,                                          "+
		"               SUM(NVL(COMM_ACC_QDBT, 0)) COMM_ACC_QDBT,                                      "+
		"               SUM(NVL(ZDBT1, 0)) ZDBT1,                                                      "+
		"               SUM(NVL(PER_COST, 0)) PER_COST,                                                "+
		"               SUM(NVL(JMWB, 0)) JMWB,                                                        "+
		"               SUM(NVL(GT_RENT, 0)) GT_RENT,                                                  "+
		"               SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC,                                              "+
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
		"       SUM(NVL(T.SR_ACC, 0)) SR_ACC,                                                          "+
		"       SUM(NVL(T.SR_NEW, 0)) SR_NEW,                                                          "+
		"       SUM(NVL(T.DEV_NEW, 0)) DEV_NEW,                                                        "+
		"       SUM(NVL(T.ACCEPT, 0)) ACCEPT,                                                          "+
		"       SUM(NVL(T.MON_RENT, 0)) MON_RENT,                                                      "+
		"       SUM(T.MON_RENT_ZY) MON_RENT_ZY,                                                        "+
		"       SUM(NVL(T.WE_FEE, 0)) WE_FEE,                                                          "+
		"       SUM(NVL(T.RENT_MAN_MON, 0)) RENT_MAN_MON,                                              "+
		"       SUM(NVL(T.SECURITY, 0)) SECURITY,                                                      "+
		"       SUM(NVL(T.FIT_FEE, 0)) FIT_FEE,                                                        "+
		"       SUM(NVL(T.COMM_ACC_JZ, 0)) COMM_ACC_JZ,                                                "+
		"       SUM(NVL(T.COMM_ACC_QDBT, 0)) COMM_ACC_QDBT,                                            "+
		"       SUM(NVL(T.ZDBT1, 0)) ZDBT1,                                                            "+
		"       SUM(NVL(T.PER_COST, 0)) PER_COST,                                                      "+
		"       SUM(NVL(T.JMWB, 0)) JMWB,                                                              "+
		"       SUM(NVL(T.GT_RENT, 0)) GT_RENT,                                                        "+
		"       SUM(NVL(T.ML_SR_ACC, 0)) ML_SR_ACC,                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN SUM(NVL(T.SR_ACC, 0)) <> 0 THEN                            "+
		"                               SUM(NVL(T.ML_SR_ACC, 0)) * 100 / SUM(NVL(T.SR_ACC, 0))         "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) ML_RATE,                                                       "+
		"       SUM(NVL(T4.ML_SR_ACC, 0)) ML_SR_ACC1,                                                  "+
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
		"               SUM(NVL(WE_FEE, 0)) WE_FEE,                                                    "+
		"               SUM(NVL(RENT_MAN_MON, 0)) RENT_MAN_MON,                                        "+
		"               SUM(NVL(SECURITY, 0)) SECURITY,                                                "+
		"               SUM(NVL(FIT_FEE, 0)) FIT_FEE,                                                  "+
		"               SUM(NVL(COMM_ACC_JZ, 0)) COMM_ACC_JZ,                                          "+
		"               SUM(NVL(COMM_ACC_QDBT, 0)) COMM_ACC_QDBT,                                      "+
		"               SUM(NVL(ZDBT1, 0)) ZDBT1,                                                      "+
		"               SUM(NVL(PER_COST, 0)) PER_COST,                                                "+
		"               SUM(NVL(JMWB, 0)) JMWB,                                                        "+
		"               SUM(NVL(GT_RENT, 0)) GT_RENT,                                                  "+
		"               SUM(NVL(ML_SR_ACC, 0)) ML_SR_ACC,                                              "+
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
		return "SELECT GROUP_ID_1_NAME,BUS_HALL_NAME ROW_NAME                                                           "+
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
		"      ,WE_FEE                                                                                                  "+
		"      ,RENT_MAN_MON                                                                                            "+
		"      ,SECURITY                                                                                                "+
		"      ,FIT_FEE                                                                                                 "+
		"      ,COMM_ACC_JZ                                                                                             "+
		"      ,COMM_ACC_QDBT                                                                                           "+
		"      ,ZDBT1                                                                                                   "+
		"      ,PER_COST                                                                                                "+
		"      ,JMWB                                                                                                    "+
		"      ,GT_RENT                                                                                                 "+
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
		"            THEN '优秀 <image src=\"..\\images\\good.png\" />'                                                     "+
		"            WHEN RN>ROUND(T_NUM * 0.2 ,0) AND RN <=ROUND(T_NUM * 0.9 ,0)                                       "+
		"            THEN '良好 <image src=\"..\\images\\good.png\" />'                                                     "+
		"            ELSE '差评 <image src=\"..\\images\\bad.png\" />'  END evaluate                                        "+
		"FROM(                                                                                                          "+
		"SELECT GROUP_ID_1_NAME                                                                                         "+
		"      ,BUS_HALL_NAME                                                                                           "+
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
		"      ,WE_FEE                                                                                                  "+
		"      ,RENT_MAN_MON                                                                                            "+
		"      ,SECURITY                                                                                                "+
		"      ,FIT_FEE                                                                                                 "+
		"      ,COMM_ACC_JZ                                                                                             "+
		"      ,COMM_ACC_QDBT                                                                                           "+
		"      ,ZDBT1                                                                                                   "+
		"      ,PER_COST                                                                                                "+
		"      ,JMWB                                                                                                    "+
		"      ,GT_RENT                                                                                                 "+
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
		"      ,SUM(NVL(WE_FEE,0))                 WE_FEE                                                               "+
		"      ,SUM(NVL(RENT_MAN_MON,0))           RENT_MAN_MON                                                         "+
		"      ,SUM(NVL(SECURITY,0))               SECURITY                                                             "+
		"      ,SUM(NVL(FIT_FEE,0))                FIT_FEE                                                              "+
		"      ,SUM(NVL(COMM_ACC_JZ,0))            COMM_ACC_JZ                                                          "+
		"      ,SUM(NVL(COMM_ACC_QDBT,0))          COMM_ACC_QDBT                                                        "+
		"      ,SUM(NVL(ZDBT1,0))                  ZDBT1                                                                "+
		"      ,SUM(NVL(PER_COST,0))               PER_COST                                                             "+
		"      ,SUM(NVL(JMWB,0))                   JMWB                                                                 "+
		"      ,SUM(NVL(GT_RENT,0))                GT_RENT                                                              "+
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
		"      ,WE_FEE                                                                                                  "+
		"      ,RENT_MAN_MON                                                                                            "+
		"      ,SECURITY                                                                                                "+
		"      ,FIT_FEE                                                                                                 "+
		"      ,COMM_ACC_JZ                                                                                             "+
		"      ,COMM_ACC_QDBT                                                                                           "+
		"      ,ZDBT1                                                                                                   "+
		"      ,PER_COST                                                                                                "+
		"      ,JMWB                                                                                                    "+
		"      ,GT_RENT                                                                                                 "+
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
		"      ,SR_ACC                                                                                                  "+
		"      ,SR_NEW                                                                                                  "+
		"      ,DEV_NEW                                                                                                 "+
		"      ,ACCEPT                                                                                                  "+
		"      ,MON_RENT                                                                                                "+
		"      ,MON_RENT_ZY                                                                                             "+
		"      ,WE_FEE                                                                                                  "+
		"      ,RENT_MAN_MON                                                                                            "+
		"      ,SECURITY                                                                                                "+
		"      ,FIT_FEE                                                                                                 "+
		"      ,COMM_ACC_JZ                                                                                             "+
		"      ,COMM_ACC_QDBT                                                                                           "+
		"      ,ZDBT1                                                                                                   "+
		"      ,PER_COST                                                                                                "+
		"      ,JMWB                                                                                                    "+
		"      ,GT_RENT                                                                                                 "+
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
		"      ,SUM(NVL(WE_FEE,0))                 WE_FEE                                                               "+
		"      ,SUM(NVL(RENT_MAN_MON,0))           RENT_MAN_MON                                                         "+
		"      ,SUM(NVL(SECURITY,0))               SECURITY                                                             "+
		"      ,SUM(NVL(FIT_FEE,0))                FIT_FEE                                                              "+
		"      ,SUM(NVL(COMM_ACC_JZ,0))            COMM_ACC_JZ                                                          "+
		"      ,SUM(NVL(COMM_ACC_QDBT,0))          COMM_ACC_QDBT                                                        "+
		"      ,SUM(NVL(ZDBT1,0))                  ZDBT1                                                                "+
		"      ,SUM(NVL(PER_COST,0))               PER_COST                                                             "+
		"      ,SUM(NVL(JMWB,0))                   JMWB                                                                 "+
		"      ,SUM(NVL(GT_RENT,0))                GT_RENT                                                              "+
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
