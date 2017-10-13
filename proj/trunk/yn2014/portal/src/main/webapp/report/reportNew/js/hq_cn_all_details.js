var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","JZ_HQNUM_ALL" ,"HQNUM_ALL" ,"CN_AVG_ALL" ,"CBSR_ZB_ALL" ,"JZ_HQNUM_HZT" ,"HQNUM_HZT" ,"CN_AVG_HZT" ,"CBSR_ZB_HZT" ,"JZ_HQNUM_ZJTY" ,"HQNUM_ZJTY" ,"CN_AVG_ZJTY" ,"CBSR_ZB_ZJTY" ,"JZ_HQNUM_ZLLS" ,"HQNUM_ZLLS" ,"CN_AVG_ZLLS" ,"CBSR_ZB_ZLLS" ,"JZ_HQNUM_BLQD" ,"HQNUM_BLQD" ,"CN_AVG_BLQD" ,"CBSR_ZB_BLQD" ,"JZ_HQNUM_SHZX" ,"HQNUM_SHZX" ,"CN_AVG_SHZX" ,"CBSR_ZB_SHZX"];
var title=[["州市","全渠道汇总","","","","合作厅、专营店、社区沃店","","","","其中：自建他营模式渠道","","","","战略连锁渠道","","","","便利型渠道","","","","社会直销渠道","","",""],
           ["","本月渠道净增","渠道累计数量","店均产能","成本占收比","本月渠道净增","渠道累计数量","店均产能","成本占收比","本月渠道净增","渠道累计数量","店均产能","成本占收比","本月渠道净增","渠道累计数量","店均产能","成本占收比","本月渠道净增","渠道累计数量","店均产能","成本占收比","本月渠道净增","渠道累计数量","店均产能","成本占收比"]];
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
	var endDate=$("#endDate").val();
	var sql="SELECT GROUP_ID_1_NAME         "+
	"      ,JZ_HQNUM_ALL                  "+
	"      ,HQNUM_ALL                     "+
	"      ,CN_AVG_ALL                    "+
	"      ,CBSR_ZB_ALL                   "+
	"      ,JZ_HQNUM_HZT                  "+
	"      ,HQNUM_HZT                     "+
	"      ,CN_AVG_HZT                    "+
	"      ,CBSR_ZB_HZT                   "+
	"      ,JZ_HQNUM_ZJTY                 "+
	"      ,HQNUM_ZJTY                    "+
	"      ,CN_AVG_ZJTY                   "+
	"      ,CBSR_ZB_ZJTY                  "+
	"      ,JZ_HQNUM_ZLLS                 "+
	"      ,HQNUM_ZLLS                    "+
	"      ,CN_AVG_ZLLS                   "+
	"      ,CBSR_ZB_ZLLS                  "+
	"      ,JZ_HQNUM_BLQD                 "+
	"      ,HQNUM_BLQD                    "+
	"      ,CN_AVG_BLQD                   "+
	"      ,CBSR_ZB_BLQD                  "+
	"      ,JZ_HQNUM_SHZX                 "+
	"      ,HQNUM_SHZX                    "+
	"      ,CN_AVG_SHZX                   "+
	"      ,CBSR_ZB_SHZX                  "+
	"FROM PMRT.VIEW_MRT_HQ_CN_ALL_DETAIL  ";                                                                     
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "整体情况";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
