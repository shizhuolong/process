var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","HQ_LC_NUM","DEVELOP_LC_NUM","LC_NUM","PERSON_LC_NUM" ,"INNET_LC_NUM" ,"HQ_QCD_NUM" ,"DEVELOP_QCD_NUM" ,"QCD_NUM" ,"PERSON_QCD_NUM" ,"INNET_QCD_NUM"];
var title=[["州市","临促专员","","","","","轻触点渠道","","","",""],
           ["","渠道经理招募专员数","存量渠道招募专员数","临促专员招募合计数","有效能专员","累计发展量","渠道经理发展轻触点数","存量渠道发展轻触点数","轻触点渠道发展人合计数","有效能轻触点发展人数","累计发展量"]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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

var pageSize = 20;
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	
	//权限
	var where = " WHERE T.DEAL_DATE = "+dealDate;
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND T.GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ="+regionCode;
	}
		
	var sql=getSql(where);
	
	var cdata = query("select count(*) total from(" + sql+")");
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
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(where){
	var sql="SELECT  T.DEAL_DATE            "+
	"       ,T.GROUP_ID_1_NAME      "+
	"       ,T.HQ_LC_NUM            "+
	"       ,T.DEVELOP_LC_NUM       "+
	"       ,T.LC_NUM               "+
	"       ,T.PERSON_LC_NUM        "+
	"       ,T.INNET_LC_NUM         "+
	"       ,T.HQ_QCD_NUM           "+
	"       ,T.DEVELOP_QCD_NUM      "+
	"       ,T.QCD_NUM              "+
	"       ,T.PERSON_QCD_NUM       "+
	"       ,T.INNET_QCD_NUM        "+
	"FROM PMRT.TAB_MRT_DT_QCD_DAY T "+
	where+
	" ORDER BY T.GROUP_ID_1";
	return sql;
}

function getDownSql(){
	var sql="SELECT T1.DEAL_DATE                    "+
	"      ,T1.GROUP_ID_1_NAME              "+
	"      ,T1.UNIT_NAME                    "+
	"      ,T1.DEVELOPER                    "+
	"      ,T1.DEVELOPER_NAME               "+
	"      ,T1.HQ_CHANL_CODE                "+
	"      ,T1.HQ_CHAN_NAME                 "+
	"      ,T1.HQ_TYPE                      "+
	"      ,T1.DEV_NUM                      "+
	"FROM PMRT.TAB_MRT_DT_QCD_DETAIL_DAY T1 ";
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var where = " WHERE T1.DEAL_DATE = "+dealDate;
	if(orgLevel==1){

	}else{
		where += " AND T1.GROUP_ID_1 =" + region;
	}
	//条件
	if(regionCode!=''){
		where+= " AND T1.GROUP_ID_1 ="+regionCode;
	}
	var downSql=getDownSql();
	downSql+=where;
	showtext = "轻触点明细";
	var title=[["账期","地市","营服","发展人","发展人名称","总部渠道","渠道名称","渠道类型","销量"]];
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function showDesc(){
	var url = $("#ctx").val()+"/report/reportNew/jsp/tencent_extend_dev_explain.jsp";
	art.dialog.open(url,{
		id:'bindDescDialog',
		width:'650px',
		height:'300px',
		lock:true,
		resize:false
	});
}