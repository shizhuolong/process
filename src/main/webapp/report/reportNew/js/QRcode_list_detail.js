var report;
$(function(){
	var field=["ROW_NAME","DEVELOPER_NAME","DEVELOPER_ID","TDC_ID" ,"STROENAME" ,"TDC_NAME" ,"TDC_PHONE" ,"COUNT" ,"XL" ,"XS" ,"XX"];
	var title=[["州市","发展人","发展人编码","二维码编码","二维码名称","二维码联系人","二维码对应手机","订单量","销量","线上","线下"]];
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
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE="+dealDate;
			//条件
			if(regionCode!=''){
				where+= " AND GROUP_ID_1 ='"+regionCode+"'";
			}
			if(unitCode!=''){
				where+= " AND UNIT_ID ='"+unitCode+"'";
			}
			//权限
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				if(orgLevel==2){
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND UNIT_ID='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
				sql=getSql(where,orgLevel);
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
					orgLevel=1;
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
					orgLevel=2;
				}else{
					return {data:[],extra:{}};
				}
				sql=getSql(where,orgLevel);
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

function getSql(where,orgLevel){
	var dealDate=$("#dealDate").val();
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' DEVELOPER_ID,'--' DEVELOPER_NAME,'--' TDC_ID,'--' STROENAME,'--' TDC_NAME, '--' TDC_PHONE,";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==2){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,'--' DEVELOPER_ID,'--' DEVELOPER_NAME,'--' TDC_ID,'--' STROENAME,'--' TDC_NAME, '--' TDC_PHONE,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==3){
		preSql="SELECT deal_date,group_id_1_name,unit_name, HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME,DEVELOPER_ID,DEVELOPER_NAME,TDC_ID,STROENAME,TDC_NAME,TDC_PHONE,";
		groupBy=" GROUP BY deal_date,group_id_1_name,unit_name, HQ_CHAN_CODE,HQ_CHAN_NAME,DEVELOPER_ID,DEVELOPER_NAME,TDC_ID,STROECODE,STROENAME,TDC_NAME,TDC_PHONE";
	}
	var sql=preSql+
	"COUNT(*) COUNT,"+
    "SUM( CASE WHEN IS_PAY_LJ=1 THEN 1 ELSE 0 END ) XL,"+
    "SUM(CASE WHEN SAL_STYE=1 AND  IS_PAY_LJ=1 THEN 1 ELSE 0 END  ) XS ,"+
    "SUM(CASE WHEN SAL_STYE=2 AND IS_PAY_LJ=1 THEN 1 ELSE 0 END  ) XX "+
    "FROM PMRT.TAB_MRT_QC_TDC_DETAIL "+
	where+groupBy;
	return sql;
}

function downsAll() {
	var region =$("#region").val();
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();
	var where=" WHERE DEAL_DATE="+dealDate;
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	//权限
	if(orgLevel==2){
		where+= " AND GROUP_ID_1 ='"+code+"'";
	}
	if(orgLevel==3){
		where+= " AND UNIT_ID ='"+code+"'";
	}
	if(orgLevel>=4){
		where+= " AND 1 =2 ";
	}
	var downsql = getSql(where,3);
	var title=[["账期","地市","营服名称","渠道编码","渠道名称","发展人","发展人编码","二维码编码","二维码名称","二维码联系人","二维码对应手机","订单量","销量","线上","线下"]];
	showtext = "二维码清单列表明细";
	downloadExcel(downsql,title,showtext);
}