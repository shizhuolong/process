var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","ALL_DXF_NUM","ALL_XF_NUM","ALL_XF_RATE","ALL_XF_RATE_TB","ALL_XF_RATE_HB","RH_DXF_NUM","RH_DXF_USER_ZB","RH_XF_NUM","RH_XF_RATE","RH_XF_RATE_TB","RH_XF_RATE_HB","TV_DXF_NUM","TV_DXF_USER_ZB","TV_XF_NUM","TV_XF_RATE","TV_XF_RATE_TB","TV_XF_RATE_HB","DKD_DXF_NUM","DKD_DXF_USER_ZB","DKD_XF_NUM","DKD_XF_RATE","DKD_XF_RATE_TB","DKD_XF_RATE_HB","ZW_DXF_NUM","ZW_DXF_USER_ZB","ZW_XF_NUM","ZW_XF_RATE","ZW_XF_RATE_TB","ZW_XF_RATE_HB","BOT_DXF_NUM","BOT_DXF_USER_ZB","BOT_XF_NUM","BOT_XF_RATE","BOT_XF_RATE_TB","BOT_XF_RATE_HB","EOC_DXF_NUM","EOC_DXF_USER_ZB","EOC_XF_NUM","EOC_XF_RATE","EOC_XF_RATE_TB","EOC_XF_RATE_HB","XYW_DXF_NUM","XYW_DXF_USER_ZB","XYW_XF_NUM","XYW_XF_RATE","XYW_XF_RATE_TB","XYW_XF_RATE_HB"];
	var title=[["组织架构","总体维系情况","","","","","产品维度","","","","","","","","","","","","","","","","","","资源维度","","","","","","","","","","","","","","","","","","","","","","",""],
			   ["","","","","","","融合业务用户(含智慧沃家)","","","","","","TV用户","","","","","","单宽带用户","","","","","","自网用户","","","","","","BOT用户","","","","","","广电用户","","","","","","校园网用户","","","","",""],
			   ["","待续费用户","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比"]];
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
	var sql="";
	if(orgLevel==1){
		sql="SELECT T.ROW_ID                                                                            "+
		"      ,T.ROW_NAME                                                                          "+
		"      ,NVL(T.ALL_DXF_NUM,0) ALL_DXF_NUM                                                    "+
		"      ,NVL(T.ALL_XF_NUM,0)  ALL_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ALL_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ALL_XF_NUM,0),NVL(T2.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ALL_XF_NUM,0),NVL(T1.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_HB                                                   "+
		"      ,NVL(T.RH_DXF_NUM,0) RH_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) RH_DXF_USER_ZB       "+
		"      ,NVL(T.RH_XF_NUM,0)  RH_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2) RH_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.RH_XF_NUM,0),NVL(T2.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.RH_XF_NUM,0),NVL(T1.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_HB                                                    "+
		"      ,NVL(T.TV_DXF_NUM,0) TV_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) TV_DXF_USER_ZB       "+
		"      ,NVL(T.TV_XF_NUM,0)  TV_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2) TV_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.TV_XF_NUM,0),NVL(T2.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.TV_XF_NUM,0),NVL(T1.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_HB                                                    "+
		"      ,NVL(T.DKD_DXF_NUM,0) DKD_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) DKD_DXF_USER_ZB     "+
		"      ,NVL(T.DKD_XF_NUM,0)  DKD_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2) DKD_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.DKD_XF_NUM,0),NVL(T2.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.DKD_XF_NUM,0),NVL(T1.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_HB                                                   "+
		"      ,NVL(T.ZW_DXF_NUM,0) ZW_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ZW_DXF_USER_ZB       "+
		"      ,NVL(T.ZW_XF_NUM,0)  ZW_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2) ZW_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ZW_XF_NUM,0),NVL(T2.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ZW_XF_NUM,0),NVL(T1.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_HB                                                    "+
		"      ,NVL(T.BOT_DXF_NUM,0) BOT_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) BOT_DXF_USER_ZB     "+
		"      ,NVL(T.BOT_XF_NUM,0)  BOT_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2) BOT_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.BOT_XF_NUM,0),NVL(T2.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.BOT_XF_NUM,0),NVL(T1.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_HB                                                   "+
		"      ,NVL(T.EOC_DXF_NUM,0) EOC_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) EOC_DXF_USER_ZB     "+
		"      ,NVL(T.EOC_XF_NUM,0)  EOC_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2) EOC_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.EOC_XF_NUM,0),NVL(T2.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.EOC_XF_NUM,0),NVL(T1.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_HB                                                   "+
		"      ,NVL(T.XYW_DXF_NUM,0) XYW_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) XYW_DXF_USER_ZB     "+
		"      ,NVL(T.XYW_XF_NUM,0)  XYW_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2) XYW_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.XYW_XF_NUM,0),NVL(T2.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.XYW_XF_NUM,0),NVL(T1.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_HB                                                   "+
		"FROM (                                                                                     "+
		"    SELECT GROUP_ID_0          ROW_ID                                                      "+
		"          ,'全省'              ROW_NAME                                                    "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                 "+
		//"   --其他筛选条件                                                                        "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		")T                                                                                         "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0          ROW_ID                                                      "+
		"          ,'全省'              ROW_NAME                                                    "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')              "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		")T1                                                                                        "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                     "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0          ROW_ID                                                      "+
		"          ,'全省'              ROW_NAME                                                    "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-12),'YYYYMM')             "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		")T2                                                                                        "+
		"ON(T.ROW_ID=T2.ROW_ID)  ";                                                
	}else if(orgLevel==2){
		sql="SELECT T.ROW_ID                                                                            "+
		"      ,T.ROW_NAME                                                                          "+
		"      ,NVL(T.ALL_DXF_NUM,0) ALL_DXF_NUM                                                    "+
		"      ,NVL(T.ALL_XF_NUM,0)  ALL_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ALL_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ALL_XF_NUM,0),NVL(T2.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ALL_XF_NUM,0),NVL(T1.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_HB                                                   "+
		"      ,NVL(T.RH_DXF_NUM,0) RH_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) RH_DXF_USER_ZB       "+
		"      ,NVL(T.RH_XF_NUM,0)  RH_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2) RH_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.RH_XF_NUM,0),NVL(T2.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.RH_XF_NUM,0),NVL(T1.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_HB                                                    "+
		"      ,NVL(T.TV_DXF_NUM,0) TV_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) TV_DXF_USER_ZB       "+
		"      ,NVL(T.TV_XF_NUM,0)  TV_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2) TV_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.TV_XF_NUM,0),NVL(T2.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.TV_XF_NUM,0),NVL(T1.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_HB                                                    "+
		"      ,NVL(T.DKD_DXF_NUM,0) DKD_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) DKD_DXF_USER_ZB     "+
		"      ,NVL(T.DKD_XF_NUM,0)  DKD_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2) DKD_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.DKD_XF_NUM,0),NVL(T2.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.DKD_XF_NUM,0),NVL(T1.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_HB                                                   "+
		"      ,NVL(T.ZW_DXF_NUM,0) ZW_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ZW_DXF_USER_ZB       "+
		"      ,NVL(T.ZW_XF_NUM,0)  ZW_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2) ZW_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ZW_XF_NUM,0),NVL(T2.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ZW_XF_NUM,0),NVL(T1.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_HB                                                    "+
		"      ,NVL(T.BOT_DXF_NUM,0) BOT_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) BOT_DXF_USER_ZB     "+
		"      ,NVL(T.BOT_XF_NUM,0)  BOT_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2) BOT_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.BOT_XF_NUM,0),NVL(T2.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.BOT_XF_NUM,0),NVL(T1.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_HB                                                   "+
		"      ,NVL(T.EOC_DXF_NUM,0) EOC_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) EOC_DXF_USER_ZB     "+
		"      ,NVL(T.EOC_XF_NUM,0)  EOC_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2) EOC_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.EOC_XF_NUM,0),NVL(T2.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.EOC_XF_NUM,0),NVL(T1.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_HB                                                   "+
		"      ,NVL(T.XYW_DXF_NUM,0) XYW_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) XYW_DXF_USER_ZB     "+
		"      ,NVL(T.XYW_XF_NUM,0)  XYW_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2) XYW_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.XYW_XF_NUM,0),NVL(T2.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.XYW_XF_NUM,0),NVL(T1.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_HB                                                   "+
		"FROM (                                                                                     "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1            ROW_ID                                                    "+
		"          ,GROUP_ID_1_NAME       ROW_NAME                                                  "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                 "+
		//"   --其他筛选条件                                                                        "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		")T                                                                                         "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1              ROW_ID                                                  "+
		"          ,GROUP_ID_1_NAME         ROW_NAME                                                "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')              "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		")T1                                                                                        "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                     "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1          ROW_ID                                                      "+
		"          ,GROUP_ID_1_NAME     ROW_NAME                                                    "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-12),'YYYYMM')             "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		")T2                                                                                        "+
		"ON(T.ROW_ID=T2.ROW_ID)  ";
	}else if(orgLevel==3){
		sql="SELECT T.ROW_ID                                                                               "+
		"      ,T.ROW_NAME                                                                             "+
		"      ,NVL(T.ALL_DXF_NUM,0) ALL_DXF_NUM                                                       "+
		"      ,NVL(T.ALL_XF_NUM,0)  ALL_XF_NUM                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ALL_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ALL_XF_NUM,0),NVL(T2.ALL_DXF_NUM,0),2)     "+
		"                      ,2) ALL_XF_RATE_TB                                                      "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ALL_XF_NUM,0),NVL(T1.ALL_DXF_NUM,0),2)     "+
		"                      ,2) ALL_XF_RATE_HB                                                      "+
		"      ,NVL(T.RH_DXF_NUM,0) RH_DXF_NUM                                                         "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) RH_DXF_USER_ZB          "+
		"      ,NVL(T.RH_XF_NUM,0)  RH_XF_NUM                                                          "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2) RH_XF_RATE                "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.RH_XF_NUM,0),NVL(T2.RH_DXF_NUM,0),2)       "+
		"                      ,2) RH_XF_RATE_TB                                                       "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.RH_XF_NUM,0),NVL(T1.RH_DXF_NUM,0),2)       "+
		"                      ,2) RH_XF_RATE_HB                                                       "+
		"      ,NVL(T.TV_DXF_NUM,0) TV_DXF_NUM                                                         "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) TV_DXF_USER_ZB          "+
		"      ,NVL(T.TV_XF_NUM,0)  TV_XF_NUM                                                          "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2) TV_XF_RATE                "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.TV_XF_NUM,0),NVL(T2.TV_DXF_NUM,0),2)       "+
		"                      ,2) TV_XF_RATE_TB                                                       "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.TV_XF_NUM,0),NVL(T1.TV_DXF_NUM,0),2)       "+
		"                      ,2) TV_XF_RATE_HB                                                       "+
		"      ,NVL(T.DKD_DXF_NUM,0) DKD_DXF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) DKD_DXF_USER_ZB        "+
		"      ,NVL(T.DKD_XF_NUM,0)  DKD_XF_NUM                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2) DKD_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.DKD_XF_NUM,0),NVL(T2.DKD_DXF_NUM,0),2)     "+
		"                      ,2) DKD_XF_RATE_TB                                                      "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.DKD_XF_NUM,0),NVL(T1.DKD_DXF_NUM,0),2)     "+
		"                      ,2) DKD_XF_RATE_HB                                                      "+
		"      ,NVL(T.ZW_DXF_NUM,0) ZW_DXF_NUM                                                         "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ZW_DXF_USER_ZB          "+
		"      ,NVL(T.ZW_XF_NUM,0)  ZW_XF_NUM                                                          "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2) ZW_XF_RATE                "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ZW_XF_NUM,0),NVL(T2.ZW_DXF_NUM,0),2)       "+
		"                      ,2) ZW_XF_RATE_TB                                                       "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)         "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ZW_XF_NUM,0),NVL(T1.ZW_DXF_NUM,0),2)       "+
		"                      ,2) ZW_XF_RATE_HB                                                       "+
		"      ,NVL(T.BOT_DXF_NUM,0) BOT_DXF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) BOT_DXF_USER_ZB        "+
		"      ,NVL(T.BOT_XF_NUM,0)  BOT_XF_NUM                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2) BOT_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.BOT_XF_NUM,0),NVL(T2.BOT_DXF_NUM,0),2)     "+
		"                      ,2) BOT_XF_RATE_TB                                                      "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.BOT_XF_NUM,0),NVL(T1.BOT_DXF_NUM,0),2)     "+
		"                      ,2) BOT_XF_RATE_HB                                                      "+
		"      ,NVL(T.EOC_DXF_NUM,0) EOC_DXF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) EOC_DXF_USER_ZB        "+
		"      ,NVL(T.EOC_XF_NUM,0)  EOC_XF_NUM                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2) EOC_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.EOC_XF_NUM,0),NVL(T2.EOC_DXF_NUM,0),2)     "+
		"                      ,2) EOC_XF_RATE_TB                                                      "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.EOC_XF_NUM,0),NVL(T1.EOC_DXF_NUM,0),2)     "+
		"                      ,2) EOC_XF_RATE_HB                                                      "+
		"      ,NVL(T.XYW_DXF_NUM,0) XYW_DXF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) XYW_DXF_USER_ZB        "+
		"      ,NVL(T.XYW_XF_NUM,0)  XYW_XF_NUM                                                        "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2) XYW_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.XYW_XF_NUM,0),NVL(T2.XYW_DXF_NUM,0),2)     "+
		"                      ,2) XYW_XF_RATE_TB                                                      "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)       "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.XYW_XF_NUM,0),NVL(T1.XYW_DXF_NUM,0),2)     "+
		"                      ,2) XYW_XF_RATE_HB                                                      "+
		"FROM (                                                                                        "+
		"    SELECT GROUP_ID_0                                                                         "+
		"          ,GROUP_ID_1                                                                         "+
		"          ,GROUP_ID_1_NAME                                                                    "+
		"          ,UNIT_ID                ROW_ID                                                      "+
		"          ,UNIT_NAME              ROW_NAME                                                    "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                             "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                              "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                              "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                               "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                              "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                               "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                             "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                              "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                              "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                               "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                             "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                              "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                             "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                              "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                             "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                              "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                          "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                    "+
		//"   --其他筛选条件                                                                           "+
		where +
		"    GROUP BY GROUP_ID_0                                                                       "+
		"            ,GROUP_ID_1                                                                       "+
		"            ,GROUP_ID_1_NAME                                                                  "+
		"            ,UNIT_ID                                                                          "+
		"            ,UNIT_NAME                                                                        "+
		")T                                                                                            "+
		"LEFT JOIN (                                                                                   "+
		"    SELECT GROUP_ID_0                                                                         "+
		"          ,GROUP_ID_1                                                                         "+
		"          ,GROUP_ID_1_NAME                                                                    "+
		"          ,UNIT_ID              ROW_ID                                                        "+
		"          ,UNIT_NAME            ROW_NAME                                                      "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                             "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                              "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                              "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                               "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                              "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                               "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                             "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                              "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                              "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                               "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                             "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                              "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                             "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                              "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                             "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                              "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')                 "+
		//" --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                       "+
		"            ,GROUP_ID_1                                                                       "+
		"            ,GROUP_ID_1_NAME                                                                  "+
		"            ,UNIT_ID                                                                          "+
		"            ,UNIT_NAME                                                                        "+
		")T1                                                                                           "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                        "+
		"LEFT JOIN (                                                                                   "+
		"    SELECT GROUP_ID_0                                                                         "+
		"          ,GROUP_ID_1                                                                         "+
		"          ,GROUP_ID_1_NAME                                                                    "+
		"          ,UNIT_ID                 ROW_ID                                                     "+
		"          ,UNIT_NAME               ROW_NAME                                                   "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                             "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                              "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                              "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                               "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                              "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                               "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                             "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                              "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                              "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                               "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                             "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                              "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                             "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                              "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                             "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                              "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                          "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-12),'YYYYMM')                "+
		//" --其他筛选条件                                                                             "+
		where +
		"    GROUP BY GROUP_ID_0                                                                       "+
		"            ,GROUP_ID_1                                                                       "+
		"            ,GROUP_ID_1_NAME                                                                  "+
		"            ,UNIT_ID                                                                          "+
		"            ,UNIT_NAME                                                                        "+
		")T2                                                                                           "+
		"ON(T.ROW_ID=T2.ROW_ID) ";
	}else if(orgLevel==4){
		sql="SELECT T.ROW_ID                                                                            "+
		"      ,T.ROW_NAME                                                                          "+
		"      ,NVL(T.ALL_DXF_NUM,0) ALL_DXF_NUM                                                    "+
		"      ,NVL(T.ALL_XF_NUM,0)  ALL_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ALL_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ALL_XF_NUM,0),NVL(T2.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ALL_XF_NUM,0),NVL(T1.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_HB                                                   "+
		"      ,NVL(T.RH_DXF_NUM,0) RH_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) RH_DXF_USER_ZB       "+
		"      ,NVL(T.RH_XF_NUM,0)  RH_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2) RH_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.RH_XF_NUM,0),NVL(T2.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.RH_XF_NUM,0),NVL(T1.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_HB                                                    "+
		"      ,NVL(T.TV_DXF_NUM,0) TV_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) TV_DXF_USER_ZB       "+
		"      ,NVL(T.TV_XF_NUM,0)  TV_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2) TV_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.TV_XF_NUM,0),NVL(T2.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.TV_XF_NUM,0),NVL(T1.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_HB                                                    "+
		"      ,NVL(T.DKD_DXF_NUM,0) DKD_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) DKD_DXF_USER_ZB     "+
		"      ,NVL(T.DKD_XF_NUM,0)  DKD_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2) DKD_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.DKD_XF_NUM,0),NVL(T2.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.DKD_XF_NUM,0),NVL(T1.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_HB                                                   "+
		"      ,NVL(T.ZW_DXF_NUM,0) ZW_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ZW_DXF_USER_ZB       "+
		"      ,NVL(T.ZW_XF_NUM,0)  ZW_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2) ZW_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ZW_XF_NUM,0),NVL(T2.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ZW_XF_NUM,0),NVL(T1.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_HB                                                    "+
		"      ,NVL(T.BOT_DXF_NUM,0) BOT_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) BOT_DXF_USER_ZB     "+
		"      ,NVL(T.BOT_XF_NUM,0)  BOT_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2) BOT_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.BOT_XF_NUM,0),NVL(T2.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.BOT_XF_NUM,0),NVL(T1.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_HB                                                   "+
		"      ,NVL(T.EOC_DXF_NUM,0) EOC_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) EOC_DXF_USER_ZB     "+
		"      ,NVL(T.EOC_XF_NUM,0)  EOC_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2) EOC_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.EOC_XF_NUM,0),NVL(T2.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.EOC_XF_NUM,0),NVL(T1.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_HB                                                   "+
		"      ,NVL(T.XYW_DXF_NUM,0) XYW_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) XYW_DXF_USER_ZB     "+
		"      ,NVL(T.XYW_XF_NUM,0)  XYW_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2) XYW_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.XYW_XF_NUM,0),NVL(T2.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.XYW_XF_NUM,0),NVL(T1.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_HB                                                   "+
		"FROM (                                                                                     "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                  ROW_ID                                                   "+
		"          ,HQ_MANAGE_NAME         ROW_NAME                                                 "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                 "+
		//"   --其他筛选条件                                                                        "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		")T                                                                                         "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                     ROW_ID                                                "+
		"          ,HQ_MANAGE_NAME            ROW_NAME                                              "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')              "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		")T1                                                                                        "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                     "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                ROW_ID                                                     "+
		"          ,HQ_MANAGE_NAME       ROW_NAME                                                   "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-12),'YYYYMM')             "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		")T2                                                                                        "+
		"ON(T.ROW_ID=T2.ROW_ID)  ";
	}else if(orgLevel==5){
		sql="SELECT " +
		"            T.GROUP_ID_1                                                                    "+
		"            ,T.GROUP_ID_1_NAME                                                               "+
		"            ,T.UNIT_ID                                                                       "+
		"            ,T.UNIT_NAME                                                                     "+
		"            ,T.HR_ID                                                                         "+
		"            ,T.HQ_MANAGE_NAME                                                                "+
		",T.ROW_ID                                                                            "+
		"      ,T.ROW_NAME                                                                          "+
		"      ,NVL(T.ALL_DXF_NUM,0) ALL_DXF_NUM                                                    "+
		"      ,NVL(T.ALL_XF_NUM,0)  ALL_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ALL_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ALL_XF_NUM,0),NVL(T2.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ALL_XF_NUM,0),NVL(T.ALL_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ALL_XF_NUM,0),NVL(T1.ALL_DXF_NUM,0),2)  "+
		"                      ,2) ALL_XF_RATE_HB                                                   "+
		"      ,NVL(T.RH_DXF_NUM,0) RH_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) RH_DXF_USER_ZB       "+
		"      ,NVL(T.RH_XF_NUM,0)  RH_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2) RH_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.RH_XF_NUM,0),NVL(T2.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.RH_XF_NUM,0),NVL(T.RH_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.RH_XF_NUM,0),NVL(T1.RH_DXF_NUM,0),2)    "+
		"                      ,2) RH_XF_RATE_HB                                                    "+
		"      ,NVL(T.TV_DXF_NUM,0) TV_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) TV_DXF_USER_ZB       "+
		"      ,NVL(T.TV_XF_NUM,0)  TV_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2) TV_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.TV_XF_NUM,0),NVL(T2.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.TV_XF_NUM,0),NVL(T.TV_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.TV_XF_NUM,0),NVL(T1.TV_DXF_NUM,0),2)    "+
		"                      ,2) TV_XF_RATE_HB                                                    "+
		"      ,NVL(T.DKD_DXF_NUM,0) DKD_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) DKD_DXF_USER_ZB     "+
		"      ,NVL(T.DKD_XF_NUM,0)  DKD_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2) DKD_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.DKD_XF_NUM,0),NVL(T2.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.DKD_XF_NUM,0),NVL(T.DKD_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.DKD_XF_NUM,0),NVL(T1.DKD_DXF_NUM,0),2)  "+
		"                      ,2) DKD_XF_RATE_HB                                                   "+
		"      ,NVL(T.ZW_DXF_NUM,0) ZW_DXF_NUM                                                      "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) ZW_DXF_USER_ZB       "+
		"      ,NVL(T.ZW_XF_NUM,0)  ZW_XF_NUM                                                       "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2) ZW_XF_RATE             "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.ZW_XF_NUM,0),NVL(T2.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_TB                                                    "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.ZW_XF_NUM,0),NVL(T.ZW_DXF_NUM,0),2)      "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.ZW_XF_NUM,0),NVL(T1.ZW_DXF_NUM,0),2)    "+
		"                      ,2) ZW_XF_RATE_HB                                                    "+
		"      ,NVL(T.BOT_DXF_NUM,0) BOT_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) BOT_DXF_USER_ZB     "+
		"      ,NVL(T.BOT_XF_NUM,0)  BOT_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2) BOT_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.BOT_XF_NUM,0),NVL(T2.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.BOT_XF_NUM,0),NVL(T.BOT_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.BOT_XF_NUM,0),NVL(T1.BOT_DXF_NUM,0),2)  "+
		"                      ,2) BOT_XF_RATE_HB                                                   "+
		"      ,NVL(T.EOC_DXF_NUM,0) EOC_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) EOC_DXF_USER_ZB     "+
		"      ,NVL(T.EOC_XF_NUM,0)  EOC_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2) EOC_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.EOC_XF_NUM,0),NVL(T2.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.EOC_XF_NUM,0),NVL(T.EOC_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.EOC_XF_NUM,0),NVL(T1.EOC_DXF_NUM,0),2)  "+
		"                      ,2) EOC_XF_RATE_HB                                                   "+
		"      ,NVL(T.XYW_DXF_NUM,0) XYW_DXF_NUM                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_DXF_NUM,0),NVL(T.ALL_DXF_NUM,0),2) XYW_DXF_USER_ZB     "+
		"      ,NVL(T.XYW_XF_NUM,0)  XYW_XF_NUM                                                     "+
		"      ,PMRT.LINK_RATIO_ZB(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2) XYW_XF_RATE          "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T2.XYW_XF_NUM,0),NVL(T2.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_TB                                                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(NVL(T.XYW_XF_NUM,0),NVL(T.XYW_DXF_NUM,0),2)    "+
		"                      ,PMRT.LINK_RATIO_RATE(NVL(T1.XYW_XF_NUM,0),NVL(T1.XYW_DXF_NUM,0),2)  "+
		"                      ,2) XYW_XF_RATE_HB                                                   "+
		"FROM (                                                                                     "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                                                                           "+
		"          ,HQ_MANAGE_NAME                                                                  "+
		"          ,HQ_CHAN_CODE           ROW_ID                                                   "+
		"          ,GROUP_ID_4_NAME        ROW_NAME                                                 "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE="+dealDete+"                                                                 "+
		//"   --其他筛选条件                                                                        "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		"            ,HQ_CHAN_CODE                                                                  "+
		"            ,GROUP_ID_4_NAME                                                               "+
		")T                                                                                         "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                                                                           "+
		"          ,HQ_MANAGE_NAME                                                                  "+
		"          ,HQ_CHAN_CODE         ROW_ID                                                     "+
		"          ,GROUP_ID_4_NAME      ROW_NAME                                                   "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-1),'YYYYMM')              "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		"            ,HQ_CHAN_CODE                                                                  "+
		"            ,GROUP_ID_4_NAME                                                               "+
		")T1                                                                                        "+
		"ON(T.ROW_ID=T1.ROW_ID)                                                                     "+
		"LEFT JOIN (                                                                                "+
		"    SELECT GROUP_ID_0                                                                      "+
		"          ,GROUP_ID_1                                                                      "+
		"          ,GROUP_ID_1_NAME                                                                 "+
		"          ,UNIT_ID                                                                         "+
		"          ,UNIT_NAME                                                                       "+
		"          ,HR_ID                                                                           "+
		"          ,HQ_MANAGE_NAME                                                                  "+
		"          ,HQ_CHAN_CODE         ROW_ID                                                     "+
		"          ,GROUP_ID_4_NAME      ROW_NAME                                                   "+
		"          ,NVL(SUM(ALL_DXF_NUM),0)    ALL_DXF_NUM                                          "+
		"          ,NVL(SUM(ALL_XF_NUM ),0)    ALL_XF_NUM                                           "+
		"          ,NVL(SUM(RH_DXF_NUM ),0)    RH_DXF_NUM                                           "+
		"          ,NVL(SUM(RH_XF_NUM  ),0)    RH_XF_NUM                                            "+
		"          ,NVL(SUM(TV_DXF_NUM ),0)    TV_DXF_NUM                                           "+
		"          ,NVL(SUM(TV_XF_NUM  ),0)    TV_XF_NUM                                            "+
		"          ,NVL(SUM(DKD_DXF_NUM),0)    DKD_DXF_NUM                                          "+
		"          ,NVL(SUM(DKD_XF_NUM ),0)    DKD_XF_NUM                                           "+
		"          ,NVL(SUM(ZW_DXF_NUM ),0)    ZW_DXF_NUM                                           "+
		"          ,NVL(SUM(ZW_XF_NUM  ),0)    ZW_XF_NUM                                            "+
		"          ,NVL(SUM(BOT_DXF_NUM),0)    BOT_DXF_NUM                                          "+
		"          ,NVL(SUM(BOT_XF_NUM ),0)    BOT_XF_NUM                                           "+
		"          ,NVL(SUM(EOC_DXF_NUM),0)    EOC_DXF_NUM                                          "+
		"          ,NVL(SUM(EOC_XF_NUM ),0)    EOC_XF_NUM                                           "+
		"          ,NVL(SUM(XYW_DXF_NUM),0)    XYW_DXF_NUM                                          "+
		"          ,NVL(SUM(XYW_XF_NUM ),0)    XYW_XF_NUM                                           "+
		"    FROM PMRT.TB_MRT_KDGJ_DWD_WX_MON                                                       "+
		"    WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDete+",'YYYYMM'),-12),'YYYYMM')             "+
		//" --其他筛选条件                                                                          "+
		where +
		"    GROUP BY GROUP_ID_0                                                                    "+
		"            ,GROUP_ID_1                                                                    "+
		"            ,GROUP_ID_1_NAME                                                               "+
		"            ,UNIT_ID                                                                       "+
		"            ,UNIT_NAME                                                                     "+
		"            ,HR_ID                                                                         "+
		"            ,HQ_MANAGE_NAME                                                                "+
		"            ,HQ_CHAN_CODE                                                                  "+
		"            ,GROUP_ID_4_NAME                                                               "+
		")T2                                                                                        "+
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
		where+= " AND HR_ID ='"+hqHrId+"'";
	}
	if(hqChanName!=''){
		where+= " AND HQ_CHAN_CODE ='"+hqChanName+"'";
	}
	var downsql=getSql(where,5,dealDete);
	
	var title=[["地市编码","地市名称","营服编码","营服名称","HR编码","姓名","渠道编码","渠道名称","总体维系情况","","","","","产品维度","","","","","","","","","","","","","","","","","","资源维度","","","","","","","","","","","","","","","","","","","","","","",""],
			   ["","","","","","","","","","","","","","融合业务用户(含智慧沃家)","","","","","","TV用户","","","","","","资源维度","","","","","","单宽带用户","","","","","","自网用户","","","","","","","BOT用户","","","","","","广电用户","","","","","","校园网用户","","","","",""],
			   ["","","","","","","","","待续费用户","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比","待续费用户","占比","已续费用户","续费率","同比","环比"]];
	showtext = "用户维系情况";
	downloadExcel(downsql,title,showtext);
}
