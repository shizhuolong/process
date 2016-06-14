var field= ["INCOME_TOTAL","INCOME_2G","INCOME_3G", "INCOME_4G",
            "INCOME_KD","INCOME_ZX","INCOME_GH",
            "GRIDDING_TOTAL",
            "COMM_TOTAL","COMM_2G", "COMM_3G", "COMM_4G","COMM_HARDLINK",
            "COMM_GY",
            
            "FEE_JMWB","YHJR_AMOUNT",/*YHJR_AMOUNT---XJ_YXFY*/
            "CHANNEL","ZDBT_AMOUNT",
            "KVB_AMOUNT","FZF_AMOUNT",
            
            "SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT",
            
            "XJ_YXFY",/*XJ_YXFY---YHJR_AMOUNT*/
            "BGF_AMOUNT","CLSYF_AMOUNT",
            
            "ZDF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT",
            
            "XJ_XZFY","PROFIT"];

var title=[["营销架构","出帐收入(扣减赠费、退费)","","","","","","","成本费用合计","佣金","","","","","",
            
            "紧密外包费用","客户接入成本（含开通费及终端）"/**/,
            "渠道补贴","终端补贴",
            "卡成本","营业厅房租",
            "水电物业费","广告宣传费","业务用品印制及材料费",
            
            "营销费用小计"/**/,"办公费","车辆使用费",
            "招待费","差旅费","通信费","行政费用小计","毛利润"],
            ["","合计","2G","3G","4G",
             "宽带","专租线","固话","","合计",
             "2G","3G","4G","固网","公共佣金",
             "","","","","","","","","","","","","","","","",""]];
