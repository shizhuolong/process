var nowData = [];
var title=[["账期","模式(模式一为1，模式三为3)","渠道编码","当日销量"]];
var field=["DEAL_DATE","MODEL_TYPE","HQ_CHAN_CODE","SALE_NUM"];
var report = null;
var downSql="";
$(function() {
	/*var now=new Date();
	var hh = now.getHours(); //截取小时 
	var mm = now.getMinutes(); //截取分钟
	if(hh==10){
		if(mm>30){
			$("#reppeatBtn").remove();
		}
	}else if(hh>10){
		$("#reppeatBtn").remove();
	}*/
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
	var time=$("#time").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TB_MRT_BUS_DEVICE_SALE_TEMP2 WHERE DEAL_DATE='"+time+"'";
	var modelType=$("#modelType").val();
	var hqChanCode=$("#hqChanCode").val();
	if(modelType!=""){
		sql+=" AND MODEL_TYPE='"+modelType+"'";
	}
	if(hqChanCode!=""){
		sql+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
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

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_deviceSale_new.jsp";
 }
  
 function downsAll(){
	var time=$("#time").val();
	var showtext = '终端日销量-'+time;
	downloadExcel(downSql,title,showtext);
 }