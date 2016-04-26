var field=["INCOME_TOTAL","INCOME_2G","INCOME_3G","INCOME_4G","INCOME_KD",
           "INCOME_ZX","INCOME_GH","COMM_TOTAL_ABS","COMM_TOTAL_RATE","COMM_2G_ABS",
           "COMM_2G_RATE","COMM_3G_ABS","COMM_3G_RATE","COMM_4G_ABS",
           "COMM_4G_RATE","COMM_HARDLINK_ABS","COMM_HARDLINK_RATE",
           "COMM_GY_ABS","COMM_GY_RATE",
           "CHANNEL_ABS","CHANNEL_RATE","ADS_AMOUNT_ABS","ADS_AMOUNT_RATE",
           "YHJR_AMOUNT_ABS","YHJR_AMOUNT_RATE","ZDBT_AMOUNT_ABS",
           "ZDBT_AMOUNT_RATE","KVB_AMOUNT_ABS","KVB_AMOUNT_RATE",
           "FZF_AMOUNT_ABS","FZF_AMOUNT_RATE","SDWYF_AMOUNT_ABS",
           "SDWYF_AMOUNT_RATE","YWYPCLF_AMOUNT_ABS","YWYPCLF_AMOUNT_RATE",
           "XJ_YXFY_ABS","XJ_YXFY_RATE","CLSYF_AMOUNT_ABS","CLSYF_AMOUNT_RATE",
           "ZDF_AMOUNT_ABS","ZDF_AMOUNT_RATE","BGF_AMOUNT_ABS","BGF_AMOUNT_RATE",
           "CLF_AMOUNT_ABS","CLF_AMOUNT_RATE","TXF_AMOUNT_ABS","TXF_AMOUNT_RATE",
           "XJ_XZFY_ABS","XJ_XZFY_RATE","OTHER_AMOUNT_ABS","OTHER_AMOUNT_RATE"];

