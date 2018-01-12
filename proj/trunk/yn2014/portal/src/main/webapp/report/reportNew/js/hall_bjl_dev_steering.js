var nowData = [];
var report = null;
var orderBy='';
$(function() {
	var dealDate=$("#dealDate").val();
	var month = dealDate.substr(4, 2);
	var day = dealDate.substr(6, 2);
	var field=["GROUP_ID_1_NAME","ALL_SCORE","RANK_NUM","BJL_TAR_MON","ALL_BJL_NUM1","BJL_DEV_ZB","DEV_WCL_SCORE","SR_ALL_ZB","BJL_DEV_AVG","AVG_DEV_ZB","ZBPP_RATE","ZBPPD_SCORE","HALL_NUM","SALE_0_NUM1","SALE_0_NUM","SALE_0_ZB1","SALE_HQ_SCORE"];
	var title=[["<h2>全省自营厅冰激凌发展对标督导表（"+month+"月截止"+day+"日"+"）</h2>","","","","","","","","","","","","","","","",""],
	           ["地市","综合评价得分","排名","其中发展目标任务完成率（50分）","","","","发展规模地位匹配度（30分）","","","","","有销厅渗透率（20分）","","","",""],
	           ["","","","月目标","实际发展","完成率","得分","公司整体出账收入占全省比","日均冰激凌发展","日均冰激凌发展占全省比","占比匹配度","得分","自有厅数量","有销厅数量","0销厅数量","有销厅占比","得分"]];
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
		$("#exportPageBtn").remove();
		var dealDate=$("#dealDate").val();
		var month = dealDate.substr(4, 2);
		var day = dealDate.substr(6, 2);
		var field=["GROUP_ID_1_NAME","ALL_SCORE","RANK_NUM","BJL_TAR_MON","ALL_BJL_NUM1","BJL_DEV_ZB","DEV_WCL_SCORE","SR_ALL_ZB","BJL_DEV_AVG","AVG_DEV_ZB","ZBPP_RATE","ZBPPD_SCORE","HALL_NUM","SALE_0_NUM1","SALE_0_NUM","SALE_0_ZB1","SALE_HQ_SCORE"];
		var title=[["<h2>全省自营厅冰激凌发展对标督导表（"+month+"月截止"+day+"日"+"）</h2>","","","","","","","","","","","","","","","",""],
		           ["地市","综合评价得分","排名","其中发展目标任务完成率（50分）","","","","发展规模地位匹配度（30分）","","","","","有销厅渗透率（20分）","","","",""],
		           ["","","","月目标","实际发展","完成率","得分","公司整体出账收入占全省比","日均冰激凌发展","日均冰激凌发展占全省比","占比匹配度","得分","自有厅数量","有销厅数量","0销厅数量","有销厅占比","得分"]];
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
	
	//权限
	var where = " WHERE DEAL_DATE = "+dealDate;
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2";
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

function getSql(){
	var sql="SELECT GROUP_ID_1_NAME          "+
	"      ,ALL_SCORE                        "+
	"      ,RANK_NUM                         "+
	"      ,BJL_TAR_MON                      "+
	"      ,ALL_BJL_NUM1                     "+
	"      ,BJL_DEV_ZB                       "+
	"      ,DEV_WCL_SCORE                    "+
	"      ,SR_ALL_ZB                        "+
	"      ,BJL_DEV_AVG                      "+
	"      ,AVG_DEV_ZB                       "+
	"      ,ZBPP_RATE                        "+
	"      ,ZBPPD_SCORE                      "+
	"      ,HALL_NUM                         "+
	"      ,SALE_0_NUM1                      "+
	"      ,SALE_0_NUM                       "+
	"      ,SALE_0_ZB1                       "+
	"      ,SALE_HQ_SCORE                    "+
	"FROM PMRT.TB_MRT_BUS_BJL_DEV_DAY_REPORT ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var month = dealDate.substr(4, 2);
	var day = dealDate.substr(6, 2);
	var title=[["全省自营厅冰激凌发展对标督导表（"+month+"月截止"+day+"日"+"）","","","","","","","","","","","","","","","",""],
	           ["地市","综合评价得分","排名","其中发展目标任务完成率（50分）","","","","发展规模地位匹配度（30分）","","","","","有销厅渗透率（20分）","","","",""],
	           ["","","","月目标","实际发展","完成率","得分","公司整体出账收入占全省比","日均冰激凌发展","日均冰激凌发展占全省比","占比匹配度","得分","自有厅数量","有销厅数量","0销厅数量","有销厅占比","得分"]];
	showtext = "全省自营厅冰激凌发展对标督导表（"+month+"月截止"+day+"日"+"）";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
