$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_LITTLE_CHNL_DAY");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","当月累计拓展网点数","当年累计网点数","当年易售宝累计网点数","当年沃云霄累计网点数","当月有销量网点占比","所有网点当日销量","所有网点当月累计销量","所有网点当月店均产能","当年累计销量"]]; 
	var field=["ROW_NAME","THIS_MONTH_CHNL","THIS_YEAR_CHNL","THIS_YEAR_YSB","THIS_YEAR_WYX","DEV_NUM_ZB","THIS_DEV_NUM","THIS_DEV_NUM1","CHNL_PRODUCE","THIS_DEV_YESR"];
	$("#searchBtn").click(function(){
		report.showSubRow();
        ///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		field:field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var code='';
			var orgLevel='';
			var where=' WHERE 1=1';
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示渠道
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where);
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

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var dealDate=$("#dealDate").val();
	var where=' WHERE 1=1';
	if (orgLevel == 1) {//省
		
	} else if(orgLevel==2){//市
		where += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel==3){//营服
		where += " AND UNIT_ID='"+code+"'";
	} else{
		where += " AND 1=2";
	}
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	var sql = "SELECT GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME"+getDownSql()+where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,CREATE_TIME,IS_TYPE"+" ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	var showtext = '小微渠道-' + dealDate;
	var title=[["地市","营服编码","营服名称","渠道编码","渠道名称","当月累计拓展网点数","当年累计网点数","当年易售宝累计网点数","当年沃云霄累计网点数","当月有销量网点占比","所有网点当日销量","所有网点当月累计销量","所有网点当月店均产能","当年累计销量","创建时间","渠道类型"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var preSql="";
	var groupBy="";
	var orderBy="";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
		orderBy=" ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
		orderBy=" ORDER BY UNIT_ID";
	}else{
		preSql="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME";
		groupBy=" GROUP BY HQ_CHAN_CODE,HQ_CHAN_NAME";
		orderBy=" ORDER BY HQ_CHAN_CODE";
	}
	return preSql+getSumSql()+where+groupBy+orderBy;
  }

function getSumSql(){
	var dealDate=$("#dealDate").val();
	return "      ,SUM(NVL(T.THIS_MONTH_CHNL,0))THIS_MONTH_CHNL                                   "+
	"      ,SUM(NVL(T.THIS_YEAR_CHNL,0))THIS_YEAR_CHNL                                            "+
	"      ,SUM(NVL(T.THIS_YEAR_YSB,0))THIS_YEAR_YSB                                            "+
	"      ,SUM(NVL(T.THIS_YEAR_WYX,0))THIS_YEAR_WYX                                            "+
	"      ,ROUND(CASE WHEN SUM(NVL(T.THIS_YEAR_CHNL,0))=0 THEN 0                                 "+
	"            ELSE COUNT(CASE WHEN NVL(T.THIS_DEV_NUM1,0)<>0 THEN T.HQ_CHAN_CODE END)           "+
	"              /SUM(NVL(T.THIS_YEAR_CHNL,0)) END ,2)DEV_NUM_ZB                                "+
	"      ,SUM(NVL(T.THIS_DEV_NUM,0))THIS_DEV_NUM                                                "+
	"      ,SUM(NVL(T.THIS_DEV_NUM1,0))THIS_DEV_NUM1                                              "+
	"      ,ROUND(CASE WHEN SUM(NVL(T.THIS_YEAR_CHNL,0))=0 THEN 0                                 "+
	"            ELSE SUM(NVL(T.THIS_DEV_NUM1,0))/SUM(NVL(T.THIS_YEAR_CHNL,0)) END ,2)CHNL_PRODUCE"+
	"      ,SUM(NVL(T.THIS_DEV_YESR,0))THIS_DEV_YESR                                              "+
	"FROM PMRT.TAB_MRT_LITTLE_CHNL_DAY PARTITION(P"+dealDate+")T                                  ";
}
function getDownSql(){
	var dealDate=$("#dealDate").val();
	return "      ,SUM(NVL(T.THIS_MONTH_CHNL,0))THIS_MONTH_CHNL                                   "+
	"      ,SUM(NVL(T.THIS_YEAR_CHNL,0))THIS_YEAR_CHNL                                            "+
	"      ,SUM(NVL(T.THIS_YEAR_YSB,0))THIS_YEAR_YSB                                            "+
	"      ,SUM(NVL(T.THIS_YEAR_WYX,0))THIS_YEAR_WYX                                            "+
	"      ,ROUND(CASE WHEN SUM(NVL(T.THIS_YEAR_CHNL,0))=0 THEN 0                                 "+
	"            ELSE COUNT(CASE WHEN NVL(T.THIS_DEV_NUM1,0)<>0 THEN T.HQ_CHAN_CODE END)           "+
	"              /SUM(NVL(T.THIS_YEAR_CHNL,0)) END ,2)DEV_NUM_ZB                                "+
	"      ,SUM(NVL(T.THIS_DEV_NUM,0))THIS_DEV_NUM                                                "+
	"      ,SUM(NVL(T.THIS_DEV_NUM1,0))THIS_DEV_NUM1                                              "+
	"      ,ROUND(CASE WHEN SUM(NVL(T.THIS_YEAR_CHNL,0))=0 THEN 0                                 "+
	"            ELSE SUM(NVL(T.THIS_DEV_NUM1,0))/SUM(NVL(T.THIS_YEAR_CHNL,0)) END ,2)CHNL_PRODUCE"+
	"      ,SUM(NVL(T.THIS_DEV_YESR,0))THIS_DEV_YESR, CREATE_TIME,IS_TYPE                         "+
	"FROM PMRT.TAB_MRT_LITTLE_CHNL_DAY PARTITION(P"+dealDate+")T                                  ";
}