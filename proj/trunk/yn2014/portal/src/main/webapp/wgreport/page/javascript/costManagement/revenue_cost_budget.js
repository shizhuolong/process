var field= ["INCOME_TOTAL","GRIDDING_TOTAL","XJ_YXFY","COMM_TOTAL","CHANNEL","ADS_AMOUNT","FZF_AMOUNT","YWYPCLF_AMOUNT","SDWYF_AMOUNT","KVB_AMOUNT","ZDBT_AMOUNT","YHJR_AMOUNT","XJ_XZFY","CLSYF_AMOUNT","ZDF_AMOUNT","BGF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT"];

var title=[["营销架构","预算收入","费用合计","营销费用","佣金","渠道补贴","广告宣传费","营业厅房租费","业务用品印制及材料费","营业厅水电费及物管费","卡成本","终端补贴","客户接入成本","行政费用","车辆使用费","招待费","办公费","差旅费","通信费"],
            ["","小计","","小 计","","","","","","","","","","小计","","","","",""]];

var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:0,css:LchReport.RIGHT_ALIGN}
		     /*{eq:1,css:LchReport.SUM_PART_STYLE},
		     {eq:9,css:LchReport.SUM_PART_STYLE},
		     {eq:24,css:LchReport.SUM_PART_STYLE},
		     {eq:30,css:LchReport.SUM_PART_STYLE},
		     {eq:8,css:LchReport.SUM_STYLE}*/
		    ],
		rowParams:["GROUPID","GROUPNAME"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel="";
			var code="";
			var startdate = $.trim($("#startdate").val());
			var enddate = $.trim($("#enddate").val());
			var sql="";
			if($tr){
				code=$tr.attr("GROUPID");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==1){//点击省
					sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS GROUPNAME,T.GROUP_ID_1 AS GROUPID," + getSumSql() +
					" WHERE T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
					"GROUP BY GROUP_ID_1 ORDER BY GROUPID";
					orgLevel++;
				}else if(orgLevel==2){//点击地市
					sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS GROUPID," + getSumSql() +
					" WHERE T.GROUP_ID_1 = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
					"GROUP BY UNIT_ID ORDER BY GROUPID";
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql = "SELECT MAX('中国联通云南分公司') AS GROUPNAME,T.GROUP_ID_0 AS GROUPID," + getSumSql() +
					" WHERE T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
					"GROUP BY GROUP_ID_0";
				}else if(orgLevel==2){//市
					sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS GROUPNAME,T.GROUP_ID_1 AS GROUPID," + getSumSql() +
					" WHERE T.group_id_1 = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
					"GROUP BY GROUP_ID_1 ORDER BY GROUPID";
				}else if(orgLevel==3){//营服中心
					sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS GROUPID," + getSumSql() +
					" WHERE T.UNIT_ID IN("+_unit_relation(code)+") AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
					"GROUP BY UNIT_ID ORDER BY GROUPID";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	////////////////////////
	$("#lch_DataHead").find("TH:gt(3):lt(9)").css({"background":"#99c2ff"});
	$("#lch_DataHead").find("tr:eq(0)").find("TH:gt(12)").css({"background":"#FFDAB9"});
	$("#lch_DataHead").find("tr:eq(1)").find("TH:eq(2)").css({"background":"#FFDAB9"});
	$("#lch_DataHead").find("tr:eq(0)").find("TH:eq(3)").css({"background":"#99c2ff"});
	$("#lch_DataHead").find("tr:eq(1)").find("TH:eq(1)").css({"background":"#99c2ff"});
	
	$("#lch_table_left .lch_DataBody TD:eq(0)").find("A").trigger("click");
///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function getSumSql() {
	var s="";
	for(var i=0;i<field.length;i++){
		if(s.length>0){
			s+=",";
		}
		s+="SUM(NVL(T."+field[i]+", 0)) AS "+field[i]+" ";
	}
	s+=" FROM PMRT.TB_MRT_COST_UNIT_SRCBYSZX T ";
	return s;
}
function getSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		s += field[i];
	}
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var startdate = $.trim($("#startdate").val());
	var enddate = $.trim($("#enddate").val());
	var sql="";
	if (orgLevel == 1) {//省
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME," + getSumSql() +
		" WHERE T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY GROUP_ID_1,UNIT_ID ORDER BY GROUP_ID_1,UNIT_ID";
	} else if (orgLevel == 2) {//市
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME," + getSumSql() +
		" WHERE T.GROUP_ID_1 = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ORDER BY UNIT_ID";
	} else if (orgLevel == 3) {//营服中心
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME," + getSumSql() +
		" WHERE T.UNIT_ID IN("+_unit_relation(code)+") AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ";
	} else{
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME," + getSumSql() +
		" WHERE 1=2 " +
		"GROUP BY UNIT_ID";
	}
	
	showtext = '收入成本预算展现报表-' + startdate+"-"+enddate;
	downloadExcel(sql,title,showtext);
}
