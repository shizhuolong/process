var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","JOB" ,"HR_ID" ,"NAME" ,"INDEX_NAME" ,"TASK_VALUE" ,"REAL_VALUE" ,"TASK_COMPLETE" ,"SCORE" ,"KRI_WEIGHT","MIN_PROP" ,"MIN_VALUE" ,"MAX_PROP" ,"MAX_VALUE" ,"FULL_MARKS","TYPE_COUNT","TYPE_NAME"];
var title=[["账期","地市","营服名称","岗位","HR编码","姓名","指标名称","任务值","实际完成","完成率","得分","权重","最小百分比","最小分数","最大百分比","最大分数","满分","计算方式","指标级别"]];
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:1,css:LchReport.RIGHT_ALIGN}],
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
	init_indexName();
	$("#searchBtn").click(function(){
		search(0);
	});
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var hrId=$("#hrId").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var indexName=$("#indexName").val();
	var typeName=$.trim($("#typeName").val());
	var nmae=$.trim($("#nmae").val());
	var where = " WHERE DEAL_DATE = '"+dealDate+"'";
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else{
		where += " AND HR_ID IN (SELECT PORTAL.HR_PERM('"+hrId+"', '"+dealDate+"') FROM DUAL)";
	}
	//条件
	if(regionCode!=""){
		where += " AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(indexName!=""){
		where += " AND INDEX_ID = '"+indexName+"'";
	}
	if(typeName!=""){
		where += " AND TYPE_NAME LIKE '%"+typeName+"%'";
	}
	if(unitCode!=""){
		where += " AND UNIT_ID = '"+unitCode+"'";
	}
	if(nmae!=""){
		where += " AND NAME LIKE '%"+nmae+"%' ";
	}
	
	var sql=getSql();
	sql+=where;
	downSql=sql;
	
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
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

function getSql(){
	var dealDate=$("#dealDate").val();
	var sql="SELECT  DEAL_DATE,              "+
	"        GROUP_ID_1_NAME,                "+
	"        UNIT_NAME,               "+
	"        JOB,              "+
	"        HR_ID,               "+
	"        NAME,               "+
	"        INDEX_NAME,                "+
	"        TASK_VALUE,                   "+
	"        REAL_VALUE,                 "+
	"        TASK_COMPLETE,                "+
	"        SCORE,                 "+
	"        KRI_WEIGHT,                 "+
	"        MIN_PROP,                 "+
	"        MIN_VALUE,                 "+
	"        MAX_PROP,                 "+
	"        MAX_VALUE,                 "+
	"        FULL_MARKS,                 "+
	"        TYPE_COUNT,                 "+
	"        TYPE_NAME                 "+
	"FROM PMRT.VIEW_MRT_CHNL_SOCRE_MON ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	showtext = "指标得分-'"+dealDate+"'";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////

function init_indexName(){
	var $indexName=$("#indexName");
	if(!$indexName||$indexName.length<1)
		return;
	var sql = "SELECT distinct INDEX_ID,INDEX_NAME FROM PMRT.TAB_MRT_CHNL_INDEX";
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="">请选择</option>';
			h += '<option value="' + d[0].INDEX_ID
					+ '" selected >'
					+ d[0].INDEX_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].INDEX_ID + '">' + d[i].INDEX_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$indexName.empty().append($h);
	} else {
		alert("获取指标信息失败");
	}
}