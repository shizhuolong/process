var nowData = [];
var title=[["账期","分公司","2G主营业务收入（指标序号：C1）","","","","","","3G主营业务收入（指标序号：C2）","","","","","","4G主营业务收入（指标序号：C3）","","","","","","固网主营业务收入不含ICT、IDC云计算、专租线（指标序号：C4）","","","","","","专租线主营业务收入（不含ICT）宽带主营业务收入（指标序号：C5）","","","","","","移动网主营业务收入（指标序号：C6）","","","","","","固网主营业务收入（指标序号：C7）","","","","","","总体主营业务收入(指标序号：C8) C6+C7","","","","","","ICT","计列在省本部的IDC和云计算","4G出账收入中后向流量出账收入","","","","",""], 
           ["","","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计","","","自营厅","集客渠道","电子渠道","社会实体渠道","其中：外包柜台","合计"]];

var field=["DEAL_DATE","GROUP_ID_1_NAME","ZY_2G_NUM","JK_2G_NUM","DZ_2G_NUM","SH_2G_NUM","GT_2G_NUM","ALL_2G_NUM","ZY_3G_NUM","JK_3G_NUM","DZ_3G_NUM","SH_3G_NUM","GT_3G_NUM","ALL_3G_NUM","ZY_4G_NUM","JK_4G_NUM","DZ_4G_NUM","SH_4G_NUM","GT_4G_NUM","ALL_4G_NUM","ZY_NET_NUM","JK_NET_NUM","DZ_NET_NUM","SH_NET_NUM","GT_NET_NUM","ALL_NET_NUM","ZY_ZZX_NUM","JK_ZZX_NUM","DZ_ZZX_NUM","SH_ZXX_NUM","GT_ZXX_NUM","ALL_ZXX_NUM","ZY_MOB_NUM","JK_MOB_NUM","DZ_MOB_NUM","SH_MOB_NUM","GT_MOB_NUM","ALL_MOB_NUM","ZY_GW_NUM","JK_GW_NUM","DZ_GW_NUM","SH_GW_NUM","GT_GW_NUM","ALL_GW_NUM","ZY_ALL","JK_ALL","DZ_ALL","SH_ALL","GT_ALL","ALL_NUM","INCOME_ICT_NUM","INCOME_IDT_NUM","ZY_HX","JK_HX","DZ_HX","SH_HX","GT_HX","ALL_HX"];
var report = null;
var downSql="";

$(function() {
	var orgLevel=$("#orgLevel").val();
	var username=$("#username").val();
	if(username!="admin"&&username!="huangzq17"){
		$("#repeatImportTd").remove();
		$("#confirmTd").remove();
	}
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

function confirmImport(){
	var dealDate=$("#dealDate").val();
	$.ajax({
        url: $("#ctx").val()+"/mainIncome/import-main-income!confirm.action",
        type: 'post',
        dataType: 'json',
        data: {
        	dealDate: dealDate
        },
        success: function (r) {
        	alert(r);
        	search(0);
        }
    });
}
//列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var dealDate=$("#dealDate").val();
	var code=$("#code").val();
	var username=$("#username").val();
	var where="";
	if(username!="admin"&&username!="huangzq17"){
		if(!isConfirm(dealDate)){
			where=" AND 1=2";
		}
	}else{
		if(isConfirm(dealDate)){
			$("#confirmTd").hide();
		}else{
			$("#confirmTd").show();
		}
	}
	var sql="SELECT "+field.join(",")+" FROM PMRT.VIEW_MRT_INCOME_MON WHERE DEAL_DATE='"+dealDate+"'";
	sql+=where;
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	sql+=" ORDER BY RANK ASC";
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_main_income.jsp";
 }
 
 function isConfirm(dealDate){
   var s="SELECT IS_CONFIRM FROM PMRT.TAB_MRT_MAIN_INCOME_MON WHERE DEAL_DATE="+dealDate;	 
   var r=query(s);
   if(r!=null&&r.length>0){
	   if(r[0].IS_CONFIRM=="1"){
		   return true;
	   }
	   return false;
   }
   return false;
 }
 
 function exportData(){
	var dealDate=$("#dealDate").val();
	var showtext = '分渠道主营业务收入-'+dealDate;
	downloadExcel(downSql,title,showtext);
 }