/*DEAL_DATE       NUMBER        Y                账期     
GROUP_ID_0      VARCHAR2(20)  Y                省       
GROUP_ID_1      VARCHAR2(20)  Y                地市编码 
GROUP_ID_1_NAME VARCHAR2(200) Y                地市名称 
UNIT_ID         VARCHAR2(20)  Y                基层单元编码 
UNIT_NAME       VARCHAR2(200) Y                基层单元名称 
CC_CODE         VARCHAR2(50)  Y                成本中心编码 
CC_DESC         VARCHAR2(200) Y                成本中心名称 
INCOME_TOTAL    NUMBER        Y                收入合计 
INCOME_2G       NUMBER        Y                2g收入   
INCOME_3G       NUMBER        Y                3G收入   
INCOME_4G       NUMBER        Y                4G收入   
INCOME_KD       NUMBER        Y                宽带收入 
INCOME_ZX       NUMBER        Y                租线收入 
GRIDDING_TOTAL  NUMBER        Y                费用合计 
COMM_TOTAL      NUMBER        Y                佣金合计 
COMM_2G         NUMBER        Y                2G佣金   
COMM_3G         NUMBER        Y                3G佣金   
COMM_4G         NUMBER        Y                4G佣金   
COMM_HARDLINK   NUMBER        Y                固网佣金 
CHANNEL         NUMBER        Y                渠道补贴 
BGF_AMOUNT      NUMBER        Y                办公费   
CLF_AMOUNT      NUMBER        Y                差旅费   
CLSYF_AMOUNT    NUMBER        Y                车辆使用费 
FZF_AMOUNT      NUMBER        Y                房租费   
ADS_AMOUNT      NUMBER        Y                广告宣传费 
KVB_AMOUNT      NUMBER        Y                卡成本   
OTHER_AMOUNT    NUMBER        Y                其他     
QTZLF_AMOUNT    NUMBER        Y                其他租赁费 
SDWYF_AMOUNT    NUMBER        Y                水电物业费 
TXF_AMOUNT      NUMBER        Y                通信费   
YWYPCLF_AMOUNT  NUMBER        Y                业务用品费 
YHJR_AMOUNT     NUMBER        Y                用户接入成本 
ZDF_AMOUNT      NUMBER        Y                招待费   
ZDBT_AMOUNT     NUMBER        Y                终端补贴 
PROFIT          NUMBER        Y                毛利润   
COMM_GY         NUMBER        Y                共用佣金 
FEE_JMWB        NUMBER        Y                紧密外包费用 
INCOME_GH       NUMBER        Y                固话收入 
XJ_YXFY         NUMBER        Y                营销费用小计 
XJ_XZFY         NUMBER        Y                行政费用小计 */
var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:0,css:LchReport.RIGHT_ALIGN},
		     {eq:1,css:LchReport.SUM_PART_STYLE},
		     {eq:9,css:LchReport.SUM_PART_STYLE},
		     {eq:24,css:LchReport.SUM_PART_STYLE},
		     {eq:30,css:LchReport.SUM_PART_STYLE},
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
					" WHERE T.UNIT_ID = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
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
	/*var s ="SUM(NVL(T.INCOME_TOTAL, 0)) AS INCOME_TOTAL, "+
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
		"SUM(NVL(T.XJ_YXFY, 0)) AS XJ_YXFY,              "+
		"SUM(NVL(T.BGF_AMOUNT, 0)) AS BGF_AMOUNT,        "+
		"SUM(NVL(T.CLSYF_AMOUNT, 0)) AS CLSYF_AMOUNT,    "+
		"SUM(NVL(T.ZDF_AMOUNT, 0)) AS ZDF_AMOUNT,        "+
		"SUM(NVL(T.CLF_AMOUNT, 0)) AS CLF_AMOUNT,        "+
		"SUM(NVL(T.TXF_AMOUNT, 0)) AS TXF_AMOUNT,        "+
		"SUM(NVL(T.XJ_XZFY, 0)) AS XJ_XZFY,              "+
		"SUM(NVL(T.PROFIT, 0)) AS PROFIT                 "+
		"FROM PMRT.TB_MRT_COST_UNIT_PROFIT T     ";*/
	var s="";
	for(var i=0;i<field.length;i++){
		if(s.length>0){
			s+=",";
		}
		s+="SUM(NVL(T."+field[i]+", 0)) AS "+field[i]+" ";
	}
	s+=" FROM PMRT.TB_MRT_COST_UNIT_PROFIT T    ";
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
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS AREANAME,MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS UNIT_ID," + getSumSql() +
		" WHERE T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY GROUP_ID_1,UNIT_ID ORDER BY GROUP_ID_1,UNIT_ID";
	} else if (orgLevel == 2) {//市
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS AREANAME,MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS UNIT_ID," + getSumSql() +
		" WHERE T.GROUP_ID_1 = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ORDER BY UNIT_ID";
	} else if (orgLevel == 3) {//营服中心
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS AREANAME,MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS UNIT_ID," + getSumSql() +
		" WHERE T.UNIT_ID = '"+code+"' AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ";
	} else{
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS AREANAME,MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS UNIT_ID," + getSumSql() +
		" WHERE 1=2 " +
		"GROUP BY UNIT_ID";
	}
	
	showtext = '成本费用展现报表-' + startdate+"-"+enddate;
	
	var title=[["地市","营服中心","营服编码","出帐收入(扣减赠费、退费)","","","","","","","成本费用合计","佣金","","","","","",
	            
	            "紧密外包费用","客户接入成本（含开通费及终端）"/**/,
	            "渠道补贴","终端补贴",
	            "卡成本","营业厅房租",
	            "水电物业费","广告宣传费","业务用品印制及材料费",
	            
	            "营销费用小计"/**/,"办公费","车辆使用费",
	            "招待费","差旅费","通信费","行政费用小计","毛利润"],
	            ["","","","合计","2G","3G","4G",
	             "宽带","专租线","固话","","合计",
	             "2G","3G","4G","固网","公共佣金",
	             "","","","","","","","","","","","","","","","",""]];
	
	downloadExcel(sql,title,showtext);
}
