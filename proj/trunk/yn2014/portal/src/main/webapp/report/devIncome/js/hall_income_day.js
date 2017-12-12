var title="";
var field="";
var startDate="";
var endDate="";
var regionCode="";
var operateType="";
var sumSql="";
$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_HALL_INCOME_DAY");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	search();
	$("#searchBtn").click(function(){
		$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		search();
	});
});
function search(){
	startDate=$("#startDate").val();
	endDate=$("#endDate").val();
	if(startDate==endDate){
		title=[["组织架构","经营模式","厅类型","全业务（移动网+宽带）","","","","","其中移动网收入","","","","","其中固网收入","","","","","智慧沃家（万元）","","","","","2I2C（万元）","","",""],
		       ["","","","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比"]
			];
		field=["OPERATE_TYPE","CHNL_TYPE","ALL_SR","ALL_SR1","ALL_HBJZ","ALL_LJHB","YWGW_01","THIS_YW_SR","THIS_YW_SR1","YW_HBJZ","YW_LJHB","YW_01","THIS_NET_SR","THIS_NET_SR1","NET_HBJZ","NET_LJHB","NET_01","THIS_ZHWJ_SR","THIS_ZHWJ_SR1","ZHWJ_HBJZ","ZHWJ_LJHB","ZHWJ_01","THIS_2I2C_SR","THIS_2I2C_SR1","HBJZ_2I2C","LJHB_2I2C"];
	    sumSql=getSumSql();
	}else{
		title=[["组织架构","经营模式","厅类型","全业务（移动网+宽带）","","其中移动网收入","","其中固网收入","","智慧沃家（万元）","","2I2C（万元）",""],
		       ["","","","累计","累计环比","累计","累计环比","累计","累计环比","累计","累计环比","累计","累计环比"]];
		field=["OPERATE_TYPE","CHNL_TYPE","ALL_SR","ALL_LJHB","THIS_YW_SR","YW_LJHB","THIS_NET_SR","NET_LJHB","THIS_ZHWJ_SR","ZHWJ_LJHB","THIS_2I2C_SR","HB_2I2C"];
		sumSql=getSumSql1();
	}
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
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var region =$("#region").val();
			var chnlCode = $("#chnlCode").val();
			regionCode=$("#regionCode").val();
			operateType=$("#operateType").val();
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,\'--\' CHNL_TYPE,';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
				}else if(orgLevel==3){//点击市
					preField=' BUS_HALL_NAME ROW_NAME,OPERATE_TYPE,CHNL_TYPE,';
					groupBy=' GROUP BY BUS_HALL_NAME ,OPERATE_TYPE,CHNL_TYPE';
					where=' AND GROUP_ID_1=\''+code+'\'';
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' \'云南省 \' ROW_NAME,\'86000\' ROW_ID,\'--\' AS OPERATE_TYPE,\'--\' CHNL_TYPE,';
					groupBy=' GROUP BY GROUP_ID_0';
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,\'--\' CHNL_TYPE,';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					where=' AND GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else if(orgLevel==3){
					preField=' GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,\'--\' AS OPERATE_TYPE,\'--\' CHNL_TYPE,';
					groupBy=' GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ';
					where=' AND GROUP_ID_1=\''+code+'\'';
					orgLevel=3;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chnlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chnlCode+"' ";
			}
			var sql='SELECT'+preField+sumSql+where+groupBy;
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
function getSumSql() {
    var s=
    	"      SUM(NVL(ALL_SR,0))  ALL_SR                                       												"+		//--当日
    	"      ,SUM(NVL(ALL_SR1,0))  ALL_SR1                                     												"+		//--本月累计
    	"      ,SUM(NVL(ALL_SR1,0))-SUM(NVL(LAST_ALL1,0))  ALL_HBJZ              												"+		//--环比净增
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ALL1,0))<>0			                                                "+	    //
    	"                                 THEN (SUM(NVL(ALL_SR1,0))-SUM(NVL(LAST_ALL1,0)))*100/SUM(NVL(LAST_ALL1,0))			"+	    //
    	"                                 ELSE 0 END|| '%',2)  ALL_LJHB                          								"+		//--累计环比
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(YWGW_01,0))<>0			                                                "+	    //
    	"                                 THEN SUM(NVL(ALL_SR1,0))*100/SUM(NVL(YWGW_01,0))			                            "+	    //
    	"                                 ELSE 0 END || '%' ,2)        YWGW_01                    								"+		//--定比1月
    	"      ,SUM(NVL(THIS_YW_SR,0))  THIS_YW_SR                                       										"+		//--当日
    	"      ,SUM(NVL(THIS_YW_SR1,0))  THIS_YW_SR1                                     										"+		//--本月累计
    	"      ,SUM(NVL(THIS_YW_SR1,0))-SUM(NVL(LAST_YW_SR1,0))  YW_HBJZ              											"+		//--环比净增
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_YW_SR1,0))<>0                                                       "+	    //
    	"                                 THEN (SUM(NVL(THIS_YW_SR1,0))-SUM(NVL(LAST_YW_SR1,0)))*100/SUM(NVL(LAST_YW_SR1,0))    "+	    //
    	"                                 ELSE 0 END|| '%',2)     YW_LJHB                      								 	"+		//--累计环比
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(YW_01,0))<>0                                                             "+	    //
    	"                                 THEN SUM(NVL(THIS_YW_SR1,0))*100/SUM(NVL(YW_01,0))                                    "+	    //
    	"                                 ELSE 0 END || '%' ,2)         YW_01                   								"+		//--定比1月   
    	"      ,SUM(NVL(THIS_NET_SR,0))  THIS_NET_SR                                       										"+		//--当日
    	"      ,SUM(NVL(THIS_NET_SR1,0))  THIS_NET_SR1                                     										"+		//--本月累计
    	"      ,SUM(NVL(THIS_NET_SR1,0))-SUM(NVL(LAST_NET_SR1,0))  NET_HBJZ             		 								"+		//--环比净增
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_NET_SR1,0))<>0                                                      "+	    //
    	"                                 THEN (SUM(NVL(THIS_NET_SR1,0))-SUM(NVL(LAST_NET_SR1,0)))*100/SUM(NVL(LAST_NET_SR1,0)) "+	    //
    	"                                 ELSE 0 END|| '%',2)     NET_LJHB                       								"+		//--累计环比
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(NET_01,0))<>0							                                "+	    //
    	"                                 THEN SUM(NVL(THIS_NET_SR1,0))*100/SUM(NVL(NET_01,0))							        "+	    //
    	"                                 ELSE 0 END || '%' ,2)    NET_01                        								"+		//--定比1月   
    	"      ,SUM(NVL(THIS_ZHWJ_SR,0))  THIS_ZHWJ_SR                                       									"+		//--当日
    	"      ,SUM(NVL(THIS_ZHWJ_SR1,0))  THIS_ZHWJ_SR1                                     									"+		//--本月累计
    	"      ,SUM(NVL(THIS_ZHWJ_SR1,0))-SUM(NVL(LAST_ZHWJ_SR1,0))  ZHWJ_HBJZ              									"+		//--环比净增
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ZHWJ_SR1,0))<>0                                                     "+	    //
    	"                                 THEN (SUM(NVL(THIS_ZHWJ_SR1,0))-SUM(NVL(LAST_ZHWJ_SR1,0)))*100/SUM(NVL(LAST_ZHWJ_SR1,0))"+	    //
    	"                                 ELSE 0 END|| '%',2)     ZHWJ_LJHB                       								"+		//--累计环比
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(ZHWJ_01,0))<>0                                                           "+	    //
    	"                                 THEN SUM(NVL(THIS_ZHWJ_SR1,0))*100/SUM(NVL(ZHWJ_01,0))                                "+	    //
    	"                                 ELSE 0 END || '%' ,2)       ZHWJ_01                     								"+		//--定比1月                                                                   
    	
    	",SUM(NVL(THIS_2I2C_SR, 0)) THIS_2I2C_SR,                                                         "+
    	"      SUM(NVL(THIS_2I2C_SR1, 0)) THIS_2I2C_SR1,                                                 "+
    	"      SUM(NVL(THIS_2I2C_SR1, 0)) - SUM(NVL(LAST_2I2C_SR1, 0)) HBJZ_2I2C,                        "+
    	"      PODS.GET_RADIX_POINT(CASE                                                                 "+
    	"                             WHEN SUM(NVL(LAST_2I2C_SR1, 0)) <> 0 THEN                          "+
    	"                              (SUM(NVL(THIS_2I2C_SR1, 0)) - SUM(NVL(LAST_2I2C_SR1, 0))) * 100 / "+
    	"                              SUM(NVL(LAST_2I2C_SR1, 0))                                        "+
    	"                             ELSE                                                               "+
    	"                              0                                                                 "+
    	"                           END || '%',                                                          "+
    	"                           2) LJHB_2I2C                                                         "+
    	"  FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY                                                                               "+	
    	" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                                          ";
	return s;
}

