var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","USERNAME","USER_ADDR","USERTEL","PRODUCT_NAME","INNET_DATE","EXCH_NAME","INPUT_TYPE","SL","GROUP_ID_4_NAME","FEE_INCOME"];
var title=[["账期","分公司","营服","用户编码","宽带账号","用户名","联系地址","联系电话","套餐","入网时间","机房局向名称","接入方式","宽带速率","代理商","工时材料费"]];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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
	var sql =getSql();

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

function getSql(){
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var code =$("#code").val();
	var sql = 	"SELECT T.DEAL_DATE      ,                                 "+
				"       T.GROUP_ID_1_NAME,                                 "+
				"       T.UNIT_NAME      ,                                 "+
				"       T.SUBSCRIPTION_ID,                                 "+
				"       T.DEVICE_NUMBER  ,                                 "+
				"       T.USERNAME       ,                                 "+
				"       T.USER_ADDR      ,                                 "+
				"       T.USERTEL        ,                                 "+
				"       T.PRODUCT_NAME   ,                                 "+
				"       T.INNET_DATE     ,                                 "+
				"       T.EXCH_NAME      ,                                 "+
				"       T.INPUT_TYPE     ,                                 "+
				"       T.SL             ,                                 "+
				"       T.GROUP_ID_4_NAME,                                 "+
				"       T.FEE_INCOME                                       "+
				"  FROM PMRT.TAB_MRT_BMS_FAV_INCOME PARTITION(P"+dealDate+") T "+
				" WHERE 1=1 ";

	// 权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID  ";
	return sql;
}
 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var title=[["账期","分公司","营服","用户编码","宽带账号","用户名","联系地址","联系电话","套餐","入网时间","机房局向名称","接入方式","宽带速率","代理商","工时材料费"]];

	var sql=getSql();
	showtext = '宽带工时材料费明细表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
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
