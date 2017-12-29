var report;
$(function(){
	var field=["ROW_NAME","ALL_SR","ALL_TB","ALL_HB","RANK_NUM","ALL_SR1","ALL_HB1","YEAR_USER_SR","YEAR_USER_TB","YEAR_USER_HB","YEAR_USER_SR1","YEAR_USER_HB1","MON_USER_SR","MON_USER_TB","MON_USER_HB","MON_USER_SR1","MON_USER_HB1","XYW_USER_SR","XYW_USER_TB","XYW_USER_HB","XYW_USER_SR1","XYW_USER_HB1"];
	var title=[["组织架构","出账收入总体情况","","","","","","包年用户收入","","","","","包月用户收入","","","","","校园网用户收入","","","",""],
			   ["","当月出账收入","","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入",""],
			   ["","本期","同比","环比","排名","本期","同比","本期","同比","环比","本期","同比","本期","同比","环比","本期","同比","本期","同比","环比","本期","同比"]];
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
		sql="SELECT T.ROW_ID                                                                                                                                                                   "+
		"      ,T.ROW_NAME                                                                                                                                                                 "+
		"      ,NVL(T.ALL_SR,0) ALL_SR                                                                                                                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T2.ALL_SR,0),2) ALL_TB                                                                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T1.ALL_SR,0),2) ALL_HB                                                                                                                 "+
		"      ,0  RANK_NUM                                                                                                                                                                "+
		"      ,NVL(T3.ALL_SR,0)  ALL_SR1                                                                                                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T3.ALL_SR,0),NVL(T4.ALL_SR,0),2) ALL_HB1                                                                                                               "+
		"      ,NVL(T.YEAR_USER_SR,0) YEAR_USER_SR                                                                                                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T2.YEAR_USER_SR,0),2) YEAR_USER_TB                                                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T1.YEAR_USER_SR,0),2) YEAR_USER_HB                                                                                               "+
		"      ,NVL(T3.YEAR_USER_SR,0)  YEAR_USER_SR1                                                                                                                                      "+
		"      ,PMRT.LINK_RATIO(NVL(T3.YEAR_USER_SR,0),NVL(T4.YEAR_USER_SR,0),2) YEAR_USER_HB1                                                                                             "+
		"      ,NVL(T.MON_USER_SR,0) MON_USER_SR                                                                                                                                           "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T2.MON_USER_SR,0),2) MON_USER_TB                                                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T1.MON_USER_SR,0),2) MON_USER_HB                                                                                                  "+
		"      ,NVL(T3.MON_USER_SR,0)  MON_USER_SR1                                                                                                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T3.MON_USER_SR,0),NVL(T4.MON_USER_SR,0),2) MON_USER_HB1                                                                                                "+
		"      ,NVL(T.XYW_USER_SR,0) XYW_USER_SR                                                                                                                                           "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T2.XYW_USER_SR,0),2) XYW_USER_TB                                                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T1.XYW_USER_SR,0),2) XYW_USER_HB                                                                                                  "+
		"      ,NVL(T3.XYW_USER_SR,0)  XYW_USER_SR1                                                                                                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T3.XYW_USER_SR,0),NVL(T4.XYW_USER_SR,0),2) XYW_USER_HB1                                                                                                "+
		"FROM (                                                                                                                                                                            "+
		"    SELECT DEAL_DATE                                                                                                                                                              "+
		"          ,GROUP_ID_0      ROW_ID                                                                                                                                                 "+
		"          ,'全省'          ROW_NAME                                                                                                                                               "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                                                                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                                                                                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                                                                                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                                                                                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                                                                                         "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                                                                                                        "+
		//"    --其他筛选条件                                                                                                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                                                                                                            "+
		"            ,GROUP_ID_0                                                                                                                                                           "+
		")T                                                                                                                                                                                "+
		"LEFT JOIN (                                                                                                                                                                       "+
		"    SELECT DEAL_DATE                                                                                                                                                              "+
		"          ,GROUP_ID_0     ROW_ID                                                                                                                                                  "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                                                                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                                                                                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                                                                                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                                                                                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                                                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                                                                     "+
		//"    --其他筛选条件                                                                                                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                                                                                                            "+
		"            ,GROUP_ID_0                                                                                                                                                           "+
		")T1                                                                                                                                                                               "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                                                                                            "+
		"LEFT JOIN (                                                                                                                                                                       "+
		"    SELECT DEAL_DATE                                                                                                                                                              "+
		"          ,GROUP_ID_0     ROW_ID                                                                                                                                                  "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                                                                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                                                                                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                                                                                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                                                                                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                                                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                                                                    "+
		//"    --其他筛选条件                                                                                                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                                                                                                            "+
		"            ,GROUP_ID_0                                                                                                                                                           "+
		")T2                                                                                                                                                                               "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                                                                                                            "+
		"LEFT JOIN (                                                                                                                                                                       "+
		"    SELECT GROUP_ID_0     ROW_ID                                                                                                                                                  "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                                                                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                                                                                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                                                                                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                                                                                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                                                                                         "+
		"    WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4)=SUBSTR("+dealDate+",1,4)                                                                                                          "+
		//"    --其他筛选条件                                                                                                                                                              "+
		where +
		"    GROUP BY GROUP_ID_0                                                                                                                                                           "+
		")T3                                                                                                                                                                               "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                                                                                                            "+
		"LEFT JOIN (                                                                                                                                                                       "+
		"    SELECT GROUP_ID_0     ROW_ID                                                                                                                                                  "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                                                                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                                                                                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                                                                                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                                                                                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                                                                                         "+
		"    WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4)=SUBSTR(TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM'),1,4)  "+
		//"   --其他筛选条件                                                                                                                                                               "+
		where +
		"    GROUP BY GROUP_ID_0                                                                                                                                                           "+
		")T4                                                                                                                                                                               "+
		"ON(T.ROW_ID=T4.ROW_ID) ";                                    
	}else if(orgLevel==2){
		sql="SELECT T.ROW_ID                                                                                  "+
		"      ,T.ROW_NAME                                                                                "+
		"      ,NVL(T.ALL_SR,0) ALL_SR                                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T2.ALL_SR,0),2) ALL_TB                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T1.ALL_SR,0),2) ALL_HB                                "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_SR,0) DESC)  RANK_NUM             "+
		"      ,NVL(T3.ALL_SR,0)  ALL_SR1                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T3.ALL_SR,0),NVL(T4.ALL_SR,0),2) ALL_HB1                              "+
		"      ,NVL(T.YEAR_USER_SR,0) YEAR_USER_SR                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T2.YEAR_USER_SR,0),2) YEAR_USER_TB              "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T1.YEAR_USER_SR,0),2) YEAR_USER_HB              "+
		"      ,NVL(T3.YEAR_USER_SR,0)  YEAR_USER_SR1                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T3.YEAR_USER_SR,0),NVL(T4.YEAR_USER_SR,0),2) YEAR_USER_HB1            "+
		"      ,NVL(T.MON_USER_SR,0) MON_USER_SR                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T2.MON_USER_SR,0),2) MON_USER_TB                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T1.MON_USER_SR,0),2) MON_USER_HB                 "+
		"      ,NVL(T3.MON_USER_SR,0)  MON_USER_SR1                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T3.MON_USER_SR,0),NVL(T4.MON_USER_SR,0),2) MON_USER_HB1               "+
		"      ,NVL(T.XYW_USER_SR,0) XYW_USER_SR                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T2.XYW_USER_SR,0),2) XYW_USER_TB                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T1.XYW_USER_SR,0),2) XYW_USER_HB                 "+
		"      ,NVL(T3.XYW_USER_SR,0)  XYW_USER_SR1                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T3.XYW_USER_SR,0),NVL(T4.XYW_USER_SR,0),2) XYW_USER_HB1               "+
		"FROM (                                                                                           "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1      ROW_ID                                                                "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                              "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                       "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		")T                                                                                               "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1      ROW_ID                                                                "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                              "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                    "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		")T1                                                                                              "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1      ROW_ID                                                                "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                              "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                   "+
		//"                                                                                               "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		")T2                                                                                              "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1      ROW_ID                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4)=SUBSTR("+dealDate+",1,4)                         "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		")T3                                                                                              "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1      ROW_ID                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                  "+
		"AND SUBSTR(DEAL_DATE,1,4)=SUBSTR(TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM'),1,4) "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		")T4                                                                                              "+
		"ON(T.ROW_ID=T4.ROW_ID) ";
	}else if(orgLevel==3){
		sql="SELECT T.ROW_ID                                                                                    "+
		"      ,T.ROW_NAME                                                                                  "+
		"      ,NVL(T.ALL_SR,0) ALL_SR                                                                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T2.ALL_SR,0),2) ALL_TB                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T1.ALL_SR,0),2) ALL_HB                                  "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_SR,0) DESC)  RANK_NUM               "+
		"      ,NVL(T3.ALL_SR,0)  ALL_SR1                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T3.ALL_SR,0),NVL(T4.ALL_SR,0),2) ALL_HB1                                "+
		"      ,NVL(T.YEAR_USER_SR,0) YEAR_USER_SR                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T2.YEAR_USER_SR,0),2) YEAR_USER_TB                "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T1.YEAR_USER_SR,0),2) YEAR_USER_HB                "+
		"      ,NVL(T3.YEAR_USER_SR,0)  YEAR_USER_SR1                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T3.YEAR_USER_SR,0),NVL(T4.YEAR_USER_SR,0),2) YEAR_USER_HB1              "+
		"      ,NVL(T.MON_USER_SR,0) MON_USER_SR                                                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T2.MON_USER_SR,0),2) MON_USER_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T1.MON_USER_SR,0),2) MON_USER_HB                   "+
		"      ,NVL(T3.MON_USER_SR,0)  MON_USER_SR1                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T3.MON_USER_SR,0),NVL(T4.MON_USER_SR,0),2) MON_USER_HB1                 "+
		"      ,NVL(T.XYW_USER_SR,0) XYW_USER_SR                                                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T2.XYW_USER_SR,0),2) XYW_USER_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T1.XYW_USER_SR,0),2) XYW_USER_HB                   "+
		"      ,NVL(T3.XYW_USER_SR,0)  XYW_USER_SR1                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T3.XYW_USER_SR,0),NVL(T4.XYW_USER_SR,0),2) XYW_USER_HB1                 "+
		"FROM (                                                                                             "+
		"    SELECT DEAL_DATE                                                                               "+
		"          ,GROUP_ID_0                                                                              "+
		"          ,GROUP_ID_1                                                                              "+
		"          ,GROUP_ID_1_NAME                                                                         "+
		"          ,UNIT_ID         ROW_ID                                                                  "+
		"          ,UNIT_NAME       ROW_NAME                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                 "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                           "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                            "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                            "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                          "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                         "+
		//"    --其他筛选条件                                                                               "+
		where +
		"    GROUP BY DEAL_DATE                                                                             "+
		"            ,GROUP_ID_0                                                                            "+
		"            ,GROUP_ID_1                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                       "+
		"            ,UNIT_ID                                                                               "+
		"            ,UNIT_NAME                                                                             "+
		")T                                                                                                 "+
		"LEFT JOIN (                                                                                        "+
		"    SELECT DEAL_DATE                                                                               "+
		"          ,GROUP_ID_0                                                                              "+
		"          ,GROUP_ID_1                                                                              "+
		"          ,GROUP_ID_1_NAME                                                                         "+
		"          ,UNIT_ID         ROW_ID                                                                  "+
		"          ,UNIT_NAME       ROW_NAME                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                 "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                           "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                            "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                            "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                      "+
		//"    --其他筛选条件                                                                               "+
		where +
		"    GROUP BY DEAL_DATE                                                                             "+
		"            ,GROUP_ID_0                                                                            "+
		"            ,GROUP_ID_1                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                       "+
		"            ,UNIT_ID                                                                               "+
		"            ,UNIT_NAME                                                                             "+
		")T1                                                                                                "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                             "+
		"LEFT JOIN (                                                                                        "+
		"    SELECT DEAL_DATE                                                                               "+
		"          ,GROUP_ID_0                                                                              "+
		"          ,GROUP_ID_1                                                                              "+
		"          ,GROUP_ID_1_NAME                                                                         "+
		"          ,UNIT_ID                    ROW_ID                                                       "+
		"          ,UNIT_NAME                  ROW_NAME                                                     "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                 "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                           "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                            "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                            "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                     "+
		//"    --其他筛选条件                                                                                 "+
		where +
		"    GROUP BY DEAL_DATE                                                                             "+
		"            ,GROUP_ID_0                                                                            "+
		"            ,GROUP_ID_1                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                       "+
		"            ,UNIT_ID                                                                               "+
		"            ,UNIT_NAME                                                                             "+
		")T2                                                                                                "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                             "+
		"LEFT JOIN (                                                                                        "+
		"    SELECT GROUP_ID_0                                                                              "+
		"          ,GROUP_ID_1                                                                              "+
		"          ,UNIT_ID         ROW_ID                                                                  "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                 "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                           "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                            "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                            "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                          "+
		"    WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4)=SUBSTR("+dealDate+",1,4)                           "+
		//"    --其他筛选条件                                                                                 "+
		where +
		"    GROUP BY GROUP_ID_0                                                                            "+
		"            ,GROUP_ID_1                                                                            "+
		"            ,UNIT_ID                                                                               "+
		")T3                                                                                                "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                             "+
		"LEFT JOIN (                                                                                        "+
		"    SELECT GROUP_ID_0                                                                              "+
		"          ,GROUP_ID_1                                                                              "+
		"          ,UNIT_ID        ROW_ID                                                                   "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                 "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                           "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                            "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                            "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                          "+
		"    WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                    "+
		"AND SUBSTR(DEAL_DATE,1,4)=SUBSTR(TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM'),1,4)   "+
		//"    --其他筛选条件                                                                                 "+
		where +
		"    GROUP BY GROUP_ID_0                                                                            "+
		"            ,GROUP_ID_1                                                                            "+
		"            ,UNIT_ID                                                                               "+
		")T4                                                                                                "+
		"ON(T.ROW_ID=T4.ROW_ID)  "; 
	}else if(orgLevel==4){
		sql="SELECT T.ROW_ID                                                                                  "+
		"      ,T.ROW_NAME                                                                                "+
		"      ,NVL(T.ALL_SR,0) ALL_SR                                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T2.ALL_SR,0),2) ALL_TB                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T1.ALL_SR,0),2) ALL_HB                                "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_SR,0) DESC)  RANK_NUM             "+
		"      ,NVL(T3.ALL_SR,0)  ALL_SR1                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T3.ALL_SR,0),NVL(T4.ALL_SR,0),2) ALL_HB1                              "+
		"      ,NVL(T.YEAR_USER_SR,0) YEAR_USER_SR                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T2.YEAR_USER_SR,0),2) YEAR_USER_TB              "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T1.YEAR_USER_SR,0),2) YEAR_USER_HB              "+
		"      ,NVL(T3.YEAR_USER_SR,0)  YEAR_USER_SR1                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T3.YEAR_USER_SR,0),NVL(T4.YEAR_USER_SR,0),2) YEAR_USER_HB1            "+
		"      ,NVL(T.MON_USER_SR,0) MON_USER_SR                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T2.MON_USER_SR,0),2) MON_USER_TB                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T1.MON_USER_SR,0),2) MON_USER_HB                 "+
		"      ,NVL(T3.MON_USER_SR,0)  MON_USER_SR1                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T3.MON_USER_SR,0),NVL(T4.MON_USER_SR,0),2) MON_USER_HB1               "+
		"      ,NVL(T.XYW_USER_SR,0) XYW_USER_SR                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T2.XYW_USER_SR,0),2) XYW_USER_TB                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T1.XYW_USER_SR,0),2) XYW_USER_HB                 "+
		"      ,NVL(T3.XYW_USER_SR,0)  XYW_USER_SR1                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T3.XYW_USER_SR,0),NVL(T4.XYW_USER_SR,0),2) XYW_USER_HB1               "+
		"FROM (                                                                                           "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,GROUP_ID_1_NAME                                                                       "+
		"          ,UNIT_ID                                                                               "+
		"          ,UNIT_NAME                                                                             "+
		"          ,HR_ID           ROW_ID                                                                "+
		"          ,HQ_MANAGE_NAME  ROW_NAME                                                              "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                       "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		"            ,UNIT_ID                                                                             "+
		"            ,UNIT_NAME                                                                           "+
		"            ,HR_ID                                                                               "+
		"            ,HQ_MANAGE_NAME                                                                      "+
		")T                                                                                               "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,GROUP_ID_1_NAME                                                                       "+
		"          ,UNIT_ID                                                                               "+
		"          ,UNIT_NAME                                                                             "+
		"          ,HR_ID           ROW_ID                                                                "+
		"          ,HQ_MANAGE_NAME  ROW_NAME                                                              "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                    "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		"            ,UNIT_ID                                                                             "+
		"            ,UNIT_NAME                                                                           "+
		"            ,HR_ID                                                                               "+
		"            ,HQ_MANAGE_NAME                                                                      "+
		")T1                                                                                              "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,GROUP_ID_1_NAME                                                                       "+
		"          ,UNIT_ID                                                                               "+
		"          ,UNIT_NAME                                                                             "+
		"          ,HR_ID                      ROW_ID                                                     "+
		"          ,HQ_MANAGE_NAME             ROW_NAME                                                   "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                   "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		"            ,UNIT_ID                                                                             "+
		"            ,UNIT_NAME                                                                           "+
		"            ,HR_ID                                                                               "+
		"            ,HQ_MANAGE_NAME                                                                      "+
		")T2                                                                                              "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,UNIT_ID                                                                               "+
		"          ,HR_ID           ROW_ID                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4)=SUBSTR("+dealDate+",1,4)                         "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,UNIT_ID                                                                             "+
		"            ,HR_ID                                                                               "+
		")T3                                                                                              "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                           "+
		"LEFT JOIN (                                                                                      "+
		"    SELECT GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,UNIT_ID                                                                               "+
		"          ,HR_ID           ROW_ID                                                                "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                               "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                         "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                          "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                          "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                        "+
		"    WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                  "+
		"AND SUBSTR(DEAL_DATE,1,4)=SUBSTR(TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM'),1,4) "+
		//"    --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,UNIT_ID                                                                             "+
		"            ,HR_ID                                                                               "+
		")T4                                                                                              "+
		"ON(T.ROW_ID=T4.ROW_ID)  ";
	}else if(orgLevel==5){
		sql="SELECT " +
		"          T.GROUP_ID_1                                                                             "+
		"          ,T.GROUP_ID_1_NAME                                                                        "+
		"          ,T.UNIT_ID                                                                                "+
		"          ,T.UNIT_NAME                                                                              "+
		"          ,T.HR_ID                                                                                  "+
		"          ,T.HQ_MANAGE_NAME                                                                         "+
		"      ,T.ROW_ID                                                                                   "+
		"      ,T.ROW_NAME                                                                                 "+
		"      ,NVL(T.ALL_SR,0) ALL_SR                                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T2.ALL_SR,0),2) ALL_TB                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_SR,0),NVL(T1.ALL_SR,0),2) ALL_HB                                 "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_SR,0) DESC)  RANK_NUM              "+
		"      ,NVL(T3.ALL_SR,0)  ALL_SR1                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T3.ALL_SR,0),NVL(T4.ALL_SR,0),2) ALL_HB1                               "+
		"      ,NVL(T.YEAR_USER_SR,0) YEAR_USER_SR                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T2.YEAR_USER_SR,0),2) YEAR_USER_TB               "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_SR,0),NVL(T1.YEAR_USER_SR,0),2) YEAR_USER_HB               "+
		"      ,NVL(T3.YEAR_USER_SR,0)  YEAR_USER_SR1                                                      "+
		"      ,PMRT.LINK_RATIO(NVL(T3.YEAR_USER_SR,0),NVL(T4.YEAR_USER_SR,0),2) YEAR_USER_HB1             "+
		"      ,NVL(T.MON_USER_SR,0) MON_USER_SR                                                           "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T2.MON_USER_SR,0),2) MON_USER_TB                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_SR,0),NVL(T1.MON_USER_SR,0),2) MON_USER_HB                  "+
		"      ,NVL(T3.MON_USER_SR,0)  MON_USER_SR1                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T3.MON_USER_SR,0),NVL(T4.MON_USER_SR,0),2) MON_USER_HB1                "+
		"      ,NVL(T.XYW_USER_SR,0) XYW_USER_SR                                                           "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T2.XYW_USER_SR,0),2) XYW_USER_TB                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_USER_SR,0),NVL(T1.XYW_USER_SR,0),2) XYW_USER_HB                  "+
		"      ,NVL(T3.XYW_USER_SR,0)  XYW_USER_SR1                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T3.XYW_USER_SR,0),NVL(T4.XYW_USER_SR,0),2) XYW_USER_HB1                "+
		"FROM (                                                                                            "+
		"    SELECT DEAL_DATE                                                                              "+
		"          ,GROUP_ID_0                                                                             "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,GROUP_ID_1_NAME                                                                        "+
		"          ,UNIT_ID                                                                                "+
		"          ,UNIT_NAME                                                                              "+
		"          ,HR_ID                                                                                  "+
		"          ,HQ_MANAGE_NAME                                                                         "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                             "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                           "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                         "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                        "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                            "+
		"            ,GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                      "+
		"            ,UNIT_ID                                                                              "+
		"            ,UNIT_NAME                                                                            "+
		"            ,HR_ID                                                                                "+
		"            ,HQ_MANAGE_NAME                                                                       "+
		"            ,HQ_CHAN_CODE                                                                         "+
		"            ,GROUP_ID_4_NAME                                                                      "+
		")T                                                                                                "+
		"LEFT JOIN (                                                                                       "+
		"    SELECT DEAL_DATE                                                                              "+
		"          ,GROUP_ID_0                                                                             "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,GROUP_ID_1_NAME                                                                        "+
		"          ,UNIT_ID                                                                                "+
		"          ,UNIT_NAME                                                                              "+
		"          ,HR_ID                                                                                  "+
		"          ,HQ_MANAGE_NAME                                                                         "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                             "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                           "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                     "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                            "+
		"            ,GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                      "+
		"            ,UNIT_ID                                                                              "+
		"            ,UNIT_NAME                                                                            "+
		"            ,HR_ID                                                                                "+
		"            ,HQ_MANAGE_NAME                                                                       "+
		"            ,HQ_CHAN_CODE                                                                         "+
		"            ,GROUP_ID_4_NAME                                                                      "+
		")T1                                                                                               "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                            "+
		"LEFT JOIN (                                                                                       "+
		"    SELECT DEAL_DATE                                                                              "+
		"          ,GROUP_ID_0                                                                             "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,GROUP_ID_1_NAME                                                                        "+
		"          ,UNIT_ID                                                                                "+
		"          ,UNIT_NAME                                                                              "+
		"          ,HR_ID                                                                                  "+
		"          ,HQ_MANAGE_NAME                                                                         "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                             "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                           "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                    "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY DEAL_DATE                                                                            "+
		"            ,GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                      "+
		"            ,UNIT_ID                                                                              "+
		"            ,UNIT_NAME                                                                            "+
		"            ,HR_ID                                                                                "+
		"            ,HQ_MANAGE_NAME                                                                       "+
		"            ,HQ_CHAN_CODE                                                                         "+
		"            ,GROUP_ID_4_NAME                                                                      "+
		")T2                                                                                               "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                            "+
		"LEFT JOIN (                                                                                       "+
		"    SELECT GROUP_ID_0                                                                             "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,UNIT_ID                                                                                "+
		"          ,HR_ID                                                                                  "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                             "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                         "+
		"    WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4)=SUBSTR("+dealDate+",1,4)                          "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,UNIT_ID                                                                              "+
		"            ,HR_ID                                                                                "+
		"            ,HQ_CHAN_CODE                                                                         "+
		")T3                                                                                               "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                            "+
		"LEFT JOIN (                                                                                       "+
		"    SELECT GROUP_ID_0                                                                             "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,UNIT_ID                                                                                "+
		"          ,HR_ID                                                                                  "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                             "+
		"          ,SUM(NVL(ALL_SR      ,0))         ALL_SR                                                "+
		"          ,SUM(NVL(YEAR_USER_SR      ,0))   YEAR_USER_SR                                          "+
		"          ,SUM(NVL(MON_USER_SR,0))          MON_USER_SR                                           "+
		"          ,SUM(NVL(XYW_USER_SR,0))          XYW_USER_SR                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                         "+
		"    WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                   "+
		"AND SUBSTR(DEAL_DATE,1,4)=SUBSTR(TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM'),1,4)  "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,UNIT_ID                                                                              "+
		"            ,HR_ID                                                                                "+
		"            ,HQ_CHAN_CODE                                                                         "+
		")T4                                                                                               "+
		"ON(T.ROW_ID=T4.ROW_ID) ";
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
	
	var title=[["地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称","出账收入总体情况","","","","","","包年用户收入","","","","","包月用户收入","","","","","校园网用户收入","","","",""],
			   ["","","","","","","","","当月出账收入","","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入","","当月出账收入","","","当年累计出账收入",""],
			   ["","","","","","","","","本期","同比","环比","排名","本期","同比","本期","同比","环比","本期","同比","本期","同比","环比","本期","同比","本期","同比","环比","本期","同比"]];
	showtext = "收入总体情况月报";
	downloadExcel(downsql,title,showtext);
}
