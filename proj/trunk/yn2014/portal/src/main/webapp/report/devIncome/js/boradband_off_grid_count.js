$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_LEAVE_RATE_MON"));
	var dealDate=$("#dealDate").val();
	//省，地市
	var title=[["组织架构","经营模式","自有厅移动网","","","","全网移动网","","","","自有厅固网","","","","全网固网","","","","自有厅小计","","","","全网小计","","",""],
	           ["","","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比"]
		];
    var field=["OPERATE_TYPE","THIS_YWXH_NUM","THIS_YW_RATE","THIS_YW_ZJ","THIS_YW_HB","QQD_THIS_YWXH_NUM","QQD_THIS_YW_RATE","QQD_THIS_YW_ZJ","QQD_THIS_YW_HB","THIS_NETXH_NUM","THIS_NET_RATE","THIS_NET_ZJ","THIS_NET_HB","QQD_THIS_NETXH_NUM","QQD_THIS_NET_RATE","QQD_THIS_NET_ZJ","QQD_THIS_NET_HB","THIS_ALLXH_NUM","THIS_ALL_RATE","THIS_ALL_ZJ","THIS_ALL_HB","QQD_THIS_ALLXH_NUM","QQD_THIS_ALL_RATE","QQD_THIS_ALL_ZJ","QQD_THIS_ALL_HB"];
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
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var flag = $("#flag").val();
			var groupBy = "";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT HQ_CHAN_CODE AS ROW_ID,BUS_HALL_NAME AS ROW_NAME "+getNextSql()+" AND GROUP_ID_1= '"+code+"'";
					groupBy= " GROUP BY HQ_CHAN_CODE,BUS_HALL_NAME,OPERATE_TYPE   ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=getSumSql();
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,QQD_THIS_YW_NUM,QQD_THIS_YWXH_NUM,QQD_LAST_YWXH_NUM,QQD_THIS_NET_NUM,QQD_THIS_NETXH_NUM,QQD_LAST_NETXH_NUM,QQD_THIS_ALL_NUM,QQD_THIS_ALLXH_NUM,QQD_LAST_ALLXH_NUM "; 
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=getSumSql()+' AND GROUP_ID_1=\''+region+'\'';
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,QQD_THIS_YW_NUM,QQD_THIS_YWXH_NUM,QQD_LAST_YWXH_NUM,QQD_THIS_NET_NUM,QQD_THIS_NETXH_NUM,QQD_LAST_NETXH_NUM,QQD_THIS_ALL_NUM,QQD_THIS_ALLXH_NUM,QQD_LAST_ALLXH_NUM "; 
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				preField+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				preField+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				preField += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			
			var sql=preField+groupBy;
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
			$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
			report.showSubRow();
		});
});


