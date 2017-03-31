var report;
$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_LEAVE_RATE_DAY"));
	var title=[["组织架构","经营模式","自有厅移动网本月累计","","","","","全渠道移动网本月累计","","","","","自有厅固网本月累计","","","","","全渠道固网本月累计","","","","","自有厅本月累计小计","","","","","全渠道本月累计小计","","","",""],
	           ["","","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比"]
			];
	var field=["OPERATE_TYPE","THIS_YWXH_NUM","THIS_YWXH_NUM1","THIS_YW_RATE","THIS_YW_ZJ","THIS_YW_HB","QQD_THIS_YWXH_NUM","QQD_THIS_YWXH_NUM1","QQD_THIS_YW_RATE","QQD_THIS_YW_ZJ","QQD_THIS_YW_HB","THIS_NETXH_NUM","THIS_NETXH_NUM1","THIS_NET_RATE","THIS_NET_ZJ","THIS_NET_HB","QQD_THIS_NETXH_NUM","QQD_THIS_NETXH_NUM1","QQD_THIS_NET_RATE","QQD_THIS_NET_ZJ","QQD_THIS_NET_HB","THIS_ALLXH_NUM","THIS_ALLXH_NUM1","THIS_ALL_RATE","THIS_ALL_ZJ","THIS_ALL_HB","QQD_THIS_ALLXH_NUM","QQD_THIS_ALLXH_NUM1","QQD_THIS_ALL_RATE","QQD_THIS_ALL_ZJ","QQD_THIS_ALL_HB"];
	
	report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var region     = $("#region").val();
			var chanlCode  = $("#chanlCode").val();
			var code       = $("#code").val();
			var regionCode = $("#regionCode").val();
			var operateType= $("#operateType").val();
			var dealDate   = $("#dealDate").val();
			var sql        = "";
			var orgLevel   = "";
			var groupBy    = "";
			var orderBy	   = "";
			var where  	   = "";
			var groupCount = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,QQD_THIS_YW_NUM1,QQD_THIS_YWXH_NUM1,QQD_THIS_YWXH_NUM,QQD_LAST_YWXH_NUM1,QQD_THIS_NET_NUM1,QQD_THIS_NETXH_NUM1,QQD_THIS_NETXH_NUM,QQD_LAST_NETXH_NUM1,QQD_THIS_ALL_NUM1,QQD_THIS_ALLXH_NUM1,QQD_THIS_ALLXH_NUM,QQD_LAST_ALLXH_NUM1 ";
			var groupNext  = " GROUP BY HQ_CHAN_CODE,BUS_HALL_NAME,OPERATE_TYPE ";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击地市
					sql     = " SELECT HQ_CHAN_CODE AS ROW_ID,BUS_HALL_NAME AS ROW_NAME,"+getNextSql()+" AND GROUP_ID_1= '"+code+"'";
					groupBy = groupNext;
					orderBy = " ORDER BY HQ_CHAN_CODE ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql     = getFristSql();
					groupBy = groupCount;
					orderBy = " ORDER BY GROUP_ID_1 ";
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					code=region;
					sql     = getFristSql();
					groupBy = groupCount;
					orderBy = " ORDER BY GROUP_ID_1";
					where  += " AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			
			if(regionCode!=""){
				where += " AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where += " AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
		
			sql+= where + groupBy +orderBy;
			 
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	$("#searchBtn").click(function(){
		report.showSubRow();
		/*$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();*/
	});
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function getFristSql(){
	var dealDate = $("#dealDate").val();
	var s=	" SELECT GROUP_ID_1 AS ROW_ID,                                                                                       "+
			"        GROUP_ID_1_NAME AS ROW_NAME,                                                                                "+
			"        '——' AS OPERATE_TYPE,                                                                                       "+
			"        SUM(NVL(THIS_YWXH_NUM, 0)) THIS_YWXH_NUM,                                                                   "+
			"        SUM(NVL(THIS_YWXH_NUM1, 0)) THIS_YWXH_NUM1,                                                                 "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(THIS_YW_NUM1, 0)) <> 0 THEN                                             "+
			"                                SUM(NVL(THIS_YWXH_NUM1, 0)) * 100 / SUM(NVL(THIS_YW_NUM1, 0))                       "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_YW_RATE,                                                                       "+
			"        SUM(NVL(THIS_YWXH_NUM1, 0)) - SUM(NVL(LAST_YWXH_NUM1, 0)) THIS_YW_ZJ,                                       "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(LAST_YWXH_NUM1, 0)) <> 0 THEN                                           "+
			"                                (SUM(NVL(THIS_YWXH_NUM1, 0)) - SUM(NVL(LAST_YWXH_NUM1, 0))) * 100 /                 "+
			"                                SUM(NVL(LAST_YWXH_NUM1, 0))                                                         "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_YW_HB,                                                                         "+
			"        NVL(QQD_THIS_YWXH_NUM, 0) QQD_THIS_YWXH_NUM,                                                                "+
			"        NVL(QQD_THIS_YWXH_NUM1, 0) QQD_THIS_YWXH_NUM1,                                                              "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_THIS_YW_NUM1, 0) <> 0 THEN                                              "+
			"                                NVL(QQD_THIS_YWXH_NUM1, 0) * 100 / NVL(QQD_THIS_YW_NUM1, 0)                         "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_YW_RATE,                                                                   "+
			"        NVL(QQD_THIS_YWXH_NUM1, 0) - NVL(QQD_LAST_YWXH_NUM1, 0) QQD_THIS_YW_ZJ,                                     "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_LAST_YWXH_NUM1, 0) <> 0 THEN                                            "+
			"                                (NVL(QQD_THIS_YWXH_NUM1, 0) - NVL(QQD_LAST_YWXH_NUM1, 0)) * 100 /                   "+
			"                                NVL(QQD_LAST_YWXH_NUM1, 0)                                                          "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_YW_HB                                                                      "+
			"                                                                                                                    "+
			"       ,                                                                                                            "+
			"        SUM(NVL(THIS_NETXH_NUM, 0)) THIS_NETXH_NUM,                                                                 "+
			"        SUM(NVL(THIS_NETXH_NUM1, 0)) THIS_NETXH_NUM1,                                                               "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(THIS_NET_NUM1, 0)) <> 0 THEN                                            "+
			"                                SUM(NVL(THIS_NETXH_NUM1, 0)) * 100 / SUM(NVL(THIS_NET_NUM1, 0))                     "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_NET_RATE,                                                                      "+
			"        SUM(NVL(THIS_NETXH_NUM1, 0)) - SUM(NVL(LAST_NETXH_NUM1, 0)) THIS_NET_ZJ,                                    "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(LAST_NETXH_NUM1, 0)) <> 0 THEN                                          "+
			"                                (SUM(NVL(THIS_NETXH_NUM1, 0)) - SUM(NVL(LAST_NETXH_NUM1, 0))) * 100 /               "+
			"                                SUM(NVL(LAST_NETXH_NUM1, 0))                                                        "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_NET_HB                                                                         "+
			"                                                                                                                    "+
			"       ,                                                                                                            "+
			"        NVL(QQD_THIS_NETXH_NUM, 0) QQD_THIS_NETXH_NUM,                                                              "+
			"        NVL(QQD_THIS_NETXH_NUM1, 0) QQD_THIS_NETXH_NUM1,                                                            "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_THIS_NET_NUM1, 0) <> 0 THEN                                             "+
			"                                NVL(QQD_THIS_NETXH_NUM1, 0) * 100 / NVL(QQD_THIS_NET_NUM1, 0)                       "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_NET_RATE,                                                                  "+
			"        NVL(QQD_THIS_NETXH_NUM1, 0) - NVL(QQD_LAST_NETXH_NUM1, 0) QQD_THIS_NET_ZJ,                                  "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_LAST_NETXH_NUM1, 0) <> 0 THEN                                           "+
			"                                (NVL(QQD_THIS_NETXH_NUM1, 0) - NVL(QQD_LAST_NETXH_NUM1, 0)) * 100 /                 "+
			"                                NVL(QQD_LAST_NETXH_NUM1, 0)                                                         "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_NET_HB                                                                     "+
			"                                                                                                                    "+
			"       ,                                                                                                            "+
			"        SUM(NVL(THIS_ALLXH_NUM, 0)) THIS_ALLXH_NUM,                                                                 "+
			"        SUM(NVL(THIS_ALLXH_NUM1, 0)) THIS_ALLXH_NUM1,                                                               "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(THIS_ALL_NUM1, 0)) <> 0 THEN                                            "+
			"                                SUM(NVL(THIS_ALLXH_NUM1, 0)) * 100 / SUM(NVL(THIS_ALL_NUM1, 0))                     "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_ALL_RATE,                                                                      "+
			"        SUM(NVL(THIS_ALLXH_NUM1, 0)) - SUM(NVL(LAST_ALLXH_NUM1, 0)) THIS_ALL_ZJ,                                    "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN SUM(NVL(LAST_ALLXH_NUM1, 0)) <> 0 THEN                                          "+
			"                                (SUM(NVL(THIS_ALLXH_NUM1, 0)) - SUM(NVL(LAST_ALLXH_NUM1, 0))) * 100 /               "+
			"                                SUM(NVL(LAST_ALLXH_NUM1, 0))                                                        "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) THIS_ALL_HB                                                                         "+
			"                                                                                                                    "+
			"       ,                                                                                                            "+
			"        NVL(QQD_THIS_ALLXH_NUM, 0) QQD_THIS_ALLXH_NUM,                                                              "+
			"        NVL(QQD_THIS_ALLXH_NUM1, 0) QQD_THIS_ALLXH_NUM1,                                                            "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_THIS_ALL_NUM1, 0) <> 0 THEN                                             "+
			"                                NVL(QQD_THIS_ALLXH_NUM1, 0) * 100 / NVL(QQD_THIS_ALL_NUM1, 0)                       "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_ALL_RATE,                                                                  "+
			"        NVL(QQD_THIS_ALLXH_NUM1, 0) - NVL(QQD_LAST_ALLXH_NUM1, 0) QQD_THIS_ALL_ZJ,                                  "+
			"        PODS.GET_RADIX_POINT(CASE                                                                                   "+
			"                               WHEN NVL(QQD_LAST_ALLXH_NUM1, 0) <> 0 THEN                                           "+
			"                                (NVL(QQD_THIS_ALLXH_NUM1, 0) - NVL(QQD_LAST_ALLXH_NUM1, 0)) * 100 /                 "+
			"                                NVL(QQD_LAST_ALLXH_NUM1, 0)                                                         "+
			"                               ELSE                                                                                 "+
			"                                0                                                                                   "+
			"                             END || '%',                                                                            "+
			"                             2) QQD_THIS_ALL_HB                                                                     "+
			"   FROM PMRT.TB_MRT_BUS_LEAVE_RATE_DAY                                                                              "+
			" WHERE DEAL_DATE = '"+dealDate+"' ";
	return s;
}