function getSumSql1() {
    var s=
    	"      SUM(NVL(ALL_SR,0))  ALL_SR                                                                           			"+	 	//--累计
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ALL,0))<>0	                                                        "+	
    	"                                 THEN (SUM(NVL(ALL_SR,0))-SUM(NVL(LAST_ALL,0)))*100/SUM(NVL(LAST_ALL,0))	            "+	
    	"                                 ELSE 0 END|| '%',2)  ALL_LJHB                                               			"+	 	//--累计环比
    	"      ,SUM(NVL(THIS_YW_SR,0))  THIS_YW_SR                                                                     			"+	 	//--累计
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_YW_SR,0))<>0	                                                    "+	
    	"                                 THEN (SUM(NVL(THIS_YW_SR,0))-SUM(NVL(LAST_YW_SR,0)))*100/SUM(NVL(LAST_YW_SR,0))	    "+	
    	"                                 ELSE 0 END|| '%',2)     YW_LJHB                                                		"+	 	//--累计环比 
    	"      ,SUM(NVL(THIS_NET_SR,0))  THIS_NET_SR                                                                       		"+	 	//--累计
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_NET_SR,0))<>0	                                                    "+	
    	"                                 THEN (SUM(NVL(THIS_NET_SR,0))-SUM(NVL(LAST_NET_SR,0)))*100/SUM(NVL(LAST_NET_SR,0))	"+	
    	"                                 ELSE 0 END|| '%',2)     NET_LJHB                                                   	"+	 	//--累计环比 
    	"      ,SUM(NVL(THIS_ZHWJ_SR,0))  THIS_ZHWJ_SR                                                                       	"+	 	//--累计
    	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(NVL(LAST_ZHWJ_SR,0))<>0	                                                    "+	
    	"                                 THEN (SUM(NVL(THIS_ZHWJ_SR,0))-SUM(NVL(LAST_ZHWJ_SR,0)))*100/SUM(NVL(LAST_ZHWJ_SR,0))	"+	 
    	"                                 ELSE 0 END|| '%',2)     ZHWJ_LJHB                                                     "+		//--累计环比 
    	
    	",SUM(NVL(THIS_2I2C_SR, 0)) THIS_2I2C_SR,                                                        "+
    	"PODS.GET_RADIX_POINT(CASE                                                                      "+
    	"                              WHEN SUM(NVL(LAST_2I2C_SR, 0)) <> 0 THEN                         "+
    	"                               (SUM(NVL(THIS_2I2C_SR, 0)) - SUM(NVL(LAST_2I2C_SR, 0))) * 100 / "+
    	"                               SUM(NVL(LAST_2I2C_SR, 0))                                       "+
    	"                              ELSE                                                             "+
    	"                               0                                                               "+
    	"                            END || '%',                                                        "+
    	"                            2) HB_2I2C                                                         "+
    	"  FROM PMRT.TB_MRT_BUS_HALL_INCOME_DAY 	                                                                            "+	
    	" WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'                                                          ";
	return s;
}
function downsAll() {
	var preField=' GROUP_ID_1_NAME,BUS_HALL_NAME,CHNL_TYPE,HQ_CHAN_CODE,OPERATE_TYPE,';
	var where='';
	var orderBy=" ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
	var groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,CHNL_TYPE,HQ_CHAN_CODE,OPERATE_TYPE";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var regionCode =$("#regionCode").val();
	var region =$("#region").val();
	var chnlCode = $("#chnlCode").val();
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where = " AND GROUP_ID_1='" + region + "' ";
	} 
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chnlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chnlCode+"' ";
	}
	var sql = 'SELECT' + preField + sumSql+where+groupBy+orderBy;
	var showtext = '营业厅收入报表' + startDate+"-"+endDate;
	if(startDate==endDate){
		title=[["地市","营业厅","厅类型","渠道编码","经营模式","全业务（移动网+宽带）","","","","","其中移动网收入","","","","","其中固网收入","","","","","智慧沃家（万元）","","","","","2I2C（万元）","","",""],
		       ["","","","","","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比","定比1月%","当日","本月累计","环比净增","环比"]
			];
	}else{
		title=[["地市","营业厅","厅类型","渠道编码","经营模式","全业务（移动网+宽带）","","其中移动网收入","","其中固网收入","","智慧沃家（万元）","","2I2C（万元）",""],
		       ["","","","","","累计","累计环比","累计","累计环比","累计","累计环比","累计","累计环比","累计","累计环比"]];
	}
	downloadExcel(sql,title,showtext);
}
