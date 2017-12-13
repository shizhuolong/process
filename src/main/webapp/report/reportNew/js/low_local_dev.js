var nowData = [];
var report = null;
var orderBy='';
var maxDate=null;
var field=["GROUP_ID_1_NAME","UNIT_NAME","SC_DEV_DAY","SC_DEV_MON","SC_DEV_LJ","XCS_ZHL","MSG_ZHL","ALL_ZHL","SC_XN_DAY"];
var title=[["州市","区县","日首充发展数","月累计首充数","累计首充数","闪电购转化率","码上购转化率","综合转化率","日效能人数"]];
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
	var hr_id=$("#hr_id").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var dealDate=$("#dealDate").val();

	var where=" WHERE DEAL_DATE = "+dealDate;
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND UNIT_ID = '" + code +"' ";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		where+= " AND UNIT_ID ='"+unitCode+"'";
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
	var sql="SELECT  SUBSTR(GROUP_ID_1_NAME,1,2)GROUP_ID_1_NAME,           "+
	"        UNIT_NAME,                                            "+
	"        SC_DEV_DAY,                                           "+
	"        SC_DEV_MON,                                           "+
	"        SC_DEV_LJ,                                            "+                                       
	"		PMRT.LINK_RATIO_ZB(XCS_SC_DEV,XCS_ORDER_NUM,2)XCS_ZHL, "+    
	"		PMRT.LINK_RATIO_ZB(MSG_SC_DEV,MSG_ORDER_NUM,2)MSG_ZHL, "+     
	"		PMRT.LINK_RATIO_ZB(SC_DEV_LJ,ORDER_ALL_NUM,2)ALL_ZHL,  "+
	"        SC_XN_DAY                                             "+
	"FROM                                                          "+
	"PMRT.TB_MRT_DW_V_D_HLW_OUTLINE ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "双低区县地推发展情况";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