function getNextSql(){
	var dealDate = $("#dealDate").val();
	var sql = 	
				"       ,OPERATE_TYPE                                                                                                                 "+
				"       ,SUM(NVL(THIS_YWXH_NUM,0))       THIS_YWXH_NUM                                                                                "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_YW_NUM,0))<>0                                                                    "+
				"                                  THEN SUM(NVL(THIS_YWXH_NUM,0))*100/SUM(NVL(THIS_YW_NUM,0))                                         "+
				"                                  ELSE 0 END || '%'                                                                                  "+
				"                         ,2)             THIS_YW_RATE                                                                                "+
				"       ,SUM(NVL(THIS_YWXH_NUM,0))-SUM(NVL(LAST_YWXH_NUM,0))      THIS_YW_ZJ                                                          "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_YWXH_NUM,0))<>0                                                                  "+
				"                                  THEN (SUM(NVL(THIS_YWXH_NUM,0))-SUM(NVL(LAST_YWXH_NUM,0)))*100/SUM(NVL(LAST_YWXH_NUM,0))           "+
				"                                   ELSE 0 END || '%'                                                                                 "+
				"                         ,2)             THIS_YW_HB                                                                                  "+
				"       ,SUM(NVL(THIS_NETXH_NUM,0))       THIS_NETXH_NUM                                                                              "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_NET_NUM,0))<>0                                                                   "+
				"                                  THEN SUM(NVL(THIS_NETXH_NUM,0))*100/SUM(NVL(THIS_NET_NUM,0))                                       "+
				"                                  ELSE 0 END || '%'                                                                                  "+
				"                         ,2)             THIS_NET_RATE                                                                               "+
				"       ,SUM(NVL(THIS_NETXH_NUM,0))-SUM(NVL(LAST_NETXH_NUM,0))      THIS_NET_ZJ                                                       "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_NETXH_NUM,0))<>0                                                                 "+
				"                                  THEN (SUM(NVL(THIS_NETXH_NUM,0))-SUM(NVL(LAST_NETXH_NUM,0)))*100/SUM(NVL(LAST_NETXH_NUM,0))        "+
				"                                   ELSE 0 END || '%'                                                                                 "+
				"                         ,2)             THIS_NET_HB                                                                                 "+
				"       ,SUM(NVL(THIS_ALLXH_NUM,0))       THIS_ALLXH_NUM                                                                              "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_ALL_NUM,0))<>0                                                                   "+
				"                                  THEN SUM(NVL(THIS_ALLXH_NUM,0))*100/SUM(NVL(THIS_ALL_NUM,0))                                       "+
				"                                  ELSE 0 END || '%'                                                                                  "+
				"                         ,2)             THIS_ALL_RATE                                                                               "+
				"       ,SUM(NVL(THIS_ALLXH_NUM,0))-SUM(NVL(LAST_ALLXH_NUM,0))      THIS_ALL_ZJ                                                       "+
				"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ALLXH_NUM,0))<>0                                                                 "+
				"                                  THEN (SUM(NVL(THIS_ALLXH_NUM,0))-SUM(NVL(LAST_ALLXH_NUM,0)))*100/SUM(NVL(LAST_ALLXH_NUM,0))        "+
				"                                   ELSE 0 END || '%'                                                                                 "+
				"                         ,2)             THIS_ALL_HB                                                                                 "+
				" FROM PMRT.TB_MRT_BUS_LEAVE_RATE_MON WHERE DEAL_DATE='"+dealDate+"'                                                                  ";
	return sql;
}

