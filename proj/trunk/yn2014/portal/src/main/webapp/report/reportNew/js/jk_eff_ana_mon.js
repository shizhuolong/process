var nowData = [];
var report = null;
var title=[["地市","项目名称","合同号","项目编码","项目立项时间","项目投产时间","投资额","回收周期","毛利","出账收入（扣减赠费、退费）","成本合计","佣金","设备终端费用","代维成本","机柜数量","机柜租金","电费单价","电费","用户欠费余额","用户预存款余额","赠费","赠费率"]];
var field=["GROUP_ID_1_NAME","XM_NAME","HT_ID","XM_ID","XM_BEG_TIME","XM_TC_TIME","TZ_FEE","HS_ZQ","ML","SR_BB_NUM","CB_ALL","YJ","SBZD_FEE","DW_CB","JG_NUMBER","JG_ZJ","DFEE_UP","DFEE","QF_YFEE","YCK_YFEE","GIVE_FEE","GFEE_RATE"];
var dealDate="";
var downSql="";
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
	var regionCode=$("#regionCode").val();
	dealDate=$("#dealDate").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TB_MRT_JK_EFF_ANA_MON WHERE DEAL_DATE='"+dealDate+"'";     
    if(regionCode!=''){
    	sql+=" AND GROUP_ID_1='"+regionCode+"'";
    }   
	return sql+" ORDER BY GROUP_ID_1";
}

function downsAll(){
	var showtext = "集客效能-"+dealDate;
	downloadExcel(downSql,title,showtext);
}
