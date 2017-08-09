var title=[["组织架构","派发次数","巡店次数","完成率","社会实体数","派发店数","巡店数","完成率"]];
var field=["INSPEC_SUM","REG_SUM","SUM_RATIO","CHN_SH_COUNTS","HQ_COUNT","REG_COUNT","HQ_RATIO"];
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
			var code='';
			var orgLevel='';
			var dealDate = $("#dealDate").val();
			var regionCode=$("#regionCode").val();
			var unitCode=$("#unitCode").val();
			var name=$.trim($("#name").val());
			var groupBy="";
			var where=" WHERE DEAL_DATE = '"+dealDate+"'";
			var sql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				
				if(orgLevel==2){//点击省
					sql="SELECT REGION_CODE ROW_ID,REGION_NAME ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
					groupBy=" GROUP BY REGION_CODE,REGION_NAME";
				}else if(orgLevel==3){//点击市
					sql="SELECT CODE ROW_ID,ORGNAME ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
					where+=" AND REGION_CODE='"+code+"' ";
					groupBy=" GROUP BY CODE,ORGNAME";
				}else if(orgLevel==4){//点击营服
					sql="SELECT REALNAME ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
					where+=" AND CODE='"+code+"' ";
					groupBy=" GROUP BY REALNAME";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					sql="SELECT '86000' ROW_ID,'云南省' ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
				}else if(orgLevel==2){//市
					sql="SELECT REGION_CODE ROW_ID,REGION_NAME ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
					groupBy=" GROUP BY REGION_CODE,REGION_NAME";
					where+=" AND REGION_CODE='"+code+"' ";
				}else if(orgLevel==3){//营服中心
					sql="SELECT CODE ROW_ID,ORGNAME ROW_NAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
					groupBy=" GROUP BY CODE,ORGNAME";
					where+=" AND CODE IN("+_unit_relation(code)+") ";
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}	
			
			if(regionCode!=''){
				where+=" AND REGION_CODE = '"+regionCode+"'";
			}
			if(unitCode!=''){
				where+=" AND CODE IN("+_unit_relation(unitCode)+") ";
			}
			if(name!=''){
				where+=" AND REALNAME LIKE '%"+name+"%'";
			}
			sql+=where+groupBy;
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
	var name=$.trim($("#name").val());
	var where=" WHERE DEAL_DATE = '"+dealDate+"'";
	var sql="SELECT DEAL_DATE,REGION_NAME,ORGNAME,REALNAME,"+getSumSql()+ " FROM PMRT.VIEW_MRT_INSPEC_TASK T";
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		
	} else if (orgLevel == 2) {//市
		where += " AND REGION_CODE='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where+=" AND CODE IN("+_unit_relation(code)+") ";
	} else{
		where += " AND 1=2";
	}
	if(regionCode!=''){
		where+=" AND REGION_CODE = '"+regionCode+"'";
	}
	if(unitCode!=''){
		where+=" AND CODE IN("+_unit_relation(unitCode)+") ";
	}
	if(name!=''){
		where+=" AND REALNAME LIKE '%"+name+"%'";
	}
	var groupBy=" GROUP BY DEAL_DATE,REGION_CODE,REGION_NAME,CODE,ORGNAME,REALNAME";
	sql+=where+groupBy;
	showtext = '渠道巡检统计-' + dealDate;
	var title=[["账期","地市名称","营服名称","姓名","派发次数","巡店次数","完成率","社会实体数","派发店数","巡店数","完成率"]];
	downloadExcel(sql,title,showtext);
}

function getSumSql(){
	return "SUM(NVL(T.INSPEC_SUM,0)) INSPEC_SUM                                                          "+
	"      ,SUM(NVL(T.REG_SUM,0)) REG_SUM                                                          "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.INSPEC_SUM,0))=0 THEN 0                      "+
	"                                  ELSE SUM(NVL(T.REG_SUM,0))*100/SUM(NVL(T.INSPEC_SUM,0)) END "+
	"                ,'FM99990.99')) ||'%' SUM_RATIO                                               "+
	"      ,SUM(NVL(T.CHN_COUNTS,0)) CHN_COUNTS                                                    "+
	"      ,SUM(NVL(T.HQ_COUNT,0)) HQ_COUNT                                                        "+
	"      ,SUM(NVL(T.REG_COUNT,0)) REG_COUNT                                                      "+
	"      ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(T.HQ_COUNT,0))=0 THEN 0                        "+
	"                                  ELSE SUM(NVL(T.REG_COUNT,0))*100/SUM(NVL(T.HQ_COUNT,0)) END "+
	"                ,'FM99990.99')) ||'%' HQ_RATIO                                                ";
}
