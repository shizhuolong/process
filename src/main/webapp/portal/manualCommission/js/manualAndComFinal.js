var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID_NAME","FD_CHNL_ID","DEV_CHNL_NAME","FEE","INIT_ID","BD_TYPE","IS_SUCCESS","REMARKS","ITEM"];
var title=[["账期","地市","基层单元","人员名","渠道编码","渠道名","金额","工单","备注","比对代码","比对结果","比对科目"]];
var orderBy='';	
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{eq:5,css:LchReport.RIGHT_ALIGN}],
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
	
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitId=$("#unitCode").val();
	var channelCode=$.trim($("#channelCode").val());
	var workOrder = $.trim($("#workOrder").val());
	var sql = 	"SELECT T.DEAL_DATE,                     "+
				"       T.GROUP_ID_1_NAME,               "+
				"       T.UNIT_NAME,                     "+
				"       T.HR_ID_NAME,                    "+
				"       T.FD_CHNL_ID,                    "+
				"       T.DEV_CHNL_NAME,                 "+
				"       T.FEE,                           "+
				"       T.INIT_ID,                       "+
				"       T.BD_TYPE,                       "+
				"       T.IS_SUCCESS,                    "+
				"       T.REMARKS,                       "+
				"       T.ITEM                           "+
				"  FROM PMRT.TAB_MRT_COMM_JZ_DATA_MON T  WHERE T.DEAL_DATE= '"+dealDate+"'";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitId!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitId)+") ";
	}
	if(channelCode!=''){
		sql+=" AND T.FD_CHNL_ID ='"+channelCode+"'";
	}
	if(workOrder!=''){
		sql+=" AND T.INIT_ID LIKE '%"+workOrder+"%'";
	}
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
 
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var title=[["账期","地市","基层单元","人员名","渠道编码","渠道名","金额","工单","备注","比对代码","比对结果","比对科目"]];
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitId=$("#unitCode").val();
	var channelCode=$.trim($("#channelCode").val());
	var workOrder = $.trim($("#workOrder").val());
	var sql = 	"SELECT T.DEAL_DATE,                     "+
	"       T.GROUP_ID_1_NAME,               "+
	"       T.UNIT_NAME,                     "+
	"       T.HR_ID_NAME,                    "+
	"       T.FD_CHNL_ID,                    "+
	"       T.DEV_CHNL_NAME,                 "+
	"       T.FEE,                           "+
	"       T.INIT_ID,                       "+
	"       T.BD_TYPE,                       "+
	"       T.IS_SUCCESS,                    "+
	"       T.REMARKS,                       "+
	"       T.ITEM                           "+
	"  FROM PMRT.TAB_MRT_COMM_JZ_DATA_MON T  WHERE T.DEAL_DATE= '"+dealDate+"'";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(code)+") ";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitId!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitId)+") ";
	}
	if(channelCode!=''){
		sql+=" AND T.FD_CHNL_ID ='"+channelCode+"'";
	}
	if(workOrder!=''){
		sql+=" AND T.INIT_ID LIKE '%"+workOrder+"%'";
	}
	
	showtext = '手工佣金+渠道补贴(最终)-'+dealDate;
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
