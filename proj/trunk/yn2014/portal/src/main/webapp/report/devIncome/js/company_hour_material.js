var field=["DAY_1","DAY_2","DAY_3","DAY_4","DAY_5","DAY_6","DAY_7","DAY_8","DAY_9","DAY_10","DAY_11","DAY_12","DAY_13","DAY_14","DAY_15","DAY_16","DAY_17","DAY_18","DAY_19","DAY_20","DAY_21","DAY_22","DAY_23","DAY_24","DAY_25","DAY_26","DAY_27","DAY_28","DAY_29","DAY_30","DAY_31","DAY_ALL"];
var title=[["组织架构","1日","2日","3日","4日","5日","6日","7日","8日","9日","10日","11日","12日","13日","14日","15日","16日","17日","18日","19日","20日","21日","22日","23日","24日","25日","26日","27日","28日","29日","30日","31日","合计"]];
var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		getSubRowsCallBack:function($tr){
			var sql='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var dealDate = $.trim($("#dealDate").val());
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var orderBy =" ORDER BY ROW_ID ";
			var provinceSql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					sql=	"SELECT GROUP_ID_1_NAME  AS ROW_NAME,GROUP_ID_1 AS ROW_ID, " +getSql();
					where = ' where 1=1 ';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,DEAL_DATE';
				}else if(orgLevel==3){
					sql=' SELECT UNIT_ID AS  ROW_ID,UNIT_NAME AS  ROW_NAME, '+getSql();
					groupBy=' GROUP BY UNIT_ID,UNIT_NAME,DEAL_DATE ';
					where=' WHERE GROUP_ID_1=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql=	"SELECT '全省'  AS ROW_NAME,'86000' AS ROW_ID, " +getSql();
					where = ' where 1=1 ';
					orgLevel=2;
				}else if(orgLevel==2){//市
					sql="SELECT GROUP_ID_1_NAME  AS ROW_NAME,GROUP_ID_1 AS ROW_ID,"+getSql();
					groupBy=' GROUP BY GROUP_ID_1_NAME,GROUP_ID_1,DEAL_DATE';
					where=' WHERE GROUP_ID_1=\''+code+"\' ";
					orgLevel=3;
				}else if(orgLevel==3){//营服中心
					sql=' SELECT UNIT_ID AS  ROW_ID,UNIT_NAME AS  ROW_NAME, '+getSql();
					groupBy=' GROUP BY UNIT_ID,UNIT_NAME,DEAL_DATE ';
					where+=" WHERE UNIT_ID IN("+_unit_relation(code)+") ";
				}else if(orgLevel>=4){
					return {data:[],extra:{}};
				}
			}
			//***************************************
			sql+=where +" AND DEAL_DATE="+dealDate;
			//***************************************
			// 条件查询
			if(regionCode!=''){
				sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if(groupBy!=''){
				sql+=groupBy;
			}
			
			
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();

	$("#searchBtn").click(function(){
		report.showSubRow();
	});
});

function getSql(){
	var dealDate=$("#dealDate").val();
	var sql = 	"       SUM(DAY_1 ) AS DAY_1 ,                                         "+
				"       SUM(DAY_2 ) AS DAY_2 ,                                         "+
				"       SUM(DAY_3 ) AS DAY_3 ,                                         "+
				"       SUM(DAY_4 ) AS DAY_4 ,                                         "+
				"       SUM(DAY_5 ) AS DAY_5 ,                                         "+
				"       SUM(DAY_6 ) AS DAY_6 ,                                         "+
				"       SUM(DAY_7 ) AS DAY_7 ,                                         "+
				"       SUM(DAY_8 ) AS DAY_8 ,                                         "+
				"       SUM(DAY_9 ) AS DAY_9 ,                                         "+
				"       SUM(DAY_10) AS DAY_10,                                         "+
				"       SUM(DAY_11) AS DAY_11,                                         "+
				"       SUM(DAY_12) AS DAY_12,                                         "+
				"       SUM(DAY_13) AS DAY_13,                                         "+
				"       SUM(DAY_14) AS DAY_14,                                         "+
				"       SUM(DAY_15) AS DAY_15,                                         "+
				"       SUM(DAY_16) AS DAY_16,                                         "+
				"       SUM(DAY_17) AS DAY_17,                                         "+
				"       SUM(DAY_18) AS DAY_18,                                         "+
				"       SUM(DAY_19) AS DAY_19,                                         "+
				"       SUM(DAY_20) AS DAY_20,                                         "+
				"       SUM(DAY_21) AS DAY_21,                                         "+
				"       SUM(DAY_22) AS DAY_22,                                         "+
				"       SUM(DAY_23) AS DAY_23,                                         "+
				"       SUM(DAY_24) AS DAY_24,                                         "+
				"       SUM(DAY_25) AS DAY_25,                                         "+
				"       SUM(DAY_26) AS DAY_26,                                         "+
				"       SUM(DAY_27) AS DAY_27,                                         "+
				"       SUM(DAY_28) AS DAY_28,                                         "+
				"       SUM(DAY_29) AS DAY_29,                                         "+
				"       SUM(DAY_30) AS DAY_30,                                         "+
				"       SUM(DAY_31) AS DAY_31,                                         "+
				"       SUM(DAY_ALL) AS  DAY_ALL                                       "+
				"  FROM PMRT.TAB_MRT_BMS_FAV_INCOME_REPORT PARTITION(P"+dealDate+")    ";
				
	return sql;
}


/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$.trim($("#unitCode").val());
	var code =$("#code").val();
	// 权限
	var orgLevel=$("#orgLevel").val();
	var sql= "SELECT DEAL_DATE,  GROUP_ID_1_NAME,   UNIT_NAME, "+getSql()+ " WHERE 1=1 ";
	if(orgLevel==1){
	
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	sql+=" GROUP BY DEAL_DATE, GROUP_ID_1, GROUP_ID_1_NAME, UNIT_ID, UNIT_NAME  "+
		 " ORDER BY GROUP_ID_1,UNIT_ID  ";
	
	var title=[["账期","分公司","营服中心","1日","2日","3日","4日","5日","6日","7日","8日","9日","10日","11日","12日","13日","14日","15日","16日","17日","18日","19日","20日","21日","22日","23日","24日","25日","26日","27日","28日","29日","30日","31日","合计"]];

	var showtext = '宽带工时材料费日报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
