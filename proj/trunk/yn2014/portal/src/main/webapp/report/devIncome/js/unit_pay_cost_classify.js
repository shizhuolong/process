var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","BUS_NAME","HQ_CHAN_CODE","OPERATE_TYPE","PAYMENT_WAY","USER_CODE","PAYMENT_NUM5","PAYMENT_TOTAL5","PAYMENT_NUM510","PAYMENT_TOTAL510","PAYMENT_NUM1020","PAYMENT_TOTAL1020","PAYMENT_NUM20","PAYMENT_TOTAL20","PAYMENT_NUM","PAYMENT_TOTAL"];
var title=[
           	["账期","地市","营业厅名称","渠道编码","经营模式","缴费方式","营业员工位","0-50元","","50-100元","","100-200元","","200元以上","","小计",""],	
           	["","","","","","","","笔次","金额","笔次","金额","笔次","金额","笔次","金额","笔次","金额"]
           ];
var report = null;
$(function() {
	//获取缴费方式
	getPayMode();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:6,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
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
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	var sql =getSql();

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

function getSql(){
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var channelCode=$.trim($("#channelCode").val());
	//经营模式
	var operType=$.trim($("#operType").val());
	//缴费方式
	var payMode=$.trim($("#payMode").val());
	//营业员工位
	var userCode=$.trim($("#userCode").val());
	
	var sql = 	"SELECT T.DEAL_DATE                                        ,  "+
				"       T.GROUP_ID_1_NAME                                  ,  "+
				"       T.BUS_NAME                                         ,  "+
				"       T.HQ_CHAN_CODE                                     ,  "+
				"       T.OPERATE_TYPE                                     ,  "+
				"       T.PAYMENT_WAY                                      ,  "+
				"       T.USER_CODE                                        ,  "+
				"       NVL(T.PAYMENT_NUM5       ,0)  AS PAYMENT_NUM5      ,  "+
				"       NVL(T.PAYMENT_TOTAL5     ,0)  AS PAYMENT_TOTAL5    ,  "+
				"       NVL(T.PAYMENT_NUM510     ,0)  AS PAYMENT_NUM510    ,  "+
				"       NVL(T.PAYMENT_TOTAL510   ,0)  AS PAYMENT_TOTAL510  ,  "+
				"       NVL(T.PAYMENT_NUM1020    ,0)  AS PAYMENT_NUM1020   ,  "+
				"       NVL(T.PAYMENT_TOTAL1020  ,0)  AS PAYMENT_TOTAL1020 ,  "+
				"       NVL(T.PAYMENT_NUM20      ,0)  AS PAYMENT_NUM20     ,  "+
				"       NVL(T.PAYMENT_TOTAL20    ,0)  AS PAYMENT_TOTAL20   ,  "+
				"       NVL(T.PAYMENT_NUM        ,0)  AS PAYMENT_NUM       ,  "+
				"       NVL(T.PAYMENT_TOTAL      ,0)  AS PAYMENT_TOTAL        "+
				"FROM PMRT.TAB_MRT_BUS_PAYMENT_CLASS_MON T                    "+
				" WHERE T.DEAL_DATE = '"+dealDate+"'	         ";
	


	// 权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.HQ_CHAN_CODE ='"+channelCode+"'";
	}
	if(operType!=''){
		sql+=" AND T.OPERATE_TYPE ='"+operType+"'";
	}
	if(payMode!=''){
		sql+=" AND T.PAYMENT_WAY ='"+payMode+"'";
	}
	if(userCode!=''){
		sql+=" AND T.USER_CODE ='"+userCode+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID  ";
	return sql;
}
 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();
	var title=[
	           	["账期","地市","营业厅名称","渠道编码","经营模式","缴费方式","营业员工位","0-50元","","50-100元","","100-200元","","200元以上","","小计",""],	
	           	["","","","","","","","笔次","金额","笔次","金额","笔次","金额","笔次","金额","笔次","金额"]
	           ];
	var sql=getSql();
	showtext = '营业厅缴费分类展现-'+dealDate;
	downloadExcel(sql,title,showtext);
}

//导出明细
function downsDetailAll(){
	var title=[["账期","州市","营业厅名称","渠道编码","经营模式","缴费方式","营业员工位","用户编码","用户号码","缴费金额"]];

	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var channelCode=$.trim($("#channelCode").val());
	//经营模式
	var operType=$.trim($("#operType").val());
	//缴费方式
	var payMode=$.trim($("#payMode").val());
	//营业员工位
	var userCode=$.trim($("#userCode").val());
	
	var code =$("#code").val();
	var sql = 	"SELECT T.DEAL_DATE,                          "+
				"       T.GROUP_ID_1_NAME,                    "+
				"       T.BUS_NAME,                           "+
				"       T.HQ_CHAN_CODE,                       "+
				"       T.OPERATE_TYPE,                       "+
				"       T.PAYMENT_WAY,                        "+
				"       T.USER_CODE,                          "+
				"       T.SUBSCRIPTION_ID,                    "+
				"       NVL(T.DEVICE_NUMBER,0) AS DEVICE_NUMBER,"+
				"       NVL(T.PAYMENT_MONEY,0) AS PAYMENT_MONEY "+
				"  FROM PMRT.TAB_MRT_BUS_PAYMENT_DETAIL_MON T "+
				" WHERE T.DEAL_DATE = '"+dealDate+"'	      ";

	// 权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
	
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" AND 1=2";
	}
	// 条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(channelCode!=''){
		sql+=" AND T.HQ_CHAN_CODE ='"+channelCode+"'";
	}
	if(operType!=''){
		sql+=" AND T.OPERATE_TYPE ='"+operType+"'";
	}
	if(payMode!=''){
		sql+=" AND T.PAYMENT_WAY ='"+payMode+"'";
	}
	if(userCode!=''){
		sql+=" AND T.USER_CODE ='"+userCode+"'";
	}
	sql+=" ORDER BY T.GROUP_ID_1,T.UNIT_ID  ";

	showtext = '营业厅缴费分类展现明细-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////



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

/**
 * 获取缴费方式
 */
function getPayMode(){

    var sql=" SELECT DISTINCT T.PAYMENT_WAY FROM PMRT.TAB_MRT_BUS_PAYMENT_CLASS_MON T WHERE 1=1  ";
    var orgLevel=$("#orgLevel").val();
    var code=$("#code").val();
    var region =$("#region").val();
    if(orgLevel==1){
        sql+="";
    }else{
        sql+=" and T.GROUP_ID_1='"+region+"'";
    }
    var d=query(sql);
    if (d) {
        var h = '';
        if (d.length == 1) {
            h += '<option value="' + d[0].PAYMENT_WAY
                    + '" selected >'
                    + d[0].PAYMENT_WAY + '</option>';
        } else {
            h += '<option value="" selected>请选择</option>';
            for (var i = 0; i < d.length; i++) {
                h += '<option value="' + d[i].PAYMENT_WAY + '">' + d[i].PAYMENT_WAY + '</option>';
            }
        }
        var $area = $("#payMode");
        var $h = $(h);
        $area.empty().append($h);
    } else {
        alert("获取缴费方式失败");
    }

}