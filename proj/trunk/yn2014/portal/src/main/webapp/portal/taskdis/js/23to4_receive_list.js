var nowData = [];
var curPage=0;
var title=[["操作","分配批次","营服名称","用户号码","用户编码","前三月平均缴费","终端类型","终端品牌","终端型号","发展渠道","渠道编码","入网时间","套餐ID","套餐名称"]];
var field=["STATE","BATCH_NO","UNIT_NAME","DEVICE_NUMBER","SUBSCRIPTION_ID","LAST_3_PAY","TERMINAL_TPYE","TERMINAL_DOM","TERMINAL_MOD","DEV_CHNL","DEV_CHNL_NAME","INNET_DATE","PRODUCT_ID","PRODUCT_NAME"];
var report = null;
function listProTypes(){
	var $proType = $("#proType");
	var sql = " SELECT distinct T.PRO_TYPE FROM PODS.TB_2G_ZD_TO_4G_LIST T  WHERE T.PRO_TYPE is not null ";
	
	var d=query(sql);
	if (d) {
		var h = '';
		for (var i = 0; i < d.length; i++) {
			h += '<option value="' + d[i].PRO_TYPE + '">' + d[i].PRO_TYPE + '</option>';
		}
		var $h = $(h);
		$proType.empty().append($h);
	} else {
		alert("获取任务类型失败");
	}
}
LchReport.prototype.isNull=function(obj){
	if(obj == undefined || obj == null || obj == '') {
		return '';
	}
	return obj;
}
function changeState(a){
	var subId=$(a).parent().parent().attr("subscription_id");
	var d=query("update PODS.TB_2G_ZD_TO_4G_LIST T set T.state='1' where T.SUBSCRIPTION_ID='"+subId+"'");
	search(curPage);
}
$(function() {
	listProTypes();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : ["SUBSCRIPTION_ID"],//第一个为rowId
		content : "lchcontent",
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
	curPage=pageNumber;
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var userId=$("#userId").val();
	var deviceNumber=$("#deviceNumber").val();
	var subscriptionId=$("#subscriptionId").val();
	var state=$("#state").val();
	var proType=$("#proType").val();
	var sql="";
	sql+="  SELECT D.BATCH_NO                                    ";
	sql+="        ,T.UNIT_NAME                                   ";
	sql+="        ,T.DEVICE_NUMBER                               ";
	sql+="        ,T.SUBSCRIPTION_ID                             ";
	sql+="        ,T.PRODUCT_ID                                  ";
	sql+="        ,T.PRODUCT_NAME                                ";
	sql+="        ,ROUND(T.LAST_3_PAY,2)LAST_3_PAY               ";
	sql+="        ,T.TERMINAL_TPYE                               ";
	sql+="        ,T.TERMINAL_DOM                                ";
	sql+="        ,T.TERMINAL_MOD                                ";
	sql+="        ,T.DEV_CHNL                                    ";
	sql+="        ,T.DEV_CHNL_NAME                               ";
	sql+="        ,T.INNET_DATE                                  ";
	sql+="        ,T.STATE                                       ";
	sql+="  FROM PODS.TB_2G_ZD_TO_4G_LIST T                      ";
	sql+="  ,PODS.TAB_ODS_23TO4_TRAD_LIST D                      ";
	sql+="  where T.SUBSCRIPTION_ID=D.SUBSCRIPTION_ID            ";
	sql+="  AND D.PRO_TYPE='"+proType+"'                         ";
	sql+="  AND D.USERID='"+userId+"'                            ";                                                                                         
	if(deviceNumber!=''){
		sql+=" and T.DEVICE_NUMBER ='"+deviceNumber+"'           ";
	}
	if(subscriptionId!=''){
		sql+=" and T.SUBSCRIPTION_ID ='"+subscriptionId+"'       ";
	}
	if(state!=''){
		sql+=" and T.STATE ='"+state+"'                          ";
	}
	sql+="   order by  D.BATCH_NO,T.INNET_DATE desc              ";
	
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area=='0'){
			$(this).find("TD:eq(0)").empty().html("<a href='javascript:void(0)' onclick='changeState(this)'>阅</a>");
		}else{
			$(this).find("TD:eq(0)").empty().text("已阅");
		}
	});
}
function exportAll(){
	var userId=$("#userId").val();
	var deviceNumber=$("#deviceNumber").val();
	var subscriptionId=$("#subscriptionId").val();
	var state=$("#state").val();
	var proType=$("#proType").val();
	var sql="";
	sql+="  SELECT D.BATCH_NO                                    ";
	sql+="        ,T.UNIT_NAME                                   ";
	sql+="        ,T.DEVICE_NUMBER                               ";
	sql+="        ,T.SUBSCRIPTION_ID                             ";
	sql+="        ,T.PRODUCT_ID                                  ";
	sql+="        ,T.PRODUCT_NAME                                ";
	sql+="        ,ROUND(T.LAST_3_PAY,2)LAST_3_PAY               ";
	sql+="        ,T.TERMINAL_TPYE                               ";
	sql+="        ,T.TERMINAL_DOM                                ";
	sql+="        ,T.TERMINAL_MOD                                ";
	sql+="        ,T.DEV_CHNL                                    ";
	sql+="        ,T.DEV_CHNL_NAME                               ";
	sql+="        ,T.INNET_DATE                                  ";
	sql+="        ,T.STATE                                       ";
	sql+="  FROM PODS.TB_2G_ZD_TO_4G_LIST T                      ";
	sql+="  ,PODS.TAB_ODS_23TO4_TRAD_LIST D                      ";
	sql+="  where T.SUBSCRIPTION_ID=D.SUBSCRIPTION_ID            ";
	sql+="  AND D.PRO_TYPE='"+proType+"'                         ";
	sql+="  AND D.USERID='"+userId+"'                            ";                                                                                         
	if(deviceNumber!=''){
		sql+=" and T.DEVICE_NUMBER ='"+deviceNumber+"'           ";
	}
	if(subscriptionId!=''){
		sql+=" and T.SUBSCRIPTION_ID ='"+subscriptionId+"'       ";
	}
	if(state!=''){
		sql+=" and T.STATE ='"+state+"'                          ";
	}
	sql+="   order by  D.BATCH_NO,T.INNET_DATE desc              ";
	
	var title=[["分配批次","营服名称","用户号码","用户编码","前三月平均缴费","终端类型","终端品牌","终端型号","发展渠道","渠道编码","入网时间","套餐ID","套餐名称"]];
	var field=["BATCH_NO","UNIT_NAME","DEVICE_NUMBER","SUBSCRIPTION_ID","LAST_3_PAY","TERMINAL_TPYE","TERMINAL_DOM","TERMINAL_MOD","DEV_CHNL","DEV_CHNL_NAME","INNET_DATE","PRODUCT_ID","PRODUCT_NAME"];
	sql="select "+field.join(",")+" from ("+sql+") ";
	downloadExcel(sql,title,"分配明细");
}