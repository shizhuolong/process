var nowData = [];
var report = null;
var orderBy='';
var field=["DEAL_DATE","GROUP_ID_1_NAME","GROUP_ID_2_NAME","FD_CHNL_CODE" ,"PAY_23G_FEE" ,"RULE_23G_NAME" ,"COMM_23G_FEE" ,"PAY_4G_FEE" ,"RULE_4G_NAME" ,"COMM_4G_FEE"];
var title=[["账期","州市","区县","总部渠道编码","2G/3G代收费金额（元）","2G/3G代收费佣金规则","2G/3G代收费佣金（元）","4G代收费金额（元）","4G代收费佣金规则","4G代收费佣金（元）"]];
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
	var hr_id=$("#hr_id").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanlCode=$("#hqChanlCode").val();
	
	//权限
	var where = "WHERE DEAL_DATE = '"+dealDate+"'";
	if(orgLevel==1){

	}else if(orgLevel==2){
		where += " AND GROUP_ID_1 =" + code;
	}else if(orgLevel==3){
		where += " AND FD_CHNL_CODE =" + code;
	}else{
		where += " AND 1=2";
	}
	//条件
	if(regionCode!=''){
		where+= " AND GROUP_ID_1 ='"+regionCode+"'";
	}
	if(hqChanlCode!=''){
		where+=" AND FD_CHNL_CODE LIKE '%"+hqChanlCode+"%'";
	}
		
	var sql=getSql(where);
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
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSql(where){
	var sql="SELECT  DEAL_DATE,                                  "+
	"        GROUP_ID_1_NAME,                                    "+
	"        GROUP_ID_2_NAME,                                    "+
	"        FD_CHNL_CODE,                                       "+
	"        PAY_23G_FEE,                                        "+
	"        RULE_23G_NAME,                                      "+
	"        COMM_23G_FEE,                                       "+
	"        PAY_4G_FEE,                                         "+
	"        RULE_4G_NAME,                                       "+
	"        COMM_4G_FEE                                         "+
	"    FROM PODS.TAB_FEE_COMMFEE_F_MON "+
	    where +
	"    ORDER BY FD_CHNL_CODE ASC ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	
	showtext = "渠道代收费月报";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
