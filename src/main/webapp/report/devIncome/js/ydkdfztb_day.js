var field= ["GROUP_ID_1_NAME","YDKD_SB_HJ","YDKD_SB_HJ_LJ","YDKD_SJWC","YDKD_SJWC_LJ",
            "YDKD_SJWC_LAST_LJ","YDKD_SJWC_HB","YDKD_WCL","YDKD_WCL_LJ",
            "ZBJ_3G_SB","ZBJ_3G_SB_LJ","ZBJ_3G_SJWC","ZBJ_3G_SJWC_LJ","ZBJ_3G_HB",
            "ZBJ_3G_WCL","ZBJ_3G_WCL_LJ","NEW_4G_SB","NEW_4G_SB_LJ",
            "NEW_4G_SJWC","NEW_4G_SJWC_LJ","NEW_4G_HB","NEW_4G_WCL","NEW_4G_WCL_LJ",
            "LJZB_4G_66","LJZB_4G_76","LJZB_4G_UP_106","ZH_4G_ZB",
            "WK_SB","WK_SB_LJ",
            "WK_SJWC","WK_SJWC_LJ","WK_HB","WK_WCL","WK_WCL_LJ",
            "OTHER_SB","OTHER_SB_LJ","OTHER_SJWC","OTHER_SJWC_LJ","OTHER_HB","OTHER_WCL","OTHER_WCL_LJ",
            "XLLK_SJWC","XLLK_SJWC_LJ"];
