var nowData = [];
var title=[["州市名称","所属基层单元","营业厅编码","营业厅名称","营业厅地址","营业厅下挂渠道编码","营业厅下挂渠道名称","开厅日期","目前经营者开始合作日期","营业厅类型","运营模式","三级属性","经营者名称","租赁合同编码","营业厅人数","发展用户数","出账用户数","","业务受理量","营业厅毛利","其中：零售毛利","出账收入","成本合计","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","柜台及场地出租收入","房租费","营业厅装修","客户接入成本","卡成本","水电物业安保费","广告宣传费","业务用品印制及材料费","存货跌价准备","零售收入","零售成本","办公费","车辆使用费","招待费","差旅费","通信费"/*,"成本占收比"*/,"生命周期（月）","","","上月出账用户平均ARPU值","","","生命周期出账收入","","","生命周期成本","","","生命周期毛利","库存终端","","其中：三个月至1年库存终端","","其中：1年以上库存终端","","营业欠款余额","用户欠费余额","用户预存款余额"/*,"二次续费率"*/],
           ["","","","","","","","","","","","","","","","","移网","固网","","","","","","小计","合同制","紧密制","财务计列(如劳保等)","","","","","","","","","","","","","","","","","","","","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","移网","宽带","其他","","数量","金额","数量","金额","数量","金额","","",""]];
var field=["YYT_MAN_NUM","YYT_DEV_NUM","YW_CHARGE_NUM","GW_CHARGE_NUM","ACCT_NUM","YYT_ML","RETAIL_ML","CHARGE_SR","COST_SUM","MAN_COST_SUM","MAN_COST_CONTRACT","MAN_COST_NOCONT","MAN_COST_FINACE","YJ_AMOUNT","HQ_SUBSIDY","TERMINAL_AMOUNT","PLACE_RENT_AMOUNT","RENT_AMOUNT","DECORATION_AMOUNT","JRCB_AMOUNT","KCB_AMOUNT","SDWY_AMOUNT","ADVERTISE_AMOUNT","YWYP_AMOUNT","PRODUCT_DOWN_PRE","RETAIL_SR","RETAIL_COST","OFFICE_AMOUNT","CAR_AMOUNT","ZDF_AMOUNT","TRAVEL_AMOUNT","TXF_AMOUNT"/*,"COST_IN_SR_RATE"*/,"BIRTH_YW","BIRTH_KD","BIRTH_OTHER","ARPU_YW","ARPU_KD","ARPU_OTHER","BIRTH_SR_YW","BIRTH_SR_KD","BIRTH_SR_OTHER","BIRTH_COST_YW","BIRTH_COST_KD","BIRTH_COST_OTHER","BIRTH_ML","TERMINAL_NUM","TERMINAL_MONEY","THREE_MON_TERM_NUM","THREE_MON_TERM_MONEY","ONE_YEAR_TERM_NUM","ONE_YEAR_TERM_MONEY","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT"/*,"SECOND_PAY_RATE"*/];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID,YYT_CODE";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_YYT_ABILITY_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
    $("#searchBtn").click(function(){
		//$("#searchForm").find("TABLE").find("TR:eq(0)").find("TD:last").remove();
		report.showSubRow();
        ///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
    var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["ROW_NAME","UNIT_NAME","YYT_CODE","YYT_NAME","YYT_ADDR","HQ_CHAN_CODE","HQ_CHAN_NAME","YYT_CREATE_TIME","BUSI_BEGIN_TIME","YYT_TYPE","BUSI_MODE","THIRD_ATTRI","BUSI_NAME","RENT_NO"].concat(field),
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var startDate=$("#startDate").val();
			var endDate=$("#endDate").val();
			var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(orgLevel,where,level);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID IN("+_unit_relation(code)+")";
				}else {
					return {data:[],extra:{}};
				}
				sql=getSql(orgLevel,where,level);
				orgLevel++;
			}
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
});

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate;
	var regionCode=$("#regionCode").val();
	var yyt_name=$("#yyt_name").val();
	
	if (orgLevel == 1) {//省
	} else if(orgLevel == 2){//市
		where += " AND GROUP_ID_1='"+code+"'";
	} else if(orgLevel == 3){//营服
		where += " AND UNIT_ID='"+code+"'";
	} else{
		where+=" AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_name!=''){
		where+=" AND YYT_NAME LIKE '%"+yyt_name+"%'";
	}
	var sql = " SELECT GROUP_ID_1_NAME,UNIT_NAME,YYT_CODE,YYT_NAME,YYT_ADDR,HQ_CHAN_CODE,HQ_CHAN_NAME,YYT_CREATE_TIME,BUSI_BEGIN_TIME,YYT_TYPE,BUSI_MODE,THIRD_ATTRI,BUSI_NAME,RENT_NO,"+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ABILITY_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID,YYT_CODE";
	var showtext = '云南联通营业厅效能分析明细表' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,level){
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var yyt_name=$("#yyt_name").val();
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(yyt_name!=''){
		where+=" AND YYT_NAME LIKE '%"+yyt_name+"%'";
	}
	if(orgLevel==1){
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' UNIT_NAME,'--' YYT_CODE,'--' YYT_NAME,'--' YYT_ADDR,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' YYT_CREATE_TIME,'--' BUSI_BEGIN_TIME,'--' YYT_TYPE,'--' BUSI_MODE,'--' THIRD_ATTRI,'--' BUSI_NAME,'--' RENT_NO,"+getSumSql()+" FROM PMRT.TAB_MRT_YYT_ABILITY_MON "+where;
	}else if(orgLevel==2){
		return " SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,'--' UNIT_NAME,'--' YYT_CODE,'--' YYT_NAME,'--' YYT_ADDR,'--' HQ_CHAN_CODE,'--' HQ_CHAN_NAME,'--' YYT_CREATE_TIME,'--' BUSI_BEGIN_TIME,'--' YYT_TYPE,'--' BUSI_MODE,'--' THIRD_ATTRI,'--' BUSI_NAME,'--' RENT_NO,"+getSumSql()+" FROM PMRT.TAB_MRT_YYT_ABILITY_MON "+where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		return " SELECT UNIT_NAME ROW_NAME,UNIT_NAME,UNIT_ID ROW_ID,YYT_CODE,YYT_NAME,YYT_ADDR,HQ_CHAN_CODE,HQ_CHAN_NAME,YYT_CREATE_TIME,BUSI_BEGIN_TIME,YYT_TYPE,BUSI_MODE,THIRD_ATTRI,BUSI_NAME,RENT_NO,"+field.join(",")+" FROM PMRT.TAB_MRT_YYT_ABILITY_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
	}
  }

function getSumSql(){
	var s="";
	for(var i=0;i<field.length;i++){
		if(i==0){
			s+="SUM("+field[i]+") "+field[i];
		}else{
			s+=","+"SUM("+field[i]+") "+field[i];
		}
	}
	return s;
}
