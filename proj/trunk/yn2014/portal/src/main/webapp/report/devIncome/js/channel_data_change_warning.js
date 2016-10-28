var nowData = [];

var title=[
           ["账期","地市","营服","渠道编码","渠道名称","当前账期","当前开户行","当前银行卡号","当前开户名","历史账期","历史开户行","历史卡号","历史开户名","备注"]
		];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","CHNL_CODE_NEW","CHNL_NAME","DEAL_DATE_NEW","BANK_CODE_NEW","BANK_NO_NEW","BANK_ACCT_NAME_NEW","DEAL_DATE_OLD","BANK_CODE_OLD","BANK_NO_OLD","BANK_ACCT_NAME_OLD","REMARK"];
var orderBy = ' ORDER BY GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[/*{gt:3,css:LchReport.RIGHT_ALIGN},{eq:8,css:LchReport.SUM_PART_STYLE}*/],
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
	var nameOfNow = $.trim($("#nameOfNow").val());
	var nameOfOld=$.trim($("#nameOfOld").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var sql=" SELECT T.DEAL_DATE,                   "+    //账期
			"        T.GROUP_ID_1_NAME,             "+    //地市
			"        T.UNIT_NAME,                   "+    //营服
			"        T.CHNL_CODE_NEW,               "+    //渠道编码
			"        T.CHNL_NAME,                   "+    //渠道名称
			"        T.DEAL_DATE_NEW,               "+    //当前账期
			"        T.BANK_CODE_NEW,               "+    //当前开户行
			"        T.BANK_NO_NEW,                 "+    //当前银行卡号
			"        T.BANK_ACCT_NAME_NEW,          "+    //当前开户名
			"        T.DEAL_DATE_OLD,               "+    //历史账期
			"        T.BANK_CODE_OLD,               "+    //历史开户行
			"        T.BANK_NO_OLD,                 "+    //历史卡号
			"        T.BANK_ACCT_NAME_OLD,          "+    //历史开户名
			"        T.REMARK                       "+    //备注
			"   FROM PCDE.TB_CDE_HQ_CHNL_BANK_CHG T "+    
			"  WHERE  T.DEAL_DATE = "+dealDate;

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(nameOfNow!=''){
		sql+=" AND  T.BANK_ACCT_NAME_NEW LIKE '%"+nameOfNow+"%'";
	}
	if(nameOfOld!=''){
		sql+=" AND  T.BANK_ACCT_NAME_OLD LIKE '%"+nameOfOld+"%'";
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

	var sql = getsql()+" ORDER BY GROUP_ID_1,UNIT_ID";
	var title=[
	           ["账期","地市","营服","渠道编码","渠道名称","当前账期","当前开户行","当前银行卡号","当前开户名","历史账期","历史开户行","历史卡号","历史开户名","备注"]
			];	
	showtext = '渠道资料变动预警-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////