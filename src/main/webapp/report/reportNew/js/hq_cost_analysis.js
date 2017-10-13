var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","HQ_COST_ALL","SR_NUM_ALL" ,"CB_ZB_ALL" ,"YWYJ_ZB_ALL" ,"GWYJ_ZB_ALL" ,"RENT_ZB_ALL" ,"QDBT_ZB_ALL" ,"ZX_FEE_ZB_ALL" ,"CB_OTHER_ZB_ALL" ,"HQ_COS_HZT" ,"SR_NUM_HZT" ,"CB_ZB_HZT" ,"YWYJ_ZB_HZT" ,"GWYJ_ZB_HZT" ,"RENT_ZB_HZT" ,"QDBT_ZB_HZT" ,"ZX_FEE_ZB_HZT" ,"CB_OTHER_ZB_HZT" ,"HQ_COST_ZJTY" ,"SR_NUM_ZJTY" ,"CB_ZB_ZJTY" ,"YWYJ_ZB_ZJTY" ,"GWYJ_ZB_ZJTY" ,"RENT_ZB_ZJTY","QDBT_ZB_ZJTY","ZX_FEE_ZB_ZJTY","CB_OTHER_ZB_ZJTY","HQ_COST_ZLLS","SR_NUM_ZLLS",
           "CB_ZB_ZLLS","YWYJ_ZB_ZLLS","GWYJ_ZB_ZLLS","RENT_ZB_ZLLS","QDBT_ZB_ZLLS","ZX_FEE_ZB_ZLLS","CB_OTHER_ZB_ZLLS","HQ_COST_BLQD","SR_NUM_BLQD","CB_ZB_BLQD","YWYJ_ZB_BLQD","GWYJ_ZB_BLQD","RENT_ZB_BLQD","QDBT_ZB_BLQD","ZX_FEE_ZB_BLQD","CB_OTHER_ZB_BLQD","HQ_COST_SHZX","SR_NUM_SHZX","CB_ZB_SHZX","YWYJ_ZB_SHZX","GWYJ_ZB_SHZX","RENT_ZB_SHZX","QDBT_ZB_SHZX","ZX_FEE_ZB_SHZX","CB_OTHER_ZB_SHZX"];
