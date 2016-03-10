var nowData = [];
var title=[["账期","用户编号","业务编码","业务描述","最终受理量","批量受理","积分受理","原始受理次数","来源","部门编码","操作员工位"]];
var field=["NY","SUBSCRIPTION_ID","BUSI_ID","BUSI_DESC","SLL","PL_SLL","JF_SLL","SOURCE_SLL","SOURCES","OFFICE_ID","OPERATOR_ID"];
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[
		     {gt:3,css:LchReport.RIGHT_ALIGN}
		     ],
		rowParams : [],
		content : "lchcontent",
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
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
	var deal_date=art.dialog.data('deal_date');
	var hr_id=art.dialog.data('hr_id');
	var sql="SELECT A.*                                                "+
	"  FROM PODS.TB_JCDY_SLJF_ALLDETAIL_MON PARTITION(P"+deal_date+") A"+
	" WHERE  EXISTS (SELECT 1                                          "+
	"          FROM PORTAL.TAB_PORTAL_MAG_PERSON T                     "+
	"         WHERE T.DEAL_DATE = '"+deal_date+"'                      "+
	"           AND T.HR_ID = '"+hr_id+"'                              "+
	"           AND T.USER_CODE = A.OPERATOR_ID)                       ";

	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
