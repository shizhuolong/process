var nowData = [];

var title=[["分公司","账期","网别","增存量","佣金金额","","","","","","","","","","","","出佣用户数","","","","","","","","","","",""],
           ["","","","","代理佣金","其中：1、一次性代办费","2、话费分成","3、奖罚佣金","4、代收代办服务费","5、固网佣金","6、网格增收佣金","7、客服部维系","8、增值佣金","其他","6、网格增收佣金（单列）","7、客服部维系（走紧密外包）","代理佣金","其中：1、一次性代办费","2、话费分成","3、奖罚佣金","4、代收代办服务费","5、固网佣金","6、网格增收佣金","7、客服部维系","8、增值佣金","其他","6、网格增收佣金（单列）","7、客服部维系（走紧密外包）"]
		  ];
var field=["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26","C27","C28"];
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
	//权限
	var orgLevel=$("#orgLevel").val();

	var sql=" SELECT T.C1,                                          "+
			"        T.C2,                                          "+
			"        T.C3,                                          "+
			"        T.C4,                                          "+
			"        T.C5,                                          "+
			"        T.C6,                                          "+
			"        T.C7,                                          "+
			"        T.C8,                                          "+
			"        T.C9,                                          "+
			"        T.C10,                                         "+
			"        T.C11,                                         "+
			"        T.C12,                                         "+
			"        T.C13,                                         "+
			"        T.C14,                                         "+
			"        T.C15,                                         "+
			"        T.C16,                                         "+
			"        T.C17,                                         "+
			"        T.C18,                                         "+
			"        T.C19,                                         "+
			"        T.C20,                                         "+
			"        T.C21,                                         "+
			"        T.C22,                                         "+
			"        T.C23,                                         "+
			"        T.C24,                                         "+
			"        T.C25,                                         "+
			"        T.C26,                                         "+
			"        T.C27,                                         "+
			"        T.C28                                          "+
			"   FROM PMRT.TB_MRT_VIEW_COMMFEE_COMMITEM T            "+
			"  WHERE T.C2 BETWEEN '"+startDate+"' AND '"+endDate+"' ";

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(c3!=''&&c3!=null){
		sql+=" AND T.C3 ='"+c3+"'";
	}
	if(c4!=''&&c4!=null){
		sql+=" AND T.C4='"+c4+"'";
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
	var title=[["分公司","账期","网别","增存量","佣金金额","","","","","","","","","","","","出佣用户数","","","","","","","","","","",""],
	           ["","","","","代理佣金","其中：1、一次性代办费","2、话费分成","3、奖罚佣金","4、代收代办服务费","5、固网佣金","6、网格增收佣金","7、客服部维系","8、增值佣金","其他","6、网格增收佣金（单列）","7、客服部维系（走紧密外包）","代理佣金","其中：1、一次性代办费","2、话费分成","3、奖罚佣金","4、代收代办服务费","5、固网佣金","6、网格增收佣金","7、客服部维系","8、增值佣金","其他","6、网格增收佣金（单列）","7、客服部维系（走紧密外包）"]
			  ];
    var showtext = '按佣金科目统计佣金报表-('+startDate+"~"+endDate+")";
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////