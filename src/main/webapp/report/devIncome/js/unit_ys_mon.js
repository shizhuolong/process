var nowData = [];
var title=[["州市名称","营服中心","营服编码","营服状态","发展用户数预算","","","","","出账收入预算","市场成本预算总额","网运成本预算","","","","","","","","",""],
           ["","","","","移网","宽带","专线","其他","合计","","","铁塔租费（不含水电）","网运水电费","代维费","网运房租及物业费","客户接入成本开通费","客户接入成本终端","网优费","网运修理费","网运行政费用","网运总成本"]];
var field=["YS_DEV_YW_NUM","YS_DEV_KD_NUM","YS_DEV_ZX_NUM","YS_DEV_OTHER_NUM","YS_DEV_ALL_NUM","YS_SR_AMOUNT","SC_YS_COST_AMOUNT","LAN_IRON_AMOUNT","LAN_WARTER_ELE_AMOUNT","LAN_MAINTAI_AMOUNT","LAN_RENT_AMOUNT","LAN_JRCB_KTF_AMOUNT","LAN_JRCB_ZD_AMOUNT","LAN_GOOD_AMOUNT","LAN_XL_AMOUNT","LAN_XZ_AMOUNT","LAN_YS_COST_AMOUNT"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_UNIT_YS_MON");
	$("#dealDate").val(maxDate);
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
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}, {array:[8],css:LchReport.NORMAL_STYLE}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE = '"+dealDate+"'";
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
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE = '"+dealDate+"'";
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
	var sql = " SELECT GROUP_ID_1_NAME,UNIT_NAME,UNIT_ID,UNIT_TYPE,"+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_YS_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
	var showtext = '云南联通营服预算表-' + dealDate;
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
		return " SELECT '云南省' ROW_NAME,'86000' ROW_ID,'--' UNIT_NAME,'--' UNIT_ID,'--' UNIT_TYPE,"+getSumSql()+" FROM PMRT.TAB_MRT_UNIT_YS_MON "+where;
	}else if(orgLevel==2){
		return " SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,'--' UNIT_NAME,'--' UNIT_ID,'--' UNIT_TYPE,"+getSumSql()+" FROM PMRT.TAB_MRT_UNIT_YS_MON "+where+" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		return " SELECT UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,UNIT_NAME,UNIT_ID,UNIT_TYPE,"+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_YS_MON "+where+" ORDER BY GROUP_ID_1,UNIT_ID";
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
