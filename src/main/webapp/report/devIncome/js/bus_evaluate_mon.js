var nowData = [];
var field=["GROUP_ID_1_NAME","AREA_TYPE","BUS_HALL_NAME","HQ_CHAN_CODE","SR_LEVEL","SR_ACC","SR_ACC_SCORE","SR_NEW","SR_NEW_SCORE","SR_RATE","SR_RATE_SCORE","SR_P","SR_P_SCORE","DEV_NEW","DEV_NEW_SCORE","DEV_P","DEV_P_SCORE","ML_SR_ACC","ML_SR_ACC_SCORE","ML_SR_NEW","ML_SR_NEW_SCORE","AREA","ML_SR_A","ML_SR_A_SCORE","TOTAL_EVA","TOTAL_SCORE","T_RANK"];
var title=[["州市","区域 ","营业厅名称","渠道编码","收入分档","收入类（权重50%）","","","","","","","","发展类（权重30%）","","","","毛利（权重15%）","","","","其它(权重5%)","","","小计","","排名"],
           ["","","","","","总收入","得分(10%)","增量收入","得分(30%)","定比上年12月增长率","得分(5%)","人效（人均收入）","得分(5%)","新增","得分(20%)","厅效（人均发展）","得分(10%)","总毛利","得分(5%)","增量毛利","得分(10%)","厅面积","坪效","得分(5%)","评价","得分 ",""]];
var report = null;
var downSql="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BUS_LEVEL_EVALUATE"));
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

var pageSize = 17;
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

	var sql= getsql();
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
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
 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["账期","州市","区域 ","营业厅名称","渠道编码","收入分档","收入类（权重50%）","","","","","","","","发展类（权重30%）","","","","毛利（权重15%）","","","","其它(权重5%)","","","小计","","排名"],
	           ["","","","","","","总收入","得分(10%)","增量收入","得分(30%)","定比上年12月增长率","得分(5%)","人效（人均收入）","得分(5%)","新增","得分(20%)","厅效（人均发展）","得分(10%)","总毛利","得分(5%)","增量毛利","得分(10%)","厅面积","坪效","得分(5%)","评价","得分 ",""]];
	var dealDate=$("#dealDate").val();
	showtext = '自营厅分等分级评价表-'+dealDate;
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
function getsql(){
	var dealDate = $("#dealDate").val();
	var orgLevel = $("#orgLevel").val();
	var region =$("#region").val();
	var code =$("#code").val();
	var regionCode =$("#regionCode").val();
	var chnl_type =$("#chnl_type").val();
	var area_type =$("#area_type").val();
	var where=" WHERE DEAL_DATE='"+dealDate+"'";
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(chnl_type!=""){
		where+=" AND CHNL_TYPE='"+chnl_type+"'";
	}
	if(area_type!=""){
		where+=" AND AREA_TYPE='"+area_type+"'";
	}
	//权限
	if(orgLevel==1){
		where+=" AND GROUP_ID_0='"+code+"'";
	}else if(orgLevel==2||orgLevel==3){
		where+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		where+=" AND 1=2";
	}
		return "SELECT DEAL_DATE,GROUP_ID_1_NAME                         "+
		"      ,AREA_TYPE                                                "+
		"      ,BUS_HALL_NAME                                            "+
		"      ,HQ_CHAN_CODE                                             "+
		"      ,NVL(SR_LEVEL,0) SR_LEVEL                                 "+
		"      ,NVL(SR_ACC,0) SR_ACC                                     "+
		"      ,NVL(SR_ACC_SCORE,0) SR_ACC_SCORE                         "+
		"      ,NVL(SR_NEW,0) SR_NEW                                     "+
		"      ,NVL(SR_NEW_SCORE,0) SR_NEW_SCORE                         "+
		"      ,PODS.GET_RADIX_POINT(NVL(SR_RATE,0)*100 ||'%',2) SR_RATE "+
		"      ,NVL(SR_RATE_SCORE,0) SR_RATE_SCORE                       "+
		"      ,NVL(SR_P,0) SR_P                                         "+
		"      ,NVL(SR_P_SCORE,0) SR_P_SCORE                             "+
		"      ,NVL(DEV_NEW,0) DEV_NEW                                   "+
		"      ,NVL(DEV_NEW_SCORE,0) DEV_NEW_SCORE                       "+
		"      ,NVL(DEV_P,0) DEV_P                                       "+
		"      ,NVL(DEV_P_SCORE,0) DEV_P_SCORE                           "+
		"      ,NVL(ML_SR_ACC,0) ML_SR_ACC                               "+
		"      ,NVL(ML_SR_ACC_SCORE,0) ML_SR_ACC_SCORE                   "+
		"      ,NVL(ML_SR_NEW,0) ML_SR_NEW                               "+
		"      ,NVL(ML_SR_NEW_SCORE,0) ML_SR_NEW_SCORE                   "+
		"      ,NVL(AREA,0) AREA                                         "+
		"      ,NVL(ML_SR_A ,0) ML_SR_A                                  "+
		"      ,NVL(ML_SR_A_SCORE,0) ML_SR_A_SCORE                       "+
		"      ,NVL(TOTAL_SCORE,0) TOTAL_SCORE                           "+
		"      ,TOTAL_EVA                                                "+
		"      ,T_RANK                                                   "+
		"FROM PMRT.TB_MRT_BUS_LEVEL_EVALUATE                             "+
		where+
		" ORDER BY T_RANK";
}

 
