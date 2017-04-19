var nowData = [];
var title=[["账期","地市编码","地市名称","CHNL_TYPE渠道类型","G2佣金","G3佣金","G4佣金","宽带佣金","专线佣金","固话佣金","其他佣金","合计佣金","紧密外包","终端补贴","卡成本","渠道补贴","客户接入成本","房租","欠费"]];
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_1_NAME","CHNL_TYPE","YJ_2G","YJ_3G","YJ_4G","YJ_KD","YJ_ZX","YJ_GH","YJ_OTHER","YJ_HJ","FEE_JMWB","SUBSIDY","ALL_DEV","QDBT","KFJRCB","FZ","QF_FEE"];
var orderBy = " ORDER BY GROUP_ID_1";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_CHNL_ALL_REPORT WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else{
		sql+=" AND 1=2";
	}
	sql+= orderBy;
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
	var showtext = '渠道全成本(新)-'+time;
	downloadExcel(downSql,title,showtext);
}
