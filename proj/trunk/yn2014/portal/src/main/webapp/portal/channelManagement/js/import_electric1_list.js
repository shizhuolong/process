var nowData = [];
var title=[["账期","地市名称","站址或局房编码","基站/覆盖名称","期初预提余额","本月预提","本月支付","期末预提余额","成本中心代码","本月预提标准","月末预提起日期","增值税","铁塔公司站点","铁塔公司交纳水电费","最近的水电支付单价","本月用量或预计用量"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","ROOM_ADDR","ROOM_NAME","BEGIN_MONEY","THIS_MON_PRE","THIS_MON_PAY","END_YT_MONEY","AC_PREFIX","THIS_MON_YT","END_MON_DATE","ZZ_FAX","OIL_COMPANY","WATER_FEE","PER_WATER_FEE","THIS_NUM"];
var report = null;

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
	var time=$("#time").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_ELECTRIC_CHARGE_MON1 WHERE DEAL_DATE='"+time+"'";
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

function importToResult(){
	var time=$("#time").val();
	if(totalCount){
		if(confirm("确认导入？")){
			$("#importToResultBtn").hide();
			$.ajax({
				type:"POST",
				dataType:'json',
				async:true,
				cache:false,
				url:$("#ctx").val()+"/electricMaintain/import-electric-maintain!importToResult.action",
				data:{
		           "time":time
			   	}, 
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库！");
			   		}else{
			   			alert("入库失败,请重试！");
			   			$("#importToResultBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入！");
		window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_electric1.jsp";
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_electric1.jsp";
 }
 