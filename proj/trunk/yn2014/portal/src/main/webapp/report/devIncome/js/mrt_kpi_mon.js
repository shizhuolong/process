var nowData = [];
var title=[["地市"			,"基层单元"	,"账期"		,"HR编码"		,"人员姓名"	,"角色类型"		,"积分(发展)"		,""					,""								,""						,""					,"收入"			,""			,""					,""				,""				,"欠费"		,""					,""				,""				,""					,"存量"			,""				,""					,""					,""					,"毛利"			,""			,""					,""				,""				,"本厅收入<br/>完成率"		,""						,"省级KPI权重"			,"省级KPI得分"		,"自设KPI得分"		,"汇总KPI得分"		,"基础绩效<br/>基数（元）"	,"基础绩效<br/>薪酬（元）"],
           [""				,""			,""			,""			,""			,""				,"积分(发展)任务"	,"积分(发展)完成"		,"积分(发展)任务<br/>完成率"			,"积分(发展)<br/>KPI得分"		,"积分(发展)<br/>KPI权重"	,"收入任务"		,"收入完成"	,"收入任务<br/>完成率"		,"收入KPI得分"		,"收入KPI权重"		,"欠费"		,"本月累计<br/>达到收入"		,"欠费率"			,"欠费KPI得分"		,"欠费KPI权重"			,"上年12月收入"		,"存量收入"		,"存量收入<br/>保有率"		,"存量KPI得分"			,"存量KPI权重"			,"毛利预算"		,"毛利完成"	,"毛利任务<br/>完成率"		,"毛利KPI得分"		,"毛利KPI权重"		,"本厅收入<br/>完成率权重"		,"本厅收入<br/>完成率得分"			,""					,""				,""				,""				,""				,""					]
		];
