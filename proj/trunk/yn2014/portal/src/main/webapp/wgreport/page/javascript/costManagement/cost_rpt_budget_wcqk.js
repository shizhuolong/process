var click_flag = 0;
var _execute = $.Project.execute; 
var defaultMsgDom = $('#searchTime');
var tablecode = ["grid_type","grid_level","income_2g_1","income_2g_2","income_2g_3","income_2g_4",
                 "income_3g_1","income_3g_2","income_3g_3","income_3g_4",
                 "income_gw_1","income_gw_2","income_gw_3","income_gw_4"
                 ,"comm_amount_1","comm_amount_2","comm_amount_3","comm_amount_4",
                 "qdbt_amount_1","qdbt_amount_2","qdbt_amount_3","qdbt_amount_4",
                 "ads_amount_1","ads_amount_2","ads_amount_3","ads_amount_4",
                 "cus_user_amount_1","cus_user_amount_2","cus_user_amount_3","cus_user_amount_4",
                 "caruse_amount_1","caruse_amount_2","caruse_amount_3","caruse_amount_4",
                 "entertain_amount_1","entertain_amount_2","entertain_amount_3","entertain_amount_4",
                 "administrative_amount_1","administrative_amount_2","administrative_amount_3","administrative_amount_4",
                 "travel_amount_1","travel_amount_2","travel_amount_3","travel_amount_4",
                 "letter_amount_1","letter_amount_2","letter_amount_3","letter_amount_4",
                 "house_amount_1","house_amount_2","house_amount_3","house_amount_4",
                 "other_rent_amount_1","other_rent_amount_2","other_rent_amount_3","other_rent_amount_4",
                 "water_amount_1","water_amount_2","water_amount_3","water_amount_4",
                 "property_amount_1","property_amount_2","property_amount_3","property_amount_4",
                 "other_amount_1","other_amount_2","other_amount_3","other_amount_4"];
var querydate = "";
var enddate = "";
jQuery(function($){
	$("#search").click(searchClick);
	querydate = $("#searchTime").val();
    enddate = $("#endTime").val();
	initTable(); 
	//excel导出
	$("#button_excel").click(downsaction);
	$("#button_all_excel").click(downsAll);
	
});