function getSumSql() {
	var dealDate = $("#dealDate").val();
	var s=	 " SELECT GROUP_ID_1 AS ROW_ID                                                                                                      "+
			 "       ,GROUP_ID_1_NAME AS ROW_NAME                                                                                               "+
			 "       ,'-' AS OPERATE_TYPE                                                                                                       "+
			 "       ,SUM(NVL(THIS_YWXH_NUM,0))       THIS_YWXH_NUM                                                                             "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_YW_NUM,0))<>0                                                                 "+
			 "                                  THEN SUM(NVL(THIS_YWXH_NUM,0))*100/SUM(NVL(THIS_YW_NUM,0))                                      "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             THIS_YW_RATE                                                                             "+
			 "       ,SUM(NVL(THIS_YWXH_NUM,0))-SUM(NVL(LAST_YWXH_NUM,0))      THIS_YW_ZJ                                                       "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_YWXH_NUM,0))<>0                                                               "+
			 "                                  THEN (SUM(NVL(THIS_YWXH_NUM,0))-SUM(NVL(LAST_YWXH_NUM,0)))*100/SUM(NVL(LAST_YWXH_NUM,0))        "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             THIS_YW_HB                                                                               "+
			 "       ,NVL(QQD_THIS_YWXH_NUM,0)       QQD_THIS_YWXH_NUM                                                                          "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_THIS_YW_NUM,0)<>0                                                                  "+
			 "                                  THEN NVL(QQD_THIS_YWXH_NUM,0)*100/NVL(QQD_THIS_YW_NUM,0)                                        "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             QQD_THIS_YW_RATE                                                                         "+
			 "       ,NVL(QQD_THIS_YWXH_NUM,0)-NVL(QQD_LAST_YWXH_NUM,0)      QQD_THIS_YW_ZJ                                                     "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_LAST_YWXH_NUM,0)<>0                                                                "+
			 "                                  THEN (NVL(QQD_THIS_YWXH_NUM,0)-NVL(QQD_LAST_YWXH_NUM,0))*100/NVL(QQD_LAST_YWXH_NUM,0)           "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             QQD_THIS_YW_HB                                                                           "+
			 "       ,SUM(NVL(THIS_NETXH_NUM,0))       THIS_NETXH_NUM                                                                           "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_NET_NUM,0))<>0                                                                "+
			 "                                  THEN SUM(NVL(THIS_NETXH_NUM,0))*100/SUM(NVL(THIS_NET_NUM,0))                                    "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             THIS_NET_RATE                                                                            "+
			 "       ,SUM(NVL(THIS_NETXH_NUM,0))-SUM(NVL(LAST_NETXH_NUM,0))      THIS_NET_ZJ                                                    "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_NETXH_NUM,0))<>0                                                              "+
			 "                                  THEN (SUM(NVL(THIS_NETXH_NUM,0))-SUM(NVL(LAST_NETXH_NUM,0)))*100/SUM(NVL(LAST_NETXH_NUM,0))     "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             THIS_NET_HB                                                                              "+
			 "       ,NVL(QQD_THIS_NETXH_NUM,0)       QQD_THIS_NETXH_NUM                                                                        "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_THIS_NET_NUM,0)<>0                                                                 "+
			 "                                  THEN NVL(QQD_THIS_NETXH_NUM,0)*100/NVL(QQD_THIS_NET_NUM,0)                                      "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             QQD_THIS_NET_RATE                                                                        "+
			 "       ,NVL(QQD_THIS_NETXH_NUM,0)-NVL(QQD_LAST_NETXH_NUM,0)      QQD_THIS_NET_ZJ                                                  "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_LAST_NETXH_NUM,0)<>0                                                               "+
			 "                                  THEN (NVL(QQD_THIS_NETXH_NUM,0)-NVL(QQD_LAST_NETXH_NUM,0))*100/NVL(QQD_LAST_NETXH_NUM,0)        "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             QQD_THIS_NET_HB                                                                          "+
			 "       ,SUM(NVL(THIS_ALLXH_NUM,0))       THIS_ALLXH_NUM                                                                           "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(THIS_ALL_NUM,0))<>0                                                                "+
			 "                                  THEN SUM(NVL(THIS_ALLXH_NUM,0))*100/SUM(NVL(THIS_ALL_NUM,0))                                    "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             THIS_ALL_RATE                                                                            "+
			 "       ,SUM(NVL(THIS_ALLXH_NUM,0))-SUM(NVL(LAST_ALLXH_NUM,0))      THIS_ALL_ZJ                                                    "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ALLXH_NUM,0))<>0                                                              "+
			 "                                  THEN (SUM(NVL(THIS_ALLXH_NUM,0))-SUM(NVL(LAST_ALLXH_NUM,0)))*100/SUM(NVL(LAST_ALLXH_NUM,0))     "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             THIS_ALL_HB                                                                              "+
			 "       ,NVL(QQD_THIS_ALLXH_NUM,0)       QQD_THIS_ALLXH_NUM                                                                        "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_THIS_ALL_NUM,0)<>0                                                                 "+
			 "                                  THEN NVL(QQD_THIS_ALLXH_NUM,0)*100/NVL(QQD_THIS_ALL_NUM,0)                                      "+
			 "                                  ELSE 0 END || '%'                                                                               "+
			 "                         ,2)             QQD_THIS_ALL_RATE                                                                        "+
			 "       ,NVL(QQD_THIS_ALLXH_NUM,0)-NVL(QQD_LAST_ALLXH_NUM,0)      QQD_THIS_ALL_ZJ                                                  "+
			 "       ,PODS.GET_RADIX_POINT(CASE WHEN NVL(QQD_LAST_ALLXH_NUM,0)<>0                                                               "+
			 "                                  THEN (NVL(QQD_THIS_ALLXH_NUM,0)-NVL(QQD_LAST_ALLXH_NUM,0))*100/NVL(QQD_LAST_ALLXH_NUM,0)        "+
			 "                                   ELSE 0 END || '%'                                                                              "+
			 "                         ,2)             QQD_THIS_ALL_HB                                                                          "+
			 " FROM PMRT.TB_MRT_BUS_LEAVE_RATE_MON WHERE DEAL_DATE='"+dealDate+"'                                                               ";
		return s;
}



function downsAll() {
	var orderBy= " ORDER BY GROUP_ID_1,HQ_CHAN_CODE ";
	var groupBy= " GROUP BY DEAL_DATE,GROUP_ID_1_NAME,GROUP_ID_1,BUS_HALL_NAME,HQ_CHAN_CODE ,OPERATE_TYPE   ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="";
	var preField = " SELECT DEAL_DATE,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE"+	getNextSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = preField + where+groupBy+orderBy;
	var showtext = '营业厅离网率统计月报表' + dealDate;
	title=[["账期","分公司","营业厅","渠道编码","经营模式","自有厅移动网","","","","自有厅固网","","","","自有厅小计","","",""],
	       ["","","","","","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比","销户数","离网率=销户数/在网数","环比增减","环比"]
		];
	downloadExcel(sql,title,showtext);
}
