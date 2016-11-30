var report;
$(function(){
	var title=[["组织架构","渠道编码","经营模式","自有厅新增","","","自有厅20M以上","","","","","全网新增","","","全网20M以上","","","",""],
	           ["","","","当日发展","当月累计发展","较上月同期增减","(20M 50M)用户数","(20M 50M)占比","(50M 100M)用户数","(50M 100M)占比","20M及以上当月累计新增用户占比","当日发展","当月累计发展","较上月同期增减","(20M 50M)用户数","(20M 50M)占比","(50M 100M)用户数","(50M 100M)占比","20M及以上当月累计新增用户占比"]];
	var field=["ROW_NAME","HQ_CHAN_CODE","OPERATE_TYPE","ZY_DEV_NUM","ZY_DEV_NUM1","ZY_INCREASE_DEV","ZY_20_50_NUM1","ZY_20_50_ZB","ZY_50_100_NUM1","ZY_50_100_ZB","ZY_GREAT_20_ZB","QW_DEV_NUM","QW_DEV_NUM1","QW_INCREASE_DEV","QW_20_50_NUM1","QW_20_50_ZB","QW_50_100_NUM1","QW_50_100_ZB","QW_GREAT_20_ZB"];
	$("#searchBtn").click(function(){
		report.showSubRow();
		$("#lch_DataHead").find("TH").unbind();
		$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	});
	report=new LchReport({
		title:title,
		field:field,
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			
		},afterShowSubRows:function(){
			
		},
		getSubRowsCallBack:function($tr){
			var orgLevel='';
			var region =$("#region").val();
			var chanlCode = $("#chanlCode").val();
			var code=$("#code").val();
			var regionCode=$("#regionCode").val();
			var operateType=$("#operateType").val();
			var where = "WHERE 1=1";
			var level;
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				if(orgLevel==2){//省进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else if(orgLevel==3){//地市或营服进去点击市
					level=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}}
				}
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					level=0;
					where+=" AND GROUP_ID_0=86000";
				}else if(orgLevel==2||orgLevel==3){//市
					level=1;
					code=region;
					orgLevel=2;
					where+=" AND GROUP_ID_1='"+code+"'";
				}else{
					return {data:[],extra:{}};
				}
			}
			orgLevel++;
			
			var dealDate=$("#dealDate").val();
			where+=" AND DEAL_DATE='"+dealDate+"'";
			if(regionCode!=""){
				where+=" AND GROUP_ID_1='"+regionCode+"'";
			}
			if(operateType!=""){
				where+=" AND OPERATE_TYPE='"+operateType+"'";
			}
			if(chanlCode!=""){
				where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
			}
			var sql="";
			if(level<2){
				sql=getFristSql(where);
			}else{
				sql=getSecondSql(where);
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
});

function getFristSql(where){
	var s="select  NVL(GROUP_ID_1,'合计') ROW_ID                                                "+
	"        ,NVL(GROUP_ID_1_NAME,'合计') ROW_NAME                                        "+
	"        ,'-' HQ_CHAN_CODE                                                            "+
	"        ,'-' OPERATE_TYPE                                                            "+
	"        ,SUM(NVL(ZY_DEV_NUM,0)) ZY_DEV_NUM                                           "+
	"        ,SUM(NVL(ZY_DEV_NUM1,0)) ZY_DEV_NUM1                                         "+
	"        ,SUM(NVL(ZY_INCREASE_DEV,0)) ZY_INCREASE_DEV                                 "+
	"        ,SUM(NVL(ZY_20_50_NUM1,0)) ZY_20_50_NUM1                                     "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ZY_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(ZY_20_50_NUM1,0))/SUM(NVL(ZY_DEV_NUM1,0)) END         "+
	"                    ,'FM9999990.99')) ZY_20_50_ZB                                    "+
	"        ,SUM(NVL(ZY_50_100_NUM1,0))ZY_50_100_NUM1                                    "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ZY_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(ZY_50_100_NUM1,0))/SUM(NVL(ZY_DEV_NUM1,0)) END        "+
	"                    ,'FM9999990.99')) ZY_50_100_ZB                                   "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(ZY_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(ZY_GREAT_20,0))/SUM(NVL(ZY_DEV_NUM1,0)) END           "+
	"                    ,'FM9999990.99')) ZY_GREAT_20_ZB                                 "+
	"        ,SUM(NVL(QW_DEV_NUM,0)) QW_DEV_NUM                                           "+
	"        ,SUM(NVL(QW_DEV_NUM1,0)) QW_DEV_NUM1                                         "+
	"        ,SUM(NVL(QW_INCREASE_DEV,0)) QW_INCREASE_DEV                                 "+
	"        ,SUM(NVL(QW_20_50_NUM1,0)) QW_20_50_NUM1                                     "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(QW_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(QW_20_50_NUM1,0))/SUM(NVL(QW_DEV_NUM1,0)) END         "+
	"                    ,'FM9999990.99')) QW_20_50_ZB                                    "+
	"        ,SUM(NVL(QW_50_100_NUM1,0)) QW_50_100_NUM1                                   "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(QW_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(QW_50_100_NUM1,0))/SUM(NVL(QW_DEV_NUM1,0)) END        "+
	"                    ,'FM9999990.99')) QW_50_100_ZB                                   "+
	"        ,TRIM('.' FROM TO_CHAR(CASE WHEN SUM(NVL(QW_DEV_NUM1,0))=0 THEN 0            "+
	"                  ELSE SUM(NVL(QW_GREAT_20,0))/SUM(NVL(QW_DEV_NUM1,0)) END           "+
	"                    ,'FM9999990.99')) QW_GREAT_20_ZB                                 "+
	"from PMRT.TB_MRT_BUS_BROAD_DEV_DAY                                                   "+
	                                  where                                                +
	"GROUP BY GROUPING SETS (GROUP_ID_0,(GROUP_ID_0,GROUP_ID_1,GROUP_ID_1_NAME))  ";
	return s;
}

