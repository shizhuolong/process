var title=[["组织架构","派发次数","巡店次数","完成率","派发店数","巡店数","社会实体数","完成率"]];
var field=["INSPEC_SUM","REG_SUM","SUM_RATIO","HQ_COUNT","REG_COUNT","CHN_SH_COUNTS","HQ_RATIO"];
var orderBy='';	
$(function(){
var report=new LchReport({
		title:title,
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			var where='';
			var code='';
			var orgLevel='';
			var dealDate = $("#dealDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var sql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				
				if(orgLevel==2){//点击省
					sql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=2";
				}else if(orgLevel==3){//点击市
					sql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=3";
					where+=" AND GROUP_ID_1='"+code+"' ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=1";
				}else if(orgLevel==2){//市
					sql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=2";
					where+=" AND GROUP_ID_1='"+code+"' ";
				}else if(orgLevel==3){//营服中心
					sql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=3";
					where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
						
			where+=" AND DEAL_DATE = '"+dealDate+"'";
			if(regionCode!=''){
				if(orgLevel==2){
					sql="SELECT GROUP_ID_1 ROW_ID,GROUP_ID_1_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=2";
					where+=" AND GROUP_ID_1 = '"+regionCode+"'";
					orgLevel=3;
				}
			}
			if(unitCode!=''){
				sql="SELECT UNIT_ID ROW_ID,UNIT_NAME ROW_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=3";
				where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
				orgLevel=4;
			}
			sql+=where;
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

function downsAll() {
	var dealDate = $("#dealDate").val();
	var regionCode=$("#regionCode").val();
	var unitCode=$("#unitCode").val();
	var where="";

	var sql="SELECT DEAL_DATE,GROUP_ID_1_NAME,UNIT_NAME,"+field.join(",")+ " FROM PMRT.TAB_MRT_HQINSPEC_TASK_MON WHERE GROUP_TYPE=3";
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where+=" AND UNIT_ID IN("+_unit_relation(code)+") ";
	} else{
		where += " AND 1=2";
	}
	where+=" AND DEAL_DATE='"+dealDate+"'" ;
	if(regionCode!=''){
		where+=" AND GROUP_ID_1 = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND UNIT_ID IN("+_unit_relation(unitCode)+") ";
	}

	sql+=where;
	showtext = '渠道巡检统计-' + dealDate;
	var title=[["账期","地市名称","营服名称","派发次数","巡店次数","完成率","派发店数","巡店数","社会实体数","完成率"]];
	downloadExcel(sql,title,showtext);
}
