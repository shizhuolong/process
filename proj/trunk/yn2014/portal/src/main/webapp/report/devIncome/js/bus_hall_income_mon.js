$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_HALL_INCOME_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	var title=[["营业厅开帐收入月报表","","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网收入","","其中4G收入","","固网收入","","其中宽带收 入","","其中智慧沃家收入","","其中2I2C","","合计","环比","同比","定比上季度月均","全渠道收入","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","",""]];
    
	var field=["HQ_CHAN_CODE","T_TYPE","OPERATE_TYPE","THIS_YW_SR","HB_YW","THIS_4G_SR","HB_4G","NETW_SR","HB_NETW","THIS_GWKD_SR","HB_GWKD","THIS_ZHWJ_SR","HB_ZHWJ","THIS_2I2C_SR","HB_2I2C","ALL_SR","HB_ALL","TB_ALL","DB_ALL","ALL1_SR","ALL_CHANL_SR","HB_ALL_CHANL"];
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
			var preField='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var hallType = $("#hallType").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var where="";
			var where1="";
			var groupBy="";
			var levelSql;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND GROUP_ID_0='"+code+"'";
					levelSql=2;
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
					where1+=" AND GROUP_ID_1='"+code+"'";
					levelSql=3;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT '86000' ROW_ID,'云南省' ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND GROUP_ID_0='"+code+"'";
					levelSql=1;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND GROUP_ID_1='"+code+"'";
					where1+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
					levelSql=2;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
				where1+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(hallType!=""){
				where += " AND T_TYPE ='"+hallType+"' ";
			}
			
			var sql="";
			if(startDate==endDate){
				if(levelSql==3){
					sql=getSumSql(levelSql,startDate,endDate,where,where1);
				}else{
					sql=preField+getSumSql(levelSql,startDate,endDate,where,where1);
				}
			}else{
				sql=preField+getDifferentDateSql(levelSql,startDate,endDate,where,where1);
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
function getSumSql(levelSql,startDate,endDate,where,where1) {
		if(levelSql==1){
			return "       T.THIS_YW_SR,                                                                        "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.THIS_YW_SR<>0 THEN (T.THIS_YW_SR-T1.THIS_YW_SR)*100/T1.THIS_YW_SR           "+
			"               ELSE 0 END ||'%',2) HB_YW,                                                          "+
			"       T.THIS_4G_SR,                                                                               "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.THIS_4G_SR<>0 THEN (T.THIS_4G_SR-T1.THIS_4G_SR)*100/T1.THIS_4G_SR           "+
			"               ELSE 0 END ||'%',2) HB_4G,                                                          "+
			"       T.NETW_SR,                                                                                  "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.NETW_SR<>0 THEN (T.NETW_SR-T1.NETW_SR)*100/T1.NETW_SR                       "+
			"               ELSE 0 END ||'%',2) HB_NETW,                                                        "+
			"       T.THIS_GWKD_SR,                                                                             "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.THIS_GWKD_SR<>0 THEN (T.THIS_GWKD_SR-T1.THIS_GWKD_SR)*100/T1.THIS_GWKD_SR   "+
			"               ELSE 0 END ||'%',2) HB_GWKD,                                                        "+
			"       T.THIS_ZHWJ_SR,                                                                             "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.THIS_ZHWJ_SR<>0 THEN (T.THIS_ZHWJ_SR-T1.THIS_ZHWJ_SR)*100/T1.THIS_ZHWJ_SR   "+
			"               ELSE 0 END ||'%',2) HB_ZHWJ,                                                        "+
			"T.THIS_2I2C_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
			"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_2I2C,                                                    "+			
			
			"       T.ALL_SR,                                                                                   "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T1.ALL_SR<>0 THEN (T.ALL_SR-T1.ALL_SR)*100/T1.ALL_SR                           "+
			"               ELSE 0 END ||'%',2) HB_ALL,                                                         "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T2.ALL_SR<>0 THEN (T.ALL_SR-T2.ALL_SR)*100/T2.ALL_SR                           "+
			"               ELSE 0 END ||'%',2) TB_ALL,                                                         "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T3.ALL_SR<>0 THEN (T.ALL_SR-T3.ALL_SR)*100/T3.ALL_SR                           "+
			"               ELSE 0 END ||'%',2) DB_ALL,                                                         "+
			"        T0.FEE ALL1_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T0.FEE<>0 THEN T.ALL_SR*100/T0.FEE                                             "+
			"               ELSE 0 END ||'%',2) ALL_CHANL_SR,                                                   "+
			"       PODS.GET_RADIX_POINT(                                                                       "+
			"          CASE WHEN T0.FEE=0 THEN 0                                                                "+
			"               WHEN T11.FEE=0 THEN 0                                                               "+
			"               WHEN T1.ALL_SR/T11.FEE=0 THEN 0                                                     "+
			"               ELSE (T.ALL_SR/T0.FEE-T1.ALL_SR/T11.FEE)*100/(T1.ALL_SR/T11.FEE)                    "+
			"               END ||'%',2) HB_ALL_CHANL                                                           "+
			"FROM (                                                                                             "+
			"     SELECT GROUP_ID_0                                                                             "+
			"           ,SUM(THIS_2G_SR)+ SUM(THIS_3G_SR)+SUM(THIS_4G_SR) THIS_YW_SR                            "+
			"           ,SUM(THIS_4G_SR) THIS_4G_SR                                                             "+
			"           ,SUM(NETW_SR) NETW_SR                                                                   "+
			"           ,SUM(THIS_GWKD_SR) THIS_GWKD_SR                                                         "+
			"           ,SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR                                                         "+
			"           ,SUM(ALL_SR) ALL_SR                                                                     "+
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR                                                                                        "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
			"      WHERE DEAL_DATE="+startDate+"                                                                 "+
			    where+
			"      GROUP BY GROUP_ID_0                                                                          "+
			"      )T                                                                                           "+
			"       LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
			"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                 "+
			"                 WHERE T.DEAL_DATE="+startDate+"                                                    "+
			"                 GROUP BY T.GROUP_ID_0                                                             "+
			"                 )T0                                                                               "+
			"      ON (T.GROUP_ID_0=T0.GROUP_ID_0)                                                              "+
			"      LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                      "+
			"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                 "+
			"                 WHERE T.DEAL_DATE="+getLastMonth(startDate)+"                                      "+
			"                 GROUP BY T.GROUP_ID_0                                                             "+
			"                 )T11                                                                              "+
			"      ON (T.GROUP_ID_0=T11.GROUP_ID_0)                                                             "+
			"      LEFT JOIN(                                                                                   "+
			"      SELECT GROUP_ID_0                                                                            "+
			"           ,SUM(THIS_2G_SR)+ SUM(THIS_3G_SR)+SUM(THIS_4G_SR) THIS_YW_SR                            "+
			"           ,SUM(THIS_4G_SR) THIS_4G_SR                                                             "+
			"           ,SUM(NETW_SR) NETW_SR                                                                   "+
			"           ,SUM(THIS_GWKD_SR) THIS_GWKD_SR                                                         "+
			"           ,SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR                                                         "+
			"           ,SUM(ALL_SR) ALL_SR                                                                     "+
			
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
			"           ,SUM(all1_sr) all1_sr                                                                   "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
			"      WHERE DEAL_DATE="+getLastMonth(startDate)+"                                                   "+
			    where+
			"      GROUP BY GROUP_ID_0                                                                          "+
			"      ) T1 ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                          "+
			"      LEFT JOIN (                                                                                  "+
			"      SELECT GROUP_ID_0                                                                            "+
			"            ,SUM(ALL_SR) ALL_SR                                                                    "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
			"      WHERE DEAL_DATE="+getLastYearSameMonth(startDate)+"                                           "+
			    where+
			"      GROUP BY GROUP_ID_0                                                                          "+
			"      )T2 ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                           "+
			"      LEFT JOIN (                                                                                  "+
			"      SELECT GROUP_ID_0                                                                            "+
			"            ,ROUND(SUM(ALL_SR)/3,3) ALL_SR                                                                    "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
			"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"               +
			    where+
			"      GROUP BY GROUP_ID_0                                                                          "+
			"      )T3                                                                                          "+
			"      ON(T.GROUP_ID_0=T3.GROUP_ID_0)                                                               ";
		}else if(levelSql==2){
			return 	"       T.THIS_YW_SR,                                                                      "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.THIS_YW_SR<>0 THEN (T.THIS_YW_SR-T1.THIS_YW_SR)*100/T1.THIS_YW_SR          "+
			"               ELSE 0 END ||'%',2) HB_YW,                                                         "+
			"       T.THIS_4G_SR,                                                                              "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.THIS_4G_SR<>0 THEN (T.THIS_4G_SR-T1.THIS_4G_SR)*100/T1.THIS_4G_SR          "+
			"               ELSE 0 END ||'%',2) HB_4G,                                                         "+
			"       T.NETW_SR,                                                                                 "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.NETW_SR<>0 THEN (T.NETW_SR-T1.NETW_SR)*100/T1.NETW_SR                      "+
			"               ELSE 0 END ||'%',2) HB_NETW,                                                       "+
			"       T.THIS_GWKD_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.THIS_GWKD_SR<>0 THEN (T.THIS_GWKD_SR-T1.THIS_GWKD_SR)*100/T1.THIS_GWKD_SR  "+
			"               ELSE 0 END ||'%',2) HB_GWKD,                                                       "+
			"       T.THIS_ZHWJ_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.THIS_ZHWJ_SR<>0 THEN (T.THIS_ZHWJ_SR-T1.THIS_ZHWJ_SR)*100/T1.THIS_ZHWJ_SR  "+
			"               ELSE 0 END ||'%',2) HB_ZHWJ,                                                       "+

			"T.THIS_2I2C_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
			"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_2I2C,                                                    "+			
			"       T.ALL_SR,                                                                                  "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T1.ALL_SR<>0 THEN (T.ALL_SR-T1.ALL_SR)*100/T1.ALL_SR                          "+
			"               ELSE 0 END ||'%',2) HB_ALL,                                                        "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T2.ALL_SR<>0 THEN (T.ALL_SR-T2.ALL_SR)*100/T2.ALL_SR                          "+
			"               ELSE 0 END ||'%',2) TB_ALL,                                                        "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T3.ALL_SR<>0 THEN (T.ALL_SR-T3.ALL_SR)*100/T3.ALL_SR                          "+
			"               ELSE 0 END ||'%',2) DB_ALL,                                                        "+
			"       T0.FEE ALL1_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T0.FEE<>0 THEN T.ALL_SR*100/T0.FEE                                            "+
			"               ELSE 0 END ||'%',2) ALL_CHANL_SR,                                                  "+
			"       PODS.GET_RADIX_POINT(                                                                      "+
			"          CASE WHEN T0.FEE=0 THEN 0                                                               "+
			"               WHEN T11.FEE=0 THEN 0                                                              "+
			"               WHEN T1.ALL_SR/T11.FEE=0 THEN 0                                                    "+
			"               ELSE (T.ALL_SR/T0.FEE-T1.ALL_SR/T11.FEE)*100/(T1.ALL_SR/T11.FEE)                   "+
			"               END ||'%',2) HB_ALL_CHANL                                                          "+      
			"FROM (                                                                                            "+
			"     SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                 "+
			"           ,SUM(THIS_2G_SR)+ SUM(THIS_3G_SR)+SUM(THIS_4G_SR) THIS_YW_SR                           "+
			"           ,SUM(THIS_4G_SR) THIS_4G_SR                                                            "+
			"           ,SUM(NETW_SR) NETW_SR                                                                  "+
			"           ,SUM(THIS_GWKD_SR) THIS_GWKD_SR                                                        "+
			"           ,SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR                                                        "+
			"           ,SUM(ALL_SR) ALL_SR                                                                    "+
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
			"      WHERE DEAL_DATE="+startDate+"                                                                "+
			    where+
			"      GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                              "+
			"      )T                                                                                          "+
			"      LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
			"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                "+
			"                 WHERE T.DEAL_DATE="+startDate+"                                                   "+
			"                 GROUP BY T.GROUP_ID_1                                                            "+
			"                 )T0                                                                              "+
			"      ON (T.GROUP_ID_1=T0.GROUP_ID_1)                                                             "+
			"      LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
			"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                "+
			"                 WHERE T.DEAL_DATE="+getLastMonth(startDate)+"                                     "+
			"                 GROUP BY T.GROUP_ID_1                                                            "+
			"                 )T11                                                                             "+
			"      ON (T.GROUP_ID_1=T11.GROUP_ID_1)                                                            "+
			"      LEFT JOIN(                                                                                  "+
			"      SELECT GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
			"           ,SUM(THIS_2G_SR)+ SUM(THIS_3G_SR)+SUM(THIS_4G_SR) THIS_YW_SR                           "+
			"           ,SUM(THIS_4G_SR) THIS_4G_SR                                                            "+
			"           ,SUM(NETW_SR) NETW_SR                                                                  "+
			"           ,SUM(THIS_GWKD_SR) THIS_GWKD_SR                                                        "+
			"           ,SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR                                                        "+
			"           ,SUM(ALL_SR) ALL_SR                                                                    "+
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
			"      WHERE DEAL_DATE="+getLastMonth(startDate)+"                                                  "+
			    where+
			"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
			"      ) T1                                                                                        "+
			"      ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                              "+
			"      LEFT JOIN (                                                                                 "+
			"      SELECT GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
			"            ,SUM(ALL_SR) ALL_SR                                                                   "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
			"      WHERE DEAL_DATE="+getLastYearSameMonth(startDate)+"                                         "+
			    where+
			"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
			"      )T2 ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                          "+
			"      LEFT JOIN (                                                                                 "+
			"      SELECT GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
			"            ,ROUND(SUM(ALL_SR)/3,3) ALL_SR                                                                    "+
			"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
			"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"              +
			    where+
			"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
			"      )T3                                                                                         "+
			"      ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                              ";
		}else{
			return "SELECT T.GROUP_ID_1_NAME,                                                           "+
			"       T.BUS_HALL_NAME ROW_NAME,T.HQ_CHAN_CODE,                                     "+
			"       T.T_TYPE,                                                                           "+
			"       T.OPERATE_TYPE,                                                                     "+
			"       T.THIS_YW_SR,                                                                       "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_YW_SR <> 0 THEN                                 "+
			"                               (T.THIS_YW_SR - T1.THIS_YW_SR) * 100 / T1.THIS_YW_SR        "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_YW,                                                      "+
			"       T.THIS_4G_SR,                                                                       "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_4G_SR <> 0 THEN                                 "+
			"                               (T.THIS_4G_SR - T1.THIS_4G_SR) * 100 / T1.THIS_4G_SR        "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_4G,                                                      "+
			"       T.NETW_SR,                                                                          "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.NETW_SR <> 0 THEN                                    "+
			"                               (T.NETW_SR - T1.NETW_SR) * 100 / T1.NETW_SR                 "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_NETW,                                                    "+
			"       T.THIS_GWKD_SR,                                                                     "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_GWKD_SR <> 0 THEN                               "+
			"                               (T.THIS_GWKD_SR - T1.THIS_GWKD_SR) * 100 / T1.THIS_GWKD_SR  "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_GWKD,                                                    "+
			"       T.THIS_ZHWJ_SR,                                                                     "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_ZHWJ_SR <> 0 THEN                               "+
			"                               (T.THIS_ZHWJ_SR - T1.THIS_ZHWJ_SR) * 100 / T1.THIS_ZHWJ_SR  "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_ZHWJ,                                                    "+
			
			"T.THIS_2I2C_SR,                                                                            "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
			"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_2I2C,                                                    "+			
			"       T.ALL_SR,                                                                           "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T1.ALL_SR <> 0 THEN                                     "+
			"                               (T.ALL_SR - T1.ALL_SR) * 100 / T1.ALL_SR                    "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) HB_ALL,                                                     "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T2.ALL_SR <> 0 THEN                                     "+
			"                               (T.ALL_SR - T2.ALL_SR) * 100 / T2.ALL_SR                    "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) TB_ALL,                                                     "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T3.ALL_SR <> 0 THEN                                     "+
			"                               (T.ALL_SR - T3.ALL_SR) * 100 / T3.ALL_SR                    "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) DB_ALL,                                                     "+
			"       T0.FEE ALL1_SR,                                                                     "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T0.FEE <> 0 THEN                                        "+
			"                               T.ALL_SR * 100 / T0.FEE                                     "+
			"                              ELSE                                                         "+
			"                               0                                                           "+
			"                            END || '%',                                                    "+
			"                            2) ALL_CHANL_SR,                                               "+
			"       PODS.GET_RADIX_POINT(CASE                                                           "+
			"                              WHEN T0.FEE = 0 THEN                                         "+
			"                               0                                                           "+
			"                              WHEN T11.FEE = 0 THEN                                        "+
			"                               0                                                           "+
			"                              WHEN T1.ALL_SR / T11.FEE = 0 THEN                            "+
			"                               0                                                           "+
			"                              ELSE                                                         "+
			"                               (T.ALL_SR / T0.FEE - T1.ALL_SR / T11.FEE) * 100 /           "+
			"                               (T1.ALL_SR / T11.FEE)                                       "+
			"                            END || '%',                                                    "+
			"                            2) HB_ALL_CHANL                                                "+
			"  FROM (SELECT GROUP_ID_0,                                                                 "+
			"               GROUP_ID_1,                                                                 "+
			"               GROUP_ID_1_NAME,                                                            "+
			"               BUS_HALL_NAME,                                                              "+
			"               HQ_CHAN_CODE,                                                               "+
			"               T_TYPE,                                                                     "+
			"               OPERATE_TYPE,                                                               "+
			"               SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,             "+
			"               SUM(THIS_4G_SR) THIS_4G_SR,                                                 "+
			"               SUM(NETW_SR) NETW_SR,                                                       "+
			"               SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                             "+
			"               SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                             "+
			"               SUM(ALL_SR) ALL_SR                                                          "+
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
			"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                             "+
			"         WHERE DEAL_DATE = "+startDate+"                                                   "+
			                where+
			"         GROUP BY GROUP_ID_0,GROUP_ID_1,                                                   "+
			"                  GROUP_ID_1_NAME,                                                         "+
			"                  BUS_HALL_NAME,                                                           "+
			"                  HQ_CHAN_CODE,                                                            "+
			"                  T_TYPE,                                                                  "+
			"                  OPERATE_TYPE) T                                                          "+
			"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                          "+
			"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                           "+
			"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                           "+
			"              WHERE T.DEAL_DATE = "+startDate+"                                            "+
			                      where1+
			"              GROUP BY T.GROUP_ID_1) T0                                                    "+
			"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                      "+
			"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                          "+
			"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                           "+
			"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                           "+
			"              WHERE T.DEAL_DATE = "+getLastMonth(startDate)+"                              "+
			                  where1+
			"              GROUP BY T.GROUP_ID_1) T11                                                   "+
			"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                     "+
			"  LEFT JOIN (SELECT GROUP_ID_1,                                                            "+
			"                    GROUP_ID_1_NAME,                                                       "+
			"                    HQ_CHAN_CODE,                                                          "+
			"                    SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,        "+
			"                    SUM(THIS_4G_SR) THIS_4G_SR,                                            "+
			"                    SUM(NETW_SR) NETW_SR,                                                  "+
			"                    SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                        "+
			"                    SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                        "+
			"                    SUM(ALL_SR) ALL_SR                                                     "+
			"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
			"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                        "+
			"              WHERE DEAL_DATE = "+getLastMonth(startDate)+"                                "+
			                        where+
			"              GROUP BY GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T1                        "+
			"    ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE)                                                  "+
			"  LEFT JOIN (SELECT GROUP_ID_1, GROUP_ID_1_NAME,                                           "+
			"                    HQ_CHAN_CODE,                                                          "+
			"                    SUM(ALL_SR) ALL_SR                                                     "+
			"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                        "+
			"              WHERE DEAL_DATE = "+getLastYearSameMonth(startDate)+"                        "+
			                 where+
			"              GROUP BY GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T2                        "+
			"    ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)                                                  "+
			"  LEFT JOIN (SELECT GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE, ROUND(SUM(ALL_SR)/3,3) ALL_SR           "+
			"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                        "+
			"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"       +
			                      where+
			"              GROUP BY GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T3                        "+
			"    ON (T.HQ_CHAN_CODE = T3.HQ_CHAN_CODE)                                                  ";
		}
}
//----------------------------------------------------------------------------------
function getDifferentDateSql(levelSql,startDate,endDate,where,where1){
	
	if(levelSql==1){
		return "T.THIS_YW_SR,"+
		"PODS.GET_RADIX_POINT(CASE                                                                                                                                       "+
		"                              WHEN T1.THIS_YW_SR <> 0 THEN                                                                                                      "+
		"                               (T.THIS_YW_SR - T1.THIS_YW_SR) * 100 / T1.THIS_YW_SR                                                                             "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_YW,                                                                                                                           "+
		"       T.THIS_4G_SR,                                                                                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T1.THIS_4G_SR <> 0 THEN                                                                                                      "+
		"                               (T.THIS_4G_SR - T1.THIS_4G_SR) * 100 / T1.THIS_4G_SR                                                                             "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_4G,                                                                                                                           "+
		"       T.NETW_SR,                                                                                                                                               "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T1.NETW_SR <> 0 THEN                                                                                                         "+
		"                               (T.NETW_SR - T1.NETW_SR) * 100 / T1.NETW_SR                                                                                      "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_NETW,                                                                                                                         "+
		"       T.THIS_GWKD_SR,                                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T1.THIS_GWKD_SR <> 0 THEN                                                                                                    "+
		"                               (T.THIS_GWKD_SR - T1.THIS_GWKD_SR) * 100 / T1.THIS_GWKD_SR                                                                       "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_GWKD,                                                                                                                         "+
		"       T.THIS_ZHWJ_SR,                                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T1.THIS_ZHWJ_SR <> 0 THEN                                                                                                    "+
		"                               (T.THIS_ZHWJ_SR - T1.THIS_ZHWJ_SR) * 100 / T1.THIS_ZHWJ_SR                                                                       "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_ZHWJ,                                                                                                                         "+
		
		"T.THIS_2I2C_SR,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                           "+
		"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
		"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
		"                              ELSE                                                         "+
		"                               0                                                           "+
		"                            END || '%',                                                    "+
		"                            2) HB_2I2C,                                                    "+			
		"       T.ALL_SR,                                                                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T1.ALL_SR <> 0 THEN                                                                                                          "+
		"                               (T.ALL_SR - T1.ALL_SR) * 100 / T1.ALL_SR                                                                                         "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_ALL,                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T2.ALL_SR <> 0 THEN                                                                                                          "+
		"                               (T.ALL_SR - T2.ALL_SR) * 100 / T2.ALL_SR                                                                                         "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) TB_ALL,                                                                                                                          "+
		"      '--' DB_ALL,                                                                                                                                              "+
		"       T0.FEE ALL1_SR,                                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T0.FEE <> 0 THEN                                                                                                             "+
		"                               T.ALL_SR * 100 / T0.FEE                                                                                                          "+
		"                              ELSE                                                                                                                              "+
		"                               0                                                                                                                                "+
		"                            END || '%',                                                                                                                         "+
		"                            2) ALL_CHANL_SR,                                                                                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                "+
		"                              WHEN T0.FEE = 0 THEN                                                                                                              "+
		"                               0                                                                                                                                "+
		"                              WHEN T11.FEE = 0 THEN                                                                                                             "+
		"                               0                                                                                                                                "+
		"                              WHEN T1.ALL_SR / T11.FEE = 0 THEN                                                                                                 "+
		"                               0                                                                                                                                "+
		"                              ELSE                                                                                                                              "+
		"                               (T.ALL_SR / T0.FEE - T1.ALL_SR / T11.FEE) * 100 /                                                                                "+
		"                               (T1.ALL_SR / T11.FEE)                                                                                                            "+
		"                            END || '%',                                                                                                                         "+
		"                            2) HB_ALL_CHANL                                                                                                                     "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                                      "+
		"               SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                                  "+
		"               SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                      "+
		"               SUM(NETW_SR) NETW_SR,                                                                                                                            "+
		"               SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                                  "+
		"               SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                                  "+
		"               SUM(ALL_SR) ALL_SR                                                                                                                               "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		
		"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                                  "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                  "+
		                   where+
		"         GROUP BY GROUP_ID_0) T                                                                                                                                 "+
		"  LEFT JOIN (SELECT T.GROUP_ID_0,                                                                                                                               "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                  "+
		                    where1+
		"              GROUP BY T.GROUP_ID_0) T0                                                                                                                         "+
		"    ON (T.GROUP_ID_0 = T0.GROUP_ID_0)                                                                                                                           "+
		"  LEFT JOIN (SELECT T.GROUP_ID_0,                                                                                                                               "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')"+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                          "+
		                where1+
		"              GROUP BY T.GROUP_ID_0) T11                                                                                                                        "+
		"    ON (T.GROUP_ID_0 = T11.GROUP_ID_0)                                                                                                                          "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                 "+
		"                    SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                             "+
		"                    SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                 "+
		"                    SUM(NETW_SR) NETW_SR,                                                                                                                       "+
		"                    SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                             "+
		"                    SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                             "+
		"                    SUM(ALL_SR) ALL_SR,                                                                                                                         "+
		"                    SUM(all1_sr) all1_sr                                                                                                                        "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                             "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')"+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                          "+
		                        where+
		"              GROUP BY GROUP_ID_0) T1                                                                                                                           "+
		"    ON (T.GROUP_ID_0 = T1.GROUP_ID_0)                                                                                                                           "+
		"  LEFT JOIN (SELECT GROUP_ID_0, SUM(ALL_SR) ALL_SR                                                                                                              "+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                             "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                 "+
		                       where+
		"              GROUP BY GROUP_ID_0) T2                                                                                                                           "+
		"    ON (T.GROUP_ID_0 = T2.GROUP_ID_0)                                                                                                                           ";
	}else if(levelSql==2){
		return "       T.THIS_YW_SR,                                                                                                                                       "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.THIS_YW_SR <> 0 THEN                                                                                                        "+
		"                               (T.THIS_YW_SR - T1.THIS_YW_SR) * 100 / T1.THIS_YW_SR                                                                               "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_YW,                                                                                                                             "+
		"       T.THIS_4G_SR,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.THIS_4G_SR <> 0 THEN                                                                                                        "+
		"                               (T.THIS_4G_SR - T1.THIS_4G_SR) * 100 / T1.THIS_4G_SR                                                                               "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_4G,                                                                                                                             "+
		"       T.NETW_SR,                                                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.NETW_SR <> 0 THEN                                                                                                           "+
		"                               (T.NETW_SR - T1.NETW_SR) * 100 / T1.NETW_SR                                                                                        "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_NETW,                                                                                                                           "+
		"       T.THIS_GWKD_SR,                                                                                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.THIS_GWKD_SR <> 0 THEN                                                                                                      "+
		"                               (T.THIS_GWKD_SR - T1.THIS_GWKD_SR) * 100 / T1.THIS_GWKD_SR                                                                         "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_GWKD,                                                                                                                           "+
		"       T.THIS_ZHWJ_SR,                                                                                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.THIS_ZHWJ_SR <> 0 THEN                                                                                                      "+
		"                               (T.THIS_ZHWJ_SR - T1.THIS_ZHWJ_SR) * 100 / T1.THIS_ZHWJ_SR                                                                         "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_ZHWJ,                                                                                                                           "+
		"T.THIS_2I2C_SR,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                           "+
		"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
		"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
		"                              ELSE                                                         "+
		"                               0                                                           "+
		"                            END || '%',                                                    "+
		"                            2) HB_2I2C,                                                    "+			
		"       T.ALL_SR,                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T1.ALL_SR <> 0 THEN                                                                                                            "+
		"                               (T.ALL_SR - T1.ALL_SR) * 100 / T1.ALL_SR                                                                                           "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_ALL,                                                                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T2.ALL_SR <> 0 THEN                                                                                                            "+
		"                               (T.ALL_SR - T2.ALL_SR) * 100 / T2.ALL_SR                                                                                           "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) TB_ALL,                                                                                                                            "+
		"      '--' DB_ALL,                                                                                                                                                "+
		"       T0.FEE ALL1_SR,                                                                                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T0.FEE <> 0 THEN                                                                                                               "+
		"                               T.ALL_SR * 100 / T0.FEE                                                                                                            "+
		"                              ELSE                                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                            END || '%',                                                                                                                           "+
		"                            2) ALL_CHANL_SR,                                                                                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                  "+
		"                              WHEN T0.FEE = 0 THEN                                                                                                                "+
		"                               0                                                                                                                                  "+
		"                              WHEN T11.FEE = 0 THEN                                                                                                               "+
		"                               0                                                                                                                                  "+
		"                              WHEN T1.ALL_SR / T11.FEE = 0 THEN                                                                                                   "+
		"                               0                                                                                                                                  "+
		"                              ELSE                                                                                                                                "+
		"                               (T.ALL_SR / T0.FEE - T1.ALL_SR / T11.FEE) * 100 /                                                                                  "+
		"                               (T1.ALL_SR / T11.FEE)                                                                                                              "+
		"                            END || '%',                                                                                                                           "+
		"                            2) HB_ALL_CHANL                                                                                                                       "+
		"  FROM (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                                                                             "+
		"               SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                                    "+
		"               SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                        "+
		"               SUM(NETW_SR) NETW_SR,                                                                                                                              "+
		"               SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                                    "+
		"               SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                                    "+
		"               SUM(ALL_SR) ALL_SR                                                                                                                                 "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                                    "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                    "+
		                  where+
		"         GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME) T                                                                                                        "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                                                                                                 "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                  "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                  "+
		"              WHERE T.DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                             "+
		                      where1+
		"              GROUP BY T.GROUP_ID_1) T0                                                                                                                           "+
		"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                                                                                             "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                                                                                                 "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                  "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                  "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')"+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                            "+
		                              where1+
		"              GROUP BY T.GROUP_ID_1) T11                                                                                                                          "+
		"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                                                                                            "+
		"  LEFT JOIN (SELECT GROUP_ID_1,                                                                                                                                   "+
		"                    SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                               "+
		"                    SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                   "+
		"                    SUM(NETW_SR) NETW_SR,                                                                                                                         "+
		"                    SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                               "+
		"                    SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                               "+
		"                    SUM(ALL_SR) ALL_SR,                                                                                                                           "+
		"                    SUM(all1_sr) all1_sr                                                                                                                          "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                               "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM') "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                            "+
		                     where+
		"              GROUP BY GROUP_ID_1) T1                                                                                                                             "+
		"    ON (T.GROUP_ID_1 = T1.GROUP_ID_1)                                                                                                                             "+
		"  LEFT JOIN (SELECT GROUP_ID_1, SUM(ALL_SR) ALL_SR                                                                                                                "+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                               "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                   "+
		                     where+
		"              GROUP BY GROUP_ID_1) T2                                                                                                                             "+
		"    ON (T.GROUP_ID_1 = T2.GROUP_ID_1)                                                                                                                             ";
	}else{
		return "SELECT T.GROUP_ID_1_NAME,T.BUS_HALL_NAME ROW_NAME, "+
		"       T.HQ_CHAN_CODE,  "+
		"       T.T_TYPE,        "+
		"       T.OPERATE_TYPE,  "+
		"       T.THIS_YW_SR,    "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_YW_SR <> 0 THEN                                                                                                          "+
		"                               (T.THIS_YW_SR - T1.THIS_YW_SR) * 100 / T1.THIS_YW_SR                                                                                 "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_YW,                                                                                                                               "+
		"       T.THIS_4G_SR,                                                                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_4G_SR <> 0 THEN                                                                                                          "+
		"                               (T.THIS_4G_SR - T1.THIS_4G_SR) * 100 / T1.THIS_4G_SR                                                                                 "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_4G,                                                                                                                               "+
		"       T.NETW_SR,                                                                                                                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.NETW_SR <> 0 THEN                                                                                                             "+
		"                               (T.NETW_SR - T1.NETW_SR) * 100 / T1.NETW_SR                                                                                          "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_NETW,                                                                                                                             "+
		"       T.THIS_GWKD_SR,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_GWKD_SR <> 0 THEN                                                                                                        "+
		"                               (T.THIS_GWKD_SR - T1.THIS_GWKD_SR) * 100 / T1.THIS_GWKD_SR                                                                           "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_GWKD,                                                                                                                             "+
		"       T.THIS_ZHWJ_SR,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_ZHWJ_SR <> 0 THEN                                                                                                        "+
		"                               (T.THIS_ZHWJ_SR - T1.THIS_ZHWJ_SR) * 100 / T1.THIS_ZHWJ_SR                                                                           "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ZHWJ,                                                                                                                             "+
		
		"T.THIS_2I2C_SR,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                           "+
		"                              WHEN T1.THIS_2I2C_SR <> 0 THEN                               "+
		"                               (T.THIS_2I2C_SR - T1.THIS_2I2C_SR) * 100 / T1.THIS_2I2C_SR  "+
		"                              ELSE                                                         "+
		"                               0                                                           "+
		"                            END || '%',                                                    "+
		"                            2) HB_2I2C,                                                    "+			
		"       T.ALL_SR,                                                                                                                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.ALL_SR <> 0 THEN                                                                                                              "+
		"                               (T.ALL_SR - T1.ALL_SR) * 100 / T1.ALL_SR                                                                                             "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ALL,                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T2.ALL_SR <> 0 THEN                                                                                                              "+
		"                               (T.ALL_SR - T2.ALL_SR) * 100 / T2.ALL_SR                                                                                             "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) TB_ALL,                                                                                                                              "+
		"      '--' DB_ALL,                                                                                                                                                  "+
		"       T0.FEE ALL1_SR,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T0.FEE <> 0 THEN                                                                                                                 "+
		"                               T.ALL_SR * 100 / T0.FEE                                                                                                              "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) ALL_CHANL_SR,                                                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T0.FEE = 0 THEN                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                              WHEN T11.FEE = 0 THEN                                                                                                                 "+
		"                               0                                                                                                                                    "+
		"                              WHEN T1.ALL_SR / T11.FEE = 0 THEN                                                                                                     "+
		"                               0                                                                                                                                    "+
		"                              ELSE                                                                                                                                  "+
		"                               (T.ALL_SR / T0.FEE - T1.ALL_SR / T11.FEE) * 100 /                                                                                    "+
		"                               (T1.ALL_SR / T11.FEE)                                                                                                                "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ALL_CHANL                                                                                                                         "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                                          "+
		"               GROUP_ID_1,GROUP_ID_1_NAME,                                                                                                                          "+
		"               BUS_HALL_NAME,                                                                                                                                       "+
		"               HQ_CHAN_CODE,                                                                                                                                        "+
		"               T_TYPE,                                                                                                                                              "+
		"               OPERATE_TYPE,                                                                                                                                        "+
		"               SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                                      "+
		"               SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                          "+
		"               SUM(NETW_SR) NETW_SR,                                                                                                                                "+
		"               SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                                      "+
		"               SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                                      "+
		"               SUM(ALL_SR) ALL_SR                                                                                                                                   "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		"          FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON T                                                                                                                    "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                      "+
		             where+
		"         GROUP BY GROUP_ID_0,                                                                                                                                       "+
		"                  GROUP_ID_1,GROUP_ID_1_NAME,                                                                                                                       "+
		"                  BUS_HALL_NAME,                                                                                                                                    "+
		"                  HQ_CHAN_CODE,                                                                                                                                     "+
		"                  T_TYPE,                                                                                                                                           "+
		"                  OPERATE_TYPE) T                                                                                                                                   "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                                                                                                   "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                    "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                    "+
		"              WHERE T.DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                               "+
		                          where1+
		"              GROUP BY T.GROUP_ID_1) T0                                                                                                                             "+
		"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                                                                                               "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1,                                                                                                                                   "+
		"                    SUM(T.SR_ALL_NUM - T.SR_ICT_NUM) / 10000 FEE                                                                                                    "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                    "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')  "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                              "+ 
		                   where1+
		"              GROUP BY T.GROUP_ID_1) T11                                                                                                                            "+
		"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                                                                                              "+
		"  LEFT JOIN (SELECT GROUP_ID_1,HQ_CHAN_CODE,                                                                                                                        "+
		"                    SUM(THIS_2G_SR) + SUM(THIS_3G_SR) + SUM(THIS_4G_SR) THIS_YW_SR,                                                                                 "+
		"                    SUM(THIS_4G_SR) THIS_4G_SR,                                                                                                                     "+
		"                    SUM(NETW_SR) NETW_SR,                                                                                                                           "+
		"                    SUM(THIS_GWKD_SR) THIS_GWKD_SR,                                                                                                                 "+
		"                    SUM(THIS_ZHWJ_SR) THIS_ZHWJ_SR,                                                                                                                 "+
		"                    SUM(ALL_SR) ALL_SR,                                                                                                                             "+
		"                    SUM(all1_sr) all1_sr                                                                                                                            "+
		"           ,SUM(THIS_2I2C_SR) THIS_2I2C_SR"+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                                 "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')   "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                              "+
		                           where+
		"              GROUP BY GROUP_ID_1,HQ_CHAN_CODE) T1                                                                                                                  "+
		"    ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE)                                                                                                                           "+
		"  LEFT JOIN (SELECT GROUP_ID_1,HQ_CHAN_CODE, SUM(ALL_SR) ALL_SR                                                                                                     "+
		"               FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                                                                                 "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                     "+
		                           where+
		"              GROUP BY GROUP_ID_1,HQ_CHAN_CODE) T2                                                                                                                  "+
		"    ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)                                                                                                                           ";
	}
}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var region =$("#region").val();
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where="";
	var where1="";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
		where1+=" AND GROUP_ID_1='"+region+"'";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND T_TYPE ='"+hallType+"' ";
	}
	var sql="";
	if(startDate==endDate){
		sql = getSumSql(3,startDate,endDate,where,where1);
	}else{
		sql = getDifferentDateSql(3,startDate,endDate,where,where1);
	}
	
	var showtext = '营业厅开账收入月报表-' + startDate;
	var title=[["营业厅开帐收入月报表","","","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","营业厅","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网收入","","其中4G收入","","固网收入","","其中宽带收 入","","其中智慧沃家收入","","其中2I2C","","合计","环比","同比","定比上季度月均","全渠道收入","占全渠道份额","份额环比"],
	           ["","","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getLastMonth(startDate){
	var year=startDate.substr(0,4);
    var month=startDate.substr(4,6);
    if(month=='01'){
    	return (year-1)+'12';
    }
   return startDate-1;
}

function getFristMonth(startDate){
	var year=startDate.substr(0,4);
	return year+'01';
}

function getLastYearSameMonth(startDate){
	var year=startDate.substr(0,4);
    var month=startDate.substr(4,6);
    return (year-1)+month;
}
