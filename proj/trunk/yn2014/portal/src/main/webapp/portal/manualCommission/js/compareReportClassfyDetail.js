var nowData = [];
var field ;
var title;
var orderBy = '';
var report = null;
var successNum;
var failNum;
$(function() {
	successNum = $("#successNum").val();
	failNum = $("#failNum").val();
	
	if(successNum!=''&&successNum!='null'){
		field=[ "DEAL_DATE", "GROUP_ID_1_NAME", "DEV_CHNL_ID","DEV_CHNL_NAME","BD_TYPE_ID", "INIT_ID_JZ", "SUCCESS_NUM", "SUCCESS_FEE" ];
		title= [ [ "帐期", "地市", "渠道编码", "渠道名称", "比对项目", "工单号","成功工单总数  ", "成功工单总额 " ] ];
	}
	if(failNum!=''&&failNum!='null'){
		field=[ "DEAL_DATE", "GROUP_ID_1_NAME", "DEV_CHNL_ID", "DEV_CHNL_NAME","BD_TYPE_ID", "INIT_ID_JZ", "FAIL_FEE_YL", "FAIL_FEE_SL", "FAIL_FEE_XY" ];
		title= [ [ "帐期", "地市", "渠道编码", "渠道名称", "比对项目", "工单号", "失败应录金额 ", "失败实录金额 ","失败差异金额" ] ];
	}
	//listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	
	var dbTypeId = $("#dbTypeId").val();
	var groupId = $("#groupId").val();
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
//条件
	var sql ="";
	//alert("successNum=="+successNum+"||||failNum="+failNum);
	if(failNum!=''&&failNum!='null'){
		sql+="SELECT T.DEAL_DATE,                       "+
			"       T.GROUP_ID_1_NAME,                 "+
			"       T.DEV_CHNL_ID,                     "+
			"       T.DEV_CHNL_NAME,                   "+
			"       T.BD_TYPE_ID,                      "+
			"       T.INIT_ID_JZ,                      "+
			"       T.FAIL_FEE_YL,                     "+
			"       T.FAIL_FEE_SL,                     "+
			"       T.FAIL_FEE_XY                      "+
			"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'       "+
			"   AND T.GROUP_ID_1 = '"+groupId+"'      "+
			"   AND T.BD_TYPE_ID = '"+dbTypeId+"'      "+
			"   AND T.FAIL_NUM = 1                     ";
	}
	if(successNum!=''&&successNum!='null'){
		sql+="SELECT T.DEAL_DATE,                       "+
			"       T.GROUP_ID_1_NAME,                 "+
			"       T.DEV_CHNL_ID,                     "+
			"       T.DEV_CHNL_NAME,                   "+
			"       T.BD_TYPE_ID,                      "+
			"       T.INIT_ID_JZ,                      "+
			"       T.SUCCESS_NUM,                     "+
			"       T.SUCCESS_FEE                      "+
			"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'       "+
			"   AND T.GROUP_ID_1 = '"+groupId+"'       "+
			"   AND T.BD_TYPE_ID = '"+dbTypeId+"'      "+
			"   AND T.SUCCESS_NUM = 1                  ";
	}
			
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	var csql = sql;
	/*old*/
	/*var cdata = query("select count(*) total " + csql);*/
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
//function roundN(number,fractionDigits){   
//    with(Math){   
//        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
//    }   
//}   


/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dbTypeId = $("#dbTypeId").val();
	var groupId = $("#groupId").val();
	var dealDate = $("#dealDate").val();
	var channelCode = $("#channelCode").val();
	var detailType = $("#detailType").val();
	var sql ="";
	if(failNum!=''&&failNum!='null'){
		sql+="SELECT T.DEAL_DATE,                       "+
			"       T.GROUP_ID_1_NAME,                 "+
			"       T.DEV_CHNL_ID,                     "+
			"       T.DEV_CHNL_NAME,                   "+
			"       T.BD_TYPE_ID,                      "+
			"       T.INIT_ID_JZ,                      "+
			"       T.FAIL_FEE_YL,                     "+
			"       T.FAIL_FEE_SL,                     "+
			"       T.FAIL_FEE_XY                      "+
			"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'       "+
			"   AND T.GROUP_ID_1 = '"+groupId+"'      "+
			"   AND T.BD_TYPE_ID = '"+dbTypeId+"'      "+
			"   AND T.FAIL_NUM = 1                     ";
	}
	if(successNum!=''&&successNum!='null'){
		sql+="SELECT T.DEAL_DATE,                       "+
			"       T.GROUP_ID_1_NAME,                 "+
			"       T.DEV_CHNL_ID,                     "+
			"       T.DEV_CHNL_NAME,                   "+
			"       T.BD_TYPE_ID,                      "+
			"       T.INIT_ID_JZ,                      "+
			"       T.SUCCESS_NUM,                     "+
			"       T.SUCCESS_FEE                      "+
			"  FROM PMRT.TAB_MRT_COMM_BD_DATA_DETAIL T "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'       "+
			"   AND T.GROUP_ID_1 = '"+groupId+"'       "+
			"   AND T.BD_TYPE_ID = '"+dbTypeId+"'      "+
			"   AND T.SUCCESS_NUM = 1                  ";
	}
		
	if(''!=channelCode){
		sql+=" AND T.DEV_CHNL_ID = '"+channelCode+"'";
	}
	var title;
	if(successNum!=''&&successNum!='null'){
		title= [ [ "帐期", "地市", "渠道编码", "渠道名称", "比对项目", "工单号","成功工单总数  ", "成功工单总额 " ] ];
	}
	if(failNum!=''&&failNum!='null'){
		title= [ [ "帐期", "地市", "渠道编码", "渠道名称", "比对项目", "工单号", "失败应录金额 ", "失败实录金额 ","失败差异金额" ] ];
	}
	showtext = '对比报表('+detailType+')-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////