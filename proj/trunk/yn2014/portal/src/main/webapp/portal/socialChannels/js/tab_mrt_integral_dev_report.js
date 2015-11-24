var nowData = [];
var field=[
"账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","渠道属性","合作月份","渠道等级","本月积分","本月清算积分","本月可兑积分","本月可兑金额","本半年累计积分","本半年累计清算积分","本半年累计可兑积分","本半年累计可兑金额","是否兑换","手工录入兑换积分",""
];
var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","渠道属性","合作月份","渠道等级","本月积分","本月清算积分","本月可兑积分","本月可兑金额","本半年累计积分","本半年累计清算积分","本半年累计可兑积分","本半年累计可兑金额","是否兑换","手工录入兑换积分","提交"]];
var orderBy='';	
var report = null;
var UPDATE_ROLE = "ROLE_MANAGER_WORKFLOWMANAGER_QDXJGL_REPORT_REPORT_UPDATEPART";
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:9,css:LchReport.RIGHT_ALIGN}],
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		orderCallBack : function(index, type) {
			//orderBy = " order by " + field[index] + " " + type + " ";
			//search(0);
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
	var userName=$.trim($("#userName").val());
	var hr_id=$.trim($("#hr_id").val());
	var fd_chnl_id=$.trim($("#fd_chnl_id").val());
	var integral_grade=$.trim($("#integral_grade").val());
	var orderBy="";
	var sql=getSql();
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and HR_ID_NAME LIKE '%"+userName+"%'";
	}
	if(hr_id!=''){
		sql+=" and HR_ID='"+hr_id+"'";
	}
	if(fd_chnl_id!=''){
		sql+=" and fd_chnl_id LIKE '%"+fd_chnl_id+"%'";
	}
	if(integral_grade!=''){
		sql+=" and integral_grade='"+integral_grade+"'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,group_id_4";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by unit_id,group_id_4";
	}else if(orgLevel==3){
		sql+=" and UNIT_ID='"+code+"'";
		orderBy=" order by group_id_4";
	}else{
		sql+=" and GROUP_ID_4='"+code+"'";
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
	$("#lch_DataBody").find("TR").each(function(i){
		 var obj=$(this).find("td:eq(19)");
		 var is_jf=$(this).find("td:eq(19)").text();
		 var hq_code=$(this).find("td:eq(5)").text();
		 var sub=$(this).find("td:eq(20)");
		 var is_dh=$.trim($(this).find("td:eq(18)").text());
		 if(lastmonth!=time){
		  if(isGrantedNew(UPDATE_ROLE)) {
			 if(is_dh=="否"){
				   var h="<input name='is_jf' type='text' id='i"+i+"' value='"+is_jf+"'/>";
				   var h1="<button hq_code='"+hq_code+"' month='"+time+"' i='i"+i+"' onclick=isupdate(this) style='cursor:pointer'>提交</button>";
			       obj.empty().append(h);
			       sub.append(h1);
			 }else{
			      var h="<input name='is_jf' type='text' id='i"+i+"' value='"+is_jf+"' readonly='readonly'/>";
				  obj.empty().append(h);
			 }
		  }
		 }else{
			   var h="<input name='is_jf' type='text' id='i"+i+"' value='"+is_jf+"'/>";
			   var h1="<button hq_code='"+hq_code+"' month='"+time+"' i='i"+i+"' onclick=update(this) style='cursor:pointer'>提交</button>";
		       obj.empty().append(h);
		       sub.append(h1);
		 }
	});
	 if(!isGrantedNew(UPDATE_ROLE)) {
		 $("#lch_DataHead").find("TR:eq(0)").find("TH:eq(19)").text("兑换积分");
	 }
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
function isupdate(obj){
	alert("当前账期只能录入,不能修改");
	if(confirm("确认录入？")){
	    update(obj);
	}else{
		var i=$(obj).attr("i");
		$("#"+i).val("");
	}
}
function update(obj){
	var hq_code=$(obj).attr("hq_code");
	var i=$(obj).attr("i");
	var is_jf=$.trim($("#"+i).val());
	var month=$(obj).attr("month");
	if(isNaN(is_jf)||$.trim(is_jf)==""){
		alert("请输入数字");
		return;
	}
	$.ajax({
		type:"POST",
		dataType:'json',
		async:false,
		cache:false,
		url:$("#ctx").val()+"/bulletin/edit_update.action",
		data:{
	       "hq_code":hq_code,
	       "is_jf":is_jf,
	       "month":month 
	   	}, 
	   	success:function(data){
	   		alert("修改成功");
	   		search(0);
	    }
	});
}
function getSql(){
	var s=" SELECT DEAL_DATE 账期                                             "+
	",GROUP_ID_1_NAME  地市                                            "+
	",UNIT_NAME  基层单元                                              "+
	",HR_ID  HR编码                                                    "+
	",HR_ID_NAME  人员名                                               "+
	",FD_CHNL_ID  渠道编码                                             "+
	",GROUP_ID_4_NAME  渠道名                                          "+
	",DEPT_TYPE 渠道属性                                               "+
	",HZ_MONTH 合作月份                                                "+
	",integral_grade 渠道等级                                          "+
	",nvl(ALL_JF_TOTAL,0) 本月积分                                     "+
	",nvl(ALL_JF_QS,0) 本月清算积分                                    "+
	",NVL(ALL_JF_TOTAL,0) + NVL(ALL_JF_QS,0) 本月可兑积分              "+
	",DECODE(INTEGRAL_GRADE,'D',NULL,NVL(COMM,0)) 本月可兑金额         "+
	",NVL(LJ_JF_TOTAL,0) 本半年累计积分                                "+
	",NVL(LJ_JF_QS,0) 本半年累计清算积分                               "+
	",NVL(LJ_JF_DH,0) 本半年累计可兑积分                               "+
	",DECODE(INTEGRAL_GRADE,'D',NULL,NVL(LJ_COMM,0)) 本半年累计可兑金额,"+
	"IS_JF 手工录入兑换积分,"+
	"CASE WHEN IS_DH='0' then '否' else '是' end 是否兑换"+
	" FROM PMRT.TAB_MRT_INTEGRAL_DEV_REPORT                            "+
	" WHERE INTEGRAL_SUB = 1                                          ";
	return s;
}
function listRegions(){
	var sql="";
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TAB_MRT_INTEGRAL_DEV_REPORT t where 1=1 ";
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
		sql+=" and t.HR_ID='"+hrId+"'";
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}
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
	var time=$("#time").val();
	var sql = "select distinct t.UNIT_NAME from  PMRT.TAB_MRT_INTEGRAL_DEV_REPORT t where 1=1 ";
	if(time!=''){
		//sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
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
			sql+=" and t.HR_ID='"+hrId+"'";
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
	var unitName=$("#unitName").val();
	var userName=$.trim($("#userName").val());
	var hr_id=$.trim($("#hr_id").val());
	var fd_chnl_id=$.trim($("#fd_chnl_id").val());
	var integral_grade=$.trim($("#integral_grade").val());
	var sql=getSql();
	var orderBy="";
//条件
	if(time!=''){
		sql+=" and DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and HR_ID_NAME LIKE '%"+userName+"%'";
	}
	if(hr_id!=''){
		sql+=" and HR_ID='"+hr_id+"'";
	}
	if(fd_chnl_id!=''){
		sql+=" and fd_chnl_id LIKE '%"+fd_chnl_id+"%'";
	}
	if(integral_grade!=''){
		sql+=" and integral_grade='"+integral_grade+"'";
	}
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	if(orgLevel==1){
		orderBy=" order by group_id_1,unit_id,group_id_4";
	}else if(orgLevel==2){
		sql+=" and GROUP_ID_1='"+code+"'";
		orderBy=" order by unit_id,group_id_4";
	}else if(orgLevel==3){
		sql+=" and UNIT_ID='"+code+"'";
		orderBy=" order by group_id_4";
	}else{
		sql+=" and GROUP_ID_4='"+code+"'";
	}
	sql+=orderBy;
	var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","渠道属性","合作月份","渠道等级","本月积分","本月清算积分","本月可兑积分","本月可兑金额","本半年累计积分","本半年累计清算积分","本半年累计可兑积分","本半年累计可兑金额","积分","是否兑换"]];
	showtext = '当期兑换报表-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////