var nowData = [];
var title=[["州市","营服中心","营服编码","营服状态","毛利","毛利预算完成率","出帐收入(扣减赠费、退费)","","","","","","","","网运成本合计","铁塔租费（不含水电）","","网运水电费","","代维费","","网运房租及物业费","","客户接入成本开通费","","客户接入成本终端","","网优费","","网运修理费","","网运行政费用","","网运人工成本"],
           ["","","","","","","合计","2G","3G","4G","专租线","宽带","固话","其他","","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率","完成值","预算完成率",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE","FACT_UNIT_AMOUNT","COM_UNIT_RATE","INCOME_TOTAL","INCOME_2G","INCOME_3G","INCOME_4G","INCOME_ZX","INCOME_KD","INCOME_GH","INCOME_OTHER","LAN_ALL_AMOUNT","LAN_IRON_AMOUNT","LAN_IRON_RATE","LAN_WARTER_ELE_AMOUNT","LAN_WARTER_ELE_RATE","LAN_MAINTAI_AMOUNT","LAN_MAINTAI_RATE","LAN_RENT_AMOUNT","LAN_RENT_RATE","LAN_JRCB_KTF_AMOUNT","LAN_JRCB_KTF_RATE","LAN_JRCB_ZD_AMOUNT","LAN_JRCB_ZD_RATE","LAN_GOOD_AMOUNT","LAN_GOOD_RATE","LAN_XL_AMOUNT","LAN_XL_RATE","LAN_XZ_AMOUNT","LAN_XZ_RATE","LAN_MAN_AMOUNT"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
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
	var sql = " SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_UNIT_ABILITY_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
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
	var showtext = '云南联通营服效能明细展现-网运-'+time;
	downloadExcel(downSql,title,showtext);
}
