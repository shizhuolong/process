var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","INNET_DATE","DEVELOPER1","DEVELOPER","IS_ON","IS_NEW","PRODUCT_ID","PRODUCT_NAME","PRODUCT_FEE","NET_TYPE","YUYIN_MAX","GPRS_MAX","SMS_MAX","YUYIN","GPRS","SMS","IS_SW","IS_JD","IS_LOW_DBH","IS_LOW_DZT","IS_ZLWB","CZ_AMOUNT","IS_CZ"];
var title=[["账期","地市","营服中心","用户编号","电话号码","入网日期","发展渠道","发展人","是否在网","是否新入网","套餐id","套餐名称","套餐月费（元）","用户类型","套包内语音（分钟）","套包内流量（m）","套包内短信（条）","当月语音(分钟)","当月流量(m)","当月短信(条)","是否三无","是否极低","是否低饱和","是否低质态","是否资料完备","当月出账金额（元）","是否出账"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
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
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
//条件
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_BASE_MODEL_MON T1  where 1 = 1 AND t1.deal_date ='"+time+"'";
	if(time!=''){
		sql+=" and to_date(T1.deal_date,'YYYYMM') >= ADD_MONTHS(to_date("+time+",'YYYYMM'),-5)";
	}
	if(regionName!=''){
		sql+=" and T1.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and T1.UNIT_NAME = '"+unitName+"'";
	}
	if(phoneNumber!=''){
		sql+=" and T1.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
//权限
	
	
	var orgLevel=$("#orgLevel").val();
	/*alert(orgLevel);*/
	var cityName=$("#cityName").val();
	if(orgLevel==1){
		sql+="  order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID";
	}else if(orgLevel==2){
		sql+=" and T1.GROUP_ID_1='"+code+"' order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID";
	}else if(orgLevel==3){
		alert("---->"+3);
		sql+=" and T1.UNIT_ID='"+code+"'order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID ";
	}else if(orgLevel==4){
		sql+=" and T1.GROUP_ID_4='"+code+"'order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID ";
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
function listRegions(){
	var sql="";
	var sql = "SELECT DISTINCT t.group_id_1,t.GROUP_ID_1_NAME FROM PODS.TAB_ODS_234G_BASE_MODEL_MON t WHERE t.GROUP_ID_1_NAME <> '云南省直管-(省本部)' AND t.GROUP_ID_1_NAME <> '云南省本部' ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.GROUP_ID_4='"+code+"'";
	}
	sql+=" order by t.group_id_1 ";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#unitName");
	var sql = "select distinct t.UNIT_NAME from PODS.TAB_ODS_234G_BASE_MODEL_MON t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and t.grou_id_4='"+code+"'";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_NAME
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取基层单元信息失败");
	}
}
function getSql(){
	var s="T1.deal_date,T1.GROUP_ID_1_NAME,T1.UNIT_NAME,T1.subscription_id,T1.device_number,T1.innet_date,T1.developer1,T1.developer,case when T1.is_on='1' then '是' else '否' end is_on,case when T1.is_new='1' then '是' else '否' end is_new,T1.product_id,T1.product_name,T1.product_fee,case when T1.net_type='-1' then '固网' when T1.net_type='01' then '2G' when T1.net_type in('02','03') then '3G' when T1.net_type='50' then '4G' end net_type,T1.yuyin_max,T1.gprs_max,T1.sms_max,T1.yuyin,round(T1.gprs,2) gprs,T1.sms,case when T1.is_sw='1' then '是' else '否' end is_sw,case when T1.is_jd ='1' then '是' else '否' end is_jd ,case when T1.is_low_dbh ='1' then '是' else '否' end is_low_dbh ,case when T1.is_low_dzt ='1' then '是' else '否' end is_low_dzt ,case when T1.is_zlwb ='1' then '是' else '否' end is_zlwb ,T1.cz_amount,case when T1.is_cz ='1' then '是' else '否' end is_cz";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var phoneNumber=$("#phoneNumber").val();
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_BASE_MODEL_MON  T1 where 1 = 1 AND t1.deal_date ='"+time+"'";
	if(time!=''){
		sql+=" and to_date(T1.deal_date,'YYYYMM') >= ADD_MONTHS(to_date("+time+",'YYYYMM'),-5)";
	}
	if(regionName!=''){
		sql+=" and T1.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and T1.UNIT_NAME = '"+unitName+"'";
	}
	if(phoneNumber!=''){
		sql+=" and T1.DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var cityName=$("#cityName").val();
	if(orgLevel==1){
		SQL+=" order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID";
	}else if(orgLevel==2){
		sql+=" and T1.GROUP_ID_1='"+code+"' order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID ";
	}else if(orgLevel==3){
		sql+=" and T1.UNIT_ID='"+code+"'order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID ";
	}else if(orgLevel==4){
		sql+=" and T1.GROUP_ID_4='"+code+"'order by T1.DEAL_DATE,T1.GROUP_ID_1,T1.UNIT_ID,T1.GROUP_ID_4,T1.PRODUCT_ID ";
	}else{
	}
	showtext = '低质态用户管控报表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////