var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","ZHWJ_ALL_NUM","ZHWJ_ST_RATE","ZHWJ_ST_RATEHB" ,"ZHWJ_DEV_NUM" ,"ZHWJ_DEV_NUM1" ,"ZHWJ_HB" ,"ZHWJ_CL_NUM" ,"ZHWJ_DEV_NUM" ,"ZHWJ_ST_RATE_NEW" ,"TV_ALL_NUM" ,"TV_ST_RATE","TV_ST_RATEHB","TV_DEV_NUM","TV_DEV_NUM1","TV_HB","TV_CL_NUM","TV_DEV_NUM","TV_ST_RATE_NEW"];
	var title=[["组织架构","智慧沃家情况","","","","","","","","","沃家电视情况","","","","","","","",""],
			   ["组织架构","总体情况","","","发展情况","","","","","","总体情况","","","发展情况","","","","",""],
			   ["组织架构","智慧沃家用户数","渗透率","渗透率环比","当日发展用户数","当月累计发展数","累计环比","存量用户发展数","新增用户发展数","新增用户渗透率","沃家电视用户数","渗透率","渗透率环比","当日发展用户数","当月累计发展数","累计环比","存量用户发展数","新增用户发展数","新增用户渗透率"]];
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
			var dealDate=$("#dealDate").val();
			var chanCode=$("#chanCode").val();
			var hrId=$("#hrId").val();
			
			var where="";
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
			}
			if(chanCode!=''){
				where+= " AND HQ_CHAN_CODE ='"+chanCode+"'";
			}
			if(hrId!=''){
				where+= " AND HR_ID ='"+hrId+"'";
			}
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){//省进去点击市
					
				}else if(orgLevel==3){//省进去点击市
					where+=" AND GROUP_ID_1="+code;
				}else if(orgLevel==4){//点击市
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){//点击营服
					where+=" AND HR_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel,dealDate);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1="+code;
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==4){//渠道
					where+=" AND HR_ID='"+code+"'";
				}else if(orgLevel==5){
					where+=" AND HALL_CODE='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel,dealDate);
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

function getSql(where,orgLevel,dealDate){
	var sql="";
	if(orgLevel==1){ //省级
	sql = "SELECT T.ROW_ID                                                                         "+
	"      ,T.ROW_NAME                                                                       "+
	"      ,T.ZHWJ_ALL_NUM                                                                   "+
	"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,2) ZHWJ_ST_RATE                "+
	"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,3)           "+
	"                      ,PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,T1.ALL_INNET_NUM,3)         "+
	"                      ,2) ZHWJ_ST_RATEHB                                                "+
	"      ,T.ZHWJ_DEV_NUM                                                                   "+
	"      ,T.ZHWJ_DEV_NUM1                                                                  "+
	"      ,PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1,T1.ZHWJ_DEV_NUM1,2) ZHWJ_HB                      "+
	"      ,T.ZHWJ_CL_NUM                                                                    "+
	"      ,T.ZHWJ_DEV_NUM                                                                   "+
	"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1,T.ALL_DEV_NUM1,2) ZHWJ_ST_RATE_NEW            "+
	"      ,T.TV_ALL_NUM                                                                     "+
	"      ,PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM,T.ALL_INNET_NUM,2) TV_ST_RATE                    "+
	"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,T.ALL_INNET_NUM,3)             "+
	"                      ,PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,T1.ALL_INNET_NUM,3)           "+
	"                      ,2) TV_ST_RATEHB                                                  "+
	"      ,T.TV_DEV_NUM                                                                     "+
	"      ,T.TV_DEV_NUM1                                                                    "+
	"      ,PMRT.LINK_RATIO(T.TV_DEV_NUM1,T1.TV_DEV_NUM1,2) TV_HB                            "+
	"      ,T.TV_CL_NUM                                                                      "+
	"      ,T.TV_DEV_NUM                                                                     "+
	"      ,PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1,T.ALL_DEV_NUM1,2) TV_ST_RATE_NEW                "+
	"FROM (                                                                                  "+
	"      SELECT GROUP_ID_0             ROW_ID                                              "+
	"            ,'全省'                 ROW_NAME                                            "+
	"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                   "+
	"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                     "+
	"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                    "+
	"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                    "+
	"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                     "+
	"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                      "+
	"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                      "+
	"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                       "+
	"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                   "+
	"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                  "+
	"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                    "+
	"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                               "+
	"      WHERE DEAL_DATE="+dealDate+"                                                          "+
	//"           --其他筛选条件                                                             "+
	where+
	"      GROUP BY GROUP_ID_0                                                               "+
	")T                                                                                      "+
	"LEFT JOIN (                                                                             "+
	"      SELECT GROUP_ID_0             ROW_ID                                              "+
	"            ,'全省'                 ROW_NAME                                            "+
	"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                   "+
	"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                     "+
	"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                    "+
	"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                    "+
	"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                     "+
	"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                      "+
	"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                      "+
	"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                       "+
	"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                   "+
	"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                  "+
	"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                    "+
	"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                               "+
	"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')   "+
	//"      --其他筛选条件                                                                  "+
	where+
	"      GROUP BY GROUP_ID_0                                                               "+
	")T1                                                                                     "+
	"ON(T.ROW_ID=T1.ROW_ID)     ";
	}else if(orgLevel==2){//地市级
		sql = "SELECT T.ROW_ID                                                                        "+
		"      ,T.ROW_NAME                                                                      "+
		"      ,T.ZHWJ_ALL_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,2) ZHWJ_ST_RATE               "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,3)          "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,T1.ALL_INNET_NUM,3)        "+
		"                      ,2) ZHWJ_ST_RATEHB                                               "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,T.ZHWJ_DEV_NUM1                                                                 "+
		"      ,PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1,T1.ZHWJ_DEV_NUM1,2) ZHWJ_HB                     "+
		"      ,T.ZHWJ_CL_NUM                                                                   "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1,T.ALL_DEV_NUM1,2) ZHWJ_ST_RATE_NEW           "+
		"      ,T.TV_ALL_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM,T.ALL_INNET_NUM,2) TV_ST_RATE                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,T.ALL_INNET_NUM,3)            "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,T1.ALL_INNET_NUM,3)          "+
		"                      ,2) TV_ST_RATEHB                                                 "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,T.TV_DEV_NUM1                                                                   "+
		"      ,PMRT.LINK_RATIO(T.TV_DEV_NUM1,T1.TV_DEV_NUM1,2) TV_HB                           "+
		"      ,T.TV_CL_NUM                                                                     "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1,T.ALL_DEV_NUM1,2) TV_ST_RATE_NEW               "+
		"FROM (                                                                                 "+
		"      SELECT GROUP_ID_1             ROW_ID                                             "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE="+dealDate+"                                                         "+
		//"           --其他筛选条件                                                            "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		")T                                                                                     "+
		"LEFT JOIN (                                                                            "+
		"      SELECT GROUP_ID_1             ROW_ID                                             "+
		"            ,GROUP_ID_1_NAME        ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')  "+
		//"      --其他筛选条件                                                                 "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		")T1                                                                                    "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";
	}else if(orgLevel==3){ //营服级
		sql = "SELECT T.ROW_ID                                                                        "+
		"      ,T.ROW_NAME                                                                      "+
		"      ,T.ZHWJ_ALL_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,2) ZHWJ_ST_RATE               "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,3)          "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,T1.ALL_INNET_NUM,3)        "+
		"                      ,2) ZHWJ_ST_RATEHB                                               "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,T.ZHWJ_DEV_NUM1                                                                 "+
		"      ,PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1,T1.ZHWJ_DEV_NUM1,2) ZHWJ_HB                     "+
		"      ,T.ZHWJ_CL_NUM                                                                   "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1,T.ALL_DEV_NUM1,2) ZHWJ_ST_RATE_NEW           "+
		"      ,T.TV_ALL_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM,T.ALL_INNET_NUM,2) TV_ST_RATE                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,T.ALL_INNET_NUM,3)            "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,T1.ALL_INNET_NUM,3)          "+
		"                      ,2) TV_ST_RATEHB                                                 "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,T.TV_DEV_NUM1                                                                   "+
		"      ,PMRT.LINK_RATIO(T.TV_DEV_NUM1,T1.TV_DEV_NUM1,2) TV_HB                           "+
		"      ,T.TV_CL_NUM                                                                     "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1,T.ALL_DEV_NUM1,2) TV_ST_RATE_NEW               "+
		"FROM (                                                                                 "+
		"      SELECT GROUP_ID_1                                                                "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                ROW_ID                                             "+
		"            ,UNIT_NAME              ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE="+dealDate+"                                                         "+
		//"           --其他筛选条件                                                              "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		")T                                                                                     "+
		"LEFT JOIN (                                                                            "+
		"      SELECT GROUP_ID_1                                                                "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                ROW_ID                                             "+
		"            ,UNIT_NAME              ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')  "+
		//"      --其他筛选条件                                                                   "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		")T1                                                                                    "+
		"ON(T.ROW_ID=T1.ROW_ID)    ";
	}else if(orgLevel==4){ //宽固经理
		sql = "SELECT T.ROW_ID                                                                        "+
		"      ,T.ROW_NAME                                                                      "+
		"      ,T.ZHWJ_ALL_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,2) ZHWJ_ST_RATE               "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,3)          "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,T1.ALL_INNET_NUM,3)        "+
		"                      ,2) ZHWJ_ST_RATEHB                                               "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,T.ZHWJ_DEV_NUM1                                                                 "+
		"      ,PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1,T1.ZHWJ_DEV_NUM1,2) ZHWJ_HB                     "+
		"      ,T.ZHWJ_CL_NUM                                                                   "+
		"      ,T.ZHWJ_DEV_NUM                                                                  "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1,T.ALL_DEV_NUM1,2) ZHWJ_ST_RATE_NEW           "+
		"      ,T.TV_ALL_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM,T.ALL_INNET_NUM,2) TV_ST_RATE                   "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,T.ALL_INNET_NUM,3)            "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,T1.ALL_INNET_NUM,3)          "+
		"                      ,2) TV_ST_RATEHB                                                 "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,T.TV_DEV_NUM1                                                                   "+
		"      ,PMRT.LINK_RATIO(T.TV_DEV_NUM1,T1.TV_DEV_NUM1,2) TV_HB                           "+
		"      ,T.TV_CL_NUM                                                                     "+
		"      ,T.TV_DEV_NUM                                                                    "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1,T.ALL_DEV_NUM1,2) TV_ST_RATE_NEW               "+
		"FROM (                                                                                 "+
		"      SELECT GROUP_ID_1                                                                "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		"            ,HR_ID                  ROW_ID                                             "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE="+dealDate+"                                                         "+
		//"           --其他筛选条件                                                              "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		"            ,HR_ID                                                                     "+
		"            ,HQ_MANAGE_NAME                                                            "+
		")T                                                                                     "+
		"LEFT JOIN (                                                                            "+
		"      SELECT GROUP_ID_1                                                                "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		"            ,HR_ID                  ROW_ID                                             "+
		"            ,HQ_MANAGE_NAME         ROW_NAME                                           "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                  "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                    "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                    "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                     "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                     "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                      "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                 "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                   "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                              "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')  "+
		//"      --其他筛选条件                                                                   "+
		where+
		"      GROUP BY GROUP_ID_1                                                              "+
		"            ,GROUP_ID_1_NAME                                                           "+
		"            ,UNIT_ID                                                                   "+
		"            ,UNIT_NAME                                                                 "+
		"            ,HR_ID                                                                     "+
		"            ,HQ_MANAGE_NAME                                                            "+
		"                                                                                       "+
		")T1                                                                                    "+
		"ON(T.ROW_ID=T1.ROW_ID)  ";  
	}else if(orgLevel==5){ //渠道级
		sql = "SELECT T.ROW_ID                                                                       "+
		"      ,T.ROW_NAME                                                                     "+
		"      ,T.ZHWJ_ALL_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,2) ZHWJ_ST_RATE              "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,T.ALL_INNET_NUM,3)         "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,T1.ALL_INNET_NUM,3)       "+
		"                      ,2) ZHWJ_ST_RATEHB                                              "+
		"      ,T.ZHWJ_DEV_NUM                                                                 "+
		"      ,T.ZHWJ_DEV_NUM1                                                                "+
		"      ,PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1,T1.ZHWJ_DEV_NUM1,2) ZHWJ_HB                    "+
		"      ,T.ZHWJ_CL_NUM                                                                  "+
		"      ,T.ZHWJ_DEV_NUM                                                                 "+
		"      ,PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1,T.ALL_DEV_NUM1,2) ZHWJ_ST_RATE_NEW          "+
		"      ,T.TV_ALL_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM,T.ALL_INNET_NUM,2) TV_ST_RATE                  "+
		"      ,PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,T.ALL_INNET_NUM,3)           "+
		"                      ,PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,T1.ALL_INNET_NUM,3)         "+
		"                      ,2) TV_ST_RATEHB                                                "+
		"      ,T.TV_DEV_NUM                                                                   "+
		"      ,T.TV_DEV_NUM1                                                                  "+
		"      ,PMRT.LINK_RATIO(T.TV_DEV_NUM1,T1.TV_DEV_NUM1,2) TV_HB                          "+
		"      ,T.TV_CL_NUM                                                                    "+
		"      ,T.TV_DEV_NUM                                                                   "+
		"      ,PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1,T.ALL_DEV_NUM1,2) TV_ST_RATE_NEW              "+
		"FROM (                                                                                "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                                "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                 "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                  "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                   "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                    "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                    "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                     "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                 "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                  "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                             "+
		"      WHERE DEAL_DATE="+dealDate+"                                                        "+
		//"           --其他筛选条件                                                             "+
		where+
		"      GROUP BY GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                                "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE                                                             "+
		"            ,GROUP_ID_4_NAME                                                          "+
		")T                                                                                    "+
		"LEFT JOIN (                                                                           "+
		"      SELECT GROUP_ID_1                                                               "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                                "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE           ROW_ID                                            "+
		"            ,GROUP_ID_4_NAME        ROW_NAME                                          "+
		"            ,NVL(SUM(ALL_INNET_NUM),0)  ALL_INNET_NUM                                 "+
		"            ,NVL(SUM(ALL_DEV_NUM  ),0)  ALL_DEV_NUM                                   "+
		"            ,NVL(SUM(ZHWJ_ALL_NUM ),0)  ZHWJ_ALL_NUM                                  "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM ),0)  ZHWJ_DEV_NUM                                  "+
		"            ,NVL(SUM(ZHWJ_CL_NUM  ),0)  ZHWJ_CL_NUM                                   "+
		"            ,NVL(SUM(TV_ALL_NUM   ),0)  TV_ALL_NUM                                    "+
		"            ,NVL(SUM(TV_DEV_NUM   ),0)  TV_DEV_NUM                                    "+
		"            ,NVL(SUM(TV_CL_NUM    ),0)  TV_CL_NUM                                     "+
		"            ,NVL(SUM(ALL_DEV_NUM1  ),0)  ALL_DEV_NUM1                                 "+
		"            ,NVL(SUM(ZHWJ_DEV_NUM1 ),0)  ZHWJ_DEV_NUM1                                "+
		"            ,NVL(SUM(TV_DEV_NUM1   ),0)  TV_DEV_NUM1                                  "+
		"      FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                             "+
		"      WHERE DEAL_DATE=TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD') "+
		//"      --其他筛选条件                                                                  "+
		where+
		"      GROUP BY GROUP_ID_1                                                             "+
		"            ,GROUP_ID_1_NAME                                                          "+
		"            ,UNIT_ID                                                                  "+
		"            ,UNIT_NAME                                                        "+
		"            ,HR_ID                                                                    "+
		"            ,HQ_MANAGE_NAME                                                           "+
		"            ,HQ_CHAN_CODE                                                             "+
		"            ,GROUP_ID_4_NAME                                                          "+
		")T1                                                                                   "+
		"ON(T.ROW_ID=T1.ROW_ID)   ";
	}
	return sql;
}

