var nowData = [];
var field=["DEAL_DATE","GROUP_ID_1_NAME","UNIT_NAME","HR_ID","HR_ID_NAME","FD_CHNL_ID","GROUP_ID_4_NAME","SUBSCRIPTION_ID","SERVICE_NUM","BRAND_TYPE_ID","INDEX_CODE","INDEX_VALUE","INNET_DATE","NET_TYPE","OFFICE_ID","OPERATOR_ID","PRODUCT_ID","SCHEME_ID","PRODUCT_FEE","SVC_TYPE","INTEGRAL_SUB","INTEGRAL_FEE","IS_3_NULL","IS_LOW_JD","ALL_USER","JD_USER","JD_ZB","JD_UP_USER","JD_UP_USER_ZB","JD_USER_JF"];
var title=[["账期","地市","基层单元","HR编码","人员名","渠道编码","渠道名","用户编码","电话号码","指标小类编码","指标类代码","指标标准值","入网时间","业务类型","办理编码","操作工位","套餐ID","活动ID","套餐月费","指标相关值","积分内部代码","积分值","是否三无","是否极低","渠道用户数","渠道极低用户数","渠道极低用户占比","超出15%用户数","超出15%用户数占比","极低用户总积分"]];
var orderBy='';	
var report = null;
$(function() {
	listRegions();
	report = new LchReport({
		title : title,
		field : field,
		/*css:[{gt:4,css:LchReport.RIGHT_ALIGN}],*/
		rowParams : [],//第一个为rowId
		content : "lchcontent",
		/*orderCallBack : function(index, type) {
			orderBy = " order by " + field[index] + " " + type + " ";
			search(0);
		},*/
		getSubRowsCallBack : function($tr) {
			return {
				data : nowData,
				extra : {}
			};
		}
	});
	search(0);
	
	$("#searchBtn").click(function(){
		listRegions();
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
	
	var dealDate=$("#dealDate").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$.trim($("#userName").val());
	var sql = "SELECT  DEAL_DATE 	                                                                       "+
	",GROUP_ID_1_NAME  	                                                                       "+
	",UNIT_NAME  		                                                                       "+
	",HR_ID  			                                                                       "+
	",HR_ID_NAME  		                                                                       "+
	",FD_CHNL_ID  		                                                                       "+
	",GROUP_ID_4_NAME  	                                                                       "+
	",SUBSCRIPTION_ID  	                                                                       "+
	",SERVICE_NUM  		                                                                       "+
	",BRAND_TYPE_ID  	                                                                       "+
	",INDEX_CODE    		                                                                   "+
	",INDEX_VALUE  		                                                                       "+
	",INNET_DATE  		                                                                       "+
	",decode(NET_TYPE,'-1','固网','01','2G','02','3G','03','3G','50','4G','51','4G') NET_TYPE  "+
	",OFFICE_ID  		                                                                       "+
	",OPERATOR_ID 		                                                                       "+
	",PRODUCT_ID  		                                                                       "+
	",SCHEME_ID  		                                                                       "+
	",PRODUCT_FEE 		                                                                       "+
	",SVC_TYPE  			                                                                   "+
	",INTEGRAL_SUB  		                                                                   "+
	",INTEGRAL_FEE  		                                                                   "+
	",decode(IS_3_NULL,'0','否','1','是') IS_3_NULL                                            "+
	",decode(IS_LOW_JD,'0','否','1','是') IS_LOW_JD                                            "+
	",ALL_USER  			                                                                   "+
	",JD_USER  			                                                                       "+
	",JD_ZB  			                                                                       "+
	",JD_UP_USER 		                                                                       "+
	",JD_UP_USER_ZB 		                                                                   "+
	",JD_USER_JF 		                                                                       "+
	" from PMRT.TAB_MRT_INTEGRAL_QS_DETAIL partition(P"+dealDate+") T                                                   "+
	" WHERE 1=1 ";
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" AND T.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" AND T.HR_ID_NAME LIKE '%"+userName+"%'";
	}
	

	
	
	
	var csql = sql;
	var cdata = query("select count(*) total from (" + csql+")");
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

	report.showSubRow();
	/*///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
*/	$(".page_count").width($("#lch_DataHead").width());
	$("#lch_DataBody").find("TR").each(function(){
		var area=$(this).find("TD:eq(0)").find("A").text();
		if(area)
			$(this).find("TD:eq(0)").empty().text(area);
	});
}
function listRegions(){
	var sql="";
	var dealDate=$("#dealDate").val();
	//var time=$("#time").val();
	//条件
	var sql = "select distinct t.GROUP_ID_1_NAME from PMRT.TAB_MRT_INTEGRAL_QS_DETAIL partition(P"+dealDate+") t where 1=1 and group_id_1_name is not null ";
	/*if(time!=''){
		sql+=" and t.DEAL_DATE="+time;
	}*/
	//权限
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" and t.GROUP_ID_1='"+code+"'";
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
	var dealDate=$("#dealDate").val();
	var sql = "select distinct t.UNIT_NAME from PMRT.TAB_MRT_INTEGRAL_QS_DETAIL partition(P"+dealDate+") t where 1=1 ";
	if(regionName!=''){
		sql+=" and t.GROUP_ID_1_NAME='"+regionName+"' ";
		//权限
		var orgLevel=$("#orgLevel").val();
		var code=$("#code").val();
		var hrId=$("#hrId").val();
		if(orgLevel==1){
			
		}else if(orgLevel==2){
			sql+=" and t.GROUP_ID_1='"+code+"'";
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
	var dealDate=$("#dealDate").val();
	var regionName=$("#regionName").val();
	var unitName=$("#unitName").val();
	var userName=$.trim($("#userName").val());
	var sql = "SELECT  DEAL_DATE 	                                                                       "+
	",GROUP_ID_1_NAME  	                                                                       "+
	",UNIT_NAME  		                                                                       "+
	",HR_ID  			                                                                       "+
	",HR_ID_NAME  		                                                                       "+
	",FD_CHNL_ID  		                                                                       "+
	",GROUP_ID_4_NAME  	                                                                       "+
	",SUBSCRIPTION_ID  	                                                                       "+
	",SERVICE_NUM  		                                                                       "+
	",BRAND_TYPE_ID  	                                                                       "+
	",INDEX_CODE    		                                                                   "+
	",INDEX_VALUE  		                                                                       "+
	",INNET_DATE  		                                                                       "+
	",decode(NET_TYPE,'-1','固网','01','2G','02','3G','03','3G','50','4G','51','4G') NET_TYPE  "+
	",OFFICE_ID  		                                                                       "+
	",OPERATOR_ID 		                                                                       "+
	",PRODUCT_ID  		                                                                       "+
	",SCHEME_ID  		                                                                       "+
	",PRODUCT_FEE 		                                                                       "+
	",SVC_TYPE  			                                                                   "+
	",INTEGRAL_SUB  		                                                                   "+
	",INTEGRAL_FEE  		                                                                   "+
	",decode(IS_3_NULL,'0','否','1','是') IS_3_NULL                                            "+
	",decode(IS_LOW_JD,'0','否','1','是') IS_LOW_JD                                            "+
	",ALL_USER  			                                                                   "+
	",JD_USER  			                                                                       "+
	",JD_ZB  			                                                                       "+
	",JD_UP_USER 		                                                                       "+
	",JD_UP_USER_ZB 		                                                                   "+
	",JD_USER_JF 		                                                                       "+
	" from PMRT.TAB_MRT_INTEGRAL_QS_DETAIL partition(P"+dealDate+") T                                                   "+
	" WHERE 1=1 ";
	var orgLevel=$("#orgLevel").val();
	var code=$("#code").val();
	var hrId=$("#hrId").val();
	if(orgLevel==1){
		
	}else if(orgLevel==2){
		sql+=" AND T.GROUP_ID_1='"+code+"'";
	}else if(orgLevel==3){
		sql+=" AND T.UNIT_ID='"+code+"'";
	}else if(orgLevel==4){
		sql+=" AND T.HR_ID='"+code+"'";
	}
	//条件查询
	if(regionName!=''){
		sql+=" AND T.GROUP_ID_1_NAME = '"+regionName+"'";
	}
	if(unitName!=''){
		sql+=" AND T.UNIT_NAME = '"+unitName+"'";
	}
	if(userName!=''){
		sql+=" AND T.HR_ID_NAME LIKE '%"+userName+"%'";
	}
	
	
	showtext = '社会渠道分等分级积分计算-'+dealDate;
	downloadExcel(sql,title,showtext);
}
/////////////////////////下载结束/////////////////////////////////////////////