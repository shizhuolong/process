var report;
$(function(){
	var field=["ROW_NAME","HZ_MS","KH_START_MONTH","KH_END_MONTH" ,"YSDZ_XS" ,"ZJTY_FZ" ,"TJTY_FB" ,"ZX_BT" ,"KH_NEW_SR" ,"KH_WCL" ,"LJ_KH_NEW_SR" ,"TOTAL_KH_SR","KHQ_PZ_SR","CLYH_SR","SR_BYL","YW_SR","GW_SR","QT_SR","TOTAL_YW_GW_SR","HQ_COST_ALL","YJ_ALL","HQ_QDBT","ZD_BT","HQ_RENT","HQ_ZX_FEE","KHJR_CB","KA_CB","SDWY_FEE","TX_FEE","LJ_CB_ZSB"];
	var title=[["组织架构","合作模式","考核周期开始时间","考核周期结束时间","以收定支系数","录入考核支出","","","新增用户收入目标","考核收入累计完成率","收入情况（出账-赠费-退费）","","","","","累计发展","","","","考核期内成本（系统同步）","","","","","","","","","",""],
			   ["","","","","","自建他营年房租","他建他营年房补","装修补贴","","","考核期新增用户累计收入","考核期存量+新增用户累计出账收入","考核周期前一个月拍照出账收入","考核期前存量用户当月出账收入","存量收入保有率","移网","固网","其他","合计","成本合计","佣金","渠道补贴","终端补贴","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","通信费","累计成本占收比"]];
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
	var dealDate=$("#dealDate").val();
	if(orgLevel==1){
		//preSql="SELECT T.GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,";
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,'' HZ_MS,'' KH_START_MONTH,'' KH_END_MONTH,'' YSDZ_XS,";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		//preSql="SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,";
		preSql="SELECT GROUP_ID_1 ROW_ID ,GROUP_ID_1_NAME ROW_NAME,'' HZ_MS,'' KH_START_MONTH,'' KH_END_MONTH,'' YSDZ_XS,";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==3){
		//preSql="SELECT T.UNIT_ID ROW_ID,T.UNIT_NAME ROW_NAME,";
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,'' HZ_MS,'' KH_START_MONTH,'' KH_END_MONTH,'' YSDZ_XS,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==4){
		//preSql="SELECT T.GROUP_ID_1_NAME,T.UNIT_ID,T.UNIT_NAME,T.HQ_CHAN_CODE ROW_ID,T.HQ_CHAN_NAME ROW_NAME,";
		preSql="SELECT GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,HZ_MS,KH_START_MONTH,KH_END_MONTH,YSDZ_XS,";
		groupBy=" GROUP BY GROUP_ID_1_NAME,UNIT_ID ,UNIT_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,HZ_MS,KH_START_MONTH,KH_END_MONTH,YSDZ_XS";
	}
	var sql=
	preSql+
	"  SUM(NVL(ZJTY_FZ,0)) ZJTY_FZ,                      "+
	"  SUM(NVL(TJTY_FB,0)) TJTY_FB,                      "+
	"  SUM(NVL(ZX_BT,0))  ZX_BT,                         "+
	"  SUM(NVL(KH_NEW_SR,0)) KH_NEW_SR,                  "+
	"  ROUND(CASE WHEN SUM(NVL(KH_NEW_SR,0)) = 0 THEN 0  "+
	"        ELSE                                        "+
	"        (SUM(nvl(LJ_KH_NEW_SR,0))/                  "+
	"         SUM(NVL(KH_NEW_SR,0)))*100                 "+
	"        END,2)||'%' KH_WCL,                         "+
	"  SUM(NVL(LJ_KH_NEW_SR,0)) LJ_KH_NEW_SR,            "+
	"  SUM(NVL(TOTAL_KH_SR,0)) TOTAL_KH_SR,              "+
	"  SUM(NVL(KHQ_PZ_SR,0)) KHQ_PZ_SR,                  "+
	"  SUM(NVL(CLYH_SR,0)) CLYH_SR,                      "+
	"  ROUND(CASE WHEN SUM(NVL(KHQ_PZ_SR, 0)) = 0        "+
	"  then  0                                           "+
	"        else (SUM(NVL(CLYH_SR,0))/                  "+
	"        SUM(nvl(KHQ_PZ_SR,0)))*100                  "+
	"        end,2)||'%' SR_BYL,                         "+
	"  SUM(NVL(YW_SR,0)) YW_SR,                          "+
	"  SUM(NVL(GW_SR,0)) GW_SR,                          "+
	"  SUM(NVL(QT_SR,0)) QT_SR,                          "+
	"  SUM(NVL(TOTAL_YW_GW_SR,0)) TOTAL_YW_GW_SR,        "+
	"  SUM(NVL(HQ_COST_ALL,0)) HQ_COST_ALL,              "+
	"  SUM(NVL(YJ_ALL,0)) YJ_ALL,                        "+
	"  SUM(NVL(HQ_QDBT,0)) HQ_QDBT,                      "+
	"  SUM(NVL(ZD_BT,0)) ZD_BT,                          "+
	"  SUM(NVL(HQ_RENT,0)) HQ_RENT,                      "+
	"  SUM(NVL(HQ_ZX_FEE,0)) HQ_ZX_FEE,                  "+
	"  SUM(NVL(KHJR_CB,0)) KHJR_CB,                      "+
	"  SUM(NVL(KA_CB,0)) KA_CB,                          "+
	"  SUM(NVL(SDWY_FEE,0)) SDWY_FEE,                    "+
	"  SUM(NVL(TX_FEE,0)) TX_FEE,                        "+
	"  ROUND(CASE WHEN SUM(NVL(LJ_KH_NEW_SR, 0)) = 0     "+
	"  then 0                                            "+
	"        else(SUM(NVL(HQ_COST_ALL,0))/               "+
	"  SUM(NVL(LJ_KH_NEW_SR, 0)))*100                    "+
	"        end,2)||'%'  LJ_CB_ZSB                      "+
	"FROM PMRT.PRC_TAB_MRT_YSDZ_DETAIL                   "+
	where+
	groupBy;
	return sql;
}

function downsAll() {
	var title=[["地市","营服编码","营服名称","渠道编码","渠道名称","合作模式","考核周期开始时间","考核周期结束时间","以收定支系数","录入考核支出","","","新增用户收入目标","考核收入累计完成率","收入情况（出账-赠费-退费）","","","","","累计发展","","","","考核期内成本（系统同步）","","","","","","","","","",""],
			   ["","","","","","","","","","自建他营年房租","他建他营年房补","装修补贴","","","考核期新增用户累计收入","考核期存量+新增用户累计出账收入","考核周期前一个月拍照出账收入","考核期前存量用户当月出账收入","存量收入保有率","移网","固网","其他","合计","成本合计","佣金","渠道补贴","终端补贴","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","通信费","累计成本占收比"]];
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
