var field= ["INCOME_2G","INCOME_3G", "INCOME_4G",
            "INCOME_KD","INCOME_ZX","INCOME_GH",
            "INCOME_TOTAL",
            "GRIDDING_TOTAL",
            "COMM_2G", "COMM_3G", "COMM_4G","COMM_HARDLINK",
            "COMM_GY","COMM_TOTAL",
            
            "FEE_JMWB",
            "CHANNEL","ZDBT_AMOUNT",
            "KVB_AMOUNT","FZF_AMOUNT",
            
            "SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT",
            
            "XJ_YXFY",
			"BGF_AMOUNT","CLSYF_AMOUNT",
            
            "ZDF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT",
            
            "XJ_XZFY",
			"LAN_XZ_SHARE_AMOUNT",
			"LAN_IRON_AMOUNT",
            "LAN_WARTER_ELE_AMOUNT","LAN_MAINTAI_AMOUNT",
            "LAN_RENT_AMOUNT","LAN_JRCB_AMOUNT","LAN_JRCB_KTF_AMOUNT","LAN_JRCB_ZD_AMOUNT","LAN_GOOD_AMOUNT",
            "LAN_XL_AMOUNT","LAN_XZ_AMOUNT","LAN_MAN_AMOUNT",
            "LAN_ALL_AMOUNT","PROFIT","LAN_PROFIT"];

var title=[["组织架构","出帐收入(扣减赠费、退费)","","","","","","","成本费用合计","佣金","","","","","","营销费用","","","","","","","","",
            "行政费用","","","","","","行政费用(共同)","网运成本","","","","","","","","","","","","毛利润","纳入网运成本后毛利"],
            ["","2G","3G","4G",
                     "宽带","专租线","固话","合计","",
                     "2G","3G","4G","固网","公共佣金","合计",
                     "紧密外包费用","渠道补贴","终端补贴","卡成本","营业厅房租(装修)","水电物业费","广告宣传费","业务用品印制及材料费","营销费用小计",
            "办公费","车辆使用费","招待费","差旅费","通信费","行政费用小计", "",
            "铁塔租费（不含水电）","网运水电费","代维费","网运房租及物业费","网运线客户接入成本合计","客户接入成本开通费","客户接入成本终端","网运费","网运修理费","网运行政费用","网运人工成本","网运成本合计",
            "",""]];

var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		closeHeader:true,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:0,css:LchReport.RIGHT_ALIGN},{array:[1,8,9,23,29,30,42,43,44],css:LchReport.NORMAL_STYLE}
		   /*  {eq:1,css:LchReport.TOTAL_STYLE},
		     {eq:9,css:LchReport.TOTAL_STYLE},
		     {eq:24,css:LchReport.TOTAL_STYLE},
		     {eq:30,css:LchReport.TOTAL_STYLE},
		     {eq:8,css:LchReport.TOTAL_STYLE}*/
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
///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
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
		s+="PODS.GET_RADIX_POINT(SUM(NVL(T."+field[i]+", 0)),2) AS "+field[i]+" ";
	}
	s+=" FROM PMRT.TB_MRT_COST_UNIT_PROFIT T ";
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
		" WHERE T.UNIT_ID IN("+_unit_relation(code)+") AND T.DEAL_DATE BETWEEN '"+startdate+"' and '"+enddate+"' " +
		"GROUP BY UNIT_ID ";
	} else{
		sql = "SELECT MAX(T.GROUP_ID_1_NAME) AS AREANAME,MAX(T.UNIT_NAME) AS GROUPNAME,T.UNIT_ID AS UNIT_ID," + getSumSql() +
		" WHERE 1=2 " +
		"GROUP BY UNIT_ID";
	}
	var showtext = '成本费用展现报表-' + startdate+"-"+enddate;
	var title=[["地市","营服中心","营服编码","出帐收入(扣减赠费、退费)","","","","","","","成本费用合计","佣金","","","","","","营销费用","","","","","","","","",
	                  "行政费用","","","","","","行政费用(共同)","网运成本","","","","","","","","","","","","毛利润","纳入网运成本后毛利"],
	                  ["","","","2G","3G","4G",
	                           "宽带","专租线","固话","合计","",
	                           "2G","3G","4G","固网","公共佣金","合计",
	                           "紧密外包费用","渠道补贴","终端补贴","卡成本","营业厅房租(装修)","水电物业费","广告宣传费","业务用品印制及材料费","营销费用小计",
	                  "办公费","车辆使用费","招待费","差旅费","通信费","行政费用小计", "",
	                  "铁塔租费（不含水电）","网运水电费","代维费","网运房租及物业费","网运线客户接入成本合计","客户接入成本开通费","客户接入成本终端","网运费","网运修理费","网运行政费用","网运人工成本","网运成本合计",
	                  "",""]];
	
	downloadExcel(sql,title,showtext);
}
