var nowData = [];
var report = null;
var orderBy='';
var field=["GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME" ,"CHN_CDE_4_NAME" ,"CONTRACT_NO" ,"CONTRACT_FEE" ,"THIS_MON_FEE" ,"STATION_NO" ,"STATION_NAME"];
var title=[["州市","营服","渠道集中系统资料","","","水电系统资料","","","",""],
           ["","","渠道编码","渠道名称","渠道第四级属性","合同编码","合同金额","统计期分摊金额","局站编码","局站名称"]];
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	
	//权限
	var where = " WHERE DEAL_DATE = "+dealDate;
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2 ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ="+regionCode;
	}
	if(hqChanlCode!=''){
		where+=" AND HQ_CHAN_CODE = '"+hqChanlCode+"'";
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
	var sql="SELECT GROUP_ID_1_NAME,            "+
	"       UNIT_NAME,                  "+
	"       HQ_CHAN_CODE,               "+
	"       GROUP_ID_4_NAME,            "+
	"       CHN_CDE_4_NAME,             "+
	"       CONTRACT_NO,                "+
	"       CONTRACT_FEE,               "+
	"       THIS_MON_FEE,               "+
	"       STATION_NO,                 "+
	"       STATION_NAME                "+
	" FROM PMRT.TAB_MRT_SDF_RENT_BD_MON ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "水电系统房租渠道与集中系统自建他营渠道比对报表";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
