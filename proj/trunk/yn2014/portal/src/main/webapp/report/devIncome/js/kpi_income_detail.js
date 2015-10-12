var nowData = [];
var title=[["账期","地市","地市名称","基层单元编码","基层单元名称","编码","姓名","角色类型","渠道编码","用户编号","用户号码","类型","收入","上级HR编码","归属上级姓名","责任人编码","责任人"]];
var field=["账期","地市","地市名称","基层单元编码","基层单元名称","编码","姓名","角色类型","渠道编码","用户编号","用户号码","类型","收入","上级HR编码","归属上级姓名","责任人编码","责任人"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	
	var time=$.trim($("#time").val());
	var regionName=$.trim($("#regionName").val());
	var unitName=$.trim($("#unitName").val());
	var userName=$.trim($("#userName").val());
	var userCode=$.trim($("#userCode").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = "SELECT T.DEAL_DATE 账期,                                    "+
	"       T.GROUP_ID_1 地市,                                   	 "+
	"       T.GROUP_ID_1_NAME 地市名称,                          	 "+
	"       T.UNIT_ID 基层单元编码,                              	 "+
	"       T.UNIT_NAME 基层单元名称,                            	 "+
	"       T.HR_ID HR编码,                                       "+
	"       T.NAME 姓名,                                          "+
	"       CASE                                                 "+
	"         WHEN T.USER_ROLE = 1 THEN '集客经理'               	 "+
	"         WHEN T.USER_ROLE = 2 THEN '渠道经理'               	 "+
	"         WHEN T.USER_ROLE = 3 THEN '固网经理'               	 "+
	"         WHEN T.USER_ROLE = 4 THEN '营业人员'                 "+
	"         WHEN T.USER_ROLE IN (5, 6, 10) THEN '营服总'         "+
	"         ELSE '' END 角色类型,                                "+
	"         T.HQ_CHAN_CODE  渠道编码,                            "+
	"       TO_CHAR(T.SUBSCRIPTION_ID) 用户编号,                   "+
	"       T.DEVICE_NUMBER 用户号码,                            	 "+
	"       CASE                                                 "+
	"         WHEN T.NET_TYPE = '04' THEN '4G'                   "+
	"         WHEN T.NET_TYPE = '02' THEN '2G'                   "+
	"         WHEN T.NET_TYPE = '03' THEN '3G'                   "+
	"         WHEN T.NET_TYPE = '-1' THEN '固网'                  "+
	"         ELSE  '' END 类型,                                  "+
	"       T.TOTAL_FEE 收入,                                     "+
	"       T.F_HR_ID 上级HR编码,                                	 "+
	"       T1.NAME  归属上级姓名,                               	 "+
	"       T2.HR_ID 责任人编码,                                 	 "+
	"       T2.NAME  责任人                                      						     "+
	"  FROM (SELECT T.*, T1.F_HR_ID                              "+
	"          FROM PODS.TB_ODS_JCDY_INCOME_HR_MON T             "+
	"          LEFT JOIN (SELECT DISTINCT F_HR_ID, HR_ID         "+
	"                      FROM PORTAL.TAB_PORTAL_MAG_PERSON where deal_date='"+time+"' and f_hr_id<>hr_id) T1 "+
	"            ON T.HR_ID = T1.HR_ID                           "+
	"         WHERE T.DEAL_DATE = '"+time+"' ) T                 "+
	"  LEFT JOIN PORTAL.VIEW_U_PORTAL_PERSON T1                  "+
	"    ON T.F_HR_ID = T1.HR_ID                                 "+
	"   AND T1.USER_CODE IN (6, 7)                               "+
	"  LEFT JOIN PORTAL.VIEW_U_PORTAL_PERSON T2                  "+
	"    ON T.UNIT_ID = T2.UNIT_ID                               "+
	"   AND T2.user_CODE = 1 WHERE 1 = 1  and T1.deal_date='"+time+"' AND T2.deal_date='"+time+"'                     ";
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME like '%"+regionName+"%'";
	}
	if(unitName!=''){
		sql+=" AND T.UNIT_NAME like '%"+unitName+"%'";
	}
	if(userName!=''){
		sql+=" AND (T.NAME LIKE '%"+userName+"%' OR  T1.NAME LIKE '%"+userName+"%' OR T2.NAME LIKE '%"+userName+"%')";
	}
	if(userCode!=''){
		sql+=" AND T.DEVICE_NUMBER ='"+userCode+"'";
	}
//权限
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID ='"+code+"'";
	}else{
		sql+=" and T.GROUP_ID_1 ='"+regionCode+"'";
	}
	
	var csql = sql;
	/*old*/
	/*var cdata = query("select count(*) total " + csql);*/
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy="ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	if (orderBy != '') {
		sql += orderBy;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PODS.TB_ODS_JCDY_INCOME_HR_MON t where 1=1 and group_id_1_name is not null ";
	if(time!=''){
		
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.UNIT_ID='"+code+"'";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
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
	var time=$("#time").val();
	var sql = "select distinct t.UNIT_NAME from PODS.TB_ODS_JCDY_INCOME_HR_MON t where 1=1 ";
	if(time!=''){
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and t.UNIT_ID='"+code+"'";
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
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var sql = "SELECT T.DEAL_DATE 账期,                                    "+
	"       T.GROUP_ID_1 地市,                                   	 "+
	"       T.GROUP_ID_1_NAME 地市名称,                          	 "+
	"       T.UNIT_ID 基层单元编码,                              	 "+
	"       T.UNIT_NAME 基层单元名称,                            	 "+
	"       T.HR_ID HR编码,                                       "+
	"       T.NAME 姓名,                                          "+
	"       CASE                                                 "+
	"         WHEN T.USER_ROLE = 1 THEN '集客经理'               	 "+
	"         WHEN T.USER_ROLE = 2 THEN '渠道经理'               	 "+
	"         WHEN T.USER_ROLE = 3 THEN '固网经理'               	 "+
	"         WHEN T.USER_ROLE = 4 THEN '营业人员'                 "+
	"         WHEN T.USER_ROLE IN (5, 6, 10) THEN '营服总'         "+
	"         ELSE '' END 角色类型,                                "+
	"         T.HQ_CHAN_CODE  渠道编码,                            "+
	"       TO_CHAR(T.SUBSCRIPTION_ID) 用户编号,                   "+
	"       T.DEVICE_NUMBER 用户号码,                            	 "+
	"       CASE                                                 "+
	"         WHEN T.NET_TYPE = '04' THEN '4G'                   "+
	"         WHEN T.NET_TYPE = '02' THEN '2G'                   "+
	"         WHEN T.NET_TYPE = '03' THEN '3G'                   "+
	"         WHEN T.NET_TYPE = '-1' THEN '固网'                  "+
	"         ELSE  '' END 类型,                                  "+
	"       T.TOTAL_FEE 收入,                                     "+
	"       T.F_HR_ID 上级HR编码,                                	 "+
	"       T1.NAME  归属上级姓名,                               	 "+
	"       T2.HR_ID 责任人编码,                                 	 "+
	"       T2.NAME  责任人                                      						 "+
	"  FROM (SELECT T.*, T1.F_HR_ID                              "+
	"          FROM PODS.TB_ODS_JCDY_INCOME_HR_MON T             "+
	"          LEFT JOIN (SELECT DISTINCT F_HR_ID, HR_ID         "+
	"                      FROM PORTAL.TAB_PORTAL_MAG_PERSON where deal_date='"+time+"' AND f_hr_id<>hr_id) T1 "+
	"            ON T.HR_ID = T1.HR_ID                           "+
	"         WHERE T.DEAL_DATE = '"+time+"' ) T                 "+
	"  LEFT JOIN PORTAL.VIEW_U_PORTAL_PERSON T1                  "+
	"    ON T.F_HR_ID = T1.HR_ID                                 "+
	"   AND T1.USER_CODE IN (6, 7)                               "+
	"  LEFT JOIN PORTAL.VIEW_U_PORTAL_PERSON T2                  "+
	"    ON T.UNIT_ID = T2.UNIT_ID                               "+
	"   AND T2.user_CODE = 1  WHERE 1=1 AND T1.deal_date='"+time+"' AND T2.deal_date='"+time+"'                         ";
	

	var regionName=$.trim($("#regionName").val());
	var unitName=$.trim($("#unitName").val());
	var userName=$.trim($("#userName").val());
	var userCode=$.trim($("#userCode").val());
	var regionCode=$.trim($("#regionCode").val());
	
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME like '%"+regionName+"%'";
	}
	if(unitName!=''){
		sql+=" AND T.UNIT_NAME like '%"+unitName+"%'";
	}
	if(userName!=''){
		sql+=" AND (T.NAME LIKE '%"+userName+"%' OR  T1.NAME LIKE '%"+userName+"%' OR T2.NAME LIKE '%"+userName+"%')";
	}
	if(userCode!=''){
		sql+=" AND T.DEVICE_NUMBER ='"+userCode+"'";
	}
	
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var regionCode=$.trim($("#regionCode").val());
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and T.GROUP_ID_1 ='"+code+"'";
	}else if(orgLevel==3){
		sql+=" and T.UNIT_ID ='"+code+"'";
	}else{
		sql+=" and T.UNIT_ID ='"+code+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	var title=[["账期","地市","地市名称","基层单元编码","基层单元名称","编码","姓名","角色类型","渠道编码","用户编号","用户号码","类型","收入","上级HR编码","归属上级姓名","责任人编码","责任人"]];
	showtext = 'KPI收入明细报表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////