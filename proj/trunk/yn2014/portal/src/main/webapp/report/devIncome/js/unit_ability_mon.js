var nowData = [];
var title=[["州市名称","营服中心","营服编码","营服状态","发展用户数","","","","","","出账用户数","","","","","","销售毛利","","","营服毛利","","","出账收入预算","","出账收入实际完成","","","","","","出账收入时序预算完成率","市场成本","","","网运成本","","","营业欠款余额","用户欠费余额","用户预存款余额","二次续费率"],
           ["","","","","合计","移网","专线","宽带","固话","其他","合计","移网","专线","宽带","固话","其他","全年预算","实际完成","预算完成率","全年预算","实际完成","预算完成率","年度","时序","合计","移网","专线","宽带","固话","其他","","年度预算","实际完成","剩余额度","年度预算","实际完成","剩余额度","","","",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE","DEV_ALL_NUM","DEV_YW_NUM","DEV_ZX_NUM","DEV_KD_NUM","DEV_GH_NUM","DEV_OTHER_NUM","CHARGE_ALL_NUM","CHARGE_YW_NUM","CHARGE_ZX_NUM","CHARGE_KD_NUM","CHARGE_GH_NUM","CHARGE_OTHER_NUM","YS_SALE_AMOUNT","FACT_SALE_AMOUNT","COM_SALE_RATE","YS_UNIT_AMOUNT","FACT_UNIT_AMOUNT","COM_UNIT_RATE","CHARGE_YEAR_YS","FACT_CHARGE_MON_YS","FACT_CHARGE_ALL_NUM","FACT_CHARGE_YW_NUM","FACT_CHARGE_ZX_NUM","FACT_CHARGE_KD_NUM","FACT_CHARGE_GH_NUM","FACT_CHARGE_OTHER_NUM","CHARGE_COM_RATE","SC_COST","SC_COM","SC_LEFT","LAN_COST","LAN_COM","LAN_LEFT","BUSI_OWE_LEFT","SUBS_OWE_LEFT","SUBS_PAY_LEFT","SECOND_PAY_RATE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null;
var downSql="";
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		closeHeader:true,
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
	var showtext = '云南联通营服效能汇总表-'+time;
	downloadExcel(downSql,title,showtext);
}
