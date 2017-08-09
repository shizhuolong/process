var nowData = [];
var title=[["账期","分公司","区县","代理商名称","代理商人员","当月累计宽带预存款余额≤30元用户数","当月累计宽带预存款余额≤30元续费用户数（续费用户数）","当月累计续费率","当月累计续费率全省排名","当月累计监控停机用户数","当月累计拆机用户数","当年累计宽带预存款余额≤30元用户数","当年累计宽带预存款余额≤30元续费用户数（续费用户数）","当年累计续费率","当年累计续费率全省排名","当年累计监控停机用户数","当年累计拆机用户数","公共池全渠道公开待续费用户数（状态为监控停机用户数）"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","GROUP_ID_2_NAME","HQ_CHAN_NAME","CONTACT_NAME","USER_NUM_MON","XF_NUM_MON","XF_RATE_MON","XF_RANK_MON","JKTJ_NUM_MON","CJ_NUM_MON","USER_NUM_YEAR","XF_NUM_YEAR","XF_RATE_YEAR","XF_RANK_YEAR","JKTJ_NUM_YEAR","CJ_NUM_YEAR","GGC_JKTJ_NUM"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BROADBAND_WX_HQ"));
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
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanCode=$("#hqChanCode").val();
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TB_MRT_BROADBAND_WX_HQ WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1='"+region+"'";
	}else{
		sql+=" AND 1=2";
	}
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanCode!=""){
		sql+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	sql+= " ORDER BY XF_RANK_MON";
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
	var showtext = '宽带维系代理商汇总-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
