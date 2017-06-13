var nowData = [];
var title=[["地市","区县","是否重点乡镇","乡镇","乡镇编码","当日出账收入","","","","","当月累计出账收入","","","","","","当日移网新增发展","","","当月累计移网新增发展","","","","当日宽带新增发展","","","","当月累计宽带新增发展","","","","","当月累计渠道新增建设",""],
           ["","","","","","移网收入","宽带收入","固话收入","专租线收入","合计","移网收入","宽带收入","固话收入","专租线收入","合计","环比","单卡","终端合约","合计","单卡","终端合约","合计","环比","单宽带","TV+宽带","融合业务","合计","单宽带","TV+宽带","融合业务","合计","环比","合作厅/专营店","代理点/服务站"]];
var field=["GROUP_ID_1_NAME","CITY_NAME","IS_IMPORT","TOWN_NAME","TOWN_ID","CHARGE_YW","CHARGE_KD","CHARGE_NET","CHARGE_ZZX","CHARGE_HJ","SR_YW_NUM","SR_BB_NUM","SR_NET_NUM","SR_ZZX_NUM","SR_HJ_NUM","SR_HB_NUM","DEV_YW_NUM","DEV_HY_NUM","DEV_YWHJ_NUM","DEV_YW_NUM1","DEV_HY_NUM1","DEV_YWHJ_NUM1","DEV_YWHJ__HB_NUM","DEV_BB_DKD_NUM","DEV_BB_TV_NUM","DEV_BB_RH_NUM","DEV_BB_NUM","DEV_BB_DKD_NUM1","DEV_BB_TV_NUM1","DEV_BB_RH_NUM1","DEV_BB_NUM1","DEV_BB_HB_NUM1","ZZD","DLD"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TAB_MRT_TOWNS_BUSINESS_DAY"));
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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
	dealDate=$("#dealDate").val();
	var sql=getSql(dealDate);
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
	var showtext = '大乡大镇经营日表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}

function getSql(dealDate){
	var regionCode=$("#regionCode").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	return "SELECT 					                               "+
	"GROUP_ID_1_NAME,                                              "+
	"CITY_NAME,                                                    "+
	"DECODE(IS_IMPORT,'1','是','不是') IS_IMPORT,                    "+
	"TOWN_NAME,                                                    "+
	"TOWN_ID,                                                      "+
	"CHARGE_YW,                                                    "+
	"CHARGE_KD,                                                    "+
	"CHARGE_NET,                                                   "+
	"CHARGE_ZZX,                                                   "+
	"CHARGE_HJ,                                                    "+
	"SR_YW_NUM,                                                    "+
	"SR_BB_NUM,                                                    "+
	"SR_NET_NUM,                                                   "+
	"SR_ZZX_NUM,                                                   "+
	"SR_HJ_NUM,                                                    "+
	"SR_HB_NUM,                                                    "+
	"DEV_YW_NUM,                                                   "+
	"DEV_HY_NUM,                                                   "+
	"DEV_YWHJ_NUM,                                                 "+
	"DEV_YW_NUM1,                                                  "+
	"DEV_HY_NUM1,                                                  "+
	"DEV_YWHJ_NUM1,                                                "+
	"DEV_YWHJ__HB_NUM，                                                                                                                                     "+
	"DEV_BB_DKD_NUM,                                               "+
	"DEV_BB_TV_NUM,                                                "+
	"DEV_BB_RH_NUM,                                                "+
	"DEV_BB_NUM,                                                   "+
	"DEV_BB_DKD_NUM1,                                              "+
	"DEV_BB_TV_NUM1,                                               "+
	"DEV_BB_RH_NUM1,                                               "+
	"DEV_BB_NUM1,                                                  "+
	"DEV_BB_HB_NUM1,                                               "+
	"NVL(ZZD,0) ZZD,                                               "+
	"NVL(DLD,0) DLD                                                "+
	"FROM PMRT.TAB_MRT_TOWNS_BUSINESS_DAY                          "+
	 where+" ORDER BY GROUP_ID_1";
}
