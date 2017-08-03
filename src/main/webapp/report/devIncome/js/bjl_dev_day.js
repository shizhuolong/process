$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_BJL_DEV_DAY"));
	var title=[["组织架构","营业厅编码","经营模式","厅类型","冰激凌套餐发展量（含金惠）","","","其中398元档","","其中198元档","","其中本地199元档","","其中本地99元档","","其中金惠",""],
	           ["","","","","日发展","本月累计","月环比","日发展","本月累计","日发展","本月累计","日发展","本月累计","日发展","本月累计","日发展","本月累计"]];
    var field=["HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","ALL_NUM","ALL_NUM1","HB_ALL","BJL_398_NUM","BJL_398_NUM1","BJL_198_NUM","BJL_198_NUM1","BJL_199_NUM","BJL_199_NUM1","BJL_99_NUM","BJL_99_NUM1","BJL_JH_NUM","BJL_JH_NUM1"];
    $("#searchBtn").click(function(){
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
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var hallType=$("#hallType").val();
			var groupBy = "";
			var where="";
			var level;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_0='"+code+"'";
					level=2;
				}else if(orgLevel==3){//点击市
					preField=" SELECT T.HQ_CHAN_CODE ROW_ID,T.BUS_HALL_NAME ROW_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,T.CHNL_TYPE,";
					groupBy = " GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_HALL_NAME,T.OPERATE_TYPE,T.CHNL_TYPE";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#region").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT '86000' ROW_ID,'云南省' ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY T.GROUP_ID_0"; 
					where+=" AND T.GROUP_ID_0='86000'";
					level=1;
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT T.GROUP_ID_1 ROW_ID,T.GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME";
					where+=" AND T.GROUP_ID_1='"+code+"'";
					orgLevel=2;
					level=2;
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}
			if(regionCode!=""){
				where+=" AND T.GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND T.OPERATE_TYPE='"+operateType+"'";
			}
			if(hallType!=""){
				where += " AND T.CHNL_TYPE ='"+hallType+"' ";
			}
			if(chanlCode!=""){
				where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			
			var sql=getSumSql(preField,where,groupBy,level);
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

function getSumSql(preField,where,groupBy,level) {
	var dealDate = $("#dealDate").val();
	var preLevel="";
	if(level==1){
		preLevel+="SELECT T.GROUP_ID_0";
	}else if(level==2){
		preLevel+="SELECT T.GROUP_ID_1,T.GROUP_ID_1_NAME";
	}else{
		preLevel+="SELECT T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.HQ_CHAN_CODE,T.BUS_HALL_NAME,T.OPERATE_TYPE,T.CHNL_TYPE";
	}
	var sql= preField+"     T.ALL_NUM                                                                                              "+
	"       ,T.ALL_NUM1                                                                                                            "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN T1.ALL_NUM1<>0                                                                         "+
	"                                  THEN T.ALL_NUM1/T1.ALL_NUM1*100-1                                                       "+
	"                                  ELSE 0                                                                                          "+
	"                                  END || '%' ,2)    HB_ALL                                                                        "+
	"       ,T.BJL_398_NUM                                                                                                             "+
	"       ,T.BJL_398_NUM1                                                                                                            "+
	"       ,T.BJL_198_NUM                                                                                                             "+
	"       ,T.BJL_198_NUM1                                                                                                            "+
	"       ,T.BJL_199_NUM                                                                                                             "+
	"       ,T.BJL_199_NUM1                                                                                                            "+
	"       ,T.BJL_99_NUM                                                                                                              "+
	"       ,T.BJL_99_NUM1                                                                                                             "+
	",T.BJL_JH_NUM"+
    ",T.BJL_JH_NUM1 "+
	"FROM (                                                                                                                            "+
	        preLevel+
	"            ,SUM(ALL_NUM)   ALL_NUM                                                                                       "+
	"            ,SUM(ALL_NUM1)  ALL_NUM1                                                                                      "+
	"            ,SUM(BJL_398_NUM)   BJL_398_NUM                                                                                       "+
	"            ,SUM(BJL_398_NUM1)  BJL_398_NUM1                                                                                      "+
	"            ,SUM(BJL_199_NUM)   BJL_199_NUM                                                                                       "+
	"            ,SUM(BJL_199_NUM1)  BJL_199_NUM1                                                                                      "+
	"            ,SUM(BJL_198_NUM)   BJL_198_NUM                                                                                       "+
	"            ,SUM(BJL_198_NUM1)  BJL_198_NUM1                                                                                      "+
	"            ,SUM(BJL_99_NUM)    BJL_99_NUM                                                                                        "+
	"            ,SUM(BJL_99_NUM1)   BJL_99_NUM1                                                                                       "+
	",SUM(BJL_JH_NUM) BJL_JH_NUM"+
	",SUM(BJL_JH_NUM1) BJL_JH_NUM1 "+
	"      FROM PMRT.TB_MRT_BUS_BJL_DEV_DAY T                                                                                          "+
	"      WHERE T.DEAL_DATE='"+dealDate+"'                                                                                            "+
	             where+
	           groupBy+
	")T                                                                                                                                "+
	"LEFT JOIN (                                                                                                                       "+
	       preLevel+
	"                  ,SUM(ALL_NUM)   ALL_NUM                                                                                 "+
	"                  ,SUM(ALL_NUM1)  ALL_NUM1                                                                                "+
	"                  ,SUM(BJL_398_NUM)   BJL_398_NUM                                                                                 "+
	"                  ,SUM(BJL_398_NUM1)  BJL_398_NUM1                                                                                "+
	"                  ,SUM(BJL_199_NUM)   BJL_199_NUM                                                                                 "+
	"                  ,SUM(BJL_199_NUM1)  BJL_199_NUM1                                                                                "+
	"                  ,SUM(BJL_198_NUM)   BJL_198_NUM                                                                                 "+
	"                  ,SUM(BJL_198_NUM1)  BJL_198_NUM1                                                                                "+
	"                  ,SUM(BJL_99_NUM)    BJL_99_NUM                                                                                  "+
	"                  ,SUM(BJL_99_NUM1)   BJL_99_NUM1                                                                                 "+
	"            FROM PMRT.TB_MRT_BUS_BJL_DEV_DAY T                                                                                    "+
	"            WHERE T.DEAL_DATE='"+getLastMonSameDay(dealDate)+"'                                                                   "+
	                where+
	              groupBy;
	
	if(level==1){
		sql+=")T1 ON T.GROUP_ID_0 =T1.GROUP_ID_0";
	}else if(level==2){
		sql+=")T1 ON T.GROUP_ID_1 =T1.GROUP_ID_1";
	}else{
		 sql+=")T1 ON T.HQ_CHAN_CODE =T1.HQ_CHAN_CODE";
	}
	return sql;               
}

function downsAll() {
	var preField=" SELECT T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,T.CHNL_TYPE,";
	var groupBy= " GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME,T.BUS_HALL_NAME,T.HQ_CHAN_CODE,T.OPERATE_TYPE,T.CHNL_TYPE ";
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var hallType=$("#hallType").val();
	var where ="";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND T.GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND T.OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND T.CHNL_TYPE ='"+hallType+"' ";
	}
	if(chanlCode!=""){
		where += " AND T.HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	
	var sql = getSumSql(preField,where,groupBy,3);
	var showtext = '冰激凌套餐发展日通报-' + dealDate;
	var title=[["地市","营业厅名称","营业厅编码","经营模式","厅类型","冰激凌套餐发展量（含金惠）","","","其中398元档","","其中198元档","","其中本地199元档","","其中本地99元档","","其中含金惠",""],
	           ["","","","","","日发展","本月累计","月环比","日发展","本月累计","日发展","本月累计","日发展","本月累计","日发展","本月累计","日发展","本月累计"]];
	downloadExcel(sql,title,showtext);
}

function getLastMonSameDay(dealDate){
	var yearMon=dealDate.substr(0,6);
	var year=dealDate.substr(0,4);
	var mon=yearMon.substr(4,6);
	var day=dealDate.substr(6,8);
	if(mon=="01"){
		return (year-1)+"12"+day;
	}
	return (yearMon-1)+""+day;
}