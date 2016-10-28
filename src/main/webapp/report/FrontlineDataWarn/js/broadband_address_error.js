var nowData = [];

var title=[
           ["账期","分公司","营服名称","渠道经理","标准地址第七级及以下缺失","用户装机地址缺失","用户联系手机缺失","新装3条宽带以上装机地址数"]
		];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","NAME","COUNTS1","COUNTS2","COUNTS3","COUNTS4"];
var orderBy = ' ORDER BY GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}/*,{eq:8,css:LchReport.SUM_PART_STYLE}*/],
		rowParams : [/*"HR_NO","USER_NAME"*/],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
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
	//获得查询sql
	var sql = getsql();
	
	var csql = sql;
	var cdata = query("select count(*) total FROM(" + csql+")");
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


function getsql(){
	var dealDate=$("#dealDate").val();
	
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var hqName = $.trim($("#hqName").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var sql=" SELECT T.DEAL_DATE,						"+
			"        T.GROUP_ID_1_NAME,					"+
			"        T.UNIT_NAME,						"+
			"        T.NAME,							"+
			"        T.COUNTS1,							"+
			"        T.COUNTS2,							"+
			"        T.COUNTS3,							"+
			"        T.COUNTS4							"+
			"   FROM PMRT.TB_MRT_GK_ADDR_ERROR_MON T	"+
			"  WHERE T.DEAL_DATE = "+dealDate;

	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hqName!=''){
		sql+=" AND  T.NAME LIKE '%"+hqName+"%'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" 1=2";
	}
	
	return sql;
}

////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql();
	var title=[
	           ["账期","分公司","营服名称","渠道经理","标准地址第七级及以下缺失","用户装机地址缺失","用户联系手机缺失","新装3条宽带以上装机地址数"]
			];		
	showtext = '宽带装机地址不合规清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////