var nowData = [];

var title=[["账期","地市名称","县份名称","渠道编码","渠道名称","渠道经理(HR)","渠道经理","直销发展人名称","BSS编码","直销发展人编码","渠道一级属性"]];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","GROUP_ID_4_NAME","HR_ID","NAME","BSS_NAME","BSS_CHNL_CODE","FD_CHNL_CODE","CHN_CDE_1_NAME"];
var orderBy = ' ORDER BY T2.GROUP_ID_1,T2.UNIT_ID';
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
	var channelCode = $("#channelCode").val();
	var group_id_4_name=$.trim($("#group_id_4_name").val());
	var fd_chnl_code = $("#fd_chnl_code").val();
	var chn_cde_1_name = $.trim($("#chn_cde_1_name").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();

	var sql=" SELECT T2.DEAL_DATE,                               "+
			"        T2.GROUP_ID_1_NAME,                         "+
			"        T2.UNIT_NAME,                               "+
			"        T.HQ_CHAN_CODE,                             "+
			"        T1.GROUP_ID_4_NAME,                         "+
			"        T2.HR_ID,                                   "+
			"        T2.NAME,                                    "+
			"        T.GROUP_ID_4_NAME BSS_NAME,                 "+
			"        T.BSS_CHNL_CODE,                            "+
			"        T.FD_CHNL_CODE,                             "+
			"        T1.CHN_CDE_1_NAME                           "+
			"   FROM PCDE.TB_CDE_CHANL_CODE T                    "+
			"   JOIN PCDE.TB_CDE_CHANL_HQ_CODE T1                "+
			"     ON (T.HQ_CHAN_CODE = T1.HQ_CHAN_CODE)          "+
			"   JOIN (SELECT T.HQ_CHAN_CODE,                     "+
			"                T.UNIT_NAME,                        "+
			"                T.HR_ID,                            "+
			"                T.NAME,                             "+
			"                T.DEAL_DATE,                        "+
			"                T.UNIT_ID,                          "+
			"                T.GROUP_ID_1,                       "+
			"                T.GROUP_ID_1_NAME                   "+
			"           FROM PORTAL.TAB_PORTAL_MOB_PERSON T      "+
			"          WHERE T.DEAL_DATE = '"+dealDate+"') T2    "+
			"     ON (T.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)          "+
			"  WHERE LENGTH(T.FD_CHNL_CODE) > 7                  ";

	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T2.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T2.UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" 1=2";
	}
	
	if(regionCode!=''){
		sql+=" AND  T2.GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND T2.UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(channelCode!=''){
		sql+=" AND T1.HQ_CHAN_CODE ='"+channelCode+"'";
	}
	
	if(group_id_4_name!=''){
		sql+=" AND  T.GROUP_ID_4_NAME LIKE '%"+group_id_4_name+"%'";
	}
	if(fd_chnl_code!=''){
		sql+=" AND T.FD_CHNL_CODE = '"+fd_chnl_code+"'";
	}
	if(chn_cde_1_name!=''){
		sql+=" AND  T1.CHN_CDE_1_NAME LIKE '%"+chn_cde_1_name+"%'";
	}
	
	return sql;
}
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql();
	showtext = '发展人渠道对应关系-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////