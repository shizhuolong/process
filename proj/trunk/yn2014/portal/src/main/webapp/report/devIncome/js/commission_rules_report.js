var nowData = [];

var title=[["分公司","账期","网别","增存量","佣金类型","佣金来源","佣金规则ID（无规则佣金放入“其他”）","佣金规则","佣金金额","用户数"]];
var field=["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
		rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
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
	//获得查询sql
	var sql = getsql();
	
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
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

function getsql(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var region = $("#region").val();
	//网别
	var c3=$("#c3").val();
	//增存量
	var c4=$("#c4").val();
	//佣金类型
	var c5 =$("#c5").val();
	//权限
	var orgLevel=$("#orgLevel").val();

	var sql = 	" SELECT T.C1, T.C2, T.C3, T.C4, T.C5, T.C6, T.C7, T.C8, T.C9, T.C10 "+
				"   FROM PMRT.TB_MRT_VIEW_COMMFEE_RULE T                             "+
				"  WHERE T.C2 BETWEEN '"+startDate+"' AND '"+endDate+"'              ";

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(c3!=''&&c3!=null){
		sql+=" AND T.C3 ='"+c3+"'";
	}
	if(c4!=''&&c4!=null){
		sql+=" AND T.C4='"+c4+"'";
	}
	
	if(c5 != "") {
		if(c5 == "1") {
			sql += " AND T.C5 = '1、一次性代办费'";
		}else if(c5 == "2") {
			sql += " AND T.C5 = '2、话费分成'";
		}else if(c5 == "3") {
			sql += " AND T.C5 = '3、奖罚佣金'";
		}else if(c5 == "4") {
			sql += " AND T.C5 = '4、代收代办服务费'";
		}else if(c5 == "5") {
			sql += " AND T.C5 = '5、固网佣金'";
		}else if(c5 == "7") {
			sql += " AND T.C5 = '7、客服部维系'";
		}else if(c5 == "100") {
			sql += " AND T.C5 = '其他'";
		}else {}
	}
	/*if(channelAttrs!=''&& channelLevel!=''&&typeof(channelAttrs)!="undefined" && typeof(channelLevel)!="undefined"){
		sql+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
	}*/
	if(orgLevel==1){
		
	}else{
		sql+=" AND T.GROUP_ID_1 ='"+region+"'";
	}
	
	return sql;
}
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var sql = getsql();
	var title=[["分公司","账期","网别","增存量","佣金类型","佣金来源","佣金规则ID（无规则佣金放入“其他”）","佣金规则","佣金金额","用户数"]];
    var showtext = '佣金规则报表-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////