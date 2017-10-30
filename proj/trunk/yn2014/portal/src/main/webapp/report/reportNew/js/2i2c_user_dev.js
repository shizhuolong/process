var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME" ,"HR_ID" ,"NAME" ,"JOB_TYPE" ,"USER_ID" ,"SERVICE_NUM" ,"PRODUCT_ID" ,"PRODUCT_NAME" ,"JOIN_DATE" ,"DEVELOPER_ID" ,"HQ_CHANL_CODE" ,"BSS_CHANL_CODE" ,"REGION_ID" ,"FIRST_PAY_FEE" ,"FIRST_PAY_TIME" ,"PROMOTE_COMM" ,"FIRST_PAY_COMM"];
var title=[["账期","地市名称","营服名称","HR编码","姓名","员工属性","用户编码","号码","套餐ID","套餐名称","入网时间","发展编码","渠道编码","发展礼包编码","地市编码","首充金额","首充时间","推广奖励","首充奖励"]];
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
	var code=$("#code").val();
	var region=$("#region").val();
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	var userPhone=$("#userPhone").val();
	var userName=$("#userName").val();
	
	//权限
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND GROUP_ID_1 =" + region;
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(hqChanlCode!=''){
		where+=" AND HQ_CHANL_CODE LIKE '%"+hqChanlCode+"%'";
	}
	if(userPhone!=''){
		where+=" AND SERVICE_NUM LIKE '%"+userPhone+"%'";
	}
	if(userName!=''){
		where+= " AND NAME LIKE '%"+userName+"%'";
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
	var sql="SELECT                    "+
	"DEAL_DATE,                               "+
	"GROUP_ID_1_NAME,                         "+
	"UNIT_NAME,                               "+
	"HR_ID,                                   "+
	"NAME,                                    "+
	"JOB_TYPE,                                "+
	"USER_ID,                                 "+
	"SERVICE_NUM,                             "+
	"PRODUCT_ID,                              "+
	"PRODUCT_NAME,                            "+
	"JOIN_DATE,                               "+
	"DEVELOPER_ID,                            "+
	"HQ_CHANL_CODE,                           "+
	"BSS_CHANL_CODE,                          "+
	"REGION_ID,                               "+
	"FIRST_PAY_FEE,                           "+
	"FIRST_PAY_TIME,                          "+
	"PROMOTE_COMM,                            "+
	"FIRST_PAY_COMM                           "+
	"FROM PMRT.TAB_MRT_2I2C_FIRST_PAY_FEE_DAY ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "2i2c发展用户首充奖励";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
