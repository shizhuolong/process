var nowData;
var title = [["分公司","区县","营服名","渠道经理","渠道名称","渠道编码","用户名称","用户ID","用户号码","套餐","入网时间","状态","状态变化时间","近三月平均出账收入","近三月平均流量","客户姓名"]];
var field = ["GROUP_ID_1_NAME", "GROUP_ID_2_NAME", "UNIT_NAME", "MOB_NAME",
		"GROUP_ID_4_NAME", "HQ_CHAN_CODE", "USER_NAME", "SUBSCRIPTION_ID",
		"DEVICE_NUMBER", "PRODUCT_NAME", "INNET_DATE", "STATUS", "CHANGE_TIME",
		"AVG_SR", "AVG_GPRS", "CUSTOMER_NAME"];
var report = null;
var sql = "";
var dealDate = "";
var type = "";

$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css : [ {
			gt : 13,
			css : LchReport.RIGHT_ALIGN
		} ],
		rowParams : [],
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " ORDER BY " + field[index] + " " + type;
			search(0);
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);

	$("#searchBtn").click(function() {
		search(0);
	});
});

var pageSize = 15;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	sql = getsql();
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql + ")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
		return;
	}

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function() {
		var area = $(this).find("TD:eq(0)").find("A").text();
		if (area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getsql() {
	dealDate = $("#dealDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	type = $("#type").val();
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var hrId = $("#hrId").val();
	var orderBy = "";

	var sql = "SELECT DEAL_DATE                    "
			+ "      ,GROUP_ID_1_NAME              "
			+ "      ,GROUP_ID_2_NAME              "
			+ "      ,UNIT_NAME                    "
			+ "      ,MOB_NAME                     "
			+ "      ,GROUP_ID_4_NAME              "
			+ "      ,HQ_CHAN_CODE                 "
			+ "      ,USER_NAME                    "
			+ "      ,SUBSCRIPTION_ID              "
			+ "      ,DEVICE_NUMBER                "
			+ "      ,PRODUCT_NAME                 "
			+ "      ,INNET_DATE                   "
			+ "      ,STATUS                       "
			+ "      ,CHANGE_TIME                  "
			+ "      ,AVG_SR                       "
			+ "      ,AVG_GPRS                     "
			+ "      ,CUSTOMER_NAME                "
			+ "FROM PMRT.TB_WARN_DEVICE_NET_MATCHED"
	+" WHERE DEAL_DATE = '" + dealDate + "'";

	if (type == 0) {
		sql += " AND IS_CARD_MATCHED=1 AND IS_4G_NET=0";
	} else {
		sql += " AND IS_NET_MATCHED=1 AND IS_4G_USER=0";
	}
	if (regionCode != '') {
		sql += " AND GROUP_ID_1='" + regionCode + "'";
	}
	if (unitCode != '') {
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if (orgLevel == 1) {
		orderBy = " ORDER BY GROUP_ID_1,GROUP_ID_2,UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 2) {
		sql += " AND GROUP_ID_1='" + code + "'";
		orderBy = " ORDER BY GROUP_ID_2,UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 3) {
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
		orderBy = " ORDER BY HQ_CHAN_CODE";
	} else {
		sql += " AND 1=2";
	}
	sql += orderBy;
	return sql;
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	sql=getsql();
	var title = [["账期","分公司","区县","营服名","渠道经理","渠道名称","渠道编码","用户名称","用户ID","用户号码","套餐","入网时间","状态","状态变化时间","近三月平均出账收入","近三月平均流量","客户姓名"]];
	if (type == 0) {
		showtext = '移动网预警清单机卡比对-' + dealDate;
	} else {
		showtext = '移动网预警清单机网比对-' + dealDate;
	}
	downloadExcel(sql, title, showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
