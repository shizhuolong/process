var nowData = [];
var title=[
           ["账期","地市","营服中心","HR编码","渠道经理","渠道编码","渠道名","用户编码","电话号码","品牌","开户时间","入网时间","活动ID","活动名","合约类型","状态","套餐ID","套餐名","卡面值","提卡折扣","实时话费余额","出账金额","是否三无","是否极低"]
		];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","HR_ID_NAME","DEV_CHNL_ID","DEV_CHNL_NAME","SUBSCRIPTION_ID","SERVICE_NUM","NET_TYPE","OPEN_DATE","JOIN_DATE","SCHEME_ID","SCHEME_NAME","SCHEME_TYPE_NAME","SERVICE_STATUS","PRODUCT_ID","PRODUCT_NAME","CARD_FEE","DISCOUNT","SS_FEE","CZ_FEE","IS_NULL_USER","IS_LOW_USER"];
var orderBy = ' ORDER BY GROUP_ID_1,UNIT_ID';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN}],
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
	//渠道编码
	var hqCode = $("#hqCode").val();
	//电话号码
	var userPhone=$("#userPhone").val();
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();

	var sql=" SELECT T.DEAL_DATE,                                               "+		//--账期
			"        T.GROUP_ID_1_NAME,                                         "+		//--地市
			"        T.UNIT_NAME,                                               "+		//--营服中心
			"        T.HR_ID,                                                   "+		//--HR编码
			"        T.HR_ID_NAME,                                              "+		//--渠道经理
			"        T.DEV_CHNL_ID,                                             "+		//--渠道编码
			"        T.DEV_CHNL_NAME,                                           "+		//--渠道名
			"        T.SUBSCRIPTION_ID,                                         "+		//--用户编码
			"        T.SERVICE_NUM,                                             "+		//--电话号码
			"        CASE WHEN T.NET_TYPE = '01' THEN '2G' 						"+
			"			WHEN T.NET_TYPE = '02' THEN '3G' 						"+
			"			WHEN    T.NET_TYPE = '03' THEN '3GWIFI' 				"+
			"			WHEN      T.NET_TYPE = '50' THEN '4G' END NET_TYPE,     "+		//--品牌
			"        T.OPEN_DATE,                                               "+		//--开户时间
			"        T.JOIN_DATE,								                "+		//--入网时间
			"        T.SCHEME_ID,                                               "+		//--活动ID
			"        T.SCHEME_NAME,                                             "+		//--活动名
			"        T.SCHEME_TYPE_NAME,                                        "+		//--合约类型
			"        T.SERVICE_STATUS,                                          "+		//--状态
			"        T.PRODUCT_ID,                                              "+		//--套餐ID
			"        T.PRODUCT_NAME,                                            "+		//--套餐名
			"        T.CARD_FEE,                                                "+		//--卡面值
			"        T.DISCOUNT,                                                "+		//--提卡折扣
			"        T.SS_FEE,                                                  "+		//--实时话费余额
			"        T.CZ_FEE,                                                  "+		//--出账金额
			"        DECODE(T.IS_NULL_USER, 1, '是', 0, '否') AS IS_NULL_USER,  "+		//--是否三无
			"        DECODE(T.IS_LOW_USER, 1, '是', 0, '否') AS IS_LOW_USER     "+		//--是否极低
			"   FROM PMRT.TAB_MRT_DISCOUNT_CARD_DETAIL T                        "+		
			"   WHERE T.DEAL_DATE ='"+dealDate+"'                               ";		
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userPhone!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+userPhone+"')>0 ";
	}
	if(hqCode!=''){
		sql+=" AND T.DEV_CHNL_ID = '"+hqCode+"'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND T.HR_ID='"+hrId+"'";
	}
	return sql;
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql()+" ORDER BY T.GROUP_ID_1,T.UNIT_ID";
	var title=[
	           ["账期","地市","营服中心","HR编码","渠道经理","渠道编码","渠道名","用户编码","电话号码","品牌","开户时间","入网时间","活动ID","活动名","合约类型","状态","套餐ID","套餐名","卡面值","提卡折扣","实时话费余额","出账金额","是否三无","是否极低"]
			];	
	showtext = '重庆华记新开户清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////