$(function() {
		//发展日通报
	$("#devStartDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
	$("#devEndDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
		queryDevData();
		$("#devSearchBtn").click(function(){
			//$("#devDataBar").css({"dispaly":"none"});
			$("#devDataBar").hide();
			queryDevData();
		});
		$("#devDownBtn").click(function(){
			downDevData();
		});
});

/**
 * 发展日通报
 */	
function queryDevData(){
	var devStartDate = $("#devStartDate").val();
	var devEndDate   = $("#devEndDate").val();
	
	//获得列
	var columns = getDevColumns();
	//获得sql
	var sql = getDevSql();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	//$("#devDataBar").css({"display":"none"});
	
	var content="<tbody>";
	if(devStartDate==devEndDate){
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_DAY_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_DAY_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_ALL_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_ALL_DEV'])+"</td>"
				+"<td class='numberStyle  background'>"+isNull(n['LJ_ALL_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['ALL_DB'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['SXWC_RATE'])+"</td>"
			content+="</tr>";
		});
	}else{
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT'])+"</td>"
				+"<td class='numberStyle  background'>"+isNull(n['THIS_YW_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_YW_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_NET_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_DEV_RATE'])+"</td>"
			content+="</tr>";
		});	
	}
	
	content+="</tr></tbody>";
	var table = columns+content;
	if(content != "<tbody></tr></tbody>") {
		$("#devDataGrid").empty().html(table);
	}else {
		$("#devDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}
}

/**
 * 发展日通报下载
 */
function downDevData(){
	var devStartDate = $("#devStartDate").val();
	var devEndDate   = $("#devEndDate").val();
	var day = devEndDate.substr(6);
	var title;
	if(devStartDate==devEndDate){
		title=[
				["云南联通自营厅新增发展日通报","","","","","","","","","","","","",""],
				["单位：户","本月截止：",day+" 日","-","","","","","","","","","",""],
				["分公司","厅数","日发展","","月累计","","发展累计","单厅","累计环比(%)","","","定比","定比排名","年度日累计发展时序完成率"],
				["","","移动网","宽带","移动网","宽带","","","小计","移动网","宽带","","",""]
		       ];
	}else{
		title=[
				["分公司","厅数","月累计","","单厅","","累计环比",""],
				["","","移动网","宽带","移动网","宽带","移动网","宽带"]
			  ];
	}
	var sql = getDevSql();
	//var title=[["账期","地市名称","营服名称","渠道编码","渠道名称","BSS发展编码","直销礼包编码","HR编码","直销人/渠道经理","用户编码","用户号码","网别","入网时间"]];
	showtext = "云南联通自营厅新增发展日通报-("+devStartDate+"~"+devEndDate+")";
	downloadExcel(sql,title,showtext);
}
/**
 * 获得发展的sql
 * @returns {String}
 */
function getDevSql(){
	var devStartDate = $("#devStartDate").val();
	var devEndDate   = $("#devEndDate").val();
	var devOpeType   = $("#devOpeType").val();
	var devChnlType  = $("#devChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var sql = "";
	var where="";
	//条件
	if(""!=devChnlType){
		where+=" AND CHNL_TYPE  ='"+devChnlType+"' ";
	}
	if(""!=devOpeType){
		where+=" AND OPERATE_TYPE  ='"+devOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	
	if(devStartDate==devEndDate){
		sql="SELECT T.GROUP_ID_1_NAME,                                                                                                                                        "+
		"       T.BUS_COUNT,                                                                                                                                              "+
		"       T.THIS_YW_DAY_DEV,                                                                                                                                        "+
		"       T.THIS_NET_DAY_DEV,                                                                                                                                       "+
		"       T.THIS_YW_MON_DEV,                                                                                                                                        "+
		"       T.THIS_NET_MON_DEV,                                                                                                                                       "+
		"       T.THIS_ALL_MON_DEV,                                                                                                                                       "+
		"       T.DT_ALL_DEV,                                                                                                                                             "+
		"       T.LJ_ALL_DEV_RATE,                                                                                                                                        "+
		"       T.LJ_YW_DEV_RATE,                                                                                                                                         "+
		"       T.LJ_NET_DEV_RATE,                                                                                                                                        "+
		"       T.ALL_DB,                                                                                                                                                 "+
		"       T.HB_RANK ,                                                                                                                                               "+
		"       T.SXWC_RATE                                                                                                                                               "+
		"FROM (                                                                                                                                                           "+
		"SELECT T.GROUP_ID_1_NAME,                                                                                                                                        "+
		"       T.BUS_COUNT,                                                                                                                                              "+
		"       T.THIS_YW_DAY_DEV,                                                                                                                                        "+
		"       T.THIS_NET_DAY_DEV,                                                                                                                                       "+
		"       T.THIS_YW_MON_DEV,                                                                                                                                        "+
		"       T.THIS_NET_MON_DEV,                                                                                                                                       "+
		"       T.THIS_ALL_MON_DEV,                                                                                                                                       "+
		"       T.DT_ALL_DEV,                                                                                                                                             "+
		"       T.LJ_ALL_DEV_RATE,                                                                                                                                        "+
		"       T.LJ_YW_DEV_RATE,                                                                                                                                         "+
		"       T.LJ_NET_DEV_RATE,                                                                                                                                        "+
		"       T.ALL_DB,                                                                                                                                                 "+
		"       CASE WHEN GROUP_ID_1_NAME='全省'                                                                                                                          "+
		"                    THEN 0                                                                                                                                       "+
		"                    ELSE ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE ORDER BY T.ALL_DB1 DESC) END HB_RANK ,                                                      "+
		"       T.SXWC_RATE                                                                                                                                               "+
		"FROM (                                                                                                                                                           "+
		"        SELECT T.DEAL_DATE,                                                                                                                                      "+
		"               T.GROUP_ID_1_NAME,                                                                                                                                "+
		"               T.BUS_COUNT,                                                                                                                                      "+
		"               T.THIS_YW_DAY_DEV,                                                                                                                                "+
		"               T.THIS_NET_DAY_DEV,                                                                                                                               "+
		"               T.THIS_YW_MON_DEV,                                                                                                                                "+
		"               T.THIS_NET_MON_DEV,                                                                                                                               "+
		"               T.THIS_ALL_MON_DEV,                                                                                                                               "+
		"               T.DT_ALL_DEV,                                                                                                                                     "+
		"               T.LJ_ALL_DEV_RATE,                                                                                                                                "+
		"               T.LJ_YW_DEV_RATE,                                                                                                                                 "+
		"               T.LJ_NET_DEV_RATE,                                                                                                                                "+
		"               ROUND(CASE WHEN T3.LAST_SEASON_DEV<>0                                                                                                             "+
		"                                         THEN (T.THIS_ALL_MON_DEV-T3.LAST_SEASON_DEV)*100/T3.LAST_SEASON_DEV                                                     "+
		"                                         ELSE 0 END ,2)  ALL_DB1,                                                                                                "+
		"               PODS.GET_RADIX_POINT(CASE WHEN T3.LAST_SEASON_DEV<>0                                                                                              "+
		"                                         THEN (T.THIS_ALL_MON_DEV-T3.LAST_SEASON_DEV)*100/T3.LAST_SEASON_DEV                                                     "+
		"                                         ELSE 0 END ||'%',2)  ALL_DB,                                                                                            "+
		"               T.HB_RANK,                                                                                                                                        "+
		"               PODS.GET_RADIX_POINT((T2.YEAR_LJ_DEV /                                                                                                            "+
		"                                    (T1.DEV_AVG_YEAR *                                                                                                           "+
		"                                    ((TO_DATE(T.DEAL_DATE, 'YYYYMMDD') -                                                                                         "+
		"                                    TO_DATE(SUBSTR(T.DEAL_DATE, 1, 4) || '0101',                                                                                 "+
		"                                                'YYYYMMDD')) + 1))) * 100 || '%',                                                                                "+
		"                                    2) SXWC_RATE                                                                                                                 "+
		"          FROM (SELECT '全省' GROUP_ID_1_NAME,                                                                                                                   "+
		"                       DEAL_DATE,                                                                                                                                "+
		"                       COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                                   "+
		"                       NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                                                                 "+
		"                       NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                                                               "+
		"                       NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                                                                "+
		"                       NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                                                              "+
		"                       NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                                                                  "+
		"                       NVL(SUM(S1_LJ_DEV), 0) S1_LJ_DEV,                                                                                                         "+
		"                       NVL(SUM(S2_LJ_DEV), 0) S2_LJ_DEV,                                                                                                         "+
		"                       NVL(SUM(S3_LJ_DEV), 0) S3_LJ_DEV,                                                                                                         "+
		"                       NVL(SUM(S4_LJ_DEV), 0) S4_LJ_DEV,                                                                                                         "+
		"                       CASE                                                                                                                                      "+
		"                         WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                             "+
		"                          ROUND(NVL(SUM(THIS_ALL_DEV1), 0) /                                                                                                     "+
		"                                COUNT(DISTINCT HQ_CHAN_CODE),                                                                                                    "+
		"                                0)                                                                                                                               "+
		"                         ELSE                                                                                                                                    "+
		"                          0                                                                                                                                      "+
		"                       END DT_ALL_DEV,                                                                                                                           "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                 "+
		"                                              WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                                                          "+
		"                                               (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /                                                 "+
		"                                               NVL(SUM(LAST_ALL_DEV1), 0)                                                                                        "+
		"                                              ELSE                                                                                                               "+
		"                                               0                                                                                                                 "+
		"                                            END || '%',                                                                                                          "+
		"                                            2) LJ_ALL_DEV_RATE,                                                                                                  "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                 "+
		"                                              WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                                                           "+
		"                                               (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /                                                   "+
		"                                               NVL(SUM(LAST_YW_DEV1), 0)                                                                                         "+
		"                                              ELSE                                                                                                               "+
		"                                               0                                                                                                                 "+
		"                                            END || '%',                                                                                                          "+
		"                                            2) LJ_YW_DEV_RATE,                                                                                                   "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                 "+
		"                                              WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                                                          "+
		"                                               (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /                                                 "+
		"                                               NVL(SUM(LAST_NET_DEV1), 0)                                                                                        "+
		"                                              ELSE                                                                                                               "+
		"                                               0                                                                                                                 "+
		"                                            END || '%',                                                                                                          "+
		"                                            2) LJ_NET_DEV_RATE,                                                                                                  "+
		"                       0 HB_RANK                                                                                                                                 "+
		"                  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                          "+
		"                 WHERE DEAL_DATE = '"+devStartDate+"'                                                                                                         "+
		                 where+
		"                 GROUP BY DEAL_DATE                                                                                                                              "+
		"                UNION ALL                                                                                                                                        "+
		"                SELECT GROUP_ID_1_NAME,                                                                                                                          "+
		"                       DEAL_DATE,                                                                                                                                "+
		"                       BUS_COUNT,                                                                                                                                "+
		"                       THIS_YW_DAY_DEV,                                                                                                                          "+
		"                       THIS_NET_DAY_DEV,                                                                                                                         "+
		"                       THIS_YW_MON_DEV,                                                                                                                          "+
		"                       THIS_NET_MON_DEV,                                                                                                                         "+
		"                       THIS_ALL_MON_DEV,                                                                                                                         "+
		"                       S1_LJ_DEV,                                                                                                                                "+
		"                       S2_LJ_DEV,                                                                                                                                "+
		"                       S3_LJ_DEV,                                                                                                                                "+
		"                       S4_LJ_DEV,                                                                                                                                "+
		"                       DT_ALL_DEV,                                                                                                                               "+
		"                       LJ_ALL_DEV_RATE,                                                                                                                          "+
		"                       LJ_YW_DEV_RATE,                                                                                                                           "+
		"                       LJ_NET_DEV_RATE,                                                                                                                          "+
		"                       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(LJ_ALL_DEV_RATE, '%', '')) DESC, THIS_ALL_MON_DEV DESC) HB_RANK      "+
		"                  FROM (SELECT GROUP_ID_0,                                                                                                                       "+
		"                               DEAL_DATE,                                                                                                                        "+
		"                               GROUP_ID_1_NAME GROUP_ID_1_NAME,                                                                                                  "+
		"                               COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                           "+
		"                               NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                                                         "+
		"                               NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                                                       "+
		"                               NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                                                        "+
		"                               NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                                                      "+
		"                               NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                                                          "+
		"                               NVL(SUM(S1_LJ_DEV), 0) S1_LJ_DEV,                                                                                                 "+
		"                               NVL(SUM(S2_LJ_DEV), 0) S2_LJ_DEV,                                                                                                 "+
		"                               NVL(SUM(S3_LJ_DEV), 0) S3_LJ_DEV,                                                                                                 "+
		"                               NVL(SUM(S4_LJ_DEV), 0) S4_LJ_DEV,                                                                                                 "+
		"                               CASE                                                                                                                              "+
		"                                 WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                     "+
		"                                  ROUND(NVL(SUM(THIS_ALL_DEV1), 0) /                                                                                             "+
		"                                        COUNT(DISTINCT HQ_CHAN_CODE),                                                                                            "+
		"                                        0)                                                                                                                       "+
		"                                 ELSE                                                                                                                            "+
		"                                  0                                                                                                                              "+
		"                               END DT_ALL_DEV,                                                                                                                   "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                         "+
		"                                                      WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                                                  "+
		"                                                       (NVL(SUM(THIS_ALL_DEV1), 0) -                                                                             "+
		"                                                       NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /                                                                       "+
		"                                                       NVL(SUM(LAST_ALL_DEV1), 0)                                                                                "+
		"                                                      ELSE                                                                                                       "+
		"                                                       0                                                                                                         "+
		"                                                    END || '%',                                                                                                  "+
		"                                                    2) LJ_ALL_DEV_RATE,                                                                                          "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                         "+
		"                                                      WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                                                   "+
		"                                                       (NVL(SUM(THIS_YW_DEV1), 0) -                                                                              "+
		"                                                       NVL(SUM(LAST_YW_DEV1), 0)) * 100 /                                                                        "+
		"                                                       NVL(SUM(LAST_YW_DEV1), 0)                                                                                 "+
		"                                                      ELSE                                                                                                       "+
		"                                                       0                                                                                                         "+
		"                                                    END || '%',                                                                                                  "+
		"                                                    2) LJ_YW_DEV_RATE,                                                                                           "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                         "+
		"                                                      WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                                                  "+
		"                                                       (NVL(SUM(THIS_NET_DEV1), 0) -                                                                             "+
		"                                                       NVL(SUM(LAST_NET_DEV1), 0)) * 100 /                                                                       "+
		"                                                       NVL(SUM(LAST_NET_DEV1), 0)                                                                                "+
		"                                                      ELSE                                                                                                       "+
		"                                                       0                                                                                                         "+
		"                                                    END || '%',                                                                                                  "+
		"                                                    2) LJ_NET_DEV_RATE                                                                                           "+
		"                          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                  "+
		"                         WHERE DEAL_DATE = '"+devStartDate+"'                                                                                                 "+
		                           where+
		"                         GROUP BY GROUP_ID_0, GROUP_ID_1_NAME, DEAL_DATE)) T                                                                                     "+
		"          JOIN PCDE.TB_CDE_BUS_HALL_TARGET T1                                                                                                                    "+
		"            ON (T.GROUP_ID_1_NAME = T1.GROUP_ID_1_NAME)                                                                                                          "+
		"          LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '全省') GROUP_ID_1_NAME,                                                                                        "+
		"                            NVL(SUM(THIS_YW_DEV), 0) + NVL(SUM(THIS_NET_DEV), 0) YEAR_LJ_DEV                                                                     "+
		"                       FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                     "+
		"                      WHERE DEAL_DATE LIKE '"+getYear(devStartDate)+"%'                                                                                       "+
		"                        AND DEAL_DATE <= '"+devStartDate+"'                                                                                                   "+
		                          where+
		"                      GROUP BY GROUPING SETS(GROUP_ID_0,(GROUP_ID_0, GROUP_ID_1_NAME))) T2                                                                       "+
		"            ON (T2.GROUP_ID_1_NAME = T.GROUP_ID_1_NAME)                                                                                                          "+
		"            LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '全省') GROUP_ID_1_NAME,                                                                                       "+
		"                            NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) LAST_SEASON_DEV                                                               "+
		"                       FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                     "+
		"                      WHERE DEAL_DATE = PMRT.LAST_QUAR_DEAL("+devStartDate+")                                                                                 "+
		                          where+
		"                      GROUP BY GROUPING SETS(GROUP_ID_0,(GROUP_ID_0, GROUP_ID_1_NAME))) T3                                                                       "+
		"            ON (T3.GROUP_ID_1_NAME = T.GROUP_ID_1_NAME)                                                                                                          "+
		"         ORDER BY HB_RANK                                                                                                                                        "+
		"        )T                                                                                                                                                       "+
		")T ORDER BY HB_RANK                                                                                                                                              "; 
	}else{
		sql=	"SELECT                                                                                        		  "+
				"      NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                     "+
				"      ,COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT                                                        "+
				"      ,NVL(SUM(THIS_YW_DEV),0) THIS_YW_MON_DEV                                                       "+
				"      ,NVL(SUM(THIS_NET_DEV),0) THIS_NET_MON_DEV                                                     "+
				"      ,CASE WHEN COUNT(DISTINCT HQ_CHAN_CODE)<>0 THEN                                                "+
				"                            ROUND(NVL(SUM(THIS_YW_DEV),0)/COUNT(DISTINCT HQ_CHAN_CODE),0)  		  "+
				"                                         ELSE 0 END DT_YW_DEV                                        "+
				"      ,CASE WHEN COUNT(DISTINCT HQ_CHAN_CODE)<>0 THEN                                                "+
				"                           ROUND(NVL(SUM(THIS_NET_DEV),0)/COUNT(DISTINCT HQ_CHAN_CODE),0)            "+
				"                                         ELSE 0 END DT_NET_DEV                                       "+
				"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_DEV),0)<>0                                     "+
				"            THEN (NVL(SUM(THIS_YW_DEV),0)-NVL(SUM(LAST_YW_DEV),0))*100/NVL(SUM(LAST_YW_DEV),0)       "+
				"            ELSE 0                                                                                   "+
				"            END  || '%',2) LJ_YW_DEV_RATE                                                            "+
				"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_DEV),0)<>0                                    "+
				"            THEN (NVL(SUM(THIS_NET_DEV),0)-NVL(SUM(LAST_NET_DEV),0))*100/NVL(SUM(LAST_NET_DEV),0)    "+
				"            ELSE 0                                                                                   "+
				"            END  || '%',2) LJ_NET_DEV_RATE                                                           "+
				"FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE BETWEEN  '"+devStartDate+"' AND '"+devEndDate+"'"+
				where+
				" GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))"+
				" ORDER BY THIS_YW_MON_DEV ";
	}
	
	return sql;
}

/**
 * 获得发展的表头
 * @returns {String}
 */
function getDevColumns(){
	var devStartDate = $("#devStartDate").val();
	var devEndDate   = $("#devEndDate").val();
	var day = devEndDate.substr(6);
	var columns;
	if(devStartDate==devEndDate){
		$("#devDataBarSpan").empty().text(day);
		$("#devDataBar").show();
		columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>分公司</th>" +
					"<th rowspan='2'>厅数</th>" +
					"<th colspan='2'>日发展</th>" +
					"<th colspan='2'>月累计</th>" +
					"<th rowspan='2'>发展累计</th>" +
					"<th rowspan='2'>单厅</th>" +
					"<th colspan='3'>累计环比(%)</th>" +
					"<th rowspan='2'>定比</th>" +
					"<th rowspan='2'>定比排名</th>" +
					"<th rowspan='2'>年度日累计发展时序完成率</th>" +
				"</tr>" +
				"<tr>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
					"<th>小计</th>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
				"</tr>" +
				"</thead>";
	}else{
		columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>分公司</th>" +
					"<th rowspan='2'>厅数</th>" +
					"<th colspan='2'>月累计</th>" +
					"<th colspan='2'>单厅</th>" +
					"<th colspan='2'>累计环比</th>" +
				"</tr>" +
				"<tr>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
					"<th>移动网</th>" +
					"<th>宽带</th>" +
				"</tr>" +
				"</thead>";
	}
	return columns;
}

function load(sql){
	var ls=[];
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/devIncome/devIncome_query.action",
		data:{
           "sql":sql
	   	}, 
	   	success:function(data){
	   		if(data&&data.length>0){
	   			ls=data;
	   		}
	    }
	});
	return ls;
}

function isNull(obj){
	if(obj == undefined) {
		return "&nbsp;";
	}else if(obj == null){
		return "&nbsp;";
	}else if(obj == ''){
		if(obj==0){
			return obj;
		}else{
			return "&nbsp;";	
		}
	}else{
		return obj;
	}
}

function getYear(dealDate){
	return dealDate.substr(0,4);
}
