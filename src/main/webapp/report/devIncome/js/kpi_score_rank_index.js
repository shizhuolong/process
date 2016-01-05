var nowData = [];
var title=[["地市名称","营服名称","HR编码","姓名","角色","总得分","全省排名","地市排名","营服排名"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_ROLE","ALL_SCORE","KPI_RANK","GROUP_RANK","UNIT_RANK"];
var orderBy = ' ORDER BY T.KPI_RANK,T.GROUP_RANK,T.UNIT_RANK ASC';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : ["HR_ID","NAME","DEV_SCORE","IN_SCORE","OWE_SCORE","STOCK_SCORE","ML_SCORE","CUSTOM_SCORE","BTSR_SCORE","ALL_SCORE"],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			if(index==8){
				orderBy = " order by PER_CENT1 " + type + " ";
			}else{
				orderBy = " order by " + field[index] + " " + type + " ";
			}
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
	
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 12;
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
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	
	
	var sql ="SELECT " +
				"T.DEAL_DATE       ,"+
				"T.GROUP_ID_1      ,"+
				"T.GROUP_ID_1_NAME ,"+
				"T.UNIT_ID         ,"+
				"T.UNIT_NAME       ,"+
				"T.HR_ID           ,"+
				"T.NAME            ,"+
				"T.USER_ROLE       ,"+
				"T.DEV_SCORE       ,"+
				"T.IN_SCORE        ,"+
				"T.OWE_SCORE       ,"+
				"T.STOCK_SCORE     ,"+
				"T.ML_SCORE        ,"+
				"T.CUSTOM_SCORE    ,"+
				"T.BTSR_SCORE      ,"+
				"T.ALL_SCORE       ,"+
				"T.KPI_RANK        ,"+
				"T.GROUP_RANK      ,"+
				"T.UNIT_RANK       "+
			"FROM  PMRT.TB_MRT_JCDY_KPI_RANK_MON T WHERE 1=1 ";

//条件
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	sql+=" and t.DEAL_DATE ="+time+" ";
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	
	
	
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}

	//排序
	if (orderBy != '') {
		sql += orderBy;
	}


	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
		var total=$(this).find("TD:eq(5)");
		var $href=$("<a>"+total.text()+"</a>");
		total.html($href);
		$href.click(function(){
			var $tr=$(this).parent().parent();
			var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
				+"<table><thead class='lch_DataHead'>"
				+"<tr><th>姓名</th><th>"+$tr.attr("NAME")+"</th></tr>"
				+"<tr><th>HR编码</th><th>"+$tr.attr("HR_ID")+"</th></tr>"
				+"<tr><th>发展得分</th><th>"+$tr.attr("DEV_SCORE")+"</th></tr>"
				+"<tr><th>收入得分</th><th>"+$tr.attr("IN_SCORE")+"</th></tr>"
				+"<tr><th>欠费得分</th><th>"+$tr.attr("OWE_SCORE")+"</th></tr>"
				+"<tr><th>存量得分</th><th>"+$tr.attr("STOCK_SCORE")+"</th></tr>"
				+"<tr><th>毛利得分</th><th>"+$tr.attr("ML_SCORE")+"</th></tr>"
				+"<tr><th>自设得分</th><th>"+$tr.attr("CUSTOM_SCORE")+"</th></tr>"
				+"<tr><th>本厅收入完成率得分</th><th>"+$tr.attr("BTSR_SCORE")+"</th></tr>"
				+"<tr><th>总得分</th><th>"+$tr.attr("ALL_SCORE")+"</th></tr>"
				+"</thead>"
				+"</table>"
				+"</div>";
				art.dialog({
				    title: '详细信息',
				    content: h,
				    padding: 0,
				    lock:true
				});
		});
		
	});
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
