var nowData = [];
var report = null;
var field=["REGION_NAME_ABBR","HQ_QCD_NUM","DEVELOP_QCD_NUM","QCD_NUM" ,"PERSON_QCD_NUM" ,"TDC_ID_NUM" ,"TDC_ID_DEV" ,"TDC_ID_DEV_ALL"];
var title=[["州市","渠道经理发展轻触点数","存量渠道发展轻触点数","轻触点渠道发展人合计","有效能轻触点发展人数","有效二维码数","有销量的二维码数","累计发展量"]];
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
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
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
	var sql="SELECT                    "+
	"DEAL_DATE,"+
	"REGION_NAME_ABBR,"+
	"HQ_QCD_NUM,"+
	"DEVELOP_QCD_NUM,"+
	"QCD_NUM,"+
	"PERSON_QCD_NUM,"+
	"TDC_ID_NUM,"+
	"TDC_ID_DEV,"+
	"TDC_ID_DEV_ALL "+
	"FROM PMRT.TAB_MRT_QCD_CODE_REPORT ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["账期","州市","渠道经理发展轻触点数","存量渠道发展轻触点数","轻触点渠道发展人合计","有效能轻触点发展人数","有效二维码数","有销量的二维码数","累计发展量"]];
	showtext = "轻触点渠道";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
