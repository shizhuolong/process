var title=[["组织架构","厅数","营业人数","面积数","厅效","","","人效","","","坪效","","","厅效毛利","",""],
	           ["","","","","收入","发展","毛利","收入","发展","毛利","收入","发展","毛利","环比","同比","定比1月"]];

var field=["ROW_NAME","T_NUM","YYT_NUM","AREA_STRUCTURE","T_SR_AVG","T_DEV_AVG","T_ML_AVG","R_SR_AVG","R_DEV_AVG","R_ML_AVG","P_SR_AVG","P_DEV_AVG","P_ML_AVG","T_ML_AVG_HB","T_ML_AVG_TB","T_ML_AVG_DB"];

$(function(){
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
		field:field,
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
			var where=" AND T.OPERATE_TYPE='自营'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(orgLevel,where);
				}else if(orgLevel==3){//点击市
					where=" WHERE T.DEAL_DATE='"+dealDate+"' AND T.OPERATE_TYPE='自营' AND T.GROUP_ID_1="+code;
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
					where+=" AND T.GROUP_ID_1='"+code+"'";
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
	var where=" WHERE T.DEAL_DATE='"+dealDate+"' AND T.OPERATE_TYPE='自营'";
	if (orgLevel == 1) {//省
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	
	var sql = getSql(3,where);
	var showtext = '自有厅效能月报表-' + dealDate;
	var title=[["营业厅","厅数","营业人数","面积数","厅效","","","人效","","","坪效","","","厅效毛利","",""],
	           ["","","","","收入","发展","毛利","收入","发展","毛利","收入","发展","毛利","环比","同比","定比1月"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var dealDate=$("#dealDate").val();
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(orgLevel==1){
		return "SELECT T.GROUP_ID_0 ROW_ID,                                                                                                                                                                                "+
		"       '云南省' ROW_NAME,                                                                      "+
		"       T.T_NUM,                                                                              "+
		"       T.YYT_NUM,                                                                            "+
		"       T.AREA_STRUCTURE,                                                                     "+
		"       T.T_SR_AVG,                                                                           "+
		"       T.T_DEV_AVG,                                                                          "+
		"       T.T_ML_AVG,                                                                           "+
		"       T.R_SR_AVG,                                                                           "+
		"       T.R_DEV_AVG,                                                                          "+
		"       T.R_ML_AVG,                                                                           "+
		"       T.P_SR_AVG,                                                                           "+
		"       T.P_DEV_AVG,                                                                          "+
		"       T.P_ML_AVG,                                                                           "+
		"       PODS.GET_RADIX_POINT(CASE                                                             "+
		"                              WHEN ROUND(CASE                                                "+
		"                                           WHEN T1.T_NUM<> 0 THEN                            "+
		"                                                T1.ML_SR_ACC / T1.T_NUM                      "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                         END,                                                "+
		"                                         2) <> 0                                             "+
		"                               THEN                                                          "+
		"                               (ROUND(CASE                                                   "+
		"                                           WHEN T.T_NUM <> 0 THEN                            "+
		"                                                T.ML_SR_ACC / T.T_NUM                        "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                            END,2) - ROUND(CASE                              "+
		"                                                 WHEN T1.T_NUM <> 0 THEN                     "+
		"                                                      T1.ML_SR_ACC / T1.T_NUM                "+
		"                                                 ELSE                                        "+
		"                                                 0                                           "+
		"                                                 END,2))*100 / ROUND(CASE                    "+
		"                                                                WHEN T1.T_NUM <> 0 THEN      "+
		"                                                                     T1.ML_SR_ACC / T1.T_NUM "+
		"                                                                     ELSE                    "+
		"                                                                     0                       "+
		"                                                                     END,2)                  "+
		"                              ELSE                                                           "+
		"                               0                                                             "+
		"                            END || '%',                                                      "+
		"                            2) T_ML_AVG_HB,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                             "+
		"                              WHEN ROUND(CASE                                                "+
		"                                           WHEN T2.T_NUM <> 0 THEN                           "+
		"                                                T2.ML_SR_ACC / T2.T_NUM                      "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                         END,                                                "+
		"                                         2) <> 0                                             "+
		"                               THEN                                                          "+
		"                               (ROUND(CASE                                                   "+
		"                                           WHEN T.T_NUM <> 0 THEN                            "+
		"                                                T.ML_SR_ACC / T.T_NUM                        "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                            END,2) - ROUND(CASE                              "+
		"                                                 WHEN T2.T_NUM <> 0 THEN                     "+
		"                                                      T2.ML_SR_ACC / T2.T_NUM                "+
		"                                                 ELSE                                        "+
		"                                                 0                                           "+
		"                                                 END,2))*100 / ROUND(CASE                    "+
		"                                                                WHEN T2.T_NUM <> 0 THEN      "+
		"                                                                     T2.ML_SR_ACC / T2.T_NUM "+
		"                                                                     ELSE                    "+
		"                                                                     0                       "+
		"                                                                     END,2)                  "+
		"                              ELSE                                                           "+
		"                               0                                                             "+
		"                            END || '%',                                                      "+
		"                            2) T_ML_AVG_TB,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                             "+
		"                              WHEN ROUND(CASE                                                "+
		"                                           WHEN T3.T_NUM <> 0 THEN                           "+
		"                                                T3.ML_SR_ACC / T3.T_NUM                      "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                         END,                                                "+
		"                                         2) <> 0                                             "+
		"                               THEN                                                          "+
		"                               (ROUND(CASE                                                   "+
		"                                           WHEN T.T_NUM <> 0 THEN                            "+
		"                                                T.ML_SR_ACC / T.T_NUM                        "+
		"                                           ELSE                                              "+
		"                                            0                                                "+
		"                                            END,2) - ROUND(CASE                              "+
		"                                                 WHEN T3.T_NUM <> 0 THEN                     "+
		"                                                      T3.ML_SR_ACC / T3.T_NUM                "+
		"                                                 ELSE                                        "+
		"                                                 0                                           "+
		"                                                 END,2))*100 / ROUND(CASE                    "+
		"                                                                WHEN T3.T_NUM <> 0 THEN      "+
		"                                                                     T3.ML_SR_ACC / T3.T_NUM "+
		"                                                                     ELSE                    "+
		"                                                                     0                       "+
		"                                                                     END,2)                  "+
		"                              ELSE                                                           "+
		"                               0                                                             "+
		"                            END || '%',                                                      "+
		"                            2) T_ML_AVG_DB                                                   "+
		"  FROM （SELECT GROUP_ID_0,                                                                  "+
		"                     NVL(COUNT(T.HALL_ID), 0) T_NUM,                                         "+
		"                     NVL(SUM(T.YYT_NUM), 0) YYT_NUM,                                         "+
		"                     NVL(SUM(T.AREA_STRUCTURE), 0) AREA_STRUCTURE,                           "+
		"                     NVL(SUM(T.ML_SR_ACC), 0)  ML_SR_ACC，                                   "+
		"                     NVL(SUM(T.SR_ACC), 0)  SR_ACC，                                         "+
		"                     ROUND(CASE                                                              "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                       "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(COUNT(T.HALL_ID), 0)                             "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) T_SR_AVG,                                                                    "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                       "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(COUNT(T.HALL_ID), 0)                            "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             0) T_DEV_AVG,                                                                   "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                       "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(COUNT(T.HALL_ID), 0)                          "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) T_ML_AVG,                                                                    "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                         "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(SUM(T.YYT_NUM), 0)                               "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) R_SR_AVG,                                                                    "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                         "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(SUM(T.YYT_NUM), 0)                              "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             0) R_DEV_AVG,                                                                   "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                         "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(SUM(T.YYT_NUM), 0)                            "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) R_ML_AVG,                                                                    "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                  "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                        "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) P_SR_AVG,                                                                    "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                  "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                       "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             0) P_DEV_AVG,                                                                   "+
		"       ROUND(CASE                                                                            "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                  "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                     "+
		"               ELSE                                                                          "+
		"                0                                                                            "+
		"             END,                                                                            "+
		"             2) P_ML_AVG                                                                     "+
		"              FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                             "+
		"              WHERE DEAL_DATE = '"+dealDate+"'                                               "+
		             where+
		"              GROUP BY GROUP_ID_0                                                            "+
		"  ）T                                                                                        "+
		"  LEFT JOIN (SELECT GROUP_ID_0                                                               "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                           "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                        "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                        "+
		"                   WHERE DEAL_DATE = '"+getLastMonth(dealDate)+"'                            "+
		             where+ 
		"                   GROUP BY GROUP_ID_0                                                       "+
		"  )T1                                                                                        "+
		"    ON (T.GROUP_ID_0 = T1.GROUP_ID_0)                                                        "+
		"   LEFT JOIN (SELECT GROUP_ID_0                                                              "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                           "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                        "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                        "+
		"                   WHERE DEAL_DATE = '"+getLastYearSameMonth(dealDate)+"'                    "+
		             where+
		"                   GROUP BY GROUP_ID_0                                                       "+
		"  )T2                                                                                        "+
		"    ON (T.GROUP_ID_0 = T2.GROUP_ID_0)                                                        "+
		"   LEFT JOIN (SELECT GROUP_ID_0                                                              "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                           "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                        "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                        "+
		"                   WHERE DEAL_DATE = '"+getFristMonth(dealDate)+"'                           "+
		             where+
		"                   GROUP BY GROUP_ID_0                                                       "+
		"  )T3                                                                                        "+
		"    ON (T.GROUP_ID_0 = T3.GROUP_ID_0)                                                        ";
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                            "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                            "+
		"       T.T_NUM,                                                                               "+
		"       T.YYT_NUM,                                                                             "+
		"       T.AREA_STRUCTURE,                                                                      "+
		"       T.T_SR_AVG,                                                                            "+
		"       T.T_DEV_AVG,                                                                           "+
		"       T.T_ML_AVG,                                                                            "+
		"       T.R_SR_AVG,                                                                            "+
		"       T.R_DEV_AVG,                                                                           "+
		"       T.R_ML_AVG,                                                                            "+
		"       T.P_SR_AVG,                                                                            "+
		"       T.P_DEV_AVG,                                                                           "+
		"       T.P_ML_AVG,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN ROUND(CASE                                                 "+
		"                                           WHEN T1.T_NUM<> 0 THEN                             "+
		"                                                T1.ML_SR_ACC / T1.T_NUM                       "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                         END,                                                 "+
		"                                         2) <> 0                                              "+
		"                               THEN                                                           "+
		"                               (ROUND(CASE                                                    "+
		"                                           WHEN T.T_NUM <> 0 THEN                             "+
		"                                                T.ML_SR_ACC / T.T_NUM                         "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                            END,2) - ROUND(CASE                               "+
		"                                                 WHEN T1.T_NUM <> 0 THEN                      "+
		"                                                      T1.ML_SR_ACC / T1.T_NUM                 "+
		"                                                 ELSE                                         "+
		"                                                 0                                            "+
		"                                                 END,2))*100 / ROUND(CASE                     "+
		"                                                                WHEN T1.T_NUM <> 0 THEN       "+
		"                                                                     T1.ML_SR_ACC / T1.T_NUM  "+
		"                                                                     ELSE                     "+
		"                                                                     0                        "+
		"                                                                     END,2)                   "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) T_ML_AVG_HB,                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN ROUND(CASE                                                 "+
		"                                           WHEN T2.T_NUM <> 0 THEN                            "+
		"                                                T2.ML_SR_ACC / T2.T_NUM                       "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                         END,                                                 "+
		"                                         2) <> 0                                              "+
		"                               THEN                                                           "+
		"                               (ROUND(CASE                                                    "+
		"                                           WHEN T.T_NUM <> 0 THEN                             "+
		"                                                T.ML_SR_ACC / T.T_NUM                         "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                            END,2) - ROUND(CASE                               "+
		"                                                 WHEN T2.T_NUM <> 0 THEN                      "+
		"                                                      T2.ML_SR_ACC / T2.T_NUM                 "+
		"                                                 ELSE                                         "+
		"                                                 0                                            "+
		"                                                 END,2))*100 / ROUND(CASE                     "+
		"                                                                WHEN T2.T_NUM <> 0 THEN       "+
		"                                                                     T2.ML_SR_ACC / T2.T_NUM  "+
		"                                                                     ELSE                     "+
		"                                                                     0                        "+
		"                                                                     END,2)                   "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) T_ML_AVG_TB,                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                              "+
		"                              WHEN ROUND(CASE                                                 "+
		"                                           WHEN T3.T_NUM <> 0 THEN                            "+
		"                                                T3.ML_SR_ACC / T3.T_NUM                       "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                         END,                                                 "+
		"                                         2) <> 0                                              "+
		"                               THEN                                                           "+
		"                               (ROUND(CASE                                                    "+
		"                                           WHEN T.T_NUM <> 0 THEN                             "+
		"                                                T.ML_SR_ACC / T.T_NUM                         "+
		"                                           ELSE                                               "+
		"                                            0                                                 "+
		"                                            END,2) - ROUND(CASE                               "+
		"                                                 WHEN T3.T_NUM <> 0 THEN                      "+
		"                                                      T3.ML_SR_ACC / T3.T_NUM                 "+
		"                                                 ELSE                                         "+
		"                                                 0                                            "+
		"                                                 END,2))*100 / ROUND(CASE                     "+
		"                                                                WHEN T3.T_NUM <> 0 THEN       "+
		"                                                                     T3.ML_SR_ACC / T3.T_NUM  "+
		"                                                                     ELSE                     "+
		"                                                                     0                        "+
		"                                                                     END,2)                   "+
		"                              ELSE                                                            "+
		"                               0                                                              "+
		"                            END || '%',                                                       "+
		"                            2) T_ML_AVG_DB                                                    "+
		"  FROM （SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                        "+
		"                     NVL(COUNT(T.HALL_ID), 0) T_NUM,                                          "+
		"                     NVL(SUM(T.YYT_NUM), 0) YYT_NUM,                                          "+
		"                     NVL(SUM(T.AREA_STRUCTURE), 0) AREA_STRUCTURE,                            "+
		"                     NVL(SUM(T.ML_SR_ACC), 0)  ML_SR_ACC，                                    "+
		"                     NVL(SUM(T.SR_ACC), 0)  SR_ACC，                                          "+
		"                     ROUND(CASE                                                               "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                        "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(COUNT(T.HALL_ID), 0)                              "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) T_SR_AVG,                                                                     "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                        "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(COUNT(T.HALL_ID), 0)                             "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             0) T_DEV_AVG,                                                                    "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(COUNT(T.HALL_ID), 0) <> 0 THEN                                        "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(COUNT(T.HALL_ID), 0)                           "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) T_ML_AVG,                                                                     "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                          "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(SUM(T.YYT_NUM), 0)                                "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) R_SR_AVG,                                                                     "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                          "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(SUM(T.YYT_NUM), 0)                               "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             0) R_DEV_AVG,                                                                    "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.YYT_NUM), 0) <> 0 THEN                                          "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(SUM(T.YYT_NUM), 0)                             "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) R_ML_AVG,                                                                     "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                   "+
		"                NVL(SUM(T.SR_ACC), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                         "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) P_SR_AVG,                                                                     "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                   "+
		"                NVL(SUM(T.DEV_NEW), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                        "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             0) P_DEV_AVG,                                                                    "+
		"       ROUND(CASE                                                                             "+
		"               WHEN NVL(SUM(T.AREA_STRUCTURE), 0) <> 0 THEN                                   "+
		"                NVL(SUM(T.ML_SR_ACC), 0) / NVL(SUM(T.AREA_STRUCTURE), 0)                      "+
		"               ELSE                                                                           "+
		"                0                                                                             "+
		"             END,                                                                             "+
		"             2) P_ML_AVG                                                                      "+
		"              FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                              "+
		"              WHERE DEAL_DATE = '"+dealDate+"'                                                "+
		            where+
		"              GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                  "+
		"  ）T                                                                                         "+
		"  LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                     "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                            "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                         "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                         "+
		"                   WHERE DEAL_DATE = '"+getLastMonth(dealDate)+"'                             "+
		            where+
		"                   GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                             "+
		"  )T1                                                                                         "+
		"    ON (T.GROUP_ID_1 = T1.GROUP_ID_1)                                                         "+
		"   LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                    "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                            "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                         "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                         "+
		"                   WHERE DEAL_DATE = '"+getLastYearSameMonth(dealDate)+"'                     "+
		            where+
		"                   GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                             "+
		"  )T2                                                                                         "+
		"    ON (T.GROUP_ID_1 = T2.GROUP_ID_1)                                                         "+
		"   LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                    "+
		"                   ,NVL(COUNT(T.HALL_ID), 0) T_NUM                                            "+
		"                   ,NVL(SUM(T.ML_SR_ACC), 0)ML_SR_ACC                                         "+
		"                   FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                         "+
		"                   WHERE DEAL_DATE = '"+getFristMonth(dealDate)+"'                            "+
		            where+
		"                   GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                             "+
		"  )T3                                                                                         "+
		"    ON (T.GROUP_ID_1 = T3.GROUP_ID_1)                                                         ";
	}else{
		return "SELECT T.BUS_HALL_NAME ROW_NAME                                                                        "+
		",NVL(COUNT(T.HALL_ID),0)         T_NUM                                                                        "+
		"      ,NVL(SUM(T.YYT_NUM),0)           YYT_NUM                                                                "+
		"      ,NVL(SUM(T.AREA_STRUCTURE),0)    AREA_STRUCTURE                                                         "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                                                              "+
		"                THEN NVL(SUM(T.SR_ACC),0)/NVL(COUNT(T.HALL_ID),0)                                             "+
		"                ELSE 0 END ,2)         T_SR_AVG                                                               "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                                                              "+
		"                THEN NVL(SUM(T.DEV_NEW),0)/NVL(COUNT(T.HALL_ID),0)                                            "+
		"                ELSE 0 END ,0)          T_DEV_AVG                                                             "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                                                              "+
		"                THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(COUNT(T.HALL_ID),0)                                          "+
		"                ELSE 0 END ,2)          T_ML_AVG                                                              "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.YYT_NUM),0) <>0                                                                "+
		"                THEN NVL(SUM(T.SR_ACC),0)/NVL(SUM(T.YYT_NUM),0)                                               "+
		"                ELSE 0 END ,2)         R_SR_AVG                                                               "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.YYT_NUM),0) <>0                                                                "+
		"                THEN NVL(SUM(T.DEV_NEW),0)/NVL(SUM(T.YYT_NUM),0)                                              "+
		"                ELSE 0 END ,0)          R_DEV_AVG                                                             "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.YYT_NUM),0) <>0                                                                "+
		"                THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(SUM(T.YYT_NUM),0)                                            "+
		"                ELSE 0 END ,2)          R_ML_AVG                                                              "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.AREA_STRUCTURE),0) <>0                                                         "+
		"                THEN NVL(SUM(T.SR_ACC),0)/NVL(SUM(T.AREA_STRUCTURE),0)                                        "+
		"                ELSE 0 END ,2)         P_SR_AVG                                                               "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.AREA_STRUCTURE),0) <>0                                                         "+
		"                THEN NVL(SUM(T.DEV_NEW),0)/NVL(SUM(T.AREA_STRUCTURE),0)                                       "+
		"                ELSE 0 END ,0)          P_DEV_AVG                                                             "+
		"      ,ROUND(                                                                                                 "+
		"           CASE WHEN NVL(SUM(T.AREA_STRUCTURE),0) <>0                                                         "+
		"                THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(SUM(T.AREA_STRUCTURE),0)                                     "+
		"                ELSE 0 END ,2)          P_ML_AVG                                                              "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN ROUND(CASE WHEN NVL(COUNT(T1.HALL_ID),0) <>0                           "+
		"                                                  THEN NVL(SUM(T1.ML_SR_ACC),0)/NVL(COUNT(T1.HALL_ID),0)      "+
		"                                                  ELSE 0 END ,2)    <>0                                       "+
		"                                  THEN (ROUND(CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                           "+
		"                                                   THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(COUNT(T.HALL_ID),0)       "+
		"                                                   ELSE 0 END ,2)-                                            "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T1.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T1.ML_SR_ACC),0)/NVL(COUNT(T1.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2))/                                           "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T1.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T1.ML_SR_ACC),0)/NVL(COUNT(T1.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2)                                             "+
		"                                   ELSE 0 END  || '%',2)    T_ML_AVG_HB                                       "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN ROUND(CASE WHEN NVL(COUNT(T2.HALL_ID),0) <>0                           "+
		"                                                  THEN NVL(SUM(T2.ML_SR_ACC),0)/NVL(COUNT(T2.HALL_ID),0)      "+
		"                                                  ELSE 0 END ,2)    <>0                                       "+
		"                                  THEN (ROUND(CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                           "+
		"                                                   THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(COUNT(T.HALL_ID),0)       "+
		"                                                   ELSE 0 END ,2)-                                            "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T2.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T2.ML_SR_ACC),0)/NVL(COUNT(T2.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2))/                                           "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T2.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T2.ML_SR_ACC),0)/NVL(COUNT(T2.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2)                                             "+
		"                                   ELSE 0 END  || '%',2)    T_ML_AVG_TB                                       "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN ROUND(CASE WHEN NVL(COUNT(T3.HALL_ID),0) <>0                           "+
		"                                                  THEN NVL(SUM(T3.ML_SR_ACC),0)/NVL(COUNT(T3.HALL_ID),0)      "+
		"                                                  ELSE 0 END ,2)    <>0                                       "+
		"                                  THEN (ROUND(CASE WHEN NVL(COUNT(T.HALL_ID),0) <>0                           "+
		"                                                   THEN NVL(SUM(T.ML_SR_ACC),0)/NVL(COUNT(T.HALL_ID),0)       "+
		"                                                   ELSE 0 END ,2)-                                            "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T3.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T3.ML_SR_ACC),0)/NVL(COUNT(T3.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2))/                                           "+
		"                                        ROUND(CASE WHEN NVL(COUNT(T3.HALL_ID),0) <>0                          "+
		"                                                   THEN NVL(SUM(T3.ML_SR_ACC),0)/NVL(COUNT(T3.HALL_ID),0)     "+
		"                                                   ELSE 0 END ,2)                                             "+
		"                                   ELSE 0 END  || '%',2)    T_ML_AVG_DB                                       "+                                   
		"FROM PMRT.TB_MRT_BUS_EFF_ANA_MON T                                                                            "+
		"LEFT JOIN PMRT.TB_MRT_BUS_EFF_ANA_MON T1                                                                      "+
		"ON(T.HALL_ID=T1.HALL_ID AND T1.DEAL_DATE="+getLastMonth(dealDate)+")                                          "+
		"LEFT JOIN PMRT.TB_MRT_BUS_EFF_ANA_MON T2                                                                      "+
		"ON(T.HALL_ID=T2.HALL_ID AND T2.DEAL_DATE="+getLastYearSameMonth(dealDate)+")                                  "+
		"LEFT JOIN PMRT.TB_MRT_BUS_EFF_ANA_MON T3                                                                      "+
		"ON(T.HALL_ID=T3.HALL_ID AND T3.DEAL_DATE="+getFristMonth(dealDate)+")                                         "+
		      where+
		"GROUP BY T.HALL_ID,T.BUS_HALL_NAME";
	}
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