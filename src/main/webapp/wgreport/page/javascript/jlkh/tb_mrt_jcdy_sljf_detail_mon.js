var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","HR_NO","USER_NAME","HQ_CHAN_CODE","HQ_NAME","OPERATOR_ID","BUSI_ID","BUSI_DESC","SLL","BIGBUSI_CODE","BIGBUSI_DESC","CRE","SL_CRE","SVR_RATIO","SVR_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY"];
var title=[["账期","地市","营服中心","HR编码","人员姓名","渠道编码","渠道名称","操作员编码","业务编码","业务描述","受理量","业务大类","业务大类描述","原始积分","受理积分","服务调节系数","服务调节积分","区域调节系数","区域调节积分","积分金额"]];
var nowData = [];
var report=null;
$(function() {
	 report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
		//css:[{gt:5,css:LchReport.RIGHT_ALIGN}],
		content : "content",
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
	
	var sql = getSql();
	var orderBy =" ORDER BY GROUP_ID_1,UNIT_ID ";
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
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
	//权限
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	var hrId = $("#hrId").val();
	//条件
	var dealDate = $("#dealDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var userName = $("#userName").val();
	var itemdesc = $("#itemdesc").val();
	
	var sql=  " SELECT DEAL_DATE,                        "+
			"        AREA_NAME,                        "+
			"        UNIT_NAME,                        "+
			"        HR_NO,                            "+
			"        USER_NAME,                        "+
			"        HQ_CHAN_CODE,                     "+
			"        HQ_NAME,                          "+
			"        OPERATOR_ID,                      "+
			"        BUSI_ID,                          "+
			"        BUSI_DESC,                        "+
			"        SLL,                              "+
			"        BIGBUSI_CODE,                     "+
			"        BIGBUSI_DESC,                     "+
			"        CRE,                              "+
			"        SL_CRE,                           "+
			"        SVR_RATIO,                        "+
			"        SVR_CRE,                          "+
			"        UNIT_RATIO,                       "+
			"        UNIT_CRE,                         "+
			"        UNIT_MONEY                        "+
			"   FROM PMRT.TB_MRT_JCDY_SLJF_DETAIL_MON  "+
			"  WHERE DEAL_DATE ='"+dealDate+"'         ";
	if(orgLevel==1){
		
	}else if(orgLevel == 2){
		sql += " AND GROUP_ID_1 = '"+code+"' ";
	}else if(orgLevel ==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		
	}
	if(regionCode!=''){
		sql+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+= " AND USER_NAME LIKE '%"+userName+"%'";
	}
	if(itemdesc!=''){
		sql+= " AND BUSI_DESC LIKE '%"+itemdesc+"%'";
	}
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate = $("#dealDate").val();
	var sql = getSql();
	var orderBy =" ORDER BY GROUP_ID_1,UNIT_ID ";
	sql+=orderBy;
	showtext = '营业受理积分明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////

