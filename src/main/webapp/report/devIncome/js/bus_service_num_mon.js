$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_SERVICE_NUM_MON"));
	var title=[["组织架构","渠道编码","经营模式（自营/柜台/他营)","分类(旗舰/标准/小型)","本月","累计","环比","定比1月"],
	           ["","","","","受理量","爱理量","",""]];
    
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","SERVICE_NUM","SERVICE_NUM1","HB_SERVICE","DB_SERVICE"];
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
			var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
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
		
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	
	var sql = getSql(3,where);
	var showtext = '营业厅业务受理量月报表-' + dealDate;
	var title=[["账期","州市","厅名称","渠道编码","经营模式（自营/柜台/他营)","分类(旗舰/标准/小型)","本月","累计","环比","定比1月"],
	           ["","","","","","","受理量","爱理量","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var chnlType = $("#chnlType").val();
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
	if(chnlType!=""){
		where += " AND T.CHNL_TYPE ='"+chnlType+"' ";
	}
	if(hq_chan_code!=""){
		where += " AND T.HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	}
	
	if(orgLevel==1){
		return "SELECT '云南省' AS ROW_NAME,                                                                   "+
		"        '86000' AS ROW_ID,                                                                          "+
		"       '--' AS HQ_CHAN_CODE,                                                                        "+
		"       '--' AS OPERATE_TYPE,                                                                        "+
		"       '--' AS CHNL_TYPE,                                                                           "+
		"       SUM(t.SERVICE_NUM) AS SERVICE_NUM,                                                           "+
		"       SUM(t.SERVICE_NUM1) AS SERVICE_NUM1,                                                         "+
		"       CASE                                                                                         "+
		"         WHEN SUM(t.LAST_SERVICE_NUM) = 0 THEN                                                      "+
		"          '0%'                                                                                      "+
		"         ELSE                                                                                       "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t.LAST_SERVICE_NUM)) /                            "+
		"                        SUM(t.LAST_SERVICE_NUM) * 100,                                              "+
		"                        2),                                                                         "+
		"                  'fm9999999999990.00') || '%'                                                      "+
		"       END AS HB_SERVICE,                                                                           "+
		"       CASE                                                                                         "+
		"         WHEN SUM(t1.SERVICE_NUM) = 0 THEN                                                          "+
		"          '0%'                                                                                      "+
		"         ELSE                                                                                       "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t1.SERVICE_NUM)) /                                "+
		"                        SUM(t1.SERVICE_NUM) * 100,                                                  "+
		"                        2),                                                                         "+
		"                  'fm9999999999990.00') || '%'                                                      "+
		"       END AS DB_SERVICE                                                                            "+
		"  FROM PMRT.TB_MRT_BUS_SERVICE_NUM_MON T                                                            "+
		"  LEFT JOIN  PMRT.TB_MRT_BUS_SERVICE_NUM_MON T1                                                     "+
		"  ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE="+getFristMonth(dealDate)+")                   "+
		                         where+
		" GROUP BY T.GROUP_ID_0                                                                              ";
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                                   "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                                   "+
		"       '--' AS HQ_CHAN_CODE,                                                                         "+
		"       '--' AS OPERATE_TYPE,                                                                         "+
		"       '--' AS CHNL_TYPE,                                                                            "+
		"       SUM(t.SERVICE_NUM) AS SERVICE_NUM,                                                            "+
		"       SUM(t.SERVICE_NUM1) AS SERVICE_NUM1,                                                          "+
		"       CASE                                                                                          "+
		"         WHEN SUM(t.LAST_SERVICE_NUM) = 0 THEN                                                       "+
		"          '0%'                                                                                       "+
		"         ELSE                                                                                        "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t.LAST_SERVICE_NUM)) /                             "+
		"                        SUM(t.LAST_SERVICE_NUM) * 100,                                               "+
		"                        2),                                                                          "+
		"                  'fm9999999999990.00') || '%'                                                       "+
		"       END AS HB_SERVICE,                                                                            "+
		"       CASE                                                                                          "+
		"         WHEN SUM(t1.SERVICE_NUM) = 0 THEN                                                           "+
		"          '0%'                                                                                       "+
		"         ELSE                                                                                        "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t1.SERVICE_NUM)) /                                 "+
		"                        SUM(t1.SERVICE_NUM) * 100,                                                   "+
		"                        2),                                                                          "+
		"                  'fm9999999999990.00') || '%'                                                       "+
		"       END AS DB_SERVICE                                                                             "+
		"  FROM pmrt.TB_MRT_BUS_SERVICE_NUM_MON t                                                             "+
		"  LEFT JOIN  pmrt.TB_MRT_BUS_SERVICE_NUM_MON T1                                                      "+
		"  ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE="+getFristMonth(dealDate)+")                    "+
		             where+
		" GROUP BY T.GROUP_ID_1,                                                                              "+
		"          T.GROUP_ID_1_NAME                                                                          ";
	}else{
		return "SELECT T.DEAL_DATE,                                                                          "+
		"       T.GROUP_ID_1_NAME,                                                                           "+
		"       T.BUS_HALL_NAME ROW_NAME,                                                                    "+
		"       T.HQ_CHAN_CODE,                                                                              "+
		"       T.OPERATE_TYPE,                                                                              "+
		"       T.CHNL_TYPE,                                                                                 "+
		"       SUM(t.SERVICE_NUM) AS SERVICE_NUM,                                                           "+
		"       SUM(t.SERVICE_NUM1) AS SERVICE_NUM1,                                                         "+
		"       CASE                                                                                         "+
		"         WHEN SUM(t.LAST_SERVICE_NUM) = 0 THEN                                                      "+
		"          '0%'                                                                                      "+
		"         ELSE                                                                                       "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t.LAST_SERVICE_NUM)) /                            "+
		"                        SUM(t.LAST_SERVICE_NUM) * 100,                                              "+
		"                        2),                                                                         "+
		"                  'fm9999999999990.00') || '%'                                                      "+
		"       END AS HB_SERVICE,                                                                           "+
		"       CASE                                                                                         "+
		"         WHEN SUM(t1.SERVICE_NUM) = 0 THEN                                                          "+
		"          '0%'                                                                                      "+
		"         ELSE                                                                                       "+
		"          to_char(ROUND((SUM(t.SERVICE_NUM) - SUM(t1.SERVICE_NUM)) /                                "+
		"                        SUM(t1.SERVICE_NUM) * 100,                                                  "+
		"                        2),                                                                         "+
		"                  'fm9999999999990.00') || '%'                                                      "+
		"       END AS DB_SERVICE                                                                            "+
		"  FROM pmrt.TB_MRT_BUS_SERVICE_NUM_MON t                                                            "+
		"  LEFT JOIN  pmrt.TB_MRT_BUS_SERVICE_NUM_MON T1                                                     "+
		"  ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE="+getFristMonth(dealDate)+")                   "+
		                    where+
		" GROUP BY T.DEAL_DATE,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,                                            "+
		"          T.HQ_CHAN_CODE,                                                                           "+
		"          T.OPERATE_TYPE,                                                                           "+
		"          T.CHNL_TYPE                                                                               ";
	}
  }
function getFristMonth(dealDate){
	var year=dealDate.substr(0,4);
	return year+'01';
}