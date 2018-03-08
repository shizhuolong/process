var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1_NAME","ADSL_CZFEE","LAN_CZFEE","EOC_CZFEE","FTTH_CZFEE","ALL_CZFEE","BOT_CZFEE","ADSL_COMMFEE","LAN_COMMFEE","EOC_COMMFEE","FTTH_COMMFEE","ALL_COMMFEE","BOT_COMMFEE","ADSL_NUM","LAN_NUM","EOC_NUM","FTTH_NUM","ALL_NUM","BOT_NUM"];
var title=[["账期","地市","收入","","","","","","佣金","","","","","","用户数","","","","",""],
           ["","","ADSL","LAN","EOC","FTTH","小计","其中BOT","ADSL","LAN","EOC","FTTH","小计","其中BOT","ADSL","LAN","EOC","FTTH","小计","其中BOT"]];
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

var pageSize = 25;
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
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	var dealDate=$("#dealDate").val();
	
	//权限
	var where = "WHERE T.DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND T.GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND T.GROUP_ID_1 ='"+regionCode+"'";
	}
		
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
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

function getSql(){
	var sql="SELECT T.DEAL_DATE,                  "+
	"     T.GROUP_ID_1_NAME,            "+
	"     T.ADSL_CZFEE,                 "+
	"     T.LAN_CZFEE,                  "+
	"     T.EOC_CZFEE,                  "+
	"     T.FTTH_CZFEE,                 "+
	"     T.ALL_CZFEE,                  "+
	"     T.BOT_CZFEE,                  "+
	"     T.ADSL_COMMFEE,               "+
	"     T.LAN_COMMFEE,                "+
	"     T.EOC_COMMFEE,                "+
	"     T.FTTH_COMMFEE,               "+
	"     T.ALL_COMMFEE,                "+
	"     T.BOT_COMMFEE,                "+
	"     T.ADSL_NUM,                   "+
	"     T.LAN_NUM,                    "+
	"     T.EOC_NUM,                    "+
	"     T.FTTH_NUM,                   "+
	"     T.ALL_NUM,                    "+
	"     T.BOT_NUM                     "+
	"FROM PMRT.TB_MRT_NET_COMMFEE_FIX T ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "宽带佣金报表";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
