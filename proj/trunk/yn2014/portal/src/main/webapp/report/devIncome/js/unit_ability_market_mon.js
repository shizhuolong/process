var nowData = [];
var title=[["州市","营服中心","营服编码","营服状态","毛利","毛利预算完成率","出帐收入(扣减赠费、退费)","","","","","","","","成本合计","佣金","","","","","","","","渠道补贴","终端补贴","卡成本","营业厅房租","装修","水电物业安保费","广告宣传费","业务用品印制及材料费（含配送费、其他）","车辆使用费","招待费","办公费","差旅费","通信费","紧密外包费用"],
           ["","","","","","","合计","2G","3G","4G","专租线","宽带","固话","其他","","合计","2G","3G","4G","专租线","宽带","固网","其他","","","","","","","","","","","","","",""]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","UNIT_ID","UNIT_TYPE","FACT_UNIT_AMOUNT","COM_UNIT_RATE","INCOME_TOTAL","INCOME_2G","INCOME_3G","INCOME_4G","INCOME_ZX","INCOME_KD","INCOME_GH","INCOME_OTHER","GRIDDING_TOTAL","COMM_TOTAL","COMM_2G","COMM_3G","COMM_4G","COMM_ZX","COMM_KD","COMM_HARDLINK","COMM_GY","CHANNEL","ZDBT_AMOUNT","KVB_AMOUNT","FZF_AMOUNT","ZX_AMOUNT","SDWYF_AMOUNT","ADS_AMOUNT","YWYPCLF_AMOUNT","CLSYF_AMOUNT","ZDF_AMOUNT","BGF_AMOUNT","CLF_AMOUNT","TXF_AMOUNT","FEE_JMWB"];
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
	sql+= orderBy;
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
	var showtext = '云南联通营服效能明细展现-市场-'+time;
	downloadExcel(downSql,title,showtext);
}