function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var chanCode=$("#chanCode").val();
	var hrId=$("#hrId").val();
	var where="";
	if(orgLevel==1){//省
		
	}else if(orgLevel==2){//市
		where+=" AND GROUP_ID_1="+code;
	}else if(orgLevel==3){//营服
		where+=" AND UNIT_ID='"+code+"'";
	}else {
		where+=" AND HR_ID='"+code+"'";
	}
		
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	if(chanCode!=''){
		where+= " AND HQ_CHAN_CODE ='"+chanCode+"'";
	}
	if(hrId!=''){
		where+= " AND HR_ID ='"+hrId+"'";
	}
	
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_MANAGE_NAME","HR_ID","ROW_ID","ROW_NAME","ZHWJ_ALL_NUM","ZHWJ_ST_RATE","ZHWJ_ST_RATEHB" ,"ZHWJ_DEV_NUM" ,"ZHWJ_DEV_NUM1" ,"ZHWJ_HB" ,"ZHWJ_CL_NUM" ,"ZHWJ_DEV_NUM" ,"ZHWJ_ST_RATE_NEW" ,"TV_ALL_NUM" ,"TV_ST_RATE","TV_ST_RATEHB","TV_DEV_NUM","TV_DEV_NUM1","TV_HB","TV_CL_NUM","TV_DEV_NUM","TV_ST_RATE_NEW"];
	var title=[["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","智慧沃家情况","","","","","","","","","沃家电视情况","","","","","","","",""],
			   ["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","总体情况","","","发展情况","","","","","","总体情况","","","发展情况","","","","",""],
			   ["地市","营服","渠道经理","渠道经理HR","渠道编码","渠道名称","智慧沃家用户数","渗透率","渗透率环比","当日发展用户数","当月累计发展数","累计环比","存量用户发展数","新增用户发展数","新增用户渗透率","沃家电视用户数","渗透率","渗透率环比","当日发展用户数","当月累计发展数","累计环比","存量用户发展数","新增用户发展数","新增用户渗透率"]];
	var sql ="SELECT T.GROUP_ID_1_NAME,                                              "+
    "       T.UNIT_NAME ,                                                             "+
    "       T.HQ_MANAGE_NAME ,                                                        "+
    "       T.HR_ID ,                                                                 "+
    "       T.ROW_ID ,                                                                "+
    "       T.ROW_NAME,                                                               "+
    "       T.ZHWJ_ALL_NUM,                                                           "+
    "       PMRT.LINK_RATIO_ZB(T.ZHWJ_ALL_NUM, T.ALL_INNET_NUM, 2) ZHWJ_ST_RATE,      "+
    "       PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.ZHWJ_ALL_NUM,                      "+
    "                                            T.ALL_INNET_NUM,                     "+
    "                                            3),                                  "+
    "                       PMRT.LINK_RATIO_RATE(T1.ZHWJ_ALL_NUM,                     "+
    "                                            T1.ALL_INNET_NUM,                    "+
    "                                            3),                                  "+
    "                       2) ZHWJ_ST_RATEHB,                                        "+
    "       T.ZHWJ_DEV_NUM,                                                           "+
    "       T.ZHWJ_DEV_NUM1,                                                          "+
    "       PMRT.LINK_RATIO(T.ZHWJ_DEV_NUM1, T1.ZHWJ_DEV_NUM1, 2) ZHWJ_HB,            "+
    "       T.ZHWJ_CL_NUM,                                                            "+
    "       PMRT.LINK_RATIO_ZB(T.ZHWJ_DEV_NUM1, T.ALL_DEV_NUM1, 2) ZHWJ_ST_RATE_NEW,  "+
    "       T.TV_ALL_NUM,                                                             "+
    "       PMRT.LINK_RATIO_ZB(T.TV_ALL_NUM, T.ALL_INNET_NUM, 2) TV_ST_RATE,          "+
    "       PMRT.LINK_RATIO(PMRT.LINK_RATIO_RATE(T.TV_ALL_NUM,                        "+
    "                                            T.ALL_INNET_NUM,                     "+
    "                                            3),                                  "+
    "                       PMRT.LINK_RATIO_RATE(T1.TV_ALL_NUM,                       "+
    "                                            T1.ALL_INNET_NUM,                    "+
    "                                            3),                                  "+
    "                       2) TV_ST_RATEHB,                                          "+
    "       T.TV_DEV_NUM,                                                             "+
    "       T.TV_DEV_NUM1,                                                            "+
    "       PMRT.LINK_RATIO(T.TV_DEV_NUM1, T1.TV_DEV_NUM1, 2) TV_HB,                  "+
    "       T.TV_CL_NUM,                                                              "+
    "       PMRT.LINK_RATIO_ZB(T.TV_DEV_NUM1, T.ALL_DEV_NUM1, 2) TV_ST_RATE_NEW       "+
    "  FROM (SELECT GROUP_ID_1,                                                       "+
    "               GROUP_ID_1_NAME,                                                  "+
    "               UNIT_ID,                                                          "+
    "               UNIT_NAME,                                                        "+
    "               HR_ID,                                                            "+
    "               HQ_MANAGE_NAME,                                                   "+
    "               HQ_CHAN_CODE ROW_ID,                                              "+
    "               GROUP_ID_4_NAME ROW_NAME,                                         "+
    "               NVL(SUM(ALL_INNET_NUM), 0) ALL_INNET_NUM,                         "+
    "               NVL(SUM(ALL_DEV_NUM), 0) ALL_DEV_NUM,                             "+
    "               NVL(SUM(ZHWJ_ALL_NUM), 0) ZHWJ_ALL_NUM,                           "+
    "               NVL(SUM(ZHWJ_DEV_NUM), 0) ZHWJ_DEV_NUM,                           "+
    "               NVL(SUM(ZHWJ_CL_NUM), 0) ZHWJ_CL_NUM,                             "+
    "               NVL(SUM(TV_ALL_NUM), 0) TV_ALL_NUM,                               "+
    "               NVL(SUM(TV_DEV_NUM), 0) TV_DEV_NUM,                               "+
    "               NVL(SUM(TV_CL_NUM), 0) TV_CL_NUM,                                 "+
    "               NVL(SUM(ALL_DEV_NUM1), 0) ALL_DEV_NUM1,                           "+
    "               NVL(SUM(ZHWJ_DEV_NUM1), 0) ZHWJ_DEV_NUM1,                         "+
    "               NVL(SUM(TV_DEV_NUM1), 0) TV_DEV_NUM1                              "+
    "          FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                    "+
    "         WHERE DEAL_DATE = "+dealDate+"                                              "+
    where +
    "         GROUP BY GROUP_ID_1,                                                    "+
    "                  GROUP_ID_1_NAME,                                               "+
    "                  UNIT_ID,                                                       "+
    "                  UNIT_NAME,                                                     "+
    "                  HR_ID,                                                         "+
    "                  HQ_MANAGE_NAME,                                                "+
    "                  HQ_CHAN_CODE,                                                  "+
    "                  GROUP_ID_4_NAME) T                                             "+
    "  LEFT JOIN (SELECT GROUP_ID_1,                                                  "+
    "                   GROUP_ID_1_NAME,                                              "+
    "                   UNIT_ID,                                                      "+
    "                   UNIT_NAME,                                                    "+
    "                   HR_ID,                                                        "+
    "                   HQ_MANAGE_NAME,                                               "+
    "                   HQ_CHAN_CODE ROW_ID,                                          "+
    "                   GROUP_ID_4_NAME ROW_NAME,                                     "+
    "                   NVL(SUM(ALL_INNET_NUM), 0) ALL_INNET_NUM,                     "+
    "                   NVL(SUM(ALL_DEV_NUM), 0) ALL_DEV_NUM,                         "+
    "                   NVL(SUM(ZHWJ_ALL_NUM), 0) ZHWJ_ALL_NUM,                       "+
    "                   NVL(SUM(ZHWJ_DEV_NUM), 0) ZHWJ_DEV_NUM,                       "+
    "                   NVL(SUM(ZHWJ_CL_NUM), 0) ZHWJ_CL_NUM,                         "+
    "                   NVL(SUM(TV_ALL_NUM), 0) TV_ALL_NUM,                           "+
    "                   NVL(SUM(TV_DEV_NUM), 0) TV_DEV_NUM,                           "+
    "                   NVL(SUM(TV_CL_NUM), 0) TV_CL_NUM,                             "+
    "                   NVL(SUM(ALL_DEV_NUM1), 0) ALL_DEV_NUM1,                       "+
    "                   NVL(SUM(ZHWJ_DEV_NUM1), 0) ZHWJ_DEV_NUM1,                     "+
    "                   NVL(SUM(TV_DEV_NUM1), 0) TV_DEV_NUM1                          "+
    "              FROM PMRT.TB_MRT_KDGJ_ZZ_DETAIL_DAY                                "+
    "             WHERE DEAL_DATE =                                                   "+
    "                   TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",                          "+
    "                                              'YYYYMMDD'),                       "+
    "                                      -1),                                       "+
    "                           'YYYYMMDD')                                           "+
    where +
    "             GROUP BY GROUP_ID_1,                                                "+
    "                      GROUP_ID_1_NAME,                                           "+
    "                      UNIT_ID,                                                   "+
    "                      UNIT_NAME,                                                 "+
    "                      HR_ID,                                                     "+
    "                      HQ_MANAGE_NAME,                                            "+
    "                      HQ_CHAN_CODE,                                              "+
    "                      GROUP_ID_4_NAME) T1                                        "+
    "    ON (T.ROW_ID = T1.ROW_ID)  ";
	
	showtext = "增值类日报";
	downloadExcel(sql,title,showtext);
}
