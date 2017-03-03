/**
 * @author xuxuejiang
 * 发展收入终端日通报js
 */	
$(function() {
		//发展日通报
		queryDevData();
		$("#DevSearchBtn").click(function(){
			//$("#devDataBar").css({"dispaly":"none"});
			$("#devDataBar").hide();
			queryDevData();
		});
		$("#DevDownBtn").click(function(){
			downDevData();
		});
		//收入日通报
		queryIncomData();
		$("#IncomeSearchBtn").click(function(){
			$("#incomeDataBar").hide();
			queryIncomData();
		});
		$("#IncomeDownBtn").click(function(){
			downIncomeData();
		});
		//终端日通报
		queryTerminalData();
		$("#TermnalSearchBtn").click(function(){
			$("#termnalDataBar").hide();
			queryTerminalData();
		});
		$("#TermnalDownBtn").click(function(){
			downTermnalData();
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
	if(content != "") {
		$("#devDataGrod").empty().html(table);
	}else {
		$("#devDataGrod").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
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
				["云南联通自营厅新增发展日通报","","","","","","","","","","","",""],
				["单位：户","本月截止：",day+" 日","-","","","","","","","","",""],
				["分公司","厅数","日发展","","月累计","","发展累计","单厅","累计环比(%)","","","环比排名","季度日累计发展时序完成率"],
				["","","移动网","宽带","移动网","宽带","","","小计","移动网","宽带","",""]
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
	var DevOpeType   = $("#DevOpeType").val();
	var DevChnlType  = $("#DevChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var sql = "";
	var where="";
	//条件
	if(""!=DevChnlType){
		where+=" AND CHNL_TYPE  ='"+DevChnlType+"' ";
	}
	if(""!=DevOpeType){
		where+=" AND OPERATE_TYPE  ='"+DevOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	
	if(devStartDate==devEndDate){
		sql="SELECT T.GROUP_ID_1_NAME                                                                                                                       "+
		"      ,BUS_COUNT                                                                                                                               "+
		"      ,T.THIS_YW_DAY_DEV                                                                                                                       "+
		"      ,T.THIS_NET_DAY_DEV                                                                                                                      "+
		"      ,T.THIS_YW_MON_DEV                                                                                                                       "+
		"      ,T.THIS_NET_MON_DEV                                                                                                                      "+
		"      ,T.THIS_ALL_MON_DEV                                                                                                                      "+
		"      ,T.DT_ALL_DEV                                                                                                                            "+
		"      ,T.LJ_ALL_DEV_RATE                                                                                                                       "+
		"      ,T.LJ_YW_DEV_RATE                                                                                                                        "+
		"      ,T.LJ_NET_DEV_RATE                                                                                                                       "+
		"      ,T.HB_RANK                                                                                                                               "+
		"      ,PODS.GET_RADIX_POINT((CASE WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD')                  "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0331','YYYYMMDD')                      "+
		"                          THEN S1_LJ_DEV/(T1.DEV_AVG_DAYS1*                                                                                    "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD'))+1)   "+
		"                                          )                                                                                                    "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD')                                       "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0630','YYYYMMDD')                      "+
		"                          THEN S2_LJ_DEV /(T1.DEV_AVG_DAYS2*                                                                                   "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD'))+1)   "+                  
		"                                          )                                                                                                    "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD')                                       "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0930','YYYYMMDD')                      "+
		"                          THEN S3_LJ_DEV/(T1.DEV_AVG_DAYS3*                                                                                    "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD'))+1)   "+
		"                                          )                                                                                                    "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD')                                       "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1231','YYYYMMDD')                      "+
		"                          THEN S4_LJ_DEV/(T1.DEV_AVG_DAYS4*                                                                                    "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD'))+1)   "+
		"                                          )                                                                                                    "+
		"            END)*100 ||'%' ,2) SXWC_RATE                                                                                                       "+
		"            FROM(                                                                                                                              "+
		"   SELECT '全省' GROUP_ID_1_NAME,                                                                                                              "+
		"          DEAL_DATE,                                                                                                                           "+
		"       COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                                 "+
		"       NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                                                               "+
		"       NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                                                             "+
		"       NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                                                              "+
		"       NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                                                            "+
		"       NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                                                                "+
		"       NVL(SUM(S1_LJ_DEV), 0) S1_LJ_DEV,                                                                                                       "+
		"       NVL(SUM(S2_LJ_DEV), 0) S2_LJ_DEV,                                                                                                       "+
		"       NVL(SUM(S3_LJ_DEV), 0) S3_LJ_DEV,                                                                                                       "+
		"       NVL(SUM(S4_LJ_DEV), 0) S4_LJ_DEV,                                                                                                       "+
		"       CASE                                                                                                                                    "+
		"         WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                           "+
		"          ROUND(NVL(SUM(THIS_ALL_DEV1), 0) / COUNT(DISTINCT HQ_CHAN_CODE), 0)                                                                  "+
		"         ELSE                                                                                                                                  "+
		"          0                                                                                                                                    "+
		"       END DT_ALL_DEV,                                                                                                                         "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                               "+
		"                              WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                                                        "+
		"                               (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /                                               "+
		"                               NVL(SUM(LAST_ALL_DEV1), 0)                                                                                      "+
		"                              ELSE                                                                                                             "+
		"                               0                                                                                                               "+
		"                            END || '%',                                                                                                        "+
		"                            2) LJ_ALL_DEV_RATE,                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                               "+
		"                              WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                                                         "+
		"                               (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /                                                 "+
		"                               NVL(SUM(LAST_YW_DEV1), 0)                                                                                       "+
		"                              ELSE                                                                                                             "+
		"                               0                                                                                                               "+
		"                            END || '%',                                                                                                        "+
		"                            2) LJ_YW_DEV_RATE,                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                               "+
		"                              WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                                                        "+
		"                               (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /                                               "+
		"                               NVL(SUM(LAST_NET_DEV1), 0)                                                                                      "+
		"                              ELSE                                                                                                             "+
		"                               0                                                                                                               "+
		"                            END || '%',                                                                                                        "+
		"                            2) LJ_NET_DEV_RATE,                                                                                                "+
		"       0 HB_RANK                                                                                                                               "+
		"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                        "+
		" WHERE DEAL_DATE = '"+devStartDate+"'                                                                                                          "+
		                   where +
		" GROUP BY DEAL_DATE                                                                                                                            "+
		"UNION ALL                                                                                                                                      "+
		"SELECT GROUP_ID_1_NAME,                                                                                                                        "+
		"       DEAL_DATE,                                                                                                                              "+
		"       BUS_COUNT,                                                                                                                              "+
		"       THIS_YW_DAY_DEV,                                                                                                                        "+
		"       THIS_NET_DAY_DEV,                                                                                                                       "+
		"       THIS_YW_MON_DEV,                                                                                                                        "+
		"       THIS_NET_MON_DEV,                                                                                                                       "+
		"       THIS_ALL_MON_DEV,                                                                                                                       "+
		"       S1_LJ_DEV,                                                                                                                              "+
		"       S2_LJ_DEV,                                                                                                                              "+
		"       S3_LJ_DEV,                                                                                                                              "+
		"       S4_LJ_DEV,                                                                                                                              "+
		"       DT_ALL_DEV,                                                                                                                             "+
		"       LJ_ALL_DEV_RATE,                                                                                                                        "+
		"       LJ_YW_DEV_RATE,                                                                                                                         "+
		"       LJ_NET_DEV_RATE,                                                                                                                        "+
		"       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(LJ_ALL_DEV_RATE, '%', '')) DESC, THIS_ALL_MON_DEV DESC) HB_RANK    "+
		"  FROM (SELECT GROUP_ID_0,                                                                                                                     "+
		"               DEAL_DATE,                                                                                                                      "+
		"               GROUP_ID_1_NAME GROUP_ID_1_NAME,                                                                                                "+
		"               COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                         "+
		"               NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                                                       "+
		"               NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                                                     "+
		"               NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                                                      "+
		"               NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                                                    "+
		"               NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                                                        "+
		"               NVL(SUM(S1_LJ_DEV), 0) S1_LJ_DEV,                                                                                               "+
		"               NVL(SUM(S2_LJ_DEV), 0) S2_LJ_DEV,                                                                                               "+
		"               NVL(SUM(S3_LJ_DEV), 0) S3_LJ_DEV,                                                                                               "+
		"               NVL(SUM(S4_LJ_DEV), 0) S4_LJ_DEV,                                                                                               "+
		"               CASE                                                                                                                            "+
		"                 WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                   "+
		"                  ROUND(NVL(SUM(THIS_ALL_DEV1), 0) /                                                                                           "+
		"                        COUNT(DISTINCT HQ_CHAN_CODE),                                                                                          "+
		"                        0)                                                                                                                     "+
		"                 ELSE                                                                                                                          "+
		"                  0                                                                                                                            "+
		"               END DT_ALL_DEV,                                                                                                                 "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                       "+
		"                                      WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                                                "+
		"                                       (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /                                       "+
		"                                       NVL(SUM(LAST_ALL_DEV1), 0)                                                                              "+
		"                                      ELSE                                                                                                     "+
		"                                       0                                                                                                       "+
		"                                    END || '%',                                                                                                "+
		"                                    2) LJ_ALL_DEV_RATE,                                                                                        "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                       "+
		"                                      WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                                                 "+
		"                                       (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /                                         "+
		"                                       NVL(SUM(LAST_YW_DEV1), 0)                                                                               "+
		"                                      ELSE                                                                                                     "+
		"                                       0                                                                                                       "+
		"                                    END || '%',                                                                                                "+
		"                                    2) LJ_YW_DEV_RATE,                                                                                         "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                       "+
		"                                      WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                                                "+
		"                                       (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /                                       "+
		"                                       NVL(SUM(LAST_NET_DEV1), 0)                                                                              "+
		"                                      ELSE                                                                                                     "+
		"                                       0                                                                                                       "+
		"                                    END || '%',                                                                                                "+
		"                                    2) LJ_NET_DEV_RATE                                                                                         "+
		"                                                                                                                                               "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                "+
		"         WHERE DEAL_DATE = '"+devStartDate+"'"+                                                                                                 
		                     where       +
		"         GROUP BY GROUP_ID_0, GROUP_ID_1_NAME,DEAL_DATE)                                                                                       "+
		")T                                                                                                                                             "+
		"JOIN PCDE.TB_CDE_BUS_HALL_TARGET  T1                                                                                                           "+
		"ON(T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                                                       "+
		"ORDER BY HB_RANK                                                                                                                               ";
	}else{
		sql=	"SELECT                                                                                        		  "+
				"      NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                    "+
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
		/*$("#devDataBarSpan").empty().text(day);
		$("#devDataBar").css({"dispaly":"block"});*/
		$("#devDataBarSpan").empty().text(day);
		//$("#devDataBar").css({"dispaly":"block"});
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
					"<th rowspan='2'>环比排名</th>" +
					"<th rowspan='2'>季度日累计发展时序完成率</th>" +
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
 * 收入日通报
 */
function queryIncomData(){
	var IncomeStartDate = $("#IncomeStartDate").val();
	var IncomeEndDate   = $("#IncomeEndDate").val();
	
	//获得列
	var columns = getIncomColumns();
	//获得sql
	var sql = getIncomSql();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	var content="<tbody>";
	if(IncomeStartDate==IncomeEndDate){
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
	if(content != "") {
		$("#incomeDataGrid").empty().html(table);
	}else {
		$("#incomeDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}
}

/**
 * 收入日通报下载
 */
function downIncomeData(){
	var IncomeStartDate = $("#IncomeStartDate").val();
	var IncomeEndDate   = $("#IncomeEndDate").val();
	var title;
	var day = IncomeEndDate.substr(6);
	if(IncomeStartDate==IncomeEndDate){
		title = [	
		         	["云南联通自营厅实时收入日通报","","","","","","","","","","","",""],
		         	["单位：户","本月截止：",day+" 日","-","","","","","","","","",""],	
		         	["分公司","厅数","日收入","","月累计收入","","收入累计","单厅","累计环比(%)","","","环比排名","季度日累计收入时序完成率"],
		         	["","","移动网","宽带","移动网","宽带","","","小计","移动网","宽带","",""]
		         ];
	}else{
		title=[
				["分公司","厅数","月累计","","单厅","","累计环比",""],
				["","","移动网","宽带","移动网","宽带","移动网","宽带"]
		       ];
	}
	var sql = getIncomSql();
	//var title=[["账期","地市名称","营服名称","渠道编码","渠道名称","BSS发展编码","直销礼包编码","HR编码","直销人/渠道经理","用户编码","用户号码","网别","入网时间"]];
	showtext = "云南联通自营厅实时收入日通报-("+IncomeStartDate+"~"+IncomeEndDate+")";
	downloadExcel(sql,title,showtext);
}
/**
 * 获得收入的表头
 * @returns {String}
 */
function getIncomColumns(){
	var IncomeStartDate = $("#IncomeStartDate").val();
	var IncomeEndDate   = $("#IncomeEndDate").val();
	var columns;
	if(IncomeStartDate==IncomeEndDate){
		var day = IncomeEndDate.substr(6);
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
					"<th rowspan='2'>环比排名</th>" +
					"<th rowspan='2'>季度日累计收入时序完成率</th>" +
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
	var IncomeStartDate = $("#IncomeStartDate").val();
	var IncomeEndDate   = $("#IncomeEndDate").val();
	var IncomeOpeType   = $("#IncomeOpeType").val();
	var IncomeChnlType  = $("#IncomeChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var sql ="";
	var where="";
	//条件
	if(""!=IncomeChnlType){
		where+=" AND CHNL_TYPE  ='"+IncomeChnlType+"' ";
	}
	if(""!=IncomeOpeType){
		where+=" AND OPERATE_TYPE  ='"+IncomeOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	if(IncomeStartDate==IncomeEndDate){
		sql="SELECT T.GROUP_ID_1_NAME                                                                                                                             "+
		"      ,BUS_COUNT                                                                                                                                     "+
		"      ,T.THIS_YW_DAY_SR                                                                                                                              "+
		"      ,T.THIS_NET_DAY_SR                                                                                                                             "+
		"      ,T.THIS_YW_MON_SR                                                                                                                              "+
		"      ,T.THIS_NET_MON_SR                                                                                                                             "+
		"      ,T.THIS_ALL_MON_SR                                                                                                                             "+
		"      ,T.DT_ALL_SR                                                                                                                                   "+
		"      ,T.LJ_ALL_SR_RATE                                                                                                                              "+
		"      ,T.LJ_YW_SR_RATE                                                                                                                               "+
		"      ,T.LJ_NET_SR_RATE                                                                                                                              "+
		"      ,T.HB_RANK                                                                                                                                     "+
		"      ,PODS.GET_RADIX_POINT((CASE WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD')                        "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0331','YYYYMMDD')                            "+
		"                          THEN S1_LJ_SR/(T1.SR_AVG_DAYS1*                                                                                            "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD'))+1)         "+
		"                                          )                                                                                                          "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD')                                             "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0630','YYYYMMDD')                            "+
		"                          THEN S2_LJ_SR /(T1.SR_AVG_DAYS2*                                                                                           "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD'))+1)         "+                   
		"                                          )                                                                                                          "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD')                                             "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0930','YYYYMMDD')                            "+
		"                          THEN S3_LJ_SR/(T1.SR_AVG_DAYS3*                                                                                            "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD'))+1)         "+
		"                                          )                                                                                                          "+
		"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD')                                             "+
		"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1231','YYYYMMDD')                            "+
		"                          THEN S4_LJ_SR/(T1.SR_AVG_DAYS4*                                                                                            "+
		"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD'))+1)         "+
		"                                          )                                                                                                          "+
		"            END)*100 ||'%' ,2) SXWC_RATE                                                                                                             "+
		"FROM (                                                                                                                                               "+
		"SELECT '全省' GROUP_ID_1_NAME,                                                                                                                       "+
		"       DEAL_DATE,                                                                                                                                    "+
		"       COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                                       "+
		"       NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                                                                       "+
		"       NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                                                                     "+
		"       NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                                                                      "+
		"       NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                                                                                    "+
		"       NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                                                                         "+
		"       NVL(SUM(S1_LJ_SR), 0) S1_LJ_SR,                                                                                                               "+
		"       NVL(SUM(S2_LJ_SR), 0) S2_LJ_SR,                                                                                                               "+
		"       NVL(SUM(S3_LJ_SR), 0) S3_LJ_SR,                                                                                                               "+
		"       NVL(SUM(S4_LJ_SR), 0) S4_LJ_SR,                                                                                                               "+
		"       CASE                                                                                                                                          "+
		"         WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                                 "+
		"          ROUND((NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0)) /                                                                             "+
		"                COUNT(DISTINCT HQ_CHAN_CODE),                                                                                                        "+
		"                3)                                                                                                                                   "+
		"         ELSE                                                                                                                                        "+
		"          0                                                                                                                                          "+
		"       END DT_ALL_SR,                                                                                                                                "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                     "+
		"                              WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                                                                               "+
		"                               (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /                                                       "+
		"                               NVL(SUM(LAST_ALL_SR1), 0)                                                                                             "+
		"                              ELSE                                                                                                                   "+
		"                               0                                                                                                                     "+
		"                            END || '%',                                                                                                              "+
		"                            2) LJ_ALL_SR_RATE,                                                                                                       "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                     "+
		"                              WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                                                                                "+
		"                               (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /                                                         "+
		"                               NVL(SUM(LAST_YW_SR1), 0)                                                                                              "+
		"                              ELSE                                                                                                                   "+
		"                               0                                                                                                                     "+
		"                            END || '%',                                                                                                              "+
		"                            2) LJ_YW_SR_RATE,                                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                     "+
		"                              WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                                                                               "+
		"                               (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /                                                       "+
		"                               NVL(SUM(LAST_NET_SR1), 0)                                                                                             "+
		"                              ELSE                                                                                                                   "+
		"                               0                                                                                                                     "+
		"                            END || '%',                                                                                                              "+
		"                            2) LJ_NET_SR_RATE,                                                                                                       "+
		"       0 HB_RANK                                                                                                                                     "+
		"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                              "+
		" WHERE DEAL_DATE = '"+IncomeStartDate+"'                                                                                                             "+
		           where+
		" GROUP BY DEAL_DATE                                                                                                                                  "+
		"UNION ALL                                                                                                                                            "+
		"SELECT GROUP_ID_1_NAME,                                                                                                                              "+
		"       DEAL_DATE,                                                                                                                                    "+
		"       BUS_COUNT,                                                                                                                                    "+
		"       THIS_YW_DAY_SR,                                                                                                                               "+
		"       THIS_NET_DAY_SR,                                                                                                                              "+
		"       THIS_YW_MON_SR,                                                                                                                               "+
		"       THIS_NET_MON_SR,                                                                                                                              "+
		"       THIS_ALL_MON_SR,                                                                                                                              "+
		"       S1_LJ_SR,                                                                                                                                     "+
		"       S2_LJ_SR,                                                                                                                                     "+
		"       S3_LJ_SR,                                                                                                                                     "+
		"       S4_LJ_SR,                                                                                                                                     "+
		"       DT_ALL_SR,                                                                                                                                    "+
		"       LJ_ALL_SR_RATE,                                                                                                                               "+
		"       LJ_YW_SR_RATE,                                                                                                                                "+
		"       LJ_NET_SR_RATE,                                                                                                                               "+
		"       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(LJ_ALL_SR_RATE, '%', '')) DESC, THIS_ALL_MON_SR DESC) HB_RANK            "+
		"  FROM (SELECT GROUP_ID_1_NAME,                                                                                                                      "+
		"               DEAL_DATE,                                                                                                                            "+
		"               GROUP_ID_0,                                                                                                                           "+
		"               COUNT(DISTINCT HQ_CHAN_CODE) BUS_COUNT,                                                                                               "+
		"               NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                                                               "+
		"               NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                                                             "+
		"               NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                                                              "+
		"               NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                                                                            "+
		"               NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                                                                 "+
		"               NVL(SUM(S1_LJ_SR), 0) S1_LJ_SR,                                                                                                       "+
		"               NVL(SUM(S2_LJ_SR), 0) S2_LJ_SR,                                                                                                       "+
		"               NVL(SUM(S3_LJ_SR), 0) S3_LJ_SR,                                                                                                       "+
		"               NVL(SUM(S4_LJ_SR), 0) S4_LJ_SR,                                                                                                       "+
		"               CASE                                                                                                                                  "+
		"                 WHEN COUNT(DISTINCT HQ_CHAN_CODE) <> 0 THEN                                                                                         "+
		"                  ROUND((NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0)) /                                                                     "+
		"                        COUNT(DISTINCT HQ_CHAN_CODE),                                                                                                "+
		"                        3)                                                                                                                           "+
		"                 ELSE                                                                                                                                "+
		"                  0                                                                                                                                  "+
		"               END DT_ALL_SR,                                                                                                                        "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                             "+
		"                                      WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                                                                       "+
		"                                       (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /                                               "+
		"                                       NVL(SUM(LAST_ALL_SR1), 0)                                                                                     "+
		"                                      ELSE                                                                                                           "+
		"                                       0                                                                                                             "+
		"                                    END || '%',                                                                                                      "+
		"                                    2) LJ_ALL_SR_RATE,                                                                                               "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                             "+
		"                                      WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                                                                        "+
		"                                       (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /                                                 "+
		"                                       NVL(SUM(LAST_YW_SR1), 0)                                                                                      "+
		"                                      ELSE                                                                                                           "+
		"                                       0                                                                                                             "+
		"                                    END || '%',                                                                                                      "+
		"                                    2) LJ_YW_SR_RATE,                                                                                                "+
		"               PODS.GET_RADIX_POINT(CASE                                                                                                             "+
		"                                      WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                                                                       "+
		"                                       (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /                                               "+
		"                                       NVL(SUM(LAST_NET_SR1), 0)                                                                                     "+
		"                                      ELSE                                                                                                           "+
		"                                       0                                                                                                             "+
		"                                    END || '%',                                                                                                      "+
		"                                    2) LJ_NET_SR_RATE                                                                                                "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                                      "+
		"         WHERE DEAL_DATE = '"+IncomeStartDate+"'                                                                                                     "+
		                       where+
		"         GROUP BY GROUP_ID_0, GROUP_ID_1_NAME,DEAL_DATE)                                                                                             "+
		")T                                                                                                                                                   "+
		"JOIN PCDE.TB_CDE_BUS_HALL_TARGET  T1                                                                                                                 "+
		"ON(T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                                                             "+
		"ORDER BY HB_RANK                                                                                                                                     ";

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
				" FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE BETWEEN  '"+IncomeStartDate+"' AND '"+IncomeEndDate+"'"+
				where+
				" GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))"+
				" ORDER BY THIS_YW_MON_SR ";
	} 
	return sql;
}

/**
 * 终端日通报
 */
function queryTerminalData(){
	var termnalStartDate = $("#termnalStartDate").val();
	var termnalEndDate   = $("#termnalEndDate").val();
	
	//获得列
	var columns = getTerminalColumns();
	//获得sql
	var sql = getTerminalSql();
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	
	var content="<tbody>";
	if(termnalStartDate==termnalEndDate){
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE1_DEV_DAY'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE1_DEV_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE3_DEV_DAY'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE3_DEV_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE_ALL_DAY'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE_ALL_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE_DT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_ALL'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_DT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['SXWC_RATE'])+"</td>"
			content+="</tr>";
		});
	}else{
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_COUNT'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE1_DEV_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE3_DEV_MON'])+"</td>"
				+"<td class='numberStyle background'>"+isNull(n['TYPE_ALL_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE_ALL'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_ALL'])+"</td>"
			content+="</tr>";
		});
	}

	content+="</tr></tbody>";
	var table = columns+content;
	if(content != "") {
		$("#termnalDataGridTable").empty().html(table);
	}else {
		$("#termnalDataGridTable").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
	}
}

/**
 * 终端日通报下载
 */
function downTermnalData(){
	var termnalStartDate = $("#termnalStartDate").val();
	var termnalEndDate   = $("#termnalEndDate").val();
	var title;
	var day = termnalEndDate.substr(6);
	if(termnalStartDate==termnalEndDate){
		title=[
		       	["云南联通自营厅终端销量日通报","","","","","","","","","","","",""],
				["单位：户","本月截止：",day+" 日","-","","","","","","","","",""],	
				["分公司","厅数","模式一","","模式三","","小计","","","累计环比（%）","","环比排名","季度日累计终端时序完成率"],
				["","","日发展","月累计","日发展","月累计","日发展","月累计","单厅","月累计","单厅","",""]
		       ];
	}else{
		title=[
				["分公司","厅数","模式一","模式三","小计","",""],
				["","","月累计","月累计 ","月累计  ","单厅","月累计环比"]
		       ];
	}
	var sql = getTerminalSql();
	//var title=[["账期","地市名称","营服名称","渠道编码","渠道名称","BSS发展编码","直销礼包编码","HR编码","直销人/渠道经理","用户编码","用户号码","网别","入网时间"]];
	showtext = "发展收入终端日通报(终端日通报)-("+termnalStartDate+"~"+termnalEndDate+")";
	downloadExcel(sql,title,showtext);
}

/**
 * 得到终端的表头
 * @returns {String}
 */
function getTerminalColumns(){
	var columns="";
	var termnalStartDate = $("#termnalStartDate").val();
	var termnalEndDate   = $("#termnalEndDate").val();
	var day = termnalEndDate.substr(6);
	if(termnalStartDate==termnalEndDate){
		$("#termnalDataBarSpan").empty().text(day);
		$("#termnalDataBar").show();
		columns="<thead>" +
					"<tr>" +
					"<th rowspan='2'>分公司</th>" +
					"<th rowspan='2'>厅数</th>" +
					"<th colspan='2'>模式一</th>" +
					"<th colspan='2'>模式三</th>" +
					"<th colspan='3'>小计</th>" +
					"<th colspan='2'>累计环比（%）</th>" +
					"<th rowspan='2'>环比排名</th>" +
					"<th rowspan='2'>季度日累计终端时序完成率</th>" +
				"</tr>" +
				"<tr>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
					"<th>单厅</th>" +
					"<th>月累计环比</th>" +
					"<th>单厅环比</th>" +
				"</tr>" +
				"</thead>";
	}else{
		columns="<thead>" +
					"<tr>" +
					"<th rowspan='2'>分公司</th>" +
					"<th rowspan='2'>厅数</th>" +
					"<th >模式一</th>" +
					"<th >模式三</th>" +
					"<th colspan='3'>小计</th>" +
				"</tr>" +
				"<tr>" +
					"<th>月累计</th>" +
					"<th>月累计</th>" +
					"<th>月累计</th>" +
					"<th>单厅</th>" +
					"<th>月累计环比</th>" +
					/*"<th>单厅环比</th>" +*/
				"</tr>" +
				"</thead>";
	}
	return columns;
}

/**
 * 获得终端的sql
 * @returns {String}
 */
function getTerminalSql(){
	var sql="";
	var termnalStartDate = $("#termnalStartDate").val();
	var termnalEndDate   = $("#termnalEndDate").val();
	var TermnalOpeType   = $("#TermnalOpeType").val();
	var TermnalChnlType  = $("#TermnalChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var where ="";
	if(""!=TermnalChnlType){
		where+=" AND CHNL_TYPE  ='"+TermnalChnlType+"' ";
	}
	if(""!=TermnalOpeType){
		where+=" AND OPERATE_TYPE  ='"+TermnalOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	if(termnalStartDate==termnalEndDate){
		sql+=
			"SELECT T.GROUP_ID_1_NAME                                                                                                                            "+
			"      ,T.BUS_COUNT                                                                                                                                  "+
			"      ,T.TYPE1_DEV_DAY                                                                                                                              "+
			"      ,T.TYPE1_DEV_MON                                                                                                                              "+
			"      ,T.TYPE3_DEV_DAY                                                                                                                              "+
			"      ,T.TYPE3_DEV_MON                                                                                                                              "+
			"      ,T.TYPE_ALL_DAY                                                                                                                               "+
			"      ,T.TYPE_ALL_MON                                                                                                                               "+
			"      ,T.TYPE_DT                                                                                                                                    "+
			"      ,T.HB_ALL                                                                                                                                     "+
			"      ,T.HB_DT                                                                                                                                      "+
			"      ,T.HB_RANK                                                                                                                                    "+
			"      ,PODS.GET_RADIX_POINT((CASE WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD')                       "+
			"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0331','YYYYMMDD')                           "+
			"                          THEN S1_LJ_ZD/(T1.ZD_AVG_DAYS1*                                                                                           "+
			"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0101','YYYYMMDD'))+1)        "+
			"                                          )                                                                                                         "+
			"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD')                                            "+
			"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0630','YYYYMMDD')                           "+
			"                          THEN S2_LJ_ZD /(T1.ZD_AVG_DAYS2*                                                                                          "+
			"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0401','YYYYMMDD'))+1)        "+              
			"                                          )                                                                                                         "+
			"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD')                                            "+
			"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0930','YYYYMMDD')                           "+
			"                          THEN S3_LJ_ZD/(T1.ZD_AVG_DAYS3*                                                                                           "+
			"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'0701','YYYYMMDD'))+1)        "+
			"                                          )                                                                                                         "+
			"             WHEN TO_DATE(T.DEAL_DATE,'YYYYMMDD') >= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD')                                            "+
			"                               AND TO_DATE(T.DEAL_DATE,'YYYYMMDD') <= TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1231','YYYYMMDD')                           "+
			"                          THEN S4_LJ_ZD/(T1.ZD_AVG_DAYS4*                                                                                           "+
			"                                                 ((TO_DATE( T.DEAL_DATE, 'YYYYMMDD')-TO_DATE(SUBSTR(T.DEAL_DATE,1,4)||'1001','YYYYMMDD'))+1)        "+
			"                                          )                                                                                                         "+
			"            END)*100 ||'%' ,2) SXWC_RATE                                                                                                            "+
			"FROM (                                                                                                                                              "+
			"SELECT '全省' GROUP_ID_1_NAME,                                                                                                                      "+
			"       DEAL_DATE,                                                                                                                                   "+
			"       COUNT(DISTINCT T1.HQ_CHAN_CODE) BUS_COUNT,                                                                                                   "+
			"       NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                                                                     "+
			"       NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                                                                                    "+
			"       NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                                                                     "+
			"       NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                                                                                    "+
			"       NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                                                                       "+
			"       NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                                                                      "+
			"       NVL(SUM(S1_LJ_ZD), 0) S1_LJ_ZD,                                                                                                              "+
			"       NVL(SUM(S2_LJ_ZD), 0) S2_LJ_ZD,                                                                                                              "+
			"       NVL(SUM(S3_LJ_ZD), 0) S3_LJ_ZD,                                                                                                              "+
			"       NVL(SUM(S4_LJ_ZD), 0) S4_LJ_ZD,                                                                                                              "+
			"       CASE                                                                                                                                         "+
			"         WHEN COUNT(DISTINCT T1.HQ_CHAN_CODE) <> 0 THEN                                                                                             "+
			"          ROUND(NVL(SUM(T1.TYPE_ALL1), 0) / COUNT(DISTINCT T1.HQ_CHAN_CODE),                                                                        "+
			"                0)                                                                                                                                  "+
			"         ELSE                                                                                                                                       "+
			"          0                                                                                                                                         "+
			"       END TYPE_DT,                                                                                                                                 "+
			"       PODS.GET_RADIX_POINT(CASE                                                                                                                    "+
			"                              WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                                                                              "+
			"                               (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 /                                                      "+
			"                               NVL(SUM(T1.TYPE_ALLL), 0)                                                                                            "+
			"                              ELSE                                                                                                                  "+
			"                               0                                                                                                                    "+
			"                            END || '%',                                                                                                             "+
			"                            2) HB_ALL,                                                                                                              "+
			"       PODS.GET_RADIX_POINT(CASE                                                                                                                    "+
			"         WHEN (CASE                                                                                                                                 "+
			"                WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                                  "+
			"                 ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                                  "+
			"                       SUM(T1.HALL_COUNTL))                                                                                                         "+
			"                ELSE                                                                                                                                "+
			"                 0                                                                                                                                  "+
			"              END) <> 0 THEN                                                                                                                        "+
			"          （(CASE                                                                                                                                   "+
			"              WHEN SUM(T1.HALL_COUNT) <> 0 THEN                                                                                                     "+
			"               ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                                    "+
			"                     SUM(T1.HALL_COUNT))                                                                                                            "+
			"              ELSE                                                                                                                                  "+
			"               0                                                                                                                                    "+
			"            END) - (CASE                                                                                                                            "+
			"                      WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                            "+
			"                       ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                            "+
			"                             SUM(T1.HALL_COUNTL))                                                                                                   "+
			"                      ELSE                                                                                                                          "+
			"                       0                                                                                                                            "+
			"                    END)) * 100 / (CASE                                                                                                             "+
			"           WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                                       "+
			"            ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                                       "+
			"                  SUM(T1.HALL_COUNTL))                                                                                                              "+
			"           ELSE                                                                                                                                     "+
			"            0                                                                                                                                       "+
			"         END) ELSE 0 END || '%',                                                                                                                    "+
			"       2) HB_DT, 0 HB_RANK                                                                                                                          "+
			"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                                                                          "+
			" WHERE T1.DEAL_DATE = '"+termnalStartDate+"'                                                                                                        "+
			          where+
			"   GROUP BY DEAL_DATE                                                                                                                               "+
			"UNION ALL                                                                                                                                           "+
			"SELECT GROUP_ID_1_NAME,                                                                                                                             "+
			"       DEAL_DATE,                                                                                                                                   "+
			"       BUS_COUNT,                                                                                                                                   "+
			"       TYPE1_DEV_DAY,                                                                                                                               "+
			"       TYPE1_DEV_MON,                                                                                                                               "+
			"       TYPE3_DEV_DAY,                                                                                                                               "+
			"       TYPE3_DEV_MON,                                                                                                                               "+
			"       TYPE_ALL_DAY,                                                                                                                                "+
			"       TYPE_ALL_MON,                                                                                                                                "+
			"       S1_LJ_ZD,                                                                                                                                    "+
			"       S2_LJ_ZD,                                                                                                                                    "+
			"       S3_LJ_ZD,                                                                                                                                    "+
			"       S4_LJ_ZD,                                                                                                                                    "+
			"       TYPE_DT,                                                                                                                                     "+
			"       HB_ALL,                                                                                                                                      "+
			"       HB_DT,                                                                                                                                       "+
			"       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(HB_ALL, '%', '')) DESC, TYPE_ALL_MON DESC) HB_RANK                      "+
			"  FROM (SELECT T1.GROUP_ID_1_NAME,                                                                                                                  "+
			"               T1.DEAL_DATE,                                                                                                                        "+
			"               T1.GROUP_ID_0,                                                                                                                       "+
			"               COUNT(DISTINCT T1.HQ_CHAN_CODE) BUS_COUNT,                                                                                           "+
			"               NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                                                             "+
			"               NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                                                                            "+
			"               NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                                                             "+
			"               NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                                                                            "+
			"               NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                                                               "+
			"               NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                                                              "+
			"               NVL(SUM(S1_LJ_ZD), 0) S1_LJ_ZD,                                                                                                      "+
			"               NVL(SUM(S2_LJ_ZD), 0) S2_LJ_ZD,                                                                                                      "+
			"               NVL(SUM(S3_LJ_ZD), 0) S3_LJ_ZD,                                                                                                      "+
			"               NVL(SUM(S4_LJ_ZD), 0) S4_LJ_ZD,                                                                                                      "+
			"               CASE                                                                                                                                 "+
			"                 WHEN COUNT(DISTINCT T1.HQ_CHAN_CODE) <> 0 THEN                                                                                     "+
			"                  ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                                 "+
			"                        COUNT(DISTINCT T1.HQ_CHAN_CODE),                                                                                            "+
			"                        0)                                                                                                                          "+
			"                 ELSE                                                                                                                               "+
			"                  0                                                                                                                                 "+
			"               END TYPE_DT,                                                                                                                         "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                            "+
			"                                      WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                                                                      "+
			"                                       (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 /                                              "+
			"                                       NVL(SUM(T1.TYPE_ALLL), 0)                                                                                    "+
			"                                      ELSE                                                                                                          "+
			"                                       0                                                                                                            "+
			"                                    END || '%',                                                                                                     "+
			"                                    2) HB_ALL,                                                                                                      "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                            "+
			"                 WHEN (CASE                                                                                                                         "+
			"                        WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                          "+
			"                         ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                          "+
			"                               SUM(T1.HALL_COUNTL))                                                                                                 "+
			"                        ELSE                                                                                                                        "+
			"                         0                                                                                                                          "+
			"                      END) <> 0 THEN                                                                                                                "+
			"                  （(CASE                                                                                                                           "+
			"                      WHEN SUM(T1.HALL_COUNT) <> 0 THEN                                                                                             "+
			"                       ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                            "+
			"                             SUM(T1.HALL_COUNT))                                                                                                    "+
			"                      ELSE                                                                                                                          "+
			"                       0                                                                                                                            "+
			"                    END) - (CASE                                                                                                                    "+
			"                              WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                    "+
			"                               ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                    "+
			"                                     SUM(T1.HALL_COUNTL))                                                                                           "+
			"                              ELSE                                                                                                                  "+
			"                               0                                                                                                                    "+
			"                            END)) * 100 / (CASE                                                                                                     "+
			"                   WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                               "+
			"                    ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                               "+
			"                          SUM(T1.HALL_COUNTL))                                                                                                      "+
			"                   ELSE                                                                                                                             "+
			"                    0                                                                                                                               "+
			"                 END) ELSE 0 END || '%',                                                                                                            "+
			"               2) HB_DT                                                                                                                             "+
			"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                                                                          "+
			" WHERE T1.DEAL_DATE = '"+termnalStartDate+"'                                                                                                        "+
			              where+
			" GROUP BY T1.GROUP_ID_0, T1.GROUP_ID_1_NAME,DEAL_DATE)                                                                                              "+
			")T                                                                                                                                                  "+
			"JOIN PCDE.TB_CDE_BUS_HALL_TARGET  T1                                                                                                                "+
			"ON(T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                                                            ";

	}else{
		sql+=" SELECT NVL(T1.GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,                                             "+
			"        COUNT(DISTINCT T1.HQ_CHAN_CODE) BUS_COUNT,                                                   "+
			"        NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_MON,                                                     "+
			"        NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_MON,                                                     "+
			"        NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_MON,                                                       "+
			"        ROUND(CASE WHEN COUNT(DISTINCT HQ_CHAN_CODE)<>0                                              "+
			"             THEN NVL(SUM(T1.TYPE_ALL),0)/COUNT(DISTINCT HQ_CHAN_CODE)                               "+
			"              ELSE 0 END ,0) TYPE_ALL,                                                               "+
			"        PODS.GET_RADIX_POINT(CASE                                                                    "+
			"          WHEN NVL(SUM(T1.LAST_TYPEALL_DEV),0)<>0 THEN                                               "+
			"       (NVL(SUM(T1.TYPE_ALL),0)-NVL(SUM(T1.LAST_TYPEALL_DEV),0))*100/NVL(SUM(T1.LAST_TYPEALL_DEV),0) "+            
			"                                        ELSE 0 END ||'%'                                             "+
			"                                        ,2)  HB_ALL                                                  "+             
			"   FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                          "+
			" WHERE T1.DEAL_DATE BETWEEN '"+termnalStartDate+"' AND '"+termnalEndDate+"'                          "+
			where+
			" GROUP BY GROUPING SETS(T1.GROUP_ID_0,(T1.GROUP_ID_0, T1.GROUP_ID_1_NAME))" +
			" ORDER BY TYPE_ALL_MON ";
	}
		 
	return sql;
}
/**
 * 公共查询方法
 * @param sql
 * @returns {Array}
 */
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
/**
 * 获取给定日期的前七天dealDate格式为20160101(即：年月日)
 */
function getDate(dealDate){
	//var dealDate ="20161001"
	var yearStr=dealDate.substr(0,4);
	var monStr=dealDate.substr(4,2);
	var dayStr=dealDate.substr(6);
	//创建给定的时间对象
	var date = new Date(yearStr,monStr,dayStr,0,0,0);
	var year = date.getFullYear();
	//给设置时间减去7天
	date.setDate(date.getDate() - 7); 
	var month = date.getMonth();
	if(month<=0){
		month= 12;
		year--;
	}
	var day = date.getDate();
	var contrastDate =year+""+(month<10?"0"+month:""+month)+"" + (day<10?"0"+day:""+day); 
	return contrastDate;
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

