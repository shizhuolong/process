var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","HR_ID","HR_ID_NAME","GROUP_ID_4","GROUP_ID_4_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","INNET_DATE","ORIGINAL_CHNL","DEVELOPER","IS_ON","IS_NEW","PRODUCT_ID","PRODUCT_NAME","PRODUCT_FEE","NET_TYPE","YUYIN_MAX","GPRS_MAX","SMS_MAX","YUYIN","GPRS","SMS","YUYIN_2","GPRS_2","SMS_2","YUYIN_3","GPRS_3","SMS_3","YUYIN_4","GPRS_4","SMS_4","IS_SW","IS_JD","IS_LOW_DBH","IS_LOW_DZT","IS_ZLWB","CZ_AMOUNT","IS_CZ","IS_LOW_DBH_02","IS_LOW_DBH_03","IS_LOW_DBH_04","IS_LOW_DBH_ALL","IS_3_NULL_02","IS_3_NULL_03","IS_3_NULL_04","IS_3_NULL_ALL","IS_LOW_JD_02","IS_LOW_JD_03","IS_LOW_JD_04","IS_LOW_JD_ALL","IS_ZLWB_02","IS_ZLWB_03","IS_ZLWB_04","HQ_CHAN_CODE"];
var title=[["账期","地市编码","地市名称","营服中心编码","营服中心","渠道经理","渠道经理姓名","渠道","渠道名称","用户编号","电话号码","入网时间","原始开户渠道","发展人","是否在网","是否新增","套餐id","套餐名","套餐月费","用户类型","套餐内语音","套餐内流量","套餐内短信","入网当月语音","入网当月流量","入网当月短信","入网第二月语音","入网第二月流量","入网第二月短信","入网第三月语音","入网第三月流量","入网第三月短信","入网第四月语音","入网第四月流量","入网第四月短信","入网当月是否三无","入网当月是否极低","入网当月是否低饱和","入网当月是否低质态","入网当月是否资料完备","出账数目","入网当月是否出账","第二月是否低饱和","第三月是否低饱和","第四月是否低饱和","综合2、3、4月判断低饱和","第二月是否三无","第三月是否三无","第四月是否三无","综合2、3、4月判断三无","第二月是否极低","第三月是否极低","第四月是否极低","综合2、3、4月判断极低","第二月是否资料完备","第三月是否资料完备","第四月是否资料完备","发展渠道"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:17,css:LchReport.RIGHT_ALIGN}],
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
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var isSW=$("#isSW").val();
	var isJD=$("#isJD").val();
	var isZLWB=$("#isZLWB").val();
//条件
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_LOWER_BASE_MODEL where 1 = 1 ";
	if(time!=''){
		sql+=" and deal_date='"+time+"'";
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and UNIT_NAME = '"+unitName+"'";
	}
	if(phoneNumber!=''){
		sql+=" and DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(isSW!=''){
		sql+=" and IS_3_NULL_ALL= '"+isSW+"'";
	}
	if(isJD!=''){
		sql+=" and IS_LOW_JD_ALL= '"+isJD+"'";
	}
	if(isZLWB!=''){
		sql+=" and IS_ZLWB= '"+isZLWB+"'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	//var code=$("#code").val();
	var cityName=$("#cityName").val();
	if(orgLevel==1){
		
	}else{
		sql+=" and GROUP_ID_1_NAME='"+cityName+"'";
	}
	sql+=" order by GROUP_ID_1,UNIT_ID,HR_ID,GROUP_ID_4";
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
	var sql = "SELECT DISTINCT t.group_id_1,t.GROUP_ID_1_NAME FROM PCDE.TAB_CDE_CHANL_HQ_CODE t WHERE t.GROUP_ID_1_NAME <> '云南省直管-(省本部)' AND t.GROUP_ID_1_NAME <> '云南省本部' ";
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
	var sql = "select distinct t.UNIT_NAME from PCDE.TAB_CDE_CHANL_HQ_CODE t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1='"+code+"'";
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and t.group_id_4='"+code+"'";
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
	var casewhen=["IS_ON","IS_NEW","IS_SW","IS_JD","IS_LOW_DBH","IS_LOW_DZT","IS_ZLWB","IS_CZ","IS_LOW_DBH_02","IS_LOW_DBH_03","IS_LOW_DBH_04","IS_LOW_DBH_ALL","IS_3_NULL_02","IS_3_NULL_03","IS_3_NULL_04","IS_3_NULL_ALL","IS_LOW_JD_02","IS_LOW_JD_03","IS_LOW_JD_04","IS_LOW_JD_ALL","IS_ZLWB_02","IS_ZLWB_03","IS_ZLWB_04","IS_ZLWB_ALL"];
	var s="";
	for(var i=0;i<field.length;i++){
		if(field[i]=="NET_TYPE"){
			s+=",case when net_type='01' then '2G' when net_type in('02','03') then '3G' when net_type='50' then '4G' end net_type";
		}else if(field[i].substring(0,2)=="IS"){
			s+=",case when "+field[i]+"='1' then '是' else '否' end "+field[i];
		}else{
			if(i==0){
				s+=field[i];
			}else{
				if(field[i].substring(0,4)=="GPRS"){
					s+=",round("+field[i]+",2) "+field[i];
				}else{
					s+=","+field[i];
				}
				
			}
		}
	}
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var phoneNumber=$("#phoneNumber").val();
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var isSW=$("#isSW").val();
	var isJD=$("#isJD").val();
	var isZLWB=$("#isZLWB").val();
//条件
	var sql = "SELECT "+getSql()+" FROM PODS.TAB_ODS_234G_LOWER_BASE_MODEL where 1 = 1 ";
	if(time!=''){
		sql+=" and deal_date='"+time+"'";
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and UNIT_NAME = '"+unitName+"'";
	}
	if(phoneNumber!=''){
		sql+=" and DEVICE_NUMBER like '%"+phoneNumber+"%'";
	}
	if(isSW!=''){
		sql+=" and IS_3_NULL_ALL= '"+isSW+"'";
	}
	if(isJD!=''){
		sql+=" and IS_LOW_JD_ALL= '"+isJD+"'";
	}
	if(isZLWB!=''){
		sql+=" and IS_ZLWB= '"+isZLWB+"'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	//var code=$("#code").val();
	var cityName=$("#cityName").val();
	if(orgLevel==1){
		
	}else{
		sql+=" and GROUP_ID_1_NAME='"+cityName+"'";
	}
	sql+=" order by GROUP_ID_1,UNIT_ID,HR_ID,GROUP_ID_4";
	showtext = '用户质态判定表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////