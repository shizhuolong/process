var nowData = [];

var title=[["账期","分公司","营服名","渠道经理","移动网黑匣子用户清单：基于现有基层系统黑匣子模型","","","","","","","","",""],
            ["","","","","渠道名称","渠道编码","用户名称","用户ID","用户号码","套餐","入网时间","状态","状态变化时间","客户姓名"]
		];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID_NAME","DEV_CHNL_NAME","FD_CHNL_ID","USER_NAME","SUBSCRIPTION_ID","SERVICE_NUM","PRODUCT_NAME","INNET_DATE","SERVICE_STATUS","STATUS_CHANGE_DATE","CUSTOMER_NAME"];
var orderBy = ' order by GROUP_ID_1,UNIT_ID';
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
	var hqName = $("#hqName").val();
	var userPhone=$("#userPhone").val();
	var channelAttrs = $("#channelBox").attr("kindids");
	var channelLevel = $("#channelBox").attr("level");
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();

	var sql=" SELECT DEAL_DATE,                                                                               "+
			"        GROUP_ID_1_NAME,                                                                         "+
			"        UNIT_NAME,                                                                               "+
			"        HR_ID_NAME,                                                                              "+
			"        DEV_CHNL_NAME,                                                                           "+
			"        FD_CHNL_ID,                                                                              "+
			"        USER_NAME,                                                                               "+
			"        SUBSCRIPTION_ID,                                                                         "+
			"        SERVICE_NUM,                                                                             "+
			"        PRODUCT_NAME,                                                                            "+
			"        TO_CHAR(INNET_DATE,'YYYY-MM-DD') AS INNET_DATE,                                          "+
			"        DECODE(SERVICE_STATUS, 1, '开机', 2, '停机', 3, '半停', 4, '销户') AS SERVICE_STATUS,      "+
			"        TO_CHAR(STATUS_CHANGE_DATE,'YYYY-MM-DD') AS STATUS_CHANGE_DATE,                          "+
			"        DECODE(CUSTOMER_NAME, NULL, '暂无', CUSTOMER_NAME) AS CUSTOMER_NAME                       "+
			"   FROM PMRT.TAB_MRT_234G_JK_MON_DETAIL T                                                        "+
			"  WHERE T.IS_BLACK_USER = 1                                                                      "+
			" AND    T.DEAL_DATE = "+dealDate;

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(hqName!=''){
		sql+=" AND  T.HR_ID_NAME LIKE '%"+hqName+"%'";
	}
	if(userPhone!=''){
		sql+=" AND INSTR(T.SERVICE_NUM,'"+userPhone+"')>0 ";
	}
	
	if(channelAttrs!=''&& channelLevel!=''&&typeof(channelAttrs)!="undefined" && typeof(channelLevel)!="undefined"){
		sql+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
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
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql();
	var title=[["账期","分公司","营服名","渠道经理","移动网黑匣子用户清单：基于现有基层系统黑匣子模型","","","","","","","","",""],
	            ["","","","","渠道名称","渠道编码","用户名称","用户ID","用户号码","套餐","入网时间","状态","状态变化时间","客户姓名"]
			];
	showtext = '黑匣子预警清单-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////