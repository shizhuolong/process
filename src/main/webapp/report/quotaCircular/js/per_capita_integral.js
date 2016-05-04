var nowData = [];
var field=["DEAL_DATE","ROLE_TYPE","COUNT_TYPE","ALL_GR","GROUP_14","GROUP_06","GROUP_02","GROUP_09","GROUP_13","GROUP_03","GROUP_01","GROUP_07","GROUP_11","GROUP_12","GROUP_16","GROUP_04","GROUP_17","GROUP_15","GROUP_08","GROUP_05","GROUP_10"];
var title=[["账期","角色类别","统计类别","全省汇总","保山","楚雄","大理","德宏","迪庆","红河","昆明","丽江","临沧","怒江","普洱","曲靖","省集客","文山","版纳","玉溪","昭通"]];
var orderBy='';	
var report = null;
$(function() {
	//listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:2,css:LchReport.RIGHT_ALIGN}],
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
	var dealDate=$("#dealDate").val();
	var countType=$("#countType").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	//权限
	if(countType!=''){
		sql+=" AND T.COUNT_TYPE = "+ countType;
	}
	
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else{
		sql+=" and 1=2";
	}
	
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
	var s="SELECT T.DEAL_DATE,                                                                  "+
			"       T.ROLE_TYPE,                                                                  "+
			"       DECODE(T.COUNT_TYPE, '1', '人均原始积分', '2', '人均计薪积分') AS COUNT_TYPE,		  "+
			"       T.ALL_GR,                                                                     "+
			"       T.GROUP_14,                                                                   "+
			"       T.GROUP_06,                                                                   "+
			"       T.GROUP_02,                                                                   "+
			"       T.GROUP_09,                                                                   "+
			"       T.GROUP_13,                                                                   "+
			"       T.GROUP_03,                                                                   "+
			"       T.GROUP_01,                                                                   "+
			"       T.GROUP_07,                                                                   "+
			"       T.GROUP_11,                                                                   "+
			"       T.GROUP_12,                                                                   "+
			"       T.GROUP_16,                                                                   "+
			"       T.GROUP_04,                                                                   "+
			"       T.GROUP_17,                                                                   "+
			"       T.GROUP_15,                                                                   "+
			"       T.GROUP_08,                                                                   "+
			"       T.GROUP_05,                                                                   "+
			"       T.GROUP_10                                                                    "+
			"  FROM PMRT.TB_MRT_JF_ZB_COUNT_PERJF T                                               ";
	return s;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var countType=$("#countType").val();
	//条件
	var sql = getSql()+" WHERE T.DEAL_DATE ="+dealDate ;
	//权限
	if(countType!=''){
		sql+=" AND T.COUNT_TYPE = "+ countType;
	}
	
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){

	}else{
		sql+=" and 1=2";
	}
	showtext = '人均积分-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////