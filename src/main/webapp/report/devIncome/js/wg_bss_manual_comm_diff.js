$(function(){
	var title=[["营销架构","网格+BSS计算佣金","网格未支撑走集中佣金","网格BSS未支撑走集中佣金合计","集中人工调整(最终)","差异佣金金额"]];
	var field=["BSS_WG","ESS","BSS_WG_ESS_TOTAL","MANUAL_ADJUST","DIFF_AMOUNT"];
	var sumSql=getSumSql();
	var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			$("#lch_DataBody").find("TR").find("TD:gt(0)").css({textAlign:"right"});
		},
		getSubRowsCallBack:function($tr){
			var preField="";
			var where="";
			var groupBy="";
			var code="";
			var orgLevel="";
			var orderBy ="";
			var chanlName=$("#chanlName").val();
			var channelAttrs = $("#channelBox").attr("kindids");
			var channelLevel = $("#channelBox").attr("level");
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//点击省
					preField=" SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy =" GROUP BY GROUP_ID_1_NAME, GROUP_ID_1 ";
					orderBy =" ORDER BY GROUP_ID_1 ";
				}else if(orgLevel==3){//点击市
					preField=" SELECT UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy ="  GROUP BY UNIT_NAME, UNIT_ID";
					where   =" AND GROUP_ID_1='"+code+"'";
					orderBy =" ORDER BY UNIT_ID ";
				}else if(orgLevel==4){
					preField=" SELECT GROUP_ID_4_NAME ROW_NAME,GROUP_ID_4 ROW_ID,";
					groupBy =" GROUP BY GROUP_ID_4_NAME, GROUP_ID_4";
					where   =" AND UNIT_ID='"+code+"'";
					orderBy =" ORDER BY GROUP_ID_4 ";
				}else{
					return {data:[],extra:{}}
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" SELECT GROUP_ID_0_NAME ROW_NAME,GROUP_ID_0 ROW_ID,";
					where 	=" AND GROUP_ID_0 = '86000'";
					groupBy =" GROUP BY GROUP_ID_0_NAME, GROUP_ID_0";
					orgLevel=2;
				}else if(orgLevel==2){//市
					preField=" SELECT GROUP_ID_1_NAME ROW_NAME,GROUP_ID_1 ROW_ID,";
					groupBy =" GROUP BY T.GROUP_ID_1,T.GROUP_ID_1_NAME ";
					//orderBy =" ORDER BY GROUP_ID_1 ";
					where=" AND GROUP_ID_1='"+code+"'";
					orgLevel=3;
				}else if(orgLevel==3){
					preField=" SELECT UNIT_NAME ROW_NAME,UNIT_ID ROW_ID,";
					groupBy =" GROUP BY UNIT_NAME, UNIT_ID";
					//orderBy =" ORDER BY UNIT_ID ";
					where   =" AND UNIT_ID='"+code+"'";
					orgLevel=4;
				}else if(orgLevel==4){
					preField=" SELECT GROUP_ID_4_NAME ROW_NAME,GROUP_ID_4 ROW_ID,";
					groupBy =" GROUP BY GROUP_ID_4_NAME, GROUP_ID_4";
					where   =" AND GROUP_ID_4='"+code+"'";
					orgLevel=5;
				}else{
					return {data:[],extra:{}};
				}
			}
			if(chanlName != null && chanlName != "") {
				where+=" AND GROUP_ID_4_NAME LIKE'%"+chanlName+"%'";
			}
			
			if(channelAttrs!=''&& channelLevel!=''&&typeof(channelAttrs)!="undefined" && typeof(channelLevel)!="undefined"){
				where+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
			}
			var sql= preField+sumSql+where+groupBy+orderBy;
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
    ///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		sumSql=getSumSql();
		report.showSubRow();
		report.showAllCols(0);

	});
});


function downsAll() {
	var preField=" SELECT DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,GROUP_ID_4_NAME,";
	var where="";
	var sumSql=getSumSql();
	/*var orderBy=" ORDER BY GROUP_ID_1,HQ_CHAN_CODE";*/
	var groupBy=" GROUP BY DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,GROUP_ID_4_NAME";
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var chanlName=$("#chanlName").val();
	var channelAttrs = $("#channelBox").attr("kindids");
	var channelLevel = $("#channelBox").attr("level");
	var startDate = $("#startDate").val();
	var endDate   = $("#endDate").val();
	if (orgLevel == 1) {//省
		
	}else if(orgLevel==2){//市或者其他层级
		where = " AND GROUP_ID_1='" + code + "' ";
	}else if(orgLevel==3){
		where = " AND UNIT_ID='" + code + "' ";
	}else if(orgLevel==4){
		where = " AND GROUP_ID_4='" + code + "' ";
	}else{
		return {data:[],extra:{}};
	}
	if(chanlName != null && chanlName != "") {
		where+=" AND GROUP_ID_4_NAME LIKE'%"+chanlName+"%'";
	}
	
	if(channelAttrs!=''&& channelLevel!=''&&typeof(channelAttrs)!="undefined" && typeof(channelLevel)!="undefined"){
		where+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
	}
	var sql = preField + sumSql+where+groupBy;
	var showtext = 'BSS、网格和手工调整佣金差异报表-(' + startDate+"~"+endDate+")";
	var title=[["账期","地市","营服中心","渠道名称","网格+BSS计算佣金","网格未支撑走集中佣金","网格BSS未支撑走集中佣金合计","集中人工调整(最终)","差异佣金金额"]];
	downloadExcel(sql,title,showtext);
}


function getSumSql() {
	var startDate = $("#startDate").val();
	var endDate   = $("#endDate").val();
	var s=
			"        ROUND(SUM(BSS_WG), 2) BSS_WG,                       "+
			"        ROUND(SUM(ESS), 2) ESS,                             "+
			"        ROUND(SUM(BSS_WG_ESS_TOTAL), 2) BSS_WG_ESS_TOTAL,   "+
			"        ROUND(SUM(MANUAL_ADJUST), 2) MANUAL_ADJUST,         "+
			"        ROUND(SUM(DIFF_AMOUNT), 2) DIFF_AMOUNT              "+
			"   FROM PMRT.TAB_MRT_COMM_AGENT_REPORT_CY                   "+
			"  WHERE BILLINGCYCLID  between '"+startDate+"' and '"+endDate+"' ";
	return s;
}
