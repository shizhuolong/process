var nowData = [];
var title;
var downSql="";
var report = null;
var field=null;
$(function() {
	field=["PAY_CHANL_ID","PAY_CHANL_NAME","DEV_CHANL_ID","DEV_CHANL_NAME","SVCNUM","SUBSCRBID","COMMITEM","ITEMNAME","RULE_NAME","MOD_NAME","CHN_CDE_1_NAME","CHN_CDE_4_NAME","","REMARK"];
	field[field.length-2]=tbcode;
	search(0);
	$("#searchBtn").click(function(){
		search(0);
	});
});

var pageSize = 15;
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
	
	var queryStartDate=$("#startDate").val();
	var queryEndDate=$("#endDate").val();
	var channel_query=$.trim($("#channel_query").val());
	var rule_name=$.trim($("#rule_name").val());
	var itemname=$.trim($("#itemname").val());
	var code=$("#code").val(); 
	var level=$("#level").val(); 
	var orgCode=$("#orgCode").val(); 
	var orgLevel=$("#orgLevel").val(); 
	
	var sql = "SELECT PAY_CHANL_ID,PAY_CHANL_NAME," +
	"DEV_CHANL_ID,DEV_CHANL_NAME," +
	"SVCNUM,SUBSCRBID,COMMITEM," +
	"ITEMNAME,DECODE(TRIM(GROUP_ID_1),'16001',NVL(OTHERNAME,RULE_NAME),RULE_NAME) RULE_NAME," +
	"MOD_NAME,CHN_CDE_1_NAME,CHN_CDE_4_NAME ";
	
	var table = " FROM PMRT.TB_MRT_COMM_AGENT_DETAIL_CY WHERE DEAL_DATE BETWEEN "+queryStartDate+" AND "+queryEndDate;
	if(tbcode != null && tbcode != "") {
		sql+= ",ROUND(" + tbcode + ",2) "+tbcode+",REMARK "+ table +" AND "+tbcode+" != '0' ";
	}else {
		sql+= "'' "+tbcode+",REMARK "+ table;
	}
	
	if(channel_query!=null && ""!=channel_query && channel_query != undefined){
		sql += " AND DEV_CHANL_NAME LIKE '%"+channel_query+"%'";
	}
	
	if(chanlName != null && chanlName != "") {
		sql+=" AND GROUP_ID_4_NAME LIKE'%"+chanlName+"%'";
	}
	
	//渠道属性过滤
	if(!channelAttrs&&!channelLevel&&channelAttrs!=''&& channelLevel!=''){
		sql+=" AND CHN_CDE_"+channelLevel+" IN("+channelAttrs+")";
	}
	
	if(rule_name!=''){
		sql+=" AND RULE_NAME LIKE '%"+rule_name+"%'";
	}
	
	if(itemname!=''){
		sql+=" AND ITEMNAME LIKE '%"+itemname+"%'";
	}
	
	if(code!=null&&code!=""){
		if(level=="1"){
			sql+=" AND GROUP_ID_0='"+code+"'";
		}else if(level=="2"){
			sql+=" AND GROUP_ID_1='"+code+"'";
		}else if(level=="3"){
			sql+=" AND UNIT_ID='"+code+"'";
		}else{
			sql+=" AND GROUP_ID_4='"+code+"'";
		}
	}
	//权限
	if(orgLevel==1){
		sql+=" AND GROUP_ID_0='"+orgCode+"'";
	}else if(orgLevel==2){
		sql+=" AND GROUP_ID_1='"+orgCode+"'";
	}else if(orgLevel==3){
		sql+=" AND UNIT_ID='"+orgCode+"'";
	}else{
		sql+=" AND 1=2";
	}
	downSql=sql;
	var cdata = query("select count(*) total FROM(" + sql+")");
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
	title=[["结算渠道编码","结算渠道名称","发展渠道编码","发展渠道名称","电话号码","用户编码","佣金科目","科目名称","规则名称","政策名称","渠道属性大类","渠道属性小类","计算","说明"]];
	title[0][12]=tn;
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],// 第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			/*orderBy = " order by " + field[index] + " " + type + " ";
			search(0);*/
		},
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	report.showSubRow();
	if($(".default-btn").length>2){
		$(".default-btn:gt(2)").remove();
	}
	// /////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	// /////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area){
			$(this).find("TD:eq(0)").empty().text(area);
		}
		var t=$(this).find("TD:eq(0)").text();
		if(t=="undefined"){
			$(this).find("TD:eq(0)").empty().text("");
		}
	  });
}

// ///////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var queryStartDate=$("#startDate").val();
	var queryEndDate=$("#endDate").val();
	var showtext = tablename+startDate+"-"+endDate;
	downloadExcel(downSql,title,showtext);
}
// ///////////////////////下载结束/////////////////////////////////////////////
