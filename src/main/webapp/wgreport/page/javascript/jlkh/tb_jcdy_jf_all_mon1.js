var nowData = [];
var title=[["地市","基层单元","人员姓名","hr编码","角色类型","2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","总受理量","2g发展积分","上网卡发展积分","3g发展积分","4g发展积分","固网发展积分","智慧沃家积分","宽带续费积分","集团专租线积分","质态积分","调节后质态积分","合计销售积分","渠道调节销售积分","区域调节销售积分","基础服务积分","服务积分","增值业务积分","总受理积分","服务调节受理积分","区域调节受理积分","老用户专享积分","存费业务积分","自备机续约积分","主副卡积分","流量语音包定制积分","维系积分","维系服务积分","维系区域积分","总积分","总积分金额"]];
var field=["AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","USER_ROLE","G2SLL","SWSLL","G3SLL","G4SLL","KDSLL","ALLSLL","G2JF","SWJF","G3JF","G4JF","GWJF","ZHWJ_JF","KDXFJF","JTZZSRJF","ZTJF","ZTUNITJF","HJXSJF","HQ_ALLJF","UNIT_ALLJF","BASE_SLJF","FW_JF","ZZYW_JF","SL_ALLJF","SL_SVR_ALL_CRE","UNIT_SL_ALLJF","LYHZX_JF","CFYW_JF","ZBJXY_JF","ZFK_JF","LLBDZ_JF","WX_CRE","WX_SVR_CRE","WX_UNIT_CRE","ALL_JF","ALL_JF_MONEY"];
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		tableCss:{leftWidth:450},
		css:[
		     {gt:5,css:LchReport.RIGHT_ALIGN}
		    // {eq:6,css:{minWidth:'50px',width:'50px'}},
		    // {eq:7,css:{minWidth:'50px',width:'50px'}}
		     ],
		lock:4,
		rowParams : [],
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
	var hrId=$("#hrId").val();
	var orgName=$("#orgName").val();
	var unitName=$("#unitName").val();
	var name=$.trim($("#name").val());
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TB_JCDY_JF_ALL_MON WHERE DEAL_DATE='"+time+"'";
	if(regionName!=''){
		sql+=" AND AREA_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" AND UNIT_NAME = '"+unitName+"'";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and AREA_NAME ='"+orgName+"'";
	}else{
		var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_NO in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
	var total = 0;
	if(cdata && cdata.length) {
		total = cdata[0].TOTAL;
	}else{
		return;
	}
	//排序
	var orderBy=" order by area_name,unit_name,user_name";
	sql += orderBy;
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
	//$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
function listRegions(){
	var sql = "select distinct t.AREA_NAME GROUP_ID_1_NAME from PMRT.TB_JCDY_JF_ALL_MON t where 1=1";
	//权限
	var orgLevel=$("#orgLevel").val();
	var orgName=$("#orgName").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.area_name='"+orgName+"'";
	}else if(orgLevel==3){
		sql+=" and t.UNIT_NAME='"+orgName+"'";
	}else{
		sql+=" and 1=2";
	}
	//排序
	var d=query(sql);
	if (d) {
		var h = '';
		if (d.length == 1) {
			h += '<option value="' + d[0].GROUP_ID_1_NAME
					+ '" selected >'
					+ d[0].GROUP_ID_1_NAME + '</option>';
			listUnits(d[0].GROUP_ID_1_NAME);
		} else {
			h += '<option value="" selected>请选择</option>';
			for (var i = 0; i < d.length; i++) {
				h += '<option value="' + d[i].GROUP_ID_1_NAME + '">' + d[i].GROUP_ID_1_NAME + '</option>';
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
	var orgName=$("#orgName").val();
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_JCDY_JF_ALL_MON  t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.AREA_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			//sql+=" and t.AREA_NAME='"+orgName+"'";
		}else if(orgLevel==3){
			sql+=" and t.UNIT_NAME='"+orgName+"'";
		}else{
			sql+=" and 1=2";
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
		alert("获取基层单元信息失败");
	}
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var hrId=$("#hrId").val();
	var orgName=$("#orgName").val();
	var unitName=$("#unitName").val();
	var name=$.trim($("#name").val());
	var title=[["账期","地市","基层单元","人员姓名","hr编码","角色类型","2g发展量","上网卡发展量","3g发展量","4g发展量","宽带发展量","总受理量","2g发展积分","上网卡发展积分","3g发展积分","4g发展积分","固网发展积分","智慧沃家积分","宽带续费积分","集团专租线积分","质态积分","调节后质态积分","合计销售积分","渠道调节销售积分","区域调节销售积分","基础服务积分","服务积分","增值业务积分","总受理积分","服务调节受理积分","区域调节受理积分","老用户专享积分","存费业务积分","自备机续约积分","主副卡积分","流量语音包定制积分","维系积分","维系服务积分","维系区域积分","总积分","总积分金额"]];
	var field=["DEAL_DATE","AREA_NAME","UNIT_NAME","USER_NAME","HR_NO","USER_ROLE","G2SLL","SWSLL","G3SLL","G4SLL","KDSLL","ALLSLL","G2JF","SWJF","G3JF","G4JF","GWJF","ZHWJ_JF","KDXFJF","JTZZSRJF","ZTJF","ZTUNITJF","HJXSJF","HQ_ALLJF","UNIT_ALLJF","BASE_SLJF","FW_JF","ZZYW_JF","SL_ALLJF","SL_SVR_ALL_CRE","UNIT_SL_ALLJF","LYHZX_JF","CFYW_JF","ZBJXY_JF","ZFK_JF","LLBDZ_JF","WX_CRE","WX_SVR_CRE","WX_UNIT_CRE","ALL_JF","ALL_JF_MONEY"];
//条件
	var sql = "SELECT "+field.join(",")+" FROM PMRT.TB_JCDY_JF_ALL_MON WHERE DEAL_DATE='"+time+"'";
	if(regionName!=''){
		sql+=" AND AREA_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" AND UNIT_NAME = '"+unitName+"'";
	}
	if(name!=''){
		sql+=" AND USER_NAME like '%"+name+"%'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and AREA_NAME ='"+orgName+"'";
	}else{
		var hrIds=_jf_power(hrId,time);
		 if(hrIds&&hrIds!=""){
		   sql+=" and HR_NO in("+hrIds+") ";
		 }else{
		   sql+=" and 1=2 ";	 
		 }
	}
	showtext = '积分月汇总-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////