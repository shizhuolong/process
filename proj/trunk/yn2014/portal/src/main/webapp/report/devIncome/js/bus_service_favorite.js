$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_BUS_SERVICE_FAVORITE_HZ");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","州市","厅数(自营)","服务用户数","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	          ["","","","1月","","2月","","3月","","4月","","5月","","6月","","7月","","8月","","9月","","10月","","11月","","12月","","环比","同比","定比1月"],
	          ["","","","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","发展与偏好一致","发展与偏好不一致","","",""]];
	var field=["ROW_NAME","GROUP_ID_1_NAME","HALL_COUNT","USER_NUM1","USER_NUM_1","USER_NUM2","USER_NUM_2","USER_NUM3","USER_NUM_3","USER_NUM4","USER_NUM_4","USER_NUM5","USER_NUM_5","USER_NUM6","USER_NUM_6","USER_NUM7","USER_NUM_7","USER_NUM8","USER_NUM_8","USER_NUM9","USER_NUM_9","USER_NUM10","USER_NUM_10","USER_NUM11","USER_NUM_11","USER_NUM12","USER_NUM_12","HB","TB","DB"];
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
			var dealDate=$("#dealDate").val();
			var where="WHERE DEAL_DATE='"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					where+=" AND GROUP_LEVLE=2";
					where+=" AND GROUP_ID_1<>86000";
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
					where+=" AND GROUP_LEVLE=3";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//
					//where+=" AND GROUP_ID_1='"+code+"'";
					where+=" AND GROUP_ID_1=86000";
					where+=" AND GROUP_LEVLE=2";
				}else if(orgLevel==2){
					where+=" AND GROUP_ID_1='"+code+"'";
					where+=" AND GROUP_LEVLE=2";
					where+=" AND GROUP_ID_1<>86000";
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
	var dealDate=$("#dealDate").val();
	var title=[["地市","渠道编码","渠道名称","偏好渠道名称","偏好渠道编码","厅类型（旗舰/标准/小型）","电话号码","用户编码","入网时间","套餐名称","上月出账金额","上月赠费金额","上月使用流量","上月通话使用时长","前2个月出账金额","前2个月赠费金额","前2个月使用流量","前2个月通话时长","前3个月出账金额","前3个月赠费金额","前3个月使用流量","前3个月通话时长","前4个月出账金额","前4个月赠费金额","前4个月使用流量","前4个月通话时长","前5个月出账金额","前5个月赠费金额","前5个月使用流量","前5个月通话时长","前6个月出账金额","前6个月赠费金额","前6个月使用流量","前6个月通话时长"]];
	var sql=getDownSql();
	showtext = '自营厅服务用户数渠道偏好统计月报-'+dealDate;
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var preSql="";
	var groupBy="";
	var orderBy="";
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME";
		orderBy=" ORDER BY HALL_COUNT DESC";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME";
		orderBy=" ORDER BY HALL_COUNT DESC";
	}else if(orgLevel==3){
		preSql="SELECT BUS_HALL_NAME ROW_NAME";
		orderBy=" ORDER BY HALL_COUNT DESC";
	}
	return preSql+getSumSql()+where+orderBy;
  }

function getSumSql(){
	return ",GROUP_ID_1_NAME,HALL_COUNT,USER_NUM1,USER_NUM_1,USER_NUM2,USER_NUM_2,USER_NUM3,USER_NUM_3,USER_NUM4,USER_NUM_4,USER_NUM5,USER_NUM_5,USER_NUM6,USER_NUM_6,USER_NUM7,USER_NUM_7,USER_NUM8,USER_NUM_8,USER_NUM9,USER_NUM_9,USER_NUM10,USER_NUM_10,USER_NUM11,USER_NUM_11,USER_NUM12,USER_NUM_12,HB,TB,DB "+
	"FROM PMRT.TB_MRT_BUS_SERVICE_FAVORITE_HZ ";
}

function getDownSql(){
	var dealDate=$("#dealDate").val();
	var sql= "SELECT GROUP_ID_1_NAME                                                            "+
	"      ,HQ_CHAN_CODE                                                                        "+
	"      ,BUS_HALL_NAME                                                                       "+
	"      ,HQ_CHAN_CODE1                                                                       "+
	"      ,BUS_HALL_NAME1                                                                      "+
	"      ,CHNL_TYPE                                                                           "+
	"      ,DEVICE_NUMBER                                                                       "+
	"      ,SUBSCRIPTION_ID                                                                     "+
	"      ,INNET_DATE                                                                          "+
	"      ,PRODUCT_NAME                                                                        "+
	"      ,NVL(LAST_SR_NUM    ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM    ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM  ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM ,0)                                                              "+
	"      ,NVL(LAST_SR_NUM2   ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM2   ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM2 ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM2,0)                                                              "+
	"      ,NVL(LAST_SR_NUM3   ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM3   ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM3 ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM3,0)                                                              "+
	"      ,NVL(LAST_SR_NUM4   ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM4   ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM4 ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM4,0)                                                              "+
	"      ,NVL(LAST_SR_NUM5   ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM5   ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM5 ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM5,0)                                                              "+
	"      ,NVL(LAST_SR_NUM6   ,0)                                                              "+
	"      ,NVL(LAST_ZF_NUM6   ,0)                                                              "+
	"      ,NVL(LAST_FLOW_NUM6 ,0)                                                              "+
	"      ,NVL(LAST_VOICE_NUM6,0)                                                              "+
	"FROM PMRT.TB_MRT_BUS_SERVICE_FAVORITE WHERE DEAL_DATE='"+dealDate+"' AND HQ_CHAN_CODE1 IS NOT NULL ";
	
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";
	}
	return sql;
 }