var field=["GROUP_ID_1_NAME","UNIT_NAME","DEAL_DATE","HR_ID"	,"NAME"		,"USER_ROLE"	,	"TASK_DEV"	,"DEV_COUNT"		,"DEV_COMPLETE"					,"DEV_KPI_VALUE"		,"DEV_KPI_WEIGHT"	,"TASK_INCOME"	,"TOTAL_FEE","INCOME_COMPLETE"	,"IN_KPI_VALUE"	,"IN_KPI_WEIGHT","OWEFEE"	,"AMOUNT_MONTH"		,"OWEFEE_RATE"	,"OWE_KPI_VALUE","OWE_KPI_WEIGHT"	,"AMOUNT_12"	,"AMOUNT_ALL"	,"STOCK_RATE"		,"STOCK_KPI_VALUE"	,"STOCK_KPI_WEIGHT"	,"BUDEGET_TASK"	,"BUDGET_ML","ML_COMPLETE"		,"ML_KPI_VALUE"	,"ML_KPI_WEIGHT","KHDF_WEIGHT"		,"KHDF_VALUE"			,"PROV_KPI_WEIGHT"	,"PROV_KPI_SCORE","CUSTOM_KPI"	,"KPI_RESULT"	,"BASE_SALARY"	,"BASE_KPI_SALARY"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	listUserRole();
	report = new LchReport({
		title : title,
		field : field,
		lock:3,
		css:[{gt:5,css:LchReport.RIGHT_ALIGN},{eq:1,css:{minWidth:'100px'}},{eq:3,css:{minWidth:'140px'}},{array:[9,14,19,24,29,32,34,35,36],css:LchReport.NORMAL_STYLE}],
		tableCss:{leftWidth:350},
		rowParams : ["DEAL_DATE","HR_ID","UNIT_ID","USER_ROLE"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
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
	
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	var user_role=$("#user_role").val();
//条件
	var sql = getSelsectSql()+" WHERE T.DEAL_DATE='"+time+"'";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(user_role!=''){
		sql+=" AND USER_ROLE = '"+user_role+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 "; 
		 }
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
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
	//$(".page_count").width($("#lch_DataHead").width());
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
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
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
		sql+=" and t.HR_ID='"+hrId+"'";
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
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_MRT_KPI_REPORT_MON t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
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
			sql+=" and t.HR_ID='"+hrId+"'";
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

function listUserRole(){
	var sql="SELECT DISTINCT USER_ROLE FROM PMRT.TB_JCDY_JF_ALL_MON WHERE USER_ROLE IS NOT NULL";
	var html="";
	var data=query(sql);
	if(data){
		html="<option value=''>全部</option>";
		for(var i=0;i<data.length;i++){
			html+="<option value='"+data[i].USER_ROLE+"'>"+data[i].USER_ROLE+"</option>";
		}
	}else{
		alert("获取人员角色信息失败");
	}
	$("#user_role").append($(html));
}

function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["账期","地市","基层单元","HR编码","人员姓名","角色类型","积分(发展)","","","","","收入","","","","","欠费","","","","","存量","","","","","毛利","","","","","本厅收入完成率","","省级KPI权重","省级KPI得分","自设KPI得分","汇总KPI得分","基础绩效基数（元）","基础绩效薪酬（元）"],
	           ["","","","","","","积分(发展)任务","积分(发展)完成","积分(发展)任完成率","积分(发展)KPI得分","积分(发展)KPI权重","收入任务","收入完成","收入任务完成率","收入KPI得分","收入KPI权重","欠费","本月累计达到收入","欠费率","欠费KPI得分","欠费KPI权重","上年12月收入","存量收入","存量收入保有率","存量KPI得分","存量KPI权重","毛利预算","毛利完成","毛利任务完成率","毛利KPI得分","毛利KPI权重","本厅收入完成率权重","本厅收入完成率得分","","","","","",""]
	];
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	var user_role=$("#user_role").val();
	//条件
	var sql = getSelsectSql()+" WHERE T.DEAL_DATE='"+time+"'";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	if(user_role!=''){
		sql+=" AND USER_ROLE = '"+user_role+"'";
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else{
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and t.HR_ID in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 "; 
		 }
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	//console.log(sql);
	showtext = 'KPI汇总月报-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////

function getSelsectSql(){
	
	var sql ="SELECT T.DEAL_DATE                                            , "+
			"T.GROUP_ID_1_NAME                                              , "+
			"T.UNIT_NAME                                                    , "+
			"T.HR_ID                                                        , "+
			"T.NAME                                                         , "+
			"T.USER_ROLE                                                    , "+
			"T.TASK_DEV                                                     , "+
			"PODS.GET_RADIX_POINT(DEV_COUNT         ,2) AS DEV_COUNT        , "+
			"PODS.GET_RADIX_POINT(DEV_COMPLETE      ,2) AS DEV_COMPLETE     , "+
			"PODS.GET_RADIX_POINT(DEV_KPI_VALUE     ,2) AS DEV_KPI_VALUE    , "+
			"PODS.GET_RADIX_POINT(DEV_KPI_WEIGHT    ,2) AS DEV_KPI_WEIGHT   , "+
			"PODS.GET_RADIX_POINT(TASK_INCOME       ,2) AS TASK_INCOME      , "+
			"PODS.GET_RADIX_POINT(TOTAL_FEE         ,2) AS TOTAL_FEE        , "+
			"PODS.GET_RADIX_POINT(INCOME_COMPLETE   ,2) AS INCOME_COMPLETE  , "+
			"PODS.GET_RADIX_POINT(IN_KPI_VALUE      ,2) AS IN_KPI_VALUE     , "+
			"PODS.GET_RADIX_POINT(IN_KPI_WEIGHT     ,2) AS IN_KPI_WEIGHT    , "+
			"PODS.GET_RADIX_POINT(OWEFEE            ,2) AS OWEFEE           , "+
			"PODS.GET_RADIX_POINT(AMOUNT_MONTH      ,2) AS AMOUNT_MONTH     , "+
			"PODS.GET_RADIX_POINT(OWEFEE_RATE       ,2) AS OWEFEE_RATE      , "+
			"PODS.GET_RADIX_POINT(OWE_KPI_VALUE     ,2) AS OWE_KPI_VALUE    , "+
			"PODS.GET_RADIX_POINT(OWE_KPI_WEIGHT    ,2) AS OWE_KPI_WEIGHT   , "+
			"PODS.GET_RADIX_POINT(AMOUNT_12         ,2) AS AMOUNT_12        , "+
			"PODS.GET_RADIX_POINT(AMOUNT_ALL        ,2) AS AMOUNT_ALL       , "+
			"PODS.GET_RADIX_POINT(STOCK_RATE        ,2) AS STOCK_RATE       , "+
			"PODS.GET_RADIX_POINT(STOCK_KPI_VALUE   ,2) AS STOCK_KPI_VALUE  , "+
			"PODS.GET_RADIX_POINT(STOCK_KPI_WEIGHT  ,2) AS STOCK_KPI_WEIGHT , "+
			"PODS.GET_RADIX_POINT(BUDEGET_TASK      ,2) AS BUDEGET_TASK     , "+
			"PODS.GET_RADIX_POINT(BUDGET_ML         ,2) AS BUDGET_ML        , "+
			"PODS.GET_RADIX_POINT(ML_COMPLETE       ,2) AS ML_COMPLETE      , "+
			"PODS.GET_RADIX_POINT(ML_KPI_VALUE      ,2) AS ML_KPI_VALUE     , "+
			"PODS.GET_RADIX_POINT(ML_KPI_WEIGHT     ,2) AS ML_KPI_WEIGHT    , "+
			"PODS.GET_RADIX_POINT(KHDF_WEIGHT       ,2) AS KHDF_WEIGHT      , "+
			"PODS.GET_RADIX_POINT(KHDF_VALUE        ,2) AS KHDF_VALUE       , "+
			"PODS.GET_RADIX_POINT(PROV_KPI_WEIGHT   ,2) AS PROV_KPI_WEIGHT  , "+
			"PODS.GET_RADIX_POINT(PROV_KPI_SCORE    ,2) AS PROV_KPI_SCORE   , "+
			"PODS.GET_RADIX_POINT(CUSTOM_KPI        ,2) AS CUSTOM_KPI       , "+
			"PODS.GET_RADIX_POINT(KPI_RESULT        ,2) AS KPI_RESULT       , "+
			"PODS.GET_RADIX_POINT(BASE_SALARY       ,2) AS BASE_SALARY      , "+
			"PODS.GET_RADIX_POINT(BASE_KPI_SALARY   ,2) AS BASE_KPI_SALARY    "+
			" FROM PMRT.TB_MRT_KPI_REPORT_MON T ";
	return sql;
}