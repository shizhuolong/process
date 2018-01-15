var nowData = [];
var report = null;
var field=["HQ_CHAN_CODE","HQ_CHAN_NAME","START_MONTH","END_MONTH" ,"HZ_YEAR" ,"ASSESS_TARGET" ,"YSDZ_XS" ,"ZX_BT" ,"HZ_MS" ,"FW_FEE" ,"RATE_THREE" ,"RATE_SIX","RATE_NINE","RATE_TWELVE"];
var title=[["渠道编码","渠道名称","开始月","结束月" ,"合作年份" ,"年考核指定金额" ,"以收定支考核系数" ,"装修补贴" ,"合作模式" ,"房租（房补）" ,"考核进度" ,"","",""],
           ["","","","" ,"" ,"" ,"" ,"" ,"" ,"" ,"1-3月" ,"1-6月","1-9月","1-12月"]];
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

var pageSize = 15;
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
	//var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	var hzYear=$("#hz_year").val();
	
	//权限
	var where = "";
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
	if(hqChanlCode!=''){
		where+=" AND HQ_CHAN_CODE ='"+hqChanlCode+"'";
	}
	if(hzYear!=''){
		where+=" AND HZ_YEAR = "+hzYear;
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
	var sql="SELECT   HQ_CHAN_CODE    "+
		"	,HQ_CHAN_NAME             "+
		"	,START_MONTH              "+
		"	,END_MONTH                "+
		"	,HZ_YEAR                  "+
		"	,ASSESS_TARGET            "+
		"	,YSDZ_XS                  "+
		"	,ZX_BT                    "+
		"	,HZ_MS                    "+
		"	,FW_FEE                   "+
		"	,RATE_THREE               "+
		"	,RATE_SIX                 "+
		"	,RATE_NINE                "+
		"	,RATE_TWELVE              "+
		"FROM PMRT.TAB_MRT_YSDZ_NEW_CHANL "+
		"WHERE  ADD_STATE=2           "+
		"   AND RENEW_STATE<>1        ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "渠道信息汇总";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
