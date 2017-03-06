$(function(){
	var dealDate=$("#dealDate").val();
	var title=[["组织架构","渠道编码","经营模式(自营/柜台)","厅类型（旗舰/标准/小型)","2016年12月","2017年1月","","2017年2月","","2017年3月","","2017年4月","","2017年5月","","2017年6月","","2017年7月","","2017年8月","","2017年9月","","2017年10月","","2017年11月","","2017年12月",""],
	           ["","","","","拍照收入(考核口径)","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率"]];
    var field=["HQ_CHAN_CODE","OPERATE_TYPE","CHNL_TYPE","LAST_12_NUM","DY_BLL_01","LJ_BLL_01","DY_BLL_02","LJ_BLL_02","DY_BLL_03","LJ_BLL_03","DY_BLL_04","LJ_BLL_04","DY_BLL_05","LJ_BLL_05","DY_BLL_06","LJ_BLL_06","DY_BLL_07","LJ_BLL_07","DY_BLL_08","LJ_BLL_08","DY_BLL_09","LJ_BLL_09","DY_BLL_10","LJ_BLL_10","DY_BLL_11","LJ_BLL_11","DY_BLL_12","LJ_BLL_12"];
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
			var chanlCode = $("#chanlCode").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var hallType=$("#hallType").val();
			var groupBy = "";
			var where="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy= " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市
					preField=" SELECT HQ_CHAN_CODE ROW_ID,BUS_HALL_NAME ROW_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE,";
					groupBy = " GROUP BY GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE ";
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
					preField=" SELECT '86000' ROW_ID,'云南省' ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
					groupBy = " GROUP BY GROUP_ID_0 "; 
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2||orgLevel==3){//市
					preField=" SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' HQ_CHAN_CODE,'--' OPERATE_TYPE,'--' CHNL_TYPE,";
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
				where += " AND CHNL_TYPE ='"+hallType+"' ";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
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
	var dealDate = $("#dealDate").val();
	var year=dealDate.substr(0,4);
	return "      SUM(CASE WHEN DEAL_DATE='"+dealDate+"'                                                                 "+
	"                THEN NVL(LAST_12_NUM,0)                                                                             "+
	"                 END)  LAST_12_NUM                                                                                  "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(LAST_12_NUM,0) END )<>0       "+
	"                                 THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(THIS_SR_NUM,0) END )*100      "+
	"                                    / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(LAST_12_NUM,0) END )          "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)        DY_BLL_01                                                      "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(LAST_12_NUM,0) END )<>0       "+
	"                                 THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(THIS_SR_NUM1,0) END )*100     "+
	"                                    /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='01' THEN NVL(LAST_12_NUM,0) END)*1)        "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)       LJ_BLL_01                                                       "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    DY_BLL_02                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='02' THEN NVL(LAST_12_NUM,0) END)*2)       "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    LJ_BLL_02                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)      DY_BLL_03                                                        "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='03' THEN NVL(LAST_12_NUM,0) END)*3)       "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)    LJ_BLL_03                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)  DY_BLL_04                                                            "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='04' THEN NVL(LAST_12_NUM,0) END)*4)       "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    LJ_BLL_04                                                          "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(THIS_SR_NUM,0) END )*100    "+
	"                                      / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(LAST_12_NUM,0) END)         "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)     DY_BLL_05                                                         "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(THIS_SR_NUM1,0) END )*100   "+
	"                                      /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='05' THEN NVL(LAST_12_NUM,0) END)*5)      "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)    LJ_BLL_05                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    DY_BLL_06                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='06' THEN NVL(LAST_12_NUM,0) END)*6)       "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    LJ_BLL_06                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)     DY_BLL_07                                                         "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='07' THEN NVL(LAST_12_NUM,0) END)*7)       "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)   LJ_BLL_07                                                           "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)     DY_BLL_08                                                         "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='08' THEN NVL(LAST_12_NUM,0) END)*8)       "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    LJ_BLL_08                                                          "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(THIS_SR_NUM,0) END )*100    "+
	"                                      / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(LAST_12_NUM,0) END)         "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)    DY_BLL_09                                                          "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(THIS_SR_NUM1,0) END )*100   "+
	"                                      /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='09' THEN NVL(LAST_12_NUM,0) END)*9)      "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)    LJ_BLL_09                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)     DY_BLL_10                                                         "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(THIS_SR_NUM1,0) END )*100    "+
	"                                     /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='10' THEN NVL(LAST_12_NUM,0) END)*10)      "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)    LJ_BLL_10                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)   DY_BLL_11                                                           "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(THIS_SR_NUM1,0) END )*100   "+
	"                                      /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='11' THEN NVL(LAST_12_NUM,0) END)*11)     "+
	"                                 ELSE 0 END                                                                         "+
	"                                 ||  '%'  ,2)    LJ_BLL_11                                                          "+
	"       ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(LAST_12_NUM,0) END )<>0      "+
	"                                  THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(THIS_SR_NUM,0) END )*100     "+
	"                                     / SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(LAST_12_NUM,0) END)          "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)   DY_BLL_12                                                           "+
	"        ,PODS.GET_RADIX_POINT(CASE WHEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(LAST_12_NUM,0) END )<>0     "+
	"                                   THEN SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(THIS_SR_NUM1,0) END )*100   "+
	"                                      /(SUM(CASE WHEN SUBSTR(DEAL_DATE,5)='12' THEN NVL(LAST_12_NUM,0) END)*12)     "+
	"                                  ELSE 0 END                                                                        "+
	"                                 ||  '%'  ,2)   LJ_BLL_12                                                           "+                                                             
	"FROM PMRT.TB_MRT_BUS_HALL_SR_RATE_MON WHERE DEAL_DATE LIKE '%"+year+"%' AND DEAL_DATE<="+dealDate                    ;    
}

function downsAll() {
	var preField=" SELECT BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE,";
	var orderBy= " ORDER BY GROUP_ID_1,HQ_CHAN_CODE ";
	var groupBy= " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,BUS_HALL_NAME,HQ_CHAN_CODE,OPERATE_TYPE,CHNL_TYPE ";
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
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(hallType!=""){
		where += " AND CHNL_TYPE ='"+hallType+"' ";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = preField+getSumSql()+where+groupBy+orderBy;
	var showtext = '收入保有率月报表-' + dealDate;
	var title=[["厅名称","渠道编码","经营模式(自营/柜台)","厅类型（旗舰/标准/小型)","2016年12月","2017年1月","","2017年2月","","2017年3月","","2017年4月","","2017年5月","","2017年6月","","2017年7月","","2017年8月","","2017年9月","","2017年10月","","2017年11月","","2017年12月",""],
	           ["","","","","拍照收入(考核口径)","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率","当月保有率","累计保有率"]];
	downloadExcel(sql,title,showtext);
}
