var nowData = [];
var report = null;
var field=["GROUP_ID_1_NAME","HQ_NUM","SALE_HQ_NUM","SALE_HQ_ZB","THIS_BL_NUM","THIS_BL_ZB"];
var title=[["地市","营业厅总数","有办理量的营业厅数","营业厅办理量占比","办理量","办理占比"]];
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
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var where=" WHERE DEAL_DATE BETWEEN "+startDate+" AND "+endDate+"";
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	
	var sql=getSql(where);
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

function getSql(where){
	var sql="SELECT NVL(T.GROUP_ID_1_NAME,'全省') GROUP_ID_1_NAME                                         "+
	"      ,NVL(SUM(T.HQ_NUM),0) HQ_NUM                                                           "+
	"      ,NVL(SUM(T.SALE_HQ_NUM),0) SALE_HQ_NUM                                                 "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(T.SALE_HQ_NUM),0),NVL(SUM(T.HQ_NUM),0),2) SALE_HQ_ZB       "+
	"      ,NVL(SUM(T.THIS_BL_NUM),0) THIS_BL_NUM                                                 "+
	"      ,PMRT.LINK_RATIO_ZB(NVL(SUM(T.THIS_BL_NUM),0),NVL(SUM(T1.THIS_BL_NUM),0),2) THIS_BL_ZB "+
	"FROM (                                                                                       "+
	"      SELECT GROUP_ID_0                                                                      "+
	"            ,GROUP_ID_1_NAME                                                                 "+
	"            ,COUNT(DISTINCT HQ_CHAN_CODE)  HQ_NUM                                            "+
	"            ,COUNT(DISTINCT CASE WHEN NVL(THIS_BL_NUM,0)>0                                   "+
	"                                 THEN HQ_CHAN_CODE                                           "+
	"                                 END)  SALE_HQ_NUM                                           "+
	"            ,SUM(THIS_BL_NUM) THIS_BL_NUM                                                    "+
	"      FROM (SELECT GROUP_ID_0                                                                "+
	"                  ,GROUP_ID_1_NAME                                                           "+
	"                  ,HQ_CHAN_CODE                                                              "+
	"                  ,SUM(THIS_BL_NUM)      THIS_BL_NUM                                         "+
	"            FROM  PMRT.TB_MRT_BUS_ZY_CNDXSYW_DAY                                             "+
	where +
	"            GROUP BY GROUP_ID_0                                                              "+
	"                    ,GROUP_ID_1_NAME                                                         "+
	"                    ,HQ_CHAN_CODE                                                            "+
	"            )                                                                                "+
	"        GROUP BY GROUP_ID_0                                                                  "+
	"                ,GROUP_ID_1_NAME   	                                                      "+
	")T                                                                                           "+
	"LEFT JOIN(                                                                                   "+
	"      SELECT GROUP_ID_0                                                                      "+
	"            ,SUM(THIS_BL_NUM)      THIS_BL_NUM                                               "+
	"      FROM PMRT.TB_MRT_BUS_ZY_CNDXSYW_DAY                                                    "+
	where +
	"      GROUP BY GROUP_ID_0                                                                    "+
	")T1                                                                                          "+
	"ON(T.GROUP_ID_0=T1.GROUP_ID_0)                                                               "+
	"GROUP BY GROUPING SETS (T.GROUP_ID_0,(T.GROUP_ID_0,T.GROUP_ID_1_NAME))  ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "自营厅承诺低消送业务办理季度指标日报";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////