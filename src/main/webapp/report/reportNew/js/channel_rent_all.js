var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","JZXT_HQ_NUM","SDXT_HQ_NUM","THIS_MON_FEE" ,"CY_NUM"];
var title=[["州市","集中渠道系统渠道数量","水电系统绑定渠道数量","统计期分摊金额" ,"差异数量（集渠-水电）"]];
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

var pageSize = 20;
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
	var where = "WHERE DEAL_DATE = "+dealDate;
	/*if(orgLevel==1){

	}else{
		where += " AND GROUP_ID_1 =" + region;
	}*/
	//条件
		
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
	var sql="SELECT  GROUP_ID_1_NAME,            "+
	"        JZXT_HQ_NUM,                "+
	"        SDXT_HQ_NUM,                "+
	"        THIS_MON_FEE,               "+
	"        CY_NUM                      "+
	"FROM PMRT.TAB_MRT_SDF_RENT_BDHZ_MON ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "自建他营渠道房租绑定比对汇总报表";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
