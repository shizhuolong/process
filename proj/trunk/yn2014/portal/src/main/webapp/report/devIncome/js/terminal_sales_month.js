var title="";
var field="";
$(function(){
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	var dealDate=$("#dealDate").val();
		//省，地市
		title=[["组织架构","经营模式","模式一","","","","","","","是否割接","模式三","","","","","",""],
		       ["","","进货量","环比","销售量","环比","库存量","环比","库存周期","","进货量","环比","销售量","环比","库存量","环比","库存周期"]
			];
		field=["OPERATE_TYPE","JH_NUM1","JH_SEQUE","SALE_NUM1","SALE_SEQUE","KC_NUM1","KC_SEQUE","KC_CYCLE","FLAG","JH_NUM3","JH_SEQUE1","SALE_NUM3","SALE_SEQUE1","KC_NUM3","KC_SEQUE1","KC_CYCLE1"];
		//营业厅
	/*	title=[["组织架构","经营模式","自有厅移动网活跃用户数","","","其中自有厅CBSS套餐活跃用户数","","","其中自有厅3G套餐活跃用户数","","","其中自有厅2G套餐活跃用户数","",""],
		       ["","","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化","本月","本月较上月增减","增减变化"]];
		field=["OPERATE_TYPE","THIS_YM_NUM","ZJ_YW_NUM","HB_YW","THIS_4G_NUM","ZJ_4G_NUM","HB_4G","THIS_3G_NUM","ZJ_3G_NUM","HB_3G","THIS_2G_NUM","ZJ_2G_NUM","HB_2G"];*/
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var flag = $("#flag").val();
			var groupBy = "";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT T.BUS_HALL_NAME AS ROW_NAME,T.HQ_CHAN_CODE AS ROW_ID,"+getNextSql()+" AND T.GROUP_ID_1= '"+code+"'";
					groupBy= "  GROUP BY T.DEAL_DATE,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,T.FLAG ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=getSumSql();
					groupBy = " GROUP BY T.DEAL_DATE,  T.GROUP_ID_1, T.GROUP_ID_1_NAME "; 
					orgLevel=2;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=getSumSql()+' AND T.GROUP_ID_1=\''+region+'\'';
					groupBy = " GROUP BY T.DEAL_DATE,  T.GROUP_ID_1, T.GROUP_ID_1_NAME "; 
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				preField+=" AND T.GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				preField+=" AND T.OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				preField += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			if(flag!=""){
				preField += " AND T.FLAG ='"+flag+"' ";
			}
			
			var sql=preField+groupBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
}

function getNextSql(){
	var dealDate = $("#dealDate").val();
	var contrastDate = getPrevMonth(dealDate);
	var sql = "        T.OPERATE_TYPE,                                                                          "+		//--运营类型
			"        SUM(NVL(T.JH_NUM1, 0)) JH_NUM1,                                                          "+		//--进货量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.JH_NUM1, 0)) <> 0 THEN                            "+		//
			"                                (SUM(NVL(T.JH_NUM1, 0)) - SUM(NVL(T1.JH_NUM1, 0))) * 100 /       "+		//
			"                                SUM(NVL(T1.JH_NUM1, 0))                                          "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) JH_SEQUE,                                                        "+		//--进货量环比
			"        SUM(NVL(T.SALE_NUM1, 0)) SALE_NUM1,                                                      "+		//--销售量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.SALE_NUM1, 0)) <> 0 THEN                          "+		//
			"                                (SUM(NVL(T.SALE_NUM1, 0)) - SUM(NVL(T1.SALE_NUM1, 0))) * 100 /   "+		//
			"                                SUM(NVL(T1.SALE_NUM1, 0))                                        "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) SALE_SEQUE,                                                      "+		//--销售量环比
			"        SUM(NVL(T.KC_NUM1, 0)) KC_NUM1 ,                                                         "+		//--库存量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.KC_NUM1, 0)) <> 0 THEN                            "+		//
			"                                (SUM(NVL(T.KC_NUM1, 0)) - SUM(NVL(T1.KC_NUM1, 0))) * 100 /       "+		//
			"                                SUM(NVL(T1.KC_NUM1, 0))                                          "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) KC_SEQUE,                                                        "+		//--库存量环比
			"        CASE                                                                                     "+		//
			"          WHEN SUM(NVL(T.SALE_NUM1, 0)) <> 0 THEN                                                "+		//
			"           ROUND(SUM(NVL(T.KC_NUM1, 0)) / (SUM(NVL(T.SALE_NUM1, 0)) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE,'YYYYMM')),'dd') * 7),                   "+		//
			"                 2)                                                                              "+		//
			"          ELSE                                                                                   "+		//
			"           0                                                                                     "+		//
			"        END KC_CYCLE,                                                                            "+		//--库存周期   
			"        CASE                                                                                     "+		//
			"          WHEN T.FLAG = 1 THEN                                                                   "+		//
			"           '是'                                                                                  "+		//
			"          ELSE                                                                                   "+		//
			"           '否'                                                                                  "+		//
			"        END AS FLAG,                                                                             "+		//--是否割接  
			"        SUM(NVL(T.JH_NUM3, 0)) JH_NUM3,                                                          "+		//--进货量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                            "+		//
			"                                (SUM(NVL(T.JH_NUM3, 0)) - SUM(NVL(T1.JH_NUM3, 0))) * 100 /       "+		//
			"                                SUM(NVL(T1.JH_NUM3, 0))                                          "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) JH_SEQUE1,                                                       "+		// -- 进货量环比
			"        SUM(NVL(T.SALE_NUM3, 0)) SALE_NUM3,                                                      "+		// --销售量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                          "+		//
			"                                (SUM(NVL(T.SALE_NUM3, 0)) - SUM(NVL(T1.SALE_NUM3, 0))) * 100 /   "+		//
			"                                SUM(NVL(T1.SALE_NUM3, 0))                                        "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) SALE_SEQUE1,                                                     "+		//--销售量环比
			"        SUM(NVL(T.KC_NUM3, 0)) KC_NUM3,                                                          "+		//--库存量
			"        PODS.GET_RADIX_POINT(CASE                                                                "+		//
			"                               WHEN SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                            "+		//
			"                                (SUM(NVL(T.KC_NUM3, 0)) - SUM(NVL(T1.KC_NUM3, 0))) * 100 /       "+		//
			"                                SUM(NVL(T1.KC_NUM3, 0))                                          "+		//
			"                               ELSE                                                              "+		//
			"                                0                                                                "+		//
			"                             END || '%',                                                         "+		//
			"                             2) KC_SEQUE1,                                                       "+		//--库存量环比
			"        CASE                                                                                     "+		//
			"          WHEN SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                "+		//
			"           ROUND(SUM(NVL(T.KC_NUM3, 0)) / (SUM(NVL(T.SALE_NUM3, 0)) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE,'YYYYMM')),'dd') * 7), "+		//
			"                 2)                                                                              "+		//
			"          ELSE                                                                                   "+		//
			"           0                                                                                     "+		//
			"        END KC_CYCLE1                                                                            "+		//--库存周期         
			"   FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON T                                                        "+		//
			"   LEFT JOIN PMRT.TB_MRT_BUS_DEVICE_SALE_MON T1                                                  "+		//
			"     ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE AND T1.DEAL_DATE = '"+contrastDate+"')                 "+		//
			"  WHERE T.DEAL_DATE = '"+dealDate+"'                                                             ";		//
	return sql;
}

