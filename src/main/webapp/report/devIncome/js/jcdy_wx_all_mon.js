var nowData = [];
var field=[
"DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","NAME","CRE","HQ_CRE","UNIT_CRE"
];
var title=[["账期","地市","营服中心","HR编码","人员姓名","原始积分","渠道调节后的积分","营服调节后积分"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		css:[{gt:4,css:LchReport.RIGHT_ALIGN}],
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
	var sql = " from PMRT.TB_MRT_JCDY_WX_ALL_MON t where 1=1 ";
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
	}else/* if(orgLevel==3)*/{
		//sql+=" and t.UNIT_ID='"+code+"'";
	//}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_MRT_JCDY_SALUNIT_DETAIL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+code+"'                                            ";
					tsql+="   and tt.deal_date = '"+time+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_ID in("+hrsql+")";
			}else{
				sql+=" and t.HR_ID='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_ID='"+hrId+"'";
		}
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
}
function listRegions(){
	var sql="";
	//var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TB_MRT_JCDY_WX_ALL_MON t where 1=1 and group_id_1_name is not null ";
	/*if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}*/
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
	var sql = "select distinct t.UNIT_NAME from PMRT.TB_MRT_JCDY_WX_ALL_MON t where 1=1 ";
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
	var sql = " from PMRT.TB_MRT_JCDY_WX_ALL_MON t where 1=1 ";
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
	}else/* if(orgLevel==3)*/{
		//sql+=" and t.UNIT_ID='"+code+"'";
	//}else{
		//1-营服中心责任人、6-营业厅主人、7-行业总监
		var rsql="SELECT DISTINCT T.USER_CODE FROM PORTAL.VIEW_U_PORTAL_PERSON T WHERE T.HR_ID='"+hrId+"'";
		var rd=query(rsql);
		if(rd&&rd.length){
			var hrsql="";
			for(var i=0;i<rd.length;i++){
				var v=rd[i]["USER_CODE"];
				var tsql="";
				if(v==1){
					tsql+=" select tt.hr_no                                                      ";
					tsql+="   from pmrt.TB_MRT_JCDY_SALUNIT_DETAIL_MON tt                        ";
					tsql+=" where tt.unit_id = '"+code+"'                                            ";
					tsql+="   and tt.deal_date = '"+time+"'                                      ";
					tsql+=" union                                                                ";
					tsql+=" select '"+hrId+"' from dual  ";
				}else if(v==6){
					tsql+=" SELECT distinct hr_id                                                ";
					tsql+="   FROM portal.tab_portal_mag_person                                  ";
					tsql+=" where hq_chan_code in (                                              ";
					tsql+="   SELECT distinct hq_chan_code                                       ";
					tsql+="     FROM portal.tab_portal_mag_person                                ";
					tsql+="   where hr_id = '"+hrId+"'                                           ";
					tsql+="     and hq_chan_code is not null                                     ";
					tsql+=" )                                                                    ";      
				}else if(v==7){
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a                                ";
					tsql+=" where a.f_hr_id in (                                                 ";
					tsql+="       select hr_id                                                   ";
					tsql+="         from portal.tab_portal_grp_person t                          ";
					tsql+="       where t.user_type = 1                                          ";
					tsql+=" )                                                                    ";
					tsql+=" and a.f_hr_id='"+hrId+"'                                             ";
					tsql+=" union                                                                ";
					tsql+=" select distinct a.hr_id                                              ";
					tsql+="   from portal.tab_portal_grp_person a where a.hr_id='"+hrId+"'       ";
				}
				if(tsql!=""&&hrsql!=""){
					hrsql+=" union "+tsql;
				}else{
					hrsql+=tsql;
				}
			}
			if(hrsql!=""){
				sql+=" and t.HR_ID in("+hrsql+")";
			}else{
				sql+=" and t.HR_ID='"+hrId+"'";
			}
		}else{
			sql+=" and t.HR_ID='"+hrId+"'";
		}
	}
	//排序
	if (orderBy != '') {
		sql += orderBy;
	}

	sql = "select "+field.join(",") + sql;
	
	showtext = '人员维系总积分月报-'+time;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////