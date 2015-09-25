var nowData = [];

var title=[["地市","营服中心","HR编码","人员姓名","本月发展量","","","","","本月全省排名","本月地市排名","本月营服中心排名"],
           ["","","","","2G","3G","4G","上网卡","合计","","",""]
];
var field=["AREA_NAME","UNIT_NAME","HR_NO","USER_NAME","G2SLL","G3SLL","G4SLL","SWSLL","TOTAL_SLL","RANK","GROUP_RANK","UNIT_RANK"];
var orderBy = ' order by RANK asc ';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:3,css:LchReport.RIGHT_ALIGN},{eq:8,css:LchReport.SUM_PART_STYLE}],
		rowParams : ["HR_NO","USER_NAME"],//第一个为rowId
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
	
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
//条件
	var sql = " from PMRT.TB_MRT_JCDY_DEV_RANK_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.AREA_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.USER_NAME like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_NO='"+hrId+"'";
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
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select * " + sql;

	sql = "select ttt.* from ( select tt.*,rownum r from (" + sql
			+ " ) tt where rownum<=" + end + " ) ttt where ttt.r>" + start;
	var d = query(sql);
	if (pageNumber == 1) {
		initPagination(total);
	}
	nowData = d;

	report.showSubRow();
	///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	//业绩提成单击处理
	$("#lch_DataBody").find("TR").each(function(){
		var $tr=$(this);
		var $2g=$tr.find("TD:eq(4)");
		var $3g=$tr.find("TD:eq(5)");
		var $4g=$tr.find("TD:eq(6)");
		var $swk=$tr.find("TD:eq(7)");
		
		if(!$2g.text()||$.trim($2g.text())==''||$.trim($2g.text())=='0'){
			
		}else{
			$2g.html("<a href='#' >"+$2g.text()+"</a>");
			$2g.click(function(){
				var hrNo=$tr.attr("HR_NO");
				var userName=$tr.attr("USER_NAME");
				var time=$("#time").val();
				var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='2GDK','2GHY'";
				window.parent.openWindow(userName+"-2G发展详细",null,url);
			});
			
		}
		if(!$3g.text()||$.trim($3g.text())==''||$.trim($3g.text())=='0'){
			
		}else{
			$3g.html("<a href='#' >"+$3g.text()+"</a>");
			$3g.click(function(){
				var hrNo=$tr.attr("HR_NO");
				var userName=$tr.attr("USER_NAME");
				var time=$("#time").val();
				var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='3GDK','3GHY'";
				window.parent.openWindow(userName+"-3G发展详细",null,url);
			});
			
		}
		if(!$4g.text()||$.trim($4g.text())==''||$.trim($4g.text())=='0'){
			
		}else{
			$4g.html("<a href='#' >"+$4g.text()+"</a>");
			$4g.click(function(){
				var hrNo=$tr.attr("HR_NO");
				var userName=$tr.attr("USER_NAME");
				var time=$("#time").val();
				var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list.jsp?hrNo="+hrNo+"&time="+time+"&itemCode='4GDK','4GHY'";
				window.parent.openWindow(userName+"-4G发展详细",null,url);
			});
			
		}
		
		if(!$swk.text()||$.trim($swk.text())==''||$.trim($swk.text())=='0'){
			
		}else{
			$swk.html("<a href='#' >"+$swk.text()+"</a>");
			$swk.click(function(){
				var hrNo=$tr.attr("HR_NO");
				var userName=$tr.attr("USER_NAME");
				var time=$("#time").val();
				var url=$("#ctx").val()+"/report/devIncome/jsp/dev_rank_mon_list_swk.jsp?hrNo="+hrNo+"&time="+time+"&itemCode=";
				window.parent.openWindow(userName+"-上网卡发展详细",null,url);
			});
			
		}
	});
}
function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.AREA_NAME from PMRT.TB_MRT_JCDY_DEV_RANK_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_NO='"+hrId+"'";
	}
	
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].AREA_NAME
					+ '" selected >'
					+ d[0].AREA_NAME + '</option>';
			listUnits(d[0].AREA_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].AREA_NAME + '">' + d[i].AREA_NAME + '</option>';
			}
		}
		var $area = $("#regionName");
		var $h = $(h);
		$area.empty().append($h);
		$area.change(function() {
			listUnits($(this).val());
		});
	} else {
		alert("获取地市信息失败");
	}
}
function listUnits(regionName){
	var $unit=$("#unitName");
	var time=$("#time").val();
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_MRT_JCDY_DEV_RANK_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.AREA_NAME='"+regionName+"' ";
		
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1="+code;
		}else if(orgLevel==3){
			sql+=" and t.UNIT_ID='"+code+"'";
		}else{
			sql+=" and t.HR_NO='"+hrId+"'";
		}
	}else{
		$unit.empty().append('<option value="" selected>请选择</option>');
		return;
	}
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].UNIT_NAME
					+ '" selected >'
					+ d[0].UNIT_NAME + '</option>';
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].UNIT_NAME + '">' + d[i].UNIT_NAME + '</option>';
			}
		}
		
		var $h = $(h);
		$unit.empty().append($h);
	} else {
		alert("获取营服中心信息失败");
	}
}
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "";
	}
	return obj;
}
function roundN(number,fractionDigits){   
    with(Math){   
        return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);   
    }   
}   
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	//条件
	var sql = " from PMRT.TB_MRT_JCDY_DEV_RANK_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.AREA_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.USER_NAME like '%"+userName+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID='"+code+"'";
	}else{
		sql+=" and t.HR_NO='"+hrId+"'";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select DEAL_DATE,"+field.join(",")+ sql;
	
	var title=[["账期","地市","营服中心","HR编码","人员姓名","本月发展量","","","","","本月全省排名","本月地市排名","本月营服中心排名"],
	           ["","","","","","2G","3G","4G","上网卡","合计","","",""]
	];
	showtext = '销售排名-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////