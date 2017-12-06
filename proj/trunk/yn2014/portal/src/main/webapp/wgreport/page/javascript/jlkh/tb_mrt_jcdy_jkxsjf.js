var nowData = [];
var title=[["账期","地市","基层单元","人员姓名","HR编码","用户编号","用户号码","入网时间","操作员工号","部门编码","套餐编码","套餐名称","业务编码","业务描述","备注","指标值","发展人编码","渠道名称","原始积分","渠道系数","乘渠道系数后积分","区域系数","乘区域系数后积分","积分金额"]];
var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","SUBSCRIPTION_ID","SERVICE_NUM","JOIN_DATE","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","PRODUCT_NAME","ITEMCODE","ITEMDESC","REMARK","ITEMVALUE","DEVELOPER_ID","HQ_CHAN_NAME","SOURCE_CRE","HQ_RATIO","HQ_CRE","UNIT_RATIO","UNIT_CRE","UNIT_MONEY"];
//var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:16,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
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
	var sql = getSql();
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	var orderBy = " ORDER BY GROUP_ID_1,UNIT_ID ";
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

function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate = $("#dealDate").val();
	var sql = getSql();
	
	showtext = ' 直销人发展积分明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////


function getSql(){
	var dealDate = $("#dealDate").val();
	var regionCode = $("#regionCode").val();
	var unitCode = $("#unitCode").val();
	var phoneNumber = $.trim($("#phoneNumber").val());
	var userName = $.trim($("#userName").val());
	var itemdesc =$.trim( $("#itemDesc").val());
	var remark = $.trim($("#remark").val());
	var sql=
		" SELECT DEAL_DATE,                                       "+	//--账期
		"        AREA_NAME,                                       "+	//--地市
		"        UNIT_NAME,                                       "+	//--基层单元
		"        USER_NAME,                                       "+	//--人员姓名
		"        HR_NO,                                           "+	//--HR编码
		"        SUBSCRIPTION_ID,                                 "+	//--用户编号
		"        SERVICE_NUM,                                     "+	//--用户号码
		"        JOIN_DATE,                                       "+	//--入网时间
		"        OPERATOR_ID,                                     "+	//--操作员工号
		"        OFFICE_ID,                                       "+	//--部门编码
		"        PRODUCT_ID,                                      "+	//--套餐编码
		"        PRODUCT_NAME,                                      "+	//--套餐名称
		"        ITEMCODE,                                        "+	//--业务编码
		"        ITEMDESC,                                        "+	//--业务描述
		"        NVL(REMARK, '-') REMARK,                         "+	//--备注
		"        ITEMVALUE,                                       "+	//--指标值
		"        DEVELOPER_ID,                                    "+	//--发展人编码
		"        HQ_CHAN_NAME,                                    "+	//--渠道名称
		"        SOURCE_CRE,                                      "+	//--原始积分
		"        HQ_RATIO,                                        "+	//--渠道系数
		"        HQ_CRE,                                          "+	//--乘渠道系数后积分
		"        UNIT_RATIO,                                      "+	//--区域系数
		"        UNIT_CRE,                                        "+	//--乘区域系数后积分
		"        UNIT_MONEY                                       "+	//--积分金额
		"   FROM PMRT.TB_MRT_JCDY_JKXSJF_INFO PARTITION(P"+dealDate+")  "+	
		"   WHERE 1=1 ";

//条件
	if(regionCode!=''){
		sql+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(userName!=''){
		sql+=" AND USER_NAME LIKE '%"+userName+"%'";
	}
	if(phoneNumber!=''){
		sql+=" AND SERVICE_NUM LIKE '%"+phoneNumber+"%'";
	}
	if(itemdesc!=""){
		sql+=" AND ITEMDESC LIKE '%"+itemdesc+"%' ";
	}
	if(remark!=""){
		sql+=" AND REMARK LIKE '%"+remark+"%' ";
	}

//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1="+code;
	}else{
		var hrIds=_jf_power(hrId,dealDate);
		if(hrIds!=""){
		   sql+=" AND HR_NO IN("+hrIds+") ";
		}
	}
 return sql;
}
