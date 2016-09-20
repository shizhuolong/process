var nowData;
var title = [["分公司","营服名","HR编码","渠道经理","状态","渠道名称","渠道编码","当期发展量","较上月日均变化"]];
var field = ["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","TYPE_ID","HQ_CHAN_NAME","HQ_CHAN_CODE","DEV_NUM","LAST_AVG_CHANGE"];
var report = null;
var dealDate = "";
var downSql="";
var orderBy="";

$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css : [ {
			gt : 6,
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
	var sql = getsql();
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql + ")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
		return;
	}
	//排序
	if (orderBy != '') {
		sql = "select * from ("+sql+")"+orderBy;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;
	report.showSubRow();
	// /////////////////////////////////////////
	// $("#lch_DataHead").find("TH").unbind();
	// $("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	// /////////////////////////////////////////
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
	var type_id=$("#type_id").val();
	var hqChanCode=$.trim($("#hqChanCode").val());
	var name=$.trim($("#name").val());
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var orderBy = "";

	var sql =  "SELECT DEAL_DATE,GROUP_ID_1_NAME                     "
		+"      ,UNIT_NAME                                           "
		+"      ,HR_ID                                               "
		+"      ,NAME                                                "
		+"      ,DECODE(TYPE_ID,1,'突增',2,'突减',3,'零销量') TYPE_ID     "
		+"      ,HQ_CHAN_CODE                                        "
		+"      ,HQ_CHAN_NAME                                        "
		+"      ,DEV_NUM                                             "
		+"      ,LAST_AVG_CHANGE                                     "
		+"FROM PMRT.TAB_MRT_MOB_CHANL_DEV_EXC PARTITION(P"+dealDate+")"
	+" WHERE 1=1";

	
	if (regionCode != '') {
		sql += " AND GROUP_ID_1='" + regionCode + "'";
	}
	if (unitCode != '') {
		sql += " AND UNIT_ID='" + unitCode + "'";
	}
	if (type_id != '') {
		sql += " AND TYPE_ID='" + type_id + "'";
	}
	if (hqChanCode != '') {
		sql += " AND HQ_CHAN_CODE='" + hqChanCode + "'";
	}
	if (name != '') {
		sql += " AND NAME='" + name + "'";
	}
	
	if (orgLevel == 1) {
		orderBy = " ORDER BY GROUP_ID_1,UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 2) {
		sql += " AND GROUP_ID_1='" + code + "'";
		orderBy = " ORDER BY UNIT_ID,HQ_CHAN_CODE";
	} else if (orgLevel == 3) {
		sql += " AND UNIT_ID='" + code + "'";
		orderBy = " ORDER BY HQ_CHAN_CODE";
	} else {
		sql += " AND 1=2";
	}
	sql += orderBy;
	return sql;
}

// /////////////////////////地市查询///////////////////////////////////////
function listRegions() {
	var sql = " SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PMRT.TAB_MRT_MOB_CHANL_DEV_EXC T WHERE 1=1 AND T.GROUP_ID_1 IS NOT NULL";
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	if (orgLevel == 1) {

	} else if (orgLevel == 2) {
		sql += " AND T.GROUP_ID_1='" + code + "'";
	} else {
		sql += " AND T.UNIT_ID='" + code + "'";
	}
	sql += " ORDER BY T.GROUP_ID_1"
	var d = query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1 + '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">'
						+ d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionCode");
		$area.empty().append($(h));
		$area.change(function() {
			listUnits($(this).attr('value'));
		});
	} else {
		alert("获取地市信息失败");
	}
}

function listUnits(regionCode) {
	var $unit = $("#unitCode");
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var sql = "SELECT DISTINCT T.UNIT_ID,T.UNIT_NAME FROM PMRT.TAB_MRT_MOB_CHANL_DEV_EXC T WHERE 1=1 ";
	if (regionCode != '') {
		sql += " AND T.GROUP_ID_1='" + regionCode + "' ";
		if (orgLevel == 1) {

		} else if (orgLevel == 2) {

		} else if (orgLevel == 3) {
			sql += " AND T.UNIT_ID='" + code + "'";
		} else {
			sql += " AND 1=2";
		}
	} else {
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}

	sql += " ORDER BY T.UNIT_ID"
	var d = query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_ID + '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_ID + '">' + d[i].UNIT_NAME
						+ '</option>';
			}
		}
		$unit.empty().append($(h));
	} else {
		alert("获取营服中心信息失败");
	}
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var title = [["账期","分公司","营服名","HR编码","渠道经理","状态","渠道名称","渠道编码","当期发展量","较上月日均变化"]];
	showtext = '移网渠道异动清单-' + dealDate;
	downloadExcel(downSql, title, showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
