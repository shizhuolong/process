var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1","REGION_NAME_ABBR","QY_YX_DAY","QY_DEV_DAY","QY_DEV_NUM","XY_YX_DAY","XY_DEV_DAY","XY_DEV_NUM","LC_YX_DAY","LC_DEV_DAY","LC_DEV_NUM","QC_ALL_QD","QC_YX_DAY","QC_DEV_DAY","QC_DEV_NUM","DEV_DAY","DEV_NUM"];
var title=[["账期","地市编码","地市","全员有效能数","全员当天发展量","全员累计发展量","校园先锋有效能数","校园先锋当天发展量","校园先锋累计发展量","临促专员有效能数","临促专员当天发展量","临促专员累计发展量","轻触渠道数","轻触点有效能数","轻触点当天发展量","轻触点累计发展量","日累计","月累计"]];
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
});

var pageSize = 20;
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	
	//权限
	var where = " WHERE DEAL_DATE="+dealDate;
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2";
	}
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ="+regionCode;
	}
	var sql=getSql();
	sql+=where;
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(){
	var sql="SELECT 	"+
	"DEAL_DATE  	                     "+
	",GROUP_ID_1 		                 "+
	",REGION_NAME_ABBR 		             "+
	",QY_YX_DAY 		                 "+
	",QY_DEV_DAY 		                 "+
	",QY_DEV_NUM 		                 "+
	",XY_YX_DAY 		                 "+
	",XY_DEV_DAY 	                     "+
	",XY_DEV_NUM 		                 "+
	",LC_YX_DAY 		                 "+
	",LC_DEV_DAY 	                     "+
	",LC_DEV_NUM  		                 "+
	",QC_ALL_QD 		                 "+
	",QC_YX_DAY  	                     "+
	",QC_DEV_DAY 		                 "+
	",QC_DEV_NUM  		                 "+
	",DEV_DAY 		                     "+
	",DEV_NUM                            "+
	"FROM PMRT.TAB_MRT_DT_QCD_REPORT_DAY ";			
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "云南联通2I2C地推情况";
	var title=[["账期","地市编码","地市","全员有效能数","全员当天发展量","全员累计发展量","校园先锋有效能数","校园先锋当天发展量","校园先锋累计发展量","临促专员有效能数","临促专员当天发展量","临促专员累计发展量","轻触渠道数","轻触点有效能数","轻触点当天发展量","轻触点累计发展量","日累计","月累计"]];
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function showDesc(){
	var url = $("#ctx").val()+"/report/reportNew/jsp/yn_2i2c_local_extension_explain.jsp";
	art.dialog.open(url,{
		id:'bindDescDialog',
		width:'600px',
		height:'200px',
		lock:true,
		resize:false
	});
}