$(function(){
	var orderBy='';	
	var report=new LchReport({
		title:[["分公司","移动宽带发展通报","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
		       ["","移动宽带发展合计","","","","","","","","3G自备机升级版","","","","","","","4G新发展","","","","","","","","","","","沃快","","","","","","","其它","","","","","","","小流量卡",""],
		       ["","分公司上报","","实际完成","","","","完成率 ","","分公司上报","","实际完成","","","完成率 ","","分公司上报","","实际完成","","","完成率 ","","其中套餐占比","","","","分公司上报","","实际完成","","","完成率 ","","分公司上报","","实际完成","","","完成率 ","","当日","累计"],
		       ["","当日","累计","当日","本月累计","上月累计","环比","当日","累计","当日","累计","当日","累计","环比","当日","累计","当日","累计","当日","累计","环比","当日","累计","本月累计66及以下套餐占比","本月累计76套餐占比","本月累计106及以上套餐占比","本月累计组合套餐占比","当日","累计","当日","累计","环比","当日","累计","当日","累计","当日","累计","环比","当日","累计","",""]]
		,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:[],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
		},
		getSubRowsCallBack:function($tr){
			var date = $.trim($("#time").val());
			var fsql = '';
			var sql = "SELECT T.GROUP_ID_1_NAME,T.YDKD_SB_HJ,T.YDKD_SB_HJ_LJ,T.YDKD_SJWC,T.YDKD_SJWC_LJ,T.YDKD_SJWC_LAST_LJ,T.YDKD_SJWC_HB," +
			"T.YDKD_WCL,T.YDKD_WCL_LJ,T.ZBJ_3G_SB,T.ZBJ_3G_SB_LJ,T.ZBJ_3G_SJWC,T.ZBJ_3G_SJWC_LJ,T.ZBJ_3G_HB," +
			"T.ZBJ_3G_WCL,T.ZBJ_3G_WCL_LJ,T.NEW_4G_SB,T.NEW_4G_SB_LJ,T.NEW_4G_SJWC,T.NEW_4G_SJWC_LJ,T.NEW_4G_HB," +
			"T.NEW_4G_WCL,T.NEW_4G_WCL_LJ,T.LJZB_4G_66,T.LJZB_4G_76,T.LJZB_4G_UP_106,T.ZH_4G_ZB," +
			"T.WK_SB,T.WK_SB_LJ,T.WK_SJWC,T.WK_SJWC_LJ,T.WK_HB," +
			"T.WK_WCL," +
			"T.WK_WCL_LJ,T.OTHER_SB,T.OTHER_SB_LJ,T.OTHER_SJWC,T.OTHER_SJWC_LJ,T.OTHER_HB,T.OTHER_WCL," +
			"T.OTHER_WCL_LJ,T.XLLK_SJWC,T.XLLK_SJWC_LJ FROM PMRT.TB_MRT_YDKDFZTB_DAY T " +
			"WHERE T.DEAL_DATE = '"+date+"' " + fsql ;
			sql = sql + " ORDER BY t.group_id_1";
			var d=query(sql);
			return {data:d,extra:{}};
		}
	});
	report.showSubRow();
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	$(".sub_on,.sub_off,.space").remove();
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataBody").find("TR").each(function(){
			var area=$(this).find("TD:eq(0)").find("A").text();
			if(area)
				$(this).find("TD:eq(0)").empty().text(area);
		});
		$(".sub_on,.sub_off,.space").remove();
	});
});
/////////////////////////下载开始/////////////////////////////////////////////
//导出excel
function downsAll(){
	
	var date = $.trim($("#time").val());
	var fsql = '';
	var sql = "SELECT T.DEAL_DATE,T.GROUP_ID_1_NAME,nvl(T.YDKD_SB_HJ,0),nvl(T.YDKD_SB_HJ_LJ,0)," +
			"nvl(T.YDKD_SJWC,0),nvl(T.YDKD_SJWC_LJ,0),nvl(T.YDKD_SJWC_LAST_LJ,0),nvl(T.YDKD_SJWC_HB,0)," +
	"nvl(T.YDKD_WCL,0),nvl(T.YDKD_WCL_LJ,0),nvl(T.ZBJ_3G_SB,0),nvl(T.ZBJ_3G_SB_LJ,0)," +
	"nvl(T.ZBJ_3G_SJWC,0),nvl(T.ZBJ_3G_SJWC_LJ,0),nvl(T.ZBJ_3G_HB,0)," +
	"nvl(T.ZBJ_3G_WCL,0),nvl(T.ZBJ_3G_WCL_LJ,0),nvl(T.NEW_4G_SB,0),nvl(T.NEW_4G_SB_LJ,0)," +
	"nvl(T.NEW_4G_SJWC,0),nvl(T.NEW_4G_SJWC_LJ,0),nvl(T.NEW_4G_HB,0)," +
	"nvl(T.NEW_4G_WCL,0),nvl(T.NEW_4G_WCL_LJ,0),nvl(T.LJZB_4G_66,0),nvl(T.LJZB_4G_76,0),nvl(T.LJZB_4G_UP_106,0),nvl(T.ZH_4G_ZB,0),nvl(T.WK_SB,0)," +
	"nvl(T.WK_SB_LJ,0),nvl(T.WK_SJWC,0),nvl(T.WK_SJWC_LJ,0),nvl(T.WK_HB,0),nvl(T.WK_WCL,0)," +
	"nvl(T.WK_WCL_LJ,0),nvl(T.OTHER_SB,0),nvl(T.OTHER_SB_LJ,0)," +
	"nvl(T.OTHER_SJWC,0),nvl(T.OTHER_SJWC_LJ,0),nvl(T.OTHER_HB,0),nvl(T.OTHER_WCL,0)," +
	"nvl(T.OTHER_WCL_LJ,0),nvl(T.XLLK_SJWC,0),nvl(T.XLLK_SJWC_LJ,0) FROM PMRT.TB_MRT_YDKDFZTB_DAY T " +
	"WHERE T.DEAL_DATE = '"+date+"' " + fsql ;
	sql = sql + " ORDER BY t.group_id_1";
	
	var showtext="result";
	_loadExcel({
		startRow:4,
		startCol:0,
		cols:-1,
		excelModal:'ydkdfztb_day.xls',    
		sheetname:showtext,
		query:sql								
	},null,'下载数据');
}

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}
////////////////////////////////////////////////////////////////////////