function initTable(){
	var sql = 
			"max('—') GRID_TYPE" +
			",max('—') GRID_LEVEL" +
			",sum(T1.INCOME_2G_1) INCOME_2G_1"+// +预算,
			",sum(T1.INCOME_2G_2) INCOME_2G_2" +//      --2g实际发生
			",sum(T1.INCOME_2G_3) INCOME_2G_3" +//      --2g尚可使用金额
			//",sum(T1.INCOME_2G_4) INCOME_2G_4" +//      --2g预算完成率" +
			",CASE WHEN sum(T1.INCOME_2G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_2G_2)/sum(T1.INCOME_2G_1),2) END AS INCOME_2G_4"+
			",sum(T1.INCOME_3G_1) INCOME_3G_1" +//      --3g预算
			",sum(T1.INCOME_3G_2) INCOME_3G_2" +//      --3g实际发生
			",sum(T1.INCOME_3G_3) INCOME_3G_3" +//      --3g尚可使用金额
			//",sum(T1.INCOME_3G_4) INCOME_3G_4" +//      --3g预算完成率
			",CASE WHEN sum(T1.INCOME_3G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_3G_2)/sum(T1.INCOME_3G_1),2) END AS INCOME_3G_4"+
			",sum(T1.INCOME_GW_1) INCOME_GW_1" +//     --固网预算
			",sum(T1.INCOME_GW_2) INCOME_GW_2" +//      --固网实际发生
			",sum(T1.INCOME_GW_3) INCOME_GW_3" +//      --固网尚可使用金额
			//",sum(T1.INCOME_GW_4) INCOME_GW_4" +//      --固网预算完成率
			",CASE WHEN sum(T1.INCOME_GW_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_GW_2)/sum(T1.INCOME_GW_1),2) END AS INCOME_GW_4"+
			",sum(T1.COMM_AMOUNT_1) COMM_AMOUNT_1" +//     --佣金预算
			",sum(T1.COMM_AMOUNT_2) COMM_AMOUNT_2" +//      --佣金实际发生
			",sum(T1.COMM_AMOUNT_3) COMM_AMOUNT_3" +//      --佣金尚可使用金额
			//",sum(T1.COMM_AMOUNT_4) COMM_AMOUNT_4" +//      --佣金预算完成率
			",CASE WHEN sum(T1.COMM_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.COMM_AMOUNT_2)/sum(T1.COMM_AMOUNT_1),2) END AS COMM_AMOUNT_4"+
			",sum(T1.QDBT_AMOUNT_1) QDBT_AMOUNT_1" +//     --渠道补贴预算
			",sum(T1.QDBT_AMOUNT_2) QDBT_AMOUNT_2" +//     --渠道补贴实际费用
			",sum(T1.QDBT_AMOUNT_3) QDBT_AMOUNT_3" +//      --渠道补贴尚可使用金额
			//",sum(T1.QDBT_AMOUNT_4) QDBT_AMOUNT_4" +//      --渠道补贴预算完成率
			",CASE WHEN sum(T1.QDBT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.QDBT_AMOUNT_2)/sum(T1.QDBT_AMOUNT_1),2) END AS QDBT_AMOUNT_4"+
			",sum(T1.ADS_AMOUNT_1) ADS_AMOUNT_1" +//      --广告宣传费预算
			",sum(T1.ADS_AMOUNT_2) ADS_AMOUNT_2" +//      --广告宣传费实际费用
			",sum(T1.ADS_AMOUNT_3) ADS_AMOUNT_3" +//      --广告宣传费尚可使用金额
			//",sum(T1.ADS_AMOUNT_4) ADS_AMOUNT_4" +//      --广告宣传费预算完成率
			",CASE WHEN sum(T1.ADS_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADS_AMOUNT_2)/sum(T1.ADS_AMOUNT_1),2) END AS ADS_AMOUNT_4"+
			",sum(T1.CUS_USER_AMOUNT_1) CUS_USER_AMOUNT_1" +//      --客户维系和用户获取成本预算
			",sum(T1.CUS_USER_AMOUNT_2) CUS_USER_AMOUNT_2" +//      --客户维系和用户获取成本实际费用
			",sum(T1.CUS_USER_AMOUNT_3) CUS_USER_AMOUNT_3" +//      --客户维系和用户获取成本尚可使用金额
			//",sum(T1.CUS_USER_AMOUNT_4) CUS_USER_AMOUNT_4" +//      --客户维系和用户获取成本预算完成率
			",CASE WHEN sum(T1.CUS_USER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CUS_USER_AMOUNT_2)/sum(T1.CUS_USER_AMOUNT_1),2) END AS CUS_USER_AMOUNT_4"+
			",sum(T1.CARUSE_AMOUNT_1) CARUSE_AMOUNT_1" +//      --车辆使用费预算
			",sum(T1.CARUSE_AMOUNT_2) CARUSE_AMOUNT_2" +//      --车辆使用费实际费用
			",sum(T1.CARUSE_AMOUNT_3) CARUSE_AMOUNT_3" +//      --车辆使用费尚可使用金额
			//",sum(T1.CARUSE_AMOUNT_4) CARUSE_AMOUNT_4" +//      --车辆使用费预算完成率
			",CASE WHEN sum(T1.CARUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CARUSE_AMOUNT_2)/sum(T1.CARUSE_AMOUNT_1),2) END AS CARUSE_AMOUNT_4"+
			",sum(T1.ENTERTAIN_AMOUNT_1) ENTERTAIN_AMOUNT_1" +//      --招待费预算
			",sum(T1.ENTERTAIN_AMOUNT_2) ENTERTAIN_AMOUNT_2" +//      --招待费实际费用
			",sum(T1.ENTERTAIN_AMOUNT_3) ENTERTAIN_AMOUNT_3" +//      --招待费尚可使用金额
			//",sum(T1.ENTERTAIN_AMOUNT_4) ENTERTAIN_AMOUNT_4" +//      --招待费预算完成率
			",CASE WHEN sum(T1.ENTERTAIN_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ENTERTAIN_AMOUNT_2)/sum(T1.ENTERTAIN_AMOUNT_1),2) END AS ENTERTAIN_AMOUNT_4"+
			",sum(T1.ADMINISTRATIVE_AMOUNT_1) ADMINISTRATIVE_AMOUNT_1" +//      --办公费预算
			",sum(T1.ADMINISTRATIVE_AMOUNT_2) ADMINISTRATIVE_AMOUNT_2" +//      --办公费实际费用
			",sum(T1.ADMINISTRATIVE_AMOUNT_3) ADMINISTRATIVE_AMOUNT_3" +//      --办公费尚可使用金额
			//",sum(T1.ADMINISTRATIVE_AMOUNT_4) ADMINISTRATIVE_AMOUNT_4" +//      --办公费预算完成率
			",CASE WHEN sum(T1.ADMINISTRATIVE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADMINISTRATIVE_AMOUNT_2)/sum(T1.ADMINISTRATIVE_AMOUNT_1),2) END AS ADMINISTRATIVE_AMOUNT_4"+
			",sum(T1.TRAVEL_AMOUNT_1) TRAVEL_AMOUNT_1" +//      --旅行费预算预算
			",sum(T1.TRAVEL_AMOUNT_2) TRAVEL_AMOUNT_2" +//      --旅行费实际费用
			",sum(T1.TRAVEL_AMOUNT_3) TRAVEL_AMOUNT_3" +//      --旅行费尚可使用金额
			//",sum(T1.TRAVEL_AMOUNT_4) TRAVEL_AMOUNT_4" +//      --旅行费预算完成率
			",CASE WHEN sum(T1.TRAVEL_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.TRAVEL_AMOUNT_2)/sum(T1.TRAVEL_AMOUNT_1),2) END AS TRAVEL_AMOUNT_4"+
			",sum(T1.LETTER_AMOUNT_1) LETTER_AMOUNT_1" +//      --通信费预算
			",sum(T1.LETTER_AMOUNT_2) LETTER_AMOUNT_2" +//      --通信费实际费用
			",sum(T1.LETTER_AMOUNT_3) LETTER_AMOUNT_3" +//      --通信费尚可使用金额
			//",sum(T1.LETTER_AMOUNT_4) LETTER_AMOUNT_4" +//      --通信费预算完成率
			",CASE WHEN sum(T1.LETTER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.LETTER_AMOUNT_2)/sum(T1.LETTER_AMOUNT_1),2) END AS LETTER_AMOUNT_4"+
			",sum(T1.HOUSE_AMOUNT_1) HOUSE_AMOUNT_1" +//      --房租费预算
			",sum(T1.HOUSE_AMOUNT_2) HOUSE_AMOUNT_2" +//      --房租费实际费用
			",sum(T1.HOUSE_AMOUNT_3) HOUSE_AMOUNT_3" +//      --房租费尚可使用金额
			//",sum(T1.HOUSE_AMOUNT_4) HOUSE_AMOUNT_4" +//      --房租费预算完成率
			",CASE WHEN sum(T1.HOUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.HOUSE_AMOUNT_2)/sum(T1.HOUSE_AMOUNT_1),2) END AS HOUSE_AMOUNT_4"+
			",sum(T1.OTHER_RENT_AMOUNT_1) OTHER_RENT_AMOUNT_1" +//      --其他租赁费预算
			",sum(T1.OTHER_RENT_AMOUNT_2) OTHER_RENT_AMOUNT_2" +//      --其他租赁费实际费用
			",sum(T1.OTHER_RENT_AMOUNT_3) OTHER_RENT_AMOUNT_3" +//     --其他租赁费尚可使用金额
			//",sum(T1.OTHER_RENT_AMOUNT_4) OTHER_RENT_AMOUNT_4" +//      --其他租赁费预算完成率
			",CASE WHEN sum(T1.OTHER_RENT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_RENT_AMOUNT_2)/sum(T1.OTHER_RENT_AMOUNT_1),2) END AS OTHER_RENT_AMOUNT_4"+
			",sum(T1.WATER_AMOUNT_1) WATER_AMOUNT_1" +//      --水电费预算
			",sum(T1.WATER_AMOUNT_2) WATER_AMOUNT_2" +//      --水电费实际费用
			",sum(T1.WATER_AMOUNT_3) WATER_AMOUNT_3" +//      --水电费尚可使用金额
			//",sum(T1.WATER_AMOUNT_4) WATER_AMOUNT_4" +//      --水电费预算完成率
			",CASE WHEN sum(T1.WATER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.WATER_AMOUNT_2)/sum(T1.WATER_AMOUNT_1),2) END AS WATER_AMOUNT_4"+
			",sum(T1.PROPERTY_AMOUNT_1) PROPERTY_AMOUNT_1" +//      --物业管理费预算
			",sum(T1.PROPERTY_AMOUNT_2) PROPERTY_AMOUNT_2" +//      --物业管理费实际付费用
			",sum(T1.PROPERTY_AMOUNT_3) PROPERTY_AMOUNT_3" +//      --物业管理费尚可使用金额
			//",sum(T1.PROPERTY_AMOUNT_4) PROPERTY_AMOUNT_4" +//      --物业管理费预算完成率
			",CASE WHEN sum(T1.PROPERTY_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.PROPERTY_AMOUNT_2)/sum(T1.PROPERTY_AMOUNT_1),2) END AS PROPERTY_AMOUNT_4"+
			",sum(T1.OTHER_AMOUNT_1) OTHER_AMOUNT_1" +//      --其他预算
			",sum(T1.OTHER_AMOUNT_2) OTHER_AMOUNT_2" +//      --其他实际费用
			",sum(T1.OTHER_AMOUNT_3) OTHER_AMOUNT_3" +//      --其他尚可使用金额
			//",sum(T1.OTHER_AMOUNT_4) OTHER_AMOUNT_4" +//     --其他预算完成率
			",CASE WHEN sum(T1.OTHER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_AMOUNT_2)/sum(T1.OTHER_AMOUNT_1),2) END AS OTHER_AMOUNT_4"+
			",T1.GROUP_ID_"+group_level+" groupid " +
			"FROM PMRT.TB_MRT_COST_RPT_BUDGET_WCQK T1 ";
		//var wheresql = " WHERE t1.GROUP_ID_"+group_level+"='"+group_id+"' AND t1.DEAL_DATE='"+querydate+"' ";
		var wheresql = " WHERE t1.GROUP_ID_"+group_level+"='"+group_id+"' AND t1.DEAL_DATE between '"+querydate+"' and '"+enddate+"' ";
		var groupbySql = " GROUP BY t1.group_id_"+group_level +" order by groupid";
		if(group_level == 0) {
			sql = "SELECT max('云南省') as groupname," + sql + wheresql + groupbySql;
		}else if(group_level == 1) {
			sql = "SELECT max(t1.group_id_"+group_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else if(group_level == 2) { 
			sql = "SELECT max(t1.group_id_"+group_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else{
			sql = 
				"SELECT max(group_id_3_name) AS groupname," +
				 "max(CASE WHEN T1.GRID_TYPE='1' THEN '城区或县城' " +
					"WHEN T1.GRID_TYPE='2' THEN '乡镇' WHEN T1.GRID_TYPE='3' THEN '城乡混合' " +
					"WHEN T1.GRID_TYPE='4' THEN '派驻' ELSE '' END)AS GRID_TYPE," +
				"max(T1.GRID_LEVEL) GRID_LEVEL" +
				",sum(T1.INCOME_2G_1) INCOME_2G_1"+// +预算,
				",sum(T1.INCOME_2G_2) INCOME_2G_2" +//      --2g实际发生
				",sum(T1.INCOME_2G_3) INCOME_2G_3" +//      --2g尚可使用金额
				//",sum(T1.INCOME_2G_4) INCOME_2G_4" +//      --2g预算完成率" +
				",CASE WHEN sum(T1.INCOME_2G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_2G_2)/sum(T1.INCOME_2G_1),2) END AS INCOME_2G_4"+
				",sum(T1.INCOME_3G_1) INCOME_3G_1" +//      --3g预算
				",sum(T1.INCOME_3G_2) INCOME_3G_2" +//      --3g实际发生
				",sum(T1.INCOME_3G_3) INCOME_3G_3" +//      --3g尚可使用金额
				//",sum(T1.INCOME_3G_4) INCOME_3G_4" +//      --3g预算完成率
				",CASE WHEN sum(T1.INCOME_3G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_3G_2)/sum(T1.INCOME_3G_1),2) END AS INCOME_3G_4"+
				",sum(T1.INCOME_GW_1) INCOME_GW_1" +//     --固网预算
				",sum(T1.INCOME_GW_2) INCOME_GW_2" +//      --固网实际发生
				",sum(T1.INCOME_GW_3) INCOME_GW_3" +//      --固网尚可使用金额
				//",sum(T1.INCOME_GW_4) INCOME_GW_4" +//      --固网预算完成率
				",CASE WHEN sum(T1.INCOME_GW_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_GW_2)/sum(T1.INCOME_GW_1),2) END AS INCOME_GW_4"+
				",sum(T1.COMM_AMOUNT_1) COMM_AMOUNT_1" +//     --佣金预算
				",sum(T1.COMM_AMOUNT_2) COMM_AMOUNT_2" +//      --佣金实际发生
				",sum(T1.COMM_AMOUNT_3) COMM_AMOUNT_3" +//      --佣金尚可使用金额
				//",sum(T1.COMM_AMOUNT_4) COMM_AMOUNT_4" +//      --佣金预算完成率
				",CASE WHEN sum(T1.COMM_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.COMM_AMOUNT_2)/sum(T1.COMM_AMOUNT_1),2) END AS COMM_AMOUNT_4"+
				",sum(T1.QDBT_AMOUNT_1) QDBT_AMOUNT_1" +//     --渠道补贴预算
				",sum(T1.QDBT_AMOUNT_2) QDBT_AMOUNT_2" +//     --渠道补贴实际费用
				",sum(T1.QDBT_AMOUNT_3) QDBT_AMOUNT_3" +//      --渠道补贴尚可使用金额
				//",sum(T1.QDBT_AMOUNT_4) QDBT_AMOUNT_4" +//      --渠道补贴预算完成率
				",CASE WHEN sum(T1.QDBT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.QDBT_AMOUNT_2)/sum(T1.QDBT_AMOUNT_1),2) END AS QDBT_AMOUNT_4"+
				",sum(T1.ADS_AMOUNT_1) ADS_AMOUNT_1" +//      --广告宣传费预算
				",sum(T1.ADS_AMOUNT_2) ADS_AMOUNT_2" +//      --广告宣传费实际费用
				",sum(T1.ADS_AMOUNT_3) ADS_AMOUNT_3" +//      --广告宣传费尚可使用金额
				//",sum(T1.ADS_AMOUNT_4) ADS_AMOUNT_4" +//      --广告宣传费预算完成率
				",CASE WHEN sum(T1.ADS_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADS_AMOUNT_2)/sum(T1.ADS_AMOUNT_1),2) END AS ADS_AMOUNT_4"+
				",sum(T1.CUS_USER_AMOUNT_1) CUS_USER_AMOUNT_1" +//      --客户维系和用户获取成本预算
				",sum(T1.CUS_USER_AMOUNT_2) CUS_USER_AMOUNT_2" +//      --客户维系和用户获取成本实际费用
				",sum(T1.CUS_USER_AMOUNT_3) CUS_USER_AMOUNT_3" +//      --客户维系和用户获取成本尚可使用金额
				//",sum(T1.CUS_USER_AMOUNT_4) CUS_USER_AMOUNT_4" +//      --客户维系和用户获取成本预算完成率
				",CASE WHEN sum(T1.CUS_USER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CUS_USER_AMOUNT_2)/sum(T1.CUS_USER_AMOUNT_1),2) END AS CUS_USER_AMOUNT_4"+
				",sum(T1.CARUSE_AMOUNT_1) CARUSE_AMOUNT_1" +//      --车辆使用费预算
				",sum(T1.CARUSE_AMOUNT_2) CARUSE_AMOUNT_2" +//      --车辆使用费实际费用
				",sum(T1.CARUSE_AMOUNT_3) CARUSE_AMOUNT_3" +//      --车辆使用费尚可使用金额
				//",sum(T1.CARUSE_AMOUNT_4) CARUSE_AMOUNT_4" +//      --车辆使用费预算完成率
				",CASE WHEN sum(T1.CARUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CARUSE_AMOUNT_2)/sum(T1.CARUSE_AMOUNT_1),2) END AS CARUSE_AMOUNT_4"+
				",sum(T1.ENTERTAIN_AMOUNT_1) ENTERTAIN_AMOUNT_1" +//      --招待费预算
				",sum(T1.ENTERTAIN_AMOUNT_2) ENTERTAIN_AMOUNT_2" +//      --招待费实际费用
				",sum(T1.ENTERTAIN_AMOUNT_3) ENTERTAIN_AMOUNT_3" +//      --招待费尚可使用金额
				//",sum(T1.ENTERTAIN_AMOUNT_4) ENTERTAIN_AMOUNT_4" +//      --招待费预算完成率
				",CASE WHEN sum(T1.ENTERTAIN_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ENTERTAIN_AMOUNT_2)/sum(T1.ENTERTAIN_AMOUNT_1),2) END AS ENTERTAIN_AMOUNT_4"+
				",sum(T1.ADMINISTRATIVE_AMOUNT_1) ADMINISTRATIVE_AMOUNT_1" +//      --办公费预算
				",sum(T1.ADMINISTRATIVE_AMOUNT_2) ADMINISTRATIVE_AMOUNT_2" +//      --办公费实际费用
				",sum(T1.ADMINISTRATIVE_AMOUNT_3) ADMINISTRATIVE_AMOUNT_3" +//      --办公费尚可使用金额
				//",sum(T1.ADMINISTRATIVE_AMOUNT_4) ADMINISTRATIVE_AMOUNT_4" +//      --办公费预算完成率
				",CASE WHEN sum(T1.ADMINISTRATIVE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADMINISTRATIVE_AMOUNT_2)/sum(T1.ADMINISTRATIVE_AMOUNT_1),2) END AS ADMINISTRATIVE_AMOUNT_4"+
				",sum(T1.TRAVEL_AMOUNT_1) TRAVEL_AMOUNT_1" +//      --旅行费预算预算
				",sum(T1.TRAVEL_AMOUNT_2) TRAVEL_AMOUNT_2" +//      --旅行费实际费用
				",sum(T1.TRAVEL_AMOUNT_3) TRAVEL_AMOUNT_3" +//      --旅行费尚可使用金额
				//",sum(T1.TRAVEL_AMOUNT_4) TRAVEL_AMOUNT_4" +//      --旅行费预算完成率
				",CASE WHEN sum(T1.TRAVEL_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.TRAVEL_AMOUNT_2)/sum(T1.TRAVEL_AMOUNT_1),2) END AS TRAVEL_AMOUNT_4"+
				",sum(T1.LETTER_AMOUNT_1) LETTER_AMOUNT_1" +//      --通信费预算
				",sum(T1.LETTER_AMOUNT_2) LETTER_AMOUNT_2" +//      --通信费实际费用
				",sum(T1.LETTER_AMOUNT_3) LETTER_AMOUNT_3" +//      --通信费尚可使用金额
				//",sum(T1.LETTER_AMOUNT_4) LETTER_AMOUNT_4" +//      --通信费预算完成率
				",CASE WHEN sum(T1.LETTER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.LETTER_AMOUNT_2)/sum(T1.LETTER_AMOUNT_1),2) END AS LETTER_AMOUNT_4"+
				",sum(T1.HOUSE_AMOUNT_1) HOUSE_AMOUNT_1" +//      --房租费预算
				",sum(T1.HOUSE_AMOUNT_2) HOUSE_AMOUNT_2" +//      --房租费实际费用
				",sum(T1.HOUSE_AMOUNT_3) HOUSE_AMOUNT_3" +//      --房租费尚可使用金额
				//",sum(T1.HOUSE_AMOUNT_4) HOUSE_AMOUNT_4" +//      --房租费预算完成率
				",CASE WHEN sum(T1.HOUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.HOUSE_AMOUNT_2)/sum(T1.HOUSE_AMOUNT_1),2) END AS HOUSE_AMOUNT_4"+
				",sum(T1.OTHER_RENT_AMOUNT_1) OTHER_RENT_AMOUNT_1" +//      --其他租赁费预算
				",sum(T1.OTHER_RENT_AMOUNT_2) OTHER_RENT_AMOUNT_2" +//      --其他租赁费实际费用
				",sum(T1.OTHER_RENT_AMOUNT_3) OTHER_RENT_AMOUNT_3" +//     --其他租赁费尚可使用金额
				//",sum(T1.OTHER_RENT_AMOUNT_4) OTHER_RENT_AMOUNT_4" +//      --其他租赁费预算完成率
				",CASE WHEN sum(T1.OTHER_RENT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_RENT_AMOUNT_2)/sum(T1.OTHER_RENT_AMOUNT_1),2) END AS OTHER_RENT_AMOUNT_4"+
				",sum(T1.WATER_AMOUNT_1) WATER_AMOUNT_1" +//      --水电费预算
				",sum(T1.WATER_AMOUNT_2) WATER_AMOUNT_2" +//      --水电费实际费用
				",sum(T1.WATER_AMOUNT_3) WATER_AMOUNT_3" +//      --水电费尚可使用金额
				//",sum(T1.WATER_AMOUNT_4) WATER_AMOUNT_4" +//      --水电费预算完成率
				",CASE WHEN sum(T1.WATER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.WATER_AMOUNT_2)/sum(T1.WATER_AMOUNT_1),2) END AS WATER_AMOUNT_4"+
				",sum(T1.PROPERTY_AMOUNT_1) PROPERTY_AMOUNT_1" +//      --物业管理费预算
				",sum(T1.PROPERTY_AMOUNT_2) PROPERTY_AMOUNT_2" +//      --物业管理费实际付费用
				",sum(T1.PROPERTY_AMOUNT_3) PROPERTY_AMOUNT_3" +//      --物业管理费尚可使用金额
				//",sum(T1.PROPERTY_AMOUNT_4) PROPERTY_AMOUNT_4" +//      --物业管理费预算完成率
				",CASE WHEN sum(T1.PROPERTY_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.PROPERTY_AMOUNT_2)/sum(T1.PROPERTY_AMOUNT_1),2) END AS PROPERTY_AMOUNT_4"+
				",sum(T1.OTHER_AMOUNT_1) OTHER_AMOUNT_1" +//      --其他预算
				",sum(T1.OTHER_AMOUNT_2) OTHER_AMOUNT_2" +//      --其他实际费用
				",sum(T1.OTHER_AMOUNT_3) OTHER_AMOUNT_3" +//      --其他尚可使用金额
				//",sum(T1.OTHER_AMOUNT_4) OTHER_AMOUNT_4" +//     --其他预算完成率
				",CASE WHEN sum(T1.OTHER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_AMOUNT_2)/sum(T1.OTHER_AMOUNT_1),2) END AS OTHER_AMOUNT_4"+
				",T1.GROUP_ID_"+group_level+" groupid " +
				"FROM PMRT.TB_MRT_COST_RPT_BUDGET_WCQK T1 " + wheresql + groupbySql;
		}
	$.ajax({
		type:"POST",
		dataType:'json',
		cache:false,
		url:path+"/public!queryList.action",
		data:{
			sql:sql
		},
		error:function(){
			alert("网络延迟");
		},
		success:function(data){
			if(data == undefined || data == null || data == '' || data.length < 1){
				var preMon = getPreMonth(querydate);
				if(getPreMonth(deal_date) == preMon) {
					querydate = preMon;
					enddate = preMon;
					initTable();
					$("#searchTime").val(preMon);
					$("#endTime").val(preMon);
				}else {
					addTable(data,group_level);
				}
			}else{
				addTable(data,group_level);
			}
		}
	});
}
function addTable(data,level) {
	var mon = $("#searchTime").val();
	var preMon = getPreMonth(mon);
	var temp = "";
	temp += "<thead ><tr><th rowspan='3' class='attend_th'>营销架构</th><th rowspan='3' class='attend_th'>网格属性</th>" +
			"<th rowspan='3' class='attend_th'>网格等级</th>" +
			"<th colspan='12'>出帐收入</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>佣金</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>渠道补贴</th><th colspan='4' rowspan='2' class='attend_th'>广告宣传费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>用户维系费及用户获取成本</th><th colspan='4' rowspan='2' class='attend_th'>车辆使用费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>招待费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>办公费</th><th colspan='4' rowspan='2' class='attend_th'>差旅费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>通信费</th><th colspan='4' rowspan='2' class='attend_th'>房租费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>其他租赁费</th><th colspan='4' rowspan='2' class='attend_th'>水电费</th>" +
			"<th colspan='4' rowspan='2' class='attend_th'>物业管理费</th><th colspan='4' rowspan='2' class='attend_th'>其他</th>" +
			"</tr>" +
			
			"<tr>" +
			"<th colspan='4' class='attend_th'>2G</th><th colspan='4' class='attend_th'>3G</th>" +
			"<th colspan='4' class='attend_th'>固网</th></tr>" +
			
			"<tr><th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"<th class='attend_th'>预算</th><th class='attend_th'>实际发生</th>" +
			"<th class='attend_th'>尚可使用金额</th><th class='attend_th'>预算完成率</th>" +
			"</tr>" +
			"</thead>";
	temp +=	"<tbody id='tableIcon'>";
	var array_area;
	var area_name;
	var area_code;
	
	if(data == undefined || data == null || data == '' || data.length < 1){
		temp+=("<tr><td colspan='19' style='text-align:center;color: red'>对不起，没有匹配到您想要的数据！</td></tr>");
		click_flag = 0;
	}else{
		var rowNum = data.length;
		for(var i=0; i<rowNum; i++){
			area_name = data[i]["groupname"];
			area_code = data[i]["groupid"];
			temp += "<tr>";
			if(group_level==4){
				//营销架构列
				temp += "<td style='text-align:left;'><span style='margin-left:15px;width:300px;' class='root' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' class='root'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}else{
				//营销架构列
				temp += "<td style='text-align:left;white-space:nowrap;width:300px;'><span style='margin-left:15px' class='sub_on' id='showArea_"+level+"_"+area_code+"' hasChildren='false' value='"+area_name+"'><a href='javascript:void(0)' class='sub_on'  onclick='showSub(this);'>"+area_name+"</a></span></td>";
			}
			
			for(var j=0;j<tablecode.length;j++){
				var tmpval = data[i][tablecode[j]];
				if(tmpval!=null){
					tmpval = numberFormat(data[i][tablecode[j]]);
				}else{
					tmpval = "—";
				}
				//temp = addEle(temp,tablecode[j],area_code,level,$("#searchTime").val(),area_name,tmpval);
				temp += "<td style='text-align: center;'>"+tmpval+"</td>";
			}
			 		//"<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commissiondetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"明细' >明细</a> | "+
			/*temp +="<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commission2Gdetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"2G用户明细' >2G用户明细</a> | " +
							"<a href='javascript:void(0)' path='jsp/comm/sub_commission3Gdetail.jsp?query_groupid="+area_code+"&query_level="+level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+area_name+"3G用户明细' >3G用户明细</a></td>";*/
			temp += "</tr>";
		}
	}
	
	temp += "</tbody>";
	$("#tableData").html(temp);
//	$("tbody tr:visible:even").removeClass("spec");
//	$("tbody tr:visible:even").addClass("spec");
	
	$("tbody tr").removeClass("spec");
	$("tbody tr:visible:even").addClass("spec");
	click_flag = 0;
}

function showSub(element){//element：被点击的元素
	if(0 != click_flag){
        return;
    }
    var _this = $(element);
    var area_id = _this.parent().attr("id");
    var area_code = area_id.substring(11);
    var area_level = area_id.substring(9,10);            //被点元素所在层级
    var show_level = (parseInt(area_level) + 1) + "";    //要展示的层级
    if(show_level>3 || (group_level==3 && show_level>4)){
        alert("对不起，没有下一级数据可供钻取！");
        return;
    }
	    
    var array_code = area_id.split("_");
    var query_code = array_code[array_code.length - 1];
	    
	var array_tr;
	var array_next;
	var next_tr;
		
	var _level = parseInt(show_level);
	//判断是否有子节点，有则隐藏或显示，无则插入
    if("true" == _this.parent().attr("hasChildren")){
	    array_tr = $("[id*="+area_code+"]").not($("#"+area_id)).parent().parent();
	    array_next = $("[id^=showArea_"+show_level+"_"+area_code+"]");
	    next_tr = array_next.parent().parent();
	    if(array_next.is(":visible")){
	        array_tr.hide();
	        array_next.css("visibility","hidden");
	        $("#"+area_id).find("a").attr("class","sub_on");
	        //新增
	        $("#"+area_id).removeClass("sub");//移除+样式
	        $("#"+area_id).attr("class","sub_on");//改成-样式
	    }else{
	        array_tr.hide();
	        next_tr.show();
	        array_next.css("visibility","visible");
	        $("#"+area_id).find("a").attr("class","sub");
	        $("#"+area_id).removeClass("sub_on");//移除+样式
	        $("#"+area_id).attr("class","sub");//改成-样式
	    }
	}else{//准备数据查询下一级
	    click_flag = 1;
	    var sql = 
			"max('—') GRID_TYPE" +
			",max('—') GRID_LEVEL" +
			",sum(T1.INCOME_2G_1) INCOME_2G_1"+// +预算,
			",sum(T1.INCOME_2G_2) INCOME_2G_2" +//      --2g实际发生
			",sum(T1.INCOME_2G_3) INCOME_2G_3" +//      --2g尚可使用金额
			//",sum(T1.INCOME_2G_4) INCOME_2G_4" +//      --2g预算完成率" +
			",CASE WHEN sum(T1.INCOME_2G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_2G_2)/sum(T1.INCOME_2G_1),2) END AS INCOME_2G_4"+
			",sum(T1.INCOME_3G_1) INCOME_3G_1" +//      --3g预算
			",sum(T1.INCOME_3G_2) INCOME_3G_2" +//      --3g实际发生
			",sum(T1.INCOME_3G_3) INCOME_3G_3" +//      --3g尚可使用金额
			//",sum(T1.INCOME_3G_4) INCOME_3G_4" +//      --3g预算完成率
			",CASE WHEN sum(T1.INCOME_3G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_3G_2)/sum(T1.INCOME_3G_1),2) END AS INCOME_3G_4"+
			",sum(T1.INCOME_GW_1) INCOME_GW_1" +//     --固网预算
			",sum(T1.INCOME_GW_2) INCOME_GW_2" +//      --固网实际发生
			",sum(T1.INCOME_GW_3) INCOME_GW_3" +//      --固网尚可使用金额
			//",sum(T1.INCOME_GW_4) INCOME_GW_4" +//      --固网预算完成率
			",CASE WHEN sum(T1.INCOME_GW_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_GW_2)/sum(T1.INCOME_GW_1),2) END AS INCOME_GW_4"+
			",sum(T1.COMM_AMOUNT_1) COMM_AMOUNT_1" +//     --佣金预算
			",sum(T1.COMM_AMOUNT_2) COMM_AMOUNT_2" +//      --佣金实际发生
			",sum(T1.COMM_AMOUNT_3) COMM_AMOUNT_3" +//      --佣金尚可使用金额
			//",sum(T1.COMM_AMOUNT_4) COMM_AMOUNT_4" +//      --佣金预算完成率
			",CASE WHEN sum(T1.COMM_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.COMM_AMOUNT_2)/sum(T1.COMM_AMOUNT_1),2) END AS COMM_AMOUNT_4"+
			",sum(T1.QDBT_AMOUNT_1) QDBT_AMOUNT_1" +//     --渠道补贴预算
			",sum(T1.QDBT_AMOUNT_2) QDBT_AMOUNT_2" +//     --渠道补贴实际费用
			",sum(T1.QDBT_AMOUNT_3) QDBT_AMOUNT_3" +//      --渠道补贴尚可使用金额
			//",sum(T1.QDBT_AMOUNT_4) QDBT_AMOUNT_4" +//      --渠道补贴预算完成率
			",CASE WHEN sum(T1.QDBT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.QDBT_AMOUNT_2)/sum(T1.QDBT_AMOUNT_1),2) END AS QDBT_AMOUNT_4"+
			",sum(T1.ADS_AMOUNT_1) ADS_AMOUNT_1" +//      --广告宣传费预算
			",sum(T1.ADS_AMOUNT_2) ADS_AMOUNT_2" +//      --广告宣传费实际费用
			",sum(T1.ADS_AMOUNT_3) ADS_AMOUNT_3" +//      --广告宣传费尚可使用金额
			//",sum(T1.ADS_AMOUNT_4) ADS_AMOUNT_4" +//      --广告宣传费预算完成率
			",CASE WHEN sum(T1.ADS_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADS_AMOUNT_2)/sum(T1.ADS_AMOUNT_1),2) END AS ADS_AMOUNT_4"+
			",sum(T1.CUS_USER_AMOUNT_1) CUS_USER_AMOUNT_1" +//      --客户维系和用户获取成本预算
			",sum(T1.CUS_USER_AMOUNT_2) CUS_USER_AMOUNT_2" +//      --客户维系和用户获取成本实际费用
			",sum(T1.CUS_USER_AMOUNT_3) CUS_USER_AMOUNT_3" +//      --客户维系和用户获取成本尚可使用金额
			//",sum(T1.CUS_USER_AMOUNT_4) CUS_USER_AMOUNT_4" +//      --客户维系和用户获取成本预算完成率
			",CASE WHEN sum(T1.CUS_USER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CUS_USER_AMOUNT_2)/sum(T1.CUS_USER_AMOUNT_1),2) END AS CUS_USER_AMOUNT_4"+
			",sum(T1.CARUSE_AMOUNT_1) CARUSE_AMOUNT_1" +//      --车辆使用费预算
			",sum(T1.CARUSE_AMOUNT_2) CARUSE_AMOUNT_2" +//      --车辆使用费实际费用
			",sum(T1.CARUSE_AMOUNT_3) CARUSE_AMOUNT_3" +//      --车辆使用费尚可使用金额
			//",sum(T1.CARUSE_AMOUNT_4) CARUSE_AMOUNT_4" +//      --车辆使用费预算完成率
			",CASE WHEN sum(T1.CARUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CARUSE_AMOUNT_2)/sum(T1.CARUSE_AMOUNT_1),2) END AS CARUSE_AMOUNT_4"+
			",sum(T1.ENTERTAIN_AMOUNT_1) ENTERTAIN_AMOUNT_1" +//      --招待费预算
			",sum(T1.ENTERTAIN_AMOUNT_2) ENTERTAIN_AMOUNT_2" +//      --招待费实际费用
			",sum(T1.ENTERTAIN_AMOUNT_3) ENTERTAIN_AMOUNT_3" +//      --招待费尚可使用金额
			//",sum(T1.ENTERTAIN_AMOUNT_4) ENTERTAIN_AMOUNT_4" +//      --招待费预算完成率
			",CASE WHEN sum(T1.ENTERTAIN_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ENTERTAIN_AMOUNT_2)/sum(T1.ENTERTAIN_AMOUNT_1),2) END AS ENTERTAIN_AMOUNT_4"+
			",sum(T1.ADMINISTRATIVE_AMOUNT_1) ADMINISTRATIVE_AMOUNT_1" +//      --办公费预算
			",sum(T1.ADMINISTRATIVE_AMOUNT_2) ADMINISTRATIVE_AMOUNT_2" +//      --办公费实际费用
			",sum(T1.ADMINISTRATIVE_AMOUNT_3) ADMINISTRATIVE_AMOUNT_3" +//      --办公费尚可使用金额
			//",sum(T1.ADMINISTRATIVE_AMOUNT_4) ADMINISTRATIVE_AMOUNT_4" +//      --办公费预算完成率
			",CASE WHEN sum(T1.ADMINISTRATIVE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADMINISTRATIVE_AMOUNT_2)/sum(T1.ADMINISTRATIVE_AMOUNT_1),2) END AS ADMINISTRATIVE_AMOUNT_4"+
			",sum(T1.TRAVEL_AMOUNT_1) TRAVEL_AMOUNT_1" +//      --旅行费预算预算
			",sum(T1.TRAVEL_AMOUNT_2) TRAVEL_AMOUNT_2" +//      --旅行费实际费用
			",sum(T1.TRAVEL_AMOUNT_3) TRAVEL_AMOUNT_3" +//      --旅行费尚可使用金额
			//",sum(T1.TRAVEL_AMOUNT_4) TRAVEL_AMOUNT_4" +//      --旅行费预算完成率
			",CASE WHEN sum(T1.TRAVEL_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.TRAVEL_AMOUNT_2)/sum(T1.TRAVEL_AMOUNT_1),2) END AS TRAVEL_AMOUNT_4"+
			",sum(T1.LETTER_AMOUNT_1) LETTER_AMOUNT_1" +//      --通信费预算
			",sum(T1.LETTER_AMOUNT_2) LETTER_AMOUNT_2" +//      --通信费实际费用
			",sum(T1.LETTER_AMOUNT_3) LETTER_AMOUNT_3" +//      --通信费尚可使用金额
			//",sum(T1.LETTER_AMOUNT_4) LETTER_AMOUNT_4" +//      --通信费预算完成率
			",CASE WHEN sum(T1.LETTER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.LETTER_AMOUNT_2)/sum(T1.LETTER_AMOUNT_1),2) END AS LETTER_AMOUNT_4"+
			",sum(T1.HOUSE_AMOUNT_1) HOUSE_AMOUNT_1" +//      --房租费预算
			",sum(T1.HOUSE_AMOUNT_2) HOUSE_AMOUNT_2" +//      --房租费实际费用
			",sum(T1.HOUSE_AMOUNT_3) HOUSE_AMOUNT_3" +//      --房租费尚可使用金额
			//",sum(T1.HOUSE_AMOUNT_4) HOUSE_AMOUNT_4" +//      --房租费预算完成率
			",CASE WHEN sum(T1.HOUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.HOUSE_AMOUNT_2)/sum(T1.HOUSE_AMOUNT_1),2) END AS HOUSE_AMOUNT_4"+
			",sum(T1.OTHER_RENT_AMOUNT_1) OTHER_RENT_AMOUNT_1" +//      --其他租赁费预算
			",sum(T1.OTHER_RENT_AMOUNT_2) OTHER_RENT_AMOUNT_2" +//      --其他租赁费实际费用
			",sum(T1.OTHER_RENT_AMOUNT_3) OTHER_RENT_AMOUNT_3" +//     --其他租赁费尚可使用金额
			//",sum(T1.OTHER_RENT_AMOUNT_4) OTHER_RENT_AMOUNT_4" +//      --其他租赁费预算完成率
			",CASE WHEN sum(T1.OTHER_RENT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_RENT_AMOUNT_2)/sum(T1.OTHER_RENT_AMOUNT_1),2) END AS OTHER_RENT_AMOUNT_4"+
			",sum(T1.WATER_AMOUNT_1) WATER_AMOUNT_1" +//      --水电费预算
			",sum(T1.WATER_AMOUNT_2) WATER_AMOUNT_2" +//      --水电费实际费用
			",sum(T1.WATER_AMOUNT_3) WATER_AMOUNT_3" +//      --水电费尚可使用金额
			//",sum(T1.WATER_AMOUNT_4) WATER_AMOUNT_4" +//      --水电费预算完成率
			",CASE WHEN sum(T1.WATER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.WATER_AMOUNT_2)/sum(T1.WATER_AMOUNT_1),2) END AS WATER_AMOUNT_4"+
			",sum(T1.PROPERTY_AMOUNT_1) PROPERTY_AMOUNT_1" +//      --物业管理费预算
			",sum(T1.PROPERTY_AMOUNT_2) PROPERTY_AMOUNT_2" +//      --物业管理费实际付费用
			",sum(T1.PROPERTY_AMOUNT_3) PROPERTY_AMOUNT_3" +//      --物业管理费尚可使用金额
			//",sum(T1.PROPERTY_AMOUNT_4) PROPERTY_AMOUNT_4" +//      --物业管理费预算完成率
			",CASE WHEN sum(T1.PROPERTY_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.PROPERTY_AMOUNT_2)/sum(T1.PROPERTY_AMOUNT_1),2) END AS PROPERTY_AMOUNT_4"+
			",sum(T1.OTHER_AMOUNT_1) OTHER_AMOUNT_1" +//      --其他预算
			",sum(T1.OTHER_AMOUNT_2) OTHER_AMOUNT_2" +//      --其他实际费用
			",sum(T1.OTHER_AMOUNT_3) OTHER_AMOUNT_3" +//      --其他尚可使用金额
			//",sum(T1.OTHER_AMOUNT_4) OTHER_AMOUNT_4" +//     --其他预算完成率
			",CASE WHEN sum(T1.OTHER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_AMOUNT_2)/sum(T1.OTHER_AMOUNT_1),2) END AS OTHER_AMOUNT_4"+
			",T1.GROUP_ID_"+_level+" groupid " +
			"FROM PMRT.TB_MRT_COST_RPT_BUDGET_WCQK T1 ";
		//var wheresql = " WHERE t1.GROUP_ID_"+area_level+"='"+query_code+"' AND t1.DEAL_DATE='"+querydate+"' ";
	    var wheresql = " WHERE t1.GROUP_ID_"+area_level+"='"+query_code+"' AND t1.DEAL_DATE between '"+querydate+"' and '"+enddate+"' ";
		var groupbySql = " GROUP BY t1.group_id_"+_level +" order by groupid";
		if(_level == 0) {
			sql = "SELECT max('云南省') as groupname," + sql + wheresql + groupbySql;
		}else if(_level == 1) {
			sql = "SELECT max(t1.group_id_"+_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else if(_level == 2) {
			sql = "SELECT max(t1.group_id_"+_level+"_name) as groupname,"+sql +wheresql + groupbySql;
		}else{
			sql = 
				"SELECT max(group_id_3_name) AS groupname," +
				 "max(CASE WHEN T1.GRID_TYPE='1' THEN '城区或县城' " +
					"WHEN T1.GRID_TYPE='2' THEN '乡镇' WHEN T1.GRID_TYPE='3' THEN '城乡混合' " +
					"WHEN T1.GRID_TYPE='4' THEN '派驻' ELSE '' END)AS GRID_TYPE," +
				"max(T1.GRID_LEVEL) GRID_LEVEL" +
				",sum(T1.INCOME_2G_1) INCOME_2G_1"+// +预算,
				",sum(T1.INCOME_2G_2) INCOME_2G_2" +//      --2g实际发生
				",sum(T1.INCOME_2G_3) INCOME_2G_3" +//      --2g尚可使用金额
				//",sum(T1.INCOME_2G_4) INCOME_2G_4" +//      --2g预算完成率" +
				",CASE WHEN sum(T1.INCOME_2G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_2G_2)/sum(T1.INCOME_2G_1),2) END AS INCOME_2G_4"+
				",sum(T1.INCOME_3G_1) INCOME_3G_1" +//      --3g预算
				",sum(T1.INCOME_3G_2) INCOME_3G_2" +//      --3g实际发生
				",sum(T1.INCOME_3G_3) INCOME_3G_3" +//      --3g尚可使用金额
				//",sum(T1.INCOME_3G_4) INCOME_3G_4" +//      --3g预算完成率
				",CASE WHEN sum(T1.INCOME_3G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_3G_2)/sum(T1.INCOME_3G_1),2) END AS INCOME_3G_4"+
				",sum(T1.INCOME_GW_1) INCOME_GW_1" +//     --固网预算
				",sum(T1.INCOME_GW_2) INCOME_GW_2" +//      --固网实际发生
				",sum(T1.INCOME_GW_3) INCOME_GW_3" +//      --固网尚可使用金额
				//",sum(T1.INCOME_GW_4) INCOME_GW_4" +//      --固网预算完成率
				",CASE WHEN sum(T1.INCOME_GW_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_GW_2)/sum(T1.INCOME_GW_1),2) END AS INCOME_GW_4"+
				",sum(T1.COMM_AMOUNT_1) COMM_AMOUNT_1" +//     --佣金预算
				",sum(T1.COMM_AMOUNT_2) COMM_AMOUNT_2" +//      --佣金实际发生
				",sum(T1.COMM_AMOUNT_3) COMM_AMOUNT_3" +//      --佣金尚可使用金额
				//",sum(T1.COMM_AMOUNT_4) COMM_AMOUNT_4" +//      --佣金预算完成率
				",CASE WHEN sum(T1.COMM_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.COMM_AMOUNT_2)/sum(T1.COMM_AMOUNT_1),2) END AS COMM_AMOUNT_4"+
				",sum(T1.QDBT_AMOUNT_1) QDBT_AMOUNT_1" +//     --渠道补贴预算
				",sum(T1.QDBT_AMOUNT_2) QDBT_AMOUNT_2" +//     --渠道补贴实际费用
				",sum(T1.QDBT_AMOUNT_3) QDBT_AMOUNT_3" +//      --渠道补贴尚可使用金额
				//",sum(T1.QDBT_AMOUNT_4) QDBT_AMOUNT_4" +//      --渠道补贴预算完成率
				",CASE WHEN sum(T1.QDBT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.QDBT_AMOUNT_2)/sum(T1.QDBT_AMOUNT_1),2) END AS QDBT_AMOUNT_4"+
				",sum(T1.ADS_AMOUNT_1) ADS_AMOUNT_1" +//      --广告宣传费预算
				",sum(T1.ADS_AMOUNT_2) ADS_AMOUNT_2" +//      --广告宣传费实际费用
				",sum(T1.ADS_AMOUNT_3) ADS_AMOUNT_3" +//      --广告宣传费尚可使用金额
				//",sum(T1.ADS_AMOUNT_4) ADS_AMOUNT_4" +//      --广告宣传费预算完成率
				",CASE WHEN sum(T1.ADS_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADS_AMOUNT_2)/sum(T1.ADS_AMOUNT_1),2) END AS ADS_AMOUNT_4"+
				",sum(T1.CUS_USER_AMOUNT_1) CUS_USER_AMOUNT_1" +//      --客户维系和用户获取成本预算
				",sum(T1.CUS_USER_AMOUNT_2) CUS_USER_AMOUNT_2" +//      --客户维系和用户获取成本实际费用
				",sum(T1.CUS_USER_AMOUNT_3) CUS_USER_AMOUNT_3" +//      --客户维系和用户获取成本尚可使用金额
				//",sum(T1.CUS_USER_AMOUNT_4) CUS_USER_AMOUNT_4" +//      --客户维系和用户获取成本预算完成率
				",CASE WHEN sum(T1.CUS_USER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CUS_USER_AMOUNT_2)/sum(T1.CUS_USER_AMOUNT_1),2) END AS CUS_USER_AMOUNT_4"+
				",sum(T1.CARUSE_AMOUNT_1) CARUSE_AMOUNT_1" +//      --车辆使用费预算
				",sum(T1.CARUSE_AMOUNT_2) CARUSE_AMOUNT_2" +//      --车辆使用费实际费用
				",sum(T1.CARUSE_AMOUNT_3) CARUSE_AMOUNT_3" +//      --车辆使用费尚可使用金额
				//",sum(T1.CARUSE_AMOUNT_4) CARUSE_AMOUNT_4" +//      --车辆使用费预算完成率
				",CASE WHEN sum(T1.CARUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CARUSE_AMOUNT_2)/sum(T1.CARUSE_AMOUNT_1),2) END AS CARUSE_AMOUNT_4"+
				",sum(T1.ENTERTAIN_AMOUNT_1) ENTERTAIN_AMOUNT_1" +//      --招待费预算
				",sum(T1.ENTERTAIN_AMOUNT_2) ENTERTAIN_AMOUNT_2" +//      --招待费实际费用
				",sum(T1.ENTERTAIN_AMOUNT_3) ENTERTAIN_AMOUNT_3" +//      --招待费尚可使用金额
				//",sum(T1.ENTERTAIN_AMOUNT_4) ENTERTAIN_AMOUNT_4" +//      --招待费预算完成率
				",CASE WHEN sum(T1.ENTERTAIN_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ENTERTAIN_AMOUNT_2)/sum(T1.ENTERTAIN_AMOUNT_1),2) END AS ENTERTAIN_AMOUNT_4"+
				",sum(T1.ADMINISTRATIVE_AMOUNT_1) ADMINISTRATIVE_AMOUNT_1" +//      --办公费预算
				",sum(T1.ADMINISTRATIVE_AMOUNT_2) ADMINISTRATIVE_AMOUNT_2" +//      --办公费实际费用
				",sum(T1.ADMINISTRATIVE_AMOUNT_3) ADMINISTRATIVE_AMOUNT_3" +//      --办公费尚可使用金额
				//",sum(T1.ADMINISTRATIVE_AMOUNT_4) ADMINISTRATIVE_AMOUNT_4" +//      --办公费预算完成率
				",CASE WHEN sum(T1.ADMINISTRATIVE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADMINISTRATIVE_AMOUNT_2)/sum(T1.ADMINISTRATIVE_AMOUNT_1),2) END AS ADMINISTRATIVE_AMOUNT_4"+
				",sum(T1.TRAVEL_AMOUNT_1) TRAVEL_AMOUNT_1" +//      --旅行费预算预算
				",sum(T1.TRAVEL_AMOUNT_2) TRAVEL_AMOUNT_2" +//      --旅行费实际费用
				",sum(T1.TRAVEL_AMOUNT_3) TRAVEL_AMOUNT_3" +//      --旅行费尚可使用金额
				//",sum(T1.TRAVEL_AMOUNT_4) TRAVEL_AMOUNT_4" +//      --旅行费预算完成率
				",CASE WHEN sum(T1.TRAVEL_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.TRAVEL_AMOUNT_2)/sum(T1.TRAVEL_AMOUNT_1),2) END AS TRAVEL_AMOUNT_4"+
				",sum(T1.LETTER_AMOUNT_1) LETTER_AMOUNT_1" +//      --通信费预算
				",sum(T1.LETTER_AMOUNT_2) LETTER_AMOUNT_2" +//      --通信费实际费用
				",sum(T1.LETTER_AMOUNT_3) LETTER_AMOUNT_3" +//      --通信费尚可使用金额
				//",sum(T1.LETTER_AMOUNT_4) LETTER_AMOUNT_4" +//      --通信费预算完成率
				",CASE WHEN sum(T1.LETTER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.LETTER_AMOUNT_2)/sum(T1.LETTER_AMOUNT_1),2) END AS LETTER_AMOUNT_4"+
				",sum(T1.HOUSE_AMOUNT_1) HOUSE_AMOUNT_1" +//      --房租费预算
				",sum(T1.HOUSE_AMOUNT_2) HOUSE_AMOUNT_2" +//      --房租费实际费用
				",sum(T1.HOUSE_AMOUNT_3) HOUSE_AMOUNT_3" +//      --房租费尚可使用金额
				//",sum(T1.HOUSE_AMOUNT_4) HOUSE_AMOUNT_4" +//      --房租费预算完成率
				",CASE WHEN sum(T1.HOUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.HOUSE_AMOUNT_2)/sum(T1.HOUSE_AMOUNT_1),2) END AS HOUSE_AMOUNT_4"+
				",sum(T1.OTHER_RENT_AMOUNT_1) OTHER_RENT_AMOUNT_1" +//      --其他租赁费预算
				",sum(T1.OTHER_RENT_AMOUNT_2) OTHER_RENT_AMOUNT_2" +//      --其他租赁费实际费用
				",sum(T1.OTHER_RENT_AMOUNT_3) OTHER_RENT_AMOUNT_3" +//     --其他租赁费尚可使用金额
				//",sum(T1.OTHER_RENT_AMOUNT_4) OTHER_RENT_AMOUNT_4" +//      --其他租赁费预算完成率
				",CASE WHEN sum(T1.OTHER_RENT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_RENT_AMOUNT_2)/sum(T1.OTHER_RENT_AMOUNT_1),2) END AS OTHER_RENT_AMOUNT_4"+
				",sum(T1.WATER_AMOUNT_1) WATER_AMOUNT_1" +//      --水电费预算
				",sum(T1.WATER_AMOUNT_2) WATER_AMOUNT_2" +//      --水电费实际费用
				",sum(T1.WATER_AMOUNT_3) WATER_AMOUNT_3" +//      --水电费尚可使用金额
				//",sum(T1.WATER_AMOUNT_4) WATER_AMOUNT_4" +//      --水电费预算完成率
				",CASE WHEN sum(T1.WATER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.WATER_AMOUNT_2)/sum(T1.WATER_AMOUNT_1),2) END AS WATER_AMOUNT_4"+
				",sum(T1.PROPERTY_AMOUNT_1) PROPERTY_AMOUNT_1" +//      --物业管理费预算
				",sum(T1.PROPERTY_AMOUNT_2) PROPERTY_AMOUNT_2" +//      --物业管理费实际付费用
				",sum(T1.PROPERTY_AMOUNT_3) PROPERTY_AMOUNT_3" +//      --物业管理费尚可使用金额
				//",sum(T1.PROPERTY_AMOUNT_4) PROPERTY_AMOUNT_4" +//      --物业管理费预算完成率
				",CASE WHEN sum(T1.PROPERTY_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.PROPERTY_AMOUNT_2)/sum(T1.PROPERTY_AMOUNT_1),2) END AS PROPERTY_AMOUNT_4"+
				",sum(T1.OTHER_AMOUNT_1) OTHER_AMOUNT_1" +//      --其他预算
				",sum(T1.OTHER_AMOUNT_2) OTHER_AMOUNT_2" +//      --其他实际费用
				",sum(T1.OTHER_AMOUNT_3) OTHER_AMOUNT_3" +//      --其他尚可使用金额
				//",sum(T1.OTHER_AMOUNT_4) OTHER_AMOUNT_4" +//     --其他预算完成率
				",CASE WHEN sum(T1.OTHER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_AMOUNT_2)/sum(T1.OTHER_AMOUNT_1),2) END AS OTHER_AMOUNT_4"+
				",T1.GROUP_ID_"+_level+" groupid " +
				"FROM PMRT.TB_MRT_COST_RPT_BUDGET_WCQK T1 " + wheresql + groupbySql;
		}
		$.ajax({
	        type:"POST",
	        dataType:'json',
	        cache:false,
	        url:path+"/public!queryList.action",
		    data:{
				sql:sql
			},
	        error:function(){
	        	alert("网络延迟");
	        },
	        success:function(data){
	        	showArea(data,_level,_this);
	        }
		});
	    	
	   
	}
}


function showArea(data, next_level, oElement){
	var area_id = oElement.parent().attr("id");
	var area_code = area_id.substring(11);
	var _tr = oElement.parent().parent().parent();
	var rowNum = data.length;
	var name;
	var code;
	var marg = 0;
	var trStr = "";
	var open=0;
	for(var i=0; i<rowNum; i++){
		name = data[i]["groupname"];
	    code = data[i]["groupid"];
	    marg = 16 * (next_level) + 15;
	    if(isNotBlank(code)){
	    	open=1;
	    }
       trStr += "<tr>";
       //营销架构列
       if(next_level>=3 || (group_level==3 && next_level==3)){
           trStr += "<td style='text-align:left;'><span class='root' style='margin-left:"+marg+"px; width:300px;' id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='root' onclick=showSub(this);>"+name+"</a></span></td>";
       }else{
    	   trStr += "<td style='text-align:left;white-space:nowrap;width:300px;'><span class='sub_on' style='margin-left:"+marg+"px;'  id='showArea_"+next_level+"_"+area_code+"_"+code+"' hasChildren='false' value='"+name+"' title='"+name+"'><a href='javascript:void(0)' class='sub_on' onclick=showSub(this);>"+name+"</a></span></td>";
       }

       for(var j=0;j<tablecode.length;j++){
			var tmp = data[i][tablecode[j]];
			if(tmp!=null){
				if(tablecode[j] == 'grid_type') {
					tmp = data[i][tablecode[j]];
				}else {
					tmp = numberFormat(data[i][tablecode[j]]);
				}
			}else{
				tmp = "—";
			}
			//trStr = addEle(trStr,tablecode[j],code,next_level,$("#searchTime").val(),name,tmp);
			trStr += "<td style='text-align: center;'>"+tmp+"</td>";
		}
       trStr += "</tr>";
        //"<td><a href='javascript:void(0)' path='jsp/comm/sub_commissiondetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"明细' >明细</a> | "
       /*trStr += "<td style='text-align:center'><a href='javascript:void(0)' path='jsp/comm/sub_commission2Gdetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"2G用户明细' >2G用户明细</a> | "
       		   +"<a href='javascript:void(0)' path='jsp/comm/sub_commission3Gdetail.jsp?query_groupid="+code+"&query_level="+next_level+"&searchTime="+$("#searchTime").val()+"' onclick='uit.tabs.add(this);return false;' code='"+name+"3G用户明细' >3G用户明细</a></td>";*/
   }
	if(open==1){
		_tr.after(trStr);
	}else{
		 click_flag = 0;
	     $("#"+area_id).find("a").attr("class","root");
//		       alert("对不起，没有下一级可供钻取！");
	     return;
	}
   $("tbody tr").removeClass("spec");
   $("tbody tr:visible:even").addClass("spec");
   $("#"+area_id).attr("hasChildren","true");
   $("#"+area_id).find("a").attr("class","sub");
   $("#"+area_id).removeClass("sub_on");//移除+样式
   $("#"+area_id).attr("class","sub");//改成-样式
   click_flag = 0;
}


function searchClick() {
    querydate = $("#searchTime").val();
    enddate = $("#endTime").val();
	initTable();
}


function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}


//导出excel
function downsaction(){	
	 var context=[];
	 var tbody=$("#tableIcon").children();
	 var t;
	 $.each(tbody,function(i){
		var text=[];
		var tr=$(this).children();
		$.each(tr,function(j){
			text.push($(this).html().replace( /(\&nbsp;)|(<[^>]+>)/ig, ''));
		});
		context.push(text);
	 });
	 showtext="result";
	 _loadExcel({
			startRow:3,
			startCol:0,
			cols:-1,
			excelModal:'cost_rpt_budget_wcqk.xls',
			sheetname:showtext,
			excelData:context
		},null,'下载数据');
	 
}

function _loadAllExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}

//导出全部
function downsAll() {
	var qdate = $.trim($("#searchTime").val());
	var endqdate = $.trim($("#endTime").val());
	
	var sql = 
		"SELECT max(T1.group_id_1_name) group_id_1_name,max(T1.group_id_2_name) as group_id_2_name,max(T1.group_id_3_name) group_id_3_name," +
		 "max(CASE WHEN T1.GRID_TYPE='1' THEN '城区或县城' " +
			"WHEN T1.GRID_TYPE='2' THEN '乡镇' WHEN T1.GRID_TYPE='3' THEN '城乡混合' " +
			"WHEN T1.GRID_TYPE='4' THEN '派驻' ELSE '' END)AS GRID_TYPE," +
		"max(T1.GRID_LEVEL) GRID_LEVEL" +
		",sum(T1.INCOME_2G_1) INCOME_2G_1"+// +预算,
		",sum(T1.INCOME_2G_2) INCOME_2G_2" +//      --2g实际发生
		",sum(T1.INCOME_2G_3) INCOME_2G_3" +//      --2g尚可使用金额
		//",sum(T1.INCOME_2G_4) INCOME_2G_4" +//      --2g预算完成率" +
		",CASE WHEN sum(T1.INCOME_2G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_2G_2)/sum(T1.INCOME_2G_1),2) END AS INCOME_2G_4"+
		",sum(T1.INCOME_3G_1) INCOME_3G_1" +//      --3g预算
		",sum(T1.INCOME_3G_2) INCOME_3G_2" +//      --3g实际发生
		",sum(T1.INCOME_3G_3) INCOME_3G_3" +//      --3g尚可使用金额
		//",sum(T1.INCOME_3G_4) INCOME_3G_4" +//      --3g预算完成率
		",CASE WHEN sum(T1.INCOME_3G_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_3G_2)/sum(T1.INCOME_3G_1),2) END AS INCOME_3G_4"+
		",sum(T1.INCOME_GW_1) INCOME_GW_1" +//     --固网预算
		",sum(T1.INCOME_GW_2) INCOME_GW_2" +//      --固网实际发生
		",sum(T1.INCOME_GW_3) INCOME_GW_3" +//      --固网尚可使用金额
		//",sum(T1.INCOME_GW_4) INCOME_GW_4" +//      --固网预算完成率
		",CASE WHEN sum(T1.INCOME_GW_1) = 0 THEN 0 ELSE round(sum(T1.INCOME_GW_2)/sum(T1.INCOME_GW_1),2) END AS INCOME_GW_4"+
		",sum(T1.COMM_AMOUNT_1) COMM_AMOUNT_1" +//     --佣金预算
		",sum(T1.COMM_AMOUNT_2) COMM_AMOUNT_2" +//      --佣金实际发生
		",sum(T1.COMM_AMOUNT_3) COMM_AMOUNT_3" +//      --佣金尚可使用金额
		//",sum(T1.COMM_AMOUNT_4) COMM_AMOUNT_4" +//      --佣金预算完成率
		",CASE WHEN sum(T1.COMM_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.COMM_AMOUNT_2)/sum(T1.COMM_AMOUNT_1),2) END AS COMM_AMOUNT_4"+
		",sum(T1.QDBT_AMOUNT_1) QDBT_AMOUNT_1" +//     --渠道补贴预算
		",sum(T1.QDBT_AMOUNT_2) QDBT_AMOUNT_2" +//     --渠道补贴实际费用
		",sum(T1.QDBT_AMOUNT_3) QDBT_AMOUNT_3" +//      --渠道补贴尚可使用金额
		//",sum(T1.QDBT_AMOUNT_4) QDBT_AMOUNT_4" +//      --渠道补贴预算完成率
		",CASE WHEN sum(T1.QDBT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.QDBT_AMOUNT_2)/sum(T1.QDBT_AMOUNT_1),2) END AS QDBT_AMOUNT_4"+
		",sum(T1.ADS_AMOUNT_1) ADS_AMOUNT_1" +//      --广告宣传费预算
		",sum(T1.ADS_AMOUNT_2) ADS_AMOUNT_2" +//      --广告宣传费实际费用
		",sum(T1.ADS_AMOUNT_3) ADS_AMOUNT_3" +//      --广告宣传费尚可使用金额
		//",sum(T1.ADS_AMOUNT_4) ADS_AMOUNT_4" +//      --广告宣传费预算完成率
		",CASE WHEN sum(T1.ADS_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADS_AMOUNT_2)/sum(T1.ADS_AMOUNT_1),2) END AS ADS_AMOUNT_4"+
		",sum(T1.CUS_USER_AMOUNT_1) CUS_USER_AMOUNT_1" +//      --客户维系和用户获取成本预算
		",sum(T1.CUS_USER_AMOUNT_2) CUS_USER_AMOUNT_2" +//      --客户维系和用户获取成本实际费用
		",sum(T1.CUS_USER_AMOUNT_3) CUS_USER_AMOUNT_3" +//      --客户维系和用户获取成本尚可使用金额
		//",sum(T1.CUS_USER_AMOUNT_4) CUS_USER_AMOUNT_4" +//      --客户维系和用户获取成本预算完成率
		",CASE WHEN sum(T1.CUS_USER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CUS_USER_AMOUNT_2)/sum(T1.CUS_USER_AMOUNT_1),2) END AS CUS_USER_AMOUNT_4"+
		",sum(T1.CARUSE_AMOUNT_1) CARUSE_AMOUNT_1" +//      --车辆使用费预算
		",sum(T1.CARUSE_AMOUNT_2) CARUSE_AMOUNT_2" +//      --车辆使用费实际费用
		",sum(T1.CARUSE_AMOUNT_3) CARUSE_AMOUNT_3" +//      --车辆使用费尚可使用金额
		//",sum(T1.CARUSE_AMOUNT_4) CARUSE_AMOUNT_4" +//      --车辆使用费预算完成率
		",CASE WHEN sum(T1.CARUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.CARUSE_AMOUNT_2)/sum(T1.CARUSE_AMOUNT_1),2) END AS CARUSE_AMOUNT_4"+
		",sum(T1.ENTERTAIN_AMOUNT_1) ENTERTAIN_AMOUNT_1" +//      --招待费预算
		",sum(T1.ENTERTAIN_AMOUNT_2) ENTERTAIN_AMOUNT_2" +//      --招待费实际费用
		",sum(T1.ENTERTAIN_AMOUNT_3) ENTERTAIN_AMOUNT_3" +//      --招待费尚可使用金额
		//",sum(T1.ENTERTAIN_AMOUNT_4) ENTERTAIN_AMOUNT_4" +//      --招待费预算完成率
		",CASE WHEN sum(T1.ENTERTAIN_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ENTERTAIN_AMOUNT_2)/sum(T1.ENTERTAIN_AMOUNT_1),2) END AS ENTERTAIN_AMOUNT_4"+
		",sum(T1.ADMINISTRATIVE_AMOUNT_1) ADMINISTRATIVE_AMOUNT_1" +//      --办公费预算
		",sum(T1.ADMINISTRATIVE_AMOUNT_2) ADMINISTRATIVE_AMOUNT_2" +//      --办公费实际费用
		",sum(T1.ADMINISTRATIVE_AMOUNT_3) ADMINISTRATIVE_AMOUNT_3" +//      --办公费尚可使用金额
		//",sum(T1.ADMINISTRATIVE_AMOUNT_4) ADMINISTRATIVE_AMOUNT_4" +//      --办公费预算完成率
		",CASE WHEN sum(T1.ADMINISTRATIVE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.ADMINISTRATIVE_AMOUNT_2)/sum(T1.ADMINISTRATIVE_AMOUNT_1),2) END AS ADMINISTRATIVE_AMOUNT_4"+
		",sum(T1.TRAVEL_AMOUNT_1) TRAVEL_AMOUNT_1" +//      --旅行费预算预算
		",sum(T1.TRAVEL_AMOUNT_2) TRAVEL_AMOUNT_2" +//      --旅行费实际费用
		",sum(T1.TRAVEL_AMOUNT_3) TRAVEL_AMOUNT_3" +//      --旅行费尚可使用金额
		//",sum(T1.TRAVEL_AMOUNT_4) TRAVEL_AMOUNT_4" +//      --旅行费预算完成率
		",CASE WHEN sum(T1.TRAVEL_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.TRAVEL_AMOUNT_2)/sum(T1.TRAVEL_AMOUNT_1),2) END AS TRAVEL_AMOUNT_4"+
		",sum(T1.LETTER_AMOUNT_1) LETTER_AMOUNT_1" +//      --通信费预算
		",sum(T1.LETTER_AMOUNT_2) LETTER_AMOUNT_2" +//      --通信费实际费用
		",sum(T1.LETTER_AMOUNT_3) LETTER_AMOUNT_3" +//      --通信费尚可使用金额
		//",sum(T1.LETTER_AMOUNT_4) LETTER_AMOUNT_4" +//      --通信费预算完成率
		",CASE WHEN sum(T1.LETTER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.LETTER_AMOUNT_2)/sum(T1.LETTER_AMOUNT_1),2) END AS LETTER_AMOUNT_4"+
		",sum(T1.HOUSE_AMOUNT_1) HOUSE_AMOUNT_1" +//      --房租费预算
		",sum(T1.HOUSE_AMOUNT_2) HOUSE_AMOUNT_2" +//      --房租费实际费用
		",sum(T1.HOUSE_AMOUNT_3) HOUSE_AMOUNT_3" +//      --房租费尚可使用金额
		//",sum(T1.HOUSE_AMOUNT_4) HOUSE_AMOUNT_4" +//      --房租费预算完成率
		",CASE WHEN sum(T1.HOUSE_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.HOUSE_AMOUNT_2)/sum(T1.HOUSE_AMOUNT_1),2) END AS HOUSE_AMOUNT_4"+
		",sum(T1.OTHER_RENT_AMOUNT_1) OTHER_RENT_AMOUNT_1" +//      --其他租赁费预算
		",sum(T1.OTHER_RENT_AMOUNT_2) OTHER_RENT_AMOUNT_2" +//      --其他租赁费实际费用
		",sum(T1.OTHER_RENT_AMOUNT_3) OTHER_RENT_AMOUNT_3" +//     --其他租赁费尚可使用金额
		//",sum(T1.OTHER_RENT_AMOUNT_4) OTHER_RENT_AMOUNT_4" +//      --其他租赁费预算完成率
		",CASE WHEN sum(T1.OTHER_RENT_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_RENT_AMOUNT_2)/sum(T1.OTHER_RENT_AMOUNT_1),2) END AS OTHER_RENT_AMOUNT_4"+
		",sum(T1.WATER_AMOUNT_1) WATER_AMOUNT_1" +//      --水电费预算
		",sum(T1.WATER_AMOUNT_2) WATER_AMOUNT_2" +//      --水电费实际费用
		",sum(T1.WATER_AMOUNT_3) WATER_AMOUNT_3" +//      --水电费尚可使用金额
		//",sum(T1.WATER_AMOUNT_4) WATER_AMOUNT_4" +//      --水电费预算完成率
		",CASE WHEN sum(T1.WATER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.WATER_AMOUNT_2)/sum(T1.WATER_AMOUNT_1),2) END AS WATER_AMOUNT_4"+
		",sum(T1.PROPERTY_AMOUNT_1) PROPERTY_AMOUNT_1" +//      --物业管理费预算
		",sum(T1.PROPERTY_AMOUNT_2) PROPERTY_AMOUNT_2" +//      --物业管理费实际付费用
		",sum(T1.PROPERTY_AMOUNT_3) PROPERTY_AMOUNT_3" +//      --物业管理费尚可使用金额
		//",sum(T1.PROPERTY_AMOUNT_4) PROPERTY_AMOUNT_4" +//      --物业管理费预算完成率
		",CASE WHEN sum(T1.PROPERTY_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.PROPERTY_AMOUNT_2)/sum(T1.PROPERTY_AMOUNT_1),2) END AS PROPERTY_AMOUNT_4"+
		",sum(T1.OTHER_AMOUNT_1) OTHER_AMOUNT_1" +//      --其他预算
		",sum(T1.OTHER_AMOUNT_2) OTHER_AMOUNT_2" +//      --其他实际费用
		",sum(T1.OTHER_AMOUNT_3) OTHER_AMOUNT_3" +//      --其他尚可使用金额
		//",sum(T1.OTHER_AMOUNT_4) OTHER_AMOUNT_4" +//     --其他预算完成率
		",CASE WHEN sum(T1.OTHER_AMOUNT_1) = 0 THEN 0 ELSE round(sum(T1.OTHER_AMOUNT_2)/sum(T1.OTHER_AMOUNT_1),2) END AS OTHER_AMOUNT_4 "+
		"FROM PMRT.TB_MRT_COST_RPT_BUDGET_WCQK T1 " +
		"WHERE T1.GROUP_ID_"+group_level+" = '"+group_id+"' AND T1.DEAL_DATE between '"+qdate+"' and '"+endqdate+"' " +
		"group by T1.group_id_1,T1.group_id_2,T1.group_id_3 " +
		"order by group_id_1,group_id_2,group_id_3 " ;
	
	showtext="result";
	 _loadAllExcel({
			startRow:3,
			startCol:0,
			cols:-1,
			excelModal:'cost_rpt_budget_wcqk_all.xls',
			sheetname:showtext,
			query:sql
		},null,'预算完成情况');
}


//格式化数值，每三位加逗号
function numberFormat(num){
    var head="";
	var end="";
	var total = String(num);
	total=total.replace(/(^\s*)|(\s*$)/g, "");
	if(total.charAt(total.length-1)=='%'){
		end="%";
		total=total.substr(0,total.length-1);
	}
	if(total.charAt(0)=='-'){
		head="-";
		total=total.substr(1);
	}
	 
	var arr_total = total.split('.');
	var len   = arr_total.length;
	 
	var b = String(arr_total[0]);
	var c = b.length;
	var gap = c%3;
	var step = parseInt(c/3);
	var outStr = b.substring(0,gap);
	for(var i=0; i<step; i++){
	   var showSep = ( i==0 && gap==0 )? '' : ',' ;
	   outStr += showSep+b.substring(gap,(gap+3));
	   gap+=3;
	}
	if( len>1 ){
	   outStr = outStr+'.'+arr_total[1]; 
	}
    return head+outStr+end;
}

function isNotBlank(obj){
    return !(obj == undefined || obj == null || obj =='');
}

function getPreMonth(currMonth) {
	currMonth = currMonth + "";
	var year = currMonth.substr(0,4);
	var mon = currMonth.substr(4);

	if(mon == '01') {
		year = year -1;
		mon = '12';
	}else{
		mon = mon - 1;
	}

	if((mon+"").length == 1) {
		mon = '0'+mon;
	}
	return year+mon;
}
