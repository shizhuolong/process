var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","ALL_SR_DAY","ALL_SR_MON","ALL_HB" ,"ZW_SR_DAY" ,"ZW_SR_MON" ,"ZW_HB" ,"BOT_SR_DAY" ,"BOT_SR_MON" ,"BOT_HB" ,"EOC_SR_DAY" ,"EOC_SR_MON","EOC_HB"];
	var title=[["州市","出账收入总体情况","","","自网收入","","","BOT收入","","","广电收入","",""],
			   ["","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入",""],
			   ["","","本期","环比","","本期","环比","","本期","环比","","本期","环比"]];
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
	if(orgLevel==1){
	sql = "SELECT T.ROW_ID                                                                        "+   
		"      ,T.ROW_NAME                                                                      "+   
		"      ,T.ALL_SR_DAY                                                                    "+   
		"      ,T.ALL_SR_MON                                                                    "+   
		"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                   "+   
		"      ,T.ZW_SR_DAY                                                                     "+   
		"      ,T.ZW_SR_MON                                                                     "+   
		"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                    "+   
		"      ,T.BOT_SR_DAY                                                                    "+   
		"      ,T.BOT_SR_MON                                                                    "+   
		"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                   "+   
		"      ,T.EOC_SR_DAY                                                                    "+   
		"      ,T.EOC_SR_MON                                                                    "+   
		"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                   "+   
		"FROM (                                                                                 "+   
		"      SELECT GROUP_ID_0     ROW_ID                                                     "+   
		"            ,'全省'         ROW_NAME                                                   "+   
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                         "+   
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                         "+   
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                          "+   
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                          "+   
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                         "+   
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                         "+   
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                         "+   
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                         "+   
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                                "+   
		"      WHERE DEAL_DATE="+dealDate+"                                                         "+   
		//条件                                                                                  "+
		where +
		"      GROUP BY GROUP_ID_0                                                              "+   
		")T                                                                                     "+   
		"LEFT JOIN (                                                                            "+   
		"      SELECT GROUP_ID_0     ROW_ID                                                     "+   
		"            ,'全省'         ROW_NAME                                                   "+   
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                         "+   
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                         "+   
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                          "+   
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                          "+   
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                         "+   
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                         "+   
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                         "+   
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                         "+   
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                                "+   
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')  "+   
		//条件                                                                             
		where +
		"      GROUP BY GROUP_ID_0                                                              "+   
		")T1                                                                                    "+   
		"ON(T.ROW_ID=T1.ROW_ID)  ";  
	}else if(orgLevel==2){
		sql = "SELECT T.ROW_ID                                                                       "+
		"      ,T.ROW_NAME                                                                     "+
		"      ,T.ALL_SR_DAY                                                                   "+
		"      ,T.ALL_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                  "+
		"      ,T.ZW_SR_DAY                                                                    "+
		"      ,T.ZW_SR_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                   "+
		"      ,T.BOT_SR_DAY                                                                   "+
		"      ,T.BOT_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                  "+
		"      ,T.EOC_SR_DAY                                                                   "+
		"      ,T.EOC_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                  "+
		"FROM (                                                                                "+
		"      SELECT GROUP_ID_1             ROW_ID                                            "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE="+dealDate+"                                                        "+
		//                                                                      
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		")T                                                                                    "+
		"LEFT JOIN (                                                                           "+
		"      SELECT GROUP_ID_1             ROW_ID                                            "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD') "+
		//                                
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		")T1                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                ";
	}else if(orgLevel==3){
		sql = "SELECT T.ROW_ID                                                                       "+
		"      ,T.ROW_NAME                                                                     "+
		"      ,T.ALL_SR_DAY                                                                   "+
		"      ,T.ALL_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                  "+
		"      ,T.ZW_SR_DAY                                                                    "+
		"      ,T.ZW_SR_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                   "+
		"      ,T.BOT_SR_DAY                                                                   "+
		"      ,T.BOT_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                  "+
		"      ,T.EOC_SR_DAY                                                                   "+
		"      ,T.EOC_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                  "+
		"FROM (                                                                                "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                ROW_ID                                            "+
		"            ,UNIT_NAME              ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE="+dealDate+"                                                        "+
		//                                                           
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		"              ,UNIT_ID                                                                "+
		"              ,UNIT_NAME                                                              "+
		")T                                                                                    "+
		"LEFT JOIN (                                                                           "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                ROW_ID                                            "+
		"            ,UNIT_NAME              ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD') "+
		//                                                    
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		"              ,UNIT_ID                                                                "+
		"              ,UNIT_NAME                                                              "+
		")T1                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                ";
	}else if(orgLevel==4){
		sql = "SELECT T.ROW_ID                                                                      "+
		"      ,T.ROW_NAME                                                                    "+
		"      ,T.ALL_SR_DAY                                                                  "+
		"      ,T.ALL_SR_MON                                                                  "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                 "+
		"      ,T.ZW_SR_DAY                                                                   "+
		"      ,T.ZW_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                  "+
		"      ,T.BOT_SR_DAY                                                                  "+
		"      ,T.BOT_SR_MON                                                                  "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                 "+
		"      ,T.EOC_SR_DAY                                                                  "+
		"      ,T.EOC_SR_MON                                                                  "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                 "+
		"FROM (                                                                               "+
		"      SELECT GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                         "+
		"            ,UNIT_ID                                                                 "+
		"            ,UNIT_NAME                                                               "+
		"            ,HR_ID                  ROW_ID                                           "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                         "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                       "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                       "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                        "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                        "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                       "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                       "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                       "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                       "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                              "+
		"      WHERE DEAL_DATE="+dealDate+"                                                       "+
		//                      
		where +
		"      GROUP BY GROUP_ID_1                                                            "+
		"              ,GROUP_ID_1_NAME                                                       "+
		"              ,UNIT_ID                                                               "+
		"              ,UNIT_NAME                                                             "+
		"              ,HR_ID                                                                 "+
		"              ,HQ_MANAGE_NAME                                                        "+
		")T                                                                                   "+
		"LEFT JOIN (                                                                          "+
		"      SELECT GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                         "+
		"            ,UNIT_ID                                                                 "+
		"            ,UNIT_NAME                                                               "+
		"            ,HR_ID                  ROW_ID                                           "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                         "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                       "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                       "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                        "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                        "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                       "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                       "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                       "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                       "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')"+
		//       
		where +
		"      GROUP BY GROUP_ID_1                                                            "+
		"              ,GROUP_ID_1_NAME                                                       "+
		"              ,UNIT_ID                                                               "+
		"              ,UNIT_NAME                                                             "+
		"              ,HR_ID                                                                 "+
		"              ,HQ_MANAGE_NAME                                                        "+
		")T1                                                                                  "+
		"ON(T.ROW_ID=T1.ROW_ID) ";
	}else if(orgLevel==5){
		sql = "SELECT T.ROW_ID                                                                       "+
		"      ,T.ROW_NAME                                                                     "+
		"      ,T.ALL_SR_DAY                                                                   "+
		"      ,T.ALL_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                  "+
		"      ,T.ZW_SR_DAY                                                                    "+
		"      ,T.ZW_SR_MON                                                                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                   "+
		"      ,T.BOT_SR_DAY                                                                   "+
		"      ,T.BOT_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                  "+
		"      ,T.EOC_SR_DAY                                                                   "+
		"      ,T.EOC_SR_MON                                                                   "+
		"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                  "+
		"FROM (                                                                                "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                                "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE="+dealDate+"                                                        "+
//		                                                             
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		"              ,UNIT_ID                                                                "+
		"              ,UNIT_NAME                                                              "+
		"              ,HR_ID                                                                  "+
		"              ,HQ_MANAGE_NAME                                                         "+
		"              ,HQ_CHAN_CODE                                                           "+
		"              ,GROUP_ID_4_NAME                                                        "+
		")T                                                                                    "+
		"LEFT JOIN (                                                                           "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                                "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
		"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
		"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
		"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
		"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
		"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
		"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
		"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD') "+
//		                                         
		where +
		"      GROUP BY GROUP_ID_1                                                             "+
		"              ,GROUP_ID_1_NAME                                                        "+
		"              ,UNIT_ID                                                                "+
		"              ,UNIT_NAME                                                              "+
		"              ,HR_ID                                                                  "+
		"              ,HQ_MANAGE_NAME                                                         "+
		"              ,HQ_CHAN_CODE                                                           "+
		"              ,GROUP_ID_4_NAME                                                        "+
		")T1                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)   ";
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
	
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_MANAGE_NAME","HR_ID","ROW_ID","ROW_NAME","ALL_SR_DAY","ALL_SR_MON","ALL_HB" ,"ZW_SR_DAY" ,"ZW_SR_MON" ,"ZW_HB" ,"BOT_SR_DAY" ,"BOT_SR_MON" ,"BOT_HB" ,"EOC_SR_DAY" ,"EOC_SR_MON","EOC_HB"];
	var title=[["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","出账收入总体情况","","","自网收入","","","BOT收入","","","广电收入","",""],
			   ["","","","","","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入","","当日出账收入","当月累计出账收入",""],
			   ["","","","","","","","本期","环比","","本期","环比","","本期","环比","","本期","环比"]];
	var sql = "SELECT T.GROUP_ID_1_NAME GROUP_ID_1_NAME," +
			"T.UNIT_NAME UNIT_NAME,T.HQ_MANAGE_NAME HQ_MANAGE_NAME," +
			"T.HR_ID HR_ID,T.ROW_ID ROW_ID "+
	"      ,T.ROW_NAME                                                                     "+
	"      ,T.ALL_SR_DAY                                                                   "+
	"      ,T.ALL_SR_MON                                                                   "+
	"      ,PMRT.LINK_RATIO(T.ALL_SR_MON,NVL(T1.ALL_SR_MON,0),2)   ALL_HB                  "+
	"      ,T.ZW_SR_DAY                                                                    "+
	"      ,T.ZW_SR_MON                                                                    "+
	"      ,PMRT.LINK_RATIO(T.ZW_SR_MON,NVL(T1.ZW_SR_MON,0),2)     ZW_HB                   "+
	"      ,T.BOT_SR_DAY                                                                   "+
	"      ,T.BOT_SR_MON                                                                   "+
	"      ,PMRT.LINK_RATIO(T.BOT_SR_MON,NVL(T1.BOT_SR_MON,0),2)   BOT_HB                  "+
	"      ,T.EOC_SR_DAY                                                                   "+
	"      ,T.EOC_SR_MON                                                                   "+
	"      ,PMRT.LINK_RATIO(T.EOC_SR_MON,NVL(T1.EOC_SR_MON,0),2)   EOC_HB                  "+
	"FROM (                                                                                "+
	"      SELECT GROUP_ID_1                                                               "+
	"            ,GROUP_ID_1_NAME                                                          "+
	"            ,UNIT_ID                                                                  "+
	"            ,UNIT_NAME                                                                "+
	"            ,HR_ID                                                                    "+
	"            ,HQ_MANAGE_NAME                                                           "+
	"            ,HQ_CHAN_CODE           ROW_ID                                            "+
	"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
	"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
	"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
	"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
	"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
	"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
	"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
	"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
	"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
	"      WHERE DEAL_DATE="+dealDate+"                                                        "+
//	                                                             
	where +
	"      GROUP BY GROUP_ID_1                                                             "+
	"              ,GROUP_ID_1_NAME                                                        "+
	"              ,UNIT_ID                                                                "+
	"              ,UNIT_NAME                                                              "+
	"              ,HR_ID                                                                  "+
	"              ,HQ_MANAGE_NAME                                                         "+
	"              ,HQ_CHAN_CODE                                                           "+
	"              ,GROUP_ID_4_NAME                                                        "+
	")T                                                                                    "+
	"LEFT JOIN (                                                                           "+
	"      SELECT GROUP_ID_1                                                               "+
	"            ,GROUP_ID_1_NAME                                                          "+
	"            ,UNIT_ID                                                                  "+
	"            ,UNIT_NAME                                                                "+
	"            ,HR_ID                                                                    "+
	"            ,HQ_MANAGE_NAME                                                           "+
	"            ,HQ_CHAN_CODE           ROW_ID                                            "+
	"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
	"            ,NVL(SUM(ALL_SR_DAY),0) ALL_SR_DAY                                        "+
	"            ,NVL(SUM(ALL_SR_MON),0) ALL_SR_MON                                        "+
	"            ,NVL(SUM(ZW_SR_DAY),0)  ZW_SR_DAY                                         "+
	"            ,NVL(SUM(ZW_SR_MON),0)  ZW_SR_MON                                         "+
	"            ,NVL(SUM(BOT_SR_DAY),0) BOT_SR_DAY                                        "+
	"            ,NVL(SUM(BOT_SR_MON),0) BOT_SR_MON                                        "+
	"            ,NVL(SUM(EOC_SR_DAY),0) EOC_SR_DAY                                        "+
	"            ,NVL(SUM(EOC_SR_MON),0) EOC_SR_MON                                        "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_SR_DAY                                               "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD') "+
//	                                         
	where +
	"      GROUP BY GROUP_ID_1                                                             "+
	"              ,GROUP_ID_1_NAME                                                        "+
	"              ,UNIT_ID                                                                "+
	"              ,UNIT_NAME                                                              "+
	"              ,HR_ID                                                                  "+
	"              ,HQ_MANAGE_NAME                                                         "+
	"              ,HQ_CHAN_CODE                                                           "+
	"              ,GROUP_ID_4_NAME                                                        "+
	")T1                                                                                   "+
	"ON(T.ROW_ID=T1.ROW_ID)   ";
	
	showtext = "多维度收入日报";
	downloadExcel(sql,title,showtext);
}
