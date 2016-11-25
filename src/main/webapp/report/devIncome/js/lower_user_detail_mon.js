var nowData = [];

var title=[["账期","地市名称","营服名称","渠道名称","渠道编码","用户编号","用户号码","套餐ID","套餐名称","套餐费","套餐包含语音","套餐包含流量","入网日期","套餐受理渠道","套餐受理渠道名称","入网类型","第一次低质态出账月份","出账金额（第一次）","第二次低质态出账月份 ","出账金额（第二次）","是否低质态用户","入网次月出账金额","入网次月通话时长","入网次月流量","入网第三月出账金额","入网第三月通话时长","入网第三月流量","入网第四月出账金额","入网第四月通话时长","入网第四月流量","已产生一次性佣金","已产生分成佣金","已产生奖罚佣金","已产生代收代办佣金","已产生的客户维系佣金","已产生的增值佣金","已产生的其他佣金"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","GROUP_ID_4_NAME","HQ_CHAN_CODE","SUBSCRIPTION_ID","DEVICE_NUMBER","PRODUCT_ID","PRODUCT_NAME","DINNER_MON_FEE","YUYIN_MAX","GPRS_MAX","INNET_DATE","OFFICE_CHANNEL_ID","OFFICE_CHANNEL_NAME","SCHEME_STYLE_NAME","FRIST_MON","FRIST_D_CZ","SECOND_MON","SECOND_D_CZ","IS_LOW","CZ01","CALL_TIMES_1","FLOW_AMOUNT_1","CZ02","CALL_TIMES_2","FLOW_AMOUNT_2","CZ03","CALL_TIMES_3","FLOW_AMOUNT_3","YJ_YCX","YJ_HFFC","YJ_JF","YJ_DBF","YJ_KHWX","YJ_ZZ","YJ_QT"];
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
	var userPhone=$("#userPhone").val();
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
/*	var hrId=$("#hrId").val();*/

	var sql=" SELECT T.DEAL_DATE,                                               "+
			"        T.GROUP_ID_1_NAME,                                         "+
			"        T.UNIT_NAME,                                               "+
			"        T.GROUP_ID_4_NAME,                                         "+
			"        T.HQ_CHAN_CODE,                                            "+
			"        T.SUBSCRIPTION_ID,                                         "+
			"        T.DEVICE_NUMBER,                                           "+
			"        T.PRODUCT_ID,                                              "+
			"        T.PRODUCT_NAME,                                            "+
			"        T.DINNER_MON_FEE,                                          "+
			"        T.YUYIN_MAX,                                               "+
			"        T.GPRS_MAX,                                                "+
			"        T.INNET_DATE,                                              "+
			"        T.OFFICE_CHANNEL_ID,                                       "+
			"        T.OFFICE_CHANNEL_NAME,                                     "+
			"        T.SCHEME_STYLE_NAME,                                       "+
			"        T.FRIST_MON,                                               "+
			"        T.FRIST_D_CZ,                                              "+
			"        T.SECOND_MON,                                              "+
			"        T.SECOND_D_CZ,                                             "+
			"        T.IS_LOW,                                                  "+
			"        NVL(T.CZ01, 0) AS CZ01,                                    "+
			"        NVL(T.CALL_TIMES_1, 0) AS CALL_TIMES_1,                    "+
			"        NVL(ROUND(T.FLOW_AMOUNT_1, 2), 0) FLOW_AMOUNT_1,           "+
			"        NVL(T.CZ02, 0) AS CZ02,                                    "+
			"        NVL(T.CALL_TIMES_2, 0) AS CALL_TIMES_2,                    "+
			"        NVL(ROUND(T.FLOW_AMOUNT_2, 2), 0) FLOW_AMOUNT_2,           "+
			"        NVL(T.CZ03, 0) AS CZ03,                                    "+
			"        NVL(T.CALL_TIMES_3, 0) AS CALL_TIMES_3,                    "+
			"        NVL(ROUND(T.FLOW_AMOUNT_3, 2), 0) FLOW_AMOUNT_3,           "+
			"        NVL(T.YJ_YCX, 0) AS YJ_YCX,                                "+
			"        NVL(T.YJ_HFFC, 0) AS YJ_HFFC,                              "+
			"        NVL(T.YJ_JF, 0) AS YJ_JF,                                  "+
			"        NVL(T.YJ_DBF, 0) AS YJ_DBF,                                "+
			"        NVL(T.YJ_KHWX, 0) AS YJ_KHWX,                              "+
			"        NVL(T.YJ_ZZ, 0) AS YJ_ZZ,                                  "+
			"        NVL(T.YJ_QT, 0) AS YJ_QT                                   "+
			"   FROM PODS.TAB_ODS_LOWER_USER_DETAIL_MON PARTITION(P"+dealDate+") T  "+
			" WHERE 1=1 ";

	if(regionCode!=''){
		sql+=" AND  T.GROUP_ID_1='"+regionCode+"'";
	}
	/*if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}*/
	/*if(hqName!=''){
		sql+=" AND  T.HR_ID_NAME LIKE '%"+hqName+"%'";
	}*/
	if(userPhone!=''){
		sql+=" AND INSTR(T.DEVICE_NUMBER,'"+userPhone+"')>0 ";
	}
	
	/*if(channelAttrs!=''&& channelLevel!=''&&typeof(channelAttrs)!="undefined" && typeof(channelLevel)!="undefined"){
		sql+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
	}*/
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==3){
		sql+=" AND T.GROUP_ID_4 ='"+code+"'";
	}else{
		sql+=" 1=2";
	}
	
	return sql;
}
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var sql = getsql();
	var title=[["账期","地市名称","营服名称","渠道名称","渠道编码","用户编号","用户号码","套餐ID","套餐名称","套餐费","套餐包含语音","套餐包含流量","入网日期","套餐受理渠道","套餐受理渠道名称","入网类型","第一次低质态出账月份","出账金额（第一次）","第二次低质态出账月份 ","出账金额（第二次）","是否低质态用户","入网次月出账金额","入网次月通话时长","入网次月流量","入网第三月出账金额","入网第三月通话时长","入网第三月流量","入网第四月出账金额","入网第四月通话时长","入网第四月流量","已产生一次性佣金","已产生分成佣金","已产生奖罚佣金","已产生代收代办佣金","已产生的客户维系佣金","已产生的增值佣金","已产生的其他佣金"]];
	showtext = '质态管控查询报表-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////