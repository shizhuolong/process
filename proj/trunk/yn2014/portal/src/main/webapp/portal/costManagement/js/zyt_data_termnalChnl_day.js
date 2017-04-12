$(function() {
	$("#termnalStartDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
	$("#termnalEndDate").val(getMaxDate("PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL"));
		queryTerminalData();
		$("#termnalSearchBtn").click(function(){
			$("#termnalDataBar").hide();
			queryTerminalData();
		});
		$("#termnalDownBtn").click(function(){
			downTermnalData();
		});
});

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
	if(content != "<tbody></tr></tbody>") {
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
				["分公司","厅数","模式一","","模式三","","小计","","","累计环比（%）","","环比排名","年度日累计终端时序完成率"],
				["","","日发展","月累计","日发展","月累计","日发展","月累计","单厅","月累计","单厅","",""]
		       ];
	}else{
		title=[
				["分公司","厅数","模式一","模式三","小计","",""],
				["","","月累计","月累计 ","月累计  ","单厅","月累计环比"]
		       ];
	}
	var sql = getTerminalSql();
	showtext = "自营厅终端销量日通报-("+termnalStartDate+"~"+termnalEndDate+")";
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
					"<th rowspan='2'>年度日累计终端时序完成率</th>" +
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
	var termnalOpeType   = $("#termnalOpeType").val();
	var termnalChnlType  = $("#termnalChnlType").val();
	var region 		 = $("#region").val();
	var orgLevel 	 = $("#orgLevel").val();
	var where ="";
	if(""!=termnalChnlType){
		where+=" AND CHNL_TYPE  ='"+termnalChnlType+"' ";
	}
	if(""!=termnalOpeType){
		where+=" AND OPERATE_TYPE  ='"+termnalOpeType+"' ";
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
			"SELECT T.GROUP_ID_1_NAME,                                                                                                                "+
			"       T.BUS_COUNT,                                                                                                                      "+
			"       T.TYPE1_DEV_DAY,                                                                                                                  "+
			"       T.TYPE1_DEV_MON,                                                                                                                  "+
			"       T.TYPE3_DEV_DAY,                                                                                                                  "+
			"       T.TYPE3_DEV_MON,                                                                                                                  "+
			"       T.TYPE_ALL_DAY,                                                                                                                   "+
			"       T.TYPE_ALL_MON,                                                                                                                   "+
			"       T.TYPE_DT,                                                                                                                        "+
			"       T.HB_ALL,                                                                                                                         "+
			"       T.HB_DT,                                                                                                                          "+
			"       T.HB_RANK,                                                                                                                        "+
			"       PODS.GET_RADIX_POINT((T2.YEAR_LJ_ZD /                                                                                             "+
			"                               (T1.ZD_AVG_YEAR *                                                                                         "+
			"                               ((TO_DATE(T.DEAL_DATE, 'YYYYMMDD') -                                                                      "+
			"                               TO_DATE(SUBSTR(T.DEAL_DATE, 1, 4) || '0101', 'YYYYMMDD')) + 1))                                           "+
			"                              ) * 100 || '%',                                                                                            "+
			"                            2) SXWC_RATE                                                                                                 "+
			"  FROM (SELECT '全省' GROUP_ID_1_NAME,                                                                                                   "+
			"               DEAL_DATE,                                                                                                                "+
			"               COUNT(DISTINCT T1.HQ_CHAN_CODE) BUS_COUNT,                                                                                "+
			"               NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                                                  "+
			"               NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                                                                 "+
			"               NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                                                  "+
			"               NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                                                                 "+
			"               NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                                                    "+
			"               NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                                                   "+
			"               NVL(SUM(S1_LJ_ZD), 0) S1_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S2_LJ_ZD), 0) S2_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S3_LJ_ZD), 0) S3_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S4_LJ_ZD), 0) S4_LJ_ZD,                                                                                           "+
			"               CASE                                                                                                                      "+
			"                 WHEN COUNT(DISTINCT T1.HQ_CHAN_CODE) <> 0 THEN                                                                          "+
			"                  ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                      "+
			"                        COUNT(DISTINCT T1.HQ_CHAN_CODE),                                                                                 "+
			"                        0)                                                                                                               "+
			"                 ELSE                                                                                                                    "+
			"                  0                                                                                                                      "+
			"               END TYPE_DT,                                                                                                              "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                 "+
			"                                      WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                                                           "+
			"                                       (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 /                                   "+
			"                                       NVL(SUM(T1.TYPE_ALLL), 0)                                                                         "+
			"                                      ELSE                                                                                               "+
			"                                       0                                                                                                 "+
			"                                    END || '%',                                                                                          "+
			"                                    2) HB_ALL,                                                                                           "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                 "+
			"                 WHEN (CASE                                                                                                              "+
			"                        WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                               "+
			"                         ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                               "+
			"                               SUM(T1.HALL_COUNTL))                                                                                      "+
			"                        ELSE                                                                                                             "+
			"                         0                                                                                                               "+
			"                      END) <> 0 THEN                                                                                                     "+
			"                  （(CASE                                                                                                                "+
			"                      WHEN SUM(T1.HALL_COUNT) <> 0 THEN                                                                                  "+
			"                       ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                 "+
			"                             SUM(T1.HALL_COUNT))                                                                                         "+
			"                      ELSE                                                                                                               "+
			"                       0                                                                                                                 "+
			"                    END) - (CASE                                                                                                         "+
			"                              WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                         "+
			"                               ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                         "+
			"                                     SUM(T1.HALL_COUNTL))                                                                                "+
			"                              ELSE                                                                                                       "+
			"                               0                                                                                                         "+
			"                            END)) * 100 / (CASE                                                                                          "+
			"                   WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                    "+
			"                    ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                    "+
			"                          SUM(T1.HALL_COUNTL))                                                                                           "+
			"                   ELSE                                                                                                                  "+
			"                    0                                                                                                                    "+
			"                 END) ELSE 0 END || '%',                                                                                                 "+
			"               2) HB_DT,                                                                                                                 "+
			"       0 HB_RANK                                                                                                                         "+
			"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                                                               "+
			" WHERE T1.DEAL_DATE = '"+termnalStartDate+"'                                                                                                     "+
			          where+
			" GROUP BY DEAL_DATE                                                                                                                      "+
			"UNION ALL                                                                                                                                "+
			"SELECT GROUP_ID_1_NAME,                                                                                                                  "+
			"       DEAL_DATE,                                                                                                                        "+
			"       BUS_COUNT,                                                                                                                        "+
			"       TYPE1_DEV_DAY,                                                                                                                    "+
			"       TYPE1_DEV_MON,                                                                                                                    "+
			"       TYPE3_DEV_DAY,                                                                                                                    "+
			"       TYPE3_DEV_MON,                                                                                                                    "+
			"       TYPE_ALL_DAY,                                                                                                                     "+
			"       TYPE_ALL_MON,                                                                                                                     "+
			"       S1_LJ_ZD,                                                                                                                         "+
			"       S2_LJ_ZD,                                                                                                                         "+
			"       S3_LJ_ZD,                                                                                                                         "+
			"       S4_LJ_ZD,                                                                                                                         "+
			"       TYPE_DT,                                                                                                                          "+
			"       HB_ALL,                                                                                                                           "+
			"       HB_DT,                                                                                                                            "+
			"       ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TO_NUMBER(REPLACE(HB_ALL, '%', '')) DESC, TYPE_ALL_MON DESC) HB_RANK           "+
			"  FROM (SELECT T1.GROUP_ID_1_NAME,                                                                                                       "+
			"               T1.DEAL_DATE,                                                                                                             "+
			"               T1.GROUP_ID_0,                                                                                                            "+
			"               COUNT(DISTINCT T1.HQ_CHAN_CODE) BUS_COUNT,                                                                                "+
			"               NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                                                  "+
			"               NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                                                                 "+
			"               NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                                                  "+
			"               NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                                                                 "+
			"               NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                                                    "+
			"               NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                                                   "+
			"               NVL(SUM(S1_LJ_ZD), 0) S1_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S2_LJ_ZD), 0) S2_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S3_LJ_ZD), 0) S3_LJ_ZD,                                                                                           "+
			"               NVL(SUM(S4_LJ_ZD), 0) S4_LJ_ZD,                                                                                           "+
			"               CASE                                                                                                                      "+
			"                 WHEN COUNT(DISTINCT T1.HQ_CHAN_CODE) <> 0 THEN                                                                          "+
			"                  ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                      "+
			"                        COUNT(DISTINCT T1.HQ_CHAN_CODE),                                                                                 "+
			"                        0)                                                                                                               "+
			"                 ELSE                                                                                                                    "+
			"                  0                                                                                                                      "+
			"               END TYPE_DT,                                                                                                              "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                 "+
			"                                      WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                                                           "+
			"                                       (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 /                                   "+
			"                                       NVL(SUM(T1.TYPE_ALLL), 0)                                                                         "+
			"                                      ELSE                                                                                               "+
			"                                       0                                                                                                 "+
			"                                    END || '%',                                                                                          "+
			"                                    2) HB_ALL,                                                                                           "+
			"               PODS.GET_RADIX_POINT(CASE                                                                                                 "+
			"                 WHEN (CASE                                                                                                              "+
			"                        WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                               "+
			"                         ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                               "+
			"                               SUM(T1.HALL_COUNTL))                                                                                      "+
			"                        ELSE                                                                                                             "+
			"                         0                                                                                                               "+
			"                      END) <> 0 THEN                                                                                                     "+
			"                  （(CASE                                                                                                                "+
			"                      WHEN SUM(T1.HALL_COUNT) <> 0 THEN                                                                                  "+
			"                       ROUND(NVL(SUM(T1.TYPE_ALL1), 0) /                                                                                 "+
			"                             SUM(T1.HALL_COUNT))                                                                                         "+
			"                      ELSE                                                                                                               "+
			"                       0                                                                                                                 "+
			"                    END) - (CASE                                                                                                         "+
			"                              WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                         "+
			"                               ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                         "+
			"                                     SUM(T1.HALL_COUNTL))                                                                                "+
			"                              ELSE                                                                                                       "+
			"                               0                                                                                                         "+
			"                            END)) * 100 / (CASE                                                                                          "+
			"                   WHEN SUM(T1.HALL_COUNTL) <> 0 THEN                                                                                    "+
			"                    ROUND(NVL(SUM(T1.TYPE_ALLL), 0) /                                                                                    "+
			"                          SUM(T1.HALL_COUNTL))                                                                                           "+
			"                   ELSE                                                                                                                  "+
			"                    0                                                                                                                    "+
			"                 END) ELSE 0 END || '%',                                                                                                 "+
			"               2) HB_DT                                                                                                                  "+
			"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                                                               "+
			" WHERE T1.DEAL_DATE = '"+termnalStartDate+"'                                                                                                     "+
			             where+
			" GROUP BY T1.GROUP_ID_0, T1.GROUP_ID_1_NAME, DEAL_DATE)) T                                                                               "+
			"  JOIN PCDE.TB_CDE_BUS_HALL_TARGET T1                                                                                                    "+
			"    ON (T.GROUP_ID_1_NAME = T1.GROUP_ID_1_NAME)                                                                                          "+
			"  LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME,                                                                         "+
			"                    NVL(SUM(TYPE_ALL), 0)   YEAR_LJ_ZD                                                                                   "+
			"             FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                                       "+
			"                 WHERE DEAL_DATE LIKE '"+getYear(termnalStartDate)+"%'                                                                           "+
			"                   AND DEAL_DATE <= '"+termnalStartDate+"'                                                                                       "+
			                    where+
			"             GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))                                                            "+
			"  )T2  ON(T2.GROUP_ID_1_NAME=T.GROUP_ID_1_NAME)                                                                                          "+
			" ORDER BY HB_RANK                                                                                                                        ";

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