var field= ["GROUP_ID_1_NAME","DEVELOPER_NUM","DEVELOPER_MON_NUM","DEVELOPER_NUM_RATE","DEVELOPER_NUM_RN"
            ,"ZYDEVELOPER_NUM01","ZYDEVELOPER_MON_NUM01","ZYDEVELOPER_NUM_RATE01","ZYRN1","ZYDEVELOPER_NUM02"
            ,"ZYDEVELOPER_MON_NUM02","ZYDEVELOPER_NUM_RATE02","ZYRN2","ZYDEVELOPER_NUM03","ZYDEVELOPER_MON_NUM03",
            "ZYDEVELOPER_NUM_RATE03","ZYRN3","ZYDEVELOPER_NUM04","ZYDEVELOPER_MON_NUM04","ZYDEVELOPER_NUM_RATE04","ZYRN4"
            ,"ZYDEVELOPER_NUM05","ZYDEVELOPER_MON_NUM05","ZYDEVELOPER_NUM_RATE05","ZYRN5","ZYDEVELOPER_NUM06","ZYDEVELOPER_MON_NUM06"
            ,"ZYDEVELOPER_NUM_RATE06","ZYRN6","SHDEVELOPER_NUM01","SHDEVELOPER_MON_NUM01","SHDEVELOPER_NUM_RATE01","SHRN1"
            ,"SHDEVELOPER_NUM02","SHDEVELOPER_MON_NUM02","SHDEVELOPER_NUM_RATE02"
            ,"SHRN2","SHDEVELOPER_NUM03","SHDEVELOPER_MON_NUM03","SHDEVELOPER_NUM_RATE03","SHRN3","SHDEVELOPER_NUM04"
            ,"SHDEVELOPER_MON_NUM04","SHDEVELOPER_NUM_RATE04","SHRN4","SHDEVELOPER_NUM05","SHDEVELOPER_MON_NUM05"
            ,"SHDEVELOPER_NUM_RATE05","SHRN5"];
