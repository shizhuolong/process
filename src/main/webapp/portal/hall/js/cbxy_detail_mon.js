$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_HQ_CBXY_DETAIL_MON");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","本月成本","","","","","","","","本年累计成本","","","","","","","","当月销售毛利","本年累计销售毛利"],
	           ["","发展用户佣金","存量用户佣金","缴费佣金","补贴","房租","客户接入成本","卡成本","装修水电","发展用户佣金","存量用户佣金","缴费佣金","补贴","房租","客户接入成本","卡成本","装修水电","",""]];
	var field=["ROW_NAME","DEV_COMM","CL_COMM","JF_COMM","BT","HQ_RENT","KHJR_AMOUNT","KCB_COST","ZXSD_FEE","DEV_COMM1","CL_COMM1","JF_COMM1","BT1","HQ_RENT1","KHJR_AMOUNT1","KCB_COST1","ZXSD_FEE1","ML_NUM","ML_NUM1"];
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
	var hq_state=$("#hq_state").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_hr_id=$("#hq_hr_id").val();
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
	if(hq_state!=""){
		where+=" AND HQ_STATE ='"+hq_state+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_HR_ID","HQ_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","HQ_STATE","DEV_COMM","CL_COMM","JF_COMM","BT","HQ_RENT","KHJR_AMOUNT","KCB_COST","ZXSD_FEE","DEV_COMM1","CL_COMM1","JF_COMM1","BT1","HQ_RENT1","KHJR_AMOUNT1","KCB_COST1","ZXSD_FEE1","ML_NUM","ML_NUM1"];
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TB_MRT_HQ_CBXY_DETAIL_MON"+where+" ORDER BY GROUP_ID_1,UNIT_ID,HQ_HR_ID,HQ_CHAN_CODE";
	var showtext = '渠道经理成本效益月报-' + dealDate;
	var title=[["地市","营服","渠道经理HR","渠道经理","渠道编码","渠道名称","渠道状态","本月成本","","","","","","","","本年累计成本","","","","","","","","当月销售毛利","本年累计销售毛利"],
	           ["","","","","","","","发展用户佣金","存量用户佣金","缴费佣金","补贴","房租","客户接入成本","卡成本","装修水电","发展用户佣金","存量用户佣金","缴费佣金","补贴","房租","客户接入成本","卡成本","装修水电","",""]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_state=$("#hq_state").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_hr_id=$("#hq_hr_id").val();
	var preSql="";
	var groupBy="";
	var orderBy="";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_state!=""){
		where+=" AND HQ_STATE LIKE '%"+hq_state+"%'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
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
	return ",SUM(DEV_COMM) DEV_COMM     "+
	",SUM(CL_COMM)  CL_COMM             "+
	",SUM(JF_COMM)  JF_COMM             "+
	",SUM(BT)      BT                   "+
	",SUM(HQ_RENT) HQ_RENT              "+
	",SUM(KHJR_AMOUNT) KHJR_AMOUNT      "+
	",SUM(KCB_COST)    KCB_COST         "+
	",SUM(ZXSD_FEE)   ZXSD_FEE          "+
	",SUM(DEV_COMM1) DEV_COMM1          "+
	",SUM(CL_COMM1)  CL_COMM1           "+
	",SUM(JF_COMM1)  JF_COMM1           "+
	",SUM(BT1)      BT1                 "+
	",SUM(HQ_RENT1) HQ_RENT1            "+
	",SUM(KHJR_AMOUNT1) KHJR_AMOUNT1    "+
	",SUM(KCB_COST1)    KCB_COST1       "+
	",SUM(ZXSD_FEE1)   ZXSD_FEE1        "+
	",SUM(ML_NUM)     ML_NUM            "+
	",SUM(ML_NUM1)     ML_NUM1          "+
	"FROM PMRT.TB_MRT_HQ_CBXY_DETAIL_MON";    
}
