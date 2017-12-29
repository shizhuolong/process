var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","ALL_SR_MON","ALL_HB_MON","ALL_TB_MON" ,"ALL_SR_YEAR" ,"ALL_TB_YEAR" ,"ZW_SR_MON" ,"ZW_HB_MON" ,"ZW_TB_MON" ,"ZW_SR_YEAR" ,"ZW_TB_YEAR" ,"BOT_SR_MON","BOT_HB_MON","BOT_TB_MON","BOT_SR_YEAR","BOT_TB_YEAR","EOC_SR_MON","EOC_HB_MON","EOC_TB_MON","EOC_SR_YEAR","EOC_TB_YEAR"];
	var title=[["组织架构","出账收入总体情况","","","","","自网收入","","","","","BOT收入","","","","","广电收入","","","",""],
			   ["","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入",""],
			   ["","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比"]];
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
			var hr_id=$("#hr_id").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var dealDate=$("#dealDate").val();
			var chanCode=$("#chanCode").val();
			var hrId=$("#hrId").val();
			
			var where="";
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
			}
			if(chanCode!=''){
				where+= " AND HQ_CHAN_CODE ='"+chanCode+"'";
			}
			if(hrId!=''){
				where+= " AND HR_ID ='"+hrId+"'";
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
	if(orgLevel==1){ //省级
	sql = "SELECT T.ROW_ID                                                                                                                     "+
	"      ,T.ROW_NAME                                                                                                                   "+
	"      ,T.ALL_SR ALL_SR_MON                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                    "+
	"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                    "+
	"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                        "+
	"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                   "+
	"      ,T.ZW_SR ZW_SR_MON                                                                                                            "+
	"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                     "+
	"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                     "+
	"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                    "+
	"      ,T.BOT_SR BOT_SR_MON                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                    "+
	"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                    "+
	"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                        "+
	"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                   "+
	"      ,T.EOC_SR EOC_SR_MON                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                    "+
	"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                    "+
	"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                        "+
	"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                   "+
	"FROM (                                                                                                                              "+
	"      SELECT GROUP_ID_0     ROW_ID                                                                                                  "+
	"            ,'全省'         ROW_NAME                                                                                                "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
	"      WHERE DEAL_DATE="+dealDate+"                                                                                                        "+
	//"           --其他筛选条件                                                                                                         "+
	where +
	"      GROUP BY GROUP_ID_0                                                                                                           "+
	")T                                                                                                                                  "+
	"LEFT JOIN (                                                                                                                         "+
	"      SELECT GROUP_ID_0     ROW_ID                                                                                                  "+
	"            ,'全省'         ROW_NAME                                                                                                "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                     "+
	//"      --其他筛选条件                                                                                                              "+ 
	where +
	"      GROUP BY GROUP_ID_0                                                                                                           "+
	")T1                                                                                                                                 "+
	"ON(T.ROW_ID=T1.ROW_ID)                                                                                                              "+
	"LEFT JOIN (                                                                                                                         "+
	"      SELECT GROUP_ID_0     ROW_ID                                                                                                  "+
	"            ,'全省'         ROW_NAME                                                                                                "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                    "+
	//"      --其他筛选条件                                                                                                              "+                                                                                                                   
	where +
	"      GROUP BY GROUP_ID_0                                                                                                           "+
	")T2                                                                                                                                 "+
	"ON(T.ROW_ID=T2.ROW_ID)                                                                                                              "+
	"LEFT JOIN (                                                                                                                         "+
	"      SELECT GROUP_ID_0     ROW_ID                                                                                                  "+
	"            ,'全省'         ROW_NAME                                                                                                "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
	"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                      "+
	//"      --其他筛选条件                                                                                                                               
	where +
	"      GROUP BY GROUP_ID_0                                                                                                           "+
	")T3                                                                                                                                 "+
	"ON(T.ROW_ID=T3.ROW_ID)                                                                                                              "+
	"LEFT JOIN (                                                                                                                         "+
	"      SELECT GROUP_ID_0     ROW_ID                                                                                                  "+
	"            ,'全省'         ROW_NAME                                                                                                "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
	"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1"+
	//--其他条件                                                                                                                            
	where +
	"      GROUP BY GROUP_ID_0                                                                                                           "+
	")T4                                                                                                                                 "+
	"ON(T.ROW_ID=T4.ROW_ID) ";                               
	}else if(orgLevel==2){//地市级
		sql = "SELECT T.ROW_ID                                                                                                                     "+
		"      ,T.ROW_NAME                                                                                                                   "+
		"      ,T.ALL_SR ALL_SR_MON                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                    "+
		"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                        "+
		"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                   "+
		"      ,T.ZW_SR ZW_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                     "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                     "+
		"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                    "+
		"      ,T.BOT_SR BOT_SR_MON                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                    "+
		"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                        "+
		"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                   "+
		"      ,T.EOC_SR EOC_SR_MON                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                    "+
		"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                        "+
		"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                   "+
		"FROM (                                                                                                                              "+
		"      SELECT GROUP_ID_1             ROW_ID                                                                                          "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                                                                        "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                                                        "+
		//"           --其他筛选条件                                                                                                         "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                                                        "+
		")T                                                                                                                                  "+
		"LEFT JOIN (                                                                                                                         "+
		"      SELECT GROUP_ID_1             ROW_ID                                                                                          "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                                                                        "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                     "+
		//"      --其他筛选条件
		where +
		"      GROUP BY GROUP_ID_1                                                                                                           "+
		"              ,GROUP_ID_1_NAME                                                                                                      "+
		")T1                                                                                                                                 "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                                              "+
		"LEFT JOIN (                                                                                                                         "+
		"      SELECT GROUP_ID_1             ROW_ID                                                                                          "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                                                                        "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                    "+
		//"      --其他筛选条件                                                                                                              "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                                                        "+
		")T2                                                                                                                                 "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                                                              "+
		"LEFT JOIN (                                                                                                                         "+
		"      SELECT GROUP_ID_1             ROW_ID                                                                                          "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                                                                        "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                      "+
		//"      --其他筛选条件                                                                                                              "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                                                        "+
		")T3                                                                                                                                 "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                                                              "+
		"LEFT JOIN (                                                                                                                         "+
		"      SELECT GROUP_ID_1             ROW_ID                                                                                          "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                                                                        "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                              "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                               "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                              "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                             "+
		"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1 "+
		//"      --其他筛选条件                                                                                                              "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                           "+
		"            ,GROUP_ID_1_NAME                                                                                                        "+
		")T4                                                                                                                                 "+
		"ON(T.ROW_ID=T4.ROW_ID) ";
	}else if(orgLevel==3){ //营服级
		sql = "SELECT T.ROW_ID                                                                                                                      "+
		"      ,T.ROW_NAME                                                                                                                    "+
		"      ,T.ALL_SR ALL_SR_MON                                                                                                           "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                     "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                     "+
		"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                         "+
		"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                    "+
		"      ,T.ZW_SR ZW_SR_MON                                                                                                             "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                      "+
		"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                           "+
		"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                     "+
		"      ,T.BOT_SR BOT_SR_MON                                                                                                           "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                     "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                     "+
		"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                         "+
		"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                    "+
		"      ,T.EOC_SR EOC_SR_MON                                                                                                           "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                     "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                     "+
		"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                         "+
		"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                    "+
		"FROM (                                                                                                                               "+
		"      SELECT GROUP_ID_1                                                                                                              "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                ROW_ID                                                                                           "+
		"            ,UNIT_NAME              ROW_NAME                                                                                         "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                               "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                               "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                               "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                              "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                                                         "+
		//"           --其他筛选条件                                                                                                          "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                                                                                                                 "+
		"            ,UNIT_NAME                                                                                                               "+
		")T                                                                                                                                   "+
		"LEFT JOIN (                                                                                                                          "+
		"      SELECT GROUP_ID_1                                                                                                              "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                ROW_ID                                                                                           "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                               "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                               "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                               "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                      "+
		//"      --其他筛选条件                                                                                                               "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                                                                                                                 "+
		")T1                                                                                                                                  "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                                               "+
		"LEFT JOIN (                                                                                                                          "+
		"      SELECT GROUP_ID_1                                                                                                              "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                ROW_ID                                                                                           "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                               "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                               "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                               "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                     "+
		//"      --其他筛选条件  
		where +
		"      GROUP BY GROUP_ID_1                                                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                                                                                                                 "+
		")T2                                                                                                                                  "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                                                               "+
		"LEFT JOIN (                                                                                                                          "+
		"      SELECT GROUP_ID_1                                                                                                              "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                ROW_ID                                                                                           "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                               "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                               "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                               "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                              "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                       "+
		//"      --其他筛选条件       
		where +
		"      GROUP BY GROUP_ID_1                                                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                                                                                                                 "+
		")T3                                                                                                                                  "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                                                               "+
		"LEFT JOIN (                                                                                                                          "+
		"      SELECT GROUP_ID_1                                                                                                              "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                ROW_ID                                                                                           "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                               "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                               "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                               "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                              "+
		"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1 "+
		//"      --其他筛选条件       
		where +
		"      GROUP BY GROUP_ID_1                                                                                                            "+
		"            ,GROUP_ID_1_NAME                                                                                                         "+
		"            ,UNIT_ID                                                                                                                 "+
		")T4                                                                                                                                  "+
		"ON(T.ROW_ID=T4.ROW_ID) "; 
	}else if(orgLevel==4){ //宽固经理
		sql = "SELECT T.ROW_ID                                                                                                                       "+
		"      ,T.ROW_NAME                                                                                                                     "+
		"      ,T.ALL_SR ALL_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                      "+
		"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                     "+
		"      ,T.ZW_SR ZW_SR_MON                                                                                                              "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                       "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                       "+
		"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                      "+
		"      ,T.BOT_SR BOT_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                      "+
		"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                     "+
		"      ,T.EOC_SR EOC_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                      "+
		"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                     "+
		"FROM (                                                                                                                                "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                  ROW_ID                                                                                            "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                                                          "+
		//"           --其他筛选条件      
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		")T                                                                                                                                    "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                  ROW_ID                                                                                            "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                       "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		")T1                                                                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                  ROW_ID                                                                                            "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                      "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		")T2                                                                                                                                   "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                  ROW_ID                                                                                            "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                        "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		")T3                                                                                                                                   "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                  ROW_ID                                                                                            "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1  "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		")T4                                                                                                                                   "+
		"ON(T.ROW_ID=T4.ROW_ID) ";
	}else if(orgLevel==5){ //渠道级
		sql = "SELECT T.ROW_ID                                                                                                                       "+
		"      ,T.ROW_NAME                                                                                                                     "+
		"      ,T.ALL_SR ALL_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                      "+
		"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                     "+
		"      ,T.ZW_SR ZW_SR_MON                                                                                                              "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                       "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                       "+
		"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                      "+
		"      ,T.BOT_SR BOT_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                      "+
		"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                     "+
		"      ,T.EOC_SR EOC_SR_MON                                                                                                            "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                      "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                      "+
		"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                          "+
		"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                     "+
		"FROM (                                                                                                                                "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE="+dealDate+"                                                                                                          "+
		//"           --其他筛选条件                                                                                                           "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE                                                                                                             "+
		"            ,GROUP_ID_4_NAME                                                                                                          "+
		")T                                                                                                                                    "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                       "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE                                                                                                             "+
		"            ,GROUP_ID_4_NAME                                                                                                          "+
		")T1                                                                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                      "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,UNIT_NAME                                                                                                                "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_MANAGE_NAME                                                                                                           "+
		"            ,HQ_CHAN_CODE                                                                                                             "+
		"            ,GROUP_ID_4_NAME                                                                                                          "+
		")T2                                                                                                                                   "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                        "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_CHAN_CODE                                                                                                             "+
		")T3                                                                                                                                   "+
		"ON(T.ROW_ID=T3.ROW_ID)                                                                                                                "+
		"LEFT JOIN (                                                                                                                           "+
		"      SELECT GROUP_ID_1                                                                                                               "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
		"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
		"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
		"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
		"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
		"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1  "+
		//"      --其他筛选条件                                                                                                                "+
		where +
		"      GROUP BY GROUP_ID_1                                                                                                             "+
		"            ,GROUP_ID_1_NAME                                                                                                          "+
		"            ,UNIT_ID                                                                                                                  "+
		"            ,HR_ID                                                                                                                    "+
		"            ,HQ_CHAN_CODE                                                                                                             "+
		")T4                                                                                                                                   "+
		"ON(T.ROW_ID=T4.ROW_ID) ";
	}
	return sql;
}

