var nowData = [];
var title=[["用户编码","服务号码","项目调节系数","项目编号","备注","生效账期","失效账期","创建人"]];
var field=["SUBSCRIPTION_ID","DEVICE_NUMBER","RATIO","ITEMCODE","ITEMDESC","ACTIVE_TIME","INACTIVE_TIME","CREATOR"];
var report = null;
var downSql="";
var total;
var UPDATE_ROLE = "ROLE_MANAGER_PERFORMANCEAPPRAISAL_KHJL_ZZXMENU_UPDATEPART";
$(function() {
	if(!isGrantedNew(UPDATE_ROLE)){
		$("#importBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
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
	var active_time=$("#time").val();
	var device_number=$.trim($("#device_number").val());
	sql="SELECT "+field.join(",")+" FROM PTEMP.TB_TMP_GWZZJZ_RATIO WHERE ACTIVE_TIME='"+active_time+"'";
	if(device_number){
		sql+=" AND DEVICE_NUMBER LIKE '%"+device_number+"%'";
	}
	var cdata = query("select count(*) total from (" + sql+")");
	sql+=" ORDER BY SUBSCRIPTION_ID";
	downSql=sql;
	total = 0;
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
	});
}
function downsAll() {
	var showtext = '专租线项目系数配置';
	downloadExcel(downSql,title,showtext);
}

 function importBtn(){
	 window.location.href=paths+"/report/devIncome/jsp/zzx_ratio.jsp";
 }