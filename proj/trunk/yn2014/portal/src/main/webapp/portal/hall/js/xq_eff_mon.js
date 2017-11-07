$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_XQ_EFF_ANA_MON");
	if(maxDate!=null){
		$("#startDate").val(maxDate);
		$("#endDate").val(maxDate);
	}
	var title=[["组织架构","乡镇","小区宽带初次开通端口时间","是否有光改区域","光改投产时间","小区类型（自有、BOT、EOC、混合）","端口数","端口实占率","月末到达用户数（运维部）","月末在网用户数","新增用户数","净增用户数","出账用户数","","","","","","平均ARPU值","投资额","付现毛利","出账收入（扣减赠费、退费）","付现成本合计","客户接入成本","","","佣金","用户欠费","用户预存款余额","二次续费率"],
	           ["","","","","","","","","","","","","合计","10兆以下","20兆","50兆","100兆","100兆以上","","","","","","开通费及材料费","光猫成本","TV终端成本","","","",""]];
	var field=["ROW_NAME","TOWN_NAME","KTDK_TIME","SFYGGQY","GGTC_TIME","STD_6_TYPE","DK_NUM","DKSZ_RATE","YMDDYH_NUM","IS_ON_NUM","DEV_BB_NUM","JZ_BB_NUM","ACCT_BB_NUM","ACCT_BB10_NUM","ACCT_BB20_NUM","ACCT_BB50_NUM","ACCT_BB100_NUM","ACCT_BB100_NUM1","ARPU","TZE","FXML","SR_BB_NUM","FXCB","KTFJCLF","GMCB","ZD","YJ_DEV","QF_NUM","YCK_FEE","SECOND_PAY_RATE"];
	$("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		field:field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var code='';
			var orgLevel='';
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var std_6_name=$("#std_6_name").val();
			var where="WHERE DEAL_DATE='"+startDate+"'";
			var whereDiff="WHERE DEAL_DATE BETWEEN  '"+startDate+"' AND '"+endDate+"' ";
			if(regionCode!=""){
				where += " AND GROUP_ID_1='"+regionCode+"'";
				whereDiff += " AND GROUP_ID_1='"+regionCode+"'";
			}
			if(unitCode!=""){
				where += " AND UNIT_ID='"+unitCode+"'";
				whereDiff += " AND UNIT_ID='"+unitCode+"'";
			}
			if(std_6_name!=""){
				where += " AND STD_6_NAME LIKE '%"+std_6_name+"%'";
				whereDiff += " AND STD_6_NAME LIKE '%"+std_6_name+"%'";
			}
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var startDate=$("#startDate").val();
				var endDate=$("#endDate").val();
				if(orgLevel==2){//点击省，显示市
					where+=" AND GROUP_ID_0='"+code+"'";
					whereDiff+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
					whereDiff+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示小区
					where+=" AND UNIT_ID='"+code+"'";
					whereDiff+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				if(startDate==endDate){
					sql=getSql(orgLevel,where);
				}else{
					sql=getSqlDiff(orgLevel,whereDiff);
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				var startDate=$("#startDate").val();
				var endDate=$("#endDate").val();
				if(orgLevel==1){//省
					where+=" AND GROUP_ID_0='"+code+"'";
					whereDiff+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					whereDiff+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID='"+code+"'";
					whereDiff+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				if(startDate==endDate){
					sql=getSql(orgLevel,where);
				}else{
					sql=getSqlDiff(orgLevel,whereDiff);
				}
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

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#startDate").val();
	var code=$("#code").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var std_6_name=$("#std_6_name").val();
	var where="WHERE DEAL_DATE='"+dealDate+"'";
	var whereDiff="WHERE DEAL_DATE BETWEEN  '"+startDate+"' AND '"+endDate+"' ";
	if(regionCode!=""){
		where += " AND GROUP_ID_1='"+regionCode+"'";
		whereDiff += " AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where += " AND UNIT_ID='"+unitCode+"'";
		whereDiff += " AND UNIT_ID='"+unitCode+"'";
	}
	if(std_6_name!=""){
		where += " AND STD_6_NAME LIKE '%"+std_6_name+"%'";
		whereDiff += " AND STD_6_NAME LIKE '%"+std_6_name+"%'";
	}
	if (orgLevel == 1) {//省
		
	} else if(orgLevel==2){//市
		where += " AND GROUP_ID_1='"+code+"'";
		whereDiff += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel==3){//营服
		where += " AND UNIT_ID='"+code+"'";
		whereDiff += " AND UNIT_ID='"+code+"'";
	} else{
		where += " AND 1=2";
		whereDiff += " AND 1=2";
	}
	var preSql="SELECT GROUP_ID_1_NAME,UNIT_NAME,STD_6_NAME,TOWN_NAME,KTDK_TIME,SFYGGQY,GGTC_TIME,STD_6_TYPE";
	var groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,TOWN_NAME,STD_6_ID,STD_6_NAME,KTDK_TIME,SFYGGQY,GGTC_TIME,STD_6_TYPE";
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,STD_6_ID";
	
	var sql = "";
	var showtext = '小区效能分析-' + dealDate;
	if(startDate==endDate){
		sql = preSql+getSumSql()+where+groupBy+orderBy;
	}else{
		preSql="SELECT T1.GROUP_ID_1_NAME, T1.UNIT_NAME,T1.STD_6_NAME, T1.TOWN_NAME, T1.KTDK_TIME, T1.SFYGGQY, T1.GGTC_TIME, T1.STD_6_TYPE, T.DK_NUM, T.DKSZ_RATE," +
		" T.YMDDYH_NUM, T.IS_ON_NUM, T.DEV_BB_NUM, T.JZ_BB_NUM, T.ACCT_BB_NUM, T.ACCT_BB10_NUM, T.ACCT_BB20_NUM, T.ACCT_BB50_NUM, " +
		"T.ACCT_BB100_NUM, T.ACCT_BB100_NUM1, T.ARPU, T.TZE, T.FXML, T.SR_BB_NUM, T.FXCB, T.KTFJCLF, T.GMCB, T.ZD, T.YJ_DEV, T.QF_NUM, T.YCK_FEE, T.SECOND_PAY_RATE " +
		"FROM ( SELECT STD_6_ID ROW_ID, STD_6_NAME ROW_NAME, '--' TOWN_NAME, '--' KTDK_TIME, '--' SFYGGQY, '--' GGTC_TIME, '--' STD_6_TYPE";
		groupBy=" GROUP BY STD_6_ID ,STD_6_NAME )T LEFT JOIN ( SELECT * FROM PMRT.TB_MRT_XQ_EFF_ANA_MON  WHERE DEAL_DATE = '"+endDate+"' )T1 ON(T.ROW_ID=T1.STD_6_ID)";
		sql = preSql+getSumSqlDiff()+whereDiff+groupBy+orderBy;
		showtext = '小区效能分析-' + startDate+ '-' + endDate;
		}
	var title=[['地市','营服','小区名称',"乡镇","小区宽带初次开通端口时间","是否有光改区域","光改投产时间","小区类型（自有、BOT、EOC、混合）","端口数","端口实占率","月末到达用户数（运维部）","月末在网用户数","新增用户数","净增用户数","出账用户数","","","","","","平均ARPU值","投资额","付现毛利","出账收入（扣减赠费、退费）","付现成本合计","客户接入成本","","","佣金","用户欠费","用户预存款余额","二次续费率"],
	           ["","","","","","","","","","","","","","","合计","10兆以下","20兆","50兆","100兆","100兆以上","","","","","","开通费及材料费","光猫成本","TV终端成本","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var preSql="";
	var groupBy="";
	var orderBy="";
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
		orderBy=" ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
		orderBy=" ORDER BY UNIT_ID";
	}else{
		preSql="SELECT STD_6_ID ROW_ID,STD_6_NAME ROW_NAME,TOWN_NAME,KTDK_TIME,SFYGGQY,GGTC_TIME,STD_6_TYPE";
		groupBy=" GROUP BY TOWN_NAME,STD_6_ID,STD_6_NAME,KTDK_TIME,SFYGGQY,GGTC_TIME,STD_6_TYPE";
		orderBy=" ORDER BY STD_6_ID";
	}
	return preSql+getSumSql()+where+groupBy+orderBy;
  }
function getSqlDiff(orgLevel,where){
	var preSql="";
	var groupBy="";
	var orderBy="";
	var endDate=$("#endDate").val();
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
		orderBy=" ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,'--' TOWN_NAME,'--' KTDK_TIME,'--' SFYGGQY,'--' GGTC_TIME,'--' STD_6_TYPE";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
		orderBy=" ORDER BY UNIT_ID";
	}else{
		preSql="SELECT T.ROW_ID, T.ROW_NAME, T1.TOWN_NAME, T1.KTDK_TIME, T1.SFYGGQY, T1.GGTC_TIME, T1.STD_6_TYPE, T.DK_NUM, T.DKSZ_RATE," +
				" T.YMDDYH_NUM, T.IS_ON_NUM, T.DEV_BB_NUM, T.JZ_BB_NUM, T.ACCT_BB_NUM, T.ACCT_BB10_NUM, T.ACCT_BB20_NUM, T.ACCT_BB50_NUM, " +
				"T.ACCT_BB100_NUM, T.ACCT_BB100_NUM1, T.ARPU, T.TZE, T.FXML, T.SR_BB_NUM, T.FXCB, T.KTFJCLF, T.GMCB, T.ZD, T.YJ_DEV, T.QF_NUM, T.YCK_FEE, T.SECOND_PAY_RATE " +
				"FROM ( SELECT STD_6_ID ROW_ID, STD_6_NAME ROW_NAME, '--' TOWN_NAME, '--' KTDK_TIME, '--' SFYGGQY, '--' GGTC_TIME, '--' STD_6_TYPE";
		groupBy=" GROUP BY STD_6_ID ,STD_6_NAME )T LEFT JOIN ( SELECT * FROM PMRT.TB_MRT_XQ_EFF_ANA_MON  WHERE DEAL_DATE = '"+endDate+"' )T1 ON(T.ROW_ID=T1.STD_6_ID)";
		orderBy="";
	}
	return preSql+getSumSqlDiff()+where+groupBy+orderBy;
 }

function getSumSql(){
	return "      ,NVL(SUM(DK_NUM),0)       DK_NUM                                                         "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(DKSZ_NUM),0),NVL(SUM(DK_NUM),0),2)    DKSZ_RATE              "+
	"      ,NVL(SUM(YMDDYH_NUM),0)   YMDDYH_NUM                                                     "+
	"      ,NVL(SUM(IS_ON_NUM),0)    IS_ON_NUM                                                      "+
	"      ,NVL(SUM(DEV_BB_NUM),0)   DEV_BB_NUM                                                     "+
	"      ,NVL(SUM(JZ_BB_NUM),0)    JZ_BB_NUM                                                      "+
	"      ,NVL(SUM(ACCT_BB_NUM),0)   ACCT_BB_NUM                                                   "+
	"      ,NVL(SUM(ACCT_BB10_NUM),0) ACCT_BB10_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB20_NUM),0) ACCT_BB20_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB50_NUM),0) ACCT_BB50_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB100_NUM),0) ACCT_BB100_NUM                                               "+
	"      ,NVL(SUM(ACCT_BB100_NUM1),0) ACCT_BB100_NUM1                                             "+
	"      ,PMRT.LINK_RATIO_RATE(NVL(SUM(SR_BB_NUM),0),NVL(SUM(ACCT_BB_NUM),0),2) ARPU              "+
	"      ,NVL(SUM(TZE),0)             TZE                                                         "+
	"      ,NVL(SUM(FXML),0)            FXML                                                        "+
	"      ,ROUND(NVL(SUM(SR_BB_NUM),0),2)       SR_BB_NUM                                          "+
	"      ,NVL(SUM(FXCB),0)             FXCB                                                       "+
	"      ,NVL(SUM(KTFJCLF),0)         KTFJCLF                                                     "+
	"      ,NVL(SUM(GMCB),0)         GMCB                                                           "+
	"      ,ROUND(NVL(SUM(ZD),0),2)    ZD                                                      "+
	"      ,NVL(SUM(YJ_DEV),0)         YJ_DEV                                                       "+
	"      ,NVL(SUM(QF_NUM),0)         QF_NUM                                                       "+
	"      ,NVL(SUM(YCK_FEE),0)         YCK_FEE                                                     "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(XF_7_NUM),0),NVL(SUM(INNET_7_NUM),0),2)     SECOND_PAY_RATE  "+  
	"FROM  PMRT.TB_MRT_XQ_EFF_ANA_MON                                                               ";
}
function getSumSqlDiff(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	return " ,NVL(SUM(CASE WHEN DEAL_DATE ='"+endDate+"'  "+      //--结束账期
    "                      THEN DK_NUM END ), 0) DK_NUM                                           "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(CASE WHEN DEAL_DATE ='"+endDate+"'   "+ //--结束账期
    "                                    THEN DKSZ_NUM END ), 0)     "+
    "                          ,NVL(SUM(CASE WHEN DEAL_DATE ='"+endDate+"'  "+  //--结束账期
    "                                    THEN DK_NUM END ), 0)       "+
    "                           ,2) DKSZ_RATE                         "+
	"      ,NVL(SUM(YMDDYH_NUM),0)   YMDDYH_NUM                                                     "+
	"      ,NVL(SUM(IS_ON_NUM),0)    IS_ON_NUM                                                      "+
	"      ,NVL(SUM(DEV_BB_NUM),0)   DEV_BB_NUM                                                     "+
	"      ,NVL(SUM(JZ_BB_NUM),0)    JZ_BB_NUM                                                      "+
	"      ,NVL(SUM(ACCT_BB_NUM),0)   ACCT_BB_NUM                                                   "+
	"      ,NVL(SUM(ACCT_BB10_NUM),0) ACCT_BB10_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB20_NUM),0) ACCT_BB20_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB50_NUM),0) ACCT_BB50_NUM                                                 "+
	"      ,NVL(SUM(ACCT_BB100_NUM),0) ACCT_BB100_NUM                                               "+
	"      ,NVL(SUM(ACCT_BB100_NUM1),0) ACCT_BB100_NUM1                                             "+
	"      ,PMRT.LINK_RATIO_RATE(NVL(SUM(SR_BB_NUM),0),NVL(SUM(ACCT_BB_NUM),0),2) ARPU              "+
	"      ,NVL(SUM(TZE),0)             TZE                                                         "+
	"      ,NVL(SUM(FXML),0)            FXML                                                        "+
	"      ,ROUND(NVL(SUM(SR_BB_NUM),0),2)       SR_BB_NUM                                          "+
	"      ,NVL(SUM(FXCB),0)             FXCB                                                       "+
	"      ,NVL(SUM(KTFJCLF),0)         KTFJCLF                                                     "+
	"      ,NVL(SUM(GMCB),0)         GMCB                                                           "+
	"      ,ROUND(NVL(SUM(ZD),0),2)         ZD                                                      "+
	"      ,NVL(SUM(YJ_DEV),0)         YJ_DEV                                                       "+
	"      ,NVL(SUM(QF_NUM),0)         QF_NUM                                                       "+
	"      ,NVL(SUM(YCK_FEE),0)         YCK_FEE                                                     "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(XF_7_NUM),0),NVL(SUM(INNET_7_NUM),0),2)     SECOND_PAY_RATE  "+  
	"FROM  PMRT.TB_MRT_XQ_EFF_ANA_MON                                                               ";
}
