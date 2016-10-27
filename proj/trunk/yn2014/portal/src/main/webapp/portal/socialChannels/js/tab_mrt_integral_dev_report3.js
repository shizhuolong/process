var field=["ALL_JF_TOTAL","ALL_JF_QS","ALL_JF_YF","ALL_JF_YFSF","THIS_MONTH_TOTAL","IS_JF","IS_COMM","COMM","LJ_JF_TOTAL","LJ_JF_QS","LJ_JF_YF","LJ_JF_YFSF","LJ_JF_DH","LJ_COMM"];
var title=[["组织架构","本月计算积分","本月清算积分","本月延付积分","本月延付释放积分","本月合计积分","本月录入积分","本月录入金额","本月合计金额","年累计计算积分","年累计清算积分","年累计延付积分","年累计延付释放积分","年累计合计积分","年累计合计金额"]];
var report=null;
$(function(){
	var sumSql=getSumField();
	 report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		//css:[{gt:0,css:LchReporRIGHT_ALIGN}],
		rowParams:["ROW_ID","UNIT_ID"],//第一个为rowId
		content:"content",
		getSubRowsCallBack:function($tr){
			var preField='';
			var where=' WHERE INTEGRAL_SUB = 1';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $("#month").val();
			var hr_id_name = $("#userName").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var orderBy="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){
					preField=' group_id_1 ROW_ID,group_id_1_name ROW_NAME';
					groupBy=' group by group_id_1,group_id_1_name ';
					orderBy=" order by group_id_1";
				}else if(orgLevel==3){
					preField=' unit_id ROW_ID,unit_name ROW_NAME';
					groupBy=' group by unit_id,unit_name ';
					where+=' and group_id_1=\''+code+"\' ";
					orderBy=" order by unit_id";
				}else if(orgLevel==4){
					preField=' unit_id,hr_id ROW_ID,hr_id_name ROW_NAME';
					groupBy=' group by unit_id,hr_id,hr_id_name ';
					where+=' and unit_id=\''+code+"\' ";
				}else if(orgLevel==5){
					var unit_id=$tr.attr("unit_id");
					preField=' group_id_4_name ROW_NAME';
					groupBy=' group by group_id_4,group_id_4_name ';
					where+=' and unit_id=\''+unit_id+'\' and hr_id=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=" '云南省'  ROW_NAME ";
					groupBy=' group by group_id_0 ';
					orgLevel++;
				}else if(orgLevel==2){//市
					preField=' group_id_1 ROW_ID,group_id_1_name ROW_NAME';
					groupBy=' group by group_id_1,group_id_1_name ';
					where+=' and GROUP_ID_1=\''+code+"\' ";
					orgLevel++;
				}else if(orgLevel==3){//营服中心
					preField=' unit_id ROW_ID,unit_name ROW_NAME';
					groupBy=' group by unit_id,unit_name ';
					where+=" and unit_id IN(SELECT T.OLD_UNIT_ID FROM PCDE.UNIT_HB T WHERE T.UNIT_ID = '"+code+"' UNION ALL SELECT '"+code+"' OLD_UNIT_ID FROM DUAL)";
					orgLevel++;
				}else if(orgLevel==4){
					var hrId = $("#hrId").val();
					preField=' hr_id ROW_ID,hr_id_name ROW_NAME';
					groupBy=' group by hr_id,hr_id_name ';
					where+=' and hr_id=\''+hrId+"\' ";
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+sumSql+' from PMRT.TAB_MRT_INTEGRAL_DEV_REPORT ';
						
			where+=' and DEAL_DATE='+qdate+' ';
			if(regionCode!=''){
				where+=" and GROUP_ID_1 = '"+regionCode+"'";
			}
			if(unitCode!=''){
				where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
			}
			if(hr_id_name!=''){
				where+=" and HR_ID_NAME = '"+hr_id_name+"'";
			}
			sql+=where+groupBy+orderBy;
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
    report.showSubRow();
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off").remove();
	///////////////////////////////////////////
	$(".page_count").width($("#lch_DataHead").width());
	
	$("#searchBtn").click(function(){
	    report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off").remove();
		///////////////////////////////////////////
		$(".page_count").width($("#lch_DataHead").width());
	});
});

/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var qdate = $.trim($("#month").val());
	var preField=' group_id_1_name,unit_name,hr_id_name,group_id_4_name,fd_chnl_id ';
	var where=' WHERE INTEGRAL_SUB = 1';
	var orderBy=" order by group_id_1,unit_id,hr_id,group_id_4 ";
	var hr_id_name = $("#userName").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var groupBy=" group by group_id_1,group_id_1_name,unit_id,unit_name,hr_id,hr_id_name,group_id_4,group_id_4_name,fd_chnl_id";
	var fieldSql=getSumField();
		
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " and GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	} else if (orgLevel == 4) {//
		where += " and hr_id='" + hrId + "' ";
	}
	where+=' and DEAL_DATE='+qdate+' ';
	if(regionCode!=''){
		where+=" and GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" and unit_id IN(SELECT T.OLD_UNIT_ID FROM PCDE.UNIT_HB T WHERE T.UNIT_ID = '"+code+"' UNION ALL SELECT '"+code+"' OLD_UNIT_ID FROM DUAL)";
	}
	if(hr_id_name!=''){
		where+=" and HR_ID_NAME = '"+hr_id_name+"'";
	}
	var sql = 'select ' + preField + fieldSql
			+ ' from PMRT.TAB_MRT_INTEGRAL_DEV_REPORT ';
	sql += where+groupBy+orderBy;
	showtext = '当期汇总月报' + qdate; 
	var title=[["州市","本月计算积分","本月清算积分","本月延付积分","本月延付释放积分","本月合计积分","本月录入积分","本月录入金额","本月合计金额","年累计计算积分","年累计清算积分","年累计延付积分","年累计延付释放积分","年累计合计积分","年累计合计金额"]];
	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////
function getSumField(){
	var fs = ",SUM(NVL(ALL_JF_TOTAL, 0)) ALL_JF_TOTAL,                        "+
			"SUM(NVL(ALL_JF_QS, 0)) ALL_JF_QS,                              "+
			"SUM(NVL(ALL_JF_YF, 0)) ALL_JF_YF,                              "+
			"SUM(NVL(ALL_JF_YFSF, 0)) ALL_JF_YFSF,                          "+
			"SUM(nvl(ALL_JF_TOTAL, 0) + NVL(ALL_JF_QS, 0)                   "+
			"    - NVL(ALL_JF_YF, 0) +NVL(ALL_JF_YFSF, 0)) THIS_MONTH_TOTAL,"+
			"sum(NVL(IS_JF, 0)) IS_JF,                                      "+
			"sum(NVL(IS_COMM, 0)) IS_COMM,                                  "+
			"SUM(NVL(COMM, 0)) COMM,                                        "+
			"sum(NVL(LJ_JF_TOTAL, 0)) LJ_JF_TOTAL,                          "+
			"sum(NVL(LJ_JF_QS, 0)) LJ_JF_QS,                                "+
			"sum(NVL(LJ_JF_YF, 0)) LJ_JF_YF,                                "+
			"sum(NVL(LJ_JF_YFSF, 0)) LJ_JF_YFSF,                            "+
			"sum(NVL(LJ_JF_DH, 0)) LJ_JF_DH,                                "+
			"SUM(NVL(LJ_COMM, 0)) LJ_COMM                                   ";
	return fs;
}