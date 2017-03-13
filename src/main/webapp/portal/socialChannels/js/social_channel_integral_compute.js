var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","HR_ID_NAME","FD_CHNL_ID","GROUP_ID_4_NAME","SUBSCRIPTION_ID","SERVICE_NUM","BRAND_TYPE_ID","INDEX_CODE","INDEX_VALUE","INNET_DATE","NET_TYPE","OFFICE_ID","OPERATOR_ID","PRODUCT_ID","SCHEME_ID","PRODUCT_FEE","SVC_TYPE","INTEGRAL_SUB","INTEGRAL_FEE","PR_USER","BLACK_USER"];
var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","用户编码","电话号码","指标小类编码","指标类代码","指标标准值","入网时间","业务类型","办理编码","操作工位","套餐ID","活动ID","套餐月费","指标相关值 ","积分内部代码","积分值","是否促销","是否黑户"]];
var orderBy='';	
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		/*css:[{gt:4,css:LchReport.RIGHT_ALIGN}],*/
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		/*orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},*/
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
	
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var phone=$.trim($("#phone").val());
	//指标类代码
	var indicators = $.trim($("#indicators").val());
	//渠道编码
	var channelCode = $.trim($("#channelCode").val());
	var index_code=$.trim($("#index_code").val());
	
	var sql =   "SELECT DEAL_DATE,                         "+
				"       GROUP_ID_1_NAME,                   "+
				"       UNIT_NAME,                         "+
				"       HR_ID,                             "+
				"       HR_ID_NAME,                        "+
				"       FD_CHNL_ID,                        "+
				"       GROUP_ID_4_NAME,                   "+
				"       SUBSCRIPTION_ID,                   "+
				"       SERVICE_NUM,                       "+
				"       BRAND_TYPE_ID,                     "+
				"       INDEX_CODE,                        "+
				"       INDEX_VALUE,                       "+
				"       INNET_DATE,                        "+
				"       decode(NET_TYPE,                   "+
				"              '-1',                       "+
				"              '固网',                     "+
				"              '01',                       "+
				"              '2G',                       "+
				"              '02',                       "+
				"              '3G',                       "+
				"              '03',                       "+
				"              '3G',                       "+
				"              '50',                       "+
				"              '4G',                       "+
				"              '51',                       "+
				"              '4G') NET_TYPE,             "+
				"       OFFICE_ID,                         "+
				"       OPERATOR_ID,                       "+
				"       PRODUCT_ID,                        "+
				"       SCHEME_ID,                         "+
				"       PRODUCT_FEE,                       "+
				"       SVC_TYPE,                          "+
				"       INTEGRAL_SUB,                      "+
				"       INTEGRAL_FEE,                      "+
				"CASE WHEN PR_USER = '1' THEN '是' ELSE '否' END PR_USER,"+
			    "CASE WHEN BLACK_USER = '1' THEN '是' ELSE '否' END BLACK_USER"+
				"  FROM PMRT.TAB_MRT_INTEGRAL_DEV_DETAIL partition(P"+dealDate+") T  "+
				" WHERE 1 = 1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" AND T.HR_ID_NAME LIKE '%"+userName+"%'";
	}
	if(phone!=''){
		sql+=" AND T.SERVICE_NUM LIKE '%"+phone+"%'";
	}
	
	if(indicators!=''){
		sql+=" AND T.INDEX_CODE = '"+indicators+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.FD_CHNL_ID = '"+channelCode+"'";
	}
	if(index_code!=''){
		sql+=" AND T.INDEX_CODE LIKE '%"+index_code+"%'";
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
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
	var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","用户编码","电话号码","指标小类编码","指标小类说明","指标类代码","指标类描述","指标标准值","入网时间","业务类型","办理编码","操作工位","套餐ID","活动ID","套餐月费","指标相关值 ","积分内部代码","积分值","是否促销","是否黑户"]];
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var phone=$.trim($("#phone").val());
	//指标类代码
	var indicators = $.trim($("#indicators").val());
	//渠道编码
	var channelCode = $.trim($("#channelCode").val());
	var index_code=$.trim($("#index_code").val());
	
	var sql =   "SELECT DEAL_DATE,                         "+
				"       GROUP_ID_1_NAME,                   "+
				"       UNIT_NAME,                         "+
				"       HR_ID,                             "+
				"       HR_ID_NAME,                        "+
				"       FD_CHNL_ID,                        "+
				"       GROUP_ID_4_NAME,                   "+
				"       SUBSCRIPTION_ID,                   "+
				"       SERVICE_NUM,                       "+
				"       BRAND_TYPE_ID,BRAND_TYPE,          "+
				"       INDEX_CODE,INDEX_DESC,             "+
				"       INDEX_VALUE,                       "+
				"       INNET_DATE,                        "+
				"       decode(NET_TYPE,                   "+
				"              '-1',                       "+
				"              '固网',                      "+
				"              '01',                       "+
				"              '2G',                       "+
				"              '02',                       "+
				"              '3G',                       "+
				"              '03',                       "+
				"              '3G',                       "+
				"              '50',                       "+
				"              '4G',                       "+
				"              '51',                       "+
				"              '4G') NET_TYPE,             "+
				"       OFFICE_ID,                         "+
				"       OPERATOR_ID,                       "+
				"       PRODUCT_ID,                        "+
				"       SCHEME_ID,                         "+
				"       PRODUCT_FEE,                       "+
				"       SVC_TYPE,                          "+
				"       INTEGRAL_SUB,                      "+
				"       INTEGRAL_FEE,                      "+
				"CASE WHEN PR_USER = '1' THEN '是' ELSE '否' END PR_USER,"+
			    "CASE WHEN BLACK_USER = '1' THEN '是' ELSE '否' END BLACK_USER"+
				"  FROM PMRT.TAB_MRT_INTEGRAL_DEV_DETAIL partition(P"+dealDate+") T "+
				" WHERE 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" AND T.HR_ID_NAME LIKE '%"+userName+"%'";
	}
	if(phone!=''){
		sql+=" AND T.SERVICE_NUM LIKE '%"+phone+"%'";
	}
	if(indicators!=''){
		sql+=" AND T.INDEX_CODE = '"+indicators+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.FD_CHNL_ID = '"+channelCode+"'";
	}
	if(index_code!=''){
		sql+=" AND T.INDEX_CODE LIKE '%"+index_code+"%'";
	}
	showtext = '计算明细月报-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////