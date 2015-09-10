var nowData = [];
var title=["账期","地市","地市编码","用户编号","用户号码","入网时间","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","ITEMCODE","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"];
var field=["DEAL_DATE","REGION_NAME_ABBR","GROUP_ID_1","用户编号","用户号码","入网时间","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","ITEMCODE","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"];
var orderBy = '';
var report = null;
$(function() {
	getRegionName();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:10,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
			//search(0);
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
function getRegionName(){
	var sql="select distinct t.REGION_NAME_ABBR regionName from PMRT.VIEW_JCDY_NODEVELOPER_ZZX t where 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	//var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and 1=2";
	}
	var result=query(sql);
	 var html="";
	if(result.length==1){
		html+="<option selected value="+result[0].REGIONNAME+">"+result[0].REGIONNAME+"</option>";
		$("#regionName").empty().append($(html));
		getUnitName($("#regionName"));
	}else{
		 html +="<option value=''>全部</option>";
		    for(var i=0;i<result.length;i++){
		    	html+="<option value="+result[i].REGIONNAME+">"+result[i].REGIONNAME+"</option>";
		    }
	}
    $("#regionName").empty().append($(html));
}					 
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
	
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var userNumber=$.trim($("#userNumber").val());
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var regionCode=$("#regionCode").val();
//条件
	var sql = " FROM PMRT.VIEW_JCDY_NODEVELOPER_ZZX WHERE 1=1 ";
	if(time!=''){
		sql+=" AND DEAL_DATE='"+time+"' ";
	}
	if(regionName!=''){
		sql+=" AND REGION_NAME_ABBR like '%"+regionName+"%'";
	}
	if(userNumber!=''){
		sql+=" AND 用户号码  like '%"+userNumber+"%'";
	}
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"' ";
	}else{
		sql+=" AND GROUP_ID_1='"+regionCode+"' ";
	}
	var csql = sql;
	var cdata = query("select count(*) total" + csql);
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	orderBy=" ORDER BY GROUP_ID_1";
	sql += orderBy;
	var s="SELECT * ";                                                                           
	sql = s + sql;
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
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql= "SELECT * FROM  pmrt.VIEW_JCDY_NODEVELOPER_ZZX where 1=1 ";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var userNumber=$.trim($("#userNumber").val());
	var regionCode=$("#regionCode").val();
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	//条件
	if(time!=''){
		sql+=" AND DEAL_DATE='"+time+"' ";
	}
	if(regionName!=''){
		sql+=" AND REGION_NAME_ABBR like '%"+regionName+"%'";
	}
	if(userNumber!=''){
		sql+=" AND 用户号码  like '%"+userNumber+"%'";
	}
    if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"' ";
	}else{
		sql+=" AND GROUP_ID_1='"+regionCode+"' ";
	}
	sql+=" order by GROUP_ID_1";
	var title=[["DEAL_DATE","REGION_NAME_ABBR","GROUP_ID_1","用户编号","用户号码","入网时间","OPERATOR_ID","OFFICE_ID","PRODUCT_ID","ITEMCODE","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"]];
	showtext = '未归集到发展人的专线积分-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////