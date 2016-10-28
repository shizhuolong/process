var nowData = [];

var title=[["组织架构","流失用户数","","用户流失率","","流失收入","","收入流失率","","欠费","","出账率",""],
           ["","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减"]];		
var field=["LOSE_NUM","HB_LOSE_NUM","RATE_LOSE_NUM","HB1_LOSE_NUM","LOSE_SR","HB_LOSE_SR","RATE_LOSE_SR","HB1_LOSE_SR","QF","HB_QF","RATE_ACCT","HB1_ACCT_NUM"];

var report=null;
var qdate="";
var orderBy="";
$(function(){
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		/*lock:1,*/
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_NAME","ROW_ID"],
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" ORDER BY ROW_NAME "+type+" ";
			}else if(index>0){
				orderBy=" ORDER BY "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var sql="";
			var dealDate=$("#dealDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var hqName = $.trim($("#hqName").val());
			//权限
			var orgLevel=$("#orgLevel").val();
			var code=$("#code").val();
			//where条件
			var where="";
			//groupby条件
			var groupBy="";
			var orderBy=" ORDER BY T.ROW_ID ";
			var hrId = $("#hrId").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					sql="	SELECT UNIT_ID AS ROW_ID,UNIT_NAME AS ROW_NAME";
					where=" AND GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY  UNIT_ID ,UNIT_NAME";
				}else if(orgLevel==3){
					sql="	SELECT MOB_NAME AS ROW_ID, MOB_NAME AS ROW_NAME";
					where=" AND UNIT_ID='"+code+"'";
					groupBy=" GROUP BY  MOB_NAME ";
				}else if(orgLevel==4){
					sql="	SELECT HQ_CHAN_CODE AS ROW_ID, GROUP_ID_4_NAME AS ROW_NAME";
					where=" AND MOB_NAME='"+code+"'";
					groupBy=" GROUP BY HQ_CHAN_CODE, GROUP_ID_4_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				if(orgLevel==1){//省   展示省
					sql="	SELECT GROUP_ID_1 AS ROW_ID,GROUP_ID_1_NAME AS ROW_NAME";
					groupBy	=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
				}else if(orgLevel==2){//市
					sql="	SELECT UNIT_ID AS ROW_ID,UNIT_NAME AS ROW_NAME";
					where=" AND GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY  UNIT_ID ,UNIT_NAME";
				}else if(orgLevel==3){//营服中心 看地市
					sql="	SELECT MOB_NAME AS ROW_ID, MOB_NAME AS ROW_NAME";
					where=" AND UNIT_ID IN("+_unit_relation(code)+") ";
					groupBy=" GROUP BY MOB_NAME";
				}else if(level==4){
					sql="	SELECT HQ_CHAN_CODE AS ROW_ID, GROUP_ID_4_NAME AS ROW_NAME";
					where=" AND HR_ID='"+code+"'";
					groupBy=" GROUP BY HQ_CHAN_CODE, GROUP_ID_4_NAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			sql+=getSql()+" WHERE  DEAL_DATE ="+dealDate+where;
			if (regionCode != '') {
				sql += " AND GROUP_ID_1 = '" + regionCode + "'";
			}
			if (unitCode != '') {
				sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if (hqName != '') {
				sql += " AND  MOB_NAME LIKE '%" + hqName + "%'";
			}
			
			if (groupBy != '') {
				sql += groupBy;
			}
			if (orderBy != '') {
				sql = "select * from( " + sql + ") t " + orderBy;
			}
		var d=query(sql);
		
		return {data:d,extra:{orgLevel:orgLevel}};
		}	
	});
	  report.showSubRow();
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
	});
});
//大理州分公司,16002,2
function getSql(){
	var sql="  ,SUM(NVL(LOSE_NUM,0))   AS   LOSE_NUM                                                                                                                    "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LOSE_NUML,0)) <> 0                                                                                               "+
			"                                                THEN (SUM(NVL(LOSE_NUM,0)) - SUM(NVL(LOSE_NUML,0)))*100 /SUM(NVL(LOSE_NUML,0))                             "+
			"                                                ELSE 0 END || '%',2)             HB_LOSE_NUM                                                               "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ACCT_NUML,0)) <> 0                                                                                               "+
			"                                                THEN SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))                                                        "+
			"                                                ELSE 0 END || '%' ,2)              RATE_LOSE_NUM                                                           "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ACCT_NUML,0))=0 AND SUM(NVL(ACCT_NUML2,0))= 0                                                                    "+
			"                                      THEN 0                                                                                                               "+
			"                                      WHEN SUM(NVL(ACCT_NUML,0))<>0 AND SUM(NVL(ACCT_NUML2,0))=0                                                           "+
			"                                      THEN SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))                                                                  "+
			"                                      WHEN SUM(NVL(ACCT_NUML,0))=0 AND SUM(NVL(ACCT_NUML2,0))<>0                                                           "+
			"                                      THEN -SUM(NVL(LOSE_NUML,0))*100/SUM(NVL(ACCT_NUML2,0))                                                               "+
			"                                                ELSE SUM(NVL(LOSE_NUM,0))*100/SUM(NVL(ACCT_NUML,0))-SUM(NVL(LOSE_NUML,0))*100/SUM(NVL(ACCT_NUML2,0))       "+
			"                                                END || '%' ,2)                   HB1_LOSE_NUM                                                              "+
			"  ,SUM(NVL(LOSE_SR,0))    AS   LOSE_SR                                                                                                                     "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LOSE_SRL,0)) <> 0                                                                                                "+
			"                                                THEN (SUM(NVL(LOSE_SR,0)) - SUM(NVL(LOSE_SRL,0)))*100 /SUM(NVL(LOSE_SRL,0))                                "+
			"                                                ELSE 0 END  || '%' ,2)              HB_LOSE_SR                                                             "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ACCT_SRL,0)) <> 0                                                                                                "+
			"                                                THEN SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))                                                          "+
			"                                                ELSE 0 END || '%' ,2)             RATE_LOSE_SR                                                             "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ACCT_SRL,0))=0 AND SUM(NVL(ACCT_SRL2,0))= 0                                                                      "+
			"                                      THEN 0                                                                                                               "+
			"                                      WHEN SUM(NVL(ACCT_SRL,0))<>0 AND SUM(NVL(ACCT_SRL2,0))=0                                                             "+
			"                                      THEN SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))                                                                    "+
			"                                      WHEN SUM(NVL(ACCT_SRL,0))=0 AND SUM(NVL(ACCT_SRL2,0))<>0                                                             "+
			"                                      THEN -SUM(NVL(LOSE_SRL,0))*100/SUM(NVL(ACCT_SRL2,0))                                                                 "+
			"                                                ELSE SUM(NVL(LOSE_SR,0))*100/SUM(NVL(ACCT_SRL,0))-SUM(NVL(LOSE_SRL,0))*100/SUM(NVL(ACCT_SRL2,0))           "+
			"                                                END|| '%' ,2)                    HB1_LOSE_SR                                                               "+
			"  ,SUM(NVL(QF,0))  AS    QF                                                                                                                                "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(QFL,0)) <> 0                                                                                                     "+
			"                                                THEN (SUM(NVL(QF,0)) - SUM(NVL(QFL,0)))*100 /SUM(NVL(QFL,0))                                               "+
			"                                                ELSE 0 END || '%' ,2)               HB_QF                                                                  "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(INNET_NUM,0)) <> 0                                                                                               "+
			"                                                THEN SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))                                                        "+
			"                                                ELSE 0 END || '%' ,2)                RATE_ACCT                                                             "+
			"  ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(INNET_NUM,0))=0 AND SUM(NVL(INNET_NUML,0))= 0                                                                    "+
			"                                      THEN 0                                                                                                               "+
			"                                      WHEN SUM(NVL(INNET_NUM,0))<>0 AND SUM(NVL(INNET_NUML,0))=0                                                           "+
			"                                      THEN SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))                                                                  "+
			"                                      WHEN SUM(NVL(INNET_NUM,0))=0 AND SUM(NVL(INNET_NUML,0))<>0                                                           "+
			"                                      THEN -SUM(NVL(ACCT_NUML,0))*100/SUM(NVL(INNET_NUML,0))                                                               "+
			"                                                ELSE SUM(NVL(ACCT_NUM,0))*100/SUM(NVL(INNET_NUM,0))-SUM(NVL(ACCT_NUML,0))*100/SUM(NVL(INNET_NUML,0))       "+
			"                                                END || '%' ,2)                      HB1_ACCT_NUM                                                           "+                                                                                                                             
			"	FROM PMRT.TB_MRT_WARN_USER_LOSE_MON                                                                                                                     ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var dealDate=$("#dealDate").val();
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqName = $.trim($("#hqName").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var sql="	SELECT DEAL_DATE,			"+		
			"	       GROUP_ID_1_NAME,   	"+		
			"	       UNIT_NAME,         	"+		
			"	       MOB_NAME,           	"+		
			"	       GROUP_ID_4_NAME   	"+		
			getSql()+
			"	WHERE  DEAL_DATE =	"+dealDate;
			
			if (regionCode != '') {
				sql += " AND GROUP_ID_1 = '" + regionCode + "'";
			}
			if (unitCode != '') {
				sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if (hqName != '') {
				sql += " AND  MOB_NAME LIKE '%" + hqName + "%'";
			}
			
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" and HQ_CHAN_CODE='"+code+"'";
	}
	sql+="  GROUP BY DEAL_DATE, GROUP_ID_1_NAME, UNIT_NAME, MOB_NAME, GROUP_ID_4_NAME ";
	
	var title=[["账期","地市","营服中心","渠道经理","渠道名称","流失用户数","","用户流失率","","流失收入","","收入流失率","","欠费","","出账率",""],
	           ["","","","","","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减","本期","环比增减"]];			
	showtext = '月流失预警报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
