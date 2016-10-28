var nowData = [];
var title=[["账期","地市名称","营服名称","渠道经理","渠道名称","用宽带送手机（松耦合）","","",""],
  		  ["","","","","","59_手机","119_手机","139_手机","159_手机"]
 		];	
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_NAME","HQ_CHAN_NAME","PRODUCT_ID_1","PRODUCT_ID_2","PRODUCT_ID_3","PRODUCT_ID_4"];
var orderBy = ' order by GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}/*,{eq:8,css:LchReport.SUM_PART_STYLE}*/],
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
	var hqName = $("#hqName").val();
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();

	var sql=" SELECT T.DEAL_DATE		,		"+	//--账期
			" 		 T.GROUP_ID_1_NAME	,		"+	//--地市名称
			" 		 T.UNIT_NAME		,		"+	//--营服名称
			" 		 T.HQ_NAME			,		"+	//--渠道经理
			" 		 T.HQ_CHAN_NAME		,		"+	//--渠道名称
			" 		 T.PRODUCT_ID_1		,		"+	//--用宽带送手机（松耦合）59_手机
			" 		 T.PRODUCT_ID_2		,		"+	//--用宽带送手机（松耦合）119_手机
			" 		 T.PRODUCT_ID_3		,		"+	//--用宽带送手机（松耦合）139_手机
			" 		 T.PRODUCT_ID_4		 		"+	//--用宽带送手机（松耦合）159_手机
			"   FROM PMRT.TB_MRT_GK_PHONE_MON T "+	
			" WHERE T.FLAG = 1 AND T.DEAL_DATE = "+dealDate;

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hqName!=''){
		sql+=" AND T.HQ_NAME LIKE '%"+hqName+"%'";
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

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var sql = getsql();
	var title=[["账期","地市名称","营服名称","渠道经理","渠道名称","用宽带送手机（松耦合）","","",""],
	  		  ["","","","","","59_手机","119_手机","139_手机","159_手机"]
	 		];		
	showtext = '装宽带送手机融合业务，零元开卡未捆绑群组数-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////