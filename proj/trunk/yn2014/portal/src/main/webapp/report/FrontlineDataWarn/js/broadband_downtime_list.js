var nowData = [];

var title=[["账期","分公司","营服名称","渠道经理","宽带欠费停机用户清单","","","","","","","","","","","","",""],
           ["","","","","归属地","宽带账号","客户姓名","装机地址","联系电话","套餐名称","入网时间","离网时间","状态","局站名","接入方式","宽带速率","欠费金额","发展渠道"]
		];		
var field=["DEAL_DATE","GROUP_ID_NAME","UNIT_NAME","HQ_NAME","GROUP_ID_2_NAME","SUBSCRIPTION_ID","CUSTOMER_NAME","STD_6_NAME","CONTACT_PHONE","PRODUCT_NAME","INNET_DATE","INACTIVE_DATE","STATUS_NAME","EXCH_NAME","INPUT_TYPE","SPEED_M","OWE_FEE","HQ_CHAN_NAME"];
var orderBy = ' order by GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[/*{gt:3,css:LchReport.RIGHT_ALIGN}*/],
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
	var userPhone=$("#userPhone").val();
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var sql=" SELECT T.DEAL_DATE,                  "+
			"        T.GROUP_ID_NAME,              "+
			"        T.UNIT_NAME,                  "+
			"        T.HQ_NAME,                    "+
			"        T.GROUP_ID_2_NAME,            "+
			"        T.SUBSCRIPTION_ID,            "+
			"        T.CUSTOMER_NAME,              "+
			"        T.STD_6_NAME,                 "+
			"        T.CONTACT_PHONE,              "+
			"        T.PRODUCT_NAME,               "+
			"        T.INNET_DATE,                 "+
			"        T.INACTIVE_DATE,              "+
			"        T.STATUS_NAME,                "+
			"        T.EXCH_NAME,                  "+
			"        T.INPUT_TYPE,                 "+
			"        T.SPEED_M,                    "+
			"        T.OWE_FEE,                    "+
			"        T.HQ_CHAN_NAME                "+
			"   FROM PMRT.TB_MRT_GK_OWESTOP_DAY T  "+
			" WHERE T.DEAL_DATE = "+dealDate;

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hqName!=''){
		sql+=" AND  T.HQ_NAME LIKE '%"+hqName+"%'";
	}
	if(userPhone!=''){
		sql+=" AND  T.CONTACT_PHONE='"+userPhone+"'";
		//sql+=" AND INSTR(T.CUSTOMER_NO,'"+deviceNum+"')>0 ";
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
	var title=[["账期","分公司","营服名称","渠道经理","宽带欠费停机用户清单","","","","","","","","","","","","",""],
	           ["","","","","归属地","宽带账号","客户姓名","装机地址","联系电话","套餐名称","入网时间","离网时间","状态","局站名","接入方式","宽带速率","欠费金额","发展渠道"]
			];
	showtext = '宽带欠费停机用户清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////