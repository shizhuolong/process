var field= ["INCOME_TOTAL","INCOME_2G","INCOME_3G", "INCOME_4G","INCOME_KD","INCOME_ZX","INCOME_GH",
            "GRIDDING_TOTAL","COMM_TOTAL","COMM_2G", "COMM_3G", "COMM_4G","COMM_HARDLINK",
            "COMM_GY","FEE_JMWB","CHANNEL","ZDBT_AMOUNT","KVB_AMOUNT","FZF_AMOUNT",
            "SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT","YHJR_AMOUNT",
            "BGF_AMOUNT","CLSYF_AMOUNT","ZDF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT","PROFIT"];

var title=[["营销架构","出帐收入(扣减赠费、退费)","","","","","","","成本费用合计","佣金","","","","","","紧密外包费用","渠道补贴","终端销售亏损","卡成本","营业厅房租","水电物业费","广告宣传费","业务用品印制及材料费","客户接入成本（含开通费及终端）","办公费","车辆使用费","招待费","差旅费","通信费","毛利润"],
            ["","合计","2G","3G","4G","宽带","专租线","固话","","合计","2G","3G","4G","固网","公共佣金","","","","","","","","","","","","","","",""]]

var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:0,css:LchReport.RIGHT_ALIGN},
		     {eq:1,css:LchReport.SUM_PART_STYLE},
		     {eq:9,css:LchReport.SUM_PART_STYLE},
		     {eq:8,css:LchReport.SUM_STYLE}
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
					" WHERE T.UNIT_ID = '"+group_id+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
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
	var s ="SUM(NVL(T.INCOME_TOTAL, 0)) AS INCOME_TOTAL, "+
		"SUM(NVL(T.INCOME_2G, 0)) AS INCOME_2G,          "+
		"SUM(NVL(T.INCOME_3G, 0)) AS INCOME_3G,          "+
		"SUM(NVL(T.INCOME_4G, 0)) AS INCOME_4G,          "+
		"SUM(NVL(T.INCOME_KD, 0)) AS INCOME_KD,          "+
		"SUM(NVL(T.INCOME_ZX, 0)) AS INCOME_ZX,          "+
		"SUM(NVL(T.INCOME_GH, 0)) AS INCOME_GH,          "+
		"SUM(NVL(T.GRIDDING_TOTAL, 0)) AS GRIDDING_TOTAL,"+
		"SUM(NVL(T.COMM_TOTAL, 0)) AS COMM_TOTAL,        "+
		"SUM(NVL(T.COMM_2G, 0)) AS COMM_2G,              "+
		"SUM(NVL(T.COMM_3G, 0)) AS COMM_3G,              "+
		"SUM(NVL(T.COMM_4G, 0)) AS COMM_4G,              "+
		"SUM(NVL(T.COMM_HARDLINK, 0)) AS COMM_HARDLINK,  "+
		"SUM(NVL(T.COMM_GY, 0)) AS COMM_GY,              "+
		"SUM(NVL(T.FEE_JMWB, 0)) AS FEE_JMWB,            "+
		"SUM(NVL(T.CHANNEL, 0)) AS CHANNEL,              "+
		"SUM(NVL(T.ZDBT_AMOUNT, 0)) AS ZDBT_AMOUNT,      "+
		"SUM(NVL(T.KVB_AMOUNT, 0)) AS KVB_AMOUNT,        "+
		"SUM(NVL(T.FZF_AMOUNT, 0)) AS FZF_AMOUNT,        "+
		"SUM(NVL(T.SDWYF_AMOUNT, 0)) AS SDWYF_AMOUNT,    "+
		"SUM(NVL(T.ADS_AMOUNT, 0)) AS ADS_AMOUNT,        "+
		"SUM(NVL(T.YWYPCLF_AMOUNT, 0)) AS YWYPCLF_AMOUNT,"+
		"SUM(NVL(T.YHJR_AMOUNT, 0)) AS YHJR_AMOUNT,      "+
		"SUM(NVL(T.BGF_AMOUNT, 0)) AS BGF_AMOUNT,        "+
		"SUM(NVL(T.CLSYF_AMOUNT, 0)) AS CLSYF_AMOUNT,    "+
		"SUM(NVL(T.ZDF_AMOUNT, 0)) AS ZDF_AMOUNT,        "+
		"SUM(NVL(T.CLF_AMOUNT, 0)) AS CLF_AMOUNT,        "+
		"SUM(NVL(T.TXF_AMOUNT, 0)) AS TXF_AMOUNT,        "+
		"SUM(NVL(T.PROFIT, 0)) AS PROFIT                 "+
		"FROM PMRT.TB_MRT_COST_UNIT_PROFIT@YNSYN13 T     ";
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
		" WHERE T.UNIT_ID = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ";
	} else{
		sql = "SELECT MAX(T.UNIT_NAME) AS GROUPNAME," + getSumSql() +
		" WHERE 1=2 " +
		"GROUP BY UNIT_ID";
	}
	
	showtext = '成本费用展现报表-' + startdate+"-"+enddate;
	downloadExcel(sql,title,showtext);
}
