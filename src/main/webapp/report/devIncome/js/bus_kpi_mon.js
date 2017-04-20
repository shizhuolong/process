var nowData = [];
var title=[["账期","地市","渠道编码","自有厅名称","厅性质","省份指标60%","","","","","","","","","","","","","","","","","","","","","","","地市指标40%","总得分"],
           ["","","","","","1、收入完成评价（35分）","","","","2.毛利完成评价（20分）","","","","3.业务销量完成评价（15分）","","","","4.保有率（10分）","","","","5.终端销量完成评价（10分）","","","","6.服务质量（10分）","7.管控指标(正负5)","省份打折得分","地市自设得分",""],
           ["","","","","","截至当前月累计收入目标(元)","截止当前月累计完成（元）","完成率","KPI得分","截至当前月累计毛利目标（元）","截止当前月累计完成（元）","完成率","KPI得分","截至当前月累计销量目标(户)","截止月当前月累计完成（户）","完成率","KPI得分","当月保有率目标","当月完成","完成率","KPI得分","截至当前月累计销量目标(户)","截止当前月累计完成（台）","完成率","KPI得分","","","","",""]];

var field=["DEAL_DATE","GROUP_ID_1_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","CHNL_TYPE","TASK_INCOME","REAL_INCOME","INCOME_RATIO","INCOME_SOCRE","TASK_GROSS","REAL_GROSS","GROSS_RATIO","GROSS_SOCRE","TASK_DEV","REAL_DEV","DEV_RATIO","DEV_SCORE","TASK_RETEN","REAL_RETEN","TETEN_RATIO","TETEN_SOCRE","TASK_TERMINAL","REAL_TERMINAL","TERMINAL_RTAIO","TERMINAL_SOCRE","SERVICE_SCORE","CONTROL_TARGET","PRO_SOCRE","KPI_SCORE","ALL_SOCRE"];
var orderBy = " ORDER BY GROUP_ID_1,HQ_CHAN_CODE";
var report = null;
var downSql="";
$(function() {
	$("#time").val(getMaxDate("PMRT.VIEW_MRT_BUS_KPI_MON"));
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
	var chnlType=$("#chnlType").val();
	var hq_chan_code=$.trim($("#hq_chan_code").val());
	var region=$("#region").val();
//条件
	var sql = " SELECT "+field.join(",")+" FROM PMRT.VIEW_MRT_BUS_KPI_MON WHERE 1=1";
	if(time!=''){
		sql+=" AND DEAL_DATE="+time;
	}
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	
	if(chnlType!=""){
		sql += " AND CHNL_TYPE ='"+chnlType+"' ";
	}
	if(hq_chan_code!=""){
		sql += " AND HQ_CHAN_CODE LIKE '%"+hq_chan_code+"%' ";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1="+region;
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
	var time=$("#time").val(); 
	var showtext = '自营厅考核-'+time;
	downloadExcel(downSql,title,showtext);
}
