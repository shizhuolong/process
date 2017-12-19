var report;
var maxDate=null;
$(function(){
	var field=["ROW_NAME","SC_DEV_DAY","SC_DEV_MON","SC_DEV_LJ","XCS_ZHL","HQ_NUM_DAY","SC_XN_DAY"];
	var title=[["组织架构","日首充发展数","月累计首充数","累计首充数","闪电购转化率","当天参与渠道数","日效能人数"]];
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
			var where=" WHERE DEAL_DATE = "+dealDate;
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
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==3){
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==4){
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
					where+=" AND GROUP_ID_0='"+code+"'";
				}else if(orgLevel==2){//市
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//营服
					where+=" AND UNIT_ID='"+code+"'";
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
	var startDete=$("#startDate").val();
	var endDete=$("#endDate").val();
	if(orgLevel==1){
		preSql="SELECT GROUP_ID_0 ROW_ID,'云南省' ROW_NAME,";
		groupBy=" GROUP BY GROUP_ID_0";
	}else if(orgLevel==2){
		preSql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,";
		groupBy=" GROUP BY GROUP_ID_1,GROUP_ID_1_NAME";
	}else if(orgLevel==3){
		preSql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,";
		groupBy=" GROUP BY UNIT_ID,UNIT_NAME";
	}else if(orgLevel==4){
		preSql="SELECT TOWN_ID ROW_ID,TOWN_NAME ROW_NAME,";
		groupBy=" GROUP BY TOWN_ID,TOWN_NAME";
	}
	var sql=preSql+
	"        SUM(NVL(SC_DEV_DAY,0)) SC_DEV_DAY,                                               "+
	"        SUM(NVL(SC_DEV_MON,0)) SC_DEV_MON,                                               "+
	"        SUM(NVL(SC_DEV_LJ,0)) SC_DEV_LJ,                                                 "+
	"        PMRT.LINK_RATIO_ZB(SUM(NVL(XCS_SC_DEV,0)),SUM(NVL(XCS_ORDER_NUM,0)), 2) XCS_ZHL, "+
	"        SUM(NVL(HQ_NUM_DAY,0)) HQ_NUM_DAY,                                               "+
	"        SUM(NVL(SC_XN_DAY,0)) SC_XN_DAY                                                  "+
	"     FROM  PMRT.TB_MRT_DW_V_D_HLW_OUTLINE_TOWN                                           "+
	where+groupBy;
	return sql;
}

function getDownSql(where){
	var sql = "SELECT GROUP_ID_1_NAME,UNIT_NAME,TOWN_NAME,"+
	"        SUM(NVL(SC_DEV_DAY,0)) SC_DEV_DAY,                                               "+
	"        SUM(NVL(SC_DEV_MON,0)) SC_DEV_MON,                                               "+
	"        SUM(NVL(SC_DEV_LJ,0)) SC_DEV_LJ,                                                 "+
	"        PMRT.LINK_RATIO_ZB(SUM(NVL(XCS_SC_DEV,0)),SUM(NVL(XCS_ORDER_NUM,0)), 2) XCS_ZHL, "+
	"        SUM(NVL(HQ_NUM_DAY,0)) HQ_NUM_DAY,                                               "+
	"        SUM(NVL(SC_XN_DAY,0)) SC_XN_DAY                                                  "+
	"     FROM  PMRT.TB_MRT_DW_V_D_HLW_OUTLINE_TOWN                                           "+
	where + " GROUP BY GROUP_ID_1,GROUP_ID_1_NAME,UNIT_ID,UNIT_NAME,TOWN_ID,TOWN_NAME";
	return sql;
}

function downsAll() {
	var field=["GROUP_ID_1_NAME","UNIT_NAME","TOWN_NAME","SC_DEV_DAY","SC_DEV_MON","SC_DEV_LJ","XCS_ZHL","HQ_NUM_DAY","SC_XN_DAY"];
	var title=[["州市","区县","乡镇名称","日首充发展数","月累计首充数","累计首充数","闪电购转化率","当天参与渠道数","日效能人数"]];
	
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();

	var where=" WHERE DEAL_DATE = "+dealDate;
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND UNIT_ID ='"+code+"' ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
	}
	
	var downsql = getDownSql(where);
	showtext = "大乡大镇发展情况-";
	downloadExcel(downsql,title,showtext);
}

function showDesc(){
	var url = $("#ctx").val()+"/report/reportNew/jsp/region_local_dev_explain.jsp";
	art.dialog.open(url,{
		id:'bindDescDialog',
		width:'600px',
		height:'200px',
		lock:true,
		resize:false
	});
}