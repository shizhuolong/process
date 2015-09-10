var field=["GROUP_ID_1_NAME",
           "MODEL_NUM_01",
           "MODEL_ALL_01",
           "HYHJ_NUM_01",
           "HYHJ_ALL_01",
           "MODEL_NUM_02",
           "MODEL_ALL_02",
           "HYHJ_NUM_02",
           "HYHJ_ALL_02",
           "MODEL_NUM_03",
           "MODEL_ALL_03",
           "HYHJ_NUM_03",
           "HYHJ_ALL_03",
           "MODEL_NUM_04",
           "MODEL_ALL_04",
           "HYHJ_NUM_04",
           "HYHJ_ALL_04",
           "MODEL_NUM_05",
           "MODEL_ALL_05",
           "HYHJ_NUM_05",
           "HYHJ_ALL_05",
           "MODEL_NUM_DAY",
           "MODEL_NUM_MON",
           "HYHJ_NUM_DAY",
           "HYHJ_NUM_MON"]
$(function(){
	//initRegion();
	
	var orderBy='';	
	var report=new LchReport({
		title:[["州市","中兴红牛V5s","中兴红牛V5s","中兴红牛V5s","中兴红牛V5s","vivo Y613F","vivo Y613F","vivo Y613F","vivo Y613F","OPPO 1100","OPPO 1100","OPPO 1100","OPPO 1100","联想A606","联想A606","联想A606","联想A606","红米2","红米2","红米2","红米2","合计","合计","合计","合计"],
		       ["州市","订购量","订购量","合约惠机量","合约惠机量","订购量","订购量","合约惠机量","合约惠机量","订购量","订购量","合约惠机量","合约惠机量","订购量","订购量","合约惠机量","合约惠机量","订购量","订购量","合约惠机量","合约惠机量","订购量","订购量","合约惠机量","合约惠机量"],
		       ["州市","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计","当日","本月累计"]]

        ,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:[],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var date = $.trim($("#time").val());
			var fsql = '';//getSelect();
			var sql = "SELECT T.GROUP_ID_1_NAME,T.MODEL_NUM_01,T.MODEL_ALL_01,T.HYHJ_NUM_01,T.HYHJ_ALL_01,T.MODEL_NUM_02,T.MODEL_ALL_02," +
			"T.HYHJ_NUM_02,T.HYHJ_ALL_02,T.MODEL_NUM_03,T.MODEL_ALL_03,T.HYHJ_NUM_03,T.HYHJ_ALL_03,T.MODEL_NUM_04,T.MODEL_ALL_04," +
			"T.HYHJ_NUM_04,T.HYHJ_ALL_04," +
			"T.MODEL_NUM_05,T.MODEL_ALL_05,T.HYHJ_NUM_05,T.HYHJ_ALL_05," +
			"T.MODEL_NUM_DAY,T.MODEL_NUM_MON,T.HYHJ_NUM_DAY,T.HYHJ_NUM_MON FROM (SELECT T.DEAL_DATE,T.GROUP_ID_1," +
				"T.GROUP_ID_1_NAME,T.MODEL_NUM_01,T.MODEL_ALL_01,T.HYHJ_NUM_01,T.HYHJ_ALL_01,T.MODEL_NUM_02,T.MODEL_ALL_02," +
	            "T.HYHJ_NUM_02,T.HYHJ_ALL_02,T.MODEL_NUM_03,T.MODEL_ALL_03,T.HYHJ_NUM_03,T.HYHJ_ALL_03,T.MODEL_NUM_04," +
	            "T.MODEL_ALL_04,T.HYHJ_NUM_04,T.HYHJ_ALL_04,T.MODEL_NUM_05,T.MODEL_ALL_05,T.HYHJ_NUM_05,T.HYHJ_ALL_05," +
	            "T.MODEL_NUM_DAY,T.MODEL_NUM_MON,T.HYHJ_NUM_DAY,T.HYHJ_NUM_MON " +
			"FROM PMRT.TB_MRT_TERMINAL_DEV_NUM_DAY T WHERE T.DEAL_DATE = '"+date+"' UNION ALL SELECT T.DEAL_DATE,'86000' GROUP_ID_1," +
					"'全省' GROUP_ID_1_NAME,SUM(MODEL_NUM_01) MODEL_NUM_01,SUM(MODEL_ALL_01) MODEL_ALL_01,SUM(HYHJ_NUM_01) HYHJ_NUM_01," +
					"SUM(HYHJ_ALL_01) HYHJ_ALL_01,SUM(MODEL_NUM_02) MODEL_NUM_02,SUM(MODEL_ALL_02) MODEL_ALL_02,SUM(HYHJ_NUM_02) HYHJ_NUM_02," +
					"SUM(HYHJ_ALL_02) HYHJ_ALL_02,SUM(MODEL_NUM_03) MODEL_NUM_03,SUM(MODEL_ALL_03) MODEL_ALL_03,SUM(HYHJ_NUM_03) HYHJ_NUM_03," +
					"SUM(HYHJ_ALL_03) HYHJ_ALL_03,SUM(MODEL_NUM_04) MODEL_NUM_04,SUM(MODEL_ALL_04) MODEL_ALL_04,SUM(HYHJ_NUM_04) HYHJ_NUM_04," +
					"SUM(HYHJ_ALL_04) HYHJ_ALL_04," +
					"SUM(MODEL_NUM_05) MODEL_NUM_05,SUM(MODEL_ALL_05) MODEL_ALL_05,SUM(HYHJ_NUM_05) HYHJ_NUM_05," +
					"SUM(HYHJ_ALL_05) HYHJ_ALL_05," +
					"SUM(MODEL_NUM_DAY) MODEL_NUM_DAY,SUM(MODEL_NUM_MON) MODEL_NUM_MON,SUM(HYHJ_NUM_DAY) HYHJ_NUM_DAY," +
					"SUM(HYHJ_NUM_MON) HYHJ_NUM_MON  FROM PMRT.TB_MRT_TERMINAL_DEV_NUM_DAY T WHERE T.DEAL_DATE = '"+date+"' GROUP BY DEAL_DATE) T WHERE 1=1 " + fsql +
							" ORDER BY T.GROUP_ID_1";
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
	var sql = "SELECT T.GROUP_ID_1_NAME,T.MODEL_NUM_01,T.MODEL_ALL_01,T.HYHJ_NUM_01,T.HYHJ_ALL_01,T.MODEL_NUM_02,T.MODEL_ALL_02," +
	"T.HYHJ_NUM_02,T.HYHJ_ALL_02,T.MODEL_NUM_03,T.MODEL_ALL_03,T.HYHJ_NUM_03,T.HYHJ_ALL_03,T.MODEL_NUM_04,T.MODEL_ALL_04," +
	"T.HYHJ_NUM_04,T.HYHJ_ALL_04," +
	"T.MODEL_NUM_05,T.MODEL_ALL_05,T.HYHJ_NUM_05,T.HYHJ_ALL_05," +
	"T.MODEL_NUM_DAY,T.MODEL_NUM_MON,T.HYHJ_NUM_DAY,T.HYHJ_NUM_MON FROM (SELECT T.DEAL_DATE,T.GROUP_ID_1," +
			"T.GROUP_ID_1_NAME,T.MODEL_NUM_01,T.MODEL_ALL_01,T.HYHJ_NUM_01,T.HYHJ_ALL_01,T.MODEL_NUM_02,T.MODEL_ALL_02," +
            "T.HYHJ_NUM_02,T.HYHJ_ALL_02,T.MODEL_NUM_03,T.MODEL_ALL_03,T.HYHJ_NUM_03,T.HYHJ_ALL_03,T.MODEL_NUM_04," +
            "T.MODEL_ALL_04,T.HYHJ_NUM_04,T.HYHJ_ALL_04,T.MODEL_NUM_05,T.MODEL_ALL_05,T.HYHJ_NUM_05,T.HYHJ_ALL_05," +
            "T.MODEL_NUM_DAY,T.MODEL_NUM_MON,T.HYHJ_NUM_DAY,T.HYHJ_NUM_MON " +
	"FROM PMRT.TB_MRT_TERMINAL_DEV_NUM_DAY T WHERE T.DEAL_DATE = '"+date+"' UNION ALL SELECT T.DEAL_DATE,'86000' GROUP_ID_1," +
			"'全省' GROUP_ID_1_NAME,SUM(MODEL_NUM_01) MODEL_NUM_01,SUM(MODEL_ALL_01) MODEL_ALL_01,SUM(HYHJ_NUM_01) HYHJ_NUM_01," +
			"SUM(HYHJ_ALL_01) HYHJ_ALL_01,SUM(MODEL_NUM_02) MODEL_NUM_02,SUM(MODEL_ALL_02) MODEL_ALL_02,SUM(HYHJ_NUM_02) HYHJ_NUM_02," +
			"SUM(HYHJ_ALL_02) HYHJ_ALL_02,SUM(MODEL_NUM_03) MODEL_NUM_03,SUM(MODEL_ALL_03) MODEL_ALL_03,SUM(HYHJ_NUM_03) HYHJ_NUM_03," +
			"SUM(HYHJ_ALL_03) HYHJ_ALL_03,SUM(MODEL_NUM_04) MODEL_NUM_04,SUM(MODEL_ALL_04) MODEL_ALL_04,SUM(HYHJ_NUM_04) HYHJ_NUM_04," +
			"SUM(HYHJ_ALL_04) HYHJ_ALL_04," +
			"SUM(MODEL_NUM_05) MODEL_NUM_05,SUM(MODEL_ALL_05) MODEL_ALL_05,SUM(HYHJ_NUM_05) HYHJ_NUM_05," +
			"SUM(HYHJ_ALL_05) HYHJ_ALL_05," +
			"SUM(MODEL_NUM_DAY) MODEL_NUM_DAY,SUM(MODEL_NUM_MON) MODEL_NUM_MON,SUM(HYHJ_NUM_DAY) HYHJ_NUM_DAY," +
			"SUM(HYHJ_NUM_MON) HYHJ_NUM_MON  FROM PMRT.TB_MRT_TERMINAL_DEV_NUM_DAY T WHERE T.DEAL_DATE = '"+date+"' GROUP BY DEAL_DATE) T WHERE 1=1 " + fsql +
					" ORDER BY T.GROUP_ID_1";
	
	var showtext="result";
	_loadExcel({
		startRow:3,
		startCol:0,
		cols:-1,
		excelModal:'pmrt_terminal_dev_num_day.xls',    
		sheetname:showtext,
		query:sql								
	},null,'下载数据');
}

function _loadExcel(parameter,callback,excelName){
	$.Project.downExcelByTemplate2(parameter,callback,excelName,$('#contions'));
}
////////////////////////////////////////////////////////////////////////