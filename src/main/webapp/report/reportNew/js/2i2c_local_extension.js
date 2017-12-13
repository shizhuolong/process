var report;
var maxDate=null;
$(function(){
	maxDate = getMaxDate("pmrt.tb_DW_V_D_HLW_OUTLINE_USER");
	var field=["ROW_NAME","NUM_20","NUM_50","NUM_100" ,"PROMOTION_FEE" ,"FIRST_REWARD" ,"NUM_MONTH" ,"PROMOTION_MONTH" ,"FIRST_MONTH" ,"NUM_LJ" ,"PROMOTION_LJ" ,"FIRST_LJ","NUM_UNIT_DAY","SALES_DAY","PERSON_DAY","NUM_UNIT","IS_SALES","PERSON_DEV_NUM"];
	var title=[["州市","当天","","","","","月累计","","","累计","","","当天过程指标","","","过程指标","",""],
			   ["","首充20","首充50","首充100","营销成本","人工成本","首充数","营销成本","人工成本","首充数","营销成本","人工成本","区县/营服数","有销量区县/营服数","有销量人数","区县/营服数","有销量区县/营服数","有销量人数"]];
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
			var hr_id=$("#hr_id").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var startDete=$("#startDate").val();
			var endDete=$("#endDate").val();
			var dealDate=endDete.substr(0,6);
			var where=" WHERE 1=1 ";
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
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
					where+=" AND HALL_CODE='"+code+"'";
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
					where+=" AND HALL_CODE='"+code+"'";
				}else if(orgLevel==5){
					where+=" AND HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel);
				orgLevel++;
			}
			downsql=sql;
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
	var startDete=$("#startDate").val();
	var endDete=$("#endDate").val();
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,AREA_NAME ROW_NAME,";
		groupBy=" GROUP BY GROUP_ID_1,AREA_NAME";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==4){
		preSql="SELECT HALL_CODE ROW_ID,HALL_NAME ROW_NAME,";
		groupBy=" GROUP BY HALL_CODE,HALL_NAME";
	}else if(orgLevel==5){
		preSql="SELECT OPEN_PERSON_CODE ROW_ID,OPEN_PERSON_NAME ROW_NAME,";
		groupBy=" GROUP BY OPEN_PERSON_CODE,OPEN_PERSON_NAME";
	}
	var sql=preSql+
	"       sum(nvl(NUM_20,0)) NUM_20,                                             "+
	"       sum(nvl(NUM_50,0)) NUM_50,                                             "+
	"       sum(nvl(NUM_100,0)) NUM_100,                                           "+
	"       sum(nvl(PROMOTION_FEE,0)) PROMOTION_FEE,                               "+
	"       sum(nvl(FIRST_REWARD,0)) FIRST_REWARD,                                 "+
	"       sum(nvl(NUM_MONTH,0)) NUM_MONTH,                                       "+
	"       sum(nvl(PROMOTION_MONTH,0)) PROMOTION_MONTH,                           "+
	"       sum(nvl(FIRST_MONTH,0)) FIRST_MONTH,                                   "+
	"       sum(nvl(NUM_LJ,0)) NUM_LJ,                                             "+
	"       sum(nvl(PROMOTION_LJ,0)) PROMOTION_LJ,                                 "+
	"       sum(nvl(FIRST_LJ,0)) FIRST_LJ,                                         "+
	"       count(distinct unit_id) NUM_UNIT_DAY,                                  "+
	"       sum(nvl(sales_day,0)) SALES_DAY,                                       "+
	"       sum(nvl(num_person,0)) PERSON_DAY,                                     "+
	"       count(distinct unit_id) NUM_UNIT,                                      "+
	"       sum(nvl(is_sales, 0)) IS_SALES,                                        "+
	"       sum(nvl(person_dev_num, 0)) PERSON_DEV_NUM                             "+
	"       FROM (                                                                 "+
	"SELECT GROUP_ID_0,                                                            "+
	"       GROUP_ID_1,                                                            "+
	"       AREA_NAME,                                                             "+
	"       UNIT_ID,                                                               "+
	"       UNIT_NAME,                                                             "+
	"       HALL_CODE,                                                             "+
	"       HALL_NAME,                                                             "+
	"       OPEN_PERSON_CODE,                                                      "+
	"       OPEN_PERSON_NAME,                                                      "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' AND           "+
	"                  t.payment_fee_first >= 20 and t.payment_fee_first < 50 THEN "+
	"              1                                                               "+
	"             ELSE                                                             "+
	"              0                                                               "+
	"           END) NUM_20,                                                       "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' AND           "+
	"                  t.payment_fee_first >= 50 and t.payment_fee_first < 100 THEN "+
	"              1                                                               "+
	"             ELSE                                                             "+
	"              0                                                               "+
	"           END) NUM_50,                                                       "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' AND           "+
	"                  t.payment_fee_first >= 100 THEN                             "+
	"              1                                                               "+
	"             ELSE                                                             "+
	"              0                                                               "+
	"           END) NUM_100,                                                      "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' THEN          "+
	"              PROMOTION_FEE                                                   "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) PROMOTION_FEE,                                                "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) = '"+endDete+"' THEN          "+
	"              FIRST_REWARD                                                    "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) FIRST_REWARD,                                                 "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND     "+
	"                  '"+endDete+"' THEN                                             "+
	"              1                                                               "+
	"             ELSE                                                             "+
	"              0                                                               "+
	"           END) NUM_MONTH,                                                    "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND     "+
	"                  '"+endDete+"' THEN                                             "+
	"              PROMOTION_FEE                                                   "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) PROMOTION_MONTH,                                              "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN '"+startDete+"' AND     "+
	"                  '"+endDete+"' THEN                                             "+
	"              FIRST_REWARD                                                    "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) FIRST_MONTH,                                                  "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND       "+
	"                  '"+endDete+"' THEN                                             "+
	"              1                                                               "+
	"             ELSE                                                             "+
	"              0                                                               "+
	"           END) NUM_LJ,                                                       "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND       "+
	"                  '"+endDete+"' THEN                                             "+
	"              PROMOTION_FEE                                                   "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) PROMOTION_LJ,                                                 "+
	"       SUM(CASE                                                               "+
	"             WHEN substr(payment_time_first, 1, 8) BETWEEN 20171020 AND       "+
	"                  '"+endDete+"' THEN                                             "+
	"              FIRST_REWARD                                                    "+
	"             else                                                             "+
	"              0                                                               "+
	"           END) FIRST_LJ,                                                     "+
	"       case                                                                   "+
	"         when ROW_NUMBER()                                                    "+
	"          OVER(PARTITION BY T.AREA_NAME, UNIT_ID ORDER BY T.UNIT_ID) = 1      "+
	"          and (SELECT nvl(PERSON_DEV_NUM,0)                                   "+
	"          FROM (SELECT /*+parallel(8)*/  unit_id,                             "+
	"                       count(*) PERSON_DEV_NUM                                "+
	"                   FROM pmrt.tb_DW_V_D_HLW_OUTLINE_USER PARTITION(p"+maxDate+") T  "+
	"                 WHERE  substr(payment_time_first, 1, 8) = '"+endDete+"'         "+
	"                 GROUP BY unit_id) t1                                         "+
	"         WHERE t.unit_id = t1.unit_id)>=5                                     "+
	"          then                                                                "+
	"           1                                                                  "+
	"         else                                                                 "+
	"          0                                                                   "+
	"       end  sales_day,                                                        "+
	"       COUNT(DISTINCT CASE WHEN SUBSTR(PAYMENT_TIME_FIRST,1,8)='"+endDete+"' THEN OPEN_PERSON_CODE END) num_person, "+
	"       sum(nvl(is_sales, 0)) IS_SALES,                                        "+
	"       sum(nvl(person_dev_num, 0)) PERSON_DEV_NUM                             "+
	"  FROM pmrt.tb_DW_V_D_HLW_OUTLINE_USER PARTITION(p"+maxDate+") T      "+
	" GROUP BY GROUP_ID_0,                                                         "+
	"          GROUP_ID_1,                                                         "+
	"          AREA_NAME,                                                          "+
	"          UNIT_ID,                                                            "+
	"          UNIT_NAME,                                                          "+
	"          HALL_CODE,                                                          "+
	"          HALL_NAME,                                                          "+
	"          OPEN_PERSON_CODE,                                                   "+
	"          OPEN_PERSON_NAME                                                    "+
	"    )                                                                         "+
	where+groupBy;
	return sql;
}

