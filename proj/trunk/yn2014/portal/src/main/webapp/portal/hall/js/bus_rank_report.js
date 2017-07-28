var nowData = [];
var title=[["账期","州市","营业厅名称","渠道编码","厅类型","收入（权重50%）","","","发展（权重50%）","","","厅类型排名","全省排名"],
           ["","","","","","本月累计收入","环比","定比上季度月均","本月累计发展","环比","定比上季度月均","",""],
           ["","","","","","权重10%","权重15%","权重25%","权重10%","权重15%","权重25%","",""]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","BUS_HALL_NAME","HQ_CHAN_CODE","CHNL_TYPE","ALL_SR","SR_HB","SR_DB","ALL_DEV","DEV_HB","DEV_DB","STATE_RANK","PRO_RANK"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_DEV_SR_RANK_REPORT"));
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
	var sql=getSql();
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
	var showtext = '自营厅收入发展日通报(厅维度)-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var chnlType=$("#chnlType").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(chnlType!=""){
		where+=" AND CHNL_TYPE='"+chnlType+"'";
	}
	return "SELECT DEAL_DATE                              "+
	"      ,GROUP_ID_1_NAME                               "+
	"      ,BUS_HALL_NAME                                 "+
	"      ,HQ_CHAN_CODE                                  "+
	"      ,CHNL_TYPE                                     "+
	"      ,ALL_SR                                        "+
	"      ,PODS.GET_RADIX_POINT(SR_HB||'%',2)    SR_HB   "+    
	"      ,PODS.GET_RADIX_POINT(SR_DB||'%',2)    SR_DB   "+ 
	"      ,ALL_DEV                                       "+
	"      ,PODS.GET_RADIX_POINT(DEV_HB||'%',2)   DEV_HB  "+     
	"      ,PODS.GET_RADIX_POINT(DEV_DB||'%',2)   DEV_DB  "+      
	"      ,STATE_RANK                                    "+
	"      ,PRO_RANK                                      "+
	" FROM PMRT.TB_MRT_BUS_DEV_SR_RANK_REPORT             "+
    +where+" ORDER BY PRO_RANK";                                            
}
