var nowData = [];
var title=[["账期","地市","基层单元","HR编码","人员姓名","角色类型","固定薪酬","基础KPI绩效","业绩提成","总薪酬"]];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","USER_TYPE","FIXED_SALARY","BASE_SALARY","JF_SALARY","ALL_SALARY"];
var orderBy = '';
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		rowParams : ["DEAL_DATE","HR_ID"],//第一个为rowId
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
	var sql = " from PMRT.TB_MRT_JCDY_HR_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID="+code;
	}else{
		sql+=" and t.HR_ID="+hrId;
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
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());

	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
	
	//业绩提成单击处理
	$("#lch_DataBody").find("TR").each(function(){
		var $yjTd=$(this).find("TD:eq(8)");
		$yjTd.html("<a href='#' >"+$yjTd.text()+"</a>");
		$yjTd.click(function(){
			var date=$yjTd.parent().attr("deal_date");
			var hrId=$yjTd.parent().attr("hr_id");
			var sql="";
			sql+=" select t.JF_TYPE,t.ITEMVALUE,t.HQ_RATIO,t.UNIT_RATIO,t.itemdesc,t.unit_money,tt.cre,tt.money from PMRT.TB_MRT_JCDY_SALARY_DETAIL_MON t ";
			sql+=" left join ";
			sql+=" PODS.TB_ODS_JCDY_SALLCRE tt ";
			sql+=" on tt.itemcode=t.itemcode ";
			sql+=" where t.deal_date="+date+" and t.hr_no='"+hrId+"' and t.jf_type='销售积分' ";
			sql+=" union  ";
			sql+=" select t.JF_TYPE,t.ITEMVALUE,t.HQ_RATIO,t.UNIT_RATIO,t.itemdesc,t.unit_money,ttt.cre,ttt.money from PMRT.TB_MRT_JCDY_SALARY_DETAIL_MON t ";
			sql+=" left join ";
			sql+=" PTEMP.TB_JCDY_SLJF_BUSICRE ttt ";
			sql+=" on ttt.bigbusi_code=t.itemcode ";
			sql+=" where t.deal_date="+date+" and t.hr_no='"+hrId+"' and t.jf_type='受理积分' ";
			sql+=" union ";
			sql+=" select '合计' JF_TYPE,null ITEMVALUE,null HQ_RATIO,null UNIT_RATIO,null ITEMDESC,sum(t.unit_money) UNIT_MONEY,null CRE,null MONEY from ( ";
			sql+="        select t.*,tt.cre,tt.money from PMRT.TB_MRT_JCDY_SALARY_DETAIL_MON t ";
			sql+="         left join ";
			sql+="         PODS.TB_ODS_JCDY_SALLCRE tt ";
			sql+="        on tt.itemcode=t.itemcode ";
			sql+="         where t.deal_date="+date+" and t.hr_no='"+hrId+"' and t.jf_type='销售积分' ";
			sql+="         union  ";
			sql+="         select t.*,ttt.cre,ttt.money from PMRT.TB_MRT_JCDY_SALARY_DETAIL_MON t ";
			sql+="         left join ";
			sql+="         PTEMP.TB_JCDY_SLJF_BUSICRE ttt ";
			sql+="         on ttt.bigbusi_code=t.itemcode ";
			sql+="         where t.deal_date="+date+" and t.hr_no='"+hrId+"' and t.jf_type='受理积分')  t ";
			var d=query(sql);
			
			if(d&&d.length){
				var h="<div style='padding:12px;max-height:400px;overflow-y:auto;overflow-x:hidden;'>"
				+"<table><thead class='lch_DataHead'><tr><th>积分类型</th><th>指标描述</th><th>受理量或指标值 </th><th>积分值</th><th>积分单价（元）</th><th>渠道或服务系数 </th><th>营服系数 </th><th>积分薪酬单价（元）</th><th>积分薪酬（元）</th></tr></thead><tbody class='lch_DataBody'>";
				var sh="";
				var sum=0;
				for(var i=0;i<d.length;i++){
					if(isNull(d[i]["JF_TYPE"])=='合计'){
						sh="<tr><td colspan='8'>合计</td><td>"
							+isNull(d[i]["UNIT_MONEY"])+"</td>"
							+"</tr>";
					}else{
						h+="<tr><td>"+isNull(d[i]["JF_TYPE"])
						+"</td><td>"+isNull(d[i]["ITEMDESC"])
						+"</td><td>"+isNull(d[i]["ITEMVALUE"])
						+"</td><td>"+isNull(d[i]["CRE"])
						+"</td><td>"+isNull(d[i]["MONEY"])
						+"</td><td>"+isNull(d[i]["HQ_RATIO"])
						+"</td><td>"+isNull(d[i]["UNIT_RATIO"])
						+"</td><td>"+10
						+"</td><td>"+isNull(d[i]["UNIT_MONEY"])
						+"</td></tr>";
					}
				}
				h+=sh+"</tbody>"
				h+="</table>";
				h+="<font color='red' size='2'>销售积分：指标值*积分值\/积分单价*渠道系数*营服系数*积分薪酬单价<br/>";
				h+="受理积分：受理量或指标值*积分值\/积分单价*服务系数*营服系数*积分薪酬单价<br/>（指标值、积分单价为空时默认为1）</font><br/>";
				+"</div>";
				if(d.length>1){
					art.dialog({
					    title: '业绩提成详细信息',
					    content: h,
					    padding: 0,
					    lock:true
					});
				}
			}else{
				alert("获取业绩提成信息失败");
			}
		});
	});
}
function listRegions(){
	var sql="";
	var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TB_MRT_JCDY_HR_SALARY_MON t where 1=1 ";
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
		sql+=" and t.UNIT_ID="+code;
	}else{
		sql+=" and t.HR_ID="+hrId;
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
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_MRT_JCDY_HR_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
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
function isNull(obj){
	if(obj==0||obj=='0'){
		return 0;
	}
	if(obj == undefined || obj == null || obj == '') {
		return "&nbsp;";
	}
	return obj;
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll(){
	var sql="";
	var time=$("#time").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$("#userName").val();
	//条件
	var sql = " from PMRT.TB_MRT_JCDY_HR_SALARY_MON t where 1=1 ";
	if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" and t.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" and t.NAME like '%"+userName+"%'";
	}
	
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1="+code;
	}else if(orgLevel==3){
		sql+=" and t.UNIT_ID="+code;
	}else{
		sql+=" and t.HR_ID="+hrId;
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,HR_ID,NAME,USER_TYPE,FIXED_SALARY,BASE_SALARY,JF_SALARY,ALL_SALARY " + sql;
	
	var title=[["账期","地市","基层单元","HR编码","人员姓名","角色类型","固定薪酬","基础KPI绩效","业绩提成","总薪酬"]];
	showtext = '人员薪酬-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////