var nowData = [];
var title=[["州市名称","营服中心","营服编码","营服状态","发展用户数预算","","","","","出账收入预算","市场成本预算总额","网运成本预算","","","","","","","",""],
           ["","","","","合计","移网","宽带","专线","其他","","","铁塔租费（不含水电）","网运水电费","代维费","网运房租及物业费","客户接入成本开通费","客户接入成本终端","网优费","网运修理费","网运行政费用"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE","YS_DEV_ALL_NUM","YS_DEV_YW_NUM","YS_DEV_KD_NUM","YS_DEV_ZX_NUM","YS_DEV_OTHER_NUM","YS_SR_AMOUNT","SC_YS_COST_AMOUNT","LAN_IRON_AMOUNT","LAN_WARTER_ELE_AMOUNT","LAN_MAINTAI_AMOUNT","LAN_RENT_AMOUNT","LAN_JRCB_KTF_AMOUNT","LAN_JRCB_ZD_AMOUNT","LAN_GOOD_AMOUNT","LAN_XL_AMOUNT","LAN_XZ_AMOUNT"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		closeHeader:true,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
	var time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_YS_MON WHERE 1=1";
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" and GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
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
	var showtext = '云南联通营服预算表-'+time;
	downloadExcel(downSql,title,showtext);
}
