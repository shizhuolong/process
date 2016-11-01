var nowData = [];
var field ;
var title;
var orderBy = '';
var report = null;
$(function() {
		field=[ "DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","DEV_CHNL_ID","DEV_CHNL_NAME","ITEM","BD_TYPE_ID","BD_TYPE","INIT_NUM","INIT_FEE","SUCCESS_NUM","SUCCESS_FEE","FAIL_NUM","FAIL_FEE_YL","FAIL_FEE_SL","FAIL_FEE_XY","INIT_ID_JZ","FEE_JZ","INIT_ID_YS","FEE_YS","IS_SUCCESS","REMARKS" ];
		title= [ [ "账期","地市","营服","渠道编码","渠道名","科目(集中)","比对项目","比对备注(网格、基层)","工单数","工单金额","成功工单数","成功工单金额","失败工单数","应录金额","实录金额","差异金额","集中工单号","集中工单金额","原始工单号","原始工单金额","比对代码","比对结果" ] ];
	report = new LchReport({
		title : title,
		field : field,
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
	
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
	var regionCode =$("#regionCode").val();
	var unitCode =$("#unitCode").val();
	var workOrder = $("#workOrder").val();
//条件
	var sql ="SELECT T.DEAL_DATE,                        "+
				"       T.GROUP_ID_1_NAME,                  "+
				"       T.UNIT_NAME,                        "+
				"       T.DEV_CHNL_ID,                      "+
				"       T.DEV_CHNL_NAME,                    "+
				"       T.ITEM,                             "+
				"       T.BD_TYPE_ID,                       "+
				"       T.BD_TYPE,                          "+
				"       T.INIT_NUM,                         "+
				"       T.INIT_FEE,                         "+
				"       T.SUCCESS_NUM,                      "+
				"       T.SUCCESS_FEE,                      "+
				"       T.FAIL_NUM,                         "+
				"       T.FAIL_FEE_YL,                      "+
				"       T.FAIL_FEE_SL,                      "+
				"       T.FAIL_FEE_XY,                      "+
				"       T.INIT_ID_JZ,                       "+
				"       T.FEE_JZ,                           "+
				"       T.INIT_ID_YS,                       "+
				"       T.FEE_YS,                           "+
				"       T.IS_SUCCESS,                       "+
				"       T.REMARKS                           "+
				"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T  "+
				" WHERE DEAL_DATE = '"+dealDate+"'";
	if(''!=regionCode){
		sql+=" AND T. GROUP_ID_1 = '"+regionCode+"'";
	}
	if(''!=unitCode){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	if(''!=workOrder){
		sql+=" AND T.INIT_ID_JZ LIKE'%"+workOrder+"%'";
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy=" ORDER BY T.DEV_CHNL_ID";
	if (orderBy != '') {
		sql += orderBy;
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
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
	var regionCode =$("#regionCode").val();
	var unitCode =$("#unitCode").val();
	var workOrder = $("#workOrder").val();
//条件
	var sql ="SELECT T.DEAL_DATE,                        "+
				"       T.GROUP_ID_1_NAME,                  "+
				"       T.UNIT_NAME,                        "+
				"       T.DEV_CHNL_ID,                      "+
				"       T.DEV_CHNL_NAME,                    "+
				"       T.ITEM,                             "+
				"       T.BD_TYPE_ID,                       "+
				"       T.BD_TYPE,                          "+
				"       T.INIT_NUM,                         "+
				"       T.INIT_FEE,                         "+
				"       T.SUCCESS_NUM,                      "+
				"       T.SUCCESS_FEE,                      "+
				"       T.FAIL_NUM,                         "+
				"       T.FAIL_FEE_YL,                      "+
				"       T.FAIL_FEE_SL,                      "+
				"       T.FAIL_FEE_XY,                      "+
				"       T.INIT_ID_JZ,                       "+
				"       T.FEE_JZ,                           "+
				"       T.INIT_ID_YS,                       "+
				"       T.FEE_YS,                           "+
				"       T.IS_SUCCESS,                       "+
				"       T.REMARKS                           "+
				"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T  "+
				" WHERE DEAL_DATE = '"+dealDate+"'";
	if(''!=regionCode){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(''!=unitCode){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	if(''!=workOrder){
		sql+=" AND T.INIT_ID_JZ LIKE'%"+workOrder+"%'";
	}
	title= [ [ "账期","地市","营服","渠道编码","渠道名","科目(集中)","比对项目","比对备注(网格、基层)","工单数","工单金额","成功工单数","成功工单金额","失败工单数","应录金额","实录金额","差异金额","集中工单号","集中工单金额","原始工单号","原始工单金额","比对代码","比对结果"] ];
	showtext = '对比报表明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
