var report;
var maxDate=null;
$(function(){
	maxDate = getMaxDate("pmrt.tb_DW_V_D_HLW_OUTLINE_USER");
	var field=["ROW_NAME","KH_ZQ","KH_NEW_SR","LJ_KH_NEW_SR" ,"KH_WCL" ,"LJ_KH_CLYH_SR" ,"TOTAL_KH_SR" ,"YW_SR" ,"GW_SR" ,"TOTAL_YW_GW_SR" ,"KHQ_PZ_SR" ,"CLYH_SR","SR_BYL","HQ_RENT","HQ_QDBT","YJ_ALL","HQ_ZX_FEE","QTSC_FEE","HQ_COST_ALL","HQ_NEW_ML","YJ_FCBL","YJ_FC_FEE"];
	var title=[["组织架构","考核周期","收入","","","","","累计发展","","","收入保有","","","成本","","","","","","毛利","",""],
			   ["","","考核新增收入","考核期新增用户累计收入","考核完成率","存量用户考核期累计收入","合计","移网","固网","合计","新考核周期前一个月拍照收入","存量用户当月收入","收入保有","房租","渠道补贴","佣金","装修","其他市场成本","合计","新发展本年毛利","预计分成比例","预计分成金额"]];
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
			var hqChanName=$.trim($("#hqChanName").val());
			var where=" WHERE DEAL_DATE="+dealDate;
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
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
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel);
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
				}else if(orgLevel==4){//渠道
					where+=" AND HQ_CHAN_CODE='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel);
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

function getSql(where,orgLevel){
	if(orgLevel==1){
		preSql="SELECT T.GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,";
		preSql1=" GROUP_ID_0,";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,";
		preSql1=" GROUP_ID_1,GROUP_ID_1_NAME,";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
		preSql1=" UNIT_ID ,UNIT_NAME,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==4){
		preSql="SELECT T.GROUP_ID_1_NAME,T.UNIT_ID,T.UNIT_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_NAME ROW_NAME,";
		preSql1=" GROUP_ID_1_NAME,UNIT_ID ,UNIT_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,";
		groupBy=" GROUP BY GROUP_ID_1_NAME,UNIT_ID ,UNIT_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME";
	}
	var sql=preSql+
	"	T.KH_ZQ,                                                         "+
	"	T.KH_NEW_SR,                                                     "+
	"	T.LJ_KH_NEW_SR,                                                  "+
	"	T.KH_WCL,                                                        "+
	"	T.LJ_KH_CLYH_SR,                                                 "+
	"	T.TOTAL_KH_SR,                                                   "+
	"	T.YW_SR,                                                         "+
	"	T.GW_SR,                                                         "+
	"	T.TOTAL_YW_GW_SR,                                                "+
	"	T.KHQ_PZ_SR,                                                     "+
	"	T.CLYH_SR,                                                       "+
	"	T.SR_BYL,                                                        "+
	"	T.HQ_RENT,                                                       "+
	"	T.HQ_QDBT,                                                       "+
	"	T.YJ_ALL,                                                        "+
	"	T.HQ_ZX_FEE,                                                     "+
	"	T.QTSC_FEE,                                                      "+
	"	T.HQ_COST_ALL,                                                   "+
	"	T.HQ_NEW_ML,                                                     "+
	"	T.YJ_FCBL,                                                       "+
	"	T.YJ_FC_FEE                                                      "+
	"FROM                                                                "+
	"(SELECT                                                "+
	preSql1 +
	"	  12  KH_ZQ,                                                     "+
	"	  SUM(KH_NEW_SR) KH_NEW_SR,                                      "+
	"	  SUM(LJ_KH_NEW_SR) LJ_KH_NEW_SR,                                "+
	"	  ROUND(SUM(LJ_KH_NEW_SR)/SUM(KH_NEW_SR)*100,2)||'%' KH_WCL,     "+
	"	  SUM(LJ_KH_CLYH_SR) LJ_KH_CLYH_SR,                              "+
	"	  SUM(TOTAL_KH_SR) TOTAL_KH_SR,                                  "+
	"	  SUM(YW_SR) YW_SR,                                              "+
	"	  SUM(GW_SR) GW_SR,                                              "+
	"	  SUM(TOTAL_YW_GW_SR) TOTAL_YW_GW_SR,                            "+
	"	  SUM(KHQ_PZ_SR) KHQ_PZ_SR,                                      "+
	"	  SUM(CLYH_SR) CLYH_SR,                                          "+
	"	   ROUND(CASE WHEN SUM(NVL(KHQ_PZ_SR, 0)) = 0 then " +
	"0    "+
    "                    else                                            "+
    "                     (SUM(CLYH_SR)/SUM(nvl(KHQ_PZ_SR,0)))*100       "+
    "                   end,                                             "+
    "                   2)||'%' SR_BYL,                                  "+
	"	  SUM(HQ_RENT) HQ_RENT,                                          "+
	"	  SUM(HQ_QDBT) HQ_QDBT,                                          "+
	"	  SUM(YJ_ALL) YJ_ALL,                                            "+
	"	  SUM(HQ_ZX_FEE) HQ_ZX_FEE,                                      "+
	"	  SUM(QTSC_FEE) QTSC_FEE,                                        "+
	"	  SUM(HQ_COST_ALL) HQ_COST_ALL,                                  "+
	"	  SUM(HQ_NEW_ML) HQ_NEW_ML,                                      "+
	"	  ' ' YJ_FCBL,                                                   "+
	"	  ' ' YJ_FC_FEE                                                  "+
	"FROM PMRT.PRC_TAB_MRT_YSDZ_DETAIL                                   "+
	//--其他筛选条件                                                     "+
	where +
	groupBy +
	") T  ";
	return sql;
}

function downsAll() {
	var title=[["州市","营服编码","营服名称","渠道编码","渠道名称","考核周期","收入","","","","","累计发展","","","收入保有","","","成本","","","","","","毛利","",""],
			   ["","","","","","","考核新增收入","考核期新增用户累计收入","考核完成率","存量用户考核期累计收入","合计","移网","固网","合计","新考核周期前一个月拍照收入","存量用户当月收入","收入保有","房租","渠道补贴","佣金","装修","其他市场成本","合计","新发展本年毛利","预计分成比例","预计分成金额"]];
	showtext = "以收定支";
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel="";
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var hqChanName=$.trim($("#hqChanName").val());
	var where=" WHERE DEAL_DATE="+dealDate;
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(hqChanName!=''){
		where+= " AND HQ_CHAN_CODE ='"+hqChanName+"'";
	}
	//权限
	if(orgLevel==1){//省
		
	}else if(orgLevel==2){//市
		where+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){//营服
		where+=" AND UNIT_ID='"+code+"'";
	}
	var downsql=getSql(where,4)
	downloadExcel(downsql,title,showtext);
}