var title=[["地市","收入","","","","","","","佣金","","","","","","","","","","","","渠道补贴","","广告宣传费","","客户接入成本","","终端补贴","","卡成本","","房租","","水电物业费","","业务用品印制及材料费","","营销费用小计","","车辆使用费 ","","招待费","","办公费","","差旅费","","通信费","","行政费用小计","","其他",""],
           ["","小计","2G","3G","4G","宽带收入","专线收入","固话收入","小计","","2G","","3G","","4G","","固网","","公佣","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
           ["","","","","","","","","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比"]];

var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:1,css:LchReport.RIGHT_ALIGN}
		    /* {eq:3,css:LchReport.SUM_PART_STYLE},
		     {eq:7,css:LchReport.SUM_PART_STYLE},
		     {eq:8,css:LchReport.SUM_PART_STYLE}*/
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
			var where=" WHERE DEAL_DATE between '"+startdate+"' and '"+enddate+"'" ;
			var groupBy="";
			var orderBy="";
			var preSql="";
			var sql=getSumSql();
			if($tr){
				code=$tr.attr("GROUPID");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==1){//点击省
					preSql="select group_id_1 as groupid,group_id_1_name as groupname,";
					groupBy=" group by group_id_1,group_id_1_name";
					orderBy=" order by group_id_1";
					sql=preSql+sql+where+groupBy+orderBy;
					orgLevel++;
				}else if(orgLevel==2){//点击地市
					preSql="select unit_id as groupid,unit_name as groupname,";
					where+=" and group_id_1='"+code+"'";
					groupBy=" group by unit_id,unit_name";
					orderBy=" order by unit_id";
					sql=preSql+sql+where+groupBy+orderBy;
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preSql="select '云南省' as groupname,";
					sql=preSql+sql+where;
				}else if(orgLevel==2){//市
					preSql="select group_id_1 as groupid,group_id_1_name as groupname,";
					where+=" and group_id_1='"+code+"'";
					groupBy=" group by group_id_1,group_id_1_name";
					sql=preSql+sql+where+groupBy;
				}else if(orgLevel==3){//营服中心
					preSql="select unit_id as groupid,unit_name as groupname,";
					where+=" and unit_id='"+code+"'";
					groupBy=" group by unit_id,unit_name";
					sql=preSql+sql+where+groupBy;
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
function getSumSql() {
	var sql="SUM(INCOME_TOTAL) INCOME_TOTAL,                                                                            "+
	"       SUM(INCOME_2G) INCOME_2G,                                                                           "+
	"       SUM(INCOME_3G) INCOME_3G,                                                                           "+
	"       SUM(INCOME_4G) INCOME_4G,                                                                           "+
	"       SUM(INCOME_KD) INCOME_KD,                                                                           "+
	"       SUM(INCOME_ZX) INCOME_ZX,                                                                           "+
	"       SUM(COMM_TOTAL_ABS) COMM_TOTAL_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(COMM_TOTAL_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_TOTAL_RATE,        "+
	"       SUM(COMM_2G_ABS) COMM_2G_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(COMM_2G_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_2G_RATE,              "+
	"       SUM(COMM_3G_ABS) COMM_3G_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(COMM_3G_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_3G_RATE,              "+
	"       SUM(COMM_4G_ABS) COMM_4G_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(COMM_4G_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_4G_RATE,              "+
	"       SUM(COMM_HARDLINK_ABS) COMM_HARDLINK_ABS,                                                           "+
	"       TO_CHAR(ROUND(SUM(COMM_HARDLINK_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_HARDLINK_RATE,  "+
	"       SUM(CHANNEL_ABS) CHANNEL_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(CHANNEL_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' CHANNEL_RATE,              "+
	"       SUM(ADS_AMOUNT_ABS) ADS_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(ADS_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' ADS_AMOUNT_RATE,        "+
	"       SUM(YHJR_AMOUNT_ABS) YHJR_AMOUNT_ABS,                                                               "+
	"       TO_CHAR(ROUND(SUM(YHJR_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' YHJR_AMOUNT_RATE,      "+
	"       SUM(ZDBT_AMOUNT_ABS) ZDBT_AMOUNT_ABS,                                                               "+
	"       TO_CHAR(ROUND(SUM(ZDBT_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' ZDBT_AMOUNT_RATE,      "+
	"       SUM(KVB_AMOUNT_ABS) KVB_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(KVB_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' KVB_AMOUNT_RATE,        "+
	"       SUM(FZF_AMOUNT_ABS) FZF_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(FZF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' FZF_AMOUNT_RATE,        "+
	"       SUM(SDWYF_AMOUNT_ABS) SDWYF_AMOUNT_ABS,                                                             "+
	"       TO_CHAR(ROUND(SUM(SDWYF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' SDWYF_AMOUNT_RATE,    "+
	"       SUM(YWYPCLF_AMOUNT_ABS) YWYPCLF_AMOUNT_ABS,                                                         "+
	"       TO_CHAR(ROUND(SUM(YWYPCLF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' YWYPCLF_AMOUNT_RATE,"+
	"       SUM(XJ_YXFY_ABS) XJ_YXFY_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(XJ_YXFY_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' XJ_YXFY_RATE,              "+
	"       SUM(CLSYF_AMOUNT_ABS) CLSYF_AMOUNT_ABS,                                                             "+
	"       TO_CHAR(ROUND(SUM(CLSYF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' CLSYF_AMOUNT_RATE,    "+
	"       SUM(ZDF_AMOUNT_ABS) ZDF_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(ZDF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' ZDF_AMOUNT_RATE,        "+
	"       SUM(BGF_AMOUNT_ABS) BGF_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(BGF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' BGF_AMOUNT_RATE,        "+
	"       SUM(CLF_AMOUNT_ABS) CLF_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(CLF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' CLF_AMOUNT_RATE,        "+
	"       SUM(TXF_AMOUNT_ABS) TXF_AMOUNT_ABS,                                                                 "+
	"       TO_CHAR(ROUND(SUM(TXF_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' TXF_AMOUNT_RATE,        "+
	"       SUM(XJ_XZFY_ABS) XJ_XZFY_ABS,                                                                       "+
	"       TO_CHAR(ROUND(SUM(XJ_XZFY_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' XJ_XZFY_RATE,              "+
	"       SUM(OTHER_AMOUNT_ABS) OTHER_AMOUNT_ABS,                                                             "+
	"       TO_CHAR(ROUND(SUM(OTHER_AMOUNT_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' OTHER_AMOUNT_RATE,    "+
	"       SUM(INCOME_GH) INCOME_GH,                                                                           "+
    "       SUM(COMM_GY_ABS) COMM_GY_ABS,                                                                       "+
    "       TO_CHAR(ROUND(SUM(COMM_GY_ABS)/SUM(INCOME_TOTAL),4)*100,'fm990.00')||'%' COMM_GY_RATE               "+
	"  FROM PMRT.JCDY_MRT_PROFIT_ANALYS_MON                                                                     ";
	return sql;
}
function getSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		s += field[i];
	}
	return s+" from PMRT.JCDY_MRT_PROFIT_ANALYS_MON";
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var startdate = $.trim($("#startdate").val());
	var enddate = $.trim($("#enddate").val());
	var where=" WHERE DEAL_DATE between '"+startdate+"' and '"+enddate+"'" ;
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	var preSql="select group_id_1_name,unit_name,"
	var sql=preSql+getSql(field);
	if (orgLevel == 1) {//省
		sql+=where+orderBy;
	} else if (orgLevel == 2) {//市
		where+=" and group_id_1='"+code+"'";
		sql+=where+orderBy;
	} else if (orgLevel == 3) {//营服中心
		where+=" and unit_id='"+code+"'";
		sql+=where;
	} else{
		where=" and 1=2";
		sql+=where;
	}
	var title=[["地市","营服中心","收入","","","","","","","佣金","","","","","","","","","","","","渠道补贴","","广告宣传费","","客户接入成本","","终端补贴","","卡成本","","房租","","水电物业费","","业务用品印制及材料费","","营销费用小计","","车辆使用费 ","","招待费","","办公费","","差旅费","","通信费","","行政费用小计","","其他",""],
	           ["","","小计","2G","3G","4G","宽带收入","专线收入","固话收入","小计","","2G","","3G","","4G","","固网","","公佣","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	           ["","","","","","","","","","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比","绝对值","占收比"]];
	showtext = '效益分析展现报表-' + startdate+"-"+enddate;
	downloadExcel(sql,title,showtext);
}
