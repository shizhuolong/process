var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","PZ_SR_YEAR","SR_YEAR","SR_BYL_YEAR" ,"SR_BYL_HB_YEAR" ,"PZ_USER_YEAR" ,"ACCT_NUM_YEAR" ,"DEV_BYL_YEAR" ,"SR_BYL_HB_YEAR1" ,"PZ_SR_MON" ,"SR_MON" ,"SR_BYL_MON","SR_BYL_RANK","SR_BYL_HB_MON","PZ_USER_MON","ACCT_NUM_MON","DEV_BYL_MON","DEV_BYL_RANK","SR_BYL_HB_MON1"];
	var title=[["组织架构","年度拍照用户维系情况","","","","","","","","月度用户维系情况","","","","","","","","",""],
			   ["","收入保有情况","","","","用户保有情况","","","","收入保有情况","","","","","用户保有情况","","","",""],
			   ["","拍照收入","当期出账收入","保有率","保有率环比","拍照用户数","当期出账用户数","保有率","保有率环比","拍照收入","当期出账收入","保有率","保有率排名","保有率环比","拍照用户数","当期出账用户数","保有率","保有率排名","保有率环比"]];
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
			var dealDete=$("#dealDate").val();
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
					where+=" AND HQ_HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel,dealDete);
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
				sql=getSql(where,orgLevel,dealDete);
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

