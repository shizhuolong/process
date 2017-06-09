var nowData = [];
var title=[["州市","收入得分（权重30%）","毛利得分（权重15%）","收入保有率得分（权重10%）","发展量得分（权重10%）","终端销量得分（权重10%）","4G渗透率（权重5%）","服务质量（权重10%）","过程评价（权重10%）","管控指标（加减分项）","最后得分（100%）","排名"]];
var field=["GROUP_ID_1_NAME","SR_SCORE","ML_SCORE","BYL_SCORE","DEV_SCORE","ZD_SCORE","STL_SCORE","SERVICE_SCORE","PROCEDURE_SRORE","GKZB_SCORE","ALL_SCORE","RANK_NUM"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_EVALUATE_REPORT"));
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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
	dealDate=$("#dealDate").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TB_MRT_BUS_EVALUATE_REPORT WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";
	}
	sql+=" ORDER BY RANK_NUM";
	downSql=sql;
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '各分公司考核情况-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
