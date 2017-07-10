var title=[["组织架构","出帐收入(扣减赠费、退费)","","","","","","","","成本费用合计","佣金","","","","","","","","营销费用","","","","","","","","","","","","","行政费用","","行政费用（共同）","","","毛利润","销售毛利润"],
            ["","2G","3G","4G","专租线","宽带","固话","其他","合计","","2G","3G","4G","专租线","宽带","固话","其他","合计","紧密外包费用","渠道补贴","终端补贴","卡成本","营业厅房租(装修)","水电物业费","广告宣传费","物流配送费","业务用品印制及材料费","业务外包服务费","导购服务费/平台服务费","支付手续费","营销费用小计","车辆使用费","招待费","办公费","差旅费","通信费","",""]];
var field=["INCOME_2G","INCOME_3G","INCOME_4G","INCOME_ZZX","INCOME_KD","INCOME_NET","INCOME_OTHER","INCOME_ALL","COST_ALL","COMM_2G","COMM_3G","COMM_4G","COMM_ZZX","COMM_KD","COMM_NET","COMM_OTHER","COMM_ALL","JMWB_FEE","QDBT_FEE","ZDBT_FEE","KA_COST","YYT_RANT","WA_FEE","AD_FEE","RES_FEE","YWYP_FEE","YWWB_FEE","DGFW_FEE","PAY_FEE","YXFY_FEE","CAR_FEE","ZDF_FEE","WORK_FEE","BEAT_FEE","TX_FEE","ML_FEE","SELL_ML_FEE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_CABLE_BUS_COST_MON");
	if(maxDate){
		$("#startDate").val(maxDate);
		$("#endDate").val(maxDate);
	}
	
    $("#searchBtn").click(function(){
		report.showSubRow();
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME"].concat(field),
		//css:[{gt:4,css:LchReport.RIGHT_ALIGN}, {array:[9,15,29],css:LchReport.NORMAL_STYLE}],
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
			var where=" WHERE T.DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var groupBy="";
			var preSql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preSql=" T.GROUP_ID_1 as ROW_ID,T.GROUP_ID_1_NAME as ROW_NAME ";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME ";
				}else if(orgLevel==3){//点击市
					preSql=" T.UNIT_ID as ROW_ID,T.UNIT_NAME as ROW_NAME ";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY T.UNIT_ID,T.UNIT_NAME ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preSql=" '86000' as ROW_ID,'云南省' as ROW_NAME ";
				}else if(orgLevel==2){//市
					preSql=" T.GROUP_ID_1 as ROW_ID,T.GROUP_ID_1_NAME as ROW_NAME ";
					where+=" AND T.GROUP_ID_1='"+code+"' ";
					groupBy=" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME ";
				}else if(orgLevel==3){//营服
					preSql=" T.UNIT_ID as ROW_ID,T.UNIT_NAME as ROW_NAME ";
					where+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
					groupBy=" GROUP BY T.UNIT_ID,T.UNIT_NAME ";
				}else {
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			
			var sql="";
			sql+=" SELECT                                         ";
			sql+=preSql;
			sql+="       ,SUM(INCOME_2G)    INCOME_2G             ";
			sql+="       ,SUM(INCOME_3G)    INCOME_3G             ";
			sql+="       ,SUM(INCOME_4G)    INCOME_4G             ";
			sql+="       ,SUM(INCOME_ZZX)   INCOME_ZZX            ";
			sql+="       ,SUM(INCOME_KD)    INCOME_KD             ";
			sql+="       ,SUM(INCOME_NET)   INCOME_NET            ";
			sql+="       ,SUM(INCOME_OTHER) INCOME_OTHER          ";
			sql+="       ,SUM(INCOME_ALL)   INCOME_ALL            ";
			sql+="       ,SUM(COST_ALL)     COST_ALL              ";
			sql+="       ,SUM(COMM_2G)      COMM_2G               ";
			sql+="       ,SUM(COMM_3G)      COMM_3G               ";
			sql+="       ,SUM(COMM_4G)      COMM_4G               ";
			sql+="       ,SUM(COMM_ZZX)     COMM_ZZX              ";
			sql+="       ,SUM(COMM_KD)      COMM_KD               ";
			sql+="       ,SUM(COMM_NET)     COMM_NET              ";
			sql+="       ,SUM(COMM_OTHER)   COMM_OTHER            ";
			sql+="       ,SUM(COMM_ALL)     COMM_ALL              ";
			sql+="       ,SUM(JMWB_FEE)     JMWB_FEE              ";
			sql+="       ,SUM(QDBT_FEE)     QDBT_FEE              ";
			sql+="       ,SUM(ZDBT_FEE)     ZDBT_FEE              ";
			sql+="       ,SUM(KA_COST)      KA_COST               ";
			sql+="       ,SUM(YYT_RANT)     YYT_RANT              ";
			sql+="       ,SUM(WA_FEE)       WA_FEE                ";
			sql+="       ,SUM(AD_FEE)       AD_FEE                ";
			sql+="       ,SUM(RES_FEE)      RES_FEE               ";
			sql+="       ,SUM(YWYP_FEE)     YWYP_FEE              ";
			sql+="       ,SUM(YWWB_FEE)     YWWB_FEE              ";
			sql+="       ,SUM(DGFW_FEE)     DGFW_FEE              ";
			sql+="       ,SUM(PAY_FEE)      PAY_FEE               ";
			sql+="       ,SUM(YXFY_FEE)     YXFY_FEE              ";
			sql+="       ,SUM(CAR_FEE)      CAR_FEE               ";
			sql+="       ,SUM(ZDF_FEE)      ZDF_FEE               ";
			sql+="       ,SUM(WORK_FEE)     WORK_FEE              ";
			sql+="       ,SUM(BEAT_FEE)     BEAT_FEE              ";
			sql+="       ,SUM(TX_FEE)       TX_FEE                ";
			sql+="       ,SUM(ML_FEE)       ML_FEE                ";
			sql+="       ,SUM(SELL_ML_FEE)  SELL_ML_FEE           ";
			sql+=" FROM PMRT.TAB_MRT_CABLE_BUS_COST_MON T         ";
			sql+=where;
			sql+=groupBy;
			
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
});

