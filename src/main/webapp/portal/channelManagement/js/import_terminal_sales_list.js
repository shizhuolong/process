var nowData = [];
var title=[["统计日期","省份","地市","区县","部门","渠道编码","操作员工号","操作员姓名","发展人姓名","发展人归属部门","渠道类型","连锁级别","顶级代理商","代理商编码","订单号","终端机型编码","业务类型","营销活动类型","订单类型","受理时间","竣工时间","主产品套餐名称","活动名称","终端串号","终端类型","终端品牌","终端型号","终端机型","铺货标志","国代商编码","国代商名称","用户号码"]];
var field=["DEAL_DATE","PROVINCE","REGION","AREA","DEPARTMENT","QD_CODE","OPERATE_ACCOUNT","OPERATE_NAME","DEVELOP_NAME","DEVELOP_DEPARTMENT","QD_TYPE","LS_LEVEL","TOP_AGENT","AGENT_CODE","WORK_NO","TERMINAL_CODE","BUS_TYPE","ACTIVITY_TYPE","WORK_TYPE","OPERATE_TIME","COMPLETE_TIME","PRODUCT_NAME","ACTIVITY_NAME","TERMINAL_NUMBER","TERMINAL_TYPE","TERMINAL_BRAND","TERMINAL_VERSION","TERMINAL_JX","PH_FLAG","GDS_CODE","GDS_NAME","USER_PHONE"];
var report = null;
var totalCount=0;

$(function() {
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
	var username=$("#username").val();
	var sql="SELECT * FROM PMRT.TB_TERMINAL_SALES_DAY_TEMP WHERE IN_USER_NAME='"+username+"'";
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	if(cdata && cdata.length) {
		totalCount = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(totalCount);
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
	if(totalCount>0){
		if(confirm("确认导入？")){
			$("#confirmBtn").hide();
			$.ajax({
				type:"POST",
				dataType:'json',
				async:true,
				cache:false,
				url:$("#ctx").val()+"/channelManagement/terminalSales_importToResult.action",
			   	success:function(data){
			   		if(data&&data.ok){
			   			alert("已经成功入库!");
			   		}else{
			   			alert("入库失败,请重试!");
			   			$("#confirmBtn").show();
			   		}
			    }
			});
		}
	}else{
		alert("没有要入库的数据,请先导入!");
	}
  }
 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_terminal_sales.jsp";
 }