var title=[["州市","汇总","","","","","","","","","合作厅、专营店、社区沃店","","","","","","","","","其中：自建他营模式渠道","","","","","","","","","战略连锁渠道","","","","","","","","","便利性渠道","","","","","","","","","社会直销渠道","","","","","","","",""],
           ["","本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比","本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比","本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比"
            ,"本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比","本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比","本年累计<br>成本（万元）","本年累计<br>收入(万元)","本年累计<br>成本占收比","移网佣金<br>占比","宽固佣金<br>占比","房租占比","渠道补贴<br>占比","装修补贴<br>占比","其他成本<br>占比"]];
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
	var orgLevel=$("#orgLevel").val();
	
	var dealDate=$("#dealDate").val();
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	
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
	
	var sql="SELECT GROUP_ID_1_NAME                                  "+
	"      ,ROUND(NVL(HQ_COST_ALL,0)/10000,2) HQ_COST_ALL    "+
	"      ,ROUND(NVL(SR_NUM_ALL ,0)/10000,2) SR_NUM_ALL     "+
	"      ,CB_ZB_ALL                                        "+
	"      ,YWYJ_ZB_ALL                                      "+
	"      ,GWYJ_ZB_ALL                                      "+
	"      ,RENT_ZB_ALL                                      "+
	"      ,QDBT_ZB_ALL                                      "+
	"      ,ZX_FEE_ZB_ALL                                    "+
	"      ,CB_OTHER_ZB_ALL                                  "+
	"      ,ROUND(NVL(HQ_COST_HZT,0)/10000,2) HQ_COS_HZT     "+
	"      ,ROUND(NVL(SR_NUM_HZT ,0)/10000,2) SR_NUM_HZT     "+
	"      ,CB_ZB_HZT                                        "+
	"      ,YWYJ_ZB_HZT                                      "+
	"      ,GWYJ_ZB_HZT                                      "+
	"      ,RENT_ZB_HZT                                      "+
	"      ,QDBT_ZB_HZT                                      "+
	"      ,ZX_FEE_ZB_HZT                                    "+
	"      ,CB_OTHER_ZB_HZT                                  "+
	"      ,ROUND(NVL(HQ_COST_ZJTY,0)/10000,2) HQ_COST_ZJTY  "+
	"      ,ROUND(NVL(SR_NUM_ZJTY ,0)/10000,2) SR_NUM_ZJTY   "+
	"      ,CB_ZB_ZJTY                                       "+
	"      ,YWYJ_ZB_ZJTY                                     "+
	"      ,GWYJ_ZB_ZJTY                                     "+
	"      ,RENT_ZB_ZJTY                                     "+
	"      ,QDBT_ZB_ZJTY                                     "+
	"      ,ZX_FEE_ZB_ZJTY                                   "+
	"      ,CB_OTHER_ZB_ZJTY                                 "+
	"      ,ROUND(NVL(HQ_COST_ZLLS,0)/10000,2) HQ_COST_ZLLS  "+
	"      ,ROUND(NVL(SR_NUM_ZLLS ,0)/10000,2) SR_NUM_ZLLS   "+
	"      ,CB_ZB_ZLLS                                       "+
	"      ,YWYJ_ZB_ZLLS                                     "+
	"      ,GWYJ_ZB_ZLLS                                     "+
	"      ,RENT_ZB_ZLLS                                     "+
	"      ,QDBT_ZB_ZLLS                                     "+
	"      ,ZX_FEE_ZB_ZLLS                                   "+
	"      ,CB_OTHER_ZB_ZLLS                                 "+
	"      ,ROUND(NVL(HQ_COST_BLQD,0)/10000,2) HQ_COST_BLQD  "+
	"      ,ROUND(NVL(SR_NUM_BLQD ,0)/10000,2) SR_NUM_BLQD   "+
	"      ,CB_ZB_BLQD                                       "+
	"      ,YWYJ_ZB_BLQD                                     "+
	"      ,GWYJ_ZB_BLQD                                     "+
	"      ,RENT_ZB_BLQD                                     "+
	"      ,QDBT_ZB_BLQD                                     "+
	"      ,ZX_FEE_ZB_BLQD                                   "+
	"      ,CB_OTHER_ZB_BLQD                                 "+
	"      ,ROUND(NVL(HQ_COST_SHZX,0)/10000,2) HQ_COST_SHZX  "+
	"      ,ROUND(NVL(SR_NUM_SHZX ,0)/10000,2) SR_NUM_SHZX   "+
	"      ,CB_ZB_SHZX                                       "+
	"      ,YWYJ_ZB_SHZX                                     "+
	"      ,GWYJ_ZB_SHZX                                     "+
	"      ,RENT_ZB_SHZX                                     "+
	"      ,QDBT_ZB_SHZX                                     "+
	"      ,ZX_FEE_ZB_SHZX                                   "+
	"      ,CB_OTHER_ZB_SHZX                                 "+
	"FROM PMRT.TB_MRT_HQ_CB_ANA_MON_HZ                       ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title = [["州市","汇总","","","","","","","","","合作厅、专营店、社区沃店","","","","","","","","","其中：自建他营模式渠道","","","","","","","","","战略连锁渠道","","","","","","","","","便利性渠道","","","","","","","","","社会直销渠道","","","","","","","",""],
	             ["","本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比","本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比","本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比"
	              ,"本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比","本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比","本年累计成本（万元）","本年累计收入(万元)","本年累计成本占收比","移网佣金占比","宽固佣金占比","房租占比","渠道补贴占比","装修补贴占比","其他成本占比"]];
	showtext = "成本分析";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
