var report;
$(function(){
	var field=["ROW_NAME","ALL_INNET_NUM","ALL_INNET_TB","ALL_INNET_HB","RANK_INNET","ALL_ACCT_NUM","ALL_ACCT_TB","ALL_ACCT_HB","RANK_ACCT","ALL_DEV_NUM","ALL_DEV_TB","ALL_DEV_HB","RANK_DEV","ALL_CJ_NUM","ALL_CJ_TB","ALL_CJ_HB","RANK_CJ","YEAR_USER_INNET_NUM","YEAR_USER_INNET_TB","YEAR_USER_INNET_HB","MON_USER_INNET_NUM","MON_USER_INNET_TB","MON_USER_INNET_HB","XYW_INNET_NUM","XYW_INNET_TB","XYW_INNET_HB","YEAR_USER_ACCT_NUM","YEAR_USER_ACCT_TB","YEAR_USER_ACCT_HB","MON_USER_ACCT_NUM","MON_USER_ACCT_TB","MON_USER_ACCT_HB","XYW_ACCT_NUM","XYW_ACCT_TB","XYW_ACCT_HB","YEAR_USER_DEV_NUM","YEAR_USER_DEV_TB","YEAR_USER_DEV_HB","MON_USER_DEV_NUM","MON_USER_DEV_TB","MON_USER_DEV_HB","XYW_DEV_NUM","XYW_DEV_TB","XYW_DEV_HB","YEAR_USER_CJ_NUM","YEAR_USER_CJ_TB","YEAR_USER_CJ_HB","MON_USER_CJ_NUM","MON_USER_CJ_TB","MON_USER_CJ_HB","XYW_CJ_NUM","XYW_CJ_TB","XYW_CJ_HB"];
	var title=[["组织架构","用户总体情况","","","","","","","","","","","","","","","","在网用户情况","","","","","","","","","出账用户情况","","","","","","","","","新增用户情况","","","","","","","","","拆机用户情况","","","","","","","",""],
			   ["","在网用户","","","","出账用户数","","","","新增用户数","","","","拆机用户数","","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","",""],
			   ["","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比"]];
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
		sql="SELECT T.ROW_ID                                                                                          "+
		"      ,T.ROW_NAME                                                                                        "+
		"      ,NVL(T.ALL_INNET_NUM,0) ALL_INNET_NUM                                                              "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T2.ALL_INNET_NUM,0),2) ALL_INNET_TB                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T1.ALL_INNET_NUM,0),2) ALL_INNET_HB                    "+
		"      ,0  RANK_INNET                                                                                     "+
		"      ,NVL(T.ALL_ACCT_NUM,0) ALL_ACCT_NUM                                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T2.ALL_ACCT_NUM,0),2) ALL_ACCT_TB                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T1.ALL_ACCT_NUM,0),2) ALL_ACCT_HB                       "+
		"      ,0  RANK_ACCT                                                                                      "+
		"      ,NVL(T.ALL_DEV_NUM,0) ALL_DEV_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T2.ALL_DEV_NUM,0),2) ALL_DEV_TB                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T1.ALL_DEV_NUM,0),2) ALL_DEV_HB                          "+
		"      ,0  RANK_DEV                                                                                       "+
		"      ,NVL(T.ALL_CJ_NUM,0) ALL_CJ_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T2.ALL_CJ_NUM,0),2) ALL_CJ_TB                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T1.ALL_CJ_NUM,0),2) ALL_CJ_HB                             "+
		"      ,0  RANK_CJ                                                                                        "+
		"      ,NVL(T.YEAR_USER_INNET_NUM,0) YEAR_USER_INNET_NUM                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T2.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_TB  "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T1.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_HB  "+
		"      ,NVL(T.MON_USER_INNET_NUM,0) MON_USER_INNET_NUM                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T2.MON_USER_INNET_NUM,0),2) MON_USER_INNET_TB     "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T1.MON_USER_INNET_NUM,0),2) MON_USER_INNET_HB     "+
		"      ,NVL(T.XYW_INNET_NUM,0) XYW_INNET_NUM                                                              "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T2.XYW_INNET_NUM,0),2) XYW_INNET_TB                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T1.XYW_INNET_NUM,0),2) XYW_INNET_HB                    "+
		"      ,NVL(T.YEAR_USER_ACCT_NUM,0) YEAR_USER_ACCT_NUM                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T2.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_TB     "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T1.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_HB     "+
		"      ,NVL(T.MON_USER_ACCT_NUM,0) MON_USER_ACCT_NUM                                                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T2.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_TB        "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T1.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_HB        "+
		"      ,NVL(T.XYW_ACCT_NUM,0) XYW_ACCT_NUM                                                                "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T2.XYW_ACCT_NUM,0),2) XYW_ACCT_TB                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T1.XYW_ACCT_NUM,0),2) XYW_ACCT_HB                       "+
		"      ,NVL(T.YEAR_USER_DEV_NUM,0) YEAR_USER_DEV_NUM                                                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T2.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_TB        "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T1.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_HB        "+
		"      ,NVL(T.MON_USER_DEV_NUM,0) MON_USER_DEV_NUM                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T2.MON_USER_DEV_NUM,0),2) MON_USER_DEV_TB           "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T1.MON_USER_DEV_NUM,0),2) MON_USER_DEV_HB           "+
		"      ,NVL(T.XYW_DEV_NUM,0) XYW_DEV_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T2.XYW_DEV_NUM,0),2) XYW_DEV_TB                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T1.XYW_DEV_NUM,0),2) XYW_DEV_HB                          "+
		"      ,NVL(T.YEAR_USER_CJ_NUM,0) YEAR_USER_CJ_NUM                                                        "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T2.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_TB           "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T1.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_HB           "+
		"      ,NVL(T.MON_USER_CJ_NUM,0) MON_USER_CJ_NUM                                                          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T2.MON_USER_CJ_NUM,0),2) MON_USER_CJ_TB              "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T1.MON_USER_CJ_NUM,0),2) MON_USER_CJ_HB              "+
		"      ,NVL(T.XYW_CJ_NUM,0) XYW_CJ_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T2.XYW_CJ_NUM,0),2) XYW_CJ_TB                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T1.XYW_CJ_NUM,0),2) XYW_CJ_HB                             "+
		"FROM (                                                                                                   "+
		"    SELECT DEAL_DATE                                                                                     "+
		"          ,GROUP_ID_0     ROW_ID                                                                         "+
		"          ,'全省' ROW_NAME                                                                               "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                                "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                 "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                  "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                   "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                     "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                       "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                            "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                         "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                              "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                           "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                                "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                               "+
		//"    --其他筛选条件                                                                                     "+
		where +
		"    GROUP BY DEAL_DATE                                                                                   "+
		"            ,GROUP_ID_0                                                                                  "+
		")T                                                                                                       "+
		"LEFT JOIN (                                                                                              "+
		"    SELECT DEAL_DATE                                                                                     "+
		"          ,GROUP_ID_0     ROW_ID                                                                         "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                                "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                 "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                  "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                   "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                     "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                       "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                            "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                         "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                              "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                           "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                                "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                            "+
		//"    --其他筛选条件                                                                                     "+
		where +
		"    GROUP BY DEAL_DATE                                                                                   "+
		"            ,GROUP_ID_0                                                                                  "+
		")T1                                                                                                      "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                   "+
		"LEFT JOIN (                                                                                              "+
		"    SELECT DEAL_DATE                                                                                     "+
		"          ,GROUP_ID_0     ROW_ID                                                                         "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                                "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                 "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                  "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                   "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                     "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                       "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                            "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                         "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                              "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                           "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                                "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                                "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                           "+
		//"    --其他筛选条件                                                                                     "+
		where +
		"    GROUP BY DEAL_DATE                                                                                   "+
		"            ,GROUP_ID_0                                                                                  "+
		")T2                                                                                                      "+
		"ON(T.ROW_ID=T2.ROW_ID)  ";                               
	}else if(orgLevel==2){
		sql="SELECT T.ROW_ID                                                                                         "+
		"      ,T.ROW_NAME                                                                                       "+
		"      ,NVL(T.ALL_INNET_NUM,0) ALL_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T2.ALL_INNET_NUM,0),2) ALL_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T1.ALL_INNET_NUM,0),2) ALL_INNET_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_INNET_NUM,0) DESC)  RANK_INNET           "+
		"      ,NVL(T.ALL_ACCT_NUM,0) ALL_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T2.ALL_ACCT_NUM,0),2) ALL_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T1.ALL_ACCT_NUM,0),2) ALL_ACCT_HB                      "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_ACCT_NUM,0) DESC)  RANK_ACCT             "+
		"      ,NVL(T.ALL_DEV_NUM,0) ALL_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T2.ALL_DEV_NUM,0),2) ALL_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T1.ALL_DEV_NUM,0),2) ALL_DEV_HB                         "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_DEV_NUM,0) DESC)  RANK_DEV               "+
		"      ,NVL(T.ALL_CJ_NUM,0) ALL_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T2.ALL_CJ_NUM,0),2) ALL_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T1.ALL_CJ_NUM,0),2) ALL_CJ_HB                            "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_CJ_NUM,0) DESC)  RANK_CJ                 "+
		"      ,NVL(T.YEAR_USER_INNET_NUM,0) YEAR_USER_INNET_NUM                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T2.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_TB "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T1.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_HB "+
		"      ,NVL(T.MON_USER_INNET_NUM,0) MON_USER_INNET_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T2.MON_USER_INNET_NUM,0),2) MON_USER_INNET_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T1.MON_USER_INNET_NUM,0),2) MON_USER_INNET_HB    "+
		"      ,NVL(T.XYW_INNET_NUM,0) XYW_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T2.XYW_INNET_NUM,0),2) XYW_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T1.XYW_INNET_NUM,0),2) XYW_INNET_HB                   "+
		"      ,NVL(T.YEAR_USER_ACCT_NUM,0) YEAR_USER_ACCT_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T2.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T1.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_HB    "+
		"      ,NVL(T.MON_USER_ACCT_NUM,0) MON_USER_ACCT_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T2.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T1.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_HB       "+
		"      ,NVL(T.XYW_ACCT_NUM,0) XYW_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T2.XYW_ACCT_NUM,0),2) XYW_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T1.XYW_ACCT_NUM,0),2) XYW_ACCT_HB                      "+
		"      ,NVL(T.YEAR_USER_DEV_NUM,0) YEAR_USER_DEV_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T2.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T1.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_HB       "+
		"      ,NVL(T.MON_USER_DEV_NUM,0) MON_USER_DEV_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T2.MON_USER_DEV_NUM,0),2) MON_USER_DEV_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T1.MON_USER_DEV_NUM,0),2) MON_USER_DEV_HB          "+
		"      ,NVL(T.XYW_DEV_NUM,0) XYW_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T2.XYW_DEV_NUM,0),2) XYW_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T1.XYW_DEV_NUM,0),2) XYW_DEV_HB                         "+
		"      ,NVL(T.YEAR_USER_CJ_NUM,0) YEAR_USER_CJ_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T2.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T1.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_HB          "+
		"      ,NVL(T.MON_USER_CJ_NUM,0) MON_USER_CJ_NUM                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T2.MON_USER_CJ_NUM,0),2) MON_USER_CJ_TB             "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T1.MON_USER_CJ_NUM,0),2) MON_USER_CJ_HB             "+
		"      ,NVL(T.XYW_CJ_NUM,0) XYW_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T2.XYW_CJ_NUM,0),2) XYW_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T1.XYW_CJ_NUM,0),2) XYW_CJ_HB                            "+
		"FROM (                                                                                                  "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1      ROW_ID                                                                       "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                              "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		")T                                                                                                      "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1      ROW_ID                                                                       "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                           "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		")T1                                                                                                     "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                  "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1      ROW_ID                                                                       "+
		"          ,GROUP_ID_1_NAME ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                          "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		")T2                                                                                                     "+
		"ON(T.ROW_ID=T2.ROW_ID) ";
	}else if(orgLevel==3){
		sql=  "SELECT T.ROW_ID                                                                                         "+
		"      ,T.ROW_NAME                                                                                       "+
		"      ,NVL(T.ALL_INNET_NUM,0) ALL_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T2.ALL_INNET_NUM,0),2) ALL_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T1.ALL_INNET_NUM,0),2) ALL_INNET_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_INNET_NUM,0) DESC)  RANK_INNET           "+
		"      ,NVL(T.ALL_ACCT_NUM,0) ALL_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T2.ALL_ACCT_NUM,0),2) ALL_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T1.ALL_ACCT_NUM,0),2) ALL_ACCT_HB                      "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_ACCT_NUM,0) DESC)  RANK_ACCT             "+
		"      ,NVL(T.ALL_DEV_NUM,0) ALL_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T2.ALL_DEV_NUM,0),2) ALL_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T1.ALL_DEV_NUM,0),2) ALL_DEV_HB                         "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_DEV_NUM,0) DESC)  RANK_DEV               "+
		"      ,NVL(T.ALL_CJ_NUM,0) ALL_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T2.ALL_CJ_NUM,0),2) ALL_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T1.ALL_CJ_NUM,0),2) ALL_CJ_HB                            "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_CJ_NUM,0) DESC)  RANK_CJ                 "+
		"      ,NVL(T.YEAR_USER_INNET_NUM,0) YEAR_USER_INNET_NUM                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T2.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_TB "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T1.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_HB "+
		"      ,NVL(T.MON_USER_INNET_NUM,0) MON_USER_INNET_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T2.MON_USER_INNET_NUM,0),2) MON_USER_INNET_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T1.MON_USER_INNET_NUM,0),2) MON_USER_INNET_HB    "+
		"      ,NVL(T.XYW_INNET_NUM,0) XYW_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T2.XYW_INNET_NUM,0),2) XYW_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T1.XYW_INNET_NUM,0),2) XYW_INNET_HB                   "+
		"      ,NVL(T.YEAR_USER_ACCT_NUM,0) YEAR_USER_ACCT_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T2.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T1.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_HB    "+
		"      ,NVL(T.MON_USER_ACCT_NUM,0) MON_USER_ACCT_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T2.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T1.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_HB       "+
		"      ,NVL(T.XYW_ACCT_NUM,0) XYW_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T2.XYW_ACCT_NUM,0),2) XYW_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T1.XYW_ACCT_NUM,0),2) XYW_ACCT_HB                      "+
		"      ,NVL(T.YEAR_USER_DEV_NUM,0) YEAR_USER_DEV_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T2.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T1.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_HB       "+
		"      ,NVL(T.MON_USER_DEV_NUM,0) MON_USER_DEV_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T2.MON_USER_DEV_NUM,0),2) MON_USER_DEV_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T1.MON_USER_DEV_NUM,0),2) MON_USER_DEV_HB          "+
		"      ,NVL(T.XYW_DEV_NUM,0) XYW_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T2.XYW_DEV_NUM,0),2) XYW_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T1.XYW_DEV_NUM,0),2) XYW_DEV_HB                         "+
		"      ,NVL(T.YEAR_USER_CJ_NUM,0) YEAR_USER_CJ_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T2.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T1.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_HB          "+
		"      ,NVL(T.MON_USER_CJ_NUM,0) MON_USER_CJ_NUM                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T2.MON_USER_CJ_NUM,0),2) MON_USER_CJ_TB             "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T1.MON_USER_CJ_NUM,0),2) MON_USER_CJ_HB             "+
		"      ,NVL(T.XYW_CJ_NUM,0) XYW_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T2.XYW_CJ_NUM,0),2) XYW_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T1.XYW_CJ_NUM,0),2) XYW_CJ_HB                            "+
		"FROM (                                                                                                  "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID         ROW_ID                                                                       "+
		"          ,UNIT_NAME       ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                              "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		")T                                                                                                      "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID         ROW_ID                                                                       "+
		"          ,UNIT_NAME       ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                           "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		")T1                                                                                                     "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                  "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID         ROW_ID                                                                       "+
		"          ,UNIT_NAME       ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                          "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		")T2                                                                                                     "+
		"ON(T.ROW_ID=T2.ROW_ID) ";
	}else if(orgLevel==4){
		sql="SELECT T.ROW_ID                                                                                         "+
		"      ,T.ROW_NAME                                                                                       "+
		"      ,NVL(T.ALL_INNET_NUM,0) ALL_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T2.ALL_INNET_NUM,0),2) ALL_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T1.ALL_INNET_NUM,0),2) ALL_INNET_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_INNET_NUM,0) DESC)  RANK_INNET           "+
		"      ,NVL(T.ALL_ACCT_NUM,0) ALL_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T2.ALL_ACCT_NUM,0),2) ALL_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T1.ALL_ACCT_NUM,0),2) ALL_ACCT_HB                      "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_ACCT_NUM,0) DESC)  RANK_ACCT             "+
		"      ,NVL(T.ALL_DEV_NUM,0) ALL_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T2.ALL_DEV_NUM,0),2) ALL_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T1.ALL_DEV_NUM,0),2) ALL_DEV_HB                         "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_DEV_NUM,0) DESC)  RANK_DEV               "+
		"      ,NVL(T.ALL_CJ_NUM,0) ALL_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T2.ALL_CJ_NUM,0),2) ALL_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T1.ALL_CJ_NUM,0),2) ALL_CJ_HB                            "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_CJ_NUM,0) DESC)  RANK_CJ                 "+
		"      ,NVL(T.YEAR_USER_INNET_NUM,0) YEAR_USER_INNET_NUM                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T2.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_TB "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T1.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_HB "+
		"      ,NVL(T.MON_USER_INNET_NUM,0) MON_USER_INNET_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T2.MON_USER_INNET_NUM,0),2) MON_USER_INNET_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T1.MON_USER_INNET_NUM,0),2) MON_USER_INNET_HB    "+
		"      ,NVL(T.XYW_INNET_NUM,0) XYW_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T2.XYW_INNET_NUM,0),2) XYW_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T1.XYW_INNET_NUM,0),2) XYW_INNET_HB                   "+
		"      ,NVL(T.YEAR_USER_ACCT_NUM,0) YEAR_USER_ACCT_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T2.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T1.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_HB    "+
		"      ,NVL(T.MON_USER_ACCT_NUM,0) MON_USER_ACCT_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T2.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T1.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_HB       "+
		"      ,NVL(T.XYW_ACCT_NUM,0) XYW_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T2.XYW_ACCT_NUM,0),2) XYW_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T1.XYW_ACCT_NUM,0),2) XYW_ACCT_HB                      "+
		"      ,NVL(T.YEAR_USER_DEV_NUM,0) YEAR_USER_DEV_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T2.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T1.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_HB       "+
		"      ,NVL(T.MON_USER_DEV_NUM,0) MON_USER_DEV_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T2.MON_USER_DEV_NUM,0),2) MON_USER_DEV_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T1.MON_USER_DEV_NUM,0),2) MON_USER_DEV_HB          "+
		"      ,NVL(T.XYW_DEV_NUM,0) XYW_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T2.XYW_DEV_NUM,0),2) XYW_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T1.XYW_DEV_NUM,0),2) XYW_DEV_HB                         "+
		"      ,NVL(T.YEAR_USER_CJ_NUM,0) YEAR_USER_CJ_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T2.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T1.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_HB          "+
		"      ,NVL(T.MON_USER_CJ_NUM,0) MON_USER_CJ_NUM                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T2.MON_USER_CJ_NUM,0),2) MON_USER_CJ_TB             "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T1.MON_USER_CJ_NUM,0),2) MON_USER_CJ_HB             "+
		"      ,NVL(T.XYW_CJ_NUM,0) XYW_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T2.XYW_CJ_NUM,0),2) XYW_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T1.XYW_CJ_NUM,0),2) XYW_CJ_HB                            "+
		"FROM (                                                                                                  "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID           ROW_ID                                                                       "+
		"          ,HQ_MANAGE_NAME  ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                              "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		")T                                                                                                      "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID           ROW_ID                                                                       "+
		"          ,HQ_MANAGE_NAME  ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                           "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		")T1                                                                                                     "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                  "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID           ROW_ID                                                                       "+
		"          ,HQ_MANAGE_NAME  ROW_NAME                                                                     "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                          "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		")T2                                                                                                     "+
		"ON(T.ROW_ID=T2.ROW_ID)   ";
	}else if(orgLevel==5){
		sql="SELECT " +
		"          T.GROUP_ID_1                                                                                   "+
		"          ,T.GROUP_ID_1_NAME                                                                              "+
		"          ,T.UNIT_ID                                                                                      "+
		"          ,T.UNIT_NAME                                                                                    "+
		"          ,T.HR_ID                                                                                        "+
		"          ,T.HQ_MANAGE_NAME                                                                               "+		
		"      ,T.ROW_ID                                                                                         "+
		"      ,T.ROW_NAME                                                                                       "+
		"      ,NVL(T.ALL_INNET_NUM,0) ALL_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T2.ALL_INNET_NUM,0),2) ALL_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_INNET_NUM,0),NVL(T1.ALL_INNET_NUM,0),2) ALL_INNET_HB                   "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_INNET_NUM,0) DESC)  RANK_INNET           "+
		"      ,NVL(T.ALL_ACCT_NUM,0) ALL_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T2.ALL_ACCT_NUM,0),2) ALL_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_ACCT_NUM,0),NVL(T1.ALL_ACCT_NUM,0),2) ALL_ACCT_HB                      "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_ACCT_NUM,0) DESC)  RANK_ACCT             "+
		"      ,NVL(T.ALL_DEV_NUM,0) ALL_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T2.ALL_DEV_NUM,0),2) ALL_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_DEV_NUM,0),NVL(T1.ALL_DEV_NUM,0),2) ALL_DEV_HB                         "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_DEV_NUM,0) DESC)  RANK_DEV               "+
		"      ,NVL(T.ALL_CJ_NUM,0) ALL_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T2.ALL_CJ_NUM,0),2) ALL_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.ALL_CJ_NUM,0),NVL(T1.ALL_CJ_NUM,0),2) ALL_CJ_HB                            "+
		"      ,RANK() OVER(PARTITION BY T.DEAL_DATE ORDER BY NVL(T.ALL_CJ_NUM,0) DESC)  RANK_CJ                 "+
		"      ,NVL(T.YEAR_USER_INNET_NUM,0) YEAR_USER_INNET_NUM                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T2.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_TB "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_INNET_NUM,0),NVL(T1.YEAR_USER_INNET_NUM,0),2) YEAR_USER_INNET_HB "+
		"      ,NVL(T.MON_USER_INNET_NUM,0) MON_USER_INNET_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T2.MON_USER_INNET_NUM,0),2) MON_USER_INNET_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_INNET_NUM,0),NVL(T1.MON_USER_INNET_NUM,0),2) MON_USER_INNET_HB    "+
		"      ,NVL(T.XYW_INNET_NUM,0) XYW_INNET_NUM                                                             "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T2.XYW_INNET_NUM,0),2) XYW_INNET_TB                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_INNET_NUM,0),NVL(T1.XYW_INNET_NUM,0),2) XYW_INNET_HB                   "+
		"      ,NVL(T.YEAR_USER_ACCT_NUM,0) YEAR_USER_ACCT_NUM                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T2.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_TB    "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_ACCT_NUM,0),NVL(T1.YEAR_USER_ACCT_NUM,0),2) YEAR_USER_ACCT_HB    "+
		"      ,NVL(T.MON_USER_ACCT_NUM,0) MON_USER_ACCT_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T2.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_ACCT_NUM,0),NVL(T1.MON_USER_ACCT_NUM,0),2) MON_USER_ACCT_HB       "+
		"      ,NVL(T.XYW_ACCT_NUM,0) XYW_ACCT_NUM                                                               "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T2.XYW_ACCT_NUM,0),2) XYW_ACCT_TB                      "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_ACCT_NUM,0),NVL(T1.XYW_ACCT_NUM,0),2) XYW_ACCT_HB                      "+
		"      ,NVL(T.YEAR_USER_DEV_NUM,0) YEAR_USER_DEV_NUM                                                     "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T2.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_TB       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_DEV_NUM,0),NVL(T1.YEAR_USER_DEV_NUM,0),2) YEAR_USER_DEV_HB       "+
		"      ,NVL(T.MON_USER_DEV_NUM,0) MON_USER_DEV_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T2.MON_USER_DEV_NUM,0),2) MON_USER_DEV_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_DEV_NUM,0),NVL(T1.MON_USER_DEV_NUM,0),2) MON_USER_DEV_HB          "+
		"      ,NVL(T.XYW_DEV_NUM,0) XYW_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T2.XYW_DEV_NUM,0),2) XYW_DEV_TB                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_DEV_NUM,0),NVL(T1.XYW_DEV_NUM,0),2) XYW_DEV_HB                         "+
		"      ,NVL(T.YEAR_USER_CJ_NUM,0) YEAR_USER_CJ_NUM                                                       "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T2.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_TB          "+
		"      ,PMRT.LINK_RATIO(NVL(T.YEAR_USER_CJ_NUM,0),NVL(T1.YEAR_USER_CJ_NUM,0),2) YEAR_USER_CJ_HB          "+
		"      ,NVL(T.MON_USER_CJ_NUM,0) MON_USER_CJ_NUM                                                         "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T2.MON_USER_CJ_NUM,0),2) MON_USER_CJ_TB             "+
		"      ,PMRT.LINK_RATIO(NVL(T.MON_USER_CJ_NUM,0),NVL(T1.MON_USER_CJ_NUM,0),2) MON_USER_CJ_HB             "+
		"      ,NVL(T.XYW_CJ_NUM,0) XYW_CJ_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T2.XYW_CJ_NUM,0),2) XYW_CJ_TB                            "+
		"      ,PMRT.LINK_RATIO(NVL(T.XYW_CJ_NUM,0),NVL(T1.XYW_CJ_NUM,0),2) XYW_CJ_HB                            "+
		"FROM (                                                                                                  "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID                                                                                        "+
		"          ,HQ_MANAGE_NAME                                                                               "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                                   "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                                 "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE="+dealDate+"                                                                              "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		"            ,HQ_CHAN_CODE                                                                               "+
		"            ,GROUP_ID_4_NAME                                                                            "+
		")T                                                                                                      "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID                                                                                        "+
		"          ,HQ_MANAGE_NAME                                                                               "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                                   "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                                 "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                           "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		"            ,HQ_CHAN_CODE                                                                               "+
		"            ,GROUP_ID_4_NAME                                                                            "+
		")T1                                                                                                     "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                  "+
		"LEFT JOIN (                                                                                             "+
		"    SELECT DEAL_DATE                                                                                    "+
		"          ,GROUP_ID_0                                                                                   "+
		"          ,GROUP_ID_1                                                                                   "+
		"          ,GROUP_ID_1_NAME                                                                              "+
		"          ,UNIT_ID                                                                                      "+
		"          ,UNIT_NAME                                                                                    "+
		"          ,HR_ID                                                                                        "+
		"          ,HQ_MANAGE_NAME                                                                               "+
		"          ,HQ_CHAN_CODE        ROW_ID                                                                   "+
		"          ,GROUP_ID_4_NAME     ROW_NAME                                                                 "+
		"          ,SUM(NVL(ALL_INNET_NUM      ,0))  ALL_INNET_NUM                                               "+
		"          ,SUM(NVL(ALL_ACCT_NUM      ,0))   ALL_ACCT_NUM                                                "+
		"          ,SUM(NVL(ALL_DEV_NUM,0))          ALL_DEV_NUM                                                 "+
		"          ,SUM(NVL(ALL_CJ_NUM,0))           ALL_CJ_NUM                                                  "+
		"          ,SUM(NVL(YEAR_USER_INNET_NUM      ,0))  YEAR_USER_INNET_NUM                                   "+
		"          ,SUM(NVL(MON_USER_INNET_NUM      ,0))   MON_USER_INNET_NUM                                    "+
		"          ,SUM(NVL(XYW_INNET_NUM,0))             XYW_INNET_NUM                                          "+
		"          ,SUM(NVL(YEAR_USER_ACCT_NUM      ,0))  YEAR_USER_ACCT_NUM                                     "+
		"          ,SUM(NVL(MON_USER_ACCT_NUM      ,0))   MON_USER_ACCT_NUM                                      "+
		"          ,SUM(NVL(XYW_ACCT_NUM,0))              XYW_ACCT_NUM                                           "+
		"          ,SUM(NVL(YEAR_USER_DEV_NUM      ,0))  YEAR_USER_DEV_NUM                                       "+
		"          ,SUM(NVL(MON_USER_DEV_NUM      ,0))   MON_USER_DEV_NUM                                        "+
		"          ,SUM(NVL(XYW_DEV_NUM,0))              XYW_DEV_NUM                                             "+
		"          ,SUM(NVL(YEAR_USER_CJ_NUM      ,0))  YEAR_USER_CJ_NUM                                         "+
		"          ,SUM(NVL(MON_USER_CJ_NUM      ,0))   MON_USER_CJ_NUM                                          "+
		"          ,SUM(NVL(XYW_CJ_NUM,0))              XYW_CJ_NUM                                               "+
		"    FROM PMRT.TB_MRT_KDGJ_USER_SR_ALL_MON                                                               "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                          "+
		//"    --其他筛选条件                                                                                    "+
		where +
		"    GROUP BY DEAL_DATE                                                                                  "+
		"            ,GROUP_ID_0                                                                                 "+
		"            ,GROUP_ID_1                                                                                 "+
		"            ,GROUP_ID_1_NAME                                                                            "+
		"            ,UNIT_ID                                                                                    "+
		"            ,UNIT_NAME                                                                                  "+
		"            ,HR_ID                                                                                      "+
		"            ,HQ_MANAGE_NAME                                                                             "+
		"            ,HQ_CHAN_CODE                                                                               "+
		"            ,GROUP_ID_4_NAME                                                                            "+
		")T2                                                                                                     "+
		"ON(T.ROW_ID=T2.ROW_ID) ";
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
	"地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称"
	var title=[["地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称","用户总体情况","","","","","","","","","","","","","","","","在网用户情况","","","","","","","","","出账用户情况","","","","","","","","","新增用户情况","","","","","","","","","拆机用户情况","","","","","","","",""],
			   ["","","","","","","","","在网用户","","","","出账用户数","","","","新增用户数","","","","拆机用户数","","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","","","包年用户","","","包月用户","","","校园网用户","",""],
			   ["","","","","","","","","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","排名","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比","本期","同比","环比"]];
	showtext = "用户总体情况月报";
	downloadExcel(downsql,title,showtext);
}
