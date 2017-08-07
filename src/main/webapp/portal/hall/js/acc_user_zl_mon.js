$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_HQ_ACCT_USER_ZL_MON");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","移动网实收ARPU","其中2I2C实收ARPU","宽带实收ARPU","固话实收ARPU","本月三无极低用户数","近三个月三无极低用户数"]];
	var field=["ROW_NAME","ARPU_YW","ARPU_2I2C","ARPU_KD","ARPU_GH","SWJD_NUM","SWJD_NUML"];
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
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省，显示市
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示渠道经理
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){//点击渠道经理，展示渠道
					where+=" AND HQ_HR_ID='"+code+"'";
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
	var dealDate=$("#dealDate").val();
	var code=$("code").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var status=$("#status").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_hr_id=$("#hq_hr_id").val();
	var unit_type=$("#unit_type").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
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
	if(status!=""){
		where+=" AND STATUS ='"+status+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	if(unit_type!=""){
		where+=" AND UNIT_TYPE = '"+unit_type+"'";
	}
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_HR_ID","HQ_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","STATUS","ARPU_YW","ARPU_2I2C","ARPU_KD","ARPU_GH","SWJD_NUM","SWJD_NUML"];
	var preSql="SELECT GROUP_ID_1_NAME,UNIT_NAME,HQ_HR_ID,HQ_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,STATUS";
	var groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,HQ_HR_ID,HQ_NAME,HQ_CHAN_CODE,HQ_CHAN_NAME,STATUS";
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_HR_ID,HQ_CHAN_CODE";
	var sql = preSql+getSumSql()+where+groupBy+orderBy;
	var showtext = '出账用户质量月报-' + dealDate;
	var title=[["地市","营服","渠道经理HR","渠道经理","渠道编码","渠道名称","渠道状态","移动网实收ARPU","其中2I2C实收ARPU","宽带实收ARPU","固话实收ARPU","本月三无极低用户数","近三个月三无极低用户数"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var status=$("#status").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_hr_id=$("#hq_hr_id").val();
	var unit_type=$("#unit_type").val();
	var preSql="";
	var groupBy="";
	var orderBy="";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(status!=""){
		where+=" AND STATUS LIKE '%"+status+"%'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	if(unit_type!=""){
		where+=" AND UNIT_TYPE = '"+unit_type+"'";
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
	}else if(orgLevel==4){
		preSql="SELECT HQ_HR_ID ROW_ID,HQ_NAME ROW_NAME";
		groupBy=" GROUP BY HQ_HR_ID,HQ_NAME";
		orderBy=" ORDER BY HQ_HR_ID";
	}else{
		preSql="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME";
		groupBy=" GROUP BY HQ_CHAN_CODE,HQ_CHAN_NAME";
		orderBy=" ORDER BY HQ_CHAN_CODE";
	}
	return preSql+getSumSql()+where+groupBy+orderBy;
  }

function getSumSql(){
	return ",PMRT.LINK_RATIO_RATE(NVL(SUM(YW_SR_NUM),0),NVL(SUM(YW_ACCT_NUM),0),2) ARPU_YW     "+
	"      ,PMRT.LINK_RATIO_RATE(NVL(SUM(SR_2I2C_NUM),0),NVL(SUM(ACCT_2I2C_NUM),0),2) ARPU_2I2C"+
	"      ,PMRT.LINK_RATIO_RATE(NVL(SUM(KD_SR_NUM),0),NVL(SUM(KD_ACCT_NUM),0),2) ARPU_KD      "+
	"      ,PMRT.LINK_RATIO_RATE(NVL(SUM(GH_SR_NUM),0),NVL(SUM(GH_ACCT_NUM),0),2) ARPU_GH      "+
	"      ,NVL(SUM(SWJD_NUM),0) SWJD_NUM                                                      "+
	"      ,NVL(SUM(SWJD_NUM)+SUM(SWJD_NUML1)+SUM(SWJD_NUML2),0)  SWJD_NUML                    "+
	"FROM PMRT.TB_MRT_HQ_ACCT_USER_ZL_MON                                                      ";    
}
