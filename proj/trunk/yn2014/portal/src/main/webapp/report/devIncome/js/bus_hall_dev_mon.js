$(function(){
	var title=[["营业厅新增发展月报表","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带收 入","","其中智慧沃家发展","","合计","环比","同比","定比1月","全渠道发展","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","",""]];
    
	var field=["HQ_CHAN_CODE","T_TYPE","OPERATE_TYPE","THIS_YW_NUM","HB_YW","THIS_4G_NUM","HB_4G","NETW_NUM","HB_NETW","THIS_GWKD_NUM","HB_GWKD","ZHWJ_DEV","HB_ZHWJ","ALL_NUM","HB_ALL","TB_ALL","DB_ALL","ALL1_DEV","ALL_CHANL_NUM","HB_ALL_CHANL"];
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
			var groupBy = "";
			var where="";
			var levelSql;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND T.GROUP_ID_0='"+code+"'";
					levelSql=2;
				}else if(orgLevel==3){//点击市
					preField=" SELECT T.HQ_CHAN_CODE ROW_ID,T.BUS_HALL_NAME ROW_NAME,T.HQ_CHAN_CODE,T.T_TYPE,T.OPERATE_TYPE,";
					groupBy = " GROUP BY T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.T_TYPE,T.OPERATE_TYPE";
					where+=" WHERE T.DEAL_DATE='"+dealDate+"' AND T.GROUP_ID_1='"+code+"'";
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
					where+=" AND T.GROUP_ID_0='"+code+"'";
					levelSql=1;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					where+=" AND T.GROUP_ID_1='"+code+"'";
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
				sql=preField+getSumSql(dealDate,'','')+where+groupBy;
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
		return "        T.THIS_YW_NUM,                                                                                "+
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
		"         SUM(t.all1) ALL1_DEV                                                                         "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+dealDate+"'                                                                     "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		")T                                                                                                    "+
		"LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                 "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                          "+
		"           WHERE T.DEAL_DATE='"+dealDate+"'                                                           "+
		"           GROUP BY T.GROUP_ID_0                                                                      "+
		"           )T0                                                                                        "+
		"ON   (T.GROUP_ID_0=T0.GROUP_ID_0)                                                                     "+
		"LEFT JOIN (SELECT T.GROUP_ID_0,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                 "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                          "+
		"           WHERE T.DEAL_DATE="+getLastMonth(dealDate)+"                                               "+
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
		"         SUM(t.all1) ALL1_DEV                                                                         "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+getLastMonth(dealDate)+"'                                                       "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T1 ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                                   "+
		"LEFT JOIN (                                                                                           "+
		" SELECT  GROUP_ID_0,                                                                                  "+
		"         SUM(t.ALL_NUM) AS ALL_NUM                                                                    "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+getLastYearSameMonth(dealDate)+"'                                               "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T2 ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                                   "+
		"LEFT JOIN (                                                                                           "+
		" SELECT  GROUP_ID_0,                                                                                  "+
		"         SUM(t.ALL_NUM) AS ALL_NUM                                                                    "+
		" FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                  "+
		" WHERE DEAL_DATE = '"+getFristMonth(dealDate)+"'                                                      "+
		    where+
		" GROUP BY GROUP_ID_0                                                                                  "+
		") T3 ON(T.GROUP_ID_0=T3.GROUP_ID_0)                                                                   "; 
	}else if(levelSql==2){
		return "        T.THIS_YW_NUM,                                                                                              "+
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
		"         SUM(t.all1) ALL1_DEV                                                                                       "+
		"     FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                            "+
		"     WHERE DEAL_DATE = '"+dealDate+"'                                                                               "+
		    where+
		"     GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                 "+
		"     )T                                                                                                             "+
		"LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                               "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                        "+
		"           WHERE T.DEAL_DATE='"+dealDate+"'                                                                         "+
		"           GROUP BY T.GROUP_ID_1                                                                                    "+
		"           )T0                                                                                                      "+
		"ON   (T.GROUP_ID_1=T0.GROUP_ID_1)                                                                                   "+
		"LEFT JOIN (SELECT T.GROUP_ID_1,SUM(T.DEV_ALL_NUM-DEV_ICT_NUM) DEV_NUM                                               "+
		"           FROM PMRT.TAB_MRT_TARGET_HQ_MON T                                                                        "+
		"           WHERE T.DEAL_DATE="+getLastMonth(dealDate)+"                                                             "+
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
		"                   SUM(t.all1) ALL1_DEV                                                                             "+
		"          FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                       "+
		"          WHERE DEAL_DATE = "+getLastMonth(dealDate)+"                                                              "+
		    where+
		"          GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                            "+
		"       ) T1                                                                                                         "+
		"ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                                      "+
		"LEFT JOIN (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                           "+
		"                   SUM(t.ALL_NUM) AS ALL_NUM                                                                        "+
		"           FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                      "+
		"           WHERE DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                     "+
		    where+
		"           GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                           "+
		"           ) T2                                                                                                     "+
		"ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                                                      "+
		"LEFT JOIN (SELECT  GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                           "+
		"                   SUM(t.ALL_NUM) AS ALL_NUM                                                                        "+
		"         FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                                        "+
		"         WHERE DEAL_DATE = "+getFristMonth(dealDate)+"                                                              "+
		    where+
		"         GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                             "+
		"         ) T3                                                                                                       "+
		"ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                                                      ";
	}else{
	 return "       SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,   "+
	"        CASE                                                                                  "+
	"         WHEN SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM) = 0 THEN               "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(ROUND((SUM(t.THIS_2G_NUM)+SUM(t.THIS_3G_NUM)+SUM(t.THIS_4G_NUM)             "+
	"                           - (SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM)))      "+
	"                           /(SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM)) * 100, "+
	"                        2),                                                                   "+
	"                  'fm9999999999999990.00') || '%'                                             "+
	"       END AS HB_YW,                                                                          "+
	"       SUM(t.THIS_4G_NUM) AS THIS_4G_NUM,                                                     "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.LAST_4G_NUM) = 0 THEN                                        "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.THIS_4G_NUM) - SUM(t.LAST_4G_NUM)) /                      "+
	"                             SUM(t.LAST_4G_NUM) * 100,                                        "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_4G,                                      "+
	"       SUM(t.NETW_NUM) AS NETW_NUM,                                                           "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.LAST_NETW_NUM) = 0 THEN                                                   "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          ROUND((SUM(t.NETW_NUM) - SUM(t.LAST_NETW_NUM)) /                                    "+
	"                SUM(t.LAST_NETW_NUM) * 100,                                                   "+
	"                2) || '%'                                                                     "+
	"       END AS HB_NETW,                                                                        "+
	"       SUM(t.THIS_GWKD_NUM) AS THIS_GWKD_NUM,                                                 "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.LAST_GWKD_NUM) = 0 THEN                                      "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.THIS_GWKD_NUM) - SUM(t.LAST_GWKD_NUM)) /                  "+
	"                             SUM(t.LAST_GWKD_NUM) * 100,                                      "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_GWKD,                                    "+
	"       SUM(t.ZHWJ_DEV) AS ZHWJ_DEV,                                                           "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.ZHWJ_DEVL) = 0 THEN                                          "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.ZHWJ_DEV) - SUM(t.ZHWJ_DEVL)) / SUM(t.ZHWJ_DEVL) * 100,   "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_ZHWJ,                                    "+
	"       SUM(t.ALL_NUM) AS ALL_NUM,                                                             "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.LAST_ALL) <> 0 THEN                                          "+
	"                       (SUM(T.ALL_NUM) - SUM(T.LAST_ALL)) * 100 / SUM(T.LAST_ALL)             "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' HB_ALL,                                          "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.LTMN_ALL_NUM) <> 0 THEN                                      "+
	"                       (SUM(T.ALL_NUM) - SUM(T.LTMN_ALL_NUM)) * 100 / SUM(T.LTMN_ALL_NUM)     "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' TB_ALL,                                          "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.MN01_ALL_NUM) <> 0 THEN                                      "+
	"                       (SUM(T.ALL_NUM) - SUM(T.MN01_ALL_NUM)) * 100 / SUM(T.MN01_ALL_NUM)     "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' DB_ALL,                                          "+
	"       SUM(t.all1)   ALL1_DEV,                                                                "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.all1) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(round(SUM(t.all_num) / SUM(t.all1)* 100,                                    "+
	"                        2),                                                                   "+
	"                  'fm99999999999990.00') || '%'                                               "+
	"       END AS ALL_CHANL_NUM,                                                                  "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.all1) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.all2) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.all2) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.LAST_ALL) / SUM(t.all2) = 0 THEN                                          "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(ROUND(((SUM(t.all_num) / SUM(t.all1)) -                                     "+
	"                        (SUM(t.LAST_ALL) / SUM(t.all2))) /                                    "+
	"                        (SUM(t.LAST_ALL) / SUM(t.all2)) * 100,                                "+
	"                        2),                                                                   "+
	"                  'fm99999999999990.00') || '%'                                               "+
	"       END AS HB_ALL_CHANL                                                                    "+
	"  FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                         ";
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
	var showtext = '营业厅新增发展月报表-' + dealDate;
	var title=[["营业厅开帐发展月报表","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","营业厅","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带收 入","","其中智慧沃家发展","","合计","环比","同比","定比1月","全渠道发展","占全渠道份额","份额环比"],
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