function downsAll() {
	var field=["ROW_ID","ROW_NAME","NUM_20","NUM_50","NUM_100" ,"PROMOTION_FEE" ,"FIRST_REWARD" ,"NUM_MONTH" ,"PROMOTION_MONTH" ,"FIRST_MONTH" ,"NUM_LJ" ,"PROMOTION_LJ" ,"FIRST_LJ","NUM_UNIT","IS_SALES","PERSON_DEV_NUM"];
	var title=[["州市ID","州市","当天","","","","","月累计","","","累计","","","过程指标","",""],
			   ["","","首充20","首充50","首充100","营销成本","人工成本","首充数","营销成本","人工成本","首充数","营销成本","人工成本","区县/营服数","有销量区县/营服数","有销量人数"]];
	showtext = "2I2C地推推广情况";
	downloadExcel(downsql,title,showtext);
}

function getMaxDate(tableName){
	var sql="SELECT MAX(ACCT_DATE) DEAL_DATE FROM "+tableName;
	var r=query(sql);
	if(r!=null&&r[0]!=null&&r.length>0){
		return r[0]["DEAL_DATE"];
	}
	return "";
}

function showDesc(){
	var url = $("#ctx").val()+"/report/reportNew/jsp/2i2c_local_extension_explain.jsp";
	art.dialog.open(url,{
		id:'bindDescDialog',
		width:'600px',
		height:'200px',
		lock:true,
		resize:false
	});
}