$(function(){
	var title=[["营业厅新增发展月报表","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带收 入","","其中智慧沃家发展","","合计","环比","同比","定比1月","全渠道发展","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","",""]];
    
	var field=["HQ_CHAN_CODE","T_TYPE","OPERATE_TYPE","THIS_YW_NUM","HB_YW","THIS_4G_NUM","HB_4G","NETW_NUM","HB_NETW","THIS_GWKD_NUM","HB_GWKD","THIS_ZHWJ_DEV","HB_ZHWJ","ALL_NUM","HB_ALL","TB_ALL","DB_ALL","ALL1_DEV","ALL_CHANL_NUM","HB_ALL_CHANL"];
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
			var hallType = $("#hallType").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var dealDate=$("#dealDate").val();
			var groupBy = "";
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					groupBy= " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市
					preField=" SELECT HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE,";
					groupBy = " GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE";
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT '86000' ROW_ID,'云南省' ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					groupBy = " GROUP BY GROUP_ID_0 "; 
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' T_TYPE,'--' OPERATE_TYPE,";
					groupBy = " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ";
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(hallType!=""){
				where += " AND T_TYPE ='"+hallType+"' ";
			}
			
			var sql=preField+getSumSql(dealDate)+where+groupBy;
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
function getSumSql() {
	return "       SUM(T.THIS_2G_NUM) + SUM(T.THIS_3G_NUM) + SUM(t.THIS_4G_NUM) AS THIS_YW_NUM,           "+
	"        CASE                                                                                  "+
	"         WHEN SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM) = 0 THEN               "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(ROUND((SUM(t.THIS_2G_NUM)+SUM(t.THIS_3G_NUM)+SUM(t.THIS_4G_NUM)             "+
	"                           - (SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM)))      "+
	"                           /(SUM(t.LAST_2G_NUM)+SUM(t.LAST_3G_NUM)+SUM(t.LAST_4G_NUM)) * 100, "+
	"                        2),                                                                   "+
	"                  'fm9999999999999990.00') || '%'                                             "+
	"       END AS HB_YW,                                                                          "+
	"       SUM(t.THIS_4G_NUM) AS THIS_4G_NUM,                                                     "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.LAST_4G_NUM) = 0 THEN                                        "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.THIS_4G_NUM) - SUM(t.LAST_4G_NUM)) /                      "+
	"                             SUM(t.LAST_4G_NUM) * 100,                                        "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_4G,                                      "+
	"       SUM(t.NETW_NUM) AS NETW_NUM,                                                           "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.LAST_NETW_NUM) = 0 THEN                                                   "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          ROUND((SUM(t.NETW_NUM) - SUM(t.LAST_NETW_NUM)) /                                    "+
	"                SUM(t.LAST_NETW_NUM) * 100,                                                   "+
	"                2) || '%'                                                                     "+
	"       END AS HB_NETW,                                                                        "+
	"       SUM(t.THIS_GWKD_NUM) AS THIS_GWKD_NUM,                                                 "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.LAST_GWKD_NUM) = 0 THEN                                      "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.THIS_GWKD_NUM) - SUM(t.LAST_GWKD_NUM)) /                  "+
	"                             SUM(t.LAST_GWKD_NUM) * 100,                                      "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_GWKD,                                    "+
	"       SUM(t.ZHWJ_DEV) AS ZHWJ_DEV,                                                           "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(t.ZHWJ_DEVL) = 0 THEN                                          "+
	"                       0                                                                      "+
	"                      ELSE                                                                    "+
	"                       ROUND((SUM(t.ZHWJ_DEV) - SUM(t.ZHWJ_DEVL)) / SUM(t.ZHWJ_DEVL) * 100,   "+
	"                             2)                                                               "+
	"                    END,                                                                      "+
	"                    'FM9999999990.99')) || '%' AS HB_ZHWJ,                                    "+
	"       SUM(t.ALL_NUM) AS ALL_NUM,                                                             "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.LAST_ALL) <> 0 THEN                                          "+
	"                       (SUM(T.ALL_NUM) - SUM(T.LAST_ALL)) * 100 / SUM(T.LAST_ALL)             "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' HB_ALL,                                          "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.LTMN_ALL_NUM) <> 0 THEN                                      "+
	"                       (SUM(T.ALL_NUM) - SUM(T.LTMN_ALL_NUM)) * 100 / SUM(T.LTMN_ALL_NUM)     "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' TB_ALL,                                          "+
	"       TRIM('.' FROM TO_CHAR(CASE                                                             "+
	"                      WHEN SUM(T.MN01_ALL_NUM) <> 0 THEN                                      "+
	"                       (SUM(T.ALL_NUM) - SUM(T.MN01_ALL_NUM)) * 100 / SUM(T.MN01_ALL_NUM)     "+
	"                      ELSE                                                                    "+
	"                       0                                                                      "+
	"                    END,                                                                      "+
	"                    'FM99999999.99')) || '%' DB_ALL,                                          "+
	"       SUM(t.all1)   ALL1_DEV,                                                                "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.all1) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(round(SUM(t.all_num) / SUM(t.all1)* 100,                                    "+
	"                        2),                                                                   "+
	"                  'fm99999999999990.00') || '%'                                               "+
	"       END AS ALL_CHANL_NUM,                                                                  "+
	"       CASE                                                                                   "+
	"         WHEN SUM(t.all1) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.all2) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.all2) = 0 THEN                                                            "+
	"          '0%'                                                                                "+
	"         WHEN SUM(t.LAST_ALL) / SUM(t.all2) = 0 THEN                                          "+
	"          '0%'                                                                                "+
	"         ELSE                                                                                 "+
	"          to_char(ROUND(((SUM(t.all_num) / SUM(t.all1)) -                                     "+
	"                        (SUM(t.LAST_ALL) / SUM(t.all2))) /                                    "+
	"                        (SUM(t.LAST_ALL) / SUM(t.all2)) * 100,                                "+
	"                        2),                                                                   "+
	"                  'fm99999999999990.00') || '%'                                               "+
	"       END AS HB_ALL_CHANL                                                                    "+
	"  FROM PMRT.TB_MRT_BUS_HALL_DEV_MON T                                                         ";
}

function downsAll() {
	var preField=" SELECT GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE,";
	var orderBy= " ORDER BY GROUP_ID_1,BUS_HALL_NAME ";
	var groupBy= " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,T_TYPE,OPERATE_TYPE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var hallType = $("#hallType").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND T_TYPE ='"+hallType+"' ";
	}
	var sql = preField+getSumSql()+where+groupBy+orderBy;
	var showtext = '营业厅新增发展月报表-' + dealDate;
	var title=[["营业厅开帐发展月报表","","","","","","","","","","","","","","","","","","","","",""],
	           ["州市","营业厅","渠道编码","厅类型","经营模式（自营/柜台外包/他营）","移动网发展","","其中4G发展","","固网发展","","其中宽带收 入","","其中智慧沃家发展","","合计","环比","同比","定比1月","全渠道发展","占全渠道份额","份额环比"],
	           ["","","","","当月","环比","当月","环比","当月","环比","当月","环比","当月","环比","当月","","","","","","",""]];
	downloadExcel(sql,title,showtext);
}
