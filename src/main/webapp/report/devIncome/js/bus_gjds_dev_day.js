$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_GJDX_DEV_DAY"));
	var title=[["组织架构","营业厅名称","营业厅编码","运营模式","厅类型","购机独享产品发展量（合计）","","","其中39/59/89元","","","其中119/139/159元","","","其中199/299/399元","","","69元100M宽带包月 ","",""],
	           ["","","","","","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比"]];
	var field=["BUS_HALL_NAME","HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","ALL_GJDX_NUM","ALL_GJDX_NUM1","HB_ALL","GJDX_39_NUM","GJDX_39_NUM1","HB_39","GJDX_119_NUM","GJDX_119_NUM1","HB_119","GJDX_199_NUM","GJDX_199_NUM1","HB_199","GJDX_69_KD","GJDX_69_KD1","HB_69"];
    $("#searchBtn").click(function(){
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
					where+=" AND GROUP_ID_1='"+code+"'";
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
					where+=" AND GROUP_ID_1='"+code+"'";
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
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var where="";
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
		where += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(hq_chan_code!=""){
		where += " AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	}
	var sql =  getDownSql(where);
	var showtext = '自有厅专属套餐发展日报表-' + dealDate;
	var title=[["地市","营业厅名称","营业厅编码","运营模式","厅类型","购机独享产品发展量（合计）","","","其中39/59/89元","","","其中119/139/159元","","","其中199/299/399元","","","69元100M宽带包月 ","",""],
	           ["","","","","","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比","日发展","本月累计","月环比"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var dealDate=$("#dealDate").val();
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(hq_chan_code!=""){
		where += " AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	}
	
	if(orgLevel==1){
		return " SELECT T.GROUP_ID_0 ROW_ID,                                                                                          "+
		"		'云南省' ROW_NAME,                                                                                                      "+
		"		'--' BUS_HALL_NAME,                                                                                                   "+
		"		'--' HQ_CHAN_CODE,                                                                                                    "+
		"		'--' OPERATE_TYPE,                                                                                                    "+
		"		'--' CHNL_TYPE,                                                                                                       "+
		"        T.ALL_GJDX_NUM                                                                                                       "+
		"       ,T.ALL_GJDX_NUM1                                                                                                      "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.ALL_GJDX_NUM1<>0                                                                   "+
		"                                  THEN T.ALL_GJDX_NUM1/T1.ALL_GJDX_NUM1*100-1                                                "+
		"                                  ELSE 0                                                                                     "+
		"                                  END || '%' ,2)    HB_ALL                                                                   "+
		"       ,T.GJDX_39_NUM                                                                                                        "+
		"       ,T.GJDX_39_NUM1                                                                                                       "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_39_NUM1<>0                                                                    "+
		"                                  THEN T.GJDX_39_NUM1/T1.GJDX_39_NUM1*100-1                                                  "+
		"                                  ELSE 0                                                                                     "+
		"                                  END || '%' ,2)    HB_39                                                                    "+
		"       ,T.GJDX_119_NUM                                                                                                       "+
		"       ,T.GJDX_119_NUM1                                                                                                      "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_119_NUM1<>0                                                                   "+
		"                                  THEN T.GJDX_119_NUM1/T1.GJDX_119_NUM1*100-1                                                "+
		"                                  ELSE 0                                                                                     "+
		"                                  END || '%' ,2)     HB_119                                                                  "+
		"       ,T.GJDX_199_NUM                                                                                                       "+
		"       ,T.GJDX_199_NUM1                                                                                                      "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_199_NUM1<>0                                                                   "+
		"                                  THEN T.GJDX_199_NUM1/T1.GJDX_199_NUM1*100-1                                                "+
		"                                  ELSE 0                                                                                     "+
		"                                  END || '%' ,2)    HB_199                                                                   "+
		"       ,T.GJDX_69_KD                                                                                                         "+
		"       ,T.GJDX_69_KD1                                                                                                        "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_69_KD1<>0                                                                     "+
		"                                  THEN T.GJDX_69_KD1/T1.GJDX_69_KD1*100-1                                                    "+
		"                                  ELSE 0                                                                                     "+
		"                                  END || '%' ,2)    HB_69                                                                    "+
		"FROM (                                                                                                                       "+
		"      SELECT T.GROUP_ID_0                                                                                                    "+
		"            ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                                "+
		"            ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                               "+
		"            ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                                  "+
		"            ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                                 "+
		"            ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                                "+
		"            ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                               "+
		"            ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                                "+
		"            ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                               "+
		"            ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                                   "+
		"            ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                                  "+
		"      FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                                    "+
		"      WHERE T.DEAL_DATE='"+dealDate+"'                                                                                       "+
		             where+
		"            GROUP BY T.GROUP_ID_0                                                                                            "+
		")T                                                                                                                           "+
		"LEFT JOIN (                                                                                                                  "+
		"            SELECT T.GROUP_ID_0                                                                                              "+
		"                  ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                          "+
		"                  ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                         "+
		"                  ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                            "+
		"                  ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                           "+
		"                  ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                          "+
		"                  ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                         "+
		"                  ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                          "+
		"                  ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                         "+
		"                  ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                             "+
		"                  ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                            "+
		"            FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                              "+
		"            WHERE T.DEAL_DATE="+getLastMonSameDay(dealDate)                                                                   +
		            where+
		"            GROUP BY T.GROUP_ID_0                                                                                            "+
		")T1 ON T.GROUP_ID_0 =T1.GROUP_ID_0                                                                                           ";
		
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                                                      "+
		"		T.GROUP_ID_1_NAME ROW_NAME,                                                                                      "+
		"		'--' BUS_HALL_NAME,                                                                                     		 "+
		"		'--' HQ_CHAN_CODE,                                                                                     			 "+
		"		'--' OPERATE_TYPE,                                                                                   			 "+
		"		'--' CHNL_TYPE                                                                                                   "+   
		"       ,T.ALL_GJDX_NUM                                                                                                  "+
		"       ,T.ALL_GJDX_NUM1                                                                                                 "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.ALL_GJDX_NUM1<>0                                                              "+
		"                                  THEN T.ALL_GJDX_NUM1/T1.ALL_GJDX_NUM1*100-1                                           "+
		"                                  ELSE 0                                                                                "+
		"                                  END || '%' ,2)    HB_ALL                                                              "+
		"       ,T.GJDX_39_NUM                                                                                                   "+
		"       ,T.GJDX_39_NUM1                                                                                                  "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_39_NUM1<>0                                                               "+
		"                                  THEN T.GJDX_39_NUM1/T1.GJDX_39_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                "+
		"                                  END || '%' ,2)    HB_39                                                               "+
		"       ,T.GJDX_119_NUM                                                                                                  "+
		"       ,T.GJDX_119_NUM1                                                                                                 "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_119_NUM1<>0                                                              "+
		"                                  THEN T.GJDX_119_NUM1/T1.GJDX_119_NUM1*100-1                                           "+
		"                                  ELSE 0                                                                                "+
		"                                  END || '%' ,2)     HB_119                                                             "+
		"       ,T.GJDX_199_NUM                                                                                                  "+
		"       ,T.GJDX_199_NUM1                                                                                                 "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_199_NUM1<>0                                                              "+
		"                                  THEN T.GJDX_199_NUM1/T1.GJDX_199_NUM1*100-1                                           "+
		"                                  ELSE 0                                                                                "+
		"                                  END || '%' ,2)    HB_199                                                              "+
		"       ,T.GJDX_69_KD                                                                                                    "+
		"       ,T.GJDX_69_KD1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_69_KD1<>0                                                                "+
		"                                  THEN T.GJDX_69_KD1/T1.GJDX_69_KD1*100-1                                               "+
		"                                  ELSE 0                                                                                "+
		"                                  END || '%' ,2)    HB_69                                                               "+
		"FROM (                                                                                                                  "+
		"      SELECT T.GROUP_ID_1                                                                                               "+
		"            ,T.GROUP_ID_1_NAME                                                                                          "+
		"            ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                           "+
		"            ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                          "+
		"            ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                             "+
		"            ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                            "+
		"            ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                           "+
		"            ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                          "+
		"            ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                           "+
		"            ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                          "+
		"            ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                              "+
		"            ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                             "+
		"      FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                               "+
		"      WHERE T.DEAL_DATE='"+dealDate+"'                                                                                  "+
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                       "+
		"                    ,T.GROUP_ID_1_NAME                                                                                  "+
		")T                                                                                                                      "+
		"LEFT JOIN (                                                                                                             "+
		"            SELECT T.GROUP_ID_1                                                                                         "+
		"                  ,T.GROUP_ID_1_NAME                                                                                    "+
		"                  ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                     "+
		"                  ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                    "+
		"                  ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                       "+
		"                  ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                      "+
		"                  ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                     "+
		"                  ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                    "+
		"                  ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                     "+
		"                  ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                    "+
		"                  ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                        "+
		"                  ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                       "+
		"            FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                         "+
		"            WHERE T.DEAL_DATE="+getLastMonSameDay(dealDate)                                                              +
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                       "+
		"                    ,T.GROUP_ID_1_NAME                                                                                  "+
		")T1 ON T.GROUP_ID_1 =T1.GROUP_ID_1                                                                                      ";
	}else{
		return "SELECT T.BUS_HALL_NAME ROW_NAME                                                                                    "+
		"       ,T.HQ_CHAN_CODE                                                                                                    "+
		"       ,T.OPERATE_TYPE                                                                                                    "+
		"       ,T.CHNL_TYPE                                                                                                       "+
		"       ,T.ALL_GJDX_NUM                                                                                                    "+
		"       ,T.ALL_GJDX_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.ALL_GJDX_NUM1<>0                                                                "+
		"                                  THEN T.ALL_GJDX_NUM1/T1.ALL_GJDX_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_ALL                                                                "+
		"       ,T.GJDX_39_NUM                                                                                                     "+
		"       ,T.GJDX_39_NUM1                                                                                                    "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_39_NUM1<>0                                                                 "+
		"                                  THEN T.GJDX_39_NUM1/T1.GJDX_39_NUM1*100-1                                               "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_39                                                                 "+
		"       ,T.GJDX_119_NUM                                                                                                    "+
		"       ,T.GJDX_119_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_119_NUM1<>0                                                                "+
		"                                  THEN T.GJDX_119_NUM1/T1.GJDX_119_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)     HB_119                                                               "+
		"       ,T.GJDX_199_NUM                                                                                                    "+
		"       ,T.GJDX_199_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_199_NUM1<>0                                                                "+
		"                                  THEN T.GJDX_199_NUM1/T1.GJDX_199_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_199                                                                "+
		"       ,T.GJDX_69_KD                                                                                                      "+
		"       ,T.GJDX_69_KD1                                                                                                     "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_69_KD1<>0                                                                  "+
		"                                  THEN T.GJDX_69_KD1/T1.GJDX_69_KD1*100-1                                                 "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_69                                                                 "+
		"FROM (                                                                                                                    "+
		"      SELECT T.GROUP_ID_1                                                                                                 "+
		"            ,T.GROUP_ID_1_NAME                                                                                            "+
		"            ,T.HQ_CHAN_CODE                                                                                               "+
		"            ,T.BUS_HALL_NAME                                                                                              "+
		"            ,T.OPERATE_TYPE                                                                                               "+
		"            ,T.CHNL_TYPE                                                                                                  "+
		"            ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                             "+
		"            ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                            "+
		"            ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                               "+
		"            ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                              "+
		"            ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                             "+
		"            ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                            "+
		"            ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                             "+
		"            ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                            "+
		"            ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                                "+
		"            ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                               "+
		"      FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                                 "+
		"      WHERE T.DEAL_DATE='"+dealDate+"'                                                                                    "+
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                         "+
		"                    ,T.GROUP_ID_1_NAME                                                                                    "+
		"                    ,T.HQ_CHAN_CODE                                                                                       "+
		"                    ,T.BUS_HALL_NAME                                                                                      "+
		"                    ,T.OPERATE_TYPE                                                                                       "+
		"                    ,T.CHNL_TYPE                                                                                          "+
		")T                                                                                                                        "+
		"LEFT JOIN (                                                                                                               "+
		"            SELECT T.GROUP_ID_1                                                                                           "+
		"                  ,T.GROUP_ID_1_NAME                                                                                      "+
		"                  ,T.HQ_CHAN_CODE                                                                                         "+
		"                  ,T.BUS_HALL_NAME                                                                                        "+
		"                  ,T.OPERATE_TYPE                                                                                         "+
		"                  ,T.CHNL_TYPE                                                                                            "+
		"                  ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                       "+
		"                  ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                      "+
		"                  ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                         "+
		"                  ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                        "+
		"                  ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                       "+
		"                  ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                      "+
		"                  ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                       "+
		"                  ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                      "+
		"                  ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                          "+
		"                  ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                         "+
		"            FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                           "+
		"            WHERE T.DEAL_DATE="+getLastMonSameDay(dealDate)+
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                         "+
		"                    ,T.GROUP_ID_1_NAME                                                                                    "+
		"                    ,T.HQ_CHAN_CODE                                                                                       "+
		"                    ,T.BUS_HALL_NAME                                                                                      "+
		"                    ,T.OPERATE_TYPE                                                                                       "+
		"                    ,T.CHNL_TYPE                                                                                          "+
		")T1 ON T.HQ_CHAN_CODE =T1.HQ_CHAN_CODE                                                                                    ";
	}
  }

	function getDownSql(where){
		var dealDate=$("#dealDate").val();
		return "SELECT T.GROUP_ID_1_NAME,T.BUS_HALL_NAME                                                                           "+
		"       ,T.HQ_CHAN_CODE                                                                                                    "+
		"       ,T.OPERATE_TYPE                                                                                                    "+
		"       ,T.CHNL_TYPE                                                                                                       "+
		"       ,T.ALL_GJDX_NUM                                                                                                    "+
		"       ,T.ALL_GJDX_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.ALL_GJDX_NUM1<>0                                                                "+
		"                                  THEN T.ALL_GJDX_NUM1/T1.ALL_GJDX_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_ALL                                                                "+
		"       ,T.GJDX_39_NUM                                                                                                     "+
		"       ,T.GJDX_39_NUM1                                                                                                    "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_39_NUM1<>0                                                                 "+
		"                                  THEN T.GJDX_39_NUM1/T1.GJDX_39_NUM1*100-1                                               "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_39                                                                 "+
		"       ,T.GJDX_119_NUM                                                                                                    "+
		"       ,T.GJDX_119_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_119_NUM1<>0                                                                "+
		"                                  THEN T.GJDX_119_NUM1/T1.GJDX_119_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)     HB_119                                                               "+
		"       ,T.GJDX_199_NUM                                                                                                    "+
		"       ,T.GJDX_199_NUM1                                                                                                   "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_199_NUM1<>0                                                                "+
		"                                  THEN T.GJDX_199_NUM1/T1.GJDX_199_NUM1*100-1                                             "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_199                                                                "+
		"       ,T.GJDX_69_KD                                                                                                      "+
		"       ,T.GJDX_69_KD1                                                                                                     "+
		"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.GJDX_69_KD1<>0                                                                  "+
		"                                  THEN T.GJDX_69_KD1/T1.GJDX_69_KD1*100-1                                                 "+
		"                                  ELSE 0                                                                                  "+
		"                                  END || '%' ,2)    HB_69                                                                 "+
		"FROM (                                                                                                                    "+
		"      SELECT T.GROUP_ID_1                                                                                                 "+
		"            ,T.GROUP_ID_1_NAME                                                                                            "+
		"            ,T.HQ_CHAN_CODE                                                                                               "+
		"            ,T.BUS_HALL_NAME                                                                                              "+
		"            ,T.OPERATE_TYPE                                                                                               "+
		"            ,T.CHNL_TYPE                                                                                                  "+
		"            ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                             "+
		"            ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                            "+
		"            ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                               "+
		"            ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                              "+
		"            ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                             "+
		"            ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                            "+
		"            ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                             "+
		"            ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                            "+
		"            ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                                "+
		"            ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                               "+
		"      FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                                 "+
		"      WHERE T.DEAL_DATE='"+dealDate+"'                                                                                    "+
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                         "+
		"                    ,T.GROUP_ID_1_NAME                                                                                    "+
		"                    ,T.HQ_CHAN_CODE                                                                                       "+
		"                    ,T.BUS_HALL_NAME                                                                                      "+
		"                    ,T.OPERATE_TYPE                                                                                       "+
		"                    ,T.CHNL_TYPE                                                                                          "+
		")T                                                                                                                        "+
		"LEFT JOIN (                                                                                                               "+
		"            SELECT T.GROUP_ID_1                                                                                           "+
		"                  ,T.GROUP_ID_1_NAME                                                                                      "+
		"                  ,T.HQ_CHAN_CODE                                                                                         "+
		"                  ,T.BUS_HALL_NAME                                                                                        "+
		"                  ,T.OPERATE_TYPE                                                                                         "+
		"                  ,T.CHNL_TYPE                                                                                            "+
		"                  ,SUM(ALL_GJDX_NUM)   ALL_GJDX_NUM                                                                       "+
		"                  ,SUM(ALL_GJDX_NUM1)  ALL_GJDX_NUM1                                                                      "+
		"                  ,SUM(GJDX_39_NUM)   GJDX_39_NUM                                                                         "+
		"                  ,SUM(GJDX_39_NUM1)  GJDX_39_NUM1                                                                        "+
		"                  ,SUM(GJDX_199_NUM)   GJDX_199_NUM                                                                       "+
		"                  ,SUM(GJDX_199_NUM1)  GJDX_199_NUM1                                                                      "+
		"                  ,SUM(GJDX_119_NUM)   GJDX_119_NUM                                                                       "+
		"                  ,SUM(GJDX_119_NUM1)  GJDX_119_NUM1                                                                      "+
		"                  ,SUM(GJDX_69_KD)    GJDX_69_KD                                                                          "+
		"                  ,SUM(GJDX_69_KD1)   GJDX_69_KD1                                                                         "+
		"            FROM PMRT.TB_MRT_BUS_GJDX_DEV_DAY T                                                                           "+
		"            WHERE T.DEAL_DATE="+getLastMonSameDay(dealDate)+
		             where+
		"            GROUP BY T.GROUP_ID_1                                                                                         "+
		"                    ,T.GROUP_ID_1_NAME                                                                                    "+
		"                    ,T.HQ_CHAN_CODE                                                                                       "+
		"                    ,T.BUS_HALL_NAME                                                                                      "+
		"                    ,T.OPERATE_TYPE                                                                                       "+
		"                    ,T.CHNL_TYPE                                                                                          "+
		")T1 ON T.HQ_CHAN_CODE =T1.HQ_CHAN_CODE                                                                                    ";
	}

	function getLastMonSameDay(dealDate){
		var year=dealDate.substr(0,4);
	    var month=dealDate.substring(4,6);
	    var day=dealDate.substr(6,8);
	    if(month=="01"){
	    	return (year-1)+"12"+day;
	    }
		if(parseInt(month)<11){
		   return year+"0"+(parseInt(month)-1)+day;
		}
	    return year+(parseInt(month)-1)+day;
    }