function getSql(where,orgLevel,dealDete){
	var startDete=$("#startDate").val();
	var endDete=$("#endDate").val();
	var sql="";
	if(orgLevel==1){
		sql="SELECT T.ROW_ID                                                                                  "+
		"      ,T.ROW_NAME                                                                                "+
		//"      --年度维系                                                                               "+
		"      ,NVL(T.PZ_SR_YEAR,0) PZ_SR_YEAR                                                            "+
		"      ,NVL(T.SR_YEAR,0) SR_YEAR                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2) SR_BYL_YEAR                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2)              "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_YEAR,0),NVL(T1.PZ_SR_YEAR,0),2)            "+
		"                      ,2)       SR_BYL_HB_YEAR                                                   "+
		"      ,NVL(T.PZ_USER_YEAR,0) PZ_USER_YEAR                                                        "+
		"      ,NVL(T.ACCT_NUM_YEAR,0) ACCT_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2) DEV_BYL_YEAR           "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_YEAR,0),NVL(T1.PZ_USER_YEAR,0),2)    "+
		"                      ,2)       SR_BYL_HB_YEAR1                                                   "+
		//"      --月度维系                                                                               "+
		"      ,NVL(T.PZ_SR_MON,0) PZ_SR_MON                                                              "+
		"      ,NVL(T.SR_MON,0) SR_MON                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2) SR_BYL_MON                       "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0)        "+
		"      ,NVL(T.PZ_SR_MON,0),2) DESC) SR_BYL_RANK                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2)                "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_MON,0),NVL(T1.PZ_SR_MON,0),2)              "+
		"                      ,2)       SR_BYL_HB_MON                                                    "+
		"      ,NVL(T.PZ_USER_MON,0) PZ_USER_MON                                                          "+
		"      ,NVL(T.ACCT_NUM_MON,0) ACCT_NUM_MON                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2) DEV_BYL_MON              "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0)  "+
		"      ,NVL(T.PZ_USER_MON,0),2) DESC) DEV_BYL_RANK                                                "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2)        "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_MON,0),NVL(T1.PZ_USER_MON,0),2)      "+
		"                      ,2)       SR_BYL_HB_MON1                                                    "+
		"FROM (                                                                                           "+
		"    SELECT DEAL_DATE                                                                             "+
		"          ,GROUP_ID_0        ROW_ID                                                              "+
		"          ,'全省'            ROW_NAME                                                            "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                            "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                               "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                   "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                  "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                      "+
		"          ,SUM(SR_MON)            SR_MON                                                         "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                    "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                   "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                          "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                       "+
		//--其他筛选条件                                                                                  "+
		where+
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		")T                                                                                               "+
		"LEFT JOIN (                                                                                      "+
		"     SELECT GROUP_ID_0        ROW_ID                                                             "+
		"          ,'全省'             ROW_NAME                                                           "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                            "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                               "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                   "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                  "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                      "+
		"          ,SUM(SR_MON)            SR_MON                                                         "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                    "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                   "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                    "+
		//"       --其他筛选条件                                                                          "+
		where+
		"    GROUP BY GROUP_ID_0                                                                          "+
		")T1                                                                                              "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";                                                  
	}else if(orgLevel==2){
		sql="SELECT T.ROW_ID                                                                                 "+
		"      ,T.ROW_NAME                                                                               "+
		//"      --年度维系                                                                              "+
		"      ,NVL(T.PZ_SR_YEAR,0) PZ_SR_YEAR                                                           "+
		"      ,NVL(T.SR_YEAR,0) SR_YEAR                                                                 "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2) SR_BYL_YEAR                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2)             "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_YEAR,0),NVL(T1.PZ_SR_YEAR,0),2)           "+
		"                      ,2)       SR_BYL_HB_YEAR                                                  "+
		"      ,NVL(T.PZ_USER_YEAR,0) PZ_USER_YEAR                                                       "+
		"      ,NVL(T.ACCT_NUM_YEAR,0) ACCT_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2) DEV_BYL_YEAR          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2)     "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_YEAR,0),NVL(T1.PZ_USER_YEAR,0),2)   "+
		"                      ,2)       SR_BYL_HB_YEAR1                                                  "+
		//"      --月度维系                                                                              "+
		"      ,NVL(T.PZ_SR_MON,0) PZ_SR_MON                                                             "+
		"      ,NVL(T.SR_MON,0) SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2) SR_BYL_MON                      "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0)       "+
		"      ,NVL(T.PZ_SR_MON,0),2) DESC) SR_BYL_RANK                                                  "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2)               "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_MON,0),NVL(T1.PZ_SR_MON,0),2)             "+
		"                      ,2)       SR_BYL_HB_MON                                                   "+
		"      ,NVL(T.PZ_USER_MON,0) PZ_USER_MON                                                         "+
		"      ,NVL(T.ACCT_NUM_MON,0) ACCT_NUM_MON                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2) DEV_BYL_MON             "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0) "+
		"      ,NVL(T.PZ_USER_MON,0),2) DESC) DEV_BYL_RANK                                               "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_MON,0),NVL(T1.PZ_USER_MON,0),2)     "+
		"                      ,2)       SR_BYL_HB_MON1                                                   "+
		"FROM (                                                                                          "+
		"    SELECT GROUP_ID_0                                                                           "+
		"          ,DEAL_DATE                                                                            "+
		"          ,GROUP_ID_1           ROW_ID                                                          "+
		"          ,GROUP_ID_1_NAME      ROW_NAME                                                        "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                           "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                              "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                  "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                 "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                     "+
		"          ,SUM(SR_MON)            SR_MON                                                        "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                   "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                  "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                         "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                    "+
		//其他条件
		where+
		"    GROUP BY DEAL_DATE                                                                          "+
		"            ,GROUP_ID_0                                                                         "+
		"            ,GROUP_ID_1                                                                         "+
		"            ,GROUP_ID_1_NAME                                                                    "+
		")T                                                                                              "+
		"LEFT JOIN (                                                                                     "+
		"     SELECT GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1         ROW_ID                                                            "+
		"          ,GROUP_ID_1_NAME    ROW_NAME                                                          "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                           "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                              "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                  "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                 "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                     "+
		"          ,SUM(SR_MON)            SR_MON                                                        "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                   "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                  "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                   "+
		//"       --其他筛选条件                                                                         "+
		where +
		"    GROUP BY GROUP_ID_0                                                                         "+
		"            ,GROUP_ID_1                                                                         "+
		"            ,GROUP_ID_1_NAME                                                                    "+
		")T1                                                                                             "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";
	}else if(orgLevel==3){
		sql="SELECT T.ROW_ID                                                                                 "+
		"      ,T.ROW_NAME                                                                               "+
		//"      --年度维系                                                                              "+
		"      ,NVL(T.PZ_SR_YEAR,0) PZ_SR_YEAR                                                           "+
		"      ,NVL(T.SR_YEAR,0) SR_YEAR                                                                 "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2) SR_BYL_YEAR                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2)             "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_YEAR,0),NVL(T1.PZ_SR_YEAR,0),2)           "+
		"                      ,2)       SR_BYL_HB_YEAR                                                  "+
		"      ,NVL(T.PZ_USER_YEAR,0) PZ_USER_YEAR                                                       "+
		"      ,NVL(T.ACCT_NUM_YEAR,0) ACCT_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2) DEV_BYL_YEAR          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2)     "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_YEAR,0),NVL(T1.PZ_USER_YEAR,0),2)   "+
		"                      ,2)       SR_BYL_HB_YEAR1                                                  "+
		//"      --月度维系                                                                              "+
		"      ,NVL(T.PZ_SR_MON,0) PZ_SR_MON                                                             "+
		"      ,NVL(T.SR_MON,0) SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2) SR_BYL_MON                      "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0)       "+
		"      ,NVL(T.PZ_SR_MON,0),2) DESC) SR_BYL_RANK                                                  "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2)               "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_MON,0),NVL(T1.PZ_SR_MON,0),2)             "+
		"                      ,2)       SR_BYL_HB_MON                                                   "+
		"      ,NVL(T.PZ_USER_MON,0) PZ_USER_MON                                                         "+
		"      ,NVL(T.ACCT_NUM_MON,0) ACCT_NUM_MON                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2) DEV_BYL_MON             "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0) "+
		"      ,NVL(T.PZ_USER_MON,0),2) DESC) DEV_BYL_RANK                                               "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_MON,0),NVL(T1.PZ_USER_MON,0),2)     "+
		"                      ,2)       SR_BYL_HB_MON1                                                   "+
		"FROM (                                                                                          "+
		"    SELECT GROUP_ID_0                                                                           "+
		"          ,DEAL_DATE                                                                            "+
		"          ,GROUP_ID_1                                                                           "+
		"          ,GROUP_ID_1_NAME                                                                      "+
		"          ,UNIT_ID              ROW_ID                                                          "+
		"          ,UNIT_NAME            ROW_NAME                                                        "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                           "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                              "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                  "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                 "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                     "+
		"          ,SUM(SR_MON)            SR_MON                                                        "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                   "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                  "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                         "+
		"    WHERE DEAL_DATE="+dealDete+"                                 "+
		//其他条件
		where + 
		"    GROUP BY DEAL_DATE                                                                          "+
		"            ,GROUP_ID_0                                                                         "+
		"            ,GROUP_ID_1                                                                         "+
		"            ,GROUP_ID_1_NAME                                                                    "+
		"            ,UNIT_ID                                                                            "+
		"            ,UNIT_NAME                                                                          "+
		")T                                                                                              "+
		"LEFT JOIN (                                                                                     "+
		"     SELECT GROUP_ID_0                                                                          "+
		"          ,GROUP_ID_1                                                                           "+
		"          ,GROUP_ID_1_NAME                                                                      "+
		"          ,UNIT_ID            ROW_ID                                                            "+
		"          ,UNIT_NAME          ROW_NAME                                                          "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                           "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                              "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                  "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                 "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                     "+
		"          ,SUM(SR_MON)            SR_MON                                                        "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                   "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                  "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                         "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                   "+
		//"       --其他筛选条件                                                                         "+
		where +
		"    GROUP BY GROUP_ID_0                                                                         "+
		"            ,GROUP_ID_1                                                                         "+
		"            ,GROUP_ID_1_NAME                                                                    "+
		"            ,UNIT_ID                                                                            "+
		"            ,UNIT_NAME                                                                          "+
		")T1                                                                                             "+
		"ON(T.ROW_ID=T1.ROW_ID) ";
	}else if(orgLevel==4){
		sql="SELECT T.ROW_ID                                                                                  "+
		"      ,T.ROW_NAME                                                                                "+
		//"      --年度维系                                                                               "+
		"      ,NVL(T.PZ_SR_YEAR,0) PZ_SR_YEAR                                                            "+
		"      ,NVL(T.SR_YEAR,0) SR_YEAR                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2) SR_BYL_YEAR                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2)              "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_YEAR,0),NVL(T1.PZ_SR_YEAR,0),2)            "+
		"                      ,2)       SR_BYL_HB_YEAR                                                   "+
		"      ,NVL(T.PZ_USER_YEAR,0) PZ_USER_YEAR                                                        "+
		"      ,NVL(T.ACCT_NUM_YEAR,0) ACCT_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2) DEV_BYL_YEAR           "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_YEAR,0),NVL(T1.PZ_USER_YEAR,0),2)    "+
		"                      ,2)       SR_BYL_HB_YEAR1                                                   "+
		//"      --月度维系                                                                               "+
		"      ,NVL(T.PZ_SR_MON,0) PZ_SR_MON                                                              "+
		"      ,NVL(T.SR_MON,0) SR_MON                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2) SR_BYL_MON                       "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0)        "+
		"      ,NVL(T.PZ_SR_MON,0),2) DESC) SR_BYL_RANK                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2)                "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_MON,0),NVL(T1.PZ_SR_MON,0),2)              "+
		"                      ,2)       SR_BYL_HB_MON                                                    "+
		"      ,NVL(T.PZ_USER_MON,0) PZ_USER_MON                                                          "+
		"      ,NVL(T.ACCT_NUM_MON,0) ACCT_NUM_MON                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2) DEV_BYL_MON              "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0)  "+
		"      ,NVL(T.PZ_USER_MON,0),2) DESC) DEV_BYL_RANK                                                "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2)        "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_MON,0),NVL(T1.PZ_USER_MON,0),2)      "+
		"                      ,2)       SR_BYL_HB_MON1                                                    "+
		"FROM (                                                                                           "+
		"    SELECT GROUP_ID_0                                                                            "+
		"          ,DEAL_DATE                                                                             "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,GROUP_ID_1_NAME                                                                       "+
		"          ,UNIT_ID                                                                               "+
		"          ,UNIT_NAME                                                                             "+
		"          ,HQ_HR_ID             ROW_ID                                                           "+
		"          ,MANAGE_NAME          ROW_NAME                                                         "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                            "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                               "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                   "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                  "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                      "+
		"          ,SUM(SR_MON)            SR_MON                                                         "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                    "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                   "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                          "+
		"    WHERE DEAL_DATE=201701  "+
		//其他条件
		where +
		"    GROUP BY DEAL_DATE                                                                           "+
		"            ,GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		"            ,UNIT_ID                                                                             "+
		"            ,UNIT_NAME                                                                           "+
		"            ,HQ_HR_ID                                                                            "+
		"            ,MANAGE_NAME                                                                         "+
		")T                                                                                               "+
		"LEFT JOIN (                                                                                      "+
		"     SELECT GROUP_ID_0                                                                           "+
		"          ,GROUP_ID_1                                                                            "+
		"          ,GROUP_ID_1_NAME                                                                       "+
		"          ,UNIT_ID                                                                               "+
		"          ,UNIT_NAME                                                                             "+
		"          ,HQ_HR_ID       ROW_ID                                                                 "+
		"          ,MANAGE_NAME    ROW_NAME                                                               "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                            "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                               "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                   "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                  "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                      "+
		"          ,SUM(SR_MON)            SR_MON                                                         "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                    "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                   "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                    "+
		//"       --其他筛选条件                                                                            "+
		where +
		"    GROUP BY GROUP_ID_0                                                                          "+
		"            ,GROUP_ID_1                                                                          "+
		"            ,GROUP_ID_1_NAME                                                                     "+
		"            ,UNIT_ID                                                                             "+
		"            ,UNIT_NAME                                                                           "+
		"            ,HQ_HR_ID                                                                            "+
		"            ,MANAGE_NAME                                                                         "+
		"                                                                                                 "+
		")T1                                                                                              "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";
	}else if(orgLevel==5){
		sql="SELECT "+
		"          T.GROUP_ID_1                                                                             "+
		"          ,T.GROUP_ID_1_NAME                                                                        "+
		"          ,T.UNIT_ID                                                                                "+
		"          ,T.UNIT_NAME                                                                              "+
		"          ,T.HQ_HR_ID                                                                               "+
		"          ,T.MANAGE_NAME     "+
		"      ,T.ROW_ID                                                                                   "+
		"      ,T.ROW_NAME                                                                           "+
		//"      --年度维系                                                                                "+
		"      ,NVL(T.PZ_SR_YEAR,0) PZ_SR_YEAR                                                             "+
		"      ,NVL(T.SR_YEAR,0) SR_YEAR                                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2) SR_BYL_YEAR                     "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_YEAR,0),NVL(T.PZ_SR_YEAR,0),2)               "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_YEAR,0),NVL(T1.PZ_SR_YEAR,0),2)             "+
		"                      ,2)       SR_BYL_HB_YEAR                                                    "+
		"      ,NVL(T.PZ_USER_YEAR,0) PZ_USER_YEAR                                                         "+
		"      ,NVL(T.ACCT_NUM_YEAR,0) ACCT_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2) DEV_BYL_YEAR            "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_YEAR,0),NVL(T.PZ_USER_YEAR,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_YEAR,0),NVL(T1.PZ_USER_YEAR,0),2)     "+
		"                      ,2)       SR_BYL_HB_YEAR1                                                    "+
		//"      --月度维系                                                                                "+
		"      ,NVL(T.PZ_SR_MON,0) PZ_SR_MON                                                               "+
		"      ,NVL(T.SR_MON,0) SR_MON                                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2) SR_BYL_MON                        "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0)         "+
		"      ,NVL(T.PZ_SR_MON,0),2) DESC) SR_BYL_RANK                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.SR_MON,0),NVL(T.PZ_SR_MON,0),2)                 "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.SR_MON,0),NVL(T1.PZ_SR_MON,0),2)               "+
		"                      ,2)       SR_BYL_HB_MON                                                     "+
		"      ,NVL(T.PZ_USER_MON,0) PZ_USER_MON                                                           "+
		"      ,NVL(T.ACCT_NUM_MON,0) ACCT_NUM_MON                                                         "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2) DEV_BYL_MON               "+
		"      ,RANK()OVER (PARTITION BY T.DEAL_DATE ORDER BY PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0)   "+
		"      ,NVL(T.PZ_USER_MON,0),2) DESC) DEV_BYL_RANK                                                 "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ACCT_NUM_MON,0),NVL(T.PZ_USER_MON,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ACCT_NUM_MON,0),NVL(T1.PZ_USER_MON,0),2)       "+
		"                      ,2)       SR_BYL_HB_MON1                                                     "+
		"FROM (                                                                                            "+
		"    SELECT GROUP_ID_0                                                                             "+
		"          ,DEAL_DATE                                                                              "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,GROUP_ID_1_NAME                                                                        "+
		"          ,UNIT_ID                                                                                "+
		"          ,UNIT_NAME                                                                              "+
		"          ,HQ_HR_ID                                                                               "+
		"          ,MANAGE_NAME                                                                            "+
		"          ,HQ_CHAN_CODE    ROW_ID                                                                 "+
		"          ,GROUP_ID_4_NAME ROW_NAME                                                               "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                             "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                                "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                    "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                   "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                       "+
		"          ,SUM(SR_MON)            SR_MON                                                          "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                     "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                    "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                           "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                        "+
		//"       --其他筛选条件                                                                             "+
		where+
		"    GROUP BY GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                      "+
		"            ,UNIT_ID                                                                              "+
		"            ,UNIT_NAME                                                                            "+
		"            ,HQ_HR_ID                                                                             "+
		"            ,MANAGE_NAME                                                                          "+
		"            ,HQ_CHAN_CODE                                                                         "+
		"            ,GROUP_ID_4_NAME                                                                      "+
		"            ,DEAL_DATE                                                                            "+
		")T                                                                                                "+
		"LEFT JOIN (                                                                                       "+
		"     SELECT GROUP_ID_0                                                                            "+
		"          ,GROUP_ID_1                                                                             "+
		"          ,GROUP_ID_1_NAME                                                                        "+
		"          ,UNIT_ID                                                                                "+
		"          ,UNIT_NAME                                                                              "+
		"          ,HQ_HR_ID                                                                               "+
		"          ,MANAGE_NAME                                                                            "+
		"          ,HQ_CHAN_CODE    ROW_ID                                                                 "+
		"          ,GROUP_ID_4_NAME ROW_NAME                                                               "+
		"          ,SUM(PZ_SR_YEAR) PZ_SR_YEAR                                                             "+
		"          ,SUM(SR_YEAR)    SR_YEAR                                                                "+
		"          ,SUM(PZ_USER_NUM_YEAR)  PZ_USER_YEAR                                                    "+
		"          ,SUM(ACCT_NUM_YEAR)     ACCT_NUM_YEAR                                                   "+
		"          ,SUM(PZ_SR_MON)         PZ_SR_MON                                                       "+
		"          ,SUM(SR_MON)            SR_MON                                                          "+
		"          ,SUM(PZ_USER_MON)       PZ_USER_MON                                                     "+
		"          ,SUM(ACCT_NUM_MON)      ACCT_NUM_MON                                                    "+
		"    FROM PMRT.TB_MRT_KDGJ_WX_DETAIL_ALL                                                           "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                     "+
		//"    --其他筛选条件                                                                              "+
		where +
		"    GROUP BY GROUP_ID_0                                                                           "+
		"            ,GROUP_ID_1                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                      "+
		"            ,UNIT_ID                                                                              "+
		"            ,UNIT_NAME                                                                            "+
		"            ,HQ_HR_ID                                                                             "+
		"            ,MANAGE_NAME                                                                          "+
		"            ,HQ_CHAN_CODE                                                                         "+
		"            ,GROUP_ID_4_NAME                                                                      "+
		")T1                                                                                               "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";
	}
	return sql;
}

function downsAll() {
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel="";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDete=$("#dealDate").val();
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
	var downsql=getSql(where,5,dealDete);
	var title=[["地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称","年度拍照用户维系情况","","","","","","","","月度用户维系情况","","","","","","",""],
			   ["","","","","","","","","收入保有情况","","","","用户保有情况","","","","收入保有情况","","","","用户保有情况","","",""],
			   ["","","","","","","","","拍照收入","当期出账收入","保有率","保有率环比","拍照用户数","当期出账用户数","保有率","保有率环比","拍照收入","当期出账收入","保有率","保有率排名","保有率环比","拍照用户数","当期出账用户数","保有率","保有率排名","保有率环比"]];
	showtext = "用户维系情况";
	downloadExcel(downsql,title,showtext);
}
