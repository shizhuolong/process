<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="org.apdplat.module.security.model.Org"%>
<%@page import="org.apdplat.module.security.service.UserHolder"%>
<%@page import="org.apdplat.module.security.model.User"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String hrNo=(String)request.getParameter("hrNo");
	String time=(String)request.getParameter("time");
	String itemCode=(String)request.getParameter("itemCode");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户发展详细列表</title>
<link href="<%=request.getContextPath()%>/platform/theme/style/public.css" rel="stylesheet" type="text/css" />
<link href="<%=request.getContextPath()%>/report/devIncome/css/lch-report.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/jpagination.css" />
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/page/js/date/skin/WdatePicker.css"> 
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/pagination/jpagination.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/page/js/date/WdatePicker.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/lch-report.js"></script>

<!-- script type="text/javascript" src="<%=request.getContextPath()%>/report/devIncome/js/income_and_dev_day_list.js"></script-->
</head>
<body class="" style="overflow-x:auto;">
	<input type="hidden" id="ctx" value="<%=request.getContextPath()%>">
	<input type="hidden" id="hrNo" value="<%=hrNo%>">
	<input type="hidden" id="time" value="<%=time%>">
	<input type="hidden" id="itemCode" value="<%=itemCode%>">
	
		<form id="searchForm" method="post">
			<table width="100%" style="border:none;">
				<tr height="35px">
					<td width="1%" style="background-color:LightBlue;"></td>
					<td width="20%" style="background-color:LightBlue;border:none;"><a class="default-btn" href="#" id="exportBtn"
						onclick="downsAll()">导出</a></td>
				</tr>
			</table>
		</form>
		<div id="lchcontent"></div>
		<div class="page_count">
			<div class="page_count_left">
				共有 <span id="totalCount"></span> 条数据
			</div>
			<div class="page_count_right">
				<div id="pagination"></div>
			</div>
		</div>