function getSecondSql(where) {
	return "select HQ_CHAN_NAME ROW_NAME  "+
	"        ,HQ_CHAN_CODE             "+
	"        ,OPERATE_TYPE             "+
	"        ,ZY_DEV_NUM               "+
	"        ,ZY_DEV_NUM1              "+
	"        ,ZY_INCREASE_DEV          "+
	"        ,ZY_20_50_NUM1            "+
	"        ,ZY_20_50_ZB              "+
	"        ,ZY_50_100_NUM1           "+
	"        ,ZY_50_100_ZB             "+
	"        ,ZY_GREAT_20_ZB           "+
	"        ,'-' QW_DEV_NUM           "+
	"        ,'-' QW_DEV_NUM1          "+
	"        ,'-' QW_INCREASE_DEV      "+
	"        ,'-'QW_20_50_NUM1         "+
	"        ,'-' QW_20_50_ZB          "+
	"        ,'-' QW_50_100_NUM1       "+
	"        ,'-' QW_50_100_ZB         "+
	"        ,'-' QW_GREAT_20_ZB       "+
	"from PMRT.TB_MRT_BUS_BROAD_DEV_DAY "+
	where;
}

function getDownSql(where) {
	return "select  DEAL_DATE               "+
	"        ,GROUP_ID_1_NAME               "+
	"        ,HQ_CHAN_NAME                  "+
	"        ,HQ_CHAN_CODE                  "+
	"        ,OPERATE_TYPE                  "+
	"        ,ZY_DEV_NUM                    "+
	"        ,ZY_DEV_NUM1                   "+
	"        ,ZY_INCREASE_DEV               "+
	"        ,ZY_20_50_NUM1                 "+
	"        ,ZY_20_50_ZB                   "+
	"        ,ZY_50_100_NUM1                "+
	"        ,ZY_50_100_ZB                  "+
	"        ,ZY_GREAT_20_ZB                "+
	"from PMRT.TB_MRT_BUS_BROAD_DEV_DAY     "+
	where;
}

function downsAll() {
	//先根据用户信息得到前几个字段
	var orgLevel=$("#orgLevel").val();
	var dealDate=$("#dealDate").val();
	var region =$("#region").val();
	var chanlCode = $("#chanlCode").val();
	var regionCode=$("#regionCode").val();
	var operateType=$("#operateType").val();
	var where ="WHERE 1=1";
	where+=" AND DEAL_DATE='"+dealDate+"'";
	if (orgLevel == 1) {//省
		
	} else {//市或者其他层级
		where += " AND GROUP_ID_1='"+region+"' ";
	} 
	if(regionCode!=""){
		where+=" AND GROUP_ID_1='"+regionCode+"'";
	}
	if(operateType!=""){
		where+=" AND OPERATE_TYPE='"+operateType+"'";
	}
	if(chanlCode!=""){
		where += " AND HQ_CHAN_CODE ='"+chanlCode+"' ";
	}
	var sql = getDownSql(where);
	var showtext = '宽带20M以上新增占比(日)' + dealDate;
	var title=[["账期","组织架构","","渠道编码","经营模式","自有厅新增","","","自有厅20M以上","","","",""],
	           ["","地市","营业厅","","","当日发展","当月累计发展","较上月同期增减","(20M 50M)用户数","(20M 50M)占比","(50M 100M)用户数","(50M 100M)占比","20M及以上当月累计新增用户占比"]];
	downloadExcel(sql,title,showtext);
}
