var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","INNET_DATE","DEVELOPER1","DEVELOPER","IS_ON","IS_NEW","PRODUCT_ID","PRODUCT_NAME","PRODUCT_FEE","NET_TYPE","YUYIN_MAX","GPRS_MAX","SMS_MAX","YUYIN","GPRS","SMS","IS_SW","IS_JD","IS_LOW_DBH","IS_LOW_DZT","IS_ZLWB","CZ_AMOUNT","IS_CZ"];
var title=[["账期","地市","营服中心","用户编号","电话号码","入网日期","发展渠道","发展人","是否在网","是否新入网","套餐id","套餐名称","套餐月费（元）","用户类型","套包内语音（分钟）","套包内流量（m）","套包内短信（条）","当月语音(分钟)","当月流量(m)","当月短信(条)","是否三无","是否极低","是否低饱和","是否低质态","是否资料完备","当月出账金额（元）","是否出账"]];
var orderBy='';	
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:11,css:LchReport.RIGHT_ALIGN}],
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
	var phoneNumber=$("#phoneNumber").val();
	var time=$("#time").val();
	var code =$("#code").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var isSW=$("#isSW").val();
	var isJD=$("#isJD").val();
	var isZLWB=$("#isZLWB").val();
	var hqChanCode=$("#hqChanCode").val();
//条件
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_BASE_MODEL_MON T1  where  t1.deal_date ='"+time+"'";
	if(time!=''){
		sql+=" and to_date(T1.deal_date,'YYYYMM') >= ADD_MONTHS(to_date("+time+",'YYYYMM'),-5)";
	}
	if(regionCode!=''){
		sql+=" and T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" and T1.UNIT_ID = '"+unitCode+"'";
	}
	if(phoneNumber!=''){
		sql+=" and T1.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(isSW!=''){
		sql+=" and T1.IS_SW= '"+isSW+"'";
	}
	if(isJD!=''){
		sql+=" and T1.IS_JD= '"+isJD+"'";
	}
	if(isZLWB!=''){
		sql+=" and T1.IS_ZLWB= '"+isZLWB+"'";
	}
	if(hqChanCode!=''){
		sql+=" and T1.ORIGINAL_CHNL like '%"+hqChanCode+"%'";
	}
//权限
	
	
	var orgLevel=$("#orgLevel").val();
	var cityName=$("#cityName").val();
	if(orgLevel==1){
	}else if(orgLevel==2){
		sql+=" and T1.GROUP_ID_1='"+code+"'";	
	}else if(orgLevel==3){
		sql+=" AND T1.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}else if(orgLevel==4){
		sql+=" and T1.GROUP_ID_4='"+code+"'";
	}else{
	}
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	var s="T1.DEAL_DATE,T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.SUBSCRIPTION_ID,T1.DEVICE_NUMBER,T1.INNET_DATE,T1.DEVELOPER1,T1.DEVELOPER,CASE WHEN T1.IS_ON='1' THEN '是' ELSE '否' END IS_ON,CASE WHEN T1.IS_NEW='1' THEN '是' ELSE '否' END IS_NEW,T1.PRODUCT_ID,T1.PRODUCT_NAME,T1.PRODUCT_FEE,CASE WHEN T1.NET_TYPE='-1' THEN '固网' WHEN T1.NET_TYPE='01' THEN '2G' WHEN T1.NET_TYPE IN('02','03') THEN '3G' WHEN T1.NET_TYPE='50' THEN '4G' END NET_TYPE,T1.YUYIN_MAX,T1.GPRS_MAX,T1.SMS_MAX,T1.YUYIN,ROUND(T1.GPRS,2) GPRS,T1.SMS,CASE WHEN T1.IS_SW='1' THEN '是' ELSE '否' END IS_SW,CASE WHEN T1.IS_JD ='1' THEN '是' ELSE '否' END IS_JD ,CASE WHEN T1.IS_LOW_DBH ='1' THEN '是' ELSE '否' END IS_LOW_DBH ,CASE WHEN T1.IS_LOW_DZT ='1' THEN '是' ELSE '否' END IS_LOW_DZT ,CASE WHEN T1.IS_ZLWB ='1' THEN '是' ELSE '否' END IS_ZLWB ,T1.CZ_AMOUNT,CASE WHEN T1.IS_CZ ='1' THEN '是' ELSE '否' END IS_CZ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var phoneNumber=$("#phoneNumber").val();
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var isSW=$("#isSW").val();
	var isJD=$("#isJD").val();
	var isZLWB=$("#isZLWB").val();
	var hqChanCode=$("#hqChanCode").val();
	
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_BASE_MODEL_MON  T1 where 1 = 1 AND t1.deal_date ='"+time+"'";
	if(time!=''){
		sql+=" and to_date(T1.deal_date,'YYYYMM') >= ADD_MONTHS(to_date("+time+",'YYYYMM'),-5)";
	}
	if(regionCode!=''){
		sql+=" and T1.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T1.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(phoneNumber!=''){
		sql+=" and T1.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(isSW!=''){
		sql+=" and T1.IS_SW= '"+isSW+"'";
	}
	if(isJD!=''){
		sql+=" and T1.IS_JD= '"+isJD+"'";
	}
	if(isZLWB!=''){
		sql+=" and T1.IS_ZLWB= '"+isZLWB+"'";
	}
	if(hqChanCode!=''){
		sql+=" and T1.ORIGINAL_CHNL like '%"+hqChanCode+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var cityName=$("#cityName").val();
	if(orgLevel==1){
		/*sql+=" order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID";*/
	}else if(orgLevel==2){
		sql+=" and T1.GROUP_ID_1='"+code+"'" /*order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID */;
	}else if(orgLevel==3){
		sql+=" and T1.UNIT_ID='"+code+"'"/*order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID */;
	}else if(orgLevel==4){
		sql+=" and T1.GROUP_ID_4='"+code+"'" /*order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID */;
	}else{
	}
	showtext = '用户质态管控表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////