</body>
<script>
var nowData = [];
var field = ["DEAL_DATE","SUBSCRIPTION_ID","SERVICE_NUM","JOIN_DATE","OPERATOR_ID","PRODUCT_ID","PRODUCT_NAME","DEVELOPER_ID","HQ_CHANL_CODE"];
var title=[["账期","用户编码","用户号码","入网时间","操作员编码","套餐编码","套餐名称","发展人编码","渠道编码"]];
var orderBy = ' order by DEAL_DATE asc ';
var report = null;
$(function() {
	report = new LchReport({
		title :title,
		field : field,
		rowParams : [],//第一个为rowId
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
});

var pageSize = 10;
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
	var hrNo = $("#hrNo").val();
	var time = $("#time").val();
	var itemCode = $("#itemCode").val();
	var sql = "";
	sql+=" SELECT                                                                              ";
	sql+="     t.deal_date ,                                                                   ";
	sql+="     t.subscription_id,                                                              ";
	sql+="     t.service_num,                                                                  ";
	sql+="     TO_CHAR(t.join_date, 'yyyy-MM-dd hh24:SS:mm') join_date,                        ";
	sql+="     t.operator_id,                                                                  ";
	sql+="     t.product_id,                                                                   ";
	sql+="     T.PRODUCT_NAME,                                                                 ";
	sql+="     t.developer_id,                                                                 ";
	sql+="     t.hq_chanl_code                                                                ";
	sql+=" FROM (SELECT B.HR_NO, B.AREA_NAME, B.UNIT_NAME, B.USER_NAME, A.*                    ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (select group_id_1_name AREA_NAME,                                   ";
	sql+="                        unit_name       UNIT_NAME,                                   ";
	sql+="                        name            USER_NAME,                                   ";
	sql+="                        hr_id           HR_NO,                                       ";
	sql+="                        USER_CODE       USER_CODE                                    ";
	sql+="                   from portal.tab_portal_mag_person) b                              ";
	sql+="          WHERE A.OPERATOR_ID = B.USER_CODE                                          ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"'                               ";
	sql+="         UNION ALL                                                                   ";
	sql+="         SELECT B.HR_NO, B.GROUP_ID_1_NAME, B.UNIT_NAME, B.NAME, A.*                 ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (SELECT group_id_1_name,                                             ";
	sql+="                        unit_name,                                                   ";
	sql+="                        name,                                                        ";
	sql+="                        hr_id HR_NO,                                                 ";
	sql+="                        HQ_CHAN_CODE                                                 ";
	sql+="                   FROM PORTAL.TAB_PORTAL_MOB_PERSON) B                              ";
	sql+="          WHERE A.HQ_CHANL_CODE = B.HQ_CHAN_CODE                                     ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"'                               ";
	sql+="            AND A.HQ_CHANL_CODE NOT IN                                               ";
	sql+="                (SELECT HQ_CHAN_CODE FROM portal.tab_portal_mag_person)              ";
	sql+="         UNION ALL                                                                   ";
	sql+="         SELECT B.HR_NO, B.GROUP_ID_1_NAME, B.UNIT_NAME, B.NAME, A.*                 ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (SELECT group_id_1_name,                                             ";
	sql+="                        unit_name,                                                   ";
	sql+="                        name,                                                        ";
	sql+="                        hr_id HR_NO,                                                 ";
	sql+="                        DEVELOPER                                                    ";
	sql+="                   FROM PORTAL.TAB_PORTAL_GRP_PERSON) B                              ";
	sql+="          WHERE (A.DEVELOPER_ID = B.DEVELOPER or                                     ";
	sql+="                A.fd_chanl_code = B.developer)                                       ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"') t  where t.hr_no='"+hrNo+"'                              ";

	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if (cdata && cdata.length) {
		total = cdata[0].TOTAL;
	} else {
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
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var hrNo = $("#hrNo").val();
	var time = $("#time").val();
	var itemCode = $("#itemCode").val();
//上网卡的表TB_MRT_JCDY_SWK_DEV_DAY ，
	var sql = "";
	sql+=" SELECT                                                                              ";
	sql+="     t.deal_date ,                                                                   ";
	sql+="     t.subscription_id,                                                              ";
	sql+="     t.service_num,                                                                  ";
	sql+="     TO_CHAR(t.join_date, 'yyyy-MM-dd hh24:SS:mm') join_date,                        ";
	sql+="     t.operator_id,                                                                  ";
	sql+="     t.product_id,                                                                   ";
	sql+="     T.PRODUCT_NAME,                                                                 ";
	sql+="     t.developer_id,                                                                 ";
	sql+="     t.hq_chanl_code                                                                ";
	sql+=" FROM (SELECT B.HR_NO, B.AREA_NAME, B.UNIT_NAME, B.USER_NAME, A.*                    ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (select group_id_1_name AREA_NAME,                                   ";
	sql+="                        unit_name       UNIT_NAME,                                   ";
	sql+="                        name            USER_NAME,                                   ";
	sql+="                        hr_id           HR_NO,                                       ";
	sql+="                        USER_CODE       USER_CODE                                    ";
	sql+="                   from portal.tab_portal_mag_person) b                              ";
	sql+="          WHERE A.OPERATOR_ID = B.USER_CODE                                          ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"'                               ";
	sql+="         UNION ALL                                                                   ";
	sql+="         SELECT B.HR_NO, B.GROUP_ID_1_NAME, B.UNIT_NAME, B.NAME, A.*                 ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (SELECT group_id_1_name,                                             ";
	sql+="                        unit_name,                                                   ";
	sql+="                        name,                                                        ";
	sql+="                        hr_id HR_NO,                                                 ";
	sql+="                        HQ_CHAN_CODE                                                 ";
	sql+="                   FROM PORTAL.TAB_PORTAL_MOB_PERSON) B                              ";
	sql+="          WHERE A.HQ_CHANL_CODE = B.HQ_CHAN_CODE                                     ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"'                               ";
	sql+="            AND A.HQ_CHANL_CODE NOT IN                                               ";
	sql+="                (SELECT HQ_CHAN_CODE FROM portal.tab_portal_mag_person)              ";
	sql+="         UNION ALL                                                                   ";
	sql+="         SELECT B.HR_NO, B.GROUP_ID_1_NAME, B.UNIT_NAME, B.NAME, A.*                 ";
	sql+="           FROM PMRT.TB_MRT_JCDY_SWK_DEV_DAY A,                                      ";
	sql+="                (SELECT group_id_1_name,                                             ";
	sql+="                        unit_name,                                                   ";
	sql+="                        name,                                                        ";
	sql+="                        hr_id HR_NO,                                                 ";
	sql+="                        DEVELOPER                                                    ";
	sql+="                   FROM PORTAL.TAB_PORTAL_GRP_PERSON) B                              ";
	sql+="          WHERE (A.DEVELOPER_ID = B.DEVELOPER or                                     ";
	sql+="                A.fd_chanl_code = B.developer)                                       ";
	sql+="            AND SUBSTR(A.DEAL_DATE, 1, 6) = '"+time+"') t  where t.hr_no='"+hrNo+"'                              ";


	if (orderBy != '') {
		sql += orderBy;
	}

	showtext = '用户上网卡发展详细列表-' + time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////
</script>
</html>