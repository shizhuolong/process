$(function() {
		//发展TOP前20	
		queryDevData(true);
		$("#devSearchBtn").click(function(){
			$("#devDataBar").hide();
			queryDevData(true);
		});
		$("#devDownBtn").click(function(){
			downDevData(true);
		});
		//发展TOP后20	
		queryDevData(false);
		$("#devAfterTopSearchBtn").click(function(){
			$("#devAfterTopDataBar").hide();
			queryDevData(false);
		});
		$("#devAfterTopDownBtn").click(function(){
			downDevData(false);
		});
		
		//收入TOP前20
		queryIncomeData(true);
		$("#incomeSearchBtn").click(function(){
			$("#incomeDataBar").hide();
			queryIncomeData(true);
		});
		$("#incomeDownBtn").click(function(){
			downIncomeData(true);
		});
		
		//收入TOP后20
		queryIncomeData(false);
		$("#incomeAfterTopSearchBtn").click(function(){
			$("#incomeAfterTopDataBar").hide();
			queryIncomeData(false);
		});
		$("#incomeAfterTopDownBtn").click(function(){
			downIncomeData(false);
		});
		
		
		//销售TOP前20
		querySalesData(true);
		$("#salesSearchBtn").click(function(){
			$("#salesDataBar").hide();
			querySalesData(true);
		});
		$("#salesDownBtn").click(function(){
			downSalesData(true);
		});
		
		//销售TOP后20
		querySalesData(false);
		$("#salesAfterTopSearchBtn").click(function(){
			$("#salesAfterTopDataBar").hide();
			querySalesData(false);
		});
		$("#salesAfterTopDownBtn").click(function(){
			downSalesData(false);
		});
		
});

/**
 * 发展TOP前后20
 */	