function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	
	//权限
	if (orgLevel == 1) {//省
		
	} else if(orgLevel == 2){//市
		where += " AND T.GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND T.UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}

	var sql="";
	sql+=" SELECT                                         ";
	sql+="       T.GROUP_ID_1_NAME,T.UNIT_NAME            ";
	sql+="       ,SUM(INCOME_2G)    INCOME_2G             ";
	sql+="       ,SUM(INCOME_3G)    INCOME_3G             ";
	sql+="       ,SUM(INCOME_4G)    INCOME_4G             ";
	sql+="       ,SUM(INCOME_ZZX)   INCOME_ZZX            ";
	sql+="       ,SUM(INCOME_KD)    INCOME_KD             ";
	sql+="       ,SUM(INCOME_NET)   INCOME_NET            ";
	sql+="       ,SUM(INCOME_OTHER) INCOME_OTHER          ";
	sql+="       ,SUM(INCOME_ALL)   INCOME_ALL            ";
	sql+="       ,SUM(COST_ALL)     COST_ALL              ";
	sql+="       ,SUM(COMM_2G)      COMM_2G               ";
	sql+="       ,SUM(COMM_3G)      COMM_3G               ";
	sql+="       ,SUM(COMM_4G)      COMM_4G               ";
	sql+="       ,SUM(COMM_ZZX)     COMM_ZZX              ";
	sql+="       ,SUM(COMM_KD)      COMM_KD               ";
	sql+="       ,SUM(COMM_NET)     COMM_NET              ";
	sql+="       ,SUM(COMM_OTHER)   COMM_OTHER            ";
	sql+="       ,SUM(COMM_ALL)     COMM_ALL              ";
	sql+="       ,SUM(JMWB_FEE)     JMWB_FEE              ";
	sql+="       ,SUM(QDBT_FEE)     QDBT_FEE              ";
	sql+="       ,SUM(ZDBT_FEE)     ZDBT_FEE              ";
	sql+="       ,SUM(KA_COST)      KA_COST               ";
	sql+="       ,SUM(YYT_RANT)     YYT_RANT              ";
	sql+="       ,SUM(WA_FEE)       WA_FEE                ";
	sql+="       ,SUM(AD_FEE)       AD_FEE                ";
	sql+="       ,SUM(RES_FEE)      RES_FEE               ";
	sql+="       ,SUM(YWYP_FEE)     YWYP_FEE              ";
	sql+="       ,SUM(YWWB_FEE)     YWWB_FEE              ";
	sql+="       ,SUM(DGFW_FEE)     DGFW_FEE              ";
	sql+="       ,SUM(PAY_FEE)      PAY_FEE               ";
	sql+="       ,SUM(YXFY_FEE)     YXFY_FEE              ";
	sql+="       ,SUM(CAR_FEE)      CAR_FEE               ";
	sql+="       ,SUM(ZDF_FEE)      ZDF_FEE               ";
	sql+="       ,SUM(WORK_FEE)     WORK_FEE              ";
	sql+="       ,SUM(BEAT_FEE)     BEAT_FEE              ";
	sql+="       ,SUM(TX_FEE)       TX_FEE                ";
	sql+="       ,SUM(ML_FEE)       ML_FEE                ";
	sql+="       ,SUM(SELL_ML_FEE)  SELL_ML_FEE           ";
	sql+=" FROM PMRT.TAB_MRT_CABLE_BUS_COST_MON T         ";
	sql+=where;
	sql+=" GROUP BY T.GROUP_ID_1_NAME,T.UNIT_NAME         ";
	
	var showtext = '电商直属营业厅收入成本展现表' + startDate+"-"+endDate;
	var title=[["州市","营销单元","出帐收入(扣减赠费、退费)","","","","","","","","成本费用合计","佣金","","","","","","","","营销费用","","","","","","","","","","","","","行政费用","","行政费用（共同）","","","毛利润","销售毛利润"],
	            ["","","2G","3G","4G","专租线","宽带","固话","其他","合计","","2G","3G","4G","专租线","宽带","固话","其他","合计","紧密外包费用","渠道补贴","终端补贴","卡成本","营业厅房租(装修)","水电物业费","广告宣传费","物流配送费","业务用品印制及材料费","业务外包服务费","导购服务费/平台服务费","支付手续费","营销费用小计","车辆使用费","招待费","办公费","差旅费","通信费","",""]];

	downloadExcel(sql,title,showtext);
}