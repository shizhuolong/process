var field=["INCOME_TOTAL_YS","INCOME_TOTAL_SJ","INCOME_TOTAL_SY","INCOME_TOTAL_RATE","COMM_TOTAL_YS","COMM_TOTAL_SJ","COMM_TOTAL_SY","COMM_TOTAL_RATE","CHANNEL_YS","CHANNEL_SJ","CHANNEL_SY","CHANNEL_RATE","ADS_AMOUNT_YS","ADS_AMOUNT_SJ","ADS_AMOUNT_SY","ADS_AMOUNT_RATE","YHJR_AMOUNT_YS","YHJR_AMOUNT_SJ","YHJR_AMOUNT_SY","YHJR_AMOUNT_RATE","CLSYF_AMOUNT_YS","CLSYF_AMOUNT_SJ","CLSYF_AMOUNT_SY","CLSYF_AMOUNT_RATE","ZDF_AMOUNT_YS","ZDF_AMOUNT_SJ","ZDF_AMOUNT_SY","ZDF_AMOUNT_RATE","BGF_AMOUNT_YS","BGF_AMOUNT_SJ","BGF_AMOUNT_SY","BGF_AMOUNT_RATE","CLF_AMOUNT_YS","CLF_AMOUNT_SJ","CLF_AMOUNT_SY","CLF_AMOUNT_RATE","TXF_AMOUNT_YS","TXF_AMOUNT_SJ","TXF_AMOUNT_SY","TXF_AMOUNT_RATE","FZF_AMOUNT_YS","FZF_AMOUNT_SJ","FZF_AMOUNT_SY","FZF_AMOUNT_RATE","SDWYF_AMOUNT_YS","SDWYF_AMOUNT_SJ","SDWYF_AMOUNT_SY","SDWYF_AMOUNT_RATE","OTHER_AMOUNT_YS","OTHER_AMOUNT_SJ","OTHER_AMOUNT_SY","OTHER_AMOUNT_RATE"];

var title=[["营销架构","出账收入","","","","佣金","","","","渠道补贴","","","","广告费","","","","用户接入成本预算","","","","车辆使用费","","","","招待费","","","","办公费","","","","差旅费","","","","通信费","","","","房租费","","","","水电物业费","","","","其他","","",""],
           ["","总预算","总实际收入","尚可使用金额","总完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率"]];