function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var chanCode=$("#chanCode").val();
	var hrId=$("#hrId").val();
	var where="";
	if(orgLevel==1){

	}else{
		where += " AND GROUP_ID_1 ='"+region+"' ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(chanCode!=''){
		where+= " AND HQ_CHAN_CODE ='"+chanCode+"'";
	}
	if(hrId!=''){
		where+= " AND HR_ID ='"+hrId+"'";
	}
	
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_MANAGE_NAME","HR_ID","HQ_CHAN_CODE","GROUP_ID_4_NAME","ALL_SR_MON","ALL_HB_MON","ALL_TB_MON" ,"ALL_SR_YEAR" ,"ALL_TB_YEAR" ,"ZW_SR_MON" ,"ZW_HB_MON" ,"ZW_TB_MON" ,"ZW_SR_YEAR" ,"ZW_TB_YEAR" ,"BOT_SR_MON","BOT_HB_MON","BOT_TB_MON","BOT_SR_YEAR","BOT_TB_YEAR","EOC_SR_MON","EOC_HB_MON","EOC_TB_MON","EOC_SR_YEAR","EOC_TB_YEAR"];
	var title=[["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","出账收入总体情况","","","","","自网收入","","","","","BOT收入","","","","","广电收入","","","",""],
			   ["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入","","当月累计出账收入","","","当年累计出账收入",""],
			   ["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比","本期","环比","同比","本期","同比"]];
	var sql = "SELECT T.GROUP_ID_1_NAME GROUP_ID_1_NAME,T.UNIT_NAME UNIT_NAME,T.HQ_MANAGE_NAME HQ_MANAGE_NAME,T.HR_ID HR_ID," +
	"       T.ROW_ID HQ_CHAN_CODE"+
	"      ,T.ROW_NAME GROUP_ID_4_NAME                                                                                                                    "+
	"      ,T.ALL_SR ALL_SR_MON                                                                                                            "+
	"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T1.ALL_SR,0),2)   ALL_HB_MON                                                                      "+
	"      ,PMRT.LINK_RATIO(T.ALL_SR,NVL(T2.ALL_SR,0),2)   ALL_TB_MON                                                                      "+
	"      ,T3.ALL_SR ALL_SR_YEAR                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T3.ALL_SR,NVL(T4.ALL_SR,0),2)  ALL_TB_YEAR                                                                     "+
	"      ,T.ZW_SR ZW_SR_MON                                                                                                              "+
	"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T1.ZW_SR,0),2)     ZW_HB_MON                                                                       "+
	"      ,PMRT.LINK_RATIO(T.ZW_SR,NVL(T2.ZW_SR,0),2)     ZW_TB_MON                                                                       "+
	"      ,T3.ZW_SR ZW_SR_YEAR                                                                                                            "+
	"      ,PMRT.LINK_RATIO(T3.ZW_SR,NVL(T4.ZW_SR,0),2)    ZW_TB_YEAR                                                                      "+
	"      ,T.BOT_SR BOT_SR_MON                                                                                                            "+
	"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T1.BOT_SR,0),2)   BOT_HB_MON                                                                      "+
	"      ,PMRT.LINK_RATIO(T.BOT_SR,NVL(T2.BOT_SR,0),2)   BOT_TB_MON                                                                      "+
	"      ,T3.BOT_SR BOT_SR_YEAR                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T3.BOT_SR,NVL(T4.BOT_SR,0),2)  BOT_TB_YEAR                                                                     "+
	"      ,T.EOC_SR EOC_SR_MON                                                                                                            "+
	"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T1.EOC_SR,0),2)   EOC_HB_MON                                                                      "+
	"      ,PMRT.LINK_RATIO(T.EOC_SR,NVL(T2.EOC_SR,0),2)   EOC_TB_MON                                                                      "+
	"      ,T3.EOC_SR EOC_SR_YEAR                                                                                                          "+
	"      ,PMRT.LINK_RATIO(T3.EOC_SR,NVL(T4.EOC_SR,0),2)  EOC_TB_YEAR                                                                     "+
	"FROM (                                                                                                                                "+
	"      SELECT GROUP_ID_1                                                                                                               "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
	"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
	"      WHERE DEAL_DATE="+dealDate+"                                                                                                          "+
	//"           --其他筛选条件                                                                                                           "+
	where +
	"      GROUP BY GROUP_ID_1                                                                                                             "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE                                                                                                             "+
	"            ,GROUP_ID_4_NAME                                                                                                          "+
	")T                                                                                                                                    "+
	"LEFT JOIN (                                                                                                                           "+
	"      SELECT GROUP_ID_1                                                                                                               "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
	"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')                                                       "+
	//"      --其他筛选条件                                                                                                                "+
	where +
	"      GROUP BY GROUP_ID_1                                                                                                             "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE                                                                                                             "+
	"            ,GROUP_ID_4_NAME                                                                                                          "+
	")T1                                                                                                                                   "+
	"ON(T.ROW_ID=T1.ROW_ID)                                                                                                                "+
	"LEFT JOIN (                                                                                                                           "+
	"      SELECT GROUP_ID_1                                                                                                               "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
	"            ,GROUP_ID_4_NAME        ROW_NAME                                                                                          "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')                                                      "+
	//"      --其他筛选条件                                                                                                                "+
	where +
	"      GROUP BY GROUP_ID_1                                                                                                             "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,UNIT_NAME                                                                                                                "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_MANAGE_NAME                                                                                                           "+
	"            ,HQ_CHAN_CODE                                                                                                             "+
	"            ,GROUP_ID_4_NAME                                                                                                          "+
	")T2                                                                                                                                   "+
	"ON(T.ROW_ID=T2.ROW_ID)                                                                                                                "+
	"LEFT JOIN (                                                                                                                           "+
	"      SELECT GROUP_ID_1                                                                                                               "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
	"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)                                                        "+
	//"      --其他筛选条件                                                                                                                "+
	where +
	"      GROUP BY GROUP_ID_1                                                                                                             "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_CHAN_CODE                                                                                                             "+
	")T3                                                                                                                                   "+
	"ON(T.ROW_ID=T3.ROW_ID)                                                                                                                "+
	"LEFT JOIN (                                                                                                                           "+
	"      SELECT GROUP_ID_1                                                                                                               "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_CHAN_CODE           ROW_ID                                                                                            "+
	"            ,NVL(SUM(ALL_SR),0) ALL_SR                                                                                                "+
	"            ,NVL(SUM(ZW_SR),0)  ZW_SR                                                                                                 "+
	"            ,NVL(SUM(BOT_SR),0) BOT_SR                                                                                                "+
	"            ,NVL(SUM(EOC_SR),0) EOC_SR                                                                                                "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_MON                                                                                               "+
	"      WHERE DEAL_DATE<=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM') AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)-1  "+
	//"      --其他筛选条件                                                                                                                "+
	where +
	"      GROUP BY GROUP_ID_1                                                                                                             "+
	"            ,GROUP_ID_1_NAME                                                                                                          "+
	"            ,UNIT_ID                                                                                                                  "+
	"            ,HR_ID                                                                                                                    "+
	"            ,HQ_CHAN_CODE                                                                                                             "+
	")T4                                                                                                                                   "+
	"ON(T.ROW_ID=T4.ROW_ID) ";
	
	showtext = "多维度收入月报";
	downloadExcel(sql,title,showtext);
}
