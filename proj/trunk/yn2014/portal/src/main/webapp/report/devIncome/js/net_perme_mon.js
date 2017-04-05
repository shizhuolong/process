$(function(){
	var title=[["组织架构","渠道编码","运营模式","厅类型","自有厅4G网络渗透率","","","全渠道4G网络渗透率","","","环比","同比","定比1月","环比排名","店长名字","评议标识"],
	           ["","","","","使用4G网络出帐用户数","移网出帐用户数","当月4G渗透率 ","使用4G网络出帐用户数","移网出帐用户数","当月4G渗透率 ","","","","","",""]];
    
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","USER_4G_ACCT","USER_ALL_ACCT","PERMEN_4G","ALL_4G_NET","MOB_ACCT_NUM","PERME_ALL_4G","HB","TB","DB","RN","T_MANAGE_NAME","PYBS"];
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_4G_NET_PERME_MON"));
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
			var where="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(orgLevel,where);
				}else if(orgLevel==3){//点击市
					where+=" AND T.GROUP_ID_1='"+code+"'";
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
	var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		where += " AND T.GROUP_ID_0=86000";
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	
	var sql = downSql(where);
	var showtext = '自有厅4G渗透率-' + dealDate;
	var title=[["账期","地市","营业厅名称","渠道编码","运营模式","厅类型","自有厅4G网络渗透率","","","全渠道4G网络渗透率","","","环比","同比","定比1月","环比排名","店长名字","评议标识"],
	           ["","","","","","","使用4G网络出帐用户数","移网出帐用户数","当月4G渗透率 ","使用4G网络出帐用户数","移网出帐用户数","当月4G渗透率 ","","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var dealDate=$("#dealDate").val();
	var where1=where;
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
		where1+=" AND T.GROUP_ID_1='"+regionCode+"'";;
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND T.CHNL_TYPE ='"+hallType+"' ";
	}
	if(hq_chan_code!=""){
		where += " AND T.HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	}
	
	if(orgLevel==1){
		return "SELECT T.GROUP_ID_0 ROW_ID,                                                                               "+
		"       '云南省' ROW_NAME,                                                                                 "+
		"       '--' HQ_CHAN_CODE,                                                                                 "+
		"       '--' OPERATE_TYPE,                                                                                 "+
		"       '--' CHNL_TYPE,                                                                                    "+
		"       T.USER_4G_ACCT,                                                                                    "+
		"       T.USER_ALL_ACCT,                                                                                   "+
		"       PODS.GET_RADIX_POINT(T.PERMEN_4G,2) ||'%' PERMEN_4G,                                               "+
		"       T2.ALL_4G_NET,                                                                                     "+
		"       T2.MOB_ACCT_NUM,                                                                                   "+
		"       PODS.GET_RADIX_POINT(T2.PERME_ALL_4G,2) ||'%' PERME_ALL_4G,                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                          "+
		"                              WHEN T1.PERMEN_4G <> 0 THEN                                                 "+
		"                               (T.PERMEN_4G-T1.PERMEN_4G)*100/T1.PERMEN_4G                                "+
		"                              ELSE                                                                        "+
		"                               0                                                                          "+
		"                            END || '%',                                                                   "+
		"                            2) HB,                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                          "+
		"                              WHEN T4.PERMEN_4G <> 0 THEN                                                 "+
		"                               (T.PERMEN_4G - T4.PERMEN_4G)*100/T4.PERMEN_4G                              "+
		"                              ELSE                                                                        "+
		"                               0                                                                          "+
		"                            END || '%',                                                                   "+
		"                            2) TB,                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                          "+
		"                              WHEN T5.PERMEN_4G <> 0 THEN                                                 "+
		"                               (T.PERMEN_4G - T5.PERMEN_4G) *100/T5.PERMEN_4G                             "+
		"                              ELSE                                                                        "+
		"                               0                                                                          "+
		"                            END || '%',                                                                   "+
		"                            2) DB,                                                                        "+
		"       '--' RN,                                                                                           "+
		"       '--' T_MANAGE_NAME,                                                                                "+
		"       '--' PYBS                                                                                          "+
		"  FROM (SELECT GROUP_ID_0,                                                                                "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                  "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                          "+
		"                       0                                                                                  "+
		"                      ELSE                                                                                "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                   "+
		"                    END,                                                                                  "+
		"                    'FM99990.99'))  PERMEN_4G                                                             "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+dealDate+"                                                                      "+
		            where+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T                                                                                                     "+
		"  LEFT JOIN (SELECT GROUP_ID_0,                                                                           "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                  "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                          "+
		"                       0                                                                                  "+
		"                      ELSE                                                                                "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                   "+
		"                    END,                                                                                  "+
		"                    'FM99990.99'))  PERMEN_4G                                                             "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                        "+
		            where+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T1                                                                                                    "+
		"   ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                                         "+
		"    LEFT JOIN (SELECT GROUP_ID_0,                                                                         "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                  "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                          "+
		"                       0                                                                                  "+
		"                      ELSE                                                                                "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                   "+
		"                    END,                                                                                  "+
		"                    'FM99990.99'))  PERMEN_4G                                                             "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+getLastYearSameMonth(dealDate)+"                                                "+
		            where+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T4                                                                                                    "+
		"   ON(T.GROUP_ID_0=T4.GROUP_ID_0)                                                                         "+
		"   LEFT JOIN (SELECT GROUP_ID_0,                                                                          "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                  "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                          "+
		"                       0                                                                                  "+
		"                      ELSE                                                                                "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                   "+
		"                    END,                                                                                  "+
		"                    'FM99990.99'))  PERMEN_4G                                                             "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+getFristMonth(dealDate)+"                                                       "+
		            where+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T5                                                                                                    "+
		"   ON(T.GROUP_ID_0=T5.GROUP_ID_0)                                                                         "+
		"    LEFT JOIN (SELECT GROUP_ID_0,                                                                         "+
		"               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                             "+
		"               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                         "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                              WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                          "+
		"                               0                                                                          "+
		"                              ELSE                                                                        "+
		"                               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                 "+
		"                               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                       "+
		"                            END,                                                                          "+
		"                            'FM99990.99'))  PERME_ALL_4G                                                  "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+dealDate+"                                                                      "+
		           where1+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T2                                                                                                    "+
		"    ON(T.GROUP_ID_0=T2.GROUP_ID_0)                                                                        "+
		"    LEFT JOIN (SELECT GROUP_ID_0,                                                                         "+
		"               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                             "+
		"               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                         "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                 "+
		"                              WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                          "+
		"                               0                                                                          "+
		"                              ELSE                                                                        "+
		"                               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                 "+
		"                               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                       "+
		"                            END,                                                                          "+
		"                            'FM99990.99')) PERME_ALL_4G                                                   "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                              "+
		"        WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                        "+
		             where1+
		"        GROUP BY GROUP_ID_0                                                                               "+
		"   )T3                                                                                                    "+
		"   ON(T.GROUP_ID_0=T3.GROUP_ID_0)                                                                         ";
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,                                                        "+
		"       '--' HQ_CHAN_CODE,                                                                                     "+
		"       '--' OPERATE_TYPE,                                                                                     "+
		"       '--' CHNL_TYPE,                                                                                        "+
		"       T.USER_4G_ACCT,                                                                                        "+
		"       T.USER_ALL_ACCT,                                                                                       "+
		"       PODS.GET_RADIX_POINT(T.PERMEN_4G,2) ||'%' PERMEN_4G,                                                   "+
		"       T2.ALL_4G_NET,                                                                                         "+
		"       T2.MOB_ACCT_NUM,                                                                                       "+
		"       PODS.GET_RADIX_POINT(T2.PERME_ALL_4G,2) ||'%' PERME_ALL_4G,                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                              "+
		"                              WHEN T1.PERMEN_4G <> 0 THEN                                                     "+
		"                               (T.PERMEN_4G-T1.PERMEN_4G)*100/T1.PERMEN_4G                                    "+
		"                              ELSE                                                                            "+
		"                               0                                                                              "+
		"                            END || '%',                                                                       "+
		"                            2) HB,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                              "+
		"                              WHEN T4.PERMEN_4G <> 0 THEN                                                     "+
		"                               (T.PERMEN_4G - T4.PERMEN_4G)*100/T4.PERMEN_4G                                  "+
		"                              ELSE                                                                            "+
		"                               0                                                                              "+
		"                            END || '%',                                                                       "+
		"                            2) TB,                                                                            "+
		"       PODS.GET_RADIX_POINT(CASE                                                                              "+
		"                              WHEN T5.PERMEN_4G <> 0 THEN                                                     "+
		"                               (T.PERMEN_4G - T5.PERMEN_4G) *100/T5.PERMEN_4G                                 "+
		"                              ELSE                                                                            "+
		"                               0                                                                              "+
		"                            END || '%',                                                                       "+
		"                            2) DB,                                                                            "+
		"       '--' RN,                                                                                               "+
		"       '--' T_MANAGE_NAME,                                                                                    "+
		"       '--' PYBS                                                                                              "+
		"  FROM (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                         "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                      "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                    "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                              "+
		"                       0                                                                                      "+
		"                      ELSE                                                                                    "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                       "+
		"                    END,                                                                                      "+
		"                    'FM99990.99'))  PERMEN_4G                                                                 "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+dealDate+"                                                                          "+
		            where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T                                                                                                         "+
		"  LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                    "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                      "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                    "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                              "+
		"                       0                                                                                      "+
		"                      ELSE                                                                                    "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                       "+
		"                    END,                                                                                      "+
		"                    'FM99990.99'))  PERMEN_4G                                                                 "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                            "+
		            where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T1                                                                                                        "+
		"   ON(T.GROUP_ID_1=T1.GROUP_ID_1)                                                                             "+
		"    LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                  "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                      "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                    "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                              "+
		"                       0                                                                                      "+
		"                      ELSE                                                                                    "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                       "+
		"                    END,                                                                                      "+
		"                    'FM99990.99'))  PERMEN_4G                                                                 "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+getLastYearSameMonth(dealDate)+"                                                    "+
		            where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T4                                                                                                        "+
		"   ON(T.GROUP_ID_1=T4.GROUP_ID_1)                                                                             "+
		"   LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                   "+
		"               SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                      "+
		"               SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                    "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                              "+
		"                       0                                                                                      "+
		"                      ELSE                                                                                    "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                       "+
		"                    END,                                                                                      "+
		"                    'FM99990.99'))  PERMEN_4G                                                                 "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+getFristMonth(dealDate)+"                                                           "+
		            where+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T5                                                                                                        "+
		"   ON(T.GROUP_ID_1=T5.GROUP_ID_1)                                                                             "+
		"    LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                  "+
		"               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                                 "+
		"               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                             "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                              WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                              "+
		"                               0                                                                              "+
		"                              ELSE                                                                            "+
		"                               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                     "+
		"                               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                           "+
		"                            END,                                                                              "+
		"                            'FM99990.99'))  PERME_ALL_4G                                                      "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+dealDate+"                                                                          "+
		            where1+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T2                                                                                                        "+
		"    ON(T.GROUP_ID_1=T2.GROUP_ID_1)                                                                            "+
		"    LEFT JOIN (SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,                                                  "+
		"               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                                 "+
		"               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                             "+
		"               TRIM('.' FROM TO_CHAR(CASE                                                                     "+
		"                              WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                              "+
		"                               0                                                                              "+
		"                              ELSE                                                                            "+
		"                               SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                     "+
		"                               SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                           "+
		"                            END,                                                                              "+
		"                            'FM99990.99')) PERME_ALL_4G                                                       "+
		"        FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                  "+
		"        WHERE DEAL_DATE="+getLastMonth(dealDate)+"                                                            "+
		            where1+
		"        GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                        "+
		"   )T3                                                                                                        "+
		"   ON(T.GROUP_ID_1=T3.GROUP_ID_1)                                                                             ";
	}else{
		return "SELECT HQ_CHAN_NAME ROW_NAME,                                                                       "+
		"       HQ_CHAN_CODE,                                                                                                       "+
		"       OPERATE_TYPE,                                                                                                       "+
		"       CHNL_TYPE,                                                                                                          "+
		"       USER_4G_ACCT,                                                                                                       "+
		"       USER_ALL_ACCT,                                                                                                      "+
		"       PERMEN_4G,                                                                                                          "+
		"       ALL_4G_NET,                                                                                                         "+
		"       MOB_ACCT_NUM,                                                                                                       "+
		"       PERME_ALL_4G,                                                                                                       "+
		"       HB,                                                                                                                 "+
		"       TB,                                                                                                                 "+
		"       DB,                                                                                                                 "+
		"       RN,                                                                                                                 "+
		"       T_MANAGE_NAME,	                                                                                                    "+
		"       CASE WHEN RN<=ROUND(T_NUM * 0.2 ,0)                                                                                 "+
		"            THEN '优秀 <image src=\"..\\images\\good.png\" />'                                                               "+
		"            WHEN RN>ROUND(T_NUM * 0.2 ,0) AND RN <=ROUND(T_NUM * 0.9 ,0)                                                   "+
		"            THEN '良好 <image src=\"..\\images\\good.png\" />'                                                               "+
		"            ELSE '差评 <image src=\"..\\images\\bad.png\" />'  END PYBS                                                      "+
		"FROM(                                                                                                                      "+
		"SELECT T.DEAL_DATE,                                                                                                        "+
		"       T.HQ_CHAN_CODE,                                                                                                     "+
		"       T.HQ_CHAN_NAME,                                                                                                     "+
		"       T.OPERATE_TYPE,                                                                                                     "+
		"       T.CHNL_TYPE,                                                                                                        "+
		"       T.USER_4G_ACCT,                                                                                                     "+
		"       T.USER_ALL_ACCT,                                                                                                    "+
		"       T.PERMEN_4G,                                                                                                        "+
		"       T.ALL_4G_NET,                                                                                                       "+
		"       T.MOB_ACCT_NUM,                                                                                                     "+
		"       T.PERME_ALL_4G,                                                                                                     "+
		"       T.HB,                                                                                                               "+
		"       T.TB,                                                                                                               "+
		"       T.DB,                                                                                                               "+
		"       ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE ORDER BY TO_NUMBER(REPLACE(T.HB,'%')) DESC) RN,                         "+
		"       T_MANAGE_NAME,	                                                                                                    "+
		"       T1.T_NUM                                                                                                            "+
		"FROM(                                                                                                                      "+
		"SELECT T.DEAl_DATE,                                                                                                        "+
		"       T.HQ_CHAN_CODE,                                                                                                     "+
		"       T.HQ_CHAN_NAME,                                                                                                     "+
		"       T.OPERATE_TYPE,                                                                                                     "+
		"       T.CHNL_TYPE,                                                                                                        "+
		"       T.T_MANAGE_NAME,                                                                                                    "+
		"       SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                                           "+
		"       SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                                         "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                                                          "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99')) || '%' PERMEN_4G,                                                                       "+
		"       SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                                                      "+
		"       SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                                                  "+
		"       TRIM('.' FROM TO_CHAR(CASE                                                                                          "+
		"                      WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                                                   "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                                          "+
		"                       SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                                                "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99')) || '%' PERME_ALL_4G  ,                                                                  "+
		"     PODS.GET_RADIX_POINT(                                                                                                 "+
		"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
		"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))  <> 0                                                                                   "+
		"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99')) -                                                                                       "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"                    )*100/                                                                                                 "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"             ELSE 0 END  || '%',2)   HB,                                                                                   "+
		"     PODS.GET_RADIX_POINT(                                                                                                 "+
		"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
		"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))  <> 0                                                                                   "+
		"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99')) -                                                                                       "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"                    )*100/                                                                                                 "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"             ELSE 0 END  || '%',2)      TB,                                                                                "+
		"     PODS.GET_RADIX_POINT(                                                                                                 "+
		"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
		"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))  <> 0                                                                                   "+
		"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
		"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99')) -                                                                                       "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"                    )*100/                                                                                                 "+
		"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
		"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
		"                       0                                                                                                   "+
		"                      ELSE                                                                                                 "+
		"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
		"                    END,                                                                                                   "+
		"                    'FM99990.99'))                                                                                         "+
		"             ELSE 0 END  || '%',2)        DB                                                                               "+
		"  FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                                     "+
		"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T1                                                                               "+
		"  ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE="+getLastMonth(dealDate)+")                                           "+
		"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T2                                                                               "+
		"  ON(T.HQ_CHAN_CODE=T2.HQ_CHAN_CODE AND T2.DEAL_DATE="+getLastYearSameMonth(dealDate)+")                                   "+
		"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T3                                                                               "+
		"  ON(T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE AND T3.DEAL_DATE="+getFristMonth(dealDate)+")                                          "+
		" WHERE T.DEAL_DATE='"+dealDate+"'"+
		                            where+
		" GROUP BY T.DEAl_DATE,                                                                                                     "+
		"          T.HQ_CHAN_CODE,                                                                                                  "+
		"          T.HQ_CHAN_NAME,                                                                                                  "+
		"          T.OPERATE_TYPE,                                                                                                  "+
		"          T.CHNL_TYPE,                                                                                                     "+
		"          T.T_MANAGE_NAME                                                                                                  "+
		")T                                                                                                                         "+
		"LEFT JOIN (SELECT DEAL_DATE,COUNT(HQ_CHAN_CODE) T_NUM                                                                      "+
		"            FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                           "+
		" WHERE T.DEAL_DATE='"+dealDate+"'"+
		                where+
		"            GROUP BY T.DEAL_DATE ) T1                                                                                      "+
		"ON(T.DEAL_DATE=T1.DEAL_DATE)                                                                                               "+
		")                                                                                                                          "+
		"ORDER BY RN                                                                                                                ";
	}
  }

function downSql(where){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var dealDate=$("#dealDate").val();
	
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND T.CHNL_TYPE ='"+hallType+"' ";
	}
	if(hq_chan_code!=""){
		where += " AND T.HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	} 
	return "SELECT DEAL_DATE,GROUP_ID_1_NAME,HQ_CHAN_NAME,                                                                       "+
	"       HQ_CHAN_CODE,                                                                                                       "+
	"       OPERATE_TYPE,                                                                                                       "+
	"       CHNL_TYPE,                                                                                                          "+
	"       USER_4G_ACCT,                                                                                                       "+
	"       USER_ALL_ACCT,                                                                                                      "+
	"       PERMEN_4G,                                                                                                          "+
	"       ALL_4G_NET,                                                                                                         "+
	"       MOB_ACCT_NUM,                                                                                                       "+
	"       PERME_ALL_4G,                                                                                                       "+
	"       HB,                                                                                                                 "+
	"       TB,                                                                                                                 "+
	"       DB,                                                                                                                 "+
	"       RN,                                                                                                                 "+
	"       T_MANAGE_NAME,	                                                                                                    "+
	"       CASE WHEN RN<=ROUND(T_NUM * 0.2 ,0)                                                                                 "+
	"            THEN '优秀'                                                                                                     "+
	"            WHEN RN>ROUND(T_NUM * 0.2 ,0) AND RN <=ROUND(T_NUM * 0.9 ,0)                                                   "+
	"            THEN '良好'                                                                                                     "+
	"            ELSE '差评'  END PYBS                                                                                           "+
	"FROM(                                                                                                                      "+
	"SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,                                                                                      "+
	"       T.HQ_CHAN_CODE,                                                                                                     "+
	"       T.HQ_CHAN_NAME,                                                                                                     "+
	"       T.OPERATE_TYPE,                                                                                                     "+
	"       T.CHNL_TYPE,                                                                                                        "+
	"       T.USER_4G_ACCT,                                                                                                     "+
	"       T.USER_ALL_ACCT,                                                                                                    "+
	"       T.PERMEN_4G,                                                                                                        "+
	"       T.ALL_4G_NET,                                                                                                       "+
	"       T.MOB_ACCT_NUM,                                                                                                     "+
	"       T.PERME_ALL_4G,                                                                                                     "+
	"       T.HB,                                                                                                               "+
	"       T.TB,                                                                                                               "+
	"       T.DB,                                                                                                               "+
	"       ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE ORDER BY TO_NUMBER(REPLACE(T.HB,'%')) DESC) RN,                         "+
	"       T_MANAGE_NAME,	                                                                                                    "+
	"       T1.T_NUM                                                                                                            "+
	"FROM(                                                                                                                      "+
	"SELECT T.DEAl_DATE,T.GROUP_ID_1_NAME,                                                                                      "+
	"       T.HQ_CHAN_CODE,                                                                                                     "+
	"       T.HQ_CHAN_NAME,                                                                                                     "+
	"       T.OPERATE_TYPE,                                                                                                     "+
	"       T.CHNL_TYPE,                                                                                                        "+
	"       T.T_MANAGE_NAME,                                                                                                    "+
	"       SUM(NVL(T.USER_4G_ACCT, 0)) USER_4G_ACCT,                                                                           "+
	"       SUM(NVL(T.USER_ALL_ACCT, 0)) USER_ALL_ACCT,                                                                         "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                                                          "+
	"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99')) || '%' PERMEN_4G,                                                                       "+
	"       SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) ALL_4G_NET,                                                                      "+
	"       SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) MOB_ACCT_NUM,                                                                  "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                                                          "+
	"                      WHEN SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0)) = 0 THEN                                                   "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(DISTINCT NVL(T.ALL_4G_NET, 0)) * 100 /                                                          "+
	"                       SUM(DISTINCT NVL(T.MOB_ACCT_NUM, 0))                                                                "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99')) || '%' PERME_ALL_4G  ,                                                                  "+
	"     PODS.GET_RADIX_POINT(                                                                                                 "+
	"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
	"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))  <> 0                                                                                   "+
	"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
	"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99')) -                                                                                       "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"                    )*100/                                                                                                 "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T1.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T1.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T1.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"             ELSE 0 END  || '%',2)   HB,                                                                                   "+
	"     PODS.GET_RADIX_POINT(                                                                                                 "+
	"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
	"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))  <> 0                                                                                   "+
	"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
	"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99')) -                                                                                       "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"                    )*100/                                                                                                 "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T2.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T2.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T2.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"             ELSE 0 END  || '%',2)      TB,                                                                                "+
	"     PODS.GET_RADIX_POINT(                                                                                                 "+
	"      CASE WHEN TRIM('.' FROM TO_CHAR(CASE                                                                                 "+
	"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))  <> 0                                                                                   "+
	"            THEN  (TRIM('.' FROM TO_CHAR(CASE                                                                              "+
	"                      WHEN SUM(NVL(T.USER_ALL_ACCT, 0)) = 0 THEN                                                           "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T.USER_ALL_ACCT, 0))                                    "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99')) -                                                                                       "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"                    )*100/                                                                                                 "+
	"                    TRIM('.' FROM TO_CHAR(CASE                                                                             "+
	"                      WHEN SUM(NVL(T3.USER_ALL_ACCT, 0)) = 0 THEN                                                          "+
	"                       0                                                                                                   "+
	"                      ELSE                                                                                                 "+
	"                       SUM(NVL(T3.USER_4G_ACCT, 0)) * 100 / SUM(NVL(T3.USER_ALL_ACCT, 0))                                  "+
	"                    END,                                                                                                   "+
	"                    'FM99990.99'))                                                                                         "+
	"             ELSE 0 END  || '%',2)        DB                                                                               "+
	"  FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                                     "+
	"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T1                                                                               "+
	"  ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE="+getLastMonth(dealDate)+")                                           "+
	"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T2                                                                               "+
	"  ON(T.HQ_CHAN_CODE=T2.HQ_CHAN_CODE AND T2.DEAL_DATE="+getLastYearSameMonth(dealDate)+")                                   "+
	"  LEFT JOIN PMRT.TAB_MRT_4G_NET_PERME_MON T3                                                                               "+
	"  ON(T.HQ_CHAN_CODE=T3.HQ_CHAN_CODE AND T3.DEAL_DATE="+getFristMonth(dealDate)+")                                          "+
	                            where+
	" GROUP BY T.DEAl_DATE,T.GROUP_ID_1_NAME,                                                                                    "+
	"          T.HQ_CHAN_CODE,                                                                                                  "+
	"          T.HQ_CHAN_NAME,                                                                                                  "+
	"          T.OPERATE_TYPE,                                                                                                  "+
	"          T.CHNL_TYPE,                                                                                                     "+
	"          T.T_MANAGE_NAME                                                                                                  "+
	")T                                                                                                                         "+
	"LEFT JOIN (SELECT DEAL_DATE,COUNT(HQ_CHAN_CODE) T_NUM                                                                      "+
	"            FROM PMRT.TAB_MRT_4G_NET_PERME_MON T                                                                            "+
	               where+
	"            GROUP BY DEAL_DATE ) T1                                                                                        "+
	"ON(T.DEAL_DATE=T1.DEAL_DATE)                                                                                               "+
	")                                                                                                                          "+
	"ORDER BY RN                                                                                                                ";
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