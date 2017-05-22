$(function() {
	$("#incomeStartDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
	$("#incomeEndDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
		queryIncomData();
		$("#incomeSearchBtn").click(function(){
			$("#incomeDataBar").hide();
			queryIncomData();
		});
		$("#incomeDownBtn").click(function(){
			downIncomeData();
		});
});


/**
 * 收入日通报
 */
function queryIncomData(){
	var incomeStartDate = $("#incomeStartDate").val();
	var incomeEndDate   = $("#incomeEndDate").val();
	
	//获得列
	var columns = getIncomColumns();
	//获得sql
	var sql = getIncomSql();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	var content="<tbody>";
	if(incomeStartDate==incomeEndDate){
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_DAY_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_DAY_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_ALL_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_ALL_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_ALL_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['ALL_DB'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['SXWC_RATE'])+"</td>"
			content+="</tr>";
		});
	}else{
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME1'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT1'])+"</td>"
				+"<td class='numberStyle background'>"+isNull(n['THIS_YW_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_YW_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['DT_NET_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_SR_RATE'])+"</td>"
			content+="</tr>";
		});
	}
	content+="</tr></tbody>";
	var table = columns+content;
	if(content != "<tbody></tr></tbody>") {
		$("#incomeDataGrid").empty().html(table);
	}else {
		$("#incomeDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}
}

/**
 * 收入日通报下载
 */
function downIncomeData(){
	var incomeStartDate = $("#incomeStartDate").val();
	var incomeEndDate   = $("#incomeEndDate").val();
	var title;
	var day = incomeEndDate.substr(6);
	if(incomeStartDate==incomeEndDate){
		title = [	
		         	["云南联通自营厅实时收入日通报","","","","","","","","","","","","",""],
		         	["单位：户","本月截止：",day+" 日","-","","","","","","","","","",""],	
		         	["分公司","厅数","日收入","","月累计收入","","收入累计","单厅","累计环比(%)","","","定比","定比排名","年度日累计收入时序完成率"],
		         	["","","移动网","宽带","移动网","宽带","","","小计","移动网","宽带","","",""]
		         ];
	}else{
		title=[
				["分公司","厅数","月累计","","单厅","","累计环比",""],
				["","","移动网","宽带","移动网","宽带","移动网","宽带"]
		       ];
	}
	var sql = getIncomSql();
	//var title=[["账期","地市名称","营服名称","渠道编码","渠道名称","BSS发展编码","直销礼包编码","HR编码","直销人/渠道经理","用户编码","用户号码","网别","入网时间"]];
	showtext = "自营厅实时收入日通报-("+incomeStartDate+"~"+incomeEndDate+")";
	downloadExcel(sql,title,showtext);
}
/**
 * 获得收入的表头
 * @returns {String}
 */
function getIncomColumns(){
	var incomeStartDate = $("#incomeStartDate").val();
	var incomeEndDate   = $("#incomeEndDate").val();
	var columns;
	if(incomeStartDate==incomeEndDate){
		var day = incomeEndDate.substr(6);
		$("#incomeDataBarSpan").empty().text(day);
		$("#incomeDataBar").show();
		columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>分公司</th>" +
					"<th rowspan='2'>厅数</th>" +
					"<th colspan='2'>日收入</th>" +
					"<th colspan='2'>月累计收入</th>" +
					"<th rowspan='2'>收入累计</th>" +
					"<th rowspan='2'>单厅</th>" +
					"<th colspan='3'>累计环比(%)</th>" +
					"<th rowspan='2'>定比</th>" +
					"<th rowspan='2'>定比排名</th>" +
					"<th rowspan='2'>年度日累计收入时序完成率</th>" +
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

/**
 * 获得收入的sql
 * @returns {String}
 */
function getIncomSql(){
	var incomeStartDate = $("#incomeStartDate").val();
	var incomeEndDate   = $("#incomeEndDate").val();
	var incomeOpeType   = $("#incomeOpeType").val();
	var incomeChnlType  = $("#incomeChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var sql ="";
	var where="";
	//条件
	if(""!=incomeChnlType){
		where+=" AND CHNL_TYPE  ='"+incomeChnlType+"' ";
	}
	if(""!=incomeOpeType){
		where+=" AND OPERATE_TYPE  ='"+incomeOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	if(incomeStartDate==incomeEndDate){
		sql="SELECT                                                                                                                                                "+
		"       T.GROUP_ID_1_NAME,                                                                                                                                          "+
		"       T.BUS_COUNT,                                                                                                                                                "+
		"       T.THIS_YW_DAY_SR,                                                                                                                                           "+
		"       T.THIS_NET_DAY_SR,                                                                                                                                          "+
		"       T.THIS_YW_MON_SR,                                                                                                                                           "+
		"       T.THIS_NET_MON_SR,                                                                                                                                          "+
		"       T.THIS_ALL_MON_SR,                                                                                                                                          "+
		"       T.DT_ALL_SR,                                                                                                                                                "+
		"       T.LJ_ALL_SR_RATE,                                                                                                                                           "+
		"       T.LJ_YW_SR_RATE,                                                                                                                                            "+
		"       T.LJ_NET_SR_RATE,                                                                                                                                           "+
		"       T.ALL_DB,                                                                                                                                                   "+
		"       T.HB_RANK,                                                                                                                                                  "+
		"       T.SXWC_RATE                                                                                                                                                 "+
		"FROM (                                                                                                                                                             "+
		"        SELECT T.DEAL_DATE,                                                                                                                                        "+
		"               T.GROUP_ID_1_NAME,                                                                                                                                  "+
		"               BUS_COUNT,                                                                                                                                          "+
		"               T.THIS_YW_DAY_SR,                                                                                                                                   "+
		"               T.THIS_NET_DAY_SR,                                                                                                                                  "+
		"               T.THIS_YW_MON_SR,                                                                                                                                   "+
		"               T.THIS_NET_MON_SR,                                                                                                                                  "+
		"               T.THIS_ALL_MON_SR,                                                                                                                                  "+
		"               T.DT_ALL_SR,                                                                                                                                        "+
		"               T.LJ_ALL_SR_RATE,                                                                                                                                   "+
		"               T.LJ_YW_SR_RATE,                                                                                                                                    "+
		"               T.LJ_NET_SR_RATE,                                                                                                                                   "+
		"               T.ALL_DB,                                                                                                                                           "+
		"               CASE WHEN GROUP_ID_1_NAME='全省'                                                                                                                    "+
		"                    THEN 0                                                                                                                                         "+
		"                    ELSE ROW_NUMBER() OVER (PARTITION BY T.DEAL_DATE,T.GROUP_LEVEL ORDER BY T.ALL_DB1 DESC) END HB_RANK ,                                          "+
		"              T.SXWC_RATE                                                                                                                                          "+
		"        FROM(                                                                                                                                                      "+
		"        SELECT T.DEAL_DATE,  " +
		"               T.GROUP_LEVEL,                                                                                                                                      "+//
		"               T.GROUP_ID_1_NAME,                                                                                                                                  "+
		"               BUS_COUNT,                                                                                                                                          "+
		"               T.THIS_YW_DAY_SR,                                                                                                                                   "+
		"               T.THIS_NET_DAY_SR,                                                                                                                                  "+
		"               T.THIS_YW_MON_SR,                                                                                                                                   "+
		"               T.THIS_NET_MON_SR,                                                                                                                                  "+
		"               T.THIS_ALL_MON_SR,                                                                                                                                  "+
		"               T.DT_ALL_SR,                                                                                                                                        "+
		"               T.LJ_ALL_SR_RATE,                                                                                                                                   "+
		"               T.LJ_YW_SR_RATE,                                                                                                                                    "+
		"               T.LJ_NET_SR_RATE,                                                                                                                                   "+
		"               ROUND(CASE WHEN T3.LAST_SEASON_SR<>0                                                                                                                "+
		"                                          THEN (T.THIS_ALL_MON_SR-T3.LAST_SEASON_SR)*100/T3.LAST_SEASON_SR                                                         "+
		"                                          ELSE 0 END ,2)  ALL_DB1,                                                                                                 "+
		"               PODS.GET_RADIX_POINT(CASE WHEN T3.LAST_SEASON_SR<>0                                                                                                 "+
		"                                          THEN (T.THIS_ALL_MON_SR-T3.LAST_SEASON_SR)*100/T3.LAST_SEASON_SR                                                         "+
		"                                          ELSE 0 END ||'%',2)  ALL_DB,                                                                                             "+
		"               T.HB_RANK,                                                                                                                                          "+
		"               PODS.GET_RADIX_POINT((T2.YEAR_LJ_SR /                                                                                                               "+
		"                                    (T1.SR_AVG_YEAR *                                                                                                              "+
		"                                    ((TO_DATE(T.DEAL_DATE, 'YYYYMMDD') -                                                                                           "+
		"                                    TO_DATE(SUBSTR(T.DEAL_DATE, 1, 4) || '0101',                                                                                   "+
		"                                                'YYYYMMDD')) + 1))) * 100 || '%',                                                                                  "+
		"                                    2) SXWC_RATE                                                                                                                   "+
		"          FROM (SELECT '全省' GROUP_ID_1_NAME,                                                                                                                     "+
		"                       DEAL_DATE,  " +
		"                      '' GROUP_LEVEL,"+                                                                                                                                
		"                       COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                                     "+
		"                       NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                                                                     "+
		"                       NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                                                                   "+
		"                       NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                                                                    "+
		"                       NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                                                                                  "+
		"                       NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                                                                       "+
		"                       NVL(SUM(S1_LJ_SR), 0) S1_LJ_SR,                                                                                                             "+
		"                       NVL(SUM(S2_LJ_SR), 0) S2_LJ_SR,                                                                                                             "+
		"                       NVL(SUM(S3_LJ_SR), 0) S3_LJ_SR,                                                                                                             "+
		"                       NVL(SUM(S4_LJ_SR), 0) S4_LJ_SR,                                                                                                             "+
		"                       NVL(SUM(YEAR_LJ_SR), 0) YEAR_LJ_SR,                                                                                                         "+
		"                       CASE                                                                                                                                        "+
		"                         WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                               "+
		"                          ROUND((NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0)) /                                                                           "+
		"                                COUNT(DISTINCT HQ_CHAN_CODE),                                                                                                      "+
		"                                3)                                                                                                                                 "+
		"                         ELSE                                                                                                                                      "+
		"                          0                                                                                                                                        "+
		"                       END DT_ALL_SR,                                                                                                                              "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                   "+
		"                                              WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                                                                             "+
		"                                               (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /                                                     "+
		"                                               NVL(SUM(LAST_ALL_SR1), 0)                                                                                           "+
		"                                              ELSE                                                                                                                 "+
		"                                               0                                                                                                                   "+
		"                                            END || '%',                                                                                                            "+
		"                                            2) LJ_ALL_SR_RATE,                                                                                                     "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                   "+
		"                                              WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                                                                              "+
		"                                               (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /                                                       "+
		"                                               NVL(SUM(LAST_YW_SR1), 0)                                                                                            "+
		"                                              ELSE                                                                                                                 "+
		"                                               0                                                                                                                   "+
		"                                            END || '%',                                                                                                            "+
		"                                            2) LJ_YW_SR_RATE,                                                                                                      "+
		"                       PODS.GET_RADIX_POINT(CASE                                                                                                                   "+
		"                                              WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                                                                             "+
		"                                               (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /                                                     "+
		"                                               NVL(SUM(LAST_NET_SR1), 0)                                                                                           "+
		"                                              ELSE                                                                                                                 "+
		"                                               0                                                                                                                   "+
		"                                            END || '%',                                                                                                            "+
		"                                            2) LJ_NET_SR_RATE,                                                                                                     "+
		"                       0 HB_RANK                                                                                                                                   "+
		"                  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                            "+
		"                 WHERE DEAL_DATE = '"+incomeStartDate+"'                                                                                                           "+
		                  where+
		"                 GROUP BY DEAL_DATE                                                                                                                                "+
		"                UNION ALL                                                                                                                                          "+
		"                SELECT GROUP_ID_1_NAME,                                                                                                                            "+
		"                       DEAL_DATE, " +
		"                       '1' GROUP_LEVEL,                                                                                                                            "+//
		"                       BUS_COUNT,                                                                                                                                  "+
		"                       THIS_YW_DAY_SR,                                                                                                                             "+
		"                       THIS_NET_DAY_SR,                                                                                                                            "+
		"                       THIS_YW_MON_SR,                                                                                                                             "+
		"                       THIS_NET_MON_SR,                                                                                                                            "+
		"                       THIS_ALL_MON_SR,                                                                                                                            "+
		"                       S1_LJ_SR,                                                                                                                                   "+
		"                       S2_LJ_SR,                                                                                                                                   "+
		"                       S3_LJ_SR,                                                                                                                                   "+
		"                       S4_LJ_SR,                                                                                                                                   "+
		"                       YEAR_LJ_SR,                                                                                                                                 "+
		"                       DT_ALL_SR,                                                                                                                                  "+
		"                       LJ_ALL_SR_RATE,                                                                                                                             "+
		"                       LJ_YW_SR_RATE,                                                                                                                              "+
		"                       LJ_NET_SR_RATE,                                                                                                                             "+
		"                       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(LJ_ALL_SR_RATE, '%', '')) DESC, THIS_ALL_MON_SR DESC) HB_RANK          "+
		"                  FROM (SELECT GROUP_ID_1_NAME,                                                                                                                    "+
		"                               DEAL_DATE,                                                                                                                          "+
		"                               GROUP_ID_0,                                                                                                                         "+
		"                               COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                             "+
		"                               NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                                                             "+
		"                               NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                                                           "+
		"                               NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                                                            "+
		"                               NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                                                                          "+
		"                               NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                                                               "+
		"                               NVL(SUM(S1_LJ_SR), 0) S1_LJ_SR,                                                                                                     "+
		"                               NVL(SUM(S2_LJ_SR), 0) S2_LJ_SR,                                                                                                     "+
		"                               NVL(SUM(S3_LJ_SR), 0) S3_LJ_SR,                                                                                                     "+
		"                               NVL(SUM(S4_LJ_SR), 0) S4_LJ_SR,                                                                                                     "+
		"                               NVL(SUM(YEAR_LJ_SR), 0) YEAR_LJ_SR,                                                                                                 "+
		"                               CASE                                                                                                                                "+
		"                                 WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                       "+
		"                                  ROUND((NVL(SUM(THIS_YW_SR1), 0) +                                                                                                "+
		"                                        NVL(SUM(THIS_NET_SR1), 0)) /                                                                                               "+
		"                                        COUNT(DISTINCT HQ_CHAN_CODE),                                                                                              "+
		"                                        3)                                                                                                                         "+
		"                                 ELSE                                                                                                                              "+
		"                                  0                                                                                                                                "+
		"                               END DT_ALL_SR,                                                                                                                      "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                           "+
		"                                                      WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                                                                     "+
		"                                                       (NVL(SUM(THIS_ALL_SR1), 0) -                                                                                "+
		"                                                       NVL(SUM(LAST_ALL_SR1), 0)) * 100 /                                                                          "+
		"                                                       NVL(SUM(LAST_ALL_SR1), 0)                                                                                   "+
		"                                                      ELSE                                                                                                         "+
		"                                                       0                                                                                                           "+
		"                                                    END || '%',                                                                                                    "+
		"                                                    2) LJ_ALL_SR_RATE,                                                                                             "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                           "+
		"                                                      WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                                                                      "+
		"                                                       (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /                                               "+
		"                                                       NVL(SUM(LAST_YW_SR1), 0)                                                                                    "+
		"                                                      ELSE                                                                                                         "+
		"                                                       0                                                                                                           "+
		"                                                    END || '%',                                                                                                    "+
		"                                                    2) LJ_YW_SR_RATE,                                                                                              "+
		"                               PODS.GET_RADIX_POINT(CASE                                                                                                           "+
		"                                                      WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                                                                     "+
		"                                                       (NVL(SUM(THIS_NET_SR1), 0) -                                                                                "+
		"                                                       NVL(SUM(LAST_NET_SR1), 0)) * 100 /                                                                          "+
		"                                                       NVL(SUM(LAST_NET_SR1), 0)                                                                                   "+
		"                                                      ELSE                                                                                                         "+
		"                                                       0                                                                                                           "+
		"                                                    END || '%',                                                                                                    "+
		"                                                    2) LJ_NET_SR_RATE                                                                                              "+
		"                          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                    "+
		"                         WHERE DEAL_DATE = '"+incomeStartDate+"'                                                                                                   "+
		                              where+
		"                         GROUP BY GROUP_ID_0, GROUP_ID_1_NAME, DEAL_DATE)) T                                                                                       "+
		"          JOIN PCDE.TB_CDE_BUS_HALL_TARGET T1                                                                                                                      "+
		"            ON (T.GROUP_ID_1_NAME = T1.GROUP_ID_1_NAME)                                                                                                            "+
		"          LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '全省') GROUP_ID_1_NAME,                                                                                          "+
		"                            NVL(SUM(THIS_YW_SR), 0) + NVL(SUM(THIS_NET_SR), 0) YEAR_LJ_SR                                                                          "+
		"                       FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                       "+
		"                      WHERE DEAL_DATE LIKE '"+getYear(incomeStartDate)+"%'                                                                                         "+
		"                        AND DEAL_DATE <= '"+incomeStartDate+"'                                                                                                    "+
		                          where+
		"                      GROUP BY GROUPING SETS(GROUP_ID_0,(GROUP_ID_0, GROUP_ID_1_NAME))) T2                                                                         "+
		"            ON (T2.GROUP_ID_1_NAME = T.GROUP_ID_1_NAME)                                                                                                            "+
		"          LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '全省') GROUP_ID_1_NAME,                                                                                          "+
		"                            ROUND((NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0))/3,3) LAST_SEASON_SR                                                                    "+
		"                       FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                       "+
		"      WHERE DEAL_DATE IN (SELECT * FROM TABLE (PMRT.LAST_QUAR_DEAL1("+incomeStartDate+")))"               +
		                         where+
		"                      GROUP BY GROUPING SETS(GROUP_ID_0,(GROUP_ID_0, GROUP_ID_1_NAME))) T3                                                                         "+
		"            ON (T3.GROUP_ID_1_NAME = T.GROUP_ID_1_NAME)                                                                                                            "+
		"         ORDER BY HB_RANK                                                                                                                                          "+
		"        )T                                                                                                                                                         "+
		")T ORDER BY HB_RANK                                                                                                                                                ";
	}else{
		sql=	" SELECT                                                                                              "+
				"       NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME1                                                   "+
				"       ,COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT1                                                      "+
				"      ,NVL(SUM(THIS_YW_SR),0) THIS_YW_MON_SR                                                         "+
				"      ,NVL(SUM(THIS_NET_SR),0) THIS_NET_MON_SR                                                       "+
				"      ,CASE WHEN COUNT(DISTINCT HQ_CHAN_CODE)<>0 THEN                                                "+
				"                      ROUND(NVL(SUM(THIS_YW_SR),0)/COUNT(DISTINCT HQ_CHAN_CODE),3)   				  "+
				"                                         ELSE 0 END DT_YW_SR                                         "+
				"      ,CASE WHEN COUNT(DISTINCT HQ_CHAN_CODE)<>0 THEN                                                "+
				"                       ROUND(NVL(SUM(THIS_NET_SR),0)/COUNT(DISTINCT HQ_CHAN_CODE),3)  				  "+
				"                                         ELSE 0 END DT_NET_SR                                        "+
				"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_SR),0)<>0                                      "+
				"            THEN (NVL(SUM(THIS_YW_SR),0)-NVL(SUM(LAST_YW_SR),0))*100/NVL(SUM(LAST_YW_SR),0)         "+
				"            ELSE 0                                                                                   "+
				"            END  || '%',2) LJ_YW_SR_RATE                                                             "+
				"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_SR),0)<>0                                     "+
				"            THEN (NVL(SUM(THIS_NET_SR),0)-NVL(SUM(LAST_NET_SR),0))*100/NVL(SUM(LAST_NET_SR),0)      "+
				"            ELSE 0                                                                                   "+
				"            END  || '%',2) LJ_NET_SR_RATE                                                            "+
				" FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE BETWEEN  '"+incomeStartDate+"' AND '"+incomeEndDate+"'"+
				where+
				" GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))"+
				" ORDER BY THIS_YW_MON_SR "; 
	} 
	return sql;
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

function getYear(incomeStartDate){
	return incomeStartDate.substr(0,4);
}
