var title=[["州市名称","营服中心","营服编码","营服状态","发展用户数","","","","","","出账用户数","","","","","","销售毛利","","","营服毛利","","","出账收入预算","","出账收入实际完成","","","","","","出账收入时序预算完成率","人工成本-年累计","去年总收入","平均人数","市场成本","","","网运成本","","","营业欠款余额","用户欠费余额","用户预存款余额","二次续费率"],
           ["","","","","移网","专线","宽带","固话","其他","合计","移网","专线","宽带","固话","其他","合计","全年预算","预算完成率","实际完成","全年预算","预算完成率","实际完成","年度","时序","移网","专线","宽带","固话","其他","合计","","","","","年度预算","剩余额度","实际完成","年度预算","剩余额度","实际完成","","","",""]];
var field=["DEV_YW_NUM","DEV_ZX_NUM","DEV_KD_NUM","DEV_GH_NUM","DEV_OTHER_NUM","DEV_ALL_NUM","CHARGE_YW_NUM","CHARGE_ZX_NUM","CHARGE_KD_NUM","CHARGE_GH_NUM","CHARGE_OTHER_NUM","CHARGE_ALL_NUM","YS_SALE_AMOUNT","COM_SALE_RATE","FACT_SALE_AMOUNT","YS_UNIT_AMOUNT","COM_UNIT_RATE","FACT_UNIT_AMOUNT","CHARGE_YEAR_YS","FACT_CHARGE_MON_YS","FACT_CHARGE_YW_NUM","FACT_CHARGE_ZX_NUM","FACT_CHARGE_KD_NUM","FACT_CHARGE_GH_NUM","FACT_CHARGE_OTHER_NUM","FACT_CHARGE_ALL_NUM","CHARGE_COM_RATE","MAN_COST","SR_LAST_YEAR","HR_COUNTS","SC_COST","SC_LEFT","SC_COM","LAN_COST","LAN_LEFT","LAN_COM","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT","SECOND_PAY_RATE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_UNIT_ABILITY_MON")
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
		field:["ROW_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE"].concat(field),
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}, {array:[9,15,29],css:LchReport.NORMAL_STYLE}],
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
	var unitCode=$("#unitCode").val();
	
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
	if(unitCode!=''){
		where+=" AND UNIT_ID = '"+unitCode+"'";
	}
	var sql = " SELECT GROUP_ID_1_NAME,UNIT_NAME,UNIT_ID,UNIT_TYPE,"+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_ABILITY_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
	var showtext = '云南联通营服效能汇总表' + startDate+"-"+endDate;
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where,level){
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID ='"+unitCode+"'";
	}
	if(orgLevel==1){
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' UNIT_NAME,'--' UNIT_ID,'--' UNIT_TYPE,"+getSumSql()+" FROM PMRT.TAB_MRT_UNIT_ABILITY_MON "+where;
	}else if(orgLevel==2){
		return " SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,'--' UNIT_NAME,'--' UNIT_ID,'--' UNIT_TYPE,"+getSumSql()+" FROM PMRT.TAB_MRT_UNIT_ABILITY_MON "+where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		return " SELECT UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,UNIT_NAME,UNIT_ID,UNIT_TYPE,"+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_ABILITY_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
	}
  }

function getSumSql(){
	var s="";
	for(var i=0;i<field.length;i++){
		if(i==0){
			s+="SUM("+field[i]+") "+field[i];
		}else{
			if(field[i].indexOf("RATE") >= 0){
				s+=",'--' "+field[i];
			}else{
				s+=","+"SUM("+field[i]+") "+field[i];
			}
		}
	}
	return s;
}
