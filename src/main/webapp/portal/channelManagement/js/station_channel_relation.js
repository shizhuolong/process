var nowData = [];

var title=[["账期","地市名称","县份名称","渠道/部门编码","渠道/部门名称","渠道经理(HR)","渠道经理","工位","操作人","是否部门"]];		
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HQ_CHAN_CODE","HQ_CHAN_NAME","HR_ID","NAME","USER_CODE","USER_NAME","IS_DEFT"];
var orderBy = ' ORDER BY GROUP_ID_1';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		css:[/*{gt:3,css:LchReport.RIGHT_ALIGN}*/],
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
	var user_code=$.trim($("#user_code").val());
	var user_name = $.trim($("#user_name").val());
	var is_deft = $.trim($("#is_deft").val());
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();

	var sql=" SELECT DEAL_DATE,                                                              "+
			"        GROUP_ID_1_NAME,                                                        "+
			"        UNIT_NAME,                                                              "+
			"        HQ_CHAN_CODE,                                                           "+
			"        HQ_CHAN_NAME,                                                           "+
			"        HR_ID,                                                                  "+
			"        NAME,                                                                   "+
			"        USER_CODE,                                                              "+
			"        USER_NAME,                                                              "+
			"        IS_DEFT                                                                 "+
			"   FROM (SELECT T2.DEAL_DATE,                                                   "+
			"                NVL(T2.GROUP_ID_1, T4.GROUP_ID_1) GROUP_ID_1,                   "+
			"                NVL(T2.GROUP_ID_1_NAME, T4.GROUP_ID_1_NAME) GROUP_ID_1_NAME,    "+
			"                T2.UNIT_NAME,                                                   "+
			"                T2.UNIT_ID  ,                                                   "+
			"                NVL(T2.HQ_CHAN_CODE, T3.DEPT_ID) HQ_CHAN_CODE,                  "+
			"                NVL(T2.HQ_CHAN_NAME, T3.DEPT_NAME) HQ_CHAN_NAME,                "+
			"                T2.HR_ID,                                                       "+
			"                T2.NAME,                                                        "+
			"                T.USER_CODE,                                                    "+
			"                T.USER_NAME,                                                    "+
			"                CASE                                                            "+
			"                  WHEN T2.HQ_CHAN_NAME IS NULL THEN                             "+
			"                   '是'                                                         "+
			"                  ELSE                                                          "+
			"                   '否'                                                         "+
			"                END IS_DEFT                                                     "+
			"           FROM PTEMP.TAB_USER T                                                "+
			"           LEFT JOIN PCDE.TB_CDE_CHANL_CODE T0                                  "+
			"             ON (T.DEPT_ID = T0.BSS_CHNL_CODE)                                  "+
			"           LEFT JOIN PTEMP.TAB_DEPT T3                                          "+
			"             ON (T.DEPT_ID = T3.DEPT_ID)                                        "+
			"           LEFT JOIN (SELECT T.HQ_CHAN_CODE,                                    "+
			"                            T.UNIT_NAME,                                        "+
			"                            T.UNIT_ID,                                          "+
			"                            T.HR_ID,                                            "+
			"                            T.NAME,                                             "+
			"                            T.DEAL_DATE,                                        "+
			"                            T.GROUP_ID_1,                                       "+
			"                            T.GROUP_ID_1_NAME,                                  "+
			"                            T.HQ_CHAN_NAME                                      "+
			"                       FROM PORTAL.TAB_PORTAL_MOB_PERSON T                      "+
			"                      WHERE T.DEAL_DATE = '"+dealDate+"') T2                    "+
			"             ON (T0.HQ_CHAN_CODE = T2.HQ_CHAN_CODE)                             "+
			"           JOIN PCDE.TB_CDE_REGION_CODE T4                                      "+
			"             ON (T.AREAID = T4.BSS_REGION_CODE))                                "+
			"  WHERE (DEAL_DATE = '"+dealDate+"'                                              "+
			"     OR DEAL_DATE IS NULL  )                                                     ";

	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	}else{
		sql+=" 1=2";
	}
	
	if(regionCode!=''){
		sql+=" AND  GROUP_ID_1='"+regionCode+"'";
	}
	if(unitCode!=''){
		sql+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}
	if(channelCode!=''){
		sql+=" AND HQ_CHAN_CODE ='"+channelCode+"'";
	}
	
	if(user_code!=''){
		sql+=" AND  USER_CODE LIKE '%"+user_code+"%'";
	}
	if(user_name!=''){
		sql+=" AND USER_NAME LIKE '%"+user_name+"%'";
	}
	if(is_deft!=''){
		sql+=" AND IS_DEFT ='"+is_deft+"'";
	}
	
	return sql;
}
////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var dealDate=$("#dealDate").val();

	var sql = getsql();
	showtext = '工位渠道对应关系-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////