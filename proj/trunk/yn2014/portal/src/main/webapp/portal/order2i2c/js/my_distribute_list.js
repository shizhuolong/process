var nowData = [];
var title=[["地市","任务编号","任务名称","订单数量","分配方式","分配人"]];
var field=["GROUP_ID_1_NAME","WORK_NO","WORK_NAME","WORK_ORDER_NUM","ASS_WAY","OPERATOR"];
var report = null;
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
$(function() {
	report = new LchReport({
		title : title,
		field : field,
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
	
	var userId=$("#userId").val();
	var status=$("#status").val();
	var taskNo=$("#taskNo").val();
	
	var sql="";
	sql+="   select                                                                                                                   ";
	sql+="       t.work_no,                                                                                                           ";
	sql+="       t.work_name,                                                                                                         ";
	sql+="       case t.ass_way when '1' then '内部团队'||t.inner_num||'%'                                                              ";
	sql+="         else '内部团队订单绝对值量'||t.inner_num end ASS_WAY,                                                                  ";
	sql+="       t.group_id_1_name,                                                                                                   ";
	sql+="       t.operator,                                                                                                          ";
	sql+="       (SELECT COUNT(T1.ORDER_NO) FROM  PODS.TAB_ODS_2I2C_ASS_TASK_DETAIL T1 WHERE T1.WORK_NO=T.WORK_NO) WORK_ORDER_NUM     ";
	sql+="   from                                                                                                                     ";
	sql+="   PODS.TAB_ODS_2I2C_ASS_TASK t                                                                                             ";
	sql+="   where t.operator='"+userId+"'                                                                                            ";
	if(taskNo!=''){
		sql+=" and t.work_no ='"+taskNo+"'  ";
	}
	sql+="   order by  t.insert_time desc                                                                                             ";
	
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
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
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
		
		var text=$(this).find("TD:eq(2)").text();
		$(this).find("TD:eq(2)").html("<a href='javascript:void(0);'>"+text+"</a>");
	});
	/////////////////////////////////////////////////////
	$("#lch_DataBody").find("TR").click(function(){
		var workNo=$(this).find("TD:eq(1)").text();
		var url=$("#ctx").val()+"/portal/order2i2c/jsp/distribute_view.jsp?workNo="+workNo;
		art.dialog.open(url,{
			title:'分配详情',
			width:'80%',
			height:450
		});
	});
}