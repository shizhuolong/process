var title="";
var field="";
var startDate="";
var endDate="";
$(function(){
	$("#searchBtn").click(function(){
		startDate=$("#startDate").val();
		endDate=$("#endDate").val();
		$("#exportPageBtn").parent().remove();
		if(startDate==endDate){
			title=[["分公司","厅数","发展","","","","","","","","收入","","","","","","","","终端（模式一+模式三）","","","","","","","",""],
			       ["","","日发展","","月累计","","单厅","","累计环比","","日收入","","月累计","","单厅","","累计环比","","模式一","","","模式三","","","小计","",""],
			       ["","","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","日发展","月累计","单厅","日发展","月累计","单厅","日发展","月累计","单厅"]];
			field=["GROUP_ID_1_NAME","BUS_COUNT","THIS_YW_DAY_DEV","THIS_NET_DAY_DEV","THIS_YW_MON_DEV","THIS_NET_MON_DEV","DT_YW_DEV","DT_NET_DEV","LJ_YW_DEV_RATE","LJ_NET_DEV_RATE","THIS_YW_DAY_SR","THIS_NET_DAY_SR","THIS_YW_MON_SR","THIS_NET_MON_SR","DT_YW_SR","DT_NET_SR","LJ_YW_SR_RATE","LJ_NET_SR_RATE","TYPE1_DEV_DAY","TYPE1_DEV_MON","TYPE1_DEV","TYPE3_DEV_DAY","TYPE3_DEV_MON","TYPE3_DEV","TYPE_ALL_DAY","TYPE_ALL_MON","TYPE_ALL"];
		}else{
			title=[["分公司","厅数","发展","","","","","","收入","","","","","","终端（模式一+模式三）","","","","",""],
			       ["","","月累计","","单厅","","累计环比","","月累计","","单厅","","累计环比","","模式一","","模式三","","小计",""],
			       ["","","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","移动网","固网","月累计","单厅","月累计","单厅","月累计","单厅"]];
			field=["GROUP_ID_1_NAME","BUS_COUNT","THIS_YW_MON_DEV","THIS_NET_MON_DEV","DT_YW_DEV","DT_NET_DEV","LJ_YW_DEV_RATE","LJ_NET_DEV_RATE","THIS_YW_MON_SR","THIS_NET_MON_SR","DT_YW_SR","DT_NET_SR","LJ_YW_SR_RATE","LJ_NET_SR_RATE","TYPE1_DEV_MON","TYPE1_DEV","TYPE3_DEV_MON","TYPE3_DEV","TYPE_ALL_MON","TYPE_ALL"];
		}
		report = new LchReport({
			title : title,
			field : field,
			css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
			rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
			content : "lchcontent",
			orderCallBack : function(index, type) {
				orderBy = " order by " + field[index] + " " + type + " ";
				search(0);
			},
			getSubRowsCallBack : function($tr) {
				return {
					data : nowData,
					extra : {}
				};
			}
		});
		search(0);
	});
	
	
	$("#searchBtn").trigger("click");
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
	
	var chnlType=$("#chnlType").val();
	var operateType=$("#operateType").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#region").val();
	var sql ="";
	var groupBy = " GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))";
	if(startDate==endDate){
		sql=getSameDateSql();
	}else{
		sql=getDifferentDateSql();
	}
	
	//条件
	if(""!=chnlType){
		sql+=" AND CHNL_TYPE  ='"+chnlType+"' ";
	}
	if(""!=operateType){
		sql+=" AND OPERATE_TYPE  ='"+operateType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	
	sql+=groupBy;
	
	var d = query(sql);
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

function getSameDateSql() {
    return "SELECT                                                                                          "+
	"      NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                       "+
	"      ,COUNT(HQ_CHAN_CODE) BUS_COUNT                                                                   "+
	"      ,NVL(SUM(THIS_YW_DEV),0) THIS_YW_DAY_DEV                                                         "+
	"      ,NVL(SUM(THIS_NET_DEV),0) THIS_NET_DAY_DEV                                                       "+
	"      ,NVL(SUM(THIS_YW_DEV1),0) THIS_YW_MON_DEV                                                        "+
	"      ,NVL(SUM(THIS_NET_DEV1),0) THIS_NET_MON_DEV                                                      "+
	
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                           "+
	"                                               ROUND(NVL(SUM(THIS_YW_DEV1),0)/COUNT(HQ_CHAN_CODE),0)   "+
	"                                         ELSE 0 END DT_YW_DEV                                          "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                           "+
	"                                               ROUND(NVL(SUM(THIS_NET_DEV1),0)/COUNT(HQ_CHAN_CODE),0)  "+
	"                                         ELSE 0 END DT_NET_DEV                                         "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_DEV1),0)<>0                                      "+
	"            THEN (NVL(SUM(THIS_YW_DEV1),0)-NVL(SUM(LAST_YW_DEV1),0))*100/NVL(SUM(LAST_YW_DEV1),0)      "+
	"            ELSE 0                                                                                     "+
	"            END  || '%',2) LJ_YW_DEV_RATE                                                              "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_DEV1),0)<>0                                     "+
	"            THEN (NVL(SUM(THIS_NET_DEV1),0)-NVL(SUM(LAST_NET_DEV1),0))*100/NVL(SUM(LAST_NET_DEV1),0)   "+ 
	"            ELSE 0                                                                                     "+
	"            END  || '%',2) LJ_NET_DEV_RATE                                                             "+
	"      ,NVL(SUM(THIS_YW_SR),0) THIS_YW_DAY_SR                                                           "+
	"      ,NVL(SUM(THIS_NET_SR),0) THIS_NET_DAY_SR                                                         "+
	"      ,NVL(SUM(THIS_YW_SR1),0) THIS_YW_MON_SR                                                          "+
	"      ,NVL(SUM(THIS_NET_SR1),0) THIS_NET_MON_SR                                                        "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                           "+
	"                                               ROUND(NVL(SUM(THIS_YW_SR1),0)/COUNT(HQ_CHAN_CODE),3)    "+
	"                                         ELSE 0 END DT_YW_SR                                           "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                           "+
	"                                               ROUND(NVL(SUM(THIS_NET_SR1),0)/COUNT(HQ_CHAN_CODE),3)   "+
	"                                         ELSE 0 END DT_NET_SR                                          "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_SR1),0)<>0                                       "+
	"            THEN (NVL(SUM(THIS_YW_SR1),0)-NVL(SUM(LAST_YW_SR1),0))*100/NVL(SUM(LAST_YW_SR1),0)         "+
	"            ELSE 0                                                                                     "+
	"            END  || '%',2) LJ_YW_SR_RATE                                                               "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_SR1),0)<>0                                      "+
	"            THEN (NVL(SUM(THIS_NET_SR1),0)-NVL(SUM(LAST_NET_SR1),0))*100/NVL(SUM(LAST_NET_SR1),0)      "+
	"            ELSE 0                                                                                     "+
	"            END  || '%',2) LJ_NET_SR_RATE                                                              "+
	"       ,NVL(SUM(TYPE1_DEV),0) TYPE1_DEV_DAY                                                            "+
	"       ,NVL(SUM(TYPE1_DEV1),0) TYPE1_DEV_MON                                                           "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                          "+
	"                                               ROUND(NVL(SUM(TYPE1_DEV1),0)/COUNT(HQ_CHAN_CODE),0)     "+
	"                                         ELSE 0 END TYPE1_DEV                                          "+
	"       ,NVL(SUM(TYPE3_DEV),0) TYPE3_DEV_DAY                                                            "+
	"       ,NVL(SUM(TYPE3_DEV1),0) TYPE3_DEV_MON                                                           "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                          "+
	"                                               ROUND(NVL(SUM(TYPE3_DEV1),0)/COUNT(HQ_CHAN_CODE),0)     "+
	"                                         ELSE 0 END TYPE3_DEV                                          "+
	"       ,NVL(SUM(TYPE_ALL),0) TYPE_ALL_DAY                                                              "+
	"       ,NVL(SUM(TYPE_ALL1),0) TYPE_ALL_MON                                                             "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                          "+
	"                                               ROUND(NVL(SUM(TYPE_ALL1),0)/COUNT(HQ_CHAN_CODE),0)      "+
	"                                         ELSE 0 END TYPE_ALL                                           "+                                         
	"FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE='"+startDate+"'                                  ";
	return s;
}

