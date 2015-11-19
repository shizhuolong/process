var field=["CODE_S","CODE_S_AVG","CODE_A","CODE_A_AVG","CODE_B","CODE_B_AVG","CODE_C","CODE_C_AVG","CODE_D","CODE_D_AVG","CODE_OTHER","CODE_OTHER_AVG","CHANNL_NUM","SUM_AVG"];
var orderBy='';	
$(function(){
	
	var report=new LchReport({
		title:[["营销架构","S","","A","","B","","C","","D","","待评","","合计",""],
	           ["","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分"]]
		,
		field:["ROWNAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["CODE","UNIT_ID"],//第一个为rowId
		content:"lchcontent",
		getSubRowsCallBack:function($tr){

			var code=$("#code").val();
			var level=$("#orgLevel").val();
			var month = $.trim($("#month").val());
		    var groupBy="";
		    var where="WHERE T1.INTEGRAL_SUB = '1' AND T1.DEAL_DATE ='"+month+"'";
			var orderBy="";
			var sql="";
			var channelName=$.trim($("#channelName").val());
			if(channelName!=""&&channelName!=null){
				where+=" AND T1.CHANNEL_NAME LIKE '%"+channelName+"%'";
			}
		    if($tr){
		    	 level=$tr.attr("orgLevel");
		    	 code=$tr.attr("code");
		    	 unitId=$tr.attr("unit_id");
				if(level==2){
					/*groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME";
					orderBy=" ORDER BY T1.GROUP_ID_1";
					sql="SELECT T1.GROUP_ID_1_NAME AS ROWNAME,T1.GROUP_ID_1 AS CODE,"+getSumSql(field)+where+groupBy+orderBy; 
					level++;*/
					where+=" AND T1.GROUP_ID_1='"+code+"'";
					groupBy=" GROUP BY T1.UNIT_ID,T1.UNIT_NAME";
					orderBy=" ORDER BY T1.UNIT_ID";
					sql="SELECT T1.UNIT_NAME AS ROWNAME,T1.UNIT_ID AS CODE,"+getSumSql(field)+where+groupBy+orderBy;
					level++;
				}else if(level==3){
					where+=" AND T1.UNIT_ID='"+code+"'";
					groupBy=" GROUP BY T1.UNIT_ID,T1.HR_ID,T1.HR_ID_NAME";
					orderBy=" ORDER BY T1.HR_ID";
					sql="SELECT T1.UNIT_ID,T1.HR_ID_NAME AS ROWNAME,T1.HR_ID AS CODE,"+getSumSql(field)+where+groupBy+orderBy; 
					level++;
				}else if(level==4){
					where+=" AND T1.HR_ID='"+code+"' AND T1.UNIT_ID='"+unitId+"'";
					groupBy=" GROUP BY T1.GROUP_ID_4,T1.GROUP_ID_4_NAME";
					orderBy=" ORDER BY T1.GROUP_ID_4";
					sql="SELECT T1.GROUP_ID_4_NAME AS ROWNAME,T1.GROUP_ID_4 AS CODE,"+getSumSql(field)+where+groupBy+orderBy; 
					level++;
				}else{
					sql="SELECT * FROM dual where 1=2";
				}
			}else{
			 if(level==1){
				/*sql="SELECT '云南省' AS ROWNAME,'86000' AS CODE,"+getSumSql(field)+where;
			    level++;*/
				/* where+=" AND T1.GROUP_ID_1='"+code+"'";*/
				 groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME";
				 sql="SELECT T1.GROUP_ID_1_NAME AS ROWNAME,T1.GROUP_ID_1 AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;
			 }else if(level==2){
				 where+=" AND T1.GROUP_ID_1='"+code+"'";
				 groupBy=" GROUP BY T1.UNIT_ID,T1.UNIT_NAME";
				 sql="SELECT T1.UNIT_NAME AS ROWNAME,T1.UNIT_ID AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;
			 }else if(level==3){
				 where+=" AND T1.UNIT_ID='"+code+"'";
				 groupBy=" GROUP BY T1.HR_ID,T1.HR_ID_NAME";
				 sql="SELECT T1.HR_ID_NAME AS ROWNAME,T1.HR_ID AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;
			 }else{
				 where+=" AND T1.HR_ID='"+code+"'";
				 groupBy=" GROUP BY T1.GROUP_ID_4,T1.GROUP_ID_4_NAME";
				 sql="SELECT T1.GROUP_ID_4_NAME AS ROWNAME,T1.GROUP_ID_4 AS CODE,"+getSumSql(field)+where+groupBy; 
				 level++;
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
	var s="SUM(CASE                                                     "+
	"      WHEN T1.INTEGRAL_GRADE = 'S' THEN                      "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_S,                                             "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = 'S' THEN                "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE = 'S' THEN     "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_S_AVG,                                         "+
	"SUM(CASE                                                     "+
	"      WHEN T1.INTEGRAL_GRADE = 'A' THEN                      "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_A,                                             "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = 'A' THEN                "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE = 'A' THEN     "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_A_AVG,                                         "+
	"SUM(CASE                                                     "+
	"      WHEN T1.INTEGRAL_GRADE = 'B' THEN                      "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_B,                                             "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = 'B' THEN                "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE = 'B' THEN     "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_B_AVG,                                         "+
	"SUM(CASE                                                     "+
	"      WHEN T1.INTEGRAL_GRADE = 'C' THEN                      "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_C,                                             "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = 'C' THEN                "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE = 'C' THEN     "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_C_AVG,                                         "+
	"SUM(CASE                                                     "+
	"      WHEN T1.INTEGRAL_GRADE = 'D' THEN                      "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_D,                                             "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = 'D' THEN                "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE = 'D' THEN     "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_D_AVG,                                         "+
	"      SUM(CASE                                               "+
	"      WHEN T1.INTEGRAL_GRADE = '待评' THEN                   "+
	"       1                                                     "+
	"      ELSE                                                   "+
	"       0                                                     "+
	"    END) CODE_OTHER,                                         "+
	"ROUND(SUM(CASE                                               "+
	"            WHEN T1.INTEGRAL_GRADE = '待评' THEN             "+
	"             T1.ALL_JF_TOTAL                                 "+
	"            ELSE                                             "+
	"             0                                               "+
	"          END) / SUM(CASE                                    "+
	"                       WHEN T1.INTEGRAL_GRADE ='待评' THEN   "+
	"                        1                                    "+
	"                       ELSE                                  "+
	"                        0.0000001                            "+
	"                     END),                                   "+
	"      3) CODE_OTHER_AVG,                                     "+
	"COUNT(1) CHANNL_NUM,                                         "+
	"ROUND(SUM(T1.ALL_JF_TOTAL) / COUNT(1)) SUM_AVG               "+
	"FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT T1                     ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var month = $("#month").val();
    var code=$("#code").val();
    var level=$("#orgLevel").val();
	var groupBy=" GROUP BY T1.GROUP_ID_1,T1.GROUP_ID_1_NAME,T1.UNIT_ID,T1.UNIT_NAME,T1.HR_ID,T1.HR_ID_NAME,T1.GROUP_ID_4,T1.GROUP_ID_4_NAME";
	var where="WHERE T1.INTEGRAL_SUB = '1' AND T1.DEAL_DATE ='"+month+"'";
	var orderBy=" ORDER BY T1.GROUP_ID_1,T1.UNIT_ID,T1.HR_ID,T1.GROUP_ID_4";
	var sql="SELECT T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.HR_ID_NAME,T1.GROUP_ID_4_NAME,"+getSumSql(field);
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
	var title=[["州市","营服中心","人员","渠道","S","","A","","B","","C","","D","","待评","","合计",""],
	           ["","","","","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分","渠道数量","平均积分"]]
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////