$(function(){
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_TARGET_CH_MON"));
	var title=[["组织架构","发展佣金","计算发展佣金用户数","服务维系佣金","计算服务维系佣金用户数"]];
	var field=["ROW_NAME","DEV_COMMFEE","DEV_USER_NUM","SVC_COMMFEE","SVC_USER_NUM"];
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
			var sql='';
			var code='';
			var orgLevel='';
			var dealDate=$("#dealDate").val();
			var where=" WHERE DEAL_DATE='"+dealDate+"'";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//省，显示市
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){//点击市，展示营服
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){//点击营服，展示人
					where+=" AND UNIT_ID='"+code+"'";
				}else if(orgLevel==5){//点击人，展示渠道
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
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_hr_id = $.trim($("#hq_hr_id").val());
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID,HQ_HR_ID,HQ_CHAN_CODE";
	var showtext = '成本佣金月汇总-' + dealDate;
	var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_HR_ID","HQ_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","DEV_COMMFEE","DEV_USER_NUM","SVC_COMMFEE","SVC_USER_NUM"];
	var downSql="SELECT "+field.join(",")+" FROM PMRT.TB_MRT_HQ_CB_YJ_MON"+where+orderBy;
	var title=[["地市","营服","渠道经理HR","渠道经理","渠道编码","渠道名称","发展佣金","计算发展佣金用户数","服务维系佣金","计算服务维系佣金用户数"]];
	downloadExcel(downSql,title,showtext);
}

function getSql(orgLevel,where){
	var regionCode=$("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var hq_hr_id = $.trim($("#hq_hr_id").val());
	
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	if(hq_hr_id!=""){
		where+=" AND HQ_HR_ID LIKE '%"+hq_hr_id+"%'";
	}
	
	var preSql="";
	var groupBy="";
	if(orgLevel==1){
	    preSql="SELECT '云南省' ROW_NAME                                     "+
		"      ,'86000' ROW_ID                                             ";
	    groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1_NAME ROW_NAME                          "+
		"      ,GROUP_ID_1 ROW_ID                                        ";
		
		groupBy=" GROUP BY GROUP_ID_1,"+
	    "         GROUP_ID_1_NAME     ";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_NAME ROW_NAME                                "+
		"      ,UNIT_ID ROW_ID                                           ";
		
		groupBy="GROUP BY        "+
	    "         UNIT_ID        "+
	    "        ,UNIT_NAME      ";
	}else if(orgLevel==4){//人
		preSql="SELECT HQ_NAME ROW_NAME                                     "+
		"      ,HQ_HR_ID ROW_ID                                             ";
	
		groupBy="GROUP BY             "+
	    "         HQ_HR_ID            "+
	    "        ,HQ_NAME             ";
	}else{
		preSql="SELECT GROUP_ID_4_NAME ROW_NAME                          "+
		"      ,HQ_CHAN_CODE ROW_ID                                      ";
	   
		groupBy="GROUP BY          "+
	    "         HQ_CHAN_CODE     "+
	    "        ,GROUP_ID_4_NAME  ";
	}
	return preSql+getSumSql()+where+groupBy;
  }

function getSumSql(){
	return ",SUM(NVL(DEV_COMMFEE,0))  DEV_COMMFEE"+
	"      ,SUM(NVL(DEV_USER_NUM,0)) DEV_USER_NUM"+
	"      ,SUM(NVL(SVC_COMMFEE,0))  SVC_COMMFEE "+
	"      ,SUM(NVL(SVC_USER_NUM,0)) SVC_USER_NUM"+
	" FROM PMRT.TB_MRT_HQ_CB_YJ_MON               ";
}