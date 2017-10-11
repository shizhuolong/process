var nowData = [];
var title=[["分公司","区县","宽带账号","用户名","装机地址","联系电话","套餐ID","套餐名称","入网时间","状态","局站","接入方式","宽带速率","代理商ID","代理商名称","渠道经理","余额","续费金额"]];
var field=["GROUP_ID_1_NAME","GROUP_ID_2_NAME","DEVICE_NUMBER","CUSTOMER_NAME","STD_6_NAME","CONTACT_PHONE","PRODUCT_ID","PRODUCT_NAME","INNET_DATE","STATUS_NAME","EXCH_NAME","INPUT_TYPE","SPEED_M","HQ_CHAN_CODE","HQ_CHAN_NAME","HQ_NAME","BALANCE","KDXF"];
var report = null;
var downSql="";
var dealDate="";
$(function() {
	$("#dealDate").val(getMaxDate("PMRT.TB_MRT_BROADBAND_WX_DAY").substr(0,6));
	report = new LchReport({
		title : title,
		field : field,
		rowParams : [],
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
	dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hqChanCode=$("#hqChanCode").val();
	var hr_id=$("#hr_id").val();
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var sql="SELECT "+
	"GROUP_ID_1_NAME,                                  "+
	"GROUP_ID_2_NAME,                                  "+
	"DEVICE_NUMBER,                                    "+
	"SUBSTR(CUSTOMER_NAME, 1, 1) || '**' CUSTOMER_NAME,"+
	"STD_6_NAME,                                       "+
	/*"REPLACE(CONTACT_PHONE,                            "+
	"        SUBSTR(CONTACT_PHONE, 4, 4),              "+
	"        '****') */
	"CONTACT_PHONE,                    "+
	"PRODUCT_ID,                                       "+
	"PRODUCT_NAME,                                     "+
	"INNET_DATE,                                       "+
	"STATUS_NAME,                                      "+
	"EXCH_NAME,                                        "+
	"INPUT_TYPE,                                       "+
	"SPEED_M,                                          "+
	"HQ_CHAN_CODE,                                     "+
	"HQ_CHAN_NAME,                                     "+
	"HQ_NAME,                                          "+
	"BALANCE,                                          "+
	"KDXF                                              "+ 
	" FROM PMRT.TB_MRT_BROADBAND_WX_DAY WHERE IS_JKDJ=1 AND DEAL_DATE LIKE '%"+dealDate+"%'";
    if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+="AND HQ_HR_ID IN("+_jf_power(hrId,dealDate)+")";
	}else{
		sql+=" AND 1=2";
	}
	if(regionCode!=""){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(hqChanCode!=""){
		sql+=" AND HQ_CHAN_CODE LIKE '%"+hqChanCode+"%'";
	}
	if(hr_id!=""){
		sql+=" AND HQ_HR_ID LIKE '%"+hr_id+"%'";
	}
	sql+= " ORDER BY GROUP_ID_1";
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from(" + csql+")");
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
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
 
function downsAll(){
	var showtext = '公共池待续费用户清单-'+dealDate;
	downloadExcelOnePage(downSql,title,showtext);
}