function getSumSql() {
	var dealDate = $("#dealDate").val();
	var contrastDate = getPrevMonth(dealDate);
	 var s=	 " SELECT T.GROUP_ID_1      AS ROW_ID ,                                                            	"+	//--分公司编码
			 "        T.GROUP_ID_1_NAME AS ROW_NAME,                                                            	"+	//-- 分公司名称
			 "        '-' AS OPERATE_TYPE ,                                                                      "+	//  --运营类型
			 "        SUM(NVL(T.JH_NUM1, 0)) JH_NUM1,                                                           	"+	//--进货量
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.JH_NUM1, 0)) <> 0 THEN                              "+	//
			 "                                (SUM(NVL(T.JH_NUM1, 0)) - SUM(NVL(T1.JH_NUM1, 0))) * 100 /         "+	//
			 "                                SUM(NVL(T1.JH_NUM1, 0))                                            "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) JH_SEQUE,                                                          "+	//--进货量环比,
			 "        SUM(NVL(T.SALE_NUM1, 0)) SALE_NUM1,                                                        "+	//--销售量
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.SALE_NUM1, 0)) <> 0 THEN                            "+	//
			 "                                (SUM(NVL(T.SALE_NUM1, 0)) - SUM(NVL(T1.SALE_NUM1, 0))) * 100 /     "+	//
			 "                                SUM(NVL(T1.SALE_NUM1, 0))                                          "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) SALE_SEQUE,                                                        "+	//--销售量环比,
			 "        SUM(NVL(T.KC_NUM1, 0)) KC_NUM1,                                                            "+	//-- 库存量,
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.KC_NUM1, 0)) <> 0 THEN                              "+	//
			 "                                (SUM(NVL(T.KC_NUM1, 0)) - SUM(NVL(T1.KC_NUM1, 0))) * 100 /         "+	//
			 "                                SUM(NVL(T1.KC_NUM1, 0))                                            "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) KC_SEQUE,                                                          "+	// --库存量环比
			 "        CASE                                                                                       "+	//
			 "          WHEN SUM(NVL(T.SALE_NUM1, 0)) <> 0 THEN                                                  "+	//
			 "           ROUND(SUM(NVL(T.KC_NUM1, 0)) / (SUM(NVL(T.SALE_NUM1, 0)) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE,'YYYYMM')),'dd')  * 7),                     "+	//
			 "                 2)                                                                                "+	//
			 "          ELSE                                                                                     "+	//
			 "           0                                                                                       "+	//
			 "        END KC_CYCLE,                                                                              "+	//   --库存周期 
			 "        '-' AS FLAG ,                                                                              "+	//   --是否割接
			 "        SUM(NVL(T.JH_NUM3, 0)) JH_NUM3,                                                            "+	//   --进货量,
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                              "+	//
			 "                                (SUM(NVL(T.JH_NUM3, 0)) - SUM(NVL(T1.JH_NUM3, 0))) * 100 /         "+	//
			 "                                SUM(NVL(T1.JH_NUM3, 0))                                            "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) JH_SEQUE1,                                                         "+	//     --进货量环比,
			 "        SUM(NVL(T.SALE_NUM3, 0)) SALE_NUM3,                                                        "+	//    --销售量,
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                            "+	//
			 "                                (SUM(NVL(T.SALE_NUM3, 0)) - SUM(NVL(T1.SALE_NUM3, 0))) * 100 /     "+	//
			 "                                SUM(NVL(T1.SALE_NUM3, 0))                                          "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) SALE_SEQUE1,                                                       "+	//     --销售量环比,
			 "        SUM(NVL(T.KC_NUM3, 0)) AS KC_NUM3,                                                         "+	//    -- 库存量,
			 "        PODS.GET_RADIX_POINT(CASE                                                                  "+	//
			 "                               WHEN SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                              "+	//
			 "                                (SUM(NVL(T.KC_NUM3, 0)) - SUM(NVL(T1.KC_NUM3, 0))) * 100 /         "+	//
			 "                                SUM(NVL(T1.KC_NUM3, 0))                                            "+	//
			 "                               ELSE                                                                "+	//
			 "                                0                                                                  "+	//
			 "                             END || '%',                                                           "+	//
			 "                             2) KC_SEQUE1,                                                         "+	//      --库存量环比,
			 "        CASE                                                                                       "+	//
			 "          WHEN SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                  "+	//
			 "           ROUND(SUM(NVL(T.KC_NUM3, 0)) / (SUM(NVL(T.SALE_NUM3, 0)) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE,'YYYYMM')),'dd')  * 7),                     "+	//
			 "                 2)                                                                                "+	//
			 "          ELSE                                                                                     "+	//
			 "           0                                                                                       "+	//
			 "        END AS KC_CYCLE1                                                                           "+	//      --库存周期
			 "   FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON T                                                          "+	//
			 "   LEFT JOIN PMRT.TB_MRT_BUS_DEVICE_SALE_MON T1                                                    "+	//
			 "     ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE AND T1.DEAL_DATE = '"+contrastDate+"')                   "+	//
			 "  WHERE T.DEAL_DATE = '"+dealDate+"'                                                               ";//
		return s;
}



