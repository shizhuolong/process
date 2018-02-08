var nowData = [];
var report = null;
var orderBy='';
var maxDate=null;
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_ID","UNIT_NAME" ,"HQ_CHAN_CODE" ,"HQ_CHAN_NAME" ,"DEVELOPER_ID" ,"DEVELOPER_NAME" ,"STROECODE" ,"STROENAME" ,"TDC_ID" ,"TDC_NAME" ,"TDC_PHONE","SERACH_NUMBER","ORD_ID","SAL_STYE","PAY_FEE"];
var title=[["账期","地市","营服编码","营服名称" ,"渠道编码" ,"渠道名称" ,"发展人" ,"发展人姓名" ,"二维码编码" ,"二维码名称" ,"二维码id","二维码联系人" ,"二维码对应手机号","客户联系电话","订单编码","销售类型","首充"]];
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
	$("#dealDate").val($("#qdate").val());
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
	var level=$("#level").val();
	var isPayLj=$("#isPayLj").val();
	var dealDate=$("#dealDate").val();
	var where = " where deal_date = "+dealDate;
	//权限
	if(orgLevel==1){

	}else if(orgLevel==2||orgLevel==3){
		where += " AND GROUP_ID_1 =" + region;
	}else{
		where += " AND 1=2";
	}
	
	if(code!=null&&code!=""){
		if(level==1){
			where+=" AND group_id_1='"+code+"'";
		}else if(level==2){
			where+=" AND unit_id='"+code+"'";
		}else if(level==3){
			where+=" AND HQ_CHAN_CODE='"+code+"'";
		}else{
			where+=" AND 1=2 ";
		}
	}
	//条件
	if(isPayLj=="xl"){
		where+= " AND is_pay_lj=1 ";
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

function getSql(){
	var sql="SELECT                                    "+
	"DEAL_DATE ,                               "+
	"GROUP_ID_1_NAME  ,                        "+
	"UNIT_ID ,                                 "+
	"UNIT_NAME ,                               "+
	"HQ_CHAN_CODE,                             "+
	"HQ_CHAN_NAME ,                            "+
	"DEVELOPER_ID ,                            "+
	"DEVELOPER_NAME ,                          "+
	"STROECODE ,                               "+
	"STROENAME,                                "+
	"TDC_ID,                                 "+
	"TDC_NAME,                                 "+
	"TDC_PHONE,                                "+
	"SERACH_NUMBER ,                           "+
	"ORD_ID,                                   "+
	"decode(SAL_STYE ,1,'线上',2,'线下') SAL_STYE, "+
	"pay_fee                                   "+
	"FROM PMRT.TAB_MRT_QC_TDC_DETAIL ";
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	showtext = "二维码明细";
	downloadExcel(downSql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////