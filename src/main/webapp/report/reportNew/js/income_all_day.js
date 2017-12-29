var report;
$(function(){
	var field=["ROW_NAME","ALL_SR_DAY","ALL_SR_MON","ALL_SR_HB","RANK_ALL","YEAR_USER_SR_DAY","YEAR_USER_SR_MON","YEAR_USER_SR_HB","MON_USER_SR_DAY","MON_USER_SR_MON","MON_USER_SR_HB","XYW_USER_SR_DAY","XYW_USER_SR_MON","XYW_USER_SR_HB"];
	var title=[["组织架构","出账收入总体情况","","","","包年用户收入","","","包月用户收入","","","校园网用户收入","",""],
			   ["","当日出账收入","当月累计出账收入","","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入",""],
			   ["","","本期","环比","排名","","本期","环比","","本期","环比","","本期","环比"]];
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var region =$("#region").val();
			var code=$("#code").val();
			var orgLevel="";
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var dealDate=$("#dealDate").val();
			var hqHrId=$.trim($("#hqHrId").val());
			var hqChanName=$.trim($("#hqChanName").val());
			var where="";
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
			}
			if(hqHrId!=''){
				where+= " AND HR_ID ='"+hqHrId+"'";
			}
			if(hqChanName!=''){
				where+= " AND HQ_CHAN_CODE ='"+hqChanName+"'";
			}
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){
					where+=" AND HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel,dealDate);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel,dealDate);
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

function getSql(where,orgLevel,dealDate){
	var sql="";
	if(orgLevel==1){
		sql="SELECT T.ROW_ID                                                                                 "+
		"      ,T.ROW_NAME                                                                               "+
		"      ,NVL(T.ALL_SR_DAY,0)   ALL_SR_DAY                                                         "+
		"      ,NVL(T.ALL_SR_MON,0)   ALL_SR_MON                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR_MON,0),NVL(T1.ALL_SR_MON,0),2) ALL_SR_HB                    "+
		"      ,0 RANK_ALL                                                                               "+
		"      ,NVL(T.YEAR_USER_SR_DAY,0) YEAR_USER_SR_DAY                                               "+
		"      ,NVL(T.YEAR_USER_SR_MON,0)  YEAR_USER_SR_MON                                              "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR_MON,0),NVL(T1.YEAR_USER_SR_MON,0),2) YEAR_USER_SR_HB  "+
		"      ,NVL(T.MON_USER_SR_DAY,0) MON_USER_SR_DAY                                                 "+
		"      ,NVL(T.MON_USER_SR_MON,0) MON_USER_SR_MON                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR_MON,0),NVL(T1.MON_USER_SR_MON,0),2) MON_USER_SR_HB     "+
		"      ,NVL(T.XYW_USER_SR_DAY,0) XYW_USER_SR_DAY                                                 "+
		"      ,NVL(T.XYW_USER_SR_MON,0) XYW_USER_SR_MON                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR_MON,0),NVL(T1.XYW_USER_SR_MON,0),2) XYW_USER_SR_HB     "+
		"FROM (                                                                                          "+
		"    SELECT DEAL_DATE                                                                            "+
		"          ,GROUP_ID_0    ROW_ID                                                                 "+
		"          ,'全省'  ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                            "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                            "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                      "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                      "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                       "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                       "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                       "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                       "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                       "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                    "+
		//"     --其他筛选条件                                                                           "+
		where +
		"    GROUP BY DEAL_DATE                                                                          "+
		"            ,GROUP_ID_0                                                                         "+
		")T                                                                                              "+
		"LEFT JOIN (                                                                                     "+
		"    SELECT DEAL_DATE                                                                            "+
		"          ,GROUP_ID_0      ROW_ID                                                               "+
		"          ,'全省'  ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                            "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                            "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                      "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                      "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                       "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                       "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                       "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                       "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')             "+
		//"    --其他筛选条件                                                                            "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                 "+
		"            ,GROUP_ID_0                                                                         "+
		")T1                                                                                             "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";                                         
	}else if(orgLevel==2){
		sql="SELECT T.ROW_ID                                                                                "+
		"      ,T.ROW_NAME                                                                              "+
		"      ,NVL(T.ALL_SR_DAY,0)   ALL_SR_DAY                                                        "+
		"      ,NVL(T.ALL_SR_MON,0)   ALL_SR_MON                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR_MON,0),NVL(T1.ALL_SR_MON,0),2) ALL_SR_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY T.ALL_SR_MON DESC) RANK_ALL               "+
		"      ,NVL(T.YEAR_USER_SR_DAY,0) YEAR_USER_SR_DAY                                              "+
		"      ,NVL(T.YEAR_USER_SR_MON,0)  YEAR_USER_SR_MON                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR_MON,0),NVL(T1.YEAR_USER_SR_MON,0),2) YEAR_USER_SR_HB "+
		"      ,NVL(T.MON_USER_SR_DAY,0) MON_USER_SR_DAY                                                "+
		"      ,NVL(T.MON_USER_SR_MON,0) MON_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR_MON,0),NVL(T1.MON_USER_SR_MON,0),2) MON_USER_SR_HB    "+
		"      ,NVL(T.XYW_USER_SR_DAY,0) XYW_USER_SR_DAY                                                "+
		"      ,NVL(T.XYW_USER_SR_MON,0) XYW_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR_MON,0),NVL(T1.XYW_USER_SR_MON,0),2) XYW_USER_SR_HB    "+
		"FROM (                                                                                         "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1       ROW_ID                                                             "+
		"          ,GROUP_ID_1_NAME  ROW_NAME                                                           "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                   "+
		//"     --其他筛选条件                                                                          "+
		where +
		"    GROUP BY DEAL_DATE                                                                         "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		")T                                                                                             "+
		"LEFT JOIN (                                                                                    "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1       ROW_ID                                                             "+
		"          ,GROUP_ID_1_NAME  ROW_NAME                                                           "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')            "+
		//"    --其他筛选条件                                                                           "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		")T1                                                                                            "+
		"ON(T.ROW_ID=T1.ROW_ID) ";
	}else if(orgLevel==3){
		sql="SELECT T.ROW_ID                                                                                "+
		"      ,T.ROW_NAME                                                                              "+
		"      ,NVL(T.ALL_SR_DAY,0)   ALL_SR_DAY                                                        "+
		"      ,NVL(T.ALL_SR_MON,0)   ALL_SR_MON                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR_MON,0),NVL(T1.ALL_SR_MON,0),2) ALL_SR_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY T.ALL_SR_MON DESC) RANK_ALL               "+
		"      ,NVL(T.YEAR_USER_SR_DAY,0) YEAR_USER_SR_DAY                                              "+
		"      ,NVL(T.YEAR_USER_SR_MON,0)  YEAR_USER_SR_MON                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR_MON,0),NVL(T1.YEAR_USER_SR_MON,0),2) YEAR_USER_SR_HB "+
		"      ,NVL(T.MON_USER_SR_DAY,0) MON_USER_SR_DAY                                                "+
		"      ,NVL(T.MON_USER_SR_MON,0) MON_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR_MON,0),NVL(T1.MON_USER_SR_MON,0),2) MON_USER_SR_HB    "+
		"      ,NVL(T.XYW_USER_SR_DAY,0) XYW_USER_SR_DAY                                                "+
		"      ,NVL(T.XYW_USER_SR_MON,0) XYW_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR_MON,0),NVL(T1.XYW_USER_SR_MON,0),2) XYW_USER_SR_HB    "+
		"FROM (                                                                                         "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID         ROW_ID                                                              "+
		"          ,UNIT_NAME       ROW_NAME                                                            "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                   "+
		//"     --其他筛选条件                                                                          "+
		where +
		"    GROUP BY DEAL_DATE                                                                         "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		")T                                                                                             "+
		"LEFT JOIN (                                                                                    "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID         ROW_ID                                                              "+
		"          ,UNIT_NAME       ROW_NAME                                                            "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')            "+
		//"    --其他筛选条件                                                                           "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		")T1                                                                                            "+
		"ON(T.ROW_ID=T1.ROW_ID) ";    
	}else if(orgLevel==4){
		sql="SELECT T.ROW_ID                                                                                "+
		"      ,T.ROW_NAME                                                                              "+
		"      ,NVL(T.ALL_SR_DAY,0)   ALL_SR_DAY                                                        "+
		"      ,NVL(T.ALL_SR_MON,0)   ALL_SR_MON                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR_MON,0),NVL(T1.ALL_SR_MON,0),2) ALL_SR_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY T.ALL_SR_MON DESC) RANK_ALL               "+
		"      ,NVL(T.YEAR_USER_SR_DAY,0) YEAR_USER_SR_DAY                                              "+
		"      ,NVL(T.YEAR_USER_SR_MON,0)  YEAR_USER_SR_MON                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR_MON,0),NVL(T1.YEAR_USER_SR_MON,0),2) YEAR_USER_SR_HB "+
		"      ,NVL(T.MON_USER_SR_DAY,0) MON_USER_SR_DAY                                                "+
		"      ,NVL(T.MON_USER_SR_MON,0) MON_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR_MON,0),NVL(T1.MON_USER_SR_MON,0),2) MON_USER_SR_HB    "+
		"      ,NVL(T.XYW_USER_SR_DAY,0) XYW_USER_SR_DAY                                                "+
		"      ,NVL(T.XYW_USER_SR_MON,0) XYW_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR_MON,0),NVL(T1.XYW_USER_SR_MON,0),2) XYW_USER_SR_HB    "+
		"FROM (                                                                                         "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID                                                                             "+
		"          ,UNIT_NAME                                                                           "+
		"          ,HR_ID                ROW_ID                                                         "+
		"          ,HQ_MANAGE_NAME       ROW_NAME   	                                                "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                   "+
		//"     --其他筛选条件                                                                          "+
		where +
		"    GROUP BY DEAL_DATE                                                                         "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		"            ,HR_ID                                                                             "+
		"            ,HQ_MANAGE_NAME                                                                    "+
		")T                                                                                             "+
		"LEFT JOIN (                                                                                    "+
		"    SELECT DEAL_DATE                                                                           "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID                                                                             "+
		"          ,UNIT_NAME                                                                           "+
		"          ,HR_ID                       ROW_ID                                                  "+
		"          ,HQ_MANAGE_NAME              ROW_NAME                                                "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')            "+
		//"    --其他筛选条件                                                                           "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		"            ,HR_ID                                                                             "+
		"            ,HQ_MANAGE_NAME                                                                    "+
		")T1                                                                                            "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";
	}else if(orgLevel==5){
		sql="SELECT " +
		"            T.GROUP_ID_1                                                                        "+
		"            ,T.GROUP_ID_1_NAME                                                                   "+
		"            ,T.UNIT_ID                                                                           "+
		"            ,T.UNIT_NAME                                                                         "+
		"            ,T.HR_ID                                                                             "+
		"            ,T.HQ_MANAGE_NAME                                                                    "+
		"      ,T.ROW_ID                                                                                "+
		"      ,T.ROW_NAME                                                                              "+
		"      ,NVL(T.ALL_SR_DAY,0)   ALL_SR_DAY                                                        "+
		"      ,NVL(T.ALL_SR_MON,0)   ALL_SR_MON                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR_MON,0),NVL(T1.ALL_SR_MON,0),2) ALL_SR_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY T.ALL_SR_MON DESC) RANK_ALL               "+
		"      ,NVL(T.YEAR_USER_SR_DAY,0) YEAR_USER_SR_DAY                                              "+
		"      ,NVL(T.YEAR_USER_SR_MON,0)  YEAR_USER_SR_MON                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR_MON,0),NVL(T1.YEAR_USER_SR_MON,0),2) YEAR_USER_SR_HB "+
		"      ,NVL(T.MON_USER_SR_DAY,0) MON_USER_SR_DAY                                                "+
		"      ,NVL(T.MON_USER_SR_MON,0) MON_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR_MON,0),NVL(T1.MON_USER_SR_MON,0),2) MON_USER_SR_HB    "+
		"      ,NVL(T.XYW_USER_SR_DAY,0) XYW_USER_SR_DAY                                                "+
		"      ,NVL(T.XYW_USER_SR_MON,0) XYW_USER_SR_MON                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR_MON,0),NVL(T1.XYW_USER_SR_MON,0),2) XYW_USER_SR_HB    "+
		"FROM (                                                                                         "+
		"    SELECT DEAL_DATE       	                                                                "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID                                                                             "+
		"          ,UNIT_NAME                                                                           "+
		"          ,HR_ID                                                                               "+
		"          ,HQ_MANAGE_NAME                                                                      "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                          "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                        "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                   "+
		//"    --其他筛选条件                                                                           "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		"            ,HR_ID                                                                             "+
		"            ,HQ_MANAGE_NAME                                                                    "+
		"            ,HQ_CHAN_CODE                                                                      "+
		"            ,GROUP_ID_4_NAME                                                                   "+
		")T                                                                                             "+
		"LEFT JOIN (                                                                                    "+
		"    SELECT DEAL_DATE       	                                                                "+
		"          ,GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                          "+
		"          ,GROUP_ID_1_NAME                                                                     "+
		"          ,UNIT_ID                                                                             "+
		"          ,UNIT_NAME                                                                           "+
		"          ,HR_ID                                                                               "+
		"          ,HQ_MANAGE_NAME                                                                      "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                          "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                        "+
		"          ,SUM(NVL(ALL_SR_DAY      ,0))   ALL_SR_DAY                                           "+
		"          ,SUM(NVL(ALL_SR_MON      ,0))   ALL_SR_MON                                           "+
		"          ,SUM(NVL(YEAR_USER_SR_DAY,0))   YEAR_USER_SR_DAY                                     "+
		"          ,SUM(NVL(YEAR_USER_SR_MON,0))   YEAR_USER_SR_MON                                     "+
		"          ,SUM(NVL(MON_USER_SR_DAY ,0))   MON_USER_SR_DAY                                      "+
		"          ,SUM(NVL(MON_USER_SR_MON ,0))   MON_USER_SR_MON                                      "+
		"          ,SUM(NVL(XYW_USER_SR_DAY ,0))   XYW_USER_SR_DAY                                      "+
		"          ,SUM(NVL(XYW_USER_SR_MON ,0))   XYW_USER_SR_MON                                      "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_DAY                                                      "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')            "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE       	                                                                "+
		"            ,GROUP_ID_0                                                                        "+
		"            ,GROUP_ID_1                                                                        "+
		"            ,GROUP_ID_1_NAME                                                                   "+
		"            ,UNIT_ID                                                                           "+
		"            ,UNIT_NAME                                                                         "+
		"            ,HR_ID                                                                             "+
		"            ,HQ_MANAGE_NAME                                                                    "+
		"            ,HQ_CHAN_CODE                                                                      "+
		"            ,GROUP_ID_4_NAME                                                                   "+
		")T1                                                                                            "+
		"ON(T.ROW_ID=T1.ROW_ID) ";
	}
	return sql;
}

function downsAll() {
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel="";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var hqHrId=$.trim($("#hqHrId").val());
	var hqChanName=$.trim($("#hqChanName").val());
	var where="";
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(hqHrId!=''){
		where+= " AND HQ_HR_ID ='"+hqHrId+"'";
	}
	if(hqChanName!=''){
		where+= " AND HQ_CHAN_CODE ='"+hqChanName+"'";
	}
	var downsql=getSql(where,5,dealDate);
	
	var title=[["地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称","出账收入总体情况","","","","包年用户收入","","","包月用户收入","","","校园网用户收入","",""],
			   ["","","","","","","","","当日出账收入","当月累计出账收入","","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入",""],
			   ["","","","","","","","","","本期","环比","排名","","本期","环比","","本期","环比","","本期","环比"]];
	showtext = "收入总体情况日报";
	downloadExcel(downsql,title,showtext);
}