function downsAll() {
	var orderBy=" ORDER BY T.GROUP_ID_1,T.HQ_CHAN_CODE";
	var groupBy= "  GROUP BY T.DEAL_DATE ,T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,T.FLAG ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var flag = $("#flag").val();
	var where ="";
	var preField = " SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,"+	getNextSql();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	if(flag!=""){
		where += " AND T.FLAG ='"+flag+"' ";
	}
	var sql = preField + where+groupBy+orderBy;
	var showtext = '终端进销存月报表' + dealDate;
	title=[["账期","地市名称","营业厅名称","营业厅编码","经营模式","模式一","","","","","","","是否割接","模式三","","","","","",""],
	       ["","","","","","进货量","环比","销售量","环比","库存量","环比","库存周期","","进货量","环比","销售量","环比","库存量","环比","库存周期"]
		];
	downloadExcel(sql,title,showtext);
}

/**
 * 获取账期的上一个月
 * @param dealDate
 * @returns {String}
 */
function getPrevMonth(dealDate){
	var yearStr=dealDate.substr(0,4);
	var monStr=dealDate.substr(4);
	var mon=new Date(yearStr,monStr,1,0,0,0);
	mon.setMonth(mon.getMonth()-2);
	var m=mon.getMonth()+1;
	var contrastDate=mon.getFullYear()+(m<10?"0"+m:""+m);
	return contrastDate;
}

