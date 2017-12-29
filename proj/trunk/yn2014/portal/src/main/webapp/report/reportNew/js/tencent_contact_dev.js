var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","LC_HQ_NUM","LC_HQ_CL_NUM","LC_ALL_NUM","LC_NUM" ,"PERSON_LC_NUM" ,"INNET_LC_NUM" ,"HQ_QCD_NUM" ,"DEVELOP_QCD_NUM" ,"QCD_NUM" ,"PERSON_QCD_NUM","INNET_QCD_NUM"];
var title=[["州市","临促专员","","","","","","轻触点渠道","","","",""],
           ["","涉及渠道","","","临促专员","","","招募人","","","",""],
           ["","渠道经理","社会渠道","合计","招募数量","有效能人数","累计发展量","渠道经理","社会渠道","合计","有效能数","累计发展量"]];
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
	var regionCode=$("#regionCode").val();
	
	//权限
	var where = "";
	if(orgLevel==1){

	}else{
		where += " AND T.GROUP_ID_1 =" + region;
	}
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ="+regionCode;
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
	var dealDate=$("#dealDate").val();
	var sql="SELECT T.DEAL_DATE,				       "+
	"               T.GROUP_ID_1_NAME,         "+
	"               T.LC_HQ_NUM,               "+
	"               T.LC_HQ_CL_NUM,            "+
	"               T.LC_ALL_NUM,              "+
	"               T.LC_NUM,                  "+
	"               T.PERSON_LC_NUM,           "+
	"               T.INNET_LC_NUM,            "+
	"                                          "+
	"               T.HQ_QCD_NUM,              "+
	"               T.DEVELOP_QCD_NUM,         "+
	"               T.QCD_NUM,                 "+
	"               T.PERSON_QCD_NUM,          "+
	"               T.INNET_QCD_NUM            "+
	"          FROM PMRT.TAB_MRT_DT_QCD_DAY T  "+   
	"         WHERE T.DEAL_DATE = "+dealDate+where+
	"         ORDER BY T.GROUP_ID_1   ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "轻触点建设通报";
	var title=[["州市","临促专员","","","","","","轻触点渠道","","","",""],
	           ["","涉及渠道","","","临促专员","","","招募人","","","",""],
	           ["","渠道经理","社会渠道","合计","招募数量","有效能人数","累计发展量","渠道经理","社会渠道","合计","有效能数","累计发展量"]];
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////