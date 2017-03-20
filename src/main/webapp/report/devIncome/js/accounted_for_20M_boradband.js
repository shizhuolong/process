$(function(){
	var dealDate=$("#dealDate").val();
	//省，地市
	var title=[["组织架构","经营模式","厅类型","自有厅新增","","自有厅20M以上","","","","","全网新增","","全网20M以上","","","",""],
	           ["","","","当月发展","较上月同期增减","[20M,50M)用户数","[20M,50M)占比","[50M,100M)用户数","[50M,100M)占比","20M 及以上当月新增用户占比","当月发展","较上月同期增减","[20M,50M)用户数","[20M,50M)占比","[50M,100M)用户数","[50M,100M)占比","20M 及以上当月新增用户占比"]
		      ];
	var field=["OPERATE_TYPE","CHNL_TYPE","ZY_DEV_NUM1","ZY_INCREASE_DEV","ZY_20_50_NUM1","ZY_20_50_ZB","ZY_50_100_NUM1","ZY_50_100_ZB","ZY_GREAT_20_ZB","QW_DEV_NUM1","QW_INCREASE_DEV","QW_20_50_NUM1","QW_20_50_ZB","QW_50_100_NUM1","QW_50_100_ZB","QW_GREAT_20_ZB"];
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
				var where="";
				var sql="";
				if($tr){
					code=$tr.attr("row_id");
					orgLevel=parseInt($tr.attr("orgLevel"));
					if(orgLevel==2){//点击市
						where+=" AND GROUP_ID_1= '"+code+"'";
						sql=getNextSql(where);
					}else{
						return {data:[],extra:{}}
					}
					orgLevel++;
				}else{
					//先根据用户信息得到前几个字段
					code=$("#code").val();
					orgLevel=$("#orgLevel").val();
					if(orgLevel==1){//省
						sql=getSumSql(where);
					}else if(orgLevel==2||orgLevel==3){//市
						where+=' AND GROUP_ID_1=\''+region+'\'';
						sql=getSumSql(where);
						orgLevel=2;
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
	$("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		//search();
		report.showSubRow();
	});
});

function getNextSql(where){
	var dealDate = $("#dealDate").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var chnlType=$("#chnlType").val();
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	if(chnlType!=""){
		where += " AND CHNL_TYPE ='"+chnlType+"' ";
	}
	var sql = 	" SELECT HQ_CHAN_CODE AS ROW_ID,          "+
				"        HQ_CHAN_NAME AS ROW_NAME,        "+
				"        OPERATE_TYPE,                    "+
				"        CHNL_TYPE,                       "+
				"        ZY_DEV_NUM1,                     "+
				"        ZY_INCREASE_DEV,                 "+
				"        ZY_20_50_NUM1,                   "+
				"        ZY_20_50_ZB,                     "+
				"        ZY_50_100_NUM1,                  "+
				"        ZY_50_100_ZB,                    "+
				"        ZY_GREAT_20_ZB,                  "+
				"        '—' QW_DEV_NUM1,                 "+
				"        '—' QW_INCREASE_DEV,             "+
				"        '—' QW_20_50_NUM1,               "+
				"        '—' QW_20_50_ZB,                 "+
				"        '—' QW_50_100_NUM1,              "+
				"        '—' QW_50_100_ZB,                "+
				"        '—' QW_GREAT_20_ZB               "+
				"   FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T  "+
				"  WHERE T.DEAL_DATE = '"+dealDate+"'     "+
				where;
	return sql;
}

function getSumSql(where) {
	var dealDate = $("#dealDate").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var chnlType=$("#chnlType").val();
	var where1=where;
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
		where1+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	if(chnlType!=""){
		where += " AND CHNL_TYPE ='"+chnlType+"' ";
	}
	 return "SELECT NVL(T.GROUP_ID_1,'') ROW_ID,                                                                                   "+
	 "T.GROUP_ID_1_NAME ROW_NAME,                                                                                           "+
	 "       '-' OPERATE_TYPE,                                                                                              "+
	 "       '-' CHNL_TYPE,                                                                                                 "+
	 "       T.ZY_DEV_NUM1,                                                                                                 "+
	 "       T.ZY_DEV_NUM1- T1.ZY_DEV_NUM1 ZY_INCREASE_DEV,                                                                 "+
	 "       T.ZY_20_50_NUM1,                                                                                               "+
	 "       PODS.GET_RADIX_POINT(T.ZY_20_50_ZB*100 ||'%',2) ZY_20_50_ZB,                                                   "+
	 "       T.ZY_50_100_NUM1,                                                                                              "+
	 "       PODS.GET_RADIX_POINT(T.ZY_50_100_ZB*100 ||'%',2) ZY_50_100_ZB,                                                 "+
	 "       PODS.GET_RADIX_POINT(T.ZY_GREAT_20_ZB*100 ||'%',2) ZY_GREAT_20_ZB,                                             "+
	 "       T2.QW_DEV_NUM1,                                                                                                "+
	 "       T2.QW_DEV_NUM1-T3.QW_DEV_NUM1  QW_INCREASE_DEV,                                                                "+
	 "       T2.QW_20_50_NUM1,                                                                                              "+
	 "       PODS.GET_RADIX_POINT(T2.QW_20_50_ZB*100 ||'%',2) QW_20_50_ZB,                                                  "+
	 "       T2.QW_50_100_NUM1,                                                                                             "+
	 "       PODS.GET_RADIX_POINT(T2.QW_50_100_ZB*100 ||'%',2) QW_50_100_ZB,                                                "+
	 "       PODS.GET_RADIX_POINT(T2.QW_GREAT_20_ZB*100 ||'%',2) QW_GREAT_20_ZB                                             "+
	 "  FROM (SELECT NVL(GROUP_ID_1_NAME, '合计')  GROUP_ID_1_NAME,GROUP_ID_1,                                              "+
	 "             SUM(NVL(ZY_DEV_NUM1, 0)) ZY_DEV_NUM1,                                                                    "+
	 "             SUM(NVL(ZY_INCREASE_DEV, 0)) ZY_INCREASE_DEV,                                                            "+
	 "             SUM(NVL(ZY_20_50_NUM1, 0)) ZY_20_50_NUM1,                                                                "+
	 "             TRIM('.' FROM TO_CHAR(CASE                                                                               "+
	 "                            WHEN SUM(NVL(ZY_DEV_NUM1, 0)) = 0 THEN                                                    "+
	 "                             0                                                                                        "+
	 "                            ELSE                                                                                      "+
	 "                             SUM(NVL(ZY_20_50_NUM1, 0)) / SUM(NVL(ZY_DEV_NUM1, 0))                                    "+
	 "                          END,                                                                                        "+
	 "                          'FM9999990.99')) ZY_20_50_ZB,                                                               "+
	 "             SUM(NVL(ZY_50_100_NUM1, 0)) ZY_50_100_NUM1,                                                              "+
	 "             TRIM('.' FROM TO_CHAR(CASE                                                                               "+
	 "                            WHEN SUM(NVL(ZY_DEV_NUM1, 0)) = 0 THEN                                                    "+
	 "                             0                                                                                        "+
	 "                            ELSE                                                                                      "+
	 "                             SUM(NVL(ZY_50_100_NUM1, 0)) / SUM(NVL(ZY_DEV_NUM1, 0))                                   "+
	 "                          END,                                                                                        "+
	 "                          'FM9999990.99')) ZY_50_100_ZB,                                                              "+
	 "             TRIM('.' FROM TO_CHAR(CASE                                                                               "+
	 "                            WHEN SUM(NVL(ZY_DEV_NUM1, 0)) = 0 THEN                                                    "+
	 "                             0                                                                                        "+
	 "                            ELSE                                                                                      "+
	 "                             SUM(NVL(ZY_GREAT_20, 0)) / SUM(NVL(ZY_DEV_NUM1, 0))                                      "+
	 "                          END,                                                                                        "+
	 "                          'FM9999990.99')) ZY_GREAT_20_ZB                                                             "+
	 "  FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T                                                                                "+
	 " WHERE T.DEAL_DATE = '"+dealDate+"'                                                                                   "+
	             where+ 
	 "  GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1_NAME, T.GROUP_ID_1))                                "+
	 " )T                                                                                                                   "+
	 " LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,GROUP_ID_1,                                            "+
	 "             SUM(NVL(ZY_DEV_NUM1, 0)) ZY_DEV_NUM1                                                                     "+
	 "  FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T                                                                                "+
	 " WHERE T.DEAL_DATE = '"+getLastMonth(dealDate)+"'                                                                     "+
	             where+
	 "  GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1_NAME, T.GROUP_ID_1))                                "+
	 " )T1                                                                                                                  "+
	 " ON(T.GROUP_ID_1_NAME=T1.GROUP_ID_1_NAME)                                                                             "+
	 " LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,GROUP_ID_1,                                            "+
	 "                   SUM(NVL(QW_DEV_NUM1, 0)) QW_DEV_NUM1,                                                              "+
	 "                   SUM(NVL(QW_20_50_NUM1, 0)) QW_20_50_NUM1,                                                          "+
	 "                   TRIM('.' FROM TO_CHAR(CASE                                                                         "+
	 "                      WHEN SUM(NVL(QW_DEV_NUM1, 0)) = 0 THEN                                                          "+
	 "                       0                                                                                              "+
	 "                      ELSE                                                                                            "+
	 "                       SUM(NVL(QW_20_50_NUM1, 0)) / SUM(NVL(QW_DEV_NUM1, 0))                                          "+
	 "                    END,                                                                                              "+
	 "                    'FM9999990.99')) QW_20_50_ZB,                                                                     "+
	 "                    SUM(NVL(QW_50_100_NUM1, 0)) QW_50_100_NUM1,                                                       "+
	 "                    TRIM('.' FROM TO_CHAR(CASE                                                                        "+
	 "                      WHEN SUM(NVL(QW_DEV_NUM1, 0)) = 0 THEN                                                          "+
	 "                       0                                                                                              "+
	 "                      ELSE                                                                                            "+
	 "                       SUM(NVL(QW_50_100_NUM1, 0)) / SUM(NVL(QW_DEV_NUM1, 0))                                         "+
	 "                    END,                                                                                              "+
	 "                    'FM9999990.99')) QW_50_100_ZB,                                                                    "+
	 "                    TRIM('.' FROM TO_CHAR(CASE                                                                        "+
	 "                      WHEN SUM(NVL(QW_DEV_NUM1, 0)) = 0 THEN                                                          "+
	 "                       0                                                                                              "+
	 "                      ELSE                                                                                            "+
	 "                       SUM(NVL(QW_GREAT_20, 0)) / SUM(NVL(QW_DEV_NUM1, 0))                                            "+
	 "                    END,                                                                                              "+
	 "                    'FM9999990.99')) QW_GREAT_20_ZB                                                                   "+
	 "            FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T                                                                      "+
	 "            WHERE T.DEAL_DATE = '"+dealDate+"'                                                                        "+
	               where1+
	 "            GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1_NAME, T.GROUP_ID_1))                      "+
	 " )T2                                                                                                                  "+
	 " ON (T.GROUP_ID_1_NAME=T2.GROUP_ID_1_NAME)                                                                            "+
	 " LEFT JOIN (SELECT NVL(GROUP_ID_1_NAME, '合计') GROUP_ID_1_NAME,GROUP_ID_1,                                            "+
	 "                   SUM(NVL(QW_DEV_NUM1, 0)) QW_DEV_NUM1                                                               "+
	 "            FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T                                                                      "+
	 "            WHERE T.DEAL_DATE = '"+getLastMonth(dealDate)+"'                                                          "+
	                 where1+
	 "            GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, T.GROUP_ID_1_NAME, T.GROUP_ID_1))                      "+
	 " )T3                                                                                                                  "+
	 " ON (T.GROUP_ID_1_NAME=T3.GROUP_ID_1_NAME)                                                                            "+
	 "ORDER BY ZY_DEV_NUM1 DESC                                                                                             ";
}



function downsAll() {
	var orderBy= "  ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var chnlType=$("#chnlType").val();
	var sql =   " SELECT T.DEAL_DATE,                     "+
				"        T.GROUP_ID_1_NAME,               "+
				"        T.HQ_CHAN_NAME,                  "+
				"        T.HQ_CHAN_CODE,                  "+
				"        T.OPERATE_TYPE,                  "+
				"        T.CHNL_TYPE,                     "+
				"        T.ZY_DEV_NUM1,                   "+
				"        T.ZY_INCREASE_DEV,               "+
				"        T.ZY_20_50_NUM1,                 "+
				"        T.ZY_20_50_ZB,                   "+
				"        T.ZY_50_100_NUM1,                "+
				"        T.ZY_50_100_ZB,                  "+
				"        T.ZY_GREAT_20_ZB                 "+
				"   FROM PMRT.TB_MRT_BUS_BROAD_DEV_MON T  "+
				"  WHERE T.DEAL_DATE = '"+dealDate+"'     ";

	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		sql = " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		sql+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		sql+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		sql += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	if(chnlType!=""){
		sql += " AND T.CHNL_TYPE ='"+chnlType+"' ";
	}
	sql+=orderBy;
	var showtext = '宽带20M以上新增占比(月)' + dealDate;
	title=[["账期","地市","营业厅名称","渠道编码","经营模式","厅类型","自有厅新增","","自有厅20M以上","","","",""],
	       ["","","","","","","当月发展","较上月同期增减","[20M，50M)用户数","[20M，50M)占比","[50M，100M)用户数","[50M，100M)占比","20M 及以上当月新增用户占比"]
		];
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