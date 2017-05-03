var nowData = [];
var title=[["州市","区县营服中心","是否入库","成本中心代码","业务","项目","专业","单位","实际代维量","不含税单价","代维费计提金额","考核调整金额","考核调整后金额"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","IS_IN_UNIT","ACFIX_CODE","BUSINESS","ITEM","PROFESS","UNIT","FACT_MAINTAIN_NUM","PER_NO_FAX","MAINTAIN_FEE","CHANGE_FEE","CHANG_LATER_FEE"];
var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID";
var report = null; 
var downSql="";
$(function() {
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
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
	var sql="SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_MAINTAIN_MON WHERE DEAL_DATE='"+time+"'";
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	var is_in_unit=$("#is_in_unit").val();
	if(is_in_unit!=""){
		sql+=" AND IS_IN_UNIT='"+is_in_unit+"'";
	}
	sql+=orderBy;
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
	 window.location.href=$("#ctx").val()+"/portal/channelManagement/jsp/import_maintain_new.jsp";
 }
 
 function exportData(){
	var time=$("#time").val();
	var showtext = '代维费汇总-'+time;
	downloadExcel(downSql,title,showtext);
 }