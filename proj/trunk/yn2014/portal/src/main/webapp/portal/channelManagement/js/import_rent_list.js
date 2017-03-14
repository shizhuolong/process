var nowData = [];
var title=[["账期","地市名称","是否入库","基站名称","合同编号","合同名称","主合同编号","预提类型","期初余额","本月预提","","本月支付","","","期末余额","成本中心代码","局站编号","铁塔公司站点(是/否)","铁塔公司交纳房租物业费(是/否)"],
           ["","","","","","","","","","本月预提","月预提标准","付费金额","价款","税款","","","","",""]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","IS_IN_UNIT","CELL_NAME","CONTRACT_NO","CONTRACT_NAME","MAIN_CONTRACT_NO","YT_TYPE","BEGIN_FEE","THIS_MON_YT","THIS_MON_YT_STA","PAY_FEE","PRICE","FAX","END_FEE","ACPEFIX","CELL_ID","IS_COM","IS_WY_FEE"];
var report = null;
var downSql="";

$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel!=1){
		$("#reppeatBtn").remove();
	}
	report = new LchReport({
		title : title,
		field : field,
		css:[
		      {array:[2],css:LchReport.NORMAL_STYLE}
		    ],
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
	var code=$("#code").val();
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_RENT_ALL_MON WHERE DEAL_DATE='"+time+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		if(regionCode!=""){
			sql+=" AND GROUP_ID_1='"+regionCode+"'";
		}
	}else{
		sql+=" AND GROUP_ID_1='"+code+"'";
	}
	var is_in_unit=$("#is_in_unit").val();
	if(is_in_unit!=""){
		sql+=" AND IS_IN_UNIT='"+is_in_unit+"'";
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
				url:$("#ctx").val()+"/rent/import-rent!importToResult.action",
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
		window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_rent.jsp";
	}
  }

 function repeatImport(){
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_rent.jsp";
 }
 
 function exportData(){
	var time=$("#time").val();
	var showtext = '房租汇总-'+time;
	downloadExcel(downSql,title,showtext);
 }
 