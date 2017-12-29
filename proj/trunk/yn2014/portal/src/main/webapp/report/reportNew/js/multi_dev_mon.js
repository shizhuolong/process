var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","ALL_NUM_MON","ALL_NUM_YEAR","ALL_TB_MON","ALL_HB_MON","ZW_NUM_MON","ZW_NUM_YEAR","ZW_ZB_MON","ZW_TB_MON","ZW_HB_MON","BOT_NUM_MON","BOT_NUM_YEAR","BOT_ZB_MON","BOT_TB_MON","BOT_HB_MON","GD_NUM_MON","GD_NUM_YEAR","GD_ZB_MON","GD_TB_MON","GD_HB_MON","FTTH_NUM_MON","FTTH_NUM_YEAR","FTTH_ZB_MON","FTTH_TB_MON","FTTH_HB_MON","LAN_NUM_MON","LAN_NUM_YEAR","LAN_ZB_MON","LAN_TB_MON","LAN_HB_MON","EOC_NUM_MON","EOC_NUM_YEAR","EOC_ZB_MON","EOC_TB_MON","EOC_HB_MON","ADSL_NUM_MON","ADSL_NUM_YEAR","ADSL_ZB_MON","ADSL_TB_MON","ADSL_HB_MON","LESS_50M_NUM_MON","LESS_50M_NUM_YEAR","LESS_50M_ZB_MON","LESS_50M_TB_MON","LESS_50M_HB_MON","MORE_50M_NUM_MON","MORE_50M_NUM_YEAR","MORE_50M_ZB_MON","MORE_50M_TB_MON","MORE_50M_HB_MON","DKD_NUM_MON","DKD_NUM_YEAR","DKD_ZB_MON","DKD_TB_MON","DKD_HB_MON","RH_NUM_MON","RH_NUM_YEAR","RH_ZB_MON","RH_TB_MON","RH_HB_MON","TV_NUM_MON","TV_NUM_YEAR","TV_ZB_MON","TV_TB_MON","TV_HB_MON"];
	var title=[["组织架构","新增用户数","","","","资源维度","","","","","","","","","","","","","","","接入方式维度","","","","","","","","","","","","","","","","","","","","带宽维度","","","","","","","","","","产品维度","","","","","","","","","","","","","",""],
			   ["","","","","","自网新增用户数","","","","","BOT新增用户数","","","","","广电新增用户数","","","","","FTTH新增用户数","","","","","LAN新增用户数","","","","","EOC新增用户数","","","","","ADSL新增用户数","","","","","50M以下新增用户数","","","","","50M及以上新增用户数","","","","","单宽带新增用户数","","","","","融合业务新增用户数（智慧沃家）","","","","","TV","","","",""],
			   ["","本期","累计","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比"]];
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
	sql = "SELECT T.ROW_ID                                                                   "+
	"      ,T.ROW_NAME                                                                 "+
	"      ,T.ALL_NUM ALL_NUM_MON                                                      "+
	"      ,T3.ALL_NUM ALL_NUM_YEAR                                                    "+
	"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                "+
	"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                "+
	"      ,T.ZW_NUM ZW_NUM_MON                                                        "+
	"      ,T3.ZW_NUM ZW_NUM_YEAR                                                      "+
	"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                   "+
	"      ,T.BOT_NUM BOT_NUM_MON                                                      "+
	"      ,T3.BOT_NUM BOT_NUM_YEAR                                                    "+
	"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                "+
	"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                "+
	"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                "+
	"      ,T.GD_NUM GD_NUM_MON                                                        "+
	"      ,T3.GD_NUM GD_NUM_YEAR                                                      "+
	"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                   "+
	"      ,T.FTTH_NUM FTTH_NUM_MON                                                    "+
	"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                  "+
	"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON             "+
	"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON             "+
	"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON             "+
	"      ,T.LAN_NUM LAN_NUM_MON                                                      "+
	"      ,T3.LAN_NUM LAN_NUM_YEAR                                                    "+
	"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                "+
	"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                "+
	"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                "+
	"      ,T.EOC_NUM EOC_NUM_MON                                                      "+
	"      ,T3.EOC_NUM EOC_NUM_YEAR                                                    "+
	"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                "+
	"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                "+
	"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                "+
	"	  ,T.ADSL_NUM ADSL_NUM_MON                                                     "+
	"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                  "+
	"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON             "+
	"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON             "+
	"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON             "+
	"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                            "+
	"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                          "+
	"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON "+
	"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON "+
	"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON "+
	"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                            "+
	"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                          "+
	"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON "+
	"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON "+
	"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON "+
	"      ,T.DKD_NUM DKD_NUM_MON                                                      "+
	"      ,T3.DKD_NUM DKD_NUM_YEAR                                                    "+
	"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                "+
	"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                "+
	"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                "+
	"      ,T.RH_NUM RH_NUM_MON                                                        "+
	"      ,T3.RH_NUM RH_NUM_YEAR                                                      "+
	"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                   "+
	"      ,T.TV_NUM TV_NUM_MON                                                        "+
	"      ,T3.TV_NUM TV_NUM_YEAR                                                      "+
	"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                   "+
	"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                   "+
	"FROM (                                                                            "+
	"      SELECT GROUP_ID_0             ROW_ID                                        "+
	"            ,'全省'                 ROW_NAME                                      "+
	"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
	"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
	"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
	"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
	"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
	"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
	"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
	"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
	"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
	"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
	"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
	"      WHERE DEAL_DATE="+dealDate+"                                                      "+
	//"           --其他筛选条件                                                       "+
	where+
	"      GROUP BY GROUP_ID_0                                                         "+
	")T                                                                                "+
	"LEFT JOIN (                                                                       "+
	"      SELECT GROUP_ID_0      ROW_ID                                               "+
	"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
	"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
	"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
	"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
	"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
	"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
	"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
	"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
	"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
	"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
	"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')   "+
	//"      --其他筛选条件                                                            "+
	where+
	"      GROUP BY GROUP_ID_0                                                         "+
	")T1                                                                               "+
	"ON(T.ROW_ID=T1.ROW_ID)                                                            "+
	"LEFT JOIN (                                                                       "+
	"      SELECT GROUP_ID_0              ROW_ID                                       "+
	"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
	"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
	"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
	"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
	"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
	"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
	"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
	"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
	"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
	"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
	"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')  "+
	//"      --其他筛选条件                                                            "+
	where+
	"      GROUP BY GROUP_ID_0                                                         "+
	")T2                                                                               "+
	"ON(T.ROW_ID=T2.ROW_ID)                                                            "+
	"LEFT JOIN (                                                                       "+
	"      SELECT GROUP_ID_0          ROW_ID                                           "+
	"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
	"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
	"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
	"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
	"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
	"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
	"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
	"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
	"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
	"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
	"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
	"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
	"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
	"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)    "+
	//"      --其他筛选条件                                                            "+
	where+
	"      GROUP BY GROUP_ID_0                                                         "+
	")T3                                                                               "+
	"ON(T.ROW_ID=T3.ROW_ID) ";
	}else if(orgLevel==2){//地市级
		sql = "SELECT T.ROW_ID                                                                    "+
		"      ,T.ROW_NAME                                                                  "+
		"      ,T.ALL_NUM ALL_NUM_MON                                                       "+
		"      ,T3.ALL_NUM ALL_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                 "+
		"      ,T.ZW_NUM ZW_NUM_MON                                                         "+
		"      ,T3.ZW_NUM ZW_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                    "+
		"      ,T.BOT_NUM BOT_NUM_MON                                                       "+
		"      ,T3.BOT_NUM BOT_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                 "+
		"      ,T.GD_NUM GD_NUM_MON                                                         "+
		"      ,T3.GD_NUM GD_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                    "+
		"      ,T.FTTH_NUM FTTH_NUM_MON                                                     "+
		"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON              "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON              "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON              "+
		"      ,T.LAN_NUM LAN_NUM_MON                                                       "+
		"      ,T3.LAN_NUM LAN_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                 "+
		"      ,T.EOC_NUM EOC_NUM_MON                                                       "+
		"      ,T3.EOC_NUM EOC_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                 "+
		"	  ,T.ADSL_NUM ADSL_NUM_MON                                                      "+
		"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON              "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON              "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON              "+
		"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                             "+
		"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                           "+
		"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON  "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON  "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON  "+
		"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                             "+
		"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                           "+
		"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON  "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON  "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON  "+
		"      ,T.DKD_NUM DKD_NUM_MON                                                       "+
		"      ,T3.DKD_NUM DKD_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                 "+
		"      ,T.RH_NUM RH_NUM_MON                                                         "+
		"      ,T3.RH_NUM RH_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                    "+
		"      ,T.TV_NUM TV_NUM_MON                                                         "+
		"      ,T3.TV_NUM TV_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                    "+
		"FROM (                                                                             "+
		"      SELECT GROUP_ID_1             ROW_ID                                         "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE="+dealDate+"                                                       "+
		//"           --其他筛选条件                                                        "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		")T                                                                                 "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1             ROW_ID                                         "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')    "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		")T1                                                                                "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                             "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1             ROW_ID                                         "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')   "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		")T2                                                                                "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                             "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1             ROW_ID                                         "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)     "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		")T3                                                                                "+
		"ON(T.ROW_ID=T3.ROW_ID)   ";
	}else if(orgLevel==3){ //营服级
		sql = "SELECT T.ROW_ID                                                                   "+
		"      ,T.ROW_NAME                                                                 "+
		"      ,T.ALL_NUM ALL_NUM_MON                                                      "+
		"      ,T3.ALL_NUM ALL_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                "+
		"      ,T.ZW_NUM ZW_NUM_MON                                                        "+
		"      ,T3.ZW_NUM ZW_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                   "+
		"      ,T.BOT_NUM BOT_NUM_MON                                                      "+
		"      ,T3.BOT_NUM BOT_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                "+
		"      ,T.GD_NUM GD_NUM_MON                                                        "+
		"      ,T3.GD_NUM GD_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                   "+
		"      ,T.FTTH_NUM FTTH_NUM_MON                                                    "+
		"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON             "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON             "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON             "+
		"      ,T.LAN_NUM LAN_NUM_MON                                                      "+
		"      ,T3.LAN_NUM LAN_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                "+
		"      ,T.EOC_NUM EOC_NUM_MON                                                      "+
		"      ,T3.EOC_NUM EOC_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                "+
		"	  ,T.ADSL_NUM ADSL_NUM_MON                                                     "+
		"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON             "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON             "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON             "+
		"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                            "+
		"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                          "+
		"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON "+
		"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                            "+
		"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                          "+
		"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON "+
		"      ,T.DKD_NUM DKD_NUM_MON                                                      "+
		"      ,T3.DKD_NUM DKD_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                "+
		"      ,T.RH_NUM RH_NUM_MON                                                        "+
		"      ,T3.RH_NUM RH_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                   "+
		"      ,T.TV_NUM TV_NUM_MON                                                        "+
		"      ,T3.TV_NUM TV_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                   "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                   "+
		"FROM (                                                                            "+
		"      SELECT GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                ROW_ID                                        "+
		"            ,UNIT_NAME              ROW_NAME                                      "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
		"      WHERE DEAL_DATE="+dealDate+"                                                      "+
		//"           --其他筛选条件                                                       "+
		where+
		"      GROUP BY GROUP_ID_1                                                         "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                                                              "+
		"            ,UNIT_NAME                                                            "+
		")T                                                                                "+
		"LEFT JOIN (                                                                       "+
		"      SELECT GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                ROW_ID                                        "+
		"            ,UNIT_NAME              ROW_NAME                                      "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')   "+
		//"      --其他筛选条件                                                            "+
		where+
		"      GROUP BY GROUP_ID_1                                                         "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                                                              "+
		"            ,UNIT_NAME                                                            "+
		")T1                                                                               "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                            "+
		"LEFT JOIN (                                                                       "+
		"      SELECT GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                ROW_ID                                        "+
		"            ,UNIT_NAME              ROW_NAME                                      "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')  "+
		//"      --其他筛选条件                                                            "+
		where+
		"      GROUP BY GROUP_ID_1                                                         "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                                                              "+
		"            ,UNIT_NAME                                                            "+
		")T2                                                                               "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                            "+
		"LEFT JOIN (                                                                       "+
		"      SELECT GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                ROW_ID                                        "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                          "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                           "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                           "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                         "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                          "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                          "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                        "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                          "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                            "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                            "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                          "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)    "+
		//"      --其他筛选条件                                                            "+
		where+
		"      GROUP BY GROUP_ID_1                                                         "+
		"            ,GROUP_ID_1_NAME                                                      "+
		"            ,UNIT_ID                                                              "+
		")T3                                                                               "+
		"ON(T.ROW_ID=T3.ROW_ID)  ";
	}else if(orgLevel==4){ //宽固经理
		sql = "SELECT T.ROW_ID                                                                     "+
		"      ,T.ROW_NAME                                                                   "+
		"      ,T.ALL_NUM ALL_NUM_MON                                                        "+
		"      ,T3.ALL_NUM ALL_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                  "+
		"      ,T.ZW_NUM ZW_NUM_MON                                                          "+
		"      ,T3.ZW_NUM ZW_NUM_YEAR                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                     "+
		"      ,T.BOT_NUM BOT_NUM_MON                                                        "+
		"      ,T3.BOT_NUM BOT_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                  "+
		"      ,T.GD_NUM GD_NUM_MON                                                          "+
		"      ,T3.GD_NUM GD_NUM_YEAR                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                     "+
		"      ,T.FTTH_NUM FTTH_NUM_MON                                                      "+
		"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON               "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON               "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON               "+
		"      ,T.LAN_NUM LAN_NUM_MON                                                        "+
		"      ,T3.LAN_NUM LAN_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                  "+
		"      ,T.EOC_NUM EOC_NUM_MON                                                        "+
		"      ,T3.EOC_NUM EOC_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                  "+
		"	  ,T.ADSL_NUM ADSL_NUM_MON                                                       "+
		"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON               "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON               "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON               "+
		"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                              "+
		"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                            "+
		"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON   "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON   "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON   "+
		"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                              "+
		"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                            "+
		"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON   "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON   "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON   "+
		"      ,T.DKD_NUM DKD_NUM_MON                                                        "+
		"      ,T3.DKD_NUM DKD_NUM_YEAR                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                  "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                  "+
		"      ,T.RH_NUM RH_NUM_MON                                                          "+
		"      ,T3.RH_NUM RH_NUM_YEAR                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                     "+
		"      ,T.TV_NUM TV_NUM_MON                                                          "+
		"      ,T3.TV_NUM TV_NUM_YEAR                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                     "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                     "+
		"FROM (                                                                              "+
		"      SELECT GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                  ROW_ID                                          "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                        "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                            "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                             "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                             "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                           "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                            "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                          "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                  "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                  "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                            "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                              "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                            "+
		"      WHERE DEAL_DATE="+dealDate+"                                                        "+
		//"           --其他筛选条件                                                         "+
		where+
		"      GROUP BY GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                                                                  "+
		"            ,HQ_MANAGE_NAME                                                         "+
		")T                                                                                  "+
		"LEFT JOIN (                                                                         "+
		"      SELECT GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                  ROW_ID                                          "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                        "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                            "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                             "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                             "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                           "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                            "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                          "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                  "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                  "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                            "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                              "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                            "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')     "+
		//"      --其他筛选条件                                                              "+
		where+
		"      GROUP BY GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                                                                  "+
		"            ,HQ_MANAGE_NAME                                                         "+
		")T1                                                                                 "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                              "+
		"LEFT JOIN (                                                                         "+
		"      SELECT GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                  ROW_ID                                          "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                        "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                            "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                             "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                             "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                           "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                            "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                          "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                  "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                  "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                            "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                              "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                            "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')    "+
		//"      --其他筛选条件                                                              "+
		where+
		"      GROUP BY GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,UNIT_NAME                                                              "+
		"            ,HR_ID                                                                  "+
		"            ,HQ_MANAGE_NAME                                                         "+
		")T2                                                                                 "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                              "+
		"LEFT JOIN (                                                                         "+
		"      SELECT GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,HR_ID                  ROW_ID                                          "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                            "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                             "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                             "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                           "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                            "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                            "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                          "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                  "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                  "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                            "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                              "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                              "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                            "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)      "+
		//"      --其他筛选条件                                                              "+
		where+
		"      GROUP BY GROUP_ID_1                                                           "+
		"            ,GROUP_ID_1_NAME                                                        "+
		"            ,UNIT_ID                                                                "+
		"            ,HR_ID                                                                  "+
		")T3                                                                                 "+
		"ON(T.ROW_ID=T3.ROW_ID) ";
	}else if(orgLevel==5){ //渠道级
		sql = "SELECT T.ROW_ID                                                                    "+
		"      ,T.ROW_NAME                                                                  "+
		"      ,T.ALL_NUM ALL_NUM_MON                                                       "+
		"      ,T3.ALL_NUM ALL_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                 "+
		"      ,T.ZW_NUM ZW_NUM_MON                                                         "+
		"      ,T3.ZW_NUM ZW_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                    "+
		"      ,T.BOT_NUM BOT_NUM_MON                                                       "+
		"      ,T3.BOT_NUM BOT_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                 "+
		"      ,T.GD_NUM GD_NUM_MON                                                         "+
		"      ,T3.GD_NUM GD_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                    "+
		"      ,T.FTTH_NUM FTTH_NUM_MON                                                     "+
		"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON              "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON              "+
		"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON              "+
		"      ,T.LAN_NUM LAN_NUM_MON                                                       "+
		"      ,T3.LAN_NUM LAN_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                 "+
		"      ,T.EOC_NUM EOC_NUM_MON                                                       "+
		"      ,T3.EOC_NUM EOC_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                 "+
		"	  ,T.ADSL_NUM ADSL_NUM_MON                                                      "+
		"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON              "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON              "+
		"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON              "+
		"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                             "+
		"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                           "+
		"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON  "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON  "+
		"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON  "+
		"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                             "+
		"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                           "+
		"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON  "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON  "+
		"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON  "+
		"      ,T.DKD_NUM DKD_NUM_MON                                                       "+
		"      ,T3.DKD_NUM DKD_NUM_YEAR                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                 "+
		"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                 "+
		"      ,T.RH_NUM RH_NUM_MON                                                         "+
		"      ,T3.RH_NUM RH_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                    "+
		"      ,T.TV_NUM TV_NUM_MON                                                         "+
		"      ,T3.TV_NUM TV_NUM_YEAR                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                    "+
		"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                    "+
		"FROM (                                                                             "+
		"      SELECT GROUP_ID_1                                                            "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE           ROW_ID                                         "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE="+dealDate+"                                                       "+
		//"           --其他筛选条件                                                        "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE                                                          "+
		"            ,GROUP_ID_4_NAME                                                       "+
		")T                                                                                 "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1                                                            "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE           ROW_ID                                         "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')    "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE                                                          "+
		"            ,GROUP_ID_4_NAME                                                       "+
		")T1                                                                                "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                             "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1                                                            "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE           ROW_ID                                         "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')   "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,UNIT_NAME                                                             "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_MANAGE_NAME                                                        "+
		"            ,HQ_CHAN_CODE                                                          "+
		"            ,GROUP_ID_4_NAME                                                       "+
		")T2                                                                                "+
		"ON(T.ROW_ID=T2.ROW_ID)                                                             "+
		"LEFT JOIN (                                                                        "+
		"      SELECT GROUP_ID_1                                                            "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_CHAN_CODE           ROW_ID                                         "+
		"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
		"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
		"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
		"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
		"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
		"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
		"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
		"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
		"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
		"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
		"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
		"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
		"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
		"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)     "+
		//"      --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                          "+
		"            ,GROUP_ID_1_NAME                                                       "+
		"            ,UNIT_ID                                                               "+
		"            ,HR_ID                                                                 "+
		"            ,HQ_CHAN_CODE                                                          "+
		")T3                                                                                "+
		"ON(T.ROW_ID=T3.ROW_ID)  ";
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
	
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_MANAGE_NAME","HR_ID","ROW_ID","ROW_NAME","ALL_NUM_MON","ALL_NUM_YEAR","ALL_TB_MON","ALL_HB_MON","ZW_NUM_MON","ZW_NUM_YEAR","ZW_ZB_MON","ZW_TB_MON","ZW_HB_MON","BOT_NUM_MON","BOT_NUM_YEAR","BOT_ZB_MON","BOT_TB_MON","BOT_HB_MON","GD_NUM_MON","GD_NUM_YEAR","GD_ZB_MON","GD_TB_MON","GD_HB_MON","FTTH_NUM_MON","FTTH_NUM_YEAR","FTTH_ZB_MON","FTTH_TB_MON","FTTH_HB_MON","LAN_NUM_MON","LAN_NUM_YEAR","LAN_ZB_MON","LAN_TB_MON","LAN_HB_MON","EOC_NUM_MON","EOC_NUM_YEAR","EOC_ZB_MON","EOC_TB_MON","EOC_HB_MON","ADSL_NUM_MON","ADSL_NUM_YEAR","ADSL_ZB_MON","ADSL_TB_MON","ADSL_HB_MON","LESS_50M_NUM_MON","LESS_50M_NUM_YEAR","LESS_50M_ZB_MON","LESS_50M_TB_MON","LESS_50M_HB_MON","MORE_50M_NUM_MON","MORE_50M_NUM_YEAR","MORE_50M_ZB_MON","MORE_50M_TB_MON","MORE_50M_HB_MON","DKD_NUM_MON","DKD_NUM_YEAR","DKD_ZB_MON","DKD_TB_MON","DKD_HB_MON","RH_NUM_MON","RH_NUM_YEAR","RH_ZB_MON","RH_TB_MON","RH_HB_MON","TV_NUM_MON","TV_NUM_YEAR","TV_ZB_MON","TV_TB_MON","TV_HB_MON"];
	var title=[["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","新增用户数","","","","资源维度","","","","","","","","","","","","","","","接入方式维度","","","","","","","","","","","","","","","","","","","","带宽维度","","","","","","","","","","产品维度","","","","","","","","","","","","","",""],
			   ["","","","","","","","","","","自网新增用户数","","","","","BOT新增用户数","","","","","广电新增用户数","","","","","FTTH新增用户数","","","","","LAN新增用户数","","","","","EOC新增用户数","","","","","ADSL新增用户数","","","","","50M以下新增用户数","","","","","50M及以上新增用户数","","","","","单宽带新增用户数","","","","","融合业务新增用户数（智慧沃家）","","","","","TV","","","",""],
			   ["","","","","","","本期","累计","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比","本期","累计","占比","同比","环比"]];
	var sql = "SELECT T.GROUP_ID_1_NAME GROUP_ID_1_NAME,T.UNIT_NAME UNIT_NAME,T.HQ_MANAGE_NAME HQ_MANAGE_NAME,T.HR_ID HR_ID," +
			"       T.ROW_ID                                                                    "+
			"      ,T.ROW_NAME                                                                  "+
			"      ,T.ALL_NUM ALL_NUM_MON                                                       "+
			"      ,T3.ALL_NUM ALL_NUM_YEAR                                                     "+
			"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T2.ALL_NUM,0),2)   ALL_TB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.ALL_NUM,NVL(T1.ALL_NUM,0),2)   ALL_HB_MON                 "+
			"      ,T.ZW_NUM ZW_NUM_MON                                                         "+
			"      ,T3.ZW_NUM ZW_NUM_YEAR                                                       "+
			"      ,PMRT.LINK_RATIO_ZB(T.ZW_NUM,NVL(T.ALL_NUM,0),2)   ZW_ZB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T2.ZW_NUM,0),2)   ZW_TB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.ZW_NUM,NVL(T1.ZW_NUM,0),2)   ZW_HB_MON                    "+
			"      ,T.BOT_NUM BOT_NUM_MON                                                       "+
			"      ,T3.BOT_NUM BOT_NUM_YEAR                                                     "+
			"      ,PMRT.LINK_RATIO_ZB(T.BOT_NUM,NVL(T.ALL_NUM,0),2)    BOT_ZB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T2.BOT_NUM,0),2)   BOT_TB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.BOT_NUM,NVL(T1.BOT_NUM,0),2)   BOT_HB_MON                 "+
			"      ,T.GD_NUM GD_NUM_MON                                                         "+
			"      ,T3.GD_NUM GD_NUM_YEAR                                                       "+
			"      ,PMRT.LINK_RATIO_ZB(T.GD_NUM,NVL(T.ALL_NUM,0),2)   GD_ZB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T2.GD_NUM,0),2)   GD_TB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.GD_NUM,NVL(T1.GD_NUM,0),2)   GD_HB_MON                    "+
			"      ,T.FTTH_NUM FTTH_NUM_MON                                                     "+
			"      ,T3.FTTH_NUM FTTH_NUM_YEAR                                                   "+
			"      ,PMRT.LINK_RATIO_ZB(T.FTTH_NUM,NVL(T.ALL_NUM,0),2)     FTTH_ZB_MON              "+
			"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T2.FTTH_NUM,0),2)   FTTH_TB_MON              "+
			"      ,PMRT.LINK_RATIO(T.FTTH_NUM,NVL(T1.FTTH_NUM,0),2)   FTTH_HB_MON              "+
			"      ,T.LAN_NUM LAN_NUM_MON                                                       "+
			"      ,T3.LAN_NUM LAN_NUM_YEAR                                                     "+
			"      ,PMRT.LINK_RATIO_ZB(T.LAN_NUM,NVL(T.ALL_NUM,0),2)    LAN_ZB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T2.LAN_NUM,0),2)   LAN_TB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.LAN_NUM,NVL(T1.LAN_NUM,0),2)   LAN_HB_MON                 "+
			"      ,T.EOC_NUM EOC_NUM_MON                                                       "+
			"      ,T3.EOC_NUM EOC_NUM_YEAR                                                     "+
			"      ,PMRT.LINK_RATIO_ZB(T.EOC_NUM,NVL(T.ALL_NUM,0),2)    EOC_ZB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T2.EOC_NUM,0),2)   EOC_TB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.EOC_NUM,NVL(T1.EOC_NUM,0),2)   EOC_HB_MON                 "+
			"	  ,T.ADSL_NUM ADSL_NUM_MON                                                      "+
			"      ,T3.ADSL_NUM ADSL_NUM_YEAR                                                   "+
			"      ,PMRT.LINK_RATIO_ZB(T.ADSL_NUM,NVL(T.ALL_NUM,0),2)     ADSL_ZB_MON              "+
			"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T2.ADSL_NUM,0),2)   ADSL_TB_MON              "+
			"      ,PMRT.LINK_RATIO(T.ADSL_NUM,NVL(T1.ADSL_NUM,0),2)   ADSL_HB_MON              "+
			"      ,T.LESS_50M_NUM LESS_50M_NUM_MON                                             "+
			"      ,T3.LESS_50M_NUM LESS_50M_NUM_YEAR                                           "+
			"      ,PMRT.LINK_RATIO_ZB(T.LESS_50M_NUM,NVL(T.ALL_NUM,0),2)         LESS_50M_ZB_MON  "+
			"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T2.LESS_50M_NUM,0),2)   LESS_50M_TB_MON  "+
			"      ,PMRT.LINK_RATIO(T.LESS_50M_NUM,NVL(T1.LESS_50M_NUM,0),2)   LESS_50M_HB_MON  "+
			"      ,T.MORE_50M_NUM MORE_50M_NUM_MON                                             "+
			"      ,T3.MORE_50M_NUM MORE_50M_NUM_YEAR                                           "+
			"      ,PMRT.LINK_RATIO_ZB(T.MORE_50M_NUM,NVL(T.ALL_NUM,0),2)         MORE_50M_ZB_MON  "+
			"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T2.MORE_50M_NUM,0),2)   MORE_50M_TB_MON  "+
			"      ,PMRT.LINK_RATIO(T.MORE_50M_NUM,NVL(T1.MORE_50M_NUM,0),2)   MORE_50M_HB_MON  "+
			"      ,T.DKD_NUM DKD_NUM_MON                                                       "+
			"      ,T3.DKD_NUM DKD_NUM_YEAR                                                     "+
			"      ,PMRT.LINK_RATIO_ZB(T.DKD_NUM,NVL(T.ALL_NUM,0),2)    DKD_ZB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T2.DKD_NUM,0),2)   DKD_TB_MON                 "+
			"      ,PMRT.LINK_RATIO(T.DKD_NUM,NVL(T1.DKD_NUM,0),2)   DKD_HB_MON                 "+
			"      ,T.RH_NUM RH_NUM_MON                                                         "+
			"      ,T3.RH_NUM RH_NUM_YEAR                                                       "+
			"      ,PMRT.LINK_RATIO_ZB(T.RH_NUM,NVL(T.ALL_NUM,0),2)   RH_ZB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T2.RH_NUM,0),2)   RH_TB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.RH_NUM,NVL(T1.RH_NUM,0),2)   RH_HB_MON                    "+
			"      ,T.TV_NUM TV_NUM_MON                                                         "+
			"      ,T3.TV_NUM TV_NUM_YEAR                                                       "+
			"      ,PMRT.LINK_RATIO_ZB(T.TV_NUM,NVL(T.ALL_NUM,0),2)   TV_ZB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T2.TV_NUM,0),2)   TV_TB_MON                    "+
			"      ,PMRT.LINK_RATIO(T.TV_NUM,NVL(T1.TV_NUM,0),2)   TV_HB_MON                    "+
			"FROM (                                                                             "+
			"      SELECT GROUP_ID_1                                                            "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE           ROW_ID                                         "+
			"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
			"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
			"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
			"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
			"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
			"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
			"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
			"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
			"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
			"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
			"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
			"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
			"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
			"      WHERE DEAL_DATE="+dealDate+"                                                       "+
			//"           --其他筛选条件                                                        "+
			where+
			"      GROUP BY GROUP_ID_1                                                          "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE                                                          "+
			"            ,GROUP_ID_4_NAME                                                       "+
			")T                                                                                 "+
			"LEFT JOIN (                                                                        "+
			"      SELECT GROUP_ID_1                                                            "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE           ROW_ID                                         "+
			"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
			"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
			"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
			"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
			"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
			"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
			"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
			"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
			"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
			"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
			"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
			"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
			"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
			"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-1),'YYYYMM')    "+
			//"      --其他筛选条件                                                             "+
			where+
			"      GROUP BY GROUP_ID_1                                                          "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE                                                          "+
			"            ,GROUP_ID_4_NAME                                                       "+
			")T1                                                                                "+
			"ON(T.ROW_ID=T1.ROW_ID)                                                             "+
			"LEFT JOIN (                                                                        "+
			"      SELECT GROUP_ID_1                                                            "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE           ROW_ID                                         "+
			"            ,GROUP_ID_4_NAME        ROW_NAME                                       "+
			"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
			"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
			"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
			"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
			"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
			"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
			"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
			"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
			"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
			"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
			"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
			"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
			"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMM'),-12),'YYYYMM')   "+
			//"      --其他筛选条件                                                             "+
			where+
			"      GROUP BY GROUP_ID_1                                                          "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,UNIT_NAME                                                             "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_MANAGE_NAME                                                        "+
			"            ,HQ_CHAN_CODE                                                          "+
			"            ,GROUP_ID_4_NAME                                                       "+
			")T2                                                                                "+
			"ON(T.ROW_ID=T2.ROW_ID)                                                             "+
			"LEFT JOIN (                                                                        "+
			"      SELECT GROUP_ID_1                                                            "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_CHAN_CODE           ROW_ID                                         "+
			"            ,NVL(SUM(ALL_NUM),0) ALL_NUM                                           "+
			"            ,NVL(SUM(ZW_NUM),0)  ZW_NUM                                            "+
			"            ,NVL(SUM(BOT_NUM),0) BOT_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) GD_NUM                                            "+
			"            ,NVL(SUM(FTTH_NUM),0)FTTH_NUM                                          "+
			"            ,NVL(SUM(LAN_NUM),0) LAN_NUM                                           "+
			"            ,NVL(SUM(EOC_NUM),0) EOC_NUM                                           "+
			"            ,NVL(SUM(ADSL_NUM),0) ADSL_NUM                                         "+
			"            ,NVL(SUM(LESS_50M_NUM),0) LESS_50M_NUM                                 "+
			"            ,NVL(SUM(MORE_50M_NUM),0) MORE_50M_NUM                                 "+
			"            ,NVL(SUM(DKD_NUM),0) DKD_NUM                                           "+
			"            ,NVL(SUM(RH_NUM),0) RH_NUM                                             "+
			"            ,NVL(SUM(TV_NUM),0) TV_NUM                                             "+
			"      FROM PMRT.TB_MRT_KDGJ_USER_DEV_MON                                           "+
			"      WHERE DEAL_DATE<="+dealDate+" AND SUBSTR(DEAL_DATE,1,4) = SUBSTR('"+dealDate+"',1,4)     "+
			//"      --其他筛选条件                                                             "+
			where+
			"      GROUP BY GROUP_ID_1                                                          "+
			"            ,GROUP_ID_1_NAME                                                       "+
			"            ,UNIT_ID                                                               "+
			"            ,HR_ID                                                                 "+
			"            ,HQ_CHAN_CODE                                                          "+
			")T3                                                                                "+
			"ON(T.ROW_ID=T3.ROW_ID)  ";
	
	showtext = "多维度发展月报";
	downloadExcel(sql,title,showtext);
}