function getNextSql() {
	var dealDate= $("#dealDate").val();
	var sql =   
				"        OPERATE_TYPE,                                                                                      "+
				"        SUM(NVL(THIS_YWXH_NUM, 0)) THIS_YWXH_NUM,                                                          "+
				"        SUM(NVL(THIS_YWXH_NUM1, 0)) THIS_YWXH_NUM1,                                                        "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(THIS_YW_NUM1, 0)) <> 0 THEN                                    "+
				"                                SUM(NVL(THIS_YWXH_NUM1, 0)) * 100 / SUM(NVL(THIS_YW_NUM1, 0))              "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_YW_RATE,                                                              "+
				"        SUM(NVL(THIS_YWXH_NUM1, 0)) - SUM(NVL(LAST_YWXH_NUM1, 0)) THIS_YW_ZJ,                              "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(LAST_YWXH_NUM1, 0)) <> 0 THEN                                  "+
				"                                (SUM(NVL(THIS_YWXH_NUM1, 0)) - SUM(NVL(LAST_YWXH_NUM1, 0))) * 100 /        "+
				"                                SUM(NVL(LAST_YWXH_NUM1, 0))                                                "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_YW_HB,                                                                "+
				"        SUM(NVL(THIS_NETXH_NUM, 0)) THIS_NETXH_NUM,                                                        "+
				"        SUM(NVL(THIS_NETXH_NUM1, 0)) THIS_NETXH_NUM1,                                                      "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(THIS_NET_NUM1, 0)) <> 0 THEN                                   "+
				"                                SUM(NVL(THIS_NETXH_NUM1, 0)) * 100 / SUM(NVL(THIS_NET_NUM1, 0))            "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_NET_RATE,                                                             "+
				"        SUM(NVL(THIS_NETXH_NUM1, 0)) - SUM(NVL(LAST_NETXH_NUM1, 0)) THIS_NET_ZJ,                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(LAST_NETXH_NUM1, 0)) <> 0 THEN                                 "+
				"                                (SUM(NVL(THIS_NETXH_NUM1, 0)) - SUM(NVL(LAST_NETXH_NUM1, 0))) * 100 /      "+
				"                                SUM(NVL(LAST_NETXH_NUM1, 0))                                               "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_NET_HB,                                                               "+
				"        SUM(NVL(THIS_ALLXH_NUM, 0)) THIS_ALLXH_NUM,                                                        "+
				"        SUM(NVL(THIS_ALLXH_NUM1, 0)) THIS_ALLXH_NUM1,                                                      "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(THIS_ALL_NUM1, 0)) <> 0 THEN                                   "+
				"                                SUM(NVL(THIS_ALLXH_NUM1, 0)) * 100 / SUM(NVL(THIS_ALL_NUM1, 0))            "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_ALL_RATE,                                                             "+
				"        SUM(NVL(THIS_ALLXH_NUM1, 0)) - SUM(NVL(LAST_ALLXH_NUM1, 0)) THIS_ALL_ZJ,                           "+
				"        PODS.GET_RADIX_POINT(CASE                                                                          "+
				"                               WHEN SUM(NVL(LAST_ALLXH_NUM1, 0)) <> 0 THEN                                 "+
				"                                (SUM(NVL(THIS_ALLXH_NUM1, 0)) - SUM(NVL(LAST_ALLXH_NUM1, 0))) * 100 /      "+
				"                                SUM(NVL(LAST_ALLXH_NUM1, 0))                                               "+
				"                               ELSE                                                                        "+
				"                                0                                                                          "+
				"                             END || '%',                                                                   "+
				"                             2) THIS_ALL_HB                                                                "+
				"   FROM PMRT.TB_MRT_BUS_LEAVE_RATE_DAY                                                                     "+
				"  WHERE DEAL_DATE = '"+dealDate+"'                                                                         ";
	return sql;

}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var sql = " SELECT DEAL_DATE,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,"+getNextSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		sql += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		sql+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		sql += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	sql+=" GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE ORDER BY GROUP_ID_1,HQ_CHAN_CODE ";
	var showtext = '营业厅离网率统计日报表' + dealDate;
	var title=[["账期","分公司","营业厅","渠道编码","经营模式","自有厅移动网本月累计","","","","","自有厅固网本月累计","","","","","自有厅本月累计小计","","","",""],
	           ["","","","","","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比","当日销户数","销户数","离网率=销户数/在网数","环比增减","环比"]
			  ];
	downloadExcel(sql,title,showtext);
}
