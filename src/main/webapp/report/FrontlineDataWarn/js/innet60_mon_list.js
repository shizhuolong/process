var nowData;
var title = [["账期","地市名称","营服","渠道编码","渠道名称","用户编码","用户号码","入网时间","业务类型"]];
var field = ["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","SUBSCRIPTION_ID","DEVICE_NUMBER","INNET_DATE","SERVICE_TYPE"];
var report = null;
var downSql = "";
var dealDate = "";
$(function() {
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
	var sql = getSql();
	downSql=sql;
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
	report.showSubRow();
	
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function() {
		var area = $(this).find("TD:eq(0)").find("A").text();
		if (area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql() {
	dealDate = $("#dealDate").val();
	var regionCode = $("#regionCode").val();
	var hq_chan_code = $.trim($("#hq_chan_code").val());
	var device_number = $.trim($("#device_number").val());
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#region").val();
	if (regionCode != '') {
		where += " AND GROUP_ID_1='" + regionCode + "'";
	}
	if (hq_chan_code != '') {
		where += " AND HQ_CHAN_CODE LIKE '%" + hq_chan_code + "%'";
	}
	if (device_number != '') {
		where += " AND DEVICE_NUMBER LIKE '%" + device_number + "%'";
	}

	if (orgLevel == 1) {
		
	} else if (orgLevel == 2||orgLevel==3) {
		where += " AND GROUP_ID_1='" + code + "'";
	} else {
		where += " AND 1=2";
	}
	
	sql="SELECT "+field.join(",")+" FROM PODS.VIEW_ODS_NETW_INNET60_MON"+where+" ORDER BY GROUP_ID_1,UNIT_NAME,HQ_CHAN_CODE";
	return sql;
}

function downsAll() {
	var showtext = '宽带在网60月用户-' + dealDate;
	downloadExcel(downSql, title, showtext);
}
