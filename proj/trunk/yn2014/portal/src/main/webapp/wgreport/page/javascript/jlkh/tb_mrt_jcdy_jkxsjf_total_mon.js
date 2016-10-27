 var nowData = [];
 var title=[["账期","地市","基层单元","人员姓名","HR编码","原始积分","渠道调节积分","区域调节积分","积分金额"]];
 var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","SOURCE_CRE","HQ_CRE","UNIT_CRE","UNIT_MONEY"];
 var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		lock:5,
		/*css:[
		     {gt:4,css:LchReport.RIGHT_ALIGN},
		     {array:[22,25,30,32,41,42,48,50,51,52],css:LchReport.NORMAL_STYLE}
		    ],*/
		tableCss:{leftWidth:555},
		rowParams : [],// 第一个为rowId
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

	$("#searchBtn").click(function() {
		search(0);
	});
});

var pageSize = 19;
// 分页
function initPagination(totalCount) {
	$("#totalCount").html(totalCount);
	$("#pagination").pagination(totalCount, {
		callback : search,
		items_per_page : pageSize,
		link_to : "###",
		prev_text : '上页', // 上一页按钮里text
		next_text : '下页', // 下一页按钮里text
		num_display_entries : 5,
		num_edge_entries : 2
	});
}

// 列表信息
function search(pageNumber) {
	pageNumber = pageNumber + 1;
	var start = pageSize * (pageNumber - 1);
	var end = pageSize * pageNumber;
	
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hrId=$("#hrId").val();
	var code=$("#code").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var orgLevel=$("#orgLevel").val();
//条件
	var sql = getSelectSql();
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(name!=''){
		sql+=" AND T.USER_NAME like '%"+userName+"%'";
	}
//权限
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 ='"+code+"'";
	}else{
		var hrIds=_jf_power(hrId,dealDate);
		 if(hrIds&&hrIds!=""){
		   sql+=" AND T.HR_NO IN("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 ";	 
		 }
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	var orderBy=" ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	sql += orderBy;
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
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function getSelectSql(){
	var dealDate=$("#dealDate").val();
	var sql=
		" SELECT T.DEAL_DATE,                        "+
		"        T.AREA_NAME,                        "+
		"        T.UNIT_NAME,                        "+
		"        T.USER_NAME,                        "+
		"        T.HR_NO,                            "+
		"        T.SOURCE_CRE,                       "+
		"        T.HQ_CRE,                           "+
		"        T.UNIT_CRE,                         "+
		"        T.UNIT_MONEY                        "+
		"   FROM PMRT.TB_MRT_JCDY_JKXSJF_TOTAL_MON T "+
		"  WHERE T.DEAL_DATE ='"+dealDate+"'         ";
	return sql;
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var dealDate=$("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var hrId=$("#hrId").val();
	var code=$("#code").val();
	var unitCode=$("#unitCode").val();
	var userName=$.trim($("#userName").val());
	var orgLevel=$("#orgLevel").val();
//条件
	var sql = getSelectSql();
	if(regionCode!=''){
		sql+=" AND T.GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T.UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(name!=''){
		sql+=" AND T.USER_NAME like '%"+userName+"%'";
	}
//权限
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1 ='"+code+"'";
	}else{
		var hrIds=_jf_power(hrId,dealDate);
		 if(hrIds&&hrIds!=""){
		   sql+=" AND T.HR_NO IN("+hrIds+") ";
		 }else{
		   sql+=" AND 1=2 ";	 
		 }
	}
	var orderBy=" ORDER BY T.GROUP_ID_1, T.UNIT_ID";
	sql += orderBy;
	showtext = '直销人发展积分汇总-'+dealDate;
	downloadExcel(sql,title,showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////

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
