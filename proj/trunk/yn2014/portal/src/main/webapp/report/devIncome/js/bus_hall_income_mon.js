$(function(){
	var title=[["营业厅开帐收入月报表","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网收入","","其中4G收入","","固网收入","","其中宽带收 入","","其中智慧沃家收入","","合计","环比","同比","定比1月","全渠道收入","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","",""]];
    
	var field=["HQ_CHAN_CODE","T_TYPE","OPERATE_TYPE","THIS_YW_SR","HB_YW","THIS_4G_SR","HB_4G","NETW_SR","HB_NETW","THIS_GWKD_SR","HB_GWKD","THIS_ZHWJ_SR","HB_ZHWJ","ALL_SR","HB_ALL","TB_ALL","DB_ALL","ALL1_SR","ALL_CHANL_SR","HB_ALL_CHANL"];
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
			var dealDate=$("#dealDate").val();
			var where="";
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
					preField=" SELECT HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE,";
					where+=" WHERE DEAL_DATE="+dealDate+" AND GROUP_ID_1='"+code+"'";
					groupBy = " GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE";
					levelSql=3;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT '86000' ROW_ID,'云南省' ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND GROUP_ID_0='"+code+"'";
					levelSql=1;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
					levelSql=2;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(hallType!=""){
				where += " AND T_TYPE ='"+hallType+"' ";
			}
			
			var sql="";
			if(levelSql==3){
				sql=preField+getSumSql(levelSql,'','')+where+groupBy;
			}else{
				sql=preField+getSumSql(levelSql,dealDate,where);
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
function getSumSql(levelSql,dealDate,where) {
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
		"                                                                                                   "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                 "+
		    where+
		"      GROUP BY GROUP_ID_0                                                                          "+
		"      )T                                                                                           "+
		"       LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
		"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                 "+
		"                 WHERE T.DEAL_DATE=201702                                                          "+
		"                 GROUP BY T.GROUP_ID_0                                                             "+
		"                 )T0                                                                               "+
		"      ON (T.GROUP_ID_0=T0.GROUP_ID_0)                                                              "+
		"      LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                      "+
		"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                 "+
		"                 WHERE T.DEAL_DATE="+getLastMonth(dealDate)+"                                      "+
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
		"           ,SUM(all1_sr) all1_sr                                                                   "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
		"      WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                   "+
		    where+
		"      GROUP BY GROUP_ID_0                                                                          "+
		"      ) T1 ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                          "+
		"      LEFT JOIN (                                                                                  "+
		"      SELECT GROUP_ID_0                                                                            "+
		"            ,SUM(ALL_SR) ALL_SR                                                                    "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
		"      WHERE DEAL_DATE="+getLastYearSameMonth(dealDate)+"                                           "+
		    where+
		"      GROUP BY GROUP_ID_0                                                                          "+
		"      )T2 ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                           "+
		"      LEFT JOIN (                                                                                  "+
		"      SELECT GROUP_ID_0                                                                            "+
		"            ,SUM(ALL_SR) ALL_SR                                                                    "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                         "+
		"      WHERE DEAL_DATE="+getFristMonth(dealDate)+"                                                  "+
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
		"                                                                                                  "+
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
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                "+
		    where+
		"      GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                              "+
		"      )T                                                                                          "+
		"      LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
		"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                "+
		"                 WHERE T.DEAL_dATE=201702                                                         "+
		"                 GROUP BY T.GROUP_ID_1                                                            "+
		"                 )T0                                                                              "+
		"      ON (T.GROUP_ID_1=T0.GROUP_ID_1)                                                             "+
		"      LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.SR_ALL_NUM-T.SR_ICT_NUM)/10000 FEE                     "+
		"                 FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                "+
		"                 WHERE T.DEAL_DATE="+getLastMonth(dealDate)+"                                     "+
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
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
		"      WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                  "+
		    where+
		"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
		"      ) T1                                                                                        "+
		"      ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                              "+
		"      LEFT JOIN (                                                                                 "+
		"      SELECT GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
		"            ,SUM(ALL_SR) ALL_SR                                                                   "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
		"      WHERE DEAL_DATE="+getLastYearSameMonth(dealDate)+"                                          "+
		    where+
		"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
		"      )T2 ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                          "+
		"      LEFT JOIN (                                                                                 "+
		"      SELECT GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
		"            ,SUM(ALL_SR) ALL_SR                                                                   "+
		"      FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON                                                        "+
		"      WHERE DEAL_DATE="+getFristMonth(dealDate)+"                                                 "+
		    where+
		"      GROUP BY GROUP_ID_1,GROUP_ID_1_NAME                                                         "+
		"      )T3                                                                                         "+
		"      ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                              ";
	}else{
		return "         SUM(t.THIS_2G_SR)+SUM(t.THIS_3G_SR)+SUM(t.THIS_4G_SR) AS THIS_YW_SR ,          "+
		"         CASE                                                                                  "+
		"         WHEN SUM(t.LAST_2G_SR)+SUM(t.LAST_3G_SR)+SUM(t.LAST_4G_SR) = 0 THEN                   "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.THIS_2G_SR)+SUM(t.THIS_3G_SR)+SUM(t.THIS_4G_SR)                 "+
		"                           - (SUM(t.LAST_2G_SR)+SUM(t.LAST_3G_SR)+SUM(t.LAST_4G_SR)))          "+
		"                           /(SUM(t.LAST_2G_SR)+SUM(t.LAST_3G_SR)+SUM(t.LAST_4G_SR)) * 100,     "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END AS HB_YW,                                                                           "+
		"       SUM(t.THIS_4G_SR) AS THIS_4G_SR,                                                        "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LAST_4G_SR) = 0 THEN                                                       "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.THIS_4G_SR) - SUM(t.LAST_4G_SR)) /                              "+
		"                        SUM(t.LAST_4G_SR) * 100,                                               "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END HB_4G,                                                                              "+
		"       SUM(t.NETW_SR) AS NETW_SR,                                                              "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LAST_NETW_SR) = 0 THEN                                                     "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.NETW_SR) - SUM(t.LAST_NETW_SR)) /                               "+
		"                        SUM(t.LAST_NETW_SR) * 100,                                             "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END HB_NETW,                                                                            "+
		"       SUM(t.THIS_GWKD_SR) AS THIS_GWKD_SR,                                                    "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LAST_GWKD_SR) = 0 THEN                                                     "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.THIS_GWKD_SR) - SUM(t.LAST_GWKD_SR)) /                          "+
		"                        SUM(t.LAST_GWKD_SR) * 100,                                             "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END HB_GWKD,                                                                            "+
		"       SUM(t.THIS_ZHWJ_SR) AS THIS_ZHWJ_SR,                                                    "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LAST_ZHWJ_SR) = 0 THEN                                                     "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.THIS_ZHWJ_SR) - SUM(t.LAST_ZHWJ_SR)) /                          "+
		"                        SUM(t.LAST_ZHWJ_SR) * 100,                                             "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END HB_ZHWJ,                                                                            "+
		"       SUM(t.ALL_SR) AS ALL_SR,                                                                "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LAST_ALL) = 0 THEN                                                         "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.ALL_SR) - SUM(t.LAST_ALL)) / SUM(t.LAST_ALL) * 100,             "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END AS HB_ALL,                                                                          "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.LTMN_ALL_SR) = 0 THEN                                                      "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.ALL_SR) - SUM(t.LTMN_ALL_SR)) / SUM(t.LTMN_ALL_SR) * 100,       "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END AS TB_ALL,                                                                          "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.MN01_ALL_SR) = 0 THEN                                                      "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND((SUM(t.ALL_SR) - SUM(t.MN01_ALL_SR)) / SUM(t.MN01_ALL_SR) * 100,       "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END AS DB_ALL,                                                                          "+
		"       SUM(t.all1_sr)  AS all1_sr,                                                             "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.all1_sr) = 0 THEN                                                          "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(round(SUM(t.ALL_SR) / SUM(t.all1_sr) * 100,                                  "+
		"                        2),                                                                    "+
		"                  'fm9999999999999990.00') || '%'                                              "+
		"       END AS ALL_CHANL_SR,                                                                    "+
		"       CASE                                                                                    "+
		"         WHEN SUM(t.all1_sr) = 0 THEN                                                          "+
		"          '0%'                                                                                 "+
		"         WHEN SUM(t.ALL2_SR) = 0 THEN                                                          "+
		"          '0%'                                                                                 "+
		"         WHEN SUM(t.ALL2_SR) = 0 THEN                                                          "+
		"          '0%'                                                                                 "+
		"         WHEN SUM(t.LAST_ALL) / SUM(t.ALL2_SR) = 0 THEN                                        "+
		"          '0%'                                                                                 "+
		"         ELSE                                                                                  "+
		"          to_char(ROUND(((SUM(t.ALL_SR) / SUM(t.all1_sr)) -                                    "+
		"                        (SUM(t.LAST_ALL) / SUM(t.ALL2_SR))) /                                  "+
		"                        (SUM(t.LAST_ALL) / SUM(t.ALL2_SR)) * 100,                              "+
		"                        2),                                                                    "+
		"                  'fm99999999999990.00') || '%'                                                "+
		"       END AS HB_ALL_CHANL                                                                     "+
		"  FROM PMRT.TB_MRT_BUS_HALL_INCOME_MON t                                                       ";
	}
}

function downsAll() {
	var preField=" SELECT GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE,";
	var orderBy= " ORDER BY GROUP_ID_1,BUS_HALL_NAME ";
	var groupBy= " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
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
		where += " AND T_TYPE ='"+hallType+"' ";
	}
	var sql = preField+getSumSql(3,'','')+where+groupBy+orderBy;
	var showtext = '营业厅开账收入月报表-' + dealDate;
	var title=[["营业厅开帐收入月报表","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","营业厅","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网收入","","其中4G收入","","固网收入","","其中宽带收 入","","其中智慧沃家收入","","合计","环比","同比","定比1月","全渠道收入","占全渠道份额","份额环比"],
	           ["","","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","","",""]];
	downloadExcel(sql,title,showtext);
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
    if(month=='01'){
    	return (year-1)+month;
    }
    return (year-1)+(month<10?'0'+parseInt(month):month);
}
