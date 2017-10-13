var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","UNIT_NAME" ,"HQ_CHAN_CODE" ,"HQ_CHAN_NAME" ,"BUSI_BEGIN_TIME" ,"HQ_STATE" ,"HQ_ZY" ,"THIRD_TYPE" ,"IS_TY" ,"IS_SOCIAL" ,"IS_DS" ,"END_TIME" ,"DEV_2G_NUM" ,"DEV_3G_NUM" ,"DEV_4G_NUM" ,"DEV_MOB_NUM" ,"DEV_KD_NUM" ,"DEV_ZZX_NUM" ,"DEV_NET_NUM" ,"DEV_OTHER_NUM" ,"DEV_COUNT" ,"CHARGE_YW" ,"CHARGE_GW" ,"ACC_NUM" ,"SR_DETAIL_SUM" ,"SR_DETAIL_YW" ,"SR_DETAIL_ZX" ,"SR_DETAIL_KD" ,"SR_DETAIL_GH" ,"SR_DETAIL_OTHER" ,"SR_DETAIL_SUM1" ,"HQ_COST_ALL" ,"COST_RATE" ,"MAN_COST_CONT" ,"MAN_COST_JM" ,"MAN_COST_FINACE" ,"MAN_COST_ALL" ,"YJ_ALL" ,"HQ_QDBT" ,"TERM_BT" ,"HQ_RENT" ,"HQ_ZX_FEE" ,"KHJR_AMOUNT" ,"KCB_COST" ,"YF_MON_YW" ,"YF_MON_ZX" ,"YF_MON_KD" ,"YF_MON_GH" ,"YF_MON_OTHER" ,"YF_MON_SUM" ,"COMMFEE_MOB_ZSHB  " ,"COMMFEE_ZZX_ZSHB" ,"COMMFEE_KD_ZSHB" ,"COMMFEE_NET_ZSHB" ,"COMMFEE_ZSHB" ,"SUBS_OWE" ,"SUBS_PAY" ,"SECOND_PAY" ,"COMM_STOP"];
var title=[["地市","所属基层单元","渠道编码","渠道名称","目前经营者开始合作时间","渠道状态","渠道专业","三级属性","是否自建他营","是否社会化合作","是否代收费点(1是 0不是)","清算终止时间","发展用户数","","","","","","","","","出账用户数","","","出账收入","其中：出账收入明细","","","","","","成本合计","成本占收比(%)","人工成本（应发数）","","","","佣金","渠道补贴","终端补贴","房租费","营业厅装修","客户接入成本","卡成本","其中：佣金明细分类一","","","","","","其中：佣金占收比分类一","","","","","用户欠费","用户预存款","二次续费率","终止清算佣金"],
           ["","","","","","","","","","","","","2G发展量","3G发展量","4G发展量","移网合计","宽带发展量","专租线发展量","固话发展量","其他发展量","合计","移网","固网","合计","","移网","专线","宽带","固话","其他","小计","","","合同制","紧密型","财务列账","小计","","","","","","","","移网","专线","宽带","固话","不可分摊","合计","移网","专线","宽带","固话","总佣金占收比","","","",""]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
//分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', //上一页按钮里text  
		next_text : '下页', //下一页按钮里text  
		num_display_entries : 5,
		num_edge_entries : 2
	});
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$.trim($("#regionCode").val());
	var hqChanName=$.trim($("#hqChanName").val());
	var hqChanCode=$.trim($("#hqChanCode").val());
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var where = "WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		where+=" AND T2.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		where+=" AND T2.UNIT_ID ='"+code+"'";
	}
	//条件
	if(regionCode!=''){
		where+=" AND T2.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		where+=" AND T2.HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T2.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	
	var sql=getSql();
	sql+=where;
	sql+=getGroupBy();
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
	+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var s="SELECT T2.GROUP_ID_1_NAME                                                                           "+
    "    ,T2.UNIT_NAME                                                                                               "+
    "    ,T2.HQ_CHAN_CODE                                                                                            "+
    "    ,T2.HQ_CHAN_NAME                                                                                            "+
    "    ,T2.BUSI_BEGIN_TIME                                                                                         "+
    "    ,T2.HQ_STATE                                                                                                "+
    "    ,T2.HQ_ZY                                                                                                   "+
    "    ,T2.THIRD_TYPE                                                                                              "+
    "    ,T2.IS_TY                                                                                                   "+
    "    ,T2.IS_SOCIAL                                                                                               "+
    "    ,T2.IS_DS                                                                                                   "+
    "    ,T2.END_TIME                                                                                                "+
    "    ,SUM(NVL(T.DEV_2G_NUM,0)) DEV_2G_NUM                                                                        "+
    "    ,SUM(NVL(T.DEV_3G_NUM,0)) DEV_3G_NUM                                                                        "+
    "    ,SUM(NVL(T.DEV_4G_NUM,0)) DEV_4G_NUM                                                                        "+
    "    ,SUM(NVL(T.DEV_MOB_NUM,0))  DEV_MOB_NUM                                                                     "+
    "    ,SUM(NVL(T.DEV_KD_NUM,0))  DEV_KD_NUM                                                                       "+
    "    ,SUM(NVL(T.DEV_ZZX_NUM,0)) DEV_ZZX_NUM                                                                      "+
    "    ,SUM(NVL(T.DEV_NET_NUM,0))  DEV_NET_NUM                                                                     "+
    "    ,SUM(NVL(T.DEV_OTHER_NUM,0)) DEV_OTHER_NUM                                                                  "+
    "    ,SUM(NVL(T.DEV_COUNT,0))  DEV_COUNT                                                                         "+
    "    ,SUM(CASE WHEN T.DEAL_DATE ='"+endDate+"' THEN NVL(T.CHARGE_YW ,0) END)  CHARGE_YW                              "+
    "    ,SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.CHARGE_GW  ,0) END)  CHARGE_GW                             "+
    "    ,SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.ACC_NUM ,0)END )  ACC_NUM                                  "+
    "    ,SUM(NVL(T.SR_DETAIL_SUM ,0))  SR_DETAIL_SUM                                                                "+
    "    ,SUM(NVL(T.SR_DETAIL_YW ,0))  SR_DETAIL_YW                                                                  "+
    "    ,SUM(NVL(T.SR_DETAIL_ZX ,0))  SR_DETAIL_ZX                                                                  "+
    "    ,SUM(NVL(T.SR_DETAIL_KD ,0))  SR_DETAIL_KD                                                                  "+
    "    ,SUM(NVL(T.SR_DETAIL_GH ,0))  SR_DETAIL_GH                                                                  "+
    "    ,SUM(NVL(T.SR_DETAIL_OTHER ,0))  SR_DETAIL_OTHER                                                            "+
    "    ,SUM(NVL(T.SR_DETAIL_SUM ,0))  SR_DETAIL_SUM1                                                               "+
    "    ,SUM(NVL(T.HQ_COST_ALL ,0))  HQ_COST_ALL                                                                    "+
    "    ,TRIM('.'FROM TO_CHAR(CASE WHEN SUM(NVL(T.SR_DETAIL_SUM, 0))=0 THEN 0                                       "+
    "        ELSE  SUM(NVL(T.HQ_COST_ALL, 0))*100/SUM(NVL(T.SR_DETAIL_SUM, 0)) END                                   "+
    "    ,'FM99999999990.99')) ||'%' COST_RATE                                                                        "+
    "    ,SUM(NVL(T.MAN_COST_CONT  ,0))  MAN_COST_CONT                                                               "+
    "    ,SUM(NVL(T.MAN_COST_JM ,0))  MAN_COST_JM                                                                    "+
    "    ,SUM(NVL(T.MAN_COST_FINACE ,0))  MAN_COST_FINACE                                                            "+
    "    ,SUM(NVL(T.MAN_COST_ALL,0))  MAN_COST_ALL                                                                   "+
    "    ,SUM(NVL(T.YJ_ALL,0))  YJ_ALL                                                                               "+
    "    ,SUM(NVL(T.HQ_QDBT,0))  HQ_QDBT                                                                             "+
    "    ,SUM(NVL(T.TERM_BT,0))  TERM_BT                                                                             "+
    "    ,SUM(NVL(T.HQ_RENT  ,0))  HQ_RENT                                                                           "+
    "    ,SUM(NVL(T.HQ_ZX_FEE,0))  HQ_ZX_FEE                                                                         "+
    "    ,SUM(NVL(T.KHJR_AMOUNT,0))  KHJR_AMOUNT                                                                     "+
    "    ,SUM(NVL(T.KCB_COST  ,0))  KCB_COST                                                                         "+
    "    ,SUM(NVL(T.YF_MON_YW ,0))  YF_MON_YW                                                                        "+
    "    ,SUM(NVL(T.YF_MON_ZX,0))  YF_MON_ZX                                                                         "+
    "    ,SUM(NVL(T.YF_MON_KD ,0))  YF_MON_KD                                                                        "+
    "    ,SUM(NVL(T.YF_MON_GH ,0))  YF_MON_GH                                                                        "+
    "    ,SUM(NVL(T.YF_MON_OTHER ,0))  YF_MON_OTHER                                                                  "+
    "    ,SUM(NVL(T.YF_MON_SUM,0))  YF_MON_SUM                                                                       "+
    "    ,CASE WHEN SUM(NVL(T.SR_DETAIL_YW,0))=0 THEN '0.00'                                                         "+
    "                           ELSE TRIM('.' FROM  TO_CHAR(SUM(NVL(T.YF_MON_YW,0))*100/SUM(NVL(T.SR_DETAIL_YW,0))   "+
    "                                           ,'FM999990.99')) END || '%'  COMMFEE_MOB_ZSHB                        "+
    "    ,CASE WHEN SUM(NVL(T.SR_DETAIL_ZX,0))=0 THEN '0.00'                                                         "+
    "                           ELSE TRIM('.' FROM  TO_CHAR(SUM(NVL(T.YF_MON_ZX,0))*100/SUM(NVL(T.SR_DETAIL_ZX,0))   "+
    "                                           ,'FM999990.99')) END || '%'  COMMFEE_ZZX_ZSHB                        "+
    "    ,CASE WHEN SUM(NVL(T.SR_DETAIL_KD,0))=0 THEN '0.00'                                                         "+
    "                           ELSE TRIM('.' FROM  TO_CHAR(SUM(NVL(T.YF_MON_KD,0))*100/SUM(NVL(T.SR_DETAIL_KD,0))   "+
    "                                           ,'FM999990.99')) END || '%'  COMMFEE_KD_ZSHB                         "+
    "    ,CASE WHEN SUM(NVL(T.SR_DETAIL_GH,0))=0 THEN '0.00'                                                         "+
    "                           ELSE TRIM('.' FROM  TO_CHAR(SUM(NVL(T.YF_MON_GH,0))*100/SUM(NVL(T.SR_DETAIL_GH,0))   "+
    "                                           ,'FM999990.99')) END || '%'  COMMFEE_NET_ZSHB                        "+
    "    ,CASE WHEN SUM(NVL(T.SR_DETAIL_SUM,0))=0 THEN '0.00'                                                        "+
    "                           ELSE TRIM('.' FROM  TO_CHAR(SUM(NVL(T.YF_MON_SUM,0))*100/SUM(NVL(T.SR_DETAIL_SUM,0)) "+
    "                                           ,'FM999990.99')) END || '%'  COMMFEE_ZSHB                            "+
    "    ,SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.SUBS_OWE,0)END) SUBS_OWE                                 "+
    "    ,SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN  NVL(T.SUBS_PAY,0)END) SUBS_PAY                                "+
    "    ,CASE WHEN SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.INNET_7_NUM, 0) END) = 0 THEN '0.00'           "+
    "         ELSE TRIM('.' FROM TO_CHAR(SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.XF_7_NUM, 0) END) * 100   "+
    "                       / SUM(CASE WHEN T.DEAL_DATE = '"+endDate+"' THEN NVL(T.INNET_7_NUM, 0) END),                "+
    "                   'FM999990.99')) END || '%' SECOND_PAY                                                        "+
    "    ,SUM(NVL(T.COMM_STOP  ,0))  COMM_STOP                                                                       "+
	"	FROM PMRT.TAB_MRT_STRATE_COST_BEN_MON T                                                                      "+
	"	LEFT JOIN (SELECT * FROM PMRT.TAB_MRT_STRATE_COST_BEN_MON WHERE DEAL_DATE = '"+endDate+"') T2                     "+
	"	ON (T.HQ_CHAN_CODE=T2.HQ_CHAN_CODE)                                                                          ";                                                                       
	return s;
}
function getGroupBy(){
	var s = "GROUP BY T2.GROUP_ID_1_NAME                                                                             "+
    "    ,T2.UNIT_NAME                                                                                               "+
    "    ,T2.HQ_CHAN_CODE                                                                                            "+
    "    ,T2.HQ_CHAN_NAME                                                                                            "+
    "    ,T2.BUSI_BEGIN_TIME                                                                                         "+
    "    ,T2.HQ_STATE                                                                                                "+
    "    ,T2.HQ_ZY                                                                                                   "+
    "    ,T2.THIRD_TYPE                                                                                              "+
    "    ,T2.IS_TY                                                                                                   "+
    "    ,T2.IS_SOCIAL                                                                                               "+
    "    ,T2.IS_DS                                                                                                   "+
    "    ,T2.END_TIME                                                                                                ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$.trim($("#regionCode").val());
	var hqChanName=$.trim($("#hqChanName").val());
	var hqChanCode=$.trim($("#hqChanCode").val());
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var where = "WHERE T.DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"' ";
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		where+=" AND T2.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		where+=" AND T2.UNIT_ID ='"+code+"'";
	}
	//条件
	if(regionCode!=''){
		where+=" AND T2.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanName!=''){
		where+=" AND T2.HQ_CHAN_NAME LIKE '%"+hqChanName+"%'";
	}
	if(hqChanCode!=''){
		where+=" AND T2.HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	
	var sql=getSql();
	sql+=where;
	sql+=getGroupBy();
	
	showtext = "战略渠道效能分析明细表";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
