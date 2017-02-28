var nowData = [];

var title=[["地市名称","营服名称","HR编码","姓名","工号","指标编码","指标描述","号码","积分"]];
var field=["GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","OPERATOR_ID","ITEMCODE","ITEMDESC","NUMBER_2I2C","JF"];
var orderBy = '';
var time='';
var downSql='';
var report = null;
$(function() {
	report = new LchReport({
		title : title,
		field : field,
		//tableCss:{leftWidth:555},
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
	
	time=$("#time").val();
	var regionCode=$("#regionCode").val();
	var hrId=$("#hrId").val();
	var code=$("#code").val();
	var unitCode=$("#unitCode").val();
	var name=$.trim($("#name").val());
//条件
	var where=" WHERE 1=1";
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+")";
	}
	if(name!=''){
		where+=" AND NAME like '%"+name+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		where+=" AND GROUP_ID_1 ='"+code+"'";
	}else{
		var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
			 where+=" AND HR_NO in("+hrIds+") ";
		 }else{
			 where+=" AND 1=2 ";	 
		 }
	}
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TAB_MRT_2I2C_MON PARTITION (P"+time+")"+where;
	downSql=sql;
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	var orderBy=" ORDER BY GROUP_ID_1, UNIT_ID";
	sql += orderBy;
	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	nowData = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}

function downsAll() {
	showtext = '2I2C积分明细-'+time;
	downloadExcel(downSql,title,showtext);
}
