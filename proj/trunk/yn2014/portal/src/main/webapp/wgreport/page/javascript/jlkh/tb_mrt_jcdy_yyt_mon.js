var nowData = [];
var title=[["地市名称","账期","基层单元编码","基层单元名称","营业厅编码","营业厅名称","HR编码","姓名","发展人编码","直销原始积分","直销渠道调节积分","直销区域调节积分","维系原始积分","维系渠道调节积分","维系区域调节积分","受理原始积分","受理服务调节积分","受理区域调节积分","调节后总积分"]];
var field= ["地市名称","账期","基层单元编码","基层单元名称","营业厅编码","营业厅名称","HR编码","姓名","发展人编码","直销原始积分","直销渠道调节积分","直销区域调节积分","维系原始积分","维系渠道调节积分","维系区域调节积分","受理原始积分","受理服务调节积分","受理区域调节积分","调节后总积分"];
var orderBy = '';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:8,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
//			orderBy = " order by " + field[index] + " " + type + " ";
//			search(0);
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
	var cityCode=$.trim($("#regionCode").val());
	var userName=$.trim($("#userName").val());
	var hallName=$.trim($("#hallName").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = " FROM PMRT.TB_MRT_JCDY_YYT_MON WHERE 1=1 ";
	if(time!=''){
		sql+=" AND 账期='"+time+"' ";
	}
	if(cityCode!=''){
		sql+=" AND 地市编码 = '"+cityCode+"'";
	}
	if(hallName!=''){
		sql+=" AND 营业厅名称 like '%"+hallName+"%'";
	}
	if(userName!=''){
		sql+=" AND 姓名 like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and 地市编码 ="+code;
	}else {
		/*sql+=" and 地市编码="+regionCode;*/
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and HR编码  in("+hrIds+") ";
		 }
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
	sql+=" ORDER BY 地市编码 ";
	var s="SELECT 账期,地市名称,基层单元编码,基层单元名称,营业厅编码,营业厅名称,HR编码,姓名,发展人编码,直销原始积分,直销渠道调节积分,直销区域调节积分,维系原始积分,维系渠道调节积分,维系区域调节积分,受理原始积分,受理服务调节积分,受理区域调节积分,调节后总积分  ";

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
	/*$(".page_count").width($("#lch_DataHead").width());*/

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="SELECT 账期,地市名称,基层单元编码,基层单元名称,营业厅编码,营业厅名称,HR编码,姓名,发展人编码,直销原始积分,直销渠道调节积分,直销区域调节积分,维系原始积分,维系渠道调节积分,维系区域调节积分,受理原始积分,受理服务调节积分,受理区域调节积分,调节后总积分   FROM PMRT.TB_MRT_JCDY_YYT_MON where 1=1 " ;
	var time=$("#time").val();
	var cityCode=$.trim($("#regionCode").val());
	var userName=$.trim($("#userName").val());
	var hallName=$.trim($("#hallName").val());
//条件
//	var sql = " FROM PMRT.TB_MRT_JCDY_YYT_MON WHERE 1=1 ";
	if(time!=''){
		sql+=" AND 账期='"+time+"' ";
	}
	if(cityCode!=''){
		sql+=" AND 地市编码  '"+cityCode+"'";
	}
	if(userName!=''){
		sql+=" AND 姓名 like '%"+userName+"%'";
	}
	if(hallName!=''){
		sql+=" AND 营业厅名称 like '%"+hallName+"%'";
	}
	
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	var regionCode=$.trim($("#regionCode").val());
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and 地市编码 ="+code;
	}else {
		/*sql+=" and 地市编码="+regionCode;*/
		 var hrIds=_jf_power(hrId,time);
		 if(hrIds!=""){
		   sql+=" and HR编码  in("+hrIds+") ";
		 }
	}
	
	sql+=" ORDER BY 地市编码";
	showtext = '营业厅积分汇总报表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////