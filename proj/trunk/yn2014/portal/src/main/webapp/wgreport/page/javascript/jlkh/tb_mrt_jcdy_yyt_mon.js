var nowData = [];
var title=[["账期","地市编码","地市名称","基层单元编码","基层单元名称","营业厅名称","HR编码","姓名","发展人编码","直销原始积分","直销渠道调节积分","直销区域调节积分","受理原始积分","受理服务调节积分","受理区域调节积分","调节后总积分"]];
var field= ["账期","地市编码","地市名称","基层单元编码","基层单元名称","营业厅名称","HR编码","姓名","发展人编码","直销原始积分","直销渠道调节积分","直销区域调节积分","受理原始积分","受理服务调节积分","受理区域调节积分","调节后总积分"];
var orderBy = '';
var report = null;
$(function() {
	getRegionName();
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
function getRegionName(){
	var sql="select distinct t.地市名称  regionName from PMRT.TB_MRT_JCDY_YYT_MON t where 1=1 ";
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
	var cityName=$.trim($("#regionName").val());
	var userName=$.trim($("#userName").val());
	var hallName=$.trim($("#hallName").val());
	var regionCode=$.trim($("#regionCode").val());
//条件
	var sql = " FROM PMRT.TB_MRT_JCDY_YYT_MON WHERE 1=1 ";
	if(time!=''){
		sql+=" AND 账期='"+time+"' ";
	}
	if(cityName!=''){
		sql+=" AND 地市名称 like '%"+cityName+"%'";
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
		sql+=" and 地市编码="+regionCode;
	}
	
	
	/*else if(orgLevel==3){
		//sql+=" and t.UNIT_ID='"+code+"'";
	//}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_MRT_JCDY_SALUNIT_DETAIL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+code+"'                                            ";
					tsql+="   and tt.deal_date = '"+time+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_ID in("+hrsql+")";
			}else{
				sql+=" and t.HR_ID='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_ID='"+hrId+"'";
		}
	}*/
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
	var s=" SELECT 账期            ,"+
			"地市编码        ,"+
			"地市名称        ,"+
			"基层单元编码    ,"+
			"基层单元名称    ,"+
			"营业厅名称      ,"+
			"HR编码          ,"+
			"姓名            ,"+
			"发展人编码      ,"+
			"直销原始积分    ,"+
			"直销渠道调节积分,"+
			"直销区域调节积分,"+
			"受理原始积分    ,"+
			"受理服务调节积分,"+
			"受理区域调节积分,"+
			"调节后总积分    ";
					

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
//function roundN(number,fractionDigits){   
//    with(Math){   
//        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
//    }   
//}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql=" SELECT 账期            ,"+
	"地市编码        ,"+
	"地市名称        ,"+
	"基层单元编码    ,"+
	"基层单元名称    ,"+
	"营业厅名称      ,"+
	"HR编码          ,"+
	"姓名            ,"+
	"发展人编码      ,"+
	"直销原始积分    ,"+
	"直销渠道调节积分,"+
	"直销区域调节积分,"+
	"受理原始积分    ,"+
	"受理服务调节积分,"+
	"受理区域调节积分,"+
	"调节后总积分     FROM PMRT.TB_MRT_JCDY_YYT_MON where 1=1 " ;
	
	var time=$("#time").val();
	var cityName=$.trim($("#regionName").val());
	var userName=$.trim($("#userName").val());
	var hallName=$.trim($("#hallName").val());
//条件
//	var sql = " FROM PMRT.TB_MRT_JCDY_YYT_MON WHERE 1=1 ";
	if(time!=''){
		sql+=" AND 账期='"+time+"' ";
	}
	if(cityName!=''){
		sql+=" AND 地市名称 like '%"+cityName+"%'";
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
		sql+=" and 地市编码="+regionCode;
	}
	
	sql+=" ORDER BY 地市编码";
	var title=[["账期","地市编码","地市名称","基层单元编码","基层单元名称","营业厅名称","HR编码","姓名","发展人编码","直销原始积分","直销渠道调节积分","直销区域调节积分","受理原始积分","受理服务调节积分","受理区域调节积分","调节后总积分"]];
	showtext = '营业厅积分汇总报表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////