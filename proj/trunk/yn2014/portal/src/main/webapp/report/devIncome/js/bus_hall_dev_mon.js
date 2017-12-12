$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_HALL_DEV_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	var title=[["营业厅新增发展月报表","","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带发展","","其中智慧沃家发展","","其中2I2C","","合计","环比","同比","定比上季度月均","全渠道发展","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","",""]];
    
	var field=["HQ_CHAN_CODE","T_TYPE","OPERATE_TYPE","THIS_YW_NUM","HB_YW","THIS_4G_NUM","HB_4G","NETW_NUM","HB_NETW","THIS_GWKD_NUM","HB_GWKD","ZHWJ_DEV","HB_ZHWJ","THIS_2I2C_NUM","HB_2I2C","ALL_NUM","HB_ALL","TB_ALL","DB_ALL","ALL1_DEV","ALL_CHANL_NUM","HB_ALL_CHANL"];
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
			var levelSql;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
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
					where+=" AND T.GROUP_ID_0='"+code+"'";
					levelSql=1;
				}else if(orgLevel==2||orgLevel==3){//市
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
				sql=getSumSql(levelSql,startDate,endDate,where,where1);
			}else{
				sql=getDifferentDateSql(levelSql,startDate,endDate,where,where1);
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
		return "SELECT '86000' ROW_ID,                                                                         "+
		"       '全省' ROW_NAME,                                                                                "+
		"       '--' HQ_CHAN_CODE,                                                                             "+
		"       '--' T_TYPE,                                                                                   "+
		"       '--' OPERATE_TYPE,                                                                             "+
		"       T.THIS_YW_NUM,                                                                                 "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.THIS_YW_NUM<>0 THEN (T.THIS_YW_NUM-T1.THIS_YW_NUM)*100/T1.THIS_YW_NUM          "+
		"               ELSE 0 END ||'%',2) HB_YW,                                                             "+
		"        T.THIS_4G_NUM,                                                                                "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.THIS_4G_NUM<>0 THEN (T.THIS_4G_NUM-T1.THIS_4G_NUM)*100/T1.THIS_4G_NUM          "+
		"               ELSE 0 END ||'%',2) HB_4G,                                                             "+
		"        T.NETW_NUM,                                                                                   "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.NETW_NUM<>0 THEN (T.NETW_NUM-T1.NETW_NUM)*100/T1.NETW_NUM                      "+
		"               ELSE 0 END ||'%',2) HB_NETW,                                                           "+
		"        T.THIS_GWKD_NUM，                                                                             "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.THIS_GWKD_NUM<>0 THEN (T.THIS_GWKD_NUM-T1.THIS_GWKD_NUM)*100/T1.THIS_GWKD_NUM  "+
		"               ELSE 0 END ||'%',2) HB_GWKD,                                                           "+
		"        T.ZHWJ_DEV,                                                                                   "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.ZHWJ_DEV<>0 THEN (T.ZHWJ_DEV-T1.ZHWJ_DEV)*100/T1.ZHWJ_DEV                      "+
		"               ELSE 0 END ||'%',2) HB_ZHWJ,                                                           "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"        T.ALL_NUM,                                                                                    "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T1.ALL_NUM<>0 THEN (T.ALL_NUM-T1.ALL_NUM)*100/T1.ALL_NUM                          "+
		"               ELSE 0 END ||'%',2) HB_ALL,                                                            "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T2.ALL_NUM<>0 THEN (T.ALL_NUM-T2.ALL_NUM)*100/T2.ALL_NUM                          "+
		"               ELSE 0 END ||'%',2) TB_ALL,                                                            "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T3.ALL_NUM<>0 THEN (T.ALL_NUM-T3.ALL_NUM)*100/T3.ALL_NUM                          "+
		"               ELSE 0 END ||'%',2) DB_ALL,                                                            "+
		"         T0.dev_num ALL1_DEV,                                                                         "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T0.dev_num<>0 THEN T.ALL_NUM*100/T0.dev_num                                       "+
		"               ELSE 0 END ||'%',2) ALL_CHANL_NUM,                                                     "+
		"        PODS.GET_RADIX_POINT(                                                                         "+
		"          CASE WHEN T0.dev_num=0 THEN 0                                                               "+
		"               WHEN T11.DEV_NUM=0 THEN 0                                                              "+
		"               WHEN T1.ALL_NUM/T11.DEV_NUM=0 THEN 0                                                   "+
		"               ELSE (T.ALL_NUM/T0.DEV_NUM-T1.ALL_NUM/T11.DEV_NUM)*100/(T1.ALL_NUM/T11.DEV_NUM)        "+
		"               END ||'%',2) HB_ALL_CHANL                                                              "+
		"FROM (                                                                                                "+
		" SELECT  GROUP_ID_0,                                                                                  "+
		"         SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                 "+
		"         SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                              "+
		"         SUM(T.NETW_NUM) NETW_NUM,                                                                    "+
		"         SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                          "+
		"         SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                    "+
		"         SUM(t.ALL_NUM) AS ALL_NUM,                                                                   "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"         SUM(t.all1) ALL1_DEV                                                                         "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+startDate+"'                                                                     "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		")T                                                                                                    "+
		"LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                 "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                          "+
		"           WHERE T.DEAL_DATE='"+startDate+"'                                                           "+
		"           GROUP BY T.GROUP_ID_0                                                                      "+
		"           )T0                                                                                        "+
		"ON   (T.GROUP_ID_0=T0.GROUP_ID_0)                                                                     "+
		"LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                 "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                          "+
		"           WHERE T.DEAL_DATE="+getLastMonth(startDate)+"                                               "+
		"           GROUP BY T.GROUP_ID_0                                                                      "+
		"           )T11                                                                                       "+
		"ON   (T.GROUP_ID_0=T11.GROUP_ID_0)                                                                    "+
		"LEFT JOIN (                                                                                           "+
		" SELECT  GROUP_ID_0 ,                                                                                 "+
		"         SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                 "+
		"         SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                              "+
		"         SUM(T.NETW_NUM) NETW_NUM,                                                                    "+
		"         SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                          "+
		"         SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                    "+
		"         SUM(t.ALL_NUM) AS ALL_NUM,                                                                   "+
		
		" SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"         SUM(t.all1) ALL1_DEV                                                                         "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+getLastMonth(startDate)+"'                                                       "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T1 ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                                   "+
		"LEFT JOIN (                                                                                           "+
		" SELECT  GROUP_ID_0,                                                                                  "+
		"         SUM(t.ALL_NUM) AS ALL_NUM                                                                    "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+getLastYearSameMonth(startDate)+"'                                               "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T2 ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                                   "+
		"LEFT JOIN (                                                                                           "+
		" SELECT  GROUP_ID_0,                                                                                  "+
		"         ROUND(SUM(t.ALL_NUM)/3,3) AS ALL_NUM                                                                    "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"                  +
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T3 ON(T.GROUP_ID_0=T3.GROUP_ID_0)                                                                   "; 
	}else if(levelSql==2){
		return"SELECT T.GROUP_ID_1 ROW_ID,                                                                                                                                                 "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                                                  "+
		"       '--' HQ_CHAN_CODE,                                                                                           "+
		"       '--' T_TYPE,                                                                                                 "+
		"       '--' OPERATE_TYPE,                                                                                           "+
		"        T.THIS_YW_NUM,                                                                                              "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.THIS_YW_NUM<>0 THEN (T.THIS_YW_NUM-T1.THIS_YW_NUM)*100/T1.THIS_YW_NUM                        "+
		"               ELSE 0 END ||'%',2) HB_YW,                                                                           "+
		"        T.THIS_4G_NUM,                                                                                              "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.THIS_4G_NUM<>0 THEN (T.THIS_4G_NUM-T1.THIS_4G_NUM)*100/T1.THIS_4G_NUM                        "+
		"               ELSE 0 END ||'%',2) HB_4G,                                                                           "+
		"        T.NETW_NUM,                                                                                                 "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.NETW_NUM<>0 THEN (T.NETW_NUM-T1.NETW_NUM)*100/T1.NETW_NUM                                    "+
		"               ELSE 0 END ||'%',2) HB_NETW,                                                                         "+
		"        T.THIS_GWKD_NUM，                                                                                           "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.THIS_GWKD_NUM<>0 THEN (T.THIS_GWKD_NUM-T1.THIS_GWKD_NUM)*100/T1.THIS_GWKD_NUM                "+
		"               ELSE 0 END ||'%',2) HB_GWKD,                                                                         "+
		"        T.ZHWJ_DEV,                                                                                                 "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.ZHWJ_DEV<>0 THEN (T.ZHWJ_DEV-T1.ZHWJ_DEV)*100/T1.ZHWJ_DEV                                    "+
		"               ELSE 0 END ||'%',2) HB_ZHWJ,                                                                         "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"        T.ALL_NUM,                                                                                                  "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T1.ALL_NUM<>0 THEN (T.ALL_NUM-T1.ALL_NUM)*100/T1.ALL_NUM                                        "+
		"               ELSE 0 END ||'%',2) HB_ALL,                                                                          "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T2.ALL_NUM<>0 THEN (T.ALL_NUM-T2.ALL_NUM)*100/T2.ALL_NUM                                        "+
		"               ELSE 0 END ||'%',2) TB_ALL,                                                                          "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T3.ALL_NUM<>0 THEN (T.ALL_NUM-T3.ALL_NUM)*100/T3.ALL_NUM                                        "+
		"               ELSE 0 END ||'%',2) DB_ALL,                                                                          "+
		"        T0.dev_num ALL1_DEV,                                                                                        "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T0.dev_num<>0 THEN T.ALL_NUM*100/T0.dev_num                                                     "+
		"               ELSE 0 END ||'%',2) ALL_CHANL_NUM,                                                                   "+
		"        PODS.GET_RADIX_POINT(                                                                                       "+
		"          CASE WHEN T0.dev_num=0 THEN 0                                                                             "+
		"               WHEN T11.DEV_NUM=0 THEN 0                                                                            "+
		"               WHEN T1.ALL_NUM/T11.DEV_NUM=0 THEN 0                                                                 "+
		"               ELSE (T.ALL_NUM/T0.DEV_NUM-T1.ALL_NUM/T11.DEV_NUM)*100/(T1.ALL_NUM/T11.DEV_NUM)                      "+
		"               END ||'%',2) HB_ALL_CHANL                                                                            "+
		"FROM (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                                "+
		"         SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                               "+
		"         SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                            "+
		"         SUM(T.NETW_NUM) NETW_NUM,                                                                                  "+
		"         SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                        "+
		"         SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                  "+
		"         SUM(t.ALL_NUM) AS ALL_NUM,                                                                                 "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"         SUM(t.all1) ALL1_DEV                                                                                       "+
		"     FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                            "+
		"     WHERE DEAL_DATE = '"+startDate+"'                                                                               "+
		    where+
		"     GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                 "+
		"     )T                                                                                                             "+
		"LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                               "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                        "+
		"           WHERE T.DEAL_DATE='"+startDate+"'                                                                         "+
		"           GROUP BY T.GROUP_ID_1                                                                                    "+
		"           )T0                                                                                                      "+
		"ON   (T.GROUP_ID_1=T0.GROUP_ID_1)                                                                                   "+
		"LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                               "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                        "+
		"           WHERE T.DEAL_DATE="+getLastMonth(startDate)+"                                                             "+
		"           GROUP BY T.GROUP_ID_1                                                                                    "+
		"           )T11                                                                                                     "+
		"ON   (T.GROUP_ID_1=T11.GROUP_ID_1)                                                                                  "+
		"LEFT JOIN (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                           "+
		"                   SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                     "+
		"                   SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                  "+
		"                   SUM(T.NETW_NUM) NETW_NUM,                                                                        "+
		"                   SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                              "+
		"                   SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                        "+
		"                   SUM(t.ALL_NUM) AS ALL_NUM,                                                                       "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"                   SUM(t.all1) ALL1_DEV                                                                             "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                       "+
		"          WHERE DEAL_DATE = "+getLastMonth(startDate)+"                                                              "+
		    where+
		"          GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                            "+
		"       ) T1                                                                                                         "+
		"ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                                      "+
		"LEFT JOIN (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                           "+
		"                   SUM(t.ALL_NUM) AS ALL_NUM                                                                        "+
		"           FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                      "+
		"           WHERE DEAL_DATE = "+getLastYearSameMonth(startDate)+"                                                     "+
		    where+
		"           GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
		"           ) T2                                                                                                     "+
		"ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                                                      "+
		"LEFT JOIN (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                           "+
		"                   ROUND(SUM(t.ALL_NUM)/3,2) AS ALL_NUM                                                                        "+
		"         FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                        "+
		"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"               +
		    where+
		"         GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                             "+
		"         ) T3                                                                                                       "+
		"ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                                                      ";
	}else{
		return "SELECT T.GROUP_ID_1_NAME,                                                               "+
		"       T.BUS_HALL_NAME ROW_NAME,                                                               "+
		"       T.HQ_CHAN_CODE,                                                                  "+
		"       T.T_TYPE,                                                                               "+
		"       T.OPERATE_TYPE,                                                                         "+
		"       T.THIS_YW_NUM,                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T1.THIS_YW_NUM <> 0 THEN                                    "+
		"                               (T.THIS_YW_NUM - T1.THIS_YW_NUM) * 100 / T1.THIS_YW_NUM         "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) HB_YW,                                                          "+
		"       T.THIS_4G_NUM,                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T1.THIS_4G_NUM <> 0 THEN                                    "+
		"                               (T.THIS_4G_NUM - T1.THIS_4G_NUM) * 100 / T1.THIS_4G_NUM         "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) HB_4G,                                                          "+
		"       T.NETW_NUM,                                                                             "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T1.NETW_NUM <> 0 THEN                                       "+
		"                               (T.NETW_NUM - T1.NETW_NUM) * 100 / T1.NETW_NUM                  "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) HB_NETW,                                                        "+
		"       T.THIS_GWKD_NUM， PODS.GET_RADIX_POINT(CASE                                             "+
		"         WHEN T1.THIS_GWKD_NUM <> 0 THEN                                                       "+
		"          (T.THIS_GWKD_NUM -                                                                   "+
		"          T1.THIS_GWKD_NUM) * 100 /                                                            "+
		"          T1.THIS_GWKD_NUM                                                                     "+
		"         ELSE                                                                                  "+
		"          0                                                                                    "+
		"       END || '%', 2) HB_GWKD,                                                                 "+
		"       T.ZHWJ_DEV,                                                                             "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T1.ZHWJ_DEV <> 0 THEN                                       "+
		"                               (T.ZHWJ_DEV - T1.ZHWJ_DEV) * 100 / T1.ZHWJ_DEV                  "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) HB_ZHWJ,                                                        "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"       T.ALL_NUM,                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T1.ALL_NUM <> 0 THEN                                        "+
		"                               (T.ALL_NUM - T1.ALL_NUM) * 100 / T1.ALL_NUM                     "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) HB_ALL,                                                         "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T2.ALL_NUM <> 0 THEN                                        "+
		"                               (T.ALL_NUM - T2.ALL_NUM) * 100 / T2.ALL_NUM                     "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) TB_ALL,                                                         "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T3.ALL_NUM <> 0 THEN                                        "+
		"                               (T.ALL_NUM - T3.ALL_NUM) * 100 / T3.ALL_NUM                     "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) DB_ALL,                                                         "+
		"       T0.dev_num ALL1_DEV,                                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T0.dev_num <> 0 THEN                                        "+
		"                               T.ALL_NUM * 100 / T0.dev_num                                    "+
		"                              ELSE                                                             "+
		"                               0                                                               "+
		"                            END || '%',                                                        "+
		"                            2) ALL_CHANL_NUM,                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                               "+
		"                              WHEN T0.dev_num = 0 THEN                                         "+
		"                               0                                                               "+
		"                              WHEN T11.DEV_NUM = 0 THEN                                        "+
		"                               0                                                               "+
		"                              WHEN T1.ALL_NUM / T11.DEV_NUM = 0 THEN                           "+
		"                               0                                                               "+
		"                              ELSE                                                             "+
		"                               (T.ALL_NUM / T0.DEV_NUM - T1.ALL_NUM / T11.DEV_NUM) * 100 /     "+
		"                               (T1.ALL_NUM / T11.DEV_NUM)                                      "+
		"                            END || '%',                                                        "+
		"                            2) HB_ALL_CHANL                                                    "+
		"  FROM (SELECT GROUP_ID_0,                                                                     "+
		"               GROUP_ID_1,                                                                     "+
		"               GROUP_ID_1_NAME,                                                                "+
		"               BUS_HALL_NAME,                                                                  "+
		"               HQ_CHAN_CODE,                                                                   "+
		"               T_TYPE,                                                                         "+
		"               OPERATE_TYPE,                                                                   "+
		"               SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,    "+
		"               SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                 "+
		"               SUM(T.NETW_NUM) NETW_NUM,                                                       "+
		"               SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                             "+
		"               SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                       "+
		"               SUM(t.ALL_NUM) AS ALL_NUM,                                                      "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"               SUM(t.all1) ALL1_DEV                                                            "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                  "+
		"         WHERE DEAL_DATE = '"+startDate+"'                                                     "+
		              where+
		"         GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,                                     "+
		"                  BUS_HALL_NAME,                                                               "+
		"                  HQ_CHAN_CODE,                                                                "+
		"                  T_TYPE,                                                                      "+
		"                  OPERATE_TYPE                                                                 "+
		"                  ) T                                                                          "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                     "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                               "+
		"              WHERE T.DEAL_DATE = '"+startDate+"'                                              "+
		               where1+
		"              GROUP BY T.GROUP_ID_1) T0                                                        "+
		"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                          "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                     "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                               "+
		"              WHERE T.DEAL_DATE = "+getLastMonth(startDate)+"                                  "+
		              where1+
		"              GROUP BY T.GROUP_ID_1) T11                                                       "+
		"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                         "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                "+
		"                    GROUP_ID_1,                                                                "+
		"                    GROUP_ID_1_NAME,                                                           "+
		"                    HQ_CHAN_CODE,                                                              "+
		"                    SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) +                                  "+
		"                    SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                         "+
		"                    SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                            "+
		"                    SUM(T.NETW_NUM) NETW_NUM,                                                  "+
		"                    SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                        "+
		"                    SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                  "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM,                                                 "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"                    SUM(t.all1) ALL1_DEV                                                       "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                             "+
		"              WHERE DEAL_DATE = "+getLastMonth(startDate)+"                                    "+
		              where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T1                "+
		"    ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE)                                                      "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                "+
		"                    GROUP_ID_1,                                                                "+
		"                    GROUP_ID_1_NAME,                                                           "+
		"                    HQ_CHAN_CODE,                                                              "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM                                                  "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                             "+
		"              WHERE DEAL_DATE = "+getLastYearSameMonth(startDate)+"                            "+
		              where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T2                "+
		"    ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)                                                      "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                "+
		"                    GROUP_ID_1,                                                                "+
		"                    GROUP_ID_1_NAME,                                                           "+
		"                    HQ_CHAN_CODE,                                                              "+
		"                    ROUND(SUM(t.ALL_NUM)/3,3) AS ALL_NUM                                                  "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                             "+
		"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+startDate+")))"           +
		             where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T3                "+
		"    ON (T.HQ_CHAN_CODE = T3.HQ_CHAN_CODE)                                                      ";
	}
  }