function queryDevData(isBeforeTop){
	//获得表头
	var columns = getDevTitle();
	//获得sql
	var sql = getDevSql(isBeforeTop);
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	var content="<tbody>";
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_HALL_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['CHNL_TYPE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_DAY_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_DAY_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_DEV'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_ALL_MON_DEV'])+"</td>"
				+"<td class='numberStyle background'>"+isNull(n['LJ_ALL_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_DEV_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_MANAGE_NAME'])+"</td>"
			content+="</tr>";
		});
	content+="</tbody>";
	var table = columns+content;
	if(isBeforeTop){
		getLastDay($("#devDealDate").val(),"devData");
		if(content != "<tbody></tbody>") {
			$("#devDataGrid").empty().html(table);
		}else {
			$("#devDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}else{
		getLastDay($("#devAfterTopDate").val(),"devAfterTopData");
		if(content != "<tbody></tbody>") {
			$("#devAfterTopDataGrid").empty().html(table);
		}else {
			$("#devAfterTopDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}
	
}

/**
 * 发展前后TOP20
 */
function downDevData(isBeforeTop){
	var title=[
				["州市","厅名称","渠道编码","厅类型","日发展","","月累计","","发展累计","累计环比","","","发展累计排名","店长名字"],
				["","","","","移动网","固网","移动网","固网","","小计","移动网","固网","",""]
			  ];
	var sql = getDevSql(isBeforeTop);
	if(isBeforeTop){
		showtext = "自营厅新增发展厅维度展示TOP前20个厅-"+$("#devDealDate").val();
	}else{
		showtext = "自营厅新增发展厅维度展示TOP后20个厅-"+$("#devAfterTopDate").val();
	}
	
	downloadExcel(sql,title,showtext);
}

/**
 * 收入前后TOP20
 */
function downIncomeData(isBeforeTop){
	var title=[
				["州市","厅名称","渠道编码","厅类型","日收入","","月累计","","收入累计","累计环比","","","收入累计排名","店长名字"],
				["","","","","移动网","固网","移动网","固网","","小计","移动网","固网","",""]
			  ];
	var sql = getIncomeSql(isBeforeTop);
	if(isBeforeTop){
		showtext = "自营厅实时收入厅维度展示TOP前20个厅-"+$("#incomeDealDate").val();
	}else{
		showtext = "自营厅实时收入厅维度展示TOP后20个厅-"+$("#incomeAfterTopDate").val();
	}
	
	downloadExcel(sql,title,showtext);
}

/**
 * 销售前后TOP20
 */
function downSalesData(isBeforeTop){
	var title=[
				["州市","厅名称","渠道编码","厅类型","模式一","","模式三","","小计","","月累计环比","小计排名","店长名字"],
				["","","","","日发展","月累计","日发展","月累计","日发展","月累计","","",""]
			  ];
	var sql = getSalesSql(isBeforeTop);
	if(isBeforeTop){
		showtext = "自营厅终端销售维度展示TOP前20个厅-"+$("#salesDealDate").val();
	}else{
		showtext = "自营厅终端销售维度展示TOP后20个厅-"+$("#salesAfterTopDate").val();
	}
	downloadExcel(sql,title,showtext);
}
/**
 * 获得发展的sql
 * @returns {String}
 */
function getDevSql(isBeforeTop){
	var devDealDate = "";
	var devOpeType = "";
	var region = $("#region").val();
	var orgLevel = $("#orgLevel").val();
	var sql = "";
	var where="";
	if(isBeforeTop){
		devDealDate=$("#devDealDate").val();
		devOpeType=$("#devOpeType").val();
	}else{
		devDealDate=$("#devAfterTopDate").val();
		devOpeType=$("#devAfterTopOpeType").val();
	}
	//条件
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
	if(isBeforeTop){
		sql="SELECT GROUP_ID_1_NAME ,                                                                                            "+
		"       BUS_HALL_NAME，                                                                                                                                                                                                                                                                                            "+
		"       HQ_CHAN_CODE,                                                                                                "+
		"       CHNL_TYPE,                                                                                                   "+
		"       THIS_YW_DAY_DEV,                                                                                             "+
		"       THIS_NET_DAY_DEV,                                                                                            "+
		"       THIS_YW_MON_DEV,                                                                                             "+
		"       THIS_NET_MON_DEV,                                                                                            "+
		"       THIS_ALL_MON_DEV,                                                                                            "+
		"       LJ_ALL_DEV_RATE,                                                                                             "+
		"       LJ_YW_DEV_RATE,                                                                                              "+
		"       LJ_NET_DEV_RATE,                                                                                             "+
		"       T_RANK,                                                                                                      "+
		"       T_MANAGE_NAME                                                                                                "+
		"FROM(                                                                                                               "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY THIS_ALL_MON_DEV DESC) T_RANK                     "+
		"  FROM (SELECT GROUP_ID_0,                                                                                          "+
		"               GROUP_ID_1_NAME ,                                                                                    "+
		"               HQ_CHAN_CODE,                                                                                        "+
		"               BUS_HALL_NAME,                                                                                       "+
		"               T_MANAGE_NAME,                                                                                       "+
		"               CHNL_TYPE,                                                                                           "+
		"               NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                            "+
		"               NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                          "+
		"               NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                           "+
		"               NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                         "+
		"               NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                             "+
		"               PODS.GET_RADIX_POINT(CASE                                                                            "+
		"                                      WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                                     "+
		"                                       (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /            "+
		"                                       NVL(SUM(LAST_ALL_DEV1), 0)                                                   "+
		"                                      ELSE                                                                          "+
		"                                       0                                                                            "+
		"                                    END || '%',                                                                     "+
		"                                    2) LJ_ALL_DEV_RATE,                                                             "+
		"               PODS.GET_RADIX_POINT(CASE                                                                            "+
		"                                      WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                                      "+
		"                                       (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /              "+
		"                                       NVL(SUM(LAST_YW_DEV1), 0)                                                    "+
		"                                      ELSE                                                                          "+
		"                                       0                                                                            "+
		"                                    END || '%',                                                                     "+
		"                                    2) LJ_YW_DEV_RATE,                                                              "+
		"               PODS.GET_RADIX_POINT(CASE                                                                            "+
		"                                      WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                                     "+
		"                                       (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /            "+
		"                                       NVL(SUM(LAST_NET_DEV1), 0)                                                   "+
		"                                      ELSE                                                                          "+
		"                                       0                                                                            "+
		"                                    END || '%',                                                                     "+
		"                                    2) LJ_NET_DEV_RATE                                                              "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                                     "+
		"         WHERE DEAL_DATE = '"+devDealDate+                                                                        "'"+
		                       where            +
		"         GROUP BY GROUP_ID_0,                                                                                       "+
		"                  GROUP_ID_1_NAME ,                                                                                 "+
		"                  HQ_CHAN_CODE,                                                                                     "+
		"                  BUS_HALL_NAME,                                                                                    "+
		"                  T_MANAGE_NAME,                                                                                    "+
		"                  CHNL_TYPE) T                                                                                      "+
		") WHERE  T_RANK<=20                                                                                                 ";
	}else{
		sql="SELECT GROUP_ID_1_NAME,                                                                                      "+
		"       BUS_HALL_NAME,                                                                                        "+
		"       HQ_CHAN_CODE,                                                                                         "+
		"       CHNL_TYPE,                                                                                            "+
		"       THIS_YW_DAY_DEV,                                                                                      "+
		"       THIS_NET_DAY_DEV,                                                                                     "+
		"       THIS_YW_MON_DEV,                                                                                      "+
		"       THIS_NET_MON_DEV,                                                                                     "+
		"       THIS_ALL_MON_DEV,                                                                                     "+
		"       LJ_ALL_DEV_RATE,                                                                                      "+
		"       LJ_YW_DEV_RATE,                                                                                       "+
		"       LJ_NET_DEV_RATE,                                                                                      "+
		"       T_RANK,                                                                                               "+
		"       T_MANAGE_NAME                                                                                         "+
		"FROM(                                                                                                        "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY THIS_ALL_MON_DEV) T_RANK                   "+
		"  FROM (SELECT GROUP_ID_0,                                                                                   "+
		"               GROUP_ID_1_NAME ,                                                                             "+
		"               HQ_CHAN_CODE,                                                                                 "+
		"               BUS_HALL_NAME,                                                                                "+
		"               CHNL_TYPE,                                                                                    "+
		"               T_MANAGE_NAME,                                                                                "+
		"               NVL(SUM(THIS_YW_DEV), 0) THIS_YW_DAY_DEV,                                                     "+
		"               NVL(SUM(THIS_NET_DEV), 0) THIS_NET_DAY_DEV,                                                   "+
		"               NVL(SUM(THIS_YW_DEV1), 0) THIS_YW_MON_DEV,                                                    "+
		"               NVL(SUM(THIS_NET_DEV1), 0) THIS_NET_MON_DEV,                                                  "+
		"               NVL(SUM(THIS_YW_DEV1), 0) + NVL(SUM(THIS_NET_DEV1), 0) THIS_ALL_MON_DEV,                      "+
		"               PODS.GET_RADIX_POINT(CASE                                                                     "+
		"                                      WHEN NVL(SUM(LAST_ALL_DEV1), 0) <> 0 THEN                              "+
		"                                       (NVL(SUM(THIS_ALL_DEV1), 0) - NVL(SUM(LAST_ALL_DEV1), 0)) * 100 /     "+
		"                                       NVL(SUM(LAST_ALL_DEV1), 0)                                            "+
		"                                      ELSE                                                                   "+
		"                                       0                                                                     "+
		"                                    END || '%',                                                              "+
		"                                    2) LJ_ALL_DEV_RATE,                                                      "+
		"               PODS.GET_RADIX_POINT(CASE                                                                     "+
		"                                      WHEN NVL(SUM(LAST_YW_DEV1), 0) <> 0 THEN                               "+
		"                                       (NVL(SUM(THIS_YW_DEV1), 0) - NVL(SUM(LAST_YW_DEV1), 0)) * 100 /       "+
		"                                       NVL(SUM(LAST_YW_DEV1), 0)                                             "+
		"                                      ELSE                                                                   "+
		"                                       0                                                                     "+
		"                                    END || '%',                                                              "+
		"                                    2) LJ_YW_DEV_RATE,                                                       "+
		"               PODS.GET_RADIX_POINT(CASE                                                                     "+
		"                                      WHEN NVL(SUM(LAST_NET_DEV1), 0) <> 0 THEN                              "+
		"                                       (NVL(SUM(THIS_NET_DEV1), 0) - NVL(SUM(LAST_NET_DEV1), 0)) * 100 /     "+
		"                                       NVL(SUM(LAST_NET_DEV1), 0)                                            "+
		"                                      ELSE                                                                   "+
		"                                       0                                                                     "+
		"                                    END || '%',                                                              "+
		"                                    2) LJ_NET_DEV_RATE                                                       "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                              "+
		"                                                                                                             "+
		"	   WHERE DEAL_DATE = '"+devDealDate+"'"          +
		                                where                +
		"         GROUP BY GROUP_ID_0,                                                                                "+
		"                  GROUP_ID_1_NAME ,                                                                          "+
		"                  HQ_CHAN_CODE,                                                                              "+
		"                  CHNL_TYPE,                                                                                 "+
		"                  BUS_HALL_NAME,                                                                             "+
		"                  T_MANAGE_NAME) T                                                                           "+
		") WHERE  T_RANK<=20                                                                                          "
	}
	return sql;
}

/**
 * 获得发展的表头
 * @returns {String}
 */
function getDevTitle(){
	var columns;
	columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>州市</th>" +
					"<th rowspan='2'>厅名称</th>" +
					"<th rowspan='2'>渠道编码</th>" +
					"<th rowspan='2'>厅类型</th>" +
					"<th colspan='2'>日发展</th>" +
					"<th colspan='2'>月累计</th>" +
					"<th rowspan='2'>发展累计</th>" +
					"<th colspan='3'>累计环比(%)</th>" +
					"<th rowspan='2'>发展累计排名</th>" +
					"<th rowspan='2'>店长名字</th>" +
				"</tr>" +
				"<tr>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
					"<th>小计</th>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
				"</tr>" +
				"</thead>";
	return columns;
}

function getIncomeTitle(){
	var columns;
	columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>州市</th>" +
					"<th rowspan='2'>厅名称</th>" +
					"<th rowspan='2'>渠道编码</th>" +
					"<th rowspan='2'>厅类型</th>" +
					"<th colspan='2'>日收入</th>" +
					"<th colspan='2'>月累计</th>" +
					"<th rowspan='2'>收入累计</th>" +
					"<th colspan='3'>累计环比(%)</th>" +
					"<th rowspan='2'>收入累计排名</th>" +
					"<th rowspan='2'>店长名字</th>" +
				"</tr>" +
				"<tr>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
					"<th>小计</th>" +
					"<th>移动网</th>" +
					"<th>固网</th>" +
				"</tr>" +
				"</thead>";
	return columns;
}

function getSalesTitle(){
	var columns;
	columns="<thead>" +
				"<tr>" +
					"<th rowspan='2'>州市</th>" +
					"<th rowspan='2'>厅名称</th>" +
					"<th rowspan='2'>渠道编码</th>" +
					"<th rowspan='2'>厅类型</th>" +
					"<th colspan='2'>模式一</th>" +
					"<th colspan='2'>模式三</th>" +
					"<th colspan='2'>小计</th>" +
					"<th rowspan='2'>月累计环比(%)</th>" +
					"<th rowspan='2'>小计排名</th>" +
					"<th rowspan='2'>店长名字</th>" +
				"</tr>" +
				"<tr>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
					"<th>日发展</th>" +
					"<th>月累计</th>" +
				"</tr>" +
				"</thead>";
	return columns;
}

/**
 * 收入前后TOP20
 */
function queryIncomeData(isBeforeTop){
	//获得表头
	var columns = getIncomeTitle();
	//获得sql
	var sql = getIncomeSql(isBeforeTop);
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	var content="<tbody>";
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_HALL_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['CHNL_TYPE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_DAY_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_DAY_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_YW_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_NET_MON_SR'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['THIS_ALL_MON_SR'])+"</td>"
				+"<td class='numberStyle background'>"+isNull(n['LJ_ALL_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_YW_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['LJ_NET_SR_RATE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_MANAGE_NAME'])+"</td>"
			content+="</tr>";
		});
	content+="</tbody>";
	var table = columns+content;
	if(isBeforeTop){
		getLastDay($("#incomeDealDate").val(),"incomeData");
		if(content != "<tbody></tbody>") {
			$("#incomeDataGrid").empty().html(table);
		}else {
			$("#incomeDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}else{
		getLastDay($("#incomeAfterTopDate").val(),"incomeAfterTop");
		if(content != "<tbody></tbody>") {
			$("#incomeAfterTopDataGrid").empty().html(table);
		}else {
			$("#incomeAfterTopDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}
	
}

/**
 * 销售前后TOP20
 */
function querySalesData(isBeforeTop){
	//获得表头
	var columns = getSalesTitle();
	//获得sql
	var sql = getSalesSql(isBeforeTop);
	//使用公共查询方法获取数据并渲染表格
	var data = load(sql);
	var content="<tbody>";
		$.each(data,function(i,n){
			content+="<tr>"
				+"<td>"+isNull(n['GROUP_ID_1_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['BUS_HALL_NAME'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HQ_CHAN_CODE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['CHNL_TYPE'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE1_DEV_DAY'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE1_DEV_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE3_DEV_DAY'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE3_DEV_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['TYPE_ALL_DAY'])+"</td>"
				+"<td class='numberStyle background'>"+isNull(n['TYPE_ALL_MON'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['HB_ALL'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_RANK'])+"</td>"
				+"<td class='numberStyle'>"+isNull(n['T_MANAGE_NAME'])+"</td>"
			content+="</tr>";
		});
	content+="</tbody>";
	var table = columns+content;
	if(isBeforeTop){
		getLastDay($("#salesDealDate").val(),"salesData");
		if(content != "<tbody></tbody>") {
			$("#salesDataGrid").empty().html(table);
		}else {
			$("#salesDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}else{
		getLastDay($("#salesAfterTopDate").val(),"salesAfterTopData");
		if(content != "<tbody></tbody>") {
			$("#salesAfterTopDataGrid").empty().html(table);
		}else {
			$("#salesAfterTopDataGrid").empty().html("<tr><td colspan='2'>暂无数据</td></tr>");
		}
	}
	
}
/**
 * 获得收入的sql
 * @returns {String}
 */
function getIncomeSql(isBeforeTop){
	var incomeDealDate = "";
	var incomeOpeType = "";
	var region = $("#region").val();
	var orgLevel = $("#orgLevel").val();
	var sql = "";
	var where="";
	if(isBeforeTop){
		incomeDealDate=$("#incomeDealDate").val();
		incomeOpeType=$("#incomeOpeType").val();
	}else{
		incomeDealDate=$("#incomeAfterTopDate").val();
		incomeOpeType=$("#incomeAfterTopOpeType").val();
	}
	//条件
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
	if(isBeforeTop){
		sql="SELECT GROUP_ID_1_NAME,                                                                                 "+
		"       BUS_HALL_NAME,                                                                                   "+
		"       HQ_CHAN_CODE,                                                                                    "+
		"       CHNL_TYPE,                                                                                       "+
		"       THIS_YW_DAY_SR,                                                                                  "+
		"       THIS_NET_DAY_SR,                                                                                 "+
		"       THIS_YW_MON_SR,                                                                                  "+
		"       THIS_NET_MON_SR,                                                                                 "+
		"       THIS_ALL_MON_SR,                                                                                 "+
		"       LJ_ALL_SR_RATE,                                                                                  "+
		"       LJ_YW_SR_RATE,                                                                                   "+
		"       LJ_NET_SR_RATE,                                                                                  "+
		"       T_RANK,                                                                                          "+
		"       T_MANAGE_NAME                                                                                    "+
		"FROM(                                                                                                   "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY THIS_ALL_MON_SR DESC) T_RANK          "+
		"  FROM (SELECT GROUP_ID_0,                                                                              "+
		"               GROUP_ID_1_NAME ,                                                                        "+
		"               HQ_CHAN_CODE,                                                                            "+
		"               BUS_HALL_NAME,                                                                           "+
		"               T_MANAGE_NAME,                                                                           "+
		"               CHNL_TYPE,                                                                               "+
		"               NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                  "+
		"               NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                "+
		"               NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                 "+
		"               NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                               "+
		"               NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                    "+
		"               PODS.GET_RADIX_POINT(CASE                                                                "+
		"                                      WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                          "+
		"                                       (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /  "+
		"                                       NVL(SUM(LAST_ALL_SR1), 0)                                        "+
		"                                      ELSE                                                              "+
		"                                       0                                                                "+
		"                                    END || '%',                                                         "+
		"                                    2) LJ_ALL_SR_RATE,                                                  "+
		"               PODS.GET_RADIX_POINT(CASE                                                                "+
		"                                      WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                           "+
		"                                       (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /    "+
		"                                       NVL(SUM(LAST_YW_SR1), 0)                                         "+
		"                                      ELSE                                                              "+
		"                                       0                                                                "+
		"                                    END || '%',                                                         "+
		"                                    2) LJ_YW_SR_RATE,                                                   "+
		"               PODS.GET_RADIX_POINT(CASE                                                                "+
		"                                      WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                          "+
		"                                       (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /  "+
		"                                       NVL(SUM(LAST_NET_SR1), 0)                                        "+
		"                                      ELSE                                                              "+
		"                                       0                                                                "+
		"                                    END || '%',                                                         "+
		"                                    2) LJ_NET_SR_RATE                                                   "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                         "+
		"          WHERE DEAL_DATE = '"+incomeDealDate+"'" +
		                   where                           +
		"         GROUP BY GROUP_ID_0,                                                                           "+
		"                  GROUP_ID_1_NAME ,                                                                     "+
		"                  HQ_CHAN_CODE,                                                                         "+
		"                  CHNL_TYPE,                                                                            "+
		"                 BUS_HALL_NAME,                                                                         "+
		"                  T_MANAGE_NAME) T                                                                      "+
		") WHERE  T_RANK<=20                                                                                      ";
	}else{
		sql="SELECT GROUP_ID_1_NAME,                                                                                   "+
		"       BUS_HALL_NAME,                                                                                     "+
		"       HQ_CHAN_CODE,                                                                                      "+
		"       CHNL_TYPE,                                                                                         "+
		"       THIS_YW_DAY_SR,                                                                                    "+
		"       THIS_NET_DAY_SR,                                                                                   "+
		"       THIS_YW_MON_SR,                                                                                    "+
		"       THIS_NET_MON_SR,                                                                                   "+
		"       THIS_ALL_MON_SR,                                                                                   "+
		"       LJ_ALL_SR_RATE,                                                                                    "+
		"       LJ_YW_SR_RATE,                                                                                     "+
		"       LJ_NET_SR_RATE,                                                                                    "+
		"       T_RANK,                                                                                            "+
		"       T_MANAGE_NAME                                                                                      "+
		"FROM(                                                                                                     "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY THIS_ALL_MON_SR ) T_RANK                "+
		"  FROM (SELECT GROUP_ID_0,                                                                                "+
		"               GROUP_ID_1_NAME ,                                                                          "+
		"               HQ_CHAN_CODE,                                                                              "+
		"               CHNL_TYPE,                                                                                 "+
		"               BUS_HALL_NAME,                                                                             "+
		"               T_MANAGE_NAME,                                                                             "+
		"               NVL(SUM(THIS_YW_SR), 0) THIS_YW_DAY_SR,                                                    "+
		"               NVL(SUM(THIS_NET_SR), 0) THIS_NET_DAY_SR,                                                  "+
		"               NVL(SUM(THIS_YW_SR1), 0) THIS_YW_MON_SR,                                                   "+
		"               NVL(SUM(THIS_NET_SR1), 0) THIS_NET_MON_SR,                                                 "+
		"               NVL(SUM(THIS_YW_SR1), 0) + NVL(SUM(THIS_NET_SR1), 0) THIS_ALL_MON_SR,                      "+
		"               PODS.GET_RADIX_POINT(CASE                                                                  "+
		"                                      WHEN NVL(SUM(LAST_ALL_SR1), 0) <> 0 THEN                            "+
		"                                       (NVL(SUM(THIS_ALL_SR1), 0) - NVL(SUM(LAST_ALL_SR1), 0)) * 100 /    "+
		"                                       NVL(SUM(LAST_ALL_SR1), 0)                                          "+
		"                                      ELSE                                                                "+
		"                                       0                                                                  "+
		"                                    END || '%',                                                           "+
		"                                    2) LJ_ALL_SR_RATE,                                                    "+
		"               PODS.GET_RADIX_POINT(CASE                                                                  "+
		"                                      WHEN NVL(SUM(LAST_YW_SR1), 0) <> 0 THEN                             "+
		"                                       (NVL(SUM(THIS_YW_SR1), 0) - NVL(SUM(LAST_YW_SR1), 0)) * 100 /      "+
		"                                       NVL(SUM(LAST_YW_SR1), 0)                                           "+
		"                                      ELSE                                                                "+
		"                                       0                                                                  "+
		"                                    END || '%',                                                           "+
		"                                    2) LJ_YW_SR_RATE,                                                     "+
		"               PODS.GET_RADIX_POINT(CASE                                                                  "+
		"                                      WHEN NVL(SUM(LAST_NET_SR1), 0) <> 0 THEN                            "+
		"                                       (NVL(SUM(THIS_NET_SR1), 0) - NVL(SUM(LAST_NET_SR1), 0)) * 100 /    "+
		"                                       NVL(SUM(LAST_NET_SR1), 0)                                          "+
		"                                      ELSE                                                                "+
		"                                       0                                                                  "+
		"                                    END || '%',                                                           "+
		"                                    2) LJ_NET_SR_RATE                                                     "+
		"          FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL                                                           "+
		"          WHERE DEAL_DATE = '"+incomeDealDate+"'" +
		                   where                           +
		"         GROUP BY GROUP_ID_0,                                                                             "+
		"                  GROUP_ID_1_NAME ,                                                                       "+
		"                  HQ_CHAN_CODE,                                                                           "+
		"                  CHNL_TYPE,                                                                              "+
		"                  BUS_HALL_NAME,                                                                          "+
		"                  T_MANAGE_NAME) T                                                                        "+
		") WHERE  T_RANK<=20                                                                                       ";
	}
	return sql;
}

/**
 * 获得收入的sql
 * @returns {String}
 */
function getSalesSql(isBeforeTop){
	var salesDealDate = "";
	var salesOpeType = "";
	var region = $("#region").val();
	var orgLevel = $("#orgLevel").val();
	var sql = "";
	var where="";
	if(isBeforeTop){
		salesDealDate=$("#salesDealDate").val();
		salesOpeType=$("#salesOpeType").val();
	}else{
		salesDealDate=$("#salesAfterTopDate").val();
		salesOpeType=$("#salesAfterTopOpeType").val();
	}
	//条件
	if(""!=salesOpeType){
		where+=" AND OPERATE_TYPE  ='"+salesOpeType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2 ";
	}
	if(isBeforeTop){
		sql="SELECT GROUP_ID_1_NAME,                                                                                "+
		"       BUS_HALL_NAME,                                                                                  "+
		"       HQ_CHAN_CODE,                                                                                   "+
		"       CHNL_TYPE,                                                                                      "+
		"       TYPE1_DEV_DAY,                                                                                  "+
		"       TYPE1_DEV_MON,                                                                                  "+
		"       TYPE3_DEV_DAY,                                                                                  "+
		"       TYPE3_DEV_MON,                                                                                  "+
		"       TYPE_ALL_DAY,                                                                                   "+
		"       TYPE_ALL_MON,                                                                                   "+
		"       HB_ALL,                                                                                         "+
		"       T_RANK,                                                                                         "+
		"       T_MANAGE_NAME                                                                                   "+
		"FROM(                                                                                                  "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TYPE_ALL_MON DESC) T_RANK            "+
		"  FROM (SELECT GROUP_ID_0,                                                                             "+
		"               GROUP_ID_1_NAME ,                                                                       "+
		"               HQ_CHAN_CODE,                                                                           "+
		"               BUS_HALL_NAME,                                                                          "+
		"               T_MANAGE_NAME,                                                                          "+
		"               CHNL_TYPE,                                                                              "+
		"               NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                "+
		"               NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                               "+
		"               NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                "+
		"               NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                               "+
		"               NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                  "+
		"               NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                 "+
		"               PODS.GET_RADIX_POINT(CASE                                                               "+
		"                                      WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                         "+
		"                                       (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 / "+
		"                                       NVL(SUM(T1.TYPE_ALLL), 0)                                       "+
		"                                      ELSE                                                             "+
		"                                       0                                                               "+
		"                                    END || '%',                                                        "+
		"                                    2) HB_ALL                                                          "+
		"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                             "+
		" WHERE DEAL_DATE = '"+salesDealDate+"'"+
		                       where            +
		"         GROUP BY GROUP_ID_0,                                                                          "+
		"                  GROUP_ID_1_NAME ,                                                                    "+
		"                  HQ_CHAN_CODE,                                                                        "+
		"                  CHNL_TYPE,                                                                           "+
		"                  BUS_HALL_NAME,                                                                       "+
		"                  T_MANAGE_NAME) T                                                                     "+
		") WHERE  T_RANK<=20                                                                                    ";
	}else{
	    sql="SELECT GROUP_ID_1_NAME,                                                                                  "+
		"       BUS_HALL_NAME,                                                                                    "+
		"       HQ_CHAN_CODE,                                                                                     "+
		"       CHNL_TYPE,                                                                                        "+
		"       TYPE1_DEV_DAY,                                                                                    "+
		"       TYPE1_DEV_MON,                                                                                    "+
		"       TYPE3_DEV_DAY,                                                                                    "+
		"       TYPE3_DEV_MON,                                                                                    "+
		"       TYPE_ALL_DAY,                                                                                     "+
		"       TYPE_ALL_MON,                                                                                     "+
		"       HB_ALL,                                                                                           "+
		"       T_RANK,                                                                                           "+
		"       T_MANAGE_NAME                                                                                     "+
		"FROM(                                                                                                    "+
		"  SELECT T.* , ROW_NUMBER() OVER(PARTITION BY GROUP_ID_0 ORDER BY TYPE_ALL_MON) T_RANK                   "+
		"  FROM (SELECT GROUP_ID_0,                                                                               "+
		"               GROUP_ID_1_NAME ,                                                                         "+
		"               HQ_CHAN_CODE,                                                                             "+
		"               BUS_HALL_NAME,                                                                            "+
		"               T_MANAGE_NAME,                                                                            "+
		"               CHNL_TYPE,                                                                                "+
		"               NVL(SUM(T1.TYPE1_DEV), 0) TYPE1_DEV_DAY,                                                  "+
		"               NVL(SUM(T1.TYPE1_DEV1), 0) TYPE1_DEV_MON,                                                 "+
		"               NVL(SUM(T1.TYPE3_DEV), 0) TYPE3_DEV_DAY,                                                  "+
		"               NVL(SUM(T1.TYPE3_DEV1), 0) TYPE3_DEV_MON,                                                 "+
		"               NVL(SUM(T1.TYPE_ALL), 0) TYPE_ALL_DAY,                                                    "+
		"               NVL(SUM(T1.TYPE_ALL1), 0) TYPE_ALL_MON,                                                   "+
		"               PODS.GET_RADIX_POINT(CASE                                                                 "+
		"                                      WHEN NVL(SUM(T1.TYPE_ALLL), 0) <> 0 THEN                           "+
		"                                       (NVL(SUM(T1.TYPE_ALL1), 0) - NVL(SUM(T1.TYPE_ALLL), 0)) * 100 /   "+
		"                                       NVL(SUM(T1.TYPE_ALLL), 0)                                         "+
		"                                      ELSE                                                               "+
		"                                       0                                                                 "+
		"                                    END || '%',                                                          "+
		"                                    2) HB_ALL                                                            "+
		"  FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL T1                                                               "+
		" WHERE DEAL_DATE = '"+salesDealDate+"'"+
		                           where        +
		"         GROUP BY GROUP_ID_0,                                                                            "+
		"                  GROUP_ID_1_NAME ,                                                                      "+
		"                  HQ_CHAN_CODE,                                                                          "+
		"                  CHNL_TYPE,                                                                             "+
		"                  BUS_HALL_NAME,                                                                         "+
		"                  T_MANAGE_NAME) T                                                                       "+
		") WHERE  T_RANK<=20                                                                                      ";
	}
	return sql;
}


function getLastDay(dealDate,dataBar){
	var day = dealDate.substr(6);
	$("#"+dataBar+"BarSpan").empty().text(day);
	$("#"+dataBar+"Bar").show();
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
	if(!obj) {
        if(obj=="0"){
			return "0";
		}
		return "&nbsp;";
	}
	return obj;
}

