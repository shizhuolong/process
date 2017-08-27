var nowData = [];
var title=[["州市","区县营服中心","成本中心代码","水电系统编号","基站名称","营业厅编号","合同编号","合同名称","主合同编号","期初余额","本月计提房租及一次性费用","本月计提物业管理费","本月支付（不含税）","支付增值税","期末余额"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","ACPEFIX","CELL_ID","CELL_NAME","D_LAN","CONTRACT_NO","CONTRACT_NAME","MAIN_CONTRACT_NO","START_FEE","THIS_MON_ONE_JT","THIS_MON_WY_JT","PAY_FEE","PAY_FAX","END_FEE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";
$(function() {
	var maxDate=getMaxDate("PMRT.TAB_MRT_RENT_MON");
	$("#startDate").val(maxDate);
	$("#endDate").val(maxDate);
	report = new LchReport({
		title : title,
		field : field,
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
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_RENT_MON WHERE DEAL_DATE BETWEEN '"+startDate+"' AND '"+endDate+"'";
	
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID = '"+unitCode+"'";
	}

	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	sql += orderBy;
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var startDate=$("#startDate").val();
	var endDate=$("#endDate").val();
	var showtext = '自有房租及物业费报表-'+startDate+"-"+endDate;
	downloadExcel(downSql,title,showtext);
}