//---------------------------------------------------------------------------------------------------------
function getDifferentDateSql(levelSql,startDate,endDate,where,where1){
	if(levelSql==1){
		return "SELECT '86000' ROW_ID,                                                                                                                                        "+
		"       '全省' ROW_NAME,                                                                                                                                               "+
		"       '--' HQ_CHAN_CODE,                                                                                                                                            "+
		"       '--' T_TYPE,                                                                                                                                                  "+
		"       '--' OPERATE_TYPE,                                                                                                                                            "+
		"       T.THIS_YW_NUM,                                                                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T1.THIS_YW_NUM <> 0 THEN                                                                                                          "+
		"                               (T.THIS_YW_NUM - T1.THIS_YW_NUM) * 100 / T1.THIS_YW_NUM                                                                               "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_YW,                                                                                                                                "+
		"       T.THIS_4G_NUM,                                                                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T1.THIS_4G_NUM <> 0 THEN                                                                                                          "+
		"                               (T.THIS_4G_NUM - T1.THIS_4G_NUM) * 100 / T1.THIS_4G_NUM                                                                               "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_4G,                                                                                                                                "+
		"       T.NETW_NUM,                                                                                                                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T1.NETW_NUM <> 0 THEN                                                                                                             "+
		"                               (T.NETW_NUM - T1.NETW_NUM) * 100 / T1.NETW_NUM                                                                                        "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_NETW,                                                                                                                              "+
		"       T.THIS_GWKD_NUM， PODS.GET_RADIX_POINT(CASE                                                                                                                   "+
		"         WHEN T1.THIS_GWKD_NUM <> 0 THEN                                                                                                                             "+
		"          (T.THIS_GWKD_NUM -                                                                                                                                         "+
		"          T1.THIS_GWKD_NUM) * 100 /                                                                                                                                  "+
		"          T1.THIS_GWKD_NUM                                                                                                                                           "+
		"         ELSE                                                                                                                                                        "+
		"          0                                                                                                                                                          "+
		"       END || '%', 2) HB_GWKD,                                                                                                                                       "+
		"       T.ZHWJ_DEV,                                                                                                                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T1.ZHWJ_DEV <> 0 THEN                                                                                                             "+
		"                               (T.ZHWJ_DEV - T1.ZHWJ_DEV) * 100 / T1.ZHWJ_DEV                                                                                        "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_ZHWJ,                                                                                                                              "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"       T.ALL_NUM,                                                                                                                                                    "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T1.ALL_NUM <> 0 THEN                                                                                                              "+
		"                               (T.ALL_NUM - T1.ALL_NUM) * 100 / T1.ALL_NUM                                                                                           "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_ALL,                                                                                                                               "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T2.ALL_NUM <> 0 THEN                                                                                                              "+
		"                               (T.ALL_NUM - T2.ALL_NUM) * 100 / T2.ALL_NUM                                                                                           "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) TB_ALL,                                                                                                                               "+
		"      '--' DB_ALL,                                                                                                                                                   "+
		"       T0.dev_num ALL1_DEV,                                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T0.dev_num <> 0 THEN                                                                                                              "+
		"                               T.ALL_NUM * 100 / T0.dev_num                                                                                                          "+
		"                              ELSE                                                                                                                                   "+
		"                               0                                                                                                                                     "+
		"                            END || '%',                                                                                                                              "+
		"                            2) ALL_CHANL_NUM,                                                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                     "+
		"                              WHEN T0.dev_num = 0 THEN                                                                                                               "+
		"                               0                                                                                                                                     "+
		"                              WHEN T11.DEV_NUM = 0 THEN                                                                                                              "+
		"                               0                                                                                                                                     "+
		"                              WHEN T1.ALL_NUM / T11.DEV_NUM = 0 THEN                                                                                                 "+
		"                               0                                                                                                                                     "+
		"                              ELSE                                                                                                                                   "+
		"                               (T.ALL_NUM / T0.DEV_NUM - T1.ALL_NUM / T11.DEV_NUM) * 100 /                                                                           "+
		"                               (T1.ALL_NUM / T11.DEV_NUM)                                                                                                            "+
		"                            END || '%',                                                                                                                              "+
		"                            2) HB_ALL_CHANL                                                                                                                          "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                                           "+
		"               SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                          "+
		"               SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                       "+
		"               SUM(T.NETW_NUM) NETW_NUM,                                                                                                                             "+
		"               SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                                   "+
		"               SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                             "+
		"               SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                            "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"               SUM(t.all1) ALL1_DEV                                                                                                                                  "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                        "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                       "+
		           where+
		"         GROUP BY GROUP_ID_0) T                                                                                                                                      "+
		"  LEFT JOIN (SELECT T.GROUP_ID_0, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                           "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                     "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                       "+
		            where1+
		"              GROUP BY T.GROUP_ID_0) T0                                                                                                                              "+
		"    ON (T.GROUP_ID_0 = T0.GROUP_ID_0)                                                                                                                                "+
		"  LEFT JOIN (SELECT T.GROUP_ID_0, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                           "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                     "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE(201701,'YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')   "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                               "+
		            where1+
		"              GROUP BY T.GROUP_ID_0) T11                                                                                                                             "+
		"    ON (T.GROUP_ID_0 = T11.GROUP_ID_0)                                                                                                                               "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                      "+
		"                    SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) +                                                                                                        "+
		"                    SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                                                               "+
		"                    SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                  "+
		"                    SUM(T.NETW_NUM) NETW_NUM,                                                                                                                        "+
		"                    SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                              "+
		"                    SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                        "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                       "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"                    SUM(t.all1) ALL1_DEV                                                                                                                             "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                   "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')    "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                               "+
		            where+
		"              GROUP BY GROUP_ID_0 ) T1                                                                                                                               "+
		"    ON (T.GROUP_ID_0 = T1.GROUP_ID_0)                                                                                                                                "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                      "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM                                                                                                                        "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                   "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                      "+
		               where+
		"              GROUP BY GROUP_ID_0) T2                                                                                                                                "+
		"    ON (T.GROUP_ID_0 = T2.GROUP_ID_0)                                                                                                                                ";
		    
	}else if(levelSql==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                                                                                                  "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                                                                                                  "+
		"       '--' HQ_CHAN_CODE,                                                                                                                                           "+
		"       '--' T_TYPE,                                                                                                                                                 "+
		"       '--' OPERATE_TYPE,                                                                                                                                           "+
		"       T.THIS_YW_NUM,                                                                                                                                               "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_YW_NUM <> 0 THEN                                                                                                         "+
		"                               (T.THIS_YW_NUM - T1.THIS_YW_NUM) * 100 / T1.THIS_YW_NUM                                                                              "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_YW,                                                                                                                               "+
		"       T.THIS_4G_NUM,                                                                                                                                               "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.THIS_4G_NUM <> 0 THEN                                                                                                         "+
		"                               (T.THIS_4G_NUM - T1.THIS_4G_NUM) * 100 / T1.THIS_4G_NUM                                                                              "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_4G,                                                                                                                               "+
		"       T.NETW_NUM,                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.NETW_NUM <> 0 THEN                                                                                                            "+
		"                               (T.NETW_NUM - T1.NETW_NUM) * 100 / T1.NETW_NUM                                                                                       "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_NETW,                                                                                                                             "+
		"       T.THIS_GWKD_NUM， PODS.GET_RADIX_POINT(CASE                                                                                                                  "+
		"         WHEN T1.THIS_GWKD_NUM <> 0 THEN                                                                                                                            "+
		"          (T.THIS_GWKD_NUM -                                                                                                                                        "+
		"          T1.THIS_GWKD_NUM) * 100 /                                                                                                                                 "+
		"          T1.THIS_GWKD_NUM                                                                                                                                          "+
		"         ELSE                                                                                                                                                       "+
		"          0                                                                                                                                                         "+
		"       END || '%', 2) HB_GWKD,                                                                                                                                      "+
		"       T.ZHWJ_DEV,                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.ZHWJ_DEV <> 0 THEN                                                                                                            "+
		"                               (T.ZHWJ_DEV - T1.ZHWJ_DEV) * 100 / T1.ZHWJ_DEV                                                                                       "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ZHWJ,                                                                                                                             "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"       T.ALL_NUM,                                                                                                                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T1.ALL_NUM <> 0 THEN                                                                                                             "+
		"                               (T.ALL_NUM - T1.ALL_NUM) * 100 / T1.ALL_NUM                                                                                          "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ALL,                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T2.ALL_NUM <> 0 THEN                                                                                                             "+
		"                               (T.ALL_NUM - T2.ALL_NUM) * 100 / T2.ALL_NUM                                                                                          "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) TB_ALL,                                                                                                                              "+
		"      '--' DB_ALL,                                                                                                                                                  "+
		"       T0.dev_num ALL1_DEV,                                                                                                                                         "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T0.dev_num <> 0 THEN                                                                                                             "+
		"                               T.ALL_NUM * 100 / T0.dev_num                                                                                                         "+
		"                              ELSE                                                                                                                                  "+
		"                               0                                                                                                                                    "+
		"                            END || '%',                                                                                                                             "+
		"                            2) ALL_CHANL_NUM,                                                                                                                       "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                    "+
		"                              WHEN T0.dev_num = 0 THEN                                                                                                              "+
		"                               0                                                                                                                                    "+
		"                              WHEN T11.DEV_NUM = 0 THEN                                                                                                             "+
		"                               0                                                                                                                                    "+
		"                              WHEN T1.ALL_NUM / T11.DEV_NUM = 0 THEN                                                                                                "+
		"                               0                                                                                                                                    "+
		"                              ELSE                                                                                                                                  "+
		"                               (T.ALL_NUM / T0.DEV_NUM - T1.ALL_NUM / T11.DEV_NUM) * 100 /                                                                          "+
		"                               (T1.ALL_NUM / T11.DEV_NUM)                                                                                                           "+
		"                            END || '%',                                                                                                                             "+
		"                            2) HB_ALL_CHANL                                                                                                                         "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                                          "+
		"               GROUP_ID_1,                                                                                                                                          "+
		"               GROUP_ID_1_NAME,                                                                                                                                     "+
		"               SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                         "+
		"               SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                      "+
		"               SUM(T.NETW_NUM) NETW_NUM,                                                                                                                            "+
		"               SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                                  "+
		"               SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                            "+
		"               SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                           "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"               SUM(t.all1) ALL1_DEV                                                                                                                                 "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                       "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                      "+
		                 where+
		"         GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME) T                                                                                                        "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                          "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                    "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                      "+
		                 where1+
		"              GROUP BY T.GROUP_ID_1) T0                                                                                                                             "+
		"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                                                                                               "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                          "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                    "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')  "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                              "+
		                 where1+
		"              GROUP BY T.GROUP_ID_1) T11                                                                                                                            "+
		"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                                                                                              "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                     "+
		"                    GROUP_ID_1,                                                                                                                                     "+
		"                    GROUP_ID_1_NAME,                                                                                                                                "+
		"                    SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) +                                                                                                       "+
		"                    SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                                                              "+
		"                    SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                 "+
		"                    SUM(T.NETW_NUM) NETW_NUM,                                                                                                                       "+
		"                    SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                             "+
		"                    SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                       "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                      "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"                    SUM(t.all1) ALL1_DEV                                                                                                                            "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                  "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')   "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                              "+
		               where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME) T1                                                                                                  "+
		"    ON (T.GROUP_ID_1 = T1.GROUP_ID_1)                                                                                                                               "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                     "+
		"                    GROUP_ID_1,                                                                                                                                     "+
		"                    GROUP_ID_1_NAME,                                                                                                                                "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM                                                                                                                       "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                  "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                     "+
		              where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME) T2                                                                                                  "+
		"    ON (T.GROUP_ID_1 = T2.GROUP_ID_1)                                                                                                                               ";
	}else{
		return "SELECT T.GROUP_ID_1_NAME,T.BUS_HALL_NAME ROW_NAME,                                                                                                          "+
		"       T.HQ_CHAN_CODE,                                                                                                                                      "+
		"       T.T_TYPE,                                                                                                                                                   "+
		"       T.OPERATE_TYPE,                                                                                                                                             "+
		"       T.THIS_YW_NUM,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T1.THIS_YW_NUM <> 0 THEN                                                                                                        "+
		"                               (T.THIS_YW_NUM - T1.THIS_YW_NUM) * 100 / T1.THIS_YW_NUM                                                                             "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_YW,                                                                                                                              "+
		"       T.THIS_4G_NUM,                                                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T1.THIS_4G_NUM <> 0 THEN                                                                                                        "+
		"                               (T.THIS_4G_NUM - T1.THIS_4G_NUM) * 100 / T1.THIS_4G_NUM                                                                             "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_4G,                                                                                                                              "+
		"       T.NETW_NUM,                                                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T1.NETW_NUM <> 0 THEN                                                                                                           "+
		"                               (T.NETW_NUM - T1.NETW_NUM) * 100 / T1.NETW_NUM                                                                                      "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_NETW,                                                                                                                            "+
		"       T.THIS_GWKD_NUM， PODS.GET_RADIX_POINT(CASE                                                                                                                 "+
		"         WHEN T1.THIS_GWKD_NUM <> 0 THEN                                                                                                                           "+
		"          (T.THIS_GWKD_NUM -                                                                                                                                       "+
		"          T1.THIS_GWKD_NUM) * 100 /                                                                                                                                "+
		"          T1.THIS_GWKD_NUM                                                                                                                                         "+
		"         ELSE                                                                                                                                                      "+
		"          0                                                                                                                                                        "+
		"       END || '%', 2) HB_GWKD,                                                                                                                                     "+
		"       T.ZHWJ_DEV,                                                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T1.ZHWJ_DEV <> 0 THEN                                                                                                           "+
		"                               (T.ZHWJ_DEV - T1.ZHWJ_DEV) * 100 / T1.ZHWJ_DEV                                                                                      "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_ZHWJ,                                                                                                                            "+
		
		"T.THIS_2I2C_NUM,                         "+
		"       PODS.GET_RADIX_POINT(CASE          "+
		"         WHEN T1.THIS_2I2C_NUM <> 0 THEN  "+
		"          (T.THIS_2I2C_NUM -              "+
		"          T1.THIS_2I2C_NUM) * 100 /       "+
		"          T1.THIS_2I2C_NUM                "+
		"         ELSE                             "+
		"          0                               "+
		"       END || '%', 2) HB_2I2C,            "+
		"       T.ALL_NUM,                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T1.ALL_NUM <> 0 THEN                                                                                                            "+
		"                               (T.ALL_NUM - T1.ALL_NUM) * 100 / T1.ALL_NUM                                                                                         "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_ALL,                                                                                                                             "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T2.ALL_NUM <> 0 THEN                                                                                                            "+
		"                               (T.ALL_NUM - T2.ALL_NUM) * 100 / T2.ALL_NUM                                                                                         "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) TB_ALL,                                                                                                                             "+
		"      '--' DB_ALL,                                                                                                                                                 "+
		"       T0.dev_num ALL1_DEV,                                                                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T0.dev_num <> 0 THEN                                                                                                            "+
		"                               T.ALL_NUM * 100 / T0.dev_num                                                                                                        "+
		"                              ELSE                                                                                                                                 "+
		"                               0                                                                                                                                   "+
		"                            END || '%',                                                                                                                            "+
		"                            2) ALL_CHANL_NUM,                                                                                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                   "+
		"                              WHEN T0.dev_num = 0 THEN                                                                                                             "+
		"                               0                                                                                                                                   "+
		"                              WHEN T11.DEV_NUM = 0 THEN                                                                                                            "+
		"                               0                                                                                                                                   "+
		"                              WHEN T1.ALL_NUM / T11.DEV_NUM = 0 THEN                                                                                               "+
		"                               0                                                                                                                                   "+
		"                              ELSE                                                                                                                                 "+
		"                               (T.ALL_NUM / T0.DEV_NUM - T1.ALL_NUM / T11.DEV_NUM) * 100 /                                                                         "+
		"                               (T1.ALL_NUM / T11.DEV_NUM)                                                                                                          "+
		"                            END || '%',                                                                                                                            "+
		"                            2) HB_ALL_CHANL                                                                                                                        "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                                         "+
		"               GROUP_ID_1,                                                                                                                                         "+
		"               GROUP_ID_1_NAME,                                                                                                                                    "+
		"               T.BUS_HALL_NAME,                                                                                                                                    "+
		"               T.HQ_CHAN_CODE,                                                                                                                                     "+
		"               T.T_TYPE,                                                                                                                                           "+
		"               T.OPERATE_TYPE,                                                                                                                                     "+
		"               SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                        "+
		"               SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                     "+
		"               SUM(T.NETW_NUM) NETW_NUM,                                                                                                                           "+
		"               SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                                 "+
		"               SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                           "+
		"               SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                          "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"               SUM(t.all1) ALL1_DEV                                                                                                                                "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                      "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                     "+
		               where+
		"         GROUP BY GROUP_ID_0,                                                                                                                                      "+
		"                  GROUP_ID_1,                                                                                                                                      "+
		"                  GROUP_ID_1_NAME,                                                                                                                                 "+
		"                  T.BUS_HALL_NAME,                                                                                                                                 "+
		"                  T.HQ_CHAN_CODE,                                                                                                                                  "+
		"                  T.T_TYPE,                                                                                                                                        "+
		"                  T.OPERATE_TYPE )T                                                                                                                                "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                         "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                   "+
		"         WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"                                                                                                     "+
		              where1+
		"              GROUP BY T.GROUP_ID_1) T0                                                                                                                            "+
		"    ON (T.GROUP_ID_1 = T0.GROUP_ID_1)                                                                                                                              "+
		"  LEFT JOIN (SELECT T.GROUP_ID_1, SUM(T.DEV_ALL_NUM - DEV_ICT_NUM) DEV_NUM                                                                                         "+
		"               FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                                                                   "+
		"              WHERE T.DEAL_DATE BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM') "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                             "+
		              where1+      
		"              GROUP BY T.GROUP_ID_1) T11                                                                                                                           "+
		"    ON (T.GROUP_ID_1 = T11.GROUP_ID_1)                                                                                                                             "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                    "+
		"                    GROUP_ID_1,                                                                                                                                    "+
		"                    GROUP_ID_1_NAME,                                                                                                                               "+
		"                    HQ_CHAN_CODE,                                                                                                                                  "+
		"                    SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) +                                                                                                      "+
		"                    SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,                                                                                                             "+
		"                    SUM(t.THIS_4G_NUM) THIS_4G_NUM,                                                                                                                "+
		"                    SUM(T.NETW_NUM) NETW_NUM,                                                                                                                      "+
		"                    SUM(T.THIS_GWKD_NUM) THIS_GWKD_NUM,                                                                                                            "+
		"                    SUM(t.ZHWJ_DEV) ZHWJ_DEV,                                                                                                                      "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM,                                                                                                                     "+
		
		"SUM(t.THIS_2I2C_NUM)  THIS_2I2C_NUM,"+
		"                    SUM(t.all1) ALL1_DEV                                                                                                                           "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                 "+
		"              WHERE DEAL_DATE  BETWEEN TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),MONTHS_BETWEEN(TO_DATE('"+startDate+"','YYYYMM'),TO_DATE('"+endDate+"','YYYYMM'))-1),'YYYYMM')  "+
		"                                AND TO_CHAR(ADD_MONTHS(TO_DATE('"+startDate+"','YYYYMM'),-1),'YYYYMM')                                                             "+
		              where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T1                                                                                    "+
		"    ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE)                                                                                                                          "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                                                                                    "+
		"                    GROUP_ID_1,                                                                                                                                    "+
		"                    GROUP_ID_1_NAME,                                                                                                                               "+
		"                    HQ_CHAN_CODE,                                                                                                                                  "+
		"                    SUM(t.ALL_NUM) AS ALL_NUM                                                                                                                      "+
		"               FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                                                                 "+
		"              WHERE DEAL_DATE BETWEEN "+getLastYearSameMonth(startDate)+" AND "+getLastYearSameMonth(endDate)+"                                                    "+
		             where+
		"              GROUP BY GROUP_ID_0, GROUP_ID_1, GROUP_ID_1_NAME,HQ_CHAN_CODE) T2                                                                                    "+
		"    ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)                                                                                                                          ";
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
		where1 += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1 += " AND GROUP_ID_1='"+regionCode+"' ";
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
	var showtext = '营业厅新增发展月报表-' + startDate; 
	var title=[["营业厅开帐发展月报表","","","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","营业厅","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带发展","","其中智慧沃家发展","","其中2I2C","","合计","环比","同比","定比上季度月均","全渠道发展","占全渠道份额","份额环比"],
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
