var nowData = [];
var report = null;
var field=["DEAL_DATE","GROUP_ID_1","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME","LINE_NAME","LEVEL_1_NAME","LEVEL_2_NAME","CC_CODE","CC_DESC","ACCOUNT_CODE","ACCOUNT_DESC","ACCOUNTED_DR"];
var title=[["账期","地市编码","地市名称","营服编码","营服名称","行业线","科目大类","科目小类","成本中心编码","成本中心名称","科目编码","科目描述","金额"]];
var downSql="";
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
	$("#line").change(function(){
		var line=$(this).val();
		initLevelName(line);
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
	var sql=getSql();
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
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var line=$("#line").val();
	var level_1_name=$("#level_1_name").val();
	var where=" WHERE T1.DEAL_DATE='"+dealDate+"' AND T1.UNIT_ID IS NOT NULL";
	
    if(regionCode!=""){
    	where+=" AND T1.GROUP_ID_1='"+regionCode+"'";
	}
    if(line!=""){
    	where+=" AND T2.LINE_NAME='"+line+"'";
    }
    if(level_1_name!=""){
    	where+=" AND T2.LEVEL_1_NAME='"+level_1_name+"'";
    }
	return "SELECT T1.DEAL_DATE,                                                      "+
	"               T1.GROUP_ID_1,                                             "+
	"               T1.GROUP_ID_1_NAME,                                        "+
	"               T1.UNIT_ID,                                                "+
	"               T1.UNIT_NAME,                                              "+
	"               T2.LINE_NAME,                                              "+
	"               T2.LEVEL_1_NAME,                                           "+
	"               T2.LEVEL_2_NAME,                                           "+
	"               T1.CC_CODE,                                                "+
	"               T1.CC_DESC,                                                "+
	"               T1.ACCOUNT_CODE,                                           "+
	"               T1.ACCOUNT_DESC,                                           "+
	"               SUM(NVL(ACCOUNTED_DR, 0)-NVL(ACCOUNTED_CR, 0)) ACCOUNTED_DR"+
	"       FROM  PODS.TB_ODS_DWA_PROV_GB_UNIT T1                              "+
	"          LEFT JOIN PODS.TB_ODS_DWA_PROV_AC_ITEM_unit T2                  "+
	"            ON INSTR(T1.ACCOUNT_CODE, T2.AC_PREFIX) = 1                   "+
	              where+                                                    
	"         GROUP BY T1.DEAL_DATE,                                           "+
	"                  T1.GROUP_ID_1,                                          "+
	"                  T1.GROUP_ID_1_NAME,                                     "+
	"                  T1.UNIT_ID,                                             "+
	"                  T1.UNIT_NAME,                                           "+
	"                  T2.LINE_NAME,                                           "+
	"                  T2.LEVEL_1_NAME,                                        "+
	"                  T2.LEVEL_2_NAME,                                        "+
	"                  T2.AC_PREFIX,                                           "+
	"                     T1.CC_CODE,                                          "+
	"               T1.CC_DESC,                                                "+
	"               T1.ACCOUNT_CODE,                                           "+
	"               T1.ACCOUNT_DESC                                            ";
}

function downsAll(){
	var dealDate=$("#dealDate").val();
	var showtext = "ERP科目明细核对-"+dealDate;
	downloadExcel(downSql,title,showtext);
}

function initLevelName(line){
	var sql="select DISTINCT LEVEL_1_NAME from PODS.TB_ODS_DWA_PROV_AC_ITEM_UNIT WHERE LINE_NAME='"+line+"'";
	var d=query(sql);
	var h="";
	if(d!=null&&d.length>0){
		for(var i=0;i<d.length;i++){
			h+="<option value='"+d[i].LEVEL_1_NAME+"'>"+d[i].LEVEL_1_NAME+"</option>";
		}
	}else{
		h+="<option value=''>全部</option>"
	}
	$("#level_1_name").empty().append($(h));
}