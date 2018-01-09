var nowData = [];
var report = null;
var field=["GROUP_ID_1_NAME","HALL_NUM","FIRST_PAY_DAY","FIRST_PAY_MON" ,"TAR_NUM_MON" ,"TAR_WC_RATE" ,"SC_HB" ,"SALE_0_NUM1" ,"SALE_0_ZB" ,"SR_ALL_DAY" ,"SR_ALL_MON" ,"SR_ALL_HB"];
var title=[["州市","厅数","首充发展情况","","","","","","","收入情况","",""],
           ["","","日首充数","月累计首充数","月度任务数","月首充目标完成率","月首充环比","月首充数为零厅数","占比","日收入","月累计收入","月收入环比"]];
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

var pageSize = 25;
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
	
	//权限
	var where = "WHERE T.DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND T.GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2";
	}
	//条件
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
		
	var sql=getSql();
	sql+=where;
	
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
	var sql="SELECT T.GROUP_ID_1_NAME          "+
	"      ,T.HALL_NUM                         "+
	"      ,T.FIRST_PAY_DAY                    "+
	"      ,T.FIRST_PAY_MON                    "+
	"      ,T.TAR_NUM_MON                      "+
	"      ,T.TAR_WC_RATE                      "+
	"      ,T.SC_HB                            "+
	"      ,T.SALE_0_NUM1                      "+
	"      ,T.SALE_0_ZB                        "+
	"      ,T.SR_ALL_DAY                       "+
	"      ,T.SR_ALL_MON                       "+
	"      ,T.SR_ALL_HB                        "+
	"FROM PMRT.TB_MRT_BUS_2IDT_REPORT_DAY_HZ T ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	
	var where = "WHERE T.DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND T.GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2";
	}
	//条件
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
	var downSql = "SELECT T.DEAL_DATE                                                "+
	"      ,T.GROUP_ID_1_NAME                                          "+
	"      ,T.HQ_CHAN_CODE                                             "+
	"      ,T.BUS_HALL_NAME                                            "+
	"      ,T.FIRST_PAY_DAY                                            "+
	"      ,T.FIRST_PAY_MON                                            "+
	"      ,PMRT.LINK_RATIO(T.FIRST_PAY_MON,T1.FIRST_PAY_MON,2) SC_HB  "+
	"      ,T.SR_ALL_DAY                                               "+
	"      ,T.SR_ALL_MON                                               "+
	"      ,PMRT.LINK_RATIO(T.SR_ALL_MON,T1.SR_ALL_MON,2) SR_HB        "+
	"FROM PMRT.TB_MRT_BUS_2IDT_REPORT_DAY T                            "+
	"LEFT JOIN PMRT.TB_MRT_BUS_2IDT_REPORT_DAY T1                      "+
	"ON(T.HQ_CHAN_CODE=T1.HQ_CHAN_CODE AND T1.DEAL_DATE=               "+
	"TO_CHAR(ADD_MONTHS(TO_DATE("+dealDate+",'YYYYMMDD'),-1),'YYYYMMDD')) ";
	downSql+=where;
	var title = [["账期","分公司","营业厅编码","营业厅名称","日首充数","月累计首充数","月首充环比","日收入","月累计收入","月收入环比"]];
	showtext = "自营厅2I地推日通报表";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
