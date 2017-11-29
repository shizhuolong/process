var title=[["州市","营服中心","营服编码","营服状态","毛利","毛利预算完成率","出帐收入(扣减赠费、退费)","","","","","","","","成本合计","佣金","","","","","","","","渠道补贴","终端补贴","卡成本","营业厅房租","装修","水电物业安保费","广告宣传费","业务用品印制及材料费（含配送费、其他）","车辆使用费","招待费","办公费","差旅费","通信费","紧密外包费用"],
           ["","","","","","","2G","3G","4G","专租线","宽带","固话","其他","合计","","2G","3G","4G","专租线","宽带","固网","其他","合计","","","","","","","","","","","","","",""]];
var field=["FACT_UNIT_AMOUNT","COM_UNIT_RATE","INCOME_2G","INCOME_3G","INCOME_4G","INCOME_ZX","INCOME_KD","INCOME_GH","INCOME_OTHER","INCOME_TOTAL","SC_COM","COMM_2G","COMM_3G","COMM_4G","COMM_ZX","COMM_KD","COMM_HARDLINK","COMM_GY","COMM_TOTAL","CHANNEL","ZDBT_AMOUNT","KVB_AMOUNT","FZF_AMOUNT","ZX_AMOUNT","SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT","CLSYF_AMOUNT","ZDF_AMOUNT","BGF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT","FEE_JMWB"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
$(function(){
	var maxDate=getMaxDate("PMRT.TAB_MRT_UNIT_ABILITY_MON");
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
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var where=" WHERE DEAL_DATE = "+dealDate;
			var level=0;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					where+=" AND GROUP_LEVEL=1";
					level=2;
				}else if(orgLevel==3){//点击市
					where+=" AND GROUP_LEVEL=2 AND GROUP_ID_1='"+code+"'";
					level=3;
				}else{
					return {data:[],extra:{}}
				}
				if(regionCode!=''){
					  where=" WHERE DEAL_DATE = "+dealDate+" AND GROUP_LEVEL=2 AND GROUP_ID_1 = '"+regionCode+"'";
					  orgLevel=3;
					  level=3;
				}
				if(unitCode!=''){
					return {data:[],extra:{}};
				}
				sql=getSql(where,level);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=1;
					where+=" AND GROUP_LEVEL=0";
				}else if(orgLevel==2){//市
					where+=" AND GROUP_LEVEL=1 AND GROUP_ID_1='"+code+"'";
					level=2;
				}else if(orgLevel==3){//营服
					level=3;
					where+=" AND GROUP_LEVEL=2 AND UNIT_ID IN("+_unit_relation(code)+")";
				}else {
					return {data:[],extra:{}};
				}
				if(regionCode!=''){
					  where=" WHERE DEAL_DATE = "+dealDate+" AND GROUP_LEVEL=1 AND GROUP_ID_1 = '"+regionCode+"'";
					  level=2;
				}
				if(unitCode!=''){
					  where=" WHERE DEAL_DATE = "+dealDate+" AND GROUP_LEVEL=2 AND UNIT_ID = '"+unitCode+"'";
					  where+=" AND GROUP_LEVEL=2";
					  level=3;
				}
				sql=getSql(where,level);
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

function toRules(){
	var url = $("#ctx").val()+"/report/devIncome/jsp/rules.jsp?type=3";
	window.parent.openWindow("取数规则",null,url);
}

function downsAll() {
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var where=" WHERE DEAL_DATE = "+dealDate+" AND GROUP_LEVEL=2";
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
	var sql=getSql(where,3);
	var showtext = '云南联通营服效能明细表-市场' + dealDate;
	downloadExcel(sql,title,showtext);
}

function getSql(where,level){
  var regionCode=$("#regionCode").val();
  var unitCode=$("#unitCode").val();
  var dealDate=$("#dealDate").val();
  if(level==1){
	  return "SELECT                                                                                                                                                                          "+
	  "                       '86000' ROW_ID,                                                                                                                                                 "+
	  "                       '云南省' ROW_NAME,                                                                                                                                                "+
	  "                       '--' UNIT_NAME,                                                                                                                                                 "+
	  "                       '--' UNIT_ID,                                                                                                                                                   "+
	  "                       '--' UNIT_TYPE,                                                                                                                                                 "+
	  field.join(",")+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                   "+
	     where;     
  }else if(level==2){
	  return "SELECT                                                                                                                                                                          "+
	  "                       GROUP_ID_1 ROW_ID,                                                                                                                                              "+
	  "                       GROUP_ID_1_NAME ROW_NAME,                                                                                                                                       "+
	  "                       '--' UNIT_NAME,                                                                                                                                                 "+
	  "                       '--' UNIT_ID,                                                                                                                                                   "+
	  "                       '--' UNIT_TYPE,                                                                                                                                                 "+
	      field.join(",")+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                   "+
	                     where;
  }else if(level==3){
	  return "SELECT          GROUP_ID_1_NAME,                                                                                                                                                 "+
	  "                       UNIT_NAME ROW_NAME,                                                                                                                                              "+
	  "                       UNIT_ID,                                                                                                                                                         "+
	  "                       UNIT_TYPE,                                                                                                                                                       "+
	       field.join(",")+
	  "                  FROM PMRT.TAB_MRT_UNIT_ABILITY_MON                                                                                                                                    "+
	                    where;
	                                          
  }
}

function getFristMon(dealDate){
	 return dealDate.substring(0,4)+"01";
}