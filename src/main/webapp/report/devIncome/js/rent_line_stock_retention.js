var nowData = [];

var field=["GROUP_ID_1_NAME","RATE_LAST_YEAR","FEE_LAST_12","FEE_01","FEE_02","FEE_03","FEE_04","FEE_05","FEE_06","FEE_07","FEE_08","FEE_09","FEE_10","FEE_11","FEE_12","RATE_01","RATE_02","RATE_03","RATE_04","RATE_05","RATE_06","RATE_07","RATE_08","RATE_09","RATE_10","RATE_11","RATE_12"];
var title=""
var orderBy='';	
var report = null;
$(function() {
	var time=$("#time").val();
	title=[["地市名称",
      (time-1)+"年专租线<br/>存量收入保有率",
      (time-1)+"年12月拍照专租线<br/>出账收入",
      time+"年1月拍照专租线<br/>保有出账收入",
      time+"年2月拍照专租线<br/>保有出账收入",
      time+"年3月拍照专租线<br/>保有出账收入",
      time+"年4月拍照专租线<br/>保有出账收入",
      time+"年5月拍照专租线<br/>保有出账收入",
      time+"年6月拍照专租线<br/>保有出账收入",
      time+"年7月拍照专租线<br/>保有出账收入",
      time+"年8月拍照专租线<br/>保有出账收入",
      time+"年9月拍照专租线<br/>保有出账收入",
      time+"年10月拍照专租线<br/>保有出账收入",
      time+"年11月拍照专租线<br/>保有出账收入",
      time+"年12月拍照专租线<br/>保有出账收入",
      time+"年1月拍照专租线<br/>保有出账收入保有率",
      time+"年2月拍照专租线<br/>保有出账收入保有率",
      time+"年3月拍照专租线<br/>保有出账收入保有率",
      time+"年4月拍照专租线<br/>保有出账收入保有率",
      time+"年5月拍照专租线<br/>保有出账收入保有率",
      time+"年6月拍照专租线<br/>保有出账收入保有率",
      time+"年7月拍照专租线<br/>保有出账收入保有率",
      time+"年8月拍照专租线<br/>保有出账收入保有率",
      time+"年9月拍照专租线<br/>保有出账收入保有率",
      time+"年10月拍照专租线<br/>保有出账收入保有率",
      time+"年11月拍照专租线<br/>保有出账收入保有率",	
      time+"年12月拍照专租线<br/>保有出账收入保有率"]];
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		tableCss:{leftWidth:130},
		lock:1,
		rowParams : [],//第一个为rowId
		content : "lchcontent",
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

var pageSize = 17;
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
	
	var year=$("#time").val();
	var groupId = $("#regionName").val();
	var orderBy="";
	var sql=getSql();
//条件
	sql+=" AND YEAR="+year;
	if(groupId!=''){
		sql+=" AND GROUP_ID_1 = '"+groupId+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		orderBy=" ORDER BY GROUP_ID_1";
	}else{
		var regionCode = $("#regionCode").val();
		if(regionCode!=''){
			sql+=" AND GROUP_ID_1 = "+regionCode;
		}
		sql+=" ORDER BY GROUP_ID_1";
	}
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
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
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}


function listRegions(){
	var sql = "SELECT DISTINCT T.GROUP_ID_1,T.GROUP_ID_1_NAME FROM PMRT.TB_MRT_JCDY_ZZCL_YEAR T WHERE 1 = 1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var regionCode=$("#regionCode").val();
	if(orgLevel==1){
		
	}else{
		sql+=" and T.GROUP_ID_1 = "+regionCode;
	}
	sql+=" ORDER BY T.GROUP_ID_1";
	//排序
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1+ '" selected >'+ d[0].GROUP_ID_1_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1 + '">' + d[i].GROUP_ID_1_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
	} else {
		alert("获取地市信息失败");
	}
}

function getSql(){
	/*var fs = "";
	for (var i = 0; i < field.length; i++) {
		if (fs.length > 0) {
			fs += ",";
		}
		fs += field[i];
	}*/
	//return "SELECT "+fs+" FROM  PMRT.TB_MRT_JCDY_ZZCL_YEAR WHERE 1=1";
	sql="SELECT GROUP_ID_1_NAME,                                 "+
		"       NVL(RATE_LAST_YEAR,0)*100||'%' AS RATE_LAST_YEAR,"+
		"       NVL(FEE_LAST_12,0) AS FEE_LAST_12,               "+
		"       NVL(FEE_01,0) AS FEE_01,                         "+
		"       NVL(FEE_02,0) AS FEE_02,                         "+
		"       NVL(FEE_03,0) AS FEE_03,                         "+
		"       NVL(FEE_04,0) AS FEE_04,                         "+
		"       NVL(FEE_05,0) AS FEE_05,                         "+
		"       NVL(FEE_06,0) AS FEE_06,                         "+
		"       NVL(FEE_07,0) AS FEE_07,                         "+
		"       NVL(FEE_08,0) AS FEE_08,                         "+
		"       NVL(FEE_09,0) AS FEE_09,                         "+
		"       NVL(FEE_10,0) AS FEE_10,                         "+
		"       NVL(FEE_11,0) AS FEE_11,                         "+
		"       NVL(FEE_12,0) AS FEE_12,                         "+
		"       NVL(RATE_01,0)*100||'%' AS RATE_01,              "+
		"       NVL(RATE_02,0)*100||'%' AS RATE_02,              "+
		"       NVL(RATE_03,0)*100||'%' AS RATE_03,              "+
		"       NVL(RATE_04,0)*100||'%' AS RATE_04,              "+
		"       NVL(RATE_05,0)*100||'%' AS RATE_05,              "+
		"       NVL(RATE_06,0)*100||'%' AS RATE_06,              "+
		"       NVL(RATE_07,0)*100||'%' AS RATE_07,              "+
		"       NVL(RATE_08,0)*100||'%' AS RATE_08,              "+
		"       NVL(RATE_09,0)*100||'%' AS RATE_09,              "+
		"       NVL(RATE_10,0)*100||'%' AS RATE_10,              "+
		"       NVL(RATE_11,0)*100||'%' AS RATE_11,              "+
		"       NVL(RATE_12,0)*100||'%' AS RATE_12               "+
		"  FROM PMRT.TB_MRT_JCDY_ZZCL_YEAR   WHERE 1=1           ";
	return sql;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var year=$("#time").val();
	var groupId = $("#regionName").val();
	var orderBy="";
	var sql=getSql();
	//条件
	sql+=" AND YEAR="+year;
	if(groupId!=''){
		sql+=" AND GROUP_ID_1 = '"+groupId+"'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		orderBy=" ORDER BY GROUP_ID_1";
	}else{
		var regionCode = $("#regionCode").val();
		    sql+=" AND GROUP_ID_1 = "+regionCode+" ORDER BY GROUP_ID_1";
	}
	var cdata = query("select count(*) total from(" + sql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	sql+=orderBy;
	showtext = '专租线存量收入保有率-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////