function getDifferentDateSql() {
    return "SELECT                                                                                        "+
	"      NVL(GROUP_ID_1_NAME,'合计') GROUP_ID_1_NAME                                                     "+
	"      ,COUNT(HQ_CHAN_CODE) BUS_COUNT                                                                 "+
	"      ,NVL(SUM(THIS_YW_DEV),0) THIS_YW_MON_DEV                                                       "+
	"      ,NVL(SUM(THIS_NET_DEV),0) THIS_NET_MON_DEV                                                     "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                         "+
	"                                               ROUND(NVL(SUM(THIS_YW_DEV),0)/COUNT(HQ_CHAN_CODE),0)  "+
	"                                         ELSE 0 END DT_YW_DEV                                        "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                         "+
	"                                               ROUND(NVL(SUM(THIS_NET_DEV),0)/COUNT(HQ_CHAN_CODE),0) "+
	"                                         ELSE 0 END DT_NET_DEV                                       "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_DEV),0)<>0                                     "+
	"            THEN (NVL(SUM(THIS_YW_DEV),0)-NVL(SUM(LAST_YW_DEV),0))*100/NVL(SUM(LAST_YW_DEV),0)       "+
	"            ELSE 0                                                                                   "+
	"            END  || '%',2) LJ_YW_DEV_RATE                                                            "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_DEV),0)<>0                                    "+
	"            THEN (NVL(SUM(THIS_NET_DEV),0)-NVL(SUM(LAST_NET_DEV),0))*100/NVL(SUM(LAST_NET_DEV),0)    "+
	"            ELSE 0                                                                                   "+
	"            END  || '%',2) LJ_NET_DEV_RATE                                                           "+
	"      ,NVL(SUM(THIS_YW_SR),0) THIS_YW_MON_SR                                                         "+
	"      ,NVL(SUM(THIS_NET_SR),0) THIS_NET_MON_SR                                                       "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                         "+
	"                                               ROUND(NVL(SUM(THIS_YW_SR),0)/COUNT(HQ_CHAN_CODE),3)   "+
	"                                         ELSE 0 END DT_YW_SR                                         "+
	"      ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                         "+
	"                                               ROUND(NVL(SUM(THIS_NET_SR),0)/COUNT(HQ_CHAN_CODE),3)  "+
	"                                         ELSE 0 END DT_NET_SR                                        "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_YW_SR),0)<>0                                      "+
	"            THEN (NVL(SUM(THIS_YW_SR1),0)-NVL(SUM(LAST_YW_SR),0))*100/NVL(SUM(LAST_YW_SR),0)         "+
	"            ELSE 0                                                                                   "+
	"            END  || '%',2) LJ_YW_SR_RATE                                                             "+
	"      ,PODS.GET_RADIX_POINT(CASE WHEN NVL(SUM(LAST_NET_SR),0)<>0                                     "+
	"            THEN (NVL(SUM(THIS_NET_SR1),0)-NVL(SUM(LAST_NET_SR),0))*100/NVL(SUM(LAST_NET_SR),0)      "+
	"            ELSE 0                                                                                   "+
	"            END  || '%',2) LJ_NET_SR_RATE                                                            "+
	"       ,NVL(SUM(TYPE1_DEV),0) TYPE1_DEV_MON                                                          "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                        "+
	"                                               ROUND(NVL(SUM(TYPE1_DEV),0)/COUNT(HQ_CHAN_CODE),0)    "+
	"                                         ELSE 0 END TYPE1_DEV                                        "+
	"       ,NVL(SUM(TYPE3_DEV),0) TYPE3_DEV_MON                                                          "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                        "+
	"                                               ROUND(NVL(SUM(TYPE3_DEV),0)/COUNT(HQ_CHAN_CODE),0)    "+
	"                                         ELSE 0 END TYPE3_DEV                                        "+ 
	"       ,NVL(SUM(TYPE_ALL),0) TYPE_ALL_MON                                                            "+
	"       ,CASE WHEN COUNT(HQ_CHAN_CODE)<>0 THEN                                                        "+
	"                                               ROUND(NVL(SUM(TYPE_ALL),0)/COUNT(HQ_CHAN_CODE),0)     "+
	"                                         ELSE 0 END TYPE_ALL                                         "+                                           
	"FROM PMRT.TB_MRT_BUS_ZY_REPORT_DETAIL WHERE DEAL_DATE BETWEEN  '"+startDate+"' AND '"+endDate+"'     ";
	return s;
}

function downsAll() {
	var chnlType=$("#chnlType").val();
	var operateType=$("#operateType").val();
	var orgLevel = $("#orgLevel").val();
	var region = $("#region").val();
	var sql ="";
	var groupBy = " GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1_NAME))";
	if(startDate==endDate){
		sql=getSameDateSql();
	}else{
		sql=getDifferentDateSql();
	}
	
	//条件
	if(""!=chnlType){
		sql+=" AND CHNL_TYPE  ='"+chnlType+"' ";
	}
	if(""!=operateType){
		sql+=" AND OPERATE_TYPE  ='"+operateType+"' ";
	}
	//权限
	if(orgLevel==1){
		
	}else if(orgLevel==2||orgLevel==3){
		sql+=" AND GROUP_ID_1 ='"+region+"' ";
	}else{
		sql+=" AND 1=2 ";
	}
	
	sql+=groupBy;
	var showtext ='自有营业厅数据日通报('+startDate+"-"+endDate+")";
	downloadExcel(sql,title,showtext);
}
