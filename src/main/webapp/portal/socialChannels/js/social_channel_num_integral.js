var field=["CODE_S_HZT","CODE_S_ZYD","CODE_S_DLD","CODE_S_TOTAL","CODE_A_HZT","CODE_A_ZYD","CODE_A_DLD","CODE_A_TOTAL","CODE_B_HZT","CODE_B_ZYD","CODE_B_DLD","CODE_B_TOTAL","CODE_C_HZT","CODE_C_ZYD","CODE_C_DLD","CODE_C_TOTAL","CODE_D_HZT","CODE_D_ZYD","CODE_D_DLD","CODE_D_TOTAL","CODE_OTHER_HZT","CODE_OTHER_ZYD","CODE_OTHER_DLD","CODE_OTHER_TOTAL"];
var orderBy='';	
$(function(){
	
	var report=new LchReport({
		title:[["营销架构","账期","S","","","","A","","","","B","","","","C","","","","D","","","","待评","","",""],
	           ["","","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计"]]
		,
		field:["ROWNAME","DEAL_DATE"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["CODE"],//第一个为rowId
		content:"lchcontent",
		getSubRowsCallBack:function($tr){

			var code=$("#code").val();
			var level=$("#orgLevel").val();
			var month = $.trim($("#month").val());
		    var groupBy="";
		    var where="";
			var orderBy="";
			var sql="";
			var resultSql="SUM(NVL(CODE_S_HZT, 0)) CODE_S_HZT,           "+
							"SUM(NVL(CODE_S_ZYD, 0)) CODE_S_ZYD,           "+
							"SUM(NVL(CODE_S_DLD, 0)) CODE_S_DLD,           "+
							"SUM(NVL(CODE_S_TOTAL, 0)) CODE_S_TOTAL,       "+
							"SUM(NVL(CODE_A_HZT, 0)) CODE_A_HZT,           "+
							"SUM(NVL(CODE_A_ZYD, 0)) CODE_A_ZYD,           "+
							"SUM(NVL(CODE_A_DLD, 0)) CODE_A_DLD,           "+
							"SUM(NVL(CODE_A_TOTAL, 0)) CODE_A_TOTAL,       "+
							"SUM(NVL(CODE_B_HZT, 0)) CODE_B_HZT,           "+
							"SUM(NVL(CODE_B_ZYD, 0)) CODE_B_ZYD,           "+
							"SUM(NVL(CODE_B_DLD, 0)) CODE_B_DLD,           "+
							"SUM(NVL(CODE_B_TOTAL, 0)) CODE_B_TOTAL,       "+
							"SUM(NVL(CODE_C_HZT, 0)) CODE_C_HZT,           "+
							"SUM(NVL(CODE_C_ZYD, 0)) CODE_C_ZYD,           "+
							"SUM(NVL(CODE_C_DLD, 0)) CODE_C_DLD,           "+
							"SUM(NVL(CODE_C_TOTAL, 0)) CODE_C_TOTAL,       "+
							"SUM(NVL(CODE_D_HZT, 0)) CODE_D_HZT,           "+
							"SUM(NVL(CODE_D_ZYD, 0)) CODE_D_ZYD,           "+
							"SUM(NVL(CODE_D_DLD, 0)) CODE_D_DLD,           "+
							"SUM(NVL(CODE_D_TOTAL, 0)) CODE_D_TOTAL,       "+
							"SUM(NVL(CODE_OTHER_HZT, 0)) CODE_OTHER_HZT,   "+
							"SUM(NVL(CODE_OTHER_ZYD, 0)) CODE_OTHER_ZYD,   "+
							"SUM(NVL(CODE_OTHER_DLD, 0)) CODE_OTHER_DLD,   "+
							"SUM(NVL(CODE_OTHER_TOTAL, 0)) CODE_OTHER_TOTAL FROM(";
			var channelName=$.trim($("#channelName").val());
			where+=" AND T1.DEAL_DATE ="+month;
			if(channelName!=""&&channelName!=null){
				where+=" AND T1.CHANNEL_NAME LIKE '%"+channelName+"%'";
			}
		    if($tr){
		    	 level=$tr.attr("orgLevel");
		    	 code=$tr.attr("code");
				if(level==2){
					/*groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME";
					orderBy=" ORDER BY T1.GROUP_ID_1";
					sql="SELECT T1.GROUP_ID_1_NAME AS ROWNAME,T1.GROUP_ID_1 AS CODE,"+getSumSql(field)+where+groupBy+orderBy; 
					level++;*/
					 sql="SELECT T.DEAL_DATE,T.UNIT_ID AS CODE,T.UNIT_NAME AS ROWNAME,"+resultSql+" SELECT T1.UNIT_ID ,T1.UNIT_NAME,T1.DEAL_DATE, "+getSumSql(field);
					 where+=" AND T1.GROUP_ID_1='"+code+"'";
					 groupBy+=" GROUP BY T1.UNIT_ID,T1.UNIT_NAME,T1.DEAL_DATE";
					 /*orderBy=" ORDER BY T1.UNIT_ID ";*/
					 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,UNIT_ID,UNIT_NAME ORDER BY UNIT_ID";
					 level++;
				}else if(level==3){
					 sql="SELECT T.DEAL_DATE,T.HR_ID AS CODE,T.HR_ID_NAME AS ROWNAME,"+resultSql+" SELECT T1.HR_ID ,T1.HR_ID_NAME,T1.DEAL_DATE, "+getSumSql(field);
					 where+=" AND T1.UNIT_ID='"+code+"'";
					 groupBy+=" GROUP BY T1.HR_ID,T1.HR_ID_NAME,T1.DEAL_DATE";
					 /*orderBy=" ORDER BY T1.HR_ID ";*/
					 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,HR_ID,HR_ID_NAME ORDER BY HR_ID";
					 level++;
				}else if(level==4){
					 sql="SELECT T.DEAL_DATE,T.GROUP_ID_4 AS CODE,T.GROUP_ID_4_NAME AS ROWNAME,"+resultSql+" SELECT T1.GROUP_ID_4 ,T1.GROUP_ID_4_NAME,T1.DEAL_DATE, "+getSumSql(field);
					 where+=" AND T1.HR_ID='"+code+"'";
					 groupBy+=" GROUP BY T1.GROUP_ID_4,T1.GROUP_ID_4_NAME,T1.DEAL_DATE";
					/* orderBy=" ORDER BY T1.GROUP_ID_4 ";*/
					 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,GROUP_ID_4,GROUP_ID_4_NAME ORDER BY GROUP_ID_4";
					 level++;
				}else{
					sql="SELECT * FROM dual where 1=2";
				}
			}else{
			 if(level==1){
				 sql="SELECT T.DEAL_DATE,T.GROUP_ID_1 AS CODE,T.GROUP_ID_1_NAME AS ROWNAME,"+resultSql+" SELECT T1.GROUP_ID_1 ,T1.GROUP_ID_1_NAME,T1.DEAL_DATE, "+getSumSql(field);
				 groupBy+=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.DEAL_DATE";
				/* orderBy=" ORDER BY T1.GROUP_ID_1 ";*/
				 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,GROUP_ID_1,GROUP_ID_1_NAME ORDER BY GROUP_ID_1";
				 level++;
			 }else if(level==2){
				 sql="SELECT T.DEAL_DATE,T.UNIT_ID AS CODE,T.UNIT_NAME AS ROWNAME,"+resultSql+" SELECT T1.UNIT_ID ,T1.UNIT_NAME,T1.DEAL_DATE, "+getSumSql(field);
				 where+=" aND T1.GROUP_ID_1='"+code+"'";
				 groupBy+=" GROUP BY T1.UNIT_ID,T1.UNIT_NAME,T1.DEAL_DATE";
				/* orderBy=" ORDER BY T1.UNIT_ID ";*/
				 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,UNIT_ID,UNIT_NAME ORDER BY UNIT_ID";
				 level++;
				 /*where+=" AND T1.GROUP_ID_1='"+code+"'";
				 groupBy=" GROUP BY T1.UNIT_ID,T1.UNIT_NAME";
				 sql="SELECT T1.UNIT_NAME AS ROWNAME,T1.UNIT_ID AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;*/
			 }else if(level==3){
				 sql="SELECT T.DEAL_DATE,T.HR_ID AS CODE,T.HR_ID_NAME AS ROWNAME,"+resultSql+" SELECT T1.HR_ID ,T1.HR_ID_NAME,T1.DEAL_DATE, "+getSumSql(field);
				 where+=" aND T1.UNIT_ID='"+code+"'";
				 groupBy+=" GROUP BY T1.HR_ID,T1.HR_ID_NAME,T1.DEAL_DATE";
				/* orderBy=" ORDER BY T1.HR_ID ";*/
				 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,HR_ID,HR_ID_NAME ORDER BY HR_ID";
				 level++;
				 
				 /*
				 where+=" AND T1.UNIT_ID='"+code+"'";
				 groupBy=" GROUP BY T1.HR_ID,T1.HR_ID_NAME";
				 sql="SELECT T1.HR_ID_NAME AS ROWNAME,T1.HR_ID AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;*/
			 }else{
				 sql="SELECT T.DEAL_DATE,T.GROUP_ID_4 AS CODE,T.GROUP_ID_4_NAME AS ROWNAME,"+resultSql+" SELECT T1.GROUP_ID_4 ,T1.GROUP_ID_4_NAME,T1.DEAL_DATE, "+getSumSql(field);
				 where+=" aND T1.HR_ID='"+code+"'";
				 groupBy+=" GROUP BY T1.GROUP_ID_4,T1.GROUP_ID_4_NAME,T1.DEAL_DATE";
				 /*orderBy=" ORDER BY T1.GROUP_ID_4 ";*/
				 sql+=where+groupBy+orderBy+")T GROUP BY DEAL_DATE,GROUP_ID_4,GROUP_ID_4_NAME ORDER BY GROUP_ID_4";
				 level++;
				 /*where+=" AND T1.HR_ID='"+code+"'";
				 groupBy=" GROUP BY T1.GROUP_ID_4,T1.GROUP_ID_4_NAME";
				 sql="SELECT T1.GROUP_ID_4_NAME AS ROWNAME,T1.GROUP_ID_4 AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;*/
			 }
			}
			var d=query(sql);
			return {data : d,extra : {"orgLevel":level}};
		}
	});
	report.showSubRow();
	report.showAllCols(0);
///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
		report.showAllCols(0);
///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});
function getSumSql(field){
	var s="sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'S' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_S_HZT,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'S' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%专营店%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_S_ZYD,                                                            "+
	"sum(CASE                                                                        "+
	"       WHEN T1.INTEGRAL_GRADE = 'S' AND T2.CHN_CDE_3_NAME LIKE '%代理点%' then  "+
	"        1                                                                       "+
	"       else                                                                     "+
	"        0                                                                       "+
	"     end) CODE_S_DLD,                                                           "+
	"sum(case                                                                        "+
	"      when t1.integral_grade = 'S' then                                         "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_S_TOTAL,                                                          "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'A' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_A_HZT,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'A' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%专营店%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_A_ZYD,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'A' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%代理点%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_A_DLD,                                                            "+
	"sum(case                                                                        "+
	"      when t1.integral_grade = 'A' then                                         "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_A_TOTAL,                                                          "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'B' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_B_HZT,                                                            "+
	"sum(CASE                                                                        "+
	"       WHEN T1.INTEGRAL_GRADE = 'B' AND T2.CHN_CDE_3_NAME LIKE '%专营店%' then  "+
	"        1                                                                       "+
	"       else                                                                     "+
	"        0                                                                       "+
	"     end) CODE_B_ZYD,                                                           "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'B' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%代理点%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_B_DLD,                                                            "+
	"sum(case                                                                        "+
	"      when t1.integral_grade = 'B' then                                         "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_B_TOTAL,                                                          "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'C' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_C_HZT,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'C' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%专营店%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_C_ZYD,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'C' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%代理点%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_C_DLD,                                                            "+
	"sum(case                                                                        "+
	"      when t1.integral_grade = 'C' then                                         "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_C_TOTAL,                                                          "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'D' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_D_HZT,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'D' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%专营店%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_D_ZYD,                                                            "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = 'D' AND                                          "+
	"           T2.CHN_CDE_3_NAME LIKE '%代理点%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_D_DLD,                                                            "+
	"sum(case                                                                        "+
	"      when t1.integral_grade = 'D' then                                         "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_D_TOTAL,                                                          "+
	"                                                                                "+
	"      sum(CASE                                                                  "+
	"      WHEN T1.INTEGRAL_GRADE = '待评' AND                                       "+
	"           T2.CHN_CDE_3_NAME LIKE '%合作营业厅%' then                           "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_OTHER_HZT,                                                        "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE = '待评' AND                                       "+
	"           T2.CHN_CDE_3_NAME LIKE '%专营店%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_OTHER_ZYD,                                                        "+
	"sum(CASE                                                                        "+
	"      WHEN T1.INTEGRAL_GRADE =  '待评' AND                                      "+
	"           T2.CHN_CDE_3_NAME LIKE '%代理点%' then                               "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_OTHER_DLD,                                                        "+
	"sum(case                                                                        "+
	"      when t1.integral_grade =  '待评' then                                     "+
	"       1                                                                        "+
	"      else                                                                      "+
	"       0                                                                        "+
	"    end) CODE_OTHER_TOTAL                                                       "+
	"FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T1,                                       "+
	"PCDE.TB_CDE_CHANL_HQ_CODE       T2                                              "+
	"WHERE T1.FD_CHNL_ID = T2.HQ_CHAN_CODE(+)                                        ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var month = $("#month").val();
    var code=$("#code").val();
    var level=$("#orgLevel").val();
	var groupBy=" GROUP BY T1.DEAL_DATE,T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T1.UNIT_NAME,T1.HR_ID,T1.HR_ID_NAME,T1.GROUP_ID_4,T1.GROUP_ID_4_NAME";
	var where="  AND T1.DEAL_DATE ='"+month+"' AND T1.INTEGRAL_SUB = 1 ";
	var orderBy=" ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HR_ID,T1.GROUP_ID_4 ";
	var sql="SELECT T1.DEAL_DATE,T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.HR_ID_NAME,T1.GROUP_ID_4_NAME,"+getSumSql(field);
	var channelName=$.trim($("#channelName").val());
	if(channelName!=""&&channelName!=null){
		where+=" AND T1.CHANNEL_NAME LIKE '%"+channelName+"%'";
	}
	if(level==1){
		
	}else if(level==2){
		where+=" AND T1.GROUP_ID_1='"+code+"'";
	}else if(level==3){
		where+=" AND T1.UNIT_ID='"+code+"'";
	}else if(level==4){
		where+=" AND T1.HR_ID='"+code+"'";
	}else{
		where+=" AND 1=2";
	}
	sql+=where+groupBy+orderBy;
	showtext = '社会渠道积分分值分布月表-' + month;
	var title=[["地市","营服中心","人员名称","渠道名称","账期","S","","","","A","","","","B","","","","C","","","","D","","","","待评","","",""],
	           ["","","","","","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计","合作营业厅","专营店","代理点","合计"]]
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////