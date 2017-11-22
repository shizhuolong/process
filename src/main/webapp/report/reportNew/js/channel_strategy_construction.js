var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","THIS_DAY_CHNL","THIS_WEEK_CHNL","THIS_MONTH_CHNL" ,"FOURTH_JD_CHNL" ,"DLS_RW","MDSL_RW" ,"FOURTH_JD_WCL" ,"DEV_NUM_ZB" ,"THIS_DEV_NUM" ,"THIS_DEV_NUM1" ,"CHNL_PRODUCE" ,"FOURTH_JD_DEV"];
var title=[["州市","当日拓展网点数","本周拓展网点数","当月累计拓展网点数","四季度累计网点数","代理商任务数","门店任务数量 ","四季度任务完成率","当月有销量网点占比","所有网点当日销量","所有网点当月累计销量","所有网点当月店均产能","四季度累计销量"]];
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
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND GROUP_ID_1 =" + region;
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
	var dealDate=$("#dealDate").val();
	var sql="SELECT  GROUP_ID_1_NAME,              "+
	"        THIS_DAY_CHNL,                "+
	"        THIS_WEEK_CHNL,               "+
	"        THIS_MONTH_CHNL,              "+
	"        FOURTH_JD_CHNL,               "+
	"        DLS_RW,               "+
	"        MDSL_RW,               "+
	"        FOURTH_JD_WCL,                "+
	"        DEV_NUM_ZB,                   "+
	"        THIS_DEV_NUM,                 "+
	"        THIS_DEV_NUM1,                "+
	"        CHNL_PRODUCE,                 "+
	"        FOURTH_JD_DEV                 "+
	"FROM PMRT.TAB_MRT_LITTLE_ZL_Q4TH_DAY_F  ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "战略渠道建设及运营情况";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
