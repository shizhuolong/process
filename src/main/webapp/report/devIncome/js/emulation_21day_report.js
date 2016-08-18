var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","BUS_NUM","DEV_ALL_NUM","DEV_ALL_NUM1","DEV_AVG_46NUM","DEV_AVG_810NUM","LAST_ALL_NUM"];
var title=[["账期","分公司","厅数","当日发展","累计发展量","4-6月日均发展量","8-10月日均发展量","日均发展环比增长情况"]];
var orderBy='';	
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

var pageSize = 17;
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

	var sql= getsql()+" ORDER BY T.GROUP_ID_1";
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
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	/*///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
*/	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	/**********************特殊处理，如果报表增加字段需要修改********************/
	$("#lch_DataHead th").css({"width":"12.5%"});
	/*******************************************************************/
}


 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["账期","分公司","厅数","当日发展","累计发展量","4-6月日均发展量","8-10月日均发展量","日均发展环比增长情况"]];

	var dealDate=$("#dealDate").val();
	
	var sql="SELECT DEAL_DATE,        "+
			"       GROUP_ID_1_NAME,  "+
			"       BUS_NUM,          "+
			"       DEV_ALL_NUM,      "+
			"       DEV_ALL_NUM1,     "+
			"       DEV_AVG_46NUM,    "+
			"       DEV_AVG_810NUM,   "+
			"       LAST_ALL_NUM      "+
			"  FROM (                 "+getsql()+") ORDER BY GROUP_ID_1";
	
	showtext = '21天竞赛任务通报-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////


function getsql(){
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var regionCode =$("#regionCode").val();
	var　sql="SELECT '"+dealDate+"' AS DEAL_DATE,T.GROUP_ID_0,                                     "+
			"       NVL(T.GROUP_ID_1, 16000) GROUP_ID_1,                                          "+
			"       NVL(T.GROUP_ID_1_NAME, '全省') AS GROUP_ID_1_NAME,							  "+
			"       SUM(NVL(T.BUS_NUM, 0)) AS BUS_NUM, 											  "+
			"       SUM(NVL(T.DEV_ALL_NUM, 0)) AS DEV_ALL_NUM, 									  "+
			"       SUM(NVL(T.DEV_ALL_NUM1, 0)) AS DEV_ALL_NUM1, 								  "+
			"       SUM(NVL(T.DEV_AVG_46NUM, 0)) AS DEV_AVG_46NUM, 								  "+
			"       SUM(NVL(T.DEV_AVG_810NUM, 0)) AS DEV_AVG_810NUM, 							  "+
			"       PMRT.LINK_RATIO(SUM(T.DEV_ALL_NUM), SUM(T.LAST_ALL_NUM), 2) AS LAST_ALL_NUM   "+
			"  FROM PMRT.TAB_MRT_BUS_21COMPETITION_DAY T                                          "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'                                                  ";
	if(orgLevel==1){
		
	}else{
		sql+=" AND T.GROUP_ID_1 ='"+regionCode+"' ";
	}
		sql+=" GROUP BY GROUPING SETS(T.GROUP_ID_0,(T.GROUP_ID_0, GROUP_ID_1_NAME, T.GROUP_ID_1,T.DEAL_DATE))  ";
		return sql;
}


function downsDetail(){
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var regionCode = $("#regionCode").val();
	
	var title=[["账期","分公司","营业厅编码","营业厅名称","当日新发展","","","","当月累计新发展","","","","4-6日均发展量","8-10日均发展量","日均发展环比增长情况"],
	           ["","","","","2G","3G","4G","固网","2G","3G","4G","固网","","",""]];

	var dealDate=$("#dealDate").val();
	
	var sql="SELECT DEAL_DATE,                                                          "+
			"       NVL(T.GROUP_ID_1_NAME, '合计') AS GROUP_ID_1_NAME,                  "+
			"       T.HQ_CHAN_CODE,                                                     "+
			"       T.BUS_NAME,                                                         "+
			"       T.DEV_2G_NUM,                                                       "+
			"       T.DEV_3G_NUM,                                                       "+
			"       T.DEV_4G_NUM,                                                       "+
			"       T.DEV_NET_NUM,                                                      "+
			"       T.DEV_2G_NUM1,                                                      "+
			"       T.DEV_3G_NUM1,                                                      "+
			"       T.DEV_4G_NUM1,                                                      "+
			"       T.DEV_NET_NUM1,                                                     "+
			"       T.DEV_AVG_46NUM,                                                    "+
			"       T.DEV_AVG_810NUM,                                                   "+
			"       PMRT.LINK_RATIO(T.DEV_ALL_NUM, T.LAST_ALL_NUM, 2) AS LAST_ALL_NUM   "+
			"  FROM PMRT.TAB_MRT_BUS_21COMPETITION_DAY T                                "+
			" WHERE T.DEAL_DATE = '"+dealDate+"'                                        ";
		if(orgLevel==1){
			
		}else{
			sql+=" AND T.GROUP_ID_1 ='"+regionCode+"' ";
		}
	
	showtext = '21天竞赛任务通报明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}


function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}  
