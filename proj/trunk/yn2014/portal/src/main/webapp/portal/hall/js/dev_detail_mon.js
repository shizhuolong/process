var nowData = [];
var title=[["账期","用户号码","套餐类型","套餐名称","本月消费额","是否三无极低","是否使用过4G网络"]];
var field=["DEAL_DATE","DEVICE_NUMBER","PRODUCT_TYPE","PRODUCT_NAME","LAST_SR","IS_SW_JD","IS_4G_NET"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_HQ_DEV_USER_DETAIL_MON"));
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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
	var sql=getSql();
	downSql=sql;
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '渠道发展用户月报明细表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var product_name=$("#product_name").val();
	var hq_chan_code=$("#hq_chan_code").val();
	var where=" WHERE 1=1";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=""){
		where+=" AND UNIT_ID='"+unitCode+"'";
	}
	if(product_name!=""){
		where+=" AND PRODUCT_NAME LIKE '%"+product_name+"%'";
	}
	if(hq_chan_code!=""){
		where+=" AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%'";
	}
	return "SELECT DEAL_DATE                           "+
	"      ,DEVICE_NUMBER                              "+
	"      ,PRODUCT_TYPE                               "+
	"      ,PRODUCT_NAME                               "+
	"      ,NVL(SR,0) LAST_SR                     "+
	"      ,CASE WHEN NVL(IS_SW,0)=1 AND NVL(IS_JD,0)=1"+
	"            THEN '是'                             "+
	"            ELSE '否'                             "+
	"            END              IS_SW_JD            "+
	"      ,CASE WHEN NVL(IS_4G_NET,0)=1              "+
	"            THEN '是'                             "+
	"            ELSE '否'                             "+
	"            END      IS_4G_NET                   "+
	"FROM  PMRT.TB_MRT_HQ_DEV_USER_DETAIL_MON PARTITION(P"+dealDate+")"+
	where;
}
