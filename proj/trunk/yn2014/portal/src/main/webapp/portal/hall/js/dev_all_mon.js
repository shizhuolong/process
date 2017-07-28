$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_HQ_DEV_DETAIL_MON_HZ");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","发展用户数","三无极低"]];
	var field=["ROW_NAME","DEV_NUM","SWJD_NUM"];
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
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示渠道经理
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){//点击渠道经理，展示渠道
					where+=" AND HQ_HR_ID='"+code+"'";
				}else if(orgLevel==6){//点击渠道，展示套餐
					where+=" AND HQ_CHAN_CODE='"+code+"'";
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
	var product_name=$("#product_name").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var product_type=$("#product_type").val();
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
	if(product_type!=""){
		where+=" AND PRODUCT_TYPE LIKE '%"+product_type+"%'";
	}
	if(product_name!=""){
		where+=" AND PRODUCT_NAME LIKE '%"+product_name+"%'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	var field=["GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","HQ_HR_ID","HQ_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","PRODUCT_TYPE","PRODUCT_NAME","DEV_NUM","SWJD_NUM"];
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TB_MRT_HQ_DEV_DETAIL_MON_HZ"+where+" ORDER BY GROUP_ID_1,UNIT_ID,HQ_HR_ID,HQ_CHAN_CODE,PRODUCT_TYPE";
	var showtext = '用户发展月汇总-' + dealDate;
	var title=[["地市","营服编码","营服名称","渠道经理HR","渠道经理","渠道编码","渠道名称","套餐类型","套餐名称","发展用户数","三无极低"]];;
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var product_name=$("#product_name").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var product_type=$("#product_type").val();
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
	if(product_type!=""){
		where+=" AND PRODUCT_TYPE LIKE '%"+product_type+"%'";
	}
	if(product_name!=""){
		where+=" AND PRODUCT_NAME LIKE '%"+product_name+"%'";
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
	}else if(orgLevel==5){
		preSql="SELECT HQ_CHAN_CODE ROW_ID,HQ_CHAN_NAME ROW_NAME";
		groupBy=" GROUP BY HQ_CHAN_CODE,HQ_CHAN_NAME";
		orderBy=" ORDER BY HQ_CHAN_CODE";
	}else{
		preSql="SELECT PRODUCT_ID ROW_ID,PRODUCT_NAME ROW_NAME";
		groupBy=" GROUP BY PRODUCT_ID,PRODUCT_NAME";
		orderBy=" ORDER BY PRODUCT_ID";
	}
	return preSql+getSumSql()+where+groupBy+orderBy;
  }

function getSumSql(){
	return ",NVL(SUM(DEV_NUM),0) DEV_NUM    "+
	"       ,NVL(SUM(SWJD_NUM),0) SWJD_NUM  "+
	" FROM PMRT.TB_MRT_HQ_DEV_DETAIL_MON_HZ ";
}
