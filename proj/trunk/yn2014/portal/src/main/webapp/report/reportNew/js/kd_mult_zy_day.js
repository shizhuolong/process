var nowData = [];
var report = null;
var field=["GROUP_ID_1_NAME","FIX_MULT_CHNL","MULT_ZERO_DEV_NUM","DEV_KD_NUM","DEV_KD_NUM1","DEV_KD_HB","DEV_WJDS_NUM","DEV_WJDS_NUM1","DEV_WJDS_HB","DEV_ZHWJ_NUM","DEV_ZHWJ_NUM1","DEV_ZHWJ_HB"];
var title=[["分公司","自营厅数量","0发展量自营厅数量","宽带发展","","","沃家电视发展","","","智慧沃家发展","",""],
           ["","","","当日发展","当月累计发展","环比增长率","当日发展","当月累计发展","环比增长率","当日发展","当月累计发展","环比增长率"]];
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
	var sql=getSql();
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
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_KD_MULT_ZY_DAY WHERE DEAL_DATE='"+dealDate+"'";     
    if(orgLevel==1){
			
	}else{
		sql+=" AND GROUP_ID_1='"+region+"'";
	}	
	return sql+" ORDER BY GROUP_ID_1";
}

function downsAll(){
	var dealDate=$("#dealDate").val();
	var showtext = "自有渠道复用通报-"+dealDate;
	var orgLevel=$("#orgLevel").val();
	var region=$("#region").val();
	var downField=["DEAL_DATE","GROOUP_ID_1_NAME","UNIT_NAME","GROUP_ID_4_NAME","HQ_CHAN_CODE","CHNL_ADDR"];
	var downSql="SELECT "+downField.join(",")+" FROM PMRT.TAB_MRT_ZY_MULT_DEVZERO_DAY WHERE DEAL_DATE='"+dealDate+"'";
	if(orgLevel==1){
		
	}else{
		downSql+=" AND GROUP_ID_1='"+region+"'";
	}
	downSql+=" ORDER BY GROUP_ID_1";
	var title=[["账期","分公司","区县","营业厅编码","营业厅名称","营业厅地址"]];
	downloadExcel(downSql,title,showtext);
}
