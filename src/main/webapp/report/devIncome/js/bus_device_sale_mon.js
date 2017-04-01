$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_DEVICE_SALE_MON"));
	var title=[["组织架构","渠道编码","经营模式自营/柜台/他营）","厅分类(旗舰/标准/小型）","模式一","","","","","","","是否割接","模式三","","","","","","","合计","","","","","","","销量同比","定去年12月","进货量定比1月","销售量定比1月","库存量定比1月","库存周期定比1月"],
	           ["","","","","进货量","环比","销售量","环比","库存量","环比","库存周期","","进货量","环比","销售量","环比","库存量","环比","库存周期","进货量","环比","销售量","环比","库存量","环比","库存周期","","","","","",""]];
    
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","JH_NUM1","JH_SEQUE","SALE_NUM1","SALE_SEQUE","KC_NUM1","KC_SEQUE","KC_CYCLE","FLAG","JH_NUM3","JH_SEQUE1","SALE_NUM3","SALE_SEQUE1","KC_NUM3","KC_SEQUE1","KC_CYCLE1","JH_NUMALL","JHALL_SEQUE","SALE_NUMALL","SALEALL_SEQUE","KC_NUMALL","KCALL_SEQUE","KCALL_CYCLE","SALEALL_TB","SALEALL_DB","JHALL_DB","SALEALL_DB1","KCALL_DB","KCALL_CYCLE_DB"];
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
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			//$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					sql=getSql(orgLevel,where);
				}else if(orgLevel==3){//点击市
					where+=" WHERE T.DEAL_DATE= "+dealDate+" AND T.GROUP_ID_1='"+code+"'";
					sql=getSql(orgLevel,where);
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					where+=" AND GROUP_ID_0=86000";
					sql=getSql(orgLevel,where);
				}else if(orgLevel==2||orgLevel==3){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
					sql=getSql(orgLevel,where);
				}else{
					return {data:[],extra:{}};
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
	var dealDate=$("#dealDate").val();
	var region=$("#region").val();
	var where=" WHERE T.DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		where += " AND T.GROUP_ID_0=86000";
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	
	var sql = getSql(3,where);
	var showtext = '自有营业厅终端进销存月报表-' + dealDate;
	var title=[["地市","厅名称","渠道编码","经营模式自营/柜台/他营）","厅分类(旗舰/标准/小型）","模式一","","","","","","","是否割接","模式三","","","","","","","合计","","","","","","","销量同比","定去年12月","进货量定比1月","销售量定比1月","库存量定比1月","库存周期定比1月"],
	      	           ["","","","","","进货量","环比","销售量","环比","库存量","环比","库存周期","","进货量","环比","销售量","环比","库存量","环比","库存周期","进货量","环比","销售量","环比","库存量","环比","库存周期","","","","","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hall_id=$.trim($("#hall_id").val());
	var dealDate=$("#dealDate").val();
	
	if(regionCode!=""){
		if(orgLevel==3){
			where+=" AND T.GROUP_ID_1='"+regionCode+"'";
		}else{
			where+=" AND GROUP_ID_1='"+regionCode+"'";
		}
	}
	if(operateType!=""){
		if(orgLevel==3){
			where+=" AND T.OPERATE_TYPE='"+operateType+"'";
		}else{
			where+=" AND OPERATE_TYPE='"+operateType+"'";
		}
		
	}
	if(hallType!=""){
		if(orgLevel==3){
			where += " AND T.CHNL_TYPE ='"+hallType+"' ";
		}else{
			where += " AND CHNL_TYPE ='"+hallType+"' ";
		}
		
	}
	if(hall_id!=""){
		if(orgLevel==3){
			where += " AND T.HQ_CHAN_CODE LIKE '%"+hall_id+"%' ";
		}else{
			where += " AND HQ_CHAN_CODE LIKE '%"+hall_id+"%' ";
		}
	}
	
	if(orgLevel==1){
		return "SELECT T.GROUP_ID_0 ROW_ID,                                                                                                                                                                                                                                                                                         "+
		"       '云南省' AS ROW_NAME,                                                                                                                                                                                                                                                                                                 "+
		"       '-' AS BUS_HALL_NAME,                                                                                                                                                                                                                                                                                               "+
		"       '-' AS HQ_CHAN_CODE,                                                                                                                                                                                                                                                                                                "+
		"       '-' AS OPERATE_TYPE,                                                                                                                                                                                                                                                                                                "+
		"       '-' AS CHNL_TYPE,                                                                                                                                                                                                                                                                                                   "+
		"       SUM(NVL(T.JH_NUM1, 0)) JH_NUM1,                                                                                                                                                                                                                                                                                     "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.JH_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                       "+
		"                               (SUM(NVL(T.JH_NUM1, 0)) - SUM(NVL(T1.JH_NUM1, 0))) * 100 /                                                                                                                                                                                                                                  "+
		"                               SUM(NVL(T1.JH_NUM1, 0))                                                                                                                                                                                                                                                                     "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) JH_SEQUE,                                                                                                                                                                                                                                                                                   "+
		"       SUM(NVL(T.SALE_NUM1, 0)) SALE_NUM1,                                                                                                                                                                                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.SALE_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                     "+
		"                               (SUM(NVL(T.SALE_NUM1, 0)) - SUM(NVL(T1.SALE_NUM1, 0))) * 100 /                                                                                                                                                                                                                              "+
		"                               SUM(NVL(T1.SALE_NUM1, 0))                                                                                                                                                                                                                                                                   "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) SALE_SEQUE,                                                                                                                                                                                                                                                                                 "+
		"       SUM(NVL(T.KC_NUM1, 0)) KC_NUM1,                                                                                                                                                                                                                                                                                     "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.KC_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                       "+
		"                               (SUM(NVL(T.KC_NUM1, 0)) - SUM(NVL(T1.KC_NUM1, 0))) * 100 /                                                                                                                                                                                                                                  "+
		"                               SUM(NVL(T1.KC_NUM1, 0))                                                                                                                                                                                                                                                                     "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) KC_SEQUE,                                                                                                                                                                                                                                                                                   "+
		"       CASE                                                                                                                                                                                                                                                                                                                "+
		"         WHEN SUM(NVL(T.SALE_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                                           "+
		"          ROUND(SUM(NVL(T.KC_NUM1, 0)) /                                                                                                                                                                                                                                                                                   "+
		"                (SUM(NVL(T.SALE_NUM1, 0)) /                                                                                                                                                                                                                                                                                "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                                                                                                                                                                                             "+
		"                2)                                                                                                                                                                                                                                                                                                         "+
		"         ELSE                                                                                                                                                                                                                                                                                                              "+
		"          0                                                                                                                                                                                                                                                                                                                "+
		"       END KC_CYCLE,                                                                                                                                                                                                                                                                                                       "+
		"       '-' AS FLAG,                                                                                                                                                                                                                                                                                                        "+
		"       SUM(NVL(T.JH_NUM3, 0)) JH_NUM3,                                                                                                                                                                                                                                                                                     "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                       "+
		"                               (SUM(NVL(T.JH_NUM3, 0)) - SUM(NVL(T1.JH_NUM3, 0))) * 100 /                                                                                                                                                                                                                                  "+
		"                               SUM(NVL(T1.JH_NUM3, 0))                                                                                                                                                                                                                                                                     "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) JH_SEQUE1,                                                                                                                                                                                                                                                                                  "+
		"       SUM(NVL(T.SALE_NUM3, 0)) SALE_NUM3,                                                                                                                                                                                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                     "+
		"                               (SUM(NVL(T.SALE_NUM3, 0)) - SUM(NVL(T1.SALE_NUM3, 0))) * 100 /                                                                                                                                                                                                                              "+
		"                               SUM(NVL(T1.SALE_NUM3, 0))                                                                                                                                                                                                                                                                   "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) SALE_SEQUE1,                                                                                                                                                                                                                                                                                "+
		"       SUM(NVL(T.KC_NUM3, 0)) AS KC_NUM3,                                                                                                                                                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                           "+
		"                              WHEN SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                       "+
		"                               (SUM(NVL(T.KC_NUM3, 0)) - SUM(NVL(T1.KC_NUM3, 0))) * 100 /                                                                                                                                                                                                                                  "+
		"                               SUM(NVL(T1.KC_NUM3, 0))                                                                                                                                                                                                                                                                     "+
		"                              ELSE                                                                                                                                                                                                                                                                                         "+
		"                               0                                                                                                                                                                                                                                                                                           "+
		"                            END || '%',                                                                                                                                                                                                                                                                                    "+
		"                            2) KC_SEQUE1,                                                                                                                                                                                                                                                                                  "+
		"       CASE                                                                                                                                                                                                                                                                                                                "+
		"         WHEN SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                                           "+
		"          ROUND(SUM(NVL(T.KC_NUM3, 0)) /                                                                                                                                                                                                                                                                                   "+
		"                (SUM(NVL(T.SALE_NUM3, 0)) /                                                                                                                                                                                                                                                                                "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                                                                                                                                                                                             "+
		"                2)                                                                                                                                                                                                                                                                                                         "+
		"         ELSE                                                                                                                                                                                                                                                                                                              "+
		"          0                                                                                                                                                                                                                                                                                                                "+
		"       END AS KC_CYCLE1,                                                                                                                                                                                                                                                                                                   "+
		"       SUM(NVL(T.JH_NUM1, 0)) + SUM(NVL(T.JH_NUM3, 0)) JH_NUMALL,                                                                                                                                                                                                                                                          "+
		"       PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.JH_NUM1, 0)) +                                                                                                                                                                                                                                                            "+
		"                            SUM(NVL(T1.JH_NUM3, 0)) <> 0                                                                                                                                                                                                                                                                   "+
		"                            THEN(SUM(NVL(T.JH_NUM1, 0)) +                                                                                                                                                                                                                                                                  "+
		"                                 SUM(NVL(T.JH_NUM3, 0)) -                                                                                                                                                                                                                                                                  "+
		"                                 （SUM(NVL(T1.JH_NUM1, 0)) +                                                                                                                                                                                                                                                               "+
		"                                 SUM(NVL(T1.JH_NUM3, 0)))) * 100 /                                                                                                                                                                                                                                                         "+
		"       （SUM(NVL(T1.JH_NUM1, 0)) + SUM(NVL(T1.JH_NUM3, 0))) ELSE 0 END || '%', 2) JHALL_SEQUE                                                                                                                                                                                                                               "+
		"       , SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) SALE_NUMALL                                                                                                                                                                                                                                                   "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_SEQUE "+
		"       , SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0)) KC_NUMALL                                                                                                                                                                                                                                                         "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN(SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0)) - (SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0)))) * 100 / (SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0))) ELSE 0 END || '%', 2) KCALL_SEQUE                   "+
		"       , CASE WHEN SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN ROUND((SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0))) / ((SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0))) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7), 2) ELSE 0 END KCALL_CYCLE                                "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_TB    "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_DB    "+
		"       , '-' AS JHALL_DB, '-' AS SALEALL_DB1, '-' AS KCALL_DB, '-' AS KCALL_CYCLE_DB                                                                                                                                                                                                                                       "+
		"  FROM（SELECT GROUP_ID_0,DEAL_DATE                                                                                                                                                                                                                                                                                         "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                 "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                  "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                         "+
		"              WHERE DEAL_DATE = "+dealDate+"                                                                                                                                                                                                                                                                               "+
		    where+
		"              GROUP BY GROUP_ID_0 ,DEAL_DATE                                                                                                                                                                                                                                                                               "+
		"  ）T                                                                                                                                                                                                                                                                                                                       "+
		"  LEFT JOIN （SELECT GROUP_ID_0                                                                                                                                                                                                                                                                                            "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                 "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                  "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                         "+
		"              WHERE DEAL_DATE = "+getLastMonth(dealDate)+"                                                                                                                                                                                                                                                                 "+
		    where+
		"              GROUP BY GROUP_ID_0                                                                                                                                                                                                                                                                                          "+
		"  ）T1                                                                                                                                                                                                                                                                                                                     "+
		"    ON (T.GROUP_ID_0 = T1.GROUP_ID_0)                                                                                                                                                                                                                                                                                      "+
		"  LEFT JOIN （SELECT GROUP_ID_0                                                                                                                                                                                                                                                                                            "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                 "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                  "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                         "+
		"              WHERE DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                                                                                                                                                                                                                         "+
		    where+
		"              GROUP BY GROUP_ID_0                                                                                                                                                                                                                                                                                          "+
		"  ）T2                                                                                                                                                                                                                                                                                                                     "+
		"    ON (T.GROUP_ID_0 = T2.GROUP_ID_0)                                                                                                                                                                                                                                                                                      "+
		"LEFT JOIN （SELECT GROUP_ID_0                                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                 "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                              "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                  "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                         "+
		"              WHERE DEAL_DATE = "+getLastYearEndMonth(dealDate)+"                                                                                                                                                                                                                                                          "+
		    where+
		"              GROUP BY GROUP_ID_0                                                                                                                                                                                                                                                                                          "+
		"  ）T3                                                                                                                                                                                                                                                                                                                     "+
		"    ON (T.GROUP_ID_0 = T3.GROUP_ID_0)                                                                                                                                                                                                                                                                                      "+
		"GROUP BY T.GROUP_ID_0                                                                                                                                                                                                                                                                                                      "+
		"        ,T.DEAL_DATE                                                                                                                                                                                                                                                                                                       ";
	}else if(orgLevel==2){
		return "SELECT T.GROUP_ID_1 ROW_ID,                                                                                                                                                                                                                                                                                                 "+
		"       T.GROUP_ID_1_NAME ROW_NAME,                                                                                                                                                                                                                                                                                          "+
		"       '-' AS BUS_HALL_NAME,                                                                                                                                                                                                                                                                                                "+
		"       '-' AS HQ_CHAN_CODE,                                                                                                                                                                                                                                                                                                 "+
		"       '-' AS OPERATE_TYPE,                                                                                                                                                                                                                                                                                                 "+
		"       '-' AS CHNL_TYPE,                                                                                                                                                                                                                                                                                                    "+
		"       SUM(NVL(T.JH_NUM1, 0)) JH_NUM1,                                                                                                                                                                                                                                                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.JH_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                        "+
		"                               (SUM(NVL(T.JH_NUM1, 0)) - SUM(NVL(T1.JH_NUM1, 0))) * 100 /                                                                                                                                                                                                                                   "+
		"                               SUM(NVL(T1.JH_NUM1, 0))                                                                                                                                                                                                                                                                      "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) JH_SEQUE,                                                                                                                                                                                                                                                                                    "+
		"       SUM(NVL(T.SALE_NUM1, 0)) SALE_NUM1,                                                                                                                                                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.SALE_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                      "+
		"                               (SUM(NVL(T.SALE_NUM1, 0)) - SUM(NVL(T1.SALE_NUM1, 0))) * 100 /                                                                                                                                                                                                                               "+
		"                               SUM(NVL(T1.SALE_NUM1, 0))                                                                                                                                                                                                                                                                    "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) SALE_SEQUE,                                                                                                                                                                                                                                                                                  "+
		"       SUM(NVL(T.KC_NUM1, 0)) KC_NUM1,                                                                                                                                                                                                                                                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.KC_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                        "+
		"                               (SUM(NVL(T.KC_NUM1, 0)) - SUM(NVL(T1.KC_NUM1, 0))) * 100 /                                                                                                                                                                                                                                   "+
		"                               SUM(NVL(T1.KC_NUM1, 0))                                                                                                                                                                                                                                                                      "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) KC_SEQUE,                                                                                                                                                                                                                                                                                    "+
		"       CASE                                                                                                                                                                                                                                                                                                                 "+
		"         WHEN SUM(NVL(T.SALE_NUM1, 0)) <> 0 THEN                                                                                                                                                                                                                                                                            "+
		"          ROUND(SUM(NVL(T.KC_NUM1, 0)) /                                                                                                                                                                                                                                                                                    "+
		"                (SUM(NVL(T.SALE_NUM1, 0)) /                                                                                                                                                                                                                                                                                 "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                                                                                                                                                                                              "+
		"                2)                                                                                                                                                                                                                                                                                                          "+
		"         ELSE                                                                                                                                                                                                                                                                                                               "+
		"          0                                                                                                                                                                                                                                                                                                                 "+
		"       END KC_CYCLE,                                                                                                                                                                                                                                                                                                        "+
		"       '-' AS FLAG,                                                                                                                                                                                                                                                                                                         "+
		"       SUM(NVL(T.JH_NUM3, 0)) JH_NUM3,                                                                                                                                                                                                                                                                                      "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                        "+
		"                               (SUM(NVL(T.JH_NUM3, 0)) - SUM(NVL(T1.JH_NUM3, 0))) * 100 /                                                                                                                                                                                                                                   "+
		"                               SUM(NVL(T1.JH_NUM3, 0))                                                                                                                                                                                                                                                                      "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) JH_SEQUE1,                                                                                                                                                                                                                                                                                   "+
		"       SUM(NVL(T.SALE_NUM3, 0)) SALE_NUM3,                                                                                                                                                                                                                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                      "+
		"                               (SUM(NVL(T.SALE_NUM3, 0)) - SUM(NVL(T1.SALE_NUM3, 0))) * 100 /                                                                                                                                                                                                                               "+
		"                               SUM(NVL(T1.SALE_NUM3, 0))                                                                                                                                                                                                                                                                    "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) SALE_SEQUE1,                                                                                                                                                                                                                                                                                 "+
		"       SUM(NVL(T.KC_NUM3, 0)) AS KC_NUM3,                                                                                                                                                                                                                                                                                   "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                                                                                                                                                                                            "+
		"                              WHEN SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                        "+
		"                               (SUM(NVL(T.KC_NUM3, 0)) - SUM(NVL(T1.KC_NUM3, 0))) * 100 /                                                                                                                                                                                                                                   "+
		"                               SUM(NVL(T1.KC_NUM3, 0))                                                                                                                                                                                                                                                                      "+
		"                              ELSE                                                                                                                                                                                                                                                                                          "+
		"                               0                                                                                                                                                                                                                                                                                            "+
		"                            END || '%',                                                                                                                                                                                                                                                                                     "+
		"                            2) KC_SEQUE1,                                                                                                                                                                                                                                                                                   "+
		"       CASE                                                                                                                                                                                                                                                                                                                 "+
		"         WHEN SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                                                                                                                                                                                                                                            "+
		"          ROUND(SUM(NVL(T.KC_NUM3, 0)) /                                                                                                                                                                                                                                                                                    "+
		"                (SUM(NVL(T.SALE_NUM3, 0)) /                                                                                                                                                                                                                                                                                 "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                                                                                                                                                                                              "+
		"                2)                                                                                                                                                                                                                                                                                                          "+
		"         ELSE                                                                                                                                                                                                                                                                                                               "+
		"          0                                                                                                                                                                                                                                                                                                                 "+
		"       END AS KC_CYCLE1,                                                                                                                                                                                                                                                                                                    "+
		"       SUM(NVL(T.JH_NUM1, 0)) + SUM(NVL(T.JH_NUM3, 0)) JH_NUMALL,                                                                                                                                                                                                                                                           "+
		"       PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.JH_NUM1, 0)) +                                                                                                                                                                                                                                                             "+
		"                            SUM(NVL(T1.JH_NUM3, 0)) <> 0                                                                                                                                                                                                                                                                    "+
		"                            THEN(SUM(NVL(T.JH_NUM1, 0)) +                                                                                                                                                                                                                                                                   "+
		"                                 SUM(NVL(T.JH_NUM3, 0)) -                                                                                                                                                                                                                                                                   "+
		"                                 （SUM(NVL(T1.JH_NUM1, 0)) +                                                                                                                                                                                                                                                                "+
		"                                 SUM(NVL(T1.JH_NUM3, 0)))) * 100 /                                                                                                                                                                                                                                                          "+
		"       （SUM(NVL(T1.JH_NUM1, 0)) + SUM(NVL(T1.JH_NUM3, 0))) ELSE 0 END || '%', 2) JHALL_SEQUE                                                                                                                                                                                                                               "+
		"       , SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) SALE_NUMALL                                                                                                                                                                                                                                                    "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T1.SALE_NUM1, 0)) + SUM(NVL(T1.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_SEQUE  "+
		"       , SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0)) KC_NUMALL                                                                                                                                                                                                                                                          "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN(SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0)) - (SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0)))) * 100 / (SUM(NVL(T1.KC_NUM1, 0)) + SUM(NVL(T1.KC_NUM3, 0))) ELSE 0 END || '%', 2) KCALL_SEQUE                    "+
		"       , CASE WHEN SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN ROUND((SUM(NVL(T.KC_NUM1, 0)) + SUM(NVL(T.KC_NUM3, 0))) / ((SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0))) / TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7), 2) ELSE 0 END KCALL_CYCLE                                 "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T2.SALE_NUM1, 0)) + SUM(NVL(T2.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_TB     "+
		"       , PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0)) <> 0 THEN(SUM(NVL(T.SALE_NUM1, 0)) + SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0)))) * 100 / (SUM(NVL(T3.SALE_NUM1, 0)) + SUM(NVL(T3.SALE_NUM3, 0))) ELSE 0 END || '%', 2) SALEALL_DB     "+
		"       , '-' AS JHALL_DB, '-' AS SALEALL_DB1, '-' AS KCALL_DB, '-' AS KCALL_CYCLE_DB                                                                                                                                                                                                                                        "+
		"  FROM（SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,DEAL_DATE                                                                                                                                                                                                                                                              "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                   "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                          "+
		"              WHERE DEAL_DATE = "+dealDate+"                                                                                                                                                                                                                                                                                "+
		    where+
		"              GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME,DEAL_DATE                                                                                                                                                                                                                                                      "+
		"  ）T                                                                                                                                                                                                                                                                                                                       "+
		"  LEFT JOIN （SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                   "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                          "+
		"              WHERE DEAL_DATE = "+getLastMonth(dealDate)+"                                                                                                                                                                                                                                                                  "+
		    where+
		"              GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                "+
		"  ）T1                                                                                                                                                                                                                                                                                                                      "+
		"    ON (T.GROUP_ID_1 = T1.GROUP_ID_1)                                                                                                                                                                                                                                                                                       "+
		"  LEFT JOIN （SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                   "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                          "+
		"              WHERE DEAL_DATE = "+getLastYearSameMonth(dealDate)+"                                                                                                                                                                                                                                                          "+
		    where+
		"              GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                "+
		"  ）T2                                                                                                                                                                                                                                                                                                                      "+
		"    ON (T.GROUP_ID_1 = T2.GROUP_ID_1)                                                                                                                                                                                                                                                                                       "+
		"LEFT JOIN （SELECT GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                    "+
		"                    ,SUM(JH_NUM1) JH_NUM1                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM1) SALE_NUM1                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM1)  KC_NUM1                                                                                                                                                                                                                                                                                  "+
		"                    ,SUM(JH_NUM3) JH_NUM3                                                                                                                                                                                                                                                                                   "+
		"                    ,SUM(SALE_NUM3) SALE_NUM3                                                                                                                                                                                                                                                                               "+
		"                    ,SUM(KC_NUM3) KC_NUM3                                                                                                                                                                                                                                                                                   "+
		"              FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON                                                                                                                                                                                                                                                                          "+
		"              WHERE DEAL_DATE = "+getLastYearEndMonth(dealDate)+"                                                                                                                                                                                                                                                           "+
		    where+
		"              GROUP BY GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME                                                                                                                                                                                                                                                                "+
		"  ）T3                                                                                                                                                                                                                                                                                                                      "+
		"    ON (T.GROUP_ID_1 = T3.GROUP_ID_1)                                                                                                                                                                                                                                                                                       "+
		"GROUP BY T.GROUP_ID_1                                                                                                                                                                                                                                                                                                       "+
		"        ,T.GROUP_ID_1_NAME                                                                                                                                                                                                                                                                                                  "+
		"        ,T.DEAL_DATE                                                                                                                                                                                                                                                                                                        ";
	}else{
		return  "SELECT T.GROUP_ID_1_NAME,                                                                                                                      "+
		"       T.BUS_HALL_NAME ROW_NAME,                                                                                                                       "+
		"       T.HQ_CHAN_CODE,                                                                                                                                 "+
		"       T.OPERATE_TYPE,                                                                                                                                 "+
		"       T.CHNL_TYPE,                                                                                                                                    "+
		"       SUM(NVL(T.JH_NUM1, 0)) JH_NUM1,                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.JH_NUM1, 0)) <> 0 THEN                                                                                   "+
		"                               (SUM(NVL(T.JH_NUM1, 0)) - SUM(NVL(T1.JH_NUM1, 0))) * 100 /                                                              "+
		"                               SUM(NVL(T1.JH_NUM1, 0))                                                                                                 "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) JH_SEQUE,                                                                                                               "+
		"       SUM(NVL(T.SALE_NUM1, 0)) SALE_NUM1,                                                                                                             "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.SALE_NUM1, 0)) <> 0 THEN                                                                                 "+
		"                               (SUM(NVL(T.SALE_NUM1, 0)) - SUM(NVL(T1.SALE_NUM1, 0))) * 100 /                                                          "+
		"                               SUM(NVL(T1.SALE_NUM1, 0))                                                                                               "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) SALE_SEQUE,                                                                                                             "+
		"       SUM(NVL(T.KC_NUM1, 0)) KC_NUM1,                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.KC_NUM1, 0)) <> 0 THEN                                                                                   "+
		"                               (SUM(NVL(T.KC_NUM1, 0)) - SUM(NVL(T1.KC_NUM1, 0))) * 100 /                                                              "+
		"                               SUM(NVL(T1.KC_NUM1, 0))                                                                                                 "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) KC_SEQUE,                                                                                                               "+
		"       CASE                                                                                                                                            "+
		"         WHEN SUM(NVL(T.SALE_NUM1, 0)) <> 0 THEN                                                                                                       "+
		"          ROUND(SUM(NVL(T.KC_NUM1, 0)) /                                                                                                               "+
		"                (SUM(NVL(T.SALE_NUM1, 0)) /                                                                                                            "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                         "+
		"                2)                                                                                                                                     "+
		"         ELSE                                                                                                                                          "+
		"          0                                                                                                                                            "+
		"       END KC_CYCLE,                                                                                                                                   "+
		"       T.FLAG,                                                                                                                                         "+
		"       SUM(NVL(T.JH_NUM3, 0)) JH_NUM3,                                                                                                                 "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                                                                                   "+
		"                               (SUM(NVL(T.JH_NUM3, 0)) - SUM(NVL(T1.JH_NUM3, 0))) * 100 /                                                              "+
		"                               SUM(NVL(T1.JH_NUM3, 0))                                                                                                 "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) JH_SEQUE1,                                                                                                              "+
		"       SUM(NVL(T.SALE_NUM3, 0)) SALE_NUM3,                                                                                                             "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                                                                                 "+
		"                               (SUM(NVL(T.SALE_NUM3, 0)) - SUM(NVL(T1.SALE_NUM3, 0))) * 100 /                                                          "+
		"                               SUM(NVL(T1.SALE_NUM3, 0))                                                                                               "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) SALE_SEQUE1,                                                                                                            "+
		"       SUM(NVL(T.KC_NUM3, 0)) AS KC_NUM3,                                                                                                              "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                                                                                   "+
		"                               (SUM(NVL(T.KC_NUM3, 0)) - SUM(NVL(T1.KC_NUM3, 0))) * 100 /                                                              "+
		"                               SUM(NVL(T1.KC_NUM3, 0))                                                                                                 "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) KC_SEQUE1,                                                                                                              "+
		"       CASE                                                                                                                                            "+
		"         WHEN SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                                                                       "+
		"          ROUND(SUM(NVL(T.KC_NUM3, 0)) /                                                                                                               "+
		"                (SUM(NVL(T.SALE_NUM3, 0)) /                                                                                                            "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                         "+
		"                2)                                                                                                                                     "+
		"         ELSE                                                                                                                                          "+
		"          0                                                                                                                                            "+
		"       END AS KC_CYCLE1,                                                                                                                               "+
		"       SUM(NVL(T.JH_NUM1, 0))+SUM(NVL(T.JH_NUM3, 0)) JH_NUMALL,                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.JH_NUM1, 0))+SUM(NVL(T1.JH_NUM3, 0)) <> 0 THEN                                                           "+
		"                               (SUM(NVL(T.JH_NUM1, 0))+SUM(NVL(T.JH_NUM3, 0)) - （SUM(NVL(T1.JH_NUM1, 0))+SUM(NVL(T1.JH_NUM3, 0)))) * 100 /            "+
		"                               （SUM(NVL(T1.JH_NUM1, 0))+SUM(NVL(T1.JH_NUM3, 0)))                                                                      "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) JHALL_SEQUE,                                                                                                            "+
		"       SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0)) SALE_NUMALL,                                                                                  "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.SALE_NUM1, 0))+SUM(NVL(T1.SALE_NUM3, 0)) <> 0 THEN                                                       "+
		"                               (SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T1.SALE_NUM1, 0))+SUM(NVL(T1.SALE_NUM3, 0)))) * 100 /     "+
		"                               (SUM(NVL(T1.SALE_NUM1, 0))+SUM(NVL(T1.SALE_NUM3, 0)))                                                                   "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) SALEALL_SEQUE,                                                                                                          "+
		"       SUM(NVL(T.KC_NUM1, 0))+SUM(NVL(T.KC_NUM3, 0)) KC_NUMALL,                                                                                        "+
		"       PODS.GET_RADIX_POINT(CASE                                                                                                                       "+
		"                              WHEN SUM(NVL(T1.KC_NUM1, 0))+SUM(NVL(T1.KC_NUM3, 0)) <> 0 THEN                                                           "+
		"                               (SUM(NVL(T.KC_NUM1, 0))+SUM(NVL(T.KC_NUM3, 0)) - (SUM(NVL(T1.KC_NUM1, 0))+SUM(NVL(T1.KC_NUM3, 0)))) * 100 /             "+
		"                               (SUM(NVL(T1.KC_NUM1, 0))+SUM(NVL(T1.KC_NUM3, 0)))                                                                       "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) KCALL_SEQUE,                                                                                                            "+
		"       CASE                                                                                                                                            "+
		"         WHEN SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0)) <> 0 THEN                                                                              "+
		"          ROUND((SUM(NVL(T.KC_NUM1, 0))+SUM(NVL(T.KC_NUM3, 0))) /                                                                                      "+
		"                ((SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0))) /                                                                                 "+
		"                 TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                                         "+
		"                2)                                                                                                                                     "+
		"         ELSE                                                                                                                                          "+
		"          0                                                                                                                                            "+
		"       END KCALL_CYCLE,                                                                                                                                "+
		"        '-' AS SALEALL_TB,                                                                                                                             "+
		"        '-' AS SALEALL_DB ,                                                                                                                            "+
		"        PODS.GET_RADIX_POINT(CASE                                                                                                                      "+
		"                              WHEN SUM(NVL(T2.JH_NUM1, 0))+SUM(NVL(T2.JH_NUM3, 0)) <> 0 THEN                                                           "+
		"                               (SUM(NVL(T.JH_NUM1, 0))+SUM(NVL(T.JH_NUM3, 0)) - （SUM(NVL(T2.JH_NUM1, 0))+SUM(NVL(T2.JH_NUM3, 0)))) * 100 /            "+
		"                               （SUM(NVL(T2.JH_NUM1, 0))+SUM(NVL(T2.JH_NUM3, 0)))                                                                      "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) JHALL_DB,                                                                                                               "+
		"         PODS.GET_RADIX_POINT(CASE                                                                                                                     "+
		"                              WHEN SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN                                                       "+
		"                               (SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0)) - (SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)))) * 100 /     "+
		"                               (SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)))                                                                   "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) SALEALL_DB1,                                                                                                            "+
		"        PODS.GET_RADIX_POINT(CASE                                                                                                                      "+
		"                              WHEN SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0)) <> 0 THEN                                                           "+
		"                               (SUM(NVL(T.KC_NUM1, 0))+SUM(NVL(T.KC_NUM3, 0)) - (SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0)))) * 100 /             "+
		"                               (SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0)))                                                                       "+
		"                              ELSE                                                                                                                     "+
		"                               0                                                                                                                       "+
		"                            END || '%',                                                                                                                "+
		"                            2) KCALL_DB,                                                                                                               "+
		"       PODS.GET_RADIX_POINT(                                                                                                                           "+
		"          CASE WHEN (CASE                                                                                                                              "+
		"                     WHEN SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN                                                                "+
		"                      ROUND((SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0))) /                                                                        "+
		"                            ((SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0))) /                                                                   "+
		"                             TO_CHAR(LAST_DAY(TO_DATE(T2.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                            "+
		"                            2)                                                                                                                         "+
		"                     ELSE 0                                                                                                                            "+
		"                     END) <>0                                                                                                                          "+
		"            THEN  ((CASE                                                                                                                               "+
		"                     WHEN SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0)) <> 0                                                                       "+
		"                     THEN ROUND((SUM(NVL(T.KC_NUM1, 0))+SUM(NVL(T.KC_NUM3, 0))) /                                                                      "+
		"                           ((SUM(NVL(T.SALE_NUM1, 0))+SUM(NVL(T.SALE_NUM3, 0))) /                                                                      "+
		"                                TO_CHAR(LAST_DAY(TO_DATE(T.DEAL_DATE, 'YYYYMM')), 'dd') * 7),2)                                                        "+
		"                     ELSE  0                                                                                                                           "+
		"                     END)                                                                                                                              "+
		"                     -                                                                                                                                 "+
		"                     (CASE                                                                                                                             "+
		"                     WHEN SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN                                                                "+
		"                      ROUND((SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0))) /                                                                        "+
		"                            ((SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0))) /                                                                   "+
		"                             TO_CHAR(LAST_DAY(TO_DATE(T2.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                            "+
		"                            2)                                                                                                                         "+
		"                     ELSE 0                                                                                                                            "+
		"                     END))/                                                                                                                            "+
		"                     (CASE                                                                                                                             "+
		"                     WHEN SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0)) <> 0 THEN                                                                "+
		"                      ROUND((SUM(NVL(T2.KC_NUM1, 0))+SUM(NVL(T2.KC_NUM3, 0))) /                                                                        "+
		"                            ((SUM(NVL(T2.SALE_NUM1, 0))+SUM(NVL(T2.SALE_NUM3, 0))) /                                                                   "+
		"                             TO_CHAR(LAST_DAY(TO_DATE(T2.DEAL_DATE, 'YYYYMM')), 'dd') * 7),                                                            "+
		"                            2)                                                                                                                         "+
		"                     ELSE 0                                                                                                                            "+
		"                     END)                                                                                                                              "+
		"            ELSE 0 END ||'%',2 )       KCALL_CYCLE_DB                                                                                                  "+
		"  FROM PMRT.TB_MRT_BUS_DEVICE_SALE_MON T                                                                                                               "+
		"  LEFT JOIN PMRT.TB_MRT_BUS_DEVICE_SALE_MON T1                                                                                                         "+
		"    ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE AND T1.DEAL_DATE = "+getLastMonth(dealDate)+")                                                                "+
		"  LEFT JOIN PMRT.TB_MRT_BUS_DEVICE_SALE_MON T2                                                                                                         "+
		"    ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE AND T2.DEAL_DATE = "+getFristMonth(dealDate)+")                                                               "+
		                                             where+                                                                                                          
		" GROUP BY  T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,                                                                                                          "+
		"           T.HQ_CHAN_CODE,                                                                                                                             "+
		"           T.OPERATE_TYPE,                                                                                                                             "+
		"           T.CHNL_TYPE,                                                                                                                                "+
		"           T.DEAL_DATE,                                                                                                                                "+
		"           T2.DEAL_DATE,                                                                                                                               "+
		"           T.FLAG                                                                                                                                      ";                                                                                                
	}
  }

function getLastMonth(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    if(month=='01'){
    	return (year-1)+'12';
    }
   return dealDate-1;
}

function getFristMonth(dealDate){
	var year=dealDate.substr(0,4);
	return year+'01';
}

function getLastYearSameMonth(dealDate){
	var year=dealDate.substr(0,4);
    var month=dealDate.substr(4,6);
    return (year-1)+month;
}

function getLastYearEndMonth(dealDate){
	var year=dealDate.substr(0,4);
	return (year-1)+'12';
}