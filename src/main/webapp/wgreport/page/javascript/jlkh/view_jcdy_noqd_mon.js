var nowData = [];
var title=[["帐期","地市","地市编码","用户编号","用户号码","入网时间","操作员编号","部门编码","套餐编码","指标编码","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"]];
var field=["DEAL_DATE","地市","地市编码","用户编号","用户号码","入网时间","操作员编号","部门编码","套餐编码","ITEMCODE","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
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
	var region=$.trim($("#region").val());
	var userCode=$.trim($("#userCode").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = " FROM PMRT.VIEW_JCDY_NOQD_MON WHERE DEAL_DATE='"+time+"' ";
	
	if(regionCode!=''){
		sql+=" AND 地市编码 = '"+regionCode+"'";
	}
	if(userCode!=''){
		sql+=" AND 用户号码 like '%"+userCode+"%'";
	}
//	alert($("#orgLevel").val());
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and 地市编码 ="+code;
	}else {
		sql+=" and 地市编码="+region;
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
//	if (orderBy != '') {
//		sql += orderBy;
//	}
	sql+=" ORDER BY 地市编码";
	var s=  " SELECT DEAL_DATE ,"+
			"地市      ,"+
			"地市编码  ,"+
			"用户编号  ,"+
			"用户号码  ,"+
			"入网时间  ,"+
			"操作员编号,"+
			"部门编码  ,"+
			"套餐编码  ,"+
			"ITEMCODE  ,"+
			"指标描述  ,"+
			"面值      ,"+
			"发展人编码,"+
			"渠道编码  ,"+
			"总部编码  ,"+
			"原始积分   ";

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
	var time=$("#time").val();
	var region=$.trim($("#region").val());
	var userCode=$.trim($("#userCode").val());
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var regionCode=$.trim($("#regionCode").val());
	var sql=" SELECT DEAL_DATE ,"+
			"地市      ,"+
			"地市编码  ,"+
			"用户编号  ,"+
			"用户号码  ,"+
			"入网时间  ,"+
			"操作员编号,"+
			"部门编码  ,"+
			"套餐编码  ,"+
			"ITEMCODE  ,"+
			"指标描述  ,"+
			"面值      ,"+
			"发展人编码,"+
			"渠道编码  ,"+
			"总部编码  ,"+
			"原始积分  FROM  PMRT.VIEW_JCDY_NOQD_MON WHERE DEAL_DATE='"+time+"' ";
	
	//条件
	if(regionCode!=''){
		sql+=" AND 地市编码 = '"+regionCode+"'";
	}
	if(userCode!=''){
		sql+=" AND 用户号码 like '%"+userCode+"%'";
	}
	
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and 地市编码 ="+code;
	}else {
		sql+=" and 地市编码="+region;
	}
	sql+=" ORDER BY 地市编码";
	var title=[["帐期","地市","地市编码","用户编号","用户号码","入网时间","操作员编号","部门编码","套餐编码","指标编码","指标描述","面值","发展人编码","渠道编码","总部编码","原始积分"]];
	showtext = '未归集到渠道的积分-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////