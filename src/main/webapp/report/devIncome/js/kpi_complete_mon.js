var nowData;
var title = [["地市","基层单元","HR编码","人员姓名","角色类型","发展任务累计","发展完成累计","发展任务完成率累计","积分任务","积分完成","积分任务完成率","收入任务","收入完成","收入任务完成率","分月发展任务","分月发展完成","分月发展任务完成率"]];
var field = ["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_ROLE","TASK_DEV","DEV_COUNT","DEV_COMPLETE","TASK_JF","JF_COUNT","JF_COMPLETE","TASK_INCOME","TOTAL_FEE","INCOME_COMPLETE","TASK_DEV_MON","DEV_COUNT_MON","DEV_COMPLETE_MON"];
var report = null;
var dealDate = "";
var downSql="";
var orderBy="";

$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css : [ {
			gt : 4,
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
	var name=$.trim($("#name").val());
	// 权限
	var orgLevel = $("#orgLevel").val();
	var code = $("#code").val();
	var orderBy = "";

	var sql = "SELECT                              "+
		"GROUP_ID_1_NAME                          "+
		",UNIT_NAME                                "+
		",HR_ID                                    "+
		",NAME                                     "+
		",USER_ROLE                                "+
		",TASK_DEV                                 "+
		",DEV_COUNT                                "+
		",DEV_COMPLETE                             "+
		",TASK_JF                                  "+
		",JF_COUNT                                 "+
		",JF_COMPLETE                              "+
		",TASK_INCOME                              "+
		",TOTAL_FEE                                "+
		",INCOME_COMPLETE                          "+
		",TASK_DEV_MON"+
		",DEV_COUNT_MON"+
		",DEV_COMPLETE_MON"+
		" FROM PMRT.TB_MRT_KPI_COMPLETE_MON WHERE DEAL_DATE="+dealDate;
	

	if (regionCode != '') {
		sql += " AND GROUP_ID_1='" + regionCode + "'";
	}
	if (unitCode != '') {
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if (name != '') {
		sql += " AND NAME LIKE '%" + name + "%' ";
	}
	
	if (orgLevel == 1) {
		orderBy = " ORDER BY GROUP_ID_1,UNIT_ID,HR_ID";
	} else if (orgLevel == 2) {
		sql += " AND GROUP_ID_1='" + code + "'";
		orderBy = " ORDER BY UNIT_ID,HR_ID";
	} else if (orgLevel == 3) {
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
		orderBy = " ORDER BY HR_ID";
	} else {
		sql += " AND 1=2";
	}
	sql += orderBy;
	return sql;
}


// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	showtext = 'KPI完成率汇总-' + dealDate;
	downloadExcel(downSql, title, showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
