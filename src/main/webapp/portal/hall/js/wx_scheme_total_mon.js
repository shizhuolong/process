$(function(){
	var maxDate=getMaxDate("PMRT.TB_MRT_USER_WX_SCHEME_MON");
	if(maxDate!=null){
		$("#dealDate").val(maxDate);
	}
	var title=[["组织架构","营服属性","渠道状态","本月累计受理用户数"]];
	var field=["ROW_NAME","UNIT_TYPE","STATUS","SERVICE_NUM1"];
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
			var where=" WHERE DEAL_DATE ='"+dealDate+"'";
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
	var code=$("#code").val();
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_name=$("#hq_name").val();
	var where=" WHERE DEAL_DATE ='"+dealDate+"'";
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
	if(hq_name!=""){
		where+=" AND HQ_NAME LIKE '%"+hq_name+"%'";
	}
	var preSql="SELECT GROUP_ID_1_NAME,UNIT_NAME,UNIT_TYPE,GROUP_ID_4_NAME,STATUS";
	var groupBy=" GROUP BY GROUP_ID_1_NAME,UNIT_NAME,UNIT_TYPE,GROUP_ID_4_NAME,STATUS";
	var sql = preSql+getSumSql()+where+groupBy
	var showtext = '老用户维系活动受理月报-' + dealDate;
	var title=[["地市","营服名称","营服属性","渠道","渠道状态","本月累计受理用户数"]];
	downloadExcel(sql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var hq_name=$("#hq_name").val();
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
	if(hq_name!=""){
		where+=" AND HQ_NAME LIKE '%"+hq_name+"%'";
	}
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,'--' UNIT_TYPE,'--' STATUS";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,'--' UNIT_TYPE,'--' STATUS";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
		orderBy=" ORDER BY GROUP_ID_1";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,UNIT_TYPE,'--' STATUS";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME,UNIT_TYPE";
		orderBy=" ORDER BY UNIT_ID";
	}else if(orgLevel==4){
		preSql="SELECT HQ_HR_ID ROW_ID,HQ_NAME ROW_NAME,UNIT_TYPE,'--' STATUS";
		groupBy=" GROUP BY UNIT_TYPE,HQ_HR_ID,HQ_NAME";
		orderBy=" ORDER BY HQ_HR_ID";
	}else{
		preSql="SELECT HQ_CHAN_CODE ROW_ID,GROUP_ID_4_NAME ROW_NAME,UNIT_TYPE,STATUS";
		groupBy=" GROUP BY UNIT_TYPE,HQ_CHAN_CODE,GROUP_ID_4_NAME,STATUS";
		orderBy=" ORDER BY HQ_CHAN_CODE";
	}
	return preSql+getSumSql()+where+groupBy+orderBy;
  }

function getSumSql(){
	return " ,NVL(COUNT(SUBSCRIPTION_ID),0)  SERVICE_NUM1 "+      
	       "FROM PMRT.TB_MRT_USER_WX_SCHEME_MON           ";
}