$(function(){
	//initRegion();netType
	
	var orderBy='';	
	var report=new LchReport({
		title:[["分公司","移动网","","","","自有渠道","","","","","","","","","","","","","","","","","","","","","","","","社会渠道","","","","","","","","","","","","","","","","","","",""],
		       ["","","","","","自有渠道合计","","","","其中：自建自营","","","","其中：自建他营","","","","其中：自有电子渠道","","","","其中：集客自有","","","","其中：自有其他","","","","社会渠道合计","","","","其中：电子渠道社会","","","","其中：集客社会","","","","其中：社会战略渠道","","","","其中：社会非战略渠道","","",""],
		       ["","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名","当日发展","当月累计发展","累计环比上月","排名"]]
        ,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:[],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			/*if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();*/
		},
		getSubRowsCallBack:function($tr){
			var date = $.trim($("#time").val());
			var fsql = '';//getSelect();
			var net_type = $("#netType").val();
			var sql = "SELECT T.GROUP_ID_1_NAME,T.DEVELOPER_NUM,T.DEVELOPER_MON_NUM," +
			"DECODE(T.DEVELOPER_NUM_RATE,'','0%',round(T.DEVELOPER_NUM_RATE*100,2)||'%') AS DEVELOPER_NUM_RATE,T.DEVELOPER_NUM_RN,T.ZYDEVELOPER_NUM01," +
			"T.ZYDEVELOPER_MON_NUM01,DECODE(T.ZYDEVELOPER_NUM_RATE01,'','0%',round(T.ZYDEVELOPER_NUM_RATE01*100,2)||'%') AS ZYDEVELOPER_NUM_RATE01," +
			"T.ZYRN1,T.ZYDEVELOPER_NUM02,T.ZYDEVELOPER_MON_NUM02," +
			"DECODE(T.ZYDEVELOPER_NUM_RATE02,'','0%',round(T.ZYDEVELOPER_NUM_RATE02*100,2)||'%') AS ZYDEVELOPER_NUM_RATE02,T.ZYRN2," +
			"T.ZYDEVELOPER_NUM03,T.ZYDEVELOPER_MON_NUM03," +
			"DECODE(T.ZYDEVELOPER_NUM_RATE03,'','0%',round(T.ZYDEVELOPER_NUM_RATE03*100,2)||'%') AS ZYDEVELOPER_NUM_RATE03, T.ZYRN3," +
			"T.ZYDEVELOPER_NUM04,T.ZYDEVELOPER_MON_NUM04," +
			"DECODE(T.ZYDEVELOPER_NUM_RATE04,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE04*100,2)||'%') AS ZYDEVELOPER_NUM_RATE04,T.ZYRN4," +
			"T.ZYDEVELOPER_NUM05,T.ZYDEVELOPER_MON_NUM05," +
			"DECODE(T.ZYDEVELOPER_NUM_RATE05,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE05*100,2)||'%') AS ZYDEVELOPER_NUM_RATE05,T.ZYRN5," +
			"T.ZYDEVELOPER_NUM06,T.ZYDEVELOPER_MON_NUM06," +
			"DECODE(T.ZYDEVELOPER_NUM_RATE06,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE06*100,2)||'%') AS ZYDEVELOPER_NUM_RATE06,T.ZYRN6," +
			"T.SHDEVELOPER_NUM01,T.SHDEVELOPER_MON_NUM01," +
			"DECODE(T.SHDEVELOPER_NUM_RATE01,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE01*100,2)||'%') AS SHDEVELOPER_NUM_RATE01,T.SHRN1," +
			"T.SHDEVELOPER_NUM02,T.SHDEVELOPER_MON_NUM02," +
			"DECODE(T.SHDEVELOPER_NUM_RATE02,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE02*100,2)||'%') AS SHDEVELOPER_NUM_RATE02,T.SHRN2," +
			"T.SHDEVELOPER_NUM03,T.SHDEVELOPER_MON_NUM03," +
			"DECODE(T.SHDEVELOPER_NUM_RATE03,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE03*100,2)||'%') AS SHDEVELOPER_NUM_RATE03,T.SHRN3," +
			"T.SHDEVELOPER_NUM04,T.SHDEVELOPER_MON_NUM04," +
			"DECODE(T.SHDEVELOPER_NUM_RATE04,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE04*100,2)||'%') AS SHDEVELOPER_NUM_RATE04,T.SHRN4," +
			"T.SHDEVELOPER_NUM05,T.SHDEVELOPER_MON_NUM05," +
			"DECODE(T.SHDEVELOPER_NUM_RATE05,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE05*100,2)||'%') AS SHDEVELOPER_NUM_RATE05,T.SHRN5 " +
			"FROM PMRT.TB_RPT_CHNNEL_DEVELOP_DAY T WHERE T.DEAL_DATE = '"+date+"' " + fsql;
			if(net_type == "") {
				sql += " AND T.NET_TYPE = '234' ORDER BY T.GROUP_ID_1";
			} else {
				sql += " AND T.NET_TYPE = '"+net_type+"' ORDER BY T.GROUP_ID_1";
			}
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
/*
function initRegion(){
	var d=query("select t.code,t.orgname  from portal.apdp_org t where t.orglevel=2");
	if(d&&d.length){
		var h='';
		for(var i=0;i<d.length;i++){
			h+='<option value="'+d[i].CODE+'" >'+d[i].ORGNAME+'</option>'
		}
	}
	$("#GROUP_ID_1").append(h);
	
}

function getSelect() {
	var where=$("#GROUP_ID_1").val();
	if($.trim(where).length>0){
		return " and T.group_id_1 ='"+where+"' ";
	}else{
		return "";
	}
}*/
/////////////////////////下载开始/////////////////////////////////////////////
//导出excel
function downsAll(){
	
	var date = $.trim($("#time").val());
	var fsql = '';//getSelect();
	var net_type = $("#netType").val();
	var sql = "SELECT T.GROUP_ID_1_NAME,T.DEVELOPER_NUM,T.DEVELOPER_MON_NUM," +
	"DECODE(T.DEVELOPER_NUM_RATE,'','0%',round(T.DEVELOPER_NUM_RATE*100,2)||'%') AS DEVELOPER_NUM_RATE,T.DEVELOPER_NUM_RN,T.ZYDEVELOPER_NUM01," +
	"T.ZYDEVELOPER_MON_NUM01,DECODE(T.ZYDEVELOPER_NUM_RATE01,'','0%',round(T.ZYDEVELOPER_NUM_RATE01*100,2)||'%') AS ZYDEVELOPER_NUM_RATE01," +
	"T.ZYRN1,T.ZYDEVELOPER_NUM02,T.ZYDEVELOPER_MON_NUM02," +
	"DECODE(T.ZYDEVELOPER_NUM_RATE02,'','0%',round(T.ZYDEVELOPER_NUM_RATE02*100,2)||'%') AS ZYDEVELOPER_NUM_RATE02,T.ZYRN2," +
	"T.ZYDEVELOPER_NUM03,T.ZYDEVELOPER_MON_NUM03," +
	"DECODE(T.ZYDEVELOPER_NUM_RATE03,'','0%',round(T.ZYDEVELOPER_NUM_RATE03*100,2)||'%') AS ZYDEVELOPER_NUM_RATE03, T.ZYRN3," +
	"T.ZYDEVELOPER_NUM04,T.ZYDEVELOPER_MON_NUM04," +
	"DECODE(T.ZYDEVELOPER_NUM_RATE04,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE04*100,2)||'%') AS ZYDEVELOPER_NUM_RATE04,T.ZYRN4," +
	"T.ZYDEVELOPER_NUM05,T.ZYDEVELOPER_MON_NUM05," +
	"DECODE(T.ZYDEVELOPER_NUM_RATE05,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE05*100,2)||'%') AS ZYDEVELOPER_NUM_RATE05,T.ZYRN5," +
	"T.ZYDEVELOPER_NUM06,T.ZYDEVELOPER_MON_NUM06," +
	"DECODE(T.ZYDEVELOPER_NUM_RATE06,'','0%',ROUND(T.ZYDEVELOPER_NUM_RATE06*100,2)||'%') AS ZYDEVELOPER_NUM_RATE06,T.ZYRN6," +
	"T.SHDEVELOPER_NUM01,T.SHDEVELOPER_MON_NUM01," +
	"DECODE(T.SHDEVELOPER_NUM_RATE01,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE01*100,2)||'%') AS SHDEVELOPER_NUM_RATE01,T.SHRN1," +
	"T.SHDEVELOPER_NUM02,T.SHDEVELOPER_MON_NUM02," +
	"DECODE(T.SHDEVELOPER_NUM_RATE02,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE02*100,2)||'%') AS SHDEVELOPER_NUM_RATE02,T.SHRN2," +
	"T.SHDEVELOPER_NUM03,T.SHDEVELOPER_MON_NUM03," +
	"DECODE(T.SHDEVELOPER_NUM_RATE03,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE03*100,2)||'%') AS SHDEVELOPER_NUM_RATE03,T.SHRN3," +
	"T.SHDEVELOPER_NUM04,T.SHDEVELOPER_MON_NUM04," +
	"DECODE(T.SHDEVELOPER_NUM_RATE04,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE04*100,2)||'%') AS SHDEVELOPER_NUM_RATE04,T.SHRN4," +
	"T.SHDEVELOPER_NUM05,T.SHDEVELOPER_MON_NUM05," +
	"DECODE(T.SHDEVELOPER_NUM_RATE05,'','0%',ROUND(T.SHDEVELOPER_NUM_RATE05*100,2)||'%') AS SHDEVELOPER_NUM_RATE05,T.SHRN5 " +
	"FROM PMRT.TB_RPT_CHNNEL_DEVELOP_DAY T WHERE T.DEAL_DATE = '"+date+"' " + fsql;
	if(net_type == "") {
		sql += " AND T.NET_TYPE = '234' ORDER BY T.GROUP_ID_1";
	} else {
		sql += " AND T.NET_TYPE = '"+net_type+"' ORDER BY T.GROUP_ID_1";
	}
	
	var showtext="result";
	_loadExcel({
		startRow:3,
		startCol:0,
		cols:-1,
		excelModal:'pmrt_chnnel_develop_day.xls',    
		sheetname:showtext,
		query:sql								
	},null,'下载数据');
}

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}
////////////////////////////////////////////////////////////////////////