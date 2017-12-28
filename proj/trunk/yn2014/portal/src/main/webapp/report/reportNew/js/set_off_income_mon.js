var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1_NAME","NAME","HR_ID" ,"DEVELOPER" ,"GROUP_ID_4_NAME" ,"SUBSCRIPTION_ID" ,"DEVICE_NUMBER" ,"INNET_DATE" ,"USER_NAME" ,"PRODUCT1_ID" ,"PRODUCT1_NAME","PRODUCT_ID" ,"YW_ID" ,"YW_MS" ,"CZWL" ,"IS_NEW","IS_ACCT" ,"IS_ON","SR","OWEFEE" ,"IS_ICT"];
var title=[["账期","地市","人员姓名","HR_ID","发展人编码","渠道名称","用户编号","用户号码","入网时间","用户名称","产品编码","产品名称","套餐编码","业务编码","业务描述","承载网络" ,"是否新发展" ,"是否出账","是否在网" ,"出账收入" ,"欠费金额","用户类型"]];
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var isIct=$("#isIct").val();
	
	//权限
	var where = "WHERE 1=1";
	if(orgLevel==1){

	}else{
		where += " AND GROUP_ID_1 =" + region;
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(isIct!=''){
		where+= " AND IS_ICT = '"+isIct+"'";
	}
		
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var dealDate=$("#dealDate").val();
	var sql="SELECT  DEAL_DATE,                                               "+
	"        GROUP_ID_1_NAME,                                         "+
	"        NAME,                                                    "+
	"        HR_ID,                                                   "+
	"        DEVELOPER,                                               "+
	"        GROUP_ID_4_NAME,                                         "+
	"        SUBSCRIPTION_ID,                                         "+
	"        DEVICE_NUMBER,                                           "+
	"        INNET_DATE,                                              "+
	"        USER_NAME,                                               "+
	"        PRODUCT1_ID,                                             "+
	"        PRODUCT1_NAME,                                           "+
	"        PRODUCT_ID,                                              "+
	"        YW_ID,                                                   "+
	"        YW_MS,                                                   "+
	"        CZWL,                                                    "+
	"        (CASE WHEN IS_NEW=1 THEN '是' ELSE '否' END)IS_NEW,      "+
	"        (CASE WHEN IS_ACCT=1 THEN '是' ELSE '否' END) IS_ACCT,"+
	"        (CASE WHEN IS_ON=1 THEN '是' ELSE '否' END) IS_ON,      "+
	"        SR,                                                      "+
	"        OWEFEE,                                                  "+
	"        (CASE WHEN IS_ICT=1 THEN 'ICT' ELSE '非ICT' END ）IS_ICT "+
	"  FROM   PODS.TAB_ODS_JK_ZZX_USER_MON PARTITION(P"+dealDate+") ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "集客产品发展收入欠费月报";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