var orderBy='';	
$(function(){
	var report=new LchReport({
		title:title,
		field:["GROUPNAME"].concat(field),
		css:[
		     {gt:1,css:LchReport.RIGHT_ALIGN}
		    /* {eq:3,css:LchReport.SUM_PART_STYLE},
		     {eq:7,css:LchReport.SUM_PART_STYLE},
		     {eq:8,css:LchReport.SUM_PART_STYLE}*/
		    ],
		rowParams:["GROUPID","GROUPNAME"],//第一个为rowId
		content:"lchcontent",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel="";
			var code="";
			var startdate = $.trim($("#startdate").val());
			var enddate = $.trim($("#enddate").val());
			var where=" WHERE DEAL_DATE between '"+startdate+"' and '"+enddate+"'" ;
			var groupBy="";
			var orderBy="";
			var preSql="";
			var sql=getSumSql();
			if($tr){
				code=$tr.attr("GROUPID");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==1){//点击省
					preSql="select group_id_1 as groupid,group_id_1_name as groupname,";
					groupBy=" group by group_id_1,group_id_1_name";
					orderBy=" order by group_id_1";
					sql=preSql+sql+where+groupBy+orderBy;
					orgLevel++;
				}else if(orgLevel==2){//点击地市
					preSql="select unit_id as groupid,unit_name as groupname,";
					where+=" and group_id_1='"+code+"'";
					groupBy=" group by unit_id,unit_name";
					orderBy=" order by unit_id";
					sql=preSql+sql+where+groupBy+orderBy;
					orgLevel++;
				}else{
					return {data:[],extra:{}};
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preSql="select '云南省' as groupname,";
					sql=preSql+sql+where;
				}else if(orgLevel==2){//市
					preSql="select group_id_1 as groupid,group_id_1_name as groupname,";
					where+=" and group_id_1='"+code+"'";
					groupBy=" group by group_id_1,group_id_1_name";
					sql=preSql+sql+where+groupBy;
				}else if(orgLevel==3){//营服中心
					preSql="select unit_id as groupid,unit_name as groupname,";
					where+=" and unit_id='"+code+"'";
					groupBy=" group by unit_id,unit_name";
					sql=preSql+sql+where+groupBy;
				}else{
					return {data:[],extra:{}};
				}
			}	
			var d=query(sql);
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
///////////////////////////////////////////
	$("#lch_DataHead").find("TH").unbind();
	$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
///////////////////////////////////////////
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
});
function getSumSql() {
	var s = 
		"sum(income_total_ys) income_total_ys,                                                                                          "+
		"sum(income_total_sj) income_total_sj,                                                                                          "+
		"sum(income_total_sy) income_total_sy,                                                                                          "+
		"CASE WHEN sum(income_total_ys) = 0 THEN 0 ELSE round(sum(income_total_sj)/sum(income_total_ys),2) END AS income_total_rate,     "+
		"sum(comm_total_ys) comm_total_ys,                                                                                              "+
		"sum(comm_total_sj) comm_total_sj,                                                                                              "+
		"sum(comm_total_sy) comm_total_sy,                                                                                              "+
		"CASE WHEN sum(comm_total_ys) = 0 THEN 0 ELSE round(sum(comm_total_sj)/sum(comm_total_ys),2) END AS comm_total_rate,             "+
		"sum(channel_ys) channel_ys,                                                                                                    "+
		"sum(channel_sj) channel_sj,                                                                                                    "+
		"sum(channel_sy) channel_sy,                                                                                                    "+
		"CASE WHEN sum(channel_ys) = 0 THEN 0 ELSE round(sum(channel_sj)/sum(channel_ys),2) END AS channel_rate,                         "+
		"sum(ads_amount_ys) ads_amount_ys,                                                                                              "+
		"sum(ads_amount_sj) ads_amount_sj,                                                                                              "+
		"sum(ads_amount_sy) ads_amount_sy,                                                                                              "+
		"CASE WHEN sum(ads_amount_ys) = 0 THEN 0 ELSE round(sum(ads_amount_sj)/sum(ads_amount_ys),2) END AS ads_amount_rate,             "+
		"sum(yhjr_amount_ys) yhjr_amount_ys,                                                                                            "+
		"sum(yhjr_amount_sj) yhjr_amount_sj,                                                                                            "+
		"sum(yhjr_amount_sy) yhjr_amount_sy,                                                                                            "+
		"CASE WHEN sum(yhjr_amount_ys) = 0 THEN 0 ELSE round(sum(yhjr_amount_sj)/sum(yhjr_amount_ys),2) END AS yhjr_amount_rate,         "+
		"sum(clsyf_amount_ys) clsyf_amount_ys,                                                                                          "+
		"sum(clsyf_amount_sj) clsyf_amount_sj,                                                                                          "+
		"sum(clsyf_amount_sy) clsyf_amount_sy,                                                                                          "+
		"CASE WHEN sum(clsyf_amount_ys) = 0 THEN 0 ELSE round(sum(clsyf_amount_sj)/sum(clsyf_amount_ys),2) END AS clsyf_amount_rate,     "+
		"sum(zdf_amount_ys) zdf_amount_ys,                                                                                              "+
		"sum(zdf_amount_sj) zdf_amount_sj,                                                                                              "+
		"sum(zdf_amount_sy) zdf_amount_sy,                                                                                              "+
		"CASE WHEN sum(zdf_amount_ys) = 0 THEN 0 ELSE round(sum(zdf_amount_sj)/sum(zdf_amount_ys),2) END AS zdf_amount_rate,             "+
		"sum(bgf_amount_ys) bgf_amount_ys,                                                                                              "+
		"sum(bgf_amount_sj) bgf_amount_sj,                                                                                              "+
		"sum(bgf_amount_sy) bgf_amount_sy,                                                                                              "+
		"CASE WHEN sum(bgf_amount_ys) = 0 THEN 0 ELSE round(sum(bgf_amount_sj)/sum(bgf_amount_ys),2) END AS bgf_amount_rate,             "+
		"sum(clf_amount_ys) clf_amount_ys,                                                                                              "+
		"sum(clf_amount_sj) clf_amount_sj,                                                                                              "+
		"sum(clf_amount_sy) clf_amount_sy,                                                                                              "+
		"CASE WHEN sum(clf_amount_ys) = 0 THEN 0 ELSE round(sum(clf_amount_sj)/sum(clf_amount_ys),2) END AS clf_amount_rate,             "+
		"sum(txf_amount_ys) txf_amount_ys,                                                                                              "+
		"sum(txf_amount_sj) txf_amount_sj,                                                                                              "+
		"sum(txf_amount_sy) txf_amount_sy,                                                                                              "+
		"CASE WHEN sum(txf_amount_ys) = 0 THEN 0 ELSE round(sum(txf_amount_sj)/sum(txf_amount_ys),2) END AS txf_amount_rate,             "+
		"sum(fzf_amount_ys) fzf_amount_ys,                                                                                              "+
		"sum(fzf_amount_sj) fzf_amount_sj,                                                                                              "+
		"sum(fzf_amount_sy) fzf_amount_sy,                                                                                              "+
		"CASE WHEN sum(fzf_amount_ys) = 0 THEN 0 ELSE round(sum(fzf_amount_sj)/sum(fzf_amount_ys),2) END AS fzf_amount_rate,             "+
		"sum(sdwyf_amount_ys) sdwyf_amount_ys,                                                                                          "+
		"sum(sdwyf_amount_sj) sdwyf_amount_sj,                                                                                          "+
		"sum(sdwyf_amount_sy) sdwyf_amount_sy,                                                                                          "+
		"CASE WHEN sum(sdwyf_amount_ys) = 0 THEN 0 ELSE round(sum(sdwyf_amount_sj)/sum(sdwyf_amount_ys),2) END AS sdwyf_amount_rate,     "+
		"sum(other_amount_ys) other_amount_ys,                                                                                          "+
		"sum(other_amount_sj) other_amount_sj,                                                                                          "+
		"sum(other_amount_sy) other_amount_sy,                                                                                          "+
		"CASE WHEN sum(other_amount_ys) = 0 THEN 0 ELSE round(sum(other_amount_sj)/sum(other_amount_ys),2) END AS other_amount_rate from PMRT.TB_MRT_COST_UNIT_YSWCQK ";
	return s;
}
function getSql(field) {
	var s = "";
	for (var i = 0; i < field.length; i++) {
		if (s.length > 0) {
			s += ",";
		}
		s += field[i];
	}
	return s+" from PMRT.TB_MRT_COST_UNIT_YSWCQK";
}
/////////////////////////下载开始/////////////////////////////////////////////
function downsAll() {
	var code=$("#code").val();
	var orgLevel=$("#orgLevel").val();
	var startdate = $.trim($("#startdate").val());
	var enddate = $.trim($("#enddate").val());
	var where=" WHERE DEAL_DATE between '"+startdate+"' and '"+enddate+"'" ;
	var orderBy=" ORDER BY GROUP_ID_1,UNIT_ID";
	var preSql="select group_id_1_name,unit_name,"
	var sql=preSql+getSql(field);
	if (orgLevel == 1) {//省
		sql+=where+orderBy;
	} else if (orgLevel == 2) {//市
		where+=" and group_id_1='"+code+"'";
		sql+=where+orderBy;
	} else if (orgLevel == 3) {//营服中心
		where+=" and unit_id='"+code+"'";
		sql+=where;
	} else{
		where=" and 1=2";
		sql+=where;
	}
	var title=[["地市","营服中心","出账收入","","","","佣金","","","","渠道补贴","","","","广告费","","","","用户接入成本预算","","","","车辆使用费","","","","招待费","","","","办公费","","","","差旅费","","","","通信费","","","","房租费","","","","水电物业费","","","","其他","","",""],
	           ["","","总预算","总实际收入","尚可使用金额","总完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率","预算","实际发生","尚可使用金额","完成率"]];

	showtext = '预算完成展现报表-' + startdate+"-"+enddate;
	downloadExcel(sql,title,showtext);
}
